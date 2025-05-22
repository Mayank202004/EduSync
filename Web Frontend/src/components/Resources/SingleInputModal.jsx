import React, { useState } from "react";
import toast from "react-hot-toast";

const SingleInputModal = ({ 
  title, 
  label,
  loadingMessage="Loading...",
  successMessage="Success!",
  errorMessage="", 
  placeholder, 
  onClose, 
  onSubmit, 
  onAdd 
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!value.trim()) {
      toast.error(`${label} cannot be empty`);
      return;
    }

    try {
      const response = await toast.promise(
        onAdd(value),
        {
          loading: loadingMessage,
          success: successMessage,
          error: errorMessage,
        }
      );
      onSubmit(response.data);
    } catch (err) {
      // handled by axios 
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">{label}</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            required
            type="text"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default SingleInputModal;
