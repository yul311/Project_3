import { io } from "socket.io-client";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
const socket = io(backendUrl, { autoConnect: false }); // Do not auto connect by default

socket.on("connect", () => {
  console.log("Socket service connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export const connectSocket = () => socket.connect();
export const disconnectSocket = () => socket.disconnect();
export default socket;
