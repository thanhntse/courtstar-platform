import XCarousel from "./XCarousel";

export interface Image {
  id: number;
  imageNo: number;
  url: string;
}

export interface XCarouselProps {
  images: Image[];
}

export default XCarousel;
