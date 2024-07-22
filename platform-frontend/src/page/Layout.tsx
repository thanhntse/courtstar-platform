import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/toast.css';
import { useAuth } from '../context/AuthContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Layout: React.FC = () => {
  const { dispatch } = useAuth();
  const query = useQuery();
  const token = query.get('code');
  const role = query.get('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (token && token !== "" && role && role !== "") {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate("/");
      dispatch({ type: 'LOGIN', payload: { token: token, role: role } });
    }
  }, [token, role])
  

  return (
    <div className="relative">
      <Header />
      <div className="min-h-20">
        <ToastContainer
          pauseOnHover={false}
          closeOnClick
          draggable
          autoClose={2000}
        />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
