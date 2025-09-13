import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { podId: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { podId } = params

    // Verify user is member of this pod
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

    // Get pod details with members
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!pod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 })
    }

    // Get tentacle logs for the past week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const tentacleLogs = await prisma.tentacleLog.findMany({
      where: {
        podId: podId,
        createdAt: {
          gte: weekAgo,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get active challenges for this pod's members
    const activeChallenges = await prisma.challenge.findMany({
      where: {
        isActive: true,
        endDate: {
          gte: new Date(),
        },
        participants: {
          some: {
            userId: {
              in: pod.members.map((m) => m.userId),
            },
          },
        },
      },
      include: {
        participants: {
          where: {
            userId: decoded.userId,
          },
        },
      },
      take: 5,
    })

    // Calculate tentacle data by category
    const categories = ["energy", "waste", "transport", "water", "food", "custom"]
    const tentacles: any = {}

    for (const category of categories) {
      const categoryLogs = tentacleLogs.filter((log) => log.category === category)
      const totalValue = categoryLogs.reduce((sum, log) => sum + log.value, 0)
      const totalCo2 = categoryLogs.reduce((sum, log) => sum + log.co2Saved, 0)

      // Group by day for weekly data
      const weeklyData = []
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const dayLogs = categoryLogs.filter((log) => log.createdAt.toDateString() === date.toDateString())
        const dayValue = dayLogs.reduce((sum, log) => sum + log.value, 0)
        const dayCo2 = dayLogs.reduce((sum, log) => sum + log.co2Saved, 0)

        weeklyData.push({
          day: days[date.getDay()],
          value: dayValue,
          co2: dayCo2,
        })
      }

      tentacles[category] = {
        current: totalValue,
        target: 100, // Could be fetched from goals table
        unit: categoryLogs[0]?.unit || getDefaultUnit(category),
        co2Saved: totalCo2,
        weeklyData,
      }
    }

    // Calculate leaderboard
    const leaderboard = pod.members
      .map((member) => ({
        id: member.user.id,
        name: member.user.name,
        points: member.points,
        rank: 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((member, index) => ({ ...member, rank: index + 1 }))

    // Get recent activity
    const recentActivity = tentacleLogs.slice(0, 10).map((log) => ({
      id: log.id,
      user: log.user.name,
      action: `logged ${log.value} ${log.unit} ${log.category} savings`,
      timestamp: log.createdAt,
      category: log.category,
    }))

    const dashboardData = {
      pod: {
        id: pod.id,
        name: pod.name,
        members: pod.members.map((member) => ({
          id: member.user.id,
          name: member.user.name,
          avatar: member.user.avatar || "/diverse-woman-portrait.png",
          isOnline: true, // Could be calculated from socket connections
          lastActive: new Date(),
        })),
        memberCount: pod.members.length,
        onlineCount: pod.members.length, // Mock for now
      },
      tentacles,
      gamification: {
        userPoints: podMember.points,
        leaderboard,
        activeChallenges: activeChallenges.map((challenge) => ({
          id: challenge.id,
          name: challenge.title,
          timeLeft: challenge.endDate.getTime() - Date.now(),
          progress: challenge.participants[0]?.progress || 0,
          points: challenge.points,
        })),
        predictiveTip: {
          category: "energy",
          message:
            "Based on your usage pattern, you could save 15% more energy by adjusting your thermostat by 2°C during peak hours.",
          potentialSaving: "12.3 kg CO2",
        },
      },
      recentActivity,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to get default units for categories
function getDefaultUnit(category: string): string {
  const units: Record<string, string> = {
    energy: "kWh",
    waste: "kg",
    transport: "km",
    water: "L",
    food: "meals",
    custom: "actions",
  }
  return units[category] || "units"
}
