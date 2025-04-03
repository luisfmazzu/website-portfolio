import type React from "react"
import "@/app/globals.css"
import "@/app/animations.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/app/components/theme-provider"
import { TranslationProvider } from "@/hooks/use-translation"
import Header from "@/app/containers/header"
import Footer from "@/app/containers/footer"
import Chatbot from "@/app/containers/chatbot/chatbot"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: {
    default: "Luis Ortiz | Senior Full Stack Engineer",
    template: "%s | Luis Ortiz Portfolio",
  },
  description:
    "A reliable problem solver who bridges technical execution and business needs, crafting efficient software while leading high-performing teams.",
  keywords: [
    "web developer",
    "python developer",
    "backend developer",
    "frontend developer",
    "fullstack developer",
    "back end developer",
    "front end developer",
    "full stack developer",
    "blockchain developer",
    "C# developer",
    ".NET developer",
    "cloud developer",
    "React developer",
    "Golang developer",
    "API developer",
    "web enginneer",
    "python enginneer",
    "backend enginneer",
    "frontend enginneer",
    "fullstack enginneer",
    "back end enginneer",
    "front end enginneer",
    "full stack enginneer",
    "blockchain enginneer",
    "C# enginneer",
    ".NET enginneer",
    "cloud enginneer",
    "React enginneer",
    "Golang enginneer",
    "API developer",
    "API enginneer",
    "node.js developer",
    "node.js enginneer",
    "node developer",
    "node enginneer",
    "software engineer",
    "software developer",
    "Next.js",
    "portfolio",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Luis Ortiz", url: "https://luisfmazzu.com" }],
  creator: "Luis Ortiz",
  publisher: "Luis Ortiz",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://luisfmazzu.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luisfmazzu.com",
    title: "Luis Ortiz | Senior Full Stack Engineer",
    description:
      "A reliable problem solver who bridges technical execution and business needs, crafting efficient software while leading high-performing teams.",
    siteName: "Luis Ortiz Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luis Ortiz Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luis Ortiz | Senior Full Stack Engineer",
    description:
      "A reliable problem solver who bridges technical execution and business needs, crafting efficient software while leading high-performing teams.",
    creator: "@luisfmazzu",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-512x512.png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192x192.png", sizes: "192x192" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google for reCAPTCHA */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="" />

        {/* Structured data for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Luis Ortiz",
              url: "https://Luis Ortiz.com",
              jobTitle: "Senior Full Stack Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Self-employed",
              },
              sameAs: [
                "https://github.com/luisfmazzu",
                "https://linkedin.com/in/luisfmazzu",
                "https://twitter.com/luisfmazzu",
              ],
              knowsAbout: [
                "Web Development",
                "React",
                "Next.js",
                "JavaScript",
                "TypeScript",
                "Python",
                "Back end",
                "Front end",
                "Full Stack",
                "Blockchain",
                "C#",
                ".NET",
                "Cloud",
                "AWS",
                "Golang",
                "API",
                "Node.js",
                "Software",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TranslationProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Chatbot />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

