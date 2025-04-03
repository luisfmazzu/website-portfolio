"use client"

import { useState } from 'react'

interface PacmanToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function PacmanToggle({ isEnabled, onToggle }: PacmanToggleProps) {
  return (
    <button
      onClick={() => onToggle(!isEnabled)}
      className="fixed bottom-6 left-6 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-cool-600 to-indigo-600 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:from-cool-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-cool-500 focus:ring-opacity-50"
    >
      <span className="w-3 h-3 rounded-full bg-white opacity-80"></span>
      {isEnabled ? 'Disable Pacman' : 'Enable Pacman'}
    </button>
  )
} 