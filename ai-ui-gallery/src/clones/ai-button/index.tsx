import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import "./ai-button.css";

/*
 * AI action button, motion-faithful to Wensity "AI Button" (Gradient cell). Click runs a fake async action:
 * idle sparkle "Write with AI" -> stop square + shimmering "Reading the page" (2.2 s) -> "Writing" (2.0 s)
 * -> check + "Done" (1.85 s) -> idle. Each swap blurs the old content out and the new one in (~280 ms);
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
  reading: ["writing", 2212],
  writing: ["done", 1988],
  done: ["idle", 1844],
};
const WIDTH_DELAY = 300;

function Icon({ phase }: { phase: Phase }) {
  if (phase === "idle") return <Sparkles className="aib-spark" strokeWidth={2.2} fill="currentColor" />;
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
  const timers = useRef<number[]>([]);
  const cur = useRef<Phase>("idle");
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

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
    timers.current.push(window.setTimeout(() => setWidth(refs.current[p]?.getBoundingClientRect().width ?? 0), WIDTH_DELAY));
    timers.current.push(window.setTimeout(() => setPrev(null), 330));
    const n = NEXT[p];
    if (n) timers.current.push(window.setTimeout(() => go(n[0]), n[1]));
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
