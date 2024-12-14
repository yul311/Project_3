import React, { useRef, useState, useEffect } from "react";

const DrawingCanvas = ({
  onDraw,
  side,
  clearCanvasRef,
  brushColor,
  brushSize,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [drawingData, setDrawingData] = useState([]); // Store drawing persistently

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawingData.forEach(({ x, y, lastX, lastY, brushColor, brushSize }) => {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    });

    ctx.beginPath();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    redrawCanvas();
  }, [drawingData]);

  useEffect(() => {
    if (clearCanvasRef) {
      clearCanvasRef.current = () => {
        setDrawingData([]); // Clear the persistent drawing data
        redrawCanvas(); // Clear the canvas
      };
    }
  }, [clearCanvasRef]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    // Restrict drawing to one side based on the "side" prop
    if (
      (side === "left" && offsetX > canvasRef.current.width / 2) ||
      (side === "right" && offsetX <= canvasRef.current.width / 2)
    ) {
      return; // Ignore the event if out of bounds
    }

    setIsDrawing(true);
    setLastX(offsetX);
    setLastY(offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;

    // Restrict drawing to one side based on the "side" prop
    if (
      (side === "left" && offsetX > canvasRef.current.width / 2) ||
      (side === "right" && offsetX <= canvasRef.current.width / 2)
    ) {
      return; // Ignore the event if out of bounds
    }

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = brushColor; // Use current brush color
    ctx.lineWidth = brushSize; // Use current brush size
    ctx.stroke();

    // Append new stroke to the drawing data
    setDrawingData((prevData) => [
      ...prevData,
      { x: offsetX, y: offsetY, lastX, lastY, brushColor, brushSize },
    ]);

    setLastX(offsetX);
    setLastY(offsetY);

    onDraw({ x: offsetX, y: offsetY, lastX, lastY });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="800"
        height="500"
        style={{ border: "1px solid #000" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

export default DrawingCanvas;
