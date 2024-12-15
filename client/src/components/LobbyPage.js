import React, { useState } from "react";
import { useParams } from "react-router-dom";

const LobbyPage = ({ username, players, onStartGame }) => {
  const [drawTime, setDrawTime] = useState(60); // Default draw time in seconds
  const [rounds, setRounds] = useState(3); // Default number of rounds
  const [prompts, setPrompts] = useState([]); // Storage for prompts
  const { lobby } = useParams(); // Get lobby from url

  const handleAddPrompt = () => {
    const prompt = window.prompt("Enter a drawing prompt:");
    if (prompt) {
      setPrompts([...prompts, prompt]);
    }
  };
  console.log(username);
  console.log(lobby);
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
          <li key={index}>{player}</li>
        ))}
      </ul>

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
