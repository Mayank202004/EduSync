import { lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/Loading';
import Unauthorized401 from '../Unauthorized401';

const TeacherAttendance = lazy(() => import('./TeacherAttendance'));
const AdminAttendance = lazy(() => import('./AdminAttendance'));

export default function Resources() {
  const { user } = useAuth();

  if (!user) return null;

  let Component;
  switch (user.role) {
    case 'teacher':
      Component = TeacherAttendance;
      break;
    case 'super admin':
      Component = AdminAttendance;
      break;
    default:
      return <Unauthorized401 />; // To DO: Make a Unauthorised page 
  }

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Component />
    </Suspense>
  );
}
// This code is a React component that conditionally renders different resource components based on user roles.