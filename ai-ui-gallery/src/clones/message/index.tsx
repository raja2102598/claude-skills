import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import { Check, CircleAlert, CircleCheck, Copy, LoaderCircle, Sparkle, ThumbsDown, ThumbsUp, X } from "lucide-react";
import "./message.css";

/*
 * Assistant message with copy and thumbs feedback, motion-faithful to Arc UI "Response feedback"
 * (see .reanimate/message/spec.md).
 * - Hover an action: the tint fades in over 150 ms (quint-out); after 250 ms a tooltip rises 3 px and scales from
 *   0.97 over 150 ms (expo-out). Pressing hides it (100 ms) and squeezes the button to 0.94.
 * - Copy: the copy glyph fades out (100 ms) and shrinks to 0.7 while a green check fades in and springs from 0.7
 *   to 1; it turns back after 1.8 s.
 * - Thumbs: the filled glyph fades in over 150 ms and a panel opens under the row. Its height is a critically damped
 *   spring (ω = 26 rad/s, ~300 ms to 99 %), its opacity a 150 ms quint-out fade. Thumbs down asks what missed the
 *   mark (reasons, a note, Cancel / Submit); thumbs up asks what worked (reasons, Skip → Send).
 * - Submit: the label hands over to a spinner for 700 ms, the form cross-fades to a thank-you (the height snaps),
 *   and 1.6 s later the panel folds shut with the same spring while focus returns to the thumb.
 */

// Every spring in the reference fits x(t) = 1 - (1 + ωt)e^(-ωt) with ω = 26 rad/s (stiffness 676, damping 52).
const OMEGA = 26;
const TIP_DELAY_MS = 250;
const SEND_MS = 700;
const THANKS_HOLD_MS = 1600;
const COPY_RESET_MS = 1800;
const VIEW_OUT_MS = 100;

/** The ω = 26 critically damped spring sampled into a CSS linear() easing over 360 ms. */
const SPRING_EASING = (() => {
  const ms = 360;
  const pts: string[] = [];
  for (let t = 0; t <= ms; t += 12) {
    const x = (OMEGA * t) / 1000;
    const p = t === ms ? 1 : 1 - (1 + x) * Math.exp(-x);
    pts.push(p.toFixed(4));
  }
  return `linear(${pts.join(", ")})`;
})();

type Rating = "up" | "down";
type Phase = "form" | "sending" | "error" | "thanks";

const REASONS: Record<Rating, string[]> = {
  down: ["Incorrect", "Unhelpful", "Too wordy", "Unsafe", "Other"],
  up: ["Correct", "Clear steps", "Useful commands", "Quick to act on"],
};

const REPLY_TEXT =
  "The new volume most likely has a lower IOPS ceiling, so the export now waits on the disk rather than the database.";

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

/* ------------------------------------------------------------------ helpers */

/** Copies text; falls back to a hidden textarea when the async clipboard is unavailable. Never throws. */
function copyText(text: string) {
  const fallback = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    } catch {
      /* nothing else to try */
    }
  };
  try {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(fallback);
    else fallback();
  } catch {
    fallback();
  }
}

/** Timers that are cleared on unmount. */
function useTimers() {
  const ids = useRef<number[]>([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    ids.current.push(id);
    return id;
  }, []);
}

/**
 * Keeps the last content of a keyed slot on screen for `ms` after the key changes, so it can fade out on top of
 * the new content without taking space.
 */
function useLeaving(key: string, node: ReactNode, ms: number) {
  const prev = useRef({ key, node });
  const [leaving, setLeaving] = useState<{ key: string; node: ReactNode }[]>([]);
  const timers = useRef<number[]>([]);
  const changed = prev.current.key !== key;
  useLayoutEffect(() => {
    if (prev.current.key !== key) {
      const old = prev.current;
      setLeaving((list) => [...list.filter((x) => x.key !== old.key && x.key !== key), old]);
      timers.current.push(window.setTimeout(() => setLeaving((list) => list.filter((x) => x !== old)), ms));
    }
    prev.current = { key, node };
  });
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return { leaving, changed };
}

/* ------------------------------------------------------------------ spring panel */

/**
 * A panel under the action row whose height follows a critically damped spring (ω = 26), stepped analytically on
 * requestAnimationFrame and written straight to the clip element, so it runs the same on the real clock and on a
 * virtual capture clock. It opens from 0 to the content height, snaps when the content changes while open (as the
 * reference does), and folds back to 0 before it unmounts.
 */
function SpringPanel({
  open,
  contentKey,
  onClosed,
  children,
}: {
  open: boolean;
  contentKey: string;
  onClosed: () => void;
  children: ReactNode;
}) {
  const clip = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const s = useRef({ x: 0, v: 0, target: 0, raf: 0, last: -1 });
  const closedCb = useRef(onClosed);
  closedCb.current = onClosed;

  const write = () => {
    if (clip.current) clip.current.style.height = `${s.current.x}px`;
  };

  const run = useCallback(() => {
    const st = s.current;
    cancelAnimationFrame(st.raf);
    st.last = -1;
    const step = (now: number) => {
      // the first frame only anchors the clock, like the reference (its spring moves from the second frame on)
      const dt = st.last < 0 ? 0 : Math.min(0.064, Math.max(0, (now - st.last) / 1000));
      st.last = now;
      const w = OMEGA;
      const e0 = st.x - st.target;
      const c = st.v + w * e0;
      const k = Math.exp(-w * dt);
      st.x = st.target + (e0 + c * dt) * k;
      st.v = (c - w * (e0 + c * dt)) * k;
      if (dt > 0 && Math.abs(st.x - st.target) < 0.05 && Math.abs(st.v) < 1) {
        st.x = st.target;
        st.v = 0;
        write();
        if (st.target === 0) closedCb.current();
        return;
      }
      write();
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
  }, []);

  // open / close
  useLayoutEffect(() => {
    const st = s.current;
    st.target = open ? inner.current!.offsetHeight : 0;
    run();
  }, [open, run]);

  // content changed while open: the height snaps to the new content
  const firstKey = useRef(true);
  useLayoutEffect(() => {
    if (firstKey.current) {
      firstKey.current = false;
      return;
    }
    if (!open) return;
    const st = s.current;
    cancelAnimationFrame(st.raf);
    st.target = inner.current!.offsetHeight;
    st.x = st.target;
    st.v = 0;
    write();
  }, [contentKey, open]);

  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);

  return (
    <div ref={clip} className="mf-clip" data-state={open ? "in" : "out"} data-mf="panel-clip">
      <div ref={inner} className="mf-pad">
        <div className="mf-panel">
          <div className="mf-panel-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tooltip + icon buttons */

type TipState = "hidden" | "in" | "out";

function useTooltip() {
  const [tip, setTip] = useState<TipState>("hidden");
  const timer = useRef(0);
  const clear = () => window.clearTimeout(timer.current);
  const hide = useCallback(() => {
    clear();
    setTip((t) => (t === "in" ? "out" : t));
    timer.current = window.setTimeout(() => setTip((t) => (t === "out" ? "hidden" : t)), 100);
  }, []);
  const show = useCallback((delay: number) => {
    clear();
    if (delay <= 0) setTip("in");
    else timer.current = window.setTimeout(() => setTip("in"), delay);
  }, []);
  useEffect(() => clear, []);
  return { tip, show, hide };
}

function IconAction({
  label,
  pressed,
  onPress,
  className,
  buttonRef,
  dataMf,
  extra,
  children,
}: {
  label: string;
  pressed?: boolean;
  onPress: () => void;
  className?: string;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  dataMf: string;
  extra?: Record<string, string>;
  children: ReactNode;
}) {
  const { tip, show, hide } = useTooltip();
  return (
    <span className="mf-icon-wrap">
      <button
        ref={buttonRef}
        type="button"
        className={`mf-icon-btn ${className ?? ""}`}
        aria-label={label}
        aria-pressed={pressed}
        data-mf={dataMf}
        onPointerEnter={(e) => e.pointerType === "mouse" && show(TIP_DELAY_MS)}
        onPointerLeave={hide}
        onPointerDown={hide}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible") || e.currentTarget.dataset.returnFocus) show(0);
          delete e.currentTarget.dataset.returnFocus;
        }}
        onBlur={hide}
        onClick={onPress}
        {...extra}
      >
        {children}
      </button>
      {tip !== "hidden" && (
        <span className="mf-tip" role="tooltip" data-state={tip} data-mf="tooltip">
          {label}
        </span>
      )}
    </span>
  );
}

function CopyAction({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [animated, setAnimated] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const press = () => {
    copyText(text);
    setAnimated(true);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPY_RESET_MS);
  };
  const state = (on: boolean) => (on ? (animated ? "in" : "on") : animated ? "out" : "off");
  return (
    <IconAction label={copied ? "Copied" : "Copy"} onPress={press} className="mf-copy" dataMf="copy" extra={{ "data-copied": String(copied) }}>
      <span className="mf-glyph">
        <span className="mf-layer" data-state={state(!copied)} data-mf="copy-glyph">
          <Copy size={16} strokeWidth={1.75} />
        </span>
        <span className="mf-layer" data-state={state(copied)} data-mf="check-glyph">
          <Check size={16} strokeWidth={2} />
        </span>
      </span>
    </IconAction>
  );
}

function Thumb({ kind, filled }: { kind: Rating; filled: boolean }) {
  const Icon = kind === "up" ? ThumbsUp : ThumbsDown;
  return (
    <span className="mf-glyph">
      <Icon size={16} strokeWidth={1.75} />
      <Icon size={16} strokeWidth={1.75} fill="currentColor" className="mf-fill" data-mf={`${kind}-fill`} aria-hidden={!filled} />
    </span>
  );
}

/* ------------------------------------------------------------------ feedback forms */

function FeedbackForm({
  kind,
  phase,
  chosen,
  note,
  onToggle,
  onNote,
  onSubmit,
  onCancel,
}: {
  kind: Rating;
  phase: Phase;
  chosen: string[];
  note: string;
  onToggle: (reason: string) => void;
  onNote: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const busy = phase === "sending";
  const ready = chosen.length > 0 || note.trim().length > 0;
  const submitLabel = phase === "error" ? "Try again" : kind === "down" ? "Submit" : "Send";
  const submit = (
    <button
      type="button"
      className="mf-btn mf-btn-primary"
      data-ready={ready || busy}
      data-busy={busy}
      data-mf="submit"
      aria-disabled={!ready || busy}
      onClick={() => ready && !busy && onSubmit()}
    >
      <span className="mf-btn-cell mf-btn-label">{submitLabel}</span>
      <span className="mf-btn-cell mf-btn-loader" aria-hidden>
        <LoaderCircle size={15} strokeWidth={2} className="mf-spinner" />
      </span>
    </button>
  );
  return (
    <div className="mf-form" data-mf="form">
      <div className="mf-head">
        <span className="mf-heading">{kind === "down" ? "What missed the mark?" : "What worked?"}</span>
        {kind === "down" ? (
          <button type="button" className="mf-close" aria-label="Close feedback" onClick={onCancel}>
            <X size={15} strokeWidth={1.75} />
          </button>
        ) : ready || busy ? (
          submit
        ) : (
          <button type="button" className="mf-btn mf-btn-ghost" style={{ height: 28, margin: "-4px -4px -4px 0" }} onClick={onCancel}>
            Skip
          </button>
        )}
      </div>
      <div className="mf-chips" role="group" aria-label="Reasons">
        {REASONS[kind].map((r) => (
          <button key={r} type="button" className="mf-chip" aria-pressed={chosen.includes(r)} onClick={() => onToggle(r)} data-mf="chip">
            {r}
          </button>
        ))}
      </div>
      {kind === "down" && (
        <>
          <textarea
            className="mf-note"
            placeholder="Add a note (optional)"
            aria-label="Feedback note"
            value={note}
            onChange={(e) => onNote(e.target.value)}
          />
          <div className="mf-footer">
            <span className="mf-foot-note" data-error={phase === "error"}>
              {phase === "error" ? (
                <>
                  <CircleAlert size={13} strokeWidth={2} />
                  Couldn’t send. Your note is still here.
                </>
              ) : (
                "Attached to this reply for review"
              )}
            </span>
            <span className="mf-foot-actions">
              <button type="button" className="mf-btn mf-btn-ghost" onClick={onCancel}>
                Cancel
              </button>
              {submit}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function Thanks() {
  return (
    <div className="mf-thanks" data-mf="thanks">
      <CircleCheck size={16} strokeWidth={2} className="mf-thanks-icon" />
      <span className="mf-thanks-title">Feedback received</span>
      <span className="mf-thanks-muted">Demo only, nothing left this page.</span>
    </div>
  );
}

/* ------------------------------------------------------------------ the message */

type Api = {
  copy: () => void;
  rate: (r: Rating) => void;
  toggleReason: (reason: string) => void;
  submit: () => void;
  skip: () => void;
};

function Message({ apiRef }: { apiRef: RefObject<Api | null> }) {
  const after = useTimers();
  const [rating, setRating] = useState<Rating | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [kind, setKind] = useState<Rating>("down");
  const [phase, setPhase] = useState<Phase>("form");
  const [chosen, setChosen] = useState<Record<Rating, string[]>>({ up: [], down: [] });
  const [note, setNote] = useState("");
  const [failNext, setFailNext] = useState(false);
  const [live, setLive] = useState("");
  const failRef = useRef(failNext);
  failRef.current = failNext;
  const thumbRefs = { up: useRef<HTMLButtonElement>(null), down: useRef<HTMLButtonElement>(null) };
  const copyBtn = useRef<{ press: () => void } | null>(null);
  const gen = useRef(0); // invalidates pending send / fold timers

  const openPanel = (k: Rating) => {
    gen.current++;
    setKind(k);
    setPhase("form");
    setOpen(true);
    setMounted(true);
  };

  const closePanel = () => {
    gen.current++;
    setOpen(false);
  };

  const rate = (r: Rating) => {
    if (rating === r && open) {
      // pressing the selected thumb again clears the rating and folds the panel
      setRating(null);
      closePanel();
      return;
    }
    setRating(r);
    setChosen((c) => ({ ...c, [r]: [] }));
    if (r === "down") setNote("");
    openPanel(r);
    setLive(r === "up" ? "Marked as helpful. Tell us what worked." : "Marked as not helpful. Tell us what missed the mark.");
  };

  const toggleReason = (reason: string) =>
    setChosen((c) => ({ ...c, [kind]: c[kind].includes(reason) ? c[kind].filter((x) => x !== reason) : [...c[kind], reason] }));

  const submit = () => {
    const g = ++gen.current;
    setPhase("sending");
    setLive("Sending feedback.");
    after(() => {
      if (gen.current !== g) return;
      if (failRef.current) {
        setPhase("error");
        setLive("Couldn’t send your feedback. Try again.");
        return;
      }
      setPhase("thanks");
      setLive("Feedback received.");
      after(() => {
        if (gen.current !== g) return;
        const btn = thumbRefs[kind].current;
        if (btn) {
          btn.dataset.returnFocus = "1";
          btn.focus({ preventScroll: true });
        }
        setOpen(false);
      }, THANKS_HOLD_MS);
    }, SEND_MS);
  };

  const skip = () => closePanel();

  apiRef.current = {
    copy: () => copyBtn.current?.press(),
    rate,
    toggleReason,
    submit,
    skip,
  };

  const viewKey = `${kind}:${phase === "thanks" ? "thanks" : "form"}`;
  const view =
    phase === "thanks" ? (
      <Thanks />
    ) : (
      <FeedbackForm
        kind={kind}
        phase={phase}
        chosen={chosen[kind]}
        note={note}
        onToggle={toggleReason}
        onNote={setNote}
        onSubmit={submit}
        onCancel={closePanel}
      />
    );
  const { leaving, changed } = useLeaving(viewKey, view, VIEW_OUT_MS + 20);

  return (
    <div className="mf-demo">
      <article className="mf-card" data-mf="card" onKeyDown={(e) => e.key === "Escape" && open && closePanel()}>
        <div className="mf-prompt">
          <div className="mf-bubble">Why did our nightly export job get slower after we moved it to the new storage volume?</div>
        </div>
        <div className="mf-reply" data-mf="reply">
          <div className="mf-author">
            <span className="mf-mark" aria-hidden>
              <Sparkle size={11} strokeWidth={2.25} fill="currentColor" />
            </span>
            <span className="mf-model">Nova 2</span>
          </div>
          <div className="mf-body">
            <p>
              {REPLY_TEXT} The job writes <code className="mf-code">12,000</code> small files a night, and every one of
              them pays the same per-write latency on the new mount.
            </p>
            <ul>
              <li>
                Run <code className="mf-code">iostat -x 5</code> during the export and check whether{" "}
                <code className="mf-code">%util</code> sits near 100 on the new device while it writes.
              </li>
              <li>
                Batch the writes into one archive with <code className="mf-code">tar --append</code>, so the job opens a
                single file instead of thousands.
              </li>
              <li>
                Raise the volume’s provisioned <code className="mf-code">IOPS</code>, then rerun the job once.
              </li>
            </ul>
          </div>
          <div className="mf-feedback">
            <div className="mf-row">
              <div className="mf-actions" role="group" aria-label="Reply actions">
                <CopyActionWithApi apiRef={copyBtn} />
                <IconAction label="Helpful" pressed={rating === "up"} onPress={() => rate("up")} buttonRef={thumbRefs.up} dataMf="up">
                  <Thumb kind="up" filled={rating === "up"} />
                </IconAction>
                <IconAction label="Not helpful" pressed={rating === "down"} onPress={() => rate("down")} buttonRef={thumbRefs.down} dataMf="down">
                  <Thumb kind="down" filled={rating === "down"} />
                </IconAction>
              </div>
            </div>
            {mounted && (
              <SpringPanel open={open} contentKey={viewKey} onClosed={() => setMounted(false)}>
                {leaving.map((l) => (
                  <div key={l.key} className="mf-view-leaving" aria-hidden>
                    {l.node}
                  </div>
                ))}
                <div key={viewKey} className={changed || leaving.length ? "mf-view-entering" : undefined} data-mf="panel-content">
                  {view}
                </div>
              </SpringPanel>
            )}
            <span className="mf-sr" aria-live="polite">
              {live}
            </span>
          </div>
        </div>
      </article>
      <div className="mf-controls">
        <button type="button" role="switch" aria-checked={failNext} className="mf-switch" onClick={() => setFailNext((f) => !f)}>
          <span className="mf-track">
            <span className="mf-thumb" />
          </span>
          Simulate a send error
        </button>
      </div>
    </div>
  );
}

/** CopyAction whose press can also be triggered by the autoplay demo. */
function CopyActionWithApi({ apiRef }: { apiRef: RefObject<{ press: () => void } | null> }) {
  const wrap = useRef<HTMLSpanElement>(null);
  apiRef.current = { press: () => wrap.current?.querySelector("button")?.click() };
  return (
    <span ref={wrap} style={{ display: "contents" }}>
      <CopyAction text={REPLY_TEXT} />
    </span>
  );
}

/* ------------------------------------------------------------------ demo wrapper */

/**
 * Plays a short demo on load (copy, thumbs down with a reason and submit, thumbs up with a reason and send), then
 * repeats; the first pointer or key input hands control to the person. `?autoplay=0` turns the demo off, and
 * `window.dispatchEvent(new Event("reanimate:replay"))` remounts the message (both used by the capture).
 */
export default function MessageFeedback() {
  const [run, setRun] = useState(0);
  const api = useRef<Api | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const replay = () => setRun((r) => r + 1);
    window.addEventListener("reanimate:replay", replay);
    return () => window.removeEventListener("reanimate:replay", replay);
  }, []);

  useEffect(() => {
    root.current?.style.setProperty("--mf-spring", SPRING_EASING);
  }, []);

  useEffect(() => {
    if (!autoplayEnabled()) return;
    const ids: number[] = [];
    let stopped = false;
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(() => !stopped && flushSync(fn), ms));
    const script = (t0: number) => {
      at(t0 + 700, () => api.current?.copy());
      at(t0 + 2700, () => api.current?.rate("down"));
      at(t0 + 3400, () => api.current?.toggleReason("Too wordy"));
      at(t0 + 4100, () => api.current?.submit());
      at(t0 + 7600, () => api.current?.rate("up"));
      at(t0 + 8300, () => api.current?.toggleReason("Clear steps"));
      at(t0 + 8900, () => api.current?.submit());
      at(t0 + 12600, () => setRun((r) => r + 1));
    };
    script(0);
    const loop = window.setInterval(() => !stopped && script(0), 13000);
    const stop = (e: Event) => {
      if (!e.isTrusted) return;
      stopped = true;
      ids.forEach(clearTimeout);
      clearInterval(loop);
    };
    const el = root.current!;
    el.addEventListener("pointerdown", stop, { capture: true });
    window.addEventListener("keydown", stop, { capture: true });
    return () => {
      stopped = true;
      ids.forEach(clearTimeout);
      clearInterval(loop);
      el.removeEventListener("pointerdown", stop, { capture: true });
      window.removeEventListener("keydown", stop, { capture: true });
    };
  }, []);

  return (
    <div className="mf-root" ref={root}>
      <Message key={run} apiRef={api} />
    </div>
  );
}
