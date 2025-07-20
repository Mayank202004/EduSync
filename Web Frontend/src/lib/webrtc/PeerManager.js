// /lib/webrtc/PeerManager.js
const peers = {};

export const createPeerConnection = (socket, socketId, localStream, onTrack) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("webrtc-ice-candidate", {
        to: socketId,
        candidate: e.candidate,
      });
    }
  };

  pc.ontrack = (e) => {
    onTrack(socketId, e.streams[0]);
  };

  return pc;
};

export const addPeer = (id, pc) => {
  peers[id] = pc;
};

export const getPeer = (id) => peers[id];
export const removePeer = (id) => delete peers[id];
export const getAllPeers = () => peers;
