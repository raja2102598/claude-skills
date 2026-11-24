import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  ChartColumn,
  Check,
  Code,
  FileText,
  FlaskConical,
  Globe,
  MessageSquare,
  PenLine,
  PenTool,
  RotateCcw,
  ScanSearch,
  Search,
  Table2,
  Tag,
  Terminal,
  Workflow,
} from "lucide-react";
import clsx from "clsx";
import {
  AGENTS,
  TREE,
  byId,
  centsAt,
  progressAt,
  secondsAt,
  statusAt,
  type AgentDef,
  type AgentId,
  type Status,
} from "./data";
import "./agent-card.css";

const AGENT_ICON: Record<string, ReactNode> = {
  workflow: <Workflow size={16} />,
  search: <Search size={16} />,
  scan: <ScanSearch size={16} />,
  chart: <ChartColumn size={16} />,
  pen: <PenLine size={16} />,
  code: <Code size={16} />,
  flask: <FlaskConical size={16} />,
};
const TOOL_ICON: Record<string, ReactNode> = {
  file: <FileText size={12} />,
  chat: <MessageSquare size={12} />,
  code: <Code size={12} />,
  web: <Globe size={12} />,
  table: <Table2 size={12} />,
  pen: <PenTool size={12} />,
  term: <Terminal size={12} />,
  tag: <Tag size={12} />,
};

/** The connector fills start this long after the card flips to Running (read off the reference frames). */
const CONNECTOR_LAG = 100;
const RING_C = 2 * Math.PI * 4.5;

/* ------------------------------------------------------------------ run clock */

/** ms since mount, one value per animation frame. +0.5 so a frame landing on 999.99 reads as 1000. */
function useRunClock() {
  const [t, setT] = useState(0);
  useLayoutEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      flushSync(() => setT(performance.now() - t0 + 0.5));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

/* ------------------------------------------------------------------ pieces */

/** A column of 0-9 slid to the digit. */
function Roll({ digit }: { digit: number }) {
  return (
    <span className="ac-roll" aria-hidden>
      <span style={{ transform: `translateY(${-digit * 1.1}em)` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i}>{i}</i>
        ))}
      </span>
    </span>
  );
}

function Money({ cents }: { cents: number }) {
  const d = Math.floor(cents / 100) % 10;
  const t = Math.floor(cents / 10) % 10;
  const u = cents % 10;
  return (
    <span className="ac-nums" aria-label={`$${(cents / 100).toFixed(2)}`}>
      <span>$</span>
      <Roll digit={d} />
      <span>.</span>
      <Roll digit={t} />
      <Roll digit={u} />
    </span>
  );
}

/** Keeps the previous child for 300 ms so the old and the new roll past each other. */
function Swap({ k, children }: { k: string; children: ReactNode }) {
  const [shown, setShown] = useState<{ k: string; node: ReactNode }[]>([{ k, node: children }]);
  const last = useRef(k);
  if (last.current !== k) {
    last.current = k;
    setShown((s) => [...s.slice(-1), { k, node: children }]);
  }
  useEffect(() => {
    if (shown.length < 2) return;
    const id = window.setTimeout(() => setShown((s) => s.slice(-1)), 300);
    return () => window.clearTimeout(id);
  }, [shown]);
  const current = shown[shown.length - 1];
  return (
    <span className="ac-pill-stack">
      {shown.map((s) => {
        const isCur = s === current;
        const first = shown.length === 1 && s.k === k && !isCur;
        return (
          <span key={s.k} className={clsx(isCur ? (shown.length > 1 ? "ac-pill-in" : "") : "ac-pill-out")} data-first={first ? 1 : 0}>
            {isCur ? children : s.node}
          </span>
        );
      })}
    </span>
  );
}

function StatusPill({ status, progress }: { status: Status; progress: number }) {
  const label = status === "queued" ? "Queued" : status === "running" ? "Running" : "Done";
  return (
    <span className="ac-pill" data-s={status}>
      <Swap k={status}>
        {status === "queued" ? (
          <i className="ac-dash" />
        ) : status === "running" ? (
          <svg className="ac-ring" viewBox="0 0 12 12" aria-hidden>
            <circle cx="6" cy="6" r="4.5" fill="none" stroke="var(--ac-border)" strokeWidth="1.5" />
            <circle
              cx="6"
              cy="6"
              r="4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - Math.max(0.04, progress))}
              style={{ color: "var(--hue)" }}
            />
          </svg>
        ) : (
          <Check size={12} />
        )}
        <span>{label}</span>
      </Swap>
    </span>
  );
}

function Card({ a, t }: { a: AgentDef; t: number }) {
  const status = statusAt(a, t);
  return (
    <article className="ac-card" data-s={status} style={{ ["--hue" as string]: `var(--ac-${a.hue})` }}>
      <header className="ac-card-h">
        <span className="ac-agent-chip" style={{ color: "var(--hue)" }}>
          {AGENT_ICON[a.icon]}
        </span>
        <div className="ac-names">
          <h4 className="ac-name" style={{ margin: 0 }}>{a.name}</h4>
          <p className="ac-model" style={{ margin: 0 }}>{a.model}</p>
        </div>
        <StatusPill status={status} progress={progressAt(a, t)} />
      </header>
      <p className="ac-task">
        <span className="ac-tools">
          {a.tools.map((k) => (
            <span key={k} className="ac-tool">
              {TOOL_ICON[k]}
            </span>
          ))}
        </span>
        {a.task}
      </p>
      <footer className="ac-foot ac-mono">
        <span className="ac-cost">
          <Money cents={centsAt(a, t)} />
        </span>
        <span>·</span>
        <span>{secondsAt(a, t)}s</span>
      </footer>
    </article>
  );
}

/** One connector segment: a grey track with the agent's colour scaling in over it. */
function Seg({
  on,
  hue,
  origin,
  style,
}: {
  on: boolean;
  hue: string;
  origin: "top" | "left" | "center";
  style: React.CSSProperties;
}) {
  return (
    <span className="ac-seg" style={style}>
      <span className={`ac-fill o-${origin}`} data-on={on ? 1 : 0} style={{ background: `var(--ac-${hue})` }} />
    </span>
  );
}

function started(id: AgentId, t: number) {
  return t >= byId[id].start + CONNECTOR_LAG;
}

function Demo({ onReplay }: { onReplay: () => void }) {
  const t = useRunClock();
  const running = AGENTS.filter((a) => statusAt(a, t) === "running").length;
  const total = AGENTS.reduce((s, a) => s + centsAt(a, t), 0);
  const helm = byId.helm;
  const anyChild = TREE.some((c) => started(c.id, t));

  return (
    <section>
      <header className="ac-head">
        <div className="ac-head-l">
          <span className="ac-chip">
            <Workflow size={16} />
          </span>
          <h3 className="ac-title" style={{ margin: 0 }}>Agents</h3>
        </div>
        <p className="ac-summary ac-mono" style={{ margin: 0 }}>
          <span>7 agents</span>
          <span>·</span>
          <b className="ac-nums">
            <Roll digit={running} />
            <span style={{ marginLeft: 4, color: "var(--ac-muted)" }}>running</span>
          </b>
          <span>·</span>
          <b>
            <Money cents={total} />
          </b>
        </p>
        <button className="ac-icon-btn" aria-label="Replay" onClick={onReplay}>
          <RotateCcw size={14} />
        </button>
      </header>

      <div style={{ position: "relative" }}>
        <div className="ac-orch">
          <Card a={helm} t={t} />
        </div>
        <ol className="ac-cols" style={{ margin: 0, listStyle: "none" }}>
          {/* trunk from the lead and the bar across the three columns */}
          <Seg on={anyChild} hue="helm" origin="top" style={{ top: 0, left: "50%", width: 1, height: 16 }} />
          <Seg
            on={anyChild}
            hue="helm"
            origin="center"
            style={{ top: 16, height: 1, left: "calc(16.6667% - 0.3333rem)", right: "calc(16.6667% - 0.3333rem)" }}
          />
          {TREE.map((col) => {
            const a = byId[col.id];
            return (
              <li key={col.id} className="ac-col">
                <Seg on={started(col.id, t)} hue={a.hue} origin="top" style={{ top: -16, left: "50%", width: 1, height: 16 }} />
                <Card a={a} t={t} />
                {col.children.length > 0 && (
                  <ol className="ac-sub" style={{ margin: 0, listStyle: "none" }}>
                    {col.children.map((cid, i) => {
                      const c = byId[cid];
                      const next = col.children[i + 1];
                      return (
                        <li key={cid}>
                          <Seg on={started(cid, t)} hue={c.hue} origin="top" style={{ top: -12, left: -12, width: 1, height: 40 }} />
                          <Seg on={started(cid, t)} hue={c.hue} origin="left" style={{ top: 28, left: -12, width: 12, height: 1 }} />
                          {next && (
                            <Seg on={started(next, t)} hue={byId[next].hue} origin="top" style={{ top: 28, bottom: 0, left: -12, width: 1 }} />
                          )}
                          <Card a={c} t={t} />
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function AgentCard() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const on = () => setRun((n) => n + 1);
    window.addEventListener("reanimate:replay", on);
    return () => window.removeEventListener("reanimate:replay", on);
  }, []);
  return (
    <div className="ac-root">
      <Demo key={run} onReplay={() => setRun((n) => n + 1)} />
    </div>
  );
}
