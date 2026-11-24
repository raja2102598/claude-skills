import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { Aperture, Download, Feather, Maximize2, RotateCcw, Shuffle, Sparkle, Sparkles, Square } from "lucide-react";
import clsx from "clsx";
import { drawField, drawGlow, toFieldImage, type FieldFrame, type FieldImage } from "./field";
import { paintScene, sampleGrid, SCENES, type SceneId, type SceneImage } from "./scenes";
import { doneAt, fieldAt, percentAt, resolveAt, RUN_AT } from "./timeline";
import "./image-generation.css";

/*
 * Image generation loader. One run paints four images: each starts as a quiet dot field, a dark wave drifts across
 * it while the model "computes", the dots take on the picture's colours as a halftone, then they blur away while
 * the sharp image comes in. The filmstrip below runs the same phases on four variations, each a beat later.
 * Motion measured on the reference (.reanimate/image-generation/spec.md); markup, palette, copy and images are ours.
 */

const STAGE = 440;
const STAGE_DOTS = 55; // pitch 8
const THUMB = 48;
const THUMB_DOTS = 12; // pitch 4
const FIRST_SEEDS = [31907, 52211, 7703, 18454];
const UPSCALE_MS = 1100;

const PROMPT =
  "Quiet landscapes at first light: a glacier lake below a sunlit summit, wind-cut dunes, sea cliffs in drifting fog and a small harbour after dark, on medium format film";

const SUGGESTIONS = [
  "A greenhouse café at dawn, terracotta tiles, ferns hanging from iron beams, warm haze",
  "Hand-thrown ceramic bowls on a linen cloth, morning light from a tall side window",
  "A reading nook under a sloped roof, wool blankets, a stack of worn paperbacks, rain outside",
];

const MODELS = [
  { id: "nova", name: "Nova Image", Icon: Aperture },
  { id: "atlas", name: "Atlas Mini", Icon: Sparkle },
  { id: "quill", name: "Quill 2", Icon: Feather },
] as const;

type Aspect = "1:1" | "4:5" | "16:9";
const ASPECTS: { id: Aspect; dims: [number, number]; box: [number, number]; glyph: [number, number] }[] = [
  { id: "1:1", dims: [1024, 1024], box: [440, 440], glyph: [10, 10] },
  { id: "4:5", dims: [896, 1120], box: [352, 440], glyph: [8, 10] },
  { id: "16:9", dims: [1344, 768], box: [440, 248], glyph: [12, 7] },
];

type Status = "running" | "done" | "stopped";

/** One image of a run. Mutable: the frame loop owns it; React only sees the snapshot in `View`. */
interface Job {
  scene: SceneImage;
  seed: number;
  aspect: Aspect;
  stageField: FieldImage;
  thumbField: FieldImage;
  /** performance.now() at which this image's clock reads RUN_AT */
  start: number;
  /** place in the stagger: 0 colours and resolves first */
  slot: number;
  /** clock reading at which Stop froze it */
  frozen: number | null;
  status: Status;
  elapsed: number;
  upscaled: boolean;
}

interface ImgView {
  url: string;
  seed: number;
  status: Status;
  elapsed: number;
  aspect: Aspect;
  upscaled: boolean;
  label: string;
}

interface View {
  started: boolean;
  images: ImgView[];
  active: number;
  upscaling: boolean;
}

const autoplayEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("autoplay") !== "0";
  } catch {
    return true;
  }
};

const IDLE: FieldFrame = { mode: "idle", bx: 0, by: 0, sigma: 1, fade: 0, c: 0 };

const clockOf = (job: Job, now: number) => job.frozen ?? now - job.start + RUN_AT;

/** Paint one image and its two dot grids. The clock fields are set when the run starts. */
function makeJob(id: SceneId, seed: number, aspect: Aspect): Job {
  const label = SCENES.find((s) => s.id === id)!.label;
  const scene = paintScene(id, label, seed);
  return {
    scene,
    seed,
    aspect,
    stageField: toFieldImage(sampleGrid(scene.canvas, STAGE_DOTS), STAGE_DOTS),
    thumbField: toFieldImage(sampleGrid(scene.canvas, THUMB_DOTS), THUMB_DOTS),
    start: 0,
    slot: 0,
    frozen: null,
    status: "running",
    elapsed: 0,
    upscaled: false,
  };
}

function setLayer(el: HTMLElement | null, opacity: number, blur: number, scale = 1) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(4);
  el.style.filter = blur > 0.005 ? `blur(${blur.toFixed(3)}px)` : "none";
  el.style.transform = scale !== 1 ? `scale(${scale.toFixed(5)})` : "none";
}

function sizeCanvas(c: HTMLCanvasElement | null, px: number, dpr: number) {
  if (!c) return null;
  const want = Math.round(px * dpr);
  if (c.width !== want) c.width = c.height = want;
  return c.getContext("2d");
}

const snapshot = (jobs: Job[]): ImgView[] =>
  jobs.map((j) => ({
    url: j.scene.url,
    seed: j.seed,
    status: j.status,
    elapsed: j.elapsed,
    aspect: j.aspect,
    upscaled: j.upscaled,
    label: j.scene.label,
  }));

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState(PROMPT);
  const [model, setModel] = useState<(typeof MODELS)[number]["id"]>("nova");
  const [aspect, setAspect] = useState<Aspect>("1:1");
  const [view, setView] = useState<View>({ started: false, images: [], active: 0, upscaling: false });
  const [capture] = useState(() => !autoplayEnabled());
  const titleId = useId();

  const fieldRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);
  const bandRef = useRef<HTMLCanvasElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const thumbFields = useRef<(HTMLCanvasElement | null)[]>([]);
  const thumbPreviews = useRef<(HTMLImageElement | null)[]>([]);
  const thumbButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const eng = useRef({
    t0: null as number | null,
    jobs: [] as Job[],
    active: 0,
    dirty: true,
    reduce: false,
    upscale: null as null | { idx: number; start: number },
    runs: 0,
    /** the first run's images, painted at mount so the auto-submit does not stall a frame */
    prepared: null as Job[] | null,
    key: "",
  });

  /** Push the loop's state to React when something discrete changed (statuses, active image, upscale). */
  const commit = useCallback((force = false) => {
    const e = eng.current;
    const key = `${e.t0 !== null && e.jobs.length > 0}|${e.active}|${e.upscale ? 1 : 0}|${e.jobs
      .map((j) => `${j.seed}:${j.status}:${j.upscaled ? 1 : 0}:${j.aspect}`)
      .join(",")}`;
    if (!force && key === e.key) return;
    e.key = key;
    const next: View = { started: e.jobs.length > 0, images: snapshot(e.jobs), active: e.active, upscaling: !!e.upscale };
    flushSync(() => setView(next));
  }, []);

  /** Start a run. `at` pins its clock (the auto-submit); otherwise the clock starts once the images are painted. */
  const startRun = useCallback(
    (ids: SceneId[], aspectId: Aspect, at?: number) => {
      const e = eng.current;
      const run = e.runs++;
      const jobs =
        e.prepared ??
        ids.map((id, i) => makeJob(id, 10000 + ((run * 7919 + i * 104729) % 89999), aspectId));
      e.prepared = null;
      const start = at ?? performance.now();
      jobs.forEach((job, i) => {
        job.start = start;
        job.slot = i;
      });
      e.jobs = jobs;
      e.active = 0;
      e.upscale = null;
      e.dirty = true;
      commit();
    },
    [commit],
  );

  /* the frame loop: draws the fields, drives the resolve styles and the read-out, and spots discrete events */
  useEffect(() => {
    const e = eng.current;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    e.reduce = reduceQuery.matches;
    const onReduce = () => {
      e.reduce = reduceQuery.matches;
      e.dirty = true;
    };
    reduceQuery.addEventListener("change", onReduce);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (e.runs === 0 && !e.prepared) e.prepared = SCENES.map((sc, i) => makeJob(sc.id, FIRST_SEEDS[i], "1:1"));
    if (!capture && e.t0 === null) e.t0 = performance.now();
    let raf = 0;

    const frame = () => {
      const now = performance.now();
      // the auto-submit: the first run begins RUN_AT after mount (or after the capture's start click)
      if (e.t0 !== null && e.jobs.length === 0 && now - e.t0 >= RUN_AT) {
        startRun(
          SCENES.map((sc) => sc.id),
          "1:1",
          e.t0 + RUN_AT,
        );
      }

      let changed = false;
      for (const job of e.jobs) {
        if (job.status !== "running") continue;
        const t = clockOf(job, now);
        if (t >= doneAt(job.slot)) {
          job.status = "done";
          job.elapsed = (doneAt(job.slot) - RUN_AT) / 1000;
          changed = true;
        }
      }

      // stage
      const job = e.jobs[e.active];
      const stageLive = !!job && job.status === "running";
      if (stageLive || e.dirty) {
        const ctx = sizeCanvas(fieldRef.current, STAGE, dpr);
        const gctx = sizeCanvas(glowRef.current, STAGE, dpr);
        if (!job) {
          if (ctx) drawField(ctx, STAGE_DOTS, 8, null, IDLE, dpr);
          if (gctx) drawGlow(gctx, STAGE_DOTS, 8, IDLE, dpr);
          setLayer(fieldRef.current, 1, 0);
          if (glowRef.current) glowRef.current.style.opacity = "0";
        } else if (job.status === "done") {
          setLayer(fieldRef.current, 0, 0);
          if (glowRef.current) glowRef.current.style.opacity = "0";
        } else {
          const t = clockOf(job, now);
          const p = resolveAt(t, job.slot);
          const f = e.reduce ? IDLE : fieldAt(t, job.slot, STAGE);
          if (ctx && p < 1) drawField(ctx, STAGE_DOTS, 8, job.stageField, f, dpr);
          if (gctx) drawGlow(gctx, STAGE_DOTS, 8, f, dpr);
          setLayer(fieldRef.current, 1 - p, e.reduce ? 0 : 5 * p);
          if (glowRef.current) glowRef.current.style.opacity = (e.reduce ? 0 : 1 - p).toFixed(4);
          setLayer(previewRef.current, p, e.reduce ? 0 : 12 * (1 - p), e.reduce ? 1 : 1.04 - 0.04 * p);
          if (percentRef.current) percentRef.current.textContent = `${percentAt(t, job.slot)}%`;
        }
      }

      // filmstrip
      e.jobs.forEach((j, i) => {
        if (j.status === "done" && !e.dirty) return;
        if (j.status === "stopped" && !e.dirty) return;
        const canvas = thumbFields.current[i];
        const img = thumbPreviews.current[i];
        if (j.status === "done") {
          setLayer(canvas, 0, 0);
          return;
        }
        const t = clockOf(j, now);
        const p = resolveAt(t, j.slot);
        const ctx = sizeCanvas(canvas, THUMB, dpr);
        if (ctx && p < 1) drawField(ctx, THUMB_DOTS, 4, j.thumbField, e.reduce ? IDLE : fieldAt(t, j.slot, THUMB), dpr);
        setLayer(canvas, 1 - p, e.reduce ? 0 : 5 * p);
        setLayer(img, p, e.reduce ? 0 : 12 * (1 - p), e.reduce ? 1 : 1.04 - 0.04 * p);
      });

      // upscale sweep: a band of halftone dots runs down the finished image
      const up = e.upscale;
      if (up) {
        const target = e.jobs[up.idx];
        const band = bandRef.current;
        const u = (now - up.start) / UPSCALE_MS;
        if (!target || u >= 1) {
          if (target) target.upscaled = true;
          e.upscale = null;
          if (band) band.getContext("2d")?.clearRect(0, 0, band.width, band.height);
          changed = true;
        } else if (band) drawBand(band, target, u, dpr);
      }

      e.dirty = false;
      if (changed) commit();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      reduceQuery.removeEventListener("change", onReduce);
    };
  }, [capture, commit, startRun]);

  const e = eng.current;
  const running = view.images.some((i) => i.status === "running");
  const doneCount = view.images.filter((i) => i.status === "done").length;
  const active = view.images[view.active];
  const activeAspect = ASPECTS.find((a) => a.id === (active?.aspect ?? aspect))!;
  const dimsScale = active?.upscaled ? 2 : 1;
  const canGenerate = prompt.trim().length > 0;

  const generate = (ids?: SceneId[]) => {
    if (!canGenerate && !ids) return;
    if (e.t0 === null) e.t0 = performance.now() - RUN_AT;
    // a prompt other than the sample (or a Vary) paints fresh images
    if (ids || prompt !== PROMPT || aspect !== "1:1") e.prepared = null;
    startRun(ids ?? SCENES.map((sc) => sc.id), aspect);
  };

  const stop = () => {
    const now = performance.now();
    for (const job of e.jobs) {
      if (job.status !== "running") continue;
      job.frozen = clockOf(job, now);
      job.status = "stopped";
    }
    e.dirty = true;
    commit();
  };

  const retry = () => {
    const now = performance.now();
    let slot = 0;
    for (const job of e.jobs) {
      if (job.status !== "stopped") continue;
      job.status = "running";
      job.frozen = null;
      job.start = now;
      job.slot = slot++;
    }
    e.dirty = true;
    commit();
  };

  const select = (i: number) => {
    if (!e.jobs[i]) return;
    if (e.upscale && e.upscale.idx !== i) {
      e.upscale = null;
      const band = bandRef.current;
      band?.getContext("2d")?.clearRect(0, 0, band.width, band.height);
    }
    e.active = i;
    e.dirty = true;
    commit();
  };

  const onStripKey = (ev: KeyboardEvent) => {
    const n = view.images.length;
    if (!n) return;
    const step = ev.key === "ArrowRight" || ev.key === "ArrowDown" ? 1 : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    const next = (view.active + step + n) % n;
    select(next);
    thumbButtons.current[next]?.focus();
  };

  const upscale = () => {
    if (!active || active.status !== "done" || active.upscaled || e.upscale) return;
    e.upscale = { idx: view.active, start: performance.now() };
    commit();
  };

  const vary = () => {
    const job = e.jobs[view.active];
    if (!job || running) return;
    generate([job.scene.id, job.scene.id, job.scene.id, job.scene.id]);
  };

  const download = () => {
    const job = e.jobs[view.active];
    if (!job || job.status !== "done") return;
    job.scene.canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `render-${job.seed}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  const begin = () => {
    if (e.t0 === null) e.t0 = performance.now();
  };

  const [boxW, boxH] = activeAspect.box;
  const status: "running" | "done" | "stopped" | null = active ? active.status : null;

  return (
    <div className="ig-shell">
      <section className="ig-root" aria-labelledby={titleId}>
        <h2 id={titleId} className="ig-sr">
          Image generation
        </h2>
        {capture && <button type="button" className="ig-start" data-ig-start aria-label="Start the demo run" onClick={begin} />}

        <div className="ig-frame">
          <div className="ig-stage" data-ig-stage>
            <div className="ig-field">
              <canvas ref={fieldRef} className="ig-field-canvas" data-ig-field aria-hidden />
              <canvas ref={glowRef} className="ig-glow" data-ig-glow aria-hidden />
            </div>

            {active && (
              <div className="ig-media" style={{ width: boxW, height: boxH }}>
                {active.status !== "done" ? (
                  <img ref={previewRef} key={`p-${active.seed}`} className="ig-image ig-preview" data-ig-preview src={active.url} alt="" draggable={false} />
                ) : (
                  <img key={`f-${active.seed}`} className="ig-image" data-ig-final src={active.url} alt={active.label} draggable={false} />
                )}
                <canvas ref={bandRef} className="ig-band" aria-hidden />
              </div>
            )}

            {status === "stopped" && (
              <div className="ig-halt">
                <p className="ig-halt-label">
                  <Square size={13} strokeWidth={2.2} aria-hidden /> Stopped
                </p>
                <p className="ig-halt-message">This image was halted before it finished rendering.</p>
                <button type="button" className="ig-retry" onClick={retry}>
                  <RotateCcw size={13} aria-hidden /> Retry
                </button>
              </div>
            )}

            <div className="ig-dims">
              <span className="ig-pill ig-mono">
                {activeAspect.dims[0] * dimsScale} × {activeAspect.dims[1] * dimsScale}
              </span>
            </div>

            {status && status !== "stopped" && (
              <div className="ig-status" data-ig-status role="status" aria-live="polite">
                <span className="ig-pill">
                  <span className="ig-stable">
                    <span className="ig-stable-item" data-on={status === "running" ? "" : undefined}>
                      <Spinner />
                      Generating
                      <span ref={percentRef} className="ig-percent">
                        1%
                      </span>
                    </span>
                    <span className="ig-stable-item ig-mono" data-on={status === "done" ? "" : undefined}>
                      seed {active?.seed} · {active?.elapsed.toFixed(1)}s
                    </span>
                  </span>
                </span>
              </div>
            )}

            {!view.started && (
              <div className="ig-empty" data-ig-empty>
                <p className="ig-empty-title">Write a prompt, then press Generate</p>
                <div className="ig-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="ig-suggestion"
                      onClick={() => {
                        setPrompt(s);
                        generate();
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ig-bar">
          <div className="ig-strip" role={view.started ? "radiogroup" : undefined} aria-label="Variations" onKeyDown={onStripKey}>
            {[0, 1, 2, 3].map((i) => {
              const img = view.images[i];
              if (!img) return <span key={i} className="ig-thumb-placeholder" aria-hidden />;
              const on = view.active === i;
              return (
                <button
                  key={`${i}-${img.seed}`}
                  ref={(el) => {
                    thumbButtons.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`Variation ${i + 1}${img.status === "running" ? ", rendering" : img.status === "stopped" ? ", stopped" : ""}`}
                  tabIndex={on ? 0 : -1}
                  className="ig-thumb"
                  data-thumb
                  data-active={on ? "" : undefined}
                  onClick={() => select(i)}
                >
                  <span className="ig-thumb-media">
                    {img.status !== "done" && (
                      <canvas
                        ref={(el) => {
                          thumbFields.current[i] = el;
                        }}
                        className="ig-field-canvas"
                        data-ig-field
                        aria-hidden
                      />
                    )}
                    <img
                      ref={(el) => {
                        thumbPreviews.current[i] = el;
                      }}
                      className={clsx("ig-image", img.status !== "done" && "ig-preview")}
                      data-ig-preview={img.status !== "done" ? "" : undefined}
                      src={img.url}
                      alt=""
                      draggable={false}
                    />
                    {img.status === "stopped" && (
                      <span className="ig-thumb-halt">
                        <Square size={12} strokeWidth={2.2} aria-hidden />
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ig-actions" role="group" aria-label="Image actions">
            <button type="button" className="ig-action" disabled={!active || active.status !== "done" || active.upscaled || view.upscaling} onClick={upscale}>
              <Maximize2 size={14} aria-hidden />
              {active?.upscaled ? "Upscaled" : "Upscale"}
            </button>
            <button type="button" className="ig-action" disabled={!active || running || view.upscaling} onClick={vary}>
              <Shuffle size={14} aria-hidden />
              Vary
            </button>
            <button type="button" className="ig-action" disabled={!active || active.status !== "done"} onClick={download}>
              <Download size={14} aria-hidden />
              Download
            </button>
          </div>
        </div>

        <form
          className="ig-composer"
          onSubmit={(ev) => {
            ev.preventDefault();
            if (running) stop();
            else generate();
          }}
        >
          <textarea
            className="ig-prompt"
            aria-label="Prompt"
            placeholder="Describe the picture you want…"
            rows={2}
            value={prompt}
            onChange={(ev) => setPrompt(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" && !ev.shiftKey) {
                ev.preventDefault();
                if (!running) generate();
              }
            }}
          />
          <div className="ig-toolbar">
            <div className="ig-chips" role="radiogroup" aria-label="Model">
              {MODELS.map(({ id, name, Icon }) => {
                const on = model === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={name}
                    title={name}
                    className={clsx("ig-chip ig-model-chip", `ig-mark-${id}`)}
                    onClick={() => setModel(id)}
                  >
                    <span className="ig-chip-mark">
                      <Icon size={15} strokeWidth={1.9} aria-hidden />
                    </span>
                    <span className="ig-chip-name">
                      <span className="ig-chip-name-text">{name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="ig-chips" role="radiogroup" aria-label="Aspect ratio">
              {ASPECTS.map(({ id, glyph }) => (
                <button key={id} type="button" role="radio" aria-checked={aspect === id} className="ig-chip ig-aspect-chip" onClick={() => setAspect(id)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="ig-glyph">
                    <rect x={(14 - glyph[0]) / 2} y={(14 - glyph[1]) / 2} width={glyph[0]} height={glyph[1]} rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  {id}
                </button>
              ))}
            </div>
            <button type="submit" className="ig-generate" data-variant={running ? "secondary" : "primary"} disabled={!running && !canGenerate}>
              <span className="ig-stable">
                <span className="ig-stable-item" data-on={running ? undefined : ""}>
                  <Sparkles size={15} aria-hidden />
                  Generate
                </span>
                <span className="ig-stable-item" data-on={running ? "" : undefined}>
                  <Square size={12} strokeWidth={2.2} aria-hidden />
                  Stop
                  <span className="ig-count">
                    {doneCount}/{Math.max(4, view.images.length)}
                  </span>
                </span>
              </span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/** 3 x 3 dot spinner: each dot fades on an 810 ms loop, offset so the light walks around the ring. */
function Spinner() {
  const ring = [0, 1, 2, 5, 8, 7, 6, 3];
  return (
    <span className="ig-spinner" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => {
        const k = ring.indexOf(i);
        return <span key={i} className="ig-spin-dot" data-center={k < 0 ? "" : undefined} style={k < 0 ? undefined : { animationDelay: `${-(8 - k) * 101}ms` }} />;
      })}
    </span>
  );
}

/** One frame of the upscale sweep: halftone dots in the image's colours inside a soft horizontal band. */
function drawBand(band: HTMLCanvasElement, job: Job, u: number, dpr: number) {
  const w = band.clientWidth;
  const h = band.clientHeight;
  if (!w || !h) return;
  const W = Math.round(w * dpr);
  const H = Math.round(h * dpr);
  if (band.width !== W || band.height !== H) {
    band.width = W;
    band.height = H;
  }
  const ctx = band.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const ease = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
  const yc = -40 + (h + 80) * ease;
  const half = 34;
  const pitch = 8;
  const f = job.stageField;
  const side = Math.max(w, h);
  const ox = (side - w) / 2;
  const oy = (side - h) / 2;
  for (let y = pitch / 2; y < h; y += pitch) {
    const d = Math.abs(y - yc);
    if (d > half) continue;
    const strength = 1 - d / half;
    for (let x = pitch / 2; x < w; x += pitch) {
      const gi = Math.min(f.n - 1, Math.floor(((x + ox) / side) * f.n));
      const gj = Math.min(f.n - 1, Math.floor(((y + oy) / side) * f.n));
      const id = gj * f.n + gi;
      ctx.globalAlpha = 0.85 * strength;
      ctx.fillStyle = `rgb(${f.col[id * 3] | 0}, ${f.col[id * 3 + 1] | 0}, ${f.col[id * 3 + 2] | 0})`;
      ctx.beginPath();
      ctx.arc(x, y, f.radius[id] * (0.6 + 0.4 * strength), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
