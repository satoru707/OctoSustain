"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Clock, Lightbulb, FileText, Crown, Medal, Award } from "lucide-react"

// Mock data
const leaderboardData = [
  { id: "1", name: "Alice Johnson", points: 2450, avatar: "/diverse-woman-portrait.png", rank: 1 },
  { id: "2", name: "Bob Smith", points: 2380, avatar: "/thoughtful-man.png", rank: 2 },
  { id: "3", name: "Carol Davis", points: 2290, avatar: "/diverse-woman-portrait.png", rank: 3 },
  { id: "4", name: "David Wilson", points: 2150, avatar: "/thoughtful-man.png", rank: 4 },
  { id: "5", name: "Emma Brown", points: 2050, avatar: "/diverse-woman-portrait.png", rank: 5 },
]

const activeChallenges = [
  { id: "1", name: "No Plastic Week", timeLeft: 2 * 24 * 60 * 60 * 1000, progress: 75 },
  { id: "2", name: "Energy Saver", timeLeft: 5 * 24 * 60 * 60 * 1000, progress: 45 },
  { id: "3", name: "Green Commute", timeLeft: 1 * 24 * 60 * 60 * 1000, progress: 90 },
]

export function GamificationSidebar() {
  const [currentTime, setCurrentTime] = useState(Date.now())
  const userPoints = 2380 // Mock user points

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTimeLeft = (timeLeft: number) => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Ink Points */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-emerald-50 dark:from-primary/20 dark:to-emerald-950/50">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-2 p-3 bg-primary/20 rounded-full w-fit">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">{userPoints.toLocaleString()}</CardTitle>
          <CardDescription className="font-medium">Ink Points</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            Eco Warrior Level
          </Badge>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Pod Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboardData.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                member.points === userPoints ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-center w-6">{getRankIcon(member.rank)}</div>

              <Avatar className="w-8 h-8">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.points.toLocaleString()} points</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Active Challenges
          </CardTitle>
          <CardDescription>Join before time runs out!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeChallenges.map((challenge) => {
            const timeLeft = challenge.timeLeft - (currentTime % challenge.timeLeft)
            const isUrgent = timeLeft < 24 * 60 * 60 * 1000 // Less than 24 hours

            return (
              <div key={challenge.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{challenge.name}</h4>
                  <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
                    {formatTimeLeft(timeLeft)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Predictive Tip */}
      <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Lightbulb className="h-5 w-5" />
            Smart Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
            Save 10% more energy next week! 🌿 Based on your current usage patterns, reducing screen time by 30 minutes
            daily could cut your energy consumption significantly.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100 bg-transparent"
          >
            Learn More
          </Button>
        </CardContent>
      </Card>

      {/* Generate Report */}
      <Card>
        <CardContent className="p-4">
          <Button className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
