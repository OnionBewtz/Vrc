"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Define message type
interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
}

// Define user type
interface User {
  id: string
  name: string
  avatar: string
  online: boolean
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [username, setUsername] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for users
  useEffect(() => {
    setUsers([
      { id: "1", name: "Alice", avatar: "/placeholder.svg?height=40&width=40", online: true },
      { id: "2", name: "Bob", avatar: "/placeholder.svg?height=40&width=40", online: true },
      { id: "3", name: "Charlie", avatar: "/placeholder.svg?height=40&width=40", online: false },
      { id: "4", name: "Diana", avatar: "/placeholder.svg?height=40&width=40", online: true },
    ])
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mock function to simulate receiving a message
  const simulateReceiveMessage = () => {
    const mockResponses = [
      "Hey there! How's it going?",
      "That's interesting!",
      "I'm working on a new project.",
      "Did you see the news today?",
      "What are your plans for the weekend?",
    ]

    const randomUser = users.filter((user) => user.online && user.name !== username)[
      Math.floor(Math.random() * (users.filter((user) => user.online).length - 1))
    ]

    if (randomUser) {
      setTimeout(
        () => {
          const newMessage: Message = {
            id: Date.now().toString(),
            text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
            sender: randomUser.name,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, newMessage])
        },
        2000 + Math.random() * 3000,
      )
    }
  }

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() === "") return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: username,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageInput("")

    // Simulate receiving a response
    simulateReceiveMessage()
  }

  // Handle joining the chat
  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() === "") return

    setIsJoined(true)

    // Add user to the list
    const newUser: User = {
      id: Date.now().toString(),
      name: username,
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    }

    setUsers((prev) => [...prev, newUser])

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Welcome to the chat, ${username}!`,
      sender: "System",
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])

    // Simulate receiving a message after joining
    simulateReceiveMessage()
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {!isJoined ? (
        <div className="flex items-center justify-center h-full">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-center">Join Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinChat} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Join
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex h-full p-4 gap-4">
          {/* Users sidebar */}
          <div className="hidden md:block w-64">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <Badge variant={user.online ? "default" : "outline"} className="text-xs">
                            {user.online ? "Online" : "Offline"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat area */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Chat Room</CardTitle>
                  <Badge variant="outline">{users.filter((u) => u.online).length} online</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-[calc(100vh-240px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === username ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "System"
                              ? "bg-gray-200 dark:bg-gray-700 text-center w-full"
                              : message.sender === username
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                          }`}
                        >
                          {message.sender !== username && message.sender !== "System" && (
                            <div className="font-semibold text-xs mb-1">{message.sender}</div>
                          )}
                          <div>{message.text}</div>
                          <div className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

