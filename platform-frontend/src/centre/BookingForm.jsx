import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import InputText from '../components/input-text';
import PopupModal from '../components/PopupModal';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';

const BookingForm = (props) => {
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
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    if(account)
      setBookingForm((prevForm) => ({
        ...prevForm,
        fullName: (account.firstName + " " + account.lastName).trim(),
        email: account.email,
        phone: account.phone,
      }));
  }, [account]);

  useEffect(() => {
    setBookingForm((prevForm) => ({
        ...prevForm,
        ...props.formCalendar,
    }));
}, [props.formCalendar]);

  const booking = async() => {
    setLoading(true);
    await axiosInstance.post(`/courtstar/booking`, bookingForm)
      .then(res => {
        window.location.href = res.data.data.order_url;
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(()=>{
        setLoading(false);
        handleClose();
      });
  }

  useEffect(() => {
    console.log(bookingForm);
  }, [bookingForm]);

  const html = (
    <div className='font-medium w-[440px] items-center gap-3'>
      <h2 className='font-bold text-4xl text-center mb-3'>Booking</h2>
      <div className='mb-2'>
        <InputText
          id="fullName"
          name="fullName"
          label="Full Name*"
          placeholder='Enter full name'
          value={bookingForm.fullName || ""}
          onchange={handleChange}
          disabled={account?.firstName}
        />
      </div>
      <div className='mb-2'>
        <InputText
          id="phone"
          name="phone"
          label="Phone*"
          placeholder='Enter phone number'
          value={bookingForm.phone || ""}
          onchange={handleChange}
          disabled={account?.phone}
        />
      </div>
      <div className='mb-2'>
        <InputText
          id="email"
          name="email"
          label="Email*"
          placeholder='Enter your email'
          value={bookingForm.email || ""}
          onchange={handleChange}
          disabled={account?.email}
        />
      </div>
      <div className='mb-4'>
        Price: {props.centre.pricePerHour}
      </div>
      <div className='flex items-center justify-center'>
        <Button
          label='Confirm'
          fullWidth
          fullRounded
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
      />
    </div>
  )

}

export default BookingForm;
