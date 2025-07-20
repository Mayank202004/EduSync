import { setupWebRTC } from "./webrtcSocket.js";
import { setupChatSocket } from "./chatSocket.js";

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;

    setupChatSocket(io, socket, user); // Setup chat socket
    setupWebRTC(io, socket, user); // Setup WebRTC socket
  });
};



