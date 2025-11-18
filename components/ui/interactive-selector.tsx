"use client";

import React, { useState, useEffect } from 'react';
import { Tent, Flame, Droplet, Sparkles, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SelectorOption {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface InteractiveSelectorProps {
  title?: string;
  subtitle?: string;
  options?: SelectorOption[];
  className?: string;
}

const InteractiveSelector: React.FC<InteractiveSelectorProps> = ({
  title = "Escape in Style",
  subtitle = "Discover luxurious camping experiences in nature's most breathtaking spots.",
  options,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  
  const defaultOptions: SelectorOption[] = [
    {
      title: "Luxury Tent",
      description: "Cozy glamping under the stars",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      icon: <Tent size={24} className="text-primary-white" />
    },
    {
      title: "Campfire Feast",
      description: "Gourmet s'mores & stories",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      icon: <Flame size={24} className="text-primary-white" />
    },
    {
      title: "Lakeside Retreat",
      description: "Private dock & canoe rides",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      icon: <Droplet size={24} className="text-primary-white" />
    },
    {
      title: "Mountain Spa",
      description: "Outdoor sauna & hot tub",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
      icon: <Sparkles size={24} className="text-primary-white" />
    },
    {
      title: "Guided Adventure",
      description: "Expert-led nature tours",
      image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
      icon: <Mountain size={24} className="text-primary-white" />
    }
  ];

  const selectorOptions = options || defaultOptions;

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    selectorOptions.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [selectorOptions.length]);

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-b from-black to-black/95 font-sans text-primary-white ${className}`}>
      {/* Header Section */}
      <div className="w-full max-w-2xl px-6 mt-8 mb-2 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-5xl font-extrabold text-primary-yellow mb-3 tracking-tight drop-shadow-lg"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-primary-white/80 font-medium max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="h-12"></div>

      {/* Options Container */}
      <div className="options flex w-full max-w-[900px] min-w-[320px] md:min-w-[600px] h-[400px] mx-0 items-stretch overflow-hidden relative px-4">
        {selectorOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -60 }}
            animate={{
              opacity: animatedOptions.includes(index) ? 1 : 0,
              x: animatedOptions.includes(index) ? 0 : -60,
            }}
            transition={{ duration: 0.5, delay: 0.18 * index }}
            className={`
              option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'active' : ''}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
              backgroundPosition: 'center',
              backfaceVisibility: 'hidden',
              minWidth: '60px',
              minHeight: '100px',
              margin: 0,
              borderRadius: '12px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: activeIndex === index ? '#fbbd31' : 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              backgroundColor: '#18181b',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(251, 189, 49, 0.30)' 
                : '0 10px 30px rgba(0,0,0,0.30)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
              willChange: 'flex-grow, box-shadow, background-size, background-position'
            }}
            onClick={() => handleOptionClick(index)}
            whileHover={activeIndex !== index ? { scale: 1.02 } : {}}
          >
            {/* Shadow effect */}
            <div 
              className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? '0' : '-40px',
                height: '120px',
                boxShadow: activeIndex === index 
                  ? 'inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000' 
                  : 'inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000'
              }}
            ></div>
            
            {/* Label with icon and info */}
            <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-2 pointer-events-none px-4 gap-3 w-full">
              <div 
                className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-black/60 backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.18)] border-2 flex-shrink-0 flex-grow-0 transition-all duration-200"
                style={{
                  borderColor: activeIndex === index ? '#fbbd31' : 'rgba(255, 255, 255, 0.2)'
                }}
              >
                {option.icon}
              </div>
              <div className="info text-primary-white whitespace-pre relative">
                <motion.div 
                  className="main font-bold text-lg text-primary-white transition-all duration-700 ease-in-out"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    x: activeIndex === index ? 0 : 25
                  }}
                  transition={{ duration: 0.7 }}
                >
                  {option.title}
                </motion.div>
                <motion.div 
                  className="sub text-base text-primary-white/70 transition-all duration-700 ease-in-out"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    x: activeIndex === index ? 0 : 25
                  }}
                  transition={{ duration: 0.7 }}
                >
                  {option.description}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSelector;

