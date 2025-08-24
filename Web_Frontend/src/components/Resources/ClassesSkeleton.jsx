const ClassesSkeleton = () => {
  return (
    <div className="flex items-center justify-center mx-auto">
      <div className="bg-white dark:bg-customDarkFg p-5 rounded-md w-full max-w-6xl mx-3">
        <div className="mb-4 flex items-center justify-between flex-col sm:flex-row gap-2">
          {/* Left side: Heading and description */}
          <div>
            <h1 className="text-2xl font-bold">Select Class</h1>
            <p className="text-gray-700 dark:text-gray-200">
              Choose a class to explore its subjects and resources
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="cursor-pointer flex flex-col rounded-lg p-4 shadow-sm animate-pulse bg-gray-100 dark:bg-gray-700/40"
              >
                <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full md:mx-16 mx-auto mb-3"></div>
                <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
                <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClassesSkeleton;
