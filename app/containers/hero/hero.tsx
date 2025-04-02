"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { Button } from "@/app/components/button"
import TechAnimation from "@/app/components/tech-animation"
import SectionDivider from "@/app/components/section-divider"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Hero() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay to ensure smooth animation after page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
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
          <motion.div whilehover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cool-600 to-indigo-600 hover:from-cool-700 hover:to-indigo-700 transition-all duration-300"
            >
              <Link href="#projects">{t("hero.cta.viewWork")}</Link>
            </Button>
          </motion.div>

          <motion.div whilehover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

