// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes/Routes.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import './index.css';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  //</StrictMode>
);
