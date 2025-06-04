import { ClassStructure } from '../models/classStructure.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';


/**
 * @desc Add a class
 * @route POST /class
 * @access Private (Super admin)
 */
export const addClass = asyncHandler(async (req, res) => {
    const {className} = req.body;
    if(!className?.trim()){
        throw new ApiError(400,"Class is required");
    }

    const exists = await ClassStructure.findOne({ className });
    if (exists) {
        throw new ApiError(400, "Class already exists");
    }

    const newClass = await ClassStructure.create({ className, divisions:[] });
    res.status(201).json(new ApiResponse(201, newClass, "Class created successfully"));
});

/**
 * @desc Add a division to a class
 * @route POST /class/add-div
 * @access Private (Super admin)
 */
export const addDivision = asyncHandler(async (req, res) => {
    const { className, div } = req.body;
    if(!className?.trim() || !div?.trim()){
        throw new ApiError(400,"Class and div are required");
    }

    const classDoc = await ClassStructure.findOne({ className });
    if (!classDoc) {
        throw new ApiError(404, "Class not found");
    }

    if (classDoc.divisions.includes(div)) {
        throw new ApiError(400, "Division already exists");
    }

    classDoc.divisions.push(div);
    await classDoc.save();

    res.status(200).json(new ApiResponse(200, classDoc, "Division added successfully"));
});

/**
 * @desc Delete a division from class
 * @route DELETE /class/div
 * @access Private (Super admin)
 */
export const removeDivision = asyncHandler(async (req, res) => {
    const { className, div } = req.body;
    if(!className?.trim() || !div?.trim()){
        throw new ApiError(400,"Class and div are required");
    }

    const classDoc = await ClassStructure.findOne({ className });
    if (!classDoc) {
        throw new ApiError(404, "Class not found");
    }

    const index = classDoc.divisions.indexOf(div);
    if (index === -1) {
        throw new ApiError(400, null, "Division does not exist");
    }

    classDoc.divisions.splice(index, 1);
    await classDoc.save();

    res.status(200).json(new ApiResponse(200, classDoc, "Division removed successfully"));
});

/**
 * @desc Delete a class
 * @route DELETE /class
 * @access Private (Super admin)
 */
export const deleteClass = asyncHandler(async (req, res) => {
    const { className } = req.body;
    if(!className?.trim()){
        throw new ApiError(400,"Class is required");
    }

    const deleted = await ClassStructure.findOneAndDelete({ className });
    if (!deleted) {
        throw new ApiError(404, "Class not found");
    }
    res.status(200).json(new ApiResponse(200, deleted, "Class deleted successfully"));
});

/**
 * @desc Get all classes and their divisions
 * @route GET /class
 * @access Private (Super admin)
 */
export const getAllClasses = asyncHandler(async (req, res) => {
    const classes = await ClassStructure.find().sort({ className: 1 }); // Optional sorting by className
    res.status(200).json(new ApiResponse(200, classes, "Classes fetched successfully"));
});