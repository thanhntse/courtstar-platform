import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import SpinnerLoading from '../components/SpinnerLoading';
import check from '../assets/images/circle-check.svg';
import moment from 'moment';
import Tag from '../components/tag';
import { useTranslation } from 'react-i18next';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface BookingDetails {
  date: string;
  court: {
    courtNo: number;
  };
  slot: {
    slotNo: number;
    startTime: string;
    endTime: string;
    status: boolean
  };
  checkedIn: boolean
}

interface BookingSchedule {
  account?: {
    email: string
  };
  guest?: {
    email: string
  };
  centreName: string;
  centreAddress: string;
  centreDistrict: string;
  totalPrice: number;
  bookingDetails: BookingDetails[];
  success: boolean;
}

const PaymentResult: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [bookingSchedule, setBookingSchedule] = useState<BookingSchedule | null>(null);
  const query = useQuery();
  const [status, setStatus] = useState<any>(query.get('status'));
  const [appTransId, setAppTransId] = useState<any>(query.get('apptransid'));
  const location = useLocation();

  const isExpired = (day, slot) => (
    day < moment().format('MM/DD') ||
    (
      day === moment().format('MM/DD') &&
      moment(slot.endTime, "HH:mm:ss").isBefore(moment())
    )
  )

  useEffect(() => {
    const load = async () => {
      await axiosInstance.post(`/courtstar/payment/order-info`, { appTransId })
        .then(bookingResponse => {
          setBookingSchedule(bookingResponse.data);
        })
        .catch(error => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (status === '1') {
      load();
    } else if (!status) {
      axiosInstance.get(`/courtstar/payment-vn-pay/callback${location.search}`)
        .then(res => {
          setStatus(res.data.status);
          setAppTransId(res.data.appTransId);
        })
        .catch(error => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    setResult(status);
  }, [status, appTransId]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-350px)]">
      {loading ? (
        <div className="w-full h-[500px] flex justify-center items-center">
          <SpinnerLoading height="80" width="80" color="#2B5A50" />
        </div>
      ) : (
        <div className="w-full max-w-[630px] bg-white shadow-lg border rounded-lg p-6 m-10">
          {result === '1' ? (
            <div className="gap-2 text-green-500 text-xl font-bold flex justify-center">
              <img src={check} alt="check" />
              Payment successfully!
            </div>
          ) : (
            <div>
              <div className="gap-2 text-red-500 text-xl font-bold flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                Payment fail!
              </div>
              <div className="text-gray-500 text-md text-center mb-4 pt-4">
                Your payment was not successfully proceed.<br />
                Please contact our customer support.
              </div>
              <hr className='my-3'/>
              <div>
                <h2 className="text-lg font-bold mt-4">Why did it fail?</h2>
                <ol>
                  <li>Payment is overdue.</li>
                  <li>Cancel payment.</li>
                  <li>Invalid card's information.</li>
                </ol>
              </div>
            </div>
          )}
          {bookingSchedule && (
            <>
              <div className="mt-6">
                <div className="text-gray-500 text-sm text-center my-4">
                  We just sent the booking schedule to your email
                  <br />
                  <span className="text-black font-bold">
                    {bookingSchedule.account ? bookingSchedule.account.email : bookingSchedule.guest?.email}
                  </span>
                </div>
                <hr className='my-3'/>
                <div className="px-10 flex flex-col text-lg">
                  <p className='text-2xl mb-3 text-center'>
                    <strong>{bookingSchedule.centreName}</strong>
                  </p>
                  <p className='mb-2'>
                    <strong>Address:</strong> {bookingSchedule.centreAddress}, {t(bookingSchedule.centreDistrict)}
                  </p>
                  <div className='flex justify-between'>
                    <p className=''>
                      <strong>Court Number:</strong> {bookingSchedule.bookingDetails[0].court.courtNo}
                    </p>
                    <p>
                      <strong>Total Price: </strong>
                      <span className="font-semibold text-rose-600">{bookingSchedule.totalPrice.toLocaleString('de-DE')}</span>
                      <span className="font-semibold text-rose-600"> VND</span>
                    </p>
                  </div>
                </div>
                <hr className='my-3'/>
                <div className='grid grid-cols-2 gap-2'>
                  {bookingSchedule.bookingDetails.map((detail, index) => (
                    <div key={index}
                      className={`text-lg p-4 rounded-lg border relative
                        ${bookingSchedule.bookingDetails.length % 2 !== 0 && index === bookingSchedule.bookingDetails.length - 1
                        ? 'col-span-2 w-1/2 mx-auto' : ''}
                        ${detail.checkedIn ? "border-[#2B5A50]" : isExpired(moment(detail.date, "YYYY-MM-DD").format("MM/DD"), detail.slot) ? "border-[#dc2626]" : "border-[#9ca3af]"}
                      `}>
                        <Tag
                          label={detail.checkedIn ? "Checked in" : isExpired(moment(detail.date, "YYYY-MM-DD").format("MM/DD"), detail.slot) ? "Expired" : "Not yet"}
                          bgColor={detail.checkedIn ? "bg-[#2B5A50]" : isExpired(moment(detail.date, "YYYY-MM-DD").format("MM/DD"), detail.slot) ? "bg-[#dc2626]" : "bg-[#9ca3af]"}
                          txtColor="text-[#fff]"
                          className='top-0 right-0 rounded-tr-md rounded-bl-lg'
                        />
                        <p>
                          <strong>Date:</strong> {moment(detail.date).format("DD/MM/yyyy")}
                        </p>
                        <p>
                          <strong>Slot: {detail.slot.slotNo}</strong>  <strong>/ Time: </strong>{moment(detail.slot.startTime, "hh:mm:ss").format("H:mm")} - {moment(detail.slot.endTime, "hh:mm:ss").format("H:mm")}
                        </p>
                    </div>
                  ))}
                </div>

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
