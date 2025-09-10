"use client"

import { useState, useEffect } from "react"

// Mock data for tentacle progress
const tentacleData = [
  { name: "Energy", progress: 75, color: "#22c55e", icon: "⚡" },
  { name: "Waste", progress: 60, color: "#16a34a", icon: "🗑️" },
  { name: "Transport", progress: 45, color: "#15803d", icon: "🚗" },
  { name: "Water", progress: 80, color: "#166534", icon: "💧" },
  { name: "Food", progress: 55, color: "#14532d", icon: "🍃" },
  { name: "Custom", progress: 30, color: "#052e16", icon: "📊" },
]

export function OctopusVisualization() {
  const [animationTrigger, setAnimationTrigger] = useState(0)

  // Simulate tentacle growth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger((prev) => prev + 1)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-96 h-96 mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
        {/* Main octopus body */}
        <ellipse
          cx="200"
          cy="160"
          rx="60"
          ry="45"
          fill="url(#bodyGradient)"
          className="animate-float"
          style={{ transformOrigin: "200px 160px" }}
        />

        {/* Eyes */}
        <circle cx="180" cy="145" r="12" fill="white" />
        <circle cx="220" cy="145" r="12" fill="white" />
        <circle cx="180" cy="145" r="6" fill="#1f2937" />
        <circle cx="220" cy="145" r="6" fill="#1f2937" />

        {/* Animated tentacles with progress bars */}
        <g className="animate-tentacle">
          {tentacleData.map((tentacle, index) => {
            const angle = index * 60 - 150 // Spread tentacles around
            const startX = 200 + Math.cos((angle * Math.PI) / 180) * 50
            const startY = 200 + Math.sin((angle * Math.PI) / 180) * 30
            const endX = 200 + Math.cos((angle * Math.PI) / 180) * 150
            const endY = 280 + Math.sin((angle * Math.PI) / 180) * 80

            return (
              <g key={tentacle.name}>
                {/* Tentacle base */}
                <path
                  d={`M${startX},${startY} Q${startX + (endX - startX) * 0.5},${
                    startY + (endY - startY) * 0.7
                  } ${endX},${endY}`}
                  stroke="#3b826b"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Progress fill */}
                <path
                  d={`M${startX},${startY} Q${startX + (endX - startX) * 0.5},${
                    startY + (endY - startY) * 0.7
                  } ${startX + (endX - startX) * (tentacle.progress / 100)},${
                    startY + (endY - startY) * (tentacle.progress / 100)
                  }`}
                  stroke={tentacle.color}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    strokeDasharray: "200",
                    strokeDashoffset: animationTrigger % 2 === 0 ? "0" : "20",
                  }}
                />

                {/* Tentacle tip with icon */}
                <circle cx={endX} cy={endY} r="20" fill={tentacle.color} opacity="0.8" />
                <text
                  x={endX}
                  y={endY + 6}
                  textAnchor="middle"
                  fontSize="16"
                  className="pointer-events-none select-none"
                >
                  {tentacle.icon}
                </text>

                {/* Progress label */}
                <text
                  x={endX}
                  y={endY + 35}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  className="font-semibold"
                >
                  {tentacle.name}
                </text>
                <text x={endX} y={endY + 50} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">
                  {tentacle.progress}%
                </text>
              </g>
            )
          })}
        </g>

        {/* Gradients */}
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#74c69d" />
            <stop offset="70%" stopColor="#3b826b" />
            <stop offset="100%" stopColor="#2d6a4f" />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>
    </div>
  )
}
