import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Gauge, Layers } from "lucide-react";
import clsx from "clsx";
import {
  EFFORTS,
  FEATURED,
  MORE,
  VENDORS,
  VendorMark,
  effortLabel,
  modelById,
  type EffortId,
  type Model,
  type VendorId,
} from "./models";
import "./model-selector.css";

/*
 * Motion constants, measured from the reference (.reanimate/model-selector/spec.md).
 * - Menu open/close, chevron, pill colours, highlight fade and every swap fade/lift are CSS keyframes or transitions
 *   (model-selector.css): they behave the same on the real and the virtual clock.
 * - The highlight glide, the pill width and the page height run on motion values (motion's JS frame loop), with the
 *   reference's critically damped spring (omega 26/s, fitted to the trace with rms 0.002).
 */
const SPRING = { type: "spring", stiffness: 676, damping: 52, mass: 1 } as const;
const INSTANT = { duration: 0 } as const;
// Gallery autoplay: the same sequence the capture scripts (t relative to the open).
const DEMO = { openAt: 900, row2: 700, row3: 1100, select: 1500 };

type Page = "main" | "effort" | "more";
type MenuState = "closed" | "open" | "closing";

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

/* ------------------------------------------------------------------------------------------------------------------ */
/* Swap: cross-fades a slot when its key changes. The old layer fades out in 100 ms, the new one fades in over 150 ms   */
/* while it lifts by `lift` px (or pops from 0.9 scale). Both stay in one grid cell, so the slot never jumps.          */
/* ------------------------------------------------------------------------------------------------------------------ */
type Layer = { id: number; k: string; node: ReactNode; phase: "rest" | "in" | "out" };

function Swap({
  k,
  children,
  as: Tag = "span",
  className,
  lift = 3,
  pop = false,
  current,
}: {
  k: string;
  children: ReactNode;
  as?: "span" | "p";
  className?: string;
  lift?: number;
  pop?: boolean;
  /** data-* attributes for the current layer only (capture tracking). */
  current?: Record<string, string>;
}) {
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, k, node: children, phase: "rest" }]);
  const ids = useRef(1);
  const shown = useRef<ReactNode>(children);
  useLayoutEffect(() => {
    setLayers((ls) => {
      const top = ls[ls.length - 1];
      if (top.k === k) return ls;
      const old = ls
        .filter((l) => l.k !== k)
        .map((l) => (l === top ? { ...l, node: shown.current, phase: "out" as const } : { ...l, phase: "out" as const }));
      return [...old, { id: ids.current++, k, node: null, phase: "in" }];
    });
  }, [k]);
  useLayoutEffect(() => {
    shown.current = children;
  });
  const style = { "--ms-lift": `${lift}px` } as CSSProperties;
  return (
    <>
      {layers.map((l, i) => {
        const isTop = i === layers.length - 1 && l.k === k;
        return (
          <Tag
            key={l.id}
            className={clsx(className, l.phase === "out" && "ms-out", l.phase === "in" && (pop ? "ms-in-pop" : "ms-in"))}
            style={style}
            aria-hidden={l.phase === "out" || undefined}
            {...(isTop ? current : undefined)}
            onAnimationEnd={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.animationName === "ms-out") setLayers((ls) => ls.filter((x) => x.id !== l.id));
            }}
          >
            {isTop ? children : l.node}
          </Tag>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------------------------------------------------------ */

export default function ModelSelector() {
  const reduce = useReducedMotion();
  const spring = reduce ? INSTANT : SPRING;

  const [modelId, setModelId] = useState(FEATURED[0].id);
  const [effort, setEffort] = useState<EffortId>("medium");
  const [menu, setMenu] = useState<MenuState>("closed");
  const [page, setPage] = useState<Page>("main");
  const [hl, setHl] = useState(-1);
  const [change, setChange] = useState<{ n: number; text: string } | null>(null);

  const model = modelById(modelId);

  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const entryEls = useRef<(HTMLElement | null)[]>([]);
  const actions = useRef<(() => void)[]>([]);
  const hlShown = useRef(false);
  const openedBy = useRef<"pointer" | "keyboard">("pointer");
  const demo = useRef<{ timers: number[] }>({ timers: [] });
  const changeN = useRef(0);
  const [kbd, setKbd] = useState(false);

  const textW = useMotionValue(0);
  const hlY = useMotionValue(0);
  const hlH = useMotionValue(0);
  const bodyH = useMotionValue<number | "auto">("auto");

  /* ---------- pill width (spec row 21) ---------- */
  const measure = () => Math.ceil(measureRef.current?.getBoundingClientRect().width ?? 0);
  const targetW = useRef(-1);
  useLayoutEffect(() => {
    const w = measure();
    if (targetW.current < 0) textW.set(w);
    else animate(textW, w, spring);
    targetW.current = w;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId, effort]);
  // The web font can land after the first measure: follow the hidden copy's size whenever it changes on its own.
  useEffect(() => {
    const el = measureRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const w = measure();
      if (w !== targetW.current) {
        targetW.current = w;
        textW.set(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- menu open / close ---------- */
  const openMenu = useCallback((by: "pointer" | "keyboard") => {
    openedBy.current = by;
    bodyH.set("auto");
    setPage("main");
    setHl(-1);
    setMenu("open");
  }, [bodyH]);

  const closeMenu = useCallback((refocus = false) => {
    setHl(-1);
    setMenu((m) => (m === "open" ? "closing" : m));
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  }, []);
  // Like the reference, focus goes back to the pill as the menu starts to close (if it was inside the menu).
  useLayoutEffect(() => {
    if (menu === "closing" && menuRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [menu]);

  useEffect(() => {
    if (menu !== "open") return;
    menuRef.current?.focus({ preventScroll: true });
    const onDown = (e: PointerEvent) => {
      if (!anchorRef.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [menu, closeMenu]);

  /* ---------- selection ---------- */
  const selectModel = useCallback(
    (m: Model) => {
      if (m.id !== modelId) {
        changeN.current += 1;
        setChange({ n: changeN.current, text: `Switched from ${model.name}` });
        setModelId(m.id);
      }
      closeMenu(openedBy.current === "keyboard");
    },
    [modelId, model.name, closeMenu],
  );

  const selectEffort = useCallback(
    (id: EffortId) => {
      if (id !== effort) {
        changeN.current += 1;
        setChange({ n: changeN.current, text: `Effort changed from ${effortLabel(effort)}` });
        setEffort(id);
      }
      closeMenu(openedBy.current === "keyboard");
    },
    [effort, closeMenu],
  );

  /* ---------- pages (in-menu, height springs) ---------- */
  const goPage = useCallback(
    (p: Page) => {
      const h = bodyRef.current?.offsetHeight;
      if (h) bodyH.set(h);
      setHl(-1);
      setPage(p);
    },
    [bodyH],
  );
  const pageMounted = useRef(false);
  useLayoutEffect(() => {
    if (menu !== "open") {
      pageMounted.current = false;
      return;
    }
    if (!pageMounted.current) {
      pageMounted.current = true;
      return;
    }
    const to = listRef.current?.offsetHeight ?? 0;
    if (listRef.current) listRef.current.scrollTop = 0;
    animate(bodyH, to, { ...spring, onComplete: () => bodyH.set("auto") });
    if (openedBy.current === "keyboard") setHl(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, menu]);

  /* ---------- highlight (spec rows 6–8, 12) ---------- */
  useLayoutEffect(() => {
    const el = hl >= 0 ? entryEls.current[hl] : null;
    if (!el) {
      hlShown.current = false;
      return;
    }
    const y = el.offsetTop;
    const h = el.offsetHeight;
    if (!hlShown.current) {
      hlY.jump(y);
      hlH.jump(h);
      hlShown.current = true;
    } else {
      animate(hlY, y, spring);
      animate(hlH, h, spring);
    }
    if (openedBy.current === "keyboard") el.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hl, page]);

  /* ---------- gallery autoplay ---------- */
  const stopDemo = useCallback(() => {
    demo.current.timers.forEach((t) => window.clearTimeout(t));
    demo.current.timers = [];
  }, []);
  useEffect(() => {
    if (!autoplayEnabled()) return;
    const at = (ms: number, fn: () => void) => demo.current.timers.push(window.setTimeout(fn, ms));
    at(DEMO.openAt, () => openMenu("pointer"));
    at(DEMO.openAt + DEMO.row2, () => setHl(1));
    at(DEMO.openAt + DEMO.row3, () => setHl(2));
    at(DEMO.openAt + DEMO.select, () => {
      setHl(-1);
      changeN.current += 1;
      setChange({ n: changeN.current, text: `Switched from ${FEATURED[0].name}` });
      setModelId(FEATURED[2].id);
      setMenu((m) => (m === "open" ? "closing" : m));
    });
    const onUser = (e: Event) => {
      if (e.isTrusted) stopDemo();
    };
    window.addEventListener("pointerdown", onUser, true);
    window.addEventListener("keydown", onUser, true);
    return () => {
      stopDemo();
      window.removeEventListener("pointerdown", onUser, true);
      window.removeEventListener("keydown", onUser, true);
    };
  }, [openMenu, stopDemo]);

  /* ---------- keyboard ---------- */
  const onTriggerKey = (e: ReactKeyboardEvent) => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      if (menu === "open") return;
      openMenu("keyboard");
      const idx = FEATURED.findIndex((m) => m.id === modelId);
      setHl(idx >= 0 ? idx : 0);
    }
  };
  const onMenuKey = (e: ReactKeyboardEvent) => {
    const n = actions.current.length;
    openedBy.current = "keyboard";
    const move = (d: number) => setHl((h) => (h < 0 ? (d > 0 ? 0 : n - 1) : (h + d + n) % n));
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        e.preventDefault();
        setHl(0);
        break;
      case "End":
        e.preventDefault();
        setHl(n - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (hl >= 0) actions.current[hl]?.();
        break;
      case "ArrowRight":
        if (page === "main" && hl >= FEATURED.length) {
          e.preventDefault();
          actions.current[hl]?.();
        }
        break;
      case "ArrowLeft":
        if (page !== "main") {
          e.preventDefault();
          goPage("main");
        }
        break;
      case "Escape":
        e.preventDefault();
        if (page !== "main") goPage("main");
        else closeMenu(true);
        break;
      case "Tab":
        closeMenu();
        break;
    }
  };

  /* ---------- entries: every highlightable line registers its element and action by index ---------- */
  entryEls.current = [];
  actions.current = [];
  let count = 0;
  const entry = (action: () => void) => {
    const i = count++;
    actions.current[i] = action;
    return {
      ref: (el: HTMLElement | null) => {
        entryEls.current[i] = el;
      },
      "data-highlighted": hl === i ? "" : undefined,
      onPointerMove: (e: ReactPointerEvent) => {
        if (e.pointerType !== "mouse") return;
        openedBy.current = "pointer";
        if (hl !== i) setHl(i);
      },
      // Commit inside the event, as the reference's menu does, so the close starts on the click's own frame.
      onClick: () => flushSync(action),
    };
  };

  const backRow = (label: string) => (
    <div role="menuitem" className="ms-row is-back" {...entry(() => goPage("main"))}>
      <ChevronLeft className="ms-row-icon" aria-hidden />
      <span className="ms-row-label">{label}</span>
    </div>
  );

  let content: ReactNode;
  if (page === "main") {
    content = (
      <>
        <div role="group" aria-label="Featured models">
          {FEATURED.map((m) => (
            <div
              key={m.id}
              role="menuitemradio"
              aria-checked={m.id === modelId}
              className="ms-item"
              data-ms-item=""
              {...entry(() => selectModel(m))}
            >
              <VendorMark vendor={m.vendor} size={18} className="ms-item-mark" />
              <span className="ms-item-text">
                <span className="ms-item-name">{m.name}</span>
                <span className="ms-item-blurb">{m.blurb}</span>
              </span>
              {m.id === modelId && (
                <span className="ms-check">
                  <Check aria-hidden />
                </span>
              )}
            </div>
          ))}
        </div>
        <div role="separator" className="ms-separator" />
        <div role="menuitem" aria-haspopup="menu" className="ms-row" {...entry(() => goPage("effort"))}>
          <Gauge className="ms-row-icon" aria-hidden />
          <span className="ms-row-label">Effort</span>
          <span className="ms-row-value">{effortLabel(effort)}</span>
          <ChevronRight className="ms-row-chevron" aria-hidden />
        </div>
        <div role="menuitem" aria-haspopup="menu" className="ms-row" {...entry(() => goPage("more"))}>
          <Layers className="ms-row-icon" aria-hidden />
          <span className="ms-row-label">More models</span>
          <ChevronRight className="ms-row-chevron" aria-hidden />
        </div>
      </>
    );
  } else if (page === "effort") {
    content = (
      <>
        {backRow("Effort")}
        <div role="separator" className="ms-separator" />
        <div role="group" aria-label="Effort">
          {EFFORTS.map((ef) => (
            <div
              key={ef.id}
              role="menuitemradio"
              aria-checked={ef.id === effort}
              className="ms-item is-effort"
              {...entry(() => selectEffort(ef.id))}
            >
              <span className="ms-item-text">
                <span className="ms-item-name">
                  {ef.label}
                  {ef.isDefault && <span className="ms-item-default">Default</span>}
                </span>
                <span className="ms-item-blurb">{ef.blurb}</span>
              </span>
              {ef.id === effort && (
                <span className="ms-check">
                  <Check aria-hidden />
                </span>
              )}
            </div>
          ))}
        </div>
      </>
    );
  } else {
    const vendors = Object.keys(VENDORS) as VendorId[];
    content = (
      <>
        {backRow("More models")}
        <div role="separator" className="ms-separator" />
        {vendors.map((v) => {
          const list = MORE.filter((m) => m.vendor === v);
          if (!list.length) return null;
          return (
            <div key={v} role="group" aria-label={VENDORS[v]}>
              <div className="ms-group">{VENDORS[v]}</div>
              {list.map((m) => (
                <div
                  key={m.id}
                  role="menuitemradio"
                  aria-checked={m.id === modelId}
                  className="ms-row is-compact"
                  {...entry(() => selectModel(m))}
                >
                  <VendorMark vendor={m.vendor} size={16} className="ms-compact-mark" />
                  <span className="ms-compact-name">{m.name}</span>
                  {m.tag && <span className="ms-tag">{m.tag}</span>}
                  {m.id === modelId && (
                    <span className="ms-check">
                      <Check aria-hidden />
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </>
    );
  }

  const effortText = effortLabel(effort);

  return (
    <div
      className="ms-root"
      data-kbd={kbd ? "" : undefined}
      onKeyDownCapture={() => setKbd(true)}
      onPointerDownCapture={() => setKbd(false)}
    >
      <div className="ms-column" data-ms-column="">
        <div className="ms-anchor" ref={anchorRef}>
          <button
            ref={triggerRef}
            type="button"
            className="ms-trigger"
            data-ms-trigger=""
            data-state={menu === "open" ? "open" : "closed"}
            aria-haspopup="menu"
            aria-expanded={menu === "open"}
            aria-label={`Model: ${model.name}, ${effortText.toLowerCase()} effort. Change model`}
            onPointerDown={(e) => {
              if (e.button !== 0 || e.ctrlKey) return;
              if (menu === "open") closeMenu();
              else {
                e.preventDefault();
                openMenu("pointer");
              }
            }}
            onKeyDown={onTriggerKey}
          >
            <span className="ms-trigger-mark" aria-hidden>
              <Swap k={model.id} pop className="ms-mark-layer">
                <VendorMark vendor={model.vendor} size={16} />
              </Swap>
            </span>
            <motion.span className="ms-trigger-text" style={{ width: textW }} data-ms-text="">
              <span className="ms-inner ms-measure" ref={measureRef} aria-hidden>
                <span className="ms-inner-name">{model.name}</span>
                <span className="ms-inner-effort">{effortText}</span>
              </span>
              <Swap k={`${model.id}|${effort}`} className="ms-inner" current={{ "data-ms-inner": "" }}>
                <span className="ms-inner-name">{model.name}</span>
                <span className="ms-inner-effort">{effortText}</span>
              </Swap>
            </motion.span>
            <ChevronDown className="ms-chevron" data-ms-chevron="" aria-hidden />
          </button>

          {menu !== "closed" && (
            <div
              ref={menuRef}
              role="menu"
              tabIndex={-1}
              aria-label="Choose a model"
              className="ms-menu"
              data-ms-menu=""
              data-state={menu === "open" ? "open" : "closed"}
              onKeyDown={onMenuKey}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget && e.animationName === "ms-menu-out") setMenu("closed");
              }}
            >
              <motion.div className="ms-body" ref={bodyRef} style={{ height: bodyH }}>
                <div
                  className="ms-list"
                  ref={listRef}
                  data-page={page}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setHl(-1);
                  }}
                >
                  <motion.span
                    className="ms-highlight"
                    data-ms-highlight=""
                    data-on={hl >= 0 ? "" : undefined}
                    style={{ y: hlY, height: hlH }}
                    aria-hidden
                  />
                  {content}
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <section className="ms-summary" aria-label="Selected model">
          <div className="ms-desc-slot">
            <Swap k={model.id} as="p" className="ms-desc" lift={4} current={{ "data-ms-desc": "" }}>
              {model.description}
            </Swap>
          </div>
          <dl className="ms-facts" data-ms-facts="">
            {[
              ["Context", model.context],
              ["Input", model.input],
              ["Output", model.output],
              ["Effort", effortText],
            ].map(([label, value]) => (
              <div key={label} className="ms-fact">
                <dt>{label}</dt>
                <dd>
                  <span className="ms-swap">
                    <Swap k={value}>{value}</Swap>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="ms-note">Prices per million tokens. Every price here is a sample value.</p>
          <div className="ms-change-slot" role="status" aria-live="polite">
            <Swap k={change ? String(change.n) : "none"} className="ms-change" lift={4} current={{ "data-ms-change": "" }}>
              {change && (
                <>
                  <Check aria-hidden />
                  {change.text}
                </>
              )}
            </Swap>
          </div>
        </section>
      </div>
    </div>
  );
}
