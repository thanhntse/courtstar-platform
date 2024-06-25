import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import Calendar from '../components/calendar';
import BookingForm from './BookingForm';
import axiosInstance from '../config/axiosConfig';
import SpinnerLoading from '../components/SpinnerLoading';
import moment from 'moment';
import Feedback from '../components/feedback';
import Button from '../components/button';
import XCarousel from '../components/carousel';
import { useTranslation } from 'react-i18next';

const CentreBooking = () => {

  const { t } = useTranslation();
  const { id } = useParams();
  const controller = new AbortController();
  const { signal } = controller;
  const [loading, setLoading] = useState(true);
  const [centre, setCentre] = useState({});
  const [formCalendar, setFormCalendar] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);

  const load = useCallback(async () => {
    await axiosInstance.get(`/courtstar/centre/getCentre/${id}`, { signal })
      .then(res => {
        setCentre(res.data.data);
        axiosInstance.get(`/courtstar/feedback/${id}`)
          .then(res => {
            setFeedbackList(res.data.data);
            console.log(res.data.data);
          })
          .catch(error => {
            console.log(error.message);
          })
          .finally(() => {
            setLoading(false);
          })
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  }, [id]);

  useEffect(() => {
    load();
    return () => {
      controller.abort();
    }
  }, [load])

  //HANDLE BOOKING FORM POPUP
  const [bookingFormPopup, setBookingFormPopup] = useState(false);
  const handleBookingFormPopup = () => {
    setBookingFormPopup(true);
  }
  const handleBookingFormPopupClose = () => {
    setBookingFormPopup(false)
  }

  const submit = (formCalendar) => {
    handleBookingFormPopup();
    setFormCalendar(formCalendar);
  }

  const handleBookClick = () => {
    const bookElement = document.getElementById('book');
    if (bookElement) {
      const offset = 80;
      const elementPosition = bookElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='font-Inter text-base overflow-x-hidden text-gray-800'>

      {
        loading
          ?
          <div className='w-full h-[500px] flex justify-center items-center'>
            <SpinnerLoading
              height='80'
              width='80'
              color='#2B5A50'
            />
          </div>
          :
          (<div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
            <div className="max-w-screen-1440 1440:mx-auto mx-4 py-8 px-12 w-full flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="">
                  <div className='text-3xl font-semibold'>
                    {centre.name}
                  </div>
                  <div className='flex gap-2 my-3'>
                    <Rating
                      ratingWrapper='flex gap-1'
                      value={centre.currentRate}
                      editable={false}
                    />
                    <div className='text-base'>
                      ({feedbackList.length})
                    </div>
                  </div>
                </div>
                <Button
                  label='Book now'
                  size='medium'
                  className='bg-primary-green hover:bg-teal-900 text-white'
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-plus"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><path d="M3 10h18" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                  }
                  onClick={handleBookClick}
                />
              </div>
              <div className='w-full flex items-start gap-8'>
                {centre.images && <XCarousel images={centre.images} />}
                <div className='flex-1 h-full flex flex-col justify-start gap-6'>

                  <div className="rounded-lg shadow-gray-400 shadow-md">
                    <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
                      <span className='text-3xl font-medium'>Address</span>
                    </div>
                    <div className='bg-white rounded-b-lg p-5'>
                      <div className='font-medium mb-5'>
                        {centre.address}, {t(centre.district)}
                      </div>
                        <iframe
                          src={`https://maps.google.com/maps?q=${centre.name}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          width="100%"
                          height={265}
                          style={{ border: 0, borderRadius: 10 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                  </div>

                </div>
              </div>

              <div className='rounded-lg shadow-gray-400 shadow-md'>
                <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
                  <span className='text-3xl font-medium'>Centre Detail</span>
                </div>
                <div className="bg-white p-5 flex rounded-b-lg">
                  <div className='flex flex-col gap-3 w-1/2'>
                    <div className=''>
                      <span className='font-semibold'>Open time: </span>
                      {`${moment(centre.openTime, "HH:mm:ss").format("H")}h
                    - ${moment(centre.closeTime, "HH:mm:ss").format("H")}h`}
                    </div>
                    <div className=''>
                      <span className='font-semibold'>Number of courts: </span>
                      {centre.numberOfCourts}
                    </div>
                    <div>
                      <span className='font-semibold'>Price: </span>
                      <span className='font-semibold text-rose-600'>{centre?.pricePerHour?.toLocaleString('de-DE')} VND/h</span>
                    </div>
                  </div>
                  <div className='w-1/2'>
                    <span className='font-semibold'>{t('description')}:</span>
                    <div dangerouslySetInnerHTML={{ __html: centre.description }}>
                    </div>
                  </div>

                </div>
              </div>

              <div id="book" className='flex-1 rounded-lg shadow-gray-400 shadow-md'>
                <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
                  <span className='text-3xl font-medium'>Booking</span>
                </div>
                <div className='bg-white rounded-b-lg p-8 pt-0'>
                  <div className="">
                    <Calendar
                      handleButton={submit}
                      typeOfCalendar='booking'
                      centre={centre}
                    />
                  </div>
                </div>
              </div>



              <div id="top" className='flex-1 bg-white rounded-lg shadow-gray-400 shadow-md'>
                <div className='text-white rounded-t-lg bg-primary-green flex items-center justify-center gap-1.5 py-2'>
                  <span className='text-3xl font-medium'>Feedbacks</span>
                </div>
                <div className="">
                  <Feedback
                    listItem={feedbackList}
                    itemsPerPage={5}
                  />
                </div>
              </div>

            </div>
          </div>)

      }
      <BookingForm
        isOpen={bookingFormPopup}
        setIsOpen={handleBookingFormPopupClose}
        formCalendar={formCalendar}
        centre={centre}
      />
    </div>
  );
}

export default CentreBooking;
