import React, { useState } from "react";
import toast from "react-hot-toast";
import { addClass } from "@/services/resourcesService";

const AddClassModal = ({ onClose, onSubmit }) => {
  const [className, setClassName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      toast.error("Class name cannot be empty");
      return;
    }

    try {
      const response = await toast.promise(
        addClass(className),
        {
          loading: "Adding class...",
          success: "Class added successfully!",
          error: "",
        }
      );
      onSubmit(response.data); // Notify parent
    } catch (err) {
     // Handled by axios instance
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add New Class</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Class Name</label>
          <input
            name="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g., 1, 2, Jr. Kg"
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

export default AddClassModal;
