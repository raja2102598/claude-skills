import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Briefcase, Check, CornerDownLeft, Minimize2, Redo2, Smile, SpellCheck, Sparkles, Undo2, WandSparkles } from "lucide-react";
import clsx from "clsx";
import "./editor.css";
import { PARA_BEFORE, AFTER_PARAS, CHANGES, COMMANDS, OPS, TITLE, TOKS } from "./doc";

const ICONS = { Minimize2, WandSparkles, Smile, Briefcase, SpellCheck } as const;

// Timeline, ms. menuAt = menu starts to appear; the command is picked CLICK_AFTER later.
const CLICK_AFTER = 870;
const THINK = 980; // click -> first token
const STREAM = 1840; // first token -> review bar morph (2820 after the click, as measured on the reference)
const AUTO_ACCEPT = 4000; // review -> auto accept (autoplay only)
const RESET = 2800; // resolved -> restart
const LEAD = 700; // mount -> menu open

// Reveal time (ms after the click) of every token, per op of the diff. Measured on the reference
// on the virtual clock: one word per ~150 ms at first, then uneven bursts, deletions struck at the end.
const OP_TIMES: number[][] = [
  [983, 1117, 1200, 1283, 1450], // keep: Volunteers in the east ward
  [1729], // del has
  [1550], // ins have
  [1617, 1767, 1800, 1820, 1850], // keep: been asking for lanterns for
  [1883], // del over
  [1933, 1960], // keep: a year.
  [2133], // del Right now, if
  [2000], // ins Today,
  [2017], // keep a
  [2250], // keep family
  [2183], // ins who
  [2333, 2450, 2500], // keep loses the trail
  [2783], // del in the dusk parade,
  [2367, 2533, 2583], // ins mid parade loses
  [2633], // keep the
  [2683], // keep route
  [2783], // del just goes dark
  [2733], // keep and
  [2783], // del they have
  [2750], // ins has
  [2783, 2850], // keep to start
  [2800], // del over when ...
  [2800], // ins over.
];
const TOK_AT: number[] = (() => {
  const seen: Record<number, number> = {};
  return TOKS.map((t) => {
    const n = (seen[t.op] = (seen[t.op] ?? -1) + 1);
    const list = OP_TIMES[t.op];
    return list[Math.min(n, list.length - 1)];
  });
})();

type Status = "pending" | "accepted" | "rejected";

interface Clock { menuAt: number; clickAt: number | null; cmd: number; resolvedAt: number | null }

export default function AiInlineEdit() {
  const clock = useRef<Clock>({ menuAt: 0, clickAt: null, cmd: 0, resolvedAt: null });
  const [now, setNow] = useState(-1);
  const [, setVer] = useState(0);
  const [status, setStatus] = useState<Record<number, Status>>({});
  const [hover, setHover] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);
  const [top, setTop] = useState(260);
  const interacted = useRef(false);

  
  const replay = (lead = LEAD) => {
    clock.current = { menuAt: performance.now() + lead, clickAt: null, cmd: 0, resolvedAt: null };
    interacted.current = false;
    setStatus({});
    setHover(0);
  };

  useEffect(() => {
    (window as unknown as { __replay: typeof replay }).__replay = replay;
    replay();
    let raf = 0;
    const loop = () => {
      const t = performance.now();
      const c = clock.current;
      if (c.clickAt === null && t >= c.menuAt + CLICK_AFTER && !interacted.current) c.clickAt = c.menuAt + CLICK_AFTER;
      // autoplay accept
      if (c.clickAt !== null && c.resolvedAt === null && !interacted.current && t - c.clickAt >= THINK + STREAM + AUTO_ACCEPT) {
        c.resolvedAt = t;
        setStatus(Object.fromEntries(CHANGES.map((_, i) => [i, "accepted" as Status])));
      }
      if (c.resolvedAt !== null && !interacted.current && t - c.resolvedAt >= RESET) replay(300);
      flushSync(() => setNow(t));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const c = clock.current;
  const sinceMenu = now - c.menuAt;
  const sinceClick = c.clickAt === null ? -1 : now - c.clickAt;
  let phase: "idle" | "menu" | "think" | "stream" | "review" | "done" = "idle";
  if (c.resolvedAt !== null) phase = "done";
  else if (c.clickAt !== null && sinceClick >= THINK + STREAM) phase = "review";
  else if (c.clickAt !== null && sinceClick >= THINK) phase = "stream";
  else if (c.clickAt !== null) phase = "think";
  else if (sinceMenu >= 0) phase = "menu";

  const isShown = (i: number) => phase === "review" || phase === "done" || ((phase === "think" || phase === "stream") && sinceClick >= TOK_AT[i]);
  const dimming = phase === "think" || phase === "stream";
  const changeOf = useMemo(() => {
    const m: Record<number, number> = {};
    CHANGES.forEach((g, i) => g.forEach((o) => (m[o] = i)));
    return m;
  }, []);

  useLayoutEffect(() => {
    const p = para.current;
    if (p) setTop(p.offsetTop + p.offsetHeight + 7);
  });

  const resolve = (s: Status, idx?: number) => {
    interacted.current = true;
    const next: Record<number, Status> = { ...status };
    CHANGES.forEach((_, i) => {
      if (idx === undefined || i === idx) next[i] = s;
    });
    setStatus(next);
    if (CHANGES.every((_, i) => next[i] && next[i] !== "pending")) {
      c.resolvedAt = performance.now();
      setVer((v) => v + 1);
      window.setTimeout(() => { interacted.current = false; }, 0);
    }
  };

  const pick = (i: number) => {
    interacted.current = true;
    c.cmd = i;
    c.clickAt = performance.now();
    setVer((v) => v + 1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (phase === "menu") {
      if (e.key === "ArrowDown") { setHover((h) => (h + 1) % COMMANDS.length); e.preventDefault(); }
      if (e.key === "ArrowUp") { setHover((h) => (h + COMMANDS.length - 1) % COMMANDS.length); e.preventDefault(); }
      if (e.key === "Enter") { pick(hover); e.preventDefault(); }
    } else if (phase === "review") {
      if (e.key === "Enter") { resolve("accepted"); e.preventDefault(); }
      if (e.key === "Backspace") { resolve("rejected"); e.preventDefault(); }
    }
    if (e.key === "Escape") replay(0);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { replay(0); e.preventDefault(); }
  };

  const mode = phase === "menu" ? "m-menu" : phase === "think" || phase === "stream" ? "m-run" : phase === "review" ? "m-review" : phase === "done" ? "m-done" : "m-none";
  const justShown = phase === "menu" && sinceMenu < CLICK_AFTER + 400;
  const cmd = COMMANDS[c.cmd];
  const total = CHANGES.length;
  const open = CHANGES.filter((_, i) => (status[i] ?? "pending") === "pending").length;

  const renderPara = () => {
    // token index by op
    const out: React.ReactNode[] = [];
    if (phase === "idle" || phase === "menu") {
      OPS.forEach((o, i) => o.k !== "ins" && out.push(<span key={i} className="sel">{o.text}</span>));
      return out;
    }
    let idx = 0;
    TOKS.forEach((t, i) => {
      if (!isShown(i)) {
        if (t.k !== "ins") out.push(<span key={"t" + i} className="tok-dim">{t.text}</span>);
        return;
      }
      const s = status[changeOf[t.op]] ?? "pending";
      const key = idx++;
      if (t.k === "keep") out.push(<span key={"k" + i}>{t.text}</span>);
      else if (t.k === "del") {
        if (s !== "accepted") out.push(<span key={"k" + i} className="del">{t.text}</span>);
      } else if (s !== "rejected") out.push(<span key={"k" + i} className={s === "accepted" ? undefined : "ins"}>{t.text}</span>);
      void key;
    });
    return out;
  };

  const words = useMemo(() => {
    const p0 = OPS.filter((o) => o.k !== "ins").map((o) => o.text).join("");
    return [TITLE, PARA_BEFORE, p0, ...AFTER_PARAS].join(" ").split(/\s+/).length - TITLE.split(" ").length;
  }, []);

  return (
    <div className="aie" ref={root} data-stage tabIndex={0} onKeyDown={onKey} aria-label="Festival plan, editor">
      <header>
        <div className="doc-meta">
          <div className="avatar" />
          <div>
            <div className="doc-title">{TITLE}</div>
            <div className="doc-sub">Mara Ellison<span className="dot" />Saved</div>
          </div>
        </div>
        <div>
          <span className="hbtn"><Undo2 /></span>
          <span className="hbtn"><Redo2 /></span>
        </div>
      </header>
      <div className="page">
        <h1>{TITLE}</h1>
        <p>{PARA_BEFORE}</p>
        <p className="target" ref={para} contentEditable={false}>{renderPara()}</p>
        {AFTER_PARAS.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>

      <div
        className={clsx("layer", mode, justShown && "show")}
        style={{ top }}
        role="dialog"
        aria-label="Edit with AI"
      >
        <div className={clsx("lbody menu", phase === "menu" && "on")} aria-hidden={phase !== "menu"}>
          <div className="prompt-row"><Sparkles /><span>Ask AI to edit the selection</span><kbd>esc</kbd></div>
          <ul role="listbox" aria-label="Quick edits">
            {COMMANDS.map((m, i) => {
              const Ic = ICONS[m.icon];
              return (
                <li key={m.id} role="option" aria-selected={i === hover} className={i === hover ? "active" : ""} onMouseEnter={() => setHover(i)} onClick={() => pick(i)}>
                  <Ic /><span>{m.label}</span><CornerDownLeft className="enter" />
                </li>
              );
            })}
          </ul>
          <div className="menu-foot"><kbd>↑</kbd><kbd>↓</kbd> to choose, <kbd>↵</kbd> to run. Ctrl K opens this on any selection.</div>
        </div>
        <div className={clsx("lbody", (phase === "think" || phase === "stream") && "on")}>
          <div className="runrow"><span className="spin" /><span>{cmd.doing}</span><span className="stop"><i />Stop <kbd>esc</kbd></span></div>
        </div>
        <div className={clsx("lbody", phase === "review" && "on")}>
          <div className="reviewrow">
            <span className="num">{open} of {total} changes</span>
            <span className="rej" onClick={() => resolve("rejected")}>Reject all</span>
            <span className="btn-accept" onClick={() => resolve("accepted")}>Accept all <kbd>Ctrl ↵</kbd></span>
          </div>
        </div>
        <div className={clsx("lbody", phase === "done" && "on")}>
          <div className="resolved"><Check /><span>{Object.values(status).every((s) => s === "rejected") ? "Edit discarded" : "Edit applied"}</span></div>
        </div>
      </div>

      <footer>
        {phase === "review" ? (
          <span>Tab through changes, <kbd>↵</kbd> accept, <kbd>⌫</kbd> reject</span>
        ) : (
          <span>Select text and press <kbd>Ctrl K</kbd> to edit with AI</span>
        )}
        <span><span className="num">{words}</span> words</span>
      </footer>
    </div>
  );
}
