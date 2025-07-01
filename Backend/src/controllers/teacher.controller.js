import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";


// To Do : add teacher to chat groups 
export const verifyTeacher = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;  

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            throw new ApiError(404, "Teacher not found");
        }
        const user = await User.findByIdAndUpdate(teacher.userId, { verified: true }, { new: true });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, user, "Teacher verified successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

/**
 * @desc Add teacher details
 * @route /teacher/details
 * @access Private (Super Admin)
 */
export const updateTeacherDetails = asyncHandler(async (req, res) => {
  try {
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

    if (position) teacher.position = position;
    if (classTeacher) teacher.classTeacher = classTeacher;
    if (classCoordinator) teacher.classCoordinator = classCoordinator;
    if (phone) teacher.phone = phone;
    if (address) teacher.address = address;

    if (subjects && Array.isArray(subjects)) {
      subjects.forEach(({ name, classes }) => {
        let existingSubject = teacher.subjects.find((sub) => sub.name === name);

        if (existingSubject) {
          classes.forEach(({ class: className, div }) => {
            let existingClass = existingSubject.classes.find(
              (cls) => cls.class === className
            );

            if (existingClass) {
              existingClass.div = [...new Set([...existingClass.div, ...div])];
            } else {
              existingSubject.classes.push({ class: className, div });
            }
          });
        } else {
          teacher.subjects.push({ name, classes });
        }
      });
    }

    await teacher.save();

    const userId = teacher.userId;

    // Track joined class/div pairs to avoid duplicates
    const joinedSections = new Set();

    const joinClassChat = async (className, div) => {
      const key = `${className}-${div}`;
      if (joinedSections.has(key)) return;
      joinedSections.add(key);

      let classChat = await Chat.findOne({ className, div, isGroupChat: true });

      if (classChat) {
        await Chat.findByIdAndUpdate(classChat._id, {
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

    // 1. Join "School" group
    await Chat.findOneAndUpdate(
      { name: "School", isGroupChat: true },
      { $addToSet: { participants: userId } }
    );

    // 2. Join classTeacher chat
    if (classTeacher) {
      await joinClassChat(classTeacher.class, classTeacher.div);
    }

    // 3. Join all classCoordinator section chats
    if (classCoordinator) {
      // Fetch all distinct divisions in that class from Chat collection
      const divisionChats = await Chat.find({
        className: classCoordinator,
        isGroupChat: true,
      });

      for (const chat of divisionChats) {
        await joinClassChat(chat.className, chat.div);
      }
    }

    // 4. Join all chats from subjects
    if (subjects && Array.isArray(subjects)) {
      for (const subject of subjects) {
        for (const { class: className, div } of subject.classes) {
          for (const singleDiv of div) {
            await joinClassChat(className, singleDiv);
          }
        }
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, teacher, "Teacher details updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
