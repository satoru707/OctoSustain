"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calculator, Upload, TrendingUp, Loader2, X } from "lucide-react";
import { TentacleChart } from "@/components/dashboard/tentacle-chart";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  unit: string;
  description: string;
}

interface TentacleCardProps {
  category: Category;
  podId: string;
}

interface TentacleData {
  current: number;
  target: number;
  unit: string;
  co2Saved: number;
  weeklyData: Array<{
    day: string;
    value: number;
    co2: number;
  }>;
}

export function TentacleCard({ category, podId }: TentacleCardProps) {
  const [formData, setFormData] = useState({
    value: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [co2Saved, setCo2Saved] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tentacleData, setTentacleData] = useState<TentacleData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTentacleData = async () => {
      try {
        const response = await fetch(`/api/dashboard/${podId}`);
        if (response.ok) {
          const data = await response.json();
          setTentacleData(data.tentacles[category.id]);
          console.log("datum", data.tentacles[category.id]);
        }
      } catch (error) {
        console.error("Failed to fetch tentacle data:", error);
      }
    };

    fetchTentacleData();
  }, [podId, category.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // hold on feature for now
    toast.info("Feature coming soon.");
    return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      // formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImage(data.url);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // const handleUploadClick = () => {
  //   toast.info("Feature coming soon.");
  //   return;
  //   fileInputRef.current?.click();
  // };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/dashboard/${podId}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category.id,
          value: Number.parseFloat(formData.value),
          unit: category.unit,
          notes: formData.notes,
          imageUrl: uploadedImage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCo2Saved(data.data.co2Saved);
        toast.success(data.message);

        // Reset form
        setFormData({ value: "", notes: "" });
        handleRemoveImage();

        // Refresh tentacle data
        const dashboardResponse = await fetch(`/api/dashboard/${podId}`);
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setTentacleData(dashboardData.tentacles[category.id]);
        }

        // Hide success after animation
        setTimeout(() => {
          setCo2Saved(null);
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save data");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={`border-2 border-primary/20 ${category.bgColor}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${category.color}`}
            >
              <category.icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {category.name} Tracking
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Progress Display */}
          {tentacleData && (
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">This Week</span>
                <Badge variant="outline">
                  {tentacleData.current} {tentacleData.unit}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (tentacleData.current / tentacleData.target) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>CO2 Saved: {tentacleData.co2Saved.toFixed(1)} kg</span>
                <span>
                  Target: {tentacleData.target} {tentacleData.unit}
                </span>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${category.id}-value`}>
                  Value ({category.unit})
                </Label>
                <Input
                  id={`${category.id}-value`}
                  type="number"
                  step="0.1"
                  placeholder={`Enter ${category.unit}`}
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className="border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {category.id === "waste" && (
                <div className="space-y-2">
                  <Label>Upload Photo (Coming soon)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled
                    onClick={() => {
                      toast.info("Feature coming soon.");
                    }}
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
                      onClick={() => toast.info("Feature coming soon.")}
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
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
                    Saving...
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
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Environmental Impact
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {co2Saved.toFixed(2)} kg CO2
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Great job reducing your footprint!
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
            <TentacleChart
              category={category}
              data={tentacleData?.weeklyData}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
