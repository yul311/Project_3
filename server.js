const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const gameRooms = {};

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });

  // Send initial drawing data to a new user
  socket.on("requestInitialDrawing", (room) => {
    if (gameRooms[room]) {
      socket.emit("initialDrawing", gameRooms[room].drawingData);
    }
  });

  // Listen for drawing events
  socket.on("drawing", (room, data) => {
    if (gameRooms[room]) gameRooms[room].drawingData.push(data); // Save data
    socket.to(room).emit("updateDrawing", data);
  });

  // Clear drawing data for a specific room
  socket.on("clearDrawing", (room) => {
    if (gameRooms[room]) {
      gameRooms[room].drawingData = []; // Clear the room's drawing data
      io.to(room).emit("clearDrawing"); // Notify all users in the room
    }
  });

  // Handle chat messages for a specific room
  socket.on("chatMessage", (room, inputMessage) => {
    io.to(room).emit("chatMessage", inputMessage); // Broadcast the message to the room
    console.log(`Chat message in room ${room}:`, inputMessage);
  });

  // Handle creating a new room
  socket.on("createRoom", (room, username) => {
    if (!gameRooms[room]) {
      gameRooms[room] = { users: [] };
    }
    gameRooms[room].users.push(username);
    socket.join(room);
    io.to(room).emit("roomUpdate", gameRooms[room].users);
    console.log(`User ${username} joined room: ${room}`);
  });

  // Handle user leaving a room
  socket.on("leaveRoom", (room, username) => {
    if (gameRooms[room]) {
      gameRooms[room].users = gameRooms[room].users.filter(
        (user) => user !== username
      );
      socket.leave(room); // Leave the room
      if (gameRooms[room].users.length === 0) delete gameRooms[room]; // Delete room if empty
      io.to(room).emit("roomUpdate", gameRooms[room]?.users || []); // Update room users
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
