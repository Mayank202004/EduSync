// Work pending


// import React, { useState, useEffect } from 'react';
// import ResourcesCard from '@/components/Resources/ResourcesCard';
// import ChapterCard from '@/components/Resources/ChapterCard';
// import { getStudentsResources } from '@/services/resourcesService';
// import { toast } from 'react-hot-toast';
// import LoadingScreen from '@/components/Loading';

// function Resources() {
//   //Hooks
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedTerm, setSelectedTerm] = useState('1');
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Fetch all subjects and their resources
//     const fetchData = async () => {
//       try {
//         const response = await getStudentsResources();
//         setAllSubjects(response.data || []);
//       } catch (error) {
//         // Already handled by axios instance
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (isLoading) return <LoadingScreen/>;

//   return (
//     <div className='w-full min-h-screen flex items-center justify-center p-4'>
//       {selectedSubject ? (
//         <ChapterCard
//           subjectName={selectedSubject}
//           term={selectedTerm}
//           allSubjects={allSubjects}
//           goBack={() => setSelectedSubject(null)}
//         />
//       ) : (
//         <ResourcesCard
//           onSubjectClick={(subjectName) => setSelectedSubject(subjectName)}
//           selectedTerm={selectedTerm}
//           setSelectedTerm={setSelectedTerm}
//           allSubjects={allSubjects}
//         />
//       )}
//     </div>
//   );
// }

// export default Resources;
