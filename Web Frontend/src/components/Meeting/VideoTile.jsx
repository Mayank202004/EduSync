import { Mic, MicOff, Video, VideoOff, Pin ,PinOff } from "lucide-react";
import Avatar from "./Avatar";
import { cn } from "@/lib/cn";

const VideoTile = ({ participant, pinned = false, setPinned = ()=>{} }) => {
  const { _id, name, videoEnabled, audioEnabled, videoRef, avatar } = participant;

  return (
    <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          !videoEnabled && "hidden"
        )}
      />

      {!videoEnabled && (
        <div className="w-full h-full flex items-center justify-center text-white bg-gray-700 text-3xl font-semibold">
          <Avatar name={name} avatar={avatar} />
        </div>
      )}

      {/* Translucent overlay + Pin icon */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-white/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        )}
      >
        <button
          onClick={() => setPinned(_id)}
          className={cn(
            "bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition",
            pinned && "bg-white text-blue-600"
          )}
          title={pinned ? "Pinned" : `Pin ${name}`}
        >
          {!pinned ? <Pin className="w-5 h-5" /> : <PinOff className="w-5"/>}
        </button>
      </div>

      {/* Audio/Video Icons */}
      <div className="absolute bottom-2 left-2 flex gap-2 text-white opacity-0 group-hover:opacity-100 transition">
        <div className="bg-black/50 p-1 rounded-full">
          {audioEnabled ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="bg-black/50 p-1 rounded-full">
          {videoEnabled ? (
            <Video className="w-4 h-4" />
          ) : (
            <VideoOff className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>

      {/* Name Label */}
      <div className="absolute bottom-2 right-2 text-white text-sm bg-black/50 px-2 py-0.5 rounded-full">
        {name}
      </div>
    </div>
  );
};

export default VideoTile;
