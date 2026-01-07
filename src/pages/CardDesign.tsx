import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import FPT from '../assets/FPT.png';
import FPT2 from '../assets/FPT2.png';
import FPT3 from '../assets/FPT3.png'

const images = [FPT, FPT2, FPT3, FPT2, FPT, FPT3];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Slides */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          className={`
        w-full object-contain
        transition-opacity duration-1000 ease-in-out
        ${index === current ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}
      `}
        />
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2
               bg-primary hover:bg-orange-600
               text-white p-1 rounded-full z-20 transition"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2
               bg-primary hover:bg-orange-600
               text-white p-1 rounded-full z-20 transition"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default HeroBanner;
