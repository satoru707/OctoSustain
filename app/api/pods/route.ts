import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock pods data
const mockPods = [
  {
    id: "1",
    name: "Green Office Initiative",
    description: "Reducing our workplace carbon footprint through collaborative eco-tracking",
    memberCount: 12,
    members: [
      { id: "1", name: "Alice Johnson", avatar: "/diverse-woman-portrait.png" },
      { id: "2", name: "Bob Smith", avatar: "/diverse-man-portrait.png" },
      { id: "3", name: "Carol Davis", avatar: "/diverse-woman-portrait-2.png" },
    ],
    isLive: true,
  },
  {
    id: "2",
    name: "Sustainable Living Community",
    description: "Neighbors working together to create a more sustainable neighborhood",
    memberCount: 8,
    members: [
      { id: "4", name: "David Wilson", avatar: "/diverse-man-portrait-2.png" },
      { id: "5", name: "Eva Martinez", avatar: "/diverse-woman-portrait-3.png" },
    ],
    isLive: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    return NextResponse.json({ pods: mockPods })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    const { name, description } = await request.json()

    const newPod = {
      id: Date.now().toString(),
      name,
      description,
      memberCount: 1,
      members: [{ id: decoded.userId, name: "You", avatar: "/diverse-woman-portrait.png" }],
      isLive: true,
    }

    return NextResponse.json({ pod: newPod })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
