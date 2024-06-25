import React, { useEffect, useState } from 'react';
import banner from '../assets/images/banner.png';
import Dropdown from '../components/dropdown';
import Button from '../components/button';
import { useTranslation } from 'react-i18next';

const Banner = ({ onDistrictSelect }) => {
  const { t } = useTranslation();

  const items = [
    {
      key: 'all',
      label: t('allCenTre')
    },
    {
      key: 'thuDucCity',
      label: t('thuDucCity')
    },
    {
      key: 'district1',
      label: t('district1')
    },
    {
      key: 'district3',
      label: t('district3')
    },
    {
      key: 'district4',
      label: t('district4')
    },
    {
      key: 'district5',
      label: t('district5')
    },
    {
      key: 'district6',
      label: t('district6')
    },
    {
      key: 'district7',
      label: t('district7')
    },
    {
      key: 'district8',
      label: t('district8')
    },
    {
      key: 'district10',
      label: t('district10')
    },
    {
      key: 'district11',
      label: t('district11')
    },
    {
      key: 'district12',
      label: t('district12')
    },
    {
      key: 'binhTanDistrict',
      label: t('binhTanDistrict')
    },
    {
      key: 'binhThanhDistrict',
      label: t('binhThanhDistrict')
    },
    {
      key: 'goVapDistrict',
      label: t('goVapDistrict')
    },
    {
      key: 'phuNhuanDistrict',
      label: t('phuNhuanDistrict')
    },
    {
      key: 'tanBinhDistrict',
      label: t('tanBinhDistrict')
    },
    {
      key: 'tanPhuDistrict',
      label: t('tanPhuDistrict')
    },
    {
      key: 'nhaBeProvince',
      label: t('nhaBeProvince')
    },
    {
      key: 'canGioProvince',
      label: t('canGioProvince')
    },
    {
      key: 'cuChiProvince',
      label: t('cuChiProvince')
    },
    {
      key: 'hocMonProvince',
      label: t('hocMonProvince')
    },
    {
      key: 'binhChanhProvince',
      label: t('binhChanhProvince')
    }
  ];

  const handleSelect = (item) => {
    onDistrictSelect(item.key);
    if (item.key === 'all') {
      onDistrictSelect('');
    }
  };

  const handleFindClick = () => {
    const centreListElement = document.getElementById('centre-list');
    if (centreListElement) {
      const offset = 80;
      const elementPosition = centreListElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='font-Inter text-base bg-gray-100 overflow-x-hidden'>
      <div className="flex flex-wrap sm:justify-start sm:flex-nowrap 2xl:max-w-screen-1440 2xl:mx-auto max-h-[500px] relative">
        <img src={banner} alt="Banner" className='object-center object-cover opacity-50' />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10 max-w-[450px] w-full flex flex-col gap-3.5 items-center justify-between bg-white rounded-3xl py-5 px-10 shadow-gray-800 shadow-lg">
          <div className='text-4xl font-medium text-gray-800'>
            {t('findCourtNow')}
          </div>
          <div className='text-gray-500 text-sm text-center'>
            {t('searchForBadmintonCourtsInHoChiMinhCity')}
          </div>
          <Dropdown
            placeholder={t('selectTheDistrict')}
            items={items}
            onSelect={handleSelect}
          />
          <Button
            label={t('find')}
            fullWidth
            fullRounded
            size='medium'
            className='bg-primary-green hover:bg-teal-900 text-white'
            onClick={handleFindClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
