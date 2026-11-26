// The halftone dot field: a grid of dots that idles, carries a dark wave while the image "computes", takes on the
// image's colours as a halftone, then hands over to the image itself. Canvas 2D, one pass per frame.
// Geometry and curves were measured on the reference (see .reanimate/image-generation/spec.md); the code is our own.

const INK: [number, number, number] = [24, 22, 19];
const INK_STYLE = `rgb(${INK[0]}, ${INK[1]}, ${INK[2]})`;

export const smoothstep = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/** cubic-bezier(x1, 0, x2, 1) evaluated at u (x1/x2 only: y1 = 0, y2 = 1). */
export function bezier(x1: number, x2: number, u: number) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const s = (lo + hi) / 2;
    const x = 3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s;
    if (x < u) lo = s;
    else hi = s;
  }
  const s = (lo + hi) / 2;
  return 3 * (1 - s) * s * s + s * s * s;
}

/** Per-dot target of the finished halftone, derived from the image colour under the dot. */
export interface FieldImage {
  n: number;
  col: Float32Array; // darkened dot colour, rgb 0..255
  alpha: Float32Array;
  radius: Float32Array; // at pitch 8
}

export function toFieldImage(grid: Float32Array, n: number): FieldImage {
  const col = new Float32Array(n * n * 3);
  const alpha = new Float32Array(n * n);
  const radius = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) {
    const r = grid[i * 3];
    const g = grid[i * 3 + 1];
    const b = grid[i * 3 + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    // printed a little darker than the picture (x 0.78, fitted on the reference's dot log), so light areas read as
    // pale dots and dark areas as full ones; dots shrink slightly as the picture gets lighter
    col[i * 3] = r * 0.78;
    col[i * 3 + 1] = g * 0.78;
    col[i * 3 + 2] = b * 0.78;
    alpha[i] = 0.83 + 0.04 * (1 - lum);
    radius[i] = 2.95 - 0.35 * lum;
  }
  return { n, col, alpha, radius };
}

/** Clear the backing store and scale to CSS px. */
function begin(ctx: CanvasRenderingContext2D, dpr: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export interface FieldFrame {
  /** 'idle': the static empty-state bump. 'run': wave + colour. */
  mode: "idle" | "run";
  /** wave centre and size, in this canvas's px */
  bx: number;
  by: number;
  sigma: number;
  /** 0 → 1 as the wave fades */
  fade: number;
  /** 0 → 1 as dots take the image colour */
  c: number;
}

/** Draw one frame of a dot field of n x n dots, `pitch` px apart (radius scales with pitch / 8). */
export function drawField(ctx: CanvasRenderingContext2D, n: number, pitch: number, img: FieldImage | null, f: FieldFrame, dpr = 1) {
  const size = n * pitch;
  const k = pitch / 8;
  begin(ctx, dpr);
  const half = pitch / 2;
  if (f.mode === "idle") {
    const cx = size / 2;
    const s2 = 2 * (120 * k) ** 2;
    ctx.fillStyle = INK_STYLE;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const x = half + i * pitch;
        const y = half + j * pitch;
        const a = 0.13 + 0.51 * Math.exp(-((x - cx) ** 2 + (y - cx) ** 2) / s2);
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(x, y, (0.48 + 2.47 * a) * k, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    return;
  }
  const s2 = 2 * f.sigma * f.sigma;
  const wave = 0.54 * (1 - f.fade);
  const c = img ? f.c : 0;
  if (c <= 0) ctx.fillStyle = INK_STYLE;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = half + i * pitch;
      const y = half + j * pitch;
      const g = Math.exp(-((x - f.bx) ** 2 + (y - f.by) ** 2) / s2);
      const grey = 0.13 + wave * g;
      let a = grey;
      let r = 0.48 + 2.47 * grey;
      if (c > 0 && img) {
        const d = j * n + i;
        a = grey + (img.alpha[d] - grey) * c;
        r = r + (img.radius[d] - r) * c;
        const cr = INK[0] + (img.col[d * 3] - INK[0]) * c;
        const cg = INK[1] + (img.col[d * 3 + 1] - INK[1]) * c;
        const cb = INK[2] + (img.col[d * 3 + 2] - INK[2]) * c;
        ctx.fillStyle = `rgb(${cr | 0}, ${cg | 0}, ${cb | 0})`;
      }
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, r * k, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

/** The soft core of the wave, drawn on a second canvas that CSS blurs. */
export function drawGlow(ctx: CanvasRenderingContext2D, n: number, pitch: number, f: FieldFrame, dpr = 1) {
  begin(ctx, dpr);
  if (f.mode !== "run") return;
  const peak = 0.92 * (1 - f.fade);
  if (peak <= 0.27) return;
  const s2 = 2 * f.sigma * f.sigma;
  const half = pitch / 2;
  ctx.fillStyle = INK_STYLE;
  for (let j = 0; j < n; j++) {
    const y = half + j * pitch;
    for (let i = 0; i < n; i++) {
      const x = half + i * pitch;
      const a = peak * Math.exp(-((x - f.bx) ** 2 + (y - f.by) ** 2) / s2) - 0.27;
      if (a <= 0.003) continue;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, 2.05 + 2.57 * a, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
