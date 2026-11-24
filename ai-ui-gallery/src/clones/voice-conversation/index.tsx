import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Check, Hand, PawPrint, PhoneOff, Sparkles, Target, Volume2, VolumeX } from "lucide-react";
import { CALLEE, GOAL, LINES, OUTCOME, T, WORDS, snapshotAt, snapshotKey, type Snapshot, type Speaker } from "./script";
import { EASE } from "./springs";
import "./voice-conversation.css";

/*
 * Voice call with a live transcript (motion follows .reanimate/voice-conversation/spec.md).
 * One rAF clock drives a fixed, simulated call: Dialing → Ringing → In call (rows stream in word by word while the
 * waveform follows the speaker; the goal line goes asking → confirmed) → Call ended (the outcome card replaces the
 * controls). The cycle loops every 12.03 s. All opacity / transform / filter motion is CSS (keyframes with sampled
 * springs, or transitions), so it runs the same on the real clock and on a capture's virtual clock.
 * No microphone or audio is used: levels and transcript come from ./script.ts.
 */

const PEAKS = [0.3, 0.5, 0.42, 0.75, 0.55, 0.95, 0.65, 1, 0.6, 0.85, 0.45, 0.7, 0.38, 0.5];
const BAR_MS = [1300, 1450, 1600, 1750];

const fmt = (s: number) => `00:${String(s).padStart(2, "0")}`;

/** A slot whose value swaps on the script's clock: the old value leaves for exitMs while the new one enters. */
function Swap<K extends string>({
  slot,
  render,
  enterClass,
  exitClass,
  className = "",
}: {
  slot: { id: K; prev: K | null; animate: boolean };
  render: (id: K) => ReactNode;
  enterClass: string;
  exitClass: string;
  className?: string;
}) {
  return (
    <span className={`vc-cell ${className}`}>
      {slot.prev && (
        <span key={slot.prev} className={exitClass} aria-hidden="true">
          {render(slot.prev)}
        </span>
      )}
      <span key={slot.id} className={slot.animate ? enterClass : undefined}>
        {render(slot.id)}
      </span>
    </span>
  );
}

function slotAt<K extends string>(events: [number, K][], t: number, exitMs: number, quiet: K[] = []) {
  let i = 0;
  while (i + 1 < events.length && events[i + 1][0] <= t) i++;
  const [since, id] = events[i];
  const before = i > 0 ? events[i - 1][1] : null;
  const prev = before && !quiet.includes(before) && t - since < exitMs ? before : null;
  return { id, prev, animate: i > 0 && !(before && quiet.includes(before)) };
}

type StatusId = "dialing" | "ringing" | "incall" | "ended";
type GoalIconId = "pending" | "ai" | "ok";
type GoalStatusId = "none" | "asking" | "confirmed";
type DockId = "controls" | "outcome";

function slots(t: number) {
  return {
    status: slotAt<StatusId>([[0, "dialing"], [T.ringing, "ringing"], [T.pickup, "incall"], [T.ended, "ended"]], t, 150),
    goalIcon: slotAt<GoalIconId>([[0, "pending"], [T.pickup, "ai"], [T.confirmed, "ok"]], t, 120),
    goalStatus: slotAt<GoalStatusId>([[0, "none"], [T.pickup, "asking"], [T.confirmed, "confirmed"]], t, 150, ["none"]),
    dock: slotAt<DockId>([[0, "controls"], [T.ended, "outcome"]], t, 143),
  };
}
type Slots = ReturnType<typeof slots>;
const slotsKey = (s: Slots) => Object.values(s).map((v) => `${v.id}:${v.prev}`).join("|");

interface Frame {
  snap: Snapshot;
  slots: Slots;
}
const frameAt = (t: number): Frame => ({ snap: snapshotAt(t), slots: slots(t) });
const frameKey = (f: Frame) => `${snapshotKey(f.snap)}#${slotsKey(f.slots)}`;

function Waveform({ speaking }: { speaking: Speaker | null }) {
  return (
    <span className="vc-wave flex h-6 shrink-0 items-center gap-[3px]" data-speaker={speaking ?? undefined} aria-hidden="true">
      {PEAKS.map((p, i) => (
        <span
          key={i}
          className="vc-bar"
          style={{ "--p": p, "--dur": `${BAR_MS[i % 4]}ms`, "--delay": `${(i % 5) * 70}ms` } as CSSProperties}
        />
      ))}
    </span>
  );
}

function CalleeMark({ size }: { size: number }) {
  return (
    <span className="grid size-full place-items-center bg-[var(--vc-accent)] text-white">
      <PawPrint size={size} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}

function AiDots() {
  // 3x3 dots: a faint grid, plus three lit patterns that step through an 800 ms loop, and a steady centre dot.
  const at = (i: number) => 1.5 + i * 4.25;
  const dot = (c: number, r: number) => <circle key={`${c}-${r}`} cx={at(c)} cy={at(r)} r="1.5" />;
  const all = [0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2, 3, 4].map((c) => dot(c, r)));
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
      <g fill="var(--vc-subtle)" opacity="0.16">
        {all}
      </g>
      <g fill="var(--vc-accent)" className="vc-dots-a">
        {[dot(2, 0), dot(1, 1), dot(3, 1), dot(0, 2), dot(4, 2), dot(1, 3), dot(3, 3), dot(2, 4)]}
      </g>
      <g fill="var(--vc-accent)" className="vc-dots-b">
        {[dot(0, 0), dot(1, 1), dot(3, 3), dot(4, 4), dot(4, 0), dot(3, 1), dot(1, 3), dot(0, 4)]}
      </g>
      <g fill="var(--vc-accent)" className="vc-dots-c">
        {[dot(2, 0), dot(2, 1), dot(2, 3), dot(2, 4), dot(0, 2), dot(1, 2), dot(3, 2), dot(4, 2)]}
      </g>
      <circle cx="10" cy="10" r="1.5" fill="var(--vc-accent)" />
    </svg>
  );
}

function Row({ index, shown }: { index: number; shown: number }) {
  const line = LINES[index];
  const words = WORDS[index];
  const agent = line.speaker === "agent";
  return (
    <li className={`flex min-w-0 items-start gap-2.5 ${index > 0 ? "vc-row-in" : ""}`} data-vc-row={index}>
      <span
        className={`vc-avatar relative mt-px grid size-6 shrink-0 place-items-center overflow-hidden rounded-full ${
          agent ? "bg-white text-[var(--vc-accent)] shadow-[inset_0_0_0_1px_var(--vc-border)]" : ""
        }`}
        data-on={shown > 0 ? "" : undefined}
        aria-hidden="true"
      >
        {agent ? <Sparkles size={13} strokeWidth={2} /> : <CalleeMark size={13} />}
      </span>
      <p className={`min-w-0 text-[14px] leading-[22px] ${agent ? "text-[var(--vc-ink)]" : "text-[var(--vc-muted)]"}`}>
        <span className="sr-only">{agent ? "Assistant: " : `${CALLEE.name}: `}</span>
        {words.map((w, k) => (
          <span key={k} className="vc-word" data-on={k < shown ? "" : undefined} aria-hidden={k < shown ? undefined : true}>
            {k < words.length - 1 ? `${w} ` : w}
          </span>
        ))}
      </p>
    </li>
  );
}

function CallCard({ frame }: { frame: Frame }) {
  const { snap, slots: s } = frame;
  const [muted, setMuted] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const live = snap.phase === "dialing" || snap.phase === "ringing";

  useLayoutEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [snap.rows, snap.words]);

  const status = (id: StatusId) => (
    <span className="flex min-w-0 items-center gap-1.5">
      {id === "dialing" && <span className="truncate">Dialing…</span>}
      {id === "ringing" && <span className="truncate">Ringing…</span>}
      {id === "incall" && (
        <>
          <span aria-hidden="true" className="relative grid size-1.5 shrink-0 place-items-center">
            <span className="vc-ping" />
            <span className="size-1.5 rounded-full bg-[var(--vc-success)]" />
          </span>
          <span className="truncate">In call</span>
          <span className="shrink-0 tabular-nums text-[var(--vc-ink)]">{fmt(snap.seconds)}</span>
        </>
      )}
      {id === "ended" && (
        <span className="truncate">
          Call ended <span className="tabular-nums">· {fmt(snap.seconds)}</span>
        </span>
      )}
    </span>
  );

  const goalIcon = (id: GoalIconId) => (
    <span className="grid size-5 place-items-center">
      {id === "pending" && <Target size={16} strokeWidth={1.75} className="text-[var(--vc-subtle)]" aria-hidden="true" />}
      {id === "ai" && <AiDots />}
      {id === "ok" && (
        <span className="grid size-5 place-items-center rounded-full bg-[var(--vc-success)] text-white">
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        </span>
      )}
    </span>
  );

  const goalStatus = (id: GoalStatusId) =>
    id === "none" ? null : (
      <span className="flex min-w-0 items-center">
        {id === "asking" ? (
          <span className="text-[var(--vc-subtle)]">· asking</span>
        ) : (
          <span className="text-[var(--vc-success-text)]">· confirmed</span>
        )}
      </span>
    );

  const dock = (id: DockId) =>
    id === "controls" ? (
      <div className="flex items-start justify-center gap-4">
        <Control label={muted ? "Unmute" : "Mute"} pressed={muted} onClick={() => setMuted((m) => !m)}>
          {muted ? <VolumeX size={18} strokeWidth={1.75} /> : <Volume2 size={18} strokeWidth={1.75} />}
        </Control>
        <Control label="Take over" disabled={live}>
          <Hand size={18} strokeWidth={1.75} />
        </Control>
        <Control label="Hang up" danger>
          <PhoneOff size={18} strokeWidth={1.75} />
        </Control>
      </div>
    ) : (
      <div className="flex min-w-0 items-center gap-3 self-center rounded-[14px] bg-[var(--vc-fill)] p-3">
        <span className="vc-badge-in grid size-8 shrink-0 place-items-center rounded-full bg-white text-[var(--vc-success-text)] shadow-[inset_0_0_0_1px_var(--vc-border)]">
          <Check size={16} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium leading-5">{OUTCOME.title}</p>
          <p className="truncate text-[13px] leading-5 text-[var(--vc-muted)]">{OUTCOME.detail}</p>
        </div>
        <button
          type="button"
          className="vc-btn vc-btn-secondary inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-[13px] font-medium"
        >
          Add to calendar
        </button>
      </div>
    );

  return (
    <section aria-labelledby="vc-name" className="vc-card" data-vc-card>
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center">
          {live && (
            <>
              <span className="vc-ring" />
              <span className="vc-ring" />
            </>
          )}
          <span
            className="vc-tile relative grid size-10 place-items-center overflow-hidden rounded-[12px]"
            data-ended={snap.phase === "ended" ? "" : undefined}
          >
            <CalleeMark size={20} />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <h3 id="vc-name" className="flex min-w-0 items-baseline gap-2 text-[15px] font-medium leading-5">
            <span className="truncate">{CALLEE.name}</span>
            <span className="shrink-0 text-[13px] font-normal tabular-nums text-[var(--vc-subtle)]">{CALLEE.detail}</span>
          </h3>
          <p aria-live="polite" className="mt-0.5 text-[13px] leading-5 text-[var(--vc-muted)]" data-vc-status>
            <Swap slot={s.status} render={status} enterClass="vc-swap-in" exitClass="vc-swap-out" className="min-w-0" />
          </p>
        </div>
        <Waveform speaking={snap.speaking} />
      </div>

      <div
        ref={logRef}
        role="log"
        aria-label="Call transcript"
        tabIndex={0}
        className="vc-log mt-3 h-[204px] overflow-y-auto rounded-[14px] bg-[var(--vc-fill)] px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--vc-accent)]"
      >
        {snap.rows === 0 ? (
          <p className="grid h-full place-items-center px-4 text-center text-[13px] leading-5 text-balance text-[var(--vc-subtle)]">
            The transcript appears once they answer.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {snap.words.map((shown, i) => (
              <Row key={i} index={i} shown={shown} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex min-w-0 items-center gap-2 px-0.5 text-[13px] leading-5" data-vc-goal>
        <Swap slot={s.goalIcon} render={goalIcon} enterClass="vc-icon-in" exitClass="vc-icon-out" className="size-5 shrink-0 place-items-center" />
        <span className="shrink-0 text-[var(--vc-muted)]">Goal</span>
        <span className="flex min-w-0 items-center gap-1">
          <span className="min-w-0 truncate font-medium">{GOAL}</span>
          <Swap slot={s.goalStatus} render={goalStatus} enterClass="vc-swap-in" exitClass="vc-swap-out" className="min-w-0 shrink-0" />
        </span>
      </div>

      <div className="mt-3 grid min-h-[79px] border-t border-[var(--vc-border)] pt-3" data-vc-dock>
        {s.dock.prev && (
          <div key={s.dock.prev} className="vc-fade-out col-start-1 row-start-1 grid" aria-hidden="true">
            {dock(s.dock.prev)}
          </div>
        )}
        <div key={s.dock.id} className={`col-start-1 row-start-1 grid ${s.dock.animate ? "vc-outcome-in" : ""}`}>
          {dock(s.dock.id)}
        </div>
      </div>
    </section>
  );
}

function Control({
  label,
  children,
  danger,
  disabled,
  pressed,
  onClick,
}: {
  label: string;
  children: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  pressed?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex w-[72px] flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed === undefined ? undefined : pressed}
        disabled={disabled}
        onClick={onClick}
        className={`vc-btn grid size-11 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--vc-accent)] focus-visible:ring-offset-2 ${
          danger ? "bg-[var(--vc-danger)] text-white hover:brightness-95" : pressed ? "bg-[var(--vc-ink)] text-white" : "vc-btn-secondary"
        }`}
      >
        {children}
      </button>
      <span aria-hidden="true" className="whitespace-nowrap text-[12px] leading-4 text-[var(--vc-muted)]">
        {label}
      </span>
    </div>
  );
}

/** Runs the script on requestAnimationFrame and loops it; each cycle remounts the card so it resets instantly. */
function Call() {
  const [state, setState] = useState(() => ({ cycle: 0, frame: frameAt(0) }));
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    let lastKey = "";
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const cycle = Math.floor(elapsed / T.cycle);
      const frame = frameAt(elapsed - cycle * T.cycle);
      const key = `${cycle}/${frameKey(frame)}`;
      if (key !== lastKey) {
        lastKey = key;
        flushSync(() => setState({ cycle, frame }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <CallCard key={state.cycle} frame={state.frame} />;
}

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

export default function VoiceConversation() {
  const [run, setRun] = useState(() => (autoplayEnabled() ? 1 : 0));
  const vars = {
    "--vc-enter": EASE.enter,
    "--vc-enter-slide": EASE.enterSlide,
    "--vc-icon": EASE.icon,
    "--vc-badge": EASE.badge,
  } as CSSProperties;
  return (
    <div className="vc-root absolute inset-0 grid place-items-center" style={vars}>
      {run > 0 ? (
        <div className="vc-zoom">
          <Call key={run} />
        </div>
      ) : (
        // Capture mode (?autoplay=0): the call starts when this invisible corner button is clicked.
        <button type="button" data-vc-start aria-label="Start the call" className="absolute left-0 top-0 h-6 w-6 cursor-pointer opacity-0" onClick={() => setRun(1)} />
      )}
    </div>
  );
}
