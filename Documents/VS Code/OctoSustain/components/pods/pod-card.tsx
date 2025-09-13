"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Pod {
  id: string
  name: string
  description: string
  memberCount: number
  members: Array<{ id: string; name: string; avatar: string }>
  isLive: boolean
  category: string
}

interface PodCardProps {
  pod: Pod
}

export function PodCard({ pod }: PodCardProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  const handleJoinPod = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsJoining(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setHasJoined(true)
    setIsJoining(false)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-bold text-balance">{pod.name}</CardTitle>
              {pod.isLive && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
                </div>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {pod.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed line-clamp-3">{pod.description}</CardDescription>

        {/* Member avatars */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {pod.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-primary/20">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {pod.memberCount > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">+{pod.memberCount - 3}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{pod.memberCount} members</span>
          </div>
        </div>

        {/* Action button */}
        {hasJoined ? (
          <Link href={`/dashboard/${pod.id}`} className="block">
            <Button className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold transition-all duration-300 group-hover:scale-[1.02]">
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        ) : (
          <Button
            onClick={handleJoinPod}
            disabled={isJoining}
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold transition-all duration-300 group-hover:scale-[1.02]"
          >
            {isJoining ? "Joining..." : "Join Pod"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
