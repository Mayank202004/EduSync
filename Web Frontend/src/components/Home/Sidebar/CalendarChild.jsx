import React, { useState } from "react";
import ChatCard from "/src/components/ui/chat-card.jsx";

const CalendarChild = ({ title, subtitle}) => {

  const handleClick = () => {
  };

  return (
    <div>
      <div
        className="flex items-center mb-2 space-x-2 rounded cursor-pointer px-3 py-1"
        onClick={handleClick} // Open popup on click
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-md bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
            {title?.match(/\d{1,2}/)?.[0] || title.charAt(0)}
        </div>


        {/* Text content */}
        <div className="flex flex-col text-sm">
          <span className="font-medium">{title}</span>
          <span className="text-gray-500 dark:text-gray-300 text-xs">{subtitle}</span>
        </div>
      </div>

      
    </div>
  );
};

export default CalendarChild;
