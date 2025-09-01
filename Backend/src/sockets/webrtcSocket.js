const roomUsersMap = {}; // { roomKey: [ { socketId, user } ] }


export const setupWebRTC = (io, socket, user) => {
  socket.on("join-room", ({ roomId }) => {
    const roomKey = `webrtc-${roomId}`;
    socket.join(roomKey);

    if (!roomUsersMap[roomKey]) {
      roomUsersMap[roomKey] = [];
    }

    roomUsersMap[roomKey].push({
      socketId: socket.id,
      user,
    });

    const otherUsers = roomUsersMap[roomKey]
      .filter((entry) => entry.socketId !== socket.id)
      .map((entry) => ({
        socketId: entry.socketId,
        user: entry.user,
      }));

    // Joining peer gets list of existing peers
    socket.emit("all-users", otherUsers);

    // Inform existing peers about the new user (no callUser!)
    socket.to(roomKey).emit("user-joined", {
      socketId: socket.id,
      user,
    });

    socket.on("disconnect", () => {
      const roomKey = [...socket.rooms].find((r) => r.startsWith("webrtc-"));
        
      if (roomKey && roomUsersMap[roomKey]) {
        roomUsersMap[roomKey] = roomUsersMap[roomKey].filter(
          (entry) => entry.socketId !== socket.id
        );
    
        socket.to(roomKey).emit("user-left", {
          socketId: socket.id,
          user,
        });
    
        if (roomUsersMap[roomKey].length === 0) {
          delete roomUsersMap[roomKey];
        }
      }
    });
    
  });

  socket.on("offer", ({ target, offer, user, isScreen=false }) => {
    io.to(target).emit("offer", {
      from: socket.id,
      user,
      offer,
      isScreen, 
    });
  });


  socket.on("answer", ({ target, answer, isScreen = false }) => {
  io.to(target).emit("answer", {
    from: socket.id,
    user,
    answer,
    isScreen, 
  });
});


  socket.on("ice-candidate", ({ target, candidate }) => {
    io.to(target).emit("ice-candidate", {
      from: socket.id,
      user,
      candidate,
    });
  });

  socket.on("leave-room", ({ roomId }) => {
    const roomKey = `webrtc-${roomId}`;
    socket.leave(roomKey);
    roomUsersMap[roomKey] = (roomUsersMap[roomKey] || []).filter(
      (entry) => entry.socketId !== socket.id
    );

    socket.to(roomKey).emit("user-left", {
      socketId: socket.id,
      user,
    });

    if (roomUsersMap[roomKey].length === 0) {
      delete roomUsersMap[roomKey];
    }
  });

  // Toggles to schare screen / video / audio 
  socket.on("update-media-state", ({ roomId,videoEnabled, audioEnabled, screenSharing }) => {
    if (!roomId) return;

    socket.to(`webrtc-${roomId}`).emit("remote-media-updated", {
      socketId: socket.id,
      videoEnabled,
      audioEnabled,
      screenSharing: !!screenSharing,
    });
  });

  socket.on("meeting-message", ({ roomId, message }) => {
    socket.to(`webrtc-${roomId}`).emit("meeting-message", message);
  });

  socket.on("update-host-controls", async ({ roomId, controls }) => {
    try {
      const user = socket.user; // assuming you attach user info to socket on connection

      // ✅ Only host can update
      // if (!user.isHost) {
      //   console.log("Unauthorized control update attempt");
      //   return;
      // }

      socket.to(`webrtc-${roomId}`).emit("host-controls-updated", controls);
    } catch (err) {
      console.error("Error updating host controls:", err);
    }
  });

  // when host clicks "mute" on someone
  socket.on("mute-user", ({ userId }) => {
    io.to(userId).emit("force-mute"); 
  });

  socket.on("turn-user-video-off", ({ userId }) => {
    io.to(userId).emit("force-video-off");
  });


  socket.on("kick-user", ({ roomId, userId }) => {
    const roomKey = `webrtc-${roomId}`;
    
    io.sockets.sockets.get(userId)?.leave(roomKey);

    roomUsersMap[roomKey] = (roomUsersMap[roomKey] || []).filter(
      (entry) => entry.socketId !== userId
    );

    io.to(userId).emit("kicked-out");
  });


};
