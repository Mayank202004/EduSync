import React from "react";
import { useAuth } from "@/context/AuthContext";
import homeIllustration from '@/assets/homePage.svg';
import NoAttendanceDataIllustration from '@/assets/noAttendanceData.png';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis
} from "recharts";
import { useNavigate } from "react-router-dom";

const HomeContent = ({monthlyAttendance,attendanceOverMonths}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const COLORS = ["#10b981", "#ef4444"]; // Green and Red

  // Convert attendanceForTheMonth object to pie chart array
  const attendanceData = Object.entries(monthlyAttendance || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // Convert monthlyAttendancePercentage object to array for line chart
  const monthlyAttendanceData = Object.entries(attendanceOverMonths || {})
    .sort(([a], [b]) => new Date(a) - new Date(b)) // Sort by date
    .map(([month, present]) => ({
      month: new Date(month).toLocaleString('default', { month: 'short' }), // "2025-05" => "May"
      present,
    }));

    console.log(attendanceData);
    console.log(monthlyAttendanceData);


  return (
    <div className="w-full min-h-screen py-2 bg-customLightFg rounded-md dark:bg-customDarkBg">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Study Materials CTA */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-customDarkFg p-6 rounded-2xl shadow-md">
          <img
            src={homeIllustration}
            alt="Learning illustration"
            className="w-[220px] max-w-sm rounded-xl"
          />

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Get Started With Your Study
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Explore all uploaded chapters and resources.
            </p>
            <button
              onClick={() => navigate("/resources")}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Browse Resources
            </button>
          </div>
        </div>

        {/* Charts Section: Pie and Line Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-customDarkFg p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Attendance Overview (This Month)
            </h2>
            <div className="w-full h-72 flex items-center justify-center">
              {attendanceData.every(d => d.value === 0) ? (
                <div className="flex flex-col items-center text-center">
                  <img
                    src={NoAttendanceDataIllustration}
                    alt="No data"
                    className="w-40 mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    No attendance recorded for this month.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      label
                      isAnimationActive={false}
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
            
          {/* Line Chart */}
          <div className="bg-white dark:bg-customDarkFg p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Attendance Over Months
            </h2>
            <div className="w-full h-72 flex items-center justify-center">
              {monthlyAttendanceData.length === 0 ? (
                <div className="flex flex-col items-center text-center">
                  <img
                    src={NoAttendanceDataIllustration}
                    alt="No data"
                    className="w-36 mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your attendance trend will appear here soon.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAttendanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
