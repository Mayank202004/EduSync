import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mediaConstraints } from "@/lib/webrtc/constraints";

export default function useWebRTC(socket, roomId, currentUser, shouldJoin, initialMic = true, initialCam = true) {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const localVideoRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [screen, setScreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  const localStream = useRef(null);
  const peerConnections = useRef({});
  const joinedRoom = useRef(false);

  useEffect(() => {
  console.log("🔄 Participants list updated:");
  participants.forEach((p) => {
    console.log(`- ${p.fullName || p._id} | mic: ${p.audioEnabled}, cam: ${p.videoEnabled}, screen: ${p.screenSharing}`);
  });
}, [participants]);


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
        toast.error("Failed to start media. Please rejoin.");
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
      console.log(`User ${currentUser.fullName} shared his state to ${user.fullName} with mic ${mic} and cam ${cam}`);
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

    return () => {
      leaveMeeting();
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("remote-media-updated");
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

    socket.emit("offer", { target: socketId, offer });
  };

  const createPeerConnection = (socketId, userInfo = {}) => {
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

    pc.ontrack = (event) => {
      setParticipants((prev) => {
        const exists = prev.find((p) => p._id === socketId);
        if (exists) return prev;

        const remoteVideoRef = { current: document.createElement("video") };
        remoteVideoRef.current.autoplay = true;
        remoteVideoRef.current.playsInline = true;

        return [
          ...prev,
          {
            _id: socketId,
            name: userInfo.fullName || `User ${socketId}`,
            videoEnabled: true,
            audioEnabled: true,
            videoRef: remoteVideoRef,
            stream: event.streams[0],
            isLocal: false,
            avatar: userInfo.avatar || null,
          },
        ];
      });
    };

    return pc;
  };

  const handleReceiveOffer = async ({ from, user: userInfo, offer }) => {
    let pc = peerConnections.current[from];

    if (!pc) {
      pc = createPeerConnection(from, userInfo);
      peerConnections.current[from] = pc;

      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { target: from, answer });
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
    const videoTrack = localStream.current?.getVideoTracks()?.[0];
    if (videoTrack) {
      const enabled = !videoTrack.enabled;
      videoTrack.enabled = enabled;
      setCam(enabled);
      
      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal ? { ...p, videoEnabled: enabled } : p
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

      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      setScreen(true);

      socket.emit("update-media-state", {
        roomId,
        videoEnabled: true,
        audioEnabled: mic,
        screenSharing: true,
      });

      screenTrack.onended = () => {
        setScreen(false);
        toggleCam(); 

        socket.emit("update-media-state", {
          videoEnabled: true,
          audioEnabled: mic,
          screenSharing: false,
        });
      };
    } catch (err) {
      toast.error("Failed to share screen.");
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
  };

  const handleRemoteMediaUpdated = ({ socketId, videoEnabled, audioEnabled, screenSharing }) => {
    console.log("Remote media updated:", socketId, videoEnabled, audioEnabled, screenSharing);
    setParticipants((prev) =>
      prev.map((p) =>
        p._id === socketId
          ? {
              ...p,
              videoEnabled: videoEnabled ?? p.videoEnabled,
              audioEnabled: audioEnabled ?? p.audioEnabled,
              screenSharing: screenSharing ?? p.screenSharing,
            }
          : p
      )
    );
  };
  

  return {
    localVideoRef,
    participants,
    mic,
    cam,
    screen,
    handRaised,
    toggleMic,
    toggleCam,
    toggleScreen,
    raiseHand,
    leaveMeeting,
  };
}
