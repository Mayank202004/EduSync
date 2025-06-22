import { Message } from "../models/messages.model.js";
import { Chat } from "../models/chat.model.js";
const onlineUsers = {}; // userId → socketId

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;
    onlineUsers[user._id] = socket.id;

    socket.join(`user-${user._id}`); // personal notification room

    socket.on("sendMessage", async ({ chatId, content, attachments=[] }) => {
      // Save to DB
      await Message.create({
        chat:chatId,
        sender: user._id,
        content,
        attachments
      });

    // Emit to chat room
    io.to(`chat-${chatId}`).emit("receiveMessage", {
      chatId,
      content,
      attachments,
      sender: user._id,
    });
    
    // Notify all participants in chat (not just receiver)
    const chat = await Chat.findById(chatId).populate("participants", "_id");
    
    if (chat && Array.isArray(chat.participants)) {
      for (const participant of chat.participants) {
        const id = participant._id.toString();
        if (id !== user._id.toString()) {
          io.to(`user-${id}`).emit("notifyNewMessage", {
            chatId,
            from: user._id,
            preview: content.slice(0, 100),
          });
        }
      }
    }
    });

    socket.on("joinChat", (chatId) => {
      socket.join(`chat-${chatId}`);
      //console.log("Socket joined chat room:", `chat-${chatId}`);
    });

    socket.on("leaveChat", (chatId) => {
      socket.leave(`chat-${chatId}`);
      //console.log("Left chatroom", `chat-${chatId}`);
    });



    socket.on("disconnect", () => {
      delete onlineUsers[user._id];
    });
  });
};

const getPrivateRoomName = (id1, id2) =>
  `private-${[id1, id2].sort().join("-")}`;
