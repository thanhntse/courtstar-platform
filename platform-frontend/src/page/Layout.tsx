import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/toast.css';

const Layout: React.FC = () => {
  return (
    <div className="relative">
      <Header />
      <div className="min-h-20">
        <ToastContainer draggable />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
