import React from "react";

function MainContentSkeleton({ activeIndex }) {
  return (
    <div className="w-full md:w-[75%] lg:w-[80%] space-y-6 overflow-y-auto animate-pulse">
      {/* Student Info Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        {activeIndex > 0 && (
          <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        )}
      </div>

      {/* Home / Graphs Skeleton */}
      {activeIndex === 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          <div className="flex justify-center items-center h-64">
          </div>
        </div>
      )}

      {/* Selected Exam Skeleton */}
      {activeIndex > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg space-y-4">
          {/* Exam Title */}
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>

          {/* Marks Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 border-b">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </th>
                  <th className="p-3 border-b">
                    <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </th>
                  <th className="p-3 border-b">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </th>
                  <th className="p-3 border-b">
                    <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800">
                    <td className="p-3 border-b">
                      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Skeleton */}
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center">
            <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          {/* Grades Table Skeleton */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 border-b">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </th>
                  <th className="p-3 border-b">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:even:bg-gray-700 dark:odd:bg-gray-800">
                    <td className="p-3 border-b">
                      <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-3 border-b">
                      <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainContentSkeleton;
