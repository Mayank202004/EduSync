import { Chat } from "../models/chat.model.js";
import School from "../models/school.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Create a new school
 * @route POST /api/school/
 * @access Private (System Administrator)
 */
export const createSchool = asyncHandler(async (req, res) => {
  const { name, slug, address, logo } = req.body;

  if (!name?.trim() || !slug?.trim()) {
    throw new ApiError(400, "School name and slug is required");
  }

  const finalSlug = slug; // We can use slugify here if needed in the future

  const existing = await School.findOne({
    $or: [{ slug: finalSlug }, { name: name.trim() }],
  });
  if (existing) {
    throw new ApiError(400, "School with this name or slug already exists");
  }

  const school = await School.create({ name, slug: finalSlug, address, logo });

  await Chat.create({
    name: "School",
    isGroupChat: true,
    schoolId: req.school?._id,
    participants: [],
  });

  res.status(201).json(new ApiResponse(201, school, "School created successfully"));
});

/**
 * @desc Get all schools
 * @route GET /api/school/
 * @access Private (System Administrator)
 */
export const getAllSchools = asyncHandler(async (req, res) => {
  const schools = await School.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, schools,"Schools fetched successfully"));
});

/**
 * @desc Get a single school by slug
 * @route GET /api/school/:slug
 * @access Private (System Administrator)
 */
export const getSchoolBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const school = await School.findOne({ slug });

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  res.status(200).json(new ApiResponse(200, school,"School fetched successfully"));
});

/**
 * @desc Update a school by slug
 * @route PUT /api/school/:slug
 * @access Private (System Administrator)
 */
export const updateSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  const { name, slug, address, logo } = req.body;

  const updatedFields = {
    ...(name && { name }),
    ...(slug && { slug }),
    ...(address && { address }),
    ...(logo && { logo }),
  };

  const updated = await School.findOneAndUpdate({ _id: schoolId }, updatedFields, {
    new: true,
  });

  if (!updated) {
    throw new ApiError(404, "School not found");
  }

  res.status(200).json(new ApiResponse(200, null, "School updated successfully"));
});

/**
 * @desc Delete a school by slug
 * @route DELETE /api/school/:slug
 * @access Private (System Administrator)
 */
export const deleteSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  const deleted = await School.findOneAndDelete({ _id: schoolId });

  await Chat.findOneAndDelete({ schoolId: schoolId, isGroupChat: true , name: "School"});

  if (!deleted) {
    throw new ApiError(404, "School not found");
  }

  res.status(200).json(new ApiResponse(200, null, "School deleted successfully"));
});
