"use client";

import { useState, useEffect } from "react";
import { PodHeader } from "@/components/pods/pod-header";
import api from "@/lib/api";

interface PodPageProps {
  params: {
    id: string;
  };
}

interface User {
  id: string;
  name: string;
  avatar: string | null;
  role?: string;
}
interface PodProps {
  id: string;
  name: string;
  user: User;
  description: string;
  memberCount: number;
  members: {
    id: string;
    joinedAt: string;
    podId: string;
    role?: string;
    userId: string;
    user: User;
  }[];
  isLive: boolean;
}

interface CustomResponse extends Response {
  data: {
    pod: PodProps;
  };
  status: number;
}

export default function PodPage({ params }: PodPageProps) {
  const [data, setData] = useState<PodProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPod();
  }, [params.id]);
  async function fetchPod() {
    try {
      const response: CustomResponse = await api.get(`/pods/${params.id}`);
      console.log(response);

      if (response.status !== 200) {
        throw new Error("Failed to fetch pod data");
      }
      const result = (await response.data.pod) as PodProps;
      setData(result as PodProps);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading pod data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PodHeader pod={data as any} />

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Redirecting to pod dashboard...
        </p>
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
      </div>

      {/* Auto-redirect to dashboard */}
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(() => window.location.href = '/dashboard/${params.id}', 2000)`,
        }}
      />
    </div>
  );
}
