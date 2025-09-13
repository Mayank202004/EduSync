import React, { useState } from "react";
import { ClipboardList, FileSpreadsheet } from "lucide-react";
import AddGrades from "@/components/Marks/TeacherComponents/AddGrades";
import PreviousMarkings from "@/components/Marks/TeacherComponents/PreviousMarkings";
import MarkList from "@/components/Marks/TeacherComponents/MarkList";

function TeacherMarks() {
  const [activeTab, setActiveTab] = useState("addGrades");
  const [selectedContext, setSelectedContext] = useState(null); // exam + subject + class + div

  const renderContent = () => {
    switch (activeTab) {
      case "addGrades":
        return <AddGrades />;

      case "previousMarkings":
        return selectedContext ? (
          <MarkList
            context={selectedContext}
            onBack={() => setSelectedContext(null)}
          />
        ) : (
          <PreviousMarkings onDivSelect={setSelectedContext} />
        );

      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="flex h-[90vh] w-full bg-customLightBg dark:bg-customDarkFg px-4 py-2">
      {/* Sidebar */}
      <div className="hidden md:block md:w-[30%] lg:w-[20%] pr-4">
        <div className="h-full bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 dark:border dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6">Teacher Panel</h2>
          <ul className="space-y-4">
            <li
              className={`flex items-center space-x-2 cursor-pointer hover:text-blue-600 ${
                activeTab === "addGrades" ? "text-blue-600 font-medium" : ""
              }`}
              onClick={() => {
                setActiveTab("addGrades");
                setSelectedContext(null);
              }}
            >
              <ClipboardList size={18} />
              <span>Add Grades</span>
            </li>
            <li
              className={`flex items-center space-x-2 cursor-pointer hover:text-blue-600 ${
                activeTab === "previousMarkings"
                  ? "text-blue-600 font-medium"
                  : ""
              }`}
              onClick={() => {
                setActiveTab("previousMarkings");
                setSelectedContext(null);
              }}
            >
              <FileSpreadsheet size={18} />
              <span>Previous Markings</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[70%] lg:w-[80%]">{renderContent()}</div>
    </div>
  );
}

export default TeacherMarks;
