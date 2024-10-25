import React, { useState, useRef, useEffect } from 'react';
import { useMousePosition } from '../../../utils/useMousePosition';
import { useHover } from '@uidotdev/usehooks';

const ScrollText = ({ screen, i, setCurrentImage, currentImage }) => {
  const [textRef, hovering] = useHover(); 
  const { xPos, yPos } = useMousePosition();
  const size = hovering ? 300 : 40;
  const [showAnimation, setShowAnimation] = useState(false);
  const ref = useRef(null);

  const toggleAnimation = (e) => {
    if (e[0]?.isIntersecting) {
      setShowAnimation(true);
      setCurrentImage(i);
    }
  };

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(toggleAnimation, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div className={`overflow-hidden xl:p-20 lg:p-10 border-0 ${showAnimation ? 'text-visible' : 'screen-text'}`} ref={ref}>
      <div className='flex font-bold tracking-tighter'>
        <div className='p-4 text-gray-300 xl:text-9xl font-stencil-scroll lg:text-8xl md:text-6xl sm2:text-5xl sm1:hidden md:hidden'>
          {screen.id}
          <span className='lg:text-6xl md:text-5xl sm2:text-4xl sm1:text-3xl sm1:hidden'>#</span>
        </div>
        <div className='flex flex-col'>
          <div className='flex flex-col'>
            <div className='w-4/5 m-auto font-extrabold xl:p-6 lg:p-4 xl:text-8xl lg:text-7xl md:text-8xl md:pt-2 lg:pt-0 sm2:text-5xl sm1:text-4xl sm1:p-4 sm1:pl-0'>
              <div className='text-gray-400'>{screen.heading1}</div>
              <div className='text-gray-400'>{screen.heading2}</div>
            </div>
            {/* Optional mask animation, adjust or uncomment as needed */}
            {/* <motion.div 
              animate={{
                WebkitMaskPosition: hovering ? `${xPos - 1.5 * size}px ${yPos - size}px` : `${xPos - 6 * size}px ${yPos - 6 * size}px`,
                WebkitMaskSize: `${size}px`,
              }}
              transition={{ type: 'tween', ease: 'backOut' }}
              className='p-6 pb-8 text-gray-300 lg:-mt-[11em] xl:-mt-60 sm3:-mt-32 mask sm1:hidden lg:block sm2:-mt-24 sm1:-mt-20'
            >
              <p className="xl:text-8xl lg:text-7xl md:text-6xl sm3:text-5xl" ref={textRef}>{screen.maskText}</p>
            </motion.div> */}
          </div>
          <div className='w-4/5 m-auto font-light tracking-normal text-left text-gray-300 lg:p-8 xl:text-lg lg:text-lg md:text-lg sm1:mt-0 md:mt-8 lg:mt-0 sm1:text-xs'>
            {screen.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollText;
