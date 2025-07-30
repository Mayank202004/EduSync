import VideoTile from "./VideoTile";
import ScreenShareTile from "./ScreenShareTile";
import SidePanel from "./SidePanel/SidePanel";
import { useMemo, useState, useEffect } from "react";
import ParticipantPanel from "./SidePanel/ParticipantPanel";
import ChatPanel from "./SidePanel/ChatPanel";
import HostControlPanel from "./SidePanel/HostControlPanel";
import useMediaQuery from "@/hooks/useMediaQuery";




const MeetingLayout = ({
  participants,
  screenSharerId,
  showParticipants,
  showChat,
  showHostControls,
  onClosePanel,
  localVideoRef, 
  CurrentUser,
  messages,
  setMessages,
  roomId
}) => {
  const isLgOrLarger = useMediaQuery("(min-width: 1024px)"); // Update max tiles as per the screen size
  const MAX_VISIBLE_TILES = isLgOrLarger ? 12 : 6;
  const isSidePanelOpen = showParticipants || showChat || showHostControls;

  const [pinned, setPinned] = useState(null);

  const dummyParticipants = [
  {
    _id: "1",
    name: "Alice",
    avatar: "https://i.pravatar.cc/150?img=1",
    videoEnabled: false,
    audioEnabled: true,
    videoRef: null,
    stream: null, // Replace with a real MediaStream if testing with video
    isLocal: false,
    isScreen: false,
  },
  {
    _id: "2",
    name: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    videoEnabled: false,
    audioEnabled: true,
    videoRef: null,
    stream: null,
    isLocal: false,
    isScreen: false,
  },
  {
    _id: "3",
    name: "Screen Share",
    avatar: "",
    videoEnabled: false,
    audioEnabled: false,
    videoRef: null,
    stream: null,
    isLocal: false,
    isScreen: true,
  },
  {
    _id: "4",
    name: "You",
    avatar: "https://i.pravatar.cc/150?img=3",
    videoEnabled: false,
    audioEnabled: true,
    videoRef: null,
    stream: null,
    isLocal: true,
    isScreen: false,
  },
  {
    _id: "5",
    name: "You",
    avatar: "https://i.pravatar.cc/150?img=3",
    videoEnabled: true,
    audioEnabled: true,
    videoRef: null,
    stream: null,
    isLocal: true,
    isScreen: false,
  },
];

  

  const [controls, setControls] = useState({
    screenShare: true,
    microphone: true,
    video: true,
    chat: true,
    access: "open",
  });

  const allParticipants = dummyParticipants;


  const visibleTiles = useMemo(() => {
    if (pinned) {
      const pinnedUser = allParticipants.find((p) => p._id === pinned);
      return pinnedUser ? [pinnedUser] : [];
    }

    if (allParticipants.length > MAX_VISIBLE_TILES) {
      return allParticipants.slice(0, MAX_VISIBLE_TILES - 1);
    }

    return allParticipants.slice(0, MAX_VISIBLE_TILES);
  }, [allParticipants, pinned]);

  const overflowCount =
    !pinned && allParticipants.length > MAX_VISIBLE_TILES
      ? allParticipants.length - (MAX_VISIBLE_TILES - 1)
      : 0;

  //const columnCount = Math.ceil(Math.sqrt(visibleTiles.length + (overflowCount > 0 ? 1 : 0)));
const baseCount = visibleTiles.length + (overflowCount > 0 ? 1 : 0);


// Desktop (md and up): 1 to 4 columns based on sqrt
const columnCount = Math.min(Math.ceil(Math.sqrt(baseCount)), 4);
const columnClass = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}[columnCount];

// Small screen (sm): 1 column for 1 participant, 2 for 2+, fallback to max 2
const smColumnCount = Math.min(baseCount === 1 ? 1 : 2, 2);
const smColumnClass = {
  1: "grid-cols-1",
  2: "grid-cols-2",
}[smColumnCount];




  return (
    <div className="relative w-full h-full bg-gray-950 flex">
      {/* Video Grid */}
      <div
    className={`p-4 pb-22 grid gap-4 auto-rows-[minmax(150px,_1fr)] transition-all duration-300
      ${isSidePanelOpen ? "w-[74%]" : "w-full"}
      grid-cols-1
      ${smColumnClass}
      lg:${columnClass}
    `}
  >

            {visibleTiles.map((participant) => (
              participant.isScreen ? (
                <ScreenShareTile 
                  key={participant._id} 
                  participant={participant} 
                  pinned={pinned === participant._id}
                  setPinned={(id) =>
                    setPinned((prev) => (prev === id ? null : id))
                  } 
                />
              ) : (
              <VideoTile
                key={participant._id}
                participant={participant}
                pinned={pinned === participant._id}
                setPinned={(id) =>
                  setPinned((prev) => (prev === id ? null : id))
                }
              />
            )))}

            {overflowCount > 0 && (
              <div className="flex items-center justify-center text-white text-xl font-semibold bg-gray-800 rounded-xl">
                +{overflowCount} more
              </div>
            )}
      </div>

      {/* Side Panel */}
      {isSidePanelOpen && (
        <SidePanel
          title={
            showParticipants
              ? "Participants"
              : showChat
              ? "In-call messages"
              : "Host Controls"
          }
          onClose={onClosePanel}
        >
          {showParticipants && (
            <ParticipantPanel
              participants={allParticipants}
              pinned={pinned}
              setPinned={(id) =>
                setPinned((prev) => (prev === id ? null : id))
              }
            />
          )}
          {showChat && (
            <ChatPanel messages={messages} setMessages={setMessages} CurrentUser={CurrentUser} roomId={roomId} />
          )}
          {showHostControls && (
            <HostControlPanel controls={controls} setControls={setControls} />
          )}
        </SidePanel>
      )}
    </div>
  );
};

export default MeetingLayout;
