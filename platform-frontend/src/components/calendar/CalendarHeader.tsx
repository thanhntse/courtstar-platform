import React from 'react';
import Dropdown from '../dropdown';
import Button from '../button';
import { CalendarHeaderProps } from './index';
import { useTranslation } from 'react-i18next';
import SwitchButton from './switch-button/SwitchButton';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  yearItems,
  handleSelectYear,
  weekItems,
  currentWeekIndex,
  handleSelectWeek,
  courtItems,
  handleSelectCourt,
  goPrevious,
  goNext,
  typeOfCalendar,
  formCalendar,
  handleButton,
  handleReset,
  handleWeeklyBooking,
  existSelection,
}) => {
  const { t } = useTranslation();
  return (
    <div className="header flex justify-between items-center py-2">
      <div className="flex gap-4">
        <div className='w-28'>
          <Dropdown
            items={yearItems}
            initialValue={yearItems[0].label}
            onSelect={handleSelectYear}
          />
        </div>
        <div className='w-52'>
          <Dropdown
            items={weekItems}
            initialValue={weekItems[currentWeekIndex].label}
            onSelect={handleSelectWeek}
          />
        </div>
        <div className='w-32'>
          <Dropdown
            items={courtItems}
            onSelect={handleSelectCourt}
            initialValue={courtItems[0].label}
          />
        </div>
        <div className="flex text-gray-500">
          <button className="p-1 hover:text-gray-800 transition-all duration-200 ease-in-out disabled:text-gray-300"
            onClick={goPrevious}
            disabled={currentWeekIndex === 0}
          >
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-left-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path fillRule="evenodd" d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z" />
              <path fillRule="evenodd" d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z" />
            </svg>
          </button>
          <button className="p-1 hover:text-gray-800 transition-all duration-200 ease-in-out disabled:text-gray-300"
            onClick={goNext}
            disabled={currentWeekIndex === weekItems.length - 1}
          >
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path fillRule="evenodd" d="M7.646 11.354a.5.5 0 0 1 0-.708L10.293 8 7.646 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z" />
              <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z" />
            </svg>
          </button>
        </div>
      </div>
      {
        typeOfCalendar === "booking"
        ?
        <div>
          <SwitchButton
            onChange={handleWeeklyBooking}
            existSelection={existSelection}
          />
        </div>
        :
        ""
      }
      <div className="flex gap-5">
        <Button
          label={t('reset')}
          fullWidth
          className='hover:bg-red-600 hover:text-white text-red-600 border-red-600 border font-semibold min-w-24 py-2.5'
          onClick={() => handleReset()}
        />
        <Button
          label={typeOfCalendar === 'booking' ? t('booking') : t('Disable')}
          fullWidth
          className='bg-primary-green hover:bg-teal-900 text-white min-w-24 py-2.5'
          onClick={() => handleButton(formCalendar)}
          disabled={!formCalendar?.length}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
