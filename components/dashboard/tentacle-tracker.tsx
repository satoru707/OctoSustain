"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TentacleCard } from "@/components/dashboard/tentacle-card";
import { Zap, Trash2, Car, Droplets, Leaf, BarChart3 } from "lucide-react";

const tentacleCategories = [
  {
    id: "energy",
    name: "Energy",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    unit: "kWh",
    description: "Track electricity and power consumption",
  },
  {
    id: "waste",
    name: "Waste",
    icon: Trash2,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    unit: "kg",
    description: "Monitor waste production and recycling",
  },
  {
    id: "transport",
    name: "Transport",
    icon: Car,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    unit: "km",
    description: "Log travel and commuting activities",
  },
  {
    id: "water",
    name: "Water",
    icon: Droplets,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    unit: "L",
    description: "Track water usage and conservation",
  },
  {
    id: "food",
    name: "Food",
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    unit: "meals",
    description: "Monitor sustainable eating habits",
  },
  {
    id: "custom",
    name: "Custom",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    unit: "units",
    description: "Create your own tracking categories",
  },
];

interface TentacleTrackerProps {
  podId: string;
}

export function TentacleTracker({ podId }: TentacleTrackerProps) {
  const [activeTab, setActiveTab] = useState("energy");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tentacle Tracker
        </h2>
        <p className="text-muted-foreground">
          Monitor your environmental impact across multiple categories
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-muted/50">
          {tentacleCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <category.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tentacleCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <TentacleCard category={category} podId={podId} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
