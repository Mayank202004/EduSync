import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { Student } from "../models/student.model.js";

/**
 * @desc Verify JWT token
 * @access Private (User)
 */
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Get token from cookies or headers
        const token =
            req.cookies.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized Request No Token Found");
        }
        // Decode token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Find user based on token id
        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized Request");
    }
});

export const verifyStudent = asyncHandler(async(req,_,next) =>{
    const user = req.user;

    if (!user || user.role !== "student") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }

    const student = await Student.findOne({userId:user._id}).select("-userId -parentContact -address -dob -bloodGroup -allergies -height -weight -parentsInfo -siblingsInfo");

    if (!student) {
        throw new ApiError(404, "No student found");
    }

    req.student = student;
    next();
});

export const verifyTeacher = asyncHandler(async (req, _, next) => {
    const user = req.user;

    if (!user || user.role !== "teacher") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }

    const teacher = await Teacher.findOne({userId:user._id}).select("-phone -address -classCoordinator");

    if (!teacher) {
        throw new ApiError(404, "No teacher found");
    }

    req.teacher = teacher;
    next();
});


export const verifyCoordinator = asyncHandler(async (req, _, next) => {
    if (req.user.role !== "coordinator") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }
    next();
});

export const verifySuperAdmin = asyncHandler(async (req, _, next) => {
    if (req.user.role !== "super admin") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }
    next();
});

