import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { demo, demoPodData } from "@/demo/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verified = verifyToken(token);
    const podId = params.id;
    let pod = [];
    if (verified.email === demo.email && verified.password === demo.password) {
      pod = demoPodData;
    } else {
      pod = await prisma.pod.findUnique({
        where: { id: podId },
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

      if (pod.length === 0 || !pod) {
        return NextResponse.json({ error: "Pod not found" }, { status: 404 });
      }
      // Check if pod exists

      // Check if user is already a member
      const existingMembership = await prisma.podMember.findUnique({
        where: {
          userId_podId: {
            userId: verified.userId,
            podId: podId,
          },
        },
      });

      if (!existingMembership) {
        return NextResponse.json(
          { error: "You're not a member of this pod" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        pod,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
