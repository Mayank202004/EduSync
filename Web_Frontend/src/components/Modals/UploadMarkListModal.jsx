import React, { useState } from "react";
import Modal from "./Modal";
import { CloudUpload, Download, Printer, Edit3 } from "lucide-react";
import { getMarkListTemplate } from "@/services/marksServices";
import toast from "react-hot-toast";

function UploadMarklistModal({ isOpen, onClose, className, div }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const downloadTemplate = async () => {
    if (!className || !div) {
      toast.error("Please select class and division first.");
      return;
    }
  
    try {
      await toast.promise(
        getMarkListTemplate(className, div),
        {
          loading: `Fetching template for ${className}-${div}...`,
          success: "Template ready!",
          error: "",
        }
      );
    } catch (err) {
      // Handled by axios interceptor
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="AI-Powered Marks Parsing" onClose={onClose}>
      {/* Download Template */}
      <div className="mb-4">
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Download Template for {className}-{div}
        </button>
      </div>

      {/* Drag & Drop / File Input */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mb-6 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center cursor-pointer hover:border-blue-500 transition"
      >
        <CloudUpload className="mx-auto mb-2 text-gray-400" size={36} />
        {file ? (
          <p className="text-gray-800 dark:text-gray-200">{file.name}</p>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop your PDF here or
            </p>
            <label className="text-blue-600 cursor-pointer hover:underline">
              select a file
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* Steps Illustration */}
          <h3 className="text-lg font-semibold mb-4 text-center">Steps to Upload Marklist</h3>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full mb-2">
            <Download className="text-blue-600 dark:text-blue-200" size={24} />
          </div>
          <p className="text-sm font-medium">Download Template</p>
        </div>

        <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 md:hidden"></div>
        <div className="hidden md:block flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full mb-2">
            <Printer className="text-green-600 dark:text-green-200" size={24} />
          </div>
          <p className="text-sm font-medium">Print Template</p>
        </div>

        <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 md:hidden"></div>
        <div className="hidden md:block flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-full mb-2">
            <Edit3 className="text-yellow-600 dark:text-yellow-200" size={24} />
          </div>
          <p className="text-sm font-medium">Fill Marks by Hand</p>
        </div>

        <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 md:hidden"></div>
        <div className="hidden md:block flex-1 h-1 bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full mb-2">
            <CloudUpload className="text-purple-600 dark:text-purple-200" size={24} />
          </div>
          <p className="text-sm font-medium">Upload PDF</p>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <button
          disabled={!file}
          className={`px-4 py-2 rounded-md text-white ${
            file ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          } transition`}
          onClick={() => {
            console.log("Uploading file:", file);
            // handle upload logic here
          }}
        >
          Upload
        </button>
      </div>
    </Modal>
  );
}

export default UploadMarklistModal;
