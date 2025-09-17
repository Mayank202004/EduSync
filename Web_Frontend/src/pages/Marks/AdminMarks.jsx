import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/Marks/AdminComponents/LeftSidebar";
import MainContent from "@/components/Marks/AdminComponents/MainContent";
import { getClassMarksData, getSuperAdminData } from "@/services/marksServices";

const AdminMarks = () => {
  const [superAdminData, setSuperAdminData] = useState({ exams: [], classes: [] });
  const [marksData, setMarksData] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [loading, setLoading] = useState(false);

  // Fetch exams and classes for super admin
  useEffect(() => {
    const fetchSuperAdminData = async () => {
      try {
        const response = await getSuperAdminData();
        setSuperAdminData({ exams: response.data.exams || [], classes: response.data.classes || [] });
      } catch (err) {
        // Handled by axios interceptor
      }
    };
    fetchSuperAdminData();
  }, []);

  // Fetch marks data when selectedDiv changes
  useEffect(() => {
    if (!selectedDiv) return;

    const fetchMarksData = async () => {
      setLoading(true);
      try {
        const response = await getClassMarksData(
          selectedDiv.class,
          selectedDiv.div,
          selectedDiv.examId
        );

        if (response.data?.marks?.subjects?.length > 0) {
          setMarksData(response.data.marks);
          setAllSubjects(response.data.subjectNames || []);
          setSelectedSubject(response.data.marks.subjects[0]?.subject || "");
        } else {
          setMarksData(null);
          setAllSubjects(response.data.subjectNames || []);
          setSelectedSubject("");
        }
      } catch (error) {
        // Handled by axios interceptor
        setMarksData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMarksData();
  }, [selectedDiv]);

  return (
    <div className="flex flex-col md:flex-row h-full md:h-[90vh] w-full bg-customLightBg dark:bg-customDarkBg px-4 py-4 md:py-2">
      {/* Left Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <LeftSidebar
          exams={superAdminData.exams}
          classes={superAdminData.classes}
          onDivSelect={setSelectedDiv}
        />
      </div>

      {/* Main Content */}
      <div className="h-full w-full">
        {!selectedDiv ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select exam, class and division from sidebar</p>
          </div>
        ) : loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Loading...</p>
          </div>
        ) : !marksData ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No Class Marks Data for this exam</p>
          </div>
        ) : (
          <MainContent
            selectedDiv={selectedDiv}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            showModal={showModal}
            setShowModal={setShowModal}
            marksData={marksData}
            allSubjects={allSubjects}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMarks;
