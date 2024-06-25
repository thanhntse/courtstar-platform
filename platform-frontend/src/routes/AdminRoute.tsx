import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || userRole !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
