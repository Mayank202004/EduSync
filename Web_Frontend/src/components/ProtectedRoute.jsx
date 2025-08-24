import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // assumes useAuth provides isAuthenticated & loading
import LoadingScreen from './Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner or placeholder while auth is being verified
  if (loading) {
    return <LoadingScreen /> // You can replace this with a proper loader/spinner
  }

  // If not authenticated after loading finishes, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route has children (passed directly), render them
  if (children) {
    return children;
  }

  // If using nested routes
  return <Outlet />;
};

export default ProtectedRoute;
