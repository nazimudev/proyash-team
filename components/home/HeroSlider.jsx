"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  "/images/home/slider/slider1.jpg",
  "/images/home/slider/slider2.jpeg",
  "/images/home/slider/slider3.jpg",
  "/images/home/slider/slider4.jpg",
  "/images/home/slider/slider5.jpg",
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pb-10">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-forest/5 shadow-2xl shadow-deep/15 sm:aspect-16/10 lg:aspect-4/3">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeIndex === index ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Proyash community activity ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 text-forest shadow-lg backdrop-blur transition hover:bg-white sm:left-4 sm:h-12 sm:w-12"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/40 text-forest shadow-lg backdrop-blur transition hover:bg-white sm:right-4 sm:h-12 sm:w-12"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-7 bg-forest"
                : "w-2 bg-forest/25 hover:bg-forest/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
