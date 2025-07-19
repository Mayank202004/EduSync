import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  Hand,
  Users,
  Shield,
  MessageCircle,
} from "lucide-react";

const ControlsBar = ({
  mic,
  cam,
  screen,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onLeave,
  onRaiseHand,
  onToggleParticipants,
  onToggleHostControls,
  onToggleChat, // <-- new prop
}) => {
  return (
    <div className="fixed bottom-4 inset-x-0 px-6 flex items-center justify-between z-50">
      {/* Left side empty or optional buttons */}
      <div className="flex gap-4 w-1/3"></div>

      {/* Centered controls */}
      <div className="flex justify-center gap-4 w-1/3">
        <button
          onClick={onToggleMic}
          title="Toggle Microphone"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          {mic ? <Mic /> : <MicOff className="text-red-500" />}
        </button>

        <button
          onClick={onToggleCam}
          title="Toggle Camera"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          {cam ? <Video /> : <VideoOff className="text-red-500" />}
        </button>

        <button
          onClick={onToggleScreen}
          title="Share Screen"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          <MonitorUp className={screen ? "text-green-500" : ""} />
        </button>

        <button
          onClick={onRaiseHand}
          title="Raise Hand"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          <Hand />
        </button>

        <button
          onClick={onLeave}
          title="Leave Meeting"
          className="bg-red-600 hover:bg-red-700 p-3 rounded-full text-white transition"
        >
          <PhoneOff />
        </button>
      </div>

      {/* Right side: Chat, Participants, Host Controls */}
      <div className="flex justify-end gap-4 w-1/3">
        <button
          onClick={onToggleChat}
          title="Toggle Chat"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          <MessageCircle />
        </button>

        <button
          onClick={onToggleParticipants}
          title="Toggle Participants"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          <Users />
        </button>

        <button
          onClick={onToggleHostControls}
          title="Toggle Host Controls"
          className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition"
        >
          <Shield />
        </button>
      </div>
    </div>
  );
};

export default ControlsBar;
