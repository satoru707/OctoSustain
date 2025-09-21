import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (decoded.exp * 1000 < Date.now()) {
      request.cookies.delete("auth-token");
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
