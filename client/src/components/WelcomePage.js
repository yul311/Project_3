import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WelcomePage = ({ joinLobby }) => {
  const [username, setUsername] = useState("");
  const [lobby, setLobby] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http:localhost:4000";

  const handleJoin = async (e) => {
    e.preventDefault();

    if (username.trim() && lobby.trim()) {
      try {
        const response = await fetch(`${backendUrl}/api/lobbies/joinLobby`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, lobby }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message); // Backend's success message
          navigate(`/lobbypage/${lobby}`); // Redirect to the lobby page
        } else {
          console.error(data.message || "Failed to join the lobby");
          alert(data.message || "An error occurred while joining the lobby.");
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
        const response = await axios.post(
          `${backendUrl}/api/lobbies/createLobby`,
          {
            username: username,
          }
        );

        if (response.status == 200) {
          console.log(response.status); // The returned lobby ID from backend
          navigate(`/lobbypage/${response.data.lobbyId}`);
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
