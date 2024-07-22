import { useEffect, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../config/axiosConfig';
import EditCentre from './EditCentre';
import XCarousel from '../../../components/carousel';
import Button from '../../../components/button';
import SpinnerLoading from '../../../components/SpinnerLoading';
import Calendar from '../../../components/calendar';
import Feedback from '../../../components/feedback';
import showAlert from '../../../components/alert';

function CentreInfo(props) {
  const { t } = useTranslation();
  const { state, dispatch } = useAuth();
  const { role } = state;
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [addCourtLoading, setAddCourtLoading] = useState(false);
  const [centreDetail, setCentreDetail] = useState();
  const imgList = props.imgList;
  const apiFeedbacks = props.apiFeedbacks;
  const controller = new AbortController();
  const { signal } = controller;
  const [isEditCourt, setIsEditCourt] = useState();
  const [courtNo, setCourtNo] = useState();
  const [listCourt, setListCourt] = useState([]);

  useEffect(() => {
    if (props.centreDetail) {
      setCentreDetail(props.centreDetail);
    }
  }, [props.centreDetail])

  useEffect(() => {
    if (centreDetail) {
      props.dataCenterOnSubmit(centreDetail);
    }
  }, [centreDetail])

  useEffect(() => {
    const loadCourt = async () => {
      await axiosInstance.get(`/courtstar/court/${centreDetail.id}`, { signal })
        .then(res => {
          setListCourt(res.data.data.map(item => {
            return { ...item, loading: false };
          }));
        })
        .catch(error => {
          console.log(error.message);
        })
        .finally(
          () => {
            // setLoading(false);
          }
        );
    }
    if (centreDetail?.id) loadCourt();
  }, [isEditCourt, centreDetail])

  const loadCalendar = async () => {
    await axiosInstance.get(`/courtstar/centre/getCentre/${centreDetail.id}`, { signal })
      .then(res => {
        setCentreDetail(res.data.data);
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(

    );
  }

  const editCourtStatus = async (courtNo, index) => {
    setListCourt(prevListCourt => {
      // Create a copy of the previous state array
      const updatedListCourt = [...prevListCourt];

      // Update the specific element's loading property
      updatedListCourt[index] = { ...updatedListCourt[index], loading: true };

      return updatedListCourt;
    });
    await axiosInstance.post(`/courtstar/court/${centreDetail.id}/${courtNo}`)
      .then(res => {
        setIsEditCourt(res.data.data);
        loadCalendar();
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(
      // () => {

      // }
    );
  }

  const handleDisable = async (centreId) => {
    setActivateLoading(true);
    await axiosInstance.post(`/courtstar/centre/disable/${centreId}`)
      .then(res => {
        if (res.data.data) {
          setCentreDetail((prevForm) => ({
            ...prevForm,
            status: false
          }))
          toast.success('Disable successfully', {
            toastId: 'disable-success'
          });
        }
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'disable-unsuccess'
        });
      })
      .finally(
        () => {
          setActivateLoading(false);
        }
      );
  }

  const handleActive = async (centreId) => {
    setActivateLoading(true);
    await axiosInstance.post(`/courtstar/centre/active/${centreId}`)
      .then(res => {
        if (res.data.data) {
          setCentreDetail((prevForm) => ({
            ...prevForm,
            status: true
          }))
          toast.success('Active successfully', {
            toastId: 'active-success'
          });
        }
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'active-unsuccess'
        });
      })
      .finally(
        () => {
          setActivateLoading(false);
        }
      );
  }

  const handleDelete = async (centreId) => {
    setDeleteLoading(true);
    await axiosInstance.post(`/courtstar/centre/delete/${centreId}`)
      .then(res => {
        if (res.data.data) {
          toast.success('Delete successfully', {
            toastId: 'delete-success'
          });
          navigate(`/myCentre/balance`)
          window.location.reload();
        }
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'delete-unsuccess'
        });
      })
      .finally(
        () => {
          setDeleteLoading(false);
        }
      );
  }

  //add centre handle
  const [editCentreModal, setEditCentreModal] = useState(false);
  const openEditCentreModal = () => {
    setEditCentreModal(true);
  }
  const closeEditCentreModal = () => {
    setEditCentreModal(false)
  }


  const disableSlot = async (formCalendar) => {
    // setLoading(true);
    await axiosInstance.post(`/courtstar/slot/disable`, { bookingDetails: formCalendar })
      .then(res => {
        console.log(res.data.data);
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  }

  const handleAddCourt = async (centreId) => {
    setAddCourtLoading(true);
    await axiosInstance.post(`/courtstar/court/${centreId}`)
      .then(res => {
        setCentreDetail((prev) => ({
          ...prev,
          courts: res.data.data
        }));
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        setAddCourtLoading(false);
      });
  }

  return (
    centreDetail &&
    <div className="flex flex-1 flex-col gap-2 py-2">
      <EditCentre
        isOpen={editCentreModal}
        setIsOpen={closeEditCentreModal}
        centreDetail={centreDetail}
        imgList={imgList}
      />
      <div className="flex items-center justify-between py-3">
        <div className="text-2xl font-semibold ">
          {centreDetail.name}
        </div>
        <div className="font-semibold">
          {centreDetail.approveDate
            ?
            <>
              {centreDetail.status
                ?
                <div className="bg-primary-green text-white px-3 py-1 rounded-xl">
                  {t('opening')}
                </div>
                :
                <div className="bg-red-500 text-white px-3 py-1 rounded-xl">
                  {t('closed')}
                </div>
              }
            </>
            :
            <>
              <div className="bg-red-500 text-white px-3 py-1 rounded-xl">
                Pending
              </div>
            </>
          }

        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="">
          <XCarousel images={centreDetail.images} />
        </div>

        <div className="flex-1 flex flex-col gap-3">

          <div className="flex gap-3 font-semibold">
            {
              centreDetail.status
                ?
                <Button
                  label={t('close')}
                  fullWidth
                  size='medium'
                  className='bg-black text-white'
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole"><circle cx="12" cy="16" r="1" /><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" /></svg>
                  }
                  onClick={() => handleDisable(centreDetail.id)}
                  loading={activateLoading}
                  disabled={!centreDetail.approveDate}
                />
                :
                <Button
                  label={t('activate')}
                  fullWidth
                  size='medium'
                  className='bg-primary-green hover:bg-teal-900 text-white'
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole-open"><circle cx="12" cy="16" r="1" /><rect width="18" height="12" x="3" y="10" rx="2" /><path d="M7 10V7a5 5 0 0 1 9.33-2.5" /></svg>
                  }
                  onClick={() => handleActive(centreDetail.id)}
                  loading={activateLoading}
                  disabled={!centreDetail.approveDate}
                />
            }

            {role !== 'STAFF'
              &&
              <Button
                label={t('delete')}
                fullWidth
                size='medium'
                className='bg-red-600 hover:bg-red-800 text-white'
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
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
                }
                onClick={() => {
                  showAlert({
                    title: t('areYouSure') + "?",
                    message: t('youWillNotAbleToRecoverThisAction') + "!",
                    type: 'warning',
                    onConfirmClick: () => handleDelete(centreDetail.id)
                  });
                }}
                loading={deleteLoading}
                disabled={!centreDetail.approveDate}
              />
            }
          </div>

          <div className='w-full h-0.5 bg-slate-600 rounded-full'>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-lg font-semibold">
                  {t('information')}
                  {role !== 'STAFF' &&
                    <>
                      {centreDetail.approveDate &&
                        <button
                          className="flex justify-center items-center text-primary-green  rounded-md
                    px-2 hover:bg-primary-green hover:text-white ease-in-out duration-300 cursor-pointer"
                          onClick={openEditCentreModal}
                          disabled={!centreDetail.approveDate}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18" height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>}
                    </>
                  }

                </div>
                <div className="px-2">
                  <div>
                    <span className='font-semibold'>{t('address')}: </span>
                    {centreDetail.address}, {t(centreDetail.district)}
                  </div>

                  <div>
                    <span className='font-semibold'>{t('openTime')}: </span>
                    {moment(centreDetail.openTime, 'HH:mm:ss').format('HH:mm')} - {moment(centreDetail.closeTime, 'HH:mm:ss').format('HH:mm')}
                  </div>

                  <div>
                    <span className='font-semibold'>{t('price')}: </span>
                    <span className='font-semibold text-rose-600'>
                      {centreDetail?.pricePerHour?.toLocaleString('de-DE')} VND/h
                    </span>
                  </div>
                  <div>
                    <span className='font-semibold'>{t('description')}: </span>
                    <div dangerouslySetInnerHTML={{ __html: centreDetail?.description }}>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
              <div className="flex justify-between text-lg font-semibold">
                <div>
                  <span className='font-semibold'>{t('numberOfCourts')}: </span>
                  {centreDetail?.courts?.length}
                </div>

                {addCourtLoading
                  ?
                  <SpinnerLoading
                    width='18'
                    height='18'
                    color='#2B5A50'
                  />
                  :
                  <>
                    {centreDetail.approveDate &&
                      <button
                        className="flex justify-center items-center text-primary-green  rounded-md
                        px-2 hover:bg-primary-green hover:text-white ease-in-out duration-300 cursor-pointer"
                        onClick={() => {
                          showAlert({
                            title: t('areYouSure') + "?",
                            message: t('youWillNotAbleToRecoverThisAction') + "!",
                            type: 'warning',
                            onConfirmClick: () => handleAddCourt(centreDetail.id)
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18" height="18"
                          viewBox="0 0 24 24"
                          fill="none" stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-plus"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </button>
                    }
                  </>
                }

              </div>
              <div className="mx-auto">
                <div className="grid grid-cols-2 gap-x-3">
                  {listCourt.map((court, index) => (
                    <div
                      key={court.id}
                      className="flex items-center gap-1"
                    >
                      <div className="">
                        {court.courtNo}.
                      </div>
                      <div className="flex justify-between gap-1 w-full items-center text-sm">
                        <div className="flex gap-1 ">
                          <div className='font-semibold'>{t('status')}:</div>
                          <div className={court.status ? 'font-semibold text-primary-green' : 'font-semibold text-red-500'}>
                            {court.status ? t('active') : t('close')}
                          </div>
                        </div>
                        {
                          court.status
                            ?
                            <Button
                              className='p-1 hover:bg-slate-100'
                              icon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20" height="20"
                                  viewBox="0 0 24 24" fill="none"
                                  stroke="#000"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-lock-keyhole"
                                >
                                  <circle cx="12" cy="16" r="1" />
                                  <rect x="3" y="10" width="18" height="12" rx="2" />
                                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                                </svg>
                              }
                              onClick={() => editCourtStatus(court.courtNo, index)}
                              loading={court.loading}
                              loadingColor="#2B5A50"
                              loadingWidth="20"
                              loadingHeight="20"
                              disabled={!centreDetail.approveDate}
                            />
                            :
                            <Button
                              className='p-1 hover:bg-teal-50 '
                              icon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20" height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#2B5A50"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-lock-keyhole-open"
                                >
                                  <circle cx="12" cy="16" r="1" />
                                  <rect width="18" height="12" x="3" y="10" rx="2" />
                                  <path d="M7 10V7a5 5 0 0 1 9.33-2.5" />
                                </svg>
                              }
                              onClick={() => editCourtStatus(court.courtNo, index)}
                              loading={court.loading}
                              loadingColor="#2B5A50"
                              loadingWidth="20"
                              loadingHeight="20"
                            />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div id="manage" className='flex-1 rounded-lg shadow-gray-400 shadow-md'>
        <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
          <span className='text-3xl font-medium'> {t('manage')} </span>
        </div>
        <div className='bg-white rounded-b-lg p-8 pt-0'>
          <div className="">
            <Calendar
              handleButton={disableSlot}
              typeOfCalendar='manage'
              centre={centreDetail}
            />
          </div>
        </div>
      </div>

      <div id="top" className='flex-1 bg-white rounded-lg shadow-gray-400 shadow-md mt-3'>
        <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
          <span className='text-3xl font-medium'>{t('feedbacks')}</span>
        </div>
        <div className="">
          <Feedback
            listItem={apiFeedbacks}
            itemsPerPage={10}
          />
        </div>
      </div>

    </div>
  )
}

export default CentreInfo;
