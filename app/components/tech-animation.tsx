"use client"

import { useEffect, useRef } from "react"

export default function TechAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Define colors with more vibrant options
    const colors = [
      "#4338ca", // indigo
      "#6366f1", // cool blue
      "#14b8a6", // teal
      "#a855f7", // purple
      "#3b82f6", // blue
      "#10b981", // emerald
      "#ec4899", // pink
    ]

    // Create particles
    const particles = []
    const particleCount = 100
    const shapes = ["circle", "square", "triangle", "diamond", "star"]

    class Particle {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      shape: string
      rotation: number
      rotationSpeed: number
      opacity: number
      trail: Array<{ x: number; y: number; size: number; opacity: number }>

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 15 + 5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.speedX = (Math.random() - 0.5) * 1.5
        this.speedY = (Math.random() - 0.5) * 1.5
        this.shape = shapes[Math.floor(Math.random() * shapes.length)]
        this.rotation = 0
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.opacity = Math.random() * 0.5 + 0.3
        this.trail = []
      }

      update() {
        // Add current position to trail
        this.trail.push({
          x: this.x,
          y: this.y,
          size: this.size,
          opacity: this.opacity * 0.5,
        })

        // Limit trail length
        if (this.trail.length > 10) {
          this.trail.shift()
        }

        // Update position
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        // Draw trail
        this.trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (index / this.trail.length)
          ctx.save()
          ctx.globalAlpha = trailOpacity
          ctx.translate(point.x, point.y)
          ctx.fillStyle = this.color

          const trailSize = point.size * (index / this.trail.length)
          drawShape(this.shape, trailSize, ctx)

          ctx.restore()
        })

        // Draw particle
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = this.color

        drawShape(this.shape, this.size, ctx)

        ctx.restore()
      }
    }

    function drawShape(shape: string, size: number, ctx: CanvasRenderingContext2D) {
      switch (shape) {
        case "circle":
          ctx.beginPath()
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
          ctx.fill()
          break

        case "square":
          ctx.fillRect(-size / 2, -size / 2, size, size)
          break

        case "triangle":
          ctx.beginPath()
          ctx.moveTo(0, -size / 2)
          ctx.lineTo(size / 2, size / 2)
          ctx.lineTo(-size / 2, size / 2)
          ctx.closePath()
          ctx.fill()
          break

        case "diamond":
          ctx.beginPath()
          ctx.moveTo(0, -size / 2)
          ctx.lineTo(size / 2, 0)
          ctx.lineTo(0, size / 2)
          ctx.lineTo(-size / 2, 0)
          ctx.closePath()
          ctx.fill()
          break

        case "star":
          const spikes = 5
          const outerRadius = size / 2
          const innerRadius = size / 4

          ctx.beginPath()
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (Math.PI * 2 * i) / (spikes * 2)
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.closePath()
          ctx.fill()
          break
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      // Draw connections
      drawConnections()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" style={{ opacity: 0.8 }} />
}

