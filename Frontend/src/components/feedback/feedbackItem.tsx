import React from 'react';
import { FeedbackItemProps } from './index';
import Rating from '../Rating';
import moment from 'moment';

const FeedbackItem: React.FC<FeedbackItemProps> = ({ id, fullName, rate, content, createDate }) => (
  <div key={id} className="flex flex-col gap-1.5 py-4">
    <div className="font-semibold flex gap-3 items-center">
      <div>{fullName}</div>
      <div className='text-xs font-normal text-gray-500'>{moment(createDate).fromNow()}</div>
    </div>
    <div className="">
      <Rating ratingWrapper="flex" star="w-5" value={rate} />
    </div>
    <div className="text-sm">{content}</div>
  </div>
);

export default FeedbackItem;
