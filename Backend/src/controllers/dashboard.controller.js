import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { getStudentChats } from "./chats.controller.js";


export const fetchDashboardData = asyncHandler(async (req, res) => {
    const user = req.user;
    const student = req.student;
    if(!user || !student) {
        throw new ApiError(401, "Unauthorized access");
    }

    const chatData = await getStudentChats(user._id,student.class,student.div);
    return res.status(200).json(new ApiResponse(200, {chatData}, "Dashboard data fetched successfully"));
})