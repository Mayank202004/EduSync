import crypto from "crypto";
import { Otp } from "../models/otp.model.js";


export const sendOtpHelper = async (email, purpose = "LOGIN") => {
  // Delete any existing OTP for this email & purpose
  await Otp.deleteMany({ email, purpose });
  
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await Otp.create({ email, otp, purpose, expiresAt });

//   await sendMail({
//     to: email,
//     subject: `Your OTP for ${purpose}`,
//     text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//   });
console.log("otp : ",otp); // To Do : remove this and send mail to user
};
