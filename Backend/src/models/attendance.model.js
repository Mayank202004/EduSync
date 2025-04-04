import mongoose, { Schema } from "mongoose";


const classAttendanceSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    class: {
        type: String,
        enum: ["Jr. KG","Sr. KG","1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        required: true,
    },
    div: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
    },
    attendance: [
        {
            studentId: {
                type: Schema.Types.ObjectId,
                ref: "Student",
                required: true,
            },
            status: {
                type: String,
                enum: ["Present", "Absent", "Permitted Leave"],
                default: "Present",
            },
            note: {
                type: String,
            },
        }
    ],
    markedBy: {
        type: Schema.Types.ObjectId,
        ref: "Teacher", // Class Teacher/ Scondary Class Teacher ID
    },
}, {
    timestamps: true
});

// Optional index to prevent duplicate attendance records for same class/div and date
classAttendanceSchema.index({ date: 1, class: 1, div: 1 }, { unique: true });

export const ClassAttendance = mongoose.model("ClassAttendance", classAttendanceSchema);
