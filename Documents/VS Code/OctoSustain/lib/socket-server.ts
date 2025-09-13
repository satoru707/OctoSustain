import type { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"
import jwt from "jsonwebtoken"

export type NextApiResponseServerIO = {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

interface AuthenticatedSocket {
  userId: string
  podId?: string
  username: string
}

export function initializeSocketServer(server: NetServer): ServerIO {
  const io = new ServerIO(server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1]

      if (!token) {
        return next(new Error("Authentication error: No token provided"))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      ;(socket as any).userId = decoded.userId
      ;(socket as any).username = decoded.username || `User ${decoded.userId}`

      next()
    } catch (error) {
      next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    const authenticatedSocket = socket as any as AuthenticatedSocket
    console.log(`User ${authenticatedSocket.userId} connected`)

    // Join user to their personal room
    socket.join(`user:${authenticatedSocket.userId}`)

    // Handle joining pod rooms
    socket.on("join-pod", (podId: string) => {
      socket.leave(authenticatedSocket.podId || "")
      socket.join(`pod:${podId}`)
      authenticatedSocket.podId = podId
      console.log(`User ${authenticatedSocket.userId} joined pod ${podId}`)

      // Notify other pod members
      socket.to(`pod:${podId}`).emit("member-joined", {
        userId: authenticatedSocket.userId,
        username: authenticatedSocket.username,
        timestamp: new Date(),
      })

      // Send current online members
      const podSockets = Array.from(io.sockets.adapter.rooms.get(`pod:${podId}`) || [])
      const onlineMembers = podSockets.map((socketId) => {
        const memberSocket = io.sockets.sockets.get(socketId) as any
        return {
          userId: memberSocket?.userId,
          username: memberSocket?.username,
          isOnline: true,
        }
      })

      socket.emit("pod-members-update", { onlineMembers, totalOnline: onlineMembers.length })
    })

    // Handle leaving pod rooms
    socket.on("leave-pod", (podId: string) => {
      socket.leave(`pod:${podId}`)
      socket.to(`pod:${podId}`).emit("member-left", {
        userId: authenticatedSocket.userId,
        username: authenticatedSocket.username,
        timestamp: new Date(),
      })
      console.log(`User ${authenticatedSocket.userId} left pod ${podId}`)
    })

    // Handle tentacle updates (real-time dashboard updates)
    socket.on("tentacle-update", (data: any) => {
      const { podId, category, value, co2Saved, points } = data

      // Broadcast to all pod members
      socket.to(`pod:${podId}`).emit("tentacle-updated", {
        userId: authenticatedSocket.userId,
        username: authenticatedSocket.username,
        category,
        value,
        co2Saved,
        points,
        timestamp: new Date(),
      })

      // Trigger tentacle animation for all pod members
      socket.to(`pod:${podId}`).emit("animate-tentacle", {
        category,
        progress: Math.min(100, (value / 100) * 100), // Mock progress calculation
      })

      console.log(`Tentacle update from ${authenticatedSocket.userId} in pod ${podId}:`, data)
    })

    // Handle challenge progress updates
    socket.on("challenge-progress", (data: any) => {
      const { challengeId, progress, podId } = data

      // Broadcast to pod members
      if (podId) {
        socket.to(`pod:${podId}`).emit("challenge-progress-update", {
          challengeId,
          userId: authenticatedSocket.userId,
          username: authenticatedSocket.username,
          progress,
          timestamp: new Date(),
        })
      }

      // Broadcast to all challenge participants
      socket.to(`challenge:${challengeId}`).emit("challenge-leaderboard-update", {
        challengeId,
        userId: authenticatedSocket.userId,
        progress,
      })

      console.log(`Challenge progress from ${authenticatedSocket.userId}:`, data)
    })

    // Handle joining challenge rooms
    socket.on("join-challenge", (challengeId: string) => {
      socket.join(`challenge:${challengeId}`)
      console.log(`User ${authenticatedSocket.userId} joined challenge ${challengeId}`)
    })

    // Handle live activity feed
    socket.on("activity-update", (data: any) => {
      const { podId, action, category, details } = data

      const activity = {
        id: `activity_${Date.now()}`,
        userId: authenticatedSocket.userId,
        username: authenticatedSocket.username,
        action,
        category,
        details,
        timestamp: new Date(),
      }

      // Broadcast to pod members
      socket.to(`pod:${podId}`).emit("new-activity", activity)

      console.log(`New activity from ${authenticatedSocket.userId}:`, activity)
    })

    // Handle typing indicators for collaborative features
    socket.on("typing-start", (data: any) => {
      const { podId, context } = data
      socket.to(`pod:${podId}`).emit("user-typing", {
        userId: authenticatedSocket.userId,
        username: authenticatedSocket.username,
        context,
      })
    })

    socket.on("typing-stop", (data: any) => {
      const { podId, context } = data
      socket.to(`pod:${podId}`).emit("user-stopped-typing", {
        userId: authenticatedSocket.userId,
        context,
      })
    })

    // Handle notifications
    socket.on("send-notification", (data: any) => {
      const { targetUserId, type, title, message, actionUrl } = data

      const notification = {
        id: `notif_${Date.now()}`,
        type,
        title,
        message,
        actionUrl,
        fromUserId: authenticatedSocket.userId,
        fromUsername: authenticatedSocket.username,
        timestamp: new Date(),
        read: false,
      }

      // Send to specific user
      socket.to(`user:${targetUserId}`).emit("new-notification", notification)

      console.log(`Notification sent from ${authenticatedSocket.userId} to ${targetUserId}`)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${authenticatedSocket.userId} disconnected`)

      // Notify pod members if user was in a pod
      if (authenticatedSocket.podId) {
        socket.to(`pod:${authenticatedSocket.podId}`).emit("member-disconnected", {
          userId: authenticatedSocket.userId,
          username: authenticatedSocket.username,
          timestamp: new Date(),
        })
      }
    })

    // Send initial connection confirmation
    socket.emit("connected", {
      userId: authenticatedSocket.userId,
      message: "Successfully connected to OctoSustain real-time updates",
    })
  })

  return io
}
