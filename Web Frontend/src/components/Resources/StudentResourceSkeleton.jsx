import React from "react";

function StudentResourcesSkeleton() {
    return (
        <div className="w-full min-h-full grow flex items-center justify-center p-4 my-20 sm:my-0">
          <div className="bg-white dark:bg-customDarkFg p-5 rounded-md max-w-7xl">
            <div className="mb-6 flex items-center sm:justify-between flex-col sm:flex-row gap-2 sm:gap-0">
              <div>
                  <h1 className="text-2xl font-bold">Resources</h1>
                  <p className="text-gray-700 dark:text-gray-200">
                    Choose subject to see your study resources
                  </p>
              </div>
              <div className="block text-black rounded-md border bg-gray-100 dark:bg-gray-800 px-3 py-1 h-10 text-sm shadow-sm w-[6rem] animate-pulse">
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="py-3 sm:w-50 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-black min-w-[12.5rem] animate-pulse"
                >
                  <div className="flex flex-col items-center justify-between gap-1">
                    <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="ml-5 w-[60px] h-[60px] bg-gray-300 dark:bg-gray-700 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
    );
}
export default StudentResourcesSkeleton;