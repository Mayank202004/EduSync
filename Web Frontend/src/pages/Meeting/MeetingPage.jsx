import { useState } from "react";
import MeetingLayout from "@/components/Meeting/MeetingLayout";
import ControlsBar from "@/components/Meeting/ControlsBar";
import useWebRTC from "@/hooks/useWebRTC";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import PreJoinScreen from "@/components/Meeting/PreJoiningScreen";

export default function MeetingPage() {
  const { socket } = useSocket(); 
  const { user } = useAuth();
  const { meetingId } = useParams();
  const CurrentUser = { _id: user?._id, fullName: user?.fullName, avatar: user?.avatar };

  // Manage hasJoined
  const [hasJoined, setHasJoined] = useState(false);

  const {
    localVideoRef,
    participants,
    toggleMic,
    toggleCam,
    toggleScreen,
    leaveMeeting,
    mic,
    cam,
    screen,
    raiseHand,
    handRaised,
  } = useWebRTC(socket, meetingId, CurrentUser, hasJoined); // pass hasJoined here

  const [showParticipants, setShowParticipants] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const closeSidePanel = () => {
    setShowParticipants(false);
    setShowHostControls(false);
    setShowChat(false);
  };

  // Pre-Joining Screen // To Do : Check on multi device (same device camera clash error)
  if (!hasJoined) {
    return (
      <PreJoinScreen
        mic={mic}
        cam={cam}
        toggleMic={toggleMic}
        toggleCam={toggleCam}
        localVideoRef={localVideoRef}
        onJoin={() => setHasJoined(true)}
      />
        
    );
  }

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col">
      <MeetingLayout
        mic={mic}
        cam={cam}
        screen={screen}
        showParticipants={showParticipants}
        showHostControls={showHostControls}
        showChat={showChat}
        handRaised={handRaised}
        onClosePanel={closeSidePanel}
        participants={participants}
      />

      <ControlsBar
        mic={mic}
        cam={cam}
        screen={screen}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreen={toggleScreen}
        onLeave={leaveMeeting}
        onRaiseHand={raiseHand}
        onToggleParticipants={() => {
          setShowParticipants((prev) => !prev);
          setShowChat(false);
          setShowHostControls(false);
        }}
        onToggleHostControls={() => {
          setShowHostControls((prev) => !prev);
          setShowChat(false);
          setShowParticipants(false);
        }}
        onToggleChat={() => {
          setShowChat((prev) => !prev);
          setShowHostControls(false);
          setShowParticipants(false);
        }}
      />
    </div>
  );
}
