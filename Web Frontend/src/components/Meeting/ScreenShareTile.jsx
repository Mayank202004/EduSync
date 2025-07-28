import { useEffect, useRef } from "react";
import { Pin, PinOff } from "lucide-react";
import Avatar from "./Avatar";
import { cn } from "@/lib/cn";

const ScreenShareTile = ({ participant, pinned = false, setPinned = () => {} }) => {
  const videoRef = useRef(null);
  const {
    _id,
    name,
    avatar,
    stream,
    isLocal,
    videoEnabled = true,
  } = participant;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn("Screen autoplay failed:", e);
        });
      }
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={cn(
          "w-full h-full object-contain transition-all duration-300",
          !videoEnabled && "hidden"
        )}
      />

      {!videoEnabled && (
        <div className="w-full h-full flex items-center justify-center text-white bg-gray-700 text-3xl font-semibold">
          <Avatar name={name} avatar={avatar} />
        </div>
      )}

      {/* Pin Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => setPinned(_id)}
          className={cn(
            "bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition",
            pinned && "bg-white text-blue-600"
          )}
          title={pinned ? `Unpin ${name}` : `Pin ${name}`}
        >
          {!pinned ? <Pin className="w-5 h-5" /> : <PinOff className="w-5" />}
        </button>
      </div>

      {/* Screen Sharing Label */}
      <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-sm rounded-lg shadow">
        Screen Sharing – {name}
      </div>

      {/* Name Label */}
      <div className="absolute bottom-2 right-2 text-white text-sm bg-black/50 px-2 py-0.5 rounded-full">
        {name}
      </div>
    </div>
  );
};

export default ScreenShareTile;
