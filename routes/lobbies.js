const express = require("express");
const crypto = require("crypto");

const lobbies = {};

const createLobbiesRouter = (io) => {
  const router = express.Router();

  const isPlayerInAnyLobby = (socketId) => {
    for (const lobby in lobbies) {
      if (
        lobbies[lobby].players.some((player) => player.socketId === socketId)
      ) {
        return true;
      }
    }
    return false;
  };

  const addPlayerToLobby = (lobby, username, socketId) => {
    if (!isPlayerInAnyLobby(socketId)) {
      lobbies[lobby].players.push({ username, socketId });
    }
  };

  router.post("/join-lobby", (req, res) => {
    const { username, socketId, lobby } = req.body;

    console.log("Join lobby request");

    if (!lobbies[lobby]) {
      return res.status(400).send({ message: "Lobby doesn't exist" });
    }

    addPlayerToLobby(lobby, username, socketId);
    io.to(lobby).emit("lobbyUpdated", lobbies[lobby]); // Notify all clients
    res.status(200).send({ message: `${username} joined the lobby` });
  });

  // Handle player creating a new lobby
  router.post("/create-lobby", (req, res) => {
    try {
      console.log("Create lobby request");
      const { username, socketId } = req.body;

      if (!username || !socketId) {
        return res
          .status(400)
          .send({ message: "Username and socket ID are required" });
      }

      const lobbyId = `room-${crypto.randomUUID()}`;
      lobbies[lobbyId] = {
        leader: { username, socketId }, // Assign creator as leader
        players: [{ username, socketId }], // Add the creator as the first player
        gameRooms: [],
        settings: { drawTime: 60, rounds: 3 }, // Default settings
      };

      console.log(`Lobby created: ${lobbyId} by ${username}`);
      res.status(200).send({ lobbyId });
    } catch (error) {
      console.error("Error creating lobby:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // Get the list of players in a lobby
  router.get("/get-lobby", (req, res) => {
    const { lobby } = req.query;

    if (!lobbies[lobby]) {
      return res.status(404).send({ message: "Lobby not found" });
    }

    res.status(200).send({
      players: lobbies[lobby].players,
      gameRooms: lobbies[lobby].gameRooms || [],
      settings: lobbies[lobby].settings,
    });
  });

  return router;
};

module.exports = { createLobbiesRouter, lobbies };
