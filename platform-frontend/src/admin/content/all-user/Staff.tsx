import { useEffect, useState } from 'react'
// import Dropdown from "../../../components/dropdown";
import InputText from "../../../components/input-text";
import axiosInstance from '../../../config/axiosConfig';
import SpinnerLoading from '../../../components/SpinnerLoading';
import { toast } from 'react-toastify';
import Pagination from '../../../components/pagination';
import { useTranslation } from 'react-i18next';
import showAlert from '../../../components/alert';


const Staff = () => {
  const { t } = useTranslation();
  const controller = new AbortController();
  const { signal } = controller;
  const [listStaff, setListStaff] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  // const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filteredStaff, setFilteredStaff] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');

  useEffect(() => {
    const applyFilters = () => {
      let updatedStaff = listStaff;

      if (nameFilter) {
        updatedStaff = updatedStaff.filter(staff =>
          staff.account.firstName.toLowerCase().includes(nameFilter.toLowerCase()) ||
          staff.account.lastName.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (emailFilter) {
        updatedStaff = updatedStaff.filter(staff => staff.account.email.toLowerCase().includes(emailFilter.toLowerCase()));
      }

      if (phoneFilter) {
        updatedStaff = updatedStaff.filter(staff => staff.account.phone.toLowerCase().includes(phoneFilter.toLowerCase()));
      }

      setFilteredStaff(updatedStaff);
    };

    applyFilters();
  }, [nameFilter, emailFilter, phoneFilter, listStaff]);

  const load = async () => {
    await axiosInstance.get(`/courtstar/staff`, { signal })
      .then(res => {
        setListStaff(res.data.data.map(item => {
          return { ...item, loading: false };
        }));
        setFilteredStaff(res.data.data);
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  }

  useEffect(() => {
    load();
  }, [])

  console.log(listStaff);

  const deleteStaff = async (id, index) => {
    setListStaff(prevListCourt => {
      // Create a copy of the previous state array
      const updatedListCourt = [...prevListCourt];

      // Update the specific element's loading property
      updatedListCourt[index] = { ...updatedListCourt[index], loading: true };

      return updatedListCourt;
    });
    await axiosInstance.post(`/courtstar/account/${id}`, { signal })
      .then(res => {
        console.log(res.data);
        toast.success("Delete Successfully!", {
          toastId: 'delete-manager-success'
        });
        load();
      })
      .catch(error => {
        console.log(error.message);
        toast.error(error.message, {
          toastId: 'delete-manager-error'
        });
      })
      .finally(
        // () => {
        //   setLoadingDelete(false);
        // }
      );
  }
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastStaff = currentPage * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentListStaff: any = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  return (
    <div className="py-6 w-full">
      <div className="flex justify-between">
        <div className="text-3xl font-bold">
        {t('staffs')}
        </div>
      </div>

      {loading
        ?
        (
          <div className="h-[500px] flex items-center justify-center">
            <SpinnerLoading
              height="80"
              width="80"
              color="#2B5A50"
            />
          </div>
        ) : (
          <>
            <div className="mt-5">
              <div className="bg-white rounded-xl px-10 py-4 grid grid-cols-12 gap-2">
                <div className="col-span-4 ">
                  <InputText
                    id="name"
                    name="name"
                    placeholder={t('enterStaffName')}
                    label={t('staffName')}
                    value={nameFilter}
                    onchange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                <div className="col-span-4 ">
                  <InputText
                    id="email"
                    name="email"
                    placeholder={t('enterStaffEmail')}
                    label="Email"
                    value={emailFilter}
                    onchange={(e) => setEmailFilter(e.target.value)}
                  />
                </div>
                <div className="col-span-3 ">
                  <InputText
                    id="phone"
                    name="phone"
                    placeholder={t('enterStaffPhone')}
                    label={t('phone')}
                    value={phoneFilter}
                    onchange={(e) => setPhoneFilter(e.target.value)}
                  />
                </div>
                <div className="col-span-1 ">

                </div>
              </div>

              <div className="mt-2 font-medium">
                {currentListStaff.length ? (
                  <>
                    {currentListStaff.map((staff, index) => (
                      <div
                        key={staff.account.id}
                        className="bg-white px-10 py-3 grid grid-cols-12 content-center gap-2 font-medium mt-1 rounded-lg shadow-sm"
                      >
                        <div className="col-span-4 content-center truncate ml-4">
                          {staff.account.firstName} {staff.account.lastName}
                        </div>
                        <div className="col-span-4 content-center truncate ml-4">
                          {staff.account.email}
                        </div>
                        <div className="col-span-3 content-center ml-4">
                          {staff.account.phone}
                        </div>
                        <div className="mx-auto col-span-1">
                          {staff.loading ? (
                            <SpinnerLoading height="30" width="30" color="#2B5A50" />
                          ) : (
                            <>
                              {staff.account.deleted ? (
                                <div className="p-1.5 rounded-full text-red-500">
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
                                    className="lucide lucide-trash-2"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                    <line x1="2" y1="2" x2="22" y2="22" />
                                  </svg>
                                </div>
                              ) : (
                                <div
                                  className="p-1.5 rounded-full hover:bg-red-600 hover:text-white cursor-pointer ease-in-out duration-300"
                                  onClick={() => {
                                    showAlert({
                                      title: t('areYouSure') + "?",
                                      message: t('youDeleteThisStaffAccount') + "!",
                                      type: 'warning',
                                      onConfirmClick: () => deleteStaff(staff.account.id, index)
                                    });
                                  } }
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
                                    className="lucide lucide-trash-2"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                  </svg>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center h-[500px] text-3xl text-primary mx-auto'>
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
                    No staff found.
                  </div>
                )}
              </div>
            </div>
            {listStaff.length > itemsPerPage && (
              <Pagination
                totalItems={listStaff.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
    </div>
  );

}
export default Staff
