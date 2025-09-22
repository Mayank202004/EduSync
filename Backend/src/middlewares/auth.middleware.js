import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { Student } from "../models/student.model.js";
import School from "../models/school.model.js";

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
            "-password -refreshToken -__v"
        );

        if (!user) {
          throw new ApiError(401, "Unauthorized: User not found");
        }

        const school = await School.findOne({ _id: user?.schoolId }).select("-createdAt -updatedAt -__v -classOrder -address");

        if (!school && user.role !== "system-admin") {
          throw new ApiError(401, "Unauthorized: School not found or inactive");
        }
        req.user = user; // Attach user to request object
        req.school = school ?? null; // Attach tenent school
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized Request");
    }
});

/**
 * @desc Verify System Administrator (Platform-level Admin)
 * @access Private (System Admin only)
 */
export const verifySystemAdmin = asyncHandler(async (req, _, next) => {
  const user = req.user;

  if (!user || user.role !== "system-admin") {
    throw new ApiError(403, "Access denied: System Administrator only");
  }
  next();
});


export const verifyStudent = asyncHandler(async(req,_,next) =>{
    const user = req.user;

    if (!user || user.role !== "student") {
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }

    const student = await Student.findOne({userId:user._id}).select("-userId -parentContact -address -bloodGroup -allergies -height -weight -parentsInfo -siblingsInfo");

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

    const teacher = await Teacher.findOne({userId:user._id}).select("-phone -address");

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

export const verifySportsTeacher = asyncHandler(async (req, _, next) => {
    const teacher = req.teacher;

    if(!teacher || teacher.position !== "Sports Teacher"){
        throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
    }
    next();
});


