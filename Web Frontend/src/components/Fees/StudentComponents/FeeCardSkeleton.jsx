const FeeCardSkeleton = () => {
  return (
    <div className="min-w-full md:px-2 pb-6 animate-pulse">
      <div className="w-[95%] mx-auto p-3 border-1 bg-white dark:bg-customDarkFg border-gray-300 dark:border-gray-700 rounded-lg">
        <div className="flex justify-between mb-2">
          <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-1/5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <hr className="my-2 border-gray-300 dark:border-gray-700" />
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default FeeCardSkeleton;
