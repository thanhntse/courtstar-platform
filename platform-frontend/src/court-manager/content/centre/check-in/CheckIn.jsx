import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import QrScanner from 'react-qr-scanner';
import axiosInstance from "../../../../config/axiosConfig";
import Button from "../../../../components/button";
import InputText from "../../../../components/input-text";
import Dropdown from "../../../../components/dropdown";
import PopupModal from "../../../../components/PopupModal";
import SpinnerLoading from "../../../../components/SpinnerLoading";
import Pagination from "../../../../components/pagination";

const CheckIn = (props) => {
  const [optionDropdownDate, setOptionDropdownDate] = useState([]);
  const { t } = useTranslation();
  const { id } = useParams(); // Get the booking ID from the URL parameters
  const [apiCheckin, setApiCheckin] = useState(); // State to hold the check-in data from the API
  const [checkInPopup, setCheckInPopup] = useState(false); // State to control the visibility of the check-in popup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formCheckIn, setFormCheckIn] = useState({});
  const [filteredCheckins, setFilteredCheckins] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterSlot, setFilterSlot] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    setApiCheckin(props.apiCheckin);
  }, [props.apiCheckin])

  // Function to open the check-in popup with the specified check-in details
  const handleCheckInPopup = (check_in) => {
    setFormCheckIn(check_in);
    setCheckInPopup(true);
  };

  // Effect to load the check-in data when the component mounts or when the booking ID changes
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const loadCheckIn = async () => {
      try {
        const res = await axiosInstance.get(`/courtstar/booking/${id}`, { signal });
        setApiCheckin(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    loadCheckIn();

    return () => {
      controller.abort();
    }
  }, [id]);

  // Function to handle the check-in process
  const handleCheckin = async (checkInId) => {
    setLoadingBtn(true);
    await axiosInstance.post(`/courtstar/check-in/${checkInId}`)
      .then(res => {
        if (res.data.data) {
          handleCheckInPopupClose();
          toast.success('Check-in successfully', {
            toastId: 'checkin-success'
          });
          // Reload the check-in data after successful check-in
          axiosInstance.get(`/courtstar/booking/${id}`)
            .then(res => {
              setApiCheckin(res.data.data);
            })
            .catch(error => {
              console.log(error.message);
            });
        }
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  // Function to handle the check-in process
  const handleQrCheckin = async (checkInId) => {
    setQrLoading(true);
    let bookingDetail = {};
    await axiosInstance.post(`/courtstar/check-in/qr/${checkInId}`)
      .then(res => {
        if (res.data.data) {
          toast.success('Check-in successfully', {
            toastId: 'checkin-success'
          });
          let detailId = res.data.data;
          // Reload the check-in data after successful check-in
          axiosInstance.get(`/courtstar/booking/${id}`)
            .then(res => {
              setApiCheckin(res.data.data);
              bookingDetail = res.data.data.filter(booking => booking.id === detailId)[0];
              setQrLoading(false);
              if (qrPopup) {
                handleQrPopupClose();
                handleCheckInPopup(bookingDetail);
              }
            })
            .catch(error => {
              console.log(error.message);
            });
        } else {
          toast.error('Có lỗi xảy ra!', {
            toastId: 'checkin-fail'
          });
          setQrLoading(false);
        }
      })
      .catch(error => {
        toast.error('Có lỗi xảy ra!', {
          toastId: 'checkin-fail'
        });
      })
      .finally(() => {
      });
  };

  // Function to handle the check-in process
  const handleUndoCheckin = async (checkInId) => {
    setLoadingBtn(true);
    await axiosInstance.post(`/courtstar/check-in/undo/${checkInId}`)
      .then(res => {
        if (res.data.data) {
          handleCheckInPopupClose();
          toast.success('Undo check-in successfully', {
            toastId: 'undo-checkin-success'
          });
          // Reload the check-in data after successful check-in
          const loadCheckIn = async () => {
            try {
              const res = await axiosInstance.get(`/courtstar/booking/${id}`);
              setApiCheckin(res.data.data);
            } catch (error) {
              console.log(error.message);
            }
          };
          loadCheckIn();
        }
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  // Function to close the check-in popup
  const handleCheckInPopupClose = () => {
    setCheckInPopup(false);
  };



  //HANDLE QR SCANNER
  // Function to close the qr popup
  const [qrLoading, setQrLoading] = useState(true);
  const [qrPopup, setQrPopup] = useState(false);
  const handleQrPopupClose = () => {
    setQrPopup(false);
  };

  const [data, setData] = useState("");

  const handleScan = (result) => {
    if (result) {
      setData(result);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };
  //Choose day
  useEffect(() => {
    const currentDate = moment();

    const next10Days = [{ label: t('allDate') }];
    for (let i = 0; i < 10; i++) {
      const nextDate = moment(currentDate).add(i, 'days').format('DD/MM');
      next10Days.push({ label: nextDate });
    }

    setOptionDropdownDate(next10Days);
  }, []);

  const handleSelectDate = (item) => {
    console.log(`Selected: ${item.label}`);
    setFilterDate(item.label);
  };

  // Extract the slots from the apiCheckin data

  const getUniqueSlots = (apiCheckin) => {
    const slots = props.apiCheckin.map(item => item.slot.slotNo);

    const uniqueSlots = [...new Set(slots)].sort((a, b) => a - b);

    const formattedSlots = [
      { label: t('allSlot') },
      ...uniqueSlots.map(slot => ({ label: slot.toString() }))
    ];

    return formattedSlots;
  };
  const optionDropdownSlot = getUniqueSlots(apiCheckin);

  // Function to handle slot selection
  const handleSelectSlot = (item) => {
    console.log(`Selected: ${item.label}`);
    setFilterSlot(item.label);
  };

  useEffect(() => {
    if (data) {
      let id = parseInt(data.text);
      console.log(id);
      handleQrCheckin(id);
    }
  }, [data])

  useEffect(() => {
    const applyFilters = () => {
      let updatedCheckins = apiCheckin ? [...apiCheckin] : [];

      if (filterName) {
        updatedCheckins = updatedCheckins.filter(checkin => {
          const fullName = `${checkin?.bookingSchedule?.account?.firstName || ''} ${checkin?.bookingSchedule?.account?.lastName || ''} ${checkin?.bookingSchedule?.guest?.fullName || ''}`.toLowerCase();
          return fullName.includes(filterName.toLowerCase());
        });
      }

      if (filterEmail) {
        updatedCheckins = updatedCheckins.filter(checkin => {
          const email = (checkin?.bookingSchedule?.account?.email || checkin?.bookingSchedule?.guest?.email || '').toLowerCase();
          return email.includes(filterEmail.toLowerCase());
        });
      }

      if (filterPhone) {
        updatedCheckins = updatedCheckins.filter(checkin => {
          const phone = (checkin?.bookingSchedule?.account?.phone || checkin?.bookingSchedule?.guest?.phone || '').toLowerCase();
          return phone.includes(filterPhone.toLowerCase());
        });
      }

      if (filterDate && filterDate !== t('allDate')) {
        updatedCheckins = updatedCheckins.filter(checkin => moment(checkin.date, 'yyyy-MM-DD').format('DD/MM') === filterDate);
      }

      if (filterSlot && filterSlot !== t('allSlot')) {
        updatedCheckins = updatedCheckins.filter(checkin => checkin.slot.slotNo === parseInt(filterSlot));
      }

      // Sort the checkins to move checked-in ones to the bottom
      updatedCheckins.sort((a, b) => {
        if (isExpired(moment(a?.date, 'yyyy-MM-DD').format('MM/DD'), a?.slot)
          && !isExpired(moment(b?.date, 'yyyy-MM-DD').format('MM/DD'), b?.slot)) {
            return 1;
        } else if (!isExpired(moment(a?.date, 'yyyy-MM-DD').format('MM/DD'), a?.slot)
          && isExpired(moment(b?.date, 'yyyy-MM-DD').format('MM/DD'), b?.slot)) {
            return -1;
        }

        if (!a.checkedIn && b.checkedIn) {
            return -1;
        } else if (a.checkedIn && !b.checkedIn) {
            return 1;
        }

        return 0;
    });

      setFilteredCheckins(updatedCheckins);
    };

    applyFilters();
  }, [filterName, filterEmail, filterPhone, filterDate, filterSlot, apiCheckin]);

  const indexOfLastApiCheckins = currentPage * itemsPerPage;
  const indexOfFirstApiCheckins = indexOfLastApiCheckins - itemsPerPage;
  const currentListApiCheckins = filteredCheckins.slice(indexOfFirstApiCheckins, indexOfLastApiCheckins);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const isExpired = (day, slot) => (
    day < moment().format('MM/DD') ||
    (
      day === moment().format('MM/DD') &&
      moment(slot.endTime, "HH:mm:ss").isBefore(moment())
    )
  )

  const isOnTime = (day, slot) => (
    day === moment().format('MM/DD') && moment(slot.startTime, "HH:mm:ss").format("HH") === (moment().format("HH"))
  )

  return (
    <div className="w-[70rem] my-12">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          {t('checkIn')} ({apiCheckin?.length})
        </div>
        <div>
          {apiCheckin?.length
            ?
            <Button
              label={t('checkIn')}
              fullWidth
              size='medium'
              className='bg-primary-green hover:bg-teal-900 text-white'
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
              }
              onClick={() => {
                setQrLoading(true);
                setQrPopup(true);
                setTimeout(() => {
                  setQrLoading(false);
                }, 500);
              }}
            />
            :
            <></>
          }

        </div>
      </div>

      {
        apiCheckin?.length
          ?
          <>
            <div className="my-4">
              <div className="px-10 py-4 grid grid-cols-12 gap-2 bg-white shadow rounded-xl ">
                <div className="col-span-3">
                  <InputText
                    placeholder={t('enterUserName')}
                    label={t('fullName')}
                    value={filterName}
                    onchange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <InputText
                    value={filterEmail}
                    onchange={(e) => setFilterEmail(e.target.value)}
                    placeholder={t('enterUserEmail')}
                    label="Email"
                  />
                </div>
                <div className="col-span-2">
                  <Dropdown
                    label={t('Date')}
                    items={optionDropdownDate}
                    onSelect={handleSelectDate}
                    placeholder={t('selectDate')}
                  />
                </div>
                <div className="col-span-2">
                  <InputText
                    onchange={(e) => setFilterPhone(e.target.value)}
                    value={filterPhone}
                    placeholder={t('enterUserPhone')}
                    label={t('phone')}
                  />
                </div>
                <div className="col-span-2 pr-3">
                  <Dropdown
                    label={t('slot')}
                    items={optionDropdownSlot}
                    placeholder={t('selectSlot')}
                    onSelect={handleSelectSlot}
                    itemClassName="!px-4 !text-sm"
                    buttonClassName="!px-3"
                  />
                </div>
              </div>

              <div className="mt-2 font-medium">
                {currentListApiCheckins?.map((checkin) => (
                  <div
                    key={checkin.id}
                    className={`px-10 py-1 grid grid-cols-12 gap-2 hover:px-8 cursor-pointer mt-2 rounded-lg ease-in-out duration-300 shadow
                      ${checkin?.checkedIn
                        ? "bg-[#CDFAE7]"
                        : isExpired(moment(checkin?.date, 'yyyy-MM-DD').format('MM/DD'), checkin?.slot) ? "bg-red-200" : "bg-white"}`}
                    onClick={
                      () => handleCheckInPopup(checkin)
                    }
                  >
                    <div className="col-span-3 px-3 flex items-center truncate">
                      {checkin?.bookingSchedule?.account?.firstName} {checkin?.bookingSchedule?.account?.lastName}
                      {checkin?.bookingSchedule?.guest?.fullName}
                    </div>
                    <div className="col-span-3 px-3 flex items-center truncate">
                      {checkin?.bookingSchedule?.account?.email}
                      {checkin?.bookingSchedule?.guest?.email}
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      {moment(checkin?.date, 'yyyy-MM-DD').format('DD/MM')}
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      {checkin?.bookingSchedule?.account?.phone}
                      {checkin?.bookingSchedule?.guest?.phone}
                    </div>
                    <div className="col-span-2 flex flex-col justify-center items-center font-semibold">
                      {checkin.slot?.slotNo}
                      <div className="font-normal text-slate-500 text-sm">
                        ({moment(checkin.slot.startTime, 'HH:mm:ss').format('H')}h - {moment(checkin.slot.endTime, 'HH:mm:ss').format('H')}h)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <PopupModal
              isOpen={checkInPopup}
              setIsOpen={handleCheckInPopupClose}
              centreInfo
              title={t('bookingDetail')}
              html={
                <div className="flex flex-col gap-3">
                  <div className="">
                    <span className="font-semibold">{t('fullName')}: </span>
                    {formCheckIn?.bookingSchedule?.account?.firstName} {formCheckIn?.bookingSchedule?.account?.lastName}
                    {formCheckIn?.bookingSchedule?.guest?.fullName}
                  </div>

                  <div className="">
                    <span className="font-semibold">Email: </span>
                    {formCheckIn?.bookingSchedule?.account?.email}
                    {formCheckIn?.bookingSchedule?.guest?.email}
                  </div>

                  <div className="">
                    <span className="font-semibold">{t('phone')}: </span>
                    {formCheckIn?.bookingSchedule?.account?.phone}
                    {formCheckIn?.bookingSchedule?.guest?.phone}
                  </div>

                  <div>
                    <span className="font-semibold">{t('courtNumber')}: </span>
                    {formCheckIn?.court?.courtNo}
                  </div>

                  <div className="">
                    <span className="font-semibold">{t('Date')}: </span>
                    {formCheckIn?.date}
                  </div>

                  <div className="flex justify-between">
                    <div className="">
                      <span className="font-semibold">
                        Slot: {formCheckIn?.slot?.slotNo} / Time:
                      </span>
                      <span className="font-normal">
                        {" " + moment(formCheckIn?.slot?.startTime, 'HH:mm:ss').format('H')}h - {moment(formCheckIn?.slot?.endTime, 'HH:mm:ss').format('H')}h
                      </span>
                    </div>
                  </div>
                  <Button
                    className={`block text-center py-1 w-full border ${formCheckIn.checkedIn ? 'bg-gray-800 hover:bg-gray-400' : 'bg-primary-green hover:bg-teal-900'} text-white rounded-md font-semibold transition-all ease-in-out duration-300`}
                    onClick={
                      formCheckIn?.checkedIn
                        ?
                        () => {
                          handleUndoCheckin(formCheckIn.id);
                        }
                        :
                        () => {
                          handleCheckin(formCheckIn.id);
                        }
                    }
                    label={
                      formCheckIn?.checkedIn
                        ?
                        t('undo')
                        :
                        t('checkIn')
                    }
                    loading={loadingBtn}
                    loadingColor="#fff"
                    disabled={!isOnTime(moment(formCheckIn?.date, 'yyyy-MM-DD').format('MM/DD'), formCheckIn?.slot)}
                  />
                </div>
              }
            />

            <PopupModal
              isOpen={qrPopup}
              setIsOpen={handleQrPopupClose}
              html={
                <div>
                  <h1 className="text-3xl font-bold mb-6 text-center">QR Scanner</h1>
                  <div className="bg-white rounded-lg">
                    {
                      qrPopup && !qrLoading
                        ?
                        <QrScanner
                          delay={300}
                          style={previewStyle}
                          onError={handleError}
                          onScan={handleScan}
                          className="w-full h-[500px]"
                        />
                        :
                        <div className='w-[320px] h-[240px] flex items-center justify-center'>
                          <SpinnerLoading
                            height='80'
                            width='80'
                            color='#2B5A50'
                          />
                        </div>
                    }
                  </div>
                </div>
              }
            />
          </>
          :
          <div className="flex flex-col items-center justify-center h-96 text-3xl text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150" height="150"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-ticket-x">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="m9.5 14.5 5-5" /><path d="m9.5 9.5 5 5" />
            </svg>
            There are no booking yet!
          </div>
      }
      {
        filteredCheckins.length > itemsPerPage
        &&
        <Pagination
          totalItems={filteredCheckins.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      }

    </div >
  );
};

export default CheckIn;
