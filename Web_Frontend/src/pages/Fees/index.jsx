import { lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/Loading';
import Unauthorized401 from '../Unauthorized401';

const StudentFees = lazy(() => import('./StudentFees'));
const AdminFees = lazy(() => import('./AdminFees'));

export default function Resources() {
  const { user } = useAuth();

  if (!user) return null;

  let Component;
  switch (user.role) {
    case 'student':
      Component = StudentFees;
      break;
    case 'super admin':
      Component = AdminFees;
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
// This code is a React component that conditionally renders different fee components based on user roles.