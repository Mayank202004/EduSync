import { Setting } from "../models/setting.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Set Academic Year
 * @route PUT /api/v1/setting/academic-year
 * @access Private (Super Admin)
 */
export const setAcademicYear = asyncHandler(async (req, res) => {
    const { academicYear } = req.body;

    if (!academicYear) {
        throw new ApiError(400, "Academic year is required");
    }

    try {
        const updated = await Setting.findOneAndUpdate(
            { key: "academicYear" },
            { value: academicYear },
            { upsert: true, new: true }
        );

        res.status(200).json(new ApiResponse(200, updated, "Academic year set successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

/**
 * @desc Get Academic Year
 * @route GET /api/v1/setting/academic-year
 * @access Private (User)
 */
export const getAcademicYear = asyncHandler(async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: "academicYear" });

        if (!setting) {
            throw new ApiError(404, "Academic year not found");
        }
        res.status(200).json(new ApiResponse(200, setting, "Academic year fetched successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});
