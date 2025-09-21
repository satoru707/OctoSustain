import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userPods = await prisma.podMember.findMany({
      where: {
        userId: payload.userId,
      },
      select: {
        podId: true,
      },
    });

    const podIds = userPods.map((pm) => pm.podId);

    const reports = await prisma.report.findMany({
      where: {
        podId: {
          in: podIds,
        },
      },
      include: {
        pod: {
          select: {
            name: true,
            category: true,
            tentacleLogs: {
              select: {
                co2Saved: true,
                points: true,
                category: true,
                value: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedReports = reports.map((report) => ({
      id: report.id,
      title: report.title,
      type: report.type,
      dateRange: `${new Date(report.endDate).toDateString()} to ${new Date(
        report.startDate
      ).toDateString()}`,
      co2Saved: report.pod.tentacleLogs.reduce(
        (total, log) => total + log.co2Saved,
        0
      ),
      pointsEarned: report.pod.tentacleLogs.reduce(
        (total, log) => total + log.points,
        0
      ),
      categories: {
        energy: report.pod.tentacleLogs
          .filter((log) => log.category === "energy")
          .reduce((total, log) => total + log.value, 0),
        waste: report.pod.tentacleLogs
          .filter((log) => log.category === "waste")
          .reduce((total, log) => total + log.value, 0),
        transport: report.pod.tentacleLogs
          .filter((log) => log.category === "transport")
          .reduce((total, log) => total + log.value, 0),
        water: report.pod.tentacleLogs
          .filter((log) => log.category === "water")
          .reduce((total, log) => total + log.value, 0),
        food: report.pod.tentacleLogs
          .filter((log) => log.category === "food")
          .reduce((total, log) => total + log.value, 0),
      },
      generatedAt: report.createdAt,
      podName: report.pod.name,
      podId: report.podId,
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
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

    const decoded = verifyToken(token);
    const body = await request.json();

    const { podId, type, period, startDate, title, endDate, format } = body;

    // Validate input
    if (!podId || !type || !period) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const podMember = await prisma.podMember.findUnique({
      where: {
        userId_podId: {
          userId: decoded.userId,
          podId,
        },
      },
    });

    if (!podMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const reportStartDate = new Date(startDate);
    const reportEndDate = new Date(endDate);

    // Fetch tentacle logs for the period
    const tentacleLogs = await prisma.tentacleLog.findMany({
      where: {
        podId,
        createdAt: {
          gte: reportStartDate,
          lte: reportEndDate,
        },
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    // Calculate summary statistics
    const totalCO2Saved = tentacleLogs.reduce(
      (sum, log) => sum + log.co2Saved,
      0
    );
    const totalPoints = tentacleLogs.reduce((sum, log) => sum + log.points, 0);
    const participantCount = new Set(tentacleLogs.map((log) => log.userId))
      .size;

    // Group by category
    const categories = tentacleLogs.reduce((acc, log) => {
      if (!acc[log.category]) {
        acc[log.category] = { co2Saved: 0, points: 0, count: 0 };
      }
      acc[log.category].co2Saved += log.co2Saved;
      acc[log.category].points += log.points;
      acc[log.category].count += 1;
      return acc;
    }, {} as Record<string, { co2Saved: number; points: number; count: number }>);

    const categoryGoals = {
      energy: { co2Target: 50, pointsTarget: 500 },
      transport: { co2Target: 75, pointsTarget: 750 },
      waste: { co2Target: 30, pointsTarget: 300 },
      water: { co2Target: 25, pointsTarget: 250 },
      food: { co2Target: 40, pointsTarget: 400 },
    };

    const categoriesWithProgress = Object.entries(categories).reduce(
      (acc, [category, data]) => {
        const goals = categoryGoals[category as keyof typeof categoryGoals] || {
          co2Target: 50,
          pointsTarget: 500,
        };
        const co2Progress = Math.min(
          Math.round((data.co2Saved / goals.co2Target) * 100),
          100
        );
        const pointsProgress = Math.min(
          Math.round((data.points / goals.pointsTarget) * 100),
          100
        );
        const overallProgress = Math.round((co2Progress + pointsProgress) / 2);

        acc[category] = {
          ...data,
          progress: overallProgress,
          co2Progress,
          pointsProgress,
          goals,
        };
        return acc;
      }
    );

    // Generate chart data
    const chartData = Object.entries(categoriesWithProgress).map(
      ([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        co2: Math.round(data.co2Saved * 10) / 10,
        points: data.points,
        progress: data.progress, // Include progress in chart data
      })
    );

    const reportData = {
      summary: {
        totalCO2Saved: Math.round(totalCO2Saved * 10) / 10,
        totalPoints,
        participantCount,
        activeDays: Math.ceil(
          (reportEndDate.getTime() - reportStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        topCategory: Object.keys(categoriesWithProgress).reduce(
          (a, b) =>
            categoriesWithProgress[a]?.co2Saved >
            categoriesWithProgress[b]?.co2Saved
              ? a
              : b,
          "energy"
        ),
      },
      categories: categoriesWithProgress, // Use categories with progress instead of plain categories
      achievements: [
        totalCO2Saved > 100
          ? "Exceeded 100kg CO2 reduction!"
          : "Making great progress on CO2 reduction",
        participantCount > 5
          ? "Strong pod participation"
          : "Growing pod engagement",
        Object.keys(categoriesWithProgress).length > 3
          ? "Multi-category impact"
          : "Focused environmental impact",
      ],
      previewData: {
        chartData,
        trends: [], // Could be calculated with more complex date grouping
      },
    };

    const report = await prisma.report.create({
      data: {
        title,
        type,
        period,
        startDate: reportStartDate,
        endDate: reportEndDate,
        data: reportData,
        format: format || "pdf",
        status: "completed",
        userId: decoded.userId,
        podId,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: "Report generated successfully",
      report: {
        id: report.id,
        title: report.title,
        summary: reportData.summary,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
