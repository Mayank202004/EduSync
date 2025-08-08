import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["LOGIN", "PASSWORD_RESET", "EMAIL_VERIFICATION"],
    default: "LOGIN",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

//Index to auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model("Otp", otpSchema);
