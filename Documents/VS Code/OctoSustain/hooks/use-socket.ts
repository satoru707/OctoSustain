"use client"

import { useEffect, useState, useCallback } from "react"
import { socketManager } from "@/lib/socket-client"
import type { Socket } from "socket.io-client"

export function useSocket(token?: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    try {
      const socketInstance = socketManager.connect(token)
      setSocket(socketInstance)

      const handleConnect = () => {
        setIsConnected(true)
        setConnectionError(null)
      }

      const handleDisconnect = () => {
        setIsConnected(false)
      }

      const handleConnectError = (error: Error) => {
        setConnectionError(error.message)
        setIsConnected(false)
      }

      socketInstance.on("connect", handleConnect)
      socketInstance.on("disconnect", handleDisconnect)
      socketInstance.on("connect_error", handleConnectError)

      return () => {
        socketInstance.off("connect", handleConnect)
        socketInstance.off("disconnect", handleDisconnect)
        socketInstance.off("connect_error", handleConnectError)
      }
    } catch (error) {
      setConnectionError("Failed to initialize socket connection")
    }
  }, [token])

  const joinPod = useCallback((podId: string) => {
    socketManager.joinPod(podId)
  }, [])

  const leavePod = useCallback((podId: string) => {
    socketManager.leavePod(podId)
  }, [])

  const updateTentacle = useCallback((data: any) => {
    socketManager.updateTentacle(data)
  }, [])

  const updateChallengeProgress = useCallback((data: any) => {
    socketManager.updateChallengeProgress(data)
  }, [])

  const sendActivity = useCallback((data: any) => {
    socketManager.sendActivity(data)
  }, [])

  return {
    socket,
    isConnected,
    connectionError,
    joinPod,
    leavePod,
    updateTentacle,
    updateChallengeProgress,
    sendActivity,
    socketManager,
  }
}
