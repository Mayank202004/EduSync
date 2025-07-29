import React from 'react';
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
} from 'lucide-react';


const AdminHomeCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-start items-start p-4 bg-white dark:bg-customDarkFg rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 p-2 rounded-full mb-3">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

const AdminHomeContent = ({setActiveView=()=>{}}) => {
  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminHomeCard
          icon={UserCheck}
          title="Verify Students"
          description="Approve new student registrations and assign classes."
          onClick={() => setActiveView('verify-students')}
        />
        <AdminHomeCard
          icon={UserPlus}
          title="Verify Teachers"
          description="Approve new teachers and assign subjects/classes."
          onClick={() => setActiveView('verify-teachers')}
        />
        <AdminHomeCard
          icon={ClipboardList}
          title="Manage Classes"
          description="Create or edit classes and divisions."
          onClick={() => setActiveView('manage-classes')}
        />
        <AdminHomeCard
          icon={BookMarked}
          title="Manage Teacher Subjects"
          description="Add subjects and assign to classes and teachers."
          onClick={() => setActiveView('manage-subjects')}
        />
        <AdminHomeCard
          icon={CalendarDays}
          title="Academic Year"
          description="Set academic year dates and term structure."
          onClick={() => setActiveView('manage-academic-year')}
        />
        <AdminHomeCard
          icon={MessageSquareWarning}
          title="Complaints & Feedback"
          description="Review complaints or suggestions submitted."
          onClick={() => setActiveView('ticket-inbox')}
        />
        <AdminHomeCard
          icon={Megaphone}
          title="Announcements"
          description="Post or edit announcements across the system."
        />
        <AdminHomeCard
          icon={FolderKanban}
          title="Activity Logs"
          description="Track user actions and recent activities."
        />
        <AdminHomeCard
          icon={Users}
          title="User Management"
          description="View and manage all registered users."
        />
      </div>
    </div>
  );
};

export default AdminHomeContent;
