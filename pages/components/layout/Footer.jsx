import Link from "next/link"

const Footer = () => {
  return (
    <div className="flex justify-between w-11/12 sm1:pt-2 md:pt-4 m-auto border-t-[0.1rem] border-white/10 pb-4">
      <div className="pl-4 mt-1 text-sm font-light text-gray-400">
        made with <span className="text-white">❤️</span> by <span className="font-bold text-white">Zhengkun Lou</span>
      </div>
      <div className="pr-4 text-gray-300 md:text-xl sm1:hidden md:flex">
        <Link href="mailto:zhengkunlou@gmail.com" target="_blank" className="transition duration-300 ease-in-out hover:text-gray-100 hover:scale-110">
          Get in touch
        </Link>
      </div>
    </div>
  )
}

export default Footer;
