"use client"

import { io, type Socket } from "socket.io-client"

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io({
      path: "/api/socket",
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    })

    this.setupEventListeners()
    return this.socket
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on("connect", () => {
      console.log("Connected to OctoSustain real-time server")
      this.reconnectAttempts = 0
    })

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason)
    })

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message)
      this.reconnectAttempts++

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached")
        this.socket?.disconnect()
      }
    })

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`)
      this.reconnectAttempts = 0
    })
  }

  joinPod(podId: string) {
    this.socket?.emit("join-pod", podId)
  }

  leavePod(podId: string) {
    this.socket?.emit("leave-pod", podId)
  }

  updateTentacle(data: {
    podId: string
    category: string
    value: number
    co2Saved: number
    points: number
  }) {
    this.socket?.emit("tentacle-update", data)
  }

  updateChallengeProgress(data: { challengeId: string; progress: number; podId?: string }) {
    this.socket?.emit("challenge-progress", data)
  }

  joinChallenge(challengeId: string) {
    this.socket?.emit("join-challenge", challengeId)
  }

  sendActivity(data: { podId: string; action: string; category: string; details: any }) {
    this.socket?.emit("activity-update", data)
  }

  startTyping(podId: string, context: string) {
    this.socket?.emit("typing-start", { podId, context })
  }

  stopTyping(podId: string, context: string) {
    this.socket?.emit("typing-stop", { podId, context })
  }

  sendNotification(data: {
    targetUserId: string
    type: string
    title: string
    message: string
    actionUrl?: string
  }) {
    this.socket?.emit("send-notification", data)
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback)
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback)
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export const socketManager = new SocketManager()
