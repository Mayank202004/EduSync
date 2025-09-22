import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, Loader2 } from "lucide-react";

export default function PreJoinScreen({ mic, cam, toggleMic, toggleCam, onJoin, localVideoRef, micAvailable, camAvailable }) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white p-4">
      <div className="text-xl font-semibold mb-4">Ready to Join?</div>

      <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg border border-gray-700">
        {/* Loading or camera off state */}
        {!cam ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <VideoOff className="mr-2" /> {camAvailable ? "Camera is Off" : "Camera or Permission Unavailale"}
          </div>
        ) : !videoReady ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Starting camera...
          </div>
        ) : null}

        {/* Video element (rendered in background, invisible until ready) */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          onLoadedData={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
          className={`w-full h-full object-cover ${!videoReady ? "hidden" : ""}`}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={toggleMic}
          className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm flex items-center gap-2"
        >
          {mic ? <Mic size={18} /> : <MicOff size={18} />}
          {mic ? "Mic On" : "Mic Off"}
        </button>
        <button
          onClick={toggleCam}
          className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm flex items-center gap-2"
        >
          {cam ? <Video size={18} /> : <VideoOff size={18} />}
          {cam ? "Cam On" : "Cam Off"}
        </button>
      </div>

      <button
        onClick={onJoin}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-medium"
      >
        Join Meeting
      </button>
    </div>
  );
}
