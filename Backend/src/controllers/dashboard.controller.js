import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { getAllUsers, getStudentChats, getSuperAdminChats } from "./chats.controller.js";
import { getTeacherChats } from "./chats.controller.js";


export const fetchDashboardData = asyncHandler(async (req, res) => {
    const user = req.user;
    const student = req.student;
    const chatData = await getStudentChats(user._id,student.class,student.div);
    return res.status(200).json(new ApiResponse(200, {chatData}, "Dashboard data fetched successfully"));
})

export const fetchTeacherDashboardData = asyncHandler(async (req, res) => {
    const teacher = req.teacher;
    const chatData = await getTeacherChats(teacher);
    return res.status(200).json(new ApiResponse(200, {chatData}, "Teacher Dashboard data fetched successfully"));
})

export const fetchSuperAdminDashboardData = asyncHandler(async (req, res) => {
    const allUsers = await getAllUsers(req.user._id);
    const chatData = await getSuperAdminChats(req.user._id);
    return res.status(200).json(new ApiResponse(200, {chatData,allUsers}, "Super Admin Dashboard data fetched successfully"));
})
