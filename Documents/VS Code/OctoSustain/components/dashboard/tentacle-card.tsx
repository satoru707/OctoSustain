"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calculator, Upload, TrendingUp, Loader2, X } from "lucide-react"
import { TentacleChart } from "@/components/dashboard/tentacle-chart"
import { SuccessConfetti } from "@/components/auth/success-confetti"

interface Category {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  unit: string
  description: string
}

interface TentacleCardProps {
  category: Category
}

export function TentacleCard({ category }: TentacleCardProps) {
  const [formData, setFormData] = useState({
    value: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [co2Saved, setCo2Saved] = useState<number | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setUploadedImage(previewUrl)
    setIsUploading(false)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage)
      setUploadedImage(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.value) return

    setIsLoading(true)

    // Simulate API call and CO2 calculation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock CO2 calculation based on category and value
    const value = Number.parseFloat(formData.value)
    let co2Impact = 0

    switch (category.id) {
      case "energy":
        co2Impact = value * 0.5 // kg CO2 per kWh
        break
      case "waste":
        co2Impact = value * 0.3 // kg CO2 per kg waste
        break
      case "transport":
        co2Impact = value * 0.2 // kg CO2 per km
        break
      case "water":
        co2Impact = value * 0.001 // kg CO2 per liter
        break
      case "food":
        co2Impact = value * 2.5 // kg CO2 per meal
        break
      default:
        co2Impact = value * 0.1
    }

    setCo2Saved(co2Impact)
    setShowSuccess(true)
    setIsLoading(false)

    // Reset form
    setFormData({ value: "", notes: "" })
    handleRemoveImage()

    // Hide success after animation
    setTimeout(() => {
      setShowSuccess(false)
      setCo2Saved(null)
    }, 3000)
  }

  return (
    <>
      <Card className={`border-2 border-primary/20 ${category.bgColor}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${category.color}`}>
              <category.icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{category.name} Tracking</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${category.id}-value`}>Value ({category.unit})</Label>
                <Input
                  id={`${category.id}-value`}
                  type="number"
                  step="0.1"
                  placeholder={`Enter ${category.unit}`}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {category.id === "waste" && (
                <div className="space-y-2">
                  <Label>Upload Photo (Optional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="relative">
                      <div className="w-full h-24 bg-muted rounded-lg border-2 border-dashed border-primary/50 overflow-hidden">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded waste"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                      className="w-full border-2 border-dashed border-primary/50 hover:border-primary bg-transparent"
                      disabled={isLoading || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${category.id}-notes`}>Notes (Optional)</Label>
              <Textarea
                id={`${category.id}-notes`}
                placeholder="Add any additional details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border-2 focus:border-primary min-h-[80px]"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
                disabled={isLoading || !formData.value}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate CO2 Impact
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* CO2 Impact Display */}
          {co2Saved !== null && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-200">Environmental Impact</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{co2Saved.toFixed(2)} kg CO2</div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {co2Saved > 0 ? "Impact calculated" : "Great job reducing your footprint!"}
              </p>
            </div>
          )}

          {/* Progress Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">Weekly Progress</h4>
              <Badge variant="secondary" className="text-xs">
                This Week
              </Badge>
            </div>
            <TentacleChart category={category} />
          </div>
        </CardContent>
      </Card>

      {showSuccess && <SuccessConfetti />}
    </>
  )
}
