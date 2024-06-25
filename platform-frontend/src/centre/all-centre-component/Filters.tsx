import React from 'react';
import Rating from '../../components/Rating';
import RangeSlider from '../RangeSlider';
import { useTranslation } from 'react-i18next';

interface FiltersProps {
  handleRatingChange: (rating: number) => void;
  handlePriceChange: (min: number, max: number) => void;
}

const Filters: React.FC<FiltersProps> = ({ handleRatingChange, handlePriceChange }) => {
  const { t } = useTranslation();

  return (
    <div className='bg-white rounded-2xl shadow-2xl border py-5 px-7 flex flex-col justify-between gap-10'>
      <div>
        <div className='font-bold text-2xl uppercase'>
          {t('rating')}
        </div>
        <Rating
          ratingWrapper='flex gap-1 p-5'
          value={0}
          editable={true}
          onChange={handleRatingChange}
        />
      </div>
      <div>
        <div className='font-bold text-2xl uppercase'>
          {t('priceRange')}
        </div>
        <RangeSlider priceRange={handlePriceChange} />
      </div>
    </div>
  );
};

export default Filters;
