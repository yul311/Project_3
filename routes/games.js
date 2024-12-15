const express = require("express");

const router = express.Router();

// Handle starting the game
router.post("/startGame", (req, res) => {
  const { lobby } = req.body;
  const players = lobbies[lobby];

  if (!players || players.length < 2) {
    return res
      .status(400)
      .send({ message: "Not enough players to start the game" });
  }

  //Split players into pairs (for simplicity, just pairs them sequentially), Change to something random later
  const gameRooms = [];
  while (players.length > 1) {
    const player1 = players.pop();
    const player2 = players.pop();

    const gameRoomId = `game-${Math.floor(Math.random() * 10000)}`;
    gameRooms.push({ gameRoomId, players: [player1, player2] });

    // Notify players and assign them to their game rooms
    io.to(lobby).emit("gameStarted", {
      gameRoomId,
      players: [player1, player2],
    });
  }

  // Clear lobby after the game starts
  delete lobbies[lobby];

  res.status(200).send({ message: "Game started", gameRooms });
});

module.exports = router;
