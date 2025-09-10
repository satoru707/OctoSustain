"use client"

import { useEffect, useState } from "react"

export function SuccessConfetti() {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; rotation: number; delay: number }>
  >([])

  useEffect(() => {
    // Generate leaf particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles([])
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-4 h-4 animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full text-green-500 fill-current">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
      ))}

      {/* Success message overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <p className="font-semibold">Welcome to OctoSustain! 🌱</p>
        </div>
      </div>
    </div>
  )
}
