"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PodCard } from "@/components/pods/pod-card";
import { EmptyState } from "@/components/pods/empty-state";
import api from "@/lib/api";
import { toast } from "sonner";

interface Pod {
  id: string;
  name: string;
  description: string;
  memberCount: { members: number };
  members: Array<{
    id: string;
    joinedAt: string;
    role: string;
    userId: string;
    user: { name: string; avatar: string };
  }>;
  isLive: boolean;
  category: string;
}

interface ResponseWithPods extends Response {
  data: {
    pods: Pod[];
  };
  status: number;
}

export function PodsGrid() {
  const [pods, setPods] = useState([] as Pod[]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    getPods();
  }, []);

  async function getPods() {
    try {
      const response: ResponseWithPods = await api.get("/pods");
      if (response.data.pods) {
        setPods(response.data.pods);
      }
      setIsLoading(false);
    } catch {
      setPods([]);
      toast.error("Failed to fetch pods. Please try again later.");
      setIsLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pods...</span>
      </div>
    );
  }
  return pods.length == 0 ? (
    <EmptyState />
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pods.map((pod) => (
        <PodCard key={pod.id} pod={pod} />
      ))}
    </div>
  );
}
