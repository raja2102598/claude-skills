import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy, Play, Square, Sparkle, Hexagon, Orbit } from "lucide-react";
import clsx from "clsx";
import "./prompt-studio.css";

type Case = "late" | "damaged" | "window";
type Vars = { customer_name: string; order_id: string; policy: string };

const CASES: { id: Case; label: string; vars: Vars; reply: string[] }[] = [
  {
    id: "late", label: "Late order",
    vars: { customer_name: "Mateo Silva", order_id: "LK-20417", policy: "Orders over 7 days late get their shipping refunded." },
    reply: [
      "Hi Mateo,",
      "Thanks for letting us know, and I'm sorry the parcel is late. I looked up order LK-20417: it shipped on schedule, but the courier has not logged a scan since Monday. I've asked them to trace it and I'll write again the moment they reply.",
      "As the order is now over 7 days late, I've added a shipping refund to your account. You'll see it within 3 to 5 days.",
      "Larkspur Support",
    ],
  },
  {
    id: "damaged", label: "Damaged",
    vars: { customer_name: "Ines Okafor", order_id: "LK-20533", policy: "Damaged items are replaced free, no return needed." },
    reply: [
      "Hi Ines,",
      "I'm so sorry the vase arrived cracked. For order LK-20533 I've booked a free replacement, and there is nothing to send back.",
      "It leaves our warehouse tomorrow and I'll share the tracking link by email.",
      "Larkspur Support",
    ],
  },
  {
    id: "window", label: "Past window",
    vars: { customer_name: "Dev Rahman", order_id: "LK-19988", policy: "Returns are open for 30 days from delivery." },
    reply: [
      "Hi Dev,",
      "Thanks for getting in touch. Order LK-19988 was delivered 41 days ago, which is outside our 30 day return window, so I can't start a return myself.",
      "I've passed your note to a team lead, who can review exceptions and will reply within one working day.",
      "Larkspur Support",
    ],
  },
];

const VARCOL: Record<keyof Vars, { fg: string; bg: string }> = {
  customer_name: { fg: "#2f5f9e", bg: "#e3edf8" },
  order_id: { fg: "#6b3a8f", bg: "#eee4f6" },
  policy: { fg: "#a8650d", bg: "#fbecd2" },
};

type Seg = string | keyof Vars;
const PROMPTS: Record<"system" | "user", { tokens: number; segs: Seg[] }> = {
  system: {
    tokens: 112,
    segs: [
      "You are a support agent for Larkspur Home, an online homeware shop.\nWrite a warm, specific reply in under 120 words.\n\nApply this policy exactly: ", "policy",
      "\n\n- Greet ", "customer_name", " by first name, once.\n- Quote order ", "order_id",
      " so they can find it.\n- Never promise a delivery date the courier has not confirmed.\n- If the policy does not cover the request, offer to hand over to a team lead.",
    ],
  },
  user: {
    tokens: 47,
    segs: [
      "Reply to the latest message from ", "customer_name", " about order ", "order_id",
      ".\n\nKeep the tone calm and friendly. Do not repeat the question back.\nEnd with a one line sign-off from the support team.",
    ],
  },
};

const VERSIONS = [
  { v: "v4", state: "Production", note: "Hand over to a team lead" },
  { v: "v3", state: "Draft", note: "Shorter replies" },
  { v: "v2", state: "Archived", note: "Ask for the order number" },
  { v: "v1", state: "Archived", note: "First draft" },
];
const MODELS = [
  { id: "nova", name: "Nova 2", Icon: Sparkle, color: "#c2623d" },
  { id: "atlas", name: "Atlas Mini", Icon: Hexagon, color: "#26231f" },
  { id: "orbit", name: "Orbit 1", Icon: Orbit, color: "#2f7f78" },
];
const EFFORTS = ["Low", "Medium", "High"];

function Odometer({ value }: { value: number }) {
  const digits = String(value).padStart(3, "0").split("").map(Number);
  return (
    <span className="ps-odo" aria-label={`${value} tokens`}>
      {digits.map((d, i) => (
        <span className="ps-odo-col" key={i} aria-hidden>
          <span style={{ transform: `translateY(${-d * 17}px)` }}>
            {Array.from({ length: 10 }, (_, n) => <i key={n}>{n}</i>)}
          </span>
        </span>
      ))}
    </span>
  );
}

function Seg({ items, value, onChange, boxed, role, itemRole }: {
  items: { id: string; label: string }[]; value: string; onChange: (id: string) => void; boxed?: boolean; role: string; itemRole: string;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [box, setBox] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const el = refs.current[value];
    if (el) setBox({ x: el.offsetLeft - (boxed ? 3 : 0), w: el.offsetWidth });
  }, [value, boxed]);
  return (
    <div className={clsx("ps-seg", boxed && "boxed")} role={role}>
      <span className="ps-hl" style={{ width: box.w, transform: `translateX(${box.x}px)` }} />
      {items.map((it) => (
        <button key={it.id} ref={(e) => { refs.current[it.id] = e; }} type="button" role={itemRole}
          aria-selected={itemRole === "tab" ? value === it.id : undefined} aria-checked={itemRole === "radio" ? value === it.id : undefined}
          className="ps-segbtn" onClick={() => onChange(it.id)}>{it.label}</button>
      ))}
    </div>
  );
}

function Popover({ open, onClose, align, children }: { open: boolean; onClose: () => void; align?: "right"; children: ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); setOut(false); return; }
    if (!mounted) return;
    setOut(true);
    const t = window.setTimeout(() => setMounted(false), 110);
    return () => window.clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const h = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest(".ps-pop, .ps-chip")) onClose(); };
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", h); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("pointerdown", h); document.removeEventListener("keydown", k); };
  }, [open, onClose]);
  if (!mounted) return null;
  return <div className={clsx("ps-pop", align, out && "out")} role="menu">{children}</div>;
}

type Phase = "idle" | "thinking" | "writing" | "done";
const autoplayEnabled = () => { try { return new URLSearchParams(window.location.search).get("autoplay") !== "0"; } catch { return true; } };

export default function PromptStudio() {
  const [tab, setTab] = useState<"system" | "user">("system");
  const [caseId, setCaseId] = useState<Case>("late");
  const [vars, setVars] = useState<Vars>(CASES[0].vars);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const [elapsed, setElapsed] = useState("1.53");
  const [menu, setMenu] = useState<"ver" | "model" | null>(null);
  const [version, setVersion] = useState("v4");
  const [promoted, setPromoted] = useState("v4");
  const [model, setModel] = useState("nova");
  const [effort, setEffort] = useState("High");
  const timers = useRef<number[]>([]);
  const innerRef = useRef<HTMLDivElement>(null);
  const [outH, setOutH] = useState(52);

  const reply = CASES.find((c) => c.id === caseId)!.reply;
  const words = reply.flatMap((p, pi) => p.split(" ").map((w, wi) => ({ w, pi, wi })));
  const modelObj = MODELS.find((m) => m.id === model)!;
  const verState = version === promoted ? "Production" : VERSIONS.find((x) => x.v === version)!.state;

  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const stop = useCallback(() => { clear(); setPhase("idle"); setShown(0); }, []);
  const run = useCallback(() => {
    clear(); setShown(0); setPhase("thinking");
    const total = words.length;
    later(() => setPhase("writing"), 800);
    const stepMs = 24;
    for (let i = 1; i <= total; i++) later(() => setShown(i), 800 + i * stepMs);
    const end = 800 + total * stepMs + 150;
    later(() => { setPhase("done"); setElapsed((end / 1000 - 0.25).toFixed(2)); }, end);
  }, [words.length]);

  useEffect(() => () => clear(), []);
  useEffect(() => { // demo on mount
    if (!autoplayEnabled()) return;
    const t = window.setTimeout(() => run(), 900);
    return () => window.clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); phase === "thinking" || phase === "writing" ? stop() : run(); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [phase, run, stop]);

  useLayoutEffect(() => {
    const el = innerRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setOutH(el.offsetHeight));
    ro.observe(el); setOutH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const pickCase = (id: string) => { setCaseId(id as Case); setVars(CASES.find((c) => c.id === id)!.vars); stop(); };
  const busy = phase === "thinking" || phase === "writing";
  const closeMenu = useCallback(() => setMenu(null), []);

  const renderSegs = (segs: Seg[]) => segs.map((s, i) =>
    s in VARCOL ? <span key={i} className="ps-var" style={{ color: VARCOL[s as keyof Vars].fg, background: VARCOL[s as keyof Vars].bg }}>{s}</span> : <span key={i}>{s}</span>);

  let visible = 0;
  return (
    <div className="ps-root" data-stage>
      <section className="ps-card">
        <header className="ps-head">
          <h2 className="ps-title">Order reply</h2>
          <div className="ps-chips">
            <div style={{ position: "relative" }}>
              <button className="ps-chip" type="button" aria-expanded={menu === "ver"} onClick={() => setMenu(menu === "ver" ? null : "ver")}>
                <b>{version}</b><span className={clsx("ps-dot", verState !== "Production" && "draft")} /><span>{verState}</span>
                <ChevronDown size={13} className="ps-caret" />
              </button>
              <Popover open={menu === "ver"} onClose={closeMenu}>
                {VERSIONS.map((x) => (
                  <button key={x.v} className="ps-opt" type="button" onClick={() => { setVersion(x.v); setMenu(null); }}>
                    <b>{x.v}</b><span>{x.note}</span><span className="ps-spacer" />
                    {x.v === version && <Check size={14} />}
                  </button>
                ))}
                <div className="ps-sep" />
                <button className="ps-opt" type="button" disabled={version === promoted} onClick={() => { setPromoted(version); setMenu(null); }}>
                  <span>{version === promoted ? "Live in production" : `Promote ${version} to production`}</span>
                </button>
              </Popover>
            </div>
            <div style={{ position: "relative" }}>
              <button className="ps-chip" type="button" aria-expanded={menu === "model"} onClick={() => setMenu(menu === "model" ? null : "model")}>
                <modelObj.Icon size={14} color={modelObj.color} /><b style={{ fontWeight: 400 }}>{modelObj.name}</b><span className="ps-muted">{effort}</span>
                <ChevronDown size={13} className="ps-caret" />
              </button>
              <Popover open={menu === "model"} onClose={closeMenu} align="right">
                {MODELS.map((m) => (
                  <button key={m.id} className="ps-opt" type="button" onClick={() => setModel(m.id)}>
                    <m.Icon size={14} color={m.color} /><span>{m.name}</span><span className="ps-spacer" />{m.id === model && <Check size={14} />}
                  </button>
                ))}
                <div className="ps-sep" />
                <div className="ps-effort">{EFFORTS.map((e) => <button key={e} type="button" aria-pressed={e === effort} onClick={() => setEffort(e)}>{e}</button>)}</div>
              </Popover>
            </div>
          </div>
        </header>

        <div className="ps-bar">
          <Seg boxed={false} role="tablist" itemRole="tab" value={tab} onChange={(id) => setTab(id as "system" | "user")}
            items={[{ id: "system", label: "System" }, { id: "user", label: "User" }]} />
          <span className="ps-tokens"><Odometer value={PROMPTS[tab].tokens} /> tokens</span>
        </div>
        <div className="ps-editor-wrap">
          <div className="ps-pane" key={tab}>{renderSegs(PROMPTS[tab].segs)}</div>
        </div>
        <div className="ps-hint">Type <kbd>{"{{"}</kbd> to add a variable</div>

        <div className="ps-vars">
          <div className="ps-fields">
            {(["customer_name", "order_id", "policy"] as const).map((k) => (
              <label key={k} className={clsx("ps-field", k === "policy" && "wide")}>
                <span className="ps-flabel" style={{ color: VARCOL[k].fg }}><i />{k}</span>
                <input className="ps-input" value={vars[k]} onChange={(e) => setVars({ ...vars, [k]: e.target.value })} />
              </label>
            ))}
          </div>
          <div className="ps-runrow">
            <Seg boxed role="radiogroup" itemRole="radio" value={caseId} onChange={pickCase} items={CASES.map((c) => ({ id: c.id, label: c.label }))} />
            <button className="ps-run" type="button" data-busy={busy} onClick={() => (busy ? stop() : run())}>
              {busy ? <Square size={12} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
              <span className="ps-runlabel"><span className="a">Run</span><span className="b">Stop</span></span>
              <kbd>Ctrl ↵</kbd>
            </button>
          </div>
        </div>

        <div className="ps-outframe" style={{ height: outH }}>
          <div ref={innerRef}>
            <div className="ps-out">
              {phase === "idle" ? (
                <div className="ps-empty">Run <b style={{ fontWeight: 500, color: "var(--fg)" }}>{CASES.find((c) => c.id === caseId)!.label}</b> to see the reply here. Runs are simulated.</div>
              ) : (
                <>
                  <div className="ps-outhead">
                    <span className="ps-status">
                      {phase === "done" ? <Check size={14} className="ok" /> : <span className="ps-spin" />}
                      <b>{phase === "thinking" ? "Thinking" : phase === "writing" ? "Writing" : "Reply"}</b>
                      <span>· {CASES.find((c) => c.id === caseId)!.label}</span>
                    </span>
                    {phase === "done" && <button className="ps-copy" type="button" aria-label="Copy reply"><Copy size={15} /></button>}
                  </div>
                  {(phase === "writing" || phase === "done") && (
                    <div className="ps-body">
                      {reply.map((p, pi) => {
                        const ws = p.split(" ").map((w, wi) => { const idx = visible++; return idx < shown || phase === "done" ? <span key={wi} className="ps-w" style={phase === "done" ? { animation: "none", opacity: 1 } : undefined}>{w}{" "}</span> : null; });
                        const any = ws.some(Boolean);
                        return any ? <p key={pi}>{ws}</p> : null;
                      })}
                    </div>
                  )}
                  <div className="ps-foot">
                    {phase === "done" ? `Simulated · ${elapsed} s · ${words.length * 1.3 | 0} tokens · $0.0014` : `Simulated · ${modelObj.name} · ${effort} effort`}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
