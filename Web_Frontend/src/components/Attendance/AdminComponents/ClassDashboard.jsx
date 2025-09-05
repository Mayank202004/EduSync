import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';
import { getClassLevelDashboardData } from '@/services/attendenceService';
import TopLevelDashboardSkeleton from './TopLevelSkeleton';
import { ArrowLeft } from 'lucide-react';
import NoAttendanceDataIllustration from '@/assets/noAttendanceData.png';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const ClassDashboard = ({ selectedClass, onBack=()=>{}, onDivisionClicked=()=>{}}) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getClassLevelDashboardData(selectedClass); // Pass selected class if needed
        setDashboardData(res.data);
      } catch (error) {
        console.error(error); // handled by axios interceptor, fallback
      }
    };

    fetchDashboardData();
  }, [selectedClass]);


  const pieData = dashboardData?.genderStats.map(g => ({
    name: g.gender[0].toUpperCase() + g.gender.slice(1), // capitalize
    value: g.count
  }));
  
  const divisions = dashboardData?.classStructure?.[0]?.divisions || [];
  const divisionAttendance = dashboardData?.divWisePresenteePercentage?.data || [];

  const avgAttendance = (
    divisionAttendance.reduce((sum, d) => sum + d.percentage, 0) / (divisionAttendance.length || 1)
  ).toFixed(1);

  const topStudents = dashboardData?.topAttendees?.studentAttendance.map(s => ({
    name: s.name,
    attendance: ((s.daysPresent / dashboardData?.topAttendees.totalWorkingDays) * 100).toFixed(0)
  })) || [];

  if (!dashboardData) {
    return <TopLevelDashboardSkeleton/>
  }


  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-customDarkFg px-4 py-2 space-y-6">
 
      <button
          onClick={onBack}
          className='mb-4 flex items-center text-blue-600 hover:underline'
          >
          <ArrowLeft className='mr-2' size={18} />
          Back to School Overview
      </button>

      <h1 className="text-2xl font-bold text-center">Class {selectedClass} Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Overall Attendance</h2>
          <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400">
            {avgAttendance}%
          </p>
        </div>
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Total Students</h2>
          <p className="text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
            {dashboardData?.totalStudents}
          </p>
        </div>
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Total Divisions</h2>
          <p className="text-2xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
            {divisions.length}
          </p>
        </div>
      </div>

      {/* Divisions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Divisions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {divisions.map(div => (
            <div
              key={div}
              onClick={() => onDivisionClicked(div)}
              className="bg-blue-500 text-white rounded shadow py-2 text-center cursor-pointer hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Division {div}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Division Attendance */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Attendance by Division</h2>
          {divisionAttendance.length === 0 ? (
            <div className="flex flex-col items-center text-center">
              <img
                src={NoAttendanceDataIllustration}
                alt="No data"
                className="w-40 mb-4 rounded-md"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No attendance recorded yet.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={divisionAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="div" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#3b82f6" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gender Distribution */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height="95%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Students */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border shadow">
          <h2 className="text-md font-semibold mb-2 text-center">Top Students by Attendance</h2>
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {topStudents.length === 0 ? (
              <div className="flex flex-col items-center text-center">
                <img
                  src={NoAttendanceDataIllustration}
                  alt="No data"
                  className="w-40 mb-4 rounded-md"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No attendance recorded yet.
                </p>
              </div>
            ) : (
              topStudents.map((student, idx) => (
                <li key={student.name} className="flex justify-between py-1 px-2 text-sm">
                  <span>{idx + 1}. {student.name}</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">{student.attendance}%</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Daily Presentee Line Chart */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Daily Total Presentees</h2>
          {dashboardData?.dailyTotalPresentee.data.length === 0 ? (
            <div className="flex flex-col items-center text-center">
              <img
                src={NoAttendanceDataIllustration}
                alt="No data"
                className="w-40 mb-4 rounded-md"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No attendance recorded yet.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={dashboardData?.dailyTotalPresentee.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, dashboardData?.totalStudents]} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Weekly Absentee Radar Chart */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Weekly Absentee Pattern</h2>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart outerRadius="80%" data={dashboardData?.weeklyAbsenteeCount}>
              <PolarGrid />
              <PolarAngleAxis dataKey="day" />
              <PolarRadiusAxis allowDecimals={false} />
              <Radar name="Absents" dataKey="absent" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClassDashboard;
