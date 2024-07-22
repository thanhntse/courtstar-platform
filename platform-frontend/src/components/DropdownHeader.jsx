import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import SpinnerLoading from './SpinnerLoading';
import { t } from 'i18next';

function Dropdown(props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleSelectItem = (item) => {
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='w-full relative' ref={dropdownRef}>
      {props.loadingLogout
        ?
        <div className="rounded-lg py-2 px-2 gap-1 flex justify-between items-center bg-gray-800 text-white font-semibold text-sm">
          {props.userEmail}
          <SpinnerLoading
            width='20'
            height='20'
            color='#fff'
          />
        </div>
        :
        <>
          <button
            className="rounded-lg py-2 px-2 gap-1 flex justify-between items-center bg-gray-800"
            onClick={toggleDropdown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <div className='text-sm text-white font-semibold'>
              {props.userEmail}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isOpen ? 'rotate-180 lucide lucide-chevron-down' : 'lucide lucide-chevron-down'}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isOpen && (
            <div
              className="z-50 fixed font-semibold bg-white shadow-gray-800 shadow-md rounded-lg p-1 mt-1.5"
            >
              <Link className='flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-100'
                to="/profile"
                onClick={handleSelectItem}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
               {t('yourProfile')}
              </Link>
              <Link className='flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-100'
                to="/bookingHistory"
                onClick={handleSelectItem}
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-history"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
                {t('bookingHistory')}
              </Link>
              <button className='flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-100'
                onClick={props.logout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-log-out">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                {t('logOut')}
              </button>
            </div>
          )}
        </>
      }
    </div>
  );
}

export default Dropdown;
