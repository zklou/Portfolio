import { IDENTITY, RESUME } from '../config';

export type Tone = 'bone' | 'dim' | 'signal' | 'ember';

export interface Line {
  text: string;
  tone?: Tone;
  href?: string;
}

const blank = (): Line => ({ text: '' });
const pad = (label: string, width = 12) => label.padEnd(width, ' ');
const body = (text: string): Line => ({ text: `  ${text}`, tone: 'bone' });

const HANDLERS: Record<string, () => Line[]> = {
  help: () => [
    { text: 'available commands', tone: 'dim' },
    blank(),
    ...[
      ['whoami', 'who is typing this'],
      ['research', 'what I am working on'],
      ['work', 'where I have worked'],
      ['skills', 'what I build with'],
      ['education', 'where I studied'],
      ['projects', 'things I shipped before'],
      ['contact', 'how to reach me'],
      ['resume', 'the PDF, if you must'],
      ['clear', 'wipe the screen'],
    ].map(([cmd, desc]) => body(`${pad(cmd)}${desc}`)),
  ],

  whoami: () => [
    { text: `${IDENTITY.name} — ${IDENTITY.role}`, tone: 'signal' },
    blank(),
    ...RESUME.summary.map((text) => ({ text, tone: 'bone' as Tone })),
    blank(),
    { text: `off-code: ${RESUME.offCode}`, tone: 'dim' },
  ],

  research: () =>
    RESUME.research.flatMap(({ title, advisor, period, points }) => [
      { text: title, tone: 'signal' as Tone },
      { text: `${advisor}   ·   ${period}`, tone: 'dim' as Tone },
      ...points.map(body),
      blank(),
    ]),

  work: () =>
    RESUME.experience.flatMap(({ org, role, period, points }) => [
      { text: org, tone: 'signal' as Tone },
      { text: `${role}   ·   ${period}`, tone: 'dim' as Tone },
      ...points.map(body),
      blank(),
    ]),

  skills: () =>
    RESUME.skills.map(({ group, items }) =>
      body(`${pad(group)}${items.join('  ·  ')}`),
    ),

  education: () =>
    RESUME.education.flatMap(({ school, degree, period }) => [
      { text: `  ${degree}`, tone: 'bone' as Tone },
      { text: `  ${pad(period, 26)}${school}`, tone: 'dim' as Tone },
    ]),

  projects: () =>
    RESUME.projects.flatMap((p) => [
      { text: `${p.title}  (${p.period})`, tone: 'signal' as Tone },
      body(p.note),
      { text: `  ${p.link}`, tone: 'ember' as Tone, href: p.link },
      blank(),
    ]),

  contact: () => [
    {
      text: `  ${pad('email')}${IDENTITY.email}`,
      tone: 'bone' as Tone,
      href: `mailto:${IDENTITY.email}`,
    },
    ...IDENTITY.links.map((l) => ({
      text: `  ${pad(l.label.toLowerCase())}${l.url}`,
      tone: 'bone' as Tone,
      href: l.url,
    })),
  ],

  resume: () => {
    const link = IDENTITY.links.find((l) => l.label === 'Résumé');
    return [
      { text: 'the whole thing, on one page:', tone: 'dim' as Tone },
      {
        text: `  ${link?.url ?? IDENTITY.email}`,
        tone: 'ember' as Tone,
        href: link?.url,
      },
    ];
  },
};

export const COMMAND_NAMES = Object.keys(HANDLERS);

/** 返回 'clear' 表示要清屏，其余情况返回要追加的输出行 */
export const run = (raw: string): Line[] | 'clear' => {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];
  if (cmd === 'clear') return 'clear';

  const handler = HANDLERS[cmd];
  if (handler) return handler();

  // 打错了也别冷冰冰地报错，顺手把路指回去
  return [
    { text: `zsh: command not found: ${raw.trim()}`, tone: 'ember' },
    { text: "try 'help'", tone: 'dim' },
  ];
};
