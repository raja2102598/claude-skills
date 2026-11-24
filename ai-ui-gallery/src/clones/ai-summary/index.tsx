import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Sparkles, Square } from "lucide-react";
import clsx from "clsx";
import { CURRENT, FOLLOW_UPS, H, INSIGHTS, PREVIOUS, W, px, smoothPath } from "./data";
import "./insight.css";

type Phase = "idle" | "thinking" | "streaming" | "done" | "stopped";

const THINK_MS = 820; // thinking line before the first chunk
const TICK_MS = 34; // one chunk per tick
const HOLD_MS = 3600; // after an answer, before autoplay moves on
const IDLE_MS = 1400; // collapsed, before autoplay explains again

const CUR_PATH = smoothPath(CURRENT);
const PREV_PATH = smoothPath(PREVIOUS);

export default function AiSummary() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [id, setId] = useState("explain");
  const [x, setX] = useState(0);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const insight = INSIGHTS[id];
  const total = insight.chunks.length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return setInView(true);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const start = useCallback((next: string) => {
    setId(next);
    setX(0);
    setOpen(true);
    setPhase("thinking");
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    setPhase("idle");
  }, []);

  // thinking -> streaming
  useEffect(() => {
    if (phase !== "thinking") return;
    const t = setTimeout(() => setPhase("streaming"), THINK_MS);
    return () => clearTimeout(t);
  }, [phase, id]);
  // one chunk per tick
  useEffect(() => {
    if (phase !== "streaming") return;
    const t = setTimeout(() => {
      if (x + 1 >= total) setPhase("done");
      setX(x + 1);
    }, TICK_MS);
    return () => clearTimeout(t);
  }, [phase, x, total]);

  // autoplay: explain, walk the follow-ups, hide, repeat
  useEffect(() => {
    if (manual || !inView) return;
    let fn: (() => void) | undefined;
    let ms = HOLD_MS;
    if (!open && phase === "idle") {
      fn = () => start("explain");
      ms = IDLE_MS;
    } else if (open && phase === "done") {
      const order = ["explain", ...FOLLOW_UPS.map((f) => f.id)];
      const next = order[order.indexOf(id) + 1];
      fn = next ? () => start(next) : hide;
    }
    if (!fn) return;
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
  }, [manual, inView, open, phase, id, start, hide]);

  const revealed = phase === "idle" || phase === "thinking" ? 0 : Math.min(x, total);
  const visible = insight.chunks.slice(0, revealed);
  const lastM = visible.reduce((a, c) => (c.m !== undefined ? c.m : a), -1);
  const active = phase === "streaming" ? lastM : -1;
  const fullText = useMemo(() => insight.chunks.map((c) => c.t).join(""), [insight]);
  const max = Math.max(...insight.drivers.map((d) => d.value));

  const onMain = () => {
    setManual(true);
    if (phase === "thinking" || phase === "streaming") setPhase("stopped");
    else if (!open) start("explain");
    else hide();
  };
  const label = !open ? "Explain" : phase === "thinking" || phase === "streaming" ? "Stop" : "Hide";

  return (
    <div className="aic-stage">
      <section ref={rootRef} className="aic" aria-label="Weekly sales, Oct 20 to 26">
        <div className="aic-head">
          <div className="aic-title-row">
            <h3 className="aic-title">Weekly sales</h3>
            <span className="aic-period">Oct 20 to 26</span>
          </div>
          <button className="aic-btn" onClick={onMain} aria-expanded={open} aria-controls="aic-panel">
            <PhaseLabel label={label} />
          </button>
        </div>
        <div className="aic-value-row">
          <span className="aic-value">$318.4k</span>
          <span className="aic-delta">−5.2%</span>
          <span className="aic-compare">vs last week</span>
          <span className="aic-legend" aria-hidden>
            <span className="aic-legend-item"><i className="aic-sw-cur" />This week</span>
            <span className="aic-legend-item"><i className="aic-sw-prev" />Last week</span>
          </span>
        </div>

        <div className="aic-chart" role="img" aria-label="Weekly sales, Monday to Sunday, this week against last week">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
            <line className="aic-baseline" x1="0" x2={W} y1={H - 0.5} y2={H - 0.5} />
            <path className="aic-line-prev" d={PREV_PATH} />
            <path className="aic-line-cur" d={CUR_PATH} />
            {insight.drivers.map((d, i) => (
              <line key={`g${id}${i}`} className="aic-guide" x1={px(d.point)} x2={px(d.point)} y1={20} y2={CURRENT[d.point]} data-state={annState(i, open, revealed, lastM, active)} />
            ))}
          </svg>
          {insight.drivers.map((d, i) => {
            const st = annState(i, open, revealed, lastM, active);
            return (
              <span key={`a${id}${i}`} aria-hidden>
                <span className="aic-dot" data-state={st} style={{ left: px(d.point), top: CURRENT[d.point] }} />
                <span className="aic-badge" data-state={st} style={{ left: px(d.point), top: 10 }}>{i + 1}</span>
              </span>
            );
          })}
        </div>
        <div className="aic-axis" aria-hidden><span>Mon, Oct 20</span><span>Sun, Oct 26</span></div>

        <div id="aic-panel" className="aic-clip" data-open={open}>
          <div className="aic-clip-in">
            <div className="aic-panel">
              <div className="aic-textbox">
                <p className="aic-ghost" aria-hidden>{fullText}</p>
                <div className="aic-layer">
                  {phase === "thinking" && (
                    <div className="aic-thinking" key={`th${id}`}>
                      <Sparkles className="aic-spark" aria-hidden />
                      <span>Reading orders and pickups</span>
                    </div>
                  )}
                  {revealed > 0 && (
                    <p className="aic-text" key={`tx${id}`}>
                      {visible.map((c, i) =>
                        c.m !== undefined ? (
                          <span key={i} className="aic-mention" data-active={active === c.m || undefined}>
                            <span className="aic-chunk">{c.t}</span>
                          </span>
                        ) : (
                          <span key={i} className="aic-chunk">{c.t}</span>
                        ),
                      )}
                      {phase === "stopped" && <span className="aic-stopped"> Stopped.</span>}
                    </p>
                  )}
                  {phase === "stopped" && revealed === 0 && <p className="aic-text aic-stopped">Stopped before the answer started.</p>}
                </div>
              </div>

              <ol className="aic-drivers" aria-label="Top drivers">
                {insight.drivers.map((d, i) => {
                  const shown = revealed > 0 && i <= lastM;
                  return (
                    <li key={`d${id}${i}`} className="aic-driver" data-shown={shown || undefined} data-active={i === active || undefined}>
                      <span className="aic-rank" aria-hidden>{i + 1}</span>
                      <span className="aic-driver-body">
                        <span className="aic-skel" aria-hidden><i style={{ width: [62, 48, 54][i] + "%" }} /></span>
                        <span className="aic-driver-label">{d.label}</span>
                      </span>
                      <span className="aic-bar" aria-hidden><i data-tone={d.tone} style={{ width: shown ? `${(d.value / max) * 100}%` : "0%" }} /></span>
                      <span className="aic-driver-delta" data-tone={d.tone}>{d.delta}</span>
                    </li>
                  );
                })}
              </ol>

              <div className="aic-chips" role="group" aria-label="Follow-up questions">
                {FOLLOW_UPS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="aic-chip"
                    aria-pressed={id === f.id}
                    disabled={phase === "thinking" || phase === "streaming"}
                    onClick={() => { setManual(true); start(f.id); }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="aic-footer">
                <span className="aic-meta"><Square size={12} fill="currentColor" strokeWidth={0} style={{ color: "#c8873a", borderRadius: 3 }} />{insight.source}</span>
                <span className="aic-meta"><Sparkles size={14} style={{ color: "#1f5f5b" }} />Atlas Mini</span>
              </div>
            </div>
          </div>
        </div>
        <span className="aic-sr" aria-live="polite">{phase === "done" ? `Explanation ready. ${fullText}` : ""}</span>
      </section>
    </div>
  );
}

function annState(i: number, open: boolean, revealed: number, lastM: number, active: number) {
  if (!open || revealed === 0 || i > lastM) return "hidden";
  return i === active ? "active" : "mentioned";
}

/** Button label: icon + text; the slot width animates to the new label, the new label rises in. */
function PhaseLabel({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | undefined>();
  useLayoutEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth);
  }, [label]);
  const Icon = label === "Stop" ? Square : label === "Hide" ? ChevronUp : Sparkles;
  return (
    <span className="aic-slot" style={{ width: w }}>
      <span ref={ref} key={label} className={clsx("aic-phase", label === "Stop" && "aic-phase-stop")}>
        <Icon className={clsx(label === "Stop" && "aic-stop-icon")} aria-hidden />
        {label}
      </span>
    </span>
  );
}
