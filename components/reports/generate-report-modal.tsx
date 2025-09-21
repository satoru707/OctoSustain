"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  CalendarIcon,
  Waves,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  podId: string;
}

export function GenerateReportModal({
  isOpen,
  onClose,
  podId,
}: GenerateReportModalProps) {
  const [formData, setFormData] = useState({
    title: "",
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
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.title.trim()) return;

    if (formData.type === "custom") {
      toast.info("Coming Soon!", {
        description:
          "Custom date range reports are currently in development. Please select another report type.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      let startDate: Date;
      const endDate = new Date();

      switch (formData.type) {
        case "weekly":
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "quarterly":
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }
      console.log("Form data", formData);

      const response = await fetch(`/api/dashboard/${podId}/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podId,
          title: formData.title,
          type: formData.type,
          period: formData.type,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          includeCharts: true,
          includeDetails: true,
          format: "pdf",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedReport(data.report);
        setIsSuccess(true);
        toast.success("Report generated successfully!");
      } else {
        toast.error("Failed to generate report");
        onClose();
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report");
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setGeneratedReport(null);
    setFormData({
      title: "",
      type: "",
      dateRange: "",
      startDate: undefined,
      endDate: undefined,
      categories: {
        energy: true,
        waste: true,
        transport: true,
        water: true,
        food: true,
      },
    });
    onClose();
  };

  const handleViewReports = () => {
    handleClose();
    window.open(`/reports`, "_blank");
  };

  const reportTypes = [
    {
      value: "weekly",
      label: "Weekly Summary",
      description: "7-day impact overview",
    },
    {
      value: "monthly",
      label: "Monthly Report",
      description: "Comprehensive monthly analysis",
    },
    {
      value: "quarterly",
      label: "Quarterly Assessment",
      description: "3-month progress review",
    },
    {
      value: "custom",
      label: "Custom Range(Coming soon)",
      description: "Choose your own date range",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {isSuccess ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle>
                {isSuccess
                  ? "Report Generated Successfully!"
                  : "Generate New Report"}
              </DialogTitle>
              <DialogDescription>
                {isSuccess
                  ? "Your environmental impact report is ready"
                  : "Create a comprehensive environmental impact report"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {generatedReport?.title || "Report Generated"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your {formData.type} report has been successfully generated and
                is now available in your reports section.
              </p>
              {generatedReport?.summary && (
                <div className="bg-muted/50 rounded-lg p-3 text-left space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">
                    Quick Summary:
                  </div>
                  <div className="text-sm">
                    <div>
                      CO₂ Saved:{" "}
                      <span className="font-medium text-green-600">
                        {generatedReport.summary.totalCO2Saved}kg
                      </span>
                    </div>
                    <div>
                      Points Earned:{" "}
                      <span className="font-medium text-primary">
                        {generatedReport.summary.totalPoints}
                      </span>
                    </div>
                    <div>
                      Participants:{" "}
                      <span className="font-medium">
                        {generatedReport.summary.participantCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Stay Here
              </Button>
              <Button
                onClick={handleViewReports}
                className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="py-8 text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <Waves className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Generating Report...
              </h3>
              <p className="text-sm text-muted-foreground">
                Analyzing your environmental impact data
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter a title for your report"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
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
                        {formData.startDate
                          ? format(formData.startDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) =>
                          setFormData({ ...formData, startDate: date })
                        }
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
                        {formData.endDate
                          ? format(formData.endDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) =>
                          setFormData({ ...formData, endDate: date })
                        }
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
                {Object.entries(formData.categories).map(
                  ([category, checked]) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={checked}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            categories: {
                              ...formData.categories,
                              [category]: checked as boolean,
                            },
                          })
                        }
                        className="border-2 border-primary data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor={category} className="text-sm capitalize">
                        {category}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
                disabled={
                  !formData.type ||
                  !formData.title.trim() ||
                  formData.type == "custom"
                }
              >
                Generate Report
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
