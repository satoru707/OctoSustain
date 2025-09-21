import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { reportId } = params;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: { name: true },
        },
        pod: {
          select: { name: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const podMember = await prisma.podMember.findUnique({
      where: {
        userId_podId: {
          userId: decoded.userId,
          podId: report.podId,
        },
      },
    });

    if (!podMember && report.userId !== decoded.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const reportData = report.data;

    const transformedReport = {
      id: report.id,
      title: report.title,
      type: report.type,
      period: report.period,
      podId: report.podId,
      podName: report.pod.name,
      generatedAt: report.createdAt,
      generatedBy: report.user.name,
      status: report.status,
      summary: reportData?.summary || null,
      categories: reportData?.categories || null,
      achievements: reportData?.achievements || [],
      downloadUrl: `/api/reports/${report.id}/download`,
      previewData: reportData?.previewData || null,
    };

    return NextResponse.json(transformedReport);
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
