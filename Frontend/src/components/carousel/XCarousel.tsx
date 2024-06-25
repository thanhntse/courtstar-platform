import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './carousel.css';
import { XCarouselProps } from './index';
import SpinnerLoading from '../SpinnerLoading';

const XCarousel: React.FC<XCarouselProps> = ({ images }) => {
  return (
    <div className="carousel-container">
      {
      images?.length > 0
      ?
      <Carousel
        autoPlay
        interval={3000}
        infiniteLoop
        showStatus={false}
        thumbWidth={100}
        transitionTime={1000}
      >
        {images.map((image) => (
          <div key={image.id} className="w-[800px] h-[400px]">
            <img
              src={image.url}
              alt={`Image ${image.imageNo}`}
              className="object-cover object-center w-full h-full rounded-lg"
            />
          </div>
        ))}
      </Carousel>
      :
      <div className="h-[400px] flex items-center justify-center">
        <SpinnerLoading
          height='80'
          width='80'
          color='#2B5A50'
        />
      </div>
      }
    </div>
  );
};

export default XCarousel;
