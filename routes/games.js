const express = require("express");
const crypto = require("crypto");
const { lobbies } = require("./lobbies");

const createGamesRouter = (io) => {
  const router = express.Router();

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const createGameRooms = (lobby) => {
    const players = shuffleArray(lobbies[lobby].players);
    const gameRooms = [];

    while (players.length > 1) {
      const player1 = players.pop();
      const player2 = players.pop();

      const gameRoomId = `game-${crypto.randomUUID()}`;
      gameRooms.push({ gameRoomId, players: [player1, player2] });

      // Notify the players in the game room
      [player1.socketId, player2.socketId].forEach((socketId) => {
        io.to(socketId).emit("gameRoomAssigned", {
          gameRoomId,
          players: [player1.username, player2.username], // Send usernames to clients
        });
      });
    }

    if (players.length === 1) {
      const waitingPlayer = players.pop(); // Extract the leftover player
      console.log(`${waitingPlayer.username} is waiting for the next round.`);
      io.to(waitingPlayer.socketId).emit("waitingForNextRound", {
        message: `${waitingPlayer.username}, you are waiting for the next round!`,
      });
    }

    lobbies[lobby].gameRooms = gameRooms;
  };

  // Handle starting the game
  router.post("/start-game", (req, res) => {
    const { socketId, lobby, gameSettings } = req.body;
    const players = lobbies[lobby]?.players;

    // if (socketId !== lobbies[lobby].leader.socketId) {
    //   return res.status(400).send({ message: "Only leaders can start game" });
    // }

    lobbies[lobby].settings = gameSettings;

    if (!players) {
      return res.status(404).send({ message: "Lobby not found" });
    }

    if (!players || players.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough players to start the game" });
    }

    if (!lobbies[lobby].gameRooms) {
      lobbies[lobby].gameRooms = [];
    }

    createGameRooms(lobby);

    res
      .status(200)
      .send({ gameState: "drawing", gameRooms: lobbies[lobby].gameRooms });
  });

  router.get("/get-game-rooms", (req, res) => {
    const { lobby } = req.query;

    if (!lobbies[lobby]) {
      return res.status(404).send({ message: "Lobby not found" });
    }

    res.status(200).send({
      gameRooms: lobbies[lobby]?.gameRooms,
    });
  });

  return router;
};

module.exports = createGamesRouter;
