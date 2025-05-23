import React, { useState, useEffect } from 'react';
import ResourcesCard from '@/components/Resources/ResourcesCard';
import ChapterCard from '@/components/Resources/ChapterCard';
import ClassesCard from '@/components/Resources/ClassesCard';
import { getTeacherResources } from '@/services/resourcesService';
import { toast } from 'react-hot-toast';
import LoadingScreen from '@/components/Loading';

function TeacherResources() {
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
        const response = await getTeacherResources();
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

  if (isLoading) return <LoadingScreen/>;

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      {!selectedClass ? (
        <ClassesCard
          classes={allClasses}
          onClassSelect={(cls) => setSelectedClass(cls)}
          role='teacher'
        />
      ) : !selectedSubject ? (
        <ResourcesCard
          onSubjectClick={(subjectName) => setSelectedSubject(subjectName)}
          selectedTerm={selectedTerm}
          setSelectedTerm={setSelectedTerm}
          allSubjects={selectedClass.subjects || []}
          goBack={handleBackFromClass}
          role="teacher"
          className={selectedClass.class}
        />
      ) : (
        <ChapterCard
          className={selectedClass.class}
          subjectName={selectedSubject}
          term={selectedTerm}
          allSubjects={selectedClass.subjects || []}
          goBack={handleBackFromSubject}
          role='teacher'
        />
      )}
    </div>
  );
};

export default TeacherResources;
