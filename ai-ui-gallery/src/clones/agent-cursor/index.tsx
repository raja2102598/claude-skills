import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CircleAlert, CircleCheck, Pencil, RotateCcw, Sparkles, Square, Undo2 } from "lucide-react";
import "./agent-cursor.css";

/*
 * Agent cursor clone. A scripted run on a real clock (setTimeout) drives plain state; cursors move with CSS
 * transitions, so the motion behaves the same on the real and the virtual clock.
 * Timeline numbers (ms from the run's reset) come from .reanimate/agent-cursor/spec.md.
 */

const HOME = { x: 33, y: 30 };
const HUMAN_HOME = { x: 332, y: 181 };

const OLD_TEXT =
  "So basically the main thing we are trying to do here is make it so that nobody on the team gets stuck covering a shift they did not know about, because a lot of people were caught out last month and that turned into a lot of swaps.";
const CHUNKS = [
  "Everyone should know",
  " their shift a week",
  " ahead. Surprise cover drove 31% of",
  " swap requests in",
  " Q3, so a",
  " published rota and",
  " reminders ship on day",
  " one.",
];
const HEAD = "Rollout";

type Scenario = "edits" | "error";
type Phase = "running" | "review" | "accepted" | "error" | "stopped";
type StatusKey = "reading" | "tightening" | "heading" | "typo" | "review" | "accepted" | "error" | "stopped";

const STATUS: Record<StatusKey, string> = {
  reading: "Reading the doc",
  tightening: "Tightening the goals",
  heading: "Adding a heading",
  typo: "Fixing a typo",
  review: "3 edits ready for review",
  accepted: "Accepted 3 edits",
  error: "Connection lost",
  stopped: "Stopped",
};

interface Pt { x: number; y: number }

/** cubic-bezier(0.22, 1, 0.36, 1) solved numerically, driven by rAF so it follows the page clock. */
function bez(p1x: number, p1y: number, p2x: number, p2y: number) {
  const f = (a: number, b: number, c: number, u: number) => ((1 - 3 * c + 3 * a) * u + (3 * c - 6 * a)) * u * u + 3 * a * u;
  return (x: number) => {
    let lo = 0, hi = 1, u = x;
    for (let i = 0; i < 24; i++) {
      u = (lo + hi) / 2;
      if (f(p1x, 0, p2x, u) < x) lo = u; else hi = u;
    }
    return f(p1y, 0, p2y, u);
  };
}
const ease = bez(0.22, 1, 0.36, 1);
interface S {
  phase: Phase;
  status: StatusKey;
  statusN: number;
  fading: boolean;
  agent: Pt & { vis: boolean; ms: number };
  human: Pt & { vis: boolean; ms: number };
  para: "old" | "dim" | "collapsed" | "new";
  chunks: number;
  sel: boolean;
  headOpen: boolean;
  headChars: number;
  typoFixed: boolean;
  tinted: boolean;
  bar: "off" | "on" | "out";
  scenario: Scenario;
}

const INITIAL: S = {
  phase: "running",
  status: "reading",
  statusN: 0,
  fading: false,
  agent: { ...HOME, vis: false, ms: 0 },
  human: { ...HUMAN_HOME, vis: true, ms: 560 },
  para: "old",
  chunks: 0,
  sel: false,
  headOpen: false,
  headChars: 0,
  typoFixed: false,
  tinted: true,
  bar: "off",
  scenario: "edits",
};

function Arrow() {
  return (
    <svg className="ac-arrow" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M2.2 1.6 15.4 8.2c.9.5.8 1.8-.2 2.1l-5 1.5-2.2 4.6c-.5 1-1.9.8-2.1-.2L2 2.6c-.1-.8.5-1.3.2-1Z" fill="currentColor" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function AgentCursor() {
  const [s, setS] = useState<S>(INITIAL);
  const timers = useRef<number[]>([]);
  const els = useRef<Record<"agent" | "human", HTMLDivElement | null>>({ agent: null, human: null });
  const pos = useRef<Record<"agent" | "human", Pt>>({ agent: { ...HOME }, human: { ...HUMAN_HOME } });
  const raf = useRef<Record<"agent" | "human", number>>({ agent: 0, human: 0 });
  const place = (w: "agent" | "human", x: number, y: number) => {
    pos.current[w] = { x, y };
    const e = els.current[w];
    if (e) e.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
  };
  const selEls = useRef<(HTMLSpanElement | null)[]>([]);
  const SEL_W = [607, 607, 423];
  const setSel = (p: number) => {
    const total = SEL_W.reduce((a, b) => a + b, 0) * p;
    let used = 0;
    SEL_W.forEach((w, i) => {
      const e = selEls.current[i];
      if (e) e.style.width = `${Math.max(0, Math.min(w, total - used))}px`;
      used += w;
    });
  };
  const sweep = (ms: number) => {
    setS((p) => ({ ...p, sel: true }));
    const t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      setSel(ease(k));
      if (k < 1) requestAnimationFrame(tick);
    };
    setSel(0);
    requestAnimationFrame(tick);
  };
  const glide = (w: "agent" | "human", x: number, y: number, ms: number) => {
    cancelAnimationFrame(raf.current[w]);
    const from = { ...pos.current[w] };
    if (ms <= 0) return place(w, x, y);
    const t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      const e = ease(k);
      place(w, from.x + (x - from.x) * e, from.y + (y - from.y) * e);
      if (k < 1) raf.current[w] = requestAnimationFrame(tick);
    };
    raf.current[w] = requestAnimationFrame(tick);
  };
  const runId = useRef(0);
  const patch = useCallback((p: Partial<S> | ((s: S) => Partial<S>)) => setS((prev) => ({ ...prev, ...(typeof p === "function" ? p(prev) : p) })), []);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const run = useCallback(
    (scenario: Scenario) => {
      clear();
      const id = ++runId.current;
      const at = (ms: number, fn: () => void) => {
        timers.current.push(
          window.setTimeout(() => {
            if (runId.current === id) fn();
          }, ms),
        );
      };
      const status = (k: StatusKey) => patch((p) => ({ status: k, statusN: p.statusN + 1 }));
      const fly = (x: number, y: number, ms = 420) => { glide("agent", x, y, ms); setS((p) => ({ ...p, agent: { ...p.agent, x, y } })); };
      const show = (vis: boolean) => patch((p) => ({ agent: { ...p.agent, vis } }));
      const nudge = (x: number, y: number, ms: number) => { glide("human", x, y, ms); setS((p) => ({ ...p, human: { ...p.human, x, y } })); };

      // reset: the doc and the human cursor dip out, then the original run state returns
      place("agent", HOME.x, HOME.y);
      patch({ fading: true, phase: "running", scenario, bar: "off", human: { ...HUMAN_HOME, vis: false, ms: 0 }, agent: { ...HOME, vis: false, ms: 0 } });
      at(40, () => {
        place("human", HUMAN_HOME.x, HUMAN_HOME.y);
        patch({ ...INITIAL, scenario, fading: true, human: { ...HUMAN_HOME, vis: false, ms: 0 }, statusN: 0, status: "reading" });
      });
      at(60, () => patch({ fading: false }));
      at(70, () => patch((p) => ({ human: { ...p.human, vis: true } })));

      // agent flies out of its avatar and reads
      at(266, () => {
        show(true);
        fly(178, 158, 483);
      });

      if (scenario === "error") {
        at(1400, () => fly(HOME.x, HOME.y, 466));
        at(1700, () => show(false));
        at(1700, () => patch({ phase: "error" }));
        at(1700, () => status("error"));
        return;
      }

      at(916, () => {
        fly(35, 249, 316);
        status("tightening");
      });
      at(1350, () => {
        fly(537, 298, 333);
        sweep(333);
      });
      at(1750, () => patch({ sel: false, para: "dim" }));
      at(1960, () => patch({ para: "collapsed" }));
      at(2000, () => patch({ para: "new" }));
      CHUNKS.forEach((_, i) => at(2000 + i * 45, () => patch({ chunks: i + 1 })));
      at(2050, () => fly(541, 274, 283));
      at(2333, () => nudge(319, 178, 316));
      at(2683, () => fly(35, 301, 566));
      at(2733, () => status("heading"));
      at(3300, () => patch({ headOpen: true }));
      HEAD.split("").forEach((_, i) => at(3450 + i * 30, () => patch({ headChars: i + 1 })));
      at(3700, () => fly(82, 317, 233));
      at(4066, () => nudge(335, 185, 383));
      at(4400, () => {
        fly(241, 342, 316);
        status("typo");
      });
      at(4650, () => patch({ typoFixed: true }));
      at(5600, () => {
        patch({ bar: "on" });
        fly(HOME.x, HOME.y, 466);
      });
      at(5616, () => {
        status("review");
        patch({ phase: "review" });
      });
      at(5766, () => show(false));
      // the teammate accepts the changes
      at(5983, () => nudge(349, 184, 316));
      at(7100, () => nudge(454, 422, 500));
      at(7766, () => {
        patch({ bar: "out", tinted: false });
        status("accepted");
        patch({ phase: "accepted" });
      });
      at(8166, () => nudge(HUMAN_HOME.x, HUMAN_HOME.y, 533));
      at(9816, () => run("edits"));
    },
    [patch],
  );

  useEffect(() => {
    run("edits");
    return () => {
      runId.current++;
      clear();
    };
  }, [run]);

  const stop = () => {
    runId.current++;
    clear();
    patch((p) => ({ phase: "stopped", status: "stopped", statusN: p.statusN + 1, agent: { ...p.agent, vis: false } }));
  };

  const working = s.phase === "running";
  const para = s.para;
  const paraH = para === "old" || para === "dim" ? 72 : para === "collapsed" ? 24 : 48;
  const typed = HEAD.slice(0, s.headChars);
  const StatusIcon = s.phase === "review" ? Pencil : s.phase === "accepted" ? CircleCheck : s.phase === "error" ? CircleAlert : null;
  const flipAgent = s.agent.x > 540;
  const flipHuman = s.human.x > 540;

  return (
    <div className="ac-root">
      <div className="ac-card">
        <div className="ac-header">
          <div className="ac-stack">
            <span className="ac-avatar ac-avatar-agent" data-working={working} role="img" aria-label="Atlas">
              <Sparkles size={15} strokeWidth={2} />
            </span>
            <span className="ac-avatar ac-avatar-human" role="img" aria-label="Maya Ortiz" />
          </div>
          <div className="ac-status" aria-live="polite">
            <span className={"ac-status-inner" + (s.statusN > 0 ? " ac-status-in" : "")} key={s.statusN}>
              {StatusIcon && <StatusIcon size={13} strokeWidth={1.8} />}
              <span>{STATUS[s.status]}</span>
            </span>
          </div>
          <div className="ac-action">
            {working && (
              <button className="ac-btn" onClick={stop}>
                <Square size={13} strokeWidth={1.8} />
                Stop
              </button>
            )}
            {(s.phase === "accepted" || s.phase === "stopped") && (
              <button className="ac-btn" onClick={() => run("edits")}>
                <RotateCcw size={13} strokeWidth={1.8} />
                Run again
              </button>
            )}
            {s.phase === "error" && (
              <button className="ac-btn" onClick={() => run("error")}>
                <RotateCcw size={13} strokeWidth={1.8} />
                Retry
              </button>
            )}
          </div>
        </div>

        <article className="ac-doc" data-fading={s.fading} aria-label="Support rota refresh">
          <h3 className="ac-title">Support rota refresh</h3>
          <div className="ac-meta">Maya Ortiz · Draft for Mar 3, 2027</div>

          <div className="ac-block">
            <p className="ac-p">From March 3 every support shift follows one shared rota: two people on chat, one on email, and a lead who owns escalations all day.</p>
          </div>

          <div className="ac-block-h">
            <h4 className="ac-h">Goals</h4>
          </div>

          <div className="ac-block-after-h">
            <div className="ac-fit" style={{ height: paraH }}>
              <div style={{ position: "relative" }}>
                {(para === "old" || para === "dim") && (
                  <>
                    <p className="ac-p ac-old" data-dim={para === "dim"}>
                      {OLD_TEXT}
                    </p>
                    {[0, 1, 2].map((i) => (
                      <span key={i} ref={(e) => { selEls.current[i] = e; }} className="ac-sel" data-on={s.sel} style={{ top: i * 24, height: 24, left: -2, width: 0 }} />
                    ))}
                  </>
                )}
                {para === "collapsed" && (
                  <p className="ac-p">
                    <span className="ac-caret" />
                  </p>
                )}
                {para === "new" && (
                  <p className="ac-p">
                    {CHUNKS.map((c, i) => (
                      <span key={i} className="ac-chunk" data-shown={i < s.chunks} data-pending={s.tinted}>
                        {c}
                      </span>
                    ))}
                    {s.chunks < CHUNKS.length && <span className="ac-caret" />}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="ac-fit ac-fit-stack" style={{ height: s.headOpen ? 39 : 0 }}>
            <div className="ac-block-h ac-heading-wrap">
              <h4 className="ac-h">
                <span className="ac-tint" data-pending={s.tinted && s.headChars > 0}>
                  {typed}
                </span>
                {s.headChars > 0 && s.headChars < HEAD.length && <span className="ac-caret" style={{ height: 14, verticalAlign: -2 }} />}
              </h4>
            </div>
          </div>

          <div className="ac-block">
            <p className="ac-p">
              Week one covers 5% of{" "}
              <span className="ac-swap">
                {s.typoFixed ? (
                  <span className="ac-tint" data-pending={s.tinted}>
                    schedules
                  </span>
                ) : (
                  <span className="ac-typo">schedlues</span>
                )}
              </span>{" "}
              behind the rota_v2 flag. We widen to 50% once swap requests stay under 0.4% for seven days, then roll out to everyone on April 7.
            </p>
          </div>
        </article>

        <div className="ac-barwrap">
          <div className="ac-bar" role="group" aria-label="Review edits" data-on={s.bar === "on"} data-out={s.bar === "out"}>
            <span className="ac-bar-label">
              <Sparkles size={14} strokeWidth={2} />
              3 edits by Atlas
            </span>
            <button className="ac-btn" tabIndex={s.bar === "on" ? 0 : -1} onClick={() => run("edits")}>
              <Undo2 size={14} strokeWidth={1.8} />
              Undo
            </button>
            <button className="ac-btn ac-btn-primary" tabIndex={s.bar === "on" ? 0 : -1} onClick={() => patch({ bar: "out", tinted: false })}>
              <Check size={14} strokeWidth={2.2} />
              Accept changes
            </button>
          </div>
        </div>

        <div className="ac-cursors" aria-hidden="true">
          <div
            className="ac-cursor ac-cursor-human"
            data-vis={s.human.vis}
            ref={(e) => { els.current.human = e; if (e && !e.style.transform) place("human", pos.current.human.x, pos.current.human.y); }}
          >
            <Arrow />
            <span className="ac-tag" data-flip={flipHuman}>
              <span className="ac-tag-avatar" />
              Maya
            </span>
          </div>
          <div
            className="ac-cursor ac-cursor-agent"
            data-vis={s.agent.vis}
            ref={(e) => { els.current.agent = e; if (e && !e.style.transform) place("agent", pos.current.agent.x, pos.current.agent.y); }}
          >
            <Arrow />
            <span className="ac-tag" data-flip={flipAgent}>
              <span className="ac-tag-mark">
                <Sparkles size={12} strokeWidth={2.2} />
              </span>
              Atlas
            </span>
          </div>
        </div>
      </div>

      <div className="ac-seg" role="group" aria-label="Run outcome">
        <span className="ac-seg-pill" style={{ width: s.scenario === "edits" ? 83 : 132, transform: `translateX(${s.scenario === "edits" ? 0 : 85}px)` }} />
        <button style={{ width: 83 }} aria-pressed={s.scenario === "edits"} onClick={() => s.scenario !== "edits" && run("edits")}>
          <span>Edits land</span>
        </button>
        <button style={{ width: 132 }} aria-pressed={s.scenario === "error"} onClick={() => s.scenario !== "error" && run("error")}>
          <span>Connection drops</span>
        </button>
      </div>
    </div>
  );
}
