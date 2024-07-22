import { useEffect, useState } from 'react';
import AddStaff from './AddStaff';
import EditStaff from './EditStaff'; // Import EditStaff
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import axiosInstance from '../../../../config/axiosConfig';
import Button from '../../../../components/button';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import Pagination from '../../../../components/pagination';
import { toast } from "react-toastify";
import showAlert from '../../../../components/alert';

function StaffInfo() {
  const controller = new AbortController();
  const { signal } = controller;
  const { t } = useTranslation();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(true); // Add loading state

  //HANDLE POPUP
  const [addStaffPopup, setAddStaffPopup] = useState(false);
  const handleAddStaffPopup = () => {
    setAddStaffPopup(true);
  };
  const handleAddStaffPopupClose = () => {
    setAddStaffPopup(false);
  };

  // HANDLE EDIT STAFF POPUP
  const [editStaffPopup, setEditStaffPopup] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState();
  const handleEditStaffPopup = (staffId) => {
    setSelectedStaffId(staffId);
    setEditStaffPopup(true);
  };
  const handleEditStaffPopupClose = () => {
    setEditStaffPopup(false);
  };

  // HANDLE DELETE STAFF
  const handleDeleteStaff = async (staffId) => {
    try {
      await axiosInstance.post(`/courtstar/account/${staffId}`);
      loadStaffInfo(); // Reload the staff list after deletion
    } catch (error) {
      console.log(error.message);
    } finally {
      toast.success(t('deleteStaffSuccess'), {
        toastId: 'delete-staff-success'
      });
    }
  };

  const [staffInfo, setStaffInfo] = useState([]);
  const loadStaffInfo = async () => {
    try {
      const res = await axiosInstance.get(`/courtstar/staff/centre/${id}`, { signal });
      setStaffInfo(res.data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    loadStaffInfo();

    return () => {
      controller.abort();
    };
  }, [id]);

  const indexOfLastStaff = currentPage * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentListStaff = staffInfo.slice(indexOfFirstStaff, indexOfLastStaff);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-[70rem] my-12">
      <AddStaff
        id={id}
        isOpen={addStaffPopup}
        setIsOpen={handleAddStaffPopupClose}
        loadStaffInfo={loadStaffInfo}
      />
      <EditStaff
        isOpen={editStaffPopup}
        setIsOpen={handleEditStaffPopupClose}
        staffId={selectedStaffId}
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
        loading ? (
          <div className="flex justify-center items-center h-96">
            <SpinnerLoading type="page" height="80" width="80" color='#2B5A50' />
          </div>
        ) : (
          staffInfo.length ? (
            <div className="mt-4">
              <div className="flex bg-white rounded-xl shadow-lg text-lg font-semibold rounded-t-lg">
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
              <div className="mt-2">
                {currentListStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex bg-white shadow font-medium py-1.5 rounded-xl mt-1"
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
                      <div className="p-1.5 rounded-full hover:bg-emerald-900 hover:text-white cursor-pointer ease-in-out duration-300"
                        onClick={() => handleEditStaffPopup(staff.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                      </div>
                      <div className="p-1.5 rounded-full hover:bg-red-600 hover:text-white cursor-pointer ease-in-out duration-300"
                        onClick={() => {
                          showAlert({
                            title: t('areYouSure') + "?",
                            message: t('youDeleteThisStaffAccount') + "!",
                            type: 'warning',
                            onConfirmClick: () =>  handleDeleteStaff(staff.account.id)
                          });
                        }}
                      >
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-trash-2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
          )
        )
      }
      {staffInfo.length > itemsPerPage &&
        <Pagination
          totalItems={staffInfo.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      }
    </div>
  );
}

export default StaffInfo;
