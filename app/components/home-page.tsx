"use client"

import { useState } from "react"
import ClientPage from "@/app/ClientPage"
import PacmanCursor from "@/app/components/pacman-cursor"
import PacmanGhosts from "@/app/components/pacman-ghost"
import PacmanToggle from "@/app/components/pacman-toggle"

export default function HomePage() {
  const [isPacmanEnabled, setIsPacmanEnabled] = useState(false);
  const [pacmanPosition, setPacmanPosition] = useState({ x: 0, y: 0 });

  return (
    <main>
      <ClientPage />
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
    </main>
  )
} 