import { useRef } from 'react';
import useRaf from '../lib/useRaf';
import { story } from '../state';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&<>/\\[]{}=+*·—';
const pickGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/** 每帧解开多少比例的字符 */
const RESOLVE_RATE = 0.028;
/** 解码头部的宽度：这一段是乱码，后面还没轮到 */
const HEAD = 7;
/** 已解开的字符被雨蚀掉的概率上限 */
const EROSION = 0.014;

interface Props {
  text: string;
  /** 这块展板是否正对镜头。转到它面前才开始解码 */
  active: boolean;
  className?: string;
}

/**
 * 逐字解码的等宽文本。只用在等宽行上——衬线标题按字形解码会左右抖动，
 * 那边用 clip-path 擦除。
 *
 * 解开之后字符不是就此安稳：雨越大，已解开的字被蚀回乱码的概率越高，
 * 雪天则几乎不动。字也泡在这场雨里。
 */
const Scramble: React.FC<Props> = ({ text, active, className }) => {
  const el = useRef<HTMLSpanElement>(null);
  const reveal = useRef(0);
  const wasActive = useRef(false);

  useRaf(() => {
    const node = el.current;
    if (!node) return;

    if (active !== wasActive.current) {
      wasActive.current = active;
      // 转到面前才重新解一次；转走时留着解好的字，淡出期间不该还在跳
      if (active) reveal.current = 0;
    }
    if (!active) {
      if (node.textContent !== text) node.textContent = text;
      return;
    }

    reveal.current = Math.min(1, reveal.current + RESOLVE_RATE);
    const cut = reveal.current * (text.length + HEAD);
    // 雨大字就蚀得厉害；结成雪之后字面也跟着静下来
    const erosion = EROSION * (1 - story.snow) * story.rainVisible;

    let out = '';
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === ' ') {
        out += ' ';
      } else if (i < cut - HEAD) {
        out += Math.random() < erosion ? pickGlyph() : ch;
      } else if (i < cut) {
        out += pickGlyph();
      } else {
        // 还没轮到的位置留空格，整行宽度才不会伸缩
        out += ' ';
      }
    }
    node.textContent = out;
  });

  return (
    <span className={className} ref={el}>
      {text}
    </span>
  );
};

export default Scramble;
