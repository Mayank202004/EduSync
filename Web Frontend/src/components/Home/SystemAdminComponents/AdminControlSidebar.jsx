import React from "react";
import {
  UserCheck,
  UserPlus,
  BookMarked,
  ClipboardList,
  CalendarDays,
  FolderKanban,
  MessageSquareWarning,
  Users,
  Settings,
  Megaphone,
} from "lucide-react";

const sidebarItems = [
  { key: "verify-students", label: "Verify Students", icon: UserCheck },
  { key: "verify-teachers", label: "Verify Teachers", icon: UserPlus },
  { key: "manage-classes", label: "Manage Classes", icon: ClipboardList },
  { key: "manage-subjects", label: "Teacher Subjects", icon: BookMarked },
  { key: "manage-academic-year", label: "Academic Year", icon: CalendarDays },
  { key: "ticket-inbox", label: "Complaints", icon: MessageSquareWarning },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "activity-logs", label: "Activity Logs", icon: FolderKanban },
  { key: "user-management", label: "Users", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

const AdminControlSidebar = ({ activeView, setActiveView = () => {} }) => {
  return (
    <div className="h-full w-[250px] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">System Administrator</h2>

      <nav className="flex flex-col gap-2">
        {sidebarItems.map(({ key, label, icon: Icon }) => {
          const isActive = key === activeView;
          return (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminControlSidebar;
