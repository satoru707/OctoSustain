"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Zap } from "lucide-react"
import { toast } from "sonner"

export function DemoLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "demo@octosustain.com",
          password: "demo123",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Welcome to the demo! 🐙")
        router.push("/pods")
      } else {
        toast.error(data.error || "Demo login failed")
      }
    } catch (error) {
      toast.error("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDemoLogin}
      disabled={isLoading}
      variant="outline"
      className="w-full border-eco-primary/20 text-eco-primary hover:bg-eco-primary/5 bg-transparent"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
      Try Demo Account
    </Button>
  )
}
