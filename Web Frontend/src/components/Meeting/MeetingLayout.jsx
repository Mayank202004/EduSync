import VideoTile from "./VideoTile";
import ScreenShareTile from "./ScreenShareTile";
import SidePanel from "./SidePanel/SidePanel";
import { useMemo, useState, useEffect } from "react";
import ParticipantPanel from "./SidePanel/ParticipantPanel";
import ChatPanel from "./SidePanel/ChatPanel";
import HostControlPanel from "./SidePanel/HostControlPanel";

const MAX_VISIBLE_TILES = 12;

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
  const isSidePanelOpen = showParticipants || showChat || showHostControls;

  const [pinned, setPinned] = useState(null);
  

  const [controls, setControls] = useState({
    screenShare: true,
    microphone: true,
    video: true,
    chat: true,
    access: "open",
  });

  const allParticipants = participants;


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

  const columnCount = Math.min(
    visibleTiles.length + (overflowCount > 0 ? 1 : 0),
    4
  );

  console.log(participants);

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
