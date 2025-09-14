import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function PreviousMarkings({ onDivSelect, previousMarkings}) {
  const [openExam, setOpenExam] = useState(null);
  const [openSubject, setOpenSubject] = useState(null);
  const [openClass, setOpenClass] = useState(null);

  if (!previousMarkings || previousMarkings.length === 0) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No data found. Start adding marks to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Previous Markings</h2>

      <div className="space-y-4">
        {previousMarkings.map((exam) => (
          <div key={exam._id} className="border rounded-lg dark:border-gray-700">
            {/* Exam */}
            <div
              onClick={() =>
                setOpenExam(openExam === exam._id ? null : exam._id)
              }
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="font-medium">{exam.name}</span>
              <span>
                {openExam === exam._id ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </span>
            </div>

            {/* Subjects */}
            {openExam === exam._id && (
              <div className="px-6 py-3 space-y-3 bg-gray-50 dark:bg-gray-900">
                {exam.subjects.map((sub) => (
                  <div
                    key={sub.name}
                    className="border rounded-md dark:border-gray-600"
                  >
                    <div
                      onClick={() =>
                        setOpenSubject(
                          openSubject === `${exam._id}-${sub.name}`
                            ? null
                            : `${exam._id}-${sub.name}`
                        )
                      }
                      className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <span>{sub.name}</span>
                      <span>
                        {openSubject === exam._id ? (
                          <ChevronUp size={16} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-500" />
                        )}
                      </span>
                    </div>

                    {/* Classes */}
                    {openSubject === `${exam._id}-${sub.name}` && (
                      <div className="px-5 py-2 space-y-2">
                        {sub.classes.map((cls) => (
                          <div
                            key={cls.class}
                            className="border rounded-md dark:border-gray-600"
                          >
                            <div
                              onClick={() =>
                                setOpenClass(
                                  openClass ===
                                    `${exam._id}-${sub.name}-${cls.class}`
                                    ? null
                                    : `${exam._id}-${sub.name}-${cls.class}`
                                )
                              }
                              className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <span>Class {cls.class}</span>
                              <span>
                                {openClass === exam._id ? (
                                  <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                  <ChevronDown size={16} className="text-gray-500" />
                                )}
                              </span>
                            </div>

                            {/* Divisions */}
                            {openClass ===
                              `${exam._id}-${sub.name}-${cls.class}` && (
                              <div className="px-5 py-2 flex flex-wrap gap-2">
                                {cls.divs.map((d) => (
                                  <button
                                    key={d.div}
                                    onClick={() =>
                                      onDivSelect?.({
                                        examId: exam._id,
                                        exam: exam.name,
                                        subject: sub.name,
                                        class: cls.class,
                                        div: d.div,
                                        studentMarks:d.students
                                      })
                                    }
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                                  >
                                    Div {d.div}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviousMarkings;
