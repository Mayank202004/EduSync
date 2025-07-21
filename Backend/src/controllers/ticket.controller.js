import { Ticket } from "../models/ticket.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

/**
 * @desc    Create a new ticket
 * @route   POST /api/ticket/
 * @access  Private
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, category, subCategory } = req.body;

  if (!title?.trim() || !description?.trim() || !category?.trim()) {
    throw new ApiError(400, "Title ,description and category are required");
  }

  const ticket = await Ticket.create({
    issuedBy: req.user._id,
    issuerEmail: req.user.email,
    category,
    subCategory: subCategory ?? "Other",
    title,
    description
  });

  res
    .status(201)
    .json(new ApiResponse(201, ticket, "Ticket created successfully"));
});

/**
 * @desc    Get open (pending) tickets
 * @route   GET /api/tickets/open
 * @access  Private/Admin
 */
export const getOpenTickets = asyncHandler(async (_, res) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const tickets = await Ticket.find({ status: "open" }).select("-__v").lean();

  const sorted = tickets.sort((a, b) => {
    const priorityDiff =
      priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt) - new Date(b.createdAt); // older first
  });

  res
    .status(200)
    .json(new ApiResponse(200, sorted, "Open tickets sorted by priority"));
});

/**
 * @desc    Get resolved or closed tickets
 * @route   GET /api/tickets/closed
 * @access  Private/Admin
 */
export const getClosedTickets = asyncHandler(async (_, res) => {
  const tickets = await Ticket.find({
    status: { $in: ["closed", "resolved"] },
  }).sort({ updatedAt: -1 }).select("-__v");

  res
    .status(200)
    .json(new ApiResponse(200, tickets, "Closed/resolved tickets sorted by last update"));
});


/**
 * @desc Helper function to Delete all tickets
 */
export const deleteAllTickets = async () => {
  try {
    await Ticket.deleteMany({});
  } catch (error) {
    throw error;
  }
};
