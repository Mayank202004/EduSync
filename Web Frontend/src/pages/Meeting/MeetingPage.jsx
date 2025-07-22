// pages/MeetingPage.jsx
import { useState } from "react";
import MeetingLayout from "@/components/Meeting/MeetingLayout";
import ControlsBar from "@/components/Meeting/ControlsBar";
import useWebRTC from "@/hooks/useWebRTC";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";

export default function MeetingPage() {
  const { socket } = useSocket(); 
  const { user} = useAuth();
  const { meetingId } = useParams();
  const CurrentUser={_id:user?._id,fullName:user?.fullName,avatar:user?.avatar};

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
    handRaised
  } = useWebRTC(socket, meetingId, CurrentUser);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const closeSidePanel = () => {
    setShowParticipants(false);
    setShowHostControls(false);
    setShowChat(false);
  };

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
