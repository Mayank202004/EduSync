import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStudentMarksData } from "@/services/marksServices";
import LeftSidebar from "@/components/Marks/StudentComponents/leftSidebar";
import MainContent from "@/components/Marks/StudentComponents/MainContent";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[90vh] text-gray-600 dark:text-gray-300">
        Loading student marks...
      </div>
    );
  }

  return (
    <div className="flex h-[90vh] w-full bg-gray-50 dark:bg-gray-900 px-4 py-2">
      <LeftSidebar exams={exams} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <MainContent student={student} activeIndex={activeIndex} exams={exams} />
    </div>
  );
}

export default StudentMarks;
