import mongoose, { Schema } from "mongoose";

const calendarSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    enum: ["national holiday", "local holiday", "event", "academic event", "other"],
    default: "other",
  },
  extendedProps: {
    description: {
      type: String,
      default: "",
    },
  },
});

export default mongoose.model("CalendarEvent", calendarSchema);
