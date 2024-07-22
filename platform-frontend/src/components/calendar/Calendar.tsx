import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { CalendarProps, BookingDetail } from './index';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';
import SpinnerLoading from '../SpinnerLoading';
import axiosInstance from '../../config/axiosConfig';
import { useTranslation } from 'react-i18next';
import showAlert from '../alert';
import { toast } from 'react-toastify';

const Calendar: React.FC<CalendarProps> = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const typeOfCalendar = props.typeOfCalendar;
  const [weeklyBooking, setWeeklyBooking] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(0);

  useEffect(() => {
    console.log(frequency);
  }, [frequency])


  useEffect(() => {
    console.log(weeklyBooking);

    setFormCalendar([]);
  }, [weeklyBooking])

  const [formCalendar, setFormCalendar] = useState<BookingDetail[] | undefined>([]);

  const controller = new AbortController();
  const { signal } = controller;


  //HANDLE CENTRE
  const [centre, setCentre] = useState<any>({});
  useEffect(() => {
    setCentre(props.centre);
  }, [props.centre])
  //END HANDLE CENTRE


  const isEmptyObject = (obj) => Object.keys(obj).length === 0;
  const isDisable = (day, slot) => (
    day < moment().format('MM/DD') ||
    (
      day === moment().format('MM/DD') &&
      (parseInt(moment(slot.startTime, "HH:mm:ss").format('H'))) < (parseInt(moment().format('H')) + 1)
    ) ||
    court.bookingDetails.some(bookingDetail =>
      bookingDetail.status &&
      bookingDetail.slot.id === slot.id &&
      moment(bookingDetail.date, "YYYY-MM-DD").format('MM/DD') === day
    )
  )


  // HANDLE COURT
  const [courtItems, setCourtItems] = useState<any>([]);
  const [currentCourt, setCurrentCourt] = useState<any>();
  const [court, setCourt] = useState<any>({});
  const handleSelectCourt = (item) => {
    setLoading(true);
    setFormCalendar([]);
    setCurrentCourt(item);
    loadCourt(item.key);
  };

  const loadCourt = async (courtId) => {
    setLoading(true);
    await axiosInstance.get(`/courtstar/court/booking-detail/${courtId}`, { signal })
      .then(res => {
        setCourt(res.data.data)
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
    if (!isEmptyObject(centre)) {
      const items = centre.courts?.map((court) => ({
        key: court.id,
        label: `${t('court')} ${court.courtNo}`
      }));
      setCourtItems(items);
      setCurrentCourt(items[0]);
      loadCourt(items[0].key);
    }

    return () => {
      controller.abort();
    }
  }, [centre])
  // END HANDLE COURT


  //HANDLE YEAR
  const yearItems = [
    {
      key: 1,
      label: `${moment().year()}`
    }
  ];
  const handleSelectYear = (item) => {
    console.log(`Selected: ${item.key} ${item.label}`);
  };
  //END HANDLE YEAR


  //HANDLE WEEK, GET THE NEXT 10 WEEKS
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const getWeeks = () => {
    let weeks: any = [];
    let startOfWeek = moment().startOf('week');

    for (let i = 0; i < 10; i++) {
      let week: any = [];
      let start = startOfWeek.clone().add(i, 'weeks').startOf('week');

      for (let j = 0; j < 7; j++) {
        week.push(start.clone().add(j, 'days').format('MM/DD'));
      }

      weeks.push(week);
    }

    return weeks;
  };
  const weeks = getWeeks();
  const weekItems = weeks.map((week, index) => (
    {
      key: index,
      label: `${week[0]} ${t('to')} ${week[6]}`
    }
  ));
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);

  const handleSelectWeek = (item) => {
    console.log(`Selected: ${item.key} ${item.label}`);
    setSelectedWeek(weeks[item.key]);
    setCurrentWeekIndex(item.key);
  };
  //END HANDLE WEEK


  //HANDLE < > BUTTON
  const goNext = () => {
    handleSelectWeek(weekItems[currentWeekIndex + 1]);
  }
  const goPrevious = () => {
    handleSelectWeek(weekItems[currentWeekIndex - 1]);
  }
  //END HANDLE < > BUTTON


  //HANDLE CHOOSE DAY SLOT
  const handleClick = (slot, day) => {
    const formattedDate = moment(day, "MM/DD").format("YYYY-MM-DD");


    if (weeklyBooking) {
      setFormCalendar((prevForm) => {

        let updatedFormCalendar = prevForm ? [...prevForm] : [];

        const slotIndex = updatedFormCalendar.findIndex(detail =>
          detail.slotId === slot.id &&
          detail.courtId === currentCourt.key &&
          detail.date === formattedDate
        );

        if (slotIndex > -1) {
          updatedFormCalendar = updatedFormCalendar.filter(
            item => item.slotId !== slot.id || moment(item.date).format('dd') !== moment(formattedDate).format('dd')
          );
        } else {
          for (let i = 0; i < frequency; i++) {
            const nextWeekDate = moment(formattedDate).add(i, 'weeks').format('YYYY-MM-DD');
            if (isDisable(moment(nextWeekDate, 'YYYY-MM-DD').format('MM/DD'), slot)) {
              toast.warn(t("thisSlotCannotBeBookedConsecutivelyForTheNumberOfWeeksYouSelect"), {
                toastId: "invalid-choosing-slot",
                autoClose: 5000
              });
              return prevForm;
            } else updatedFormCalendar.push({ date: nextWeekDate, slotId: slot.id, courtId: currentCourt.key });
          }
        }

        updatedFormCalendar.sort((a, b) => moment(a.date).diff(moment(b.date)));

        return updatedFormCalendar;
      });
    } else {
      setFormCalendar((prevForm) => {

        let updatedFormCalendar = prevForm ? [...prevForm] : [];

        const slotIndex = updatedFormCalendar.findIndex(detail =>
          detail.slotId === slot.id &&
          detail.courtId === currentCourt.key &&
          detail.date === formattedDate
        );

        if (slotIndex > -1) {
          updatedFormCalendar.splice(slotIndex, 1);
        } else {
          updatedFormCalendar.push({ date: formattedDate, slotId: slot.id, courtId: currentCourt.key });
        }

        updatedFormCalendar.sort((a, b) => moment(a.date).diff(moment(b.date)));

        return updatedFormCalendar;
      });
    }
  };
  //END CHOOSE DAY SLOT

  useEffect(() => {
    console.log(formCalendar);
  }, [formCalendar])



  const handleButton = async (form: any) => {
    if (props.typeOfCalendar === 'manage') {
      setLoading(true);
      try {
        await props.handleButton(form);
      } catch { }
      finally {
        loadCourt(currentCourt.key);
      }
    } else {
      props.handleButton(form)
    }
  }

  const handleReset = () => {
    if (formCalendar && formCalendar.length)
    showAlert({
      title: t('areYouSure') + "?",
      message: t('youWillNotAbleToRecoverTheEntireSelection') + "!",
      type: 'warning',
      onConfirmClick: () => setFormCalendar([])
    });
  }

  return (
    <div className=''>

      {
        (isEmptyObject(centre) || isEmptyObject(court))
          ?
          <div className='h-[200px] flex items-center justify-center'>
            <SpinnerLoading
              height='80'
              width='80'
              color='#2B5A50'
            />
          </div>
          :
          (
            <div className="container mx-auto">
              <div className="wrapper bg-white rounded w-full ">
                <CalendarHeader
                  yearItems={yearItems}
                  weekItems={weekItems}
                  courtItems={courtItems}
                  currentWeekIndex={currentWeekIndex}
                  typeOfCalendar={typeOfCalendar}
                  formCalendar={formCalendar}
                  handleButton={handleButton}
                  handleReset={handleReset}
                  handleWeeklyBooking={(number, status) => {
                    setWeeklyBooking(status);
                    setFrequency(number);
                  }}
                  existSelection={formCalendar != undefined && formCalendar.length != 0}
                  handleSelectCourt={handleSelectCourt}
                  handleSelectWeek={handleSelectWeek}
                  handleSelectYear={handleSelectYear}
                  goPrevious={goPrevious}
                  goNext={goNext}
                />
                <CalendarTable
                  centre={centre}
                  selectedWeek={selectedWeek}
                  isDisable={isDisable}
                  handleClick={handleClick}
                  formCalendar={formCalendar}
                  loading={loading}
                />
              </div>
            </div>
          )}

    </div>
  )
}

export default Calendar;
