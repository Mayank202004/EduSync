import React from "react";

function MobileTabs({ exams, activeIndex, setActiveIndex }) {
  return (
    <div className=" left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-around items-center h-14 md:hidden z-50">
      {/* Home Tab */}
      <button
        onClick={() => setActiveIndex(0)}
        className={`flex-1 h-full flex items-center justify-center text-sm font-medium ${
          activeIndex === 0
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 dark:text-gray-300"
        }`}
      >
        Home
      </button>

      {/* Exams Tabs */}
      {exams?.map((exam, idx) => (
        <button
          key={exam.id || idx}
          onClick={() => setActiveIndex(idx + 1)}
          className={`flex-1 h-full flex items-center justify-center text-sm font-medium ${
            activeIndex === idx + 1
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 dark:text-gray-300"
          }`}
        >
          {exam.examId?.name || `Exam ${idx + 1}`}
        </button>
      ))}
    </div>
  );
}

export default MobileTabs;
