"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SectionDividerProps {
  variant?:
    | "waves"
    | "peaks"
    | "circuit"
    | "bubbles"
    | "hexagons"
    | "steps"
    | "zigzag"
    | "triangles"
    | "curves"
    | "slant"
    | "tilt"
    | "arrow"
    | "rounded"
    | "layered"
  flip?: boolean
  className?: string
  fillClassName?: string
  position?: "top" | "bottom"
  height?: number
}

export default function SectionDivider({
  variant = "waves",
  flip = false,
  className,
  fillClassName = "fill-background dark:fill-background fill-sky-300/20 dark:fill-divider",
  position = "bottom",
  height = 50,
}: SectionDividerProps) {
  const dividers = {
    waves: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,40c80,10,240,40,400,0c160-40,320-40,480,0c160,40,240,10,320,0v80H0V40z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    peaks: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0 L120,20 L240,0 L360,40 L480,10 L600,60 L720,30 L840,70 L960,40 L1080,80 L1200,50 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    bubbles: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,60 C30,70 70,80 100,70 C130,60 170,40 200,50 C230,60 270,80 300,70 C330,60 370,40 400,50 C430,60 470,80 500,70 C530,60 570,40 600,50 C630,60 670,80 700,70 C730,60 770,40 800,50 C830,60 870,80 900,70 C930,60 970,40 1000,50 C1030,60 1070,80 1100,70 C1130,60 1170,40 1200,50 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    circuit: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,60 L100,60 L100,40 L200,40 L200,60 L300,60 L300,20 L400,20 L400,60 L500,60 L500,40 L600,40 L600,60 L700,60 L700,20 L800,20 L800,60 L900,60 L900,40 L1000,40 L1000,60 L1100,60 L1100,20 L1200,20 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    hexagons: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,60 L50,40 L100,60 L150,40 L200,60 L250,40 L300,60 L350,40 L400,60 L450,40 L500,60 L550,40 L600,60 L650,40 L700,60 L750,40 L800,60 L850,40 L900,60 L950,40 L1000,60 L1050,40 L1100,60 L1150,40 L1200,60 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    steps: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,40 L200,40 L200,20 L400,20 L400,40 L600,40 L600,20 L800,20 L800,40 L1000,40 L1000,20 L1200,20 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    zigzag: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
        height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0 L120,40 L240,0 L360,40 L480,0 L600,40 L720,0 L840,40 L960,0 L1080,40 L1200,0 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    triangles: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0 L300,60 L600,0 L900,60 L1200,0 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    curves: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0 C300,120 900,-40 1200,100 L1200,120 L0,120 Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
    ),
    slant: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M1200 0L0 0 892.25 114.72 1200 0z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        ></motion.path>
      </motion.svg>
    ),
    tilt: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        ></motion.path>
      </motion.svg>
    ),
    arrow: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M649.97 0L550.03 0 599.91 54.12 649.97 0z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        ></motion.path>
      </motion.svg>
    ),
    rounded: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
        ></motion.path>
        <motion.path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        ></motion.path>
        <motion.path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        ></motion.path>
      </motion.svg>
    ),
    layered: (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(`w-full`, className)}
height={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          opacity=".25"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
        ></motion.path>
        <motion.path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          opacity=".5"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        ></motion.path>
        <motion.path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          className={fillClassName}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        ></motion.path>
      </motion.svg>
    ),
  }

  const positionClass = position === "top" ? "top-0 -mt-1" : "bottom-0 -mb-1"

  return (
    <div className={cn("absolute left-0 right-0 w-full overflow-hidden", positionClass, flip ? "rotate-180" : "")}>
      {dividers[variant]}
    </div>
  )
}

