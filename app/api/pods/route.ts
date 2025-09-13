import { type NextRequest, NextResponse } from "next/server";
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
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    let pods = [];
    if (decoded.email === demo.email && decoded.password === demo.password) {
      pods = demoPods;
    } else {
      const userPods = await prisma.pod.findMany({
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
      });

      // Transform data to match frontend expectations
      pods = userPods.map((pod) => ({
        id: pod.id,
        name: pod.name,
        description: pod.description,
        memberCount: pod._count.members,
        members: pod.members.map((member) => ({
          id: member.user.id,
          name: member.user.name,
          avatar: member.user.avatar || "/diverse-woman-portrait.png",
        })),
        isLive: true, // Could be calculated based on recent activity
        inviteCode: pod.inviteCode,
      }));
    }

    return NextResponse.json({ pods }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { name, description } = await request.json();

    const newPod = await prisma.pod.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: decoded.userId,
            role: "admin",
            points: 0,
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
      },
    });

    // Transform response to match frontend expectations
    const pod = {
      id: newPod.id,
      name: newPod.name,
      description: newPod.description,
      memberCount: 1,
      members: newPod.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        avatar: member.user.avatar || "/diverse-woman-portrait.png",
      })),
      isLive: true,
      inviteCode: newPod.inviteCode,
    };

    return NextResponse.json({ pod }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
