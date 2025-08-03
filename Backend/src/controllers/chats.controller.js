import { Chat } from "../models/chat.model.js";
import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/messages.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { decrypt } from "../utils/encryptionUtil.js";
import { v2 as cloudinary } from 'cloudinary';


/**
 * @desc Helper function to fetch all chats for a student
 * @param {String} userId 
 * @param {String} className 
 * @param {String} div 
 * @returns {Object} - { groupChats, personalChats }
 */
export const getStudentChats = async (userId,className,div, schoolId) => {
  // 1. Fetch School Group Chat
  const schoolGroupChat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
        name: "School",
        schoolId: schoolId
      },
    },
    {
      $project: {
        name: 1,
        isGroupChat: 1,
        participants: 1,
        unreadMessageCount: {
          $ifNull: [`$unreadCounts.${userId.toString()}`, 0],
        },
      },
    },
  ]);


  // 2. Fetch Class Group Chat
  const classGroupChat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
        className,
        div,
        schoolId: schoolId
      },
    },
    {
      $project: {
        name: 1,
        isGroupChat: 1,
        participants: 1,
        unreadMessageCount: {
          $ifNull: [`$unreadCounts.${userId.toString()}`, 0],
        },
      },
    },
  ]);


  // 3. Get All Teachers teaching this student’s class/div
  const teachers = await Teacher.find({
    schoolId: schoolId,
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
        schoolId: schoolId,
        isGroupChat: false,
        participants: { $all: [userId, teacherUserId] },
      });

      // Create if not exists
      if (!chat) {
        chat = await Chat.create({
          name: "Private Chat",
          schoolId: schoolId,
          isGroupChat: false,
          participants: [userId, teacherUserId],
        });
      }

      const unreadMessageCount = chat.unreadCounts.get(userId.toString()) || 0;

      // Get subject(s) taught by this teacher to the student
      const subjectNames = teacher.subjects
        .filter(sub =>
          sub.classes.some(c => c.class === className && c.div.includes(div))
        )
        .map(sub => sub.name);

      return {
        _id: chat._id,
        updatedAt: chat.updatedAt,
        unreadMessageCount,
        participants: chat.participants, 
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



/**
 * @desc Helper function to fetch all chats for a teacher
 * @param {Object} - teacher details object
 * @returns {Object} - { groupChats, personalChats }
 */
export const getTeacherChats = async (teacher, schoolId) => {
  const teacherId = teacher?._id;
  const teacherUserId = teacher?.userId;
  // 1. Fetch School Group Chat
  const schoolGroupChat = await Chat.aggregate([
    {
      $match: {
        schoolId: schoolId,
        isGroupChat: true,
        name: "School",
      },
    },
    {
      $project: {
        name: 1,
        isGroupChat: 1,
        participants: 1,
        unreadMessageCount: {
          $ifNull: [`$unreadCounts.${teacherUserId.toString()}`, 0],
        },
      },
    },
  ]);

   
  // 3. Flatten all classes/div combinations the teacher teaches
  const classDivPairs = [];
  teacher.subjects.forEach(subject => {
    subject.classes.forEach(cls => {
      cls.div.forEach(d => {
        classDivPairs.push({ class: cls.class, div: d });
      });
    });
  });

  // 4. Get class group chats for all class/div pairs
  let classGroupChats = [];
  if (classDivPairs.length > 0) {
    classGroupChats = await Chat.aggregate([
      {
        $match: {
          schoolId: schoolId,
          isGroupChat: true,
          $or: classDivPairs.map(pair => ({
            className: pair.class,
            div: pair.div,
          })),
        },
      },
      {
        $project: {
          name: 1,
          className: 1,
          div: 1,
          isGroupChat: 1,
          participants: 1,
          unreadMessageCount: {
            $ifNull: [`$unreadCounts.${teacherUserId.toString()}`, 0],
          },
        },
      },
    ]);
  }

  // 5. Get all private (non-group) chats for the teacher
  const personalChatsRaw = await Chat.find({
    schoolId: schoolId,
    isGroupChat: false,
    participants: teacherUserId,
  })
    .populate({
      path: "participants",
      select: "fullName avatar role",
    })
    .sort({ updatedAt: -1 });

  const personalChats = personalChatsRaw.map(chat => {
    const otherUser = chat.participants.find(p => p._id.toString() !== teacherUserId.toString());

    const baseUser = {
      _id: otherUser?._id,
      name: otherUser?.fullName,
      avatar: otherUser?.avatar,
    };
    return {
      _id: chat._id,
      updatedAt: chat.updatedAt,
      participants: chat.participants.map(p => p._id),
      unreadMessageCount: chat.unreadCounts?.get?.(teacherUserId.toString()) || 0,
      ...(otherUser?.role === "student"
      ? { student: baseUser }
      : { user: { ...baseUser, role: otherUser?.role } }),
    };
  });

  // Final response
  return {
    announcements: schoolGroupChat,
    sectionChats: classGroupChats,
    personalChats,
  };
};

/**
 * @desc Helper function to fetch all chats for a super admin
 * @param {String} userId - _id of user (super admin) 
 * @returns {Object} - { groupChats, personalChats }
 */
export const getSuperAdminChats = async (userId, schoolId) => {

  const schoolGroupChat = await Chat.aggregate([
    {
      $match: {
        schoolId: schoolId,
        isGroupChat: true,
        name: "School",
      },
    },
    {
      $project: {
        name: 1,
        isGroupChat: 1,
        participants: 1,
        updatedAt: 1,
        unreadMessageCount: {
          $ifNull: [`$unreadCounts.${userId}`, 0],
        },
      },
    },
  ]);


  // 3. Get private (non-group) chats
  const personalChatsRaw = await Chat.find({
    schoolId: schoolId,
    isGroupChat: false,
    participants: userId,
  })
    .sort({ updatedAt: -1 })
    .populate('participants', 'fullName avatar role');

  const personalChats = personalChatsRaw.map(chat => {
    const otherUser = chat.participants.find(p => p._id.toString() !== userId.toString());

    return {
      _id: chat._id,
      updatedAt: chat.updatedAt,
      participants: chat.participants.map(p => p._id), // just the IDs
      unreadMessageCount: chat.unreadCounts?.get?.(userId) || 0,
      user: {
        _id: otherUser?._id,
        name: otherUser?.fullName,
        avatar: otherUser?.avatar,
        role: otherUser?.role,
      },
    };
  });

  return {
    announcements: schoolGroupChat,        
    personalChats,                      
  };
};


/**
 * @desc Fetch Message for given chat id
 * @route GET /api/v1/chats/:chatId
 * @access Private (User)
 */
export const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Ensure user is a participant
  const chat = await Chat.findById(id);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  const isParticipant = chat.participants.some(
    (participantId) => participantId.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant in this chat");
  }

  const messages = await Message.find({ chat: id }).populate({
    path: "sender", 
    select: "username fullName avatar",  // To Do : remove fullName if not needed (Also create a profile page to be vieweed by others)
  });

  // Decrypt message content
  const decryptedMessages = messages.map((msg) => {
    const obj = msg.toObject();
    // Only decrypt if content exists and is a non-empty string
    obj.content = (typeof obj.content === "string" && obj.content.includes(":"))
      ? decrypt(obj.content)
      : obj.content || "";
    return obj;
  });

  res.status(200).json(
    new ApiResponse(200, decryptedMessages, "Messages fetched successfully")
  );
});


/**
 * @desc Update unread message count to 0 for a given chatid
 * @route PUT /api/v1/chats/:chatId
 * @access Private (User)
 */
export const resetUnreadCount = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  if(!chat){
    throw new ApiError(404, "Chat not found");
  }
  chat.unreadCounts.set(req.user._id, 0);
  await chat.save();
  res.status(200).json(new ApiResponse(200, chat, "Unread count reset successfully"));
});




export const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files provided");
  }

  const uploadedFiles = [];

  for (const file of req.files) {
    const localPath = file.path;
    const uploaded = await uploadOnCloudinary(localPath,"edusync/chats");

    if (uploaded?.url) {
      uploadedFiles.push({
        url: uploaded.url,
        name: file.originalname,
        type: file.mimetype,
      });
    } else {
      throw new ApiError(500, `Failed to upload file: ${file.originalname}`);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, uploadedFiles, "Files uploaded successfully"));
});


/**
 * @desc Helper func to get All users (excluding current Super Admin)
 * @route GET /api/v1/chat/all-users
 * @access Private (Super Admin)
 */
export const getAllUsers = async (currentUserId,schoolId) => {
  const users = await User.find({ _id: { $ne: currentUserId },schoolId }).select("fullName role");
  return users;
};


export const getOrCreatePersonalChat = asyncHandler(async (req, res) => {
  const { id1, id2 } = req.params;

  let chat = await Chat.findOne({
    schoolId: req.school?._id,
    isGroupChat: false,
    participants: { $all: [id1, id2], $size: 2 },
  });

  if (chat) {
    // Optional: populate the other user
    const otherUser = await User.findById(id2).select("fullName avatar _id role");
    return res
      .status(200)
      .json(new ApiResponse(200, {
        _id: chat._id,
        participants: chat.participants,
        updatedAt: chat.updatedAt,
        unreadMessageCount: chat.unreadCounts?.get?.(id1) || 0,
        user: {_id: otherUser?._id, name: otherUser?.fullName, avatar: otherUser?.avatar, role: otherUser?.role},
      }, "Personal chat found"));
  }

  // Create new chat
  chat = await Chat.create({
    name: "Private Chat",
    schoolId: req.school?._id,
    isGroupChat: false,
    participants: [id1, id2],
  });

  const otherUser = await User.findById(id2).select("fullName avatar _id role");

  return res
    .status(200)
    .json(new ApiResponse(200, {
      _id: chat._id,
      participants: chat.participants,
      updatedAt: chat.updatedAt,
      unreadMessageCount: 0,
      user: {_id: otherUser?._id, name: otherUser?.fullName, avatar: otherUser?.avatar, role: otherUser?.role},
    }, "Personal chat created"));
});




/**
 * @desc Delete all messages along with attachments
 * @route /api/v1/chat/clear-data
 * @access Private (Super Admin)
 */
export const deleteAllMessages = asyncHandler(async (req, res) => {
  try {
    clearMessages(req.school?._id);
    res.status(200).json(new ApiResponse(200,null,"All messages and attachments deleted."));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Something went wrong");
  }
});

/**
 * @desc Helper function to delete all messages along with deleting attachment from cloudinary
 * @returns {void}
 */
export const clearMessages = async (schoolId) => {
  const prefix = "edusync/chats/";

  // Delete images
  await cloudinary.api.delete_resources_by_prefix(prefix, { resource_type: "image" });

  // Delete videos
  await cloudinary.api.delete_resources_by_prefix(prefix, { resource_type: "video" });

  // Delete raw files (e.g., PDFs, docs)
  await cloudinary.api.delete_resources_by_prefix(prefix, { resource_type: "raw" });

  // Then clear the DB
  await Message.deleteMany({schoolId: schoolId});
};


