"use client"

import { ReportCard } from "@/components/reports/report-card"

interface ReportsGalleryProps {
  podId: string
}

// Mock reports data
const mockReports = [
  {
    id: "1",
    title: "Weekly Impact Summary",
    type: "weekly",
    dateRange: "Dec 9-15, 2024",
    co2Saved: 145.2,
    pointsEarned: 1250,
    categories: {
      energy: 45.2,
      waste: 32.1,
      transport: 28.9,
      water: 25.0,
      food: 14.0,
    },
    generatedAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Monthly Pod Report",
    type: "monthly",
    dateRange: "November 2024",
    co2Saved: 580.7,
    pointsEarned: 4850,
    categories: {
      energy: 180.3,
      waste: 125.4,
      transport: 110.2,
      water: 95.8,
      food: 69.0,
    },
    generatedAt: "2024-11-30T23:59:00Z",
  },
  {
    id: "3",
    title: "Challenge Completion Report",
    type: "challenge",
    dateRange: "No Plastic Week",
    co2Saved: 89.3,
    pointsEarned: 750,
    categories: {
      waste: 89.3,
      energy: 0,
      transport: 0,
      water: 0,
      food: 0,
    },
    generatedAt: "2024-12-08T18:45:00Z",
  },
  {
    id: "4",
    title: "Quarterly Assessment",
    type: "quarterly",
    dateRange: "Q4 2024",
    co2Saved: 1250.8,
    pointsEarned: 12400,
    categories: {
      energy: 425.2,
      waste: 310.6,
      transport: 285.4,
      water: 145.8,
      food: 83.8,
    },
    generatedAt: "2024-12-31T23:59:00Z",
  },
]

export function ReportsGallery({ podId }: ReportsGalleryProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockReports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}
