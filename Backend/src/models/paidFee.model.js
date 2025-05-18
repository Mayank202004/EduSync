import mongoose, { Schema } from "mongoose";

const studentPaidFeeSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,
  },
  paidFees: [
    {
      feeType: {
        type: String,
        enum: ['Tuition Fee', 'Transport Fee', 'Other Fee'],
        required: true,
      },
      payments: [
        {
          structureId: {
            type: mongoose.Schema.Types.ObjectId, // _id from structure[]
            required: true,
          },
          paidOn: {
            type: Date,
            default: Date.now,
          },
          transactionId: String,
          mode: {
            type: String,
            enum: ['Cash', 'Online', 'UPI', 'Cheque'],
          },
        }
      ]
    }
  ]
});

export const StudentFeeStatus = mongoose.model('StudentFeeStatus', studentPaidFeeSchema);
