import { useState } from "react";
import "./checkpoint.css";

/* AI Elements "Checkpoint" (Apache-2.0, Vercel). Restore drops every message after the marker; Continue brings the thread back. */
export default function Checkpoint() {
  const [restored, setRestored] = useState(false);
  return (
    <div className="cp" data-cp>
      <div className="cp-col">
        <div className="cp-msg"><div className="cp-user">Rename the button component to action.</div></div>
        <p className="cp-reply">Renamed Button to Action in components/ui/button.tsx.</p>
        <div className="cp-marker">
          <span className="cp-mc">
            Button renamed
            {!restored && (
              <button type="button" className="cp-btn cp-restore" aria-label="Restore to Button renamed" onClick={() => setRestored(true)}>
                Restore
              </button>
            )}
          </span>
        </div>
        {restored ? (
          <button type="button" className="cp-btn cp-continue" onClick={() => setRestored(false)}>
            Continue
          </button>
        ) : (
          <>
            <div className="cp-msg"><div className="cp-user">Update the docs to match.</div></div>
            <p className="cp-reply">Updated the Button page to say Action.</p>
          </>
        )}
      </div>
    </div>
  );
}
