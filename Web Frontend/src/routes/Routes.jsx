import { Route, createRoutesFromElements } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/layout';
import Login from '@/pages/Login';
import Home from '@/components/Home/Home';
import Fees from '@/pages/Fees';
import Calendar from '@/components/Calendar/Calendar';
import Resources from '@/pages/Resources';
import App from '@/App';

const routes = createRoutesFromElements(
  <>
    <Route path="/login" element={<Login />} />

    {/* Protect all routes under Layout at once */}
    <Route element={<ProtectedRoute><App /></ProtectedRoute>}>
      <Route path="/" element={<Layout/>} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/resources" element={<Resources />} />
    </Route>
  </>
);

export default routes;
