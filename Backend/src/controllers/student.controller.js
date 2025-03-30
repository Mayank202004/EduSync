import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

/**
 * @desc Add class and division details
 * @route /student/class-details
 * @access Private (Super Admin)
 */
export const addClassDetails = asyncHandler(async (req, res) => {
    const {studId,className,div}=req.body
    
    if (
        [studId,className,div].some(
            (field) => !field?.trim()
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    try{
        const student = await Student.findByIdAndUpdate(studId, {
            class: className,
            div: div
        }, { new: true });
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        await User.findByIdAndUpdate(student.userId, { verified: true });
        res.status(200).json(new ApiResponse(200,student,"Added class details successfully"));
    }catch(error){
        throw new ApiError(500, error.message);
    }
});