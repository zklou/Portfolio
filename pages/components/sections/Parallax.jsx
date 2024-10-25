import React from 'react';

const Parallax = () => {
  return (
    <div className="border-2 border-gray-800 grid min-h-screen grid-cols-1 overflow-hidden font-extrabold tracking-tighter bg-fixed bg-no-repeat bg-cover bg-backdrop md:pr-24 lg:pl-20 md:pl-4 sm1:pr-0">
      <div className='text-2xl md:pl-10 2xl:-mt-44 xl:-mt-40 xl:text-10xl font-stencilParallax lg:text-9xl lg:-mt-32 md:text-8xl md:-mt-24 sm1:text-7xl sm1:p-0 sm1:-mt-32 sm1:text-center md:text-left text-gray-800'>
        detour<span className="text-gray-500"> :)</span>
      </div>
      <div className='w-full pl-10 text-xl text-gray-800'>. </div>
    </div>
  );
};

export default Parallax;
