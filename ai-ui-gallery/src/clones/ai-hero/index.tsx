import { useId, useRef, useState } from "react";
import { ArrowUp, SlidersHorizontal } from "lucide-react";
import "./ai-hero.css";

/* Copy, brand and palette are our own. Structure and motion follow .reanimate/ai-hero/spec.md. */
const LINES = [
  ["Let", "Wren", "clear", "the"],
  ["path", "for", "your", "day."],
];
const PROMPTS = [
  "Draft a launch checklist for Friday",
  "Summarize this week's customer notes",
  "Find a free hour and book the review",
];
const CHIPS = ["Plan next sprint", "Summarize my inbox", "Prep tomorrow's standup"];
const BAR_H = [231, 287, 340, 386, 419, 386, 340, 287, 231]; // px at the 1293 px reference width
const WORD_BASE = 183; // ms, first word starts moving
const WORD_STEP = 142; // ms per word; line 2 starts two steps after line 1
const CHIP_DELAY = [378, 417, 462];
const PROMPT_DELAY = [0.317, 3.117, 5.917]; // s, 2.8 s apart

const NAV = ["Product", "Agents", "Use cases", "Pricing"];

function Mark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden>
      <rect x="2" y="4" width="22" height="7" rx="3.5" fill="#fff" />
      <rect x="2" y="13" width="15" height="7" rx="3.5" fill="#5bf59a" />
      <rect x="3" y="22" width="9" height="4" rx="2" fill="#fff" />
    </svg>
  );
}

export default function AiHero() {
  const id = useId();
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    if (!value.trim()) return;
    setValue("");
    setSent(true);
    window.setTimeout(() => setSent(false), 1600);
  };

  return (
    <section className="ah" aria-label="Product hero">
      <div className="ah-bars" aria-hidden>
        <div className="ah-bars-in">
          <svg viewBox="0 0 1293 428" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1fe3c4" />
                <stop offset=".2" stopColor="#5bf59a" />
                <stop offset=".4" stopColor="#e6ff7a" />
                <stop offset=".58" stopColor="#ffffff" />
                <stop offset=".8" stopColor="#3b82ff" />
                <stop offset="1" stopColor="#0d1a8a" />
              </linearGradient>
            </defs>
            {BAR_H.map((h, i) => (
              <rect key={i} x={i * 143.7} y={428 - h} width="177" height={h} fill={`url(#${id}-g)`} />
            ))}
          </svg>
        </div>
      </div>

      <header className="ah-nav">
        <a className="ah-logo" href="#" onClick={(e) => e.preventDefault()}>
          <Mark />
          Wren
        </a>
        <nav className="ah-links">
          {NAV.map((n) => (
            <a key={n} href="#" onClick={(e) => e.preventDefault()}>
              {n}
            </a>
          ))}
        </nav>
        <div className="ah-navr">
          <a className="ah-login" href="#" onClick={(e) => e.preventDefault()}>
            Sign in
          </a>
          <button className="ah-cta" type="button">
            Try free
          </button>
        </div>
      </header>

      <div className="ah-col">
        <div className="ah-eyebrow ah-in ah-snapin">
          <span className="ah-dot" />
          Your assistant, one step ahead
        </div>
        <h1>
          {LINES.map((line, li) => (
            <span className="ah-line" key={li}>
              {line.map((w, wi) => (
                <span key={wi}>
                  <span className="ah-w ah-in" style={{ ["--d" as string]: `${WORD_BASE + WORD_STEP * (li * 2 + wi)}ms` }}>
                    {w}
                  </span>
                  {wi < line.length - 1 && <span className="ah-sp" />}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="ah-sub ah-in ah-snapin">
          Describe the outcome in one sentence. Wren drafts it, checks the details and hands back something you can ship.
        </p>

        <div className="ah-comp ah-in ah-snapin">
          <div className="ah-card">
            <div className="ah-card-in">
              <textarea
                ref={taRef}
                className="ah-ta"
                aria-label="Ask Wren"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              {PROMPTS.map((p, i) => (
                <p key={p} className={`ah-ph${value ? " is-hidden" : ""}`} style={{ ["--pd" as string]: `${PROMPT_DELAY[i]}s` }} aria-hidden>
                  {p}
                </p>
              ))}
              <div className="ah-foot">
                <button className="ah-ib" type="button" aria-label="Options">
                  <SlidersHorizontal size={16} />
                </button>
                <button className="ah-send" type="button" aria-label="Send" onClick={send}>
                  <ArrowUp size={16} />
                </button>
              </div>
              {sent && <span className="ah-sent">Sent to Wren</span>}
            </div>
          </div>
          <div className="ah-chips">
            {CHIPS.map((c, i) => (
              <button
                key={c}
                type="button"
                className="ah-chip ah-in ah-snapin"
                style={{ ["--d" as string]: `${CHIP_DELAY[i]}ms` }}
                onClick={() => {
                  setValue(c);
                  taRef.current?.focus();
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
