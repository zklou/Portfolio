import { PLATE_ATTENTION, PLATE_CRACK, PLATE_RESIDUAL } from './lib/plates';

/**
 * 整站是一条连续的滚动时间轴。每一章占据时间轴上的一段 [start, end)，
 * 章节内部再用局部进度 0→1 驱动各自的动画。改这张表就能重新剪辑整个片子。
 */
export const CHAPTERS = {
  /** 终端启动，逐字写出七章的诗 */
  boot: { start: 0.0, end: 0.03 },
  /** 诗句倒流——字符脱离屏幕，散成粒子 */
  rewind: { start: 0.03, end: 0.17 },
  /** 显影——粒子重新聚拢成过往作品的画面 */
  develop: { start: 0.17, end: 0.38 },
  /** 落地——画面退去，主界面浮出 */
  arrival: { start: 0.38, end: 0.48 },
  /** 下雨。静止时雨在下，一滚动时间就冻住 */
  rain: { start: 0.48, end: 0.58 },
  /** 时间彻底冻结，滚动改为驱动相机，绕着悬停的雨幕转 */
  orbit: { start: 0.58, end: 0.84 },
  /** 时间重新流动：雨落地砸出涟漪，镜头拉远，整个场景收回终端里 */
  restart: { start: 0.84, end: 1.0 },
} as const;

export type ChapterId = keyof typeof CHAPTERS;

/** 滚动总高度（视口倍数）。越大同样的动画铺得越慢。 */
export const SCROLL_VH = 1250;

export interface Panel {
  title: string;
  year: string;
  stack: string;
  desc: string;
  image: string;
  /** 研究工作没有公开链接，这时整块展板不做成可点的 */
  link?: string;
}

/**
 * orbit 章绕行时停靠的三块展板 —— 简历的头版。
 * 换成论文里的图（裂缝演化序列、attribution 热力图）就只改 image。
 */
export const PANELS: Panel[] = [
  {
    title: 'LLM Hallucination Mitigation',
    year: '2025 — 2026',
    stack: 'Mechanistic Interpretability · LLaMA · Steering Vectors',
    desc: 'Where does a model stop telling the truth? I trace gradient attribution and residual-stream activations across 32 layers to find the circuits responsible, then steer them at inference. LLaMA-3B keeps internal resistance layers that 8B has lost — alignment appears to cost the model the very circuitry that preserved truth.',
    image: PLATE_RESIDUAL,
  },
  {
    title: 'Infrastructure Crack Forecasting',
    year: '2024 — present',
    stack: 'U-Net Mini + ConvLSTM · PACE H100 · Advisor: Y. J. Tsai',
    desc: 'A 163M-parameter ViT scored SSIM 0.063 on this: patch-based attention shattered single-pixel cracks into 256 disconnected tokens. A 3.27M U-Net Mini + ConvLSTM — 98% smaller — keeps them connected, and a four-part loss holds against a 404:1 class imbalance.',
    image: PLATE_CRACK,
  },
  {
    title: 'Z.ai — Post-Training & Multimodal',
    year: '2025 — 2026',
    stack: 'SFT / DPO · Ascend NPU · WebRTC',
    desc: 'Retrieval was already right 97% of the time; the model simply answered badly. Full-parameter SFT then LoRA DPO on Qwen3-8B, trained across eight Ascend NPUs and served on a 910B. On the other track: the real-time stack behind a digital human.',
    image: PLATE_ATTENTION,
  },
];

export const IDENTITY = {
  name: 'Zhengkun Lou',
  role: 'CS PhD Student · Georgia Tech',
  line: 'Deep Learning · LLM Interpretability · Spatio-Temporal Vision',
  /** 名字底下那一行。别在这里解释交互——机制自己会说话 */
  place: 'Georgia Institute of Technology · Atlanta, GA',
  email: 'zhengkunlou@gmail.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/zklou' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/zhengkun-lou/' },
    {
      label: 'Résumé',
      url: 'https://drive.google.com/file/d/1y8MTVHcVBzGro2tO-IWjytsu1rccGKVf/view?usp=sharing',
    },
  ],
};

/**
 * 简历本体。它不做成一个「关于我」板块，而是喂给结尾那个可交互终端——
 * 开场的终端写这段旅程的诗，结尾的终端回答关于人的问题，故事就闭上了。
 *
 * 每个数组元素在终端里占一行，控制在 80 字符以内才不会被折断。
 */
export const RESUME = {
  summary: [
    'CS PhD student at Georgia Tech.',
    '',
    'Two questions, both about what a system does to itself over time:',
    'how a language model decides what is true, and how a crack decides where',
    'to grow. Several years of production engineering before that, which is',
    'mostly why the research ends up running on real hardware.',
  ],

  research: [
    {
      title: 'LLM Hallucination Mitigation',
      advisor: 'Prof. Vijay Madisetti',
      period: 'Aug 2025 — Feb 2026',
      points: [
        'Built a four-stage ROI pipeline over 32 Transformer layers — gradient',
        'screening, bidirectional causal validation, path analysis, steering-vector',
        'extraction — cutting activation-patching cost by 80%.',
        '',
        'Found a scale-dependent transition in truthfulness circuits: LLaMA-3B keeps',
        'internal resistance layers (L26 attribution −0.82) that 8B has replaced with',
        'unified amplification. Alignment appears to remove truth-preserving circuits.',
        '',
        'Validated on 5,800+ contrastive pairs with bootstrap CIs.',
        'First author; manuscript in preparation.',
      ],
    },
    {
      title: 'Infrastructure Crack Forecasting',
      advisor: 'Prof. Yichang James Tsai',
      period: 'Aug 2024 — present',
      points: [
        'Diagnosed why a 163M-parameter ViT failed outright (SSIM 0.063): patching',
        'shattered single-pixel cracks into 256 disconnected tokens. Replaced it with',
        'a 3.27M U-Net Mini + ConvLSTM — 98% smaller, spatial continuity intact.',
        '',
        'Engineered a four-part loss against a 404:1 imbalance (adaptive BCE, Tversky,',
        'clDice for topology, SSIM for structure) — F1 = 0.80 ± 0.03, SSIM 95%+.',
        '',
        'Identified four propagation modes — linear, exponential, branching, and',
        'multi-scale — as the basis for a per-mode mixture-of-experts head.',
        '',
        'Led a 3-person team on PACE (H100, 128GB); compressed 12GB of corrupted',
        'municipal sequences to 80MB without losing crack information.',
      ],
    },
  ],

  experience: [
    {
      org: 'Z.ai',
      role: 'Multimodal Frontend Developer',
      period: 'Jun 2025 — Sep 2026',
      points: [
        'Post-training for a bank RAG system. Bad-case analysis showed retrieval was',
        'already >97% accurate, so the bottleneck was generation, not search.',
        'Full-parameter SFT on Qwen3-8B (DeepSpeed ZeRO-3, 8× Ascend NPU on ModelArts)',
        'over 2,000+ curated pairs, then LoRA DPO on 593 preference pairs built from',
        'business review scores; merged and served on a 910B via MindIE.',
        'BLEU-4 82.29 → 83.62, BGE-m3 similarity 93.59 → 94.34.',
        '',
        'Digital-human multimodal: real-time SSE and WebSocket, WebRTC + ASR streaming,',
        '9:16 video rendering moved CPU → GPU (latency −40%, generation time −80%).',
        '',
        'Multi-tenant SaaS/MaaS platform in a React (TypeScript) + Vue 3 monorepo:',
        '50+ REST endpoints across ~40 modules behind typed models and centralized',
        'retry/error handling, with route-level code splitting and canary rollouts.',
      ],
    },
  ],

  education: [
    {
      school: 'Georgia Institute of Technology',
      degree: 'Ph.D. Computer Science',
      period: 'in progress',
    },
    {
      school: 'Georgia Institute of Technology',
      degree: 'M.S. Computer Science',
      period: 'expected Dec 2026',
    },
    {
      school: 'York University',
      degree: 'B.Sc. Computer Science, Specialized Honours',
      period: 'Sep 2019 — Nov 2023',
    },
  ],

  skills: [
    {
      group: 'Modeling',
      items: ['PyTorch', 'ConvLSTM / U-Net', 'ViT', 'Loss engineering'],
    },
    {
      group: 'Interpretability',
      items: [
        'Activation patching',
        'Gradient attribution',
        'Steering vectors',
      ],
    },
    {
      group: 'Post-training',
      items: ['SFT', 'DPO / LoRA', 'DeepSpeed ZeRO-3', 'LLaMA-Factory'],
    },
    {
      group: 'Compute',
      items: [
        'H100 (PACE)',
        'Ascend 910B',
        'MindIE / vLLM',
        'Kubernetes',
        'AWS',
      ],
    },
    {
      group: 'Engineering',
      items: ['TypeScript', 'React', 'Vue 3', 'Spring Cloud', 'Kafka'],
    },
  ],

  /** 之前的 SDE 经历，放在终端里给问起来的人看 */
  projects: [
    {
      title: 'AWS Microservice Online Game Platform',
      period: 'May 2025 — Aug 2025',
      note: 'Event-driven Spring Cloud on EKS — Kafka, Eureka, Saga transactions. Redis Sentinel with M/S replication took data processing from 15ms to 4ms.',
      link: 'https://github.com/zklou/DNF-Server',
    },
    {
      title: 'Microservice Cold-Chain Transportation',
      period: 'Feb 2025 — May 2025',
      note: 'Temperature, humidity and power telemetry from cold-chain logistics, streamed through Nginx → Netty → Kafka → Flink, with a RAG chatbot over the history.',
      link: 'https://github.com/zklou/coldChainManage',
    },
    {
      title: 'This site',
      period: '2026',
      note: 'Scrolling moves time, not pages. One WebGL scene, hand-written GLSL, no animation library. The résumé lives in the terminal you are reading.',
      link: 'https://github.com/zklou/Portfolio',
    },
  ],

  offCode: 'Carving down a slope, fishing, or shaping soundscapes in Max 8.',
};

/** 开场终端的七行诗，每行对应时间轴的一章。 */
export const BOOT_SCRIPT = `$ python -m story.run --subject=zhengkun

  loading checkpoints ............  ok
  seeding 20000 raindrops ........  ok

> CHAPTERS = [
>   'I ask the machine where truth begins.',
>   'Its words unravel into light.',
>   'From broken pixels, old worlds bloom.',
>   'I stand where models meet the ground.',
>   'Rain writes tomorrow on the road.',
>   'Through held rain, I follow hidden paths.',
>   'One drop lands; the question begins again.',
> ]
>
> run(CHAPTERS)

  [ scroll to rewind ]`;
