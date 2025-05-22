import React from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import SingleInputModal from './SingleInputModal';
import { addClass } from '@/services/resourcesService';

const bgColors = [
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-orange-100',
];

const classImages = {
  1: 'src/assets/classes/1.png',
  2: 'src/assets/classes/2.png',
  3: 'src/assets/classes/3.png',
  4: 'src/assets/classes/4.png',
  5: 'src/assets/classes/5.png'
};


function ClassesCard({ classes,setClasses, onClassSelect, role='teacher' }) {
  // Hooks
  const [showModal, setShowModal] = useState(false);

  
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleClassSubmit = (data) => {
    setClasses((prev) => [...prev, data]);
    setShowModal(false);
  };

  // On add class clicked
  const handleAddClass = () =>{
    setShowModal(true);
  }
  return (
    <div className='bg-white dark:bg-customDarkFg p-5 rounded-md w-full max-w-6xl'>
      <div className='mb-4 flex items-center justify-between'>
        {/* Left side: Heading and description */}
        <div>
          <h1 className='text-2xl font-bold'>Select Class</h1>
          <p className='text-gray-700 dark:text-gray-200'>
            Choose a class to explore its subjects and resources
          </p>
        </div>

        {/* Right side: Add Class button (only for super admin) */}
        {role === 'super admin' && (
          <button
            onClick={handleAddClass} // define this function in your component
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm flex items-center'
          >
            <Plus className='mr-2' size={16}/>
            Add Class
          </button>
        )}
    </div>


      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
        {classes.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
            No classes available.
          </div>
        ) : (
          classes.map((cls, index) => (
            <div
              key={cls._id}
              onClick={() => onClassSelect(cls)}
              className={`cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300 ${bgColors[index % bgColors.length]}`}
            >
              <img
                src={classImages[cls.class] || 'src/assets/default-class.png'}
                alt={`Class ${cls.class}`}
                className='w-20 h-20 object-contain mx-auto mb-3'
              />
              <h2 className='text-center text-xl font-semibold text-gray-800'>
                Class {cls.class}
              </h2>
              <p className='text-center text-sm text-gray-500 '>
                {cls.subjects.length} Subjects
              </p>
            </div>
          ))
        )}
      </div>
      {/* Conditionally render modal (This section is for super admin only)*/}
      {showModal && (
        <SingleInputModal
            title="Add New Class"
            label="Class Name"
            placeholder="e.g., 1, 2, Jr. Kg"
            loadingMessage="Adding class..."
            successMessage="Class added successfully!"
            onClose={() => setShowModal(false)}
            onAdd={(name) => addClass(name)}
            onSubmit={(data) => {
              setClasses((prev) => [...prev, data]);
              setShowModal(false);
            }}
        />
      )}
    </div>
  );
}

export default ClassesCard;
