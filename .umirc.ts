import { defineConfig } from '@umijs/max';

export default defineConfig({
  title: 'Zhengkun Lou — CS PhD Student',
  base: process.env.NODE_ENV === 'production' ? '/Portfolio/' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? '/Portfolio/' : '/',
  metas: [
    {
      name: 'description',
      content:
        'Zhengkun Lou — CS PhD student at Georgia Tech. Research in LLM interpretability and spatio-temporal vision, told through a scroll-driven portfolio.',
    },
    { name: 'theme-color', content: '#0c0a09' },
  ],
  routes: [
    {
      path: '/',
      component: './Story',
      layout: false,
    },
  ],
  npmClient: 'yarn',
  utoopack: {},
});
