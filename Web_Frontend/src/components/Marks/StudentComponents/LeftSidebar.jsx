import { Home, FileSpreadsheet } from "lucide-react";

function LeftSidebar({ exams, activeIndex, setActiveIndex }) {
  return (
    <div className="hidden md:block md:w-[25%] lg:w-[20%] pr-4">
      <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 dark:border dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-6">Navigation</h2>
        <ul className="space-y-3">
          <li
            className={`flex items-center space-x-2 p-3 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${
              activeIndex === 0
                ? "bg-blue-200 dark:bg-blue-800 font-semibold"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
            onClick={() => setActiveIndex(0)}
          >
            <Home size={18} />
            <span>Home</span>
          </li>
          {exams.map((exam, idx) => (
            <li
              key={exam.examId._id}
              className={`flex items-center space-x-2 p-3 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${
                activeIndex === idx + 1
                  ? "bg-blue-200 dark:bg-blue-800 font-semibold"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
              onClick={() => setActiveIndex(idx + 1)}
            >
              <FileSpreadsheet size={18} />
              <span>{exam.examId.name || `Exam ${idx + 1}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
