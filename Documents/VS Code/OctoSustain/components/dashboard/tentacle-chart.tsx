"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Category {
  id: string
  name: string
  color: string
}

interface TentacleChartProps {
  category: Category
}

// Mock data for different categories
const generateMockData = (categoryId: string) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day, index) => ({
    day,
    value: Math.floor(Math.random() * 50) + 10 + index * 2,
    target: 30 + index,
  }))
}

export function TentacleChart({ category }: TentacleChartProps) {
  const data = generateMockData(category.id)

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="day" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="value" fill="#3b826b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="target" fill="#74c69d" radius={[4, 4, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
