/**
 * Hand-written WebGL2 renderer for the assistant orb.
 *
 * The look: a pearl disc whose upper part is capped by a deep colour. The horizon between the two
 * tilts and rises on slow sines, and turbulent haze and fine threads drift along it. The motion timing
 * (rates, periods, amplitudes) is measured from the reference; the noise, layering and palette are our own.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uSize;     // drawing-buffer size in px
uniform float uPhase;   // slow clock: 0.14 per second when idle
uniform float uTilt;    // horizon angle, radians
uniform float uRise;    // horizon offset along its normal
uniform float uWake;    // 0 idle, 1 open
uniform vec3 uDeep;
uniform vec3 uMist;
uniform vec3 uPearl;

out vec4 outColor;

// Gradient noise with a quintic fade. The lattice hash is pure integer maths, so every GPU draws
// the same field (a sin()-based hash drifts with float precision).
vec2 gradAt(vec2 cell) {
  uvec2 q = uvec2(ivec2(cell)) * uvec2(0x8da6b343u, 0xd8163841u);
  uint h = q.x ^ q.y ^ 0x9e3779b9u;
  h ^= h >> 16u;
  h *= 0x7feb352du;
  h ^= h >> 15u;
  h *= 0x846ca68bu;
  h ^= h >> 16u;
  float a = float(h >> 8u) * (6.2831853 / 16777216.0);
  return vec2(cos(a), sin(a));
}

float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(gradAt(i), f);
  float b = dot(gradAt(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(gradAt(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(gradAt(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

// Four octaves, each rotated so the layers never line up.
const mat2 OCTAVE = mat2(1.6, 1.2, -1.2, 1.6);
float turb(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int k = 0; k < 4; k++) {
    sum += amp * gnoise(p);
    p = OCTAVE * p;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec2 c = uv - 0.5;

  // Horizon frame: n points up into the deep cap, k runs along the horizon.
  vec2 n = vec2(sin(uTilt), cos(uTilt));
  float h = dot(c, n) + 0.5 + uRise;
  vec2 k = mat2(cos(uTilt), -sin(uTilt), sin(uTilt), cos(uTilt)) * c;

  // Haze: stretched along the horizon and domain-warped, drifting sideways.
  // The offsets pick a composition whose big features sit evenly about the horizon.
  vec2 s = vec2(k.x * 1.3 + 3.1, k.y * 3.6 + 0.6);
  vec2 flow = uPhase * vec2(0.25, 0.28);
  vec2 warp = vec2(turb(s + flow), turb(s + vec2(4.1, 2.3) - flow));
  float haze = turb(s * 1.15 + 0.5 * flow + 0.9 * warp);
  // Threads: finer, flatter strands riding the same drift.
  float threads = turb(vec2(k.x * 2.6, k.y * 8.0) + flow + 7.7);

  // Turbulence lives in the transition band only, so the cap and the base stay calm.
  float band = smoothstep(0.1, 0.42, h) * (1.0 - smoothstep(0.6, 1.0, h));
  float shade = clamp(h + (haze * 0.27 + threads * 0.06) * band, 0.0, 1.0);

  vec3 col = uPearl;
  col = mix(col, uMist, smoothstep(0.2, 0.62, shade));
  col = mix(col, uDeep, smoothstep(0.46, 0.85, shade));

  // A touch of depth at the rim and a lift when the assistant is open.
  float r = length(c);
  col *= 1.0 - 0.07 * smoothstep(0.32, 0.5, r);
  col += uWake * 0.06 * (1.0 - smoothstep(0.0, 0.5, r));

  float px = 1.6 / uSize.x;
  float alpha = 1.0 - smoothstep(0.4935 - px, 0.4935 + px, r);
  outColor = vec4(col * alpha, alpha);
}`;

export type Rgb = [number, number, number];

export interface OrbPalette {
  deep: Rgb;
  mist: Rgb;
  pearl: Rgb;
}

export interface OrbFrame {
  phase: number;
  tilt: number;
  rise: number;
  wake: number;
}

export interface OrbRenderer {
  draw(frame: OrbFrame): void;
  resize(cssWidth: number, cssHeight: number): void;
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

/** Returns null when WebGL2 is unavailable; the caller then shows the CSS fallback. */
export function createOrbRenderer(canvas: HTMLCanvasElement, palette: OrbPalette): OrbRenderer | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
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

  // One triangle that covers the viewport.
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uSize = u("uSize");
  const uPhase = u("uPhase");
  const uTilt = u("uTilt");
  const uRise = u("uRise");
  const uWake = u("uWake");
  gl.uniform3fv(u("uDeep"), palette.deep);
  gl.uniform3fv(u("uMist"), palette.mist);
  gl.uniform3fv(u("uPearl"), palette.pearl);

  return {
    resize(cssWidth, cssHeight) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(cssWidth * dpr));
      const h = Math.max(1, Math.round(cssHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uSize, w, h);
    },
    draw({ phase, tilt, rise, wake }) {
      gl.uniform1f(uPhase, phase);
      gl.uniform1f(uTilt, tilt);
      gl.uniform1f(uRise, rise);
      gl.uniform1f(uWake, wake);
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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
