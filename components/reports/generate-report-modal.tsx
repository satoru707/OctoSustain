"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, CalendarIcon, Waves } from "lucide-react"
import { format } from "date-fns"

interface GenerateReportModalProps {
  isOpen: boolean
  onClose: () => void
  podId: string
}

export function GenerateReportModal({ isOpen, onClose, podId }: GenerateReportModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    dateRange: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    categories: {
      energy: true,
      waste: true,
      transport: true,
      water: true,
      food: true,
    },
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type) return

    setIsGenerating(true)

    // Simulate report generation with green waves animation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsGenerating(false)
    onClose()

    // In real app, would generate and download report
    console.log("Report generated:", formData)
  }

  const reportTypes = [
    { value: "weekly", label: "Weekly Summary", description: "7-day impact overview" },
    { value: "monthly", label: "Monthly Report", description: "Comprehensive monthly analysis" },
    { value: "quarterly", label: "Quarterly Assessment", description: "3-month progress review" },
    { value: "custom", label: "Custom Range", description: "Choose your own date range" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>Create a comprehensive environmental impact report</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-8 text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <Waves className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Generating Report...</h3>
              <p className="text-sm text-muted-foreground">Analyzing your environmental impact data</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "75%" }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.type === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Include Categories</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.categories).map(([category, checked]) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          categories: { ...formData.categories, [category]: checked as boolean },
                        })
                      }
                      className="border-2 border-primary data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor={category} className="text-sm capitalize">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
                disabled={!formData.type}
              >
                Generate Report
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
