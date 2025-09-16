"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Activity } from "lucide-react";

interface DashboardHeaderProps {
  podId: string;
}

interface PodData {
  id: string;
  name: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastActive: Date;
  }>;
  memberCount: number;
  onlineCount: number;
}

export function DashboardHeader({ podId }: DashboardHeaderProps) {
  const [podData, setPodData] = useState<PodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const response = await fetch(`/api/dashboard/${podId}`);
        if (response.ok) {
          const data = await response.json();
          setPodData(data.pod);
          setLiveCount(data.pod.onlineCount);
        }
      } catch (error) {
        console.error("Failed to fetch pod data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodData();
  }, [podId]);

  // Simulate real-time member count updates
  useEffect(() => {
    if (!podData) return;

    const interval = setInterval(() => {
      setLiveCount((prev) => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(1, Math.min(podData.memberCount, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [podData]);

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-emerald-50/50 to-teal-50/50 dark:from-primary/10 dark:via-emerald-950/50 dark:to-teal-950/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!podData) {
    return (
      <Card className="border-2 border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load pod data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-emerald-50/50 to-teal-50/50 dark:from-primary/10 dark:via-emerald-950/50 dark:to-teal-950/50">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left side - Pod info */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {podData.name} Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time eco-collaboration hub
              </p>
            </div>

            {/* Live member indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {liveCount} members active now
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{podData.memberCount} total members</span>
              </div>
            </div>
          </div>

          {/* Right side - Recent active members */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Recently Active</span>
            </div>

            <div className="flex gap-2">
              {podData.members.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center gap-1"
                >
                  <Avatar className="w-10 h-10 border-2 border-green-500/50">
                    <AvatarImage
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {member.isOnline ? "online" : "offline"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
