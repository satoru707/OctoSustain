import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { id: challengeId } = params
    const body = await request.json()

    const { progress, notes, imageUrl, data } = body

    // Mock progress update - replace with database operations
    const progressEntry = {
      id: Date.now().toString(),
      challengeId,
      userId: decoded.userId,
      progress: Number.parseFloat(progress),
      notes,
      imageUrl,
      data,
      timestamp: new Date(),
    }

    console.log("Updating challenge progress:", progressEntry)

    // Calculate points based on progress
    const pointsEarned = Math.round(progress * 2) // 2 points per percent

    return NextResponse.json({
      success: true,
      data: progressEntry,
      pointsEarned,
      message: `Great progress! You earned ${pointsEarned} points!`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: challengeId } = params

    // Mock progress data - replace with database queries
    const progressData = {
      challengeId,
      overallProgress: 65,
      dailyProgress: [
        { date: "2024-01-15", progress: 10, points: 20 },
        { date: "2024-01-16", progress: 25, points: 50 },
        { date: "2024-01-17", progress: 40, points: 80 },
        { date: "2024-01-18", progress: 55, points: 110 },
        { date: "2024-01-19", progress: 65, points: 130 },
      ],
      milestones: [
        { name: "First Day Complete", achieved: true, points: 25 },
        { name: "Halfway There", achieved: true, points: 50 },
        { name: "Almost Done", achieved: false, points: 75 },
        { name: "Challenge Master", achieved: false, points: 100 },
      ],
      leaderboard: [
        { userId: "1", name: "Alex Chen", progress: 85, points: 170 },
        { userId: "2", name: "Maria Garcia", progress: 75, points: 150 },
        { userId: "3", name: "Current User", progress: 65, points: 130 },
      ],
    }

    return NextResponse.json(progressData)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
