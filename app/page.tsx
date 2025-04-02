import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "Portfolio | Luis Ortiz",
  description:
    "Welcome to my portfolio. I'm a reliable problem solver who bridges technical execution and business needs, crafting efficient software while leading high-performing teams.",
  openGraph: {
    title: "Luis Ortiz | Senior Full Stack Engineer",
    description:
      "Welcome to my portfolio. I'm a reliable problem solver who bridges technical execution and business needs, crafting efficient software while leading high-performing teams.",
  },
}


export default function Home() {
  return <ClientPage />
}

