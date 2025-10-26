import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// Store online users
const userSocketMap = {}; // { userId: socketId }
app.set('io', io);

// Helper function to get a user's socket
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Apply auth middleware
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // Notify all clients about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinShow", (showId) => {
    socket.join(`show-${showId}`);
    console.log(`🎬 User ${socket.user.fullName} joined show-${showId}`);
  });

  socket.emit("show", "hello");

  // ✅ Handle leaving a show room
  socket.on("leaveShow", (showId) => {
    socket.leave(`show-${showId}`);
    console.log(`👋 User ${socket.user.fullName} left show-${showId}`);
  });

  // ✅ Example: handle seat selection (for real-time testing)
  socket.on("selectSeat", ({ showId, seatId, status }) => {
    console.log(`Seat ${seatId} changed to ${status} in show ${showId}`);

  });

  // Example test event for numbers
  socket.on("selectNumber", ({ number }) => {
    io.emit("numbersUpdate", number);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
