import React, { useState, useEffect } from 'react';
import Button from '../button';
import { FeedbackProps } from './index';
import Pagination from '../pagination';
import FeedbackItem from './feedbackItem';

const Feedback: React.FC<FeedbackProps> = ({ listItem, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<number>(1);
  const [sortedFeedbacks, setSortedFeedbacks] = useState(listItem);

  useEffect(() => {
    const sortedList = [...listItem];
    if (activeFilter === 1) {
      sortedList.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
    } else if (activeFilter === 2) {
      sortedList.sort((a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime());
    }
    setSortedFeedbacks(sortedList);
  }, [activeFilter, listItem]);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(listItem.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const paginatedFeedbacks = sortedFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-9 py-5">
      {paginatedFeedbacks.length ? (
        <>
          <div className="flex gap-6 justify-start items-center ml-4">
            <div className="">
              <Button
                label="Newest"
                size="small"
                className={`${activeFilter === 1 ? ' bg-primary-green text-white ' : ' text-primary-green '} border border-primary-green hover:bg-primary-green hover:text-white`}
                onClick={() => setActiveFilter(1)}
              />
            </div>
            <div className="">
              <Button
                label="Oldest"
                size="small"
                className={`${activeFilter === 2 ? ' bg-primary-green text-white ' : ' text-primary-green '} border border-primary-green hover:bg-primary-green hover:text-white`}
                onClick={() => setActiveFilter(2)}
              />
            </div>
          </div>

          <div className="p-4 divide-y-2">
            {paginatedFeedbacks.map((feedback) => (
              <FeedbackItem
                key={feedback.id}
                id={feedback.id}
                fullName={feedback.fullName}
                rate={feedback.rate}
                createDate={feedback.createDate}
                content={feedback.content}
              />
            ))}
          </div>

          {itemsPerPage <= listItem.length && (
            <Pagination
              totalItems={listItem.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handleChangePage}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col h-80 gap-3 justify-center items-center text-3xl text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-circle-off"
          >
            <path d="M20.5 14.9A9 9 0 0 0 9.1 3.5" />
            <path d="m2 2 20 20" />
            <path d="M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7" />
          </svg>
          There is no feedback yet!
        </div>
      )}
    </div>
  );
};

export default Feedback;
