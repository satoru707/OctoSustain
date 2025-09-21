"use client";

import { useState, useEffect } from "react";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { EmptyStateChallenges } from "@/components/challenges/empty-state-challenges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ChallengesHeader } from "@/components/challenges/challenges-header";
import { toast } from "sonner";

interface Challenge {
  category: string;
  description: string;
  difficulty: string;
  duration: number;
  endDate: string;
  id: string;
  isActive: boolean;
  isCompleted: boolean;
  isJoined: boolean;
  isUpcoming: boolean;
  maxParticipants: number;
  name: string;
  participants: number;
  points: number;

  progress: number;

  requirements: string[];
  rewards: string[];
  startDate: string;
  timeLeft: number;
}

export function ChallengesList() {
  const [activeTab, setActiveTab] = useState("all");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      if (response.ok) {
        const data = await response.json();
        console.log("Challenges", data.challenges);

        setChallenges(data.challenges);
      } else {
        toast.error("Failed to fetch challenges");
      }
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
      toast.error("Failed to fetch challenges");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filterChallenges = (filter: string) => {
    let filtered = challenges;

    // Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Then apply tab filter
    switch (filter) {
      case "active":
        return filtered.filter(
          (c) => c.timeLeft > 0 && c.isJoined && !c.isCompleted
        );
      case "available":
        return filtered.filter((c) => c.timeLeft > 0 && !c.isJoined);
      case "completed":
        return filtered.filter((c) => c.isCompleted);
      default:
        return filtered;
    }
  };

  const filteredChallenges = filterChallenges(activeTab);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading challenges...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ChallengesHeader
        data={challenges}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              All Challenges
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              My Active
            </TabsTrigger>
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Available
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredChallenges.length === 0 ? (
              <EmptyStateChallenges filter={activeTab} />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
