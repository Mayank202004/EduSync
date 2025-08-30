import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  MicOff,
  MoreVertical,
  Search,
  Pin,
  PinOff,
} from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

const ParticipantPanel = ({ participants, pinned, setPinned, isHost }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleToggle = () => setIsExpanded((prev) => !prev);

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPinned = (id) => pinned === id;

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
          <Search size={16} />
        </span>
        <input
          placeholder="Search for people"
          className="w-full border border-gray-500 rounded-sm pl-10 pr-3 py-2 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <p className="mt-5 text-xs text-gray-500">IN THIS MEETING</p>

      <div>
        <button
          onClick={handleToggle}
          className="flex justify-between items-center w-full text-sm font-medium text-gray-700"
        >
          <span className="flex items-center gap-2">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Members
          </span>
          <span className="text-xs">{participants.length}</span>
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-2">
            {filteredParticipants.map((p) => {
              const [menuRef] = useClickOutside(() => {
                if (openMenuId === p._id) setOpenMenuId(null);
              });

              return (
                <div
                  key={p._id}
                  className="flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-md relative"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm">
                      <div>
                        {p.name}{" "}
                        {p.isYou && (
                          <span className="text-xs text-gray-500">(You)</span>
                        )}
                      </div>
                      {p.host && (
                        <div className="text-xs text-gray-500">Meeting Host</div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 items-center">
                    {!p.audioEnabled && (
                      <MicOff size={16} className="text-gray-500" />
                    )}

                    <button
                      onClick={() => setPinned(p._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isPinned(p._id) ? (
                        <PinOff size={16} className="text-blue-600" />
                      ) : (
                        <Pin size={16} />
                      )}
                    </button>

                    <div className="relative" ref={menuRef}>
                      {isHost && <MoreVertical
                        size={16}
                        className="text-gray-500 cursor-pointer"
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === p._id ? null : p._id
                          )
                        }
                      />}

                      {/* Dropdown menu for host only */}
                      {isHost && openMenuId === p._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Mute User
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Turn Off Camera
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500">
                            Kick Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantPanel;
