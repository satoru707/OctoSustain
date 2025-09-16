import { type NextRequest, NextResponse } from "next/server";
import { Pod } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { demo, demoPods } from "@/demo/data";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token);

    let pods;
    if (decoded.email === demo.email) {
      pods = demoPods;
    } else {
      pods = (await prisma.pod.findMany({
        where: {
          members: {
            some: {
              userId: decoded.userId,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      })) as any[];

      pods = pods.map((pod) => {
        return {
          id: pod.id,
          name: pod.name,
          description: pod.description,
          category: pod.category,
          memberCount: pod._count,
          members: pod.members.map((member: any) => ({
            id: member.id,
            joinedAt: member.joinedAt,
            role: member.role,
            userId: member.userId,
            user: {
              id: member.user.id,
              name: member.user.name,
              avatar: member.user.avatar || "/diverse-woman-portrait.png",
            },
          })),
        };
      });
    }
    return NextResponse.json(
      {
        pods,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pod fetch error:", error);
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

    const decoded = verifyToken(token);
    const podId = params.id;

    // Handle demo user
    if (decoded.email === demo.email && decoded.password === demo.password) {
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
        podId: podId,
        role: "member",
        points: 0,
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
