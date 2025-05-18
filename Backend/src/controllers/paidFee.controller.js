import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { StudentFeeStatus } from '../models/paidFee.model.js';
import { FeeStructure } from '../models/feeStructure.model.js';
import mongoose from 'mongoose';

const markFeeAsPaid = asyncHandler(async (req, res) => {
  const { studentId, className, feeType, structureId, transactionId, mode } = req.body;

  // 🔐 Basic validation
  if (!studentId || !className || !feeType || !structureId || !mode) {
    throw new ApiError(400, 'All fields are required');
  }

  // ⛔ Invalid fee type
  const validTypes = ['Tuition Fee', 'Transport Fee', 'Other Fee'];
  if (!validTypes.includes(feeType)) {
    throw new ApiError(400, 'Invalid fee type');
  }

  // 🧾 Check if structure ID is valid
  const feeStructure = await FeeStructure.findOne({ class: className });
  if (!feeStructure) throw new ApiError(404, 'Fee structure not found');

  const feeBlock = feeStructure.fee.find(f => f.feeType === feeType);
  if (!feeBlock) throw new ApiError(404, 'Fee type not found in structure');

  const structureExists = feeBlock.structure.some(s => s._id.equals(structureId));
  if (!structureExists) throw new ApiError(404, 'Fee structure ID not found');

  // ✅ Check if student entry exists
  let studentFee = await StudentFeeStatus.findOne({ student: studentId });

  if (!studentFee) {
    // 🆕 Create new document
    studentFee = await StudentFeeStatus.create({
      student: studentId,
      class: className,
      paidFees: [{
        feeType,
        payments: [{
          structureId,
          transactionId,
          mode,
        }]
      }]
    });
  } else {
    // ✅ Check if feeType group exists
    let feeGroup = studentFee.paidFees.find(f => f.feeType === feeType);

    if (!feeGroup) {
      // ➕ Add new feeType entry
      studentFee.paidFees.push({
        feeType,
        payments: [{
          structureId,
          transactionId,
          mode
        }]
      });
    } else {
      // 🔁 Check for duplicate payment
      const alreadyPaid = feeGroup.payments.some(p => p.structureId.equals(structureId));
      if (alreadyPaid) throw new ApiError(409, 'This fee is already marked as paid');

      // ➕ Add payment to existing group
      feeGroup.payments.push({
        structureId,
        transactionId,
        mode
      });
    }

    await studentFee.save();
  }

  return res.status(200).json(new ApiResponse(null, 'Fee marked as paid successfully'));
});

const getStudentFeeStatus = asyncHandler(async (req, res) => {
  const studentId = req.student._id;
  const className = req.student.class;
  if (!studentId || !className || !studentId.toString().trim() || !className.toString().trim()) {
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
  if (studentFeeStatus) {
    for (const group of studentFeeStatus.paidFees) {
      const feeType = group.feeType;

      for (const payment of group.payments) {
        const idStr = payment.structureId?._id?.toString();
        if (!idStr) continue;

        paidMap[feeType].add(idStr);

        const paidEntry = {
          structureId: idStr,
          title: payment.structureId.title,
          amount: payment.structureId.amount,
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

export {getStudentFeeStatus};