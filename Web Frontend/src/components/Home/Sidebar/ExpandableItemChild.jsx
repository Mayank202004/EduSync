import React from 'react';

const ExpandableItemChild = ({ title, subtitle, avatar }) => {
  return (
    <div className="flex items-center mb-2 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer">
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
  );
};

export default ExpandableItemChild;
