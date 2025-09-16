// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { PodHeader } from "@/components/pods/pod-header";
// import api from "@/lib/api";

// interface PodPageProps {
//   params: {
//     id: string;
//   };
// }

// interface User {
//   id: string;
//   name: string;
//   avatar: string | null;
//   role?: string;
// }

// interface PodProps {
//   id: string;
//   name: string;
//   user: User;
//   description: string;
//   memberCount: number;
//   members: {
//     id: string;
//     joinedAt: string;
//     podId: string;
//     role?: string;
//     userId: string;
//     user: User;
//   }[];
//   isLive: boolean;
// }

// interface CustomResponse extends Response {
//   data: {
//     pod: PodProps;
//   };
//   status: number;
// }

// export default function PodPage({ params }: PodPageProps) {
//   const [data, setData] = useState<PodProps>();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchPod();
//   }, [params.id]);

//   async function fetchPod() {
//     try {
//       const response: CustomResponse = await api.get(`/pods/${params.id}`);

//       if (response.status !== 200) {
//         throw new Error("Failed to fetch pod data");
//       }

//       const result = response.data.pod as PodProps;
//       setData(result);

//       setTimeout(() => {
//         router.push(`/dashboard/${params.id}`);
//       }, 2000);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "An unknown error occurred"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
//         <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
//         <p className="text-muted-foreground mt-4">Loading pod data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
//         <p className="text-red-500">Error: {error}</p>
//         <button
//           onClick={() => router.push("/pods")}
//           className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
//         >
//           Back to Pods
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <PodHeader pod={data as any} />

//       <div className="mt-8 text-center">
//         <p className="text-muted-foreground mb-4">
//           Redirecting to pod dashboard...
//         </p>
//         <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PodHeader } from "@/components/pods/pod-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Target, TrendingUp } from "lucide-react";
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
  inviteCode?: string;
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
  const router = useRouter();

  useEffect(() => {
    fetchPod();
  }, [params.id]);

  async function fetchPod() {
    try {
      const response: CustomResponse = await api.get(`/pods/${params.id}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch pod data");
      }

      const result = response.data.pod as PodProps;
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleEnterDashboard = () => {
    router.push(`/dashboard/${params.id}`);
  };

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
        <button
          onClick={() => router.push("/pods")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Pods
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PodHeader pod={data as any} />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold">Collaboration</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Work together with {data?.memberCount} members to track and
              improve your environmental impact.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">Sustainability Goals</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Set and achieve environmental targets across energy, waste,
              transport, and more.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold">Real-time Tracking</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor your progress with live updates and detailed analytics.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-emerald-500/5">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Tracking?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Enter your pod dashboard to begin logging sustainability
              activities, participating in challenges, and collaborating with
              your team members.
            </p>
            <Button
              onClick={handleEnterDashboard}
              size="lg"
              className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
