import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const TopLevelDashboard = ({ dashboardData,setDashboardData, onClassClicked }) => {

  const overallAttendancePercentage = dashboardData?.PresenteePercentage?.averagePercentage || 0;
  const classWiseAttendance = dashboardData?.PresenteePercentage?.data?.map(d => ({
    className: d.class,
    percentage: d.presenteePercentage,
  })) || [];

  const weeklyAbsenteeCount = dashboardData?.weeklyAbsenteeCount || [];
  
  const pieData = dashboardData?.genderStats?.map(g => ({
    name: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
    value: g.count,
  })) || [];
  
  const lineData = dashboardData?.dailyTotalPresentee?.data || [];
   const totalStudents = dashboardData?.totalStudents || 0;
  const totalClasses = dashboardData?.classStructure?.length || 0;
  
// To Do: Custom skeleton loading
    if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-customDarkFg px-4 py-2 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center">Top Level School Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Overall Attendance</h2>
          <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400">{overallAttendancePercentage}%</p>
        </div>
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Total Students</h2>
          <p className="text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{totalStudents}</p>
        </div>
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Total Classes</h2>
          <p className="text-2xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">{totalClasses}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 shadow h-[300px]">
          <h2 className="text-md font-semibold mb-2">Class-wise Attendance</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={classWiseAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="className" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 shadow h-[300px]">
          <h2 className="text-md font-semibold mb-2">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height="95%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 shadow h-[300px]">
          <h2 className="text-md font-semibold mb-2">Daily Total Presentees</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 shadow h-[300px]">
          <h2 className="text-md font-semibold mb-2">Weekly Absentee Pattern</h2>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart outerRadius="80%" data={weeklyAbsenteeCount}>
              <PolarGrid />
              <PolarAngleAxis dataKey="day" />
              <PolarRadiusAxis />
              <Radar name="Absents" dataKey="absent" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All Classes Grid */}
      <div>
        <h2 className="text-md font-semibold mb-2">Class Overview</h2>
        <div className="grid grid-cols-6 gap-4">
          {dashboardData.classStructure.map(cls => (
            <button
              key={cls}
              className="bg-blue-500 h-15 text-white py-2 rounded text-center text-sm hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 shadow"
              onClick={() => onClassClicked(cls.className)}
            >
              Class {cls.className}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopLevelDashboard;
