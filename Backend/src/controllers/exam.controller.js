import { asyncHandler } from "../utils/asyncHandler.js";
import { Exam } from "../models/exam.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * @desc Add an Exam
 * @route POST /exams/add
 * @access Private (Super Admin)
 */
export const addExam = asyncHandler(async (req, res) => {
  const { examName } = req.body;

  if (!examName) {
    throw new ApiError(400,"Exam Name is required");
  }
  const exam = await Exam.create({
    name: examName,
    schoolId: req.school?._id,  
  });
  return res.status(201).json(new ApiResponse(201,null,"Exam created successfully"));
});

/**
 * @desc Delete an exam
 * @route DELETE /exams/:examId
 * @access Private (Super Admin)
 */
export const deleteExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  if (!examId) {
    throw new ApiError(400, "Exam ID is required");
  }
  const exam = await Exam.findOneAndDelete({
    _id: examId,
    schoolId: req.school?._id,
  });
  if (!exam) {
    throw new ApiError(404, "Exam not found or already deleted");
  }
  return res.status(200).json(new ApiResponse(200, null, "Exam deleted successfully"));
});

/**
 * @desc Get all exams
 * @route GET /exams
 * @access Private (Super Admin)
 */
export const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ schoolId: req.school?._id }).select("_id name");
  return res.status(200).json(new ApiResponse(200, exams, "Exams fetched successfully"));
});