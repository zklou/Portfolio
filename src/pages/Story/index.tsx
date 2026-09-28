import { SCROLL_VH } from '@/story/config';
import { SKIP_GL } from '@/story/lib/debug';
import { createTerminalCanvas } from '@/story/lib/terminal';
import Console from '@/story/overlays/Console';
import Hud from '@/story/overlays/Hud';
import Narrative from '@/story/overlays/Narrative';
import useScrollDriver, { useDiscrete } from '@/story/ScrollDriver';
import Stage from '@/story/Stage';
import { setDiscrete, story } from '@/story/state';
import { applyThemeVars, readPreferredTheme } from '@/story/theme';
import { useEffect, useMemo } from 'react';
import styles from './index.less';

const Story: React.FC = () => {
  const lenis = useScrollDriver();
  const { booted, ready } = useDiscrete();

  // 终端 canvas 在这里创建、往下传：Stage 拿它当贴图，粒子拿它当采样源，
  // 两边必须是同一张画布，文字才会在原地碎掉。
  const terminal = useMemo(createTerminalCanvas, []);

  // 跳过 WebGL 时开场终端不存在，得替它把「已启动」这件事宣布掉
  useEffect(() => {
    if (!SKIP_GL) return;
    story.booted = true;
    setDiscrete({ booted: true, ready: true });
  }, []);

  // 主题要在首帧之前定下来，否则会先闪一下默认的深色
  useEffect(() => {
    const name = readPreferredTheme();
    applyThemeVars(name);
    setDiscrete({ theme: name });
  }, []);

  // 开场演完、作品图也采样好了才放行滚动：
  // 前者是为了第一章不被划过去，后者是为了粒子有地方可去
  useEffect(() => {
    if (booted && ready) lenis?.start();
  }, [booted, ready, lenis]);

  return (
    <div className={styles.root}>
      <div className={styles.stage}>
        {!SKIP_GL && <Stage canvas={terminal.canvas} ctx={terminal.ctx} />}
      </div>
      <Narrative />
      <Console />
      <Hud />
      <div className={styles.grain} />
      <div className={styles.vignette} />
      <div className={styles.scroller} style={{ height: `${SCROLL_VH}vh` }} />
    </div>
  );
};

export default Story;
