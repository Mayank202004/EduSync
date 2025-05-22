import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

const FileUploadModal = ({
  title = "Upload Files",
  accept = "", // e.g., "image/*,.pdf"
  successMessage = "Files uploaded successfully!",
  loadingMessage = "Uploading...",
  errorMessage = "",
  multiple = true,
  onClose,
  onAdd,
  onSubmit,
}) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    setFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    try {
      const response = await toast.promise(
        onAdd(files), // pass selected files
        {
          loading: loadingMessage,
          success: successMessage,
          error: errorMessage,
        }
      );
      onSubmit(response.data);
    } catch (err) {
      // Error already handled in toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="bg-white dark:bg-customDarkFg rounded-xl p-6 w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div
          className={`border-2 border-dashed p-6 text-center rounded cursor-pointer ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-gray-600">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "Click or drag and drop files here"}
          </p>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            ref={inputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
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
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUploadModal;
