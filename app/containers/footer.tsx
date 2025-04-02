"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"

import { motion } from "framer-motion"

export default function Footer() {
  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/luisfmazzu", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/luis-felipe-mazzuchetti-ortiz/", label: "LinkedIn" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:luisfmazzu@gmail.com", label: "Email" },
  ]

  return (
    <footer className="relative border-t border-cool-200 dark:border-cool-800 bg-gradient-to-br from-cool-50 to-indigo-50 dark:from-cool-950 dark:to-indigo-950 px-4 py-12 md:px-8">

      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div
            className="flex flex-col items-center gap-2 md:items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="text-xl font-bold">
              <motion.span
                className="gradient-text"
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
            </Link>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              Building digital experience with expertise.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-2 md:items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whilehover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-cool-600 dark:hover:text-cool-300"
                  >
                    {link.icon}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-center text-xs text-muted-foreground md:text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              © {new Date().getFullYear()} Luis Ortiz. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

