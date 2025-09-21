import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { demo } from "@/demo/data";
import { TokenProps } from "@/types/types";

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

    const decoded = verifyToken(token) as TokenProps;
    const podId = params.id;

    // Check if pod exists
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
    });

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
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as TokenProps;
    const podId = params.id;

    // Handle demo user
    if (decoded.email === demo.email) {
      return NextResponse.json(
        {
          success: true,
          message: "Already a member",
          alreadyMember: true,
        },
        { status: 200 }
      );
    }

    // Check if pod exists
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      select: { id: true, name: true },
    });

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
        {
          success: true,
          message: "Already a member",
          alreadyMember: true,
        },
        { status: 200 }
      );
    }

    // Add user as a member
    await prisma.podMember.create({
      data: {
        userId: decoded.userId,
        podId: `${podId}`,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        userId: decoded.userId,
        podId: podId,
        type: "pod_join",
        details: {
          podName: pod.name,
          joinMethod: "invite_link",
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the pod!",
        alreadyMember: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pod invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
