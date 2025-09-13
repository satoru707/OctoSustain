"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Leaf, Zap, Car, Droplets, Utensils, Star, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  userId: string
  username: string
  action: string
  category: string
  details: any
  timestamp: Date
}

interface LiveActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

const categoryIcons = {
  energy: Zap,
  waste: Leaf,
  transport: Car,
  water: Droplets,
  food: Utensils,
  challenge: Star,
}

const categoryColors = {
  energy: "bg-yellow-500",
  waste: "bg-green-500",
  transport: "bg-blue-500",
  water: "bg-cyan-500",
  food: "bg-orange-500",
  challenge: "bg-purple-500",
}

export function LiveActivityFeed({ activities, className }: LiveActivityFeedProps) {
  const [displayActivities, setDisplayActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Animate new activities in
    activities.forEach((activity, index) => {
      setTimeout(() => {
        setDisplayActivities((prev) => {
          if (prev.find((a) => a.id === activity.id)) return prev
          return [activity, ...prev.slice(0, 19)] // Keep last 20
        })
      }, index * 100) // Stagger animations
    })
  }, [activities])

  const getActivityIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || Star
    return Icon
  }

  const getActivityColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || "bg-gray-500"
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Live Activity Feed</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-3">
          {displayActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.category)
            const colorClass = getActivityColor(activity.category)

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 animate-in slide-in-from-top-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/avatars/${activity.userId}.jpg`} />
                      <AvatarFallback className="text-xs">{activity.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{activity.username}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-1">{activity.action}</p>

                  {activity.details && (
                    <div className="text-xs text-muted-foreground">
                      {activity.details.co2Saved && (
                        <span className="text-green-600 font-medium">+{activity.details.co2Saved}kg CO2 saved</span>
                      )}
                      {activity.details.points && (
                        <span className="ml-2 text-eco-primary font-medium">+{activity.details.points} points</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {displayActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Activity from your pod members will appear here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
