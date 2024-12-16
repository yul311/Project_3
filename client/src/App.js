import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import socket, { connectSocket, disconnectSocket } from "./services/socket";
import axios from "axios";

import WelcomePage from "./components/WelcomePage";
import LobbyPage from "./components/LobbyPage";
import GameRoom from "./components/GameRoom";

const App = () => {
  const [username, setUsername] = useState("");
  const [lobby, setLobby] = useState("");
  const [score, setScore] = useState();
  const [gameState, setGameState] = useState("lobby");
  const [gameRoomId, setGameRoomId] = useState(""); // Store game room ID
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http:localhost:4000";
  const navigate = useNavigate(); // Use React Router's navigate hook

  const findAndNavigateGameRoom = (gameRooms) => {
    if (!Array.isArray(gameRooms)) {
      console.error("Invalid gameRooms data:", gameRooms);
      return;
    }

    const userGameRoom = gameRooms.find((room) => {
      if (!room.players || !Array.isArray(room.players)) {
        console.error("Invalid players array in game room:", room);
        return false;
      }
      return room.players.some((player) => player.username === username); // Match based on username
    });

    console.log("User's game room:", userGameRoom);

    if (userGameRoom) {
      console.log("User game room ID:", userGameRoom.gameRoomId);
      setGameRoomId(userGameRoom.gameRoomId); // Save the game room ID
      navigate(`/gameRoom/${userGameRoom.gameRoomId}`); // Navigate to the game room page
    } else {
      console.error("No game room found for the player");
    }
  };

  useEffect(() => {
    connectSocket();

    // // Listen for real-time updates from the server
    // socket.on("gameStarted", async () => {
    //   console.log("Received game started request");
    //   try {
    //     const response = await axios.get(
    //       `${backendUrl}/api/games/get-game-rooms`,
    //       {
    //         params: { lobby },
    //       }
    //     );
    //     if (response.status === 200) {
    //       const { gameRooms } = response.data;
    //       findAndNavigateGameRoom(gameRooms);
    //       setGameState("drawing");
    //     } else {
    //       console.error("Failed to fetch game rooms");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching game rooms:", error);
    //   }
    // });

    socket.on("gameEnd", () => {
      setGameState("lobby");
      setGameRoomId(""); // Reset game room when game ends
    });

    return () => {
      disconnectSocket(); // Clean up when the component unmounts
    };
  }, [backendUrl, username]);

  const joinLobby = (name, lobby) => {
    setUsername(name);
    setLobby(lobby);
  };

  const startGame = async (drawTime, rounds, prompts) => {
    try {
      // Prepare the data to send in the request
      const gameSettings = {
        drawTime: drawTime,
        rounds: rounds,
        prompts: prompts,
      };

      // Send POST request to backend to start the game
      const response = await axios.post(`${backendUrl}/api/games/start-game`, {
        socketId: socket.id,
        lobby,
        gameSettings,
      });

      if (response.status === 200) {
        const { gameRooms } = response.data;
        socket.emit("gameStarted", { lobby });
        findAndNavigateGameRoom(gameRooms);
      } else {
        console.error("Failed to start game", response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <Routes>
      <Route path="/" element={<WelcomePage joinLobby={joinLobby} />} />
      <Route
        path="/lobbypage/:lobby"
        element={<LobbyPage username={username} onStartGame={startGame} />}
      />
      <Route
        path="/gameRoom/:gameRoom"
        element={<GameRoom gameRoomId={gameRoomId} lobby={lobby} />}
      />
    </Routes>
  );
};

export default App;
