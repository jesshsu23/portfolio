import { useEffect, useRef } from 'react'

// Hero background: a "liquid blob" in the manner of the After Effects
// blur + choker trick. Several coloured balls drift around one centre; their
// metaball field is thresholded with a soft edge so they read as a single
// gooey shape, and their colours blend smoothly inside it. Drawn by a small
// WebGL shader; .hero-glow keeps a static CSS stand-in when WebGL is missing.

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;
uniform float t;
uniform float u;   // device pixel ratio, so grid lines stay 1 CSS px

float hash(vec2 p) {
  p = fract(mod(p, 1024.0) * vec2(0.1031, 0.1030));
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// One ball: position, radius and colour. Returns its field contribution and
// accumulates a smooth (gaussian-weighted) colour blend.
void ball(vec2 p, vec2 c, float rad, vec3 col, inout float f, inout vec3 acc, inout float wsum, float R) {
  vec2 d = p - c;
  float d2 = dot(d, d) + 1e-4;
  f += rad * rad / d2;
  float w = exp(-d2 / (R * R * 0.22));
  acc += col * w;
  wsum += w;
}

void main() {
  float aspect = r.x / r.y;
  vec2 p = gl_FragCoord.xy / r.y;   // height-normalised, origin bottom-left
  float tt = t * 0.32;

  // Right of the copy on wide screens; on narrow ones, in the gap right of
  // the experience line and the wrapped role title.
  bool wide = aspect > 1.1;
  vec2 o = wide ? vec2(aspect * 0.8, 0.5) : vec2(aspect * 0.79, 0.55);
  float R = wide ? 0.19 : 0.085;

  vec3 violet  = vec3(0.55, 0.30, 1.00);
  vec3 magenta = vec3(0.95, 0.25, 0.85);
  vec3 coral   = vec3(1.00, 0.42, 0.25);
  vec3 cyan    = vec3(0.10, 0.90, 1.00);
  vec3 blue    = vec3(0.20, 0.62, 1.00);

  // Split and merge, like the reference: the balls hold together, fly
  // apart into separate droplets, hang there, then pull back into one.
  float ph = fract(t / 10.0);
  float split = smoothstep(0.38, 0.52, ph) * (1.0 - smoothstep(0.72, 0.9, ph));
  float rot = t * 0.12;
  float sd = 1.35 * split;   // how far each droplet travels, in R
  float shrink = 1.0 - 0.3 * split;

  float f = 0.0, wsum = 0.0;
  vec3 acc = vec3(0.0);
  ball(p, o + R * (vec2(0.55 * cos(tt * 0.9), 0.45 * sin(tt * 1.1)) * (1.0 - 0.85 * split) + sd * vec2(0.7 * cos(rot), 1.2 * sin(rot))),               R * 0.62 * shrink, cyan,    f, acc, wsum, R);
  ball(p, o + R * (vec2(0.50 * cos(tt * 0.7 + 2.1), 0.55 * sin(tt * 0.8 + 1.3)) * (1.0 - 0.85 * split) + sd * vec2(0.7 * cos(rot + 1.257), 1.2 * sin(rot + 1.257))), R * 0.58 * shrink, magenta, f, acc, wsum, R);
  ball(p, o + R * (vec2(0.45 * cos(tt * 1.2 + 4.0), 0.50 * sin(tt * 0.6 + 3.7)) * (1.0 - 0.85 * split) + sd * vec2(0.7 * cos(rot + 2.513), 1.2 * sin(rot + 2.513))), R * 0.55 * shrink, coral,   f, acc, wsum, R);
  ball(p, o + R * (vec2(0.60 * sin(tt * 0.5 + 0.7), 0.40 * cos(tt * 1.3 + 2.2)) * (1.0 - 0.85 * split) + sd * vec2(0.7 * cos(rot + 3.770), 1.2 * sin(rot + 3.770))), R * 0.50 * shrink, violet,  f, acc, wsum, R);
  ball(p, o + R * (vec2(0.35 * sin(tt * 1.0 + 5.1), 0.60 * cos(tt * 0.9 + 0.4)) * (1.0 - 0.85 * split) + sd * vec2(0.7 * cos(rot + 5.027), 1.2 * sin(rot + 5.027))), R * 0.48 * shrink, blue,    f, acc, wsum, R);

  vec3 blob = acc / max(wsum, 1e-4);
  // A gentle sheen from the upper left, like the reference's soft highlight.
  vec2 lp = (p - o) / R;
  blob = mix(blob, vec3(1.0), 0.12 * smoothstep(0.9, -0.6, lp.x - lp.y));

  // The "choker": a soft threshold on the field gives a blurred but
  // definite edge; a faint halo sits just outside it.
  float body = smoothstep(1.55, 2.1, f);
  float halo = smoothstep(0.5, 1.6, f) * 0.18;

  vec3 ground = vec3(0.031, 0.031, 0.039);  // #08080a

  // Background grid, as in the reference; fades out toward the bottom.
  float cell = 56.0 * u;
  vec2 gq = mod(gl_FragCoord.xy, cell);
  float line = max(step(gq.x, u), step(gq.y, u));
  float gridFade = smoothstep(0.0, 0.55, gl_FragCoord.y / r.y);
  vec3 col = ground + vec3(0.07) * line * gridFade;

  col = mix(col, blob * 0.55, halo);
  col = mix(col, blob, body);

  // Light film grain to match the rest of the site.
  col *= 0.9 + 0.2 * hash(gl_FragCoord.xy);

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export function LiquidBlob() {
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
    const uU = gl.getUniformLocation(prog, 'u')

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const t0 = performance.now() - 2000
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
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uR, w, h)
      gl.uniform1f(uU, dpr)
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
