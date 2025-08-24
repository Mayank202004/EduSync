/**
 * @desc Switch Component
 * @param {Boolean} checked - Switch (Toggle) On 
 * @returns {JSX.Element} - Switch
 */
const Switch = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`w-10 h-5 flex items-center rounded-full p-[2px] transition-colors duration-300 
        ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
};

export default Switch;
