import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import LobbyPage from "./components/LobbyPage";
import io from "socket.io-client";

const App = () => {
  const [username, setUsername] = useState("");
  const [lobby, setLobby] = useState("");
  const [players, setPlayers] = useState([]);

  const joinLobby = (name, lobby) => {
    setUsername(name);
    setLobby(lobby);
    setPlayers((prev) => [...prev, name]); // Add the user to the players list
  };

  const startGame = (drawTime, rounds, prompts) => {
    console.log("Game started with settings:");
    console.log("Draw Time:", drawTime);
    console.log("Rounds:", rounds);
    console.log("Prompts:", prompts);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage joinLobby={joinLobby} />} />
        <Route
          path="/lobbypage/:lobby"
          element={
            <LobbyPage
              username={username}
              players={players}
              onStartGame={startGame}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
