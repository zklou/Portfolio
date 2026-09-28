import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { IDENTITY } from '../config';
import { COMMAND_NAMES, Line, run } from '../lib/commands';
import { smoothstep } from '../lib/math';
import useRaf from '../lib/useRaf';
import { chapterProgress } from '../state';
import styles from './console.less';

/** 露到这个程度才允许交互，免得它还在淡入时就抢走键盘 */
const LIVE_AT = 0.55;
const STREAM_TICK_MS = 24;
const STREAM_CHARS_PER_TICK = 8;

interface Entry {
  id: number;
  echo: Line;
  output: Line[];
  visible: Line[];
  streaming: boolean;
}

interface Stream {
  id: number;
  output: Line[];
  line: number;
  chars: number;
  timer: ReturnType<typeof setTimeout> | null;
}

/**
 * 第 6 章。开场那个终端写出旅程的诗，
 * 结尾这个终端逐步输出关于写它的人的回答——故事在这里闭合。
 *
 * 不打字也能看：进场时自动跑一次 whoami，命令还做成了可点的按钮。
 */
const Console: React.FC = () => {
  const shell = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const nextId = useRef(0);
  const active = useRef<Stream | null>(null);
  const followOutput = useRef(true);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState('');
  const [live, setLive] = useState(false);

  const reveal = useCallback(function tick() {
    const stream = active.current;
    if (!stream) return;

    const line = stream.output[stream.line];
    if (!line) {
      active.current = null;
      return;
    }

    stream.chars = Math.min(
      line.text.length,
      stream.chars + STREAM_CHARS_PER_TICK,
    );
    const complete = stream.chars === line.text.length;
    const last = complete && stream.line === stream.output.length - 1;
    const visible: Line = {
      ...line,
      text: line.text.slice(0, stream.chars),
      // 半截链接先当文本显示，地址打完才可以点击。
      href: complete ? line.href : undefined,
    };

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === stream.id
          ? {
              ...entry,
              visible: [...entry.visible.slice(0, stream.line), visible],
              streaming: !last,
            }
          : entry,
      ),
    );

    if (last) {
      active.current = null;
      return;
    }
    if (complete) {
      stream.line += 1;
      stream.chars = 0;
    }
    stream.timer = setTimeout(tick, STREAM_TICK_MS);
  }, []);

  const exec = useCallback(
    (raw: string) => {
      if (!raw.trim()) return;
      const result = run(raw);
      const previous = active.current;
      if (previous?.timer) clearTimeout(previous.timer);
      active.current = null;

      if (result === 'clear') {
        setEntries([]);
        return;
      }
      const id = nextId.current++;
      const output = [...result, { text: '' }];
      const entry: Entry = {
        id,
        echo: {
          text: `${
            IDENTITY.name.toLowerCase().split(' ')[0]
          }@portfolio ~ % ${raw}`,
          tone: 'dim',
        },
        output,
        visible: [],
        streaming: true,
      };

      // 用户连续提交时，先补全上条回复，再立刻显示新命令。
      setEntries((prev) => [
        ...prev.map((item) =>
          item.id === previous?.id
            ? { ...item, visible: item.output, streaming: false }
            : item,
        ),
        entry,
      ]);
      followOutput.current = true;
      active.current = { id, output, line: 0, chars: 0, timer: null };
      active.current.timer = setTimeout(reveal, 100);
    },
    [reveal],
  );

  useEffect(
    () => () => {
      if (active.current?.timer) clearTimeout(active.current.timer);
    },
    [],
  );

  useRaf(() => {
    const p = chapterProgress('restart');
    const level = smoothstep(0.32, 0.7, p);
    if (shell.current) {
      shell.current.style.opacity = String(level);
      shell.current.style.transform = `translate3d(-50%, calc(-50% + ${
        (1 - level) * 26
      }px), 0)`;
      shell.current.style.pointerEvents = p > LIVE_AT ? 'auto' : 'none';
    }
    const nowLive = p > LIVE_AT;
    setLive((was) => (was === nowLive ? was : nowLive));

    // 滚到这里就先替访客跑一次，不打字也看得到东西
    if (!started.current && p > 0.35) {
      started.current = true;
      exec('whoami');
    }
  });

  // 默认跟着新输出走；访客自己向上翻记录时不把视线抢回底部。
  useEffect(() => {
    if (log.current && followOutput.current) {
      log.current.scrollTop = log.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className={styles.shell} ref={shell}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden />
        <span className={styles.barLabel}>{IDENTITY.name} — /bin/zsh</span>
        <span className={styles.barHint}>06 · RESTART</span>
      </div>

      <div
        className={styles.log}
        ref={log}
        data-lenis-prevent
        onScroll={(event) => {
          const node = event.currentTarget;
          followOutput.current =
            node.scrollHeight - node.scrollTop - node.clientHeight < 40;
        }}
      >
        {entries.map((entry) => (
          <Fragment key={entry.id}>
            <p
              className={styles.line}
              data-tone={entry.echo.tone ?? 'dim'}
              data-streaming={entry.streaming && entry.visible.length === 0}
            >
              {entry.echo.text}
            </p>
            {entry.visible.map((line, i) =>
              line.href ? (
                <a
                  key={i}
                  className={styles.line}
                  data-tone={line.tone ?? 'bone'}
                  href={line.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {line.text}
                </a>
              ) : (
                <p
                  key={i}
                  className={styles.line}
                  data-tone={line.tone ?? 'bone'}
                  data-streaming={
                    entry.streaming && i === entry.visible.length - 1
                  }
                >
                  {line.text || ' '}
                </p>
              ),
            )}
          </Fragment>
        ))}
      </div>

      <form
        className={styles.prompt}
        onSubmit={(e) => {
          e.preventDefault();
          exec(draft);
          setDraft('');
        }}
      >
        <span className={styles.sigil}>{'>'}</span>
        <input
          ref={input}
          className={styles.input}
          value={draft}
          spellCheck={false}
          autoComplete="off"
          disabled={!live}
          placeholder="help"
          aria-label="terminal input"
          onChange={(e) => setDraft(e.target.value)}
        />
      </form>

      <div className={styles.chips}>
        {COMMAND_NAMES.map((name) => (
          <button
            key={name}
            type="button"
            className={styles.chip}
            onClick={() => {
              exec(name);
              input.current?.focus();
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Console;
