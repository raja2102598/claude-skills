import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Image as ImageIcon, Mic, RotateCcw, Type, Video, FileText, Wrench, Brain, type LucideIcon } from "lucide-react";
import { BENCH_LABEL, BENCH_NOTE, CAPS, MODELS, VOL_MAX, VOL_MIN, fmtK, money, monthly, pages, type Bench, type Model } from "./model";
import "./model-stats.css";

/*
 * Model card, motion-faithful to Arc UI "Model card" (see .reanimate/model-stats/spec.md).
 * Switching models cross-fades every field in place (100 ms out, 150 ms in after 40 ms, quint-out) after a short
 * lookup; the card never changes size. The volume slider rolls the cost estimate, benchmark bars re-rank on tab
 * change, Compare cross-fades to a side-by-side table with the better values marked, Reload shows a pulsing skeleton.
 */

const ICON: Record<string, LucideIcon> = { Text: Type, Image: ImageIcon, PDF: FileText, Audio: Mic, Video, Tools: Wrench, Reasoning: Brain };
const LOOKUP_MS = 40;
const RELOAD_MS = 1300;
const BENCHES: Bench[] = ["swe", "gpqa", "term"];

/* A swap cross-fades whenever `k` changes: the old content fades out above the new one. */
function Swap({ k, children, className }: { k: string; children: ReactNode; className?: string }) {
  const [prev, setPrev] = useState<{ k: string; node: ReactNode } | null>(null);
  const last = useRef({ k, node: children });
  if (last.current.k !== k) {
    setPrev(last.current);
    last.current = { k, node: children };
  } else last.current.node = children;
  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 110);
    return () => clearTimeout(t);
  }, [prev]);
  return (
    <div className={`ms-swapwrap ${className ?? ""}`}>
      <div className={prev ? "ms-in" : ""} key={k}>
        {children}
      </div>
      {prev && (
        <div className="ms-out" key={"o" + prev.k}>
          {prev.node}
        </div>
      )}
    </div>
  );
}

function Mark({ m, size = 38 }: { m: Model; size?: number }) {
  const g = [
    <path key="0" d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke={m.hue} strokeWidth="2.2" strokeLinecap="round" />,
    <path key="1" d="M3 19L12 4l9 15z" fill={m.hue} />,
    <g key="2" fill="none" stroke={m.hue} strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" fill={m.hue} /></g>,
    <rect key="3" x="4" y="4" width="16" height="16" rx="4" transform="rotate(45 12 12)" fill={m.hue} />,
  ][m.glyph];
  return (
    <svg className="ms-mark" style={{ width: size, height: size }} viewBox="0 0 24 24" aria-hidden>
      {g}
    </svg>
  );
}

/* number tween: cubic-out over 420 ms, JS-driven so it runs on any clock */
function useTween(target: number, ms = 420) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const from = cur.current;
    if (from === target) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - t0) / ms);
      cur.current = from + (target - from) * (1 - Math.pow(1 - x, 3));
      setV(cur.current);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

const compactMoney = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const fmtVol = (v: number) => (v >= 1000 ? `${v / 1000}B` : `${Math.round(v)}M`);

function Segmented<T extends string>({ items, value, onChange, className }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [box, setBox] = useState({ x: 0, w: 0 });
  useEffect(() => {
    const el = refs.current[value];
    if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
  }, [value]);
  useEffect(() => {
    const el = refs.current[value];
    if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
  }, []); // eslint-disable-line
  return (
    <div className={`ms-seg ${className ?? ""}`} role="tablist">
      <span className="pill" style={{ transform: `translateX(${box.x - 3}px)`, width: box.w, left: 3 }} />
      {items.map((it) => (
        <button key={it.id} ref={(e) => { refs.current[it.id] = e; }} role="tab" aria-selected={value === it.id} data-on={value === it.id} data-t={"seg-" + it.id} onClick={() => onChange(it.id)}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Details({ m, vol, setVol, bench, setBench }: { m: Model; vol: number; setVol: (v: number) => void; bench: Bench; setBench: (b: Bench) => void }) {
  const est = useTween(monthly(m, vol));
  const ctxPct = Math.max(6, (m.context / 1000) * 100);
  const rows = [...MODELS].sort((a, b) => b.bench[bench] - a.bench[bench]).slice(0, 3);
  const shown = rows.some((r) => r.id === m.id) ? rows : [...rows.slice(0, 2), m].sort((a, b) => b.bench[bench] - a.bench[bench]);
  const maxScore = 100;
  return (
    <>
      <p className="ms-sum">{m.summary}</p>
      <ul className="ms-chips" style={{ listStyle: "none", margin: 0, padding: 0, paddingBottom: 14 }}>
        {CAPS.map((c) => {
          const I = ICON[c];
          return (
            <li key={c} className="ms-chip" data-on={m.caps[c]}>
              <I size={13} />
              {c}
            </li>
          );
        })}
      </ul>
      <div className="ms-sec" style={{ height: 120 }}>
        <div className="ms-grid3">
          <Spec label="Context window" value={fmtK(m.context)} unit=" tokens" />
          <Spec label="Max output" value={fmtK(m.maxOut)} unit=" tokens" />
          <Spec label="Knowledge cutoff" value={m.cutoff} />
        </div>
        <div className="ms-ctx">
          <div className="ms-track"><div className="ms-fill" style={{ width: `${ctxPct}%` }} /></div>
          <span className="ms-note">Fits about {pages(m.context).toLocaleString("en-US")} pages</span>
        </div>
      </div>
      <div className="ms-sec" style={{ height: 168 }}>
        <div className="ms-grid3">
          <Spec label="Input per 1M" value={money(m.priceIn)} />
          <Spec label="Output per 1M" value={money(m.priceOut)} />
          <Spec label="Cached per 1M" value={money(m.priceCache)} />
        </div>
        <div className="ms-vol">
          <div className="ms-volcol">
            <div className="ms-volrow"><span>Monthly volume</span><span>{fmtVol(vol)} tokens</span></div>
            <input
              className="ms-range"
              type="range"
              min={VOL_MIN}
              max={VOL_MAX}
              step={5}
              value={vol}
              aria-label="Monthly token volume"
              style={{ ["--p" as string]: `${((vol - VOL_MIN) / (VOL_MAX - VOL_MIN)) * 100}%` }}
              onChange={(e) => setVol(+e.target.value)}
              data-t="volume"
            />
          </div>
          <div className="ms-est">
            <div className="ms-lab">Estimated cost</div>
            <b>{compactMoney(est)}<small> /mo</small></b>
          </div>
        </div>
      </div>
      <div className="ms-sec" style={{ borderBottom: 0, height: 172 }}>
        <div className="ms-bh">
          <h4>Benchmarks</h4>
          <Segmented className="ms-seg2" value={bench} onChange={setBench} items={BENCHES.map((b) => ({ id: b, label: BENCH_LABEL[b] }))} />
        </div>
        <div className="ms-rows">
          {MODELS.map((r) => {
            const idx = shown.findIndex((s) => s.id === r.id);
            const visible = idx >= 0;
            return (
              <div key={r.id} className="ms-row" data-self={r.id === m.id} style={{ transform: `translateY(${(visible ? idx : 3) * 36}px)`, opacity: visible ? 1 : 0, transition: "transform 480ms var(--ease), opacity 150ms var(--ease)" }}>
                <span className="n"><i style={{ background: r.hue }} />{r.name}</span>
                <span className="t"><span className="f" style={{ width: `${(r.bench[bench] / maxScore) * 100}%` }} /></span>
                <span className="s">{r.bench[bench].toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
        <div className="ms-bnote">{BENCH_NOTE[bench]}</div>
      </div>
    </>
  );
}

function Spec({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <div className="ms-lab">{label}</div>
      <div className="ms-val">{value}{unit && <small>{unit}</small>}</div>
    </div>
  );
}

function Compare({ a, b, setRival }: { a: Model; b: Model; setRival: (id: string) => void }) {
  const bestHigh = (x: number, y: number) => (x === y ? 0 : x > y ? 1 : -1);
  const rows: { label: string; va: string; vb: string; win: number }[] = [
    { label: "Context", va: fmtK(a.context), vb: fmtK(b.context), win: bestHigh(a.context, b.context) },
    { label: "Max output", va: fmtK(a.maxOut), vb: fmtK(b.maxOut), win: bestHigh(a.maxOut, b.maxOut) },
    { label: "Input / 1M", va: money(a.priceIn), vb: money(b.priceIn), win: -bestHigh(a.priceIn, b.priceIn) },
    { label: "Output / 1M", va: money(a.priceOut), vb: money(b.priceOut), win: -bestHigh(a.priceOut, b.priceOut) },
    ...BENCHES.map((k) => ({ label: BENCH_LABEL[k], va: a.bench[k].toFixed(1) + "%", vb: b.bench[k].toFixed(1) + "%", win: bestHigh(a.bench[k], b.bench[k]) })),
    { label: "Modalities", va: `${Object.values(a.caps).filter(Boolean).length} of 7`, vb: `${Object.values(b.caps).filter(Boolean).length} of 7`, win: bestHigh(Object.values(a.caps).filter(Boolean).length, Object.values(b.caps).filter(Boolean).length) },
  ];
  const Ck = () => (<span className="ck"><Check strokeWidth={4} /></span>);
  return (
    <div className="ms-cmp">
      <div className="ms-rival">
        <span>Compare with</span>
        <Segmented className="ms-seg2" value={b.id} onChange={setRival} items={MODELS.filter((x) => x.id !== a.id).map((x) => ({ id: x.id, label: x.name }))} />
      </div>
      <div className="ms-table">
        <div className="ms-tr h">
          <span className="rl">Model</span>
          {[a, b].map((m) => (
            <span className="c" key={m.id}><Mark m={m} size={24} /><span><b style={{ fontWeight: 600, display: "block", lineHeight: "16px" }}>{m.name}</b><span className="rl">{m.maker}</span></span></span>
          ))}
        </div>
        {rows.map((r) => (
          <div className="ms-tr" key={r.label}>
            <span className="rl">{r.label}</span>
            <span className={`c ${r.win === 1 ? "win" : ""}`}>{r.va}{r.win === 1 && <Ck />}</span>
            <span className={`c ${r.win === -1 ? "win" : ""}`}>{r.vb}{r.win === -1 && <Ck />}</span>
          </div>
        ))}
      </div>
      <div className="ms-legend"><span className="ms-tr" style={{ display: "contents" }}><span className="c"><Ck /></span></span>Better value. Lower is better for prices.</div>
    </div>
  );
}

function Skeleton() {
  const B = ({ w, h, style }: { w: number | string; h: number; style?: React.CSSProperties }) => <span className="ms-bone" style={{ width: w, height: h, ...style }} />;
  return (
    <div className="ms-skel" aria-hidden>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 0 }}>
        <B w={38} h={38} style={{ borderRadius: 11 }} />
        <div style={{ display: "grid", gap: 8 }}><B w={150} h={14} /><B w={90} h={11} /></div>
      </div>
      <div style={{ marginTop: 34, display: "grid", gap: 8 }}><B w="92%" h={13} /><B w="55%" h={13} /></div>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>{[70, 80, 62, 70, 70, 74, 96].map((w, i) => <B key={i} w={w} h={28} style={{ borderRadius: 99 }} />)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 34 }}>{[0, 1, 2].map((i) => <div key={i} style={{ display: "grid", gap: 8 }}><B w={90} h={11} /><B w={70} h={16} /></div>)}</div>
      <B w="100%" h={4} style={{ marginTop: 20 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 46 }}>{[0, 1, 2].map((i) => <div key={i} style={{ display: "grid", gap: 8 }}><B w={90} h={11} /><B w={50} h={16} /></div>)}</div>
      <B w="100%" h={4} style={{ marginTop: 40 }} />
      <div style={{ display: "grid", gap: 18, marginTop: 70 }}>{[0, 1, 2].map((i) => <B key={i} w="100%" h={10} />)}</div>
    </div>
  );
}

export default function ModelStats() {
  const [id, setId] = useState("nova");
  const [shownId, setShownId] = useState("nova");
  const [vol, setVol] = useState(100);
  const [bench, setBench] = useState<Bench>("swe");
  const [cmp, setCmp] = useState(false);
  const [rival, setRival] = useState("orbit");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);
  const auto = useRef(true);

  const m = MODELS.find((x) => x.id === shownId)!;
  const rv = MODELS.find((x) => x.id === (rival === shownId ? MODELS.find((x) => x.id !== shownId)!.id : rival))!;

  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };
  const pick = useCallback((next: string) => {
    setId(next);
    later(() => {
      setShownId(next);
      setRival((r) => (r === next ? MODELS.find((x) => x.id !== next)!.id : r));
    }, LOOKUP_MS);
  }, []);
  const reload = () => {
    setLoading(true);
    later(() => setLoading(false), RELOAD_MS);
  };
  const copy = () => {
    setCopied(true);
    later(() => setCopied(false), 1400);
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* autoplay: pick a model, drag the volume, change benchmark, compare, reload; loops until the user touches it */
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get("autoplay") === "0") return;
    auto.current = true;
    let dead = false;
    const wait = (ms: number) => new Promise<void>((r) => { const t = window.setTimeout(r, ms); timers.current.push(t); });
    const drag = (to: number, ms: number) => new Promise<void>((r) => {
      let from = 0; setVol((v) => (from = v, v));
      const t0 = performance.now();
      const tick = (n: number) => { const x = Math.min(1, (n - t0) / ms); const e = 1 - Math.pow(1 - x, 3); setVol(Math.round((from + (to - from) * e) / 5) * 5); if (x < 1 && !dead) requestAnimationFrame(tick); else r(); };
      requestAnimationFrame(tick);
    });
    (async () => {
      await wait(1600);
      while (!dead && auto.current) {
        pick("atlas"); await wait(1900); if (dead) break;
        await drag(340, 1100); await wait(700);
        setBench("gpqa"); await wait(1400);
        setBench("term"); await wait(1400);
        setCmp(true); await wait(2200);
        setRival("quill"); await wait(2000);
        setCmp(false); await wait(1200);
        pick("orbit"); await wait(1900);
        await drag(60, 900); await wait(800);
        reload(); await wait(RELOAD_MS + 1400);
        pick("nova"); await wait(1500);
        setBench("swe"); await drag(100, 700); await wait(1800);
      }
    })();
    const stop = () => { auto.current = false; dead = true; };
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("keydown", stop, { once: true });
    window.addEventListener("wheel", stop, { once: true });
    const onReplay = () => setRun((n) => n + 1);
    window.addEventListener("reanimate:replay", onReplay);
    return () => { dead = true; window.removeEventListener("reanimate:replay", onReplay); window.removeEventListener("pointerdown", stop); window.removeEventListener("keydown", stop); window.removeEventListener("wheel", stop); };
  }, [pick, run]);

  const user = <T extends unknown[]>(fn: (...a: T) => void) => (...a: T) => { auto.current = false; fn(...a); };

  return (
    <div className="ms" data-stage-root>
      <div className="ms-tabs">
        <Segmented value={id} onChange={user(pick)} items={MODELS.map((x) => ({ id: x.id, label: x.name }))} />
        <button className="ms-reload" onClick={user(reload)} data-t="reload"><RotateCcw size={14} />Reload</button>
      </div>
      <article className="ms-card" aria-label={`${m.name} model card`}>
        <header className="ms-head">
          <Swap k={m.id} className="ms-ident">
            <div className="ms-ident" style={{ width: 380 }}>
              <Mark m={m} />
              <div><h3 className="ms-name" style={{ margin: 0 }}>{m.name}</h3><div className="ms-maker">{m.maker}</div></div>
            </div>
          </Swap>
          <label className="ms-sw">
            <button role="switch" aria-checked={cmp} className="ms-switch" onClick={user(() => setCmp((c) => !c))} data-t="compare" aria-label="Compare" />
            Compare
          </label>
        </header>
        <div className="ms-body">
          <Swap k={cmp ? "c-" + rv.id + m.id : "m-" + m.id}>
            {cmp ? <Compare a={m} b={rv} setRival={user(setRival)} /> : <Details m={m} vol={vol} setVol={user(setVol)} bench={bench} setBench={user(setBench)} />}
          </Swap>
        </div>
        <footer className="ms-foot">
          <Swap k={m.id}><code>{m.slug}</code></Swap>
          <button className="ms-btn" onClick={user(copy)} data-t="copy">
            <span style={{ position: "relative", width: 14, height: 14, display: "inline-block" }}>
              <Copy size={14} style={{ position: "absolute", inset: 0, opacity: copied ? 0 : 1, transition: "opacity 150ms var(--ease)" }} />
              <Check size={14} style={{ position: "absolute", inset: 0, opacity: copied ? 1 : 0, transition: "opacity 150ms var(--ease)" }} />
            </span>
            {copied ? "Copied" : "Copy model id"}
          </button>
        </footer>
        {loading && <Skeleton />}
      </article>
    </div>
  );
}
