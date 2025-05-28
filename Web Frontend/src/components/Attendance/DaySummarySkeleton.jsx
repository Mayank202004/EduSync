import React from 'react'

function DaySummarySkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-customDarkFg min-h-screen">
      {/* Back button skeleton */}
      <div className="mb-4 flex items-center gap-2 w-40 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Title skeleton */}
      <div className="mb-6 w-60 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Summary Boxes skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-300 dark:bg-gray-700 rounded-2xl p-4 shadow flex items-center gap-4 animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600" />
            <div className="flex flex-col gap-2 w-20">
              <div className="h-4 rounded bg-gray-400 dark:bg-gray-600"></div>
              <div className="h-6 rounded bg-gray-400 dark:bg-gray-600"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Students List skeleton */}
      <div className="bg-gray-50 dark:bg-customDarkFg border dark:border-gray-500 rounded-xl p-4">
        <div className="mb-3 w-40 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(4)].map((_, i) => (
            <li key={i} className="flex justify-between py-2">
              <div className="w-48 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-20 h-5 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DaySummarySkeleton