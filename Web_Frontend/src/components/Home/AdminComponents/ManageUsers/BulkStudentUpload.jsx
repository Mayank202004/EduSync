import React, { useState } from "react";
import { ArrowLeft, UploadCloud, FileSpreadsheet, Download } from "lucide-react";
import toast from "react-hot-toast";
import { bulkStudentUpload } from "@/services/dashboardService";

const BulkStudentUpload = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (
      uploadedFile &&
      (uploadedFile.name.endsWith(".xlsx") ||
        uploadedFile.name.endsWith(".xls") ||
        uploadedFile.name.endsWith(".csv"))
    ) {
      setFile(uploadedFile);
    } else {
      toast.error("Please upload a valid Excel or CSV file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith(".xlsx") ||
        droppedFile.name.endsWith(".xls") ||
        droppedFile.name.endsWith(".csv"))
    ) {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a valid Excel or CSV file.");
    }
  };

  // Template download 
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/templates/student_upload_template.xlsx";
    link.download = "bulk_student_upload_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    try{
      const response = await toast.promise(
        bulkStudentUpload(file),
        {
          loading: "Bulk student upload in progress...",
          success: "Students uploaded successfully",
          error: "", // handled by interceptor
        }
      )
      // Set some data and display component if sme student fail To DO:
    } catch(err){
      // Handled by axios interceptor
    }
    
  };

  return (
    <div className="px-1 md:px-6 text-gray-900 dark:text-white">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={18} /> Back to Manage Users
      </button>

      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Bulk Student Upload</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Upload multiple students at once using an Excel (.xlsx, .xls) or CSV file.
      </p>

      {/* Template Button */}
      <div className="mb-6 flex justify-center md:justify-end">
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <Download size={18} /> Download Template
        </button>
      </div>

      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition 
        ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet size={48} className="text-green-500" />
            <p className="text-lg font-medium">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(file.size / 1024)} KB
            </p>
            <button
              onClick={() => setFile(null)}
              className="mt-2 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud size={48} className="text-blue-500 mb-3" />
            <p className="font-medium">Drag & Drop your file here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click below to select a file
            </p>
            <label
              htmlFor="file-upload"
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      {/* Action Button */}
      {file && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onUpload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Upload Students
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkStudentUpload;
