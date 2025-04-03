"use client"

import { useState, useEffect } from "react"
import ClientPage from "@/app/ClientPage"
import PacmanCursor from "@/app/components/pacman-cursor"
import PacmanGhosts from "@/app/components/pacman-ghost"
import PacmanToggle from "@/app/components/pacman-toggle"
import { Info } from "lucide-react"

export default function HomePage() {
  const [isPacmanEnabled, setIsPacmanEnabled] = useState(false);
  const [pacmanPosition, setPacmanPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNote, setShowMobileNote] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Consider devices with width < 768px as mobile
    };

    // Set initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <main>
      <ClientPage />
      
      {/* Mobile information button */}
      {isMobile && (
        <button 
          onClick={() => setShowMobileNote(prev => !prev)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-cool-600/90 text-white hover:bg-cool-500 shadow-lg backdrop-blur-sm"
          aria-label="Show information about desktop features"
        >
          <Info size={20} />
        </button>
      )}
      
      {/* Mobile notification about desktop-only features */}
      {isMobile && showMobileNote && (
        <div className="fixed top-16 right-4 left-4 bg-cool-800/90 text-white p-3 rounded-lg shadow-lg z-50 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-5">
          <div className="flex justify-between items-center">
            <p>Some interactive features like Pacman and the contribution graph are only available on desktop devices.</p>
            <button 
              onClick={() => setShowMobileNote(false)}
              className="ml-2 p-1 rounded-full hover:bg-cool-700/50"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Only show Pacman features on non-mobile devices */}
      {!isMobile && (
        <>
          <PacmanToggle 
            isEnabled={isPacmanEnabled} 
            onToggle={setIsPacmanEnabled} 
          />
          <PacmanCursor 
            isEnabled={isPacmanEnabled} 
            onPositionChange={setPacmanPosition} 
          />
          <PacmanGhosts 
            isEnabled={isPacmanEnabled}
            pacmanPosition={pacmanPosition}
          />
        </>
      )}
    </main>
  )
} 