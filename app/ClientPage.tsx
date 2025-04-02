"use client"

import { motion } from "framer-motion"
import Hero from "@/app/containers/hero/hero"
import About from "@/app/containers/about/about"
import Skills from "@/app/containers/skills/skills"
import Projects from "@/app/containers/projects/projects"
import Contact from "@/app/containers/contact/contact"
import ScrollIndicator from "@/app/components/scroll-indicator"

export default function ClientPage() {
  // Animation variants for staggered section reveals
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  }

  return (
    <main className="min-h-screen">
      <ScrollIndicator />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        <motion.div variants={sectionVariants}>
          <Hero />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <About />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Skills />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Projects />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Contact />
        </motion.div>
      </motion.div>
    </main>
  )
}

