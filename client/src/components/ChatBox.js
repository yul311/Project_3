import React, { useState, useEffect } from "react";

const ChatBox = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("chatMessage", (message) => {
        console.log("New message", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socket) socket.off("chatMessage");
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Send message to server
    if (socket) {
      socket.emit("chatMessage", inputMessage);
    }

    // Add message locally and clear input field
    setMessages((prevMessages) => [...prevMessages, `You: ${inputMessage}`]);
    setInputMessage("");
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        width: "300px",
        height: "400px",
        overflow: "auto",
      }}
    >
      <h3>Chat</h3>
      <div style={{ flexGrow: 1, overflowY: "scroll", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            {msg}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={{ width: "70%", padding: "5px" }}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          style={{ width: "25%", padding: "5px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
