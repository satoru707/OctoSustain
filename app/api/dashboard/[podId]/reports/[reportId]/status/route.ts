import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = params;

    // Mock report status - replace with real database queries
    const reportStatus = {
      id: reportId,
      status: "completed", // generating, completed, failed
      progress: 100,
      message: "Report generated successfully",
      downloadUrl: `/api/reports/${reportId}/download`,
      createdAt: new Date(Date.now() - 30000),
      completedAt: new Date(),
      fileSize: "2.4 MB",
      format: "pdf",
    };

    return NextResponse.json(reportStatus);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
