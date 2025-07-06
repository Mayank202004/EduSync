import React, { useState } from "react";
import toast from "react-hot-toast";
import useClickOutside from "@/hooks/useClickOutside";

const TwoInputModal = ({
  title,
  label1,
  label2,
  placeholder1 = "",
  placeholder2 = "",
  loadingMessage = "Loading...",
  successMessage = "Success!",
  errorMessage = "",
  onClose,
  onSubmit,
  onAdd, // function that accepts (value1, value2)
}) => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const [containerRef] = useClickOutside(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!value1.trim() || !value2.trim()) {
      toast.error("Both fields are required.");
      return;
    }

    try {
      const response = await toast.promise(
        onAdd(value1, value2),
        {
          loading: loadingMessage,
          success: successMessage,
          error: errorMessage,
        }
      );
      onSubmit?.(response.data);
    } catch (err) {
      // error handled by interceptor
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
      <form
        ref={containerRef}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">{label1}</label>
          <input
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder={placeholder1}
            required
            type="text"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">{label2}</label>
          <input
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder={placeholder2}
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

export default TwoInputModal;
