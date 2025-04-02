import { cn } from "@/lib/utils"

interface SectionTransitionProps {
  className?: string
  variant?: "fade" | "blur" | "gradient" | "slide" | "none"
  direction?: "up" | "down" | "left" | "right"
  color?: string
}

export default function SectionTransition({
  className,
  variant = "gradient",
  direction = "up",
  color = "from-cool-500/20 via-indigo-500/20 to-teal-500/20",
}: SectionTransitionProps) {
  if (variant === "none") {
    return null
  }

  const getTransitionStyles = () => {
    const baseStyles = "absolute inset-x-0 h-24 pointer-events-none"

    switch (variant) {
      case "fade":
        return cn(
          baseStyles,
          "bg-gradient-to-b from-background to-transparent",
          direction === "up" ? "bottom-0 rotate-180" : "top-0",
          className,
        )
      case "blur":
        return cn(baseStyles, "backdrop-blur-lg bg-background/10", direction === "up" ? "bottom-0" : "top-0", className)
      case "gradient":
        return cn(
          baseStyles,
          `bg-gradient-to-b ${color}`,
          direction === "up" ? "bottom-0 rotate-180" : "top-0",
          className,
        )
      case "slide":
        return cn(
          baseStyles,
          "bg-gradient-to-b from-background to-transparent",
          direction === "up" ? "bottom-0 rotate-180" : "top-0",
          className,
        )
      default:
        return ""
    }
  }

  return <div className={getTransitionStyles()} />
}

