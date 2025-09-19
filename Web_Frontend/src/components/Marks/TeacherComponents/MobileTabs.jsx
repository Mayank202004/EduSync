import { ClipboardList, FileSpreadsheet } from "lucide-react";

function MobileTabs({ activeTab, setActiveTab, setSelectedContext }) {
  return (
    <div className="flex md:hidden mb-4 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <button
        className={`flex items-center justify-center gap-2 px-3 py-2 w-1/2 ${
          activeTab === "addGrades"
            ? "bg-blue-600 text-white"
            : "text-gray-700 dark:text-gray-300"
        }`}
        onClick={() => {
          setActiveTab("addGrades");
          setSelectedContext(null);
        }}
      >
        <ClipboardList size={18} /> Add Grades
      </button>
      <button
        className={`flex items-center justify-center gap-2 px-3 py-2 w-1/2 ${
          activeTab === "previousMarkings"
            ? "bg-blue-600 text-white"
            : "text-gray-700 dark:text-gray-300"
        }`}
        onClick={() => {
          setActiveTab("previousMarkings");
          setSelectedContext(null);
        }}
      >
        <FileSpreadsheet size={18} /> Previous Markings
      </button>
    </div>
  );
}

export default MobileTabs;
