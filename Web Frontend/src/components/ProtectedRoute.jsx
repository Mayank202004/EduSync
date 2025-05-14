import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext'; // Assuming this contains the authentication logic

// This component will wrap the protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); 

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // If user is authenticated, render the protected route
};

export default ProtectedRoute;
