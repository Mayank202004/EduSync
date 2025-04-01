import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";



export const verifyTeacher = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;  

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json(new ApiError(404, "Teacher not found"));
        }
        const user = await User.findByIdAndUpdate(teacher.userId, { verified: true }, { new: true });
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        return res.status(200).json(new ApiResponse(200, user, "Teacher verified successfully"));
    } catch (error) {
        console.error("Error verifying teacher:", error);
        return res.status(500).json(new ApiError(500, error.message));
    }
});

/**
 * @desc Add teacher details
 * @route /teacher/details
 * @access Private (Super Admin)
 */
export const updateTeacherDetails = asyncHandler(async (req, res) => {
    try {
        const { Id, position, classTeacher, classCoordinator, subjects, phone, address } = req.body;

        let teacher = await Teacher.findById(Id);

        if (!teacher) {
            throw new ApiError(404,"Teacher not found");
        }

        if (position) teacher.position = position;
        if (classTeacher) teacher.classTeacher = classTeacher;
        if (classCoordinator) teacher.classCoordinator = classCoordinator;
        if (phone) teacher.phone = phone;
        if (address) teacher.address = address;

        if (subjects && Array.isArray(subjects)) {
            subjects.forEach(({ name, classes }) => {
                let existingSubject = teacher.subjects.find(sub => sub.name === name);

                if (existingSubject) {
                    // Update existing subject
                    classes.forEach(({ class: className, div }) => {
                        let existingClass = existingSubject.classes.find(cls => cls.class === className);

                        if (existingClass) {
                            // Add new divisions to the existing class, ensuring no duplicates
                            existingClass.div = [...new Set([...existingClass.div, ...div])]; 
                        } else {
                            // Add new class with its divisions
                            existingSubject.classes.push({ class: className, div });
                        }
                    });
                } else {
                    // Add new subject with its classes and divisions
                    teacher.subjects.push({ name, classes });
                }
            });
        }

        await teacher.save();

        return res.status(200).json(new ApiResponse(200,teacher,"Teacher details updated successfully"));
    } catch (error) {
        throw new ApiError(500, error.message)
    }
});