import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import clsx from "clsx";
import "./avatar.css";

type State = "idle" | "listening" | "thinking" | "writing" | "done" | "error";
const STATES: { id: State; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "listening", label: "Listening" },
  { id: "thinking", label: "Thinking" },
  { id: "writing", label: "Writing" },
  { id: "done", label: "Done" },
  { id: "error", label: "Error" },
];
const LINE: Record<State, string> = {
  idle: "Pip is ready to help",
  listening: "Listening",
  thinking: "Thinking",
  writing: "Writing a reply",
  done: "Reply ready, 188 words",
  error: "Could not finish the reply",
};
/* The tour measured from the reference trace: durations in ms, looping (20.7 s). */
const TOUR: { s: State; ms: number }[] = [
  { s: "thinking", ms: 2614 },
  { s: "writing", ms: 3600 },
  { s: "done", ms: 2315 },
  { s: "idle", ms: 1816 },
  { s: "thinking", ms: 1717 },
  { s: "error", ms: 1960 },
  { s: "idle", ms: 4050 },
  { s: "listening", ms: 2200 },
];
const TOUR_MS = TOUR.reduce((a, b) => a + b.ms, 0);
const BLINKS = [2.9, 7.78, 10.15, 14.45, 17.43];
const START_OFFSET = 650; // the tour is already 0.6 s into its first "thinking" at the first captured frame

function locate(t: number) {
  let x = ((t % TOUR_MS) + TOUR_MS) % TOUR_MS;
  for (let i = 0; i < TOUR.length; i++) {
    if (x < TOUR[i].ms) return { i, s: TOUR[i].s, tin: x, start: t - x };
    x -= TOUR[i].ms;
  }
  return { i: 0, s: TOUR[0].s, tin: 0, start: t };
}

/* Shared clock: the pre-js of a capture can set window.__pipT0 to restart the tour. */
declare global {
  interface Window {
    __pipT0?: number;
  }
}
const T0 = () => window.__pipT0 ?? 0;
let segStartAbs = 0; /* performance time when the current state began */

interface Pose {
  lean: number; // deg
  dx: number;
  dy: number;
  eyeS: number; // eye scale
  lookX: number;
  lookY: number;
  happy: number;
  worry: number;
  cx: number;
  cy: number;
  cr: number;
  cop: number;
  line: number;
}
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

const BODY = "M50 34H70A26 26 0 0 1 96 60V70A26 26 0 0 1 70 96H50A26 26 0 0 1 24 70V60A26 26 0 0 1 50 34Z";

function Pip({ size, state, mini = false }: { size: number; state: State; mini?: boolean }) {
  const root = useRef<SVGSVGElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const pose = useRef<Pose>({ lean: 0, dx: 0, dy: 0, eyeS: 1, lookX: 0, lookY: 0, happy: 0, worry: 0, cx: 94, cy: 40, cr: 5, cop: 1, line: 0 });
  const enter = useRef({ s: "" as string, at: 0 });

  useLayoutEffect(() => {
    const svg = root.current!;
    const q = (n: string) => svg.querySelector<SVGElement>(`[data-n="${n}"]`)!;
    const el = {
      body: q("body"), face: q("face"), eyeL: q("eyeL"), eyeR: q("eyeR"), happyL: q("happyL"), happyR: q("happyR"),
      browL: q("browL"), browR: q("browR"), cheeks: q("cheeks"), ground: q("ground"),
      front: q("front"), back: q("back"), line: q("line"), spark1: q("spark1"), spark2: q("spark2"), ring: q("ring"),
    };
    let raf = 0;
    let last = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now - T0() + START_OFFSET;
      const s = stateRef.current;
      /* where in the current state are we: the tour owns the clock, a click restarts the state */
      void enter;
      const tin = Math.max(0, (now - segStartAbs) / 1000);
      const P = pose.current;
      const k = (tau: number) => 1 - Math.exp(-dt / tau);
      const sec = t / 1000;
      const sref = sec - 0.9; /* seconds on the reference clock (its frame 0 = 0 s) */

      let tgt = { lean: 0, dx: 0, dy: 0, eyeS: 1, lookX: Math.sin(sec * 0.9) * 2.2, lookY: Math.sin(sec * 0.55 + 1) * 0.8, happy: 0, worry: 0, cx: 95.3 + Math.sin(sec * 1.7) * 0.4, cy: 27.2 + Math.sin(sec * 2.1) * 0.6, cr: 5, cop: 1, line: 0 };
      let orbitFront = false;
      if (s === "listening") {
        tgt = { ...tgt, lean: -5, dx: 4, dy: 1, eyeS: 1.18, lookX: 3, lookY: 0, cx: 91.3, cy: 20.9, cr: 5 * (1.05 + 0.11 * Math.cos(((tin - 0.4) / 0.95) * Math.PI * 2)) };
      } else if (s === "thinking") {
        /* measured on the reference: period 2.3 s, rightmost point 0.28 s after entry, centre (59.6, 26.4), rx 47.4, ry 9.4 */
        const a = Math.max(0, ((tin + 0.05 - 0.28) / 2.3) * Math.PI * 2);
        const z = Math.sin(a);
        tgt = { ...tgt, lean: 3, lookX: -3.2, lookY: -3, cx: 59.6 + 47.4 * Math.cos(a), cy: 24.8 + 9.4 * z, cr: 5 * (0.85 + 0.25 * z) };
        orbitFront = z > 0;
      } else if (s === "writing") {
        /* measured: sweep starts 0.15 s after entry, 1.2 s across (x 34.9 to 84.3), 0.4 s arced return, period 1.7 s */
        const u = tin - 0.15 + 0.05;
        const ph = u < 0 ? 0.97 : (u % 1.7) / 1.7;
        let cx = 34.9, cy = 119, line = 0, frac = 0;
        if (ph < 0.706) { frac = ease(ph / 0.706); cx = 34.9 + 49.4 * frac; line = 1; }
        else if (ph < 0.747) { cx = 84.3; frac = 1; line = 1; }
        else if (ph < 0.92) { const r = (ph - 0.747) / 0.173; frac = 1 - r; cx = 84.3 - 49.4 * r; cy = 119 - 6.3 * Math.sin(Math.PI * r); }
        tgt = { ...tgt, lookX: -3.5 + 7 * frac, lookY: 3.6, lean: 0, dy: 1, cx, cy, cr: 4.4, line };
      } else if (s === "done") {
        tgt = { ...tgt, happy: 1, eyeS: 1, lookX: 0, lookY: 0, dy: -2, cx: 95.3, cy: 24, cr: 4.5, cop: 0 };
      } else if (s === "error") {
        const te = Math.max(0, tin - 0.04);
        const sh = Math.exp(-te * 5) * Math.sin(te * 42) * 3.2;
        tgt = { ...tgt, worry: 1, dx: sh, lookX: 0, lookY: 1, eyeS: 0.92, cx: 96, cy: 46, cr: 4, cop: 0.55, lean: 0 };
      }
      if (reduce) { P.lean = tgt.lean; }
      const spring = (cur: number, to: number, tau: number) => cur + (to - cur) * k(tau);
      P.lean = spring(P.lean, tgt.lean, 0.1);
      P.dx = s === "error" ? tgt.dx : spring(P.dx, tgt.dx, 0.1);
      P.dy = spring(P.dy, tgt.dy, s === "done" ? 0.03 : 0.1);
      P.eyeS = spring(P.eyeS, tgt.eyeS, 0.08);
      P.lookX = spring(P.lookX, tgt.lookX, 0.09);
      P.lookY = spring(P.lookY, tgt.lookY, 0.09);
      P.happy = spring(P.happy, tgt.happy, 0.06);
      P.worry = spring(P.worry, tgt.worry, 0.1);
      const ctau = s === "thinking" ? 0.06 : s === "writing" ? 0.05 : 0.14;
      P.cx = spring(P.cx, tgt.cx, ctau);
      P.cy = spring(P.cy, tgt.cy, ctau);
      P.cr = spring(P.cr, tgt.cr, 0.1);
      P.cop = spring(P.cop, tgt.cop, 0.12);
      P.line = spring(P.line, tgt.line, 0.05);

      /* breathing and the blink (every 4.2 s, 140 ms) */
      const breath = Math.sin(sec * 1.6);
      const bob = 1.9 * Math.cos(1.96 * (sref - 14.95)); /* measured: period 3.2 s, +-2.4 px */
      /* blink times measured on the reference (s, loop 20.715): unevenly spaced, ~4.8 s mean, 150 ms each */
      const lp = ((sref % 20.715) + 20.715) % 20.715;
      let blink = 0;
      for (const bt of BLINKS) {
        const d = lp - (bt - 0.075);
        if (d >= 0 && d < 0.15) blink = Math.max(blink, Math.sin((d / 0.15) * Math.PI));
      }
      const sy = 1 + breath * 0.012;
      el.body.setAttribute(
        "transform",
        `translate(${P.dx.toFixed(2)} ${(P.dy + bob - 4).toFixed(2)}) translate(60 96) rotate(${P.lean.toFixed(2)}) scale(${(2 - sy).toFixed(4)} ${sy.toFixed(4)}) translate(-60 -96)`,
      );
      const open = P.eyeS * (1 - blink * 0.92) * (1 - P.happy) * (1 - P.worry * 0.0);
      const ex = P.lookX.toFixed(2);
      const ey = P.lookY.toFixed(2);
      const eyeT = (x: number) => `translate(${x} 62) translate(${ex} ${ey}) scale(${(1 + (P.eyeS - 1) * 0.5).toFixed(3)} ${Math.max(0.05, open).toFixed(3)})`;
      el.eyeL.setAttribute("transform", eyeT(45));
      el.eyeR.setAttribute("transform", eyeT(75));
      el.eyeL.setAttribute("opacity", String(Math.max(0, 1 - P.happy * 1.6)));
      el.eyeR.setAttribute("opacity", String(Math.max(0, 1 - P.happy * 1.6)));
      const hp = Math.max(0, P.happy * 1.4 - 0.4);
      el.happyL.setAttribute("transform", `translate(${45 + P.lookX * 0.3} 63) scale(1 ${Math.max(0.05, hp).toFixed(3)})`);
      el.happyR.setAttribute("transform", `translate(${75 + P.lookX * 0.3} 63) scale(1 ${Math.max(0.05, hp).toFixed(3)})`);
      el.happyL.setAttribute("opacity", String(hp));
      el.happyR.setAttribute("opacity", String(hp));
      el.browL.setAttribute("transform", `translate(45 50) rotate(${(-14 * P.worry).toFixed(2)}) translate(0 ${(-4 * (1 - P.worry)).toFixed(2)})`);
      el.browR.setAttribute("transform", `translate(75 50) rotate(${(14 * P.worry).toFixed(2)}) translate(0 ${(-4 * (1 - P.worry)).toFixed(2)})`);
      el.browL.setAttribute("opacity", P.worry.toFixed(3));
      el.browR.setAttribute("opacity", P.worry.toFixed(3));
      el.cheeks.setAttribute("opacity", (0.55 + P.happy * 0.45 - P.worry * 0.3).toFixed(3));
      /* body-follow for the face */
      const fx = (P.lookX * 0.35).toFixed(2);
      el.face.setAttribute("transform", `translate(${fx} ${(P.lookY * 0.25).toFixed(2)})`);
      el.ground.setAttribute("transform", `translate(60 110) scale(${(1 - (P.dy + bob) * 0.012).toFixed(3)} 1)`);
      el.ground.setAttribute("opacity", String(Math.max(0.35, 1 + (P.dy + bob) * 0.04)));

      /* companion spark: behind the body on the far side of its orbit */
      const cArr = [el.front, el.back];
      const useFront = orbitFront || s !== "thinking";
      const tgtEl = useFront ? el.front : el.back;
      const other = useFront ? el.back : el.front;
      tgtEl.setAttribute("transform", `translate(${P.cx.toFixed(2)} ${P.cy.toFixed(2)}) scale(${(P.cr / 5).toFixed(3)})`);
      tgtEl.setAttribute("opacity", P.cop.toFixed(3));
      other.setAttribute("opacity", "0");
      void cArr;
      const ringPhase = 1;
      el.ring.setAttribute("transform", `translate(${P.cx.toFixed(2)} ${P.cy.toFixed(2)}) scale(${(1 + ringPhase * 2.2).toFixed(3)})`);
      el.ring.setAttribute("opacity", "0");
      /* writing line: dashes revealed up to the spark */
      const lx = P.cx;
      el.line.setAttribute("x2", String(Math.max(36, lx - 4).toFixed(2)));
      el.line.setAttribute("opacity", Math.max(0, P.line * (s === "writing" ? 0.9 : 0)).toFixed(3));
      /* done sparkles: a pop then a slow twinkle */
      const pop = s === "done" ? ease(tin / 0.3) : 0;
      const tw = 0.9 + 0.1 * Math.sin(sec * 5);
      el.spark1.setAttribute("transform", `translate(95.3 24) rotate(${(pop * 20).toFixed(1)}) scale(${(pop * 0.85 * tw).toFixed(3)})`);
      el.spark2.setAttribute("transform", `translate(107 39.7) rotate(${(-pop * 20).toFixed(1)}) scale(${(pop * 0.35).toFixed(3)})`);
      el.spark1.setAttribute("opacity", pop > 0.01 ? "1" : "0");
      el.spark2.setAttribute("opacity", pop > 0.01 ? "1" : "0");
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const star = "M0 -7C.9 -1.6 1.6 -.9 7 0C1.6 .9 .9 1.6 0 7C-.9 1.6 -1.6 .9 -7 0C-1.6 -.9 -.9 -1.6 0 -7Z";
  const vb = mini ? "18 14 88 88" : "2 6 116 116";
  return (
    <svg ref={root} viewBox={vb} width={size} height={size} role="img" aria-label={`Pip, ${state}`} focusable="false">
      <ellipse data-n="ground" cx="0" cy="0" rx="28" ry="3.2" fill="#e5dcc8" transform="translate(60 110)" />
      <g data-n="back" opacity="0"><path d={star} fill="#d9922b" /></g>
      <line data-n="line" x1="36" y1="114" x2="36" y2="114" stroke="#d9922b" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="9 5.5 4.5 5.5 12 5.5 6 5.5 10 5.5" opacity="0" />
      <g data-n="body">
        <rect x="14" y="62" width="12" height="16" rx="6" fill="#0f5c58" />
        <rect x="94" y="62" width="12" height="16" rx="6" fill="#0f5c58" />
        <path d={BODY} fill="#14746f" />
        <path d="M50 37H70A23 23 0 0 1 93 58C80 49 36 49 27 58A23 23 0 0 1 50 37Z" fill="#2c948d" opacity=".55" />
        <g data-n="face">
          <g data-n="cheeks" opacity=".55">
            <ellipse cx="36" cy="75" rx="5" ry="3" fill="#f08a6b" />
            <ellipse cx="84" cy="75" rx="5" ry="3" fill="#f08a6b" />
          </g>
          <g data-n="eyeL"><circle r="5.2" fill="#fffdf8" /><circle r="2" cx="1" cy="1" fill="#10302e" /></g>
          <g data-n="eyeR"><circle r="5.2" fill="#fffdf8" /><circle r="2" cx="1" cy="1" fill="#10302e" /></g>
          <g data-n="happyL" opacity="0"><path d="M-6 3Q0 -6 6 3" stroke="#fffdf8" strokeWidth="3.4" strokeLinecap="round" fill="none" /></g>
          <g data-n="happyR" opacity="0"><path d="M-6 3Q0 -6 6 3" stroke="#fffdf8" strokeWidth="3.4" strokeLinecap="round" fill="none" /></g>
          <g data-n="browL" opacity="0"><line x1="-7" y1="0" x2="6" y2="0" stroke="#fffdf8" strokeWidth="2.8" strokeLinecap="round" /></g>
          <g data-n="browR" opacity="0"><line x1="-6" y1="0" x2="7" y2="0" stroke="#fffdf8" strokeWidth="2.8" strokeLinecap="round" /></g>
          <path d="M55 82Q60 85.5 65 82" stroke="#fffdf8" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".8" />
        </g>
      </g>
      <circle data-n="ring" r="5" fill="none" stroke="#d9922b" strokeWidth=".9" opacity="0" />
      <g data-n="front" transform="translate(94 40)"><path d={star} fill="#d9922b" /></g>
      <g data-n="spark1" opacity="0"><path d={star} fill="#d9922b" /></g>
      <g data-n="spark2" opacity="0"><path d={star} fill="#d9922b" /></g>
    </svg>
  );
}

export default function AiAvatar() {
  const [state, setState] = useState<State>("thinking");
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);
  playingRef.current = playing;
  const seg = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 3, w: 60 });
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const pauseAt = useRef(0);

  /* the tour: a clock-driven state machine, advanced inside rAF so it follows the virtual clock too */
  useEffect(() => {
    let raf = 0;
    let lastIdx = -1;
    let base = 0;
    const loop = (now: number) => {
      if (playingRef.current) {
        const t = now - (window.__pipT0 ?? 0) + START_OFFSET - base;
        const loc = locate(t);
        const key = loc.i + Math.floor(t / TOUR_MS) * 100;
        if (key !== lastIdx) {
          lastIdx = key;
          setState(loc.s);
        }
        segStartAbs = (window.__pipT0 ?? 0) - START_OFFSET + loc.start + base;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  void pauseAt;

  useLayoutEffect(() => {
    const i = STATES.findIndex((s) => s.id === state);
    const b = btns.current[i];
    if (b) setPill({ x: b.offsetLeft, w: b.offsetWidth });
  }, [state]);

  const pick = (s: State) => {
    segStartAbs = performance.now();
    setPlaying(false);
    setState(s);
  };
  const live = state === "listening" || state === "thinking" || state === "writing";
  return (
    <div className="pip-card" role="group" aria-label="Pip mascot demo">
      <div className="pip-stage">
        <Pip size={148} state={state} />
      </div>
      <div className="pip-inline">
        <span className="pip-mini"><Pip size={24} state={state} mini /></span>
        <span className="pip-line" aria-live="polite">
          <span key={state} className="pip-label" data-live={live}>{LINE[state]}</span>
        </span>
      </div>
      <div className="pip-rule" />
      <div className="pip-controls">
        <div className="pip-seg" ref={seg} role="group" aria-label="Mascot state">
          <span className="pip-pill" style={{ width: pill.w, transform: `translateX(${pill.x}px)` }} />
          {STATES.map((s, i) => (
            <button key={s.id} ref={(el) => { btns.current[i] = el; }} type="button" aria-pressed={state === s.id} onClick={() => pick(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <button className="pip-pause" type="button" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
void clsx;
