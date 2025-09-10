"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, Trophy, CheckCircle, Play, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface Challenge {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  duration: number
  timeLeft: number
  participants: number
  podProgress: number
  userJoined: boolean
  userCompleted: boolean
  points: number
  icon: string
}

interface ChallengeCardProps {
  challenge: Challenge
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [isJoining, setIsJoining] = useState(false)
  const [userJoined, setUserJoined] = useState(challenge.userJoined)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTimeLeft = (timeLeft: number) => {
    if (timeLeft <= 0) return "Completed"

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const isUrgent = challenge.timeLeft > 0 && challenge.timeLeft < 24 * 60 * 60 * 1000
  const isCompleted = challenge.timeLeft <= 0 || challenge.userCompleted

  const handleJoinChallenge = async () => {
    setIsJoining(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUserJoined(true)
    setIsJoining(false)
  }

  const handleViewProgress = () => {
    router.push(`/challenges/${challenge.id}`)
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 ${
        isCompleted
          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
          : isUrgent
            ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
            : "hover:border-primary/30"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="text-2xl">{challenge.icon}</div>
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-lg font-bold text-balance">{challenge.name}</CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-3">{challenge.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Challenge stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{challenge.participants} joined</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span>{challenge.points} points</span>
          </div>
        </div>

        {/* Time left */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className={isUrgent ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"}>
                {formatTimeLeft(challenge.timeLeft)}
              </span>
            </div>
            {!isCompleted && (
              <div className="text-xs text-muted-foreground">
                {Math.round((1 - challenge.timeLeft / challenge.duration) * 100)}% elapsed
              </div>
            )}
          </div>

          {!isCompleted && (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${isUrgent ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${Math.round((1 - challenge.timeLeft / challenge.duration) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Pod progress */}
        {userJoined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pod Progress</span>
              <span className="font-medium">{challenge.podProgress}%</span>
            </div>
            <Progress value={challenge.podProgress} className="h-2" />
          </div>
        )}

        {/* Action button */}
        <div className="pt-2">
          {isCompleted ? (
            <Button disabled className="w-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="mr-2 h-4 w-4" />
              {challenge.userCompleted ? "Completed" : "Challenge Ended"}
            </Button>
          ) : userJoined ? (
            <Button
              onClick={handleViewProgress}
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Progress
            </Button>
          ) : (
            <Button
              onClick={handleJoinChallenge}
              disabled={isJoining}
              className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold transition-all duration-300 group-hover:scale-[1.02]"
            >
              {isJoining ? (
                "Joining..."
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Join Challenge
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
