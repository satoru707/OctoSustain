import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { podId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        podId: params.podId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to last 50 activities
    });

    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      userId: activity.user.id,
      name: activity.user.name,
      category: activity.category,
      details: activity.details,
      timestamp: activity.createdAt,
    }));

    return NextResponse.json({ activities: formattedActivities });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
