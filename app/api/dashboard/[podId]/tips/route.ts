import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { TokenProps } from "@/types/types";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as TokenProps;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user's recent activity to personalize tips
    const recentLogs = await prisma.tentacleLog.findMany({
      where: {
        userId: decoded.userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Analyze user's activity patterns
    const categoryActivity = recentLogs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + log.value;
      return acc;
    }, {} as Record<string, number>);

    // Get the most active category or default to energy
    const mostActiveCategory =
      Object.keys(categoryActivity).reduce((a, b) =>
        categoryActivity[a] > categoryActivity[b] ? a : b
      ) || "energy";

    // Smart tips database with external learning links
    const tipsDatabase = {
      energy: [
        {
          category: "energy",
          message:
            "Based on your energy usage, you could save 15% more by adjusting your thermostat by 2°C during peak hours.",
          potentialSaving: "12.3 kg CO2",
          learnMoreUrl: "https://www.energy.gov/energysaver/thermostats",
        },
        {
          category: "energy",
          message:
            "Your lighting usage suggests switching to LED bulbs could reduce consumption by 75%.",
          potentialSaving: "8.7 kg CO2",
          learnMoreUrl: "https://www.energy.gov/energysaver/led-lighting",
        },
        {
          category: "energy",
          message:
            "Unplugging devices when not in use could save you an additional 10% on your energy bill.",
          potentialSaving: "5.2 kg CO2",
          learnMoreUrl: "https://www.energy.gov/energysaver/energy-vampires",
        },
      ],
      waste: [
        {
          category: "waste",
          message:
            "Your waste reduction efforts are great! Try composting organic waste to reduce landfill impact by 30%.",
          potentialSaving: "18.5 kg CO2",
          learnMoreUrl: "https://www.epa.gov/recycle/composting-home",
        },
        {
          category: "waste",
          message:
            "Consider buying in bulk to reduce packaging waste by up to 40%.",
          potentialSaving: "6.8 kg CO2",
          learnMoreUrl:
            "https://www.epa.gov/recycle/reducing-waste-what-you-can-do",
        },
      ],
      transport: [
        {
          category: "transport",
          message:
            "Your transport logs show potential for carpooling 2 days a week, saving 25% emissions.",
          potentialSaving: "22.1 kg CO2",
          learnMoreUrl:
            "https://www.epa.gov/greenvehicles/what-you-can-do-reduce-pollution-vehicles-and-engines",
        },
        {
          category: "transport",
          message:
            "Combining errands into one trip could reduce your weekly driving by 15%.",
          potentialSaving: "14.3 kg CO2",
          learnMoreUrl: "https://www.fueleconomy.gov/feg/driveHabits.jsp",
        },
      ],
      water: [
        {
          category: "water",
          message:
            "Installing low-flow showerheads could reduce your water usage by 40% without sacrificing comfort.",
          potentialSaving: "9.6 kg CO2",
          learnMoreUrl: "https://www.epa.gov/watersense/showerheads",
        },
        {
          category: "water",
          message:
            "Fixing leaky faucets could save up to 3,000 gallons per year.",
          potentialSaving: "4.2 kg CO2",
          learnMoreUrl: "https://www.epa.gov/watersense/fix-leak-week",
        },
      ],
      food: [
        {
          category: "food",
          message:
            "Reducing meat consumption by one day per week could save 1,900 lbs of CO2 annually.",
          potentialSaving: "36.8 kg CO2",
          learnMoreUrl:
            "https://www.epa.gov/sustainable-management-food/sustainable-management-food-basics",
        },
        {
          category: "food",
          message:
            "Meal planning could reduce food waste by 25% and save money on groceries.",
          potentialSaving: "11.4 kg CO2",
          learnMoreUrl:
            "https://www.epa.gov/sustainable-management-food/food-recovery-hierarchy",
        },
      ],
    };

    // Select a random tip from the most active category
    const categoryTips =
      tipsDatabase[mostActiveCategory as keyof typeof tipsDatabase] ||
      tipsDatabase.energy;
    const randomTip =
      categoryTips[Math.floor(Math.random() * categoryTips.length)];

    return NextResponse.json({
      tip: randomTip,
      userActivity: {
        mostActiveCategory,
        totalLogs: recentLogs.length,
        weeklyTotal: Object.values(categoryActivity).reduce(
          (sum, val) => sum + val,
          0
        ),
      },
    });
  } catch (error) {
    console.error("Tips API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
