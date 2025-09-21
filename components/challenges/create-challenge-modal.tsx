"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Updated from next/router
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, isBefore, isSameDay } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateChallengeModalProps {
  onChallengeCreated?: () => void;
}

const cn = (...inputs: string[]) => inputs.filter(Boolean).join(" ");

export function CreateChallengeModal({
  onChallengeCreated,
}: CreateChallengeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    target: "",
    unit: "",
    points: "",
    startDate: new Date(new Date().setHours(0, 0, 0, 0)), // Default to current date
    endDate: addDays(new Date(new Date().setHours(0, 0, 0, 0)), 7), // Default to 7 days
  });

  const categories = [
    { value: "energy", label: "Energy Conservation" },
    { value: "waste", label: "Waste Reduction" },
    { value: "transport", label: "Sustainable Transport" },
    { value: "water", label: "Water Conservation" },
    { value: "food", label: "Sustainable Food" },
    { value: "custom", label: "Custom Challenge" },
  ];

  const units = [
    { value: "kWh", label: "kWh (Energy)" },
    { value: "kg", label: "kg (Weight)" },
    { value: "km", label: "km (Distance)" },
    { value: "L", label: "L (Volume)" },
    { value: "meals", label: "Meals" },
    { value: "actions", label: "Actions" },
    { value: "points", label: "Points" },
  ];

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowStartCalendar(false);
        setShowEndCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartDateSelect = (date: Date) => {
    setFormData((prev) => {
      const newEndDate =
        isBefore(prev.endDate, date) || isSameDay(prev.endDate, date)
          ? addDays(date, 7)
          : prev.endDate;
      return { ...prev, startDate: date, endDate: newEndDate };
    });
    setShowStartCalendar(false);
  };

  const handleEndDateSelect = (date: Date) => {
    setFormData((prev) => {
      if (isBefore(prev.startDate, date)) {
        return { ...prev, endDate: date };
      }
      return prev;
    });
    setShowEndCalendar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          target: Number.parseInt(formData.target) || 100,
          unit: formData.unit,
          points: Number.parseInt(formData.points) || 50,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Challenge created successfully!");
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          target: "",
          unit: "",
          points: "",
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
          endDate: addDays(new Date(new Date().setHours(0, 0, 0, 0)), 7),
        });
        if (data.challenge?.id) {
          router.push(`/challenges/${data.challenge.id}`);
        }
        onChallengeCreated?.();
      } else {
        toast.error(data.message || "Failed to create challenge");
      }
    } catch (error) {
      console.error("Challenge creation error:", error);
      toast.error("Failed to create challenge");
    } finally {
      setLoading(false);
    }
  };

  // Calendar state for navigation
  const [startMonth, setStartMonth] = useState(
    new Date(formData.startDate.getFullYear(), formData.startDate.getMonth())
  );
  const [endMonth, setEndMonth] = useState(
    new Date(formData.endDate.getFullYear(), formData.endDate.getMonth())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogDescription>
            Create a public sustainability challenge for the community to
            participate in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., 30-Day Energy Saving Challenge"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the challenge goals and requirements..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                placeholder="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Reward Points</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: e.target.value })
                }
                placeholder="50"
                required
              />
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            ref={datePickerRef}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowStartCalendar(!showStartCalendar);
                    setShowEndCalendar(false);
                  }}
                  className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {format(formData.startDate, "PPP")}
                </button>
                {showStartCalendar && (
                  <div className="absolute z-10 mt-2 w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="flex justify-between mb-2">
                      <button
                        onClick={() =>
                          setStartMonth(
                            new Date(
                              startMonth.getFullYear(),
                              startMonth.getMonth() - 1
                            )
                          )
                        }
                        className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        &larr;
                      </button>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        {format(startMonth, "MMMM yyyy")}
                      </span>
                      <button
                        onClick={() =>
                          setStartMonth(
                            new Date(
                              startMonth.getFullYear(),
                              startMonth.getMonth() + 1
                            )
                          )
                        }
                        className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        &rarr;
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-gray-500 dark:text-gray-400 font-medium"
                          >
                            {day}
                          </div>
                        )
                      )}
                      {Array(
                        new Date(
                          startMonth.getFullYear(),
                          startMonth.getMonth(),
                          1
                        ).getDay()
                      )
                        .fill(null)
                        .map((_, i) => (
                          <div key={`empty-start-${i}`} />
                        ))}
                      {Array.from(
                        {
                          length: new Date(
                            startMonth.getFullYear(),
                            startMonth.getMonth() + 1,
                            0
                          ).getDate(),
                        },
                        (_, i) =>
                          new Date(
                            startMonth.getFullYear(),
                            startMonth.getMonth(),
                            i + 1
                          )
                      ).map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleStartDateSelect(date)}
                          disabled={isBefore(
                            date,
                            new Date(new Date().setHours(0, 0, 0, 0))
                          )}
                          className={cn(
                            "p-2 rounded-full hover:bg-teal-600 hover:text-white",
                            isSameDay(date, formData.startDate)
                              ? "bg-teal-600 text-white"
                              : "text-gray-800 dark:text-gray-200",
                            isBefore(
                              date,
                              new Date(new Date().setHours(0, 0, 0, 0))
                            )
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          )}
                        >
                          {date.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowEndCalendar(!showEndCalendar);
                    setShowStartCalendar(false);
                  }}
                  className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {format(formData.endDate, "PPP")}
                </button>
                {showEndCalendar && (
                  <div className="absolute z-10 mt-2 w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="flex justify-between mb-2">
                      <button
                        onClick={() =>
                          setEndMonth(
                            new Date(
                              endMonth.getFullYear(),
                              endMonth.getMonth() - 1
                            )
                          )
                        }
                        className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        &larr;
                      </button>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        {format(endMonth, "MMMM yyyy")}
                      </span>
                      <button
                        onClick={() =>
                          setEndMonth(
                            new Date(
                              endMonth.getFullYear(),
                              endMonth.getMonth() + 1
                            )
                          )
                        }
                        className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        &rarr;
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-gray-500 dark:text-gray-400 font-medium"
                          >
                            {day}
                          </div>
                        )
                      )}
                      {Array(
                        new Date(
                          endMonth.getFullYear(),
                          endMonth.getMonth(),
                          1
                        ).getDay()
                      )
                        .fill(null)
                        .map((_, i) => (
                          <div key={`empty-end-${i}`} />
                        ))}
                      {Array.from(
                        {
                          length: new Date(
                            endMonth.getFullYear(),
                            endMonth.getMonth() + 1,
                            0
                          ).getDate(),
                        },
                        (_, i) =>
                          new Date(
                            endMonth.getFullYear(),
                            endMonth.getMonth(),
                            i + 1
                          )
                      ).map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleEndDateSelect(date)}
                          disabled={
                            isBefore(date, formData.startDate) ||
                            isSameDay(date, formData.startDate)
                          }
                          className={cn(
                            "p-2 rounded-full hover:bg-teal-600 hover:text-white",
                            isSameDay(date, formData.endDate)
                              ? "bg-teal-600 text-white"
                              : "text-gray-800 dark:text-gray-200",
                            isBefore(date, formData.startDate) ||
                              isSameDay(date, formData.startDate)
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          )}
                        >
                          {date.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
