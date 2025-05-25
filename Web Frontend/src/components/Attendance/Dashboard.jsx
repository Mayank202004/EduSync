import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useState, useEffect } from 'react';
import { getAttendanceDashboardData } from '@/services/attendenceService';
import LoadingScreen from '../Loading';

const COLORS = ['#34d399', '#3b82f6'];

function AttendanceDashboard() {
  // Hooks
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAttendanceDashboardData('1', 'A'); // replace with actual class/div To Do:
        setDashboardData(response.data);
      } catch (error) {
        // Handled By axios interceptor
      }
    };
    fetchDashboardData();
  }, []);

  // Set data for charts
    const lineData = dashboardData?.dailyTotalPresentee || [];
  const barData = dashboardData?.divisionPresenteePercentage.map((item, index) => ({
    class: item.div,
    count: item.percentage,
  })) || [];

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
    <div className="flex items-center justify-center">
      <LoadingScreen />
    </div>
  );
}

  return (
    <div className="space-y-6 p-4">
      {/* First row: 2 charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Total Attendance Report</h2>
          <LineChart width={500} height={200} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 45]} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </div>

        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Presentee by Division</h2>
          <BarChart width={400} height={200} data={barData}>
            <XAxis dataKey="class" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#34d399" />
          </BarChart>
        </div>
      </div>

      {/* Second row: 3 charts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Students by Gender</h2>
          <PieChart width={300} height={200}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Top 6 Attendant</h2>
          <ul className="space-y-2">
            {topStudents.map((student, index) => (
              <li key={index} className="flex justify-between">
                <span>{student.name}</span>
                <span>{student.percentage} ({student.days} days)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Weekly Absent</h2>
          <RadarChart outerRadius={70} width={300} height={250} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="day" />
            <PolarRadiusAxis />
            <Radar name="Absents" dataKey="absent" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboard;

