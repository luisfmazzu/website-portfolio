"use client"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Mail, MapPin, Phone, Send, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/app/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/form"
import { Input } from "@/app/components/input"
import { Textarea } from "@/app/components/textarea"
import { toast } from "@/app/components/use-toast"
import SectionObserver from "@/app/components/section-observer"
import SectionDivider from "@/app/components/section-divider"
import { motion, useInView } from "framer-motion"
import { Alert, AlertDescription } from "@/app/components/alert"
import dynamic from "next/dynamic"
import { useTranslation } from "@/hooks/use-translation"

// Dynamically import ReCAPTCHA with no SSR to avoid hydration issues
const ReCAPTCHA : any = dynamic(() => import("react-google-recaptcha"), { ssr: false })

// Use reCAPTCHA site key from public environment variables
// Note: Client components need NEXT_PUBLIC_ prefix to access env vars
const recaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  recaptcha: z.string().optional().refine(val => !!val, {
    message: "Please complete the reCAPTCHA verification."
  }),
})

export default function Contact() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  const [phoneNumberCopied, setPhoneNumberCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [recaptchaError, setRecaptchaError] = useState(false)
  const recaptchaRef = useRef<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      recaptcha: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    let emailSent = false;
    let errorMessage = '';

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Call our server-side API route instead of directly calling Resend
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = await response.json();
      
      if (response.ok) {
        emailSent = true;
      } else {
        errorMessage = result.error || 'Failed to send email';
      }
    } catch (error: any) {
      // Check if it's an abort error (timeout)
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = error.message || 'An unknown error occurred';
      }
      console.error('Error sending email:', error);
    } finally {
      // Reset form state immediately rather than in a timeout
      setIsSubmitting(false);
      
      // Only update success state if email was actually sent
      if (emailSent) {
        setIsSubmitSuccessful(true);
        form.reset();
      }
      
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaVerified(false);

      // Show appropriate toast notification
      if (emailSent) {
        toast({
          title: t("contact.toast.success.title") || "Message sent successfully!",
          description: t("contact.toast.success.description") || "Thank you for your message. I'll get back to you soon.",
          variant: "default",
        });
      } else {
        toast({
          title: t("contact.toast.error.title") || "Failed to send message",
          description: errorMessage || t("contact.toast.error.description") || "Please try again or contact me directly.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaVerified(true)
      form.setValue("recaptcha", token);
    } else {
      setRecaptchaVerified(false)
      form.setValue("recaptcha", "");
    }
  }

  const handleRecaptchaError = () => {
    setRecaptchaError(true)
    setRecaptchaVerified(false)
  }

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text).then(
      () => {
        if (type === "phone") {
          setPhoneNumberCopied(true)
          toast({
            title: "Phone number copied!",
            description: "Phone number copied to clipboard.",
          })
        } else {
          setEmailCopied(true)
          toast({
            title: "Email copied!",
            description: "Email address copied to clipboard.",
          })
        }
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        })
      },
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-gradient-to-br from-cool-50 to-indigo-50 dark:from-cool-950 dark:to-indigo-950 px-4 py-24 md:px-8"
    >
      <SectionDivider variant="zigzag" position="top" height={30} flip={true} />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.1),transparent_70%)]" />

      <div className="container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl gradient-text">{t("contact.title")}</h2>
          <p className="mt-4 text-muted-foreground">
            {t("contact.description")}
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card cool-shadow border-cool-200 dark:border-cool-800 h-full hover:translate-y-[-5px] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  <Phone className="h-6 w-6 text-indigo-500" />
                </motion.div>
                <div>
                  <CardTitle className="text-cool-700 dark:text-cool-300">{t("contact.phone.title")}</CardTitle>
                  <CardDescription>{t("contact.phone.description")}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="flex items-center justify-between w-full">
                  <p className="text-lg text-cool-700 dark:text-cool-300">+55 (41) 99700-3955</p>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("+55(41)997003955", "phone")}
                      className="ml-2"
                    >
                      {phoneNumberCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-cool-500" />
                      )}
                      <span className="sr-only">Copy phone number</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card cool-shadow border-cool-200 dark:border-cool-800 h-full hover:translate-y-[-5px] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    delay: 0.5,
                  }}
                >
                  <Mail className="h-6 w-6 text-indigo-500" />
                </motion.div>
                <div>
                  <CardTitle className="text-cool-700 dark:text-cool-300">{t("contact.email.title")}</CardTitle>
                  <CardDescription>{t("contact.email.description")}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="flex items-center justify-between w-full">
                  <p className="text-lg text-cool-700 dark:text-cool-300">luisfmazzu@gmail.com</p>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("luisfmazzu@gmail.com", "email")}
                      className="ml-2"
                    >
                      {emailCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-cool-500" />
                      )}
                      <span className="sr-only">Copy email address</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card cool-shadow border-cool-200 dark:border-cool-800 h-full hover:translate-y-[-5px] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    delay: 1,
                  }}
                >
                  <MapPin className="h-6 w-6 text-indigo-500" />
                </motion.div>
                <div>
                  <CardTitle className="text-cool-700 dark:text-cool-300">{t("contact.location.title")}</CardTitle>
                  <CardDescription>{t("contact.location.description")}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-cool-700 dark:text-cool-300">Curitiba, BR</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <SectionObserver animation="flip-in" delay={300}>
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mx-auto max-w-2xl glass-card cool-shadow-lg border-cool-200 dark:border-cool-800">
              <CardHeader>
                <CardTitle className="text-cool-700 dark:text-cool-300">{t("contact.form.title")}</CardTitle>
                <CardDescription>{t("contact.form.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  {isSubmitSuccessful ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8 text-center"
                    >
                      <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-xl font-medium text-cool-700 dark:text-cool-300">
                        {t("contact.form.success.title") || "Message Sent Successfully!"}
                      </h3>
                      <p className="text-muted-foreground">
                        {t("contact.form.success.description") || "Thank you for reaching out. I'll get back to you as soon as possible."}
                      </p>
                      <Button
                        className="mt-6 bg-gradient-to-r from-cool-600 to-indigo-600 hover:from-cool-700 hover:to-indigo-700"
                        onClick={() => setIsSubmitSuccessful(false)}
                      >
                        {t("contact.form.success.newMessage") || "Send Another Message"}
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <motion.div
                        className="grid gap-4 sm:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                      >
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-cool-700 dark:text-cool-300">{t("contact.form.name")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("contact.form.name")}
                                    {...field}
                                    className="bg-white/50 dark:bg-cool-900/20 border-cool-200 dark:border-cool-800"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-cool-700 dark:text-cool-300">{t("contact.form.email")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("contact.form.email")}
                                    {...field}
                                    className="bg-white/50 dark:bg-cool-900/20 border-cool-200 dark:border-cool-800"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-cool-700 dark:text-cool-300">{t("contact.form.subject")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("contact.form.subject")}
                                  {...field}
                                  className="bg-white/50 dark:bg-cool-900/20 border-cool-200 dark:border-cool-800"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-cool-700 dark:text-cool-300">{t("contact.form.message")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t("contact.form.message")}
                                  rows={5}
                                  {...field}
                                  className="bg-white/50 dark:bg-cool-900/20 border-cool-200 dark:border-cool-800"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      {/* reCAPTCHA */}
                      <motion.div variants={itemVariants} className="flex justify-center">
                        <FormField
                          control={form.control}
                          name="recaptcha"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="recaptcha-container">
                                  <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={recaptchaSiteKey}
                                    onChange={(token: string | null) => {
                                      handleRecaptchaChange(token);
                                      field.onChange(token || "");
                                    }}
                                    onError={handleRecaptchaError}
                                    theme="light"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {recaptchaError && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              There was an error loading the reCAPTCHA. Please refresh the page and try again.
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ scale: recaptchaVerified ? 1.02 : 1 }}
                          whileTap={{ scale: recaptchaVerified ? 0.98 : 1 }}
                          className="w-full"
                        >
                          <Button
                            type="submit"
                            className={`w-full bg-gradient-to-r from-cool-600 to-indigo-600 hover:from-cool-700 hover:to-indigo-700 transition-all duration-300 ${!recaptchaVerified ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting || !recaptchaVerified}
                          >
                            {isSubmitting ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                </motion.div>
                                {t("contact.form.sending")}
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" /> {t("contact.form.submit")}
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>

                      {!recaptchaVerified && (
                        <p className="text-sm text-center text-muted-foreground">
                          Please complete the reCAPTCHA verification to enable the send buttons.
                        </p>
                      )}
                    </form>
                  )}
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </SectionObserver>
      </div>
    </section>
  )
}

