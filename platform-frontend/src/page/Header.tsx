import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.svg';
import LanguageSelector from '../components/LanguageSelector';
import Login from '../auth/Login';
import axiosInstance from '../config/axiosConfig';
import DropdownHeader from '../components/DropdownHeader'
import Bell from '../components/notification';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/button';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useAuth();
  const { token, role, isLogin, account } = state;

  //HANDLE LOGIN POPUP
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const handleLoginPopup = () => {
    setLoginPopupOpen(true);
  }
  const handleLoginClose = () => {
    setLoginPopupOpen(false);
  }

  //HANDLE LOAD INFO
  useEffect(() => {
    const load = async() => {
      await axiosInstance.get('/courtstar/account/myInfor')
        .then(res => {
          dispatch({ type: 'SET_ACCOUNT', payload: res.data.data });
        })
        .catch(err => {
          console.log(err.message);
          localStorage.clear();
          dispatch({ type: 'LOGOUT' });
        })
        .finally(()=>{
        })
    }

    if (isLogin) {
      load();
    }
  }, [isLogin])

  //HANDLE LOGOUT ACTION
  const navigate = useNavigate();
  const logout = async () => {
    await axiosInstance.post(`/courtstar/auth/logout`, { token })
      .then(res => {
        localStorage.clear();
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally();
  };

  useEffect(() => {
    const loadNotification = async () => {
      await axiosInstance.get(`/courtstar/notification`)
        .then(res => {
          setNotification(res.data.data.reverse());
        })
        .catch(error => {
          console.log(error.message);
        })
        .finally();
    };

    if (isLogin) {
      loadNotification();
    }
  }, [isLogin]);

  const [notifications, setNotification] = useState([]);

  return (
    <div className='font-Inter text-base overflow-x-hidden w-full shadow-lg fixed z-30'>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-primary-green">
        <nav className="max-w-screen-1440 1440:mx-auto mx-4 w-full sm:flex sm:items-center sm:justify-between">

          <div className="flex items-center justify-between">
            <div>
              <img src={logo}
                className="w-20 h-20"
                alt='logo' />
            </div>
            <div className="sm:hidden">
              <button type="button"
                className="p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                <svg className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg className="hidden flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="hidden overflow-hidden transition-all duration-300 grow sm:block">
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5">

              <Link
                className="text-gray-200 font-medium hover:text-white hover:font-semibold transition-all ease-in-out duration-300"
                to="/"
              >
                {t('home')}
              </Link>

              <Link
                className="text-gray-200 hover:text-white transition-all ease-in-out duration-300"
                to="/aboutUs"
              >
                {t('aboutUs')}
              </Link>

              {!(role === 'MANAGER' || role === 'ADMIN') &&
                <Link
                  className="text-gray-200 hover:text-white transition-all ease-in-out duration-300"
                  to="/partnerRegister"
                >
                  {t('partnerRegister')}
                </Link>
              }

              {
                role && role === 'ADMIN' && isLogin &&
                <Link
                  className="text-gray-200 hover:text-white transition-all ease-in-out duration-300"
                  to="/admin"
                >
                  {t('myDashboard')}
                </Link>
              }

              {
                (role && (role === 'STAFF' || role === 'MANAGER')) && isLogin &&
                <Link
                  className="text-gray-200 hover:text-white transition-all ease-in-out duration-300"
                  to={role === 'STAFF'? "/myCentre/:id" :"/myCentre/balance"}
                >
                  {t('myCentre')}
                </Link>
              }

            </div>
          </div>

          <div className="flex">

            <LanguageSelector />

            {(isLogin === false) && (
              <div className="flex gap-4">
                <div>
                  <Button
                    label={t('logIn')}
                    size='medium'
                    fullWidth
                    className='border-white border hover:bg-gray-200 text-white hover:text-primary-green'
                    onClick={handleLoginPopup}
                  />
                </div>
                <div>
                  <Button
                    label={t('signUp')}
                    size='medium'
                    fullWidth
                    className='bg-gray-700 hover:bg-gray-800 text-gray-200 border border-gray-700 hover:border-gray-800'
                    onClick={() => navigate('/customerRegister')}
                  />
                </div>
              </div>
            )}

            {(isLogin === true) && (
              <div className="flex items-center gap-3">
                <DropdownHeader userEmail={account.email} logout={logout} />
                <Bell
                  notifications={notifications}
                />
              </div>
            )}

          </div>

        </nav>
      </header>

      <Login
        isOpen={loginPopupOpen}
        setIsOpen={handleLoginClose}
      />
    </div>
  );
}

export default Header;
