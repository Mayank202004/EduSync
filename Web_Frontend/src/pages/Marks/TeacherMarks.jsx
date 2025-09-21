import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/Marks/TeacherComponents/LeftSidebar";
import MainContent from "@/components/Marks/TeacherComponents/MainContent";
import MobileTabs from "@/components/Marks/TeacherComponents/MobileTabs";
import { getTeacherMarksData } from "@/services/marksServices";

function TeacherMarks() {
  const [activeTab, setActiveTab] = useState("addGrades");
  const [selectedContext, setSelectedContext] = useState(null);
  const [exams, setExams] = useState([]);
  const [previousMarkings, setPreviousMarkings] = useState([]);
  const [classTeacherData, setClassTeacherData] = useState([]);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [subjectNames, setSubjectNames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTeacherMarksData();
        setExams(response.data?.exams || []);
        setPreviousMarkings(response.data?.previousMarkings || []);
        setClassTeacherData(response.data?.classTeacherData || []);
        setCoordinatorData(response.data?.coordinatorData || []);
        setSubjectNames(response.data?.subjectNames || []);
      } catch (error) {
        // Error already handled by axios instance
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full md:h-[90vh] w-full bg-customLightBg dark:bg-customDarkBg px-4 py-4 md:py-2">
      <div className="hidden md:block md:w-[30%] lg:w-[20%]">
        <LeftSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedContext={setSelectedContext}
          />
      </div>
      <div className="flex flex-col h-full w-full md:w-[70%] lg:w-[80%]">
        <MobileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedContext={setSelectedContext}
        />
        <MainContent
          activeTab={activeTab}
          exams={exams}
          previousMarkings={previousMarkings}
          classTeacherData={classTeacherData}
          coordinatorData={coordinatorData}
          selectedContext={selectedContext}
          setSelectedContext={setSelectedContext}
          subjectNames={subjectNames}
          />
      </div>
    </div>
  );
}

export default TeacherMarks;
