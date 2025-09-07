import { useState, useRef} from "react";
import MeetingLayout from "@/components/Meeting/MeetingLayout";
import ControlsBar from "@/components/Meeting/ControlsBar";
import useWebRTC from "@/hooks/useWebRTC";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useParams, useLocation} from "react-router-dom";
import PreJoinScreen from "@/components/Meeting/PreJoiningScreen";

export default function MeetingPage() {
  const { socket } = useSocket(); 
  const { user } = useAuth();
  const { meetingId } = useParams();


  const CurrentUser = {
    _id: user?._id,
    fullName: user?.fullName,
    avatar: user?.avatar,
  };

  const location = useLocation();
  const hostId = location.state?.hostId;
  const isHost = CurrentUser._id === hostId;


  const [hasJoined, setHasJoined] = useState(false);
  const [preJoinMic, setPreJoinMic] = useState(true);
  const [preJoinCam, setPreJoinCam] = useState(true);

  const {
    mic,
    cam,
    localVideoRef,
    participants,
    toggleMic,
    toggleCam,
    toggleScreen,
    leaveMeeting,
    raiseHand,
    handRaised,
    messages,
    screen,
    setMessages,
    hostControls,
    setHostControls
  } = useWebRTC(socket, meetingId, CurrentUser,isHost, hasJoined, preJoinMic, preJoinCam); 

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);


  const closeSidePanel = () => {
    setShowParticipants(false);
    setShowChat(false);
    setShowHostControls(false);
  };

  if (!hasJoined) {
    return (
      <PreJoinScreen
        mic={mic}
        cam={cam}
        //screen={screen}
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
        handRaised={handRaised}
        participants={participants}
        showParticipants={showParticipants}
        showHostControls={showHostControls}
        showChat={showChat}
        onClosePanel={closeSidePanel}
        CurrentUser={CurrentUser}
        messages={messages}
        setMessages={setMessages}
        roomId={meetingId}
        hostControls={hostControls}
        setHostControls={setHostControls}
        isHost={isHost}
      />

      <ControlsBar
        isHost={isHost}
        mic={mic}
        cam={cam}
        screen={screen}
        hostControls={hostControls}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreen={toggleScreen}
        onLeave={leaveMeeting}
        onRaiseHand={raiseHand}
        handRaised={handRaised}
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
