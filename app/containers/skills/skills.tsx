"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/app/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/tabs"
import SectionObserver from "@/app/components/section-observer"
import {
  Code2,
  Server,
  Database,
  GitBranch,
  Globe,
  Cpu,
  Layers,
  Eclipse,
  FileCode,
  Workflow,
  Boxes,
  Cloud,
  Terminal,
  ServerCog,
  FastForward,
  Martini,
  Hash,
  SquarePi,
  Computer
} from "lucide-react"
import SectionDivider from "../../components/section-divider"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function Skills() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const skillCategories = [
    {
      id: "all",
      name: t("skills.categories.all"),
    },
    {
      id: "frontend",
      name: t("skills.categories.frontend"),
    },
    {
      id: "backend",
      name: t("skills.categories.backend"),
    },
    {
      id: "other",
      name: t("skills.categories.other"),
    },
  ]

  const skills = [
    { name: "Python", category: "backend", icon: <Terminal className="h-8 w-8 text-yellow-600" /> },
    { name: "Django", category: "backend", icon: <Boxes className="h-8 w-8 text-green-800" /> },
    { name: "Flask", category: "backend", icon: <Computer className="h-8 w-8 text-yellow-600" /> },
    { name: "FastAPI", category: "backend", icon: <Boxes className="h-8 w-8 text-green-800" /> },
    { name: "JavaScript", category: "frontend", icon: <FileCode className="h-8 w-8 text-amber-500" /> },
    { name: "TypeScript", category: "frontend", icon: <FileCode className="h-8 w-8 text-blue-500" /> },
    { name: "React", category: "frontend", icon: <Workflow className="h-8 w-8 text-cyan-500" /> },
    { name: "Next.js", category: "frontend", icon: <Layers className="h-8 w-8 text-gray-800 dark:text-gray-200" /> },
    { name: "Node.js", category: "backend", icon: <Server className="h-8 w-8 text-green-600" /> },
    { name: "Express", category: "backend", icon: <Globe className="h-8 w-8 text-gray-600 dark:text-gray-400" /> },
    { name: "Nest.js", category: "backend", icon: <ServerCog className="h-8 w-8 text-yellow-600" /> },
    { name: "Golang", category: "backend", icon: <FastForward className="h-8 w-8 text-green-800" /> },
    { name: "Gin", category: "backend", icon: <Martini className="h-8 w-8 text-yellow-600" /> },
    { name: "C#", category: "backend", icon: <Hash className="h-8 w-8 text-green-800" /> },
    { name: "C++", category: "backend", icon: <Code2 className="h-8 w-8 text-amber-500" /> },
    { name: "C", category: "backend", icon: <Eclipse className="h-8 w-8 text-blue-500" /> },
    { name: "Solidity", category: "backend", icon: <SquarePi className="h-8 w-8 text-cyan-500" /> },
    { name: "PostgreSQL", category: "backend", icon: <Database className="h-8 w-8 text-gray-800 dark:text-gray-200" /> },
    { name: "MongoDB", category: "backend", icon: <Database className="h-8 w-8 text-green-600" /> },
    { name: "Redis", category: "other", icon: <Cpu className="h-8 w-8 text-gray-600 dark:text-gray-400" /> },
    { name: "Grafana", category: "other", icon: <Cpu className="h-8 w-8 text-yellow-600" /> },
    { name: "Git", category: "other", icon: <GitBranch className="h-8 w-8 text-green-800" /> },
    { name: "Docker", category: "other", icon: <Cpu className="h-8 w-8 text-yellow-600" /> },
    { name: "AWS", category: "other", icon: <Cloud className="h-8 w-8 text-green-800" /> },
    { name: "Kafka", category: "other", icon: <Cpu className="h-8 w-8 text-yellow-600" /> },
    // { name: "MQTT", category: "other", icon: <Cpu className="h-8 w-8 text-blue-600" /> },
  ]

  const filteredSkills =
    selectedCategory === "all" ? skills : skills.filter((skill) => skill.category === selectedCategory)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative bg-gradient-to-br from-cool-50 to-indigo-50 dark:from-cool-950 dark:to-indigo-950 px-4 py-24 md:px-8"
    >
      <SectionDivider variant="peaks" position="top" height={40} flip={true} />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />

      <div className="container">
        <SectionObserver animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              {t("skills.title")}
            </motion.h2>
            <motion.p
              className="mt-4 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("skills.description")}
            </motion.p>
          </div>
        </SectionObserver>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TabsList className="mb-8 bg-white/50 dark:bg-cool-900/50 backdrop-blur-sm">
                {skillCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <TabsTrigger
                      value={category.id}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cool-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
                    >
                      {category.name}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </motion.div>

            {skillCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <Card className="glass-card cool-shadow">
                  <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedCategory}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                      >
                        {filteredSkills.map((skill, index) => (
                          <motion.div
                            key={`${selectedCategory}-${skill.name}`}
                            variants={itemVariants}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            }}
                            className="flex flex-col items-center justify-center rounded-lg border border-cool-200 dark:border-cool-800 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm p-4 text-center transition-all duration-300 hover:border-primary hover:shadow-md cool-shadow"
                          >
                            <motion.div
                              className="mb-3 hover:scale-110 transition-transform duration-300"
                              animate={{
                                rotateY: [0, 10, 0, -10, 0],
                                rotateZ: [0, 5, 0, -5, 0],
                              }}
                              transition={{
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                                delay: index * 0.2,
                              }}
                            >
                              {skill.icon}
                            </motion.div>
                            <span className="text-lg font-medium text-cool-700 dark:text-cool-300">{skill.name}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>

      <SectionDivider variant="bubbles" position="bottom" height={40} />
    </section>
  )
}

