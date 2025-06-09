import React, { useState } from "react";
import toast from "react-hot-toast";

const FEE_TYPES = ["Tuition Fee", "Transport Fee", "Other Fee"];

const AddFeeModal = ({
  onClose,
  onSubmit,
  onAdd,
  loadingMessage = "Adding fee...",
  successMessage = "Fee added successfully!",
  errorMessage = "Failed to add fee",
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [feeType, setFeeType] = useState(FEE_TYPES[0]);
  const [discount, setDiscount] = useState(0);
  const [compulsory, setCompulsory] = useState(false);
  const [addToAll, setAddToAll] = useState(false);
  const [className, setClassName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || !dueDate || (!addToAll && !className.trim())) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      title,
      amount: parseFloat(amount),
      dueDate,
      feeType,
      discount: parseFloat(discount),
      compulsory,
      className: addToAll ? null : className.trim(),
      addToAll,
    };

    try {
      const response = await toast.promise(onAdd(payload), {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      });

      onSubmit(response.data);
    } catch (err) {
      // Error is handled by toast.promise
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add New Fee</h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Term 1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 12000"
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
          <label className="block mb-1 font-medium">Fee Type</label>
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {FEE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 10"
          />
        </div>

        <div className="flex items-center mb-3 gap-2">
          <input
            type="checkbox"
            checked={compulsory}
            onChange={(e) => setCompulsory(e.target.checked)}
            id="compulsory"
          />
          <label htmlFor="compulsory" className="font-medium">Compulsory Fee</label>
        </div>

        <div className="flex items-center mb-3 gap-2">
          <input
            type="checkbox"
            checked={addToAll}
            onChange={(e) => setAddToAll(e.target.checked)}
            id="addToAll"
          />
          <label htmlFor="addToAll" className="font-medium">Add to All Classes</label>
        </div>

        {!addToAll && (
          <div className="mb-3">
            <label className="block mb-1 font-medium">Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. 1, 2A"
              required={!addToAll}
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Fee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFeeModal;
