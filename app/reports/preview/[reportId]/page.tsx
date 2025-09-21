"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Download,
  FileText,
  Calendar,
  Users,
  Leaf,
  Trophy,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const COLORS = [
  "#059669",
  "#10b981",
  "#34d399",
  "#6ee7b7",
  "#a7f3d0",
  "#d1fae5",
];

interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  summary: {
    totalCO2Saved: number;
    totalPoints: number;
    participantCount: number;
    activeDays: number;
  };
  categories: Record<
    string,
    { co2Saved: number; points: number; progress: number; category: string }
  >;
  achievements: string[];
  previewData: {
    chartData: Array<{
      category: string;
      co2: number;
      points: number;
      progress: number;
    }>;
    trends: Array<{ week: string; co2: number; points: number }>;
  };
}

export default function ReportPreviewPage() {
  const params = useParams();
  const reportId = params.reportId as string;
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("resportw", data);

          setReport(data);
        } else {
          toast.error("Failed to load report");
        }
      } catch (error) {
        console.error("Failed to fetch report:", error);
        toast.error("Failed to load report");
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleDownload = async (format: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        `/api/reports/${reportId}/download?format=${format}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${reportId}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Report downloaded as ${format.toUpperCase()}`);
      } else {
        toast.error("Failed to download report");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading report preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested report could not be found.
          </p>
          <Link href="/reports">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              {report.title}
            </h1>
            <p className="text-muted-foreground">
              Environmental Impact Report Preview
            </p>
          </div>
        </div>

        {/* Download Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleDownload("csv")}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownload("json")}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button
            onClick={() => handleDownload("pdf")}
            disabled={isDownloading}
            className="bg-primary hover:bg-primary/90"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                PDF Report
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Report Info */}
        <Card>
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
            <CardDescription>
              Key metrics and information for this reporting period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="text-lg font-semibold">{report.period}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="text-lg font-semibold">
                    {report.summary.participantCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">CO2 Saved</p>
                  <p className="text-lg font-semibold text-green-600">
                    {report.summary.totalCO2Saved} kg
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <p className="text-lg font-semibold text-primary">
                    {report.summary.totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CO2 Savings by Category */}
          <Card>
            <CardHeader>
              <CardTitle>CO2 Savings by Category</CardTitle>
              <CardDescription>Environmental impact breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.previewData.chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      dataKey="co2"
                      nameKey="category"
                      label={({ name, value }) => `${name}: ${value} kg CO2`}
                      labelLine={true}
                      paddingAngle={2}
                    >
                      {report.previewData.chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} kg CO2`, name]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "8px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span style={{ color: "#333" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Trends</CardTitle>
              <CardDescription>Performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {report.previewData.trends.length > 0 ? (
                    <BarChart
                      data={report.previewData.trends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "#333", fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: "#ccc" }}
                      />
                      <YAxis
                        yAxisId="left"
                        dataKey="co2"
                        tickFormatter={(value) => `${value} kg`}
                        tick={{ fill: "#333", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        dataKey="points"
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fill: "#333", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value, name) =>
                          name === "co2"
                            ? [`${value} kg CO2`, "CO2 Saved"]
                            : [`${value} points`, "Points"]
                        }
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "8px",
                        }}
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span style={{ color: "#333" }}>{value}</span>
                        )}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="co2"
                        fill="#059669"
                        name="CO2 Saved (kg)"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="points"
                        fill="#10b981"
                        name="Points"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No trend data available
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Detailed breakdown by sustainability category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(report.categories).map(([category, data]) => (
                <div
                  key={category}
                  className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {data.progress}%
                      </span>
                    </div>
                    <Progress value={data.progress} className="h-2" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {data.co2Saved} kg CO2
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.points} points
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Key Achievements</CardTitle>
            <CardDescription>
              Notable accomplishments during this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {report.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg"
                >
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
