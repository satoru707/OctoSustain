"use client"

import { useState } from "react"
import { PodCard } from "@/components/pods/pod-card"
import { EmptyState } from "@/components/pods/empty-state"

// Mock data - in real app this would come from API
const mockPods = [
  {
    id: "1",
    name: "Green Office Warriors",
    description: "Reducing our workplace carbon footprint through energy tracking and waste reduction initiatives.",
    memberCount: 12,
    members: [
      { id: "1", name: "Alice Johnson", avatar: "/diverse-woman-portrait.png" },
      { id: "2", name: "Bob Smith", avatar: "/thoughtful-man.png" },
      { id: "3", name: "Carol Davis", avatar: "/diverse-woman-portrait.png" },
    ],
    isLive: true,
    category: "Workplace",
  },
  {
    id: "2",
    name: "Sustainable Families",
    description:
      "Families working together to create eco-friendly homes and teach children about environmental responsibility.",
    memberCount: 8,
    members: [
      { id: "4", name: "David Wilson", avatar: "/father-and-child.png" },
      { id: "5", name: "Emma Brown", avatar: "/loving-mother.png" },
    ],
    isLive: false,
    category: "Family",
  },
  {
    id: "3",
    name: "Campus Eco Champions",
    description:
      "University students leading sustainability initiatives across campus through collaborative tracking and challenges.",
    memberCount: 25,
    members: [
      { id: "6", name: "Frank Miller", avatar: "/diverse-students-studying.png" },
      { id: "7", name: "Grace Lee", avatar: "/diverse-students-studying.png" },
      { id: "8", name: "Henry Chen", avatar: "/diverse-students-studying.png" },
    ],
    isLive: true,
    category: "Education",
  },
]

export function PodsGrid() {
  const [pods] = useState(mockPods)

  if (pods.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pods.map((pod) => (
        <PodCard key={pod.id} pod={pod} />
      ))}
    </div>
  )
}
