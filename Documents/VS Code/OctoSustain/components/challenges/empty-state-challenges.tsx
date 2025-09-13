import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, CheckCircle } from "lucide-react"
import { AnimatedOctopus } from "@/components/animated-octopus"

interface EmptyStateChallengesProps {
  filter: string
}

export function EmptyStateChallenges({ filter }: EmptyStateChallengesProps) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case "active":
        return {
          icon: Target,
          title: "No Active Challenges",
          message: "You haven't joined any challenges yet. Browse available challenges to start your eco journey!",
          quote: "Every small action creates ripples of change! 🐙",
        }
      case "available":
        return {
          icon: Trophy,
          title: "All Caught Up!",
          message: "You've joined all available challenges. Check back soon for new sustainability adventures!",
          quote: "You're an eco-champion! Keep up the amazing work! 🌟",
        }
      case "completed":
        return {
          icon: CheckCircle,
          title: "No Completed Challenges",
          message:
            "Complete your first challenge to see your achievements here. Every journey starts with a single step!",
          quote: "Success is the sum of small efforts repeated day in and day out! 🌱",
        }
      default:
        return {
          icon: Trophy,
          title: "No Challenges Available",
          message:
            "It looks like there are no challenges right now. Check back soon for exciting new sustainability challenges!",
          quote: "The best time to plant a tree was 20 years ago. The second best time is now! 🌳",
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md mx-auto text-center border-2 border-dashed border-primary/30">
        <CardContent className="p-8">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32">
              <AnimatedOctopus />
            </div>
          </div>

          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <content.icon className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">{content.title}</h3>
          <p className="text-muted-foreground mb-4 text-pretty">{content.message}</p>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-6">
            <p className="text-sm font-medium text-primary italic">{content.quote}</p>
          </div>

          {filter === "active" && (
            <Button className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold">
              <Trophy className="mr-2 h-4 w-4" />
              Browse Challenges
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
