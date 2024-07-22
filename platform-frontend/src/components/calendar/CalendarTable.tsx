import React from 'react';
import moment from 'moment';
import { CalendarTableProps } from './index';
import SpinnerLoading from '../SpinnerLoading';
import { useTranslation } from 'react-i18next';

const CalendarTable: React.FC<CalendarTableProps> = ({
  centre,
  selectedWeek,
  isDisable,
  handleClick,
  formCalendar,
  loading
}) => {
  const { t } = useTranslation();
  return (
    loading
      ?
      <div className='h-[200px] flex items-center justify-center'>
        <SpinnerLoading
          height='80'
          width='80'
          color='#2B5A50'
        />
      </div>
      :
      <table className="w-full border-t">
        <thead>
          <tr>
            <th className="relative pt-2 border-x xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <div className='absolute left-1/2 -translate-x-1/2'>Slot</div>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Sunday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Sun</span>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Monday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Mon</span>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Tuesday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Tue</span>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Wednesday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Wed</span>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Thursday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Thu</span>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Friday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Fri</span>
            </th>
            <th className="border-x pt-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs">
              <span className="xl:block lg:block md:block sm:block hidden">{t('Saturday')}</span>
              <span className="xl:hidden lg:hidden md:hidden sm:hidden block">Sat</span>
            </th>
          </tr>
          <tr className="text-center">
            <th className="border-x pb-2 border-b xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto"></th>
            {selectedWeek.map((day, index) => (
              <th key={index}
                className="border-x pb-2 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto">
                <div className="flex flex-col justify-center items-center xl:w-32 lg:w-30 md:w-30 sm:w-full w-10 mx-auto overflow-hidden">
                  <div className="top h-5 w-full">
                    <span className="text-gray-500">{moment(day, 'MM/DD').format('DD')}</span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {centre.slots.map((slot, index) => (
            <tr key={index} className="text-center">
              <td className="border-x border-b p-1 h-10 xl:w-32 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto text-gray-500">
                {slot.slotNo}
                <br />
                <span className='text-xs'>
                  {`${moment(slot.startTime, "HH:mm:ss").format("H:mm")}
                - ${(moment(slot.endTime, "HH:mm:ss").format("H:mm"))}`}
                </span>
              </td>
              {selectedWeek.map((day, index) => (
                <td
                  key={index}
                  onClick={() => !isDisable(day, slot) && handleClick(slot, day)}
                  className={
                    isDisable(day, slot)
                      ? "border p-1 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto bg-gray-300"
                      : `${formCalendar.some(detail => detail.slotId === slot.id && detail.date === moment(day, "MM/DD").format("YYYY-MM-DD")) ? "bg-[#CDFAE7]" : ""} border p-1 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-300 ease hover:bg-[#CDFAE7]`
                  }
                >
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default CalendarTable;
