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
    }).select("-_id -date -class -div");

    if (!attendance) {
        throw new ApiError(404, "Attendance not found");
    }
    // Sorting as per names
    attendance.attendance.sort((a, b) => {
        const nameA = a.studentId?.userId?.fullName?.toLowerCase() || "";
        const nameB = b.studentId?.userId?.fullName?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
    });

    // Count totals
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  attendance.attendance.forEach(entry => {
    if (entry.status === "Present") presentCount++;
    else if (entry.status === "Absent") absentCount++;
    else if (entry.status === "Permitted Leave") leaveCount++;
  });

  res.status(200).json(new ApiResponse(200, {
    attendance,
    totals: {
      present: presentCount,
      absent: absentCount,
      pl: leaveCount
    }}
    ,"Attendence fetched Succesfully"));
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


/**
 * @desc Helper function to get gender distribution of a class
 * @param {String} className - Class name
 * @param {String} div - Division
 * @returns {Array} - Array of objects containing gender with their counts
 */
const getGenderDistribution = async (className,div) => {

    const distribution = await Student.aggregate([
        { $match: { class: className, div: div } },
        { $group: { _id: "$gender", count: { $sum: 1 } } },
        { $project: { gender: "$_id", count: 1, _id: 0 } }
    ]);

    return distribution;
};


/**
 * @desc Helper function to get top attendees of a class
 * @param {String} className - Class name
 * @param {String} div - Division
 * @returns {Object} - Object containing total working days and top student attendance summary
 */
const getTopAttendees = async (className,div) => {

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

    return {
            totalWorkingDays,
            studentAttendance
        }
};



/**
 * @desc Get presentee percentage per division for a class (current month or fallback to previous)
 * @param {String} className - The class name (e.g., "6", "7", etc.)
 * @returns {Array} - Array of objects: [{ div: 'A', percentage: 87.5 }, ...]
 */
const getDivisionWisePresenteePercentage = async (className) => {
    const now = new Date();

    const getMonthRange = (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start, end };
    };

    const { start: startOfMonth, end: endOfMonth } = getMonthRange(now);

    let data = await aggregateDivisionPresentee(className, startOfMonth, endOfMonth);

    // If no attendance in current month, fallback to previous month
    if (data.length === 0) {
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const { start, end } = getMonthRange(previousMonth);
        data = await aggregateDivisionPresentee(className, start, end);
    }

    return data;
};

/**
 * @desc Helper aggregation function to calculate presentee percentage
 * @param {String} className - Class Name
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} - Array of the objects with division and percentage
 */
async function aggregateDivisionPresentee(className, startDate, endDate) {
    const result = await ClassAttendance.aggregate([
        {
            $match: {
                class: className,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        { $unwind: "$attendance" },
        {
            $group: {
                _id: {
                    div: "$div",
                    studentId: "$attendance.studentId",
                },
                totalMarked: { $sum: 1 },
                presentDays: {
                    $sum: {
                        $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0]
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id.div",
                totalStudents: { $sum: 1 },
                totalPresent: { $sum: "$presentDays" },
                totalDays: { $sum: "$totalMarked" }
            }
        },
        {
            $project: {
                _id: 0,
                div: "$_id",
                percentage: {
                    $cond: [
                        { $eq: ["$totalDays", 0] },
                        0,
                        { $round: [{ $multiply: [{ $divide: ["$totalPresent", "$totalDays"] }, 100] }, 2] }
                    ]
                }
            }
        },
        { $sort: { div: 1 } }
    ]);

    return result;
}


/**
 * @desc Helper function to get weekly absentee count
 * @param {String} className - Class name
 * @param {String} div - Division
 * @returns {Array} - Array of objects with day and absent count
 */
const getWeeklyAbsenteeCount = async (className, div) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const results = await ClassAttendance.aggregate([
        {
            $match: {
                class: className,
                div: div,
                date: { $gte: startOfWeek, $lte: now }
            }
        },
        { $unwind: "$attendance" },
        {
            $match: {
                "attendance.status": "Absent"
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: "$date" }, // 1 = Sunday ... 7 = Saturday
                absent: { $sum: 1 }
            }
        }
    ]);

    const dayMap = {
        2: "Mon",
        3: "Tue",
        4: "Wed",
        5: "Thu",
        6: "Fri",
        7: "Sat"
    };

    const weekData = [
        { day: "Mon", absent: 0 },
        { day: "Tue", absent: 0 },
        { day: "Wed", absent: 0 },
        { day: "Thu", absent: 0 },
        { day: "Fri", absent: 0 },
        { day: "Sat", absent: 0 }
    ];

    for (const item of results) {
        if (item._id === 1) continue; // Skip Sunday (Holiday)
        const day = dayMap[item._id];
        const entry = weekData.find(d => d.day === day);
        if (entry) {
            entry.absent = item.absent;
        }
    }
    return weekData;
};


const getDailyPresenteeForClassDiv = async (className, div) => {
  const now = new Date();
  const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  };

  const { start: startOfMonth, end: endOfMonth } = getMonthRange(now);

  let data = await aggregateDailyPresentee(className, div, startOfMonth, endOfMonth);

  // If no attendance in current month return previous month's data
  if (data.length === 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const { start, end } = getMonthRange(previousMonth);
    data = await aggregateDailyPresentee(className, div, start, end);
  }
  return data;
};

/**
 * @desc Helper function to aggregate daily presentee count
 * @param {String} className - Class name
 * @param {String} div - Division
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} - Array of objects with date and total presentee count
 */
const aggregateDailyPresentee = async (className,div,startDate,endDate) => {
  const result = await ClassAttendance.aggregate([
    {
      $match: {
        class: className,
        div: div,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    { $unwind: "$attendance" },
    {
      $match: {
        "attendance.status": "Present"
      }
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          }
        },
        total: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        total: 1
      }
    },
    { $sort: { date: 1 } }
  ]);

  // Format: { date: 'Jan 1', total: 43 }
  const formatted = result.map(item => {
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    return { date: formattedDate, total: item.total };
  });

  return formatted;
};



/**
 * @desc Get all dashboard data for a class
 * @route GET /api/v1/attendance/dashboard
 * @access Private (Teacher)
 */
export const getDashboardData = asyncHandler(async (req, res) => {
    const { className, div } = req.body;

    if (!className?.trim() || !div?.trim()) {
        throw new ApiError(400, "Class and division are required");
    }
  
    const [
        topAttendees,
        genderStats,
        weeklyAbsenteeCount,
        divisionPresenteePercentage,
        dailyTotalPresentee
    ] = await Promise.all([
        getTopAttendees(className, div),
        getGenderDistribution(className, div),
        getWeeklyAbsenteeCount(className, div),
        getDivisionWisePresenteePercentage(className),
        getDailyPresenteeForClassDiv(className,div)
    ]);

    res.status(200).json(new ApiResponse(
        200,
        {
            topAttendees,
            genderStats,
            weeklyAbsenteeCount,
            divisionPresenteePercentage,
            dailyTotalPresentee
        },
        "Dashboard data fetched successfully"
    ));
});