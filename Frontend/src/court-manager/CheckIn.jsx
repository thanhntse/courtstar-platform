import InputText from "../components/input-text";
import Dropdown from "../components/dropdown";
import PopupModal from "../components/PopupModal";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import axiosInstance from "../config/axiosConfig";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Button from "../components/button";
import QrScanner from 'react-qr-scanner';
import SpinnerLoading from "../components/SpinnerLoading";

const CheckIn = (props) => {
  const [optionDropdownDate, setOptionDropdownDate] = useState([]);
  const { t } = useTranslation();
  const { id } = useParams(); // Get the booking ID from the URL parameters
  const [apiCheckin, setApiCheckin] = useState(props.apiCheckin || []); // State to hold the check-in data from the API
  const [checkInPopup, setCheckInPopup] = useState(false); // State to control the visibility of the check-in popup
  const [listSlot, setListSlot] = useState(apiCheckin.map(item => {
    return item.slot.slotNo
  }))
console.log(listSlot);
  const [formCheckIn, setFormCheckIn] = useState({ // State to hold the form data for the check-in popup
    checkinId: '',
    startTime: '',
    endTime: '',
    slotNo: '',
    totalPrice: '',
    status: ''
  });

  // Function to open the check-in popup with the specified check-in details
  const handleCheckInPopup = (checkinId, startTime, endTime, slotNo, totalPrice, status) => {
    setFormCheckIn({
      checkinId,
      startTime,
      endTime,
      slotNo,
      totalPrice,
      status
    });
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
    setQrLoading(true);
    let booking = {};
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
              booking = res.data.data.filter(booking => booking.id === checkInId)[0];
              setQrLoading(false);
              if (qrPopup) {
                handleQrPopupClose();
                handleCheckInPopup(booking.id, booking.slot.startTime, booking.slot.endTime, booking.slot.slotNo,
                  booking.totalPrice, booking.status);
              }
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

      });
  };

  console.log();

  // Function to handle the check-in process
  const handleUndoCheckin = async (checkInId) => {
    try {
      const res = await axiosInstance.post(`/courtstar/check-in/undo/${checkInId}`);
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
    } catch (error) {
      console.log(error.message);
    }
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

    const next10Days = [];
    for (let i = 0; i < 10; i++) {
      const nextDate = moment(currentDate).add(i, 'days').format('DD/MM');
      next10Days.push({ label: nextDate });
    }

    setOptionDropdownDate(next10Days);
  }, []);

  const handleSelectDate = (item) => {
    console.log(`Selected: ${item.label}`);
    
  };

   // Extract the slots from the apiCheckin data

   const getUniqueSlots = (apiCheckin) => {
    const slots = apiCheckin.map(checkin => parseInt(checkin.slot.slotNo, 10));
    const uniqueSlots = [...new Set(slots)].sort((a, b) => a - b);
    return uniqueSlots.map(slot => ({ label: slot.toString() }));
  };
const optionDropdownSlot = getUniqueSlots(apiCheckin);

// Function to handle slot selection
const handleSelectSlot = (item) => {
  console.log(`Selected: ${item.label}`);
};

  useEffect(() => {
    if (data) {
      let id = parseInt(data.text);
      console.log(id);
      if (apiCheckin.filter(booking => booking.id === id)[0]) handleCheckin(id);
      else {
        toast.warning('Nhầm sân rồi bạn ơi!', {
          toastId: 'checkin-fail'
        });
      }

    }
  }, [data])

  return (
    <div className="w-[70rem] my-12">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          Check in ({apiCheckin.length})
        </div>
        <div>
          {apiCheckin.length
            ?
            <Button
              label={t('Check in')}
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
        apiCheckin.length
          ?
          <>
            <div className="bg-white rounded-xl mt-4">
              <div className="px-10 pt-6 flex justify-between gap-1">
                <div className="w-3/12">
                  <InputText
                    id="name"
                    name="name"
                    placeholder={t('enterUserName')}
                    label={t('fullName')}
                  />
                </div>
                <div className="w-3/12">
                  <InputText
                    id="email"
                    name="email"
                    placeholder={t('enterUserEmail')}
                    label="Email"
                  />
                </div>
                <div className="w-2/12">
                  <Dropdown
                    label="Date"
                    items={optionDropdownDate}
                    onSelect={handleSelectDate}
                    placeholder={t('Select date')}
                  />
                </div>
                <div className="w-2/12">
                  <InputText
                    id="phone"
                    name="phone"
                    placeholder={t('enterUserPhone')}
                    label={t('phone')}
                  />
                </div>
                <div className="w-2/12 pr-3">
                  <Dropdown
                    label={t('slot')}
                    items={optionDropdownSlot}
                    placeholder={t('selectSlot')}
                    onSelect={handleSelectSlot}
                    itemClassName="!px-4 !text-sm"
                    buttonClassName="!px-3"
                  />
                </div>
                <div className="w-9"></div>
              </div>
              <div className="divide-y-2">
                {apiCheckin.map((checkin) => (
                  <div key={checkin.id} className="px-10 py-3 flex items-center justify-between">
                    <div className="w-3/12 px-3 truncate">
                      {checkin?.account?.firstName} {checkin?.account?.lastName}
                      {checkin?.guest?.fullName}
                    </div>
                    <div className="w-3/12 px-3 truncate">
                      {checkin?.account?.email}
                      {checkin?.guest?.email}
                    </div>
                    <div className="w-2/12 flex justify-center">
                      {moment(checkin?.date, 'yyyy-MM-DD').format('DD/MM')}
                    </div>
                    <div className="w-2/12 flex justify-center">
                      {checkin?.account?.phone}
                      {checkin?.guest?.phone}
                    </div>
                    <div className="w-2/12 flex flex-col justify-center items-center font-semibold">
                      {checkin?.slot?.slotNo}
                      <div className="text-sm font-normal">
                        ({moment(checkin?.slot?.startTime, 'HH:mm:ss').format('HH:mm')} - {moment(checkin?.slot?.endTime, 'HH:mm:ss').format('HH:mm')})
                      </div>
                    </div>
                    <button
                      onClick={
                        () => handleCheckInPopup(checkin.id, checkin?.slot?.startTime, checkin?.slot?.endTime, checkin?.slot?.slotNo,
                          checkin?.totalPrice, checkin?.status)
                      }
                      className="p-2 rounded-full bg-slate-100 hover:bg-primary-green hover:text-white ease-in-out duration-200"
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
                        className={checkin?.status ? "lucide lucide-undo-2" : "lucide lucide-calendar-check"}
                      >
                        {checkin?.status ? (
                          <>
                            <path d="M9 14 4 9l5-5" />
                            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                          </>
                        ) : (
                          <>
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                            <path d="m9 16 2 2 4-4" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <PopupModal
              isOpen={checkInPopup}
              setIsOpen={handleCheckInPopupClose}
              html={
                <div className="flex gap-7 max-w-5xl">
                  <div className="flex flex-col gap-3">
                    <div className="font-semibold text-xl">
                      {props.centreDetail.name}
                    </div>
                    <div>
                      <span className="font-semibold">Address: </span>
                      {props.centreDetail.address}
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <span className="font-semibold">Slot: </span>
                        ({moment(formCheckIn.startTime, 'HH:mm:ss').format('HH:mm')} - {moment(formCheckIn.endTime, 'HH:mm:ss').format('HH:mm')})
                      </div>
                      <div>
                        <span className="font-semibold">Court number: </span>
                        {formCheckIn.slotNo}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">Total price: </span>
                      <span className="font-semibold text-rose-600">{formCheckIn.totalPrice}₫/h</span>
                    </div>
                    <div className="text-sm flex justify-center gap-20">
                      <button
                        className="block text-center py-1 w-full border bg-primary-green text-white rounded-md font-semibold hover:bg-teal-900 transition-all ease-in-out duration-300"
                        onClick={
                          formCheckIn.status
                            ?
                            () => {
                              handleUndoCheckin(formCheckIn.checkinId);
                            }
                            :
                            () => {
                              handleCheckin(formCheckIn.checkinId);
                            }
                        }
                      >
                        {formCheckIn.status
                          ?
                          'Undo'
                          :
                          'Check in'
                        }
                      </button>
                    </div>
                  </div>
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

    </div>
  );
};

export default CheckIn;
