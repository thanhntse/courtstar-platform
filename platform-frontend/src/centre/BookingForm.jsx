import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import InputText from '../components/input-text';
import PopupModal from '../components/PopupModal';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const BookingForm = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const controller = new AbortController();
  const { signal } = controller;
  const { state } = useAuth();
  const { account } = state;

  //CLOSE BOOKING MODAL
  const handleClose = () => {
    props.setIsOpen();
  }

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentType: "ZALOPAY",
    bookingDetails: [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (account)
      setBookingForm((prevForm) => ({
        ...prevForm,
        fullName: (account.firstName + " " + account.lastName).trim(),
        email: account.email,
        phone: account.phone,
        bookingDetails: [],
      }));
  }, [account]);

  useEffect(() => {
    setBookingForm((prevForm) => ({
      ...prevForm,
      bookingDetails: props.formCalendar,
    }));
  }, [props.formCalendar]);

  const booking = async () => {
    setLoading(true);
    await axiosInstance.post(`/courtstar/booking`, bookingForm)
      .then(res => {
        window.location.href = res.data.data.order_url;
      })
      .catch(error => {
        toast.error(t("someoneIsPayingForThisSlotPleaseChooseAnotherSlot!")
          , {
            toastId: "invalid-slot-booking",
            autoClose: 5000
          }
        );
      })
      .finally(() => {
        setLoading(false);
        handleClose();
      });
  }

  useEffect(() => {
    console.log(bookingForm);
  }, [bookingForm]);

  const html = (
    <div className='font-medium w-[440px] items-center flex flex-col gap-3'>
      <InputText
        id="fullName"
        name="fullName"
        label={`${t('fullName')}*`}
        placeholder='Enter full name'
        value={bookingForm.fullName || ""}
        onchange={handleChange}
        disabled={account?.firstName}
      />
      <InputText
        id="phone"
        name="phone"
        label={`${t('phone')}*`}
        placeholder='Enter phone number'
        value={bookingForm.phone || ""}
        onchange={handleChange}
        disabled={account?.phone}
      />
      <InputText
        id="email"
        name="email"
        label="Email*"
        placeholder='Enter your email'
        value={bookingForm.email || ""}
        onchange={handleChange}
        disabled={account?.email}
      />
      <div className='w-full flex flex-col gap-2'>
        <div className='text-base font-semibold'>
          {t('paymentMethod')}*
        </div>
        <div className="flex justify-center items-center gap-10 text-lg font-semibold">
          <div
            className={`flex w-32 h-[50px] gap-2 items-center border rounded-lg p-2 hover:bg-[#CDFAE7] hover:border-[#CDFAE7] cursor-pointer transition-all ease-in-out duration-300 ${bookingForm.paymentType === "ZALOPAY" ? 'bg-[#CDFAE7] border-[#CDFAE7]' : "" }`}
            onClick={() => setBookingForm((prevForm) => ({
              ...prevForm,
              paymentType: "ZALOPAY",
            }))}
          >
            <img
              src="/images/zalopay-logo.png"
              alt="zalo-pay"
              className='w-8 h-8'
            />
            <div>
              ZaloPay
            </div>
          </div>
          <div
            className={`flex w-32 h-[50px] gap-2 items-center border rounded-lg p-2 hover:bg-[#CDFAE7] hover:border-[#CDFAE7] cursor-pointer transition-all ease-in-out duration-300 ${bookingForm.paymentType === "VNPAY" ? 'bg-[#CDFAE7] border-[#CDFAE7]' : "" }`}
            onClick={() => setBookingForm((prevForm) => ({
              ...prevForm,
              paymentType: "VNPAY",
            }))}
          >
            <img
              src="/images/vnpay-logo.png"
              alt="vn-pay"
              className='w-9'
            />
            <div>
              VNPay
            </div>
          </div>
        </div>
      </div>
      <div className='py-3 flex justify-center items-center gap-1 font-semibold'>
        {t('price')}:
        <span className='text-rose-600'> {((props?.centre?.pricePerHour) * (bookingForm?.bookingDetails?.length))?.toLocaleString('de-DE')} VND</span>
      </div>
      <div className='flex items-center justify-center w-full'>
        <Button
          label={t('confirm')}
          fullWidth
          size='medium'
          className='bg-primary-green hover:bg-teal-900 text-white'
          loading={loading}
          onClick={booking}
        />
      </div>
    </div>
  )
  return (
    <div>
      <PopupModal
        html={html}
        isOpen={props.isOpen}
        setIsOpen={handleClose}
        centreInfo
        title={t('booking')}
      />
    </div>
  )

}

export default BookingForm;
