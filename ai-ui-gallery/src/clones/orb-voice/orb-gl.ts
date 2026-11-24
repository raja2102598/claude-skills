/**
 * Hand-written WebGL2 renderer for the voice orb.
 *
 * A marbled ink sphere: two layers of domain-warped gradient noise, twisted around the centre and
 * bulged like glass, lit from the upper left, with a soft outer glow, listening ripples and an
 * orbiting sheen while thinking. The motion laws (edge deformation, swirl falloff, ripple travel,
 * glow and swell response) were measured from the reference; the noise, layering, lighting and
 * palette are our own.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uSize;        // drawing-buffer size, px
uniform float uFlow;       // ink clock (advances faster while the voice is loud)
uniform float uTwist;      // accumulated swirl, rad
uniform float uRadius;     // orb radius, 1 = rest
uniform float uWobble;     // slow edge deformation
uniform float uVoice;      // fast, voice-driven edge deformation
uniform float uRings;      // listening ripples, 0..1+
uniform float uRingPhase;  // ripple travel, 0..1 (wraps)
uniform float uSheen;      // thinking sheen, 0..1
uniform float uSheenAngle; // sheen position, rad
uniform float uGlow;       // outer glow
uniform float uMute;       // desaturation, 0..1
uniform float uLift;       // brightening with the voice
uniform vec3 uInk;
uniform vec3 uBloom;
uniform vec3 uPearl;

out vec4 outColor;

// Gradient noise with a quintic fade and an integer lattice hash (same field on every GPU).
vec2 grad(vec2 cell) {
  uvec2 q = uvec2(ivec2(cell) + 4096) * uvec2(0x8da6b343u, 0xd8163841u);
  uint h = q.x ^ q.y ^ 0x9e3779b9u;
  h ^= h >> 16u; h *= 0x7feb352du; h ^= h >> 15u; h *= 0x846ca68bu; h ^= h >> 16u;
  float a = float(h >> 8u) * (6.2831853 / 16777216.0);
  return vec2(cos(a), sin(a));
}
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(grad(i), f);
  float b = dot(grad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(grad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(grad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 1.9 * mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}
// Two octaves, the second turned so the layers never align.
float marble(vec2 p) {
  return 0.72 * gnoise(p) + 0.28 * gnoise(mat2(1.5, 1.1, -1.1, 1.5) * p + 9.2);
}

void main() {
  // Orb space: the resting orb has radius 1, which is 60 % of the half canvas.
  vec2 p = (gl_FragCoord.xy / uSize - 0.5) * (2.0 / 0.6);
  float r = length(p);
  float ang = atan(p.y, p.x);
  float t = uFlow;

  // Edge: slow lobes always, faster and finer lobes when the voice is loud.
  float lobes = 0.55 * sin(2.0 * ang + 0.9 * t) + 0.3 * sin(3.0 * ang - 1.3 * t) + 0.15 * sin(5.0 * ang + 2.1 * t);
  float voiced = 0.05 * sin(4.0 * ang + 3.1 * t) + 0.035 * sin(7.0 * ang - 2.4 * t);
  float edge = uRadius * (1.0 + uWobble * lobes + uVoice * voiced);
  float aa = 2.0 / (0.6 * uSize.x);
  float inside = 1.0 - smoothstep(edge - aa, edge + aa, r);

  // Sphere coordinates.
  vec2 q = p / edge;
  float rr = min(length(q), 1.0);
  float z = sqrt(1.0 - rr * rr);

  // Swirl: strongest at the centre, easing off toward the rim; then a glassy bulge.
  float tw = uTwist * (1.0 - 0.55 * rr);
  vec2 f = mat2(cos(tw), sin(tw), -sin(tw), cos(tw)) * q;
  f *= 1.0 + 0.7 * (1.0 - z);

  // Ink: a warp field carries two marbled layers past each other.
  vec2 warp = vec2(marble(f * 0.6 + vec2(0.0, 0.3 * t)), marble(f * 0.6 + vec2(4.7, -0.26 * t)));
  float ink = marble(f * 0.7 + 0.55 * warp + vec2(0.17 * t, 2.3));
  float veil = marble(f * 1.05 - 0.4 * warp + vec2(-0.21 * t, 5.1));

  vec3 col = mix(uInk, uBloom, smoothstep(-0.6, 0.55, ink));
  col = mix(col, uPearl, smoothstep(0.0, 0.85, veil) * 0.6);

  // Light from the upper left, a pearly rim, and a lift toward pearl while the voice is loud.
  vec3 n = normalize(vec3(q * 0.85, z));
  float light = dot(n, normalize(vec3(-0.5, 0.6, 0.7)));
  col *= 0.78 + 0.3 * light;
  col = mix(col, uPearl, pow(1.0 - z, 2.4) * 0.42);
  col = mix(col, uPearl, clamp(uLift, 0.0, 1.0) * (0.3 + 0.7 * z));

  // Thinking: a bright band orbits the rim, with a fainter twin opposite.
  float da = atan(sin(ang - uSheenAngle), cos(ang - uSheenAngle));
  float db = atan(sin(ang - uSheenAngle + 3.14159), cos(ang - uSheenAngle + 3.14159));
  float band = (exp(-da * da * 1.8) + 0.5 * exp(-db * db * 3.0)) * smoothstep(0.1, 0.95, rr);
  col = mix(col, mix(uPearl, vec3(1.0), 0.6), band * uSheen * 0.85);

  // Specular glint.
  vec2 g = q - vec2(-0.34, 0.4);
  col += vec3(1.0) * exp(-dot(g, g) * 9.0) * 0.18;

  col = mix(col, vec3(dot(col, vec3(0.299, 0.587, 0.114))), uMute * 0.7);
  col = clamp(col, 0.0, 1.0);

  // Outside: a soft glow and, while listening, three ripples travelling outward.
  float d = max(r - edge, 0.0);
  float fade = 1.0 - smoothstep(1.2, 1.62, r);
  float glow = exp(-d * 4.2) * uGlow * fade;
  float rings = 0.0;
  for (int i = 0; i < 3; i++) {
    float ph = fract(uRingPhase + float(i) / 3.0);
    float rad = edge + 0.06 + ph * 0.5;
    float wd = 0.018 + ph * 0.03;
    float k = (r - rad) / wd;
    rings += exp(-k * k) * (1.0 - ph) * (1.0 - ph) * smoothstep(0.0, 0.12, ph);
  }
  rings *= uRings * fade;
  float outer = clamp(glow + rings * 0.5, 0.0, 1.0) * (1.0 - inside);

  vec3 premul = col * inside + uInk * outer;
  outColor = vec4(premul, inside + outer);
}`;

export type Rgb = [number, number, number];

export interface OrbPalette {
  ink: Rgb;
  bloom: Rgb;
  pearl: Rgb;
}

export interface OrbUniforms {
  flow: number;
  twist: number;
  radius: number;
  wobble: number;
  voice: number;
  rings: number;
  ringPhase: number;
  sheen: number;
  sheenAngle: number;
  glow: number;
  mute: number;
  lift: number;
}

export interface OrbRenderer {
  draw(u: OrbUniforms): void;
  resize(cssSize: number): void;
  dispose(): void;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const UNIFORMS = [
  "uSize", "uFlow", "uTwist", "uRadius", "uWobble", "uVoice", "uRings", "uRingPhase",
  "uSheen", "uSheenAngle", "uGlow", "uMute", "uLift", "uInk", "uBloom", "uPearl",
] as const;

/** Returns null when WebGL2 is unavailable; the caller then shows the CSS fallback. */
export function createOrbRenderer(canvas: HTMLCanvasElement, palette: OrbPalette): OrbRenderer | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle covering the viewport.
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const loc = Object.fromEntries(UNIFORMS.map((n) => [n, gl.getUniformLocation(program, n)])) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  gl.uniform3fv(loc.uInk, palette.ink);
  gl.uniform3fv(loc.uBloom, palette.bloom);
  gl.uniform3fv(loc.uPearl, palette.pearl);

  return {
    resize(cssSize) {
      const px = Math.max(1, Math.round(cssSize * Math.min(window.devicePixelRatio || 1, 2)));
      if (canvas.width !== px || canvas.height !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      gl.viewport(0, 0, px, px);
      gl.uniform2f(loc.uSize, px, px);
    },
    draw(u) {
      gl.uniform1f(loc.uFlow, u.flow);
      gl.uniform1f(loc.uTwist, u.twist);
      gl.uniform1f(loc.uRadius, u.radius);
      gl.uniform1f(loc.uWobble, u.wobble);
      gl.uniform1f(loc.uVoice, u.voice);
      gl.uniform1f(loc.uRings, u.rings);
      gl.uniform1f(loc.uRingPhase, u.ringPhase);
      gl.uniform1f(loc.uSheen, u.sheen);
      gl.uniform1f(loc.uSheenAngle, u.sheenAngle);
      gl.uniform1f(loc.uGlow, u.glow);
      gl.uniform1f(loc.uMute, u.mute);
      gl.uniform1f(loc.uLift, u.lift);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      // The context is left alive: a remount (fast refresh, strict mode) reuses the same canvas.
    },
  };
}
