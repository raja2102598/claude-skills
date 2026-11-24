// Procedural "generated" images: four small landscapes painted on a 2D canvas. No photos or assets.

export type SceneId = "lake" | "dunes" | "cliffs" | "harbour";

export const SCENES: { id: SceneId; label: string }[] = [
  { id: "lake", label: "A glacier lake under a summit lit by the last sun" },
  { id: "dunes", label: "Wind-cut dunes at midday with a pale sky" },
  { id: "cliffs", label: "Sea cliffs fading into fog above a quiet beach" },
  { id: "harbour", label: "A small harbour at night with lights on the water" },
];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 1D fractal value noise in [-1, 1], sampled on [0, 1]. */
function ridge(seed: number, octaves = 4) {
  const r = rng(seed);
  const tables = Array.from({ length: octaves }, (_, o) => Array.from({ length: 4 * 2 ** o + 2 }, () => r() * 2 - 1));
  return (x: number) => {
    let v = 0;
    let amp = 1;
    let norm = 0;
    tables.forEach((tab, o) => {
      const f = x * 4 * 2 ** o;
      const i = Math.floor(f);
      const u = f - i;
      const s = u * u * (3 - 2 * u);
      v += amp * (tab[i] + (tab[i + 1] - tab[i]) * s);
      norm += amp;
      amp *= 0.5;
    });
    return v / norm;
  };
}

function linear(ctx: CanvasRenderingContext2D, y0: number, y1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

function skyline(ctx: CanvasRenderingContext2D, S: number, base: number, amp: number, fn: (x: number) => number, fill: string | CanvasGradient) {
  ctx.beginPath();
  ctx.moveTo(0, S);
  for (let i = 0; i <= 96; i++) {
    const x = i / 96;
    ctx.lineTo(x * S, base * S - fn(x) * amp * S);
  }
  ctx.lineTo(S, S);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function lake(ctx: CanvasRenderingContext2D, S: number, seed: number) {
  const horizon = 0.6;
  ctx.fillStyle = linear(ctx, 0, horizon * S, [
    [0, "#26315f"],
    [0.42, "#5f5a92"],
    [0.78, "#d99a86"],
    [1, "#f4cfa4"],
  ]);
  ctx.fillRect(0, 0, S, horizon * S);
  const glow = ctx.createRadialGradient(0.66 * S, 0.5 * S, 0, 0.66 * S, 0.5 * S, 0.42 * S);
  glow.addColorStop(0, "rgba(255, 222, 180, 0.65)");
  glow.addColorStop(1, "rgba(255, 222, 180, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, horizon * S);
  // thin clouds
  const r = rng(seed);
  for (let i = 0; i < 7; i++) {
    const y = (0.08 + r() * 0.3) * S;
    const x = r() * S;
    ctx.fillStyle = `rgba(255, 214, 200, ${0.08 + r() * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(x, y, (0.15 + r() * 0.2) * S, 0.012 * S, -0.05, 0, Math.PI * 2);
    ctx.fill();
  }
  const far = ridge(seed + 1);
  skyline(ctx, S, 0.52, 0.06, (x) => far(x) + 0.4, "rgba(132, 124, 172, 0.85)");
  // the lit summit
  const peak = ridge(seed + 2, 3);
  const summit = (x: number) => Math.max(0, 1 - Math.abs(x - 0.56) / 0.2) ** 1.6 * 2.2 + peak(x) * 0.35 + 0.35;
  const rock = ctx.createLinearGradient(0.36 * S, 0, 0.76 * S, 0);
  rock.addColorStop(0, "#4a3d58");
  rock.addColorStop(0.5, "#7d4c4a");
  rock.addColorStop(0.62, "#e08257");
  rock.addColorStop(1, "#b76a4e");
  skyline(ctx, S, 0.56, 0.11, summit, rock);
  const mid = ridge(seed + 3);
  skyline(ctx, S, 0.585, 0.035, (x) => mid(x) + 0.3, "#3d3a55");
  // treeline
  ctx.fillStyle = "#1c2724";
  ctx.beginPath();
  ctx.moveTo(0, S);
  const tr = rng(seed + 4);
  for (let x = 0; x <= S; x += S / 110) {
    const h = (0.012 + tr() * 0.03) * S;
    ctx.lineTo(x, horizon * S + 0.01 * S);
    ctx.lineTo(x + S / 220, horizon * S - h);
  }
  ctx.lineTo(S, S);
  ctx.closePath();
  ctx.fill();
  // water with a soft mirror of the sky and summit
  ctx.fillStyle = linear(ctx, horizon * S, S, [
    [0, "#5a6f97"],
    [1, "#1b2740"],
  ]);
  ctx.fillRect(0, horizon * S + 0.012 * S, S, S);
  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.translate(0, 2 * horizon * S + 0.024 * S);
  ctx.scale(1, -1);
  ctx.drawImage(ctx.canvas, 0, 0.25 * S, S, (horizon - 0.25) * S, 0, 0.25 * S, S, (horizon - 0.25) * S);
  ctx.restore();
  ctx.fillStyle = "rgba(255, 236, 210, 0.18)";
  for (let i = 0; i < 26; i++) {
    const y = (horizon + 0.03 + r() * 0.3) * S;
    ctx.fillRect((0.45 + r() * 0.3) * S, y, (0.04 + r() * 0.12) * S, 0.003 * S);
  }
  // foreground shore
  const shore = ridge(seed + 5);
  skyline(ctx, S, 0.97, 0.06, (x) => shore(x) + (1 - x) * 1.6, "#2a2a26");
}

function dunes(ctx: CanvasRenderingContext2D, S: number, seed: number) {
  ctx.fillStyle = linear(ctx, 0, 0.55 * S, [
    [0, "#7fb2cc"],
    [0.7, "#d7e3dc"],
    [1, "#f2e2c6"],
  ]);
  ctx.fillRect(0, 0, S, S);
  const sun = ctx.createRadialGradient(0.28 * S, 0.2 * S, 0, 0.28 * S, 0.2 * S, 0.22 * S);
  sun.addColorStop(0, "rgba(255, 250, 230, 0.95)");
  sun.addColorStop(0.12, "rgba(255, 246, 220, 0.8)");
  sun.addColorStop(1, "rgba(255, 246, 220, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, S, 0.6 * S);
  const layers: [number, number, string, string][] = [
    [0.5, 0.05, "#e8b884", "#d79a64"],
    [0.6, 0.08, "#dc9a5d", "#c07a45"],
    [0.72, 0.09, "#cf8248", "#a65e33"],
    [0.86, 0.1, "#b4652f", "#7f4322"],
  ];
  layers.forEach(([base, amp, lit, shade], i) => {
    const n = ridge(seed + 10 + i, 3);
    const g = ctx.createLinearGradient(0, (base - amp) * S, S, base * S + 0.2 * S);
    g.addColorStop(0, lit);
    g.addColorStop(1, shade);
    skyline(ctx, S, base, amp, (x) => Math.sin(x * (3 + i) + i) * 0.6 + n(x) * 0.6, g);
  });
}

function cliffs(ctx: CanvasRenderingContext2D, S: number, seed: number) {
  ctx.fillStyle = linear(ctx, 0, S, [
    [0, "#b9c6cc"],
    [0.42, "#e6e9e3"],
    [0.46, "#8ea9b0"],
    [1, "#2f4c58"],
  ]);
  ctx.fillRect(0, 0, S, S);
  // waves
  const r = rng(seed);
  ctx.strokeStyle = "rgba(240, 246, 244, 0.5)";
  ctx.lineWidth = 0.004 * S;
  for (let i = 0; i < 18; i++) {
    const y = (0.5 + r() * 0.42) * S;
    ctx.beginPath();
    ctx.moveTo(r() * 0.4 * S, y);
    ctx.quadraticCurveTo(0.5 * S, y - 0.01 * S, (0.6 + r() * 0.4) * S, y + 0.01 * S);
    ctx.stroke();
  }
  // beach curve
  ctx.fillStyle = "#d8c7a6";
  ctx.beginPath();
  ctx.moveTo(0.18 * S, S);
  ctx.bezierCurveTo(0.5 * S, 0.86 * S, 0.7 * S, 0.7 * S, 1.02 * S, 0.62 * S);
  ctx.lineTo(S, S);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.beginPath();
  ctx.moveTo(0.18 * S, S);
  ctx.bezierCurveTo(0.5 * S, 0.86 * S, 0.7 * S, 0.7 * S, 1.02 * S, 0.62 * S);
  ctx.lineTo(1.02 * S, 0.635 * S);
  ctx.bezierCurveTo(0.7 * S, 0.715 * S, 0.5 * S, 0.875 * S, 0.22 * S, S);
  ctx.closePath();
  ctx.fill();
  // cliffs, far ones lost in fog
  const shapes: [number, string][] = [
    [0.36, "rgba(120, 132, 126, 0.55)"],
    [0.52, "rgba(78, 90, 84, 0.8)"],
    [0.7, "#38423c"],
  ];
  shapes.forEach(([w, fill], i) => {
    const n = ridge(seed + 20 + i, 3);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(S, (0.18 + i * 0.05) * S);
    for (let k = 0; k <= 40; k++) {
      const y = (0.18 + i * 0.05) * S + (k / 40) * (0.62 - i * 0.02) * S;
      ctx.lineTo(S - w * S * (0.55 + 0.45 * (k / 40)) + n(k / 40) * 0.05 * S, y);
    }
    ctx.lineTo(S, S);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = linear(ctx, 0.2 * S, 0.55 * S, [
    [0, "rgba(236, 238, 232, 0.65)"],
    [1, "rgba(236, 238, 232, 0)"],
  ]);
  ctx.fillRect(0, 0.2 * S, S, 0.35 * S);
}

function harbour(ctx: CanvasRenderingContext2D, S: number, seed: number) {
  ctx.fillStyle = linear(ctx, 0, S, [
    [0, "#0e1530"],
    [0.5, "#2c3160"],
    [0.56, "#1a2142"],
    [1, "#080d1d"],
  ]);
  ctx.fillRect(0, 0, S, S);
  const moon = ctx.createRadialGradient(0.74 * S, 0.18 * S, 0, 0.74 * S, 0.18 * S, 0.16 * S);
  moon.addColorStop(0, "rgba(236, 232, 214, 0.95)");
  moon.addColorStop(0.18, "rgba(236, 232, 214, 0.5)");
  moon.addColorStop(1, "rgba(236, 232, 214, 0)");
  ctx.fillStyle = moon;
  ctx.fillRect(0, 0, S, 0.5 * S);
  const r = rng(seed);
  // buildings on the quay
  ctx.fillStyle = "#070b18";
  let x = 0;
  const lights: [number, number][] = [];
  while (x < S) {
    const w = (0.03 + r() * 0.06) * S;
    const h = (0.04 + r() * 0.12) * S;
    ctx.fillRect(x, 0.54 * S - h, w + 1, h + 0.02 * S);
    for (let k = 0; k < 3; k++) if (r() < 0.55) lights.push([x + r() * w, 0.54 * S - r() * h]);
    x += w;
  }
  // lighthouse on the breakwater
  ctx.fillStyle = "#0b1022";
  ctx.fillRect(0.12 * S, 0.36 * S, 0.025 * S, 0.2 * S);
  lights.push([0.132 * S, 0.37 * S]);
  lights.forEach(([lx, ly]) => {
    const warm = r() < 0.8;
    ctx.fillStyle = warm ? "#ffcf7a" : "#bfe1ff";
    ctx.fillRect(lx, ly, 0.006 * S, 0.006 * S);
    const g = ctx.createLinearGradient(0, 0.56 * S, 0, (0.56 + 0.15 + r() * 0.15) * S);
    g.addColorStop(0, warm ? "rgba(255, 196, 110, 0.45)" : "rgba(170, 210, 255, 0.35)");
    g.addColorStop(1, "rgba(255, 196, 110, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(lx - 0.002 * S, 0.56 * S, 0.008 * S, 0.3 * S);
  });
  ctx.fillStyle = "rgba(160, 170, 220, 0.12)";
  for (let i = 0; i < 30; i++) ctx.fillRect(r() * S, (0.58 + r() * 0.4) * S, (0.03 + r() * 0.1) * S, 0.003 * S);
}

const PAINTERS: Record<SceneId, (ctx: CanvasRenderingContext2D, S: number, seed: number) => void> = { lake, dunes, cliffs, harbour };

export interface SceneImage {
  id: SceneId;
  label: string;
  url: string;
  canvas: HTMLCanvasElement;
}

/** Paint a scene at `size` px and return it with a data URL for <img> layers. */
export function paintScene(id: SceneId, label: string, seed: number, size = 880): SceneImage {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  PAINTERS[id](ctx, size, seed);
  return { id, label, canvas, url: canvas.toDataURL("image/jpeg", 0.9) };
}

/** Average the scene onto an n x n grid: one RGB triple per dot. */
export function sampleGrid(scene: HTMLCanvasElement, n: number): Float32Array {
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(scene, 0, 0, n, n);
  const px = ctx.getImageData(0, 0, n, n).data;
  const out = new Float32Array(n * n * 3);
  for (let i = 0; i < n * n; i++) {
    out[i * 3] = px[i * 4];
    out[i * 3 + 1] = px[i * 4 + 1];
    out[i * 3 + 2] = px[i * 4 + 2];
  }
  return out;
}
