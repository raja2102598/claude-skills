import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Bookmark, BookmarkCheck, Check, Pencil, Plus, Search, Trash2, X, ArrowDown } from "lucide-react";
import { CATS, FRESH, SEED, type Cat, type Mem } from "./model";
import "./agent-memory.css";

/*
 * Agent memory, motion-faithful to Arc UI "Agent memory" (see .reanimate/agent-memory/spec.md).
 * Clicking the "memory updated" chip files a new memory in (row height opens, grey highlight fades, chip label
 * cross-fades, meter and counts move). Forgetting swaps the row for an undo strip with a 5 s ring, then collapses it.
 * Filters slide a pill; search replaces the filters with a field and marks matches; rows can be edited in place.
 * Everything is CSS transitions (grid-rows height, opacity), which also run on the virtual clock.
 */

type Status = "open" | "forgot" | "gone";
type Filter = "all" | Cat;
const FORGET_MS = 5000;
const METER_STEP = 5;

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

function Collapse({ open, children, slow }: { open: boolean; children: ReactNode; slow?: boolean }) {
  return (
    <div className="am-c" data-open={open} data-slow={slow}>
      <div className="am-ci">{children}</div>
    </div>
  );
}

function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function Switch({ on, onChange, label, descOn, descOff }: { on: boolean; onChange: () => void; label: string; descOn: string; descOff: string }) {
  return (
    <div className="am-setting">
      <div>
        <div className="am-label">{label}</div>
        <p className="am-desc">
          <span style={{ opacity: on ? 1 : 0 }}>{descOn}</span>
          <span style={{ opacity: on ? 0 : 1 }}>{descOff}</span>
        </p>
      </div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} className="am-sw" onClick={onChange} data-t="switch">
        <span className="am-thumb" />
      </button>
    </div>
  );
}

function AgentMemory({ onUser }: { onUser: () => void }) {
  const [mems, setMems] = useState<Mem[]>(SEED);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [entered, setEntered] = useState<Record<string, boolean>>({});
  const [fresh, setFresh] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [addText, setAddText] = useState("");
  const [pct, setPct] = useState(62);
  const [pill, setPill] = useState<"update" | "added" | "saved">("update");
  const [pillGone, setPillGone] = useState(false);
  const [saved, setSaved] = useState(true);
  const [history, setHistory] = useState(true);
  const timers = useRef<Record<string, number>>({});
  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [bg, setBg] = useState({ left: 0, width: 0, ready: false });
  const demo = useRef<{ api?: Record<string, () => void> }>({});

  const st = (id: string): Status => status[id] ?? "open";
  const matches = (m: Mem) => (filter === "all" || m.cat === filter) && (!q || m.text.toLowerCase().includes(q.toLowerCase()));
  const isOpen = (m: Mem) => st(m.id) !== "gone" && entered[m.id] !== false && matches(m);
  const count = (cat: Cat) => mems.filter((m) => m.cat === cat && st(m.id) === "open").length;

  useLayoutEffect(() => {
    const el = filterRefs.current[filter];
    if (el) setBg({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [filter]);
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const forget = useCallback((id: string) => {
    setStatus((s) => ({ ...s, [id]: "forgot" }));
    setPct((p) => p - METER_STEP);
    timers.current[id] = window.setTimeout(() => setStatus((s) => (s[id] === "forgot" ? { ...s, [id]: "gone" } : s)), FORGET_MS);
  }, []);
  const undo = (id: string) => {
    clearTimeout(timers.current[id]);
    setStatus((s) => ({ ...s, [id]: "open" }));
    setPct((p) => p + METER_STEP);
  };
  const addFresh = useCallback(() => {
    setMems((m) => (m.some((x) => x.id === FRESH.id) ? m : [FRESH, ...m]));
    setEntered((e) => ({ ...e, [FRESH.id]: false }));
    setPct((p) => p + 4);
    setFresh(FRESH.id);
    timers.current.enter = window.setTimeout(() => setEntered((e) => ({ ...e, [FRESH.id]: true })), 20);
    timers.current.saved = window.setTimeout(() => setPill("saved"), 30);
    timers.current.fresh = window.setTimeout(() => setFresh(null), 1650);
    /* measured on the reference: the chip leaves at +1.77 s and the list glides up by the chip's height */
    timers.current.gone = window.setTimeout(() => setPillGone(true), 1770);
  }, []);
  const commitAdd = () => {
    const text = addText.trim();
    setAdding(false);
    setAddText("");
    if (!text) return;
    const id = "n" + Math.random().toString(36).slice(2, 6);
    const cat: Cat = filter === "all" ? "about" : filter;
    setMems((m) => [...m, { id, cat, text, date: "Today" }]);
    setEntered((e) => ({ ...e, [id]: false }));
    setPct((p) => p + 3);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered((e) => ({ ...e, [id]: true }))));
  };
  const saveEdit = () => {
    if (editing && draft.trim()) setMems((m) => m.map((x) => (x.id === editing ? { ...x, text: draft.trim() } : x)));
    setEditing(null);
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setQ("");
  };

  demo.current.api = {
    pill: () => addFresh(),
    forget: () => forget("city"),
    filterPref: () => setFilter("preferences"),
    filterAll: () => setFilter("all"),
    openSearch: () => setSearchOpen(true),
    closeSearch,
  };
  (demo.current as { type?: (s: string) => void }).type = (s) => setQ(s);

  /* gallery autoplay: file a memory, forget one, filter, search, then restart */
  useEffect(() => {
    if (!autoplayEnabled()) return;
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(() => !stopped && fn(), ms));
    let stopped = false;
    const stop = () => {
      stopped = true;
      ids.forEach(clearTimeout);
      onUser();
    };
    const evs = ["pointerdown", "keydown", "wheel"] as const;
    evs.forEach((e) => document.addEventListener(e, stop, { once: true }));
    const api = () => demo.current.api!;
    const typeTo = (word: string, start: number) =>
      [...word].forEach((_, i) => at(start + i * 110, () => (demo.current as { type?: (s: string) => void }).type!(word.slice(0, i + 1))));
    at(1400, () => api().pill());
    at(4200, () => api().forget());
    at(6800, () => api().filterPref());
    at(9200, () => api().filterAll());
    at(10600, () => api().openSearch());
    typeTo("cello", 11200);
    at(13400, () => api().closeSearch());
    at(15600, () => window.dispatchEvent(new Event("reanimate:replay")));
    return () => {
      stopped = true;
      ids.forEach(clearTimeout);
      evs.forEach((e) => document.removeEventListener(e, stop));
    };
  }, [onUser]);

  const visibleAny = mems.some(isOpen);
  const userHit = () => onUser();

  return (
    <div className="am-card" data-card onPointerDownCapture={userHit}>
      <header className="am-head">
        <div>
          <h2 className="am-title">Memory</h2>
          <p className="am-sub">What your assistant remembers across chats</p>
        </div>
        <div className="am-meter" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Memory used">
          <span className="am-meterLabel">
            <b data-meter-num>{pct}%</b> full
          </span>
          <span className="am-track">
            <span className="am-fill" data-high={pct >= 90} style={{ transform: `scaleX(${pct / 100})` }} />
          </span>
        </div>
      </header>
      <div className="am-settings">
        <Switch on={saved} onChange={() => setSaved((v) => !v)} label="Reference saved memories" descOn="Uses and adds to the memories below" descOff="Paused. Nothing is read or added" />
        <Switch on={history} onChange={() => setHistory((v) => !v)} label="Reference chat history" descOn="Searches past chats when they help" descOff="Paused. Past chats stay unread" />
      </div>
      <section className="am-memories" aria-label="Saved memories">
        <div className="am-toolbar">
          <div className="am-filters" role="group" aria-label="Filter memories" data-hide={searchOpen}>
            <span className="am-bg" data-bg style={{ left: bg.left, width: bg.width, transition: bg.ready ? undefined : "none" }} />
            {[{ id: "all" as Filter, label: "All" }, ...CATS].map((c) => (
              <button
                key={c.id}
                type="button"
                data-value={c.id}
                className="am-filter"
                aria-pressed={filter === c.id}
                ref={(el) => {
                  filterRefs.current[c.id] = el;
                }}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="am-search" data-open={searchOpen}>
            <button type="button" className="am-searchBtn" aria-label="Search memories" data-t="search" onClick={() => setSearchOpen(true)}>
              <Search size={15} />
            </button>
            <input
              value={q}
              placeholder="Search memories"
              aria-label="Search memories"
              tabIndex={searchOpen ? 0 : -1}
              ref={(el) => {
                if (el && searchOpen && document.activeElement !== el && autoplayEnabled() === false) el.focus();
              }}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
            />
            <button type="button" className="am-searchClose" aria-label="Close search" onClick={closeSearch}>
              <X size={15} />
            </button>
          </div>
        </div>
        <Collapse open={!pillGone} slow>
          <div className="am-pillRow">
            <button type="button" className="am-pill" data-state={pill} data-t="pill" onClick={() => pill === "update" && addFresh()}>
              <span data-l="update">
                <Bookmark size={14} />
                <b>Memory updated</b>
                <i>Noted: you prefer tabs over spaces</i>
                <ArrowDown size={13} />
              </span>
              <span data-l="added">
                <BookmarkCheck size={14} />
                <b>Added</b>
                <i>you prefer tabs over spaces</i>
              </span>
              <span data-l="saved">
                <Check size={14} />
                Saved to Preferences
              </span>
            </button>
          </div>
        </Collapse>
        <div className="am-list" data-list>
          {CATS.map((c) => {
            const rows = mems.filter((m) => m.cat === c.id);
            const groupOpen = rows.some(isOpen);
            return (
              <Collapse key={c.id} open={groupOpen}>
                <div role="group" aria-label={c.label}>
                  <Collapse open={filter === "all"}>
                    <h3 className="am-gh" style={{ margin: 0 }}>
                      {c.label}
                      <span>{count(c.id)}</span>
                    </h3>
                  </Collapse>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {rows.map((m) => (
                      <li key={m.id} data-memory-id={m.id}>
                        <Collapse open={isOpen(m)}>
                          {editing === m.id ? (
                            <div className="am-edit">
                              <input
                                autoFocus
                                value={draft}
                                aria-label="Edit memory"
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => (e.key === "Enter" ? saveEdit() : e.key === "Escape" && setEditing(null))}
                              />
                              <div className="am-editRow">
                                <span>Enter to save, Esc to cancel</span>
                                <span className="am-editBtns">
                                  <button type="button" className="am-cancel" onClick={() => setEditing(null)}>
                                    Cancel
                                  </button>
                                  <button type="button" className="am-save" onClick={saveEdit}>
                                    Save
                                  </button>
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="am-row" data-fresh={fresh === m.id}>
                              {st(m.id) === "forgot" ? (
                                <div className="am-forgot">
                                  <span>Forgot “{m.text}”</span>
                                  <button type="button" className="am-undo" onClick={() => undo(m.id)}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" strokeWidth="1.5">
                                      <circle cx="6" cy="6" r="4" stroke="#d9d4c8" />
                                      <circle cx="6" cy="6" r="4" stroke="currentColor" transform="rotate(-90 6 6)" />
                                    </svg>
                                    Undo
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="am-text">
                                    <Mark text={m.text} q={q} />
                                  </p>
                                  <span className="am-meta">From a chat · {m.date}</span>
                                  <div className="am-acts">
                                    <button type="button" className="am-ib" data-focus="edit" aria-label={`Edit memory: ${m.text}`} onClick={() => { setEditing(m.id); setDraft(m.text); }}>
                                      <Pencil size={14} />
                                    </button>
                                    <button type="button" className="am-ib" data-focus="forget" aria-label={`Forget memory: ${m.text}`} onClick={() => forget(m.id)}>
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </Collapse>
                      </li>
                    ))}
                  </ul>
                </div>
              </Collapse>
            );
          })}
          <Collapse open={!visibleAny}>
            <div className="am-empty">No memories match “{q}”</div>
          </Collapse>
        </div>
        <div className="am-add">
          {adding ? (
            <>
              <Plus size={16} />
              <input
                autoFocus
                value={addText}
                placeholder="What should I remember?"
                onChange={(e) => setAddText(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? commitAdd() : e.key === "Escape" && setAdding(false))}
                onBlur={() => !addText && setAdding(false)}
              />
            </>
          ) : (
            <button type="button" onClick={() => setAdding(true)}>
              <Plus size={16} />
              Add memory
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

/** `?autoplay=0` turns the gallery demo off (used by the capture); `reanimate:replay` remounts. */
export default function AgentMemoryClone() {
  const [run, setRun] = useState(0);
  const noop = useCallback(() => {}, []);
  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);
  return (
    <div className="am-stage">
      <AgentMemory key={run} onUser={noop} />
    </div>
  );
}
