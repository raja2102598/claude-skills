import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  Hexagon,
  Mail,
  MessageSquare,
  Plus,
  Receipt,
  RotateCcw,
  Square,
  SquareKanban,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { ANSWER, FILES, INSTRUCTIONS, MODELS, SUGGESTIONS, TOOLS, UPLOAD, type ToolId } from "./data";
import "./agent-builder.css";

/*
 * Agent builder, motion-faithful to Arc UI "Agent builder" (see .reanimate/agent-builder/spec.md).
 * On mount the third knowledge file uploads (lumpy progress), then the card turns "Unsaved changes".
 * Configure / Test cross-fade; a suggestion sends: Thinking, three tool chips in turn, then the answer streams.
 * Fades and rises are CSS keyframes (they behave the same on the virtual and the real clock).
 */

const ICONS: Record<ToolId, LucideIcon> = {
  mail: Mail,
  chat: MessageSquare,
  issues: SquareKanban,
  docs: BookOpen,
  calendar: Calendar,
  billing: Receipt,
};

// Upload progress as [ms from mount, percent]; the bar's own transform eases 150 ms between steps.
const UPLOAD_STEPS: [number, number][] = [
  [600, 10], [750, 15], [990, 25], [1330, 31], [1480, 46], [1830, 61], [2490, 66], [2680, 82], [3010, 97],
];
const UPLOAD_DONE = 3240;

// Chat timeline, ms from the send click.
const CHAT = {
  tools: 900, // "Using tools", chip 1
  chip2: 2250,
  chip3: 3050, // chip 3 and "Writing"; the answer starts streaming
  streamMs: 2150, // answer streaming duration
  done: 5300,
  took: "3.8s",
};

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

type Phase = "idle" | "thinking" | "tools" | "writing" | "done";
type Mode = "configure" | "test";

function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="ab-switch" data-on={on} onClick={onChange}>
      <span className="ab-switch-thumb" />
    </button>
  );
}

function AgentBuilder({ restart }: { restart: () => void }) {
  const [mode, setMode] = useState<Mode>("configure");
  const [name, setName] = useState("Billing assistant");
  const [model, setModel] = useState(0);
  const [text, setText] = useState(INSTRUCTIONS);
  const [tools, setTools] = useState<Record<ToolId, boolean>>(() =>
    Object.fromEntries(TOOLS.map((t) => [t.id, t.on])) as Record<ToolId, boolean>,
  );
  const [files, setFiles] = useState(FILES);
  const [uploadPct, setUploadPct] = useState<number | null>(0);
  const [uploaded, setUploaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [published, setPublished] = useState(12);
  const [phase, setPhase] = useState<Phase>("idle");
  const [asked, setAsked] = useState<string | null>(null);
  const [chars, setChars] = useState(0);
  const [draft, setDraft] = useState("");
  const timers = useRef<number[]>([]);
  const raf = useRef(0);
  const auto = useRef(autoplayEnabled());
  const threadRef = useRef<HTMLDivElement>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
  };

  const touch = useCallback(() => {
    auto.current = false;
    setDirty(true);
  }, []);

  // Mount upload.
  useEffect(() => {
    UPLOAD_STEPS.forEach(([ms, pct]) => later(() => setUploadPct(pct), ms));
    later(() => {
      setUploadPct(null);
      setUploaded(true);
      setFiles((f) => [...f, UPLOAD]);
      setDirty(true);
    }, UPLOAD_DONE);
    return clear;
  }, [later]);

  const send = useCallback(
    (q: string) => {
      if (phase !== "idle" && phase !== "done") return;
      clear();
      setAsked(q);
      setDraft("");
      setPhase("thinking");
      setChars(0);
      setDirty(true);
      later(() => setPhase("tools"), CHAT.tools);
      later(() => setPhase("writing"), CHAT.chip3);
      const t0 = performance.now();
      later(() => {
        const step = () => {
          const k = Math.min(1, (performance.now() - t0 - CHAT.chip3) / CHAT.streamMs);
          setChars(Math.round(k * ANSWER.length));
          if (k < 1) raf.current = requestAnimationFrame(step);
        };
        step();
      }, CHAT.chip3);
      later(() => {
        setChars(ANSWER.length);
        setPhase("done");
      }, CHAT.done);
    },
    [phase, later],
  );

  const reset = () => {
    clear();
    setPhase("idle");
    setAsked(null);
    setChars(0);
  };

  // Gallery autoplay: after the upload, open Test and ask the first suggestion; any input stops it.
  useEffect(() => {
    if (!auto.current) return;
    const stop = () => {
      auto.current = false;
    };
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("keydown", stop, { once: true });
    const t1 = window.setTimeout(() => auto.current && setMode("test"), UPLOAD_DONE + 1800);
    const t2 = window.setTimeout(() => auto.current && send(SUGGESTIONS[0]), UPLOAD_DONE + 3200);
    const t3 = window.setTimeout(() => auto.current && restart(), UPLOAD_DONE + 3200 + CHAT.done + 3500);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [phase, chars]);

  const onCount = Object.values(tools).filter(Boolean).length;
  const busy = phase === "thinking" || phase === "tools" || phase === "writing";
  const status = dirty ? "Unsaved changes" : "All changes published";
  const label = phase === "thinking" ? "Thinking" : phase === "tools" ? "Using tools" : phase === "writing" ? "Writing" : "";
  const chipCount = phase === "thinking" ? 0 : phase === "tools" ? 1 : 3;

  return (
    <section className="ab-card" aria-label="Agent builder" data-ab-card>
      <header className="ab-head">
        <div className="ab-identity">
          <span className="ab-name-field">
            <span className="ab-name-sizer" aria-hidden>{name || "Untitled agent"}</span>
            <input
              className="ab-name-input"
              aria-label="Agent name"
              value={name}
              maxLength={40}
              spellCheck={false}
              placeholder="Untitled agent"
              onChange={(e) => {
                setName(e.target.value);
                touch();
              }}
            />
          </span>
          <span className="ab-meta">
            <span>Harbor support</span>
            <span aria-hidden>·</span>
            <span className="ab-nums">v{published}</span>
          </span>
        </div>
        <div className="ab-seg" role="group" aria-label="Agent builder view">
          <span className="ab-seg-sel" data-pos={mode} aria-hidden />
          {(["configure", "test"] as Mode[]).map((m) => (
            <button key={m} type="button" data-value={m} aria-pressed={mode === m} className="ab-seg-btn" onClick={() => { auto.current = false; setMode(m); }}>
              {m === "configure" ? "Configure" : "Test"}
            </button>
          ))}
        </div>
      </header>

      <div className="ab-body">
        <div className="ab-panel ab-configure" data-active={mode === "configure"} aria-hidden={mode !== "configure"}>
          <div className="ab-model-row">
            <div className="ab-col">
              <span className="ab-title">Model</span>
              <span className="ab-hint">Answers every conversation</span>
            </div>
            <button type="button" className="ab-model-trigger" onClick={() => { setModel((m) => (m + 1) % MODELS.length); touch(); }}>
              <Hexagon size={16} strokeWidth={1.8} className="ab-model-mark" />
              <span className="ab-model-value">{MODELS[model]}</span>
              <ChevronDown size={14} className="ab-muted" />
            </button>
          </div>

          <div className="ab-section ab-section-instr">
            <div className="ab-section-head">
              <label className="ab-title" htmlFor="ab-instr">Instructions</label>
              <span className="ab-meta-text ab-nums">{text.length.toLocaleString("en-US")} / 2,000</span>
            </div>
            <textarea id="ab-instr" className="ab-instructions" rows={5} maxLength={2000} value={text} onChange={(e) => { setText(e.target.value); touch(); }} />
          </div>

          <div className="ab-section">
            <div className="ab-section-head">
              <span className="ab-title">Tools</span>
              <span className="ab-meta-text ab-nums">{onCount} of {TOOLS.length} on</span>
            </div>
            <ul className="ab-tool-grid">
              {TOOLS.map((t) => {
                const Icon = ICONS[t.id];
                return (
                  <li key={t.id} className="ab-row" data-off={!tools[t.id]}>
                    <span className="ab-row-mark"><Icon size={16} strokeWidth={1.8} /></span>
                    <span className="ab-col ab-grow">
                      <span className="ab-row-name">{t.name}</span>
                      <span className="ab-hint ab-trunc">{t.hint}</span>
                    </span>
                    <Switch on={tools[t.id]} label={t.name} onChange={() => { setTools((s) => ({ ...s, [t.id]: !s[t.id] })); touch(); }} />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="ab-section ab-section-know">
            <div className="ab-section-head">
              <span className="ab-title">Knowledge</span>
              <button type="button" className="ab-add" onClick={() => touch()}>
                <Plus size={14} /> Add file
              </button>
            </div>
            <ul className="ab-files">
              {files.map((f) => (
                <li key={f.name} className="ab-file" data-new={f.name === UPLOAD.name}>
                  <FileText size={16} strokeWidth={1.6} className="ab-muted" />
                  <span className="ab-col ab-grow">
                    <span className="ab-row-name">{f.name}</span>
                    <span className="ab-hint">{f.size} <i>·</i> {f.kind}</span>
                  </span>
                  <button type="button" aria-label={`Remove ${f.name}`} className="ab-x" onClick={() => { setFiles((l) => l.filter((x) => x.name !== f.name)); touch(); }}>
                    <X size={14} />
                  </button>
                </li>
              ))}
              {uploadPct !== null && !uploaded && (
                <li className="ab-file ab-uploading">
                  <FileText size={16} strokeWidth={1.6} className="ab-muted" />
                  <span className="ab-col ab-grow">
                    <span className="ab-row-name">{UPLOAD.name}</span>
                    <span className="ab-hint ab-nums" data-ab-pct>{uploadPct}%</span>
                  </span>
                  <span className="ab-progress"><span className="ab-progress-fill" style={{ transform: `scaleX(${uploadPct / 100})` }} /></span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="ab-panel ab-test" data-active={mode === "test"} aria-hidden={mode !== "test"}>
          <div className="ab-test-head">
            <span className="ab-test-meta">
              <Hexagon size={14} strokeWidth={1.8} className="ab-model-mark" />
              {MODELS[model]} <i>·</i> {onCount} tools <i>·</i> {files.length + (uploadPct !== null && !uploaded ? 1 : 0)} files
            </span>
            <button type="button" className="ab-reset" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {asked === null ? (
            <div className="ab-empty" key="empty">
              <p className="ab-empty-title">Try {name || "your agent"}</p>
              <p className="ab-empty-text">Replies use the model and tools you configured. Nothing is sent.</p>
              <div className="ab-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="ab-suggestion" onClick={() => { auto.current = false; send(s); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ab-thread" ref={threadRef}>
              <div className="ab-user"><span>{asked}</span></div>
              <div className="ab-reply">
                <div className="ab-reply-head">
                  <span className="ab-avatar">{(name || "A")[0].toUpperCase()}</span>
                  <span className="ab-reply-name">{name || "Agent"}</span>
                  <span className="ab-reply-state" key={phase} data-shimmer={busy}>
                    {phase === "done" ? `${MODELS[model]} · ${CHAT.took}` : label}
                  </span>
                </div>
                {chipCount > 0 && (
                  <div className="ab-chips">
                    <span className="ab-chip" key="c1"><Receipt size={14} /> Searched customers <i>·</i> <em>2 charges on Oct 14</em></span>
                    {chipCount > 1 && <span className="ab-chip" key="c2"><FileText size={14} /> Read Refund policy 2026.pdf <i>·</i> <em>Section 2.1</em></span>}
                    {chipCount > 2 && <span className="ab-chip" key="c3"><Mail size={14} /> Drafted reply <i>·</i> <em>maya@northwind.studio</em></span>}
                  </div>
                )}
                {(phase === "writing" || phase === "done") && <p className="ab-answer">{ANSWER.slice(0, chars)}</p>}
              </div>
            </div>
          )}

          <form
            className="ab-composer"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) send(draft.trim());
            }}
          >
            <input className="ab-composer-input" value={draft} placeholder={`Message ${name || "agent"}`} onChange={(e) => setDraft(e.target.value)} />
            <button type={busy ? "button" : "submit"} className="ab-send" data-busy={busy} aria-label={busy ? "Stop" : "Send"} onClick={busy ? reset : undefined}>
              {busy ? <Square size={11} fill="currentColor" /> : <ArrowUp size={15} />}
            </button>
          </form>
        </div>
      </div>

      <footer className="ab-foot">
        <span className="ab-status" data-dirty={dirty} key={status}>
          {dirty ? <CircleAlert size={14} /> : <Check size={14} />}
          {status}
        </span>
        <button
          type="button"
          className="ab-publish"
          data-ready={dirty}
          disabled={!dirty}
          onClick={() => {
            setDirty(false);
            setPublished((v) => v + 1);
          }}
        >
          Publish
        </button>
      </footer>
    </section>
  );
}

export default function AgentBuilderClone() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="ab-root">
      <AgentBuilder key={run} restart={() => setRun((r) => r + 1)} />
    </div>
  );
}
