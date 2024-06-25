import React, { useState } from 'react';
import Centre from './centre/Centre';
import Banner from './centre/Banner';

const Home: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
  };

  console.log(selectedDistrict);

  return (
    <div>
      <Banner onDistrictSelect={handleDistrictSelect} />
      <Centre selectedDistrict={selectedDistrict} />
    </div>
  );
};

export default Home;
