import { Chat } from "../models/chat.model.js";
import { Teacher } from "../models/teacher.model.js";
import { Message } from "../models/messages.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * @desc Helper function to fetch all chats for a student
 * @param {String} userId 
 * @param {String} className 
 * @param {String} div 
 * @returns {Object} - { groupChats, personalChats }
 */
export const getStudentChats = async (userId,className,div) => {
  // 1. Fetch School Group Chat
  const schoolGroupChat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
        name: "School",
      },
    },
    {
      $project: {
        name: 1,
        isGroupChat: 1,
        participantsCount: { $size: "$participants" },
      },
    },
  ]);


  // 2. Fetch Class Group Chat
  const classGroupChat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
        className,
        div
      },
    },
    {
      $project: {
        name: 1,
        isGroupChat: 1,
        participantsCount: { $size: "$participants" },
      },
    },
  ]);


  // 3. Get All Teachers teaching this student’s class/div
  const teachers = await Teacher.find({
    "subjects.classes": {
      $elemMatch: {
        class: className,
        div: div,
      },
    },
  }).populate("userId", "fullName avatar");

  // 4. Prepare personal chats with each teacher
  const personalChats = await Promise.all(
    teachers.map(async (teacher) => {
      const teacherUserId = teacher.userId._id;

      // Check if chat exists
      let chat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [userId, teacherUserId] },
      });

      // Create if not exists
      if (!chat) {
        chat = await Chat.create({
          name: "Private Chat",
          isGroupChat: false,
          participants: [userId, teacherUserId],
        });
      }

      // Get subject(s) taught by this teacher to the student
      const subjectNames = teacher.subjects
        .filter(sub =>
          sub.classes.some(c => c.class === className && c.div.includes(div))
        )
        .map(sub => sub.name);

      return {
        chatId: chat._id,
        updatedAt: chat.updatedAt,
        teacher: {
          _id: teacherUserId,
          name: teacher.userId.fullName,
          avatar: teacher.userId.avatar,
          subjects: subjectNames,
        },
      };
    })
  );

  // Sort personal chats by updatedAt descending
  personalChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Return final response
  return {
    announcements: schoolGroupChat,
    sectionChats: classGroupChat,
    personalChats,
  };
};

export const getTeacherChats = async (userId,teacher) => {
  // 1. Fetch School Group Chat
  const schoolGroupChat = await Chat.findOne({
    isGroupChat: true,
    name: "School Channel",
  });

  // To Do: Prepae roup chats based on all classes that the teacher teaches 
}


/**
 * @desc Fetch Message for given chat id
 * @route GET /api/v1/chats/:chatId
 * @access Private (User)
 */
export const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const messages = await Message.find({ chat: id });
  res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});
