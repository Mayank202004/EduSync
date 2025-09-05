import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';
import { getAttendanceDashboardData } from '@/services/attendenceService';
import LoadingScreen from '../Loading';
import AttendanceDashboardSkeleton from './DashboardSkeleton';
import { ArrowLeft } from 'lucide-react';
import NoAttendanceDataIllustration from '@/assets/noAttendanceData.png';

const COLORS = ['#34d399', '#3b82f6'];

function AttendanceDashboard({dashboardData, isClassTeacher=false,isSuperAdmin=false, className, div,goBack=()=>{}}) {

  // Set data for charts
  const lineData = dashboardData?.dailyTotalPresentee.data || [];
  const totalStudents = dashboardData?.dailyTotalPresentee.totalStudents;
  const barData = dashboardData?.divisionPresenteePercentage.data.map((item, index) => ({
    class: item.div,
    count: item.percentage,
  })) || [];
  const barDataMonth = dashboardData?.divisionPresenteePercentage.month;

  const pieData = dashboardData?.genderStats.map((g) => ({
    name: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
    value: g.count,
  })) || [];

  const radarData = dashboardData?.weeklyAbsenteeCount || [];

  const topStudents = dashboardData?.topAttendees?.studentAttendance.map((s) => ({
    name: s.name,
    percentage: dashboardData.topAttendees.totalWorkingDays === 0
      ? '0%'
      : ((s.daysPresent / dashboardData.topAttendees.totalWorkingDays) * 100).toFixed(1) + '%',
    days: s.daysPresent,
  })) || [];



  if (!dashboardData) {
    return (
      <div className="flex h-full w-full">
        <AttendanceDashboardSkeleton 
          isClassTeacher={isClassTeacher}
          isSuperAdmin={isSuperAdmin}
        />
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      {(isSuperAdmin) && (
      <button
          onClick={goBack}
          className='mb-4 flex items-center text-blue-600 hover:underline'
          >
          <ArrowLeft className='mr-2' size={18} />
          Back to dashboard
      </button>)}
      <div className="space-y-6 p-1 md:p-4 dark:bg-customDarkFg h-full">
        {isSuperAdmin &&(<h1 className="text-2xl font-bold text-center">Class {className} {div} Dashboard</h1>)}
        {/* First row: 2 charts → stack on small, 2-col on md, stay 2-col on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white dark:bg-customDarkFg p-4 rounded w-full dark:border-gray-600 border border-gray-200 h-[350px] lg:h-[450px]">
            <h2 className="text-lg font-semibold mb-2">Total Attendance Report</h2>
            {lineData.length === 0 ? (
              <div className="flex flex-col items-center text-center h-full justify-center">
                <img
                  src={NoAttendanceDataIllustration}
                  alt="No data"
                  className="w-40 mb-4 rounded-md"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No attendance recorded for this month.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, totalStudents]} allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Present Students" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-customDarkFg p-4 rounded w-full dark:border-gray-600 border border-gray-200 h-[400px] md:h-[350px] lg:h-[450px]">
            <h2 className="text-lg font-semibold mb-2">Presentee by Division</h2>
            {barData.length === 0 ? (
              <div className="flex flex-col items-center text-center justify-center h-full">
                <img
                  src={NoAttendanceDataIllustration}
                  alt="No data"
                  className="w-40 mb-4 rounded-md"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No attendance recorded for this month.
                </p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={barData}>
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#34d399" name="Presentee Percentage"/>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-2 text-center font-bold">
                  Presentee %age for class {className} for {barDataMonth}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Second row */}
        <div className="space-y-6">
          {/* First part → Pie (single on md and below, part of 3-col on lg+) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie */}
            <div className="order-2 lg:order-1 bg-white dark:bg-customDarkFg p-4 rounded w-full dark:border-gray-600 border border-gray-200 h-[350px] lg:col-span-1">
              <h2 className="text-lg font-semibold mb-2">Students by Gender</h2>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="65%"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
                  
            {/* Nested grid → only active <lg */}
            <div className="order-1 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
              {/* Top Students */}
              <div className="bg-white dark:bg-customDarkFg p-4 rounded w-full dark:border-gray-600 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Top 6 Attendant</h2>
                <ul className="space-y-2">
                  {topStudents.length === 0 ? (
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={NoAttendanceDataIllustration}
                        alt="No data"
                        className="w-40 mb-4 rounded-md"
                      />
                      <p className="text-gray-500 dark:text-gray-400">
                        No attendance recorded for this month.
                      </p>
                    </div>
                  ) : (
                    topStudents.map((student, idx) => (
                      <li
                        key={student.name}
                        className="bg-white dark:bg-customDarkFg border border-gray-200 dark:border-gray-600 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{idx + 1}. {student.name}</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">{student.percentage}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>{student.days} days</span>
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                              style={{ width: `${((student.days / dashboardData.topAttendees.totalWorkingDays) * 100).toFixed(1)}%` }}
                            ></div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
                
              {/* Radar */}
              <div className="bg-white dark:bg-customDarkFg p-4 rounded w-full dark:border-gray-600 border border-gray-200 h-[350px]">
                <h2 className="text-lg font-semibold mb-2">Weekly Absent</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <RadarChart outerRadius="65%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="day" />
                    <PolarRadiusAxis allowDecimals={false} />
                    <Radar
                      name="Absents"
                      dataKey="absent"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboard;

