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

    const decoded = verifyToken(token) as any;
    const { reportId } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    const report = await prisma.report.findUnique({
      where: {
        userId: decoded.userId,
        id: reportId,
      },
      include: {
        user: {
          select: { name: true },
        },
        pod: {
          select: {
            category: true,
            description: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report does not exist" },
        { status: 403 }
      );
    }

    const transformedReports = {
      id: report.id,
      title: report.title,
      type: report.type,
      period: report.period,
      podId: report.podId,
      generatedAt: report.createdAt,
      generatedBy: report.user.name,
      status: report.status,
      summary: {
        totalCO2Saved: 0,
        totalPoints: 0,
        participantCount: 0,
        activeDays: 0,
        topCategory: "energy",
      },
      categories: report.pod.category || {},
      achievements: [],
      downloadUrl: `/api/reports/${report.id}/download`,
      previewData: {
        chartData: [],
        trends: [],
      },
    };

    // const stats = {
    //   total: report,
    //   monthly: reports.filter((r) => r.type === "monthly").length,
    //   quarterly: reports.filter((r) => r.type === "quarterly").length,
    //   challenge: reports.filter((r) => r.type === "challenge").length,
    //   totalCO2Saved: transformedReports.reduce(
    //     (sum, r) => sum + (r.summary.totalCO2Saved || 0),
    //     0
    //   ),
    //   totalPoints: transformedReports.reduce(
    //     (sum, r) => sum + (r.summary.totalPoints || 0),
    //     0
    //   ),
    // };

    return NextResponse.json({
      reports: transformedReports,
      // stats,
    });
  } catch (error) {
    console.error("Reports fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { podId: string } }
// ) {
//   try {
//     const token = request.cookies.get("auth-token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token) as any;
//     const { podId } = params;
//     const { searchParams } = new URL(request.url);
//     const type = searchParams.get("type") || "all";

//     const podMember = await prisma.podMember.findUnique({
//       where: {
//         userId_podId: {
//           userId: decoded.userId,
//           podId,
//         },
//       },
//     });

//     if (!podMember) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     const reports = await prisma.report.findMany({
//       where: {
//         podId,
//         ...(type !== "all" ? { type } : {}),
//       },
//       include: {
//         user: {
//           select: { name: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const transformedReports = await Promise.all(
//       reports.map(async (report) => {
//         const reportData = report.data as any;

//         return {
//           id: report.id,
//           title: report.title,
//           type: report.type,
//           period: report.period,
//           podId: report.podId,
//           generatedAt: report.createdAt,
//           generatedBy: report.user.name,
//           status: report.status,
//           summary: reportData.summary || {
//             totalCO2Saved: 0,
//             totalPoints: 0,
//             participantCount: 0,
//             activeDays: 0,
//             topCategory: "energy",
//           },
//           categories: reportData.categories || {},
//           achievements: reportData.achievements || [],
//           downloadUrl: `/api/reports/${report.id}/download`,
//           previewData: reportData.previewData || {
//             chartData: [],
//             trends: [],
//           },
//         };
//       })
//     );

//     const stats = {
//       total: reports.length,
//       monthly: reports.filter((r) => r.type === "monthly").length,
//       quarterly: reports.filter((r) => r.type === "quarterly").length,
//       challenge: reports.filter((r) => r.type === "challenge").length,
//       totalCO2Saved: transformedReports.reduce(
//         (sum, r) => sum + (r.summary.totalCO2Saved || 0),
//         0
//       ),
//       totalPoints: transformedReports.reduce(
//         (sum, r) => sum + (r.summary.totalPoints || 0),
//         0
//       ),
//     };

//     return NextResponse.json({
//       reports: transformedReports,
//       stats,
//     });
//   } catch (error) {
//     console.error("Reports fetch error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
