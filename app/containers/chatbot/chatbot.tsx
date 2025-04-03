"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Loader2, Bot, Terminal, Cpu, Code, Zap, Sparkles } from "lucide-react"
import { Button } from "@/app/components/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/avatar"
import { Input } from "@/app/components/input"
import { useTranslation } from "@/hooks/use-translation"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  // Initial greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: t("chatbot.greeting"),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [isOpen, messages.length, t])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Get OpenAI response
      const botResponse = await getBotResponse(inputValue, messages)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error getting bot response:", error)
      
      // Fallback message in case of error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t("chatbot.fallback"),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const getBotResponse = async (userInput: string, currentMessages: Message[]): Promise<string> => {
    // Create the system prompt with experience, skills, and projects
    const systemPrompt = `You are a helpful virtual assistant for Luis Ortiz's portfolio website. 
    
Your role is to help visitors learn about Luis and his work by answering their questions based on the following information:

EXPERIENCE:
- Software Engineering Manager at Ocarina Studios (2024-2025): Led multiple engineering teams, increased team retention by 40%, reduced onboarding time by 40%, and accelerated feature development time by 50% through rapid prototyping processes.

- Full-Stack Engineer at Elixir Technologies Ltd. (2022-2024): Built a decentralized market-making platform that reached billions in trading volume and $50M+ TVL. Designed systems supporting over 100,000 validators and implemented high-performance algorithms for SLA compliance.

- Full-Stack Software Engineer, Freelancer (2021-2023): Developed multiple successful projects including an irrigation mobile app, a decentralized storage system that improved file retrieval speeds by multiple times, and an AI-powered web scraping platform.

- Interview Engineer Contractor at Karat (2021-2023): Conducted over 100 technical assessments globally and performed hundreds of interview reviews as part of the quality control team.

- Full-Stack Software Engineer Consultant at Ocarina Studios (2021-2023): Led engineering hiring process, developed apps for audio conversion and trivia creation, and fully managed the lifecycle of multiple projects from requirements gathering to deployment.

- Lead Software Engineer at Agres Electronic Systems (2017-2020): Maintained software for agricultural automation product deployed on over 1,000,000 devices. Developed a Seeding Monitor feature that increased product sales by 100% in one year. Led engineering hiring that expanded the team by 300%.

- Junior Software Engineer at Tales Inc. (2016-2017): Automated machinery using PLCs and computer vision, reducing manual operations by more than 50% and increasing quality assurance by over 50%.

SKILLS:
- Programming Languages: JavaScript, TypeScript, Python, Golang, C#, C++, C, Solidity (junior)
- Frontend: React, Next.js, HTML, CSS, Tailwind
- Backend: Node.js, Express, Nest.js, Django, Flask, FastAPI, Gin
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kafka
- Other: Git, DevOps, Leadership, Mentoring

PROJECTS:
- Elixir Protocol: A decentralized market-making platform in the blockchain
- Vintality: An irrigation mobile app with sensor hardware integration
- Portfolio Website: Personal responsive portfolio site with dark mode and translations
- Nebula Storage: A decentralized storage and CDN using Ethereum and IPFS
- Agronave PRO: Advanced agricultural automation system
- Scrape Sense AI: AI-powered web scraping platform
- TriviaGen AI: AI application for generating trivia questions
- Google Accelerator Program: One of 60 studios selected globally for mentorship
- Dream Quiz: A game API managing user sessions, analytics, and real-time data processing
- Save Your Brain: Trivia: A high-performance multiplayer trivia game API with matchmaking and rankings
- Maver: An iOS app that records voice input, converts to editable MIDI, and transforms into instrument sounds
- Secure Software Auditing with Intel SGX: A Linux kernel modification leveraging Intel SGX for tamper-proof program auditing
- In-depth Analysis of Blockchain Networks Using TEEs: Research project analyzing security vs. performance tradeoffs in trusted execution environments
- 3D Pokémon Fan Game: Unity-based 3D game prototype with turn-based battles and procedural terrain generation
- Bluetooth MIDI Controller: Custom MIDI controller using Arduino with Bluetooth control via Android app
- NFT Marketplace: Decentralized NFT marketplace with creation, auctions, and trading built with Solidity and Next.js

Luis resides in Curitiba, Brazil, but he may also be in other places such as Canada. He works remotely only and is his preferred way of working.
Luis email is luisfmazzu@gmail.com and phone is +55 41 997003955. Any mentioning of contact with him, direct him to the contact form in this website.

Luis availability is usually immediately, always instruct them to contact him directly that Luis will get back to them as soon as possible.
Luis is responsible, innovative, and a great leader. He considers empathy and collaboration in his work. He is always looking for ways to improve his skills and the way he works.
Luis is eager to help and always willing to share his knowledge. He is a great mentor and a great person to work with.
Luis is eager to learn and always looking for new challenges. He is a great problem solver and a great person to work with.
He is a great freelancer that delivers work quickly, on time, and with great quality.

Keep your responses concise, helpful, and in a friendly tone.
If you're asked about technical details that aren't provided, you can use your general knowledge but make it clear when you're not speaking specifically about Luis's work.
If you don't know the answer and also can't use general knowledge, you must politely say that you don't know and that you will improve, which is the same attitude Luis has. Improving is a never ending process.
You can also ask for more information if needed. You must be extra positive about Luis's work and skills.
If you are asked about something that you don't know about Luis more than once, you can say that you don't know and that they should contact Luis directly via the contact form in this website.`;

    // Format the conversation history for the API
    const conversationHistory = currentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Prepare the request to OpenAI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userInput }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    return data.content || t("chatbot.fallback");
  }

  // Animation variants
  const chatButtonVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    tap: { scale: 0.9 },
    hover: { scale: 1.1, boxShadow: "0 0 20px rgba(99, 102, 241, 0.7)" },
  }

  const chatWindowVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.9 },
  }

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  // Tech-themed gradient animation for button background
  const buttonGradientAnimation = {
    background: [
      "linear-gradient(45deg, #4f46e5, #8b5cf6)",
      "linear-gradient(45deg, #6366f1, #a855f7)",
      "linear-gradient(45deg, #3b82f6, #9333ea)",
      "linear-gradient(45deg, #4f46e5, #8b5cf6)",
    ],
    transition: { 
      duration: 10, 
      repeat: Infinity, 
      ease: "linear" 
    }
  }

  const iconAnimation = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      rotateY: 90,
      transition: { duration: 0.3 }
    }
  }

  // Cycle through tech icons
  const [iconIndex, setIconIndex] = useState(0)
  const techIcons = [
    <Cpu key="cpu" className="h-7 w-7" />,
    <Terminal key="terminal" className="h-7 w-7" />,
    <Code key="code" className="h-7 w-7" />,
    <Zap key="zap" className="h-7 w-7" />,
    <MessageSquare key="message" className="h-7 w-7" />
  ]

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setIconIndex((prev) => (prev + 1) % techIcons.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  // Attention indicator animation
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 0 0 rgba(99, 102, 241, 0.4)",
      "0 0 0 10px rgba(99, 102, 241, 0)",
      "0 0 0 0 rgba(99, 102, 241, 0)"
    ],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: "easeInOut" 
    }
  }

  return (
    <>
      {/* Chat button with attention indicator */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial="initial"
        animate="animate"
        whileTap="tap"
        whileHover="hover"
        variants={chatButtonVariants}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Attention pulse indicator */}
        {!isOpen && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-indigo-500/30"
            animate={pulseAnimation}
          />
        )}
        <motion.div
          animate={buttonGradientAnimation}
          className="absolute inset-0 rounded-full blur-md opacity-70"
        />
        <Button
          onClick={toggleChat}
          className={`relative w-16 h-16 rounded-full shadow-lg backdrop-blur-sm ${isOpen ? "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700" : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"}`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X className="h-7 w-7" />
              </motion.div>
            ) : (
              <motion.div
                key="tech-icon"
                variants={iconAnimation}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {techIcons[iconIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        
        {/* "Chat with me" indicator text */}
        {!isOpen && (
          <motion.div 
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white dark:bg-cool-900 px-3 py-1 rounded-full shadow-md whitespace-nowrap text-sm font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            Chat with me
            <motion.div 
              className="absolute w-2 h-2 bg-white dark:bg-cool-900 right-0 top-1/2 -translate-y-1/2 translate-x-1 rotate-45"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="border-cool-200 dark:border-cool-800 shadow-xl overflow-hidden backdrop-blur-sm border border-opacity-40 dark:border-opacity-40 bg-white/90 dark:bg-cool-950/90">
              <CardHeader className="p-4 relative overflow-hidden">
                {/* Background circuit pattern */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div 
                    className="absolute inset-0"
                    style={{ 
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,20 L90,20 M20,10 L20,90 M40,10 L40,30 M40,50 L40,90 M60,10 L60,50 M60,70 L60,90 M80,10 L80,90 M10,40 L30,40 M50,40 L90,40 M10,60 L50,60 M70,60 L90,60 M10,80 L90,80' stroke='%236366F1' stroke-width='1' fill='none' /%3E%3C/svg%3E\")",
                      backgroundSize: "40px 40px"
                    }}
                    animate={{ 
                      backgroundPosition: ["0px 0px", "40px 40px"],
                    }}
                    transition={{ 
                      duration: 20, 
                      ease: "linear", 
                      repeat: Infinity 
                    }}
                  />
                </div>
                <motion.div 
                  className="flex flex-row items-center gap-3 relative z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="absolute -top-2 -left-2"
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ 
                      delay: 0.2, 
                      type: "spring",
                      stiffness: 260,
                      damping: 20 
                    }}
                  >
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-white dark:border-cool-950 bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-indigo-500/20 shadow-lg">
                        <AvatarFallback>
                          <motion.div
                            animate={{ 
                              rotateZ: [0, 10, -10, 0],
                            }}
                            transition={{ 
                              duration: 5, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <Sparkles className="h-6 w-6 text-white" />
                          </motion.div>
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className="absolute -right-1 -bottom-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full p-1 border-2 border-white dark:border-cool-950"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="h-3 w-3 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="ml-14"
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-medium text-cool-700 dark:text-cool-300">{t("chatbot.title")}</h3>
                    <p className="text-xs text-cool-500 dark:text-cool-400">{t("chatbot.subtitle")}</p>
                  </motion.div>
                </motion.div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 bg-cool-50/80 dark:bg-cool-900/50 backdrop-filter backdrop-blur-sm">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "spring", damping: 20 }}
                      >
                        {message.sender === "bot" && (
                          <motion.div 
                            className="h-6 w-6 mt-2 mr-2 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-white/50 dark:border-cool-950/50 shadow-sm"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Sparkles className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                        <motion.div
                          className={`max-w-[80%] rounded-lg p-3 backdrop-blur-sm ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                              : "bg-white/90 dark:bg-cool-800/90 text-cool-700 dark:text-cool-300 border border-cool-200/50 dark:border-cool-700/50"
                          }`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 20 }}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </motion.div>
                        {message.sender === "user" && (
                          <motion.div 
                            className="h-6 w-6 mt-2 ml-2 flex-shrink-0 rounded-full bg-gradient-to-br from-cool-600 to-cool-400 flex items-center justify-center border border-white/50 dark:border-cool-950/50 shadow-sm"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <span className="text-xs font-bold text-white">You</span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <motion.div
                      className="mb-4 flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <motion.div 
                        className="h-6 w-6 mt-2 mr-2 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-white/50 dark:border-cool-950/50 shadow-sm"
                      >
                        <Sparkles className="h-3 w-3 text-white" />
                      </motion.div>
                      <div className="max-w-[80%] rounded-lg p-3 bg-white/90 dark:bg-cool-800/90 border border-cool-200/50 dark:border-cool-700/50 text-cool-700 dark:text-cool-300">
                        <div className="flex items-center gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-indigo-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-indigo-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-indigo-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                          />
                          <span className="text-xs ml-2">{t("chatbot.typing")}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t border-cool-200/50 dark:border-cool-700/50 bg-white/90 dark:bg-cool-950/90">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={t("chatbot.placeholder")}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-1 bg-cool-50/50 dark:bg-cool-900/30 border-cool-200/50 dark:border-cool-700/50 focus-visible:ring-indigo-500"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isTyping || inputValue.trim() === ""}
                      className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white"
                    >
                      {isTyping ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Loader2 className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}