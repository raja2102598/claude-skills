import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AudioLines } from "lucide-react";
import { createOrbRenderer, type OrbPalette, type Rgb } from "./orb-gl";
import "./orb.css";

/* Palette: lagoon cap over warm pearl (our own; the reference is blue over white). */
const PEARL: Rgb = [0.984, 0.968, 0.93];
const DEEP: Rgb = [0.035, 0.55, 0.52];
const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Rgb;
const PALETTE: OrbPalette = { deep: DEEP, mist: mixRgb(PEARL, DEEP, 0.34), pearl: PEARL };

/*
 * Motion constants measured from the reference trace (.reanimate/orb-presence/spec.md):
 * a slow clock at 0.14 units/s drives every term; the horizon sways on two sines and bobs on a third.
 */
const IDLE_RATE = 0.14;
const OPEN_RATE = 0.42; // addition: the orb quickens while the assistant is open
const SWAY = [
  { amp: 0.52, freq: 0.8, phase: 0 },
  { amp: 0.18, freq: 2.1, phase: 1.1 },
] as const;
const BOB = { amp: 0.05, freq: 1.3, phase: 0.6 } as const;
const WAKE_TAU_S = 0.18; // addition: open/close settles in about 600 ms
const ORB_PX = 260;

export default function AssistantOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [fallback, setFallback] = useState(false);
  const statusId = useId();

  openRef.current = open;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createOrbRenderer(canvas, PALETTE);
    if (!renderer) {
      setFallback(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ro = new ResizeObserver(([entry]) => {
      renderer.resize(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(canvas);
    const rect = canvas.getBoundingClientRect();
    renderer.resize(rect.width, rect.height);

    // The clock runs on page time, so the drift carries on seamlessly if the orb remounts.
    let last = performance.now();
    let phase = (last / 1000) * IDLE_RATE;
    let wake = 0;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const still = reduce.matches;
      const target = openRef.current ? 1 : 0;
      wake = still ? target : wake + (target - wake) * (1 - Math.exp(-dt / WAKE_TAU_S));
      if (!still) phase += dt * (IDLE_RATE + (OPEN_RATE - IDLE_RATE) * wake);
      // Reduced motion holds a pleasant fixed pose instead of the drift.
      const tau = still ? 2.2 : phase;
      const tilt = SWAY.reduce((sum, s) => sum + s.amp * Math.sin(s.freq * tau + s.phase), 0);
      const rise = BOB.amp * Math.sin(BOB.freq * tau + BOB.phase) + 0.1 * wake;
      renderer.draw({ phase: tau, tilt, rise, wake });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="orbp-root">
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="Ask the assistant"
        aria-expanded={open}
        aria-controls={statusId}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        animate={{
          boxShadow: open
            ? "0 0 26px 2px rgba(0, 0, 0, 0.45), 0 0 56px 6px rgba(45, 196, 178, 0.28)"
            : "0 0 26px 2px rgba(0, 0, 0, 0.45), 0 0 56px 6px rgba(45, 196, 178, 0)",
        }}
        className="orbp-button"
        style={{ width: ORB_PX, height: ORB_PX }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="orbp-canvas"
          style={{ display: fallback ? "none" : undefined }}
        />
        {fallback && (
          <span aria-hidden="true" className="orbp-fallback" />
        )}
      </motion.button>

      <div id={statusId} role="status" className="orbp-status">
        <AnimatePresence>
          {open && (
            <motion.span
              key="listening"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="orbp-chip"
            >
              <AudioLines aria-hidden="true" />
              Listening… Esc to close
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
