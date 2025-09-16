"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Users } from "lucide-react";
import { toast } from "sonner";

interface InvitePageProps {
  params: {
    id: string;
  };
}

export default function PodInvitePage({ params }: InvitePageProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    alreadyMember: boolean;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleInvite = async () => {
      try {
        const response = await fetch(`/api/pods/${params.id}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setResult(data);
          if (data.alreadyMember) {
            toast.info("You're already a member of this pod!");
          } else {
            toast.success("Successfully joined the pod!");
          }
        } else {
          toast.error(data.error || "Failed to process invite");
          router.push("/pods");
        }
      } catch (error) {
        console.error("Invite error:", error);
        toast.error("Something went wrong");
        router.push("/pods");
      } finally {
        setLoading(false);
      }
    };

    handleInvite();
  }, [params.id, router]);

  const handleContinue = () => {
    router.push(`/dashboard/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
            <p className="text-gray-600">Processing your invite...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
            {result.alreadyMember ? (
              <Users className="h-8 w-8 text-teal-600" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {result.alreadyMember
              ? "Welcome Back!"
              : "Pod Joined Successfully!"}
          </CardTitle>
          <CardDescription>{result.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {result.alreadyMember ? "Go to Dashboard" : "Enter Dashboard"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/pods")}
            className="w-full"
          >
            View All Pods
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
