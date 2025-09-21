"use client";

import { Trophy, Target, Users, Search } from "lucide-react";
import { CreateChallengeModal } from "./create-challenge-modal";
import { Input } from "@/components/ui/input";

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

interface ChallengesHeaderProps {
  data: Challenge[];
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function ChallengesHeader({
  data,
  onSearch,
  searchQuery,
}: ChallengesHeaderProps) {
  return (
    <div className="relative mb-8 p-6 bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50 dark:from-primary/20 dark:via-emerald-950 dark:to-teal-950 rounded-xl border border-primary/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Trophy className="h-6 w-6 text-primary animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Sustainability Challenges
            </h2>
            <p className="text-sm text-muted-foreground">
              Join public challenges to earn points and make a bigger impact
            </p>
          </div>
        </div>
        <CreateChallengeModal />
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={searchQuery || ""}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-gray-800/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">
              {data.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Challenges
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">
              {data.reduce(
                (total, challenge) => total + challenge.participants,
                0
              ) || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Participants
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Trophy className="h-5 w-5 text-primary" />
          <div>
            <div className="text-lg font-bold text-foreground">
              {data.filter((challenge) => challenge.isJoined).length || 0}
            </div>
            <div className="text-xs text-muted-foreground">My Challenges</div>
          </div>
        </div>
      </div>
    </div>
  );
}
