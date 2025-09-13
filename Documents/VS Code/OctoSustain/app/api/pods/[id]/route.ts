import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { demo, demoPods, demoPodData } from "@/demo/data";

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
    var pod = [] as any;
    if (decoded.email === demo.email && decoded.password === demo.password) {
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
      console.log("Pod found", pod);

      if (pod.length === 0 || !pod) {
        return NextResponse.json({ error: "Pod not found" }, { status: 404 });
      }
      // Check if pod exists

      // Check if user is already a member
      const existingMembership = await prisma.podMember.findUnique({
        where: {
          userId_podId: {
            userId: decoded.userId,
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
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
