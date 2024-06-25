import React from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '../../components/Rating';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { CentreProps } from './types';
import Button from '../../components/button';

const CentreCard: React.FC<{ centre: CentreProps }> = ({ centre }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='bg-white rounded-2xl shadow-2xl border py-5 px-7 flex gap-7'>
      <img
        src={centre.coreImg}
        alt={centre.name}
        className='w-2/5 h-56 object-cover object-center rounded-lg'
      />
      <div className='flex flex-col gap-3 flex-1 justify-between'>
        <div className='font-semibold text-xl'>
          {centre.name}
        </div>
        <Rating
          ratingWrapper='flex gap-1'
          value={centre.currentRate}
          editable={false}
        />
        <div>
          <span className='font-semibold'>{t('address')}: </span>
          {centre.address}, {t(centre.district)}
        </div>
        <div className='flex gap-3'>
          <div>
            <span className='font-semibold'>{t('openTime')}: </span>
            {moment(centre.openTime, 'HH:mm:ss').format('HH:mm')} - {moment(centre.closeTime, 'HH:mm:ss').format('HH:mm')}
          </div>
          <div>
            <span className='font-semibold'>{t('numberOfCourts')}: </span>
            {centre.numberOfCourts}
          </div>
        </div>
        <div>
          <span className='font-semibold'>{t('price')}: </span>
          <span className='font-semibold text-rose-600'>
            {centre?.pricePerHour.toLocaleString('de-DE')} VND/h
          </span>
        </div>
        <div className='text-sm flex justify-center gap-20'>
          <Button
            label={t('centreDetail')}
            fullWidth
            size='mini'
            className='border border-gray-800 font-semibold hover:text-white hover:bg-gray-800'
            onClick={() => navigate(`/centreBooking/${centre.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default CentreCard;
