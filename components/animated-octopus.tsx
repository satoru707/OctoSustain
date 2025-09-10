"use client"

import { useEffect, useState } from "react"

export function AnimatedOctopus() {
  const [isWaving, setIsWaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true)
      setTimeout(() => setIsWaving(false), 2000)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-80 h-80 sm:w-96 sm:h-96">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main octopus body */}
        <ellipse cx="100" cy="80" rx="45" ry="35" fill="url(#octopusGradient)" className="animate-float" />

        {/* Eyes */}
        <circle cx="85" cy="70" r="8" fill="white" />
        <circle cx="115" cy="70" r="8" fill="white" />
        <circle cx="85" cy="70" r="4" fill="#1f2937" />
        <circle cx="115" cy="70" r="4" fill="#1f2937" />

        {/* Animated tentacles */}
        <g className={isWaving ? "animate-tentacle" : ""}>
          {/* Tentacle 1 */}
          <path
            d="M60 110 Q45 130 40 150 Q35 170 45 180"
            stroke="url(#tentacleGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentacle 2 */}
          <path
            d="M70 115 Q50 140 45 165 Q40 185 50 190"
            stroke="url(#tentacleGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentacle 3 */}
          <path
            d="M130 115 Q150 140 155 165 Q160 185 150 190"
            stroke="url(#tentacleGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentacle 4 */}
          <path
            d="M140 110 Q155 130 160 150 Q165 170 155 180"
            stroke="url(#tentacleGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentacle 5 */}
          <path
            d="M85 115 Q75 145 70 170 Q65 190 75 195"
            stroke="url(#tentacleGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tentacle 6 */}
          <path
            d="M115 115 Q125 145 130 170 Q135 190 125 195"
            stroke="url(#tentacleGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Leaf decorations on tentacle ends */}
        <g fill="url(#leafGradient)" opacity="0.8">
          <path d="M40 175 Q35 170 45 168 Q55 170 50 175 Q45 180 40 175" />
          <path d="M45 185 Q40 180 50 178 Q60 180 55 185 Q50 190 45 185" />
          <path d="M155 185 Q160 180 150 178 Q140 180 145 185 Q150 190 155 185" />
          <path d="M160 175 Q165 170 155 168 Q145 170 150 175 Q155 180 160 175" />
          <path d="M70 190 Q65 185 75 183 Q85 185 80 190 Q75 195 70 190" />
          <path d="M130 190 Q135 185 125 183 Q115 185 120 190 Q125 195 130 190" />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="octopusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b826b" />
            <stop offset="50%" stopColor="#74c69d" />
            <stop offset="100%" stopColor="#3b826b" />
          </linearGradient>

          <linearGradient id="tentacleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#74c69d" />
            <stop offset="100%" stopColor="#3b826b" />
          </linearGradient>

          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating particles around octopus */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
        <div
          className="absolute top-20 right-15 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-15 w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping opacity-50"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-1 h-1 bg-green-500 rounded-full animate-ping opacity-80"
          style={{ animationDelay: "0.5s" }}
        />
      </div>
    </div>
  )
}
