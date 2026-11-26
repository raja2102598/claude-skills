import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { flushSync } from "react-dom";
import { Check, Network } from "lucide-react";
import {
  BUYER_ASK,
  CAPTION,
  COLUMNS,
  EDGES,
  HOP_DELAY,
  NODE,
  TOUR,
  dotsFor,
  rateOf,
  statusOf,
  totalRate,
  type NodeId,
  type Phase,
  type Status,
} from "./data";
import "./agent-map.css";

/*
 * Agent map, motion-faithful to UIStacks "Agent map" (Pro).
 * A lead agent, three agents and four tools in three columns, joined by bezier edges. Selecting a node lights its path
 * from the lead to the tools it uses: each hop draws on with an overdamped spring, the agent → tool hop 0.18 s after
 * the lead → agent hop. Dots travel every lit edge, as many and as fast as its calls per minute, on the graph's own
 * clock (they do not restart when the selection changes). The panel below cross-fades to the selected node.
 * On mount a 12 s tour plays: lead, research agent (2.4 s), the buyer asking for approval (4.8 s), the approval
 * (7.6 s), then the graph remounts. Clicking, the arrow keys or the approve button take over from the tour.
 */

// ---------- easing helpers ----------

/** Underdamped spring step response, unit mass. */
function springAt(t: number, w: number, z: number) {
  if (t <= 0) return 0;
  if (z >= 1) {
    const s = w * Math.sqrt(z * z - 1);
    const r1 = -z * w + s;
    const r2 = -z * w - s;
    const a = r2 / (r2 - r1);
    return 1 - (a * Math.exp(r1 * t) + (1 - a) * Math.exp(r2 * t));
  }
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}

/** A spring sampled over `ms` into a CSS linear() easing that lands on 1. */
function springEase(w: number, z: number, ms: number, steps = 40) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const v = i === steps ? 1 : springAt(((i / steps) * ms) / 1000, w, z);
    pts.push(`${+v.toFixed(4)} ${+((i / steps) * 100).toFixed(2)}%`);
  }
  return `linear(${pts.join(", ")})`;
}

// Panel, badge and line swaps: one soft spring (no visible overshoot), cut at each property's settle time.
// The needs-you dot: a bouncy spring that overshoots to 1.18.
const EASES = {
  "--am-e-450": springEase(20.5, 0.83, 450),
  "--am-e-246": springEase(20.5, 0.83, 246),
  "--am-e-294": springEase(20.5, 0.83, 294),
  "--am-e-546": springEase(20.5, 0.83, 546),
  "--am-e-pop": springEase(23.8, 0.49, 647, 60),
} as CSSProperties;

/** Path highlight: overdamped spring, 0.5 at ~70 ms, settled by ~400 ms. */
function drawAt(t: number) {
  if (t <= 0) return 0;
  if (t > 0.6) return 1;
  const v = springAt(t, 25, 1.12);
  return v > 0.999 ? 1 : v;
}

/** cubic-bezier(0.4, 0, 0.6, 1) for the dots' travel. */
function easeInOut(x: number) {
  const x1 = 0.4;
  const x2 = 0.6;
  const bx = (t: number) => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
  const by = (t: number) => 3 * (1 - t) * t * t + t * t * t;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bx(mid) < x) lo = mid;
    else hi = mid;
  }
  return by((lo + hi) / 2);
}

const DRAW_LAG = 1 / 60;

const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- small pieces ----------

const DOTS4 = [2, 6, 10, 14];
const FRAMES: [number, number][][] = [
  [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
  [
    [1, 0],
    [2, 0],
    [0, 1],
    [3, 1],
    [0, 2],
    [3, 2],
    [1, 3],
    [2, 3],
  ],
  [
    [0, 0],
    [3, 0],
    [0, 3],
    [3, 3],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [3, 0],
    [2, 1],
    [1, 2],
    [0, 3],
  ],
];

function Loader({ size }: { size: number }) {
  const id = "am" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg className="am-loader" width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d4cf0" />
          <stop offset="1" stopColor="#22a6d8" />
        </linearGradient>
      </defs>
      <g className="am-loader-base">
        {DOTS4.flatMap((y) => DOTS4.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.45} />))}
      </g>
      {FRAMES.map((f, i) => (
        <g key={i} className="am-loader-f" fill={`url(#${id}-g)`} style={{ animationDelay: `${i === 0 ? 0 : -(4 - i) * 200}ms` }}>
          {f.map(([c, r]) => (
            <circle key={`${c}-${r}`} cx={DOTS4[c]} cy={DOTS4[r]} r={1.45} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** The needs-you dot: pops in, pulses, and springs out before it unmounts. */
function WarnDot({ on }: { on: boolean }) {
  const [shown, setShown] = useState(on);
  if (on && !shown) setShown(true);
  if (!shown) return null;
  const onEnd = (e: AnimationEvent) => {
    if (e.target === e.currentTarget && e.animationName === "am-unpop") setShown(false);
  };
  return (
    <span className="am-warn-dot" data-leaving={on ? undefined : ""} onAnimationEnd={onEnd} aria-hidden>
      <span className="am-warn-ring" />
    </span>
  );
}

type BadgeKind = Status | "busy" | "quiet";
const BADGE_TEXT: Record<BadgeKind, string> = { working: "Working", needs: "Needs you", idle: "Idle", busy: "In use", quiet: "Quiet" };

function Badge({ kind, swap, onEnd }: { kind: BadgeKind; swap?: "in" | "out"; onEnd?: () => void }) {
  return (
    <span
      className="am-badge"
      data-status={kind}
      data-swap={swap}
      onAnimationEnd={(e) => e.target === e.currentTarget && e.animationName === "am-fade-out" && onEnd?.()}
      aria-hidden={swap === "out" || undefined}
    >
      {kind === "working" && <Loader size={16} />}
      {kind === "needs" && <span className="am-badge-dot" />}
      {BADGE_TEXT[kind]}
    </span>
  );
}

/** Status badge that pops the old one out and the new one in when the node's status changes. */
function BadgeSlot({ kind }: { kind: BadgeKind }) {
  const [cur, setCur] = useState({ kind, n: 0 });
  const [ghost, setGhost] = useState<{ kind: BadgeKind; n: number } | null>(null);
  if (cur.kind !== kind) {
    setGhost({ kind: cur.kind, n: cur.n });
    setCur({ kind, n: cur.n + 1 });
  }
  return (
    <span className="am-badge-slot">
      <Badge key={cur.n} kind={cur.kind} swap={cur.n > 0 ? "in" : undefined} />
      {ghost && <Badge key={`g${ghost.n}`} kind={ghost.kind} swap="out" onEnd={() => setGhost(null)} />}
    </span>
  );
}

/** Description line: rises in when its text changes, and with the panel when the panel swaps in (100 ms later). */
function Desc({ text, delay }: { text: string; delay: number | null }) {
  return (
    <p className="am-desc" data-enter={delay !== null ? "" : undefined} style={delay ? ({ "--am-delay": `${delay}ms` } as CSSProperties) : undefined}>
      {text}
    </p>
  );
}

function Icon({ id, box }: { id: NodeId; box: 24 | 32 | 40 }) {
  const n = NODE[id];
  const Glyph = n.icon;
  return (
    <span className={`am-box am-box-${box}`} style={{ color: n.color }}>
      <Glyph strokeWidth={1.9} aria-hidden />
    </span>
  );
}

// ---------- panel ----------

interface Conn {
  verb: string;
  id: NodeId;
  rate: number;
}

function connectionsOf(id: NodeId, phase: Phase): Conn[] {
  const out: Conn[] = [];
  for (const e of EDGES) {
    if (e.from === id) out.push({ verb: NODE[e.to].kind === "tool" ? "Uses" : "Delegates to", id: e.to, rate: rateOf(e.id, phase) });
    if (e.to === id) out.push({ verb: NODE[id].kind === "tool" ? "Used by" : "Reports to", id: e.from, rate: rateOf(e.id, phase) });
  }
  // Reports-to first, like a call chain read from the top.
  return out.sort((a, b) => Number(b.verb === "Reports to") - Number(a.verb === "Reports to"));
}

function badgeOf(id: NodeId, phase: Phase): BadgeKind {
  const s = statusOf(id, phase);
  if (s) return s;
  return connectionsOf(id, phase).some((c) => c.rate > 0) ? "busy" : "quiet";
}

function PanelBody({ id, phase, enter, onApprove }: { id: NodeId; phase: Phase; enter: boolean; onApprove?: () => void }) {
  const n = NODE[id];
  const status = statusOf(id, phase);
  const text = id === "buyer" && status === "needs" ? BUYER_ASK : n.task;
  const conns = connectionsOf(id, phase);
  // The first line is part of the panel's own entrance; a later change of line rises in on its own.
  const firstText = useRef(text);
  const descDelay = text === firstText.current ? (enter ? 100 : null) : 0;
  return (
    <>
      <div className="am-panel-col">
        <div className="am-who">
          <Icon id={id} box={40} />
          <div style={{ minWidth: 0 }}>
            <p className="am-who-name">{n.name}</p>
            <p className="am-who-sub">
              {n.kind === "agent" ? "Agent" : "Tool"} · {n.role}
            </p>
          </div>
        </div>
        <BadgeSlot kind={badgeOf(id, phase)} />
        <Desc key={text} text={text} delay={descDelay} />
        {status === "needs" && (
          <button type="button" className="am-approve" onClick={onApprove}>
            <Check size={16} strokeWidth={2} aria-hidden />
            Approve payment
          </button>
        )}
      </div>
      <div className="am-panel-col">
        <p className="am-conn-label">Connections</p>
        <ul className="am-conns">
          {conns.map((c) => (
            <li key={c.verb + c.id}>
              <Icon id={c.id} box={24} />
              <span className="am-conn-text">
                <span className="am-conn-verb">{c.verb} </span>
                {NODE[c.id].name}
              </span>
              <span className="am-rate">{c.rate}/min</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/** The old panel fades out on top (100 ms) while the new one waits 100 ms, then fades and rises in. */
function Panel({ sel, phase, onApprove }: { sel: NodeId; phase: Phase; onApprove: () => void }) {
  const [cur, setCur] = useState({ id: sel, n: 0 });
  const [ghost, setGhost] = useState<{ id: NodeId; phase: Phase; n: number } | null>(null);
  if (cur.id !== sel) {
    setGhost({ id: cur.id, phase, n: cur.n });
    setCur({ id: sel, n: cur.n + 1 });
  }
  return (
    <aside className="am-panel" aria-live="polite">
      <div key={cur.n} className="am-panel-in" data-enter={cur.n > 0 ? "" : undefined}>
        <PanelBody id={cur.id} phase={phase} enter={cur.n > 0} onApprove={onApprove} />
      </div>
      {ghost && (
        <div
          key={`g${ghost.n}`}
          className="am-panel-ghost"
          aria-hidden
          onAnimationEnd={(e) => e.target === e.currentTarget && setGhost(null)}
        >
          <PanelBody id={ghost.id} phase={ghost.phase} enter={false} />
        </div>
      )}
    </aside>
  );
}

// ---------- graph ----------

/** Edges lit by a selection, with the hop delay of each. */
function litEdges(sel: NodeId): Map<string, number> {
  const lit = new Map<string, number>();
  const n = NODE[sel];
  if (n.col === 0) {
    for (const e of EDGES) if (e.from === sel) lit.set(e.id, 0);
  } else if (n.col === 1) {
    for (const e of EDGES) {
      if (e.to === sel) lit.set(e.id, 0);
      if (e.from === sel) lit.set(e.id, HOP_DELAY);
    }
  } else {
    for (const e of EDGES) {
      if (e.to !== sel) continue;
      lit.set(e.id, HOP_DELAY);
      for (const up of EDGES) if (up.to === e.from) lit.set(up.id, 0);
    }
  }
  return lit;
}

const ORDER: NodeId[][] = COLUMNS.map((c) => c.ids);

function MapCard({ onLoop }: { onLoop: () => void }) {
  const [sel, setSel] = useState<NodeId>("lead");
  const [phase, setPhase] = useState<Phase>("pre");
  const [selN, setSelN] = useState(0);
  const [paths, setPaths] = useState<Record<string, string> | null>(null);

  const t0 = useRef<number | null>(null);
  const selAt = useRef<number | null>(null);
  const touring = useRef(true);
  const step = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Partial<Record<NodeId, HTMLButtonElement | null>>>({});
  const trackRefs = useRef<Record<string, SVGPathElement | null>>({});
  const onLoopRef = useRef(onLoop);
  onLoopRef.current = onLoop;

  const choose = useCallback((id: NodeId, at: number) => {
    selAt.current = at;
    setSel(id);
    setSelN((n) => n + 1);
  }, []);

  // Edge geometry from the laid-out nodes (local, unzoomed px): source right edge → target left edge, centre to centre.
  const measure = useCallback(() => {
    const g = groupRef.current;
    if (!g) return;
    const gr = g.getBoundingClientRect();
    const k = gr.width / g.offsetWidth || 1;
    const box = (id: NodeId) => {
      const r = nodeRefs.current[id]!.getBoundingClientRect();
      return { l: (r.left - gr.left) / k, r: (r.right - gr.left) / k, cy: ((r.top + r.bottom) / 2 - gr.top) / k };
    };
    const next: Record<string, string> = {};
    for (const e of EDGES) {
      const a = box(e.from);
      const b = box(e.to);
      const mx = (a.r + b.l) / 2;
      next[e.id] = `M ${a.r} ${a.cy} C ${mx} ${a.cy} ${mx} ${b.cy} ${b.l} ${b.cy}`;
    }
    setPaths((prev) => (prev && EDGES.every((e) => prev[e.id] === next[e.id]) ? prev : next));
  }, []);

  useLayoutEffect(measure, [measure, sel, phase]);
  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    for (const el of Object.values(nodeRefs.current)) if (el) ro.observe(el);
    document.fonts?.ready.then(() => measure());
    return () => ro.disconnect();
  }, [measure]);

  // One loop drives the tour, the highlight draw and the dots.
  useEffect(() => {
    const reduce = reducedMotion();
    let raf = requestAnimationFrame(function tick() {
      const now = performance.now();
      if (t0.current === null) t0.current = now;
      if (selAt.current === null) selAt.current = now;
      const T = (now - t0.current) / 1000;

      if (touring.current) {
        if (T >= TOUR.loop) {
          flushSync(() => onLoopRef.current());
          return;
        }
        if (step.current === 0 && T >= TOUR.scout) {
          step.current = 1;
          flushSync(() => choose("scout", now));
        } else if (step.current === 1 && T >= TOUR.needs) {
          step.current = 2;
          flushSync(() => {
            setPhase("needs");
            choose("buyer", now);
          });
        } else if (step.current === 2 && T >= TOUR.approve) {
          step.current = 3;
          flushSync(() => setPhase("approved"));
        }
      }

      const svg = svgRef.current;
      if (svg) {
        // The reference starts a draw one frame after the render that lit the edge.
        const since = (now - selAt.current) / 1000 - DRAW_LAG;
        svg.querySelectorAll<SVGPathElement>("path[data-hl]").forEach((p) => {
          const v = reduce ? 1 : drawAt(since - Number(p.dataset.delay));
          p.style.visibility = v > 0 ? "visible" : "hidden";
          p.setAttribute("stroke-dasharray", `${v} 1`);
        });
        svg.querySelectorAll<SVGCircleElement>("circle[data-dot]").forEach((c) => {
          const track = trackRefs.current[c.dataset.edge!];
          const n = Number(c.dataset.n);
          const dur = Number(c.dataset.dur);
          const begin = (Number(c.dataset.k) * dur) / n;
          // The dots' clock starts a frame after the graph mounts, like an SVG timeline that begins on insertion.
          const Td = T - DRAW_LAG;
          if (!track || reduce || Td < begin) {
            c.setAttribute("opacity", "0");
            return;
          }
          const ph = ((Td - begin) % dur) / dur;
          const pt = track.getPointAtLength(track.getTotalLength() * easeInOut(ph));
          c.setAttribute("cx", pt.x.toFixed(2));
          c.setAttribute("cy", pt.y.toFixed(2));
          c.setAttribute("opacity", (ph < 0.15 ? ph / 0.15 : ph > 0.85 ? (1 - ph) / 0.15 : 1).toFixed(3));
        });
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [choose]);

  const takeOver = () => {
    touring.current = false;
  };
  const pick = (id: NodeId) => {
    takeOver();
    if (id !== sel) choose(id, performance.now());
  };
  const approve = () => {
    takeOver();
    setPhase("approved");
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const col = ORDER.findIndex((ids) => ids.includes(sel));
    const row = ORDER[col].indexOf(sel);
    let next: NodeId | null = null;
    if (e.key === "ArrowDown") next = ORDER[col][Math.min(row + 1, ORDER[col].length - 1)];
    else if (e.key === "ArrowUp") next = ORDER[col][Math.max(row - 1, 0)];
    else if (e.key === "ArrowRight" && col < 2) next = ORDER[col + 1][Math.min(row, ORDER[col + 1].length - 1)];
    else if (e.key === "ArrowLeft" && col > 0) next = ORDER[col - 1][Math.min(row, ORDER[col - 1].length - 1)];
    else if (e.key === "Home") next = ORDER[col][0];
    else if (e.key === "End") next = ORDER[col][ORDER[col].length - 1];
    if (!next) return;
    e.preventDefault();
    pick(next);
    nodeRefs.current[next]?.focus();
  };

  const lit = litEdges(sel);
  const total = totalRate(phase);
  const agents = COLUMNS[1].ids.length;
  const tools = COLUMNS[2].ids.length;

  return (
    <section className="am-card" aria-label="Agent network">
      <div className="am-head">
        <span className="am-box am-box-40">
          <Network strokeWidth={1.6} aria-hidden />
        </span>
        <div className="am-head-text">
          <h3 className="am-title">Agent network</h3>
          <p className="am-sub">
            Harbor St. café · {agents + 1} agents · {tools} tools
          </p>
        </div>
        <p className="am-total">{total} calls per minute</p>
      </div>

      <div className="am-body">
        <div ref={groupRef} role="group" aria-label="Agents and tools" className="am-graph" onKeyDown={onKey}>
          <svg ref={svgRef} className="am-edges" aria-hidden>
            {paths &&
              EDGES.map((e) => {
                const delay = lit.get(e.id);
                const { count, dur } = dotsFor(rateOf(e.id, phase));
                return (
                  <g key={e.id}>
                    <path
                      ref={(el) => {
                        trackRefs.current[e.id] = el;
                      }}
                      className="am-track"
                      d={paths[e.id]}
                    />
                    {delay !== undefined && (
                      <path
                        key={`hl-${selN}`}
                        data-hl=""
                        data-delay={delay}
                        className="am-hl"
                        d={paths[e.id]}
                        pathLength={1}
                        strokeDasharray="0 1"
                        style={{ visibility: "hidden" }}
                      />
                    )}
                    {delay !== undefined &&
                      Array.from({ length: count }, (_, k) => (
                        <circle
                          key={`d-${count}-${k}`}
                          data-dot=""
                          data-edge={e.id}
                          data-k={k}
                          data-n={count}
                          data-dur={dur}
                          className="am-dot"
                          r={2.5}
                          opacity={0}
                        />
                      ))}
                  </g>
                );
              })}
          </svg>

          {COLUMNS.map((col) => (
            <div key={col.label} className="am-col">
              <p className="am-col-label">
                {col.label}
                <span className="am-count">{col.ids.length}</span>
              </p>
              <ul className="am-stack" aria-label={col.label}>
                {col.ids.map((id) => {
                  const n = NODE[id];
                  const status = statusOf(id, phase);
                  const word = status === "needs" ? ", needs you" : status === "working" ? ", working" : "";
                  return (
                    <li key={id}>
                      <button
                        ref={(el) => {
                          nodeRefs.current[id] = el;
                        }}
                        type="button"
                        className="am-node"
                        aria-pressed={sel === id}
                        aria-label={`${n.name}, ${n.kind}, ${n.role}${word}`}
                        tabIndex={sel === id ? 0 : -1}
                        onClick={() => pick(id)}
                      >
                        <span className="am-box am-box-32" style={{ color: n.color }}>
                          <n.icon strokeWidth={1.9} aria-hidden />
                          {id === "buyer" && <WarnDot on={status === "needs"} />}
                        </span>
                        <span className="am-node-text">
                          <span className="am-name">{n.name}</span>
                          <span className="am-role">{n.role}</span>
                        </span>
                        {status === "working" && (
                          <span style={{ color: "var(--am-fg)" }}>
                            <Loader size={14} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Panel sel={sel} phase={phase} onApprove={approve} />
    </section>
  );
}

/**
 * Plays the tour on mount and loops it every 12 s by remounting the card.
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts it too (used by the capture).
 */
export default function AgentMap() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="am-root" style={EASES}>
      <div className="am-zoom">
        <MapCard key={run} onLoop={() => setRun((r) => r + 1)} />
        <p className="am-caption">{CAPTION}</p>
      </div>
    </div>
  );
}
