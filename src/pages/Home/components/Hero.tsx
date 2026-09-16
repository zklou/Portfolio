import Scope from '@/components/Scope';
import {
  BirdSlide,
  DigitalisSlide,
  InsectSlide,
  RoseSlide,
} from '@/components/Scope/illustrations';
import React, { useEffect, useState } from 'react';
import styles from './Hero.less';
import HeroContent from './HeroContent';

const SLIDES = [
  <InsectSlide key="insect" />,
  <DigitalisSlide key="digitalis" />,
  <BirdSlide key="bird" />,
  <RoseSlide key="rose" />,
];

const SLIDE_INTERVAL_MS = 1900;

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
      if (step >= SLIDES.length) {
        clearInterval(timer);
        setOpen(true);
      }
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero}>
      <Scope open={open} activeIndex={activeIndex} slides={SLIDES}>
        <HeroContent visible={open} />
      </Scope>
    </section>
  );
};

export default Hero;
