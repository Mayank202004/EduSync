// /sockets/chatSocket.js
import { Message } from "../models/messages.model.js";
import { Chat } from "../models/chat.model.js";
import { encrypt } from "../utils/encryptionUtil.js";

const onlineUsers = {};  // userId → socketId

export const setupChatSocket = (io, socket, user) => {
  onlineUsers[user._id] = socket.id;

    socket.emit("currentOnlineUsers", Object.keys(onlineUsers));
    socket.broadcast.emit("userConnected", user._id); // Broadcast to others that this user just came online

    socket.join(`user-${user._id}`); // personal notification room To Do: remove this later if not needed

    socket.on("sendMessage", async ({ chatId, content, attachments = [], meetingId}) => {
      // Encrypt content
      const encryptedContent =
      typeof content === "string" && content.trim().length > 0
        ? encrypt(content)
        : "";
      // 1. Save message to DB
      await Message.create({
        chat: chatId,
        sender: user._id,
        content: encryptedContent,
        attachments,
        meetingId
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
              from: {_id:user._id, name:user.fullName, avatar:user.avatar, role:user.role},
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


    socket.on("joinChat", async ({ chatId }) => {
      socket.join(`chat-${chatId}`);
      const chat = await Chat.findById(chatId).select("-name -isGroupChat -createdAt -updatedAt -__v -unreadCounts -_id");
      
      const online = chat.participants.filter((id) =>
        onlineUsers[id.toString()]
      );

      // Send online users to just this socket
      io.to(socket.id).emit("initialOnlineUsers", {
        _id:chatId,
        onlineUserIds: online,
      });
    });

    socket.on("leaveChat", (chatId) => {
      socket.leave(`chat-${chatId}`);
      socket.to(`chat-${chatId}`).emit("userStoppedTyping", {
        chatId,
        userId: user._id,
      });
    });

    
    // When user opens chat, update unread count to 0
    socket.on("chatRead", async ({ chatId, userId }) => {
      await Chat.findByIdAndUpdate(chatId, {
        $set: { [`unreadCounts.${userId}`]: 0 }
      });
    });

    // Typing events
    socket.on("typing", ({ chatId, user }) => {
      socket.to(`chat-${chatId}`).emit("userTyping", { chatId, user });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      socket.to(`chat-${chatId}`).emit("userStoppedTyping", { chatId, userId });
    });

    socket.on("disconnect", () => {
      delete onlineUsers[user._id];
      socket.broadcast.emit("userDisconnected", user._id);
    });
};

const getOnlineCountForChat = (chat) => {
  return chat.participants.reduce((count, participant) => {
    return onlineUsers[participant._id.toString()] ? count + 1 : count;
  }, 0);
};

