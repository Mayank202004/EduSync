import mongoose,{Schema} from "mongoose";

const feeStructureSchema = new Schema({
  class: {
    type: String,
    required: true
  },
  fee: [{
    feeType: {
      type: String,
      enum: ['Tuition Fee', 'Transport Fee', 'Other Fee'],
      required: true
    },
    structure: [{ type: Schema.Types.ObjectId, ref: 'FeeItem' }]
}]
});


const feeItemSchema = new Schema({
  title: { type: String, required: true },
  dueDate: Date,
  compulsory: { type: Boolean, default: true },
  amount: { type: Number, required: true },
  discount: { type: Number, default: 0 }
});

export const FeeItem = mongoose.model('FeeItem', feeItemSchema);
export const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
