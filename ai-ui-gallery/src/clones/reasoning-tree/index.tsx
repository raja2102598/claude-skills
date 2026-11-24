import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { Check, Pause, Play, RotateCcw, SkipForward, Sparkle } from "lucide-react";
import clsx from "clsx";
import { MODEL, QUESTION, TREE, type Thought } from "./data";
import "./reasoning-tree.css";

/*
 * Reasoning tree, motion-faithful to Arc UI "Reasoning tree" (Pro): beam search over thoughts. A run reads the
 * question, then for three depths proposes thoughts (nodes and edges draw in), scores them (bars fill and numbers
 * count up), and keeps the best `beam` of the level (the rest fade). At depth 3 the winner turns green, the others
 * fade, and the path back to the question lights up. Controls: play/pause, step, reset, beam width 1/2/3.
 * Event times below were measured on the reference (virtual clock, ms from the card appearing). The clock is advanced by rAF so it can
 * be paused and stepped; every visual change is a CSS transition keyed off the step number.
 */

// step: 0 ready (play icon, card taller), 1 collapse (the stage shrinks, controls slide in), 2 reading, then per
// depth k: propose, score, keep (depth 3: answer, whose path highlight keeps moving for 1.26 s)
const T = [0, 1400, 1570, 2170, 2840, 3730, 4520, 5170, 6050, 6810, 7430];
const P = (k: number) => 3 + 3 * (k - 1);
const END = 10;
const TAIL = 1260;

const COL_X = [20, 167, 337, 506];
const COL_W = [119, 140, 140, 140];
const NODE_H = 54;
const Q_H = 82;
const CY = 273;

interface N {
  t: Thought;
  depth: number;
  parent: string | null;
  y: number;
  kept: boolean;
  best: boolean;
  onPath: boolean;
  idx: number;
  ci: number;
}

function layout(beam: number) {
  const levels: N[][] = [];
  let parents: { id: string | null; y: number; kids: Thought[] }[] = [{ id: null, y: CY, kids: TREE }];
  let best: Thought | null = null;
  for (let d = 1; d <= 3; d++) {
    const nodes: N[] = [];
    const want: number[] = [];
    for (const p of parents) {
      p.kids.forEach((t, i) => {
        want.push(p.y + (i - (p.kids.length - 1) / 2) * 62);
        nodes.push({ t, depth: d, parent: p.id, y: 0, kept: false, best: false, onPath: false, idx: nodes.length, ci: i });
      });
    }
    const pitch = Math.min(62, 340 / nodes.length);
    const ys = want.slice();
    for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + pitch);
    const shift = want.reduce((a, b) => a + b, 0) / want.length - ys.reduce((a, b) => a + b, 0) / ys.length;
    nodes.forEach((n, i) => (n.y = Math.min(450 - NODE_H / 2, Math.max(95 + NODE_H / 2, ys[i] + shift))));
    const keptIds = new Set([...nodes].sort((a, b) => b.t.score - a.t.score).slice(0, beam).map((n) => n.t.id));
    nodes.forEach((n) => (n.kept = keptIds.has(n.t.id)));
    levels.push(nodes);
    if (d === 3) best = [...nodes].sort((a, b) => b.t.score - a.t.score)[0].t;
    parents = nodes.filter((n) => n.kept).map((n) => ({ id: n.t.id, y: n.y, kids: n.t.children ?? [] }));
  }
  const all = levels.flat();
  const byId = new Map(all.map((n) => [n.t.id, n]));
  for (let cur = byId.get(best!.id); cur; cur = cur.parent ? byId.get(cur.parent) : undefined) {
    cur.onPath = true;
    if (cur.t.id === best!.id) cur.best = true;
  }
  return { levels, all };
}

export default function ReasoningTree() {
  const [beam, setBeam] = useState(2);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [prev, setPrev] = useState<string | null>(null);
  const clock = useRef({ t: 0, step: 0, running: false });

  const { levels, all } = useMemo(() => layout(beam), [beam]);

  const apply = useCallback((s: number, r?: boolean) => {
    clock.current.step = s;
    clock.current.t = T[s];
    flushSync(() => {
      setStep(s);
      if (r !== undefined) {
        clock.current.running = r;
        setRunning(r);
      }
    });
  }, []);

  const restart = useCallback(() => {
    clock.current.t = 0;
    clock.current.step = 0;
    clock.current.running = true;
    setStep(0);
    setRunning(true);
  }, []);

  // autoplay shortly after mount (the Ready state lasts T[1]), and again after a reset or beam change
  useEffect(() => {
    if (step === 0 && !running && !clock.current.running) {
      clock.current.running = true;
      setRunning(true);
    }
  }, [step, running, beam]);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const c = clock.current;
      if (c.running) {
        c.t += Math.min(now - last, 100);
        let s = c.step;
        while (s < END && c.t >= T[s + 1]) s++;
        if (s !== c.step) {
          c.step = s;
          flushSync(() => setStep(s));
        }
        if (s === END) {
          c.running = false;
          setRunning(false);
        }
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame((n) => {
      last = n;
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const proposing = (n: N) => step === P(n.depth);
  const proposed = (n: N) => step >= P(n.depth);
  const scoring = (n: N) => step >= P(n.depth) + 1;
  const decided = (n: N) => step >= P(n.depth) + 2;
  const answer = step === END;
  const winner = all.find((n) => n.best)!;
  const nodeById = new Map(all.map((n) => [n.t.id, n]));

  const count = (d: number) => levels[d - 1].length;
  let status = "Ready";
  if (answer) status = "Answer found";
  else if (step >= 2) {
    const d = Math.min(3, Math.floor((step - 3) / 3) + 1);
    const ph = step < 3 ? -1 : (step - 3) % 3;
    status = ph < 0 ? "Reading the question" : ph === 0 ? `Proposing ${count(d)} thoughts` : ph === 1 ? `Scoring ${count(d)} thoughts` : `Keeping the best ${beam}`;
  }
  const live = step >= 2 && !answer;
  const activeDepth = step < 3 || answer ? 0 : Math.min(3, Math.floor((step - 3) / 3) + 1);
  const paused = !running && step > 1 && !answer;

  // the status crossfades: the old line fades out in 100 ms, the new one fades in over 150 ms after it
  const lastStatus = useRef(status);
  useEffect(() => {
    if (lastStatus.current !== status) {
      setPrev(lastStatus.current);
      lastStatus.current = status;
      const id = window.setTimeout(() => setPrev(null), 260);
      return () => window.clearTimeout(id);
    }
  }, [status]);

  const qBottom = CY;
  const edgePts = (n: N) => {
    const p = n.parent ? nodeById.get(n.parent)! : null;
    const x1 = p ? COL_X[p.depth] + COL_W[p.depth] : COL_X[0] + COL_W[0];
    const y1 = p ? p.y : qBottom;
    const x2 = COL_X[n.depth];
    const mx = (x1 + x2) / 2;
    return { x1, y1, x2, y2: n.y, mx };
  };
  const edge = (n: N) => {
    const { x1, y1, x2, y2, mx } = edgePts(n);
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  };
  // one path from the question through the winning chain (drawn at the end, with a travelling sheen)
  const winPath = (() => {
    const chain: N[] = [];
    for (let c: N | undefined = winner; c; c = c.parent ? nodeById.get(c.parent) : undefined) chain.unshift(c);
    let d = "";
    chain.forEach((n, i) => {
      const { x1, y1, x2, y2, mx } = edgePts(n);
      d += `${i === 0 ? `M${x1} ${y1} ` : ""}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2} L${x2 + COL_W[n.depth]} ${y2} `;
    });
    return d;
  })();

  const dim = (n: N) => (decided(n) && !n.kept) || (answer && n.depth === 3 && !n.best);

  return (
    <div className="rt" data-rt data-start={step >= 1 ? "1" : "0"}>
      <div className="rt-card">
        <div className="rt-head">
          <Sparkle size={16} fill="currentColor" style={{ color: "var(--mark)" }} />
          <span className="rt-model">{MODEL}</span>
          <span className="rt-sub">Tree of thoughts</span>
          <span className="rt-statuswrap" data-rt-status>
            {prev !== null && <span key={"o" + prev} className="rt-status rt-out">{prev}</span>}
            <span key={status} className={clsx("rt-status", prev !== null && "rt-in", live && !paused && "live", answer && "done")}>
              {status}
            </span>
          </span>
        </div>

        <div className="rt-cols">
          <span className={clsx("rt-col", step < 3 && "on")} style={{ left: COL_X[0] }}>Question</span>
          {[1, 2, 3].map((d) => (
            <span key={d} className={clsx("rt-col", activeDepth === d && "on")} style={{ left: COL_X[d] }}>
              Depth {d}
            </span>
          ))}
          {[1, 2].map((d) =>
            step >= P(d) + 2 ? (
              <span key={d} className="rt-kept" style={{ right: 667 - COL_X[d] - COL_W[d] }}>
                {beam} of {count(d)} kept
              </span>
            ) : null,
          )}
          {answer && (
            <span className="rt-kept" style={{ right: 667 - COL_X[3] - COL_W[3] }}>
              Best of {count(3)}
            </span>
          )}
        </div>

        <svg className="rt-edges" width="667" height="539" viewBox="0 0 667 539">
          {all.map((n) => {
            const pruned = (decided(n) && !n.kept && n.depth < 3) || (answer && n.depth === 3 && !n.best);
            return (
              <path
                key={n.t.id}
                d={edge(n)}
                pathLength={1}
                className={clsx("rt-edge", proposed(n) && "in", pruned && "out")}
                style={{ transitionDelay: proposing(n) ? `${n.ci * 20}ms` : "0ms" }}
              />
            );
          })}
          {answer && <path key="win" d={winPath} pathLength={1} className="rt-win" />}
          {answer && <path key="sheen" d={winPath} pathLength={1} className="rt-sheen" />}
        </svg>

        <div className={clsx("rt-node q", answer && "path")} style={{ left: COL_X[0], top: CY - Q_H / 2, width: COL_W[0], height: Q_H }}>
          {QUESTION}
        </div>

        {all.map((n) => {
          const kept = decided(n) && n.kept;
          const pathDelay = answer && n.onPath ? 160 + (n.depth - 1) * (760 / 3) : 0;
          return (
            <div
              key={n.t.id}
              className={clsx("rt-node leaf", proposed(n) && "in", dim(n) && "pruned", kept && "kept", answer && n.onPath && "path", answer && n.best && "best")}
              style={{
                left: COL_X[n.depth], top: n.y - NODE_H / 2, width: COL_W[n.depth], height: NODE_H,
                transitionDelay: proposing(n) ? `${100 + n.ci * 20}ms, 0ms, 0ms` : `0ms, ${pathDelay}ms, ${n.best ? 920 : 0}ms`,
              }}
              data-depth={n.depth}
            >
              <div className="rt-title">{n.t.label}</div>
              {answer && n.best && <Check size={14} className="rt-check" />}
              <div className="rt-row">
                <span className="rt-bar">
                  <i
                    className="rt-fill"
                    style={{ transform: `scaleX(${scoring(n) ? n.t.score : 0})`, transitionDelay: step === P(n.depth) + 1 ? `${n.ci * 20}ms, 0ms` : "0ms" }}
                  />
                </span>
                <span
                  className={clsx("rt-num", scoring(n) && "show", decided(n) && n.kept && "kept")}
                  style={{ "--rt-n": scoring(n) ? Math.round(n.t.score * 100) : 0, transitionDelay: step === P(n.depth) + 1 ? `${n.ci * 20}ms, ${n.ci * 20}ms, 0ms` : "0ms" } as CSSProperties}
                />
              </div>
            </div>
          );
        })}

        <div className="rt-foot">
          <button
            className="rt-btn" data-rt-play aria-label={running ? "Pause" : "Play"}
            onClick={() => {
              if (answer) {
                apply(0, false);
                clock.current.running = true;
                setRunning(true);
              } else {
                clock.current.running = !running;
                setRunning(!running);
              }
            }}
          >
            <Pause size={16} className={clsx("rt-ic", running && "on")} />
            <Play size={16} className={clsx("rt-ic", !running && "on")} />
          </button>
          <button
            className={clsx("rt-btn", answer && "off")} aria-label="Step" disabled={step >= END}
            onClick={() => apply(Math.min(END, Math.max(2, step + 1)), false)}
          >
            <SkipForward size={16} />
          </button>
          <button className="rt-btn" aria-label="Reset" onClick={restart}>
            <RotateCcw size={16} />
          </button>
          <div className="rt-beam">
            <span>Beam width</span>
            <div className="rt-seg" role="group" aria-label="Beam width">
              <span className="rt-pill" style={{ transform: `translateX(${(beam - 1) * 34}px)` }} />
              {[1, 2, 3].map((b) => (
                <button
                  key={b} data-rt-beam={b} aria-pressed={beam === b}
                  onClick={() => {
                    if (b === beam) return;
                    setBeam(b);
                    restart();
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
