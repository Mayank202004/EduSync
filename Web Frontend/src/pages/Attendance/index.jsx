import { lazy, Suspense } from 'react';
import { useAuth } from '@/auth/AuthContext';
import LoadingScreen from '@/components/Loading';

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
      return <div>Unauthorized</div>; // To DO: Make a Unauthorised page 
  }

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Component />
    </Suspense>
  );
}
// This code is a React component that conditionally renders different resource components based on user roles.