import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { TokenProps } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as TokenProps;
    const body = await request.json();

    const { action, fileIds, data } = body;

    if (!action || !fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = {
      success: true,
      message: "",
      affectedFiles: fileIds.length,
    };

    switch (action) {
      case "delete":
        // Mock bulk delete
        console.log(
          `Bulk deleting ${fileIds.length} files by user ${decoded.userId}`
        );
        result.message = `Successfully deleted ${fileIds.length} files`;
        break;

      case "move":
        if (!data?.category) {
          return NextResponse.json(
            { error: "Category required for move operation" },
            { status: 400 }
          );
        }
        // Mock bulk move
        console.log(
          `Moving ${fileIds.length} files to category ${data.category}`
        );
        result.message = `Successfully moved ${fileIds.length} files to ${data.category}`;
        break;

      case "tag":
        if (!data?.tags || !Array.isArray(data.tags)) {
          return NextResponse.json(
            { error: "Tags required for tag operation" },
            { status: 400 }
          );
        }
        // Mock bulk tagging
        console.log(
          `Adding tags ${data.tags.join(", ")} to ${fileIds.length} files`
        );
        result.message = `Successfully tagged ${fileIds.length} files`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
