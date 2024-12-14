import React, { useState } from "react";
import io from "socket.io-client";

const WelcomePage = ({ setUsernameAndRoom, createRoom }) => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      setUsernameAndRoom(username, room);
    } else {
      alert("Please enter both username and room.");
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const newRoom = `room-${Math.floor(Math.random() * 10000)}`; // Generate a random room ID
      createRoom(username, newRoom);
    } else {
      alert("Please enter a username to create a room.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Welcome to Collaborative Drawing!</h2>
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
          value={room}
          onChange={(e) => setRoom(e.target.value)}
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
