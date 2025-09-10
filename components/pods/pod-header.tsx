"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Share2, Check } from "lucide-react"

interface PodHeaderProps {
  podId: string
}

// Mock data - in real app this would be fetched based on podId
const mockPodData = {
  name: "Green Office Warriors",
  description: "Reducing our workplace carbon footprint through energy tracking and waste reduction initiatives.",
  memberCount: 12,
  members: [
    { id: "1", name: "Alice Johnson", avatar: "/diverse-woman-portrait.png", role: "Admin" },
    { id: "2", name: "Bob Smith", avatar: "/thoughtful-man.png", role: "Member" },
    { id: "3", name: "Carol Davis", avatar: "/diverse-woman-portrait.png", role: "Member" },
    { id: "4", name: "David Wilson", avatar: "/thoughtful-man.png", role: "Member" },
    { id: "5", name: "Emma Brown", avatar: "/diverse-woman-portrait.png", role: "Member" },
  ],
  isLive: true,
  category: "Workplace",
}

export function PodHeader({ podId }: PodHeaderProps) {
  const [copied, setCopied] = useState(false)
  const pod = mockPodData

  const handleCopyInvite = async () => {
    const inviteLink = `${window.location.origin}/pods/${podId}/invite`
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left side - Pod info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{pod.name}</h1>
                {pod.isLive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">{pod.description}</p>
            </div>

            {/* Member list */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{pod.memberCount} Members</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {pod.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member.name}</span>
                    {member.role === "Admin" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Admin
                      </Badge>
                    )}
                  </div>
                ))}
                {pod.memberCount > pod.members.length && (
                  <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                    <span className="text-sm text-muted-foreground">+{pod.memberCount - pod.members.length} more</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCopyInvite}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Invite Members
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
