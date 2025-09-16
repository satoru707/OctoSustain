import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: { podId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { podId } = params;

    // Mock goals data - replace with database queries
    const goals = {
      energy: { target: 100, current: 75, unit: "kWh", deadline: "2024-12-31" },
      waste: { target: 80, current: 60, unit: "kg", deadline: "2024-12-31" },
      transport: {
        target: 70,
        current: 45,
        unit: "km",
        deadline: "2024-12-31",
      },
      water: { target: 100, current: 85, unit: "L", deadline: "2024-12-31" },
      food: { target: 90, current: 55, unit: "meals", deadline: "2024-12-31" },
      custom: {
        target: 50,
        current: 30,
        unit: "actions",
        deadline: "2024-12-31",
      },
    };

    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { podId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    const { podId } = params;
    const body = await request.json();

    // Mock goal update - replace with database operations
    console.log("Updating goals for pod:", podId, "Data:", body);

    return NextResponse.json({
      success: true,
      message: "Goals updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
