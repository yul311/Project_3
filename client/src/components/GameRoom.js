import React, { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import DrawingCanvas from "./DrawingCanvas";
import ChatBox from "./ChatBox";

const GameRoom = ({ gameRoomId, lobbyId }) => {
  const [drawingData, setDrawingData] = useState([]);
  const [side, setSide] = useState("left"); // Default side set to 'left'
  const [brushColor, setBrushColor] = useState("#000000"); // Default black
  const [brushSize, setBrushSize] = useState(5); // Default size 5
  const clearCanvasRef = useRef(null);

  // Room settings: Players, Drawtime, Rounds, Storage for Prompts

  useEffect(() => {
    const handleInitialDrawing = (data) => {
      console.log("Received initial drawing data:", data);
      setDrawingData(data.drawingData || []);
    };

    const handleUpdateDrawing = (data) => {
      setDrawingData((prevData) => [...prevData, data]);
    };

    const handleClearDrawing = () => {
      console.log("Clearing drawing data");
      setDrawingData([]);
    };

    socket.on("initialDrawing", handleInitialDrawing);
    socket.on("updateDrawing", handleUpdateDrawing);
    socket.on("clearDrawing", handleClearDrawing);

    socket.emit("requestInitialDrawing");

    return () => {
      socket.off("initialDrawing");
      socket.off("updateDrawing");
      socket.off("clearDrawing");
    };
  }, []);

  const handleDraw = (newDrawingPoint) => {
    // Add locally and emit to server
    setDrawingData((prevData) => [...prevData, newDrawingPoint]);
    socket.emit("drawing", { data: newDrawingPoint });
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
      <h2>Drawing Canvas</h2>
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
      </div>
      <div>
        <h3>Colors</h3>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleColorChange("#FF0000")}
            style={{ backgroundColor: "#FF0000" }}
          >
            Red
          </button>
          <button
            onClick={() => handleColorChange("#00FF00")}
            style={{ backgroundColor: "#00FF00" }}
          >
            Green
          </button>
          <button
            onClick={() => handleColorChange("#0000FF")}
            style={{ backgroundColor: "#0000FF" }}
          >
            Blue
          </button>
          <button
            onClick={() => handleColorChange("#FFA500")}
            style={{ backgroundColor: "#FFA500" }}
          >
            Orange
          </button>
          <button
            onClick={() => handleColorChange("#FFFF00")}
            style={{ backgroundColor: "#FFFF00" }}
          >
            Yellow
          </button>
          <button
            onClick={() => handleColorChange("#800080")}
            style={{ backgroundColor: "#800080" }}
          >
            Purple
          </button>
          <button
            onClick={() => handleColorChange("#00FFFF")}
            style={{ backgroundColor: "#00FFFF" }}
          >
            Cyan
          </button>
          <button
            onClick={() => handleColorChange("#FFC0CB")}
            style={{ backgroundColor: "#FFC0CB" }}
          >
            Pink
          </button>
          <button
            onClick={() => handleColorChange("#808080")}
            style={{ backgroundColor: "#808080" }}
          >
            Gray
          </button>
          <button
            onClick={() => handleColorChange("#000000")}
            style={{ backgroundColor: "#000000", color: "#FFF" }}
          >
            Black
          </button>
          <button
            onClick={() => handleColorChange("#FFFFFF")}
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #000" }}
          >
            White
          </button>
        </div>
      </div>
      <div>
        <h3>Brush Sizes</h3>
        <button onClick={() => handleSizeChange(3)}>Small</button>
        <button onClick={() => handleSizeChange(5)}>Medium</button>
        <button onClick={() => handleSizeChange(10)}>Large</button>
      </div>
      <div>
        <h3>Prompt: {"Animal Farm"}</h3> {/* Display the prompt */}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          marginTop: "20px",
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
    </div>
  );
};

export default GameRoom;
