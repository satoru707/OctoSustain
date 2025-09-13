"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Calendar, TrendingUp, Award } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Report {
  id: string
  title: string
  type: string
  dateRange: string
  co2Saved: number
  pointsEarned: number
  categories: {
    energy: number
    waste: number
    transport: number
    water: number
    food: number
  }
  generatedAt: string
}

interface ReportCardProps {
  report: Report
}

const COLORS = {
  energy: "#eab308",
  waste: "#22c55e",
  transport: "#3b82f6",
  water: "#06b6d4",
  food: "#10b981",
}

export function ReportCard({ report }: ReportCardProps) {
  const chartData = Object.entries(report.categories)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name as keyof typeof COLORS],
    }))

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weekly":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "monthly":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "quarterly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "challenge":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleDownload = () => {
    // Simulate PDF download
    console.log(`Downloading report ${report.id}`)
  }

  const handlePreview = () => {
    // Open report preview
    console.log(`Previewing report ${report.id}`)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getTypeColor(report.type)}>{report.type}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <CardTitle className="text-lg font-bold text-balance">{report.title}</CardTitle>
        <CardDescription className="text-sm">{report.dateRange}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-600">{report.co2Saved.toFixed(1)}</div>
            <div className="text-xs text-green-700 dark:text-green-300">kg CO2 Saved</div>
          </div>

          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-primary">{report.pointsEarned.toLocaleString()}</div>
            <div className="text-xs text-primary/80">Points Earned</div>
          </div>
        </div>

        {/* Mini pie chart */}
        {chartData.length > 0 && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} kg CO2`, "Saved"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handlePreview}
            variant="outline"
            size="sm"
            className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button
            onClick={handleDownload}
            size="sm"
            className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
