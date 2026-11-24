import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { CircleCheck, CircleX, CornerDownRight, Pause, Play, RotateCcw, RotateCw, Wrench } from "lucide-react";
import { AGENTS, AXIS, LINKS, SPEEDUP, TICKS, TITLE, TOTAL_TOKENS, type RunSpan } from "./data";
import "./agent-timeline.css";

/*
 * Agent run timeline, motion-faithful to Arc UI "Agent timeline" (Pro).
 * A planner and four agents share one time axis. A playhead runs 0 → 26.4 s at wall-clock speed (x1 or x2): every
 * bar grows with it, the active bar carries a 2 px leading edge and a sweeping highlight, handoff links draw down
 * to an agent when the planner hands work out and draw back up when the agent's results reach the planner, and
 * the header counts seconds, tokens and cost frame by frame. At the end the playhead fades out and the header
 * cross-fades to a summary. Hover a bar for what it did; click it to trace that agent's handoffs; scrub on the axis.
 * The playhead is a rAF loop committed with flushSync; every fade, draw and pop is a CSS transition or keyframe,
 * so it runs the same on a real or a frame-stepped clock.
 */

const pct = (sec: number) => (sec / AXIS) * 100;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
const ROW_TOP = (row: number) => 6 + row * 44;

function tokensAt(now: number) {
  let tokens = 0;
  let cost = 0;
  for (const agent of AGENTS) {
    for (const sp of agent.spans) {
      if (!sp.tokens || now <= sp.s) continue;
      const t = sp.tokens * clamp((now - sp.s) / sp.d, 0, 1);
      tokens += t;
      cost += (t / 1000) * agent.rate;
    }
  }
  return { tokens, cost };
}

const FINAL = tokensAt(AXIS);

function workingAt(now: number) {
  let n = 0;
  for (const agent of AGENTS) if (agent.spans.some((sp) => sp.kind !== "waiting" && now >= sp.s && now < sp.s + sp.d)) n++;
  return n;
}

type Hover = { row: number; index: number };

export default function AgentTimeline() {
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [hover, setHover] = useState<Hover | null>(null);
  const [trace, setTrace] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const nowRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const speedRef = useRef<number>(1);
  const plotRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef(false);

  const finished = now >= AXIS;

  // The run loop: the first frame after (re)start holds the playhead, every later frame adds the elapsed time.
  useEffect(() => {
    if (!playing) return;
    lastRef.current = null;
    let raf = requestAnimationFrame(function tick(t) {
      const last = lastRef.current ?? t;
      lastRef.current = t;
      const next = Math.min(AXIS, nowRef.current + ((t - last) / 1000) * speedRef.current);
      nowRef.current = next;
      flushSync(() => setNow(next));
      if (next >= AXIS) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const seek = useCallback((t: number) => {
    const v = clamp(t, 0, AXIS);
    nowRef.current = v;
    lastRef.current = null;
    setNow(v);
  }, []);

  const restart = () => {
    seek(0);
    setTrace(null);
    setPlaying(true);
  };

  const togglePlay = () => {
    if (finished) return restart();
    lastRef.current = null;
    setPlaying((p) => !p);
  };

  const pickSpeed = (s: 1 | 2) => {
    speedRef.current = s;
    setSpeed(s);
  };

  // Scrubbing on the axis: pause while the pointer is down, resume on release unless the run reached its end.
  const timeAt = (clientX: number) => {
    const box = plotRef.current!.getBoundingClientRect();
    return ((clientX - box.left) / box.width) * AXIS;
  };
  const onAxisDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    resumeRef.current = playing;
    setPlaying(false);
    setScrubbing(true);
    seek(timeAt(e.clientX));
  };
  const onAxisMove = (e: PointerEvent<HTMLDivElement>) => {
    if (scrubbing) seek(timeAt(e.clientX));
  };
  const onAxisUp = () => {
    if (!scrubbing) return;
    setScrubbing(false);
    if (resumeRef.current && nowRef.current < AXIS) setPlaying(true);
  };
  const onKnobKey = (e: KeyboardEvent<HTMLSpanElement>) => {
    const step = e.shiftKey ? 2.5 : 0.5;
    const to =
      e.key === "ArrowLeft" || e.key === "ArrowDown"
        ? nowRef.current - step
        : e.key === "ArrowRight" || e.key === "ArrowUp"
          ? nowRef.current + step
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? AXIS
              : null;
    if (to === null) return;
    e.preventDefault();
    seek(to);
  };

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setTrace(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { tokens, cost } = tokensAt(now);
  const working = workingAt(now);
  const word = playing ? "running" : now === 0 ? "ready" : "paused";
  const hovered = hover ? { agent: AGENTS[hover.row], span: AGENTS[hover.row].spans[hover.index] } : null;

  return (
    <section className="at-card" aria-labelledby="at-title">
      <div className="at-inner">
        <header className="at-header">
          <h3 id="at-title" className="at-title">
            {TITLE}
          </h3>
          <div className="at-status" aria-live="off">
            <p className="at-layer" data-on={!finished || undefined}>
              <span className="at-word">
                <span data-on={word === "running" || undefined}>
                  <span className={playing ? "at-shimmer" : undefined}>Running</span>
                </span>
                <span data-on={word === "paused" || undefined}>Paused</span>
                <span data-on={word === "ready" || undefined}>Ready</span>
              </span>
              <span className="at-sep" aria-hidden>
                ·
              </span>
              <span className="at-count at-val">
                <span aria-hidden>{AXIS.toFixed(1)}s</span>
                <span>{now.toFixed(1)}s</span>
              </span>
              <span className="at-sep" aria-hidden>
                ·
              </span>
              <span className="at-val at-count">
                <span>{fmtInt(tokens)}</span>
              </span>
              <span className="at-unit">tokens</span>
              <span className="at-sep" aria-hidden>
                ·
              </span>
              <span className="at-val at-count">
                <span>${cost.toFixed(2)}</span>
              </span>
              {working > 0 && <span className="at-sr">, {working} agents working</span>}
            </p>
            <p className="at-layer" data-on={finished || undefined} aria-hidden={!finished}>
              <CircleCheck className="at-done-icon" strokeWidth={1.75} aria-hidden />
              <span className="at-sr">Finished:</span>
              <span className="at-val">{AGENTS.length} agents</span>
              <span className="at-sep" aria-hidden>
                ·
              </span>
              <span className="at-val">{AXIS.toFixed(1)}s</span>
              <span className="at-sep" aria-hidden>
                ·
              </span>
              <span className="at-val">{SPEEDUP.toFixed(1)}x faster than in series</span>
              <span className="at-sep" aria-hidden>
                ·
              </span>
              <span className="at-val">
                {fmtInt(TOTAL_TOKENS)} tokens, ${FINAL.cost.toFixed(2)}
              </span>
            </p>
          </div>
        </header>

        <div className="at-body">
          <div className="at-labels">
            {AGENTS.map((agent) => {
              const Mark = agent.mark;
              return (
                <div key={agent.name} className="at-label" style={{ "--c": agent.color } as CSSProperties}>
                  <span className="at-dot" aria-hidden />
                  <span className="at-name">{agent.name}</span>
                  <span className="at-model">
                    <Mark style={{ color: agent.markColor }} strokeWidth={2.25} aria-hidden />
                    {agent.model}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="at-track">
            <div
              ref={plotRef}
              className="at-plot"
              data-trace={trace !== null || undefined}
              onClick={(e) => !(e.target as Element).closest(".at-span") && setTrace(null)}
            >
              <div className="at-grid" aria-hidden>
                {TICKS.map((t) => (
                  <span key={t} className="at-gridline" style={{ left: `${pct(t)}%` }} />
                ))}
              </div>

              <div className="at-links" aria-hidden>
                {LINKS.map((l, i) =>
                  now >= l.at ? (
                    <span
                      key={i}
                      className="at-link"
                      data-dir={l.dir}
                      data-hot={trace === l.row || undefined}
                      style={
                        {
                          "--c": AGENTS[l.row].color,
                          height: ROW_TOP(l.row) + 22 - 36 + 0.75,
                          left: l.dir === "out" ? `calc(${pct(l.from)}% - 0.75px)` : `${pct(l.from)}%`,
                          width: `calc(${pct(l.at - l.from)}% + 0.75px)`,
                        } as CSSProperties
                      }
                    />
                  ) : null,
                )}
              </div>

              {AGENTS.map((agent, row) => (
                <div
                  key={agent.name}
                  className="at-row"
                  role="group"
                  aria-label={agent.name}
                  style={{ top: ROW_TOP(row), "--c": agent.color } as CSSProperties}
                >
                  {agent.spans.map((sp, index) =>
                    now > sp.s ? (
                      <SpanBar
                        key={index}
                        span={sp}
                        agentName={agent.name}
                        now={now}
                        playing={playing}
                        dim={trace !== null && row !== 0 && row !== trace}
                        onHover={(on) => setHover(on ? { row, index } : null)}
                        onPick={() => setTrace((t) => (row === 0 || t === row ? null : row))}
                      />
                    ) : null,
                  )}
                </div>
              ))}

              <div className="at-ports" aria-hidden>
                {LINKS.map((l, i) =>
                  now >= l.at ? (
                    <span
                      key={i}
                      className="at-port"
                      data-hot={trace === l.row || undefined}
                      style={
                        {
                          "--c": AGENTS[l.row].color,
                          "--delay": l.dir === "in" ? "260ms" : "0ms",
                          left: `${pct(l.port)}%`,
                        } as CSSProperties
                      }
                    />
                  ) : null,
                )}
              </div>

              <div
                className="at-playhead"
                data-settled={finished || undefined}
                style={{ left: `${pct(Math.min(now, AXIS))}%` }}
                aria-hidden
              />

              {hovered && hover && (
                <div
                  className="at-card-layer"
                  style={{
                    left: `clamp(0px, calc(${pct(hovered.span.s)}% - 12px), calc(100% - min(280px, 100% - 16px)))`,
                    ...(hover.row < 3 ? { top: ROW_TOP(hover.row) + 34 } : { bottom: 256 - ROW_TOP(hover.row) - 8 }),
                  }}
                >
                  <SpanCard agent={hovered.agent} span={hovered.span} />
                </div>
              )}

              <div
                className="at-axis"
                data-live={playing || undefined}
                onPointerDown={onAxisDown}
                onPointerMove={onAxisMove}
                onPointerUp={onAxisUp}
                onPointerCancel={onAxisUp}
              >
                {TICKS.map((t) => (
                  <span key={t} className="at-tick" style={{ left: `${pct(t)}%` }} aria-hidden>
                    {t}s
                  </span>
                ))}
                <span
                  className="at-knob"
                  role="slider"
                  tabIndex={0}
                  aria-label="Run time"
                  aria-valuemin={0}
                  aria-valuemax={AXIS}
                  aria-valuenow={+now.toFixed(1)}
                  aria-valuetext={`${now.toFixed(1)}s of ${AXIS}s`}
                  data-active={scrubbing || undefined}
                  style={{ left: `${pct(Math.min(now, AXIS))}%` }}
                  onKeyDown={onKnobKey}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="at-footer">
          <div className="at-controls">
            <button
              type="button"
              className="at-btn"
              data-variant="secondary"
              aria-label={playing ? "Pause" : "Play"}
              onClick={togglePlay}
            >
              <span className="at-glyph" data-playing={playing || undefined} aria-hidden>
                <Play className="at-play" fill="currentColor" strokeWidth={1.75} />
                <Pause className="at-pause" fill="currentColor" strokeWidth={1.75} />
              </span>
            </button>
            <button type="button" className="at-btn" aria-label="Restart" onClick={restart}>
              <RotateCcw strokeWidth={1.75} aria-hidden />
            </button>
            <div className="at-seg" role="group" aria-label="Playback speed">
              <span
                className="at-seg-thumb"
                aria-hidden
                style={{ width: speed === 1 ? 36 : 39, transform: `translateX(${speed === 1 ? 0 : 38}px)` }}
              />
              {([1, 2] as const).map((s) => (
                <button key={s} type="button" aria-pressed={speed === s} onClick={() => pickSpeed(s)}>
                  {s}x
                </button>
              ))}
            </div>
          </div>
          <ul className="at-legend" aria-label="Legend">
            <li>
              <span className="at-swatch" data-kind="thinking" aria-hidden />
              Thinking
            </li>
            <li>
              <span className="at-swatch" data-kind="tool" aria-hidden />
              Tool call
            </li>
            <li>
              <span className="at-swatch" data-kind="waiting" aria-hidden />
              Waiting
            </li>
            <li>
              <CornerDownRight strokeWidth={1.75} aria-hidden />
              Handoff
            </li>
            <li>
              <CircleX className="at-failed-icon" strokeWidth={1.75} aria-hidden />
              Failed
            </li>
          </ul>
        </footer>
      </div>
    </section>
  );
}

function SpanBar({
  span,
  agentName,
  now,
  playing,
  dim,
  onHover,
  onPick,
}: {
  span: RunSpan;
  agentName: string;
  now: number;
  playing: boolean;
  dim: boolean;
  onHover: (on: boolean) => void;
  onPick: () => void;
}) {
  const run = clamp(now - span.s, 0, span.d);
  const active = now < span.s + span.d && now < AXIS;
  const failed = span.failed && !active;
  const kindLabel = span.kind === "tool" ? `Tool call, ${span.tool}` : span.kind === "thinking" ? "Thinking" : "Waiting";
  return (
    <button
      type="button"
      className="at-span"
      data-kind={span.kind}
      data-active={active || undefined}
      data-playing={playing || undefined}
      data-failed={failed || undefined}
      data-dim={dim || undefined}
      aria-label={`${agentName}, ${kindLabel}${failed ? ", failed" : ""}: ${span.label}, ${span.s.toFixed(1)}s to ${(span.s + span.d).toFixed(1)}s`}
      style={{
        left: `calc(${pct(span.s)}% + 0.75px)`,
        width: `max(0px, calc(${pct(run)}% - 1.5px))`,
      }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={onPick}
    >
      {failed && <CircleX className="at-span-icon" strokeWidth={2} aria-hidden />}
      {span.retry && !active && <RotateCw className="at-span-icon" strokeWidth={2} aria-hidden />}
    </button>
  );
}

function SpanCard({ agent, span }: { agent: (typeof AGENTS)[number]; span: RunSpan }) {
  return (
    <div className="at-tip">
      <p className="at-tip-head" style={{ margin: 0 }}>
        <b>{agent.name}</b>
        <span>{agent.model}</span>
      </p>
      <p className="at-tip-label">{span.label}</p>
      <p className="at-tip-meta" style={{ margin: "2px 0 0" }}>
        {span.tool && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Wrench aria-hidden strokeWidth={1.75} />
            {span.tool}
          </span>
        )}
        <span>
          {span.s.toFixed(1)}s – {(span.s + span.d).toFixed(1)}s
        </span>
        {span.tokens ? <span>{fmtInt(span.tokens)} tokens</span> : null}
      </p>
      {span.failed && (
        <p className="at-tip-note" style={{ margin: "2px 0 0" }}>
          <CircleX aria-hidden width={12} height={12} strokeWidth={2} />
          Timed out after {span.d.toFixed(1)}s, retried with a filter
        </p>
      )}
    </div>
  );
}
