import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ChallengeProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  startDate: string;
  endDate: string;
  progress: number;
  isCompleted: boolean;
  createdBy: string;
  creatorName: string;
  participants: {
    id: string;
    name: string;
    progress: number;
    user?: { id: string; name: string; email: string; progress: number };
  }[];
  goals: {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("ChallengeId", params);
    const challengeId = params.id;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const getDifficulty = (points: number) => {
      if (points > 100) return "Hard";
      if (points > 50) return "Medium";
      return "Easy";
    };

    const transformedChallenge: ChallengeProps = {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: getDifficulty(challenge.points),
      points: challenge.points,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      progress: (challenge.points / challenge.target) * 100,
      isCompleted: new Date() > challenge.endDate,
      createdBy: challenge.participants[0].user.name,
      creatorName: challenge.participants[0].user.name,
      participants: challenge.participants.map((participant) => ({
        id: participant.user.id,
        name: participant.user.name || participant.user.email,
        progress: participant.progress || 0,
      })),
      goals: [
        {
          id: "1",
          title: `Reach ${challenge.target} ${challenge.unit}`,
          target: challenge.target,
          current: challenge.points,
          unit: challenge.unit,
        },
      ],
    };
    console.log("Get particular memory", transformedChallenge);

    return NextResponse.json(transformedChallenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}
