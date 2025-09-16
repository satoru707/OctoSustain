import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { reportId } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "pdf";

    // Mock report download - replace with real file generation/retrieval
    console.log(
      `Downloading report ${reportId} in ${format} format for user ${decoded.userId}`
    );

    if (format === "pdf") {
      // Mock PDF generation - replace with real PDF generation (Puppeteer, jsPDF, etc.)
      const pdfContent = generateMockPDF(reportId);

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="report-${reportId}.pdf"`,
        },
      });
    } else if (format === "csv") {
      // Mock CSV generation
      const csvContent = generateMockCSV(reportId);

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="report-${reportId}.csv"`,
        },
      });
    } else if (format === "json") {
      // Mock JSON export
      const jsonContent = generateMockJSON(reportId);

      return new NextResponse(JSON.stringify(jsonContent, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="report-${reportId}.json"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateMockPDF(reportId: string): Buffer {
  // Mock PDF content - replace with real PDF generation
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
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(OctoSustain Report ${reportId}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;

  return Buffer.from(pdfContent);
}

function generateMockCSV(reportId: string): string {
  return `Report ID,${reportId}
Category,CO2 Saved (kg),Points Earned,Progress (%)
Energy,67.2,890,85
Waste,43.1,650,72
Transport,28.4,420,68
Water,12.3,180,45
Food,5.7,200,38
Total,156.7,2340,62`;
}

function generateMockJSON(reportId: string): object {
  return {
    reportId,
    title: "Environmental Impact Report",
    generatedAt: new Date().toISOString(),
    summary: {
      totalCO2Saved: 156.7,
      totalPoints: 2340,
      overallProgress: 62,
    },
    categories: {
      energy: { co2Saved: 67.2, points: 890, progress: 85 },
      waste: { co2Saved: 43.1, points: 650, progress: 72 },
      transport: { co2Saved: 28.4, points: 420, progress: 68 },
      water: { co2Saved: 12.3, points: 180, progress: 45 },
      food: { co2Saved: 5.7, points: 200, progress: 38 },
    },
  };
}
