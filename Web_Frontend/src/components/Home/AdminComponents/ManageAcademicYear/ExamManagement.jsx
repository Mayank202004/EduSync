import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, PlusCircle } from "lucide-react";
import ConfirmActionModal from "@/components/Modals/ConfirmationActionModal";
import {fetchManageAcademicYearData} from "@/services/dashboardService";
import { addExam,deleteExam } from "@/services/examServices";
import { ArrowLeft } from "lucide-react";

const ExamManagement = ({ onBack, initialExams}) => {
  const [exams, setExams] = useState(initialExams);
  const [newExamName, setNewExamName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);


  const handleAddExam = async () => {
    if (!newExamName.trim()) return toast.error("Exam name is required");

    try {
      await toast.promise(addExam(newExamName), {
        loading: "Adding exam...",
        success: "Exam added successfully",
        error: "",
      });
      setNewExamName("");
      setExams((exams) => [...exams, { name: newExamName }]);
    } catch (err) {}
  };

  const handleDeleteExam = async () => {
    try {
      await toast.promise(deleteExam(examToDelete), {
        loading: "Deleting exam...",
        success: "Exam deleted",
        error: "",
      });
      setExams((exams) => exams.filter((e) => e._id !== examToDelete));
      setShowConfirm(false);
      setExamToDelete(null);

    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Back to Manage Academic Year
      </button>

      <h3 className="text-xl font-semibold">📘 Exam Management</h3>

      {/* Add New Exam */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full">
        <input
          value={newExamName}
          onChange={(e) => setNewExamName(e.target.value)}
          placeholder="Enter exam name"
          className="border border-gray-300 dark:border-gray-600 rounded px-4 py-2
                     text-black dark:text-white 
                     w-full sm:w-[calc(100vw-150px)] md:w-64 max-w-full"
        />
        <button
          onClick={handleAddExam}
          className="flex items-center justify-center gap-2
                     bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded
                     w-full sm:w-[150px]"
        >
          <PlusCircle size={18} /> Add Exam
        </button>
      </div>

      {/* List Exams */}
      <div className="space-y-2">
        {exams.length === 0 ? (
          <p className="text-gray-500">No exams created yet.</p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam._id}
              className="flex items-center justify-between border bg-white border-gray-200 dark:border-gray-700 rounded px-4 py-2"
            >
              <span>{exam.name}</span>
              <button
                onClick={() => {
                  setExamToDelete(exam._id);
                  setShowConfirm(true);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <X size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {showConfirm && (
        <ConfirmActionModal
          title="Delete Exam"
          message="Are you sure you want to delete this exam? This action cannot be undone."
          onConfirm={handleDeleteExam}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default ExamManagement;
