"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { Button } from "@/app/components/button"
import TechAnimation from "@/app/components/tech-animation"
import SectionDivider from "@/app/components/section-divider"
import { useTranslation } from "@/hooks/use-translation"
import { motion, useAnimation, AnimationControls } from "framer-motion"
import { useEffect, useState, useRef } from "react"

export default function Hero() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  
  // Animation controls for the different wind layers
  const mainWindControls = useAnimation()
  const fastWindControls = useAnimation()
  const slowWindControls = useAnimation()
  
  // Reference to track if component is mounted
  const isMounted = useRef(false)

  useEffect(() => {
    // Delay to ensure smooth animation after page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])
  
  // Function to animate a wind layer with random timing
  const animateWindLayer = async (
    controls: AnimationControls, 
    minDelay = 1000, 
    maxDelay = 5000, 
    duration = 5000
  ) => {
    if (!isMounted.current) return
    
    // Start the animation
    await controls.start({
      x: "100%",
      opacity: [0, 0.5, 0.8, 0.5, 0],
      transition: {
        x: { duration: duration / 1000, ease: "easeInOut" },
        opacity: { duration: duration / 1000, times: [0, 0.2, 0.5, 0.8, 1] }
      }
    })
    
    // Reset position
    await controls.set({ x: "-100%", opacity: 0 })
    
    // Wait for a random delay before starting again
    const delay = Math.random() * (maxDelay - minDelay) + minDelay
    setTimeout(() => {
      if (isMounted.current) {
        animateWindLayer(controls, minDelay, maxDelay, duration)
      }
    }, delay)
  }
  
  // Start and manage wind animations
  useEffect(() => {
    isMounted.current = true
    
    // Start each wind layer with a different initial delay
    setTimeout(() => animateWindLayer(mainWindControls, 1000, 5000, 5000), Math.random() * 1000)
    setTimeout(() => animateWindLayer(fastWindControls, 800, 4000, 4000), Math.random() * 2000)
    setTimeout(() => animateWindLayer(slowWindControls, 1200, 6000, 6000), Math.random() * 3000)
    
    return () => {
      isMounted.current = false
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0, 0.9] },
    },
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden hero-pattern px-4 py-24 text-center md:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(67,56,202,0.1),transparent)]" />
      
      {/* Main wind layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ x: "-100%", opacity: 0 }}
        animate={mainWindControls}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent backdrop-blur-[1px]" />
        {/* Wind particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => {
            const randomDuration = 3 + Math.random() * 3
            const randomDelay = Math.random() * 2
            const width = 30 + Math.random() * 60
            const height = 1 + (Math.random() > 0.7 ? 1 : 0)
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  height: `${height}px`,
                  width: `${width}px`,
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.1 + Math.random() * 0.15}), transparent)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 20}%`,
                  opacity: 0,
                }}
                animate={{
                  x: ["-10%", "110%"],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2 + 1,
                  ease: "easeInOut",
                  delay: randomDelay,
                }}
              />
            )
          })}
        </div>
      </motion.div>
      
      {/* Faster wind layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ x: "-100%", opacity: 0 }}
        animate={fastWindControls}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent backdrop-blur-[0.5px]" />
        {/* Wind streaks */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const randomDuration = 2 + Math.random() * 2
            const randomDelay = Math.random() * 3
            const width = 20 + Math.random() * 40
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  height: "1px",
                  width: `${width}px`,
                  backgroundColor: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.1})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 20}%`,
                  opacity: 0,
                }}
                animate={{
                  x: ["-10%", "110%"],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2 + 1,
                  ease: "easeInOut",
                  delay: randomDelay,
                }}
              />
            )
          })}
        </div>
      </motion.div>
      
      {/* Slower wind layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ x: "-100%", opacity: 0 }}
        animate={slowWindControls}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/8 to-transparent backdrop-blur-[0.3px]" />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => {
            const randomDuration = 4 + Math.random() * 3
            const randomDelay = Math.random() * 4
            const size = 1 + (Math.random() * 3)
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  height: `${size}px`,
                  width: `${size}px`,
                  backgroundColor: `rgba(255, 255, 255, ${0.1 + (Math.random() * 0.15)})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 20}%`,
                  opacity: 0,
                }}
                animate={{
                  x: ["-10%", "110%"],
                  y: [0, (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 20), 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3 + 1,
                  ease: "easeInOut",
                  delay: randomDelay,
                }}
              />
            )
          })}
          
          {/* Additional thicker lines - diagonal wind */}
          {[...Array(15)].map((_, i) => {
            const randomDuration = 3 + Math.random() * 4
            const randomDelay = Math.random() * 3
            const width = 40 + Math.random() * 80
            const angle = -15 + Math.random() * 30 // Slight diagonal angle
            
            return (
              <motion.div
                key={`diagonal-${i}`}
                className="absolute"
                style={{
                  height: "1px",
                  width: `${width}px`,
                  backgroundColor: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.1})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 20}%`,
                  opacity: 0,
                  transform: `rotate(${angle}deg)`,
                }}
                animate={{
                  x: ["-10%", "110%"],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2 + 1,
                  ease: "easeInOut",
                  delay: randomDelay,
                }}
              />
            )
          })}
        </div>
      </motion.div>
      
      <TechAnimation />

      <motion.div
        className="container max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">{t("hero.greeting")}</h2>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <motion.span
              className="gradient-text inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Luis Ortiz
            </motion.span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">{t("hero.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cool-600 to-indigo-600 hover:from-cool-700 hover:to-indigo-700 transition-all duration-300"
            >
              <Link href="#projects">{t("hero.cta.viewWork")}</Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="lg" asChild className="gradient-border">
              <Link href="#contact">{t("hero.cta.contact")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Link
            href="#about"
            className="flex flex-col items-center text-muted-foreground hover:text-cool-600 dark:hover:text-cool-300 transition-colors"
          >
            <span className="text-sm mb-2">{t("hero.scrollDown")}</span>
            <ArrowDown className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>

      <SectionDivider variant="waves" position="bottom" height={0} />
    </section>
  )
}

