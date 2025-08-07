import React, { useState, useEffect } from "react";
import { verifyOtpApi, resendOtpApi } from "@/services/authService";
import toast from "react-hot-toast";

const OtpInputCard = ({ otpData, onSuccess, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleSubmit = async () => {
    setVerifying(true);
    try {
      const code = otp.join("");
      const res = await verifyOtpApi({ token: otpData.tempToken, code });
      toast.success("OTP Verified");
      onSuccess(res.data);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtpApi({ email: otpData.email });
      toast.success("OTP resent");
      setTimer(60);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">Enter the 6-digit code sent to <b>{otpData.email}</b></p>
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            className="w-10 h-10 text-center text-xl border border-gray-300 rounded"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
          />
        ))}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={verifying}
        onClick={handleSubmit}
      >
        {verifying ? "Verifying..." : "Verify OTP"}
      </button>

      {timer > 0 ? (
        <p className="text-sm text-gray-500">Resend in {timer}s</p>
      ) : (
        <button
          onClick={handleResend}
          className="text-blue-500 text-sm hover:underline"
        >
          Resend OTP
        </button>
      )}
      <button onClick={onBack} className="text-sm mt-2 text-gray-600 hover:underline">
        Back to Login
      </button>
    </div>
  );
};

export default OtpInputCard;
