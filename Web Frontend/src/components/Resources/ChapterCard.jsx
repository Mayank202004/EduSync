import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

// Simple icon mapping based on type (replace with PNG <img src> if needed)
const typeIcons = {
  image: 'src/assets/Image.png',
  video: '🎥',
  pdf: '📄',
  doc: '📃',
  ppt: '📊',
  audio: '🎵',
  default: '📁',
};

function ChapterCard({ subjectName, term, allSubjects, goBack }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const subject = allSubjects.find((s) => s.subjectName === subjectName);
  const termData = subject?.terms.find((t) => t.termNumber === term);
  const chapters = termData?.chapters || [];

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className='bg-white dark:bg-customDarkFg p-5 rounded-md w-full max-w-3xl'>
      <button
        onClick={goBack}
        className='mb-4 flex items-center text-blue-600 hover:underline'
      >
        <ArrowLeft className='mr-2' size={18} />
        Back to Subjects
      </button>

      <h1 className='text-2xl font-bold mb-2'>{subjectName} - Term {term}</h1>
      <p className='text-gray-700 dark:text-gray-300 mb-4'>
        Click on a chapter to view its resource list.
      </p>

      {chapters.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-300 text-lg font-medium">
          No chapters found.
        </div>
      ) : (
        <ul className='space-y-3'>
          {chapters.map((chapter, index) => (
            <li
              key={chapter._id}
              className='bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm'
            >
              <button
                onClick={() => toggleExpand(index)}
                className='w-full flex justify-between items-center p-4 focus:outline-none'
              >
                <h3 className='font-semibold text-lg'>
                  {index + 1}. {chapter.chapterName}
                </h3>
                {expandedIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out px-4 space-y-2 text-sm text-gray-700 dark:text-gray-300
                  ${expandedIndex === index ? 'max-h-[500px] opacity-100 pt-2 pb-4' : 'max-h-0 opacity-0 pt-0 pb-0'}
                `}
              >
                {chapter.resources?.length > 0 ? (
                  chapter.resources.map((res) => {
                    const icon = typeIcons[res.type] || typeIcons.default;
                    return (
                      <a
                        key={res._id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                      >
                        <img src={icon} alt={res.type} className="h-10 w-10" />
                        <span className="truncate">{res.type.toUpperCase()} Resource</span>
                      </a>
                    );
                  })
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400">No resources available.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChapterCard;
