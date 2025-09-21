import AddGrades from "@/components/Marks/TeacherComponents/AddGrades";
import PreviousMarkings from "@/components/Marks/TeacherComponents/PreviousMarkings";
import MarkList from "@/components/Marks/TeacherComponents/MarkList";
import MyClass from "./MyClass";
import ClassCoordinatorPanel from "./ClassCoordinatorPanel";

function MainContent({ activeTab, exams, previousMarkings, selectedContext, setSelectedContext, classTeacherData, subjectNames, coordinatorData}) {
  const renderContent = () => {
    switch (activeTab) {
      case "addGrades":
        return <AddGrades exams={exams} />;

      case "previousMarkings":
        return selectedContext ? (
          <MarkList
            context={selectedContext}
            onBack={() => setSelectedContext(null)}
          />
        ) : (
          <PreviousMarkings
            onDivSelect={setSelectedContext}
            previousMarkings={previousMarkings}
          />
        );
      
      case "myClass":
        return <MyClass classTeacherData={classTeacherData} subjectNames={subjectNames}/>;

      case "classCoordinatorPanel":
        return <ClassCoordinatorPanel subjectNames={subjectNames} coordinatorData={coordinatorData}/>;
        
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return <div className="h-full w-full">{renderContent()}</div>;
}

export default MainContent;
