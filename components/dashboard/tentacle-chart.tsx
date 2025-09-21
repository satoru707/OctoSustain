"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface WeeklyDataPoint {
  day: string;
  value: number;
  co2: number;
}

interface TentacleChartProps {
  category: Category;
  data?: WeeklyDataPoint[];
}

export function TentacleChart({ category, data }: TentacleChartProps) {
  const chartData =
    (data?.filter((point) => point.value > 0 && point.co2 > 0).length == 0
      ? []
      : data) || [];

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-muted/20 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No data available</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start logging activities to see your progress
          </p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-muted/20 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            No {category.name.toLowerCase()} activity this week
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Log some {category.name.toLowerCase()} activities to see your
            progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="day" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => [
              name === "value"
                ? `${value} ${category.name}`
                : `${value} kg CO2`,
              name === "value" ? "Activity" : "CO2 Saved",
            ]}
          />
          <Bar
            dataKey="value"
            fill="#3b826b"
            radius={[4, 4, 0, 0]}
            name="value"
          />
          <Bar
            dataKey="co2"
            fill="#74c69d"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
            name="co2"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
