import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma as db } from "@/lib/prisma";

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

    const challengeId = params.challengeId;

    // Check if challenge exists and is active
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    if (!challenge.isActive || new Date() > challenge.endDate) {
      return NextResponse.json(
        { error: "Challenge is no longer active" },
        { status: 400 }
      );
    }

    // Check if user is already participating
    const existingParticipation = await db.challengeParticipation.findUnique({
      where: {
        userId_challengeId: {
          userId: decoded.userId,
          challengeId: challengeId,
        },
      },
    });

    if (existingParticipation) {
      return NextResponse.json(
        { error: "You are already participating in this challenge" },
        { status: 400 }
      );
    }

    // Create participation record
    await db.challengeParticipation.create({
      data: {
        userId: decoded.userId,
        challengeId: challengeId,
        progress: 0,
        completed: false,
        joinedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the challenge!",
      challengeId: challengeId,
    });
  } catch (error) {
    console.error("Join challenge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const challengeId = params.challengeId;

    const deletedParticipation = await db.challengeParticipation.deleteMany({
      where: {
        userId: decoded.userId,
        challengeId,
      },
    });

    if (deletedParticipation.count === 0) {
      return NextResponse.json(
        { error: "Not participating in this challenge" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Left the challenge successfully.",
    });
  } catch (error) {
    console.error("Challenge leave error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
