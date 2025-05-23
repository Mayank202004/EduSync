import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const lineData = [
  { date: 'Jan 1', total: 43 },
  { date: 'Jan 4', total: 45 },
  { date: 'Jan 7', total: 42 },
  { date: 'Jan 10', total: 44 },
  { date: 'Jan 13', total: 44 },
  { date: 'Jan 16', total: 45 },
  { date: 'Jan 19', total: 45 },
  { date: 'Jan 22', total: 46 },
  { date: 'Jan 25', total: 47 },
  { date: 'Jan 28', total: 44 },
];

const barData = [
  { class: 'I', count: 14 },
  { class: 'II', count: 16 },
  { class: 'III', count: 15 },
  { class: 'IV', count: 17 },
  { class: 'V', count: 18 },
  { class: 'VI', count: 16 },
  { class: 'VII', count: 17 },
  { class: 'VIII', count: 19 },
  { class: 'IX', count: 15 },
  { class: 'X', count: 14 },
];

const pieData = [
  { name: 'Male', value: 25 },
  { name: 'Female', value: 22 },
];

const COLORS = ['#34d399', '#3b82f6'];

const radarData = [
  { day: 'Sun', absent: 2 },
  { day: 'Mon', absent: 8 },
  { day: 'Tue', absent: 6 },
  { day: 'Wed', absent: 4 },
  { day: 'Thu', absent: 2 },
  { day: 'Fri', absent: 1 },
  { day: 'Sat', absent: 3 },
];

const topStudents = [
  { name: 'Brooklyn Simmons', percentage: '100%', days: 30 },
  { name: 'Cody Fisher', percentage: '100%', days: 30 },
  { name: 'Marvin McKinney', percentage: '98.7%', days: 29 },
  { name: 'Arlene McCoy', percentage: '97%', days: 28 },
  { name: 'Kristin Watson', percentage: '95.6%', days: 26 },
  { name: 'Savannah Nguyen', percentage: '94%', days: 25 },
];

export default function AttendanceDashboard() {
  return (
    <div className="space-y-6 p-4">
      {/* First row: 2 charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Total Attendance Report</h2>
          <LineChart width={500} height={200} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[38, 48]} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </div>

        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Students by Class</h2>
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

