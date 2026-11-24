import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight, BookOpen, Check, ChevronDown, CircleAlert, CircleCheck, CreditCard, Database, Eye, GitBranch,
  Info, KeyRound, Layers, MessageSquare, PenTool, Pencil, Plus, Radar, X, Sparkles,
} from "lucide-react";
import { BUDGET, DISCOVERED, SERVERS, fmtTokens, type Server, type Tool } from "./data";
import "./mcp-servers.css";

const ICONS: Record<string, typeof GitBranch> = {
  git: GitBranch, layers: Layers, book: BookOpen, chat: MessageSquare, radar: Radar, card: CreditCard, db: Database, pen: PenTool,
};

const Roll = ({ v }: { v: string | number }) => <span key={String(v)} className="ms-roll">{v}</span>;
const sum = (t: Tool[]) => t.filter((x) => x.on).reduce((a, x) => a + x.tokens, 0);
const count = (t: Tool[]) => t.filter((x) => x.on).length;

function Switch({ on, label, onClick, ...rest }: { on: boolean; label: string; onClick?: () => void } & Record<string, unknown>) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className="ms-sw" onClick={(e) => { e.stopPropagation(); onClick?.(); }} {...rest} />;
}

type Step = { kind: "signin" | "discover"; busy: boolean; shown: number; found: boolean; ready: boolean; out: boolean; tools: Tool[] };

function Card() {
  const [servers, setServers] = useState<Server[]>(SERVERS);
  const [open, setOpen] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [sheet, setSheet] = useState<Step | null>(null);
  const timers = useRef<number[]>([]);
  const later = useCallback((ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const totalTools = servers.reduce((a, s) => a + count(s.tools), 0);
  const totalTokens = servers.reduce((a, s) => a + sum(s.tools), 0);

  const openSignin = () => setSheet({ kind: "signin", busy: false, shown: 0, found: false, ready: false, out: false, tools: DISCOVERED.map((t) => ({ ...t })) });
  const authorize = () => {
    setSheet((s) => s && { ...s, busy: true });
    later(650, () => setSheet((s) => s && { ...s, kind: "discover", busy: false, shown: 0 }));
    for (let i = 1; i <= 4; i++) later(650 + 750 + (i - 1) * 100, () => setSheet((s) => s && { ...s, shown: i }));
    later(650 + 750 + 300 + 100, () => setSheet((s) => s && { ...s, found: true }));
    later(650 + 750 + 300 + 150, () => setSheet((s) => s && { ...s, ready: true }));
  };
  const closeSheet = (apply: boolean) => {
    setSheet((s) => s && { ...s, out: true });
    later(170, () => {
      if (apply) setSheet((s) => { if (s) setServers((all) => all.map((v) => (v.id === "pages" ? { ...v, status: "connected", tools: s.tools } : v))); return null; });
      else setSheet(null);
    });
  };
  const retry = () => {
    setConnecting("watch");
    later(900, () => {
      setConnecting(null);
      setServers((all) => all.map((v) => (v.id === "watch" ? { ...v, status: "connected", tools: [
        { name: "list_issues", kind: "Read", tokens: 180, on: true }, { name: "get_event", kind: "Read", tokens: 180, on: true }, { name: "resolve", kind: "Write", tokens: 180, on: true },
      ] } : v)));
    });
  };
  const toggleTool = (id: string, name: string) =>
    setServers((all) => all.map((v) => (v.id === id ? { ...v, tools: v.tools.map((t) => (t.name === name ? { ...t, on: !t.on } : t)) } : v)));

  const dOn = sheet ? sheet.tools.slice(0, sheet.shown).filter((t) => t.on) : [];

  return (
    <div className="ms" data-ms="card">
      <div className="ms-head">
        <div className="ms-title">
          <h2><Sparkles size={18} strokeWidth={1.8} />MCP servers</h2>
          <button type="button" className="ms-btn" data-ms="add"><Plus size={16} />Add server</button>
        </div>
        <div className="ms-meterline">
          <span><b><Roll v={totalTools} /></b> tools · <b><Roll v={fmtTokens(totalTokens)} /></b> tokens of context</span>
          <span className="ms-dim">{fmtTokens(BUDGET).replace(".0", "")} budget</span>
        </div>
        <div className="ms-track">
          {servers.filter((s) => sum(s.tools) > 0).map((s) => (
            <span key={s.id} className="ms-seg" style={{ width: `${(sum(s.tools) / BUDGET) * 100}%` }} />
          ))}
        </div>
      </div>
      <ul className="ms-list" data-ms="list">
        {servers.map((s) => {
          const Icon = ICONS[s.icon];
          const total = s.tools.length, on = count(s.tools);
          const label = s.status === "connected" ? "Connected" : s.status === "signin" ? "Needs sign in" : "Error";
          const StatusIcon = s.status === "connected" ? CircleCheck : s.status === "signin" ? KeyRound : CircleAlert;
          return (
            <li key={s.id} className="ms-item" data-open={open === s.id} data-ms-item={s.id}>
              <div className="ms-row" role="button" tabIndex={0} onClick={() => s.tools.length && setOpen(open === s.id ? null : s.id)}
                onKeyDown={(e) => { if (e.key === "Enter" && s.tools.length) setOpen(open === s.id ? null : s.id); }}>
                <Icon className="ms-mark" strokeWidth={1.8} />
                <span className="ms-text">
                  <span className="ms-name">{s.name}</span>
                  <span className="ms-sub">
                    <span className={`ms-status ${s.status} ms-fade`} key={s.status}><StatusIcon size={14} />{label}</span>
                    <span>·</span><span>{s.transport}</span>
                  </span>
                </span>
                {s.status === "connected" && !connecting ? (
                  <span className="ms-meta ms-fade"><span>{on} of {total} tools</span><b><Roll v={fmtTokens(sum(s.tools))} /></b></span>
                ) : connecting === s.id ? (
                  <span className="ms-btn" style={{ width: 90, justifyContent: "center" }}><span className="ms-spin" style={{ borderColor: "#ddd8cd", borderTopColor: "#1d1b17" }} /></span>
                ) : s.status === "connected" ? (
                  <span className="ms-meta"><span>{on} of {total} tools</span><b>{fmtTokens(sum(s.tools))}</b></span>
                ) : (
                  <button type="button" className="ms-btn" data-ms={s.status === "signin" ? "signin" : "retry"}
                    onClick={(e) => { e.stopPropagation(); s.status === "signin" ? openSignin() : retry(); }}>
                    {s.status === "signin" ? <KeyRound size={16} /> : null}{s.status === "signin" ? "Sign in" : "Retry"}
                  </button>
                )}
                <ChevronDown size={16} className="ms-chev" style={{ opacity: s.tools.length ? 1 : 0.6 }} />
              </div>
              <div className="ms-body"><div>
                {s.tools.map((t) => (
                  <div className="ms-tool" key={t.name}>
                    <span className="ms-mono" style={{ color: t.on ? "var(--ink)" : "var(--muted)" }}>{t.name}</span>
                    <span className="ms-kind">{t.kind === "Read" ? <Eye size={14} /> : <Pencil size={14} color="#b4690e" />}{t.kind}</span>
                    <span className="ms-tok">{t.tokens}</span>
                    <Switch on={t.on} label={t.name} onClick={() => toggleTool(s.id, t.name)} />
                  </div>
                ))}
              </div></div>
            </li>
          );
        })}
      </ul>

      {sheet && (
        <>
          <div className={`ms-scrim ${sheet.out ? "out" : ""}`} />
          <div className={`ms-sheet ${sheet.out ? "out" : ""}`} data-ms="sheet">
            <div className="ms-sh-head">{sheet.kind === "signin" ? "Sign in to Pagewise" : "Pagewise"}
              <button type="button" className="ms-x" aria-label="Close" onClick={() => closeSheet(false)}><X size={16} /></button></div>
            <div className="ms-sh-body">
              {sheet.kind === "signin" ? (
                <div className="ms-auth">
                  <span className="ms-chip"><Info size={13} />Simulated sign in</span>
                  <div className="ms-pair"><BookOpen size={26} color="#1d1b17" strokeWidth={1.6} /><i /><ArrowLeftRight size={13} /><i /><Sparkles size={20} color="#1d1b17" /></div>
                  <p className="ms-h">Harbor agent wants to use your Pagewise account</p>
                  <span className="ms-acct"><span className="ms-av" /><b style={{ fontWeight: 500 }}>Ada Rowe</b><span style={{ color: "var(--muted)" }}>ada@harbor.dev</span></span>
                  <div className="ms-perms">This lets the agent
                    <div className="ms-perm"><Check size={15} />Search and read pages you share with it</div>
                    <div className="ms-perm"><Check size={15} />Create pages and add comments</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="ms-disc-head">
                    <BookOpen size={26} strokeWidth={1.6} />
                    <div>
                      <div className="t">{sheet.found ? <span className="ms-found" style={{ display: "flex", alignItems: "center", gap: 8 }}><CircleCheck size={15} color="#1f7a4d" />Found 4 tools</span> : <span className="ms-shimmer">Discovering tools</span>}</div>
                      <div className="u ms-mono">https://mcp.pagewise.example/mcp</div>
                    </div>
                  </div>
                  {sheet.tools.slice(0, sheet.shown).map((t) => (
                    <div className={`ms-drow ${t.on ? "" : "off"}`} key={t.name}>
                      <span className="ms-mono">{t.name}</span>
                      <span className="ms-kind">{t.kind === "Read" ? <Eye size={14} /> : <Pencil size={14} color="#b4690e" />}{t.kind}</span>
                      <span className="ms-tok">{t.tokens}</span>
                      <Switch on={t.on} label={t.name} onClick={() => setSheet((s) => s && { ...s, tools: s.tools.map((x) => (x.name === t.name ? { ...x, on: !x.on } : x)) })} />
                    </div>
                  ))}
                  {sheet.shown < 4 && <div className="ms-skel"><i /><u /></div>}
                </div>
              )}
            </div>
            <div className="ms-sh-foot">
              {sheet.kind === "signin" ? <span>No Pagewise account is contacted.</span>
                : <span><b style={{ color: "var(--ink)", fontWeight: 500 }}><Roll v={dOn.length} /></b> on · <b style={{ color: "var(--ink)", fontWeight: 500 }}><Roll v={sum(dOn)} /></b> tokens</span>}
              <div className="ms-foot-r">
                {sheet.kind === "signin" ? (
                  <>
                    <button type="button" className="ms-ghost" onClick={() => closeSheet(false)}>Cancel</button>
                    <button type="button" className={`ms-primary${sheet.busy ? " busy" : ""}`} data-ms="authorize" onClick={authorize} aria-busy={sheet.busy}><span className={sheet.busy ? "ms-lbl-out" : ""} style={{ gridArea: "1/1" }}>Authorize</span>{sheet.busy && <span className="ms-spin ms-spin-in" style={{ gridArea: "1/1" }} />}</button>
                  </>
                ) : (
                  <button type="button" className="ms-primary" data-ms="done" disabled={!sheet.ready} onClick={() => closeSheet(true)}>Done</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function McpServers() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const replay = () => setRun((n) => n + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  useEffect(() => {
    if (new URLSearchParams(location.search).get("autoplay") === "0") return;
    const ts: number[] = [];
    const click = (sel: string) => (document.querySelector(sel) as HTMLElement | null)?.click();
    const at = (ms: number, fn: () => void) => ts.push(window.setTimeout(fn, ms));
    at(1400, () => click("[data-ms=signin]"));
    at(2900, () => click("[data-ms=authorize]"));
    at(6300, () => click("[data-ms=done]"));
    at(7600, () => click("[data-ms=retry]"));
    at(10800, () => setRun((n) => n + 1));
    const stop = () => ts.forEach(clearTimeout);
    window.addEventListener("pointerdown", stop, { once: true });
    return () => { stop(); window.removeEventListener("pointerdown", stop); };
  }, [run]);
  return <Card key={run} />;
}
