import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock, Copy, Globe, Lock, Paperclip, Sparkle, Users, X } from "lucide-react";
import clsx from "clsx";
import "./share-chat.css";

type Vis = "me" | "team" | "any";
const VIS: Vis[] = ["me", "team", "any"];
const LABEL: Record<Vis, string> = { me: "Only me", team: "Workspace", any: "Anyone" };
const ICON = { me: Lock, team: Users, any: Globe };
const HELP: Record<Vis, string> = { me: "Only you can open this chat.", team: "People in Harbor Lane can view it.", any: "Anyone with the link can view it." };
const URL = "harborlane.app/share/4tq8m1xe";
const EXPIRY = ["Never", "1 day", "7 days", "30 days"];

/** Keeps the previously active key around so it can exit in the opposite direction to the entering one. */
function useActive<T>(value: T) {
  const [prev, setPrev] = useState<T | null>(null);
  const last = useRef(value);
  if (last.current !== value) { setPrev(last.current); last.current = value; }
  return (k: T) => (k === value ? "active" : k === prev ? "prev" : "idle");
}

const param = (k: string) => { try { return new URLSearchParams(window.location.search).get(k); } catch { return null; } };
const autoplayEnabled = () => {
  return param("autoplay") !== "0";
};

export default function ShareChat() {
  const [vis, setVis] = useState<Vis>("any");
  const [files, setFiles] = useState(true);
  const [expiry, setExpiry] = useState("7 days");
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [quiet, setQuiet] = useState(false); // demo copies leave the footer caption alone, as the reference does
  const timer = useRef<number>(0);
  const state = useActive(vis);
  
  const off = vis === "me";

  const flashCopied = useCallback((quiet?: boolean) => {
    setQuiet(!!quiet);
    setCopied(true); setFailed(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }, []);

  const doCopy = async () => {
    stop();
    if (off) return;
    try { await navigator.clipboard.writeText("https://" + URL); flashCopied(false); }
    catch { setFailed(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setFailed(false), 2400); }
  };

  // Demo loop (12 s): files off, Copied, Only me, Workspace, Copied, Anyone, expiry 7 days. Any interaction stops it.
  const demoOn = useRef(autoplayEnabled());
  useEffect(() => {
    if (!demoOn.current) return;
    const ids: number[] = [];
    const lag = Number(param("delay")) || 0; // capture-phase alignment only
    const t0 = performance.now();
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(() => demoOn.current && fn(), Math.max(0, ms - (performance.now() - t0))));
    const cycle = (base: number) => {
      at(base + 1200, () => setFiles(false));
      at(base + 2400, () => flashCopied(true));
      at(base + 4600, () => setVis("me"));
      at(base + 6800, () => { setVis("team"); setExpiry("Never"); setFiles(true); });
      at(base + 8400, () => flashCopied(true));
      at(base + 10600, () => setVis("any"));
      at(base + 12000, () => { setExpiry("7 days"); cycle(base + 12000); });
    };
    cycle(lag + 50);
    return () => ids.forEach(window.clearTimeout);
  }, [flashCopied]);
  const stop = () => { demoOn.current = false; };

  useEffect(() => { if (off) setMenu(false); }, [off]);
  const idx = VIS.indexOf(vis);
  const captionKey = failed ? "f" : copied && !quiet ? "c" : "n";

  return (
    <div className="sc-root">
      <div className="sc-wrap">
        <section className="sc-card">
          <header className="sc-head">
            <div>
              <h3>Share chat</h3>
              <p>Holiday menu pricing · Nova 2</p>
            </div>
            <button className="sc-x" aria-label="Close"><X size={16} /></button>
          </header>

          <div className="sc-seg" role="radiogroup" aria-label="Who can open">
            <span className="sc-pill" style={{ transform: `translateX(calc(${idx} * (100% + 4px)))` }} />
            {VIS.map((v) => {
              const I = ICON[v];
              return (
                <button key={v} role="radio" aria-checked={vis === v} onClick={() => { stop(); setVis(v); }}>
                  <I size={14} /> <span>{LABEL[v]}</span>
                </button>
              );
            })}
          </div>

          <div className="sc-help">
            <div className="sc-stack y">
              {VIS.map((v) => <p key={v} data-s={state(v)} style={{ margin: 0 }}>{HELP[v]}</p>)}
            </div>
          </div>

          <div className={clsx("sc-link", off && "off")}>
            <span className="ico">{off ? <Lock size={16} /> : vis === "team" ? <Users size={16} /> : <Globe size={16} />}</span>
            <div className="sc-url">
              <div className="sc-stack x">
                {VIS.map((v) => (
                  <span key={v} data-s={state(v)} className={v === "me" ? "muted" : ""} style={{ whiteSpace: "nowrap" }}>
                    {v === "me" ? "Link sharing is off" : URL}
                  </span>
                ))}
              </div>
            </div>
            <button className={clsx("sc-copy", off && "off", copied && "copied")} onClick={doCopy} aria-label="Copy link" disabled={off}>
              <span className="lab"><Copy size={14} />Copy</span>
              <span className="done">
                <svg className="sc-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg>
                Copied
              </span>
            </button>
          </div>

          <div className="sc-opts">
            <div className="sc-row">
              <span className="l" style={{ opacity: off ? 0.5 : 1 }}><Clock size={16} />Link expires</span>
              <div className="sc-sel">
                <button aria-expanded={menu} disabled={off} onClick={() => { stop(); setMenu((m) => !m); }}>
                  <span className="sc-xf">{EXPIRY.map((e) => <span key={e} data-on={e === expiry}>{e}</span>)}</span><ChevronDown size={14} />
                </button>
                <div className={clsx("sc-menu", menu && "open")} role="menu">
                  {EXPIRY.map((e) => (
                    <button key={e} role="menuitemradio" aria-checked={e === expiry} onClick={() => { setExpiry(e); setMenu(false); }}>
                      {e}{e === expiry && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sc-row">
              <span className="l"><Paperclip size={16} />Include 2 files</span>
              <button className="sc-sw" role="switch" aria-checked={files && !off} disabled={off} onClick={() => { stop(); setFiles((f) => !f); }} aria-label="Include files"><i /></button>
            </div>
          </div>

          <div className="sc-prev">
            <p>Preview</p>
            <ul style={{ opacity: off ? 0.55 : 1 }}>
              <li>
                <span className="sc-av" style={{ background: "#7c6a8f" }}>MR</span>
                <div><div className="who">Maya Reyes</div><div className="txt">Can you price the holiday menu so the oat milk lattes still clear a 70% margin?</div></div>
              </li>
              <li>
                <span className="sc-av ai"><Sparkle size={13} /></span>
                <div><div className="who">Nova 2</div><div className="txt">Yes. At this month's oat milk cost, a 12 oz latte needs to sell for $5.40 to keep a 70% margin. Here's the full menu with the new prices.</div></div>
              </li>
            </ul>
          </div>
        </section>
        <div className="sc-cap">
          <div className="sc-stack y">
            <span data-s={captionKey === "n" ? "active" : "idle"} style={{ display: "block" }}>Copy the link or change who can open it.</span>
            <span data-s={captionKey === "c" ? "active" : "idle"} style={{ display: "block" }}>Copied {URL}</span>
            <span data-s={captionKey === "f" ? "active" : "idle"} style={{ display: "block" }}>Couldn't copy. Select the link and copy it.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
