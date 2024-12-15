const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const lobbiesRouter = require("./routes/lobbies");
const gamesRouter = require("./routes/games");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/lobbies", lobbiesRouter);

io.on("connection", (socket) => {
  console.log(`A player connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`A player disconnected: ${socket.id}`);
  });

  // Join a lobby room
  socket.on("joinLobby", (username, lobby) => {
    socket.join(lobby);
    io.to(lobby).emit(`${username} joined the lobby`);
  });

  // socket.on("createLobby", username);

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
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
