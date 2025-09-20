import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentMarksData } from "@/services/marksServices";
import LeftSidebar from "@/components/Marks/StudentComponents/LeftSidebar";
import MainContent from "@/components/Marks/StudentComponents/MainContent";
import MobileTabs from "@/components/Marks/StudentComponents/MobileTabs";

function StudentMarks() {
  const { user, roleInfo } = useAuth();
  const student = {
    name: user?.fullName ?? "",
    class: roleInfo?.class ?? "",
    division: roleInfo?.div ?? "",
  };

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getStudentMarksData();
        setExams(response.data);
      } catch (err) {
        // handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div className="flex flex-col h-[90vh] w-full bg-gray-50 dark:bg-gray-900">
      {/* Mobile Tabs */}
      <MobileTabs exams={exams} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <div className="flex flex-1 px-4 py-2 overflow-hidden">
        <LeftSidebar
          exams={exams}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
        <MainContent
          student={student}
          activeIndex={activeIndex}
          exams={exams}
          loading={loading}
        />
      </div>

    </div>
  );
}

export default StudentMarks;
