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
      const fly = (x: number, y: number, ms = 420) => patch((p) => ({ agent: { ...p.agent, x, y, ms } }));
      const show = (vis: boolean) => patch((p) => ({ agent: { ...p.agent, vis, ms: 0 } }));
      const nudge = (x: number, y: number, ms: number) => patch((p) => ({ human: { ...p.human, x, y, ms } }));

      // reset: the doc and the human cursor dip out, then the original run state returns
      patch({ fading: true, phase: "running", scenario, bar: "off", human: { ...HUMAN_HOME, vis: false, ms: 0 }, agent: { ...HOME, vis: false, ms: 0 } });
      at(150, () => patch({ ...INITIAL, scenario, fading: true, human: { ...HUMAN_HOME, vis: false, ms: 0 }, statusN: 0, status: "reading" }));
      at(170, () => patch({ fading: false }));
      at(260, () => patch((p) => ({ human: { ...p.human, vis: true } })));

      // agent flies out of its avatar and reads
      at(700, () => {
        show(true);
        fly(179, 158, 640);
      });

      if (scenario === "error") {
        at(1700, () => {
          fly(HOME.x, HOME.y, 450);
        });
        at(2050, () => show(false));
        at(1300, () => undefined);
        at(1950, () => patch({ phase: "error" }));
        at(1950, () => status("error"));
        return;
      }

      at(1380, () => fly(35, 249, 330));
      at(1950, () => status("tightening"));
      at(2180, () => fly(537, 298, 380));
      at(2350, () => patch({ sel: true }));
      at(2750, () => patch({ sel: false, para: "dim" }));
      at(2780, () => nudge(317, 178, 700));
      at(2900, () => patch({ para: "collapsed" }));
      at(3250, () => patch({ para: "new" }));
      CHUNKS.forEach((_, i) => at(3300 + i * 100, () => patch({ chunks: i + 1 })));
      at(3300, () => fly(541, 275, 300));
      at(4750, () => fly(45, 299, 420));
      at(5094, () => status("heading"));
      at(5200, () => patch({ headOpen: true }));
      HEAD.split("").forEach((_, i) => at(5520 + i * 60, () => patch({ headChars: i + 1 })));
      at(5560, () => nudge(317, 186, 120));
      at(5600, () => fly(76, 316, 220));
      at(6000, () => fly(82, 317, 160));
      at(6620, () => fly(241, 342, 300));
      at(6932, () => status("typo"));
      at(7350, () => patch({ typoFixed: true }));
      at(7824, () => patch({ bar: "on" }));
      at(7984, () => fly(HOME.x, HOME.y, 470));
      at(8330, () => patch((p) => ({ agent: { ...p.agent, vis: false, ms: 470 } })));
      at(8430, () => {
        status("review");
        patch({ phase: "review" });
      });
      // the teammate accepts the changes
      at(9370, () => nudge(454, 422, 560));
      at(10180, () => patch({ bar: "out", tinted: false }));
      at(10494, () => {
        status("accepted");
        patch({ phase: "accepted" });
      });
      at(10630, () => nudge(HUMAN_HOME.x, HUMAN_HOME.y, 560));
      at(12500, () => run("edits"));
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
                    <span className="ac-sel" data-on={s.sel} style={{ top: 0, height: 24, left: -2, right: -2 }} />
                    <span className="ac-sel" data-on={s.sel} style={{ top: 24, height: 24, left: -2, right: -2 }} />
                    <span className="ac-sel" data-on={s.sel} style={{ top: 48, height: 24, left: -2, right: 184 }} />
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
            style={{ transform: `translate(${s.human.x}px, ${s.human.y}px)`, ["--ms" as string]: `${s.human.ms}ms` }}
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
            style={{ transform: `translate(${s.agent.x}px, ${s.agent.y}px)`, ["--ms" as string]: `${s.agent.ms}ms` }}
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
