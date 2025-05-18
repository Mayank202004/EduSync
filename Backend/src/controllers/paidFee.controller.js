import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { StudentFeeStatus } from '../models/paidFee.model.js';
import { FeeStructure } from '../models/feeStructure.model.js';
import mongoose from 'mongoose';


/**
 * @desc Mark fee as paid
 * @route POST /api/v1/fee/pay
 * @access Private (Student)
 */
const markFeeAsPaid = asyncHandler(async (req, res) => {
  const studentId = req.student._id;
  const className = req.student.class;
  const { feeType, structureId, transactionId, mode } = req.body;

  if (!feeType?.trim() || !structureId?.trim() || !transactionId?.trim() || !mode?.trim()) {
    throw new ApiError(400, "Missing required payment fields");
  }

  if (!studentId?.toString().trim() || !className?.toString().trim()) {
    throw new ApiError(400, "Student or class not found");
  }

  // Verify feeType and structureId are valid in FeeStructure
  const feeStructure = await FeeStructure.findOne({ class: className });
  if (!feeStructure) throw new ApiError(404, "Fee structure not found");

  const feeGroup = feeStructure.fee.find(group => group.feeType === feeType);
  if (!feeGroup || !feeGroup.structure.some(item => item._id.toString() === structureId.toString())) {
    throw new ApiError(400, "Invalid structureId or feeType");
  }

  // Find or create student's fee status
  let studentFeeStatus = await StudentFeeStatus.findOne({ student: studentId });
  if (!studentFeeStatus) {
    studentFeeStatus = await StudentFeeStatus.create({
      student: studentId,
      paidFees: [],
    });
  }

  const paymentEntry = {
    structureId: structureId,
    paidOn: new Date(),
    transactionId,
    mode,
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
  const feeStructure = await FeeStructure.findOne({ class: className }).populate('fee.structure');
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
        if (feeType === "Tuition Fee" && structure.title === "Full Year Fees with Discount") {
          skipTuitionFee = true;
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
      if (feeType === "Tuition Fee" && skipTuitionFee) continue;
    
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

export {getStudentFeeStatus,markFeeAsPaid};