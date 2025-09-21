"use client";

import { useEffect, useState } from "react";
import { useSocket } from "./use-socket";

interface TentacleUpdate {
  userId: string;
  username: string;
  category: string;
  value: number;
  co2Saved: number;
  points: number;
  timestamp: Date;
}

interface MemberActivity {
  userId: string;
  username: string;
  isOnline: boolean;
  lastActive?: Date;
}

interface ActivityFeed {
  id: string;
  userId: string;
  username: string;
  action: string;
  category: string;
  details: any;
  timestamp: Date;
}

export function useRealTimeDashboard(podId: string, token?: string) {
  const { socket, isConnected, joinPod, leavePod } = useSocket(token);
  const [onlineMembers, setOnlineMembers] = useState<MemberActivity[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<TentacleUpdate[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([]);
  const [tentacleAnimations, setTentacleAnimations] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!socket || !isConnected || !podId) return;

    // Join the pod room
    joinPod(podId);

    // Listen for member updates
    const handleMembersUpdate = (data: {
      onlineMembers: MemberActivity[];
      totalOnline: number;
    }) => {
      setOnlineMembers(data.onlineMembers);
    };

    const handleMemberJoined = (data: {
      userId: string;
      username: string;
      timestamp: Date;
    }) => {
      setOnlineMembers((prev) => [
        ...prev.filter((m) => m.userId !== data.userId),
        { userId: data.userId, username: data.username, isOnline: true },
      ]);
    };

    const handleMemberLeft = (data: {
      userId: string;
      username: string;
      timestamp: Date;
    }) => {
      setOnlineMembers((prev) => prev.filter((m) => m.userId !== data.userId));
    };

    // Listen for tentacle updates
    const handleTentacleUpdate = (data: TentacleUpdate) => {
      setRecentUpdates((prev) => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
    };

    // Listen for tentacle animations
    const handleTentacleAnimation = (data: {
      category: string;
      progress: number;
    }) => {
      setTentacleAnimations((prev) => ({
        ...prev,
        [data.category]: data.progress,
      }));

      // Clear animation after 3 seconds
      setTimeout(() => {
        setTentacleAnimations((prev) => {
          const newAnimations = { ...prev };
          delete newAnimations[data.category];
          return newAnimations;
        });
      }, 3000);
    };

    // Listen for activity feed
    const handleNewActivity = (activity: ActivityFeed) => {
      setActivityFeed((prev) => [activity, ...prev.slice(0, 19)]); // Keep last 20 activities
    };

    // Set up event listeners
    socket.on("pod-members-update", handleMembersUpdate);
    socket.on("member-joined", handleMemberJoined);
    socket.on("member-left", handleMemberLeft);
    socket.on("tentacle-updated", handleTentacleUpdate);
    socket.on("animate-tentacle", handleTentacleAnimation);
    socket.on("new-activity", handleNewActivity);
    console.log("ONLINE MEMEBERS", onlineMembers);

    // Cleanup
    return () => {
      socket.off("pod-members-update", handleMembersUpdate);
      socket.off("member-joined", handleMemberJoined);
      socket.off("member-left", handleMemberLeft);
      socket.off("tentacle-updated", handleTentacleUpdate);
      socket.off("animate-tentacle", handleTentacleAnimation);
      socket.off("new-activity", handleNewActivity);
      leavePod(podId);
    };
  }, [socket, isConnected, podId, joinPod, leavePod]);

  return {
    onlineMembers,
    recentUpdates,
    activityFeed,
    tentacleAnimations,
    isConnected,
  };
}
