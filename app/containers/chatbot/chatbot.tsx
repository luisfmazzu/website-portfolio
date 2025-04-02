"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Loader2, Bot } from "lucide-react"
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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate bot response
    setTimeout(
      () => {
        const botResponse = generateBotResponse(inputValue)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Simple keyword matching for demo purposes
    if (input.includes("experience") || input.includes("work")) {
      return t("chatbot.experience")
    } else if (input.includes("skill") || input.includes("technology") || input.includes("tech stack")) {
      return t("chatbot.skills")
    } else if (input.includes("freelance") || input.includes("hire") || input.includes("project")) {
      return t("chatbot.freelance")
    } else if (input.includes("contact") || input.includes("email") || input.includes("phone")) {
      return t("chatbot.contact")
    } else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return t("chatbot.greeting")
    } else if (input.includes("thank")) {
      return t("chatbot.thanks")
    } else {
      return t("chatbot.fallback")
    }
  }

  // Animation variants
  const chatButtonVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    tap: { scale: 0.9 },
    hover: { scale: 1.1, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" },
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

  return (
    <>
      {/* Chat button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial="initial"
        animate="animate"
        whileTap="tap"
        whilehover="hover"
        variants={chatButtonVariants}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full shadow-lg ${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"}`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageSquare className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
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
            <Card className="border-cool-200 dark:border-cool-800 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cool-500 to-indigo-500 text-white p-4 flex flex-row items-center gap-3">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Bot" />
                    <AvatarFallback className="bg-indigo-700">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <h3 className="font-medium">{t("chatbot.title")}</h3>
                  <p className="text-xs text-indigo-100">{t("chatbot.subtitle")}</p>
                </motion.div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 bg-cool-50/50 dark:bg-cool-900/20">
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
                        <motion.div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-indigo-500 text-white"
                              : "bg-white dark:bg-cool-800 text-cool-700 dark:text-cool-300"
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
                      <div className="max-w-[80%] rounded-lg p-3 bg-white dark:bg-cool-800 text-cool-700 dark:text-cool-300">
                        <div className="flex items-center gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-cool-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-cool-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-cool-400"
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
              <CardFooter className="p-3 border-t border-cool-200 dark:border-cool-800 bg-white dark:bg-cool-950">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={t("chatbot.placeholder")}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-1 bg-cool-50 dark:bg-cool-900/50 border-cool-200 dark:border-cool-800"
                  />
                  <motion.div whilehover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isTyping || inputValue.trim() === ""}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {isTyping ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Loader2 className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Send className="h-4 w-4" />
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

