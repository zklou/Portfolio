import { useRef } from 'react';
import { CHAPTERS, ChapterId, IDENTITY } from '../config';
import { clamp, smoothstep } from '../lib/math';
import useRaf from '../lib/useRaf';
import { useDiscrete } from '../ScrollDriver';
import { setDiscrete, story } from '../state';
import { applyThemeVars, rememberTheme } from '../theme';
import styles from './hud.less';

const LABELS: Record<ChapterId, string> = {
  boot: 'BOOT',
  rewind: 'REWIND',
  develop: 'DEVELOP',
  arrival: 'ARRIVAL',
  rain: 'RAIN',
  orbit: 'ORBIT',
  restart: 'RESTART',
};

const IDS = Object.keys(CHAPTERS) as ChapterId[];

/**
 * 常驻的仪表层。右上角那个时间流速读数是故意留的：
 * 「滚动会让时间停住」这条规则本来只能靠感觉，有了读数就能被看见。
 */
const Hud: React.FC = () => {
  const { chapter, booted, theme } = useDiscrete();
  const value = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const state = useRef<HTMLSpanElement>(null);
  const cue = useRef<HTMLDivElement>(null);

  useRaf(() => {
    const ts = story.timeScale;
    if (value.current) value.current.textContent = `×${ts.toFixed(2)}`;
    if (bar.current) bar.current.style.transform = `scaleX(${ts})`;
    if (state.current) {
      const frozen = ts < 0.25;
      state.current.textContent = frozen ? 'FROZEN' : 'FLOWING';
      state.current.dataset.frozen = String(frozen);
    }
    // 提示只在开头露脸，一开始滚就退场
    if (cue.current) {
      cue.current.style.opacity = String(
        clamp(1 - smoothstep(0.004, 0.03, story.scroll)),
      );
    }
  });

  return (
    <div className={styles.hud}>
      <div className={styles.corner} data-pos="tl">
        <span className={styles.name}>{IDENTITY.name}</span>
        <span className={styles.sub}>{IDENTITY.role}</span>
      </div>

      <div className={styles.corner} data-pos="tr">
        <div className={styles.clock}>
          <span className={styles.clockLabel}>TIME</span>
          <span className={styles.clockValue} ref={value}>
            ×1.00
          </span>
        </div>
        <div className={styles.track}>
          <span className={styles.fill} ref={bar} />
        </div>
        <span className={styles.clockState} ref={state}>
          FLOWING
        </span>
        <button
          type="button"
          className={styles.theme}
          aria-label={
            theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'
          }
          title={
            theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'
          }
          onClick={() => {
            const next = theme === 'dark' ? 'light' : 'dark';
            applyThemeVars(next);
            rememberTheme(next);
            setDiscrete({ theme: next });
          }}
        >
          {theme === 'dark' ? 'DAY' : 'NIGHT'}
        </button>
      </div>

      <ol className={styles.rail}>
        {IDS.map((id, i) => (
          <li
            key={id}
            className={styles.step}
            data-active={String(id === chapter)}
          >
            <span className={styles.stepIndex}>
              {String(i).padStart(2, '0')}
            </span>
            <span className={styles.stepLabel}>{LABELS[id]}</span>
          </li>
        ))}
      </ol>

      <div className={styles.cue} ref={cue}>
        {booted ? (
          <>
            <span>SCROLL</span>
            <span className={styles.arrow}>↓</span>
          </>
        ) : (
          <span className={styles.skip}>PRESS ANY KEY TO SKIP</span>
        )}
      </div>
    </div>
  );
};

export default Hud;
