import React from "react";

const ConfirmActionModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="border px-4 py-2 rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
