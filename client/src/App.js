import React, { useState } from "react";
import WelcomePage from "./components/WelcomePage";

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const setUsernameAndRoom = (user, roomName) => {
    setUsername(user);
    setRoom(roomName);
  };

  const createRoom = (user, roomId) => {
    setUsername(user);
    setRoom(roomId);
    console.log("Created and joined room:", roomId, "as", user);
  };

  return (
    <div>
      <WelcomePage
        setUsernameAndRoom={setUsernameAndRoom} // Pass the join room function
        createRoom={createRoom} // Pass the create room function
      />
      {username && room && (
        <p>
          {username} joined room {room}.
        </p>
      )}
    </div>
  );
};

export default App;
