import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { addChapter, addResource } from "@/services/resourcesService";
import SingleInputModal from "./SingleInputModal";
import FileUploadModal from "../Modals/FileUploadModal";
import ImagePreview from "../Chat/ImagePreview";
import { Trash2 } from "lucide-react";
import { deleteResource } from "@/services/resourcesService";
import toast from "react-hot-toast";

// Simple icon mapping based on type (replace with PNG <img src> if needed)
const typeIcons = {
  image: "src/assets/Image.png",
  video: "src/assets/Video.png",
  pdf: "src/assets/PDF.png",
  doc: "src/assets/Default.png", // To Do:
  ppt: "src/assets/PPT.png",
  audio: "src/assets/Audio.png",
  default: "src/assets/Default.png", // To DO: Add default asset
};

const RenderResource = ({ type, url, id, imagePreviewSetter, name }) => {
  const icon = typeIcons[type] || typeIcons.default;

  if (type === "image") {
    return (
      <button
        key={id}
        onClick={() =>
          imagePreviewSetter({
            name: name,
            type: type,
            url: url,
          })
        }
        className="flex items-center w-full gap-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      >
        <img src={icon} alt={type} className="size-10" />
        <span className="truncate">{type.toUpperCase()} Resource</span>
      </button>
    );
  } else {
    return (
      <a
        key={id}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center w-full gap-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      >
        <img src={icon} alt={type} className="h-10 w-10" />
        <span className="truncate">{type.toUpperCase()} Resource</span>
      </a>
    );
  }
};

function ChapterCard({
  className,
  subjectName,
  term,
  allSubjects,
  setUpdatedClass = () => {},
  goBack,
  role = "student",
}) {
  // Hooks
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false); // For Add chapter modal
  const [showFileModal, setShowFileModal] = useState(false); // For file upload modal
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [previewDetails, setPreviewDetails] = useState(null);

  const subject = allSubjects.find((s) => s.subjectName === subjectName);
  const termData = subject?.terms.find((t) => t.termNumber === term);
  const chapters = termData?.chapters || [];

  // Expand chapter to show resources belonging to a specific chapter
  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleAddResource = (chapterName) => {
    setSelectedChapter(chapterName);
    setShowFileModal(true);
  };

  const handleDeleteResource = async (chapterName,resourceUrl) => {
    try{
      console.log(className,subjectName,term,chapterName,resourceUrl);
      const resposne = await toast.promise(
        deleteResource(className,subjectName,term,chapterName,resourceUrl),
        {
          loading: "Deleting resource...",
          success: "Resource deleted successfully",
          error: "",
        }
      )
      setUpdatedClass(resposne.data);
    } catch(err){
      // Handled by axios interceptor
    }
  };

  const handleChapterSubmit = (data) => {
    setUpdatedClass(data);
    setShowModal(false);
  };

  // On add chapter clicked
  const handleAddChapter = () => {
    setShowModal(true);
  };

  return (
    <>
      {previewDetails && (
        <ImagePreview
          onClose={() => setPreviewDetails(null)}
          url={previewDetails.url}
          header={<h1 className="font-semibold">{previewDetails.name}</h1>}
        />
      )}
      <div className="bg-white dark:bg-customDarkFg p-5 rounded-md w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="mb-4 flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Subjects
          </button>
          {/* Right side: Add Chapter button (only for super admin) */}
          {role === "super admin" && (
            <button
              onClick={handleAddChapter}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm flex items-center"
            >
              <Plus className="mr-2" size={16} />
              Add Chapter
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {subjectName} - Term {term}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Click on a chapter to view its resource list.
        </p>

        {chapters.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300 text-lg font-medium">
            No chapters found.
          </div>
        ) : (
          <ul className="space-y-3">
            {chapters.map((chapter, index) => (
              <li
                key={chapter._id}
                className="bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm"
              >
                <div className="w-full flex justify-between items-center p-4">
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex-1 text-left focus:outline-none"
                  >
                    <h3 className="font-semibold text-lg">
                      {index + 1}. {chapter.chapterName}
                    </h3>
                  </button>

                  <div className="flex items-center gap-2">
                    {role === "super admin" && (
                      <button
                        onClick={() => handleAddResource(chapter.chapterName)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add Resource</span>
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(index)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {expandedIndex === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out px-4 space-y-2 text-sm text-gray-700 dark:text-gray-300
                  ${
                    expandedIndex === index
                      ? "max-h-[500px] opacity-100 pt-2 pb-4"
                      : "max-h-0 opacity-0 pt-0 pb-0"
                  }
                `}
                >
                  {chapter.resources.map((res) => {
                    return (
                      <div key={res._id} className="flex justify-between items-center">
                        <RenderResource
                          type={res.type}
                          id={res._id}
                          name={chapter.chapterName}
                          imagePreviewSetter={setPreviewDetails}
                          url={res.url}
                        />
                        {role === "super admin" && (
                          <button
                            onClick={() => handleDeleteResource(chapter.chapterName, res.url)}
                            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                            title="Delete Resource"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Conditionally render modal (This section is for super admin only)*/}
        {showModal && (
          <SingleInputModal
            title="Add New Chapter"
            label="Chapter Name"
            placeholder=""
            loadingMessage="Adding chapter..."
            successMessage="Chapter added successfully!"
            onClose={() => setShowModal(false)}
            onAdd={(chapterName) =>
              addChapter(className, subjectName, term, chapterName)
            }
            onSubmit={(data) => handleChapterSubmit(data)}
          />
        )}

        {showFileModal && (
          <FileUploadModal
            title="Upload Chapter Resources"
            accept=".pdf,image/*,.doc,.docx,.ppt,.pptx,video/*,audio/*"
            multiple={true}
            successMessage="Resource(s) added successfully!"
            loadingMessage="Uploading resource(s)..."
            onClose={() => setShowFileModal(false)}
            onAdd={async (files) =>
              addResource(className, subjectName, term, selectedChapter, files)
            }
            onSubmit={(updatedClass) => {
              setUpdatedClass(updatedClass);
              setShowFileModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}

export default ChapterCard;
