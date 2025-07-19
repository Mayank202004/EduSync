import { useState } from "react";
import MeetingLayout from "@/components/Meeting/MeetingLayout";
import ControlsBar from "@/components/Meeting/ControlsBar";

export default function MeetingPage() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [screen, setScreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  const handleLeave = () => console.log("Leave meeting");
  const handleRaiseHand = () => setHandRaised((prev) => !prev);

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
      />

      <ControlsBar
        mic={mic}
        cam={cam}
        screen={screen}
        onToggleMic={() => setMic((prev) => !prev)}
        onToggleCam={() => setCam((prev) => !prev)}
        onToggleScreen={() => setScreen((prev) => !prev)}
        onLeave={handleLeave}
        onRaiseHand={handleRaiseHand}
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
