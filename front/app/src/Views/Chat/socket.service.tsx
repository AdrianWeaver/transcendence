// socketService.js
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const socket = io(URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
});

const connect = () =>
{
  socket.connect();
};

const disconnect = () =>
{
  socket.disconnect();
};

export { socket, connect, disconnect };
