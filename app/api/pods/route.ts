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

    let pods;
    if (decoded.email === demo.email) {
      pods = demoPods;
    } else {
      pods = await prisma.pod.findMany({
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

      pods = pods.map((pod) => {
        return {
          id: pod.id,
          name: pod.name,
          description: pod.description,
          category: pod.category,
          memberCount: pod._count,
          members: pod.members.map((member) => ({
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

    const { name, description, category } = await request.json();

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Pod name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newPod = await prisma.pod.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        inviteCode,
        category,
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
    console.error("Pod creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
