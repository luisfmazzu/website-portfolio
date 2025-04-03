"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import GhostIcon from './pacman-ghost-icon'

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
          })
          .catch(e => {
            // Still not allowed, we'll try again later
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
            })
            .catch(e => {});
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
    }
  }, [audioAllowed]);
  
  // Create a new ghost (separated from addGhost for reuse)
  const createGhost = useCallback((currentGhosts: GhostData[] = []) => {
    const usedColors = currentGhosts.map(g => g.color);
    
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
  }, [windowSize.height, windowSize.width]);
  
  // Add a new ghost
  const addGhost = useCallback(() => {
    // Only add if we're under the maximum
    setGhosts(currentGhosts => {
      if (currentGhosts.length >= MAX_GHOSTS) {
        return currentGhosts;
      }
      return [...currentGhosts, createGhost(currentGhosts)];
    });
  }, [createGhost]);
  
  // Helper to ensure we always have MAX_GHOSTS ghosts
  const ensureMaxGhosts = useCallback(() => {
    setGhosts(currentGhosts => {
      // If we have enough ghosts, do nothing
      if (currentGhosts.length >= MAX_GHOSTS) {
        return currentGhosts;
      }
      
      // Add missing ghosts
      const missingCount = MAX_GHOSTS - currentGhosts.length;
      const newGhosts: GhostData[] = [];
      
      for (let i = 0; i < missingCount; i++) {
        newGhosts.push(createGhost([...currentGhosts, ...newGhosts]));
      }
      
      return [...currentGhosts, ...newGhosts];
    });
  }, [createGhost]);
  
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
    
    // Add initial ghosts - ensure we start with MAX_GHOSTS
    ensureMaxGhosts();
    
    // Setup ghost spawning interval - check regularly if we need more ghosts
    const spawnInterval = setInterval(() => {
      ensureMaxGhosts();
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
  }, [isEnabled, ensureMaxGhosts]);
  
  // Track ghost positions
  useEffect(() => {
    if (!isMounted || !isEnabled) return;
    
    // Separate interval for checking if we need more ghosts
    const checkGhostCountInterval = setInterval(() => {
      // Always ensure we have MAX_GHOSTS ghosts
      ensureMaxGhosts();
    }, 1000);

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
          
          // Check if ghost is off screen and should be replaced
          const isOffScreen = 
            rect.right < -100 || 
            rect.bottom < -100 || 
            rect.left > windowSize.width + 100 || 
            rect.top > windowSize.height + 100;
          
          if (isOffScreen && !ghost.isEaten) {
            // Mark ghost for removal and replacement
            ghost.isEaten = true; // Mark as removed
            
            // Remove ghost and add a new one
            setTimeout(() => {
              setGhosts(prev => {
                // Remove the off-screen ghost
                const newGhosts = prev.filter(g => g.id !== ghost.id);
                
                // Add a new ghost to replace it
                const newGhost = createGhost(newGhosts);
                return [...newGhosts, newGhost];
              });
            }, 100);
            
            hasChanges = true;
            continue; // Skip collision check for this ghost
          }
          
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
                setGhosts(prev => {
                  // Just remove the eaten ghost and let the interval handle adding new ones
                  return prev.filter(g => g.id !== ghost.id);
                });
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
      clearInterval(checkGhostCountInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMounted, isEnabled, pacmanPosition, ghosts, playEatSound, createGhost, windowSize, ensureMaxGhosts]);
  
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
            <GhostIcon 
              color={ghost.color}
              size={GHOST_SIZE}
              isEaten={ghost.isEaten}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
} 