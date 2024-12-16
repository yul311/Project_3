import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../services/socket";

const WelcomePage = ({ joinLobby }) => {
  const [username, setUsername] = useState("");
  const [lobby, setLobby] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http:localhost:4000";

  const handleJoin = async (e) => {
    e.preventDefault();

    if (username.trim() && lobby.trim()) {
      try {
        if (!socket.id) {
          console.error("Socket not connected yet");
          return;
        }
        console.log("Username", username);
        console.log("Socket Id", socket.id);
        console.log("Lobby", lobby);
        const response = await axios.post(
          `${backendUrl}/api/lobbies/join-lobby`,
          { username: username, socketId: socket.id, lobby: lobby }
        );

        if (response.status === 200) {
          console.log(response.data); // Backend's success message
          navigate(`/lobbypage/${lobby}`); // Redirect to the lobby page
          joinLobby(username, lobby);
        } else if (response.status === 400) {
          console.error(response.data.message);
          alert(response.data.message);
        } else {
          console.error("Failed to join the lobby");
          alert("An error occurred while joining the lobby.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Unable to reach the server. Please try again later.");
      }
    } else {
      alert("Please enter both a username and a lobby name.");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        if (!socket.id) {
          console.error("Socket not connected yet");
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/lobbies/create-lobby`,
          {
            username: username,
            socketId: socket.id,
          }
        );

        if (response.status === 200) {
          joinLobby(username, response.data.lobbyId);
          navigate(`/lobbypage/${response.data.lobbyId}`);
        } else if (response.status === 400) {
          console.error(response.data.message);
          alert(response.data.message);
        } else {
          console.error("Failed to create lobby");
          alert("An error occurred while creating the lobby.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Unable to reach the server. Please try again later.");
      }
    } else {
      alert("Please enter a username.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Welcome to OneCanvas2Draw!</h2>
      <form>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px", width: "200px" }}
        />
        <input
          type="text"
          placeholder="Enter a room to join"
          value={lobby}
          onChange={(e) => setLobby(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px", width: "200px" }}
        />
        <div>
          <button
            onClick={handleJoin}
            style={{ padding: "10px 20px", marginRight: "10px" }}
          >
            Join Room
          </button>
          <button onClick={handleCreateRoom} style={{ padding: "10px 20px" }}>
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default WelcomePage;
