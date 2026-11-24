import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  LoaderCircle,
  Paperclip,
  Pencil,
  RotateCcw,
  Search,
  Square,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { FOLLOW_UP, MODEL, TITLE, TURN_A, TURN_B, TURN_B_AT, tokenCount, type Block, type Script } from "./script";
import "./chat-thread.css";

/*
 * Full chat thread, motion-faithful to Arc UI "AI chat" (Pro block).
 * A two-turn conversation plays on one rAF clock:
 *   question → "Thinking" (shimmer) → tool chip → markdown streamed in 50 ms ticks → actions;
 *   then an automatic follow-up.
 * The thread follows the live edge with a per-frame lerp (k = 0.22 at 60 Hz). A "scroll to latest" button appears
 * when the reader scrolls up.
 * Fades are CSS keyframes and transitions (150 ms, cubic-bezier(.22,1,.36,1)). Label widths run on motion springs
 * driven by animate(motionValue), so they keep time on a frame-stepped clock too.
 */

const WIDTH_SPRING = { type: "spring", stiffness: 663, damping: 51.5, mass: 1, restDelta: 0.3, restSpeed: 2 } as const; // ω ≈ 25.75, critically damped
const FOLLOW_K = 0.22; // share of the remaining distance per 16.7 ms frame
const LOOP_REST = 5000; // gallery autoplay: rest after the demo before it plays again
// The reference fires its steps on timers and shows them on the next frame; a frame that starts up to 12 ms before a
// step's time shows it already, so each step lands on the same frame as in the reference.
const EARLY = 12;

interface TurnRec {
  id: number;
  script: Script;
  start: number; // performance.now() of the send
  stoppedAt: number | null;
}
interface TurnLive {
  chevron: boolean;
  thought: boolean;
  tool: 0 | 1 | 2;
  ticks: number;
  done: boolean;
  stop: boolean; // send button shows Stop
}
type Turn = TurnRec & TurnLive;

function liveAt(rec: TurnRec, now: number): TurnLive {
  const T = rec.script.timing;
  const n = tokenCount(rec.script);
  const at = rec.stoppedAt ?? now;
  const t = at - rec.start + EARLY;
  const ticks = t < T.stream ? 0 : Math.min(n, Math.floor((t - T.stream) / T.tick) + 1);
  const done = rec.stoppedAt != null || t >= T.stream + n * T.tick; // 50 ms after the last tick
  return {
    chevron: t >= T.chevron,
    thought: t >= T.tool,
    tool: !rec.script.tool ? 0 : t >= T.toolDone ? 2 : t >= T.tool ? 1 : 0,
    ticks,
    done,
    stop: !done && t >= T.stop,
  };
}
const sameLive = (a: TurnLive, b: TurnLive) =>
  a.chevron === b.chevron && a.thought === b.thought && a.tool === b.tool && a.ticks === b.ticks && a.done === b.done && a.stop === b.stop;

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

export default function ChatThread() {
  const reduce = useReducedMotion();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [latest, setLatest] = useState(false);
  const turnsRef = useRef<Turn[]>([]);
  turnsRef.current = turns;
  const nextId = useRef(1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const follow = useRef({ stick: true, last: 0, expected: -1 });
  const demo = useRef<{ on: boolean; loop: boolean; startAt: number | null; queue: { at: number; script: Script }[]; endAt: number | null }>({
    on: autoplayEnabled(),
    loop: autoplayEnabled(),
    startAt: null,
    queue: [],
    endAt: null,
  });
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;

  const makeTurn = (script: Script, start: number): Turn => {
    const rec: TurnRec = { id: nextId.current++, script, start, stoppedAt: null };
    return { ...rec, ...liveAt(rec, start) };
  };

  const startDemo = useCallback((now: number) => {
    const d = demo.current;
    d.queue = [{ at: now + TURN_B_AT, script: TURN_B }];
    d.endAt = null;
    follow.current.stick = true;
    flushSync(() => {
      setLatest(false);
      setTurns([makeTurn(TURN_A, now)]);
    });
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, []);

  // One frame loop: follow the live edge (with the layout as it stands), then commit the timeline for this frame.
  useEffect(() => {
    let raf = 0;
    const d = demo.current;
    if (d.on) d.startAt = performance.now() + 800;
    const frame = (now: number) => {
      // 1. scroll: the frame after the content grows, like the reference
      const el = scrollerRef.current;
      const f = follow.current;
      const dt = f.last ? Math.min(100, now - f.last) : 16.667;
      f.last = now;
      if (el && f.stick) {
        const max = el.scrollHeight - el.clientHeight;
        const cur = el.scrollTop;
        if (max - cur > 0.5) {
          const k = 1 - Math.pow(1 - FOLLOW_K, dt / 16.667);
          const next = reduceRef.current ? max : Math.min(max, cur + Math.max(1, (max - cur) * k));
          el.scrollTop = next;
          f.expected = el.scrollTop;
        }
      }
      // 2. demo schedule
      if (d.startAt != null && now >= d.startAt) {
        d.startAt = null;
        startDemo(now);
      }
      let list = turnsRef.current;
      let changed = false;
      while (d.queue.length && now + EARLY >= d.queue[0].at) {
        const q = d.queue.shift()!;
        list = [...list, makeTurn(q.script, q.at)];
        follow.current.stick = true;
        changed = true;
      }
      // 3. live state of the turns still running
      const next = list.map((t) => {
        if (t.done) return t;
        const live = liveAt(t, now);
        if (sameLive(t, live)) return t;
        changed = true;
        return { ...t, ...live };
      });
      if (changed) {
        turnsRef.current = next;
        // Commit inside this frame: a scheduled render would land a frame or more later.
        flushSync(() => setTurns(next));
      }
      // 4. gallery loop
      if (d.loop && !d.queue.length && next.length && next.every((t) => t.done)) {
        if (d.endAt == null) d.endAt = now;
        else if (now - d.endAt > LOOP_REST) {
          d.endAt = null;
          startDemo(now);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [startDemo]);

  // Any real input ends the gallery demo; the conversation stays.
  const takeOver = () => {
    const d = demo.current;
    d.on = false;
    d.loop = false;
    d.startAt = null;
    d.queue = [];
  };

  const busyTurn = turns.length && !turns[turns.length - 1].done ? turns[turns.length - 1] : null;
  const sendState = busyTurn ? (busyTurn.stop ? "stop" : "pending") : text.trim() ? "ready" : "idle";

  const send = () => {
    const prompt = text.trim();
    if (!prompt || busyTurn) return;
    takeOver();
    follow.current.stick = true;
    setText("");
    setLatest(false);
    const t = makeTurn(FOLLOW_UP(prompt), performance.now());
    turnsRef.current = [...turnsRef.current, t];
    setTurns(turnsRef.current);
  };
  const stop = () => {
    takeOver();
    const now = performance.now();
    const next = turnsRef.current.map((t) => (t.done ? t : { ...t, stoppedAt: now, ...liveAt({ ...t, stoppedAt: now }, now) }));
    turnsRef.current = next;
    setTurns(next);
  };
  const newChat = () => {
    takeOver();
    turnsRef.current = [];
    setTurns([]);
    setLatest(false);
    follow.current.stick = true;
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Reader scrolls: leaving the live edge stops following and offers "scroll to latest".
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const f = follow.current;
    if (Math.abs(el.scrollTop - f.expected) < 1.5) return; // our own step
    const dist = el.scrollHeight - el.clientHeight - el.scrollTop;
    if (dist > 8) f.stick = false;
    else f.stick = true;
    setLatest(!f.stick && dist > 40);
  };
  const onWheel = (e: { deltaY: number }) => {
    if (e.deltaY < 0) follow.current.stick = false;
  };
  const toLatest = () => {
    follow.current.stick = true;
    follow.current.expected = -1;
    setLatest(false);
  };

  return (
    <div className="ct-root" data-ct-root onPointerDown={(e) => (e.target as HTMLElement).closest("[data-ct-start]") || takeOver()}>
      <button type="button" className="ct-start" data-ct-start aria-hidden tabIndex={-1} onClick={() => startDemo(performance.now())} />
      <header className="ct-header" data-ct-header>
        <button type="button" className="ct-title">
          {TITLE}
          <ChevronDown size={14} />
        </button>
        <span className="ct-spacer" />
        <button type="button" className="ct-model">
          <Spark size={16} />
          {MODEL}
          <ChevronDown size={14} className="ct-chev" />
        </button>
        <button type="button" className="ct-icon-btn" aria-label="New chat" onClick={newChat}>
          <SquarePen size={18} />
        </button>
      </header>

      <div className="ct-body">
        <div className="ct-scroller" data-ct-scroller ref={scrollerRef} onScroll={onScroll} onWheel={onWheel}>
          <div className="ct-thread" data-ct-thread>
            {turns.map((t) => (
              <TurnView key={t.id} turn={t} reduce={!!reduce} />
            ))}
          </div>
        </div>
        {!turns.length && <div className="ct-empty">Ask about your data, your code or your docs.</div>}
        <button type="button" className="ct-latest" data-on={latest || undefined} aria-label="Scroll to latest message" onClick={toLatest}>
          <ArrowDown size={16} />
        </button>
      </div>

      <div className="ct-dock" data-ct-dock>
        <form
          className="ct-composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <button type="button" className="ct-round-btn" aria-label="Attach files">
            <Paperclip size={18} />
          </button>
          <textarea
            className="ct-input"
            rows={1}
            placeholder="Ask anything"
            aria-label="Message"
            value={text}
            onChange={(e) => {
              takeOver();
              setText(e.target.value);
            }}
            onKeyDown={onKey}
          />
          <button
            type={busyTurn ? "button" : "submit"}
            className="ct-send"
            data-ct-send
            data-state={sendState}
            aria-label={sendState === "stop" ? "Stop reply" : "Send message"}
            disabled={sendState === "idle" || sendState === "pending"}
            onClick={(e) => {
              if (busyTurn) {
                e.preventDefault();
                stop();
              }
            }}
          >
            <ArrowUp size={18} strokeWidth={2} style={{ opacity: sendState === "stop" ? 0 : 1, transition: "opacity 150ms var(--ct-ease)" }} />
            <Square size={14} fill="currentColor" strokeWidth={0} style={{ opacity: sendState === "stop" ? 1 : 0, transition: "opacity 150ms var(--ct-ease)" }} />
          </button>
        </form>
      </div>
    </div>
  );
}

function TurnView({ turn, reduce }: { turn: Turn; reduce: boolean }) {
  const s = turn.script;
  return (
    <article className="ct-turn" data-ct-turn>
      <div className="ct-user" data-ct-user>
        <div className="ct-user-actions">
          <button type="button" className="ct-action" aria-label="Copy">
            <Copy size={15} />
          </button>
          <button type="button" className="ct-action" aria-label="Edit">
            <Pencil size={15} />
          </button>
        </div>
        <div className="ct-bubble" data-ct-bubble>
          {s.user}
        </div>
      </div>
      <div className="ct-reply" data-ct-reply>
        <div className="ct-reasoning" data-ct-reasoning>
          <span className="ct-mark">
            <Spark size={18} />
          </span>
          <button type="button" className="ct-thought" data-ct-thought>
            <Swap id={turn.thought ? "thought" : "thinking"} reduce={reduce}>
              {turn.thought ? <span>{s.thought}</span> : <span className="ct-shimmer">Thinking</span>}
            </Swap>
            <ChevronRight size={14} className="ct-thought-chev" data-on={turn.chevron || undefined} />
          </button>
        </div>
        {s.tool && turn.tool > 0 && (
          <div className="ct-tools" data-ct-tools>
            <span className="ct-chip" data-ct-chip>
              <span className="ct-chip-icon">
                {turn.tool === 1 ? (
                  <LoaderCircle size={16} className="ct-spin" />
                ) : (
                  <span className="ct-icon-in" style={{ display: "grid" }}>
                    {s.tool.kind === "search" ? <Search size={16} /> : <Database size={16} />}
                  </span>
                )}
              </span>
              <Swap id={turn.tool === 2 ? "done" : "running"} reduce={reduce}>
                {turn.tool === 2 ? (
                  <>
                    <span className="ct-ellipsis">{s.tool.done}</span>
                    {s.tool.sources && (
                      <span className="ct-sources">
                        {s.tool.sources.map((c) => (
                          <span key={c} className="ct-src" style={{ background: c }} />
                        ))}
                      </span>
                    )}
                    <span className="ct-chip-meta">{s.tool.meta}</span>
                  </>
                ) : (
                  <span className="ct-ellipsis">{s.tool.running}</span>
                )}
              </Swap>
            </span>
          </div>
        )}
        {turn.ticks > 0 && <Markdown blocks={s.blocks} ticks={turn.ticks} />}
        <div className="ct-actions" data-ct-actions data-hidden={turn.done ? undefined : ""}>
          <button type="button" className="ct-action" aria-label="Copy">
            <Copy size={16} />
          </button>
          <button type="button" className="ct-action" aria-label="Retry">
            <RotateCcw size={16} />
          </button>
          <button type="button" className="ct-action" aria-label="Good response">
            <ThumbsUp size={16} />
          </button>
          <button type="button" className="ct-action" aria-label="Bad response">
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

/** Swaps its content: the new label rises 2 px and fades in, the old one fades out, and the box width springs. */
function Swap({ id, children, reduce }: { id: string; children: ReactNode; reduce: boolean }) {
  const width = useMotionValue<number | "auto">("auto");
  const boxRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const last = useRef<{ id: string; node: ReactNode }>({ id, node: children });
  const initial = useRef(id);
  const [prev, setPrev] = useState<{ key: number; node: ReactNode } | null>(null);
  const seq = useRef(0);

  useLayoutEffect(() => {
    if (last.current.id !== id) {
      const box = boxRef.current;
      const from = box ? box.getBoundingClientRect().width : 0;
      const to = measureRef.current ? measureRef.current.getBoundingClientRect().width : from;
      setPrev({ key: ++seq.current, node: last.current.node });
      if (reduce || !box) width.set("auto");
      else {
        width.set(from);
        animate(width, to, { ...WIDTH_SPRING, onComplete: () => width.set("auto") });
      }
      const k = seq.current;
      window.setTimeout(() => setPrev((p) => (p && p.key === k ? null : p)), 160);
    }
    last.current = { id, node: children };
  });

  return (
    <motion.span className="ct-swap" ref={boxRef} style={{ width }}>
      <span className="ct-swap-item" data-first={id === initial.current || undefined} key={id}>
        {children}
      </span>
      {prev && (
        <span className="ct-swap-item" data-leaving key={`p${prev.key}`} aria-hidden>
          {prev.node}
        </span>
      )}
      <span ref={measureRef} aria-hidden style={{ position: "absolute", visibility: "hidden", width: "max-content", display: "inline-flex", gap: 8, left: 0, top: 0 }}>
        {children}
      </span>
    </motion.span>
  );
}

// ---------- markdown with a token budget ----------

type Seg = { text: string; bold: boolean; code: boolean } | { cite: string };

/** Splits tokens into segments, carrying ** and ` across token boundaries. */
function parseTokens(tokens: string[]): Seg[][] {
  let bold = false;
  let code = false;
  return tokens.map((tok) => {
    const out: Seg[] = [];
    const re = /(\*\*|`|\[\d+\])/g;
    let i = 0;
    let m: RegExpExecArray | null;
    const push = (s: string) => s && out.push({ text: s, bold, code });
    while ((m = re.exec(tok))) {
      push(tok.slice(i, m.index));
      if (m[0] === "**") bold = !bold;
      else if (m[0] === "`") code = !code;
      else out.push({ cite: m[0].slice(1, -1) });
      i = m.index + m[0].length;
    }
    push(tok.slice(i));
    return out;
  });
}

function Chunks({ tokens, count }: { tokens: string[]; count: number }) {
  const segs = parseTokens(tokens).slice(0, count);
  return (
    <>
      {segs.map((tok, i) => (
        <span className="ct-chunk" key={i}>
          {tok.map((s, j) => {
            if ("cite" in s)
              return (
                <span className="ct-cite" key={j}>
                  {s.cite}
                </span>
              );
            let node: ReactNode = s.text;
            if (s.code) node = <code className="ct-inline">{node}</code>;
            if (s.bold) node = <strong>{node}</strong>;
            return <span key={j}>{node}</span>;
          })}
        </span>
      ))}
    </>
  );
}

const SQL_KW = /^(CREATE|TABLE|LIKE|INCLUDING|DEFAULTS|COPY|FROM|WITH|FORMAT|HEADER|INDEX|CONCURRENTLY|ON|ALTER|RENAME|TO|true)$/;
const SH_KW = /^(for|in|do|done|wait|split|psql)$/;
function highlight(text: string, lang: string): ReactNode[] {
  return text.split(/('[^']*'|"[^"]*"|\$\w+|\b\d[\d,]*\b|\b[A-Za-z_]+\b)/).map((p, i) => {
    if (!p) return null;
    if (/^['"]/.test(p)) return <span className="ct-str" key={i}>{p}</span>;
    if (/^\d/.test(p)) return <span className="ct-num" key={i}>{p}</span>;
    if ((lang === "sql" ? SQL_KW : SH_KW).test(p)) return <span className="ct-kw" key={i}>{p}</span>;
    return p;
  });
}

function Markdown({ blocks, ticks }: { blocks: Block[]; ticks: number }) {
  const out: ReactNode[] = [];
  let idx = 0;
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    if (ticks <= idx) break;
    if (block.kind === "p") {
      out.push(
        <p key={b}>
          <Chunks tokens={block.tokens} count={ticks - idx} />
        </p>,
      );
      idx += block.tokens.length;
    } else if (block.kind === "code") {
      const shown = block.tokens.slice(0, ticks - idx);
      out.push(
        <div className="ct-code" key={b} data-ct-code>
          <div className="ct-code-head">
            <span>{block.lang}</span>
            <button type="button" className="ct-copy">
              <Copy size={13} />
              Copy
            </button>
          </div>
          <pre>
            <code>
              {shown.map((tok, i) => (
                <span className="ct-chunk" key={i}>
                  {highlight(tok, block.lang)}
                </span>
              ))}
            </code>
          </pre>
        </div>,
      );
      idx += block.tokens.length;
    } else {
      const items: ReactNode[] = [];
      for (let i = 0; i < block.items.length; i++) {
        const item = block.items[i];
        if (ticks > idx)
          items.push(
            <li className="ct-chunk" key={i}>
              <Chunks tokens={item} count={ticks - idx} />
            </li>,
          );
        idx += item.length;
      }
      const List = block.kind;
      out.push(<List key={b}>{items}</List>);
    }
  }
  return (
    <div className="ct-md" data-ct-md>
      {out}
    </div>
  );
}

/** Our own mark: a soft four-point spark. */
function Spark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 2.5c.5 4.6 2.9 7 9.5 9.5-6.6 2.5-9 4.9-9.5 9.5-.5-4.6-2.9-7-9.5-9.5 6.6-2.5 9-4.9 9.5-9.5Z" />
      <circle cx="19" cy="4.8" r="1.6" opacity=".55" />
    </svg>
  );
}
