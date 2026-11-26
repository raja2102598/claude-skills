import { useEffect, useRef, useState } from "react";
import { Pause, RotateCcw } from "lucide-react";
import clsx from "clsx";
import "./reasoning-effort.css";

/*
 * Reasoning effort control, pixel-faithful to assistant-ui "Reasoning effort" (MIT).
 * Low/Medium/High/Max rescales the cap (2k / 8k / 24k / 64k) while the used share stays put.
 * Replay (corner button) plays the budget fill in five steps, 14/29/41/52/58 %, one every ~900 ms;
 * the bar's width has a 500 ms ease. It plays once on mount.
 */
type Effort = "Low" | "Medium" | "High" | "Max";
const EFFORTS: Effort[] = ["Low", "Medium", "High", "Max"];
const CAP: Record<Effort, number> = { Low: 2000, Medium: 8000, High: 24000, Max: 64000 };
const STEPS = [14, 29, 41, 52, 58];
const STEP_MS = 900;
type StateName = "Default" | "Not started" | "Budget spent" | "Read only";
const STATES: Record<StateName, { effort: Effort; pct: number; readOnly?: boolean }> = {
  Default: { effort: "High", pct: 58 },
  "Not started": { effort: "Medium", pct: 0 },
  "Budget spent": { effort: "Low", pct: 100 },
  "Read only": { effort: "Max", pct: 64.55, readOnly: true },
};
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export default function ReasoningEffort() {
  const [state, setState] = useState<StateName>("Default");
  const [effort, setEffort] = useState<Effort>("High");
  const [pct, setPct] = useState(14);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number[]>([]);
  const readOnly = !!STATES[state].readOnly;

  const stop = () => { timer.current.forEach(clearTimeout); timer.current = []; setPlaying(false); };

  const pick = (s: StateName) => {
    stop();
    setState(s);
    setEffort(STATES[s].effort);
    setPct(STATES[s].pct);
  };
  const replay = () => {
    stop();
    if (state !== "Default") return;
    setPlaying(true);
    setPct(STEPS[0]);
    STEPS.slice(1).forEach((v, i) => {
      timer.current.push(window.setTimeout(() => setPct(v), (i + 1) * STEP_MS));
    });
    timer.current.push(window.setTimeout(() => setPlaying(false), (STEPS.length - 1) * STEP_MS));
  };
  useEffect(() => { replay(); return stop; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = () => (playing ? stop() : replay());

  const cap = CAP[effort];
  const used = (pct / 100) * cap;
  return (
    <div className="re-root">
      <div className="re-stage" style={{ width: 784, height: 360 }}>
        <div className="re-inner">
          <button type="button" className="re-replay" aria-label={playing ? "Pause animation" : "Replay animation"} onClick={toggle}>
            <Pause className={clsx(!playing && "off")} aria-hidden />
            <RotateCcw className={clsx(playing && "off")} aria-hidden />
          </button>
          <div className="re-widget" data-slot="reasoning-effort">
            <div className="re-head">
              <span className="re-title">Thinking</span>
              <span className="re-count">{fmt(used)} / {fmt(cap)}</span>
            </div>
            <div className="re-seg">
              {EFFORTS.map((e) =>
                readOnly ? (
                  <span key={e} className={clsx("re-opt", e === effort && "on")} aria-current={e === effort || undefined}>{e}</span>
                ) : (
                  <button key={e} type="button" aria-pressed={e === effort} className={clsx("re-opt", e === effort && "on")} onClick={() => setEffort(e)}>{e}</button>
                ),
              )}
            </div>
            <span role="progressbar" aria-label="Thinking budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
              aria-valuetext={`${fmt(used)} of ${fmt(cap)}`} className="re-bar">
              <span className="re-fill" style={{ width: `${pct}%` }} />
            </span>
          </div>
        </div>
        <div className="re-tabs" role="radiogroup">
        {(Object.keys(STATES) as StateName[]).map((s) => (
          <button key={s} type="button" role="radio" aria-checked={s === state} className={clsx("re-tab", s === state && "on")} onClick={() => pick(s)}>{s}</button>
        ))}
        </div>
      </div>
    </div>
  );
}
