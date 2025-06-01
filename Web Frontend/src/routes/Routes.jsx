import { Route, createRoutesFromElements } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/layout';
import Login from '@/pages/Login';
import Home from '@/components/Home/Home';
import Fees from '@/pages/Fees';
import CalendarPage from '@/pages/Calendar';
import Resources from '@/pages/Resources';
import App from '@/App';
import UserProfile from '@/pages/UserProfile';
import Attendance from '@/pages/Attendance';

const routes = createRoutesFromElements(
  <>
    <Route path="/login" element={<Login />} />

    {/* Protect all routes under Layout at once */}
    <Route element={<ProtectedRoute><App /></ProtectedRoute>}>
      <Route path="/" element={<Layout/>} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/user/edit" element={<UserProfile />}/>
    </Route>
  </>
);

export default routes;
