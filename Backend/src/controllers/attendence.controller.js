import { ClassAttendance } from "../models/attendance.model.js";
import { Student } from "../models/student.model.js"; 
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ExcelJS from "exceljs";

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
  
        // Parse and normalize date to avoid time-based errors
        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0);
        

        const markedBy = req.teacher._id;

        // Check for duplicate attendance
        const alreadyExists = await ClassAttendance.findOne({ date: parsedDate, class: className, div });
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
            date: parsedDate,
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
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong");
    }
});

/**
 * @desc Get attendance of a class by date
 * @route POST /api/attendance/daily
 * @access Private (User)
 */
export const getDailyAttendance = asyncHandler(async (req, res) => {
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


/**
 * @desc Get my attenddance (Student)
 * @route POST /api/attendance/me
 * @access Private (Student)
 */
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


/**
 * @desc Find overall or monthly attendance of a class
 * @route POST /api/attendance
 * @access Private (Teacher)
 */
export const getAttendance = asyncHandler(async (req, res) => {
    const { month, year, class: className, div } = req.body;

    if (!className || !div) {
        throw new ApiError(400, "Class and div are required");
    }

    const filter = { class: className, div };

    if (!isNaN(parseInt(month)) && month >= 1 && month <= 12) {
        const selectedYear = parseInt(year) || new Date().getFullYear();
        const startDate = new Date(selectedYear, month - 1, 1);
        const endDate = new Date(selectedYear, month, 0, 23, 59, 59, 999);
        filter.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await ClassAttendance.find(filter).populate({
        path: "attendance.studentId",
        select: "userId",
        populate: {
            path: "userId",
            select: "fullName"
        }
    }).select("-__v -createdAt -updatedAt -class -div");

    if (!attendanceRecords.length) {
        throw new ApiError(404, "No attendance records found");
    }

    const formatted = attendanceRecords.map((record) => {
        const students = record.attendance.map((entry) => ({
            name: entry.studentId?.userId?.fullName || "Unknown",
            status: entry.status
        })).sort((a, b) => a.name.localeCompare(b.name));

        // Convert date to IST string (YYYY-MM-DD)
        const dateIST = record.date.toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).split("/").reverse().join("-"); // DD/MM/YYYY → YYYY-MM-DD

        return {
            date: dateIST,
            students
        };
    });

    res.status(200).json(
        new ApiResponse(200, formatted, "Attendance fetched successfully")
    );
});



/** 
 * @desc Utility to get month start and end in UTC
 */
function getMonthStartEnd(year, month) {
    // month: 1-12
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return { start, end };
}


/**
 * @desc Convert UTC date to IST in YYYY-MM-DD format
*/
function convertToISTDateString(date) {
    if (!date || isNaN(new Date(date))) return null;
    const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const yyyy = istDate.getFullYear();
    const mm = (istDate.getMonth() + 1).toString().padStart(2, "0");
    const dd = istDate.getDate().toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}


/**
 * @desc Export Attendance per month / Overall to excel
 * @route POST /api/attendance/export
 * @access Private (Class Teacher/Class Coordinator/Super Admin)
 */
export const exportAttendanceExcel = asyncHandler(async (req, res) => {
    const { month, year, class: className, div } = req.body;
    const targetYear = year || new Date().getFullYear();

    const query = {};
    if (className) query.class = className;
    if (div) query.div = div;

    let records = [];

    if (month) {
        const { start, end } = getMonthStartEnd(targetYear, month);
        query.date = { $gte: start, $lte: end };

        records = await ClassAttendance.find(query)
            .sort("date")
            .populate({ path: "attendance.studentId", populate: { path: "userId", select: "fullName" } });
    } else {
        records = await ClassAttendance.find(query)
            .sort("date")
            .populate({ path: "attendance.studentId", populate: { path: "userId", select: "fullName" } });
    }

    if (!records.length) throw new ApiError(404, "No attendance records found");

    const students = await Student.find().populate("userId", "fullName");
    const studentNames = students.map(s => s.userId.fullName);

    const workbook = new ExcelJS.Workbook();
    const groupByMonth = {};

    records.forEach(record => {
        const monthKey = `${record.date.getFullYear()}-${(record.date.getMonth() + 1).toString().padStart(2, "0")}`;
        if (!groupByMonth[monthKey]) groupByMonth[monthKey] = [];
        groupByMonth[monthKey].push(record);
    });

    const monthsToExport = month
        ? [`${targetYear}-${month.toString().padStart(2, "0")}`]
        : Object.keys(groupByMonth);

    for (const m of monthsToExport) {
        const data = groupByMonth[m];
        const dates = [...new Set(data.map(r => convertToISTDateString(r.date)).filter(Boolean))].sort();

        const attendanceData = {};
        studentNames.forEach(name => {
            attendanceData[name] = {};
            dates.forEach(date => attendanceData[name][date] = "AB");
        });

        data.forEach(record => {
            const date = convertToISTDateString(record.date);
            record.attendance.forEach(entry => {
                const name = entry.studentId?.userId?.fullName;
                if (name && date) {
                    attendanceData[name][date] =
                        entry.status === "Present" ? "P" :
                        entry.status === "Permitted Leave" ? "PL" :
                        "AB";
                }
            });
        });

        const sheetName = month ? `Attendance_${m}` : m;
        const worksheet = workbook.addWorksheet(sheetName);

        const header = ["Student Name", ...dates, "Total P", "Total AB", "Total PL"];
        worksheet.addRow(header).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D9E1F2' },
        };

        Object.entries(attendanceData).forEach(([name, statuses]) => {
            const values = Object.values(statuses);
            const totalP = values.filter(v => v === "P").length;
            const totalAB = values.filter(v => v === "AB").length;
            const totalPL = values.filter(v => v === "PL").length;
            worksheet.addRow([name, ...values, totalP, totalAB, totalPL]);
        });

        // Summary rows (column-wise count of statuses)
        const summaryP = ["P"], summaryAB = ["AB"], summaryPL = ["PL"];
        dates.forEach(date => {
            let p = 0, ab = 0, pl = 0;
            Object.values(attendanceData).forEach(record => {
                const status = record[date];
                if (status === "P") p++;
                else if (status === "AB") ab++;
                else if (status === "PL") pl++;
            });
            summaryP.push(p); summaryAB.push(ab); summaryPL.push(pl);
        });

        summaryP.push("", "", "");
        summaryAB.push("", "", "");
        summaryPL.push("", "", "");

        const lastRowStart = worksheet.lastRow.number + 1;
        worksheet.addRow(summaryP);
        worksheet.addRow(summaryAB);
        worksheet.addRow(summaryPL);

        // Column styling
        worksheet.columns.forEach((col, idx) => {
            col.width = idx === 0 ? 30 : 12;
            col.alignment = { vertical: 'middle', horizontal: idx === 0 ? 'left' : 'center' };
        });

        // Highlight total columns per student
        const totalCols = header.length;
        const dataRowCount = students.length;
        ["DFF0D8", "F2DEDE", "FCF8E3"].forEach((color, i) => {
            worksheet.getColumn(totalCols - 2 + i).eachCell((cell, row) => {
                if (row > 1 && row <= dataRowCount + 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: color }
                    };
                }
            });
        });

        // Highlight bottom summary rows for each date column
        const colors = ["DFF0D8", "F2DEDE", "FCF8E3"]; // Green for P, Red for AB, Yellow for PL
        for (let i = 0; i < 3; i++) {
            const row = worksheet.getRow(lastRowStart + i);
            row.eachCell((cell, colNumber) => {
                // Skip "Student Name" column and total columns
                if (colNumber > 1 && colNumber <= header.length - 3) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: colors[i] }
                    };
                }
            });
}

    }

    const filename = `Attendance_${className || 'Class'}_${div || 'Div'}_${month ? `${month}_${targetYear}` : 'All'}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    await workbook.xlsx.write(res);
    res.end();
});

/**
 * @desc Get list of students in a class
 * @route POST /api/attendance/students
 * @access Private (Teacher)
 */
export const getStudentList = asyncHandler(async (req, res) => {
  const { className, div } = req.body;

  if (!className?.trim() || !div?.trim()) {
    throw new ApiError(400, "Class and division is required");
  }

  const students = await Student.aggregate([
    { $match: { class: className, div: div } },
    {
      $lookup: {
        from: 'users',           
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    { $sort: { 'user.fullName': 1 } }, 
    { $project: { _id: 1, fullName: '$user.fullName' } } 
  ]);

  if (!students) {
    throw new ApiError(404, "No students found");
  }

  res.status(200).json(new ApiResponse(200, students, "Student names fetched successfully"));
});

export const getGenderDistribution = asyncHandler(async (req, res) => {
    const { className, div } = req.body;

    if (!className?.trim() || !div?.trim()) {
        throw new ApiError(400, "Class and division are required");
    }

    const distribution = await Student.aggregate([
        { $match: { class: className, div: div } },
        { $group: { _id: "$gender", count: { $sum: 1 } } },
        { $project: { gender: "$_id", count: 1, _id: 0 } }
    ]);

    res.status(200).json({
        success: true,
        message: "Gender distribution fetched successfully",
        data: distribution
    });
});

export const getTopAttendees = asyncHandler(async (req, res) => {
    const { className, div } = req.body;

    if (!className?.trim() || !div?.trim()) {
        throw new ApiError(400, "Class and division are required");
    }

    const results = await ClassAttendance.aggregate([
        {
            $match: {
                class: className,
                div: div
            }
        },
        {
            $facet: {
                // Total working days
                totalDays: [
                    { $group: { _id: "$date" } },
                    { $count: "total" }
                ],
                // Attendance summary
                studentAttendance: [
                    { $unwind: "$attendance" },
                    {
                        $match: {
                            "attendance.status": "Present"
                        }
                    },
                    {
                        $group: {
                            _id: "$attendance.studentId",
                            daysPresent: { $sum: 1 }
                        }
                    },
                    { $sort: { daysPresent: -1 } },
                    {
                        $lookup: {
                            from: "students",
                            localField: "_id",
                            foreignField: "_id",
                            as: "student"
                        }
                    },
                    { $unwind: "$student" },
                    {
                        $lookup: {
                            from: "users", // Collection for User model
                            localField: "student.userId",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    { $unwind: "$user" },
                    {
                        $project: {
                            _id: 0,
                            studentId: "$_id",
                            name: "$user.fullName",
                            daysPresent: 1
                        }
                    }
                ]
            }
        }
    ]);

    const totalWorkingDays = results[0]?.totalDays[0]?.total || 0;
    const studentAttendance = results[0]?.studentAttendance || [];

    res.status(200).json({
        success: true,
        message: "Top attendees fetched successfully",
        data: {
            totalWorkingDays,
            studentAttendance
        }
    });
});