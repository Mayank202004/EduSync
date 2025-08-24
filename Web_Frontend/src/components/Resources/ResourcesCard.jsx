import React, { useEffect, useState } from 'react';
import SubjectCard from './SubjectCard';
import { ArrowLeft,Plus } from 'lucide-react';
import SingleInputModal from './SingleInputModal';
import { addSubject } from '@/services/resourcesService';

function ResourcesCard({ 
  allSubjects,
  setAllSubjects= () => {},
  selectedTerm, 
  setSelectedTerm, 
  onSubjectClick, 
  goBack=null, 
  role='student', 
  className="" 
}) {
  const [resources, setResources] = useState([]);

  const subjectImages = {
    English: 'src/assets/English.png',
    Marathi: 'src/assets/Marathi.png',
    Maths: 'src/assets/Mathematics.png',
    Science: 'src/assets/Science.png',
    History: 'src/assets/History.png',
    Hindi: 'src/assets/Hindi.png',
    EVS: 'src/assets/EVS.png',
  };

  const bgColors = [
    'bg-blue-200',
    'bg-red-200',
    'bg-emerald-100',
    'bg-cyan-100',
    'bg-yellow-100',
    'bg-purple-200',
  ];

  // Hooks
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filteredResources = allSubjects.map((subject) => {
      const term = subject.terms.find((t) => t.termNumber === selectedTerm);
      return {
        subjectName: subject.subjectName,
        topics: term?.chapters?.length || 0,
      };
    });

    setResources(filteredResources);
  }, [selectedTerm, allSubjects]);

  // On add subject clicked
  const handleAddSubject = ()=>{
    setShowModal(true);
  }

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSubjectSubmit = (data) => {
      setAllSubjects(data);
      setShowModal(false);
  };


  return (
    <div className='bg-white dark:bg-customDarkFg p-5 rounded-md'>
      <div className='flex items-center justify-between gap-5 flex-col sm:flex-row'>
        <div>
          {role != 'student' && (
            <button
              onClick={goBack}
              className='mb-4 flex items-center text-blue-600 hover:underline'
            >
              <ArrowLeft className='mr-2' size={18} />
              Back to Classes
            </button>
          )}
          <h1 className='text-2xl font-bold'>Resources</h1>
          <p className='text-gray-700 dark:text-gray-200'>
            Choose subject to see your study resources
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {/* Right side: Add Subject button (only for super admin) */}
          {role === 'super admin' && (
            <button
              onClick={handleAddSubject} 
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm flex items-center'
            >
              <Plus className='mr-2' size={16}/>
              Add Subject
            </button>
          )}
          {/* Right side: Term selection */}
          <select
            id='term'
            name='term'
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className='block text-black rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-left'
          >
            <option value='1'>Term 1</option>
            <option value='2'>Term 2</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
        {resources.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
            No resources found for the selected term.
          </div>
        ) : (
          resources.map((item, index) => (
            <div key={item.subjectName} onClick={() => onSubjectClick(item.subjectName)}>
              <SubjectCard
                subject={item.subjectName}
                topics={item.topics}
                bgColor={bgColors[index % bgColors.length]}
                imgSrc={subjectImages[item.subjectName] || 'src/assets/default.png'}
              />
            </div>
          ))
        )}
      </div>
      {/* Conditionally render modal (This section is for super admin only)*/}
      {showModal && (
        <SingleInputModal
            title="Add New Subject"
            label="Subject Name"
            placeholder=""
            loadingMessage="Adding subject..."
            successMessage="Subject added successfully!"
            onClose={() => setShowModal(false)}
            onAdd={(name) => addSubject(className,name)}
            onSubmit={(data) => handleSubjectSubmit(data)}
        />
      )}
    </div>
  );
}

export default ResourcesCard;
