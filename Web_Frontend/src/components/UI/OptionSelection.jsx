import React from 'react'

/**
 * @desc Option selection component 
 * @param {String} label - The label of the option
 * @param {String} value - The value of the option
 * @param {Boolean} selected - Whether the option is selected or not
 * @param {JSX.Element} icon - The icon of the option
 * @returns 
 */
const OptionSelection = ({ label, value, selected, icon, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between px-4 py-2 text-sm border rounded-md transition 
        ${
          selected
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        className={`w-3 h-3 rounded-full border-2 ${
          selected ? "border-blue-600 bg-blue-600" : "border-gray-400"
        }`}
      />
    </button>
  );
};

export default OptionSelection