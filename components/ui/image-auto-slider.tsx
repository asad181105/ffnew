'use client';

import React from 'react';

interface ImageAutoSliderProps {
  images: string[];
  direction?: 'left' | 'right';
  speed?: number; // seconds for one full cycle
  imageSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ImageAutoSlider({ 
  images, 
  direction = 'left',
  speed = 20,
  imageSize = 'md',
  className = ''
}: ImageAutoSliderProps) {
  if (!images || images.length === 0) return null;

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  const sizeClasses = {
    sm: 'w-32 h-32 md:w-40 md:h-40',
    md: 'w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80',
    lg: 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96',
  };

  const animationName = direction === 'right' ? 'scroll-left' : 'scroll-right';

  return (
    <>
      <style jsx global>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      
      <div className={`relative w-full overflow-hidden ${className}`}>
        <div className="scroll-container w-full">
          <div 
            className="flex gap-6 w-max"
            style={{
              animation: `${animationName} ${speed}s linear infinite`
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className={`image-item flex-shrink-0 ${sizeClasses[imageSize]} rounded-xl overflow-hidden shadow-2xl`}
              >
                <img
                  src={image}
                  alt={`Gallery image ${(index % images.length) + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

