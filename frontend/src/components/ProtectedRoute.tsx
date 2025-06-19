import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactElement;
  adminOnly?: boolean;
  customerOnly?: boolean; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, customerOnly = false }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />; 
  }

  if (customerOnly && currentUser.role !== 'customer') {
    return <Navigate to="/admin" replace />; 
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;