import { useEffect, useRef, useState } from "react";
import { Asterisk, Check, Clock, Gauge, Hexagon, Orbit, Split, Star, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import "./model-fallback.css";

/*
 * Model fallback notice, motion-faithful to UIStacks "Model fallback".
 * A request tries an ordered chain of models. Each attempt is "Trying" for ~2 s, then stops with a reason
 * (timed out / rate limited) and the time it cost, and the next model takes over: the header pill, the badge, the
 * row subtitle and the latency totals all crossfade or roll at that moment. The last attempt answers, the
 * header turns green, and after a 5 s hold the whole thing resets and runs again.
 */

type Outcome = "timeout" | "limited" | "answered";
type Model = {
  name: string;
  role: string;
  Icon: LucideIcon;
  tint: string;
  outcome: Outcome;
  cost: string;
  tryMs: number;
  doneNote: string;
};

const MODELS: Model[] = [
  { name: "Nova 2", role: "Primary", Icon: Asterisk, tint: "#e2603c", outcome: "timeout", cost: "+8.0 s", tryMs: 2100, doneNote: "No reply in 8 s" },
  { name: "Atlas Mini", role: "Fallback 1", Icon: Hexagon, tint: "#44403c", outcome: "limited", cost: "+1.4 s", tryMs: 2500, doneNote: "Rate limited, retry in 40 s" },
  { name: "Lumen", role: "Fallback 2", Icon: Star, tint: "#2f6bf0", outcome: "answered", cost: "2.3 s", tryMs: 1900, doneNote: "Sent the reply" },
  { name: "Quill", role: "Fallback 3", Icon: Orbit, tint: "#0e9aa7", outcome: "answered", cost: "", tryMs: 0, doneNote: "" },
];
const HOLD_MS = 5100;
// Totals after each attempt finishes: [added latency, fallbacks, total].
const TOTALS: [string, string, string][] = [
  ["+0.0 s", "0", "0.0 s"],
  ["+8.0 s", "0", "8.0 s"],
  ["+9.4 s", "1", "9.4 s"],
  ["+9.4 s", "2", "11.7 s"],
];

/** A value that rolls: the new text rises in while the old one lifts out. */
function Roll({ value, className }: { value: string; className?: string }) {
  const prev = useRef(value);
  const [old, setOld] = useState<string | null>(null);
  useEffect(() => {
    if (prev.current === value) return;
    setOld(prev.current);
    prev.current = value;
    const t = setTimeout(() => setOld(null), 400);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <span className={clsx("relative inline-block tabular-nums", className)}>
      <span key={value} className={old !== null ? "mf-roll-in inline-block" : "inline-block"}>{value}</span>
      {old !== null && <span className="mf-roll-out" aria-hidden="true">{old}</span>}
    </span>
  );
}

function Fade({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const first = useRef(true);
  useEffect(() => { first.current = false; }, []);
  return <span key={id} className={clsx("inline-flex items-center gap-1.5", !first.current && "mf-in", className)}>{children}</span>;
}

function Badge({ kind }: { kind: "trying" | "timeout" | "limited" | "answered" | "next" | "skipped" }) {
  if (kind === "next" || kind === "skipped")
    return <span className="mf-in pt-1 text-[12.5px]" style={{ color: "var(--mf-faint)" }}>{kind === "next" ? "Next" : "Not needed"}</span>;
  const map = {
    trying: { bg: "var(--mf-blue-bg)", fg: "var(--mf-blue)", label: "Trying", icon: <Gauge size={13} style={{ animation: "mf-spin 1.2s linear infinite" }} /> },
    timeout: { bg: "var(--mf-grey-bg)", fg: "#57534e", label: "Timed out", icon: <Clock size={13} /> },
    limited: { bg: "var(--mf-grey-bg)", fg: "#57534e", label: "Rate limited", icon: <Gauge size={13} /> },
    answered: { bg: "var(--mf-green-bg)", fg: "var(--mf-green)", label: "Answered", icon: <Check size={13} strokeWidth={2.5} /> },
  }[kind];
  return (
    <span className="mf-in inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[13px] font-medium" style={{ background: map.bg, color: map.fg }}>
      {map.icon}
      {map.label}
    </span>
  );
}

export default function ModelFallback() {
  // phase 0..2 = trying model N, 3 = answered.
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ms = phase < 3 ? MODELS[phase].tryMs : HOLD_MS;
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), ms);
    return () => clearTimeout(t);
  }, [phase]);

  const answered = phase === 3;
  const trying = MODELS[Math.min(phase, 2)];
  const [added, falls, total] = TOTALS[phase];

  return (
    <div data-stage className="mf-root">
      <div className="flex items-center gap-3">
        <div className="grid h-[38px] w-[38px] place-items-center rounded-xl border" style={{ borderColor: "var(--mf-line)" }}>
          <Split size={18} />
        </div>
        <div>
          <div className="text-[15px] font-semibold leading-5">Model fallback</div>
          <div className="text-[13px] leading-5" style={{ color: "var(--mf-sub)" }}>Summarize the Q3 launch doc for #ops-notes</div>
        </div>
      </div>

      <div className="mt-3 h-[26px]">
        {answered ? (
          <Fade id="ans" className="rounded-full px-2.5 py-[3px] text-[13px] font-medium" ><span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px]" style={{ background: "var(--mf-green-bg)", color: "var(--mf-green)" }}><Check size={13} strokeWidth={2.5} />Answered by Lumen</span></Fade>
        ) : (
          <Fade id={`try-${phase}`}>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[13px] font-medium" style={{ background: "var(--mf-blue-bg)", color: "var(--mf-blue)" }}>
              <span className="h-[6px] w-[6px] rounded-full" style={{ background: "var(--mf-blue)", animation: "mf-pulse 1.2s ease-in-out infinite" }} />
              Trying {trying.name}
            </span>
          </Fade>
        )}
      </div>

      <div className="relative mt-2">
        {MODELS.map((m, i) => {
          const isTrying = !answered && i === phase;
          const finished = i < phase && i < 3;
          const isAnswer = answered && i === 2;
          const skipped = answered && i === 3;
          const upcoming = !isTrying && !finished && !isAnswer && !skipped;
          const showSub = isTrying || finished || isAnswer;
          const badge = isTrying ? "trying" : isAnswer ? "answered" : finished ? m.outcome : skipped ? "skipped" : "next";
          const sub = isTrying ? "Waiting for a reply" : m.doneNote || "Waiting for a reply";
          const showCost = (finished || isAnswer) && m.cost;
          return (
            <div key={m.name} className="relative" style={{ marginTop: i ? 10 : 0 }}>
              {i > 0 && <div className="mf-rail" data-done={i <= phase || answered} style={{ top: -12, height: 22 }} />}
              <div className="mf-row" data-active={isAnswer}>
                <div
                  className="grid h-[34px] w-[34px] place-items-center rounded-[10px] border bg-white transition-opacity duration-300"
                  style={{ borderColor: "var(--mf-line)", opacity: upcoming || skipped ? 0.5 : finished ? 0.7 : 1, color: upcoming ? "var(--mf-faint)" : m.tint }}
                >
                  <m.Icon size={17} />
                </div>
                <div className="min-w-0 transition-opacity duration-300" style={{ opacity: upcoming || skipped ? 0.5 : 1 }}>
                  <div className="text-[14px] leading-[34px] -mt-[0px]" style={{ lineHeight: showSub ? "20px" : "34px", transition: "line-height 300ms" }}>
                    <span className="font-medium">{m.name}</span>
                    <span style={{ color: "var(--mf-sub)" }}> · {m.role}</span>
                  </div>
                  <div className="mf-sub" data-open={showSub}>
                    <div>
                      <div className="text-[13px] leading-5" style={{ color: "var(--mf-sub)" }}>
                        <Fade id={sub} className="!gap-0">{sub}</Fade>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex min-w-[64px] flex-col items-end gap-1 text-right">
                  <div className="flex h-[26px] items-center"><Badge key={badge} kind={badge} /></div>
                  <div className="h-[18px] text-[13px]" style={{ color: "var(--mf-sub)", opacity: showCost ? 1 : 0, transition: "opacity 300ms" }}>
                    {showCost && <Roll value={m.cost} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[1.1fr_1fr_1fr] px-2 pt-1 text-[13px]" style={{ color: "var(--mf-sub)" }}>
        {[["Added latency", added], ["Fallbacks", falls], ["Total", total]].map(([k, v]) => (
          <div key={k}>
            <div>{k}</div>
            <div className="mt-0.5 text-[15px] font-medium" style={{ color: "var(--mf-ink)" }}><Roll value={v} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
