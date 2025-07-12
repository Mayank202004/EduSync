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

    const updated = await Setting.findOneAndUpdate(
        { key: "academicYear" },
        { value: academicYear },
        { upsert: true, new: true }
    );

    res.status(200).json(new ApiResponse(200, updated, "Academic year set successfully"));
});

/**
 * @desc Get Academic Year
 * @route GET /api/v1/setting/academic-year
 * @access Private (User)
 */
export const getAcademicYear = asyncHandler(async (req, res) => {
    const setting = await Setting.findOne({ key: "academicYear" });

    if (!setting) {
        throw new ApiError(404, "Academic year not found");
    }

    res.status(200).json(new ApiResponse(200, setting, "Academic year fetched successfully"));
});

/**
 * @desc Set School Name
 * @route PUT /api/v1/setting/school-name
 * @access Private (Super Admin)
 */
export const setSchoolName = asyncHandler(async (req, res) => {
    const { schoolName } = req.body;

    if (!schoolName) {
        throw new ApiError(400, "School name is required");
    }

    const updated = await Setting.findOneAndUpdate(
        { key: "schoolName" },
        { value: schoolName },
        { upsert: true, new: true }
    );

    res.status(200).json(new ApiResponse(200, updated, "School name set successfully"));
});

/**
 * @desc Get School Name
 * @route GET /api/v1/setting/school-name
 * @access Private (User)
 */
export const getSchoolName = asyncHandler(async (req, res) => {
    const setting = await Setting.findOne({ key: "schoolName" });

    if (!setting) {
        throw new ApiError(404, "School name not found");
    }

    res.status(200).json(new ApiResponse(200, setting, "School name fetched successfully"));
});
