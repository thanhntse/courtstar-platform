import React, { useState, useEffect } from 'react';

interface CounterProps {
  endNumber: number;
  duration: number;
  prefix?: string;
  postfix?: string;
}

const Counter: React.FC<CounterProps> = ({ endNumber, duration, prefix = '', postfix = '' }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const totalDuration = duration; // total duration in milliseconds
    const incrementTime = 1000 / 60; // update frequency in milliseconds (60fps)

    const step = (endNumber - start) / (totalDuration / incrementTime);

    const interval = setInterval(() => {
      start += step;
      if (start >= endNumber) {
        start = endNumber;
        clearInterval(interval);
      }
      setCount(Math.ceil(start));
    }, incrementTime);

    return () => clearInterval(interval);
  }, [endNumber, duration]);

  return (
    <div>
      <div>
        {prefix}
        {count.toLocaleString('de-DE')}
        {postfix}
      </div>
    </div>
  );
};

export default Counter;
