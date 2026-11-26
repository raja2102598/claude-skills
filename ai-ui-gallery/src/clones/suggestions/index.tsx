import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUp, Plus } from "lucide-react";
import "./suggestions.css";

/* AI Elements "Suggestion" (Apache-2.0, Vercel). Clicking a pill sends it as a user message and an agent reply appears. */
const SUGGESTIONS = [
  "Add a dark mode toggle",
  "Fix the failing build",
  "Write tests for the form",
  "Upgrade to Next.js 16",
  "Add a loading state",
  "Find unused dependencies",
];

const SEND_DELAY_MS = 0; // on the virtual clock the reference lands the exchange in the click frame

export default function Suggestions() {
  const [sent, setSent] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setValue("");
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => flushSync(() => setSent(text)), SEND_DELAY_MS);
  };

  return (
    <div className="sg" data-sg>
      <div className="sg-wrap">
        {sent && (
          <div className="sg-msgs">
            <div className="sg-user">{sent}</div>
            <p className="sg-reply">The build failed on a missing import in app/page.tsx. I added it and the build passes.</p>
          </div>
        )}
        <div className="sg-stack">
          <div className="sg-row">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="sg-pill" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
          <form
            className="sg-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(value);
            }}
          >
            <textarea
              className="sg-ta"
              placeholder="Ask the agent to change your code..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(value);
                }
              }}
            />
            <div className="sg-bar">
              <button type="button" className="sg-icon" aria-label="Add attachment">
                <Plus size={16} />
              </button>
              <button type="submit" className="sg-icon sg-send" aria-label="Send" disabled={!value.trim()}>
                <ArrowUp size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
