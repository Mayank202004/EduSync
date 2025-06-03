import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const dummyClassData = {
  1: {
    divisions: ['A', 'B', 'C'],
    divisionAttendance: [
      { division: 'A', percentage: 90 },
      { division: 'B', percentage: 85 },
      { division: 'C', percentage: 88 },
    ],
    genderStats: [
      { gender: 'Male', count: 150 },
      { gender: 'Female', count: 140 },
    ],
    weeklyAbsenteeCount: [
      { day: 'Mon', absent: 10 },
      { day: 'Tue', absent: 8 },
      { day: 'Wed', absent: 6 },
      { day: 'Thu', absent: 7 },
      { day: 'Fri', absent: 5 },
      { day: 'Sat', absent: 3 },
    ],
    dailyTotalPresentee: [
      { date: '2025-05-26', total: 280 },
      { date: '2025-05-27', total: 285 },
      { date: '2025-05-28', total: 290 },
      { date: '2025-05-29', total: 275 },
      { date: '2025-05-30', total: 280 },
    ],
    topStudents: [
      { name: 'Alice', attendance: 98 },
      { name: 'Bob', attendance: 97 },
      { name: 'Charlie', attendance: 95 },
      { name: 'David', attendance: 94 },
      { name: 'Eva', attendance: 93 },
    ],
  },
  2: {
    divisions: ['A', 'B'],
    divisionAttendance: [
      { division: 'A', percentage: 88 },
      { division: 'B', percentage: 82 },
    ],
    genderStats: [
      { gender: 'Male', count: 120 },
      { gender: 'Female', count: 130 },
    ],
    weeklyAbsenteeCount: [
      { day: 'Mon', absent: 9 },
      { day: 'Tue', absent: 7 },
      { day: 'Wed', absent: 5 },
      { day: 'Thu', absent: 6 },
      { day: 'Fri', absent: 4 },
      { day: 'Sat', absent: 2 },
    ],
    dailyTotalPresentee: [
      { date: '2025-05-26', total: 250 },
      { date: '2025-05-27', total: 255 },
      { date: '2025-05-28', total: 260 },
      { date: '2025-05-29', total: 245 },
      { date: '2025-05-30', total: 248 },
    ],
    topStudents: [
      { name: 'Fiona', attendance: 96 },
      { name: 'George', attendance: 95 },
      { name: 'Hannah', attendance: 93 },
      { name: 'Ian', attendance: 92 },
      { name: 'Jane', attendance: 91 },
    ],
  },
};

const ClassDashboard = ({ selectedClass, onBack }) => {
  const data = dummyClassData[selectedClass];
  if (!data) return <p>No data available for Class {selectedClass}</p>;

  const pieData = data.genderStats.map(g => ({ name: g.gender, value: g.count }));

  const totalStudents = data.genderStats.reduce((sum, g) => sum + g.count, 0);
  const avgAttendance = (
    data.divisionAttendance.reduce((sum, div) => sum + div.percentage, 0) /
    data.divisionAttendance.length
  ).toFixed(1);
  const totalDivisions = data.divisions.length;

  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-customDarkFg px-4 py-2 space-y-6">
      <button
        onClick={onBack}
        className="mb-2 px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        &larr; Back to School Overview
      </button>

      <h1 className="text-2xl font-bold text-center">Class {selectedClass} Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Overall Attendance</h2>
          <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400">
            {avgAttendance}%
          </p>
        </div>
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Total Students</h2>
          <p className="text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
            {totalStudents}
          </p>
        </div>
        <div className="bg-white dark:bg-customDarkFg p-4 rounded border border-gray-200 dark:border-gray-600 text-center shadow">
          <h2 className="text-sm font-semibold text-gray-500">Total Divisions</h2>
          <p className="text-2xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
            {totalDivisions}
          </p>
        </div>
      </div>
      

      {/* Divisions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Divisions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {data.divisions.map(div => (
            <div
              key={div}
              className="bg-blue-500 text-white rounded shadow py-2 text-center cursor-pointer hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Division {div}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Attendance by Division */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border border-gray-200 dark:border-gray-600 shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Attendance by Division</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data.divisionAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="division" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border border-gray-200 dark:border-gray-600 shadow h-[260px]">
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
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border border-gray-200 dark:border-gray-600 shadow">
          <h2 className="text-md font-semibold mb-2 text-center">Top Students by Attendance</h2>
          <ul className="divide-y divide-gray-300 dark:divide-gray-600">
            {data.topStudents.map((student, idx) => (
              <li key={student.name} className="flex justify-between py-1 px-2 text-sm">
                <span>{idx + 1}. {student.name}</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{student.attendance}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Daily Total Presentees */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border border-gray-200 dark:border-gray-600 shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Daily Total Presentees</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data.dailyTotalPresentee}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Absentee Pattern */}
        <div className="bg-white dark:bg-customDarkFg p-3 rounded border border-gray-200 dark:border-gray-600 shadow h-[260px]">
          <h2 className="text-md font-semibold mb-1">Weekly Absentee Pattern</h2>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart outerRadius="80%" data={data.weeklyAbsenteeCount}>
              <PolarGrid />
              <PolarAngleAxis dataKey="day" />
              <PolarRadiusAxis />
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
