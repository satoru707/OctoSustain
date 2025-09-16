"use client";

import { useState, useEffect } from "react";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { EmptyStateChallenges } from "@/components/challenges/empty-state-challenges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  timeLeft: number;
  participants: number;
  podProgress: number;
  userJoined: boolean;
  userCompleted: boolean;
  points: number;
  icon: string;
}

export function ChallengesList() {
  const [activeTab, setActiveTab] = useState("all");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("/api/challenges");
        if (response.ok) {
          const data = await response.json();
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

    fetchChallenges();
  }, []);

  const filterChallenges = (filter: string) => {
    switch (filter) {
      case "active":
        return challenges.filter(
          (c) => c.timeLeft > 0 && c.userJoined && !c.userCompleted
        );
      case "available":
        return challenges.filter((c) => c.timeLeft > 0 && !c.userJoined);
      case "completed":
        return challenges.filter((c) => c.userCompleted);
      default:
        return challenges;
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

  if (filteredChallenges.length === 0) {
    return <EmptyStateChallenges filter={activeTab} />;
  }

  return (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
