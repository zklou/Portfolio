import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import Lottie from 'lottie-react';
import { FaGithub } from 'react-icons/fa';
import portfolio from '../../../public/media/lotties/Portfolio(Project).json';
import blindcoding from '../../../public/media/lotties/BlindCoding(Projects).json';
import optistock from '../../../public/media/lotties/Optistock(Project).json';
import sketch from '../../../public/media/lotties/AnimatedMarker(Projects).json';

const Projects = () => {
  const [view, setView] = useState(false);
  const numRef = useRef(null);

  const toggleAnimation = (e) => {
    if (e[0]?.isIntersecting) {
      setView(true);
      console.log("visible" + view);
    }
  };

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(toggleAnimation, options);
    if (numRef.current) {
      observer.observe(numRef.current);
    }
    return () => {
      if (numRef.current) {
        observer.unobserve(numRef.current);
      }
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const toRight = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const toLeft = useTransform(scrollYProgress, [0, 1], [-100, -2000]);

  const NumberFloat = ({ n }) => {
    const { number } = useSpring({
      from: { number: 0.1 },
      number: n,
      delay: 0,
      config: { mass: 1, tension: 30, friction: 10 },
    });
    return (
      view && (
        <animated.div className="md:text-8xl sm1:text-6xl sm2:text-7xl">{number.to((n) => n.toFixed(1))}</animated.div>
      )
    );
  };

  const NumberInt = ({ n }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 0,
      config: { mass: 1, tension: 30, friction: 10 },
    });
    return (
      view && (
        <animated.div className="md:text-8xl sm1:text-6xl sm2:text-7xl">{number.to((n) => n.toFixed(0))}</animated.div>
      )
    );
  };

  return (
    <div className='text-white bg-[#000] border-0'>
      <motion.div
        className="font-extrabold tracking-tighter text-white border-0 font-mine2 md:text-10xl sm1:text-8xl"
        style={{ x: toRight }}
      >
        <span className='font-mine2'>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
          <span>FEATURED</span>
          <span className="font-stencil-scrollnew text-gray-400">FEATURED</span>
        </span>
      </motion.div>
      <motion.div
        style={{ x: toLeft }}
        className="tracking-tighter text-white border-0 sm1:mt-0 md:mt-4 md:text-10xl sm1:text-8xl"
      >
        <span className='font-mine2'>
          <span>WORK</span>
          <span className="font-stencil-scrollnew text-gray-400">WORK</span>
          <span>WORK</span>
          <span className="font-stencil-scrollnew text-gray-400">WORK</span>
          <span>WORK</span>
          <span className="font-stencil-scrollnew text-gray-400">WORK</span>
          <span>WORK</span>
          <span className="font-stencil-scrollnew text-gray-400">WORK</span>
          <span>WORK</span>
          <span className="font-stencil-scrollnew text-gray-400">WORK</span>
          <span>WORK</span>
        </span>
      </motion.div>
      <div className='m-auto mt-4 font-bold border-0 md:text-lg sm1:w-3/5 md:w-2/5 lg:w-1/5 sm1:text-md'>
        <div className='ml-auto text-xl text-center text-gray-400 border-0 xl:w-full sm1:w-full'>
          Projects
        </div>
      </div>

      {/* 1st proj */}
      <div className='relative mt-20 border-0'>
        <div className='relative border-0'>
          <Image src="./media/projects/portfolio/portfolio2.png" alt="" width={300} height={200} className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0' />
          <Image src="./media/projects/portfolio/portfolio3.png" alt="" width={300} height={200} className='absolute top-0 z-20 -translate-x-1/2 border-0 sm1:hidden lg:block left-1/2' />
          <div className='absolute top-0 z-40 text-4xl font-extrabold text-white text-center sm1:text-6xl md:text-7xl lowercase tracking-tight border-0 w-fit h-fit p-0 leading-[4rem] mt-24 left-1/2 -translate-x-1/2'>01.</div>
          <Lottie animationData={sketch} className='absolute top-0 mt-64 -rotate-45 md:block sm1:hidden invert grayscale left-1/2' />
        </div>
        <div className='relative flex mt-0 border-0 sm1:flex-col lg:flex-row'>
          <div className='mt-8 border-0 sm1:w-full lg:w-1/2'>
            <Lottie animationData={portfolio} className="overflow-hidden border-0 pt-36 sm1:hidden lg:flex h-fit rounded-3xl invert-0" loop={true} />
          </div>
          <div className='bg-cover border-0 sm1:w-full lg:w-1/2'>
            <div className='m-auto mt-16 mb-16 text-white border-0 sm1:p-8 md:p-20 lg:p-4 xl:p-20 sm1:w-full lg:w-4/5 rounded-3xl bg-gray-800/20 backdrop-filter backdrop-blur-sm'>
              <div className='flex justify-between'>
                <p className='text-5xl font-extrabold underline underline-offset-8'>Portfolio <span className='text-gray-400'>Website</span></p>
                <a href={'https://github.com/zklou/Portfolio'} target="_blank" className='hover:scale-[1.2] transition ease-in-out duration-300'>
                  <div className='pt-2'>
                    <span className="text-4xl"><FaGithub /></span>
                  </div>
                </a>
              </div>
              <p className='mt-12'>
                This full-stack portfolio website showcases my expertise in building scalable and interactive applications. Developed using Next.js and styled with TailwindCSS, it features a clean and engaging design with animations created using GSAP, Framer Motion, and Lottie files. The Intersection Observer API powers smooth scroll effects for a dynamic user experience. The site includes sections detailing my academic and professional journey, alongside a portfolio of projects that highlight my technical skills. A contact form integrated with Nodemailer provides a direct line for communication.
              </p>
              <p className='mt-10 text-2xl font-extrabold text-gray-400'>Tech stack used :</p>
              <div className='flex flex-wrap mt-4 -ml-2 space-x-2 space-y-2'>
                <p className='p-2 mt-2 ml-2 text-white bg-gray-600/30 rounded-xl'>Next.js</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>TailwindCSS</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Framer Motion</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Lottie</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Figma</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Nodemailer</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Intersection Observer API</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Greensock Animation (GSAP)</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>react-confetti</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 2nd proj */}
      <div className='relative mt-8 border-0'>
        <div className='relative border-0'>
          <Image
            src="./media/projects/blindcoding/DNF1.jpg"
            alt=""
            width={300}
            height={200}
            className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0'
          />
          <Image
            src="./media/projects/blindcoding/DNF2.jpg"
            alt=""
            width={300}
            height={200}
            className='absolute top-0 z-20 -translate-x-1/2 border-0 sm1:hidden lg:block left-1/2'
          />
          <Image
            src="./media/projects/blindcoding/DNF3.jpg"
            alt=""
            width={300}
            height={200}
            className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0'
          />
          <Image
            src="./media/projects/blindcoding/DNF4.png"
            alt=""
            width={300}
            height={200}
            className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0'
          />
          <div className='absolute top-0 z-40 text-4xl font-extrabold text-black text-center sm1:text-6xl md:text-7xl lowercase tracking-tight border-0 w-fit h-fit p-0 leading-[4rem] mt-24 left-1/2 -translate-x-1/2'>02.</div>
          <Lottie
            animationData={sketch}
            className='absolute top-0 mt-64 -rotate-45 md:block sm1:hidden invert grayscale left-1/2'
          />
        </div>
        <div className='relative flex mt-0 border-0 sm1:flex-col lg:flex-row'>
          <div className='bg-cover border-0 sm1:w-full lg:w-1/2'>
            <div className='m-auto mt-16 mb-16 text-white border-0 sm1:p-8 md:p-20 lg:p-4 xl:p-20 sm1:w-full lg:w-4/5 rounded-3xl bg-black/20 backdrop-filter backdrop-blur-sm'>
              <div className='flex justify-between'>
                <p className='text-5xl font-extrabold underline underline-offset-8'>
                  AWS Microservice <span className='text-gray-400'>Online Game Platform</span>
                </p>
                <a href={'https://github.com/zklou/DNF-Server'} target="_blank" className='hover:scale-[1.2] transition ease-in-out duration-300'>
                  <div className='pt-2'>
                    <span className="text-4xl"><FaGithub /></span>
                  </div>
                </a>
              </div>
              <p className='mt-12'>
                This project involves building a scalable online game platform utilizing AWS microservices. Designed with Spring Cloud and leveraging Kafka for data stream processing, this platform efficiently handles real-time interactions and data analysis, ensuring a seamless gaming experience. Integrated Cloudflare, AWS Shield, and NAT Gateway to enhance security and optimize network performance.
              </p>
              <p className='mt-10 text-2xl font-extrabold text-gray-400'>Tech stack used :</p>
              <div className='flex flex-wrap mt-4 -ml-2 space-x-2 space-y-2'>
                <p className='p-2 mt-2 ml-2 text-white bg-gray-600/30 rounded-xl'>Spring Cloud</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Kafka</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Redis</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>AWS EKS</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Cloudflare</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>AWS Shield</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>NAT Gateway</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Node.js</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Express</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>MongoDB</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>JWT</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>EJS</p>
              </div>
            </div>
          </div>
          <div className='mt-8 border-0 sm1:w-full lg:w-1/2'>
            <Lottie
              animationData={blindcoding}
              className="overflow-hidden border-0 pt-36 sm1:hidden lg:flex h-fit rounded-3xl invert-0"
              loop={true}
            />
          </div>
        </div>
      </div>

      {/* 3rd proj */}
      <div className='relative mt-8 border-0'>
        <div className='relative border-0'>
          <Image src="./media/projects/optistock/Cold4.png" alt="" width={300} height={200} className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0' />
          <Image src="./media/projects/optistock/Cold3.png" alt="" width={300} height={200} className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0' />
          <Image src="./media/projects/optistock/Cold2.png" alt="" width={300} height={200} className='relative z-30 transition duration-300 ease-in-out -translate-x-1/2 border-0 cursor-pointer left-1/2 lg:hover:opacity-0' />
          <Image src="./media/projects/optistock/Cold1.png" alt="" width={300} height={200} className='absolute top-0 z-20 -translate-x-1/2 border-0 sm1:hidden lg:block left-1/2' />
          <div className='absolute top-0 z-40 text-4xl font-extrabold text-black text-center sm1:text-6xl md:text-7xl lowercase tracking-tight border-0 w-fit h-fit p-0 leading-[4rem] mt-24 left-1/2 -translate-x-1/2'>03.</div>
          <Lottie animationData={sketch} className='absolute top-0 mt-64 -rotate-45 md:block sm1:hidden invert grayscale left-1/2' />
        </div>
        <div className='relative flex mt-0 border-0 sm1:flex-col lg:flex-row'>
          <div className='mt-8 border-0 sm1:w-full lg:w-1/2'>
            <Lottie animationData={optistock} className="overflow-hidden border-0 pt-36 sm1:hidden lg:flex h-fit rounded-3xl invert-0" loop={true} />
          </div>
          <div className='bg-cover border-0 sm1:w-full lg:w-1/2'>
            <div className='m-auto mt-16 mb-16 text-white border-0 sm1:p-8 md:p-20 lg:p-4 xl:p-20 sm1:w-full lg:w-4/5 rounded-3xl bg-black/20 backdrop-filter backdrop-blur-sm'>
              <div className='flex justify-between'>
                <p className='text-5xl font-extrabold underline underline-offset-8'>Cloudflare <span className='text-gray-400'>Cold Chain</span></p>
                <a href={'https://github.com/zklou/coldChainManage'} target="_blank" className='hover:scale-[1.2] transition ease-in-out duration-300'>
                  <div className='pt-2'>
                    <span className="text-4xl"><FaGithub /></span>
                  </div>
                </a>
              </div>
              <p className='mt-12'>
                This microservice-driven cold chain platform leverages Cloudflare, AWS Shield, and NAT Gateway for secure and efficient cold chain transportation. The system monitors temperature, humidity, and power levels in real-time using a React and Spring Cloud stack, with robust data aggregation and alerting pipelines.
              </p>
              <p className='mt-10 text-2xl font-extrabold text-gray-400'>Tech stack used :</p>
              <div className='flex flex-wrap mt-4 -ml-2 space-x-2 space-y-2'>
                <p className='p-2 mt-2 ml-2 text-white bg-gray-600/30 rounded-xl'>React</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Spring Cloud</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Kafka</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>AWS EKS</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Cloudflare</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>AWS Shield</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>NAT Gateway</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Vue.js</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>D3.js</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Node.js</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>Express</p>
                <p className='p-2 text-white bg-gray-600/30 rounded-xl'>MongoDB</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

  )
}
export default Projects;