import React from 'react';
import { PaginationProps } from './index';
import Button from '../button';

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <Button
        label={number.toString()}
        key={number}
        size='mini'
        className={number === currentPage
          ? 'text-sm w-7 font-semibold text-white bg-primary-green border border-primary-green'
          : 'text-sm w-7 font-semibold text-primary-green border border-primary-green bg-white hover:text-white hover:bg-primary-green'}
        onClick={() => handleOnPageChange(number)}
      />
    ));
  };

  const handleOnPageChange = (number: number) => {
    const top = document.getElementById('top');
    if (top) {
      const offset = 80;
      const elementPosition = top.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    onPageChange(number);
  }

  return (
    <div className="flex justify-center items-center gap-1.5 font-semibold my-1">
      <a
        className='flex justify-center w-7 rounded-md hover:bg-slate-300 text-primary-green aria-disabled:opacity-70 aria-disabled:pointer-events-none hover:text-white ease-in-out duration-200 cursor-pointer'
        onClick={() => handleOnPageChange(1)}
        aria-disabled={currentPage === 1}
      >
        &laquo;
      </a>
      <div className='flex gap-1 justify-center items-center'>
        {renderPageNumbers()}
      </div>
      <a
        className='flex justify-center w-7 rounded-md hover:bg-slate-300 text-primary-green aria-disabled:opacity-70 aria-disabled:pointer-events-none hover:text-white ease-in-out duration-200 cursor-pointer'
        onClick={() => handleOnPageChange(totalPages)}
        aria-disabled={currentPage === totalPages}
      >
        &raquo;
      </a>
    </div>
  );
};

export default Pagination;
