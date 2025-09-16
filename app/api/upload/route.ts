import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();

    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File;
    const category = (formData.get("category") as string) || "general";
    const podId = formData.get("podId") as string;
    const challengeId = formData.get("challengeId") as string;

    const filesToProcess =
      files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const fileValidationRules = {
      image: {
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        maxSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
      },
      document: {
        allowedTypes: [
          "application/pdf",
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        maxSize: 50 * 1024 * 1024, // 50MB
        maxFiles: 5,
      },
      general: {
        allowedTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/pdf",
        ],
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 5,
      },
    };

    const rules =
      fileValidationRules[category as keyof typeof fileValidationRules] ||
      fileValidationRules.general;

    if (filesToProcess.length > rules.maxFiles) {
      return NextResponse.json(
        { error: `Maximum ${rules.maxFiles} files allowed` },
        { status: 400 }
      );
    }

    const uploadResults = [];

    for (const file of filesToProcess) {
      // Validate file type
      if (!rules.allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type: ${
              file.type
            }. Allowed: ${rules.allowedTypes.join(", ")}`,
          },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > rules.maxSize) {
        return NextResponse.json(
          {
            error: `File too large: ${file.name}. Max size: ${
              rules.maxSize / 1024 / 1024
            }MB`,
          },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split(".").pop();
      const fileName = `${category}_${timestamp}_${randomId}.${fileExtension}`;

      // Mock file upload - replace with real cloud storage
      const mockUrl = `/uploads/${fileName}`;

      let thumbnailUrl = null;
      if (file.type.startsWith("image/")) {
        thumbnailUrl = `/uploads/thumbnails/thumb_${fileName}`;
        // In real implementation, generate actual thumbnail
        console.log("Generating thumbnail for:", fileName);
      }

      const fileRecord = {
        id: `file_${timestamp}_${randomId}`,
        originalName: file.name,
        fileName,
        url: mockUrl,
        thumbnailUrl,
        type: file.type,
        size: file.size,
        category,
        podId,
        challengeId,
        uploadedBy: decoded.userId,
        uploadedAt: new Date(),
        metadata: {
          width: file.type.startsWith("image/") ? 1920 : null, // Mock dimensions
          height: file.type.startsWith("image/") ? 1080 : null,
          duration: file.type.startsWith("video/") ? 120 : null, // Mock duration for videos
        },
      };

      uploadResults.push(fileRecord);

      // In real implementation, upload to cloud storage here
      console.log("Uploading file:", fileRecord);
    }

    return NextResponse.json({
      success: true,
      files: uploadResults,
      message: `Successfully uploaded ${uploadResults.length} file(s)`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
