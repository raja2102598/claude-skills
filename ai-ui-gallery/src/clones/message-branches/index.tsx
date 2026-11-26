import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import "./message-branches.css";

/*
 * Edit a sent message, pixel-faithful to assistant-ui "Edit a sent message" (MIT).
 * Sent bubble -> click to edit in place; the amber line says how many replies stay on the old branch;
 * Send or Cancel returns to the bubble. The reference swaps states instantly (no transitions beyond
 * 150 ms hover and a 0.96 press squeeze), so the clone does too.
 */
const TEXT = "Explain how the composer keeps its draft.";
const REPLIES = 3;

export default function MessageBranches() {
  const [editing, setEditing] = useState(true);
  const [text, setText] = useState(TEXT);
  const [draft, setDraft] = useState(TEXT);

  return (
    <div data-stage className="mb-stage" style={{ width: 784, height: 360 }}>
      {editing ? (
        <div className="mb-card" data-slot="edit-message">
          <textarea
            rows={2}
            aria-label="Edit your message"
            className="mb-area"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="mb-warn">
            <TriangleAlert size={14} aria-hidden />
            <span>
              sending starts a new branch; {REPLIES} replies stay on the old one
            </span>
          </div>
          <div className="mb-row">
            <button type="button" className="mb-btn mb-cancel" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="mb-btn mb-send"
              onClick={() => {
                setText(draft);
                setEditing(false);
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-sent-wrap" data-slot="edit-message">
          <button
            type="button"
            className="mb-sent"
            onClick={() => {
              setDraft(text);
              setEditing(true);
            }}
          >
            {text}
          </button>
        </div>
      )}
    </div>
  );
}
