import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import FeedbackForm from './FeedbackForm';
import Rating from '../components/Rating';
import moment from 'moment';
import Pagination from '../components/pagination/pagination';
import SpinnerLoading from '../components/SpinnerLoading';
import { useTranslation } from 'react-i18next';
import Tag from '../components/tag';
import Button from '../components/button';
import PopupModal from '../components/PopupModal';

const BookingHistory = () => {
  const { t } = useTranslation();
  const [feedbackPopup, setFeedbackPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 4;

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/courtstar/booking');
      if (response.data.code === 1000) {
        const sortedBookings = response.data.data.sort((a, b) => {
          if (a.rate === 0 && b.rate !== 0) return -1;
          if (a.rate !== 0 && b.rate === 0) return 1;
          return new Date(b.bookingDetails[0].date) - new Date(a.bookingDetails[0].date);
        });
        setBookings(sortedBookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      setError('Error fetching booking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFeedbackPopup = (booking) => {
    setSelectedBooking(booking);
    setFeedbackPopup(true);
  };

  const handleFeedbackPopupClose = () => {
    setFeedbackPopup(false);
    setSelectedBooking(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastBooking = currentPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const isFeedbackAvailable = (bookingDetails) => {
    // Check if at least one booking detail has checkIn set to true
    const hasCheckedIn = bookingDetails.some(detail => detail.checkedIn);

    // Get the earliest end time from booking details
    const endTimes = bookingDetails.map(detail => moment(`${detail.date} ${detail.slot.endTime}`, 'YYYY-MM-DD HH:mm:ss'));
    const earliestEndTime = moment.min(endTimes);

    // Feedback is available only if at least one booking detail has checkIn true and the current time is after the earliest end time
    return hasCheckedIn && moment().isAfter(earliestEndTime);
  };

  return (
    <div className="font-Inter text-base overflow-x-hidden text-gray-800">
      <FeedbackForm
        isOpen={feedbackPopup}
        setIsOpen={handleFeedbackPopupClose}
        booking={selectedBooking}
        onFeedbackSubmitted={fetchBookings}
      />
      <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
        <div
          id="top"
          className="max-w-screen-1440 1440:mx-auto mx-4 py-10 px-12 w-full flex flex-col gap-4 items-center justify-between"
        >
          <div className="font-bold text-3xl uppercase text-start w-full pb-5 pl-2">
            Booking History
          </div>
          <div className="flex gap-5 w-full rounded-2xl min-h-[50px]">
            {loading ? (
              <SpinnerLoading type="page" height="80" width="80" color="#2B5A50" />
            ) : error ? (
              <div className="text-red-500 text-xl">{error}</div>
            ) : (
              <div className="flex-1 flex flex-col gap-5 items-center">
                {currentBookings.length ? (
                  currentBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      handleFeedbackPopup={handleFeedbackPopup}
                      isFeedbackAvailable={isFeedbackAvailable}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-3xl text-primary">
                    <NoBookingsIcon />
                    You don't have any bookings yet!
                  </div>
                )}
              </div>
            )}
          </div>
          {bookings.length > itemsPerPage && (
            <Pagination
              totalItems={bookings.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, handleFeedbackPopup, isFeedbackAvailable }) => {
  const { t } = useTranslation();
  const [feedbackDetailOpen, setFeedbackDetailOpen] = useState(false);
  const isExpired = (day, slot) => (
    day < moment().format('MM/DD') ||
    (
      day === moment().format('MM/DD') &&
      moment(slot.endTime, "HH:mm:ss").isBefore(moment())
    )
  )
  return (
    <div className='w-full flex justify-center items-center'>
      <PopupModal
        isOpen={feedbackDetailOpen}
        setIsOpen={() => setFeedbackDetailOpen(false)}
        html={
          <div>
            <div className='w-full flex justify-center items-center text-3xl font-semibold mb-4'>
              Booking Details
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {booking.bookingDetails.map((detail, index) => (
                <div key={detail.id} className={`text-lg p-4 rounded-lg border relative
                  ${booking.bookingDetails.length % 2 !== 0 && index === booking.bookingDetails.length - 1
                  ? 'col-span-2 mx-auto' : ''}
                  ${detail.checkedIn ? "border-[#2B5A50]" : isExpired(moment(detail.date, "YYYY-MM-DD").format("MM/DD"), detail.slot) ? "border-[#dc2626]" : "border-[#9ca3af]"}
                `}>
                  <Tag
                    label={detail.checkedIn ? "Checked in" : isExpired(moment(detail.date, "YYYY-MM-DD").format("MM/DD"), detail.slot) ? "Expired" : "Not yet"}
                    bgColor={detail.checkedIn ? "bg-[#2B5A50]" : isExpired(moment(detail.date, "YYYY-MM-DD").format("MM/DD"), detail.slot) ? "bg-[#dc2626]" : "bg-[#9ca3af]"}
                    txtColor="text-[#fff]"
                    className='top-0 right-0 rounded-tr-md rounded-bl-lg'
                  />
                  <div>
                    <span className="font-semibold">Date: </span>
                    {moment(detail.date).format('DD/MM/YYYY')}
                  </div>
                  <div>
                    <span className='font-semibold'>Slot: {detail.slot.slotNo} / </span>
                    <span className="font-semibold">Time: </span>
                    {moment(detail.slot.startTime, 'HH:mm:ss').format('HH:mm')} -{' '}
                    {moment(detail.slot.endTime, 'HH:mm:ss').format('HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />
      <div className="bg-white rounded-2xl shadow-2xl border py-5 px-7 flex gap-7 max-w-5xl w-full">
        <img
          src={booking.centreImg || centrePlaceholder}
          alt={booking.centreName}
          className="min-w-80 max-w-80 h-56 rounded-lg object-cover object-center"
        />
        <div className="flex flex-col gap-3 w-full justify-between">
          <div className="font-semibold text-xl">{booking.centreName}</div>
          <div>
            <span className="font-semibold">Address: </span>
            {booking.centreAddress}, {t(booking.centreDistrict)}
          </div>
          <div>
            <span className="font-semibold">Court Number: </span>
            {booking.bookingDetails[0].court.courtNo}
          </div>
          <div>
            <span className="font-semibold">Total price: </span>
            <span className="font-semibold text-rose-600">
              {booking.totalPrice.toLocaleString('vi-VN')} VND
            </span>
          </div>
          <Button
            label='View detail'
            fullWidth
            className='bg-gray-800 text-white py-1 font-semibold'
            onClick={() => setFeedbackDetailOpen(true)}
          />
          <div className="flex justify-center items-end">
            {booking.rate === 0 ? (
              isFeedbackAvailable(booking.bookingDetails) ? (
                <button
                  className="block text-center py-1 w-full border bg-primary-green text-white rounded-md font-semibold hover:bg-teal-900 transition-all ease-in-out duration-300"
                  onClick={() => handleFeedbackPopup(booking)}
                >
                  Feedback
                </button>
              ) : (
                <button
                  className="block text-center py-1 w-full border bg-primary-green text-white rounded-md font-semibold opacity-70"
                  disabled
                >
                  Feedback
                </button>
              )
            ) : (
              <Rating ratingWrapper="flex gap-1" value={booking.rate} editable={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoBookingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="150"
    height="150"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-ticket-x"
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="m9.5 14.5 5-5" />
    <path d="m9.5 9.5 5 5" />
  </svg>
);

export default BookingHistory;
