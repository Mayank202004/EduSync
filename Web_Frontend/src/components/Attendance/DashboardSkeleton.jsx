import React from 'react';

const SkeletonCard = ({ title, height = 'h-48' ,width='h-48'}) => (
  <div className="bg-white dark:bg-customDarkFg p-4 rounded w-full border border-gray-200 dark:border-gray-600 animate-pulse">
    <h2 className="text-lg font-semibold mb-2 text-gray-300 dark:text-gray-600">{title}</h2>
    <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded p-4`}></div>
  </div>
);

const SkeletonList = () => (
  <div className="bg-white dark:bg-customDarkFg p-4 rounded w-full border border-gray-200 dark:border-gray-600 animate-pulse">
    <h2 className="text-lg font-semibold mb-2 text-gray-300 dark:text-gray-600">Top 6 Attendant</h2>
    <ul className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex justify-between">
          <span className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></span>
        </li>
      ))}
    </ul>
  </div>
);

function AttendanceDashboardSkeleton({isClassTeacher=true,isSuperAdmin=true}) {
  return (
    <div className={`flex flex-col ${isSuperAdmin ? "w-full" : ""}`}>
      {!isClassTeacher && !isSuperAdmin && (
        <div className="p-4 mx-4 bg-yellow-100 dark:bg-yellow-50 text-yellow-800 rounded-md border border-yellow-300">
            <p className='font-bold'>Seems like you are not a class teacher. If this is a mistake contact super admin</p>
          </div>
        )}
      <div className="space-y-6 p-4 dark:bg-customDarkFg">
        {/* First row: Line & Bar Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SkeletonCard title="Total Attendance Report" height="h-[200px]" width="w=[600px]" />
          <SkeletonCard title="Presentee by Division" height="h-[200px]" width='w-[500px]' />
        </div>

        {/* Second row: PieChart, List, RadarChart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SkeletonCard title="Students by Gender" height="h-[200px]" />
          <SkeletonList />
          <SkeletonCard title="Weekly Absent" height="h-[250px]" />
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboardSkeleton;
