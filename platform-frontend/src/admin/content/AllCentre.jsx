import { useEffect, useState } from "react";
import Dropdown from "../../components/dropdown";
import InputText from "../../components/input-text";
// import star from '../assets/images/star.svg';
import Rating from "../../components/Rating";
import axiosInstance from "../../config/axiosConfig";
import SpinnerLoading from "../../components/SpinnerLoading";
import { useTranslation } from "react-i18next";
import PopupModal from "../../components/PopupModal";
import Button from "../../components/button";
import XCarousel from "../../components/carousel";
import moment from "moment";
import Calendar from "../../components/calendar";
import { toast } from "react-toastify";
import EditCentre from "./EditCentre";
import Feedback from "../../components/feedback";
import Pagination from "../../components/pagination";

const AllCentre = () => {

  const { t } = useTranslation();
  const controller = new AbortController();
  const { signal } = controller;
  const items = ['Item 1', 'Item 2', 'Item 3'];
  const [listCentre, setListCentre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centreDetail, setCentreDetail] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const handleSelect = (item) => {
    console.log(`Selected: ${item}`);
  };

  useEffect(() => {
    const load = async () => {
      await axiosInstance.get(`/courtstar/centre/allCentre`, { signal })
        .then(res => {
          setListCentre(res.data.data.reverse())
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
    load();
  }, [])

  // const loadFeedback = async (id) => {
  //   setLoadingFeedback(true);
  //   await axiosInstance.get(`/courtstar/feedback/${id}`)
  //     .then(res => {
  //       setFeedbackList(res.data.data);
  //       console.log(res.data.data);
  //     })
  //     .catch(error => {
  //       console.log(error.message);
  //     })
  //     .finally(() => {
  //       setLoadingFeedback(false);
  //     })
  // }

  const openCentreDetail = async (id) => {
    let centreClone = listCentre.filter(
      (centre) => centre.id === id
    );
    setCentreDetail(centreClone[0]);
    setIsOpenModal(true)
    setLoadingFeedback(true);
    await axiosInstance.get(`/courtstar/feedback/${id}`)
      .then(res => {
        setFeedbackList(res.data.data);
        console.log(res.data.data);
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        setLoadingFeedback(false);
      })
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

  const [editCentreModal, setEditCentreModal] = useState(false);
  const openEditCentreModal = () => {
    setEditCentreModal(true);
  }
  const closeEditCentreModal = () => {
    setEditCentreModal(false)
  }

  console.log(centreDetail?.images);

  const indexOfLastCentre = currentPage * itemsPerPage;
  const indexOfFirstCentre = indexOfLastCentre - itemsPerPage;
  const currentListCentres = listCentre.slice(indexOfFirstCentre, indexOfLastCentre);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const centreInfor = (
    <>
      {/* <EditCentre
        isOpen={editCentreModal}
        setIsOpen={closeEditCentreModal}
        centreDetail={centreDetail}
        imgList={centreDetail?.images}
      // dataIdCentre={handleGetCentreID}
      /> */}
      {centreDetail &&
        <div
          className="h-[calc(80vh)] w-[calc(80vw)] overflow-y-auto px-2 mx2"
        >
          {/* <div className="flex items-center justify-between py-3">
            <div className="text-2xl font-semibold ">
              {centreDetail?.name}
            </div>
            {(centreDetail?.deleted)
              ?
              <div className="bg-red-500 text-white px-3 py-1 rounded-xl font-semibold">
                Deleted
              </div>
              :
              <div className="font-semibold">
                {centreDetail?.status
                  ?
                  <div className="bg-primary-green text-white px-3 py-1 rounded-xl">
                    Opening
                  </div>
                  :
                  <div className="bg-red-500 text-white px-3 py-1 rounded-xl">
                    Closed
                  </div>
                }
              </div>
            }

          </div> */}

          <div className="flex justify-between gap-4">
            <div className="w-[44rem]">
              <XCarousel images={centreDetail?.images} />
            </div>

            <div className="flex-1 w-[410px] flex flex-col gap-3">

              {/* <div className="flex gap-3 font-semibold">
                {centreDetail?.deleted
                  ?
                  <div className="bg-red-800 py-2.5 text-lg text-white w-full flex items-center justify-center rounded-md">
                    Deleted
                  </div>
                  :
                  <>
                    {
                      centreDetail?.status
                        ?
                        <>
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
                          />

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
                            onClick={() => handleDelete(centreDetail.id)}
                            loading={deleteLoading}
                          />
                        </>
                        :
                        <>
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
                          />
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
                            onClick={() => handleDelete(centreDetail.id)}
                            loading={deleteLoading}
                          />
                        </>
                    }
                  </>
                }

              </div>

              <div className='w-full h-0.5 bg-slate-600 rounded-full'>
              </div> */}

              <div className="flex flex-col gap-3">
                <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-lg font-semibold">
                      {t('information')}
                      {/* {!(centreDetail?.deleted) &&
                        <button
                          className="flex justify-center items-center text-primary-green  rounded-md
                          px-2 hover:bg-primary-green hover:text-white ease-in-out duration-300 cursor-pointer"
                          onClick={openEditCentreModal}
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
                        </button>
                      } */}
                      {(centreDetail?.deleted)
                        ?
                        <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-md font-semibold">
                          Deleted
                        </div>
                        :
                        <div className="font-semibold">
                          {centreDetail?.status
                            ?
                            <div className="bg-primary-green text-white text-sm px-3 py-1 rounded-md">
                              Opening
                            </div>
                            :
                            <div className="bg-black text-white px-3 text-sm py-1 rounded-md">
                              Closed
                            </div>
                          }
                        </div>
                      }
                    </div>
                    <div className="px-2">
                      <div>
                        <span className='font-semibold'>{t('address')}: </span>
                        {centreDetail.address}
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

                    </div>
                  </div>
                </div>

                {centreDetail?.description &&
                  <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow">
                    <span className='font-semibold'>{t('description')}: </span>
                    <div dangerouslySetInnerHTML={{ __html: centreDetail.description }}>
                    </div>
                  </div>
                }

                <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <div>
                      <span className='font-semibold'>{t('numberOfCourts')}: </span>
                      {centreDetail.numberOfCourts}
                    </div>
                  </div>
                  <div className="mx-auto">
                    <div className="grid grid-cols-2 gap-x-5">
                      {centreDetail?.courts?.map((court, index) => (
                        <div
                          key={court.id}
                          className="flex items-center gap-1"
                        >
                          <div className="">
                            {court.courtNo}.
                          </div>
                          <div className="flex justify-between gap-1 w-full items-center">
                            <div className="flex gap-1 ">
                              <div className='font-semibold'>{t('status')}:</div>
                              <div className={court.status ? 'font-semibold text-primary-green' : 'font-semibold text-red-500'}>
                                {court.status ? 'Active' : 'Close'}
                              </div>
                            </div>
                            {/* {!(centreDetail?.deleted) &&
                              <>
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
                              </>
                            } */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="top" className='flex-1 bg-white rounded-lg shadow-md my-3'>
            <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
              <span className='text-3xl font-medium'>Feedbacks</span>
            </div>
            {loadingFeedback
              ?
              <SpinnerLoading
                height='80'
                width='80'
                color='#2B5A50'
              />
              :
              <div className="">
                <Feedback
                  listItem={feedbackList}
                  itemsPerPage={10}
                />
              </div>
            }

          </div>

        </div>
      }
    </>
  );

  return (
    <>
      <PopupModal
        isOpen={isOpenModal}
        setIsOpen={() => {
          setIsOpenModal(false);
        }}
        html={centreInfor}
        title={centreDetail?.name}
        centreInfo
      />
      <div id="top"
      className="py-5 px-7">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">
          {t('allCenTre')}
          </div>
        </div>

        <div className="bg-white rounded-xl mt-5 shadow mb-10">
          <div className="px-10 pt-6 grid grid-cols-4 gap-x-1">
            <div className="">
              <InputText
                id="name"
                name="name"
                placeholder="Enter name of centre"
                label="Name"
              />
            </div>
            <div className="">
              <div className="font-semibold mb-2">District</div>
              <Dropdown
                placeholder="Select district"
                items={items}
                onSelect={handleSelect}
                buttonClassName='!px-3'
              />
            </div>

            <div className="">
              <div className="font-semibold mb-2">Feedback</div>
              <Dropdown
                placeholder="Rating star"
                items={items}
                onSelect={handleSelect}
              />
            </div>
            <div className="">
              <div className="font-semibold mb-2">Status</div>
              <Dropdown
                placeholder="Select status"
                items={items}
                onSelect={handleSelect}
                buttonClassName='!px-3'
              />
            </div>
          </div>
          <div className="divide-y-2 mt-2">

            {loading
              ?
              <SpinnerLoading
                height='80'
                width='80'
                color='#2B5A50'
              />
              :
              <>
                {currentListCentres?.map(centre => (
                  <div
                    key={centre.id}
                    className="px-10 py-3 grid grid-cols-4 content-center gap-2 font-medium hover:bg-slate-100 cursor-pointer"
                    onClick={() => openCentreDetail(centre.id)}
                  >
                    <div className="ml-5 truncate">
                      {centre.name}
                    </div>
                    <div className="ml-5 truncate">
                      {t(centre.district)}
                    </div>
                    <div className="mx-auto">
                      <Rating
                        ratingWrapper='flex gap-1'
                        value={centre.currentRate}
                        editable={false}
                      />
                    </div>
                    {centre.deleted === true
                      ?
                      <div className="mx-auto text-white text-xs font-semibold px-2 py-1 bg-rose-500 rounded-md">
                        Unavailable
                      </div>
                      :
                      <div className="mx-auto text-white text-xs font-semibold px-2 py-1 bg-primary-green rounded-md">
                        Available
                      </div>
                    }
                    {/* <div className="flex flex-1 items-center justify-end gap-3">
                    <div className="p-1.5 rounded-full hover:bg-emerald-900 hover:text-white cursor-pointer ease-in-out duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                    </div>
                    <div className="p-1.5 rounded-full hover:bg-red-600 hover:text-white cursor-pointer ease-in-out duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                    </div>
                  </div> */}
                  </div>
                ))}
              </>
            }
          </div>
        </div>
                      { listCentre.length > itemsPerPage
                    &&
                    <Pagination
                      totalItems={listCentre.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                      }
      </div>
    </>
  );
}

export default AllCentre;
