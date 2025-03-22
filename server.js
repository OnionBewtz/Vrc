import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle user joining
  socket.on('join', (username) => {
    users[socket.id] = {
      id: socket.id,
      name: username,
      avatar: '/placeholder.svg?height=40&width=40',
      online: true
    };
    
    // Broadcast to all clients that a new user has joined
    io.emit('userJoined', users[socket.id]);
    
    // Send the current users list to the new user
    socket.emit('usersList', Object.values(users));
    
    // Send welcome message
    socket.emit('message', {
      id: Date.now().toString(),
      text: `Welcome to the chat, ${username}!`,
      sender: 'System',
      timestamp: new Date()
    });
  });
  
  // Handle chat messages
  socket.on('message', (message) => {
    // Broadcast the message to all clients
    io.emit('message', {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (users[socket.id]) {
      const username = users[socket.id].name;
      delete users[socket.id];
      
      // Notify all clients that a user has left
      io.emit('userLeft', socket.id);
      io.emit('message', {
        id: Date.now().toString(),
        text: `${username} has left the chat.`,
        sender: 'System',
        timestamp: new Date()
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
