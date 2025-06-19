// File: UserProfile/index.jsx
import { Suspense, lazy } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/Loading";

const StudentProfileSection = lazy(() => import("./StudentProfileSection"));
const TeacherProfileSection = lazy(() => import("./TeacherProfileSection"));
const AdminProfileSection = lazy(() => import("./AdminProfileSection"));

const EditUserProfile = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      {user.role === "student" && <StudentProfileSection />}
      {user.role === "teacher" && <TeacherProfileSection />}
      {user.role === "super admin" && <AdminProfileSection />}
    </Suspense>
  );
};

export default EditUserProfile;