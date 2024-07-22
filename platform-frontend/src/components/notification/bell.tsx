import React, { useState, useEffect, useRef } from 'react';
import bell from '../../assets/images/bell.svg';
import { Notification, NotificationProps } from "./index";
import NotificationItem from './notification';
import axiosInstance from '../../config/axiosConfig';

const Bell: React.FC<NotificationProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await axiosInstance.put(`/courtstar/notification/${notification.id}`);
      console.log(`Seen notification ${notification.id} successfully!`);
    } catch (error) {
      console.error("Error updating notification status", error);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative rounded-full w-8 h-8 flex justify-center items-center transition-all duration-300 ease-in-out focus:outline-none hover:bg-gray-800"
      >
        <img src={bell} alt="bell" className="w-6 h-6" />
        {notifications && notifications.length > 0 && notifications.some(notification => !notification.status) && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center p-1 h-2 w-2 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className='z-50 fixed w-full 1440:w-[1440px] left-1/2 -translate-x-1/2 right-0 flex justify-end'>
          <div className={`mt-2.5 w-[400px] bg-white border border-gray-200 rounded-lg shadow-lg`}>
            <div className="p-3">
              <h4 className="text-lg font-semibold text-gray-700 text-center">Notifications</h4>
              {notifications?.length === 0 && (
                <p className="text-gray-500">No new notifications</p>
              )}
              <div className="mt-2 max-h-[400px] overflow-y-auto">
                {notifications?.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onNotificationClick={handleNotificationClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bell;
