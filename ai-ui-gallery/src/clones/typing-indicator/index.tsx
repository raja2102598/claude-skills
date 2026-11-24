import "./typing-indicator.css";

/*
 * Typing dots: a chat bubble whose three dots rise and brighten one after another, the "assistant is typing" cue.
 * Motion-faithful to Wensity "AI Typing Indicator" (Typing cell): 1320 ms loop, dots 160 ms apart, 0.28em lift with
 * opacity 0.32 → 1, in-out sine-like segments, no overshoot. The loop starts on mount; all motion lives in
 * typing-indicator.css. Original palette and geometry in em, so it scales with font-size.
 */
export default function TypingIndicator() {
  return (
    <div className="td-stage">
      <div className="td-root" role="status" aria-label="Assistant is typing">
        <span className="td-bubble">
          <span className="td-row" aria-hidden="true">
            <span className="td-dot" />
            <span className="td-dot" />
            <span className="td-dot" />
          </span>
        </span>
      </div>
    </div>
  );
}
