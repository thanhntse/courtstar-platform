import React, { useEffect, useState } from 'react';
import AddStaff from './AddStaff';
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import Button from '../components/button';

function StaffInfo() {
  const controller = new AbortController();
  const { signal } = controller;
  const { t } = useTranslation();
  const { id } = useParams();
  //HANDLE  POPUP
  const [addStaffPopup, setAddStaffPopup] = useState(false);
  const handleAddStaffPopup = () => {
    setAddStaffPopup(true);
  }
  const handleAddStaffPopupClose = () => {
    setAddStaffPopup(false)
  }
  const [staffInfo, setStaffInfo] = useState([]);
  const loadStaffInfo = async () => {
    try {
      const res = await axiosInstance.get(`/courtstar/staff/centre/${id}`, { signal });
      setStaffInfo(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadStaffInfo();

    return () => {
      controller.abort();
    }
  }, [id]);

  return (
    <div className="w-[70rem] my-12">
      <AddStaff
        id={id}
        isOpen={addStaffPopup}
        setIsOpen={handleAddStaffPopupClose}
        loadStaffInfo={loadStaffInfo}
      />
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          {t('staffInformation')}
        </div>
        <div>
          <Button
            label={t('addStaff')}
            fullWidth
            size='medium'
            className='bg-primary-green hover:bg-teal-900 text-white'
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
            }
            onClick={handleAddStaffPopup}
          />
        </div>

      </div>


      {
        staffInfo.length
          ?
          <div className="bg-white rounded-xl mt-4">
            <div className="flex bg-primary-green text-white text-lg font-semibold rounded-t-lg divide-x-2">
              <div className="w-1/3 px-8 py-2 ">
                {t('fullName')}
              </div>
              <div className="w-1/3 px-8 py-2 ">
                Email
              </div>
              <div className="w-1/6 px-8 py-2 ">
                {t('phone')}
              </div>
              <div className="">

              </div>
            </div>
            <div className="divide-y-2">
              {staffInfo.map((staff) => (
                <div
                  key={staff.id}
                  className="flex divide-x-2"
                >
                  <div className="w-1/3 px-8 truncate py-2">
                    {staff.account.firstName} {staff.account.lastName}
                  </div>
                  <div className="w-1/3 px-8 py-2 ">
                    {staff.account.email}
                  </div>
                  <div className="w-1/6 px-8 py-2">
                    {staff.account.phone}
                  </div>
                  <div className="flex flex-1 items-center justify-center gap-8">
                    <div className="p-1.5 rounded-full hover:bg-emerald-900 hover:text-white cursor-pointer ease-in-out duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                    </div>
                    <div className="p-1.5 rounded-full hover:bg-red-600 hover:text-white cursor-pointer ease-in-out duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          :
          <div className="flex flex-col items-center justify-center h-96 text-3xl text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="300" height="300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-users-round">
              <path d="M18 21a8 8 0 0 0-16 0" />
              <circle cx="10" cy="8" r="5" />
              <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
            </svg>
            There are no staffs yet!
          </div>
      }


    </div>
  );
}

export default StaffInfo;
