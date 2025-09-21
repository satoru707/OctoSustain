"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  startDate: string;
  endDate: string;
  participants: number;
  isJoined: boolean;
}

export default function JoinChallengePage({
  params,
}: {
  params: { challengeId: string };
}) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${params.challengeId}`);
        if (response.ok) {
          const data = await response.json();
          setChallenge({
            id: data.id,
            name: data.title,
            description: data.description,
            category: data.category,
            difficulty: data.difficulty,
            points: data.points,
            startDate: data.startDate,
            endDate: data.endDate,
            participants: data.participants.length,
            isJoined: data.progress > 0,
          });
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        toast.error("Failed to load challenge");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [params.challengeId]);

  const handleJoinChallenge = async () => {
    setIsJoining(true);
    try {
      const response = await fetch(
        `/api/challenges/${params.challengeId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Successfully joined the challenge!");
        router.push(`/challenges/${params.challengeId}`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to join challenge");
      }
    } catch (error) {
      console.error("Join challenge error:", error);
      toast.error("Failed to join challenge");
    } finally {
      setIsJoining(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/challenges/${params.challengeId}/join`;
    navigator.clipboard.writeText(link);
    toast.success("Challenge link copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Challenge not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{challenge.category}</Badge>
            <Badge
              variant={
                challenge.difficulty === "Easy"
                  ? "default"
                  : challenge.difficulty === "Medium"
                  ? "secondary"
                  : "destructive"
              }
            >
              {challenge.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{challenge.name}</CardTitle>
          <CardDescription className="text-base">
            {challenge.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(challenge.startDate)} -{" "}
                {formatDate(challenge.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.participants} participants</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span>{challenge.points} points</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {Math.ceil(
                  (new Date(challenge.endDate).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days left
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyLink}
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>

          <div className="pt-4">
            {challenge.isJoined ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    You&apos;re already in this challenge!
                  </span>
                </div>
                <Button
                  onClick={() => router.push(`/challenges/${challenge.id}`)}
                  className="w-full"
                >
                  Go to Challenge
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleJoinChallenge}
                disabled={isJoining}
                className="w-full"
                size="lg"
              >
                {isJoining ? "Joining..." : "Join Challenge"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
