import React, { useState, useEffect } from 'react';
import star from '../assets/images/star.svg';
import nostar from '../assets/images/nostar.svg';

interface RatingProps {
  ratingWrapper?: string;
  editable?: boolean;
  star?: string;
  value: number; // Thêm kiểu dữ liệu cho props 'value'
  onChange?: (value: number) => void; // Thêm kiểu dữ liệu cho prop onChange
}

const Rating: React.FC<RatingProps> = (props) => {
  const [ratingValue, setRatingValue] = useState<number>(props.value); // Sử dụng useState với kiểu dữ liệu number cho ratingValue

  useEffect(() => {
    setRatingValue(props.value);
  }, [props.value]);

  const handleClick = (value: number) => {
    if (props.editable) {
      if (value === ratingValue) {
        setRatingValue(0);
      }
      else {
        setRatingValue(value);
      }
      if (props.onChange) {
        props.onChange(value);
      }
    }
  };

  return (
    <div className={props.ratingWrapper}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={props.editable ? 'cursor-pointer' : ''}
          onClick={() => handleClick(i)}
        >
          <img
            src={ratingValue >= i ? star : nostar}
            alt="Star"
            className={props.star}
          />
        </div>
      ))}
    </div>
  );
};

export default Rating;
