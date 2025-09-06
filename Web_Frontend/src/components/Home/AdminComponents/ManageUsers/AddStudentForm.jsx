import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Modal from "@/components/Modals/Modal";
import { formatDate } from "@/utils/dateUtils";
import { registerStudentBySuperAdmin } from "@/services/dashboardService";
import toast from "react-hot-toast";

const AddStudentForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    className: "",
    div: "",
    gender: "",
    dob: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    try{
      const response = await toast.promise(
        registerStudentBySuperAdmin(formData),
        {
          loading: "Registering Student...",
          success: "Student registered successfully",
          error: "", // handled by interceptor
        }
      )
    } catch(err){
      // Handled by axios interceptor
    }
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={18} /> Back to Manage Users
      </button>

      <div className="bg-white dark:bg-customDarkFg rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Student</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="className"
            placeholder="Class"
            value={formData.className || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="div"
            placeholder="Division"
            value={formData.div || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Select Gender (Optional)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div className="flex flex-col">
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <small className="text-gray-500">Date of Birth (Optional)</small>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <Modal
          title="Confirm Student Details"
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4 text-base sm:text-lg">
            <p>
              <strong className="font-semibold text-gray-800 dark:text-gray-200">
                Full Name:
              </strong>{" "}
              {formData.fullName}
            </p>
            <p>
              <strong className="font-semibold text-gray-800 dark:text-gray-200">
                Email:
              </strong>{" "}
              {formData.email}
            </p>
            <p>
              <strong className="font-semibold text-gray-800 dark:text-gray-200">
                Username:
              </strong>{" "}
              {formData.username}
            </p>
            <p>
              <strong className="font-semibold text-gray-800 dark:text-gray-200">
                Class:
              </strong>{" "}
              {formData.className}
            </p>
            <p>
              <strong className="font-semibold text-gray-800 dark:text-gray-200">
                Division:
              </strong>{" "}
              {formData.div}
            </p>
            {formData.gender && (
              <p>
                <strong className="font-semibold text-gray-800 dark:text-gray-200">
                  Gender:
                </strong>{" "}
                {formData.gender}
              </p>
            )}
            {formData.dob && (
              <p>
                <strong className="font-semibold text-gray-800 dark:text-gray-200">
                  Date of Birth:
                </strong>{" "}
                {formatDate(formData.dob)}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowModal(false)}
              className="px-5 py-2 text-base border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm & Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddStudentForm;
