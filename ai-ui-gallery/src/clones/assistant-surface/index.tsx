import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, ChevronDown, History, Plus } from "lucide-react";
import "./assistant-surface.css";

/* Assistant modal: launcher bottom-right of the page, a panel that grows out of it.
   Pixel-faithful clone of the assistant-ui "Assistant modal" element (MIT); see meta.ts. */
export default function AssistantSurface() {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toggle = () => {
    window.clearTimeout(timer.current);
    if (open) {
      setOpen(false);
      timer.current = window.setTimeout(() => setMounted(false), 200);
    } else {
      setMounted(true);
      setOpen(true);
    }
  };

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setSent((s) => [...s, t]);
    setDraft("");
  };

  return (
    <div className="as-root" data-stage>
      {mounted && (
        <div className="as-dialog" role="dialog" aria-labelledby="as-title" data-state={open ? "open" : "closed"}>
          <div className="as-head">
            <h2 className="as-title" id="as-title">
              New Chat
            </h2>
            <div className="as-tools">
              <button className="as-tool" disabled aria-label="Threads">
                <History />
              </button>
              <button className="as-tool" aria-label="New thread" onClick={() => setSent([])}>
                <Plus />
              </button>
            </div>
          </div>
          <div className="as-body">
            {sent.length > 0 && (
              <div className="as-msgs">
                {sent.map((m, i) => (
                  <div key={i} className="as-me">
                    {m}
                  </div>
                ))}
              </div>
            )}
            <div className="as-foot">
              <form
                className="as-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <textarea
                  className="as-input"
                  rows={1}
                  placeholder="Send a message..."
                  aria-label="Message input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <div className="as-actions">
                  <button type="button" className="as-round as-attach" aria-label="Add Attachment">
                    <Plus />
                  </button>
                  <button type="submit" className="as-round as-send" aria-label="Send message" disabled={!draft.trim()}>
                    <ArrowUp />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <button
        className="as-launcher"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={open ? "Close Assistant" : "Open Assistant"}
        onClick={toggle}
      >
        <Bot className="as-ico-bot" />
        <ChevronDown className="as-ico-chev" />
      </button>
    </div>
  );
}
