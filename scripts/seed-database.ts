import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo users
  const demoPassword = await bcrypt.hash("demo123", 10)

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@octosustain.com" },
    update: {},
    create: {
      email: "demo@octosustain.com",
      password: demoPassword,
      name: "Demo User",
      avatar: "/friendly-person.jpg",
    },
  })

  const alexUser = await prisma.user.upsert({
    where: { email: "alex@octosustain.com" },
    update: {},
    create: {
      email: "alex@octosustain.com",
      password: demoPassword,
      name: "Alex Chen",
      avatar: "/thoughtful-asian-person.png",
    },
  })

  const mariaUser = await prisma.user.upsert({
    where: { email: "maria@octosustain.com" },
    update: {},
    create: {
      email: "maria@octosustain.com",
      password: demoPassword,
      name: "Maria Garcia",
      avatar: "/confident-latina-woman.png",
    },
  })

  // Create demo pod
  const demoPod = await prisma.pod.upsert({
    where: { inviteCode: "DEMO-POD-2024" },
    update: {},
    create: {
      name: "EcoWarriors Demo Pod",
      description: "A demonstration pod showcasing OctoSustain features with sample environmental tracking data.",
      inviteCode: "DEMO-POD-2024",
    },
  })

  // Add users to pod
  await prisma.podMember.upsert({
    where: {
      userId_podId: {
        userId: demoUser.id,
        podId: demoPod.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      podId: demoPod.id,
      role: "admin",
      points: 1250,
    },
  })

  await prisma.podMember.upsert({
    where: {
      userId_podId: {
        userId: alexUser.id,
        podId: demoPod.id,
      },
    },
    update: {},
    create: {
      userId: alexUser.id,
      podId: demoPod.id,
      role: "member",
      points: 890,
    },
  })

  await prisma.podMember.upsert({
    where: {
      userId_podId: {
        userId: mariaUser.id,
        podId: demoPod.id,
      },
    },
    update: {},
    create: {
      userId: mariaUser.id,
      podId: demoPod.id,
      role: "member",
      points: 1100,
    },
  })

  // Create sample tentacle logs
  const categories = ["energy", "waste", "transport", "water", "food"]
  const users = [demoUser, alexUser, mariaUser]

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const value = Math.random() * 100 + 10
    const co2Saved = value * 0.5 + Math.random() * 10
    const points = Math.floor(co2Saved * 2)

    await prisma.tentacleLog.create({
      data: {
        userId: user.id,
        podId: demoPod.id,
        category,
        value,
        unit: category === "energy" ? "kWh" : category === "water" ? "L" : "kg",
        notes: `Sample ${category} tracking entry`,
        co2Saved,
        points,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    })
  }

  // Create sample challenges
  const challenges = [
    {
      title: "Zero Waste Week",
      description:
        "Reduce your waste to zero for an entire week by composting, recycling, and avoiding single-use items.",
      category: "waste",
      target: 0,
      unit: "kg",
      points: 150,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-01-22"),
    },
    {
      title: "Bike to Work Challenge",
      description: "Cycle to work for 5 consecutive days and track your carbon footprint reduction.",
      category: "transport",
      target: 50,
      unit: "km",
      points: 100,
      startDate: new Date("2024-01-20"),
      endDate: new Date("2024-01-25"),
    },
    {
      title: "Energy Saver Sprint",
      description: "Reduce your energy consumption by 20% compared to last month's average.",
      category: "energy",
      target: 20,
      unit: "%",
      points: 75,
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-01-24"),
    },
  ]

  for (const challengeData of challenges) {
    const challenge = await prisma.challenge.upsert({
      where: { title: challengeData.title },
      update: {},
      create: challengeData,
    })

    // Add some participants
    await prisma.challengeParticipation.upsert({
      where: {
        userId_challengeId: {
          userId: demoUser.id,
          challengeId: challenge.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        challengeId: challenge.id,
        progress: Math.random() * 100,
      },
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log("🔑 Demo login: demo@octosustain.com / demo123")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
