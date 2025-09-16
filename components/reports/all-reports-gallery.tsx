"use client";

import { useEffect, useState } from "react";
import { ReportCard } from "@/components/reports/report-card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  title: string;
  type: string;
  dateRange: string;
  co2Saved: number;
  pointsEarned: number;
  categories: {
    energy: number;
    waste: number;
    transport: number;
    water: number;
    food: number;
  };
  generatedAt: string;
  podName?: string;
  podId?: string;
}

export function AllReportsGallery() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports);
        } else {
          toast.error("Failed to fetch reports");
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        toast.error("Failed to fetch reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Reports Generated</h3>
        <p className="text-muted-foreground">
          Generate your first sustainability report to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} showPodName />
      ))}
    </div>
  );
}
