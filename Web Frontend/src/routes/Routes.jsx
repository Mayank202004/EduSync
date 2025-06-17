import { Route, createRoutesFromElements } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Home from '@/components/Home/Home';
import Fees from '@/pages/Fees';
import CalendarPage from '@/pages/Calendar';
import Resources from '@/pages/Resources';
import App from '@/App';
import EditUserProfile from '@/pages/EditUserProfile';
import Attendance from '@/pages/Attendance';
import Dashboard from '@/pages/Dashboard';
import NotFound404 from '@/pages/NotFound404';

const routes = createRoutesFromElements(
  <>
    <Route path="/login" element={<Login />} />

    {/* Protect all routes under Layout at once */}
    <Route element={<ProtectedRoute><App /></ProtectedRoute>}>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/user/edit" element={<EditUserProfile />}/>
    </Route>

    <Route path="/*" element={<NotFound404 />} />
  </>
);

export default routes;
