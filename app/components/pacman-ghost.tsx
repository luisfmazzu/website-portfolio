"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

interface Position {
  x: number;
  y: number;
}

interface GhostData {
  id: number;
  position: Position;
  direction: { x: number; y: number };
  color: string;
  speed: number;
  currentPosition: Position; // Track actual current position
  isEaten: boolean; // Track if ghost is being eaten
}

// Ghost colors with unique names
const GHOST_COLORS = [
  { color: '#FF0000', name: 'blinky' }, // Red
  { color: '#00FFDE', name: 'inky' },   // Cyan
  { color: '#FFB8FF', name: 'pinky' },  // Pink
  { color: '#FFB852', name: 'clyde' }   // Orange
];

// Ghost size in pixels
const GHOST_SIZE = 26;

// Maximum number of ghosts
const MAX_GHOSTS = 3;

// Collision distance threshold
const COLLISION_THRESHOLD = GHOST_SIZE * 0.95;

// Sound setup
let audioContext: AudioContext | null = null;

interface PacmanGhostsProps {
  pacmanPosition: Position | null;
  isEnabled: boolean;
}

export default function PacmanGhosts({ pacmanPosition, isEnabled }: PacmanGhostsProps) {
  const [ghosts, setGhosts] = useState<GhostData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });
  const [audioAllowed, setAudioAllowed] = useState(false);
  
  // Refs for animation and timers
  const animationRef = useRef<number | null>(null);
  const ghostIdCounter = useRef(0);
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const ghostElements = useRef<{[key: number]: HTMLDivElement | null}>({});
  const spawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioInitializedRef = useRef(false);
  
  // Initialize sound system with user interaction awareness
  useEffect(() => {
    // Create a silent audio element for initialization
    if (!soundRef.current) {
      const audio = new Audio('/sounds/pacman-eat.mp3');
      audio.volume = 0;
      soundRef.current = audio;
    }
    
    // Function to initialize audio context after user interaction
    const initAudio = () => {
      if (audioInitializedRef.current) return;
      
      // Try to play a silent sound to unlock audio
      if (!soundRef.current) return;
      
      const silentPlay = soundRef.current.play();
      
      if (silentPlay !== undefined) {
        silentPlay
          .then(() => {
            // Audio is now allowed
            setAudioAllowed(true);
            audioInitializedRef.current = true;
            if (soundRef.current) {
              soundRef.current.pause();
              soundRef.current.currentTime = 0;
              soundRef.current.volume = 0.5;
            }
            console.log("Audio successfully initialized");
          })
          .catch(e => {
            // Still not allowed, we'll try again later
            console.log("Audio not yet allowed:", e);
          });
      }
    };
    
    // Try to initialize immediately (may work if returning from another page)
    initAudio();
    
    // Add multiple event listeners to catch any user interaction
    const events = ['click', 'keydown', 'touchstart', 'pointerdown'];
    events.forEach(event => document.addEventListener(event, initAudio, { once: false }));
    
    // Also try to initialize when the component is enabled
    if (isEnabled) {
      initAudio();
    }
    
    return () => {
      // Clean up all event listeners
      events.forEach(event => document.removeEventListener(event, initAudio));
    };
  }, [isEnabled]);
  
  // Reset audio when component is enabled/disabled
  useEffect(() => {
    if (isEnabled) {
      // Try to reinitialize audio when component is enabled
      if (!audioInitializedRef.current && soundRef.current) {
        const silentPlay = soundRef.current.play();
        if (silentPlay !== undefined) {
          silentPlay
            .then(() => {
              setAudioAllowed(true);
              audioInitializedRef.current = true;
              if (soundRef.current) {
                soundRef.current.pause();
                soundRef.current.currentTime = 0;
                soundRef.current.volume = 0.5;
              }
              console.log("Audio reinitialized on enable");
            })
            .catch(e => console.log("Audio reinit failed:", e));
        }
      }
    }
  }, [isEnabled]);
  
  // Play eat sound with error handling
  const playEatSound = useCallback(() => {
    // If audio isn't initialized, try to initialize it again
    if (!audioInitializedRef.current && soundRef.current) {
      try {
        soundRef.current.play()
          .then(() => {
            audioInitializedRef.current = true;
            setAudioAllowed(true);
          })
          .catch(() => {});
      } catch (e) {}
    }
    
    if (!audioInitializedRef.current && !audioAllowed) {
      console.log("Can't play sound - audio not initialized");
      return;
    }
    
    try {
      // Create a new audio element each time to avoid overlapping issues
      const sound = new Audio('/sounds/pacman-eat.mp3');
      sound.volume = 0.5;
      
      // Preload the sound
      sound.load();
      
      // Play the sound and handle any errors silently
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Sound play error (handled):", e);
          
          // Try to re-enable audio on this attempt
          if (!audioInitializedRef.current && soundRef.current) {
            soundRef.current.play()
              .then(() => {
                audioInitializedRef.current = true;
                setAudioAllowed(true);
              })
              .catch(() => {});
          }
        });
      }
    } catch (e) {
      console.log("Sound error:", e);
    }
  }, [audioAllowed]);
  
  // Setup window size and ghost spawning
  useEffect(() => {
    if (!isEnabled) return;
    
    // Get actual window dimensions
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    setIsMounted(true);
    
    // Clear any existing ghosts when toggling
    setGhosts([]);
    
    // Add initial ghost
    addGhost();
    
    // Setup ghost spawning interval
    const spawnInterval = setInterval(() => {
      if (ghosts.length < MAX_GHOSTS) {
        addGhost();
      }
    }, 3000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(spawnInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
      }
      // Clear ghosts when disabling
      setGhosts([]);
    };
  }, [isEnabled]);
  
  // Track ghost positions
  useEffect(() => {
    if (!isMounted || !isEnabled) return;
    
    const updateGhostPositions = () => {
      // Update current positions from DOM
      const updatedGhosts = [...ghosts];
      let hasChanges = false;
      
      // Update ghost positions based on their DOM elements
      for (let i = 0; i < updatedGhosts.length; i++) {
        const ghost = updatedGhosts[i];
        const element = ghostElements.current[ghost.id];
        
        if (element) {
          const rect = element.getBoundingClientRect();
          ghost.currentPosition = {
            x: rect.left + GHOST_SIZE / 2,
            y: rect.top + GHOST_SIZE / 2
          };
          
          // Check for collision with Pacman
          if (pacmanPosition && !ghost.isEaten) {
            const dx = ghost.currentPosition.x - pacmanPosition.x;
            const dy = ghost.currentPosition.y - pacmanPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < COLLISION_THRESHOLD) {
              ghost.isEaten = true;
              playEatSound();
              
              // Remove ghost after a short delay to allow animation
              setTimeout(() => {
                setGhosts(prev => prev.filter(g => g.id !== ghost.id));
                
                // Add a new ghost after a delay
                if (spawnTimeoutRef.current) {
                  clearTimeout(spawnTimeoutRef.current);
                }
                spawnTimeoutRef.current = setTimeout(() => {
                  // Check ghost count again before adding
                  setGhosts(current => {
                    if (current.length < MAX_GHOSTS) {
                      const newGhost = createGhost();
                      return [...current, newGhost];
                    }
                    return current;
                  });
                }, 1000);
              }, 300);
              
              hasChanges = true;
            }
          }
        }
      }
      
      if (hasChanges) {
        setGhosts(updatedGhosts);
      }
      
      animationRef.current = requestAnimationFrame(updateGhostPositions);
    };
    
    animationRef.current = requestAnimationFrame(updateGhostPositions);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMounted, isEnabled, pacmanPosition, ghosts, playEatSound]);
  
  // Create a new ghost (separated from addGhost for reuse)
  const createGhost = useCallback(() => {
    const usedColors = ghosts.map(g => g.color);
    
    // Get random color not already in use
    const availableColors = GHOST_COLORS.filter(c => !usedColors.includes(c.color));
    const colorData = availableColors.length > 0 
      ? availableColors[Math.floor(Math.random() * availableColors.length)] 
      : GHOST_COLORS[Math.floor(Math.random() * GHOST_COLORS.length)];
    
    // Random starting edge position
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let position: Position;
    let direction = { x: 0, y: 0 };
    
    switch (side) {
      case 0: // top
        position = { 
          x: Math.random() * windowSize.width, 
          y: -GHOST_SIZE
        };
        direction = { x: 0, y: 1 }; // down
        break;
      case 1: // right
        position = {
          x: windowSize.width + GHOST_SIZE,
          y: Math.random() * windowSize.height
        };
        direction = { x: -1, y: 0 }; // left
        break;
      case 2: // bottom
        position = {
          x: Math.random() * windowSize.width,
          y: windowSize.height + GHOST_SIZE
        };
        direction = { x: 0, y: -1 }; // up
        break;
      default: // left
        position = {
          x: -GHOST_SIZE,
          y: Math.random() * windowSize.height
        };
        direction = { x: 1, y: 0 }; // right
    }
    
    // Create new ghost
    return {
      id: ghostIdCounter.current++,
      position,
      direction,
      color: colorData.color,
      speed: 0.3 + Math.random() * 1.2, // Speed between 0.3-1.5
      currentPosition: position, // Initialize current position
      isEaten: false
    };
  }, [ghosts, windowSize.height, windowSize.width]);
  
  // Add a new ghost
  const addGhost = useCallback(() => {
    // Only add if we're under the maximum
    setGhosts(currentGhosts => {
      if (currentGhosts.length >= MAX_GHOSTS) {
        return currentGhosts;
      }
      return [...currentGhosts, createGhost()];
    });
  }, [createGhost]);
  
  if (!isMounted || !isEnabled) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {ghosts.map(ghost => (
        <motion.div
          key={ghost.id}
          className="ghost absolute"
          ref={(el: HTMLDivElement | null) => {
            ghostElements.current[ghost.id] = el;
          }}
          initial={{ 
            x: ghost.position.x, 
            y: ghost.position.y,
            opacity: 1,
            scale: 1
          }}
          animate={{ 
            x: [ghost.position.x, ghost.position.x + ghost.direction.x * windowSize.width * 1.5],
            y: [ghost.position.y, ghost.position.y + ghost.direction.y * windowSize.height * 1.5],
            opacity: ghost.isEaten ? [1, 0] : 1,
            scale: ghost.isEaten ? [1, 1.5, 0] : 1
          }}
          transition={{
            x: { 
              duration: 15 / ghost.speed, 
              ease: "linear" 
            },
            y: { 
              duration: 15 / ghost.speed, 
              ease: "linear" 
            },
            opacity: {
              duration: 0.3,
              ease: "easeOut"
            },
            scale: {
              duration: 0.3,
              ease: "easeOut"
            }
          }}
          style={{
            width: GHOST_SIZE,
            height: GHOST_SIZE,
            zIndex: 1000,
          }}
        >
          <motion.div
            animate={{ y: ghost.isEaten ? 0 : [0, -5, 0] }}
            transition={{
              repeat: ghost.isEaten ? 0 : Infinity,
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <svg
              width={GHOST_SIZE}
              height={GHOST_SIZE}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 20C2 9.507 10.507 1 21 1C31.493 1 40 9.507 40 20V34.5C40 36.9853 37.9853 39 35.5 39H35C32.5147 39 30.5 36.9853 30.5 34.5V34.4C30.5 31.9147 28.4853 29.9 26 29.9H26C23.5147 29.9 21.5 31.9147 21.5 34.4V34.5C21.5 36.9853 19.4853 39 17 39H16.5C14.0147 39 12 36.9853 12 34.5V34.4C12 31.9147 9.98528 29.9 7.5 29.9H7C4.51472 29.9 2.5 31.9147 2.5 34.4V34.5C2.5 36.9853 0.485281 39 -2 39H-2.5C-4.98528 39 -7 36.9853 -7 34.5V20H2Z"
                fill={ghost.color}
              />
              <circle cx="13" cy="15" r="4" fill="white" />
              <circle cx="13" cy="15" r="2" fill="black" />
              <circle cx="29" cy="15" r="4" fill="white" />
              <circle cx="29" cy="15" r="2" fill="black" />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
} 