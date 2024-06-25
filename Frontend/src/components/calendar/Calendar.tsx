import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { CalendarProps } from './index';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';
import SpinnerLoading from '../SpinnerLoading';
import axiosInstance from '../../config/axiosConfig';

const Calendar: React.FC<CalendarProps> = (props) => {

  const [loading, setLoading] = useState(false);

  const typeOfCalendar = props.typeOfCalendar;
  const [formCalendar, setFormCalendar] = useState<any>({
    slotId: "",
    courtNo: "",
    date: "",
    centreId: ""
  });

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
      court.slotUnavailables.some(unavailable =>
        unavailable.slot.id === slot.id &&
        moment(unavailable.date, "YYYY-MM-DD").format('MM/DD') === day
      )
  )


  // HANDLE COURT
  const [courtItems, setCourtItems] = useState([]);
  const [court, setCourt] = useState<any>({});
  const handleSelectCourt = (item) => {
    setLoading(true);
    console.log(`Selected: ${item.key} ${item.label}`);
    setFormCalendar({
      courtNo: item.key,
      centreId: centre.id
    });
    loadCourt(centre.id, item.key);
  };

  const loadCourt = async(centreId, courtNo) => {
    setLoading(true);
    await axiosInstance.get(`/courtstar/court/${centreId}/${courtNo}`, { signal })
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
        key: court.courtNo,
        label: `Court ${court.courtNo}`
      }));
      setCourtItems(items);
      setFormCalendar({
        courtNo: items[0].key,
        centreId: centre.id
      });
      loadCourt(centre.id, 1);
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
      label: `${week[0]} to ${week[6]}`
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
    setFormCalendar(prevForm => ({
      ...prevForm,
      slotId: slot.id,
      date: moment(day, "MM/DD").format("YYYY-MM-DD")
    }));
  }
  //END CHOOSE DAY SLOT


  const handleButton = async(form: any) => {
    if (props.typeOfCalendar === 'manage') {
      setLoading(true);
      try {
        await props.handleButton(form);
      } catch {}
      finally {
        loadCourt(centre.id, form.courtNo);
      }
    } else {
      props.handleButton(form)
    }
  }


  useEffect(() => {
    console.log(formCalendar);
  }, [formCalendar]);

  useEffect(() => {
    console.log(court);
  }, [court]);

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
