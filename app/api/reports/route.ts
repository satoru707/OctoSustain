import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

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
