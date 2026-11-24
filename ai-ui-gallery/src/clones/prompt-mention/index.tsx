import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { ArrowUp, AtSign, CornerDownLeft, SquareSlash } from "lucide-react";
import { GROUP_LABEL, ITEMS, type Item, type Trigger } from "./data";
import "./prompt-mention.css";

/*
 * @-mention and context picker (motion-faithful clone, see .reanimate/prompt-mention/spec.md).
 * Type "@" for agents and people or "/" for commands: a list opens at the caret, narrows as you type, and a pick sits
 * in the text as a chip. Popover enter/exit, caption fade and highlight glide are CSS keyframes/transitions, so they
 * render the same on the real and the virtual clock. The gallery autoplays the reference's 12 s typing loop.
 */

const LINE = 24; // px, the composer's line height
const POP_GAP = 31; // px from the top of the anchor's line to the popover's top edge
const POP_MAX_LEFT = 200; // px, the popover's left edge never goes further right than this

/* ---------------------------------------------------------------------------------------------------------------- */
/* Demo: the reference's loop, 12.0 s. Each string is typed one character per 50 ms from its start time.            */
/* ---------------------------------------------------------------------------------------------------------------- */
const LOOP = 12000;
const CHAR = 50;
const SCRIPT: [number, string][] = [
  [50, "/"],
  [1200, "ch"],
  [2400, "ecklist"],
  [2750, " "],
  [3900, "the beta thread, then ask "],
  [5200, "@"],
  [6350, "Ve"],
  [7550, "sper"],
  [7750, " "],
  [8900, "to write a memo for "],
  [9900, "@Mar"],
  [11200, "lon"],
  [11350, " Hale"],
  [11600, " "],
];
const FRAMES: { t: number; v: string }[] = (() => {
  const out = [{ t: 0, v: "" }];
  let v = "";
  for (const [t0, s] of SCRIPT) {
    [...s].forEach((ch, i) => {
      v += ch;
      out.push({ t: t0 + i * CHAR, v });
    });
  }
  return out;
})();

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

/* ---------------------------------------------------------------------------------------------------------------- */
/* Parsing                                                                                                          */
/* ---------------------------------------------------------------------------------------------------------------- */
type Mention = { trigger: Trigger; start: number; query: string; matches: Item[]; exact: Item | null };

const lc = (s: string) => s.toLowerCase();

/** The trigger the caret is in, if any: "@" or "/" at a word start, a query without a trailing space, ≥ 1 match. */
function findMention(value: string, caret: number): Mention | null {
  for (let i = caret - 1; i >= 0; i--) {
    const ch = value[i];
    if (ch === "\n") return null;
    if (ch !== "@" && ch !== "/") continue;
    if (i > 0 && !/\s/.test(value[i - 1])) continue;
    const query = value.slice(i + 1, caret);
    if (query.endsWith(" ") || query.startsWith(" ")) return null;
    const q = lc(query);
    const matches = ITEMS.filter((it) => it.trigger === ch && lc(it.name).includes(q));
    if (!matches.length) return null;
    return { trigger: ch, start: i, query, matches, exact: matches.find((it) => lc(it.name) === q) ?? null };
  }
  return null;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const CHIP_RE = (() => {
  const names = (t: Trigger) =>
    ITEMS.filter((it) => it.trigger === t)
      .map((it) => it.name)
      .sort((a, b) => b.length - a.length)
      .map(escapeRe)
      .join("|");
  return new RegExp(`(^|\\s)(\\/(?:${names("/")})|@(?:${names("@")}))(?=\\s|$)`, "gi");
})();

type Chip = { start: number; end: number; kind: "cmd" | "mention" };
function findChips(value: string): Chip[] {
  const out: Chip[] = [];
  for (const m of value.matchAll(CHIP_RE)) {
    const start = (m.index ?? 0) + m[1].length;
    out.push({ start, end: start + m[2].length, kind: m[2][0] === "/" ? "cmd" : "mention" });
  }
  return out;
}

/* ---------------------------------------------------------------------------------------------------------------- */

type Phase = "closed" | "open" | "closing";
type Snapshot = { trigger: Trigger; matches: Item[]; start: number };

export default function PromptMention() {
  const uid = useId();
  const listId = `${uid}-list`;
  const optId = (i: number) => `${uid}-opt-${i}`;

  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [dismissed, setDismissed] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("closed");
  const [openKey, setOpenKey] = useState(0);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const [from, setFrom] = useState<CSSProperties | undefined>(undefined);
  const [outFrom, setOutFrom] = useState<CSSProperties | undefined>(undefined);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const snapshot = useRef<Snapshot | null>(null);
  const glideNext = useRef(false);
  const pendingCaret = useRef<number | null>(null);
  const demo = useRef({ on: autoplayEnabled(), raf: 0 });

  const mention = useMemo(() => {
    const m = findMention(value, caret);
    return m && m.start !== dismissed ? m : null;
  }, [value, caret, dismissed]);
  const isOpen = mention !== null;
  if (mention) snapshot.current = { trigger: mention.trigger, matches: mention.matches, start: mention.start };
  const shown = snapshot.current;
  const activeIdx = mention ? Math.min(active, mention.matches.length - 1) : active;

  const chips = useMemo(() => findChips(value), [value]);

  /* ---------- open / close (spec rows 3-7) ---------- */
  const readPop = () => {
    const el = popRef.current;
    if (!el) return null;
    const cs = getComputedStyle(el);
    const m = /matrix\(([^)]+)\)/.exec(cs.transform);
    const [a, , , , , f] = m ? m[1].split(",").map(Number) : [1, 0, 0, 1, 0, 0];
    return { o: Number(cs.opacity), s: a, y: f };
  };
  useLayoutEffect(() => {
    if (isOpen && phase !== "open") {
      // A list that reopens while its exit is still running starts from where the exit left it.
      const cur = phase === "closing" ? readPop() : null;
      setFrom(cur ? ({ "--pm-o0": cur.o, "--pm-s0": cur.s, "--pm-y0": `${cur.y}px` } as CSSProperties) : undefined);
      setOpenKey((k) => k + 1);
      setPhase("open");
    } else if (!isOpen && phase === "open") {
      const cur = readPop();
      setOutFrom(cur ? ({ "--pm-o1": cur.o, "--pm-s1": cur.s, "--pm-y1": `${cur.y}px` } as CSSProperties) : undefined);
      setPhase("closing");
    }
  }, [isOpen, phase]);

  // A new query puts the highlight back on the first row.
  const queryKey = mention ? `${mention.start}:${mention.query}` : "";
  useLayoutEffect(() => {
    setActive(0);
  }, [queryKey]);

  /* ---------- anchor at the caret (spec row 8) ---------- */
  const anchorIdx = mention ? (mention.exact ? caret : mention.start) : -1;
  const anchorEnd = !!mention?.exact;
  useLayoutEffect(() => {
    if (!mention) return;
    const box = measureRef.current;
    const node = box?.firstChild;
    if (!box || !node || node.nodeType !== Node.TEXT_NODE) return;
    const len = node.textContent?.length ?? 0;
    const i = anchorEnd ? Math.max(0, anchorIdx - 1) : anchorIdx;
    if (i >= len) return;
    const range = document.createRange();
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const r = range.getClientRects()[0] ?? range.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const k = b.width / box.offsetWidth || 1;
    const x = ((anchorEnd ? r.right : r.left) - b.left) / k;
    const line = Math.max(0, Math.floor(((r.top + r.bottom) / 2 - b.top) / k / LINE));
    const scroll = inputRef.current?.scrollTop ?? 0;
    const next = { x: Math.min(Math.max(0, Math.round(x * 10) / 10), POP_MAX_LEFT), y: line * LINE + POP_GAP - scroll };
    setAnchor((prev) => {
      if (prev && prev.x === next.x && prev.y === next.y) return prev;
      // The list jumped while open: the highlight glides in from where it was on screen.
      const hl = hlRef.current;
      if (prev && hl && phase === "open") {
        hl.style.setProperty("--pm-fx", `${prev.x - next.x}px`);
        hl.style.setProperty("--pm-fy", `${prev.y - next.y}px`);
        hl.classList.remove("pm-hl-flip");
        void hl.offsetWidth;
        hl.classList.add("pm-hl-flip");
      }
      return next;
    });
  });

  /* ---------- highlight row ---------- */
  useLayoutEffect(() => {
    const hl = hlRef.current;
    const list = listRef.current;
    if (!hl || !list) return;
    const row = list.querySelector<HTMLElement>(`[data-row="${activeIdx}"]`);
    if (!row) return;
    if (glideNext.current) hl.setAttribute("data-glide", "");
    else hl.removeAttribute("data-glide");
    glideNext.current = false;
    hl.style.transform = `translateY(${row.offsetTop}px)`;
    hl.style.height = `${row.offsetHeight}px`;
    // Keep the active row in view.
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
  });

  /* ---------- caret restore after a pick ---------- */
  useLayoutEffect(() => {
    const at = pendingCaret.current;
    const el = inputRef.current;
    if (at === null || !el) return;
    pendingCaret.current = null;
    el.setSelectionRange(at, at);
  });

  /* ---------- editing ---------- */
  const stopDemo = useCallback(() => {
    if (!demo.current.on) return;
    demo.current.on = false;
    cancelAnimationFrame(demo.current.raf);
  }, []);

  const commit = (v: string, at: number, focus = true) => {
    setValue(v);
    setCaret(at);
    setDismissed(null);
    pendingCaret.current = at;
    if (focus) inputRef.current?.focus({ preventScroll: true });
  };

  const pick = (item: Item) => {
    if (!mention) return;
    const head = value.slice(0, mention.start) + item.trigger + item.name;
    const tail = value.slice(caret);
    const v = head + (tail.startsWith(" ") ? "" : " ") + tail;
    commit(v, head.length + 1);
  };

  const insertTrigger = (t: Trigger) => {
    stopDemo();
    const el = inputRef.current;
    const at = el ? el.selectionStart : value.length;
    const pre = value.slice(0, at);
    const lead = pre.length && !/\s$/.test(pre) ? " " : "";
    commit(pre + lead + t + value.slice(at), at + lead.length + 1);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (mention) {
      const n = mention.matches.length;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        glideNext.current = true;
        setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + n) % n);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        pick(mention.matches[activeIdx]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setDismissed(mention.start);
        return;
      }
    }
    // Backspace right after a chip (or the space after it) removes the whole chip.
    const el = e.currentTarget;
    if (e.key === "Backspace" && el.selectionStart === el.selectionEnd) {
      const at = el.selectionStart;
      const chip = chips.find((c) => c.end === at || (c.end === at - 1 && value[at - 1] === " "));
      if (chip) {
        e.preventDefault();
        commit(value.slice(0, chip.start) + value.slice(at), chip.start);
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) commit("", 0);
    }
  };

  /* ---------- gallery autoplay: the reference's loop, any real input ends it ---------- */
  useEffect(() => {
    if (!demo.current.on) return;
    const t0 = performance.now();
    let last = "";
    const tick = (now: number) => {
      if (!demo.current.on) return;
      const p = (now - t0) % LOOP;
      let v = "";
      for (const f of FRAMES) {
        if (f.t > p) break;
        v = f.v;
      }
      if (v !== last) {
        last = v;
        flushSync(() => {
          setValue(v);
          setCaret(v.length);
          setDismissed(null);
        });
      }
      demo.current.raf = requestAnimationFrame(tick);
    };
    demo.current.raf = requestAnimationFrame(tick);
    const onUser = (e: Event) => {
      if (e.isTrusted) stopDemo();
    };
    window.addEventListener("pointerdown", onUser, true);
    window.addEventListener("keydown", onUser, true);
    return () => {
      cancelAnimationFrame(demo.current.raf);
      window.removeEventListener("pointerdown", onUser, true);
      window.removeEventListener("keydown", onUser, true);
    };
  }, [stopDemo]);

  /* ---------- render ---------- */
  const mirror: ReactNode[] = [];
  let pos = 0;
  chips.forEach((c, i) => {
    if (c.start > pos) mirror.push(value.slice(pos, c.start));
    mirror.push(
      <span key={i} className={`pm-chip pm-chip--${c.kind}`}>
        {value.slice(c.start, c.end)}
      </span>,
    );
    pos = c.end;
  });
  if (pos < value.length) mirror.push(value.slice(pos));

  const empty = value.length === 0;

  return (
    <div className="pm-root">
      <div className="pm-fit">
        <div className="pm-col">
          <div className="pm-card" data-pm-card>
            <div className="pm-field">
              <div className="pm-text" aria-hidden="true">
                {mirror}
                {"​"}
              </div>
              <div className="pm-measure" ref={measureRef} aria-hidden="true">
                {value + "​"}
              </div>
              <textarea
                ref={inputRef}
                className="pm-input"
                data-pm-input
                rows={2}
                value={value}
                placeholder="Write a message, @ to tag, / for actions"
                aria-label="Message"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls={listId}
                aria-activedescendant={isOpen ? optId(activeIdx) : undefined}
                onChange={(e) => {
                  stopDemo();
                  setValue(e.target.value);
                  setCaret(e.target.selectionStart);
                  setDismissed(null);
                }}
                onSelect={(e) => setCaret(e.currentTarget.selectionStart)}
                onKeyDown={onKeyDown}
                onBlur={() => mention && setDismissed(mention.start)}
                onFocus={() => setDismissed(null)}
                onScroll={(e) => {
                  const t = e.currentTarget.scrollTop;
                  const m = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLElement | null;
                  if (m) m.scrollTop = t;
                }}
              />

              {phase !== "closed" && shown && anchor && (
                <div
                  key={openKey}
                  ref={popRef}
                  className="pm-pop"
                  data-pm-pop
                  data-state={phase}
                  style={{ left: anchor.x, top: anchor.y, ...(phase === "open" ? from : outFrom) }}
                  onAnimationEnd={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (phase === "closing") setPhase("closed");
                  }}
                >
                  <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    aria-label={GROUP_LABEL[shown.trigger]}
                    className="pm-list"
                  >
                    <div ref={hlRef} className="pm-hl" aria-hidden="true" />
                    {shown.matches.map((item, i) => {
                      const head = i === 0 || shown.matches[i - 1].group !== item.group;
                      const on = i === activeIdx;
                      return (
                        <Fragment key={item.id}>
                          {head && (
                            <li role="presentation" className="pm-group">
                              {item.group}
                            </li>
                          )}
                          <li
                            id={optId(i)}
                            role="option"
                            aria-selected={on}
                            className="pm-option"
                            data-row={i}
                            onPointerDown={(e) => e.preventDefault()}
                            onPointerMove={() => {
                              if (i !== activeIdx) {
                                glideNext.current = true;
                                setActive(i);
                              }
                            }}
                            onClick={() => pick(item)}
                          >
                            <span className="pm-icon">{item.icon}</span>
                            <span className="pm-label">
                              <span className="pm-name">
                                {item.trigger === "/" ? "/" : ""}
                                {item.name}
                              </span>
                              <span className="pm-sub">{item.sub}</span>
                            </span>
                            {on && <CornerDownLeft className="pm-enter" size={16} strokeWidth={1.5} aria-hidden="true" />}
                          </li>
                        </Fragment>
                      );
                    })}
                  </ul>
                  <div className="pm-foot" aria-hidden="true">
                    ↑↓ navigate · ↵ insert · esc dismiss
                  </div>
                </div>
              )}
            </div>

            <div className="pm-bar">
              <button type="button" className="pm-tool" aria-label="Mention an agent or a person" onClick={() => insertTrigger("@")}>
                <AtSign size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button type="button" className="pm-tool" aria-label="Run a command" onClick={() => insertTrigger("/")}>
                <SquareSlash size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <span className="pm-hint" data-hidden={empty || isOpen || undefined}>
                @ to tag · / for actions
              </span>
              <button
                type="button"
                className="pm-send"
                aria-label="Send"
                disabled={!value.trim()}
                onClick={() => {
                  stopDemo();
                  commit("", 0);
                }}
              >
                <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="pm-caption" data-pm-caption data-hidden={isOpen || undefined}>
            Picks sit in the text as chips; Backspace takes one back out.
          </p>
        </div>
      </div>
    </div>
  );
}
