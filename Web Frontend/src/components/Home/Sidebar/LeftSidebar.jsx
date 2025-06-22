import React from "react";
import ExpandableItem from "./ExpandableItem";
import ExpandableItemChild from "./ExpandableItemChild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

const directMessages = [
  { title: "Shilpa", subtitle: "Super Admin", avatarUrl: "../avatar.png" },
  { title: "Deepti Manish", subtitle: "Teacher", avatarUrl: "../avatar.png" },
  { title: "Aditya Sunil", subtitle: "Student", avatarUrl: "../avatar.png" },
];

const LeftSidebar = ({ chatData }) => {
  // if (!chatData) return <div>Loading Sidebar...</div>; // To do : add skeleton loading
  return (
    <div className="max-w-17/20 p-5 text-sm my-5 mx-auto bg-white dark:bg-customDarkFg rounded-md overflow-y-auto">
      <div className="flex items-center justify-center gap-2 align-middle mb-3 px-3">
        <FontAwesomeIcon
          icon={faMessage}
          className="dark:text-white text-black text-1.5xl"
        />
        <h2 className="font-semibold text-1.5xl">Channels</h2>
      </div>

      {/* Announcements Chats */}
      {chatData?.announcements &&<ExpandableItem title="Announcements" defaultExpanded={true}>
        <ExpandableItemChild
          title={chatData?.announcements[0]?.name ?? "Unnamed Channel"}
          subtitle={`${chatData?.announcements[0]?.participantsCount} Members`}
          chatId={chatData?.announcements[0]?._id}
        />
      </ExpandableItem>}

      {/* Section Chats */}
      {chatData?.sectionChats && <ExpandableItem title="Sections" defaultExpanded={true}>
        <ExpandableItemChild 
          title={chatData?.sectionChats[0]?.name ?? "Unnamed Channel"} 
          subtitle={`${chatData?.sectionChats[0]?.participantsCount} Members`} 
          chatId={chatData?.sectionChats[0]?._id}
        />
      </ExpandableItem>}

      {/* Direct Messages */}
      <h2 className="font-semibold mb-2 mt-4">Direct Messages</h2>
      <input
        type="text"
        placeholder="Search for people"
        className="w-full p-1 mb-2 border rounded placeholder:text-gray-700 dark:placeholder:text-gray-300"
      />
      {chatData?.personalChats.map((item, index) => (
        <ExpandableItemChild
          key={index}
          title={item.teacher.name}
          subtitle={item.teacher.subjects}
          avatarUrl={item.avatar ?? ""}
          chatId={item._id}
        />
      ))}
    </div>
  );
};

export default LeftSidebar;
