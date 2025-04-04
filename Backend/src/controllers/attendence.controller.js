import { ClassAttendance } from "../models/attendance.model.js";
import { Student } from "../models/student.model.js"; 
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Mark attendence of a class
 * @route POST /api/attendance/mark
 * @access Private (Teacher)
 */
export const markAttendance = asyncHandler(async (req, res) => {
    try {
        const { date, class: classNameFromBody, div: divFromBody, absentStudents, permittedLeaveStudents} = req.body;

        if (req.user.role !== "teacher") {
            throw new ApiError(403, "You are not authorized to mark attendance");
        }

        if (!Array.isArray(absentStudents) || !Array.isArray(permittedLeaveStudents)) {
            throw new ApiError(400, "Both 'absentStudents' and 'permittedLeaveStudents' must be arrays (can be empty)");
        }

        // Check if teacher is a class teacher
        let className = classNameFromBody;
        let div = divFromBody;

        if (!req.teacher.classTeacher.class?.trim()) {
            // Not a class teacher → must provide class & div in req
            if (!className?.trim() || !div?.trim()) {
                throw new ApiError(401, "You cannot mark attendance without class and division");
            }
        } else {
            // Is a class teacher → use their assigned class/div if not provided
            className = className || req.teacher.classTeacher.class;
            div = div || req.teacher.classTeacher.div;

            if (!className?.trim() || !div?.trim()) {
                throw new ApiError(404, "Class and division not found");
            }
        }

        if (!date?.trim()) {
            throw new ApiError(400, "Date is required");
        }

        const markedBy = req.teacher._id;

        // Check for duplicate attendance
        const alreadyExists = await ClassAttendance.findOne({ date, class: className, div });
        if (alreadyExists) {
            return res.status(400).json({ message: "Attendance already marked for this class on this date." });
        }

        // Get all students of that class/div
        const allStudents = await Student.find({ class: className, div }).select("_id");

        const attendance = allStudents.map(student => {
            const sid = student._id.toString();
            if (absentStudents.includes(sid)) {
                return {
                    studentId: sid,
                    status: "Absent",
                };
            } else if (permittedLeaveStudents.includes(sid)) {
                return {
                    studentId: sid,
                    status: "Permitted Leave",
                };
            } else {
                return {
                    studentId: sid,
                    status: "Present",
                };
            }
        });

        // Save attendance
        const saved = await ClassAttendance.create({
            date,
            class: className,
            div,
            markedBy,
            attendance,
        });

        res.status(200).json({
            message: "Attendance marked successfully",
            data: saved,
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
});

/**
 * @desc Get attendance of a class by date
 * @route POST /api/attendance/daily
 * @access Private (User)
 */
export const getAttendance = asyncHandler(async (req, res) => {
    const { date, class: className, div } = req.body;

     if (!date || !className || !div) {
        throw new ApiError(400, "Date, class, and div are required");
    }

    const attendance = await ClassAttendance.findOne({ date, class: className, div })
    .populate({
        path: "attendance.studentId",
        select: "userId", 
        populate: {
            path: "userId", // populate from Student → User
            select: "fullName" // only get fullName
        }
    });

    if (!attendance) {
        throw new ApiError(404, "Attendance not found");
    }
    // Sorting as per names
    attendance.attendance.sort((a, b) => {
        const nameA = a.studentId?.userId?.fullName?.toLowerCase() || "";
        const nameB = b.studentId?.userId?.fullName?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
    });

    res.status(200).json(new ApiResponse(200,attendance,"Attendence fetched Succesfully"));
});



export const getMyAttendance = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ userId: req.user._id }).select("_id");
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const month = parseInt(req.body.month); // 1-12
    const year = parseInt(req.body.year) || new Date().getFullYear();

    let dateFilter = {};

    if (!isNaN(month) && month >= 1 && month <= 12) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        dateFilter.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await ClassAttendance.find({
        "attendance.studentId": student._id,
        ...dateFilter,
    });

    if (!attendanceRecords.length) {
        throw new ApiError(404, "No attendance records found");
    }

    let present = 0;
    let absent = 0;
    let leave = 0;

    const formattedAttendance = attendanceRecords.map((record) => {
        const studentAttendance = record.attendance.find((a) =>
            a.studentId.equals(student._id)
        );

        const status = studentAttendance?.status || "Absent";

        // Count attendance types
        if (status === "Present") present++;
        else if (status === "Leave" || status === "Permitted") leave++;
        else absent++;

        return {
            date: record.date,
            status: status,
        };
    });

    res.status(200).json(
        new ApiResponse(200, {
            attendance: formattedAttendance,
            summary: {
                present,
                absent,
                leave,
            },
        }, "Attendance fetched successfully")
    );
});


