import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import SpinnerLoading from '../components/SpinnerLoading';
import Filters from './all-centre-component/Filters';
import CentreList from './all-centre-component/CentreList';
import Pagination from '../components/pagination';
import { CentreProps } from './all-centre-component/types';
import { useTranslation } from 'react-i18next';

const Centre: React.FC<{ selectedDistrict: string }> = ({ selectedDistrict }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [centreList, setCentreList] = useState<CentreProps[]>([]);
  const [filteredCentreList, setFilteredCentreList] = useState<CentreProps[]>([]);
  const [minValue, setMinValue] = useState<number | undefined>();
  const [maxValue, setMaxValue] = useState<number | undefined>();
  const [selectedRating, setSelectedRating] = useState(0);
  const [isRatingFilterActive, setIsRatingFilterActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const load = async () => {
      setLoading(true);
      await axiosInstance.get(`/courtstar/centre/getAllCentreActive`, { signal })
        .then(res => {
          setCentreList(res.data.data.reverse());
          setFilteredCentreList(res.data.data);
        })
        .catch(error => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    load();
    return () => {
      controller.abort();
    }
  }, []);

  useEffect(() => {
    let filteredList = centreList;
    setCurrentPage(1);
    if (selectedDistrict && typeof selectedDistrict === 'string') {
      filteredList = filteredList.filter(centre => centre.district.toLowerCase() === selectedDistrict.toLowerCase());
    }
    if (minValue) {
      filteredList = filteredList.filter(centre => centre.pricePerHour >= minValue);
    }
    if (maxValue) {
      filteredList = filteredList.filter(centre => centre.pricePerHour <= maxValue);
    }
    if (selectedRating !== 0) {
      filteredList = filteredList.filter(centre => centre.currentRate >= selectedRating);
    }
    if (isRatingFilterActive) {
      filteredList.sort((a, b) => a.currentRate - b.currentRate);
    }
    setFilteredCentreList(filteredList);
  }, [selectedDistrict, minValue, maxValue, selectedRating, centreList, isRatingFilterActive]);

  const handlePriceChange = (min: number, max: number) => {
    setMaxValue(max);
    setMinValue(min);
  };

  const handleRatingChange = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(0);
      setIsRatingFilterActive(false);
    } else {
      setSelectedRating(rating);
      setIsRatingFilterActive(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCentres = filteredCentreList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className='font-Inter text-base overflow-x-hidden text-gray-800'>
      <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
        <div id="top"
          className="max-w-screen-1440 1440:mx-auto mx-4 py-10 px-12 w-full flex flex-col gap-4 items-center justify-between">

          <div className='font-bold text-3xl uppercase text-center w-full' id='centre-list'>
            {t('listOfCentres')}
          </div>

          {loading ? (
            <div className='flex items-center justify-center h-[400px]'>
              <SpinnerLoading color='#2B5A50' />
            </div>
          ) : (
            <div className='flex gap-5 w-full'>
              <div>
                <Filters
                  handleRatingChange={handleRatingChange}
                  handlePriceChange={handlePriceChange}
                />
              </div>
              {currentCentres.length > 0 ? (
                <div className='w-full flex flex-col gap-5'>
                  <CentreList centres={currentCentres} />

                  {
                    filteredCentreList.length > itemsPerPage
                    &&
                    <Pagination
                      totalItems={filteredCentreList.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  }
                </div>
              ) : (
                    <div className='flex flex-col items-center justify-center text-3xl text-primary mx-auto'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="250" height="250"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search-x"
                  >
                    <path d="m13.5 8.5-5 5" />
                    <path d="m8.5 8.5 5 5" />
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  No centres found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Centre;
