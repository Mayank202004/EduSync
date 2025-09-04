import React from "react";
import { ArrowLeft } from "lucide-react";

const AddTeacherForm = ({ onBack }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
      <p className="text-gray-600 dark:text-gray-400">
        This is a dummy page for adding a teacher. You can place the form here.
      </p>
    </div>
  );
};

export default AddTeacherForm;
