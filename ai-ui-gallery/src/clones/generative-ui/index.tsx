import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowDown, ArrowUpRight, Check, ExternalLink, Repeat2, Send, ShieldCheck, ArrowUp, X } from "lucide-react";
import "./generative-ui.css";

/*
 * Generative UI card, motion-faithful to beUI Pro "Crypto Agent" (paid), original styling and copy.
 * The assistant answers a request with tool steps that resolve one by one, a streamed sentence, and then a generated
 * swap card with a countdown ring. Approve walks it through Sign, Submitted, Confirmed; Decline closes it out.
 * Entrances are CSS keyframes (they run on the same clock as the timeline of timeouts below).
 */

// ms from the click on the suggestion
// Times are read from real-clock rAF probes of the reference (steps are paced 512 ms apart, each row appears as the previous one resolves).
const T = { user: 212, think: 226, s1: 518, s1done: 1032, s2: 1032, s2done: 1544, s3: 1544, s3done: 2080, text: 2080, card: 2597 };
// ms after Approve: button label swaps, Decline leaves, stepper opens with Sign done, then Submitted + Confirmed land together
const SIGN = { label: 258, decline: 480, sign: 1455, confirmed: 3105 };
const WORD_GAP = 21;

const STEPS = [
  { id: 1, label: "Checked balance", note: "3.184 LMN available" },
  { id: 2, label: "Compared 4 routes", note: "Meridian v3 · 0.05% pool" },
  { id: 3, label: "Simulated swap", note: "No reverts, 0.5% max slippage" },
];
const REPLY = "Here's the best route I found for 0.5 LMN. Review it and approve when you're ready.";
const SUGGESTIONS = [
  { icon: Repeat2, title: "Swap tokens", sub: "Swap 0.5 LMN to USDX" },
  { icon: Send, title: "Pay a contact", sub: "Send 120 USDX to lena.eth" },
  { icon: ShieldCheck, title: "Set an allowance", sub: "Approve 500 USDX for Meridian" },
];

type Stage = "quote" | "signing" | "pending" | "confirmed" | "declined";

export default function GenerativeUI() {
  const [started, setStarted] = useState(false);
  const [user, setUser] = useState(false);
  const [think, setThink] = useState(false);
  const [wallet, setWallet] = useState(0); // 0 Approve, 1 Confirm in wallet, 2 + Decline gone
  const [steps, setSteps] = useState<{ shown: number; done: number }>({ shown: 0, done: 0 });
  const [text, setText] = useState(false);
  const [card, setCard] = useState(false);
  const [stage, setStage] = useState<Stage>("quote");
  const [progress, setProgress] = useState(0); // 0 none, 1 sign done, 2 submitted done, 3 confirmed
  const [secs, setSecs] = useState(30);
  const [cycle, setCycle] = useState(0);
  const [rate, setRate] = useState(2412.38);
  const [balance, setBalance] = useState(22237.6);
  const timers = useRef<number[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef(0);
  const at = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(() => flushSync(fn), ms));
  }, []);

  const params = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const auto = params.get("auto"); // "start" | "approve"

  const start = useCallback(() => {
    if (started) return;
    flushSync(() => setStarted(true));
    at(T.user, () => setUser(true));
    at(T.think, () => setThink(true));
    at(T.s1, () => setSteps((s) => ({ ...s, shown: 1 })));
    at(T.s1done, () => setSteps((s) => ({ ...s, done: 1 })));
    at(T.s2, () => setSteps((s) => ({ ...s, shown: 2 })));
    at(T.s2done, () => setSteps((s) => ({ ...s, done: 2 })));
    at(T.s3, () => setSteps((s) => ({ ...s, shown: 3 })));
    at(T.s3done, () => setSteps((s) => ({ ...s, done: 3 })));
    at(T.text, () => setText(true));
    at(T.card, () => setCard(true));
  }, [started, at]);

  const approve = useCallback(() => {
    flushSync(() => setStage("signing"));
    at(SIGN.label, () => setWallet(1));
    at(SIGN.decline, () => setWallet(2));
    at(SIGN.sign, () => {
      setProgress(1);
      setStage("pending");
    });
    at(SIGN.confirmed, () => {
      setProgress(3);
      setStage("confirmed");
      setBalance(22233.62);
    });
  }, [at]);

  // gallery: play on mount (or wait for a click with ?auto=0)
  useEffect(() => {
    if (auto === "0") return;
    const id = window.setTimeout(start, 900);
    return () => clearTimeout(id);
  }, [auto, start]);

  // optional: approve automatically (capture mode)
  useEffect(() => {
    if (auto !== "approve" || !card) return;
    const id = window.setTimeout(approve, 1800);
    return () => clearTimeout(id);
  }, [auto, card, approve]);

  // quote countdown: re-rolls the rate every 30 s while the quote is open
  useEffect(() => {
    if (!card || stage !== "quote") return;
    const id = window.setInterval(() => {
      flushSync(() => {
        setSecs((s) => {
          if (s <= 1) {
            setCycle((c) => c + 1);
            setRate((r) => +(r + (Math.random() - 0.5) * 6).toFixed(2));
            return 30;
          }
          return s - 1;
        });
      });
    }, 1000);
    return () => clearInterval(id);
  }, [card, stage]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Like the reference: the thread is top-anchored and only scrolls (quick ease-out, ~130 ms) when the content grows past the viewport:
  // a few px when the card lands, then when the stepper opens and when Confirmed adds the result line.
  useLayoutEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const from = el.scrollTop;
    const to = el.scrollHeight - el.clientHeight;
    if (to <= from + 0.5) return;
    cancelAnimationFrame(scrollRaf.current);
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 130);
      el.scrollTop = from + (to - from) * (1 - Math.pow(1 - k, 3));
      if (k < 1) scrollRaf.current = requestAnimationFrame(tick);
    };
    scrollRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(scrollRaf.current);
  }, [think, steps.shown, text, card, stage, progress]);

  const receive = (0.5 * rate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const min = (0.5 * rate * 0.995).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  const words = REPLY.split(/(?<= )/);

  return (
    <div className="gu-root" data-gu-root data-started={started ? "" : undefined}>
      <header className="gu-head">
        <div className="gu-who">
          <span className="gu-orb" style={{ width: 28, height: 28 }} />
          <div>
            <b>Orbit</b>
            <span>Wallet agent</span>
          </div>
        </div>
        <div className="gu-wallet">
          <i>
            <span style={{ fontSize: 11, fontWeight: 600 }}>L</span>
          </i>
          <code>0x7a3d…b41c</code>
          <b key={balance} className={balance !== 22237.6 ? "gu-tickb" : ""}>
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </b>
        </div>
      </header>

      {!started || !user ? (
        <div className={"gu-empty" + (started ? " leaving" : "")}>
          <span className="gu-orb" />
          <h2>What should we move today?</h2>
          <p>Ask in plain words. I prepare every transaction as a card, and nothing is signed until you approve it.</p>
          <div className="gu-sugg" data-gu-sugg>
            {SUGGESTIONS.map((s, i) => (
              <button key={s.title} onClick={i === 0 ? start : undefined} data-gu-start={i === 0 ? "" : undefined}>
                <span className="ic">
                  <s.icon size={16} />
                </span>
                <ArrowUpRight className="ar" size={14} />
                <strong>{s.title}</strong>
                <small>{s.sub}</small>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {started && user ? (
        <div className="gu-thread" ref={threadRef}>
          <div className="gu-col">
            <div className="gu-user">Swap 0.5 LMN to USDX</div>
            {(think || steps.shown > 0) && (
              <div className="gu-asst">
                <span className="gu-orb" />
                <div className="gu-body">
                  {steps.shown === 0 && (
                    <div className="gu-think">
                      Thinking<i>.</i>
                      <i>.</i>
                      <i>.</i>
                    </div>
                  )}
                  <div className="gu-steps">
                    {STEPS.slice(0, steps.shown).map((s) => (
                      <div className="gu-step" key={s.id}>
                        <span className="gu-dot">
                          {steps.done >= s.id ? (
                            <span className="ok">
                              <Check size={10} strokeWidth={3.2} />
                            </span>
                          ) : (
                            <span className="spin" />
                          )}
                        </span>
                        <b>{s.label}</b>
                        <em>{s.note}</em>
                      </div>
                    ))}
                  </div>
                  {text && (
                    <div className="gu-text">
                      {words.map((w, i) => (
                        <span className="gu-w" key={i} style={{ animationDelay: `${i * WORD_GAP}ms` }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                  {card && (
                    <div className="gu-cardwrap" data-gu-card>
                      <div className="gu-card">
                        <div className="gu-ch">
                          <div className="l">
                            <span className="ico">
                              <Repeat2 size={14} />
                            </span>
                            <div>
                              <b>Swap</b>
                              <small>
                                <i className="gu-chain" /> Aurora
                              </small>
                            </div>
                          </div>
                          <div className={"gu-pill" + (stage === "confirmed" ? " ok" : "")}>
                            <span key={stage}>
                              {stage === "quote" && (
                                <>
                                  <svg className="gu-ring" viewBox="0 0 16 16" key={cycle}>
                                    <circle className="bg" cx="8" cy="8" r="6" />
                                    <circle className="fg" cx="8" cy="8" r="6" />
                                  </svg>
                                  {secs}s
                                </>
                              )}
                              {stage === "signing" && (
                                <>
                                  <i className="gu-spin-s" />
                                  Signing
                                </>
                              )}
                              {stage === "pending" && (
                                <>
                                  <i className="gu-spin-s" />
                                  Pending
                                </>
                              )}
                              {stage === "confirmed" && (
                                <>
                                  <Check size={13} strokeWidth={2.6} />
                                  Confirmed
                                </>
                              )}
                              {stage === "declined" && (
                                <>
                                  <X size={13} />
                                  Declined
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="gu-swap">
                          <div className="gu-leg">
                            <span className="gu-tok a">
                              L<i />
                            </span>
                            <div className="t">
                              <small>You pay</small>
                              <b>
                                0.5<span>LMN</span>
                              </b>
                            </div>
                            <span className="usd">${(0.5 * rate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="gu-between">
                            <i>
                              <ArrowDown size={12} />
                            </i>
                          </div>
                          <div className="gu-leg">
                            <span className="gu-tok b">
                              $<i />
                            </span>
                            <div className="t">
                              <small>You receive</small>
                              <b key={receive} className="tick-wrap">
                                <span style={{ fontSize: 17, marginLeft: 0 }} className={cycle ? "gu-tickb" : ""}>
                                  {receive}
                                </span>
                                <span>USDX</span>
                              </b>
                            </div>
                            <span className="usd">${(0.5 * rate * 0.9995).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        <div className="gu-rows">
                          <div>
                            Rate<b>1 LMN = {rate.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDX</b>
                          </div>
                          <div>
                            Price impact<b>0.03%</b>
                          </div>
                          <div>
                            Minimum received<b>{min} USDX</b>
                          </div>
                          <div>
                            Network fee<b>$1.84</b>
                          </div>
                        </div>
                        {(stage === "quote" || stage === "signing") && (
                          <div className="gu-collapse">
                            <div>
                              <div className="gu-actions">
                                <button className={"no" + (wallet > 1 ? " gone" : "")} onClick={() => setStage("declined")} data-gu-decline>
                                  Decline
                                </button>
                                <button className="yes" onClick={approve} data-gu-approve>
                                  {wallet > 0 ? "Confirm in wallet" : "Approve"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {(stage === "pending" || stage === "confirmed") && (
                          <div className="gu-collapse snap">
                            <div>
                              <div className="gu-prog">
                                <div className="gu-stepper">
                                  <div className="line">
                                    <i style={{ width: progress >= 3 ? "100%" : progress === 2 ? "100%" : progress === 1 ? "50%" : "0%" }} />
                                  </div>
                                  {["Sign", "Submitted", "Confirmed"].map((l, i) => {
                                    const done = progress > i;
                                    const cur = progress === i;
                                    return (
                                      <div key={l} className={"gu-st" + (done ? " done on" : "") + (cur ? " cur on" : "")}>
                                        <span className="c">
                                          {done ? <Check size={12} strokeWidth={3} /> : cur ? <i className="gu-spin-s" /> : null}
                                        </span>
                                        {l}
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="gu-foot">
                                  <code>0x821b…c253</code>
                                  <span className={stage === "confirmed" ? "show" : ""}>
                                    View on explorer <ExternalLink size={12} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {stage === "declined" && (
                          <div className="gu-collapse in">
                            <div>
                              <div className="gu-declined">Nothing was signed. Ask me for a new quote any time.</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {stage === "confirmed" && <div className="gu-done">Done. You swapped 0.5 LMN for {receive} USDX.</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="gu-composer">
        <span>Ask to swap, send, or approve</span>
        <i>
          <ArrowUp size={15} />
        </i>
      </div>
    </div>
  );
}
