import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const LeftSidebar = ({ exams = [], classes = [], onDivSelect }) => {
  const [openExam, setOpenExam] = useState(null);
  const [openClass, setOpenClass] = useState(null);

  return (
    <aside className="w-64 bg-white dark:bg-customDarkFg rounded-2xl shadow-md p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-semibold mb-4">Previous Markings</h2>

      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam._id} className="border rounded-lg dark:border-gray-700 p-2">
            {/* Exam */}
            <div
              onClick={() => setOpenExam(openExam === exam._id ? null : exam._id)}
              className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <span className="font-medium">{exam.name}</span>
              {openExam === exam._id ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </div>

            {/* Classes */}
            {openExam === exam._id &&
              classes.map((cls) => (
                <div key={cls._id} className="pl-3 mt-1">
                  <div
                    onClick={() => setOpenClass(openClass === cls._id ? null : cls._id)}
                    className="flex justify-between items-center px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
                  >
                    <span>Class {cls.className}</span>
                    {openClass === cls._id ? (
                      <ChevronUp size={16} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500" />
                    )}
                  </div>

                  {/* Divisions */}
                  {openClass === cls._id && cls.divisions?.length > 0 && (
                    <div className="pl-3 mt-1 flex flex-wrap gap-2">
                      {cls.divisions.map((div) => (
                        <button
                          key={div}
                          onClick={() =>
                            onDivSelect?.({
                              examId: exam._id,
                              exam: exam.name,
                              class: cls.className,
                              div: div,
                            })
                          }
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                        >
                          Div {div}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;
