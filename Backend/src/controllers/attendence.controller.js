import { ClassAttendance } from "../models/attendance.model.js";
import { Student } from "../models/student.model.js"; 
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ClassStructure } from "../models/classStructure.model.js";
import ExcelJS from "exceljs";
import moment from "moment-timezone";

/**
 * @desc Mark attendence of a class
 * @route POST /api/attendance/mark
 * @access Private (Teacher)
 */
export const markAttendance = asyncHandler(async (req, res) => {
    try {
        const { date, className:classNameFromBody, div:divFromBody, absentStudents, permittedLeaveStudents} = req.body;

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
        const alreadyExists = await ClassAttendance.findOne({ date: parsedDate, class: className, div, schoolId: req.school?._id});
        if (alreadyExists) {
            return res.status(400).json({ message: "Attendance already marked for this class on this date." });
        }

        // Get all students of that class/div
        const allStudents = await Student.find({ class: className, div, schoolId: req.school?._id}).select("_id");

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
            schoolId: req.school?._id,
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
    const { date, className, div } = req.body;

     if (!date || !className || !div) {
        throw new ApiError(400, "Date, class, and div are required");
    }

    const attendance = await ClassAttendance.findOne({ date, class: className, div, schoolId: req.school?._id})
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
  let totalCount = 0;
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  attendance.attendance.forEach(entry => {
    totalCount++;
    if (entry.status === "Present") presentCount++;
    else if (entry.status === "Absent") absentCount++;
    else if (entry.status === "Permitted Leave") leaveCount++;
  });

  res.status(200).json(new ApiResponse(200, {
    attendance: attendance.attendance,
    totals: {
      total: totalCount,
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
        schoolId: req.school?._id,
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

    const filter = { class: className, div, schoolId: req.school?._id };

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
    const { month, year, className, div } = req.body;
    const targetYear = year || new Date().getFullYear();

    const query = {};
    if (className) query.class = className;
    if (div) query.div = div;
    query.schoolId = req.school?._id

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

    const students = await Student.find(query).populate("userId", "fullName");
    const studentNames = students
        .map(s => s.userId.fullName)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));


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
    { $match: { class: className, div: div, schoolId: req.school?._id } },
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
 * @desc Helper function to get gender distribution of entre school / of a class / of a specific div of a class
 * @param {String} className - Class name (Optional)
 * @param {String} div - Division (Optional)
 * @returns {Array} - Array of objects containing gender with their counts
 */
const getGenderDistribution = async (className = null, div = null, schoolId) => {
    const matchStage = {};

    if (className) matchStage.class = className;
    if (div) matchStage.div = div;
    matchStage.schoolId = schoolId;

    const pipeline = [];

    // Step 1: class/div filter
    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    // Step 2: Join with the User collection
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    });

    // Step 3: Unwind user array
    pipeline.push({ $unwind: "$user" });

    // Step 4: Filter only verified users
    pipeline.push({
        $match: {
            "user.verified": true
        }
    });

    // Step 5: Group by gender
    pipeline.push(
        {
            $group: {
                _id: { $toLower: "$gender" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                gender: "$_id",
                count: 1,
                _id: 0
            }
        }
    );

    try {
        const distribution = await Student.aggregate(pipeline);
        return distribution;
    } catch (error) {
        throw error;
    }
};



/**
 * @desc Helper function to get top  6 attendees of entire school/ a class/ a div of a class
 * @param {String} className - Class name (Optional)
 * @param {String} div - Division (Optional)
 * @returns {Object} - Object containing total working days and top student attendance summary
 */
const getTopAttendees = async (className = null, div = null, schoolId) => {
    const matchStage = {};
    if (className) matchStage.class = className;
    if (div) matchStage.div = div;
    matchStage.schoolId = schoolId;

    const pipeline = [];

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }
    pipeline.push({
        $facet: {
            // Total unique working days
            totalDays: [
                { $group: { _id: "$date" } },
                { $count: "total" }
            ],

            // Attendance summary for top students
            studentAttendance: [
                { $unwind: "$attendance" },
                {
                    $match: {
                        "attendance.status": "Present",
                        ...(className && { class: className }),
                        ...(div && { div: div })
                    }
                },
                {
                    $group: {
                        _id: "$attendance.studentId",
                        daysPresent: { $sum: 1 }
                    }
                },
                { $sort: { daysPresent: -1 } },
                { $limit: 6 },
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
                        from: "users",
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
    });

    try {
        const results = await ClassAttendance.aggregate(pipeline);
        const totalWorkingDays = results[0]?.totalDays[0]?.total || 0;
        const studentAttendance = results[0]?.studentAttendance || [];

        return {
            totalWorkingDays,
            studentAttendance
        };
    } catch (error) {
        console.error("Error in getTopAttendees:", error);
        throw error;
    }
};




/**
 * @desc Get presentee percentage per division for a class (current or fallback to previous month)
 * @param {String} className - The class name (e.g., "6", "7", etc.)
 * @returns {Object} - { month: "May, 2025", data: [{ div: "A", percentage: 87.5 }, ...] }
 */
const getDivisionWisePresenteePercentage = async (className, schoolId) => {
    const now = moment().tz("Asia/Kolkata");

    const getMonthRange = (mDate) => {
        const start = mDate.clone().startOf("month").toDate();
        const end = mDate.clone().endOf("month").toDate();
        return { start, end };
    };

    // Try current month first
    let { start: startOfMonth, end: endOfMonth } = getMonthRange(now);
    let data = await aggregateDivisionPresentee(className, startOfMonth, endOfMonth, schoolId);

    let usedDate = now;

    // Fallback to previous month if current has no data
    if (data.length === 0) {
        const previousMonth = now.clone().subtract(1, "month");
        const { start, end } = getMonthRange(previousMonth);
        data = await aggregateDivisionPresentee(className, start, end, schoolId);
        usedDate = previousMonth;
    }

    const formattedMonth = usedDate.format("MMMM, YYYY"); // e.g., "May, 2025"

    return {
        month: formattedMonth,
        data
    };
};

/**
 * @desc Helper function to fetch classwise present percentage
 * @returns {Object} - { month: "May, 2025", data: [{ div: "A", percentage: 87.5 }, ...] } 
 */
const getClassWisePresenteePercentage = async (schoolId) => {
    const now = moment().tz("Asia/Kolkata");

    const getMonthRange = (mDate) => {
        const start = mDate.clone().startOf("month").toDate();
        const end = mDate.clone().endOf("month").toDate();
        return { start, end };
    };
    // Try current month first
    let { start: startOfMonth, end: endOfMonth } = getMonthRange(now);
    let data = await aggregateClassPresentee(startOfMonth, endOfMonth, schoolId);

    let usedDate = now;

    // Fallback to previous month if current has no data
    if (data.length === 0) {
        const previousMonth = now.clone().subtract(1, "month");
        const { start, end } = getMonthRange(previousMonth);
        data = await aggregateClassPresentee(start, end,schoolId);
        usedDate = previousMonth;
    }
    const formattedMonth = usedDate.format("MMMM, YYYY"); // e.g., "May, 2025"
    
     if (data.length === 0) {
        return {
            month: formattedMonth,
            averagePercentage: 0,
            data: []
        };
    }

    const totalPercentage = data.reduce((sum, item) => sum + item. presenteePercentage, 0);
    const averagePercentage = parseFloat((totalPercentage / data.length).toFixed(2));


    return {
        month: formattedMonth,
        averagePercentage,
        data
    };
};


/**
 * @desc Helper aggregation function to calculate presentee percentage (For divisionwise)
 * @param {String} className - Class Name
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} - Array of the objects with division and percentage
 */
async function aggregateDivisionPresentee(className, startDate, endDate,schoolId) {
    return await ClassAttendance.aggregate([
        {
            $match: {
                schoolId: schoolId,
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
}


/**
 * @desc Helper aggregation function to calculate presentee percentage (For classwise)
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} - Array of the objects with division and percentage
 */
const aggregateClassPresentee = async (startDate, endDate,schoolId) => {
    return await ClassAttendance.aggregate([
        {
            $match: {
                schoolId: schoolId,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $unwind: "$attendance"
        },
        {
            $match: {
                "attendance.status": "Present"
            }
        },
        {
            $group: {
                _id: {
                    class: "$class",
                    date: "$date"
                },
                presentCount: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.class",
                totalDays: { $sum: 1 },
                totalPresentees: { $sum: "$presentCount" }
            }
        },
        {
            $lookup: {
                from: "students",
                let: { classVal: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$class", "$$classVal"] } } },
                    { $count: "totalStudents" }
                ],
                as: "studentInfo"
            }
        },
        { $unwind: "$studentInfo" },
        {
            $project: {
                class: "$_id",
                presenteePercentage: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$totalPresentees",
                              { $multiply: ["$studentInfo.totalStudents", "$totalDays"] }
                            ]
                          },
                          100
                        ]
                      },
                      2
                    ]
                },
                _id: 0
            }
        }
    ]);
};


/**
 * @desc Helper function to get weekly absentee count
 * @param {String} className - Class name (Optional)
 * @param {String} div - Division (Optional)
 * @returns {Array} - Array of objects with day and absent count
 */
const getWeeklyAbsenteeCount = async (className = null, div = null,schoolId) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const matchConditions = {
        schoolId: schoolId,
        date: { $gte: startOfWeek, $lte: now }
    };

    if (className) matchConditions.class = className;
    if (div) matchConditions.div = div;

    const results = await ClassAttendance.aggregate([
        { $match: matchConditions },
        { $unwind: "$attendance" },
        { $match: { "attendance.status": "Absent" } },
        {
            $group: {
                _id: {
                    $dayOfWeek: {
                        $add: ["$date", 19800000] // Shift to IST (+5.5 hours)
                    }
                },
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
        if (item._id === 1) continue; // Sunday (SKIP holiday)
        const day = dayMap[item._id];
        const entry = weekData.find(d => d.day === day);
        if (entry) entry.absent = item.absent;
    }

    return weekData;
};


/**
 * @desc Helper function to fetch daily present count for a month
 * @param {String} className - Class Name (optional)
 * @param {String} div - Division (Optional)
 * @returns {Object} - Array of date and count of present student and total number of students
 */
const getDailyPresentee = async (className = null, div = null, schoolId) => {
  const now = new Date();

  const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  };

  const { start: startOfMonth, end: endOfMonth } = getMonthRange(now);

  let data = await aggregateDailyPresentee(className, div, startOfMonth, endOfMonth, schoolId);

  // If no attendance in current month, fallback to previous month
  if (data.length === 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const { start, end } = getMonthRange(previousMonth);
    data = await aggregateDailyPresentee(className, div, start, end, schoolId);
  }

  // Total students match condition
  const studentMatch = {schoolId: schoolId};
  if (className) studentMatch.class = className;
  if (div) studentMatch.div = div;

  const totalStudents = await Student.countDocuments(studentMatch);

  return {
    totalStudents,
    data,
  };
};


/**
 * @desc Helper function to aggregate daily presentee count
 * @param {String} className - Class name
 * @param {String} div - Division
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} - Array of objects with date and total presentee count
 */
const aggregateDailyPresentee = async (className, div, startDate, endDate, schoolId) => {
  const matchConditions = {
    date: { $gte: startDate, $lte: endDate },
    schoolId: schoolId
  };
  if (className) matchConditions.class = className;
  if (div) matchConditions.div = div;

  const result = await ClassAttendance.aggregate([
    { $match: matchConditions },
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
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $add: ["$date", 19800000] } // Convert UTC to IST
            }
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
 * @desc Get all Teacher dashboard data for a class
 * @route GET /api/v1/attendance/dashboard
 * @access Private (Teacher)
 */
export const getTeacherDashboardData = asyncHandler(async (req, res) => {
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
        getTopAttendees(className, div,req.school?._id),
        getGenderDistribution(className, div,req.school?._id),
        getWeeklyAbsenteeCount(className, div,req.school?._id),
        getDivisionWisePresenteePercentage(className,req.school?._id),
        getDailyPresentee(className,div,req.school?._id)
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



/**
 * @desc Get all Super admin (Top level) dashboard data
 * @route GET /api/v1/attendance/admin-dashboard
 * @access Private (Super Admin))
 */
export const getTopLevelAdminDashboardData = asyncHandler(async (req, res) => {

    const [
        topAttendees,
        genderStats,
        weeklyAbsenteeCount,
        PresenteePercentage,
        dailyTotalPresentee,
        classStructure,
        totalStudents
    ] = await Promise.all([
        getTopAttendees(req.school?._id),
        getGenderDistribution(req.school?._id),
        getWeeklyAbsenteeCount(req.school?._id),
        getClassWisePresenteePercentage(req.school?._id),
        getDailyPresentee(req.school?._id),
        ClassStructure.find({schoolId: req.school?._id}).sort({ className: 1 }).select("-createdAt -updatedAt -__v -_id"),
        getVerifiedStudentCount(req.school?._id)
    ]);

    res.status(200).json(new ApiResponse(
        200,
        {
            topAttendees,
            genderStats,
            weeklyAbsenteeCount,
            PresenteePercentage,
            dailyTotalPresentee,
            classStructure,
            totalStudents
        },
        "Dashboard data fetched successfully"
    ));
});

/**
 * @desc Get all Super admin (Class level) dashboard data
 * @route GET /api/v1/attendance/admin-class-dashboard
 * @access Private (Super Admin)
 */
export const getClassLevelAdminDashboardData = asyncHandler(async (req, res) => {

    const className = req.params.className;
    if(!className?.trim()){
        throw new ApiError(400,"ClassName is required");
    }
    const [
        topAttendees,
        genderStats,
        weeklyAbsenteeCount,
        divWisePresenteePercentage,
        dailyTotalPresentee,
        classStructure,
        totalStudents
    ] = await Promise.all([
        getTopAttendees(className,req.school?._id),
        getGenderDistribution(className,req.school?._id),
        getWeeklyAbsenteeCount(className,req.school?._id),
        getDivisionWisePresenteePercentage(className,req.school?._id),
        getDailyPresentee(className,req.school?._id),
        ClassStructure.find({className,schoolId: req.school?._id}).sort({ className: 1 }).select("-createdAt -updatedAt -__v -_id"),
        Student.countDocuments({ class: className,schoolId: req.school?._id })
    ]);

    res.status(200).json(new ApiResponse(
        200,
        {
            topAttendees,
            genderStats,
            weeklyAbsenteeCount,
            divWisePresenteePercentage,
            dailyTotalPresentee,
            classStructure,
            totalStudents
        },
        "Dashboard data fetched successfully"
    ));
});

/**
 * @desc Helper function get total verified student count
 * @returns {Number} - Number of verified students
 */
const getVerifiedStudentCount = async (schoolId) => {
  try {
    const result = await Student.aggregate([
      {
        $lookup: {
          from: "users",   
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $match: {
            "user.schoolId": schoolId,
            "user.verified": true
        }
      },
      {
        $count: "total"
      }
    ]);

    return result[0]?.total || 0;
  } catch (error) {
    throw error;
  }
};


/**
 * @desc Helper to delete all attendance records
 */
export const deleteAllAttendance = async (schoolId) => {
  try {
    ClassAttendance.deleteMany({schoolId});
  } catch (error) {
    throw error;
  }
};

/**
 * @desc Helper function to return attendance count for a month for a student
 */
export const getAttendanceForTheMonth = async (studentId,className,div,schoolId) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await ClassAttendance.aggregate([
        {
            $match: {
                schoolId,
                class: className,
                div,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        { $unwind: "$attendance" },
        {
            $match: {
                "attendance.studentId": studentId
            }
        },
        {
            $group: {
                _id: "$attendance.status",
                count: { $sum: 1 }
            }
        }
    ]);
    const counts = result.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, { Present: 0, Absent: 0 }); 

    return counts;
};

/**
 * @desc Returns attendance percentage over all months for a student
 * @returns Object like: { "2025-03": 83.33, "2025-04": 100 }
 */
export const getAttendancePercentageByMonth = async (studentId,className,div,schoolId) => {
    const result = await ClassAttendance.aggregate([
        {
            $match: {
                schoolId,
                class: className,
                div
            }
        },
        { $unwind: "$attendance" },
        {
            $match: {
                "attendance.studentId": studentId
            }
        },
        {
            $addFields: {
                month: {
                    $dateToString: { format: "%Y-%m", date: "$date" }
                }
            }
        },
        {
            $group: {
                _id: { month: "$month", status: "$attendance.status" },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.month",
                counts: {
                    $push: {
                        status: "$_id.status",
                        count: "$count"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id",
                percentage: {
                    $let: {
                        vars: {
                            presentCount: {
                                $sum: {
                                    $map: {
                                        input: "$counts",
                                        as: "c",
                                        in: {
                                            $cond: [
                                                { $eq: ["$$c.status", "Present"] },
                                                "$$c.count",
                                                0
                                            ]
                                        }
                                    }
                                }
                            },
                            totalCount: {
                                $sum: "$counts.count"
                            }
                        },
                        in: {
                            $cond: [
                                { $eq: ["$$totalCount", 0] },
                                0,
                                {
                                    $round: [
                                        {
                                            $multiply: [
                                                { $divide: ["$$presentCount", "$$totalCount"] },
                                                100
                                            ]
                                        },
                                        2
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]);

    // Convert to { "2025-03": 83.33, "2025-04": 100, ... }
    const attendanceByMonth = {};
    for (const doc of result) {
        attendanceByMonth[doc.month] = doc.percentage;
    }

    return attendanceByMonth;
};
