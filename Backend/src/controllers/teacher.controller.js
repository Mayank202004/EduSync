import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

// To Do : Test
/**
 * @desc Verify teacher
 * @route PATCH /teacher/verify/:id
 * @access Private (Super Admin)
 */
export const verifyTeacher = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;  

        const user = await User.findByIdAndUpdate(id, { verified: true }, { new: true });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        // Join "School" group ---
        await Chat.findOneAndUpdate(
          { name: "School", isGroupChat: true },
          { $addToSet: { participants: user._id } }
        );
      
        return res.status(200).json(new ApiResponse(200, user, "Teacher verified successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

// To Do : Test
/**
 * @desc Add teacher details
 * @route /teacher/details
 * @access Private (Super Admin)
 */
export const updateTeacherDetails = asyncHandler(async (req, res) => {
  const {
    Id,
    position,
    classTeacher,
    classCoordinator,
    subjects,
    phone,
    address,
  } = req.body;

  const teacher = await Teacher.findById(Id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  const userId = teacher.userId;

  // --- 1. Get OLD class-divs (for leave detection) ---
  const prevSubjectMap = new Set();
  teacher.subjects.forEach((subject) => {
    subject.classes.forEach((cls) => {
      cls.div.forEach((d) => {
        prevSubjectMap.add(`${cls.class}-${d}`);
      });
    });
  });

  // --- 2. Update fields ---
  if (position !== undefined) teacher.position = position;
  if (phone !== undefined) teacher.phone = phone;
  if (address !== undefined) teacher.address = address;

  if (classTeacher !== undefined) teacher.classTeacher = classTeacher;
  if (classCoordinator !== undefined) teacher.classCoordinator = classCoordinator;
  if (subjects !== undefined) teacher.subjects = subjects;

  await teacher.save();

  // --- 3. Collect ALL NEW class-divs ---
  const newClassDivMap = new Set();

  // From subjects
  if (teacher.subjects) {
    teacher.subjects.forEach((subject) => {
      subject.classes.forEach((cls) => {
        cls.div.forEach((d) => {
          newClassDivMap.add(`${cls.class}-${d}`);
        });
      });
    });
  }

  // From classTeacher
  if (teacher.classTeacher) {
    newClassDivMap.add(`${teacher.classTeacher.class}-${teacher.classTeacher.div}`);
  }

  // From classCoordinator (add all divisions from that class)
  if (teacher.classCoordinator) {
    const divisionChats = await Chat.find({
      className: teacher.classCoordinator,
      isGroupChat: true,
    });

    divisionChats.forEach((chat) => {
      newClassDivMap.add(`${chat.className}-${chat.div}`);
    });
  }

  // --- 4. Compute chat changes ---
  const toLeave = [...prevSubjectMap].filter((key) => !newClassDivMap.has(key));
  const toJoin = [...newClassDivMap].filter((key) => !prevSubjectMap.has(key));

  // --- 5. Leave chats ---
  for (const key of toLeave) {
    const [className, div] = key.split("-");
    const chat = await Chat.findOne({ className, div, isGroupChat: true });
    if (chat) {
      await Chat.findByIdAndUpdate(chat._id, {
        $pull: { participants: userId },
      });
    }
  }

  // --- 6. Join new chats (avoid duplicates) ---
  const joinedSections = new Set();

  const joinClassChat = async (className, div) => {
    const key = `${className}-${div}`;
    if (joinedSections.has(key)) return;
    joinedSections.add(key);

    let chat = await Chat.findOne({ className, div, isGroupChat: true });
    if (chat) {
      await Chat.findByIdAndUpdate(chat._id, {
        $addToSet: { participants: userId },
      });
    } else {
      await Chat.create({
        name: `Class ${className}-${div}`,
        isGroupChat: true,
        className,
        div,
        participants: [userId],
      });
    }
  };

  for (const key of toJoin) {
    const [className, div] = key.split("-");
    await joinClassChat(className, div);
  }

  
  return res.status(200).json(
    new ApiResponse(200, null, "Teacher details updated and chats synced.")
  );
});

/**
 * @desc Fetch All Verified Teachers
 * @route GET /api/v1/teacher
 * @access Private (Super Admin)
 */
export const fetchAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find()
    .populate({
      path: "userId",
      match: { verified: true },
      select: "verified fullName email", 
    });

  const verifiedTeachers = teachers.filter((teacher) => teacher.userId);

  res.status(200).json(new ApiResponse(200, verifiedTeachers, "Teachers fetched successfully"));
});






/**
 * @desc Fetch unverified teachers
 * @route GET /api/v1/teacher/unverified
 * @access Private (Super Admin)
 */
export const getUnverifiedTeachers = asyncHandler(async (_, res) => {
  const unverifiedTeachers = await User.find({ verified: false, role: "teacher" }).select("fullName email avatar");
  res.status(200).json(
    new ApiResponse(200, unverifiedTeachers, "Unverified teachers fetched successfully")
  );
});