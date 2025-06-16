import { Message } from "../models/messages.model.js";
const onlineUsers = {}; // userId → socketId

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;
    onlineUsers[user._id] = socket.id;

    // Join general group rooms
    socket.join("school");
    socket.join(`class-${user.className}`);
    socket.join(`user-${user._id}`); // personal notification room

    socket.on("joinPrivateChat", ({ peerId }) => {
      const room = getPrivateRoomName(user._id, peerId);
      socket.join(room);
    });

    socket.on("sendMessage", async ({ room, message, receiverId }) => {
      // Save to DB
      await Message.create({
        room,
        sender: user._id,
        receiver: receiverId || null,
        message,
      });

      // Emit to room
      io.to(room).emit("receiveMessage", {
        room,
        message,
        sender: user._id,
      });

      // Also notify individual user if they are not in room
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notifyNewMessage", {
          from: user._id,
          room,
          preview: message,
        });
      }
    });

    socket.on("disconnect", () => {
      delete onlineUsers[user._id];
    });
  });
};

const getPrivateRoomName = (id1, id2) =>
  `private-${[id1, id2].sort().join("-")}`;
