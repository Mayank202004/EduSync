import { lazy, Suspense } from 'react';
import { useAuth } from '@/auth/AuthContext';
import LoadingScreen from '@/components/Loading';

const StudentResources = lazy(() => import('./StudentResources'));
const TeacherResources = lazy(() => import('./TeacherResources'));
const AdminResources = lazy(() => import('./AdminResources'));

export default function Resources() {
  const { user } = useAuth();

  if (!user) return null;

  let Component;
  switch (user.role) {
    case 'student':
      Component = StudentResources;
      break;
    case 'teacher':
      Component = TeacherResources;
      break;
    case 'super admin':
      Component = AdminResources;
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