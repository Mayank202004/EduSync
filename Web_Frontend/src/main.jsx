// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes/Routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <AuthProvider>
    <SocketProvider>
      <Toaster />
      <RouterProvider router={router} />
    </SocketProvider>
  </AuthProvider>
  //</StrictMode>
);
