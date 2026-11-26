import { useState } from "react";
import { ArrowUp, X } from "lucide-react";
import "./message-queue.css";

// Pixel-faithful clone of assistant-ui's Message queue (MIT, AgentbaseAI Inc.).
const RUNNING = "Fix the converter and add a guard";
const INITIAL = ["Also add a changeset", "Then run the full suite", "And open the PR when it's green"];

export default function MessageQueue() {
  const [items, setItems] = useState(INITIAL);
  return (
    <div className="mq-root" style={{ background: "oklch(0.992 0.002 106)" }}>
      <div data-stage className="flex items-center justify-center" style={{ width: 480, height: 306, background: "oklch(0.992 0.002 106)" }}>
        <div data-slot="message-queue" className="flex w-96 flex-col gap-2">
          <div
            className="flex items-center gap-2.5 rounded-2xl p-3"
            style={{ background: "var(--mq-bg)", border: "1px solid oklch(0.145 0.006 106 / 0.06)" }}
          >
            <span className="relative flex size-2 shrink-0">
              <span className="mq-ping absolute inline-flex size-full rounded-full" style={{ background: "rgb(59 130 246 / 0.6)" }} />
              <span className="relative inline-flex size-2 rounded-full" style={{ background: "#3b82f6" }} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px]" style={{ color: "oklch(0.145 0.006 106 / 0.9)" }}>{RUNNING}</span>
            <span className="mq-mono shrink-0">running</span>
          </div>
          {items.length > 0 && (
            <div className="flex items-baseline justify-between px-1">
              <span className="mq-mono">{items.length} queued</span>
              <span className="mq-mono">sends when this finishes</span>
            </div>
          )}
          <ul className="flex flex-col gap-1.5">
            {items.map((t, i) => (
              <li
                key={t}
                className="mq-enter flex items-center gap-2.5 rounded-2xl py-2 pr-2 pl-3"
                style={{ background: "oklch(0.145 0.006 106 / 0.04)" }}
              >
                <span className="mq-mono w-3 shrink-0 tabular-nums">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-[13.5px]" style={{ color: "oklch(0.145 0.006 106 / 0.6)" }}>{t}</span>
                <ArrowUp className="size-3 shrink-0" style={{ color: "oklch(0.145 0.006 106 / 0.25)" }} aria-hidden />
                <button
                  type="button"
                  aria-label={`Remove "${t}" from the queue`}
                  onClick={() => setItems((a) => a.filter((x) => x !== t))}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full outline-none transition-[background-color,color,scale] duration-150 hover:bg-[oklch(0.145_0.006_106/0.06)] active:scale-[0.96]"
                  style={{ color: "var(--mq-muted)" }}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
