import CalendarEvent from '../models/calendar.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';


/**
 * @desc Create a new calendar event
 * @route POST /api/calendar/add-event
 * @access Private (Super Admin)
 */
export const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, eventType, endDescription } = req.body;

  if (!title || !start || !end) {
    throw new ApiError(400, 'Title, Start, and End date are required.');
  }
  if(!eventType){
    throw new ApiError(400,"Event type is required.");
  }

  const newEvent = new CalendarEvent({
    title,
    start,
    end,
    eventType,
    extendedProps:{description: endDescription},
  });

  await newEvent.save();

  res
    .status(201)
    .json(new ApiResponse(201, newEvent, 'Event created successfully.'));
});


/**
 * @desc Get all calendar events
 * @route GET /api/calendar/events
 * @access Private (Authenticated User)
 */
export const getAllEvents = asyncHandler(async (_, res) => {
  const events = await returnAllEvents();
  res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully.'));
});

/**
 * @desc - Helper function to get all events 
 */
export const returnAllEvents = async() => {
  const events = await CalendarEvent.find().select('-__v -_id');
  return events
}


/**
 * @desc Update a calendar event
 * @route PUT /api/calendar/update-event/:id
 * @access Private (Super Admin)
 */
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedEvent = await CalendarEvent.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedEvent) {
    throw new ApiError(404, 'Event not found.');
  }

  res.status(200).json(new ApiResponse(200, updatedEvent, 'Event updated successfully.'));
});


/**
 * @desc Delete a calendar event
 * @route DELETE /api/calendar/delete-event/:id
 * @access Private (Super Admin)
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedEvent = await CalendarEvent.findByIdAndDelete(id);

  if (!deletedEvent) {
    throw new ApiError(404, 'Event not found.');
  }

  res.status(200).json(new ApiResponse(200, null, 'Event deleted successfully.'));
});
