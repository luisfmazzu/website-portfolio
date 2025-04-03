"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/card"
import { Badge } from "@/app/components/badge"
import { ExternalLink, Briefcase, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import ExperienceModal from "./experience-modal"
import { Button } from "@/app/components/button"
import { TimelineJob, getJobs } from "../../data/experiences"
import { useTranslation } from "@/hooks/use-translation"


export default function ExperienceTimeline() {
  const { t } = useTranslation()
  const jobs = getJobs()
  const [selectedJob, setSelectedJob] = useState<TimelineJob | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [showEarlierExperiences, setShowEarlierExperiences] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(timelineRef, { once: false, amount: 0.1 })

  // Define fixed timeline years
  const timelineYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016]

  // Split jobs into recent (2021-2025) and earlier (2016-2020)
  const recentJobs = jobs.filter((job) => job.year >= 2021)
  const earlierJobs = jobs.filter((job) => job.year < 2021)

  const handleJobClick = (job: TimelineJob) => {
    setSelectedJob(job)
    setModalOpen(true)
  }

  const toggleEarlierExperiences = () => {
    setShowEarlierExperiences(!showEarlierExperiences)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const timelineLineVariants = {
    hidden: { height: 0 },
    visible: {
      height: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  }

  const leftItemVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  }

  const rightItemVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  }

  const yearMarkerVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  }

  return (
    <div className="w-full" ref={timelineRef}>
      <motion.h3
        className="text-2xl font-bold text-cool-700 dark:text-cool-300 mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {t("experience.title")}
      </motion.h3>

      <div className="relative max-w-6xl mx-auto">
        {/* Timeline line with glow effect */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-teal-500 rounded-full md:block hidden"
          style={{
            height: "100%",
            boxShadow:
              "0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.1)",
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={timelineLineVariants}
        >
          {/* Animated glow particles */}
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              y: [0, "100%", 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          >
            <div className="h-full w-full bg-gradient-to-b from-indigo-400 via-purple-400 to-teal-400 rounded-full opacity-70 blur-sm"></div>
          </motion.div>
        </motion.div>

        {/* Mobile timeline line - simplified version */}
        <motion.div
          className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-teal-500 rounded-full md:hidden block"
          style={{
            height: "100%",
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={timelineLineVariants}
        ></motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-6"
        >
          {/* Year marker for 2025 */}
          <motion.div variants={yearMarkerVariants} className="relative">
            <motion.div className="absolute left-0 right-0 md:flex justify-center z-10 hidden" style={{ top: 0 }}>
              <motion.div
                className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border-4 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(99, 102, 241, 0.4)",
                    "0 0 20px rgba(99, 102, 241, 0.6)",
                    "0 0 0 rgba(99, 102, 241, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <span className="text-indigo-700 dark:text-indigo-300 font-bold text-lg">2025</span>
              </motion.div>
            </motion.div>

            {/* Mobile year marker */}
            <motion.div className="absolute left-0 md:hidden block z-10" style={{ top: 0 }}>
              <motion.div
                className="ml-4 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border-2 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">2025</span>
              </motion.div>
            </motion.div>

            <div className="mt-8 pt-[100px] md:ml-4 pl-8">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
              >
                <div className="md:col-start-2 col-start-1">
                  {jobs
                    .filter((job) => job.timeframe === "2025-present")
                    .map((job) => (
                      <Card
                        key={job.id}
                        className={`border-${job.color}-200 dark:border-${job.color}-800 hover:border-${job.color}-400 dark:hover:border-${job.color}-600 hover:shadow-lg hover:shadow-${job.color}-100/20 dark:hover:shadow-${job.color}-900/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm`}
                        onClick={() => handleJobClick(job)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-2">
                            <div className={`p-2 rounded-full bg-${job.color}-100 dark:bg-${job.color}-900/30 mt-1`}>
                              <Briefcase className={`h-5 w-5 text-${job.color}-500 dark:text-${job.color}-400`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-cool-700 dark:text-cool-300">{job.title}</CardTitle>
                              <CardDescription className={`text-${job.color}-600 dark:text-${job.color}-400`}>
                                {job.company} • {job.period}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{job.description}</p>
                          <div className="flex items-center justify-between mt-4">
                            <Badge
                              variant="outline"
                              className={`bg-${job.color}-50 text-${job.color}-700 border-${job.color}-200 dark:bg-${job.color}-900/20 dark:text-${job.color}-300 dark:border-${job.color}-800`}
                            >
                              {t("viewDetails")}
                            </Badge>
                            {job.website && (
                              <Link
                                href={job.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-${job.color}-500 hover:text-${job.color}-600 dark:text-${job.color}-400 dark:hover:text-${job.color}-300`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Year marker for 2023-2024 */}
          <motion.div variants={yearMarkerVariants} className="relative">
            <motion.div className="absolute left-0 right-0 md:flex justify-center z-10 hidden" style={{ top: 0 }}>
              <motion.div
                className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center border-4 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(168, 85, 247, 0.4)",
                    "0 0 20px rgba(168, 85, 247, 0.6)",
                    "0 0 0 rgba(168, 85, 247, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <span className="text-purple-700 dark:text-purple-300 font-bold text-lg">2024</span>
              </motion.div>
            </motion.div>

            {/* Mobile year marker */}
            <motion.div className="absolute left-0 md:hidden block z-10" style={{ top: 0 }}>
              <motion.div
                className="ml-4 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center border-2 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">2024</span>
              </motion.div>
            </motion.div>

            <div className="mt-8 pt-[100px] md:mr-4 pr-8">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
              >
                <div className="md:col-start-1 col-start-1">
                  {jobs
                    .filter((job) => job.timeframe === "2023-2024")
                    .map((job) => (
                      <Card
                        key={job.id}
                        className={`border-${job.color}-200 dark:border-${job.color}-800 hover:border-${job.color}-400 dark:hover:border-${job.color}-600 hover:shadow-lg hover:shadow-${job.color}-100/20 dark:hover:shadow-${job.color}-900/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm`}
                        onClick={() => handleJobClick(job)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-2">
                            <div className={`p-2 rounded-full bg-${job.color}-100 dark:bg-${job.color}-900/30 mt-1`}>
                              <Briefcase className={`h-5 w-5 text-${job.color}-500 dark:text-${job.color}-400`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-cool-700 dark:text-cool-300">{job.title}</CardTitle>
                              <CardDescription className={`text-${job.color}-600 dark:text-${job.color}-400`}>
                                {job.company} • {job.period}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{job.description}</p>
                          <div className="flex items-center justify-between mt-4">
                            <Badge
                              variant="outline"
                              className={`bg-${job.color}-50 text-${job.color}-700 border-${job.color}-200 dark:bg-${job.color}-900/20 dark:text-${job.color}-300 dark:border-${job.color}-800`}
                            >
                              {t("viewDetails")}
                            </Badge>
                            {job.website && (
                              <Link
                                href={job.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-${job.color}-500 hover:text-${job.color}-600 dark:text-${job.color}-400 dark:hover:text-${job.color}-300`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={yearMarkerVariants} className="relative">
            <motion.div className="absolute left-0 right-0 md:flex justify-center z-10 hidden" style={{ top: 0 }}>
              <motion.div
                className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center border-4 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(20, 184, 166, 0.4)",
                    "0 0 20px rgba(20, 184, 166, 0.6)",
                    "0 0 0 rgba(20, 184, 166, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <span className="text-teal-700 dark:text-teal-300 font-bold text-lg">2023</span>
              </motion.div>
            </motion.div>

            {/* Mobile year marker */}
            <motion.div className="absolute left-0 md:hidden block z-10" style={{ top: 0 }}>
              <motion.div
                className="ml-4 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center border-2 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-teal-700 dark:text-teal-300 font-bold text-sm">2023</span>
              </motion.div>
            </motion.div>

            <div className="mt-8 pt-8 ml-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              >
                {jobs
                  .filter((job) => job.timeframe === "2021-2023")
                  .map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <Card
                        className={`border-${job.color}-200 dark:border-${job.color}-800 hover:border-${job.color}-400 dark:hover:border-${job.color}-600 hover:shadow-lg hover:shadow-${job.color}-100/20 dark:hover:shadow-${job.color}-900/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 bg-white/80 dark:bg-cool-950 backdrop-blur-sm h-full`}
                        onClick={() => handleJobClick(job)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-2">
                            <div className={`p-2 rounded-full bg-${job.color}-100 dark:bg-${job.color}-900/30 mt-1`}>
                              <Briefcase className={`h-5 w-5 text-${job.color}-500 dark:text-${job.color}-400`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-cool-700 dark:text-cool-300">{job.title}</CardTitle>
                              <CardDescription className={`text-${job.color}-600 dark:text-${job.color}-400`}>
                                {job.company} • {job.period}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{job.description}</p>
                          <div className="flex items-center justify-between mt-4">
                            <Badge
                              variant="outline"
                              className={`bg-${job.color}-50 text-${job.color}-700 border-${job.color}-200 dark:bg-${job.color}-900/20 dark:text-${job.color}-300 dark:border-${job.color}-800`}
                            >
                              {t("viewDetails")}
                            </Badge>
                            {job.website && (
                              <Link
                                href={job.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-${job.color}-500 hover:text-${job.color}-600 dark:text-${job.color}-400 dark:hover:text-${job.color}-300`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Toggle button for earlier experiences */}
          <motion.div variants={yearMarkerVariants} className="relative flex justify-center pt-12 md:pt-8">
            <div className="absolute left-0 right-0 md:flex justify-center z-10 hidden" style={{ top: 0 }}>
              <motion.div
                className="w-16 h-16 rounded-full bg-cool-100 dark:bg-cool-900 flex items-center justify-center border-4 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(99, 102, 241, 0.4)",
                    "0 0 20px rgba(99, 102, 241, 0.6)",
                    "0 0 0 rgba(99, 102, 241, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <span className="text-cool-700 dark:text-cool-300 font-bold text-md">2021-</span>
              </motion.div>
            </div>

            {/* Mobile year marker */}
            <motion.div className="absolute left-0 md:hidden block z-10" style={{ top: 0 }}>
              <motion.div
                className="ml-4 -translate-x-1/2 w-8 h-8 rounded-full bg-cool-100 dark:bg-cool-900 flex items-center justify-center border-2 border-white dark:border-cool-950 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-cool-700 dark:text-cool-300 font-bold text-sm">2021-</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="md:mt-20 mt-12"
            >
              <Button
                variant="outline"
                onClick={toggleEarlierExperiences}
                className="glass-card border-cool-200 dark:border-cool-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300"
              >
                {showEarlierExperiences ? (
                  <>
                    {t("hideEarlierExperience")} <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t("showEarlierExperience")} <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Earlier Jobs */}
          <AnimatePresence mode="wait">
            {showEarlierExperiences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 overflow-hidden"
              >
                <motion.div variants={yearMarkerVariants} className="relative" initial="hidden" animate="visible">
                  <motion.div className="absolute left-0 right-0 md:flex justify-center z-10 hidden" style={{ top: 0 }}>
                    <motion.div
                      className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-4 border-white dark:border-cool-950 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(59, 130, 246, 0.4)",
                          "0 0 20px rgba(59, 130, 246, 0.6)",
                          "0 0 0 rgba(59, 130, 246, 0.4)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">2020</span>
                    </motion.div>
                  </motion.div>

                  {/* Mobile year marker */}
                  <motion.div className="absolute left-0 md:hidden block z-10" style={{ top: 0 }}>
                    <motion.div
                      className="ml-4 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-white dark:border-cool-950 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-blue-700 dark:text-blue-300 font-bold text-sm">2020</span>
                    </motion.div>
                  </motion.div>

                  <div className="mt-8 pt-[100px] md:ml-4 pl-8">
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
                    >
                      <div className="md:col-start-2 col-start-1">
                        {jobs
                          .filter((job) => job.timeframe === "2017-2020")
                          .map((job) => (
                            <Card
                              key={job.id}
                              className={`border-${job.color}-200 dark:border-${job.color}-800 hover:border-${job.color}-400 dark:hover:border-${job.color}-600 hover:shadow-lg hover:shadow-${job.color}-100/20 dark:hover:shadow-${job.color}-900/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm`}
                              onClick={() => handleJobClick(job)}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-start gap-2">
                                  <div
                                    className={`p-2 rounded-full bg-${job.color}-100 dark:bg-${job.color}-900/30 mt-1`}
                                  >
                                    <Briefcase className={`h-5 w-5 text-${job.color}-500 dark:text-${job.color}-400`} />
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-cool-700 dark:text-cool-300">{job.title}</CardTitle>
                                    <CardDescription className={`text-${job.color}-600 dark:text-${job.color}-400`}>
                                      {job.company} • {job.period}
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground">{job.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                  <Badge
                                    variant="outline"
                                    className={`bg-${job.color}-50 text-${job.color}-700 border-${job.color}-200 dark:bg-${job.color}-900/20 dark:text-${job.color}-300 dark:border-${job.color}-800`}
                                  >
                                    {t("viewDetails")}
                                  </Badge>
                                  {job.website && (
                                    <Link
                                      href={job.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`text-${job.color}-500 hover:text-${job.color}-600 dark:text-${job.color}-400 dark:hover:text-${job.color}-300`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Link>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div variants={yearMarkerVariants} className="relative" initial="hidden" animate="visible">
                  <motion.div className="absolute left-0 right-0 md:flex justify-center z-10 hidden" style={{ top: 0 }}>
                    <motion.div
                      className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center border-4 border-white dark:border-cool-950 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(245, 158, 11, 0.4)",
                          "0 0 20px rgba(245, 158, 11, 0.6)",
                          "0 0 0 rgba(245, 158, 11, 0.4)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <span className="text-amber-700 dark:text-amber-300 font-bold text-lg">2017</span>
                    </motion.div>
                  </motion.div>

                  {/* Mobile year marker */}
                  <motion.div className="absolute left-0 md:hidden block z-10" style={{ top: 0 }}>
                    <motion.div
                      className="ml-4 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center border-2 border-white dark:border-cool-950 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-amber-700 dark:text-amber-300 font-bold text-sm">2017</span>
                    </motion.div>
                  </motion.div>

                  <div className="mt-8 pt-[100px] md:mr-4 pr-8">
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
                    >
                      <div className="md:col-start-1 col-start-1">
                        {jobs
                          .filter((job) => job.timeframe === "2016-2017")
                          .map((job) => (
                            <Card
                              key={job.id}
                              className={`border-${job.color}-200 dark:border-${job.color}-800 hover:border-${job.color}-400 dark:hover:border-${job.color}-600 hover:shadow-lg hover:shadow-${job.color}-100/20 dark:hover:shadow-${job.color}-900/10 hover:-translate-y-1 cursor-pointer transition-all duration-300 bg-white/80 dark:bg-cool-950/30 backdrop-blur-sm`}
                              onClick={() => handleJobClick(job)}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-start gap-2">
                                  <div
                                    className={`p-2 rounded-full bg-${job.color}-100 dark:bg-${job.color}-900/30 mt-1`}
                                  >
                                    <Briefcase className={`h-5 w-5 text-${job.color}-500 dark:text-${job.color}-400`} />
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-cool-700 dark:text-cool-300">{job.title}</CardTitle>
                                    <CardDescription className={`text-${job.color}-600 dark:text-${job.color}-400`}>
                                      {job.company} • {job.period}
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground">{job.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                  <Badge
                                    variant="outline"
                                    className={`bg-${job.color}-50 text-${job.color}-700 border-${job.color}-200 dark:bg-${job.color}-900/20 dark:text-${job.color}-300 dark:border-${job.color}-800`}
                                  >
                                    {t("viewDetails")}
                                  </Badge>
                                  {job.website && (
                                    <Link
                                      href={job.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`text-${job.color}-500 hover:text-${job.color}-600 dark:text-${job.color}-400 dark:hover:text-${job.color}-300`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Link>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {selectedJob && (
        <ExperienceModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          experience={{
            title: selectedJob.title,
            company: selectedJob.company,
            period: selectedJob.period,
            description: selectedJob.description,
            responsibilities: selectedJob.responsibilities,
            website: selectedJob.website,
          }}
        />
      )}
    </div>
  )
}

