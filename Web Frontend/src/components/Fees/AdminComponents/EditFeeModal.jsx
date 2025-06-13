import React, { useState } from "react";
import toast from "react-hot-toast";
import { formatToYYYYMM_D } from "@/utils/dateUtils";

const EditFeeModal = ({
  onClose,
  onSubmit,
  feeData,
  loadingMessage = "Updating fee...",
  successMessage = "Fee updated successfully!",
  errorMessage = "",
}) => {
  const [amount, setAmount] = useState(feeData.amount);
  const [dueDate, setDueDate] = useState(
  feeData.dueDate ? formatToYYYYMM_D(feeData.dueDate) : "");
  const [discount, setDiscount] = useState(feeData.discount || 0);
  const [editAll, setEditAll] = useState(false);
  console.log(feeData);

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!amount || !dueDate) {
        toast.error("Please fill all required fields.");
        return;
      }
    //   To Do: Add backend request

      const payload = {
        id: feeData._id,
        feeType: feeData.feeType,
        title: feeData.title,
        className: feeData.className,
        amount: parseFloat(amount),
        dueDate: formatToYYYYMM_D(dueDate),
        discount: parseFloat(discount),
        editAllClasses: editAll,
      };

      onSubmit(payload); // pass this to parent handler to update state
      onClose();         // close modal after submit
    };


  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Edit Fee</h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={feeData.title}
            disabled
            className="w-full cursor-not-allowed"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Fee Type</label>
          <input
            type="text"
            value={feeData.feeType}
            disabled
            className="w-full cursor-not-allowed"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center mb-3 gap-2">
          <input
            type="checkbox"
            checked={editAll}
            onChange={(e) => setEditAll(e.target.checked)}
            id="editAll"
          />
          <label htmlFor="editAll" className="font-medium">Apply changes to all classes</label>
        </div>

        {!editAll && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">Class Name</label>
            <input
              type="text"
              value={feeData.className}
              disabled
              className="w-full cursor-not-allowed"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFeeModal;
