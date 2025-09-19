import { ClipboardList, FileSpreadsheet } from "lucide-react";

function LeftSidebar({ activeTab, setActiveTab, setSelectedContext }) {
  return (
    <div className="w-full h-full pr-4">
      <div className="h-full bg-white dark:bg-customDarkFg rounded-2xl shadow-md p-5">
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
              activeTab === "previousMarkings" ? "text-blue-600 font-medium" : ""
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
  );
}

export default LeftSidebar;
