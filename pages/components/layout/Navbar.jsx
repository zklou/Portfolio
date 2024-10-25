import Link from 'next/link';
import { motion } from 'framer-motion';
import { MenuItems } from '../../../public/data/MenuItems';
import { GrLinkedinOption, GrGithub } from 'react-icons/gr';
import { RiInstagramFill } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';

const containerVariants = {
  initial: {
    transition: {
      staggerDirection: -1,
      staggerChildren: 0.09,
    },
  },
  animate: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.09,
      staggerDirection: 1,
    },
  },
};

const linkVariants = {
  initial: {
    opacity: 0,
    y: '10vh',
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1],
      duration: 0.7,
    },
  },
};

const Navbar = ({ toggleOpen, toggleClose, isOpen }) => {
  return (
    <div className="w-full overflow-auto border-0 border-red-500">
      <motion.div className="max-h-screen pt-20 text-black bg-[#000] border-t-0">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="initial"
          className="font-extrabold"
        >
          {MenuItems.map((item) => (
            <div key={item.id} className="m-auto text-center space-y-6 md:space-y-10 text-3xl md:text-5xl">
              <Link
                className="transition delay-200 border-0"
                href={`${item.linkedSection}`}
                target={`${item.name === 'Resume' ? '_blank' : ''}`}
                scroll={false}
                aria-label={`Navigate to ${item.name}`}
              >
                <motion.button
                  variants={linkVariants}
                  onClick={isOpen ? toggleClose : toggleOpen}
                  className="text-white hover:text-gray-400"
                >
                  {item.name}
                </motion.button>
              </Link>
            </div>
          ))}
          <div className="flex justify-between w-3/4 pb-20 m-auto mt-20 text-3xl">
            <motion.a
              variants={linkVariants}
              href="https://www.linkedin.com/in/zhengkun-lou/"
              target="_blank"
              aria-label="Visit LinkedIn Profile"
            >
              <GrLinkedinOption />
            </motion.a>
            <motion.a
              variants={linkVariants}
              href="https://github.com/zklou"
              target="_blank"
              aria-label="Visit GitHub Profile"
            >
              <GrGithub />
            </motion.a>
            <motion.a
              variants={linkVariants}
              href="https://www.instagram.com/havagr8d/"
              target="_blank"
              aria-label="Visit Instagram Profile"
            >
              <RiInstagramFill />
            </motion.a>
            <motion.a
              variants={linkVariants}
              href="mailto:zhengkunlou@gmail.com"
              target="_blank"
              aria-label="Send an Email"
            >
              <MdEmail />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Navbar;
