import { FAQ } from "../models/faq.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

/**
 * @desc Add a new FAQ
 * @route POST /api/faqs
 * @access Private (Super Admin)
 */
export const addFAQ = asyncHandler(async (req, res) => {
  const { category, question, answer } = req.body;

  if (!category || !question || !answer) {
    throw new ApiError(400, "All fields are required");
  }

  const newFAQ = await FAQ.create({ category, question, answer });

  return res
    .status(201)
    .json(new ApiResponse(201, newFAQ, "FAQ added successfully"));
});

/**
 * @desc Get all FAQs
 * @route GET /api/faqs
 * @access Public
 */
export const getAllFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find().sort({ createdAt: -1 }).select("-__v");
  return res
    .status(200)
    .json(new ApiResponse(200, faqs, "FAQs fetched successfully"));
});

/**
 * @desc Get FAQs by category
 * @route GET /api/faqs/category/:category
 * @access Public
 */
export const getFAQsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const faqs = await FAQ.find({ category }).select("-category -__v");

  return res.status(200).json(
    new ApiResponse(
      200,
      faqs,
      "FAQs fetched successfully"
    )
  );
});
