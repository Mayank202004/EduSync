import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';
import clsx from 'clsx';

// Dummy Data
const dummyUserCountData = [
  { school: 'Alpha High', users: 1200 },
  { school: 'Beta Academy', users: 980 },
  { school: 'Gamma School', users: 730 },
  { school: 'Delta Institute', users: 1430 },
  { school: 'Epsilon School', users: 860 },
];

const dummyDataUsage = [
  { school: 'Alpha High', gb: 250 },
  { school: 'Beta Academy', gb: 180 },
  { school: 'Gamma School', gb: 90 },
  { school: 'Delta Institute', gb: 310 },
  { school: 'Epsilon School', gb: 150 },
];

const systemLoadData = [
  { month: 'Jan', load: 40 },
  { month: 'Feb', load: 50 },
  { month: 'Mar', load: 65 },
  { month: 'Apr', load: 55 },
  { month: 'May', load: 70 },
  { month: 'Jun', load: 60 },
];

const featureUsageData = [
  { name: 'Attendance', value: 400 },
  { name: 'Chat', value: 300 },
  { name: 'Video', value: 300 },
  { name: 'Tickets', value: 200 },
  { name: 'Docs', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6B5B95'];

// Reusable Card
const Card = ({ className, children }) => (
  <div className={clsx("bg-white dark:bg-gray-900 shadow-md rounded-xl p-4", className)}>
    {children}
  </div>
);

const SystemAdminDashboard = () => {
  return (
    <div className="w-full h-screen overflow-y-auto bg-gray-100 dark:bg-black p-6 space-y-6">

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Load (Line Chart) */}
        <Card className="h-[300px] col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-2">System Load Over Time</h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={systemLoadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User Count */}
        <Card className="h-[280px]">
          <h2 className="text-lg font-semibold mb-2">User Count per School</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dummyUserCountData}>
              <XAxis dataKey="school" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#4f46e5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Data Usage */}
        <Card className="h-[280px]">
          <h2 className="text-lg font-semibold mb-2">Data Usage (GB) per School</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dummyDataUsage}>
              <XAxis dataKey="school" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gb" fill="#10b981" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Feature Usage (Pie Chart) */}
        <Card className="h-[280px]">
          <h2 className="text-lg font-semibold mb-2">Feature Usage</h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={featureUsageData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {featureUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Uptime card (Mini Stat Card) */}
        <Card className="flex items-center justify-center h-[280px] text-center">
          <div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">Uptime</p>
            <h2 className="text-5xl font-bold text-green-500">99.98%</h2>
            <p className="text-sm text-gray-400 mt-2">Last 30 days</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
