import mongoose, { Schema } from "mongoose";

const classStructureSchema = new Schema({
  className: {
    type: String,
    required: true,
    //enum: ["Jr. KG", "Sr. KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    //unique: true
  },
  divisions: {
    type: [String],
    default: []
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
}, {
  timestamps: true
});
classStructureSchema.index({ schoolId: 1, className: 1 }, { unique: true });


export const ClassStructure = mongoose.model("ClassStructure", classStructureSchema);
