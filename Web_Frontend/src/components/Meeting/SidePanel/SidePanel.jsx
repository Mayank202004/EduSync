const SidePanel = ({ title, children, onClose }) => {
  return (
    <div
      className="absolute top-4 right-4 bottom-22 w-[90%] md:w-[40%] lg:w-[25%] bg-white text-black rounded-xl shadow-xl border border-gray-300 flex flex-col transition-all duration-500 ease-in-out"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center font-semibold text-lg rounded-t-xl">
        {title}
        <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 rounded-b-xl">
        {children}
      </div>
    </div>
  );
};

export default SidePanel;
