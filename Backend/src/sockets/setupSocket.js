import { Message } from "../models/messages.model.js";
import { Chat } from "../models/chat.model.js";
const onlineUsers = {}; // userId → socketId

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;
    onlineUsers[user._id] = socket.id;

    socket.emit("currentOnlineUsers", Object.keys(onlineUsers));
    socket.broadcast.emit("userConnected", user._id); // Broadcast to others that this user just came online

    socket.join(`user-${user._id}`); // personal notification room To Do: remove this later if not needed

    socket.on("sendMessage", async ({ chatId, content, attachments = [] }) => {
      // 1. Save message to DB
      await Message.create({
        chat: chatId,
        sender: user._id,
        content,
        attachments,
      });
    
      // 2. Emit message to chat room
      io.to(`chat-${chatId}`).emit("receiveMessage", {
        chatId,
        content,
        attachments,
        sender: user,
        updatedAt: Date.now(),
      });
    
      // 3. Fetch chat participants
      const chat = await Chat.findById(chatId).populate("participants", "_id");
    
      if (chat && Array.isArray(chat.participants)) {
        const updates = {};
    
        for (const participant of chat.participants) {
          const id = participant._id.toString();
    
          if (id !== user._id.toString()) {
            // Increment unread count for each participant except sender
            updates[`unreadCounts.${id}`] = 1;
    
            // Notify each user
            io.to(`user-${id}`).emit("notifyNewMessage", {
              chatId,
              from: user._id,
              preview: content.slice(0, 100),
            });
          }
        }
    
        // 4. Perform atomic increment on unreadCounts object
        if (Object.keys(updates).length > 0) {
          await Chat.findByIdAndUpdate(chatId, {
            $inc: updates,
          });
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
    
    // When user opens chat, update unread count to 0
    socket.on("chatRead", async ({ chatId, userId }) => {
      await Chat.findByIdAndUpdate(chatId, {
        $set: { [`unreadCounts.${userId}`]: 0 }
      });
    });

    socket.on("disconnect", () => {
      delete onlineUsers[user._id];
      socket.broadcast.emit("userDisconnected", user._id);
    });
  });
};


const getOnlineCountForChat = (chat) => {
  return chat.participants.reduce((count, participant) => {
    return onlineUsers[participant._id.toString()] ? count + 1 : count;
  }, 0);
};

