"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run on the client side
    if (!isClient) return
    
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query, isClient])

  return matches
}

