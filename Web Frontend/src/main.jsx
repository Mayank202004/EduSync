import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Home from './components/Home/Home.jsx';
import Fees from './components/Fees/Fees.jsx';
import Resources from './components/Resources/Resources.jsx';
import Calendar from './components/Calendar/Calendar.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Home/>}/>
      <Route path='fees' element={<Fees/>}/>
      <Route path='resources' element={<Resources/>}/>
      <Route path='calendar' element={<Calendar/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
