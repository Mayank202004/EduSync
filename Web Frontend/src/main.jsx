import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Home from './components/Home/Home.jsx';
import Fees from './components/Fees/Fees.jsx';
import Resources from './pages/Resources.jsx';
import Calendar from './components/Calendar/Calendar.jsx';
import Layout from './layout.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider } from './auth/useAuth';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Login/>}>
      <Route path='' element={<Layout/>}/>
      <Route path='fees' element={<Fees/>}/>
      <Route path='resources' element={<Resources/>}/>
      <Route path='calendar' element={<Calendar/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
