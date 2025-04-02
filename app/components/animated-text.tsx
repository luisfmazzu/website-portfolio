"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  animation?: "typewriter" | "word-by-word" | "character-by-character" | "gradient-reveal"
  delay?: number
  speed?: number
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  once?: boolean
}

export default function AnimatedText({
  text,
  className,
  animation = "typewriter",
  delay = 0,
  speed = 50,
  tag: Tag = "div",
  once = true,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const words = text.split(" ")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(entries[0].target)
          }
        } else if (!once) {
          setIsVisible(false)
          setDisplayText("")
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [once])

  useEffect(() => {
    if (!isVisible) return

    let timeout: NodeJS.Timeout

    if (animation === "typewriter") {
      setDisplayText("")
      let i = 0
      const typeText = () => {
        if (i < text.length) {
          setDisplayText((prev) => prev + text.charAt(i))
          i++
          timeout = setTimeout(typeText, speed)
        }
      }
      timeout = setTimeout(typeText, delay)
    } else if (animation === "word-by-word") {
      setDisplayText("")
      let i = 0
      const revealWord = () => {
        if (i < words.length) {
          setDisplayText((prev) => (prev ? prev + " " + words[i] : words[i]))
          i++
          timeout = setTimeout(revealWord, speed * 5)
        }
      }
      timeout = setTimeout(revealWord, delay)
    } else if (animation === "character-by-character") {
      setDisplayText("")
      let i = 0
      const revealChar = () => {
        if (i < text.length) {
          setDisplayText((prev) => prev + text.charAt(i))
          i++
          timeout = setTimeout(revealChar, speed)
        }
      }
      timeout = setTimeout(revealChar, delay)
    } else if (animation === "gradient-reveal") {
      setDisplayText(text)
    }

    return () => clearTimeout(timeout)
  }, [animation, delay, isVisible, speed, text, words])

  if (animation === "gradient-reveal") {
    return (
      <div ref={ref} className={cn("overflow-hidden", className)}>
        <Tag
          className={cn(
            "animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-cool-600 via-indigo-500 to-teal-500",
            isVisible ? "opacity-100" : "opacity-0",
            `transition-opacity duration-1000 delay-[${delay}ms]`,
          )}
          style={{ transitionDelay: `${delay}ms` }}
        >
          {text}
        </Tag>
      </div>
    )
  }

  if (animation === "word-by-word") {
    return (
      <div ref={ref} className={cn("", className)}>
        <Tag>
          {isVisible
            ? displayText.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="inline-block opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${delay + i * speed * 5}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {word}{" "}
                </span>
              ))
            : text.split(" ").map((word, i) => (
                <span key={i} className="inline-block opacity-0">
                  {word}{" "}
                </span>
              ))}
        </Tag>
      </div>
    )
  }

  if (animation === "character-by-character") {
    return (
      <div ref={ref} className={cn("", className)}>
        <Tag>
          {isVisible
            ? text.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${delay + i * speed}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {char}
                </span>
              ))
            : text.split("").map((char, i) => (
                <span key={i} className="inline-block opacity-0">
                  {char}
                </span>
              ))}
        </Tag>
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("", className)}>
      <Tag className={cn(isVisible ? "animate-typewriter" : "opacity-0", "whitespace-nowrap overflow-hidden")}>
        {displayText}
      </Tag>
    </div>
  )
}

