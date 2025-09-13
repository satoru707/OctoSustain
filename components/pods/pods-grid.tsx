"use client";

import { useState, useEffect } from "react";
import { PodCard } from "@/components/pods/pod-card";
import { EmptyState } from "@/components/pods/empty-state";
import api from "@/lib/api";

interface Pod {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: { id: string; name: string; avatar: string }[];
  isLive: boolean;
  inviteCode: string;
  category: string;
}

interface ResponseWithPods extends Response {
  pods: Pod[];
}

export function PodsGrid() {
  const [pods, setPods] = useState([] as Pod[]);

  useEffect(() => {
    getPods();
  }, []);

  async function getPods() {
    const response: ResponseWithPods = await api.get("/pods");
    console.log("Current Pods response:", response);

    if (response.ok && response?.pods) {
      setPods(response.pods);
    } else {
      setPods([]);
    }
  }
  if (pods.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pods.map((pod) => (
        <PodCard key={pod.id} pod={pod} />
      ))}
    </div>
  );
}
