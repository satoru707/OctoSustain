import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { demo } from "@/demo/data";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // put demo user in db if it doesn't exist
    if (email === demo.email && password === demo.password) {
      let demoUser = await prisma.user.findUnique({
        where: { email: demo.email },
      });
      if (!demoUser) {
        const hashedPassword = await bcrypt.hash("demo123", 10);
        demoUser = await prisma.user.create({
          data: {
            email: "demo@octosustain.com",
            password: hashedPassword,
            name: "Demo User",
          },
        });
      }

      const token = signToken({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: demoUser.id, email: demoUser.email, name: demoUser.name },
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
