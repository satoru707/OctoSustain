"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Download, FileText, Calendar, Users, Leaf, Trophy } from "lucide-react"

interface ReportPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  report: {
    id: string
    title: string
    type: string
    period: string
    summary: {
      totalCO2Saved: number
      totalPoints: number
      participantCount: number
      activeDays: number
    }
    categories: Record<string, { co2Saved: number; points: number; progress: number }>
    achievements: string[]
    previewData: {
      chartData: Array<{ category: string; co2: number; points: number }>
      trends: Array<{ [key: string]: string | number }>
    }
  }
}

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]

export function ReportPreviewModal({ isOpen, onClose, report }: ReportPreviewModalProps) {
  const handleDownload = async (format: string) => {
    try {
      const response = await fetch(`/api/reports/${report.id}/download?format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `report-${report.id}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-eco-primary" />
            {report.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Period</p>
                <p className="text-sm font-medium">{report.period}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm font-medium">{report.summary.participantCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">CO2 Saved</p>
                <p className="text-sm font-medium">{report.summary.totalCO2Saved} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Points</p>
                <p className="text-sm font-medium">{report.summary.totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* CO2 Savings by Category */}
            <div className="space-y-2">
              <h3 className="font-medium">CO2 Savings by Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.previewData.chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="co2"
                      label={({ category, co2 }) => `${category}: ${co2}kg`}
                    >
                      {report.previewData.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trends */}
            <div className="space-y-2">
              <h3 className="font-medium">Progress Trends</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.previewData.trends}>
                    <XAxis dataKey={Object.keys(report.previewData.trends[0] || {})[0]} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="co2" fill="#059669" name="CO2 Saved (kg)" />
                    <Bar dataKey="points" fill="#10b981" name="Points" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category Progress */}
          <div className="space-y-4">
            <h3 className="font-medium">Category Performance</h3>
            <div className="grid gap-3">
              {Object.entries(report.categories).map(([category, data]) => (
                <div key={category} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <span className="text-xs text-muted-foreground">{data.progress}%</span>
                    </div>
                    <Progress value={data.progress} className="h-2" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{data.co2Saved} kg CO2</p>
                    <p className="text-xs text-muted-foreground">{data.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <h3 className="font-medium">Key Achievements</h3>
            <div className="grid gap-2">
              {report.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-eco-primary/10 rounded-lg">
                  <Trophy className="h-4 w-4 text-eco-primary" />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => handleDownload("csv")}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleDownload("json")}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button onClick={() => handleDownload("pdf")} className="bg-eco-primary hover:bg-eco-primary/90">
              <Download className="mr-2 h-4 w-4" />
              PDF Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
