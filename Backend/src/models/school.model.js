import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  logo: {
    type: String,
  },
  address: {
    type: String,
  },
  classOrder: {
    type: [String],
    required: true,
    default: ["Jr. KG", "Sr. KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], 
  },
},{timestamps: true}
);

const School = mongoose.model('School', schoolSchema);

export default School;
