import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface CustomerRouteProps {
  children: ReactNode;
}

const CustomerRoute: React.FC<CustomerRouteProps> = ({ children }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default CustomerRoute;
