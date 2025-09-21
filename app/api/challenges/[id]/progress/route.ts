import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma as db } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;

    const challenge = await db.challenge.findUnique({
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

    const transformedChallenge = {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: getDifficulty(challenge.points),
      points: challenge.points,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      progress: challenge.points, // Will be calculated based on user participation
      isCompleted: new Date() > challenge.endDate,
      createdBy: challenge.participants[0]?.user.name || "Unknown",
      creatorName: challenge.participants[0]?.user.name || "Unknown",
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

    return NextResponse.json(transformedChallenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { challengeId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { progress } = await request.json();
    const challengeId = params.challengeId;

    await db.challengeParticipation.updateMany({
      where: {
        userId: decoded.userId,
        challengeId: challengeId,
      },
      data: {
        progress: progress,
        completed: progress >= 100,
        completedAt: progress >= 100 ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully!",
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
