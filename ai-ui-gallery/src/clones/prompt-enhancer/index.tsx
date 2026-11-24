import { useEffect, useState } from "react";
import { Check, Plus, RotateCcw, Sparkles } from "lucide-react";
import "./prompt-enhancer.css";

/*
 * Prompt enhancer, motion-faithful to UIStacks "Prompt enhancer". A short prompt is typed, Improve is pressed,
 * a light runs round the card edge while the rewrite streams in below with the added words marked, a "What changed"
 * list appears, Use is pressed and the card keeps the new prompt. Loops every 11 s. Everything derives from one
 * clock (ms into the cycle), so the virtual clock and the real clock behave the same.
 */

const CYCLE = 11000;
const ORIGINAL = "Write a product description for our wool throw";
const PARTS: [string, boolean][] = [
  ["Write a ", false],
  ["warm, 80 to 100 word", true],
  [" product description for our wool throw", false],
  [" for the Hearth Row shop page. Write for people furnishing a first home who care about natural materials. Mention the size (130 × 170 cm) and that it is machine washable, and end with one line on care.", true],
];
const IMPROVED = PARTS.map((p) => p[0]).join("");
const WORDS = IMPROVED.split(/(?<=\s)/); // tokens keep their trailing space
const WORD_COUNT = IMPROVED.trim().split(/\s+/).length;
const CHANGES = ["Added the audience", "Set a length", "Named the page", "Asked for size and care"];

const T = {
  typeStart: 900, typePerChar: 17,
  improve: 2300,
  stream: 3500, perWord: 40,
  chips: 5750,
  use: 8000, blank: 8150, old: 8300, done: 8500,
};

function Stream({ n }: { n: number }) {
  // Render the first n tokens, keeping each token's highlight flag.
  let pos = 0;
  const out: React.ReactNode[] = [];
  const text = WORDS.slice(0, n).join("");
  PARTS.forEach(([s, hl], i) => {
    const take = text.slice(pos, pos + s.length);
    pos += s.length;
    if (take) out.push(hl ? <span key={i} className="pe-mark">{take}</span> : <span key={i}>{take}</span>);
  });
  return <>{out}</>;
}

export default function PromptEnhancer() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => setT((performance.now() - t0) % CYCLE), 16);
    return () => clearInterval(id);
  }, []);

  const chars = Math.max(0, Math.min(ORIGINAL.length, Math.floor((t - T.typeStart) / T.typePerChar) + 1));
  const typed = t >= T.typeStart;
  const improving = t >= T.improve && t < T.stream;
  const nWords = Math.max(0, Math.min(WORDS.length, Math.floor((t - T.stream) / T.perWord) + 1));
  const review = t >= T.stream && t < T.use + 150;
  const streaming = review && nWords < WORDS.length;
  const showChips = t >= T.chips && review;
  const finished = t >= T.done;
  const blank = t >= T.blank && t < T.old;
  const glow = t >= T.improve + 100 && t < T.chips;

  const text = finished ? IMPROVED : blank ? "" : typed ? ORIGINAL.slice(0, chars) : "";
  const hasText = typed && text !== "" || finished || t >= T.old;

  return (
    <div className="pe-root">
      {glow && <div key="glow" className="pe-glow" />}
      <div className="text-[15px] leading-[22px]" style={{ minHeight: 22 }}>
        {text ? text : <span style={{ color: "var(--pe-sub)" }}>{blank ? "" : "Describe what you want"}</span>}
      </div>

      {finished ? (
        <div className="mt-[19px] flex items-center justify-between pe-fade">
          <span className="text-[13px]" style={{ color: "var(--pe-sub)" }}>{WORD_COUNT} words</span>
          <span className="pe-pill"><Sparkles size={14} color="var(--pe-violet)" />Improve</span>
        </div>
      ) : (
        <div className="mt-[14px] flex items-center justify-between">
          <span className="text-[13px]" style={{ color: "#4b4b52" }}>{hasText ? "Add a bit more detail" : "A few words is enough"}</span>
          <span className="pe-pill" data-off={!hasText || review}>
            {improving ? <span className="pe-dots">{Array.from({ length: 9 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 3) * 120 + Math.floor(i / 3) * 90}ms` }} />)}</span> : <Sparkles size={14} color="var(--pe-violet)" />}
            {improving ? "Improving" : "Improve"}
          </span>
        </div>
      )}

      {review && (
        <div key="panel" className="pe-in mt-[22px]">
          <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--pe-sub)" }}>
            <Sparkles size={13} color="var(--pe-violet)" />Improved prompt
          </div>
          <div className="mt-[9px] rounded-[14px] px-[14px] py-[12px] text-[15px] leading-[22px]" style={{ background: "#f1f1f3" }}>
            <Stream n={nWords} />
            {streaming && <span className="pe-caret" />}
          </div>
          {showChips && (
            <div key="chips">
              <div className="mt-[13px] text-[12.5px] pe-fade" style={{ color: "var(--pe-sub)" }}>What changed</div>
              <div className="mt-[9px] flex flex-wrap gap-2">
                {CHANGES.map((c, i) => (
                  <span key={c} className="pe-chip pe-in" style={{ animationDelay: `${i * 70}ms` }}><Plus size={13} />{c}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-[14px] flex items-center gap-2">
            <span className="pe-btn" style={{ width: 34, padding: 0 }}><RotateCcw size={14} /></span>
            <span className="flex-1" />
            <span className="pe-btn">Keep mine</span>
            <span className="pe-btn use" data-off={!showChips}><Check size={15} />Use</span>
          </div>
        </div>
      )}
    </div>
  );
}
