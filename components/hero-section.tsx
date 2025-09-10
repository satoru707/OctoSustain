"use client"

import { Button } from "@/components/ui/button"
import { AnimatedOctopus } from "@/components/animated-octopus"
import { ArrowRight, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function HeroSection() {
  const router = useRouter()
  const [showDemo, setShowDemo] = useState(false)

  const handleGetStarted = () => {
    router.push("/auth/signup")
  }

  const handleWatchDemo = () => {
    setShowDemo(true)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950" />

      {/* Floating eco elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-float opacity-60" />
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-emerald-300 rounded-full animate-float opacity-40"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-5 h-5 bg-teal-400 rounded-full animate-float opacity-50"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-3 h-3 bg-green-500 rounded-full animate-float opacity-70"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                <span className="text-foreground">Track Your </span>
                <span className="text-primary">Eco-Impact</span>
                <span className="text-foreground"> with </span>
                <span className="text-primary">OctoPods</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-secondary">Multitask Like an Octopus! 🐙🌱</h2>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl">
              Join teams to log energy, waste, transport in real-time—save the planet, earn ink points! Collaborate with
              your pod to make a meaningful environmental impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                onClick={handleWatchDemo}
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">CO2 Saved (kg)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Pods</div>
              </div>
            </div>
          </div>

          {/* Right side - Animated Octopus */}
          <div className="flex justify-center lg:justify-end">
            <AnimatedOctopus />
          </div>
        </div>
      </div>

      {showDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">OctoSustain Demo</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              <Play className="w-16 h-16 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              Watch how OctoSustain helps teams track their environmental impact in real-time with our intelligent
              octopus-powered platform.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowDemo(false)} variant="outline" className="flex-1">
                Close
              </Button>
              <Button onClick={handleGetStarted} className="flex-1">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
