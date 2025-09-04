import React from "react";
import { ArrowLeft, UserPlus, Users, Upload } from "lucide-react";

const ManageUsers = ({ onBackPressed, onSelectOption }) => {
  const options = [
    {
      id: "add-student",
      title: "Add New Student",
      description:
        "Register a new student with details like class, division, and email.",
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
      icon: (
        <Upload className="text-purple-600 dark:text-purple-400" size={32} />
      ),
    },
    {
      id: "bulk-teachers",
      title: "Bulk Teacher Upload",
      description: "Upload multiple teacher accounts together via CSV/Excel.",
      icon: (
        <Upload className="text-orange-600 dark:text-orange-400" size={32} />
      ),
    },
  ];

  return (
    <div className="text-gray-900 dark:text-white md:h-[calc(100%-50px)]">
      {/* Back Button */}
      <button
        onClick={onBackPressed}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6 mt-3"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Manage Users</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-10">
          Choose one of the options below to add or upload users into the
          system.
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
            onClick={() => onSelectOption(opt.id)}
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
            {/* Optional Footer */}
            <div className="mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
