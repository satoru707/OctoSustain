import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { podId: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { podId } = params
    const body = await request.json()

    const { category, value, unit, notes, imageUrl } = body

    const podMember = await prisma.podMember.findUnique({
      where: {
        userId_podId: {
          userId: decoded.userId,
          podId: podId,
        },
      },
    })

    if (!podMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // CO2 calculation factors (kg CO2 per unit)
    const co2Factors = {
      energy: 0.6, // per kWh
      waste: 0.5, // per kg
      transport: 0.12, // per km
      water: 0.17, // per L
      food: 1.4, // per meal
      custom: 0.9, // per action
    }

    const co2Saved = value * (co2Factors[category as keyof typeof co2Factors] || 0)
    const points = Math.round(co2Saved * 10) // 10 points per kg CO2

    const logEntry = await prisma.tentacleLog.create({
      data: {
        podId,
        userId: decoded.userId,
        category,
        value: Number.parseFloat(value),
        unit,
        notes,
        imageUrl,
        co2Saved: Math.round(co2Saved * 100) / 100,
        points,
      },
    })

    await prisma.podMember.update({
      where: {
        userId_podId: {
          userId: decoded.userId,
          podId: podId,
        },
      },
      data: {
        points: {
          increment: points,
        },
      },
    })

    await prisma.activity.create({
      data: {
        userId: decoded.userId,
        podId: podId,
        type: "tentacle_log",
        category: category,
        details: {
          value: value,
          unit: unit,
          co2Saved: co2Saved,
          points: points,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: logEntry.id,
        podId: logEntry.podId,
        userId: logEntry.userId,
        category: logEntry.category,
        value: logEntry.value,
        unit: logEntry.unit,
        notes: logEntry.notes,
        imageUrl: logEntry.imageUrl,
        co2Saved: logEntry.co2Saved,
        points: logEntry.points,
        timestamp: logEntry.createdAt,
      },
      message: `Great job! You saved ${co2Saved.toFixed(1)} kg CO2 and earned ${points} points!`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
