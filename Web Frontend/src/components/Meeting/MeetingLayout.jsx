import VideoTile from "./VideoTile";
import ScreenShareTile from "./ScreenShareTile";
import SidePanel from "./SidePanel/SidePanel";
import { useMemo, useState } from "react";
import ParticipantPanel from "./SidePanel/ParticipantPanel";
import ChatPanel from "./SidePanel/ChatPanel";
import HostControlPanel from "./SidePanel/HostControlPanel";

const dummyParticipants = Array.from({ length: 12 }, (_, i) => ({
  _id: `${i + 1}`,
  name: `User ${i + 1}`,
  avatar: `https://i.pravatar.cc/150?u=user${i + 1}`,
  videoEnabled: false,
  audioEnabled: true,
  videoRef: null,
  host: true
}));

const MAX_VISIBLE_TILES = 12;

const MeetingLayout = ({
  participants,
  screenSharerId,
  showParticipants,
  showChat,
  showHostControls,
  onClosePanel,
}) => {
  const actualParticipants = participants || dummyParticipants;
  const isScreenSharing = !!screenSharerId;
  const isSidePanelOpen = showParticipants || showChat || showHostControls;

  const [pinned, setPinned] = useState(null);
  const [messages, setMessages] = useState([ // To Do : remove dummy later
    {
      _id: "1",
      avatar: `https://i.pravatar.cc/150?u=user1`,
      sender: "User 1",
      content: "Hey there!",
      time: "10:00 AM",
    },
    {
      _id: "2",
      avatar: `https://i.pravatar.cc/150?u=user2`,
      sender: "User 2",
      content: "Hello! All set for the meeting?",
      time: "10:01 AM",
    },
  ]);

  const [controls, setControls] = useState({
    screenShare: true,
    microphone: true,
    video: true,
    chat: true,
    access: "open", // or "trusted"
  });

  const visibleTiles = useMemo(() => {
    if (isScreenSharing) {
      const sharer = actualParticipants.find((p) => p._id === screenSharerId);
      return sharer ? [sharer] : [];
    }

    if (pinned) {
      const pinnedUser = actualParticipants.find((p) => p._id === pinned);
      return pinnedUser ? [pinnedUser] : [];
    }

    if (actualParticipants.length > MAX_VISIBLE_TILES) {
      return actualParticipants.slice(0, MAX_VISIBLE_TILES - 1); // last tile is +N more
    }

    return actualParticipants.slice(0, MAX_VISIBLE_TILES);
  }, [actualParticipants, screenSharerId, isScreenSharing, pinned]);

  const overflowCount =
    !pinned && actualParticipants.length > MAX_VISIBLE_TILES
      ? actualParticipants.length - (MAX_VISIBLE_TILES - 1)
      : 0;

  const columnCount = Math.min(
    visibleTiles.length + (overflowCount > 0 ? 1 : 0),
    4
  ); // max 4 cols
  

  return (
    <div className="relative w-full h-full bg-gray-950 flex">
      {/* Video Grid */}
      <div
        className="p-4 pb-22 grid gap-4 auto-rows-[minmax(150px,_1fr)] transition-all duration-300"
        style={{
          width: isSidePanelOpen ? "74%" : "100%",
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {isScreenSharing ? (
          <ScreenShareTile participant={visibleTiles[0]} />
        ) : (
          <>
            {visibleTiles.map((participant) => (
              <VideoTile
                key={participant._id}
                participant={participant}
                pinned={pinned === participant._id}
                setPinned={(id) =>
                  setPinned((prev) => (prev === id ? null : id))
                }
              />
            ))}

            {overflowCount > 0 && (
              <div className="flex items-center justify-center text-white text-xl font-semibold bg-gray-800 rounded-xl">
                +{overflowCount} more
              </div>
            )}
          </>
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
            participants={actualParticipants}
            pinned={pinned}
            setPinned={(id) =>setPinned((prev) => (prev === id ? null : id))}/>
        )}
        {showChat && (
          <ChatPanel messages={messages} setMessages={setMessages}/>
        )}
        {showHostControls && (
          <HostControlPanel controls={controls} setControls={setControls}/>
        )}
      </SidePanel>
    )}
    </div>
  );
};



export default MeetingLayout;
