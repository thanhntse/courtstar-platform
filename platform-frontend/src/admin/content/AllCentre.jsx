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
import Feedback from "../../components/feedback";
import Pagination from "../../components/pagination";
import showAlert from "../../components/alert";

const AllCentre = () => {

  const { t } = useTranslation();
  const controller = new AbortController();
  const { signal } = controller;
  const items = [
    {
      key: 'all',
      label: t('allCenTre')
    },
    {
      key: 'thuDucCity',
      label: t('thuDucCity')
    },
    {
      key: 'district1',
      label: t('district1')
    },
    {
      key: 'district3',
      label: t('district3')
    },
    {
      key: 'district4',
      label: t('district4')
    },
    {
      key: 'district5',
      label: t('district5')
    },
    {
      key: 'district6',
      label: t('district6')
    },
    {
      key: 'district7',
      label: t('district7')
    },
    {
      key: 'district8',
      label: t('district8')
    },
    {
      key: 'district10',
      label: t('district10')
    },
    {
      key: 'district11',
      label: t('district11')
    },
    {
      key: 'district12',
      label: t('district12')
    },
    {
      key: 'binhTanDistrict',
      label: t('binhTanDistrict')
    },
    {
      key: 'binhThanhDistrict',
      label: t('binhThanhDistrict')
    },
    {
      key: 'goVapDistrict',
      label: t('goVapDistrict')
    },
    {
      key: 'phuNhuanDistrict',
      label: t('phuNhuanDistrict')
    },
    {
      key: 'tanBinhDistrict',
      label: t('tanBinhDistrict')
    },
    {
      key: 'tanPhuDistrict',
      label: t('tanPhuDistrict')
    },
    {
      key: 'nhaBeProvince',
      label: t('nhaBeProvince')
    },
    {
      key: 'canGioProvince',
      label: t('canGioProvince')
    },
    {
      key: 'cuChiProvince',
      label: t('cuChiProvince')
    },
    {
      key: 'hocMonProvince',
      label: t('hocMonProvince')
    },
    {
      key: 'binhChanhProvince',
      label: t('binhChanhProvince')
    }
  ];

  const ratingItems = [
    { key: 'all', label: t('allRating') },
    { key: '1', label: t('1star') },
    { key: '2', label: t('2star') },
    { key: '3', label: t('3star') },
    { key: '4', label: t('4star') },
    { key: '5', label: t('5star') },
  ];
  const deleteItems = [
    { key: 'all', label: t('allStatus') },
    { key: 'true', label: t('deleted') },
    { ket: 'false', label: t('active') }
  ];
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

  const [filteredCentres, setFilteredCentres] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [deleteFilter, setDeleteFilter] = useState('all');
  const handleSelect = (item) => {
    console.log(`Selected: ${item}`);
  };

  const load = async () => {
    setLoading(true)
    await axiosInstance.get(`/courtstar/centre/allCentre`, { signal })
      .then(res => {
        setListCentre(res.data.data.reverse());
        setFilteredCentres(res.data.data);
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

  const handleSelectDistrict = (item) => {
    setDistrictFilter(item.key);
  };

  const handleSelectRating = (item) => {
    setRatingFilter(item.key);
  };
  const handleSelectDelete = (item) => {
    setDeleteFilter(item.key);
  };

  useEffect(() => {
    const applyFilters = () => {
      let updatedCentres = listCentre;

      if (nameFilter) {
        updatedCentres = updatedCentres.filter(centre => centre.name.toLowerCase().includes(nameFilter.toLowerCase()));
      }

      if (emailFilter) {
        updatedCentres = updatedCentres.filter(centre => centre.managerEmail.toLowerCase().includes(emailFilter.toLowerCase()));
      }

      if (districtFilter && districtFilter !== 'all') {
        updatedCentres = updatedCentres.filter(centre => centre.district === districtFilter);
      }

      if (ratingFilter && ratingFilter !== 'all') {
        updatedCentres = updatedCentres.filter(centre => centre.currentRate === parseInt(ratingFilter));
      }
      if (deleteFilter !== 'all') {
        updatedCentres = updatedCentres.filter(centre => centre.deleted === Boolean(deleteFilter));
      }

      setFilteredCentres(updatedCentres);
    };

    applyFilters();
  }, [nameFilter, emailFilter, districtFilter, ratingFilter, deleteFilter, listCentre]);


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

  const handleDelete = async (centreId) => {
    setDeleteLoading(true);
    await axiosInstance.post(`/courtstar/centre/delete/${centreId}`)
      .then(res => {
        if (res.data.data) {
          toast.success('Delete successfully', {
            toastId: 'delete-success'
          });
          setIsOpenModal(false);
          load();
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

  const indexOfLastCentre = currentPage * itemsPerPage;
  const indexOfFirstCentre = indexOfLastCentre - itemsPerPage;
  const currentListCentres = filteredCentres.slice(indexOfFirstCentre, indexOfLastCentre);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const centreInfo = (
    <>
      {centreDetail &&
        <>
          <div
            className="h-[calc(75vh)] w-[calc(80vw)] overflow-y-auto px-2 mx-2"
          >
            <div className="">
              <div className="flex justify-between gap-4">
                <div className="w-[44rem]">
                  <XCarousel images={centreDetail?.images} />
                </div>

                <div className="flex-1 w-[410px] flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-lg font-semibold">
                          {t('information')}
                          {(centreDetail?.deleted)
                            ?
                            <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-md font-semibold">
                              {t('deleted')}
                            </div>
                            :
                            <div className="font-semibold">
                              {centreDetail?.status
                                ?
                                <div className="bg-primary-green text-white text-sm px-3 py-1 rounded-md">
                                  {t('opening')}
                                </div>
                                :
                                <div className="bg-black text-white px-3 text-sm py-1 rounded-md">
                                  {t('closed')}
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
                        <div className="grid grid-cols-2 gap-x-20">
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
                                    {court.status ? t('active') : t('close')}
                                  </div>
                                </div>
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
                  <span className='text-3xl font-medium'>{t('feedbacks')}</span>
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
          </div>

          {!centreDetail?.deleted
            &&
            <div className="pt-2">
              <Button
                className="text-center text-red-500 text-lg font-semibold w-full py-1 border-red-500 border-2 rounded hover:bg-red-500 hover:text-white"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>}
                label={t('delete')}
                onClick={() => {
                  showAlert({
                    title: t('areYouSure') + "?",
                    message: t('youAllowDeleteThisCentre') + "!",
                    type: 'warning',
                    onConfirmClick: () => handleDelete(centreDetail?.id)
                  });
                }}
                loading={deleteLoading}
                loadingColor='#ef4444'
              />
            </div>
          }

        </>
      }
    </>
  );

  return (
    <>
      <PopupModal
        isOpen={isOpenModal}
        setIsOpen={() => {
          setIsOpenModal(false);
          setCentreDetail();
        }}
        html={centreInfo}
        title={centreDetail?.name}
        centreInfo
      />
      <div id="top"
        className="py-6 w-full">
        <div className="flex justify-between">
          <div className="text-3xl font-bold">
            {t('allCenTre')}
          </div>
        </div>
        {loading
          ?
          <div className="h-[500px] flex items-center justify-center">
            <SpinnerLoading
              height='80'
              width='80'
              color='#2B5A50'
            />
          </div>
          :
          <>
            <div className="mt-5 mb-10">
              <div className="px-10 bg-white py-4 grid grid-cols-5 gap-x-1 rounded-xl shadow">
                <div className="">
                  <InputText
                    placeholder={t('enterCentreName')}
                    label={t('centreName')}
                    value={nameFilter}
                    onchange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                <div className="">
                  <InputText
                    placeholder={t('enterManagerEmail')}
                    label="Email"
                    value={emailFilter}
                    onchange={(e) => setEmailFilter(e.target.value)}
                  />
                </div>
                <div className="">
                  <div className="font-semibold mb-2">{t('district')}</div>
                  <Dropdown
                    placeholder={t('selectTheDistrict')}
                    items={items}
                    onSelect={handleSelectDistrict}
                    buttonClassName='!px-3'
                  />
                </div>

                <div className="">
                  <div className="font-semibold mb-2">{t('feedback')}</div>
                  <Dropdown
                    placeholder={t('selectRating')}
                    items={ratingItems}
                    onSelect={handleSelectRating}
                    buttonClassName='!px-3'
                  />
                </div>
                <div className="">
                  <div className="font-semibold mb-2">{t('status')}</div>
                  <Dropdown
                    placeholder={t('selectStatus')}
                    items={deleteItems}
                    onSelect={handleSelectDelete}
                    buttonClassName='!px-3'
                  />
                </div>
              </div>

              <div className="mt-2">
                {currentListCentres.length
                  ?
                  <>
                    {currentListCentres?.map(centre => (
                      <div
                        key={centre.id}
                        className="bg-white px-10 py-3 grid grid-cols-5 content-center gap-2 font-medium hover:bg-teal-50 hover:px-8 cursor-pointer mt-1 rounded-lg shadow-sm ease-in-out duration-300"
                        onClick={() => openCentreDetail(centre.id)}
                      >
                        <div className="ml-5 truncate">
                          {centre.name}
                        </div>
                        <div className="ml-5 truncate">
                          {centre.managerEmail}
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
                            {t('deleted')}
                          </div>
                          :
                          <div className="mx-auto text-white text-xs font-semibold px-2 py-1 bg-primary-green rounded-md">
                             {t('active')}
                          </div>
                        }
                      </div>
                    ))}
                  </>
                  :
                  <div className='flex flex-col items-center justify-center h-[500px] text-3xl text-primary mx-auto'>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="250" height="250"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-search-x"
                    >
                      <path d="m13.5 8.5-5 5" />
                      <path d="m8.5 8.5 5 5" />
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    No centre found.
                  </div>
                }

              </div>
            </div>
          </>
        }
        {filteredCentres.length > itemsPerPage
          &&
          <Pagination
            totalItems={filteredCentres.length}
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
