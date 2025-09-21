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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Users,
  Trophy,
  Target,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { ChallengeProgressModal } from "@/components/challenges/challenge-progress-modal";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  startDate: string;
  endDate: string;
  participants: Array<{
    id: string;
    name: string;
    progress: number;
  }>;
  progress: number;
  isCompleted: boolean;
  createdBy: string;
  creatorName: string;
  goals: Array<{
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
  }>;
}

export default function ChallengePage({
  params,
}: {
  params: { challengeId: string };
}) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          `/api/challenges/${params.challengeId}/progress`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch challenge");
        }

        const data = await response.json();
        console.log("Progress", data);

        setChallenge(data);
      } catch (error) {
        console.error("Error fetching challenge:", error);
        toast.error("Failed to load challenge");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [params.challengeId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Challenge not found</p>
            <Button onClick={() => router.push("/challenges")} className="mt-4">
              Back to Challenges
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/challenges")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Challenges
      </Button>

      {/* Challenge Header */}
      <div className="mb-8">
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
          {challenge.isCompleted && (
            <Badge variant="default" className="bg-green-500">
              Completed
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
        <p className="text-muted-foreground text-lg mb-6">
          {challenge.description}
        </p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>
              {formatDate(challenge.startDate)} -{" "}
              {formatDate(challenge.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{getDaysRemaining()} days remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{challenge.participants.length} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>{challenge.points} points</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Challenge Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenge.goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress
                    value={(goal.current / goal.target) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Track your performance in this challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {challenge.progress}%
                  </span>
                </div>
                <Progress value={challenge.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Creator */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=40&width=40&query=${challenge.creatorName}`}
                  />
                  <AvatarFallback>
                    {challenge.creatorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{challenge.creatorName}</p>
                  <p className="text-sm text-muted-foreground">
                    Challenge Creator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>
                Participants ({challenge.participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenge.participants.slice(0, 5).map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/abstract-geometric-shapes.png?height=32&width=32&query=${participant.name}`}
                        />
                        <AvatarFallback className="text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {participant.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {participant.progress}%
                    </span>
                  </div>
                ))}
                {challenge.participants.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{challenge.participants.length - 5} more participants
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowProgressModal(true)}
          >
            Update Progress
          </Button>
        </div>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <ChallengeProgressModal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
          challenge={{
            id: challenge.id,
            name: challenge.title,
            progress: challenge.progress,
            requirements: [
              "Log daily progress",
              "Upload verification photos",
              "Complete daily check-ins",
            ],
          }}
        />
      )}
    </div>
  );
}
