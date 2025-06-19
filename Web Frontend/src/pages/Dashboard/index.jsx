import { lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/Loading';
import Unauthorized401 from '../Unauthorized401';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const TeacherDashboard = lazy(() => import('./TeacherDashboard'));
const StudentDashboard = lazy(() => import('./StudentDashboard'));


export default function Resources() {
  const { user } = useAuth();

  if (!user) return null;

  let Component;
  switch (user.role) {
    case 'student':
      Component = StudentDashboard;
      break;
    case 'teacher':
      Component = TeacherDashboard;
      break;
    case 'super admin':
      Component = AdminDashboard;
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
// This code is a React component that conditionally renders different resource components based on user roles.