import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import attendanceImg from "@/assets/attendance.svg";
import resourceImg from "@/assets/homePage.svg";
import teachingImg from "@/assets/teaching.png";
import { CalendarCheck, Book, School } from "lucide-react";

const TeacherHomeContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const teacherSubjects = [
    { subject: "Mathematics", class: "10", division: "A" },
    { subject: "Physics", class: "11", division: "B" },
    { subject: "Computer Science", class: "12", division: "C" },
  ];

  return (
    <div className="w-full min-h-screen py-3 px-4 bg-customLightFg dark:bg-customDarkBg">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Welcome Card */}
        <div className="flex items-center bg-white dark:bg-customDarkFg rounded-2xl px-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {user?.fullName || "Teacher"} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your classes, track attendance, and upload resources all from one place.
            </p>
          </div>
          <img src={teachingImg} alt="Teaching Illustration" className="w-[100px] md:w-[150px] mx-auto" />
        </div>

        {/* Feature Cards (Attendance + Resource) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Attendance */}
          <div className="flex flex-col justify-between h-full bg-white dark:bg-customDarkFg rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CalendarCheck className="text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Take Attendance</h3>
            </div>
            <img src={attendanceImg} alt="Attendance" className="w-[160px] mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Easily record and manage student attendance for your subjects.
            </p>
            <button
              onClick={() => navigate("/teacher/attendance")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Go to Attendance
            </button>
          </div>

          {/* Resources */}
          <div className="flex flex-col justify-between h-full bg-white dark:bg-customDarkFg rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Book className="text-blue-700 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">View Resources</h3>
            </div>
            <img src={resourceImg} alt="Resources" className="w-[160px] mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Browse resources and materials uploaded for your subjects and classes.
            </p>
            <button
              onClick={() => navigate("/resources")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              View Resources
            </button>
          </div>
        </div>


        {/* Subjects Grid */}
        <div className="bg-white dark:bg-customDarkBg p-6 md:p-8 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Your Subjects & Classes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherSubjects.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-gray-50 dark:bg-customDarkFg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.subject}</h3>
                  <School className="text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Class: <span className="font-medium">{item.class}</span> | Div:{" "}
                  <span className="font-medium">{item.division}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherHomeContent;
