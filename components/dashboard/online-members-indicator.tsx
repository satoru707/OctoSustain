"use client";

// still working on it
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";

interface OnlineMembersIndicatorProps {
  podId: string;
}

export function OnlineMembersIndicator({ podId }: OnlineMembersIndicatorProps) {
  const [onlineCount, setOnlineCount] = useState(1); // Include current user
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Join the pod room
    socket.emit("join-pod", podId);

    // Listen for member updates
    socket.on(
      "pod-members-update",
      (data: { onlineMembers; totalOnline: number }) => {
        setOnlineCount(data.totalOnline);
      }
    );

    socket.on("member-joined", () => {
      setOnlineCount((prev) => prev + 1);
    });

    socket.on("member-left", () => {
      setOnlineCount((prev) => Math.max(1, prev - 1));
    });

    socket.on("member-disconnected", () => {
      setOnlineCount((prev) => Math.max(1, prev - 1));
    });

    return () => {
      socket.off("pod-members-update");
      socket.off("member-joined");
      socket.off("member-left");
      socket.off("member-disconnected");
      socket.emit("leave-pod", podId);
    };
  }, [socket, podId]);

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <Users className="h-3 w-3" />
      {onlineCount} online
    </Badge>
  );
}
