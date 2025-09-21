import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const { reportId } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "pdf";

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        user: { select: { name: true } },
        pod: { select: { name: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const reportData = report.data;

    if (format === "pdf") {
      const pdfContent = generatePDF(report, reportData);
      const pdfStream = new ReadableStream({
        start(controller) {
          controller.enqueue(pdfContent);
          controller.close();
        },
      });

      return new NextResponse(pdfStream, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${
            report.title || "report"
          }-${reportId}.pdf"`,
        },
      });
    } else if (format === "csv") {
      const csvContent = generateCSV(report, reportData);
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${
            report.title || "report"
          }-${reportId}.csv"`,
        },
      });
    } else if (format === "json") {
      const jsonContent = generateJSON(report, reportData);
      return new NextResponse(JSON.stringify(jsonContent, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${
            report.title || "report"
          }-${reportId}.json"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generatePDF(report, reportData) {
  const summary = reportData?.summary || {};
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 400
>>
stream
BT
/F1 16 Tf
72 720 Td
(${report.title || "Environmental Impact Report"}) Tj
0 -30 Td
/F1 12 Tf
(Report ID: ${report.id}) Tj
0 -20 Td
(Pod: ${report.pod?.name || "N/A"}) Tj
0 -20 Td
(Generated: ${new Date(report.createdAt).toLocaleDateString()}) Tj
0 -20 Td
(Period: ${report.period || "N/A"}) Tj
0 -30 Td
(Total CO2 Saved: ${summary.totalCO2Saved || 0} kg) Tj
0 -20 Td
(Total Points: ${summary.totalPoints || 0}) Tj
0 -20 Td
(Participants: ${summary.participantCount || 0}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000273 00000 n 
0000000724 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
793
%%EOF`;

  return Buffer.from(pdfContent);
}

function generateCSV(report, reportData): string {
  const summary = reportData?.summary || {};
  const categories = reportData?.categories || {};

  let csv = `Report ID,${report.id}\n`;
  csv += `Title,${report.title || "N/A"}\n`;
  csv += `Pod,${report.pod?.name || "N/A"}\n`;
  csv += `Generated Date,${new Date(report.createdAt).toISOString()}\n`;
  csv += `Period,${report.period || "N/A"}\n`;
  csv += `Type,${report.type || "N/A"}\n\n`;

  if (summary.totalCO2Saved || summary.totalPoints) {
    csv += `Summary\n`;
    csv += `Total CO2 Saved (kg),${summary.totalCO2Saved || 0}\n`;
    csv += `Total Points,${summary.totalPoints || 0}\n`;
    csv += `Participants,${summary.participantCount || 0}\n`;
    csv += `Active Days,${summary.activeDays || 0}\n\n`;
  }

  if (Object.keys(categories).length > 0) {
    csv += `Category,CO2 Saved (kg),Points Earned,Progress (%)\n`;
    Object.entries(categories).forEach(([category, data]) => {
      csv += `${category},${data.co2Saved || 0},${data.points || 0},${
        data.progress || 0
      }\n`;
    });
  }

  return csv;
}

function generateJSON(report, reportData): object {
  return {
    reportId: report.id,
    title: report.title,
    type: report.type,
    period: report.period,
    podName: report.pod?.name,
    generatedAt: report.createdAt,
    generatedBy: report.user?.name,
    status: report.status,
    data: reportData || {},
  };
}
