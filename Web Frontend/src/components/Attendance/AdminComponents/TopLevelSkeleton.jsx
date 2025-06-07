import React from 'react';

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`} />
);

const TopLevelDashboardSkeleton = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-customDarkFg px-4 py-2 space-y-6">
      <SkeletonBox className="h-8 w-1/2 mx-auto" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded border border-gray-200 dark:border-gray-600 shadow">
            <SkeletonBox className="h-4 w-1/2 mx-auto mb-2" />
            <SkeletonBox className="h-10 md:h-16 w-2/3 mx-auto" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 rounded border border-gray-200 dark:border-gray-600 shadow h-[300px]">
            <SkeletonBox className="h-4 w-1/3 mb-2" />
            <SkeletonBox className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Trend Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 rounded border border-gray-200 dark:border-gray-600 shadow h-[300px]">
            <SkeletonBox className="h-4 w-1/3 mb-2" />
            <SkeletonBox className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* All Classes Grid */}
      <div>
        <SkeletonBox className="h-4 w-1/3 mb-2" />
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopLevelDashboardSkeleton;
