import React, { useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import toast from "react-hot-toast";
import { verifyStudent } from "@/services/dashboardService"; 


const VerifyStudentModal = ({
  student,
  onClose = () => {},
  onVerify = () => {},
  onSubmit = () => {},
  loadingMessage = "Verifying...",
  successMessage = "Student verified successfully!",
  errorMessage = "",
}) => {
  const [classValue, setClassValue] = useState(student.class || "");
  const [division, setDivision] = useState("");

  const [containerRef] = useClickOutside(onClose);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!classValue.trim() || !division.trim()) {
      toast.error("Class and Division are required.");
      return;
    }

    try {
      const response = await toast.promise(
        onVerify(student._id, classValue, division),
        {
          loading: loadingMessage,
          success: successMessage,
          error: errorMessage,
        }
      );
      onSubmit();
    } catch (err) {
      // axios error handled by interceptor
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        ref={containerRef}
        onSubmit={handleVerify}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-3">Verify Student</h2>

        <div className="mb-4">
          <p><strong>Name:</strong> {student.userId?.fullName}</p>
          <p><strong>Email:</strong> {student.userId?.email}</p>
          <p><strong>Suggested Class:</strong> {student.class ?? "Not available"}</p>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Please confirm the class and assign a division before verification.
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Class</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter class"
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Division</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyStudentModal;
