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
 * Event times below were read off the reference's frames (ms from mount). The clock is advanced by rAF so it can
 * be paused and stepped; every visual change is a CSS transition keyed off the step number.
 */

// step: 0 ready, 1 reading, then per depth k: propose, score, fill, keep (depth 3: answer)
const T = [0, 1000, 2600, 3200, 3800, 4200, 5200, 5700, 6200, 7000, 8000, 8700, 9400, 10800];
const P = (k: number) => 2 + 4 * (k - 1);
const END = T.length - 1;

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
        nodes.push({ t, depth: d, parent: p.id, y: 0, kept: false, best: false, onPath: false, idx: nodes.length });
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

const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function ReasoningTree() {
  const [beam, setBeam] = useState(2);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
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

  // autoplay on mount, like the reference (and again after a reset or beam change)
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

  const level = (n: N) => n.depth;
  const proposed = (n: N) => step >= P(level(n));
  const scoring = (n: N) => step >= P(level(n)) + 1;
  const filled = (n: N) => step >= P(level(n)) + 2;
  const decided = (n: N) => step >= P(level(n)) + 3;
  const answer = step === END;
  const winner = all.find((n) => n.best)!;
  const nodeById = new Map(all.map((n) => [n.t.id, n]));

  const count = (d: number) => levels[d - 1].length;
  let status = "Ready";
  let live = false;
  if (step === 1) status = "Reading the question";
  else if (answer) status = "Answer found";
  else if (step > 1) {
    const d = Math.min(3, Math.floor((step - 2) / 4) + 1);
    const ph = (step - 2) % 4;
    status = ph === 0 ? `Proposing ${count(d)} thoughts` : ph < 3 ? `Scoring ${count(d)} thoughts` : `Keeping the best ${beam}`;
  }
  live = step >= 1 && !answer;
  const activeDepth = step < 2 ? 0 : Math.min(3, Math.floor((step - 2) / 4) + 1);
  const paused = !running && step > 0 && !answer;

  const qBottom = CY;
  const edge = (n: N) => {
    const p = n.parent ? nodeById.get(n.parent)! : null;
    const x1 = p ? COL_X[p.depth] + COL_W[p.depth] : COL_X[0] + COL_W[0];
    const y1 = p ? p.y : qBottom;
    const x2 = COL_X[n.depth];
    const mx = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${n.y} ${x2} ${n.y}`;
  };

  return (
    <div className="rt" data-rt>
      <div className="rt-head">
        <Sparkle size={16} fill="currentColor" style={{ color: "var(--mark)" }} />
        <span className="rt-model">{MODEL}</span>
        <span className="rt-sub">Tree of thoughts</span>
        <span key={status} className={clsx("rt-status rt-swap", live && !paused && "live", answer && "done")} data-rt-status>
          {answer && <Check size={14} />}
          {status}
        </span>
      </div>

      <div className="rt-cols">
        <span className={clsx("rt-col", step < 2 && "on")} style={{ left: COL_X[0] }}>Question</span>
        {[1, 2, 3].map((d) => (
          <span key={d} className={clsx("rt-col", activeDepth === d && "on")} style={{ left: COL_X[d] }}>
            Depth {d}
          </span>
        ))}
        {[1, 2].map((d) =>
          step >= P(d) + 3 ? (
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
          const pruned = decided(n) && !n.kept;
          return (
            <path
              key={n.t.id}
              d={edge(n)}
              pathLength={1}
              className={clsx("rt-edge", proposed(n) && "in", pruned && "out", answer && n.onPath && "win")}
              style={{ transitionDelay: proposed(n) ? `${(n.idx % 6) * 60}ms` : "0ms" }}
            />
          );
        })}
      </svg>

      <div className="rt-node q" style={{ left: COL_X[0], top: CY - Q_H / 2, width: COL_W[0], height: Q_H }}>
        {QUESTION}
      </div>

      {all.map((n) => {
        const pruned = (decided(n) && !n.kept) || (answer && n.depth === 3 && !n.best);
        const kept = decided(n) && n.kept;
        return (
          <div
            key={n.t.id}
            className={clsx("rt-node leaf", proposed(n) && "in", pruned && "pruned", kept && "kept", answer && n.best && "best")}
            style={{
              left: COL_X[n.depth], top: n.y - NODE_H / 2, width: COL_W[n.depth], height: NODE_H,
              transitionDelay: proposed(n) ? `${(n.idx % 6) * 60}ms` : "0ms",
            }}
            data-depth={n.depth}
          >
            <div className="rt-title">{n.t.label}</div>
            <div className="rt-row">
              <span className="rt-bar">
                <i
                  className="rt-fill"
                  style={{ transform: `scaleX(${filled(n) ? n.t.score : 0})`, transitionDelay: `${(n.idx % 4) * 20}ms` }}
                />
              </span>
              <span
                className={clsx("rt-num", scoring(n) && "show")}
                style={{ "--rt-n": filled(n) ? Math.round(n.t.score * 100) : 0, transitionDelay: `${(n.idx % 4) * 20}ms` } as CSSProperties}
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
          {running ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          className="rt-btn" aria-label="Step" disabled={step >= END}
          onClick={() => apply(Math.min(END, step + 1), false)}
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
  );
}
