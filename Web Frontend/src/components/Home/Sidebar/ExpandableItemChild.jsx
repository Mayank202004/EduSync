import React, { useState } from "react";
import ChatCard from "/src/components/ui/chat-card.jsx";

const ExpandableItemChild = ({ title, subtitle, avatar, chatId}) => {
  const [showPopup, setShowPopup] = useState(false);

  const CURRENT_USER = {
    name: title,
    avatar: avatar || "src/assets/avatar.png", // Default avatar if none is provided
  };

  const handleClick = () => {
    setShowPopup(true); // Open popup when clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close popup
  };

  return (
    <div>
      <div
        className="flex items-center mb-2 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-600 duration-200 rounded cursor-pointer"
        onClick={handleClick} // Open popup on click
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
          {avatar || title.charAt(0)}
        </div>

        {/* Text content */}
        <div className="flex flex-col text-sm">
          <span className="font-medium">{title}</span>
          <span className="text-gray-500 dark:text-gray-300 text-xs">{subtitle}</span>
        </div>
      </div>

      {/* Popup for Chat Screen */}
      {showPopup && (
        <div className="fixed bottom-0 left-0 mb-4 ml-4 z-50">
          <div className="bg-transparent dark:bg-transaparent p-4 w-96 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-black dark:text-white bg-white dark:bg-gray-600 hover:bg-gray-500 p-2 rounded-full"
            >
              X
            </button>
            <ChatCard
              chatName={title} // Use title as chat name
              membersCount={1} // Set to 1 as we are just showing this user in the popup
              onlineCount={1} // Assume the user is online
              initialMessages={[]} // No initial messages
              currentUser={CURRENT_USER}
              className="border border-zinc-200 dark:border-zinc-700" // Tailwind class for light/dark mode
              onSendMessage={(message) => console.log("Sent:", message)}
              onReaction={(messageId, emoji) => console.log("Reaction:", messageId, emoji)}
              onMoreClick={() => console.log("More clicked")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableItemChild;
