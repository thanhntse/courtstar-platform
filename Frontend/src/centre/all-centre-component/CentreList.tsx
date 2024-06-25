import React from 'react';
import CentreCard from './CentreCard';
import { CentreListProps } from './types';

const CentreList: React.FC<CentreListProps> = ({ centres }) => {
  return (
    <div className='flex-1 flex flex-col gap-7'>
      {centres.map((centre) => (
        <CentreCard
          key={centre.id}
          centre={centre}
        />
      ))}
    </div>
  );
};

export default CentreList;
