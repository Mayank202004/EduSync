import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { getAllUsers, getStudentChats, getSuperAdminChats } from "./chats.controller.js";
import { getTeacherChats } from "./chats.controller.js";
import { deleteAllAttendance, getAttendanceForTheMonth, getAttendancePercentageByMonth } from "./attendence.controller.js";
import { clearMessages } from "./chats.controller.js";
import { deleteAllTickets } from "./ticket.controller.js";
import { deleteAllStudentFeeStatuses } from "./paidFee.controller.js";
import { getSettingValue } from "./setting.controller.js";
import { ClassStructure } from "../models/classStructure.model.js";
import { Student } from "../models/student.model.js";
import { returnAllEvents } from "./calendar.controller.js";

export const fetchDashboardData = asyncHandler(async (req, res) => {
    const user = req.user;
    const student = req.student;
    const chatData = await getStudentChats(user._id,student.class,student.div);
    const monthlyAttendancePercentage = await getAttendancePercentageByMonth(student._id,student.class,student.div);
    const attendanceForTheMonth = await getAttendanceForTheMonth(student._id,student.class,student.div);
    const events = await returnAllEvents();
    return res.status(200).json(new ApiResponse(200, {chatData,monthlyAttendancePercentage,attendanceForTheMonth,events}, "Dashboard data fetched successfully"));
});

export const fetchTeacherDashboardData = asyncHandler(async (req, res) => {
    const teacher = req.teacher;
    const chatData = await getTeacherChats(teacher);
    const events = await returnAllEvents();
    return res.status(200).json(new ApiResponse(200, {chatData,events}, "Teacher Dashboard data fetched successfully"));
});

export const fetchSuperAdminDashboardData = asyncHandler(async (req, res) => {
    const allUsers = await getAllUsers(req.user._id);
    const chatData = await getSuperAdminChats(req.user._id);
    const events = await returnAllEvents();
    return res.status(200).json(new ApiResponse(200, {chatData,allUsers,events}, "Super Admin Dashboard data fetched successfully"));
});


/**
 * @desc Controller to selectively delete attendance, fee status, messages, and tickets
 * @route POST /api/dahsbaord/cleanup
 * @access Private (Super Admin)
 */
export const performSelectiveCleanup = asyncHandler(async (req, res) => {
  const { attendance, feeStatus, messages, tickets } = req.body;

  if (!attendance && !feeStatus && !messages && !tickets) {
    throw new ApiError(400, "No cleanup options selected.");
  }
  const toBool = (val) => val === true || val === "true";

  try{    
    if (toBool(attendance)) {
        await deleteAllAttendance();
    }
    if (toBool(feeStatus)) {
        await deleteAllStudentFeeStatuses();
      }
      
    if (toBool(messages)) {
        await clearMessages();
    }
  
    if (toBool(tickets)) {
        await deleteAllTickets();
    }
  
    return res.status(200).json(new ApiResponse(200, null, "Selective cleanup completed."));
  }catch(error){
    throw new ApiError(error.statusCode || 500, error.message || "Something went wrong");
  }
});

/**
 * @desc Fetch academic year data for the dashboard
 * @route GET /api/v1/dashboard/academic-year
 * @access Private (Super Admin)
 */
export const manageAcademicYearData = asyncHandler(async (_, res) => {
  const academicYear = await getSettingValue("academicYear");
  const classesAndDivs = await ClassStructure.find().select("className divisions"); 
  const students = await Student.find()
    .select("_id userId class div")
    .populate({
      path: "userId",
      select: "fullName",
      match: { verified: true },
    });
  
  return res.status(200).json(
    new ApiResponse(200, { academicYear, classesAndDivs, students }, "Academic Year Data Fetched")
  );
});
