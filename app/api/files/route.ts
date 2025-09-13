import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const podId = searchParams.get("podId")
    const category = searchParams.get("category")
    const challengeId = searchParams.get("challengeId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Mock file listing - replace with database queries
    const mockFiles = [
      {
        id: "file_001",
        originalName: "waste_sorting_photo.jpg",
        fileName: "image_1704067200000_abc123.jpg",
        url: "/uploads/image_1704067200000_abc123.jpg",
        thumbnailUrl: "/uploads/thumbnails/thumb_image_1704067200000_abc123.jpg",
        type: "image/jpeg",
        size: 2048576,
        category: "waste",
        podId: "pod_001",
        challengeId: "ch1",
        uploadedBy: decoded.userId,
        uploadedAt: new Date("2024-01-01T10:00:00Z"),
        metadata: { width: 1920, height: 1080 },
      },
      {
        id: "file_002",
        originalName: "energy_report.pdf",
        fileName: "document_1704153600000_def456.pdf",
        url: "/uploads/document_1704153600000_def456.pdf",
        thumbnailUrl: null,
        type: "application/pdf",
        size: 1048576,
        category: "energy",
        podId: "pod_001",
        challengeId: null,
        uploadedBy: decoded.userId,
        uploadedAt: new Date("2024-01-02T14:30:00Z"),
        metadata: { pages: 5 },
      },
    ]

    let filteredFiles = mockFiles

    // Apply filters
    if (podId) {
      filteredFiles = filteredFiles.filter((f) => f.podId === podId)
    }
    if (category) {
      filteredFiles = filteredFiles.filter((f) => f.category === category)
    }
    if (challengeId) {
      filteredFiles = filteredFiles.filter((f) => f.challengeId === challengeId)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFiles = filteredFiles.slice(startIndex, endIndex)

    return NextResponse.json({
      files: paginatedFiles,
      pagination: {
        page,
        limit,
        total: filteredFiles.length,
        totalPages: Math.ceil(filteredFiles.length / limit),
        hasNext: endIndex < filteredFiles.length,
        hasPrev: page > 1,
      },
      stats: {
        totalFiles: mockFiles.length,
        totalSize: mockFiles.reduce((sum, f) => sum + f.size, 0),
        categories: {
          image: mockFiles.filter((f) => f.type.startsWith("image/")).length,
          document: mockFiles.filter((f) => f.type === "application/pdf").length,
          other: mockFiles.filter((f) => !f.type.startsWith("image/") && f.type !== "application/pdf").length,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
