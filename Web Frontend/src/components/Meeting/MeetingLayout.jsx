import VideoTile from "./VideoTile";
import ScreenShareTile from "./ScreenShareTile";
import SidePanel from "./SidePanel/SidePanel";
import { useMemo, useState } from "react";
import ParticipantPanel from "./SidePanel/ParticipantPanel";

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
            setPinned={(id) =>setPinned((prev) => (prev === id ? null : id))}/>
        )}
        {showChat && renderChatPanel()}
        {showHostControls && renderHostControlsPanel()}
      </SidePanel>
    )}
    </div>
  );
};

// Side Panel UI Components

const renderChatPanel = () => {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">
        You can pin a message to make it visible for people who join later.
      </p>
      <input
        placeholder="Send a message"
        className="w-full border rounded px-3 py-2 mt-2"
      />
    </div>
  );
};

const renderHostControlsPanel = () => {
  return <div>Host controls settings...</div>;
};


export default MeetingLayout;
