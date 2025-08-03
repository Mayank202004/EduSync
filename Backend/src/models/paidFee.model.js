import mongoose, { Schema } from "mongoose";

const studentPaidFeeSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
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
            ref: 'FeeItem',
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
          amount : {
            type: Number,
            required: true,
          }
        }
      ]
    }
  ],
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});


export const StudentFeeStatus = mongoose.model('StudentFeeStatus', studentPaidFeeSchema);
