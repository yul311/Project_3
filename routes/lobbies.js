const express = require("express");
const crypto = require("crypto");

const router = express.Router();

let lobbies = {}; // First username in the lobby is the leader/creator of the room

// Handle player joining a lobby
router.post("/joinLobby", (req, res) => {
  console.log(req.body);

  const { username, lobby } = req.body;

  if (!lobbies[lobby]) {
    return res.status(400).send({ message: "Lobby doesn't exist" });
  }

  lobbies[lobby].push(username);
  io.to(lobby).emit("joinLobby", username, lobby);
  res.status(200).send({ message: `${username} joined the lobby` });
});

// Handle player creating a new lobby
router.post("/createLobby", (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).send({ message: "Username is required" });
    }

    const lobbyId = `room-${crypto.randomUUID()}`;
    lobbies[lobbyId] = [username];

    console.log(`Lobby created: ${lobbyId} by ${username}`);

    // Emit to notify all users
    // io.emit("newLobbyCreated", `New lobby created: ${lobbyId}`);

    res.status(200).send({ lobbyId });
  } catch (error) {
    console.error("Error creating lobby:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
