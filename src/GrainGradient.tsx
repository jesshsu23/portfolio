import { useEffect, useRef } from 'react'

// Hero background: a slowly flowing gradient wave with heavy film grain,
// drawn by a small WebGL shader in the site's navy / lavender palette.
// Falls back to the static CSS gradient on .hero-glow when WebGL is missing.

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
// highp matters: Apple GPUs run mediump as 16-bit floats, which overflow
// in the hash below and render the whole field black.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;
uniform float t;

float hash(vec2 p) {
  p = fract(mod(p, 1024.0) * vec2(0.1031, 0.1030));
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = uv;
  p.x *= r.x / r.y;
  float tt = t * 0.05;
  // On portrait screens the sheets are thickened so they still read as folds.
  float k = clamp(r.x / r.y, 0.45, 1.0);

  // Domain warp so the waves bend and breathe instead of sliding.
  vec2 q = vec2(fbm(p * 0.8 + vec2(0.0, tt)), fbm(p * 0.8 + vec2(5.2, -tt)));

  // Two sheets of light, like Kat-style folds: one rising from the lower
  // left, one hanging from the upper right. Each is brightest at its edge
  // and falls off into the dark.
  float c1 = 0.30 + 0.22 * sin(p.x * 1.05 / k + tt * 3.0 + q.y * 2.6) + 0.06 * sin(p.x * 2.4 - tt * 2.0);
  float d1 = c1 - uv.y;                       // > 0 below the curve
  float s1 = smoothstep(-0.03, 0.06, d1) * exp(-max(d1, 0.0) * 2.4 * k);

  float c2 = 0.86 - 0.2 * sin(p.x * 0.9 / k - tt * 2.4 + q.x * 2.4);
  float d2 = uv.y - c2;                       // > 0 above the curve
  float s2 = smoothstep(-0.03, 0.06, d2) * exp(-max(d2, 0.0) * 3.0 * k) * 0.75;

  float field = fbm(p * 1.4 + q * 1.4 + tt);
  float v = clamp((s1 + s2) * (0.75 + 0.5 * field), 0.0, 1.0);

  vec3 ground   = vec3(0.031, 0.031, 0.039);  // #08080a
  vec3 navy     = vec3(0.075, 0.110, 0.300);
  vec3 violet   = vec3(0.400, 0.340, 0.860);
  vec3 lavender = vec3(0.862, 0.816, 1.000);  // #dcd0ff

  vec3 col = mix(ground, navy, smoothstep(0.0, 0.35, v));
  col = mix(col, violet, smoothstep(0.3, 0.9, v));
  col = mix(col, lavender, smoothstep(0.9, 1.15, v) * 0.45);

  // Film grain: strongest where the light is.
  float g = hash(gl_FragCoord.xy);
  col *= 0.68 + 0.64 * g;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export function GrainGradient() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!canvas || !gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(prog, 'r')
    const uT = gl.getUniformLocation(prog, 't')

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const t0 = performance.now() - 8000
    let frame = 0
    let visible = true

    const draw = (now: number) => {
      gl.uniform1f(uT, (now - t0) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const resize = () => {
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      // Always (re)set: in dev, StrictMode remounts with a fresh program on
      // an already-sized canvas, and an unset resolution renders black.
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uR, w, h)
      draw(performance.now())
    }

    const loop = (now: number) => {
      draw(now)
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (!reduced && visible && !frame && !document.hidden) frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    resize()
    canvas.classList.add('is-live')
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="grain-gradient" aria-hidden="true" />
}
