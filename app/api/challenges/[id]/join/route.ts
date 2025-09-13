import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id: challengeId } = params

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    })

    if (!challenge || !challenge.isActive) {
      return NextResponse.json({ error: "Challenge not found or inactive" }, { status: 404 })
    }

    const existingParticipation = await prisma.challengeParticipation.findUnique({
      where: {
        userId_challengeId: {
          userId: decoded.userId,
          challengeId,
        },
      },
    })

    if (existingParticipation) {
      return NextResponse.json({ error: "Already participating in this challenge" }, { status: 400 })
    }

    await prisma.challengeParticipation.create({
      data: {
        userId: decoded.userId,
        challengeId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Successfully joined the challenge! Good luck!",
      points: 10, // Bonus points for joining
    })
  } catch (error) {
    console.error("Challenge join error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id: challengeId } = params

    const deletedParticipation = await prisma.challengeParticipation.deleteMany({
      where: {
        userId: decoded.userId,
        challengeId,
      },
    })

    if (deletedParticipation.count === 0) {
      return NextResponse.json({ error: "Not participating in this challenge" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Left the challenge successfully.",
    })
  } catch (error) {
    console.error("Challenge leave error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
