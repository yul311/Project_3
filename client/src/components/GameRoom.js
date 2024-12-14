import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import DrawingCanvas from "./DrawingCanvas";
import ChatBox from "./ChatBox";

const GameRoom = ({ username, room }) => {
  const [drawingData, setDrawingData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [side, setSide] = useState("left"); // Default side set to 'left'

  const [brushColor, setBrushColor] = useState("#000000"); // Default black
  const [brushSize, setBrushSize] = useState(5); // Default size 5
  const clearCanvasRef = useRef(null);

  // Room settings: Players, Drawtime, Rounds, Storage for Prompts

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Replace with your server URL
    setSocket(newSocket);

    // Listen for initial drawing data
    newSocket.on("initialDrawing", (data) => {
      setDrawingData(data);
    });

    // Listen for updates from other users
    newSocket.on("updateDrawing", (data) => {
      setDrawingData((prevData) => [...prevData, data]);
    });

    // Listen for clear events from the server
    newSocket.on("clearDrawing", () => {
      handleClear(); // Clear local drawing data
    });

    // Cleanup on component unmount
    return () => newSocket.disconnect();
  }, []);

  const handleDraw = (newDrawingPoint) => {
    // Add locally and emit to server
    setDrawingData((prevData) => [...prevData, newDrawingPoint]);
    if (socket) {
      socket.emit("drawing", newDrawingPoint);
    }
  };

  const handleSideChange = (newSide) => {
    setSide(newSide); // Update the side dynamically
  };

  const handleColorChange = (color) => setBrushColor(color);
  const handleSizeChange = (size) => setBrushSize(size);

  const handleClear = () => {
    setDrawingData([]); // Clear drawing data
    if (clearCanvasRef.current) {
      clearCanvasRef.current(); // Trigger canvas clear in DrawingCanvas
    }
    if (socket) {
      socket.emit("clearDrawing"); // Notify other clients
    }
  };

  return (
    <div>
      <h2>Collaborative Drawing Game</h2>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => handleSideChange("left")}
          style={{
            backgroundColor: side === "left" ? "#4caf50" : "#f0f0f0",
            color: side === "left" ? "#fff" : "#000",
          }}
        >
          Left
        </button>
        <button
          onClick={() => handleSideChange("right")}
          style={{
            backgroundColor: side === "right" ? "#4caf50" : "#f0f0f0",
            color: side === "right" ? "#fff" : "#000",
          }}
        >
          Right
        </button>
        <button onClick={handleClear}>Clear Drawing</button>
        <button onClick={() => handleColorChange("#FF0000")}>Red</button>
        <button onClick={() => handleColorChange("#00FF00")}>Green</button>
        <button onClick={() => handleSizeChange(3)}>Small</button>
        <button onClick={() => handleSizeChange(10)}>Large</button>
      </div>
      {/* Flex container for canvas and chatbox */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div style={{ flex: 2 }}>
          <DrawingCanvas
            onDraw={handleDraw}
            side={side}
            drawingData={drawingData}
            clearCanvasRef={clearCanvasRef}
            brushColor={brushColor}
            brushSize={brushSize}
          />
        </div>
        <div style={{ flex: 1 }}>
          <ChatBox socket={socket} />
        </div>
      </div>
      {/* Debugging drawing data
      <div style={{ marginTop: "20px" }}>
        <h3>Drawing Data (Debug)</h3>
        <pre>{JSON.stringify(drawingData, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default GameRoom;
