export const DEFAULT_NAME = 'Umi Max';

// —— 以下内容取自 github.com/zklou/portfolio（main 分支）现有站点的真实信息 ——

export const SITE_NAME = 'Zhengkun Lou';
export const SITE_TAGLINE = 'Full-Stack Developer — React · Spring Cloud · AWS';

export const CONTACT_EMAIL = 'zhengkunlou@gmail.com';

export const ABOUT_TEXT =
  "I'm a full-stack developer working toward a Master's in Computer Science at Georgia Tech, " +
  'following a Bachelor’s from York University. I build scalable, user-centric web applications ' +
  'with React, Spring Cloud and AWS — experience sharpened through my work at Yongtai Quanwei ' +
  'Decor Ltd. Outside of code, I’m usually carving down a slope, fishing, or shaping soundscapes ' +
  'in Max 8.';

export const SKILLS = [
  'React',
  'Next.js',
  'Node.js',
  'Java',
  'Spring Cloud',
  'AWS',
  'MongoDB',
  'Redux',
  'Tailwind CSS',
];

export interface Project {
  title: string;
  desc: string;
  link: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'Portfolio Website',
    desc: 'Full-stack portfolio built with Next.js and TailwindCSS, animated with GSAP, Framer Motion and Lottie.',
    link: 'https://github.com/zklou/Portfolio',
  },
  {
    title: 'AWS Microservice Game Platform',
    desc: 'Scalable online game platform on Spring Cloud + Kafka, secured with Cloudflare and AWS Shield.',
    link: 'https://github.com/zklou/DNF-Server',
  },
  {
    title: 'Cloudflare Cold Chain',
    desc: 'Real-time cold-chain monitoring platform tracking temperature, humidity and power over Spring Cloud + Kafka.',
    link: 'https://github.com/zklou/coldChainManage',
  },
];

export interface SocialLink {
  label: string;
  url: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/zklou' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/zhengkun-lou/' },
  {
    label: 'Resume',
    url: 'https://drive.google.com/file/d/1y8MTVHcVBzGro2tO-IWjytsu1rccGKVf/view?usp=sharing',
  },
];
