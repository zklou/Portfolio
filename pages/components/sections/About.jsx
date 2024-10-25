import React, { useRef } from 'react'
import { motion, useTransform, useScroll } from "framer-motion"
import Lottie from "lottie-react";
import about from "../../../public/media/lotties/FloatingYogaMan(About).json";

const boxVariants = {
    initial: {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
    },
    animate: {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        transition: { duration: 0.7, delay: 1, type: 'tween', ease: 'linear' }
    }
}

const About = () => {
    const imageRef = useRef(null);
    const { scrollYProgress } = useScroll()
    const toRight = useTransform(scrollYProgress, [0, 1], [-200, 200])
    const toUp = useTransform(scrollYProgress, [0, 1], [10, -800])
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return (
        <div className='bg-[#000] text-white'>
            <motion.div
                className="font-extrabold leading-[4rem] tracking-tighter text-10xl text-white mt-10 whitespace-nowrap uppercase"
                style={{ x: toRight }}
            >
                <span className='font-mine sm1:text-7xl md:text-10xl'>
                    <span>about </span>
                    <span className="font-stencil-scroll">about </span>
                    <span>about </span>
                    <span className="font-stencil-scroll">about </span>
                </span>
            </motion.div>
            
            <motion.div
                className='flex w-2/3 m-auto mt-20 sm1:flex-col md:flex-row'
                style={{ y: toUp }}
                variants={boxVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                ref={imageRef}
            >
                {/* 左侧：Lottie 动画 */}
                <div className='w-full md:w-1/2 p-4'>
                    <Lottie
                        animationData={about}
                        className="grayscale"
                        loop={true}
                    />
                </div>
                
                {/* 右侧：文本内容 */}
                <div className='w-full md:w-1/2 p-4'>
                    <div className='mb-4 text-gray-300'>
                        With a Bachelor&apos;s in Computer Science from York University and experience at Yongtai Quanwei Decor Ltd., I&apos;ve built scalable systems using React, Spring Cloud, and AWS, optimized APIs, and implemented microservices architectures, delivering enhanced performance and security. Currently pursuing a Master&apos;s at Georgia Tech to deepen my expertise.
                    </div>
                    <div className='mt-8'>
                        <div className='text-gray-400'>Available for full-time & remote jobs/internships after</div>
                        <div className='mt-2 font-bold text-white'>{formattedDate} Today</div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default About;
