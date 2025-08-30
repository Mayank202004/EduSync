import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mediaConstraints } from "@/lib/webrtc/constraints";
import { useNavigate } from "react-router-dom";

export default function useWebRTC(socket, roomId, currentUser,isHost, shouldJoin, initialMic = true, initialCam = true) {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [screen, setScreen] = useState(false);
  const localVideoRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [handRaised, setHandRaised] = useState(false);
  const [messages, setMessages] = useState([]);
  const peerMetadata = useRef({});
  const navigate = useNavigate();

  const [hostControls, setHostControls] = useState({
    microphoneEnableAllowed: true,
    videoEnableAllowed: true,
    screenShareAllowed: true,
    chatAllowed: true,
    access:"open"
  });



  const localStream = useRef(null);
  const peerConnections = useRef({});
  const joinedRoom = useRef(false);

  // Start media pre-joining (camera/mic)
  useEffect(() => {
    const startMedia = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        setParticipants([
          {
            _id: socket?.id || "local",
            name: `${currentUser.fullName} (You)`,
            avatar: currentUser.avatar,
            videoEnabled: initialCam,
            audioEnabled: initialMic,
            videoRef: localVideoRef,
            stream: localStream.current,
            isLocal: true,
          },
        ]);
      } catch (err) {
        toast.error(`Media start failed: ${err.message}`);
      }
    };

    startMedia();
  }, []); // only run once
  

  // Join socket room and set up WebRTC only if shouldJoin === true
  useEffect(() => {
    if (!socket || !shouldJoin || joinedRoom.current) return;

    joinedRoom.current = true;

    socket.emit("join-room", { roomId });
    setTimeout(() => { 
      socket.emit("update-media-state", {
        roomId,
        videoEnabled: cam,
        audioEnabled: mic,
        screenSharing: false,
      });
    }, 1000);


    socket.on("all-users", (users) => {
      if (users.length === 0) return;
      setTimeout(() => {
        users.forEach(({ socketId, user }) => {
          if (!peerConnections.current[socketId]) {
            callUser(socketId, user);
          }
        });
      }, 500);
    });

    socket.on("user-joined", ({ socketId, user }) => {
      // console.log("respomdig to user-joined", { socketId, user });
      setTimeout(() => {
       socket.emit("update-media-state", {
        roomId,
        videoEnabled: cam,
        audioEnabled: mic,
        screenSharing: false,
      });
      }, 500);
    });

    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidateMsg);
    socket.on("user-left", handleUserLeft);
    socket.on("remote-media-updated", handleRemoteMediaUpdated);
    socket.on("host-controls-updated", (controls) => handleUpdateHostControls(controls));

    socket.on("meeting-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      leaveMeeting();
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("remote-media-updated");
      socket.off("host-controls-updated");
      socket.off("meeting-message");
    };
  }, [shouldJoin, socket]);

  const callUser = async (socketId, userInfo) => {
    const pc = createPeerConnection(socketId, userInfo);
    peerConnections.current[socketId] = pc;

    localStream.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.current);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("offer", { target: socketId, offer ,user:currentUser,isScreen: false });
  };

  const createPeerConnection = (socketId, userInfo = {}, isScreen = false) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          target: socketId,
          candidate: event.candidate,
        });
      }
    };

  // store metadata for this connection
  peerMetadata.current[socketId] = { user: userInfo, isScreen };

  pc.ontrack = (event) => {
    const stream = event.streams[0];
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    const isScreenTrack = peerMetadata.current[socketId]?.isScreen || false;
    

    const participantId = isScreenTrack ? `screen-${socketId}` : socketId;
    const userMeta = peerMetadata.current[socketId]?.user || {};
const participantName = isScreenTrack
  ? `${userMeta.fullName || `User ${socketId}`} (Screen)`
  : userMeta.fullName || `User ${socketId}`;


    const videoRef = { current: document.createElement("video") };
    videoRef.current.autoplay = true;
    videoRef.current.playsInline = true;
    videoRef.current.srcObject = stream;

    setParticipants((prev) => {
      const alreadyExists = prev.some((p) => p._id === participantId);
      if (alreadyExists) {
        //console.warn("⚠️ Participant already exists:", participantId);
        return prev;
      }

      return [
        {
          _id: participantId,
          name: participantName,
          avatar: userInfo.avatar || null,
          videoEnabled: isScreenTrack ? true : videoTrack?.enabled === true,
          audioEnabled: isScreenTrack ? true : audioTrack?.enabled === true,
          stream,
          videoRef,
          isLocal: false,
          isScreen: isScreenTrack,
        },
        ...prev,
      ];
    });
  };
  return pc;
};


  const handleReceiveOffer = async ({ from, user: userInfo, offer, isScreen = false }) => {
    let pc = peerConnections.current[from];

    if (!pc) {
      pc = createPeerConnection(from, userInfo, isScreen);
      peerConnections.current[from] = pc;

      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    peerMetadata.current[from] = {
      isScreen,
      user: userInfo,
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { target: from, answer, isScreen });
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };


  const handleReceiveAnswer = async ({ from, answer }) => {
    const pc = peerConnections.current[from];
    if (!pc) return;

    try {
      if (pc.signalingState !== "stable") {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (err) {
      console.error("Error setting remote description:", err);
    }
  };

  const handleNewICECandidateMsg = async ({ from, candidate }) => {
    const pc = peerConnections.current[from];
    if (pc && candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleUserLeft = ({ socketId }) => {
    if (peerConnections.current[socketId]) {
      peerConnections.current[socketId].close();
      delete peerConnections.current[socketId];
    }
    setParticipants((prev) => prev.filter((p) => p._id !== socketId));
  };

  const toggleMic = () => {
    if(hostControls.microphoneEnableAllowed === false){
      toast.error("Host has disabled microphone");
      return
    }
    const audioTrack = localStream.current?.getAudioTracks()?.[0];
    if (audioTrack) {
      const enabled = !audioTrack.enabled;
      audioTrack.enabled = enabled;
      setMic(enabled);

      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal ? { ...p, audioEnabled: enabled } : p
        )
      );

      socket.emit("update-media-state", {
        roomId,
        videoEnabled: cam, 
        audioEnabled: enabled,
      });
    }
  };

  
  const toggleCam = () => {
    if(hostControls.cameraEnableAllowed === false){
      toast.error("Host has disabled camera");
      return;
    }
    const videoTrack = localStream.current?.getVideoTracks()?.[0];
    if (videoTrack) {
      const enabled = !videoTrack.enabled;
      videoTrack.enabled = enabled;
      setCam(enabled);
      
      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal && !p.isScreen ? { ...p, videoEnabled: enabled } : p
        )
      );
      socket.emit("update-media-state", {
        roomId,
        videoEnabled: enabled,
        audioEnabled: mic,
      });
    }
  };



  const toggleScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      // Send screen track to peers
      Object.entries(peerConnections.current).forEach(async ([peerId, pc]) => {
        try {
          pc.addTrack(screenTrack, screenStream);
        
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
        
          socket.emit("offer", {
            target: peerId,
            offer,
            user: currentUser,
            isScreen: true, // pass metadata manually
          });

        } catch (err) {
          console.error(`Error renegotiating with ${peerId}:`, err);
        }
      });


      // Create a screen ref
      const screenVideoRef = { current: document.createElement("video") };
      screenVideoRef.current.autoplay = true;
      screenVideoRef.current.playsInline = true;
      screenVideoRef.current.muted = true;
      screenVideoRef.current.srcObject = screenStream;

      const screenParticipant = {
        _id: `screen-${socket.id}`,
        name: `${currentUser.fullName} (Screen)`,
        avatar: currentUser.avatar,
        videoEnabled: true,
        audioEnabled: false,
        stream: screenStream,
        isLocal: true,
        isScreen: true, // custom flag
      };

      setParticipants((prev) => [screenParticipant, ...prev]);

      setScreen(true);

      // Notify others
      socket.emit("update-media-state", {
        roomId,
        videoEnabled: cam,
        audioEnabled: mic,
        screenSharing: true,
      });

      // Remove on end
      screenTrack.onended = () => {
        setScreen(false);

        setParticipants((prev) =>
          prev.filter((p) => p._id !== `screen-${socket.id}`)
        );

        socket.emit("update-media-state", {
          roomId,
          videoEnabled: cam,
          audioEnabled: mic,
          screenSharing: false,
        });
      };
    } catch (err) {
      toast.error("Failed to share screen.");
      console.error("Error sharing screen:", err);
    }
  };


  const raiseHand = () => {
    setHandRaised((prev) => !prev);
    socket.emit("raise-hand", { handRaised: !handRaised });
  };

  const leaveMeeting = () => {
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};

    socket.emit("leave-room", { roomId });

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    setParticipants([]);
    navigate(`/meeting/end`);

  };

  const handleRemoteMediaUpdated = ({ socketId, videoEnabled, audioEnabled, screenSharing }) => {
    setParticipants((prev) =>
      prev
        .map((p) => {
          if (p._id === `screen-${socketId}` && screenSharing === false) { // Remove if screen shar eoff
            return null;
          }
          if (p._id === socketId) { // Cam or mic toggle 
            return {
              ...p,
              videoEnabled: videoEnabled ?? p.videoEnabled,
              audioEnabled: audioEnabled ?? p.audioEnabled,
              screenSharing: screenSharing ?? p.screenSharing,
            };
          }
          return p; // No change
        })
        .filter(Boolean) 
    );
  };

  const handleUpdateHostControls = (controls ) => {
    console.log("Controls updated:", controls);
    setHostControls(controls);

    // Apply restrictions immediately
    if (!controls.microphoneEnableAllowed) {
      forceDisableMic();
    }
    if (!controls.videoEnableAllowed) {
      forceDisableCam();
    }
    if (!controls.screenShareAllowed && screen) {
      leaveScreenShare();
    }
  };

  // Force disable mic (used when host blocks mic)
  const forceDisableMic = () => {
    const audioTrack = localStream.current?.getAudioTracks()?.[0];
    if (audioTrack) {
      audioTrack.enabled = false;
      setMic(false);

      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal ? { ...p, audioEnabled: false } : p
        )
      );

      socket.emit("update-media-state", {
        roomId,
        videoEnabled: cam,
        audioEnabled: false,
      });
    }
  };

  // Force disable camera (used when host blocks video)
  const forceDisableCam = () => {
    const videoTrack = localStream.current?.getVideoTracks()?.[0];
    if (videoTrack) {
      videoTrack.enabled = false;
      setCam(false);

      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal && !p.isScreen ? { ...p, videoEnabled: false } : p
        )
      );

      socket.emit("update-media-state", {
        roomId,
        videoEnabled: false,
        audioEnabled: mic,
      });
    }
  };

  // Leave screen share if host disallows
  const leaveScreenShare = () => {
    setScreen(false);
    setParticipants((prev) =>
      prev.filter((p) => p._id !== `screen-${socket.id}`)
    );

    socket.emit("update-media-state", {
      roomId,
      videoEnabled: cam,
      audioEnabled: mic,
      screenSharing: false,
    });
  };


  

  return {
    hostControls,
    localVideoRef,
    participants,
    mic,
    cam,
    handRaised,
    toggleMic,
    toggleCam,
    toggleScreen,
    raiseHand,
    leaveMeeting,
    messages,
    setMessages,
    screen,
    hostControls,
    setHostControls
  };
}
