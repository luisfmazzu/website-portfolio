"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Card } from "@/app/components/card"
import { Button } from "@/app/components/button"
import {
  Code,
  Lightbulb,
  Clock,
  Users,
  Zap,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface ReasonCard {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  skills: string[]
}

export default function WhyHireMe() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const { t } = useTranslation()

  const reasons: ReasonCard[] = [
    {
      id: 1,
      title: t("whyHireMe.provenExpertise.title"),
      description: t("whyHireMe.provenExpertise.description"),
      icon: <Award className="h-8 w-8" />,
      color: "indigo",
      skills: ["Backend", "Frontend", "Integration", "RESTful", "Microservices", "Cloud", "Containers"],
    },
    {
      id: 2,
      title: t("whyHireMe.fastLearner.title"),
      description: t("whyHireMe.fastLearner.description"),
      icon: <Zap className="h-8 w-8" />,
      color: "purple",
      skills: ["Fast learner", "Adaptable", "Discipline", "Innovation", "Prototyping"],
    },
    {
      id: 3,
      title: t("whyHireMe.technicalExcellence.title"),
      description: t("whyHireMe.technicalExcellence.description"),
      icon: <Code className="h-8 w-8" />,
      color: "indigo",
      skills: [
        "Performance Optimization",
        "Technical Research",
        "Algorithm Design",
        "Clean code",
        "System Architecture",
        "Security",
      ],
    },
    {
      id: 4,
      title: t("whyHireMe.problemSolving.title"),
      description: t("whyHireMe.problemSolving.description"),
      icon: <Lightbulb className="h-8 w-8" />,
      color: "cool",
      skills: [
        "Debugging",
        "Monitoring",
        "Post-mortem",
        "Trade-offs",
        "Automation"
      ],
    },
    {
      id: 5,
      title: t("whyHireMe.teamwork.title"),
      description: t("whyHireMe.teamwork.description"),
      icon: <Users className="h-8 w-8" />,
      color: "purple",
      skills: ["Communication", "Collaboration", "Mentoring", "Code Reviews", "Knowledge Sharing"],
    },
    {
      id: 6,
      title: t("whyHireMe.efficiency.title"),
      description: t("whyHireMe.efficiency.description"),
      icon: <Clock className="h-8 w-8" />,
      color: "indigo",
      skills: ["Agile Methodologies", "CI/CD", "Test-Driven Development", "Project Management", "Automation"],
    },
    
    
  ]

  useEffect(() => {
    if (isInView && completedSteps.length === 0) {
      // Start the animation sequence when the component comes into view
      const timer = setTimeout(() => {
        setCurrentStep(0)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView, completedSteps.length])

  const handleNext = () => {
    if (isAnimating || currentStep === reasons.length - 1) return
    setIsAnimating(true)
    setCurrentStep((prev) => Math.min(prev + 1, reasons.length - 1))

    // Add current step to completed steps if not already there
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }
    
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handlePrev = () => {
    if (isAnimating || currentStep <= 0) return

    setIsAnimating(true)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handleStepClick = (index: number) => {
    if (isAnimating) return
    if (index < 0 || index >= reasons.length) return

    setIsAnimating(true)
    setCurrentStep(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const currentReason = reasons[Math.min(Math.max(currentStep, 0), reasons.length - 1)]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="py-12" ref={containerRef}>
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">{t("whyHireMe.title")}</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{t("whyHireMe.subtitle")}</p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        {/* Progress bar */}
        <motion.div
          className="mb-8 relative h-2 bg-cool-100 dark:bg-cool-900 rounded-full overflow-hidden"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-teal-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / reasons.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>

        {/* Step indicators */}
        <div className="flex justify-between mb-8 px-4">
          {reasons.map((reason, index) => (
            <motion.button
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index === currentStep
                  ? "bg-indigo-500 text-white scale-110"
                  : completedSteps.includes(index)
                    ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300"
                    : "bg-cool-100 dark:bg-cool-900 text-cool-500 dark:text-cool-400"
              }`}
              onClick={() => handleStepClick(index)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, delay: 0.05 + index * 0.05 }}
              whileHover={{ scale: index !== currentStep ? 1.1 : 1.15 }}
            >
              {completedSteps.includes(index) ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
            </motion.button>
          ))}
        </div>

        {/* Main content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Left side - Reason card */}
              <Card
                className={`border-${currentReason.color}-200 dark:border-${currentReason.color}-800 hover:border-${currentReason.color}-400 dark:hover:border-${currentReason.color}-600 transition-all duration-300 hover:shadow-lg hover:shadow-${currentReason.color}-100/20 dark:hover:shadow-${currentReason.color}-900/10 p-6 h-full flex flex-col`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="h-full flex flex-col flex-1"
                >
                  <motion.div
                    variants={itemVariants}
                    className={`w-16 h-16 rounded-full bg-${currentReason.color}-100 dark:bg-${currentReason.color}-900/30 flex items-center justify-center mb-4 text-${currentReason.color}-500 dark:text-${currentReason.color}-400`}
                  >
                    {currentReason.icon}
                  </motion.div>
                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold mb-2 text-cool-700 dark:text-cool-300"
                  >
                    {t(currentReason.title)}
                  </motion.h3>
                  <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
                    {t(currentReason.description)}
                  </motion.p>

                  <motion.div variants={itemVariants} className="mt-auto">
                    <div className="text-sm font-medium text-cool-700 dark:text-cool-300 mb-2">{t("keySkills")}</div>
                    <div className="flex flex-wrap gap-2">
                      {currentReason.skills.map((skill, i) => (
                        <motion.span
                          key={skill}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${currentReason.color}-500 text-${currentReason.color}-800 dark:bg-${currentReason.color}-900/30 dark:text-${currentReason.color}-200`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          {t(skill)}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Mobile-only navigation buttons */}
                  <motion.div
                    className="flex justify-between mt-6 md:hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentStep === 0 || isAnimating}
                      className={`${currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      {t("previous")}
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={currentStep === reasons.length - 1 || isAnimating}
                      className={`bg-gradient-to-r from-${currentReason.color}-500 to-${currentReason.color}-600 hover:from-${currentReason.color}-600 hover:to-${currentReason.color}-700 text-white ${currentStep === reasons.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {t("next")}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </Card>

              {/* Right side - Visual representation - hidden on mobile */}
              <div className="bg-gradient-to-br from-cool-50 to-indigo-50 dark:from-cool-900/50 dark:to-indigo-900/30 rounded-lg p-6 flex flex-col hidden md:flex">
                <motion.div
                  className="flex-1 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  {currentStep === 0 && <CodeAnimation />}
                  {currentStep === 1 && <AdaptabilityAnimation />}
                  {currentStep === 2 && <ExcellenceAnimation />}
                  {currentStep === 3 && <ProblemSolvingAnimation />}
                  {currentStep === 4 && <TeamworkAnimation />}
                  {currentStep === 5 && <EfficiencyAnimation />}
                </motion.div>

                {/* Desktop-only navigation buttons */}
                <motion.div
                  className="flex justify-between mt-6 hidden md:flex"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0 || isAnimating}
                    className={`${currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t("previous")}
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={currentStep === reasons.length - 1 || isAnimating}
                    className={`bg-gradient-to-r from-${currentReason.color}-500 to-${currentReason.color}-600 hover:from-${currentReason.color}-600 hover:to-${currentReason.color}-700 text-white ${currentStep === reasons.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {t("next")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-10 -right-10 text-indigo-500 dark:text-indigo-400 opacity-70"
          animate={{
            rotate: [0, 15, -5, 10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Sparkles className="h-20 w-20" />
        </motion.div>

        <motion.div
          className="absolute -bottom-12 -left-1 text-teal-500 dark:text-teal-400 opacity-70"
          animate={{
            rotate: [0, -10, 5, -15, 0],
            scale: [1, 0.9, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        >
          <Sparkles className="h-16 w-16" />
        </motion.div>
      </div>
    </div>
  )
}

// Animation components for each reason
function CodeAnimation() {
  return (
    <div className="relative w-full h-64">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-cool-900 rounded-lg overflow-hidden shadow-xl">
          <div className="flex items-center bg-cool-800 px-4 py-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="p-4 font-mono text-xs text-green-400">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <span className="text-blue-400">const</span> <span className="text-yellow-400">developer</span> = {"{"}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="ml-4"
            >
              <span className="text-purple-400">skills</span>: [<span className="text-green-300">'Python'</span>,{" "}
              <span className="text-green-300">'Golang'</span>, <span className="text-green-300">'TypeScript'</span>,
              <span className="text-green-300">'React'</span>, <span className="text-green-300">'Node.js'</span>],
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="ml-4"
            >
              <span className="text-purple-400">experience</span>: <span className="text-orange-400">7</span>,
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="ml-4"
            >
              <span className="text-purple-400">passion</span>: <span className="text-orange-400">100</span>,
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}>
              {"}"}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ProblemSolvingAnimation() {
  return (
    <div className="relative w-full h-64">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div
            className="w-32 h-32 bg-amber-200 dark:bg-amber-900/40 rounded-lg flex items-center justify-center"
            animate={{
              rotateY: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <span className="text-amber-800 dark:text-amber-200 text-5xl font-bold">?</span>
          </motion.div>

          <motion.div
            className="absolute -right-16 -bottom-16 w-32 h-32 bg-teal-200 dark:bg-teal-900/40 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateZ: [0, -10, 10, 0],
            }}
            transition={{
              delay: 1,
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <span className="text-teal-800 dark:text-teal-200 text-5xl font-bold">!</span>
          </motion.div>

          <motion.div
            className="absolute -left-12 top-8 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              animate={{
                x: [0, 10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <ArrowRight className="h-8 w-8 text-indigo-500" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

function EfficiencyAnimation() {
  return (
    <div className="relative w-full h-64">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-40 h-40 rounded-full border-8 border-teal-200 dark:border-teal-800 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-teal-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-indigo-300 dark:border-indigo-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: -360 }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 0.5,
          }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-cool-400 dark:border-cool-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 1,
          }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cool-500 rounded-full"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Clock className="h-8 w-8 text-teal-600 dark:text-teal-400" />
        </motion.div>
      </div>
    </div>
  )
}

function TeamworkAnimation() {
  const circleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <div className="relative w-full h-64">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div className="relative w-48 h-48">
          {/* Center circle */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center text-white"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
          >
            <Users className="h-8 w-8" />
          </motion.div>

          {/* Orbiting circles */}
          <motion.div
            className="absolute w-12 h-12 bg-indigo-400 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ top: "0%", left: "50%", transform: "translate(-50%, 0%)" }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0, 5, 0],
                x: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              1
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute w-12 h-12 bg-teal-400 dark:bg-teal-600 rounded-full flex items-center justify-center text-white"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ top: "50%", right: "0%", transform: "translate(0%, -50%)" }}
          >
            <motion.div
              animate={{
                y: [0, 5, 0, -5, 0],
                x: [0, -5, 0, 5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              2
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute w-12 h-12 bg-amber-400 dark:bg-amber-600 rounded-full flex items-center justify-center text-white"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{ bottom: "0%", left: "50%", transform: "translate(-50%, 0%)" }}
          >
            <motion.div
              animate={{
                y: [0, 5, 0, -5, 0],
                x: [0, -5, 0, 5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              3
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute w-12 h-12 bg-cool-400 dark:bg-cool-600 rounded-full flex items-center justify-center text-white"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{ top: "50%", left: "0%", transform: "translate(0%, -50%)" }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0, 5, 0],
                x: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              4
            </motion.div>
          </motion.div>

          {/* Connection lines */}
          <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
            <motion.line
              x1="50%"
              y1="50%"
              x2="50%"
              y2="0%"
              stroke="#a78bfa"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="#a78bfa"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="50%"
              y2="100%"
              stroke="#a78bfa"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 1.9, duration: 0.5 }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="0%"
              y2="50%"
              stroke="#a78bfa"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 2.1, duration: 0.5 }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

function AdaptabilityAnimation() {
  return (
    <div className="relative w-full h-64">
      {/* Main container with explicit z-index to stay below buttons */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-0">
        <motion.div
          className="relative w-48 h-48 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Central brain/knowledge hub */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <div className="w-20 h-20 bg-cool-100 dark:bg-cool-900 rounded-full flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-10 w-10 text-cool-600 dark:text-cool-400"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a9 9 0 0 1 9 9c0 3.6-2.4 6.9-5.8 8.7a7.8 7.8 0 0 1-6.4 0C5.4 17.9 3 14.6 3 11a9 9 0 0 1 9-9z" />
                  <path d="M12 7v5l3 3" />
                  <path d="M9 16a9.1 9.1 0 0 0 3 .5 9.1 9.1 0 0 0 3-.5" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Learning cycle - rotating ring with skills - contained within parent */}
          <motion.div
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {/* Skill nodes that appear and grow */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => (
              <motion.div
                key={angle}
                className="absolute"
                style={{
                  top: `${50 - 40 * Math.cos((angle * Math.PI) / 180)}%`,
                  left: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index % 3 === 0
                      ? "bg-indigo-200 dark:bg-indigo-800"
                      : index % 3 === 1
                        ? "bg-teal-200 dark:bg-teal-800"
                        : "bg-amber-200 dark:bg-amber-800"
                  }`}
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      "0 0 0 rgba(99, 102, 241, 0)",
                      "0 0 8px rgba(99, 102, 241, 0.5)",
                      "0 0 0 rgba(99, 102, 241, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: index * 0.3,
                  }}
                >
                  {index === 0 && <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />}
                  {index === 1 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-teal-600 dark:text-teal-300"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-amber-600 dark:text-amber-300"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-indigo-600 dark:text-indigo-300"
                    >
                      <path d="M12 3v19" />
                      <path d="M5 8h14" />
                      <path d="M5 16h14" />
                    </svg>
                  )}
                  {index === 4 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-teal-600 dark:text-teal-300"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  )}
                  {index === 5 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-amber-600 dark:text-amber-300"
                    >
                      <path d="M12 19c-4.3 0-7.8-3.5-7.8-7.8S7.7 3.4 12 3.4s7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8Z" />
                      <path d="M12 19c-3 0-5.5-3.5-5.5-7.8S9 3.4 12 3.4s5.5 3.5 5.5 7.8-2.5 7.8-5.5 7.8Z" />
                      <path d="M12 19c-1.6 0-3-3.5-3-7.8s1.4-7.8 3-7.8 3 3.5 3 7.8-1.4 7.8-3 7.8Z" />
                      <path d="M5 12h14" />
                    </svg>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Fast-moving adaptation particles - contained within parent */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-600"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos((i * Math.PI) / 4) * 60],
                  y: [0, Math.sin((i * Math.PI) / 4) * 60],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Adaptation wave rings - contained within parent */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed"
              style={{
                width: "100%",
                height: "100%",
                borderColor: i === 0 ? "#818cf8" : i === 1 ? "#2dd4bf" : "#f59e0b",
                opacity: 0.4,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0, 0.5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 1.3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Learning progress indicators - moved up to avoid button area */}
          <motion.div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="w-2 h-6 rounded-full bg-cool-200 dark:bg-cool-800 overflow-hidden">
                <motion.div
                  className="w-full bg-gradient-to-t from-indigo-500 to-teal-400"
                  initial={{ height: "0%" }}
                  animate={{ height: "100%" }}
                  transition={{
                    duration: 1.5,
                    delay: 1.8 + i * 0.2,
                    ease: "easeOut",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function ExcellenceAnimation() {
  return (
    <div className="relative w-full h-64">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Central badge */}
          <motion.div
            className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
            transition={{
              scale: { duration: 0.5, type: "spring" },
              rotate: { duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Award className="h-16 w-16 text-white" />
            </motion.div>

            {/* Orbiting stars */}
            <motion.div
              className="absolute -top-4 -right-4 text-yellow-400"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -5, 0, 5, 0],
                x: [0, 5, 0, -5, 0],
              }}
              transition={{
                opacity: { delay: 0.6, duration: 0.3 },
                scale: { delay: 0.6, duration: 0.3 },
                y: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
                x: { duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
              }}
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 text-yellow-400"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, 5, 0, -5, 0],
                x: [0, -5, 0, 5, 0],
              }}
              transition={{
                opacity: { delay: 0.9, duration: 0.3 },
                scale: { delay: 0.9, duration: 0.3 },
                y: { duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
                x: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
              }}
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
          </motion.div>

          {/* Quality checkmarks */}
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-cool-900 rounded-lg px-3 py-1 shadow-md">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/2 -right-12 transform -translate-y-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-cool-900 rounded-lg px-3 py-1 shadow-md">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-cool-900 rounded-lg px-3 py-1 shadow-md">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/2 -left-12 transform -translate-y-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.1, duration: 0.5 }}
          >
            <div className="bg-white dark:bg-cool-900 rounded-lg px-3 py-1 shadow-md">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

