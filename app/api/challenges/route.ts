import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma as db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const category = searchParams.get("category");

    const challenges = await db.challenge.findMany({
      where: {
        ...(category && category !== "all" ? { category } : {}),
        isActive: true,
      },
      include: {
        participants: {
          where: { userId: decoded.userId },
          select: { progress: true, completed: true, joinedAt: true },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const transformedChallenges = challenges.map((challenge) => {
      const userParticipation = challenge.participants[0];
      const isJoined = !!userParticipation;
      const now = new Date();

      return {
        id: challenge.id,
        name: challenge.title,
        description: challenge.description,
        category: challenge.category,
        difficulty:
          challenge.points > 100
            ? "Hard"
            : challenge.points > 50
            ? "Medium"
            : "Easy",
        points: challenge.points,
        duration: challenge.endDate.getTime() - challenge.startDate.getTime(),
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        participants: challenge._count.participants,
        maxParticipants: 50,
        progress: userParticipation?.progress || 0,
        isJoined,
        userJoined: isJoined,
        userCompleted: userParticipation?.completed || false,
        podProgress: userParticipation?.progress || 0,
        requirements: [
          "Log daily progress",
          "Upload verification photos",
          "Complete daily check-ins",
        ],
        rewards: [`${challenge.points} Ink Points`, "Achievement Badge"],
        timeLeft: Math.max(0, challenge.endDate.getTime() - now.getTime()),
        isActive: now >= challenge.startDate && now <= challenge.endDate,
        isUpcoming: now < challenge.startDate,
        isCompleted: now > challenge.endDate,
        icon: "🌱",
      };
    });

    let filteredChallenges = transformedChallenges;

    // Apply filters
    if (filter === "active") {
      filteredChallenges = transformedChallenges.filter(
        (c) => c.isJoined && new Date() < c.endDate
      );
    } else if (filter === "available") {
      filteredChallenges = transformedChallenges.filter(
        (c) => !c.isJoined && new Date() < c.endDate
      );
    } else if (filter === "completed") {
      filteredChallenges = transformedChallenges.filter(
        (c) => c.isJoined && new Date() > c.endDate
      );
    }

    return NextResponse.json({
      challenges: filteredChallenges,
      stats: {
        total: transformedChallenges.length,
        active: transformedChallenges.filter(
          (c) => c.isJoined && new Date() < c.endDate
        ).length,
        completed: transformedChallenges.filter(
          (c) => c.isJoined && new Date() > c.endDate
        ).length,
        available: transformedChallenges.filter(
          (c) => !c.isJoined && new Date() < c.endDate
        ).length,
      },
    });
  } catch (error) {
    console.error("Challenges fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();

    const newChallenge = await db.challenge.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        target: body.target || 100,
        unit: body.unit || "points",
        points: body.points || 50,
        startDate: new Date(body.startDate || Date.now()),
        endDate: new Date(body.endDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });

    await db.challengeParticipation.create({
      data: {
        userId: decoded.userId,
        challengeId: newChallenge.id,
        progress: 0,
        completed: false,
        joinedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      challenge: newChallenge,
      message: "Challenge created successfully!",
    });
  } catch (error) {
    console.error("Challenge creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
