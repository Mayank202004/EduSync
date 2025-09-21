import { lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/Loading';
import Unauthorized401 from '../Unauthorized401';

const StudentMarks = lazy(() => import('./StudentMarks'));
const TeacherMarks = lazy(() => import('./TeacherMarks'));
const AdminMarks = lazy(() => import('./AdminMarks'));

export default function Marks() {
  const { user } = useAuth();

  if (!user) return null;

  let Component;
  switch (user.role) {
    case 'student':
      Component = StudentMarks;
      break;
    case 'super admin':
      Component = AdminMarks;
      break;
    case 'teacher':
      Component = TeacherMarks;
      break;
    default:
      return <Unauthorized401 />;
  }

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Component />
    </Suspense>
  );
}
// This code is a React component that conditionally renders different marks components based on user roles.