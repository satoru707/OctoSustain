"use client";

import { useEffect, useState, useCallback } from "react";
import { socketManager } from "@/lib/socket-client";
import type { Socket } from "socket.io-client";

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
}

export function useSocket(token?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const authToken =
      token ||
      (typeof window !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth-token="))
            ?.split("=")[1]
        : null);

    if (!authToken) return;

    try {
      const socketInstance = socketManager.connect(authToken);
      setSocket(socketInstance);

      const handleConnect = () => {
        setIsConnected(true);
        setConnectionError(null);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setOnlineUsers([]);
        setOnlineCount(0);
      };

      const handleConnectError = (error: Error) => {
        setConnectionError(error.message);
        setIsConnected(false);
      };

      const handleOnlineUsers = (users: OnlineUser[]) => {
        setOnlineUsers(users);
        setOnlineCount(users.length);
      };

      const handleUserJoined = (user: OnlineUser) => {
        setOnlineUsers((prev) => {
          if (prev.find((u) => u.id === user.id)) return prev;
          return [...prev, user];
        });
        setOnlineCount((prev) => prev + 1);
      };

      const handleUserLeft = (userId: string) => {
        setOnlineUsers((prev) => prev.filter((u) => u.id !== userId));
        setOnlineCount((prev) => Math.max(0, prev - 1));
      };

      const handleOnlineCount = (count: number) => {
        setOnlineCount(count);
      };

      socketInstance.on("connect", handleConnect);
      socketInstance.on("disconnect", handleDisconnect);
      socketInstance.on("connect_error", handleConnectError);
      socketInstance.on("online-users", handleOnlineUsers);
      socketInstance.on("user-joined", handleUserJoined);
      socketInstance.on("user-left", handleUserLeft);
      socketInstance.on("online-count", handleOnlineCount);

      return () => {
        socketInstance.off("connect", handleConnect);
        socketInstance.off("disconnect", handleDisconnect);
        socketInstance.off("connect_error", handleConnectError);
        socketInstance.off("online-users", handleOnlineUsers);
        socketInstance.off("user-joined", handleUserJoined);
        socketInstance.off("user-left", handleUserLeft);
        socketInstance.off("online-count", handleOnlineCount);
      };
    } catch (error) {
      setConnectionError("Failed to initialize socket connection");
    }
  }, [token]);

  const joinPod = useCallback((podId: string) => {
    socketManager.joinPod(podId);
  }, []);

  const leavePod = useCallback((podId: string) => {
    socketManager.leavePod(podId);
  }, []);

  const updateTentacle = useCallback((data: any) => {
    socketManager.updateTentacle(data);
  }, []);

  const updateChallengeProgress = useCallback((data: any) => {
    socketManager.updateChallengeProgress(data);
  }, []);

  const sendActivity = useCallback((data: any) => {
    socketManager.sendActivity(data);
  }, []);

  return {
    socket,
    isConnected,
    connectionError,
    onlineUsers,
    onlineCount,
    joinPod,
    leavePod,
    updateTentacle,
    updateChallengeProgress,
    sendActivity,
    socketManager,
  };
}
