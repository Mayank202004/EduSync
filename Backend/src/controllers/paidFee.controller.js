import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { StudentFeeStatus } from '../models/paidFee.model.js';
import { FeeItem, FeeStructure } from '../models/feeStructure.model.js';
import { getSettingValue } from './setting.controller.js'; 
import ejs from 'ejs';

/**
 * @desc Mark fee as paid
 * @route POST /api/v1/fee/pay
 * @access Private (Student)
 */
const markFeeAsPaid = asyncHandler(async (req, res) => {
  const studentId = req.student._id;
  const className = req.student.class;
  const { feeType, structureId, transactionId, mode, amount} = req.body;

  if (!feeType?.trim() || !structureId?.trim() || !transactionId?.trim() || !mode?.trim() || !amount?.trim()) {
    throw new ApiError(400, "Missing required payment fields");
  }

  if (!studentId?.toString().trim() || !className?.toString().trim()) {
    throw new ApiError(400, "Student or class not found");
  }

  // Verify feeType and structureId are valid in FeeStructure
  const feeStructure = await FeeStructure.findOne({ class: className, schoolId: req.school?._id });
  if (!feeStructure) throw new ApiError(404, "Fee structure not found");

  const feeGroup = feeStructure.fee.find(group => group.feeType === feeType);
  if (!feeGroup || !feeGroup.structure.some(item => item._id.toString() === structureId.toString())) {
    throw new ApiError(400, "Invalid structureId or feeType");
  }

  const structureItem = await FeeItem.findById(structureId);
  if (!structureItem) throw new ApiError(404, "Fee item not found");
  if(number(structureItem.amount) !== number(amount)) throw new ApiError(400, "Invalid amount");

  // Find or create student's fee status
  let studentFeeStatus = await StudentFeeStatus.findOne({ student: studentId });
  if (!studentFeeStatus) {
    studentFeeStatus = await StudentFeeStatus.create({
      student: studentId,
      paidFees: [],
      schoolId: req.school?._id
    });
  }

  const paymentEntry = {
    structureId: structureId,
    paidOn: new Date(),
    transactionId,
    mode,
    amount
  };

  const groupIndex = studentFeeStatus.paidFees.findIndex(group => group.feeType === feeType);

  if (groupIndex === -1) {
    // Create new group with payment
    studentFeeStatus.paidFees.push({
      feeType,
      payments: [paymentEntry],
    });
  } else {
    // Modify using array index — safe and tracked
    const alreadyPaid = studentFeeStatus.paidFees[groupIndex].payments.some(
  p => p.structureId.toString() === structureId.toString()
);
    if (alreadyPaid) throw new ApiError(409, "Fee is already paid");

    studentFeeStatus.paidFees[groupIndex].payments.push(paymentEntry);
  }

  await studentFeeStatus.save();

  return res.status(200).json(new ApiResponse(200, studentFeeStatus, "Fee marked as paid successfully"));
});


/**
 * @desc Get fee status for a student
 * @route GET /api/v1/fee/myfees
 * @access Private (Student)
 */
const getStudentFeeStatus = asyncHandler(async (req, res) => {
  const studentId = req.student._id;
  const className = req.student.class;
  if (!studentId || !className || !studentId?.toString().trim() || !className?.toString().trim()) {
    throw new ApiError(400, "Student or class not found");
  }

  // Fetch fee structure for the given class
  const feeStructure = await FeeStructure.findOne({ class: className, schoolId: req.school?._id }).populate('fee.structure');
  if (!feeStructure) {
    throw new ApiError(404, "Fee structure not found for this class");
  }

  // Fetch student's paid fees and populate structureId with only title and amount
  const studentFeeStatus = await StudentFeeStatus.findOne({ student: studentId })
    .populate({
      path: 'paidFees.payments.structureId',
      select: 'title amount',
    });

  const paidMap = {
    "Tuition Fee": new Set(),
    "Transport Fee": new Set(),
    "Other Fee": new Set(),
  };

  const paid = {
    academic: [],
    transport: [],
    other: [],
  };

  const pending = {
    academic: [],
    transport: [],
    other: [],
  };

  // Build the paidMap and paid response
  let skipTuitionFee = false;
  let skipFullYearTuitionFee = false;


  if (studentFeeStatus) {
    for (const group of studentFeeStatus.paidFees) {
      const feeType = group.feeType;
    
      for (const payment of group.payments) {
        const structure = payment.structureId;
        const idStr = structure?._id?.toString();
        if (!idStr) continue;
      
        // Track paid structure IDs
        paidMap[feeType].add(idStr);
      
        // Check if Tuition Fee full-year discount is already paid
        if (feeType === "Tuition Fee") {
          if (structure.title === "Full Year Fees with Discount") {
            skipTuitionFee = true; // If full-year is paid, skip all term fees
          } else {
            // If even a term fee is paid, hide full-year from pending
            skipFullYearTuitionFee = true;
          }
        }

      
        const paidEntry = {
          structureId: idStr,
          title: structure.title,
          amount: structure.amount,
          paidOn: payment.paidOn,
          transactionId: payment.transactionId,
          mode: payment.mode,
        };
      
        if (feeType === "Tuition Fee") paid.academic.push(paidEntry);
        else if (feeType === "Transport Fee") paid.transport.push(paidEntry);
        else paid.other.push(paidEntry);
      }
    }
  }
  
  // Build pending response
  for (const group of feeStructure.fee) {
    const feeType = group.feeType;
  
    for (const item of group.structure) {
      const idStr = item._id?.toString();
      // Skip all Tuition Fee pending items if full-year is paid
      if (feeType === "Tuition Fee") {
        if (skipTuitionFee) continue; // Full year paid — skip all term-wise fees
        if (skipFullYearTuitionFee && item.title === "Full Year Fees with Discount") continue; // Some term paid — skip full-year
      }


    
      if (!paidMap[feeType].has(idStr)) {
        const pendingEntry = {
          _id: item._id,
          title: item.title,
          dueDate: item.dueDate,
          amount: item.amount,
          discount: item.discount,
          compulsory: item.compulsory,
        };
      
        if (feeType === "Tuition Fee") pending.academic.push(pendingEntry);
        else if (feeType === "Transport Fee" && req.student.schoolTransport) pending.transport.push(pendingEntry);
        else pending.other.push(pendingEntry);
      }
    }
  }
  return res.status(200).json(new ApiResponse(200,{ paid, pending },"Fee status fetched successfully"));
});


/**
 * @desc Render fee receipt
 * @route GET /api/v1/fee/receipt
 * @access Private (Student)
 */
const renderFeeReceipt = asyncHandler(async (req, res) => {
  const { transactionId, title, feeId, receiptNo, feeType } = req.body;
  const templatePath = 'src/templates/fee.template.ejs';

  // Validate required fields
  if (!transactionId || !title || !feeId || !receiptNo || !feeType) {
    throw new ApiError(400, "Missing required fields");
  }

  // Fetch student's paid fee status
  const studentFeeStatus = await StudentFeeStatus.findOne({ student: req.student._id });

  if (!studentFeeStatus) {
    throw new ApiError(403, "No fee record found for this student");
  }

  // Look only in the specific feeType group
  const feeGroup = studentFeeStatus.paidFees.find(group => group.feeType === feeType);
  if (!feeGroup) {
    throw new ApiError(403, "No payments found for this fee type");
  }

  const payment = feeGroup.payments.find(
    p => p.transactionId === transactionId && p.structureId.toString() === feeId
  );

  if (!payment) {
    throw new ApiError(403, "Unauthorized: This payment does not belong to you");
  }
  academicYear = await getSettingValue("academicYear", req.school?._id);

  // Prepare data
  const data = { // To Do add school name
    academicYear: academicYear ?? "20xx-20xx",
    name: req.user.fullName,
    standard: req.student.class + "-" + req.student.div,
    studentId: req.student._id,
    receiptNo,
    date: formatDate(payment.paidOn),
    stopName: req.student?.stopName ?? "",
    feeItems: [
      { title: feeType, amount: payment.amount }
    ],
    totalAmount: payment.amount,
    paymentMode: payment.mode,
    title,
    feeId,
    transactionId: payment.transactionId,
    transactionDate: formatDate(payment.paidOn),
    feeType
  };

  try {
    const html = await ejs.renderFile(templatePath, data);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    throw new ApiError(err.status, err.message);
  }
});


/**
 * @desc Helper function to delete all StudentFeeStatus records
 */
const deleteAllStudentFeeStatuses = async (schoolId) => {
  try {
    await StudentFeeStatus.deleteMany({schoolId: schoolId});
  } catch (error) {
    throw error;
  }
};

// To DO : Move to utils or remove if redundant with utils
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  const day = istDate.getDate().toString().padStart(2, '0');
  const month = (istDate.getMonth() + 1).toString().padStart(2, '0');
  const year = istDate.getFullYear();

  return `${day}-${month}-${year}`;
};


export {getStudentFeeStatus,markFeeAsPaid,renderFeeReceipt, deleteAllStudentFeeStatuses};