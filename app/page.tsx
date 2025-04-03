import type { Metadata } from "next"
import ClientPage from "./ClientPage"
import PacmanCursor from "@/app/components/pacman-cursor"
import PacmanGhosts from "@/app/components/pacman-ghost"
import PacmanToggle from "@/app/components/pacman-toggle"
import HomePage from "@/app/components/home-page"

export const metadata: Metadata = {
  title: "Luis Ortiz | Full Stack Engineer",
  description: "Full Stack Engineer specialized in building modern, high-performance web applications with Next.js, React, TypeScript and Node.js.",
  openGraph: {
    title: "Luis Ortiz | Senior Full Stack Engineer",
    description: "Welcome to my portfolio. I'm a senior full stack engineer that values writing clean, efficient, and maintainable code.",
    url: "https://luismatosgarcia.me/",
    siteName: "Luis Ortiz Portfolio",
    locale: "en_US",
    type: "website",
  },
}

export default function Home() {
  return <HomePage />;
}

