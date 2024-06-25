import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ManagerRouteProps {
  children: ReactNode;
}

const ManagerRoute: React.FC<ManagerRouteProps> = ({ children }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || userRole==="CUSTOMER") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ManagerRoute;
