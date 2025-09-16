import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    const body = await request.json();

    const {
      podId,
      type,
      period,
      startDate,
      endDate,
      includeCharts,
      includeDetails,
      format,
    } = body;

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

    // Generate chart data
    const chartData = Object.entries(categories).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      co2: Math.round(data.co2Saved * 10) / 10,
      points: data.points,
    }));

    const reportData = {
      summary: {
        totalCO2Saved: Math.round(totalCO2Saved * 10) / 10,
        totalPoints,
        participantCount,
        activeDays: Math.ceil(
          (reportEndDate.getTime() - reportStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        topCategory: Object.keys(categories).reduce(
          (a, b) => (categories[a]?.co2Saved > categories[b]?.co2Saved ? a : b),
          "energy"
        ),
      },
      categories,
      achievements: [
        totalCO2Saved > 100
          ? "Exceeded 100kg CO2 reduction!"
          : "Making great progress on CO2 reduction",
        participantCount > 5
          ? "Strong pod participation"
          : "Growing pod engagement",
        Object.keys(categories).length > 3
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
        title: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Report - ${period}`,
        type,
        period,
        startDate: reportStartDate,
        endDate: reportEndDate,
        data: reportData,
        format: format || "pdf",
        status: "completed", // In production, this would start as "generating"
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
