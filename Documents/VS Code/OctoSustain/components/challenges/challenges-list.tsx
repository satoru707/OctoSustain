"use client"

import { useState } from "react"
import { ChallengeCard } from "@/components/challenges/challenge-card"
import { EmptyStateChallenges } from "@/components/challenges/empty-state-challenges"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock challenges data
const mockChallenges = [
  {
    id: "1",
    name: "No Plastic Week",
    description:
      "Eliminate single-use plastics from your daily routine for one week. Track alternatives and share tips with your pod.",
    category: "Waste",
    difficulty: "Medium",
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    timeLeft: 2 * 24 * 60 * 60 * 1000, // 2 days left
    participants: 156,
    podProgress: 75,
    userJoined: true,
    userCompleted: false,
    points: 250,
    icon: "🚫🥤",
  },
  {
    id: "2",
    name: "Energy Saver Challenge",
    description: "Reduce your energy consumption by 20% this month through mindful usage and efficiency improvements.",
    category: "Energy",
    difficulty: "Hard",
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days
    timeLeft: 15 * 24 * 60 * 60 * 1000, // 15 days left
    participants: 89,
    podProgress: 45,
    userJoined: true,
    userCompleted: false,
    points: 500,
    icon: "⚡💡",
  },
  {
    id: "3",
    name: "Green Commute Month",
    description: "Use sustainable transportation methods for your daily commute. Walk, bike, or use public transport.",
    category: "Transport",
    difficulty: "Easy",
    duration: 30 * 24 * 60 * 60 * 1000,
    timeLeft: 1 * 24 * 60 * 60 * 1000, // 1 day left - urgent!
    participants: 234,
    podProgress: 90,
    userJoined: true,
    userCompleted: false,
    points: 300,
    icon: "🚲🌱",
  },
  {
    id: "4",
    name: "Water Conservation Week",
    description: "Implement water-saving techniques and track your daily water usage to reduce consumption by 15%.",
    category: "Water",
    difficulty: "Easy",
    duration: 7 * 24 * 60 * 60 * 1000,
    timeLeft: 5 * 24 * 60 * 60 * 1000,
    participants: 67,
    podProgress: 30,
    userJoined: false,
    userCompleted: false,
    points: 200,
    icon: "💧🔧",
  },
  {
    id: "5",
    name: "Plant-Based Meals",
    description:
      "Try plant-based meals for lunch every day this week. Share recipes and track your carbon footprint reduction.",
    category: "Food",
    difficulty: "Medium",
    duration: 7 * 24 * 60 * 60 * 1000,
    timeLeft: 0, // Completed
    participants: 123,
    podProgress: 100,
    userJoined: true,
    userCompleted: true,
    points: 180,
    icon: "🌱🍽️",
  },
]

export function ChallengesList() {
  const [activeTab, setActiveTab] = useState("all")

  const filterChallenges = (filter: string) => {
    switch (filter) {
      case "active":
        return mockChallenges.filter((c) => c.timeLeft > 0 && c.userJoined && !c.userCompleted)
      case "available":
        return mockChallenges.filter((c) => c.timeLeft > 0 && !c.userJoined)
      case "completed":
        return mockChallenges.filter((c) => c.userCompleted)
      default:
        return mockChallenges
    }
  }

  const challenges = filterChallenges(activeTab)

  if (challenges.length === 0) {
    return <EmptyStateChallenges filter={activeTab} />
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            All Challenges
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            My Active
          </TabsTrigger>
          <TabsTrigger value="available" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Available
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
