import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import "./ai-button.css";

/*
 * AI action button, motion-faithful to Wensity "AI Button" (Gradient cell). Click runs a fake async action:
 * idle sparkle "Write with AI" -> stop square + shimmering "Reading the page" (2.2 s) -> "Writing" (2.0 s)
 * -> check + "Done" (1.8 s) -> idle. Each swap blurs the old content out (110 ms) and the new one in (180 ms);
 * the button width follows the new label ~300 ms later with a fast ease-out. Click while running = stop.
 */
type Phase = "idle" | "reading" | "writing" | "done";
const CONTENT: Record<Phase, { label: string }> = {
  idle: { label: "Write with AI" },
  reading: { label: "Reading the page" },
  writing: { label: "Writing" },
  done: { label: "Done" },
};
const NEXT: Partial<Record<Phase, [Phase, number]>> = {
  reading: ["writing", 2200],
  writing: ["done", 2000],
  done: ["idle", 1800],
};
// Delay from the label swap to the width change: the reference waits for the old label's exit (about 330 ms on the real
// clock, 313-471 ms measured under load). `?gap=0` removes it, matching the reference when its WAAPI exit is collapsed
// by the virtual clock (used for the compare capture only).
// rAF-based timer (setTimeout does not advance under the capture's virtual clock; rAF and performance.now do).
type Handle = { cancelled: boolean };
function after(ms: number, fn: () => void): Handle {
  const h: Handle = { cancelled: false };
  const t0 = performance.now();
  const tick = () => {
    if (h.cancelled) return;
    if (performance.now() - t0 >= ms) fn();
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return h;
}
const GAP = (() => { try { const g = new URLSearchParams(location.search).get("gap"); return g === null ? 330 : Number(g); } catch { return 330; } })();

function Icon({ phase }: { phase: Phase }) {
  if (phase === "idle")
    return (
      <svg className="aib-spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 4C10.7 8.6 12.4 10.3 17 11C12.4 11.7 10.7 13.4 10 18C9.3 13.4 7.6 11.7 3 11C7.6 10.3 9.3 8.6 10 4Z" />
        <path d="M19 2C19.3 3.7 20 4.4 21.7 4.7C20 5 19.3 5.7 19 7.4C18.7 5.7 18 5 16.3 4.7C18 4.4 18.7 3.7 19 2Z" opacity="0.8" />
        <circle cx="19.5" cy="18.5" r="1.2" opacity="0.6" />
      </svg>
    );
  if (phase === "done") return <Check strokeWidth={2.6} />;
  return <span className="aib-stop" />;
}
function Body({ phase }: { phase: Phase }) {
  const loading = phase === "reading" || phase === "writing";
  return (
    <>
      <span className="aib-icon"><Icon phase={phase} /></span>
      <span className={"aib-label" + (loading ? " aib-shimmer" : "")}>{CONTENT[phase].label}</span>
    </>
  );
}

export default function AiButton() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [prev, setPrev] = useState<{ phase: Phase; k: number } | null>(null);
  const [key, setKey] = useState(0);
  const [widths, setWidths] = useState<Record<Phase, number>>({ idle: 121, reading: 155, writing: 81, done: 67 });
  const [width, setWidth] = useState(121);
  const refs = useRef<Record<Phase, HTMLSpanElement | null>>({ idle: null, reading: null, writing: null, done: null });
  const timers = useRef<Handle[]>([]);
  const cur = useRef<Phase>("idle");
  const clear = () => { timers.current.forEach((h) => { h.cancelled = true; }); timers.current = []; };

  useLayoutEffect(() => {
    const measure = () => {
      const w = {} as Record<Phase, number>;
      (Object.keys(refs.current) as Phase[]).forEach((p) => { w[p] = Math.ceil(refs.current[p]?.getBoundingClientRect().width ?? 0); });
      setWidths(w);
      setWidth(w[cur.current]);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  const go = useCallback((p: Phase) => {
    clear();
    setPrev({ phase: cur.current, k: Date.now() });
    cur.current = p;
    setPhase(p);
    setKey((k) => k + 1);
    timers.current.push(after(GAP, () => setWidth(refs.current[p]?.getBoundingClientRect().width ?? 0)));
    timers.current.push(after(330, () => setPrev(null)));
    const n = NEXT[p];
    if (n) timers.current.push(after(n[1], () => go(n[0])));
  }, []);
  useEffect(() => clear, []);

  const onClick = () => go(cur.current === "idle" ? "reading" : "idle");
  const status = phase === "reading" || phase === "writing" ? "loading" : phase;
  void widths;

  return (
    <div className="aib-stage">
      <button type="button" className="aib-btn" data-status={status} onClick={onClick}
        aria-label={status === "loading" ? "Stop" : CONTENT[phase].label}>
        <span className="aib-sheen" aria-hidden="true" />
        <span className="aib-clip" style={{ width }}>
          {prev && <span key={"p" + prev.k} className="aib-layer aib-exit" aria-hidden="true"><Body phase={prev.phase} /></span>}
          <span key={"c" + key} className={"aib-layer" + (key ? " aib-enter" : "")}><Body phase={phase} /></span>
        </span>
        {(Object.keys(CONTENT) as Phase[]).map((p) => (
          <span key={p} ref={(el) => { refs.current[p] = el; }} className="aib-measure" aria-hidden="true"><Body phase={p} /></span>
        ))}
      </button>
    </div>
  );
}
