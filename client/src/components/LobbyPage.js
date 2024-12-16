import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../services/socket";

const LobbyPage = ({ username, onStartGame }) => {
  const [players, setPlayers] = useState([]);
  const [drawTime, setDrawTime] = useState(60); // Default draw time in seconds
  const [rounds, setRounds] = useState(3); // Default number of rounds
  const [prompts, setPrompts] = useState([]); // Storage for prompts
  const { lobby } = useParams(); // Get lobby from url
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http:localhost:4000";
  const navigate = useNavigate(); // Use React Router's navigate hook

  useEffect(() => {
    socket.on("playerJoined", (newPlayer) => {
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    });

    socket.on("playerLeft", (playerName) => {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player !== playerName)
      );
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
    };
  }, [lobby, username]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/lobbies/get-lobby`,
          {
            params: { lobby },
          }
        );
        setPlayers(response.data.players);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, [lobby]);

  const handleRefreshPlayers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lobbies/get-lobby`, {
        params: { lobby },
      });
      if (response.status === 200) {
        console.log();
        setPlayers(response.data.players);
        console.log(response.data.players);
      } else {
        console.error("Failed to fetch players");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleNavigateRoom = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/games/get-game-rooms`,
        {
          params: { lobby },
        }
      );
      if (response.status === 200) {
        console.log("Reponse", response.data);
        const { gameRooms } = response.data;
        findAndNavigateGameRoom(gameRooms);
      } else {
        console.error("Failed to fetch game rooms");
      }
    } catch (error) {
      console.error("Error fetching game rooms:", error);
    }
  };

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
      navigate(`/gameRoom/${userGameRoom.gameRoomId}`); // Navigate to the game room page
    } else {
      console.error("No game room found for the player");
    }
  };

  const handleAddPrompt = () => {
    const prompt = window.prompt("Enter a drawing prompt:");
    if (prompt) {
      setPrompts((prevPrompts) => [...prevPrompts, prompt]);
    }
  };

  if (!username || !lobby) {
    return <p>Please return to the Welcome Page and join a lobby.</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Lobby</h2>
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>Room:</strong> {lobby}
      </p>
      {/* Player List */}
      <h3>Players</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.username} {/* Render only the username */}
          </li>
        ))}
      </ul>
      {/* Refresh Players Button */}
      <button
        onClick={handleRefreshPlayers}
        style={{
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Refresh Player List
      </button>

      {/* Check Game Rooms Button */}
      <button
        onClick={handleNavigateRoom}
        style={{
          padding: "5px 10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        Check Game Rooms
      </button>
      {/* Room Settings */}
      <h3>Settings</h3>
      <div>
        <label>
          Draw Time (seconds):{" "}
          <input
            type="number"
            value={drawTime}
            onChange={(e) => setDrawTime(Number(e.target.value))}
            min={10}
            max={300}
            style={{ width: "80px", margin: "5px" }}
          />
        </label>
      </div>
      <div>
        <label>
          Rounds:{" "}
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            min={1}
            max={10}
            style={{ width: "80px", margin: "5px" }}
          />
        </label>
      </div>
      {/* Prompts */}
      <h3>Prompts</h3>
      <button onClick={handleAddPrompt} style={{ padding: "5px 10px" }}>
        Add Prompt
      </button>
      <ul>
        {prompts.map((prompt, index) => (
          <li key={index}>{prompt}</li>
        ))}
      </ul>
      {/* Start Game Button */}
      <button
        onClick={() => onStartGame(drawTime, rounds, prompts)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Start Game
      </button>
    </div>
  );
};

export default LobbyPage;
