import React, { useState } from "react";
import { ArrowLeft, UserPlus, Users, Upload } from "lucide-react";
import AddStudentForm from "./AddStudentForm";
import AddTeacherForm from "./AddTeacherForm";
import BulkStudentUpload from "./BulkStudentUpload";
import BulkTeacherUpload from "./BulkTeacherUpload";
import ViewStudentsData from "./ViewStudentsData";

const ManageUsers = ({ onBackPressed }) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const options = [
    {
      id: "add-student",
      title: "Add New Student",
      description: "Register a new student with details like class, division, and email.",
      icon: <UserPlus className="text-blue-600 dark:text-blue-400" size={32} />,
    },
    {
      id: "add-teacher",
      title: "Add New Teacher",
      description: "Add a teacher account with subject and department details.",
      icon: <Users className="text-green-600 dark:text-green-400" size={32} />,
    },
    {
      id: "bulk-students",
      title: "Bulk Student Upload",
      description: "Upload multiple students at once using a CSV/Excel file.",
      icon: <Upload className="text-purple-600 dark:text-purple-400" size={32} />,
    },
    {
      id: "bulk-teachers",
      title: "Bulk Teacher Upload",
      description: "Upload multiple teacher accounts together via CSV/Excel.",
      icon: <Upload className="text-orange-600 dark:text-orange-400" size={32} />,
    },
    {
      id: "view-students-data",
      title: "View Students Data",
      description: "View Students data and export them via CSV/Excel.",
      icon: <Users className="text-amber-800 dark:text-amber-400" size={32} />,
    },
  ];

  return (
    <div className="text-gray-900 dark:text-white overflow-y-auto h-full w-full px-4 md:px-1 flex flex-col">
      {/* Back Button (to parent page) */}
      <button
        onClick={
          activeSection === "dashboard"
            ? onBackPressed
            : () => setActiveSection("dashboard")
        }
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6 mt-3"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {activeSection === "dashboard" && (
        <>
          {/* Header Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Manage Users</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-10">
              Choose one of the options below to add or upload users into the system.
            </p>

            <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">
              Quick Actions
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setActiveSection(opt.id)}
                className="cursor-pointer p-6 rounded-xl bg-white dark:bg-customDarkFg 
                           border border-gray-200 dark:border-gray-700 shadow 
                           hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 
                           transition flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {opt.icon}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {opt.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {opt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Child screens */}
      {activeSection === "add-student" && (
        <AddStudentForm onBack={() => setActiveSection("dashboard")} />
      )}
      {activeSection === "add-teacher" && (
        <AddTeacherForm onBack={() => setActiveSection("dashboard")} />
      )}
      {activeSection === "bulk-students" && (
        <BulkStudentUpload onBack={() => setActiveSection("dashboard")} />
      )}
      {activeSection === "bulk-teachers" && (
        <BulkTeacherUpload onBack={() => setActiveSection("dashboard")} />
      )}
      {activeSection === "view-students-data" && (
        <ViewStudentsData onBack={() => setActiveSection("dashboard")} />
      )}
    </div>
  );
};

export default ManageUsers;
