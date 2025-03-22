import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export const connectToSocket = (username: string) => {
  if (!socket) {
    // In production, replace with your deployed server URL
    socket = io("http://localhost:3001")

    socket.on("connect", () => {
      console.log("Connected to socket server")
      socket?.emit("join", username)
    })
  }

  return socket
}

export const sendMessage = (message: any) => {
  socket?.emit("message", message)
}

export const onMessageReceived = (callback: (message: any) => void) => {
  socket?.on("message", callback)
}

export const onUserJoined = (callback: (user: any) => void) => {
  socket?.on("userJoined", callback)
}

export const onUserLeft = (callback: (userId: string) => void) => {
  socket?.on("userLeft", callback)
}

export const onUsersList = (callback: (users: any[]) => void) => {
  socket?.on("usersList", callback)
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}



