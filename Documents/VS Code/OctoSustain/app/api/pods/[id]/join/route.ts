import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    console.log("Got token", token);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;
    const podId = params.id;
    console.log("Decoded token", decoded);
    console.log("Pod ID", podId);

    // Check if pod exists
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
    });
    console.log("Pod found", pod);

    if (!pod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.podMember.findUnique({
      where: {
        userId_podId: {
          userId: decoded.userId,
          podId: podId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Already a member of this pod" },
        { status: 400 }
      );
    }

    // Add user to pod
    await prisma.podMember.create({
      data: {
        userId: decoded.userId,
        podId: podId,
        role: "member",
        points: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined pod",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
