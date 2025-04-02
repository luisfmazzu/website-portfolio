"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Info, Briefcase } from "lucide-react"
import { Badge } from "@/app/components/badge"
import { Button } from "@/app/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/card"
import SectionObserver from "@/app/components/section-observer"
import ProjectModal from "@/app/containers/projects/project-modal"
import SectionDivider from "@/app/components/section-divider"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Project, getProjects } from "@/app/data/projects"
import { useTranslation } from "@/hooks/use-translation"

export default function Projects() {
  const { t } = useTranslation()
  const projects = getProjects()
  // Change the state initialization to use "relevant" as default
  const [selectedTech, setSelectedTech] = useState<string | "relevant" | null>("relevant")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  // Get all unique technologies
  const allTechnologies = Array.from(new Set(projects.flatMap((project) => project.technologies))).sort()

  // Update the filtering logic to handle the "relevant" filter
  // Filter projects based on selected technology or relevance
  const filteredProjects =
    selectedTech === "relevant"
      ? projects.slice(0, 6) // Show only first 6 projects for "Most Relevant"
      : selectedTech === null
        ? projects
        : projects.filter((project) => project.technologies.includes(selectedTech))

  const handleProjectInfo = (project : Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  return (
    <section id="projects" ref={sectionRef} className="relative section-pattern px-4 py-24 md:px-8">
      <SectionDivider variant="bubbles" position="top" height={80} flip={true} />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-cool-50/30 to-background dark:via-cool-900/20" />

      <div className="container">
        <SectionObserver animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              {t("projects.title")}
            </motion.h2>
            <motion.p
              className="mt-4 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("projects.description")}
            </motion.p>
          </div>
        </SectionObserver>

        {/* Update the filter badges section to include "Most Relevant" option */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant={selectedTech === "relevant" ? "default" : "outline"}
              className={`cursor-pointer text-sm ${selectedTech === "relevant" ? "bg-gradient-to-r from-cool-500 to-indigo-500 hover:from-cool-600 hover:to-indigo-600" : "hover:bg-cool-100 hover:text-cool-700 dark:hover:bg-cool-900/40 dark:hover:text-cool-300"}`}
              onClick={() => setSelectedTech("relevant")}
            >
              {t("projects.mostRelevant")}
            </Badge>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant={selectedTech === null ? "default" : "outline"}
              className={`cursor-pointer text-sm ${selectedTech === null ? "bg-gradient-to-r from-cool-500 to-indigo-500 hover:from-cool-600 hover:to-indigo-600" : "hover:bg-cool-100 hover:text-cool-700 dark:hover:bg-cool-900/40 dark:hover:text-cool-300"}`}
              onClick={() => setSelectedTech(null)}
            >
              {t("projects.filter.all")}
            </Badge>
          </motion.div>

          {allTechnologies.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant={selectedTech === tech ? "default" : "outline"}
                className={`cursor-pointer text-sm ${selectedTech === tech ? "bg-gradient-to-r from-cool-500 to-indigo-500 hover:from-cool-600 hover:to-indigo-600" : "hover:bg-cool-100 hover:text-cool-700 dark:hover:bg-cool-900/40 dark:hover:text-cool-300"}`}
                onClick={() => setSelectedTech(tech)}
              >
                {tech}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTech || "all"}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg cool-shadow-lg border-cool-200 dark:border-cool-800 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm h-full flex flex-col">
                  <motion.div
                    className="aspect-video overflow-hidden relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Company badge overlay */}
                    {project.company && (
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 dark:bg-black/70 backdrop-blur-sm text-cool-700 dark:text-cool-300 border border-cool-200 dark:border-cool-800 shadow-md"
                        >
                          <Briefcase className="h-3 w-3 mr-1" />
                          {project.company.name}
                        </Badge>
                      </div>
                    )}
                  </motion.div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-cool-700 dark:text-cool-300">{project.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {project.role && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {t("projects.roleLabel").replace(":", "")} {project.role}
                        </span>
                      </div>
                    )}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {project.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          variants={tagVariants}
                          custom={techIndex}
                          transition={{ delay: 0.1 * techIndex }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gradient-border"
                        onClick={() => handleProjectInfo(project)}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        {t("projects.moreInfoLabel")}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {selectedProject && <ProjectModal open={modalOpen} onOpenChange={setModalOpen} project={selectedProject} />}

      <SectionDivider variant="zigzag" position="bottom" height={80} />
    </section>
  )
}

