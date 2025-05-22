import React, { useState, useEffect } from 'react';
import ResourcesCard from '@/components/Resources/ResourcesCard';
import ChapterCard from '@/components/Resources/ChapterCard';
import ClassesCard from '@/components/Resources/ClassesCard';
import { getAdminResources } from '@/services/resourcesService';
import { toast } from 'react-hot-toast';
import LoadingScreen from '@/components/Loading';

function AdminResources() {
  //Hooks
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('1');
  const [allClasses, setAllClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all classes their subjects and their resources
    const fetchData = async () => {
      try {
        const response = await getAdminResources();
        console.log(response.data);
        setAllClasses(response.data || []);
      } catch (error) {
        // Already handled by axios instance
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // On back pressed from selected class
  const handleBackFromClass = () => {
    setSelectedClass(null);
    setSelectedTerm('1');
  };

  // On back pressed from selected subject
  const handleBackFromSubject = () => {
    setSelectedSubject(null);
  };

  // To update the subjects of selected class (Used in addSubject) 
  const updateSubjectsForSelectedClass = (updatedClass) => {
    setAllClasses(prev =>
      prev.map(cls =>
        cls._id === updatedClass._id ? updatedClass : cls
      )
    );
    // Update local state of selected class 
    setSelectedClass(updatedClass);
  };


  if (isLoading) return <LoadingScreen/>;

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      {!selectedClass ? (
        <ClassesCard
          classes={allClasses}
          setClasses={setAllClasses}
          onClassSelect={(cls) => setSelectedClass(cls)}
          role='super admin'
        />
      ) : !selectedSubject ? (
        <ResourcesCard
          onSubjectClick={(subjectName) => setSelectedSubject(subjectName)}
          selectedTerm={selectedTerm}
          setSelectedTerm={setSelectedTerm}
          allSubjects={selectedClass.subjects || []}
          setAllSubjects={updateSubjectsForSelectedClass}
          goBack={handleBackFromClass}
          role="super admin"
          className={selectedClass.class}
        />
      ) : (
        <ChapterCard
          subjectName={selectedSubject}
          term={selectedTerm}
          allSubjects={selectedClass.subjects || []}
          goBack={handleBackFromSubject}
        />
      )}
    </div>
  );
};

export default AdminResources;
