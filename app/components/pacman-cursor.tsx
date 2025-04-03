"use client"

import { useEffect, useState, useRef } from 'react'

interface Position {
  x: number;
  y: number;
}

interface PacmanCursorProps {
  isEnabled: boolean;
  onPositionChange: (position: Position) => void;
}

export default function PacmanCursor({ isEnabled, onPositionChange }: PacmanCursorProps) {
  // Use refs for position to avoid state update issues
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const targetPositionRef = useRef<Position>({ x: 0, y: 0 });
  const velocityRef = useRef<Position>({ x: 0, y: 0 });
  
  // State for react rendering
  const [renderPosition, setRenderPosition] = useState<Position>({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Animation references
  const animFrameRef = useRef<number | null>(null);
  const mouthTimerId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Pacman settings
  const MAX_SPEED = 3.3;
  const ACCELERATION = 0.1;
  const DECELERATION = 0.2;
  const STOP_THRESHOLD = 0.2;
  const STOP_DISTANCE = 30;
  const ARRIVAL_THRESHOLD = 20;
  
  // Mouth animation effect - separate from movement
  useEffect(() => {
    if (!isEnabled) return;
    
    // Ensure mouth animation runs regardless of movement
    const mouthAnimationInterval = 200; // ms between mouth open/close
    mouthTimerId.current = window.setInterval(() => {
      setMouthOpen(prev => !prev);
    }, mouthAnimationInterval);
    
    return () => {
      if (mouthTimerId.current) {
        clearInterval(mouthTimerId.current);
        mouthTimerId.current = null;
      }
    };
  }, [isEnabled]);
  
  // Initialize
  useEffect(() => {
    if (!isEnabled) return;
    
    // Find the toggle button position for initial Pacman placement
    const findTogglePosition = () => {
      const toggleButton = document.querySelector('button');
      if (toggleButton) {
        const rect = toggleButton.getBoundingClientRect();
        // Position Pacman at the top center of the button
        return { 
          x: rect.left + rect.width / 2, 
          y: rect.top - 20  // 20px above the top of the button
        };
      }
      // Fallback to bottom left if button not found
      return { x: 80, y: window.innerHeight - 80 };
    };
    
    // Set initial positions at the top of the button
    const initialPos = findTogglePosition();
    positionRef.current = initialPos;
    targetPositionRef.current = initialPos;
    velocityRef.current = { x: 0, y: 0 };
    setRenderPosition(initialPos);
    
    // Track mouse movements for target position
    const handleMouseMove = (e: MouseEvent) => {
      // Check if the mouse is over or near Pacman
      const pacmanRadius = 50; // More reasonable dead zone
      const currentPos = positionRef.current;
      const cursorPos = { x: e.clientX, y: e.clientY };
      
      // Calculate distance between cursor and Pacman
      const dx = cursorPos.x - currentPos.x;
      const dy = cursorPos.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only update target if cursor is far enough from Pacman
      if (distance > pacmanRadius) {
        targetPositionRef.current = cursorPos;
      }
    };
    
    // Animation loop for smooth movement
    const updatePosition = (timestamp: number) => {
      // Calculate delta time to maintain consistent speed regardless of frame rate
      const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 16.67 : 1; // Normalized to 60fps
      lastTimeRef.current = timestamp;
      
      // Get current positions from refs
      const position = positionRef.current;
      const targetPosition = targetPositionRef.current;
      const velocity = velocityRef.current;
      
      // Calculate direction and distance to target
      const dx = targetPosition.x - position.x;
      const dy = targetPosition.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Stop early if we're already close enough
      if (distance < ARRIVAL_THRESHOLD) {
        // Just maintain position and skip movement calculations
        velocity.x = 0;
        velocity.y = 0;
        
        // Continue animation frame loop without moving
        animFrameRef.current = requestAnimationFrame(updatePosition);
        return;
      }
      
      // Apply acceleration towards target
      if (distance > STOP_DISTANCE) {
        // Calculate desired direction
        const directionX = dx / distance;
        const directionY = dy / distance;
        
        // Gradually adjust velocity toward target direction
        velocity.x += directionX * ACCELERATION * deltaTime;
        velocity.y += directionY * ACCELERATION * deltaTime;
        
        // Apply speed limit
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed > MAX_SPEED) {
          const scale = MAX_SPEED / speed;
          velocity.x *= scale;
          velocity.y *= scale;
        }
      } else {
        // Apply gradual deceleration when near target
        velocity.x *= 1 - (DECELERATION * deltaTime);
        velocity.y *= 1 - (DECELERATION * deltaTime);
        
        // Stop completely if velocity is very small
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed < STOP_THRESHOLD) {
          velocity.x = 0;
          velocity.y = 0;
        }
      }
      
      // Move Pacman based on current velocity
      const newPosition = {
        x: position.x + velocity.x * deltaTime,
        y: position.y + velocity.y * deltaTime
      };
      
      // Update the refs directly
      positionRef.current = newPosition;
      velocityRef.current = velocity;
      
      // Update render state
      setRenderPosition(newPosition);
      
      // Calculate movement angle based on velocity with smoother rotation
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      if (speed > 0.5) {
        // Calculate target angle based on movement
        const targetAngle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) + 90;
        // Angle change
        setAngle(targetAngle);
      }
      
      // Notify parent of position change
      onPositionChange(newPosition);
      
      animFrameRef.current = requestAnimationFrame(updatePosition);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    setIsMounted(true);
    animFrameRef.current = requestAnimationFrame(updatePosition);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setIsMounted(false);
    };
  }, [isEnabled, onPositionChange]);

  if (!isMounted || !isEnabled) return null;
  
  // Calculate mouth angle based on open/closed state
  const mouthAngle = mouthOpen ? 60 : 10; // Degrees
  
  // Create pacman arc path for proper Pac-Man shape
  const startAngle = mouthAngle / 2; // Upper mouth edge angle
  const endAngle = 360 - startAngle; // Lower mouth edge angle
  
  // Convert to radians for math functions
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  // Calculate points on the circle for the arc
  const radius = 40; // SVG circle radius
  const center = 50; // Center point in the SVG viewBox
  
  // Start and end points of the arc
  const startX = center + radius * Math.cos(startAngleRad);
  const startY = center + radius * Math.sin(startAngleRad);
  const endX = center + radius * Math.cos(endAngleRad);
  const endY = center + radius * Math.sin(endAngleRad);
  
  // Construct the SVG path for pacman
  // Move to center, line to start point, arc to end point, close path
  const pacmanPath = `
    M ${center},${center}
    L ${startX},${startY}
    A ${radius},${radius} 0 1,1 ${endX},${endY}
    Z
  `;
  
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${renderPosition.x}px`,
        top: `${renderPosition.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          transform: `rotate(${angle}deg)`,
          filter: "drop-shadow(0 0 8px rgba(255, 255, 0, 0.3))",
        }}
      >
        <svg 
          width="30" 
          height="30" 
          viewBox="0 0 100 100"
        >
          {/* Pacman body */}
          <path
            d={pacmanPath}
            fill="#FFDD00"
            transform="rotate(-90, 50, 50)"
          />
          
          {/* Pacman eye */}
          <circle 
            cx="50" 
            cy="30" 
            r="5" 
            fill="#000000" 
            transform="rotate(-90, 50, 50)"
          />
        </svg>
      </div>
    </div>
  );
} 