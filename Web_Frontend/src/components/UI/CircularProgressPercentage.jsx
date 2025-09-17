import { text } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";


export const CircularProgress = ({ value, max, onClick, titleText }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage / 100) * circumference;
  return (
    <div
      className="relative w-10 h-10 cursor-pointer group"
      onClick={onClick}
    >
      <svg viewBox="0 0 100 100" className="w-10 h-10 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#3b82f6"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>

      <span className={`font-1 absolute inset-0 flex items-center justify-center font-semibold 
            ${percentage === 100 ? 
              (percentage < 10 ? "text-[20px]" : "text-[12px]") 
              : "text-sm"} 
            pointer-events-none`}
      >
        {percentage}%
      </span>


      {/* small hover tooltip (visible on hover) */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:flex whitespace-nowrap items-center justify-center bg-gray-800 text-white text-xs px-2 py-1 rounded">
        {titleText}
      </div>
    </div>
  );
};