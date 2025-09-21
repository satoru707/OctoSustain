"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Lightbulb, FileText, Crown, Medal, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { GenerateReportModal } from "@/components/reports/generate-report-modal";

interface GamificationSidebarProps {
  podId: string;
}

interface GamificationData {
  userPoints: number;
  leaderboard: Array<{
    id: string;
    name: string;
    points: number;
    rank: number;
  }>;
  activeChallenges: Array<{
    id: string;
    name: string;
    timeLeft: number;
    progress: number;
    points: number;
  }>;
}

interface SmartTip {
  category: string;
  message: string;
  potentialSaving: string;
  learnMoreUrl?: string;
}

export function GamificationSidebar({ podId }: GamificationSidebarProps) {
  const [gamificationData, setGamificationData] =
    useState<GamificationData | null>(null);
  const [smartTip, setSmartTip] = useState<SmartTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const response = await fetch(`/api/dashboard/${podId}`);
        if (response.ok) {
          const data = await response.json();
          setGamificationData(data.gamification);
        }
      } catch (error) {
        console.error("Failed to fetch gamification data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSmartTip = async () => {
      try {
        const response = await fetch(`/api/dashboard/${podId}/tips`);
        if (response.ok) {
          const data = await response.json();
          setSmartTip(data.tip);
        }
      } catch (error) {
        console.error("Failed to fetch smart tip:", error);
      }
    };

    fetchGamificationData();
    fetchSmartTip();
  }, [podId]);

  // const handleGenerateReport = async () => {
  //   setGeneratingReport(true);
  //   try {
  //     const response = await fetch(`/api/dashboard/${podId}reports/generate`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         podId,
  //         type: "weekly",
  //         period: "weekly",
  //         startDate: new Date(
  //           Date.now() - 7 * 24 * 60 * 60 * 1000
  //         ).toISOString(),
  //         endDate: new Date().toISOString(),
  //         includeCharts: true,
  //         includeDetails: true,
  //         format: "pdf",
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       toast.success("Report generated successfully!");
  //       router.push(`/reports/${podId}`);
  //     } else {
  //       toast.error("Failed to generate report");
  //     }
  //   } catch (error) {
  //     console.error("Report generation error:", error);
  //     toast.error("Failed to generate report");
  //   } finally {
  //     setGeneratingReport(false);
  //   }
  // };

  // const formatTimeLeft = (timeLeft: number) => {
  //   const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  //   const hours = Math.floor(
  //     (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //   );
  //   const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  //   if (days > 0) return `${days}d ${hours}h`;
  //   if (hours > 0) return `${hours}h ${minutes}m`;
  //   return `${minutes}m`;
  // };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getEcoWarriorLevel = (points: number) => {
    if (points >= 5000) return "Eco Champion";
    if (points >= 2500) return "Eco Warrior";
    if (points >= 1000) return "Eco Guardian";
    if (points >= 500) return "Eco Explorer";
    return "Eco Novice";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <Card className="border-2 border-destructive/20 bg-destructive/5">
        <CardContent className="p-4">
          <p className="text-destructive text-sm">
            Failed to load gamification data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ink Points */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-emerald-50 dark:from-primary/20 dark:to-emerald-950/50">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-2 p-3 bg-primary/20 rounded-full w-fit">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {gamificationData.userPoints.toLocaleString()}
          </CardTitle>
          <CardDescription className="font-medium">Ink Points</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-primary/30"
          >
            {getEcoWarriorLevel(gamificationData.userPoints)}
          </Badge>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Pod Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {gamificationData.leaderboard.length > 0 ? (
            gamificationData.leaderboard.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  member.points === gamificationData.userPoints
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-center w-6">
                  {getRankIcon(member.rank)}
                </div>

                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" alt={member.name} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.points.toLocaleString()} points
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No leaderboard data yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Predictive Tip */}
      <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Lightbulb className="h-5 w-5" />
            Smart Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
            {smartTip?.message || "Loading personalized tip..."}
          </p>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">
            Potential saving: {smartTip?.potentialSaving || "Calculating..."}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100 bg-transparent"
            onClick={() => {
              if (smartTip?.learnMoreUrl) {
                window.open(smartTip.learnMoreUrl, "_blank");
              }
            }}
            disabled={!smartTip?.learnMoreUrl}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>

      {/* Generate Report */}
      <Card>
        <CardContent className="p-4">
          <Button
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
            onClick={() => setIsReportModalOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {generatingReport ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        podId={podId}
      />
    </div>
  );
}
