import { useRef } from 'react';
import { IDENTITY, PANELS } from '../config';
import { clamp, smoothstep } from '../lib/math';
import { panelAlignment, yawAt } from '../lib/orbit';
import useRaf from '../lib/useRaf';
import { useDiscrete } from '../ScrollDriver';
import { chapterProgress, story } from '../state';
import styles from './narrative.less';
import Scramble from './Scramble';

/** 逐字的线长和节奏固定下来 —— 每帧重算的话会闪 */
const hash = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + 311.7 + salt * 74.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * 名字断成两行。让它自己折行的话会断在「ZHENGKUN L / OU」那种位置上。
 * 每个字母带一组自己的垂线参数：长度、下落时长、起始延迟。
 */
let glyphIndex = 0;
const NAME_WORDS = IDENTITY.name.split(' ');
const NAME_LINES = NAME_WORDS.map((word, w) => {
  // 最后一行的丝放长，戏在下面；上面几行收短，免得砸在下一行的字上
  const last = w === NAME_WORDS.length - 1;
  return [...word].map((ch) => {
    const i = glyphIndex++;
    return {
      ch,
      thread: (last ? 34 : 22) + Math.pow(hash(i), 1.5) * (last ? 142 : 84),
      dur: 2.4 + hash(i, 1) * 2.6,
      delay: hash(i, 2) * 4.2,
    };
  });
});

/** 文案层。所有淡入淡出都直接写 style，不走 state。 */
const Narrative: React.FC = () => {
  const { project, chapter } = useDiscrete();
  const arrival = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const captions = useRef<(HTMLElement | null)[]>([]);

  useRaf(() => {
    const arrivalP = chapterProgress('arrival');
    const orbitP = chapterProgress('orbit');
    const yaw = yawAt(orbitP);

    if (arrival.current) {
      // 主界面在 arrival 站稳，一开始绕行就让位给作品
      const level = clamp(
        smoothstep(0.4, 0.85, arrivalP) * (1 - smoothstep(0, 0.22, orbitP)),
      );
      arrival.current.style.opacity = String(level);
      arrival.current.style.transform = `translate3d(-50%, calc(-50% + ${
        (1 - level) * 18
      }px), 0)`;
    }

    // 垂下来的丝就是时间雨。用 smoothstep 而不是裸的 1 - snow：
    // 往下滚的过程本身会压低 timeScale，直接线性映射的话丝在你正看着它的
    // 时候就缩回去了。要等雪真的结成，它们才该退场。
    if (title.current) {
      title.current.style.setProperty(
        '--thread-scale',
        (1 - smoothstep(0.55, 1, story.snow)).toFixed(3),
      );
    }

    // 收尾那章是可交互终端的地盘，作品文案先退干净
    const handover = 1 - smoothstep(0, 0.3, chapterProgress('restart'));
    captions.current.forEach((node, i) => {
      if (!node) return;
      const level = clamp(
        panelAlignment(i, yaw) * smoothstep(0.02, 0.12, orbitP) * handover,
      );
      node.style.opacity = String(level);
      node.style.transform = `translate3d(0, ${(1 - level) * 22}px, 0)`;
      node.style.pointerEvents = level > 0.7 ? 'auto' : 'none';
    });
  });

  return (
    <div className={styles.layer}>
      <div className={styles.arrival} ref={arrival}>
        <Scramble
          className={styles.kicker}
          text={IDENTITY.line}
          active={chapter === 'arrival' || chapter === 'rain'}
        />
        <p className={styles.lede}>{IDENTITY.place}</p>
        <h1 className={styles.title} ref={title}>
          {NAME_LINES.map((word, w) => (
            <span className={styles.titleLine} key={w}>
              {word.map(({ ch, thread, dur, delay }, i) => (
                <span
                  key={i}
                  className={styles.glyph}
                  style={
                    {
                      '--thread': `${thread.toFixed(0)}px`,
                      '--dur': `${dur.toFixed(2)}s`,
                      '--delay': `${delay.toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {PANELS.map((panel, i) => {
        const inner = (
          <>
            <Scramble
              className={styles.meta}
              text={`${String(i + 1).padStart(2, '0')} · ${panel.year} · ${
                panel.stack
              }`}
              active={project === i}
            />
            <h2
              className={styles.projectTitle}
              data-reveal={String(project === i)}
            >
              {panel.title}
            </h2>
            <p className={styles.desc}>{panel.desc}</p>
            {panel.link && <span className={styles.open}>OPEN ↗</span>}
          </>
        );
        const ref = (node: HTMLElement | null) => {
          captions.current[i] = node;
        };
        // 研究工作没有可以点开的地址，那就别伪装成链接
        return panel.link ? (
          <a
            key={panel.title}
            href={panel.link}
            target="_blank"
            rel="noreferrer"
            className={styles.caption}
            ref={ref}
          >
            {inner}
          </a>
        ) : (
          <div key={panel.title} className={styles.caption} ref={ref}>
            {inner}
          </div>
        );
      })}
    </div>
  );
};

export default Narrative;
