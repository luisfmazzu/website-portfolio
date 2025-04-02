"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SectionObserverProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  animation?:
    | "fade-in"
    | "fade-up"
    | "fade-down"
    | "scale-in"
    | "slide-in-left"
    | "slide-in-right"
    | "rotate-in"
    | "flip-in"
    | "bounce-in"
    | "blur-in"
  delay?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000
  once?: boolean
  staggerChildren?: boolean
}

export default function SectionObserver({
  children,
  className,
  threshold = 0.1,
  rootMargin = "0px",
  animation = "fade-in",
  delay,
  once = true,
  staggerChildren = false,
}: SectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(`animate-${animation}`)
            if (delay) {
              entry.target.classList.add(`animation-delay-${delay}`)
            }
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            entry.target.classList.remove(`animate-${animation}`)
            if (delay) {
              entry.target.classList.remove(`animation-delay-${delay}`)
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    const currentRef = ref.current

    if (currentRef) {
      observer.observe(currentRef)

      // If staggerChildren is true, apply the animation to all direct children
      if (staggerChildren && currentRef.children.length > 0) {
        currentRef.classList.add("stagger-animation")
        Array.from(currentRef.children).forEach((child) => {
          child.classList.add(`animate-${animation}`)
        })
      }
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [animation, delay, once, rootMargin, threshold, staggerChildren])

  return (
    <div ref={ref} className={cn("opacity-0", className)}>
      {children}
    </div>
  )
}

