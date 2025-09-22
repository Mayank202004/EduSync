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
  MoreVertical,
  MonitorOffIcon,
  X,
} from "lucide-react";
import { useState } from "react";

const ControlsBar = ({
  mic,
  cam,
  screen,
  hostControls,
  isHost,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onLeave,
  onRaiseHand,
  handRaised,
  onToggleParticipants,
  onToggleHostControls,
  onToggleChat,
  camAvailable,
  micAvailable
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between px-6">
        <div className="flex gap-4 w-1/3"></div>

        <div className="flex justify-center gap-4 w-1/3">
          <button onClick={onToggleMic} title="Toggle Microphone" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            {isHost || hostControls.microphoneEnableAllowed ? (
              micAvailable
                ? mic
                  ? <Mic />
                  : <MicOff className="text-red-500" />
                : <MicOff className="text-yellow-400" /> // ⚠️ yellow if no mic or permission denied
            ) : (
              <MicOff className="text-gray-500" />
            )}
          </button>

          <button onClick={onToggleCam} title="Toggle Camera" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            {isHost || hostControls.videoEnableAllowed ? (
              camAvailable
                ? cam
                  ? <Video />
                  : <VideoOff className="text-red-500" />
                : <VideoOff className="text-yellow-400" />   // Yellow means unavailable
            ) : (
              <VideoOff className="text-gray-500" />
            )}
          </button>

          <button onClick={onToggleScreen} title="Share Screen" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            { isHost || hostControls.screenShareAllowed ?  <MonitorUp className={screen ? "text-green-500" : ""}/> : <MonitorOffIcon className="text-gray-500"  />}
          </button>

          <button onClick={onRaiseHand} title={handRaised ? "Lower Hand" : "Raise Hand"} className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            <Hand className={handRaised ? "text-yellow-400" : ""} />
          </button>


          <button onClick={() => onLeave()} title="Leave Meeting" className="bg-red-600 hover:bg-red-700 p-3 rounded-full text-white transition">
            <PhoneOff />
          </button>
        </div>

        <div className="flex justify-end gap-4 w-1/3">
          <button onClick={onToggleChat} title="Toggle Chat" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            <MessageCircle />
          </button>
          <button onClick={onToggleParticipants} title="Toggle Participants" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            <Users />
          </button>
          {isHost && <button onClick={onToggleHostControls} title="Toggle Host Controls" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            <Shield />
          </button>}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex justify-evenly items-center gap-2 bg-black/60 p-3 rounded-full">
        <button onClick={onToggleMic} title="Toggle Microphone" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            {isHost || hostControls.microphoneEnableAllowed ? (
              micAvailable
                ? mic
                  ? <Mic />
                  : <MicOff className="text-red-500" />
                : <MicOff className="text-yellow-400" /> // ⚠️ yellow if no mic or permission denied
            ) : (
              <MicOff className="text-gray-500" />
            )}
          </button>

          <button onClick={onToggleCam} title="Toggle Camera" className="bg-black/70 p-3 rounded-full text-white hover:bg-white/20 transition">
            {isHost || hostControls.videoEnableAllowed ? (
              camAvailable
                ? cam
                  ? <Video />
                  : <VideoOff className="text-red-500" />
                : <VideoOff className="text-yellow-400" />   // Yellow means unavailable
            ) : (
              <VideoOff className="text-gray-500" />
            )}
          </button>

        <button onClick={onRaiseHand} title={handRaised ? "Lower Hand" : "Raise Hand"} className=" p-3 rounded-full text-white hover:bg-white/20 transition">
          <Hand className={handRaised ? "text-yellow-400" : ""} />
        </button>

        <button onClick={() => onLeave()} title="Leave Meeting" className="bg-red-600 hover:bg-red-700 p-3 rounded-full text-white transition">
          <PhoneOff />
        </button>

        {/* More Button */}
        <div className="relative">
          <button onClick={() => setShowMore((prev) => !prev)} title="More Options" className="text-white">
            {showMore ? <X /> : <MoreVertical />}
          </button>

          {showMore && (
            <div className="absolute bottom-14 right-0 bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-2 space-y-2 z-50 w-48">
              <button
                onClick={() => {
                  onToggleScreen();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 p-2 rounded"
              >
                <MonitorUp className="w-4 h-4" /> Share Screen
              </button>

              <button
                onClick={() => {
                  onToggleChat();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 p-2 rounded"
              >
                <MessageCircle className="w-4 h-4" /> Chat
              </button>

              <button
                onClick={() => {
                  onToggleParticipants();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 p-2 rounded"
              >
                <Users className="w-4 h-4" /> Participants
              </button>

              {isHost && <button
                onClick={() => {
                  onToggleHostControls();
                  setShowMore(false);
                }}
                className="flex items-center gap-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 p-2 rounded"
              >
                <Shield className="w-4 h-4" /> Host Controls
              </button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlsBar;
