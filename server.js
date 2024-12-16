const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createLobbiesRouter, lobbies } = require("./routes/lobbies");
const createGamesRouter = require("./routes/games");

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
const lobbiesRouter = createLobbiesRouter(io);
const gamesRouter = createGamesRouter(io);
app.use("/api/lobbies", lobbiesRouter);
app.use("/api/games", gamesRouter);

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // socket.on("disconnect", () => {
  //   for (const lobby in lobbies) {
  //     lobbies[lobby].players = lobbies[lobby].players.filter(
  //       (player) => player.socketId !== socket.id
  //     );

  //     if (lobbies[lobby].players.length === 0) {
  //       delete lobbies[lobby];
  //       console.log(`Deleted empty lobby: ${lobby}`);
  //     } else {
  //       io.to(lobby).emit("lobbyUpdated", lobbies[lobby]);
  //     }
  //   }
  // });

  let drawingData = [];

  socket.on("joinLobby", ({ username, lobby, socketId }) => {
    // Check if the lobby exists
    if (!lobbies[lobby]) {
      lobbies[lobby] = {
        leader: { username, socketId },
        players: [{ username, socketId }],
      };
      console.log(`User ${username} created and joined lobby ${lobby}`);
      return; // Early exit if the lobby is created
    }

    // Check if the username already exists in the players list
    const existingPlayer = lobbies[lobby].players.find(
      (player) => player.username === username
    );

    if (existingPlayer) {
      const currentPlayers = lobbies[lobby].players;

      // Correctly iterate over the players array
      for (const player of currentPlayers) {
        console.log("Player:", player.username); // Access the player object
      }

      console.log(`User ${username} is already in the lobby ${lobby}`);
      return; // Stop further execution if the user is already in the lobby
    }

    // If the lobby exists and username is not taken, add the player to the lobby
    lobbies[lobby].players.push({ username, socketId });
    console.log(`User ${username} joined lobby ${lobby}`);

    socket.broadcast.to(lobby).emit("playerJoined", username);
  });

  socket.on("playerLeft", (username, lobby) => {
    if (!lobbies[lobby]) {
      return console.log(`Lobby ${lobby} does not exist`);
    }

    // Remove player from the lobby
    lobbies[lobby].players = lobbies[lobby].players.filter(
      (player) => player.username !== username
    );

    io.to(lobby).emit("lobbyUpdated", lobbies[lobby]); // Notify all clients in the lobby
    console.log(`${username} left lobby ${lobby}`);
  });

  socket.on("gameStarted", ({ lobby }) => {
    console.log("Game started received post request");
    io.to(lobby).emit("gameStarted");
  });

  socket.on("leaveRoom", ({ gameRoomId, socketId }) => {
    console.log(`${socketId} left room ${gameRoomId}`);
    socket.leave(gameRoomId);
  });

  // // Send initial drawing data to a new user
  // socket.on("requestInitialDrawing", ({ gameRoomId, lobby }) => {
  //   const gameRoom = lobbies[lobby]?.gameRooms?.[gameRoomId];
  //   if (gameRoom) {
  //     socket.broadcast.to(gameRoomId).emit("initialDrawing", {
  //       gameRoomId,
  //       lobby,
  //       data: lobbies[lobby].gameRooms[gameRoomId].drawingData,
  //     });
  //   }
  // });

  // // Listen for drawing events
  // socket.on("drawing", ({ gameRoomId, lobby, data }) => {
  //   if (lobbies[lobby]?.gameRooms[gameRoomId]) {
  //     lobbies[lobby]?.gameRooms[gameRoomId].drawingData.push(data); // Save data
  //     socket.broadcast
  //       .to(gameRoomId)
  //       .emit("updateDrawing", { gameRoomId, data });
  //   }
  // });

  // // Clear drawing data for a specific room
  // socket.on("clearDrawing", (gameRoomId, lobby) => {
  //   const gameRoom = lobbies[lobby]?.gameRooms?.[gameRoomId];
  //   if (gameRoom) {
  //     gameRoom.drawingData = []; // Clear the room's drawing data
  //     socket.broadcast.to(gameRoomId).emit("clearDrawing", { gameRoomId }); // Notify all users in the room
  //   }
  // });

  /// Send initial drawing data to a new user
  socket.on("requestInitialDrawing", () => {
    socket.emit("initialDrawing", { drawingData });
  });

  socket.on("updateDrawing", (data) => {
    console.log("Received update drawing");
    socket.emit("updateDrawing", { data });
  });

  // Listen for drawing events
  socket.on("drawing", ({ data }) => {
    drawingData.push(data);
    socket.emit("updateDrawing", data);
  });

  // Clear drawing data
  socket.on("clearDrawing", () => {
    drawingData = []; // Clear the global drawing data
    io.emit("clearDrawing");
  });

  // Handle chat messages for a specific room
  socket.on("chatMessage", (inputMessage) => {
    socket.broadcast.emit("chatMessage", inputMessage); // Broadcast the message to the room
    console.log(`Chat message:`, inputMessage);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
