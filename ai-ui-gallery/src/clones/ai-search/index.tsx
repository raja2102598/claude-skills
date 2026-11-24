import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  ArrowDown, ArrowUp, Asterisk, Clock, Copy, CornerDownLeft, FileText, Hexagon, Search, Sparkles, Triangle, X, Zap,
} from "lucide-react";
import { A, B, RECENT, SUGGESTED, tokenize, type Cite, type Script } from "./data";
import "./ai-search.css";

/*
 * AI search bar. One scripted loop (18 s) driven by a single clock, so the virtual clock and the real one agree:
 *   0.30  recent + suggested questions appear
 *   1.07  the query types (25 ms per character); from 2 characters grouped results list under an "Ask AI" row
 *   2.45  Tab: the answer card replaces the Ask row (thinking skeleton, spinning mark)
 *   3.25  the answer streams one token per frame, each fading in over 150 ms; a citation lights its result's badge
 *   done+0.1  "Writing" becomes "4 sources", copy goes live
 *   9.35  reset to recents; 10.0 the first suggested question is selected; 10.77 Enter runs it (same sequence)
 *   18.0  loop
 * See .reanimate/ai-search/spec.md.
 */
const PERIOD = 18000;
const TYPE_START = 1070;
const TYPE_MS = 25;
const TOKEN_MS = 13.5;
const DONE_LAG = 100;
const START_OFFSET = 0;

interface Run { script: Script; ask: number; thinkEnd: number; reset: number; typed: boolean }
const RUNS: Run[] = [
  { script: A, ask: 2450, thinkEnd: 3250, reset: 9350, typed: true },
  { script: B, ask: 10770, thinkEnd: 11550, reset: 18000, typed: false },
];
const TOKENS = new Map<Script, ReturnType<typeof tokenize>>([[A, tokenize(A.answer)], [B, tokenize(B.answer)]]);

function esc(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function Hl({ text, query }: { text: string; query: string }) {
  const terms = query.trim().split(/\s+/).filter((w) => w.length > 0).map(esc);
  if (!terms.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(\\b(?:${terms.join("|")}))`, "i"));
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <mark key={i} className="as-hl">{p}</mark> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

function useClock() {
  const [t, setT] = useState(0);
  // the capture starts the loop clock at navigation; mounting at about 0.4 s there is already counted in the script times
  const t0 = useRef(performance.now() - START_OFFSET);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      flushSync(() => setT(performance.now() - t0.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

const ICON = { size: 17, strokeWidth: 1.6 } as const;

function CustomerIcon({ i, color }: { i: number; color: string }) {
  const p = { size: 17, strokeWidth: 0, fill: color, color } as const;
  return i === 0 ? <Triangle {...p} /> : i === 1 ? <Hexagon {...p} /> : <Zap {...p} />;
}

function Card({ script, since, thinkEnd, now }: { script: Script; since: number; thinkEnd: number; now: number }) {
  const toks = TOKENS.get(script)!;
  const writing = now >= thinkEnd;
  const shown = writing ? Math.min(toks.length, Math.floor((now - thinkEnd) / TOKEN_MS) + 1) : 0;
  const done = writing && now >= thinkEnd + toks.length * TOKEN_MS + DONE_LAG;
  void since;
  return (
    <div className="as-card">
      <div className="as-card-head">
        <Asterisk size={16} strokeWidth={2.4} className={"as-mark" + (done ? "" : " spin")} />
        <b>AI answer</b>
        <span className="as-state">
          {done ? <i key="d">4 sources</i> : <i key={writing ? "w" : "t"}>{writing ? "Writing" : "Thinking"}</i>}
        </span>
        <span className="as-card-tools">
          <Copy size={14} strokeWidth={1.6} className={done ? "" : "dim"} />
          <X size={14} strokeWidth={1.6} />
        </span>
      </div>
      {!writing ? (
        <div className="as-skel">
          <span style={{ width: "84%" }} />
          <span style={{ width: "54%" }} />
        </div>
      ) : (
        <div className="as-text">
          {toks.slice(0, shown).map((k, i) =>
            k.kind === "cite" ? (
              <span key={i} className="as-cite">{k.text}</span>
            ) : k.kind === "code" ? (
              <Fragment key={i}><span className="as-code">{k.text}</span>{" "}</Fragment>
            ) : (
              <Fragment key={i}><span className="as-w">{k.text}</span>{" "}</Fragment>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function citeRevealed(script: Script, n: Cite, now: number, thinkEnd: number) {
  const toks = TOKENS.get(script)!;
  const idx = toks.findIndex((k) => k.kind === "cite" && k.n === n);
  return now >= thinkEnd + idx * TOKEN_MS;
}

export default function AiSearch() {
  const t = useClock();
  const tt = t % PERIOD;
  const fade = Math.max(0, Math.min(1, (t - 100) / 380)); // the card fades in over ~0.4 s

  const run = tt < RUNS[0].reset ? RUNS[0] : RUNS[1];
  const base = run === RUNS[0] ? 0 : RUNS[0].reset;
  const s = run.script;
  const inAnswer = tt >= run.ask;

  let query = "";
  let mode: "recent" | "search" | "answer" = "recent";
  let selected = 0;
  if (inAnswer) { mode = "answer"; query = s.query; }
  else if (run.typed && tt >= TYPE_START) {
    const n = Math.min(s.query.length, Math.floor((tt - TYPE_START) / TYPE_MS) + 1);
    query = s.query.slice(0, n);
    mode = n >= 2 ? "search" : "recent";
  } else if (!run.typed) {
    selected = tt >= base + 650 ? 3 : 0; // first suggested question takes over the highlight
  }

  const full = query.length >= s.query.length;
  const docs = useMemo(() => {
    const d = [...s.docs];
    if (!full) [d[1], d[2]] = [d[2], d[1]];
    return d;
  }, [s, full]);

  const rowBadge = (key: string) => {
    if (mode !== "answer") return null;
    const n = (Object.keys(s.cites) as unknown as Cite[]).filter((k) => s.cites[k] === key && citeRevealed(s, k, tt, run.thinkEnd))[0];
    return n ? <span className="as-badge">{n}</span> : null;
  };

  return (
    <div className="as-root" style={{ opacity: fade }}>
      <div className="as-field">
        <Search size={17} strokeWidth={1.6} />
        <div className={"as-input" + (query ? "" : " ph")}>{query || "Search docs, customers and issues"}</div>
        {query ? <span className="as-clear"><X size={15} strokeWidth={1.6} /></span> : null}
      </div>
      <div className="as-body">
        <div className="as-list">
          {mode === "recent" ? (
            <>
              <div className="as-head">Recent</div>
              {[run === RUNS[1] ? RECENT[0] : RECENT[0], RECENT[1], RECENT[2]].map((r, i) => (
                <div key={r} className={"as-row" + (selected === i ? " on" : "")}>
                  <Clock {...ICON} />
                  <span className="as-title">{r}</span>
                  <span className="as-grow" />
                  {selected === i ? <CornerDownLeft size={15} strokeWidth={1.5} color="#8f887d" /> : null}
                </div>
              ))}
              <div className="as-head">Ask AI</div>
              {SUGGESTED.map((r, i) => (
                <div key={r} className={"as-row" + (selected === i + 3 ? " on" : "")}>
                  <Sparkles {...ICON} />
                  <span className="as-title">{r}</span>
                  <span className="as-grow" />
                  {selected === i + 3 ? <CornerDownLeft size={15} strokeWidth={1.5} color="#8f887d" /> : null}
                </div>
              ))}
            </>
          ) : (
            <>
              {mode === "answer" ? (
                <Card script={s} since={run.ask} thinkEnd={run.thinkEnd} now={tt} />
              ) : (
                <div className="as-row faint">
                  <Sparkles {...ICON} />
                  <span className="as-title" style={{ color: "#5d574e", fontWeight: 400 }}>Ask AI about “{query}”</span>
                  <span className="as-grow" />
                  <span className="as-kbd">Tab</span>
                </div>
              )}
              <div className="as-head">Docs</div>
              {docs.map((d, i) => {
                const key = "doc" + s.docs.indexOf(d);
                return (
                  <div key={d.title} className={"as-row" + (i === 0 ? " on" : "")}>
                    <FileText {...ICON} />
                    <span><span className="as-title"><Hl text={d.title} query={query} /></span><span className="as-sub">{d.meta}</span></span>
                    <span className="as-grow" />
                    {rowBadge(key)}
                    <span className="as-right">Guide</span>
                  </div>
                );
              })}
              <div className="as-head">Customers</div>
              {s.customers.map((c, i) => (
                <div key={c.title} className="as-row">
                  <CustomerIcon i={i} color={c.color} />
                  <span><span className="as-title">{c.title}</span><span className="as-sub">{c.meta}</span></span>
                  <span className="as-grow" />
                  {rowBadge("cust" + i)}
                  <span className="as-right">{c.right}</span>
                </div>
              ))}
              <div className="as-head">Issues</div>
              {s.issues.map((c, i) => (
                <div key={c.title} className="as-row">
                  <Hexagon {...ICON} />
                  <span><span className="as-title">{c.title}</span><span className="as-sub">{c.meta}</span></span>
                  <span className="as-grow" />
                  {rowBadge("issue" + i)}
                  <span className="as-right">{c.right}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="as-foot">
        <span className="as-kbd"><ArrowUp size={12} /></span>
        <span className="as-kbd"><ArrowDown size={12} /></span>
        <span>Navigate</span>
        <span className="gap" />
        <span className="as-kbd">Enter</span>
        <span>Open</span>
        <span className="gap" />
        <span className="as-kbd">Tab</span>
        <span>Ask AI</span>
        <span className="as-model"><Asterisk size={15} strokeWidth={2.4} />Nova 2</span>
      </div>
    </div>
  );
}
