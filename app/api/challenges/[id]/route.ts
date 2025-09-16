import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: challengeId } = params;

    // Mock challenge details - replace with database queries
    const challenge = {
      id: challengeId,
      name: "Zero Waste Week",
      description:
        "Reduce your waste to zero for an entire week by composting, recycling, and avoiding single-use items.",
      longDescription:
        "This comprehensive challenge will help you understand your waste patterns and develop sustainable habits. You'll learn to identify waste sources, implement reduction strategies, and track your progress toward zero waste living.",
      category: "waste",
      difficulty: "Hard",
      points: 150,
      duration: 7 * 24 * 60 * 60 * 1000,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-01-22"),
      participants: 24,
      maxParticipants: 50,
      progress: 65,
      isJoined: true,
      requirements: [
        "Log daily waste measurements",
        "Upload photos of waste sorting",
        "Complete daily check-ins",
        "Share tips with community",
      ],
      rewards: ["150 Ink Points", "Zero Waste Badge", "Eco Champion Title"],
      tips: [
        "Start by auditing your current waste for one day",
        "Invest in reusable containers and bags",
        "Learn about local composting and recycling programs",
        "Plan meals to reduce food waste",
      ],
      resources: [
        { title: "Zero Waste Guide", url: "/resources/zero-waste-guide" },
        { title: "Composting Basics", url: "/resources/composting" },
        { title: "Recycling Directory", url: "/resources/recycling" },
      ],
      timeline: [
        {
          day: 1,
          title: "Waste Audit",
          description: "Measure and categorize all waste",
        },
        {
          day: 2,
          title: "Reduction Plan",
          description: "Identify reduction opportunities",
        },
        {
          day: 3,
          title: "Implementation",
          description: "Start waste reduction practices",
        },
        { day: 4, title: "Optimization", description: "Refine your approach" },
        {
          day: 5,
          title: "Community Share",
          description: "Share tips with others",
        },
        { day: 6, title: "Final Push", description: "Achieve zero waste day" },
        {
          day: 7,
          title: "Reflection",
          description: "Document learnings and results",
        },
      ],
    };

    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
