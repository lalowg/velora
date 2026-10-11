/* VÉLORA — the silk. A single full-screen WebGL fragment shader:
   a procedural height field of folds, lit with an anisotropic (Kajiya–Kay) sheen,
   disturbed by pointer ripples and swept by scroll-driven "wipes" between scenes. */

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uR[8];
uniform vec3 uShadow;
uniform vec3 uBase;
uniform vec3 uSheen;
uniform float uWipe;
uniform vec2 uPtr;
uniform float uPtrAmp;
uniform float uFold;

float H(vec2 p){
  float t = uTime;
  vec2 q = p + 0.22*vec2(sin(p.y*1.6 + t*0.23), sin(p.x*1.2 - t*0.19));
  float f = 0.55*sin(q.x*2.0 + q.y*0.55 + t*0.33);
  f += 0.28*sin(q.x*4.1 - q.y*1.2 - t*0.26 + 1.3);
  f += 0.10*sin(q.x*8.3 + q.y*2.4 + t*0.47);
  f += 0.24*(1.0 - abs(sin(q.x*2.7*uFold + q.y*1.4 + t*0.18)));
  for(int i=0;i<8;i++){
    vec4 r = uR[i];
    if(r.w > 0.0){
      float d = length(p - r.xy);
      float front = r.z*0.62;
      float k = (d - front)*4.6;
      float env = exp(-k*k) * exp(-r.z*0.8);
      f += r.w * env * sin(d*21.0 - r.z*9.0);
    }
  }
  vec2 dp = p - uPtr;
  f += uPtrAmp * exp(-dot(dp,dp)*9.0);
  float band = p.x*0.8 + p.y*0.35 - uWipe;
  f += 0.42*exp(-band*band*7.0) * sin(p.x*7.0 - uWipe*5.0);
  return f;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5)*asp, uv.y - 0.5) * 2.2;
  float e = 0.004;
  float h0 = H(p);
  float hx = H(p + vec2(e, 0.0));
  float hy = H(p + vec2(0.0, e));
  vec3 n = normalize(vec3(-(hx - h0)/e*0.17, -(hy - h0)/e*0.17, 1.0));
  vec3 L = normalize(vec3(0.55, 0.65, 0.62));
  vec3 Hh = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = max(dot(n, L), 0.0);
  vec3 T0 = normalize(vec3(-0.27, 1.0, 0.0));
  vec3 T = normalize(T0 - n*dot(n, T0));
  float th = dot(T, Hh);
  float aniso = pow(sqrt(max(1.0 - th*th, 0.0)), 46.0);
  float spec = pow(max(dot(n, Hh), 0.0), 64.0);
  float occ = smoothstep(-1.2, 1.15, h0);
  vec3 col = mix(uShadow, uBase, smoothstep(0.08, 0.95, diff));
  col *= 0.55 + 0.45*occ;
  col += uSheen * (aniso*0.5 + spec*0.42) * (0.35 + 0.65*occ);
  col *= 0.74 + 0.42*smoothstep(0.0, 1.25, uv.x*0.55 + uv.y*0.7);
  vec2 vv = uv - 0.5; vv.x *= asp*0.8;
  col *= 1.0 - 0.62*smoothstep(0.25, 0.98, length(vv));
  gl_FragColor = vec4(col, 1.0);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
/* [shadow, base, sheen] per scene */
const PALETTE = [
  ['#050404', '#2c0d11', '#b9807a'],
  ['#0d0304', '#5c1a20', '#f0b0a2'],
  ['#6b6359', '#d8cfc1', '#fffaf0'],
  ['#020202', '#161412', '#8c857c'],
].map((s) => s.map(hex));
export const SCENE_KEYS = [0, 0.375, 0.65, 0.93];
const WIPES = [[0.175, 0.3], [0.45, 0.575], [0.725, 0.85]];
const ss = (t) => t * t * (3 - 2 * t);
const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

function paletteAt(p) {
  for (let k = 0; k < 3; k++) {
    const [a, b] = WIPES[k];
    if (p < a) return PALETTE[k];
    if (p < b) { const t = ss((p - a) / (b - a)); return PALETTE[k].map((c, i) => lerp3(c, PALETTE[k + 1][i], t)); }
  }
  return PALETTE[3];
}
function wipeAt(p) {
  for (const [a, b] of WIPES) if (p >= a && p <= b) return -2.8 + 5.6 * ((p - a) / (b - a));
  return 60;
}

export class Silk {
  constructor(canvas, { reduced = false, mobile = false } = {}) {
    this.c = canvas;
    this.reduced = reduced;
    this.mobile = mobile;
    this.p = 0;
    this.ripples = Array.from({ length: 8 }, () => ({ x: 0, y: 0, t: -99, s: 0 }));
    this.ri = 0;
    this.ptr = { x: 0, y: 0, tx: 0, ty: 0, amp: 0, tamp: 0, lx: null, ly: null, acc: 0 };
    this.visible = true;
    this.pageVisible = !document.hidden;
    this.time = 6.0;
    this.scale = mobile ? 0.62 : 0.75;
    this.frames = [];
    this.raf = 0;
    this.last = 0;
    this.tween = null;
    this.ok = false;
    try { this.ok = this.init(); } catch (e) { this.ok = false; }
    if (this.ok) {
      this.resize();
      if ('ResizeObserver' in window) new ResizeObserver(() => this.resize()).observe(this.c);
      else addEventListener('resize', () => this.resize());
      document.addEventListener('visibilitychange', () => { this.pageVisible = !document.hidden; this.kick(); });
      this.kick();
    }
  }

  init() {
    const gl = this.c.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    if (!gl) return false;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    const pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uRes', 'uTime', 'uR', 'uShadow', 'uBase', 'uSheen', 'uWipe', 'uPtr', 'uPtrAmp', 'uFold'].forEach((n) => { U[n] = gl.getUniformLocation(pr, n); });
    this.gl = gl; this.U = U;
    this.c.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.ok = false; cancelAnimationFrame(this.raf); this.onlost && this.onlost(); }, false);
    return true;
  }

  resize() {
    if (!this.ok) return;
    const r = this.c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2);
    let w = Math.max(2, Math.round(r.width * dpr * this.scale));
    let h = Math.max(2, Math.round(r.height * dpr * this.scale));
    const max = this.mobile ? 900000 : 1800000;
    if (w * h > max) { const k = Math.sqrt(max / (w * h)); w = Math.round(w * k); h = Math.round(h * k); }
    if (this.c.width !== w || this.c.height !== h) { this.c.width = w; this.c.height = h; }
    this.aspect = r.width / Math.max(1, r.height);
    this.rect = r;
    this.kick();
  }

  setReduced(v) { this.reduced = v; this.kick(); }
  setVisible(v) { this.visible = v; this.kick(); }
  setProgress(p) { this.p = Math.min(1, Math.max(0, p)); this.tween = null; this.kick(); }

  tweenTo(p, ms = 1400) {
    if (this.reduced || !this.ok) { this.p = p; this.tween = null; this.kick(); return; }
    this.tween = { from: this.p, to: p, t0: performance.now(), ms };
    this.kick();
  }

  toP(clientX, clientY) {
    const r = this.c.getBoundingClientRect();
    const ux = (clientX - r.left) / r.width, uy = 1 - (clientY - r.top) / r.height;
    const asp = r.width / Math.max(1, r.height);
    return [(ux - 0.5) * asp * 2.2, (uy - 0.5) * 2.2];
  }

  ripple(px, py, s = 0.3) {
    const r = this.ripples[this.ri];
    r.x = px; r.y = py; r.t = performance.now() / 1000; r.s = s;
    this.ri = (this.ri + 1) % this.ripples.length;
    this.kick();
  }

  rippleAt(clientX, clientY, s) { const [x, y] = this.toP(clientX, clientY); this.ripple(x, y, s); }

  pointer(clientX, clientY) {
    const [x, y] = this.toP(clientX, clientY);
    const P = this.ptr;
    if (P.lx !== null) {
      const d = Math.hypot(x - P.lx, y - P.ly);
      P.acc += d;
      P.tamp = Math.min(0.26, P.tamp + d * 0.5);
      if (P.acc > 0.16) { P.acc = 0; this.ripple(x, y, Math.min(0.2, 0.05 + d * 0.9)); }
    }
    P.lx = x; P.ly = y; P.tx = x; P.ty = y;
    this.kick();
  }

  pointerLeave() { this.ptr.lx = null; this.ptr.tamp = 0; }

  needsLoop(now) {
    if (!this.visible || !this.pageVisible) return false;
    if (!this.reduced) return true;
    const t = now / 1000;
    if (this.tween) return true;
    if (this.ptr.amp > 0.003 || this.ptr.tamp > 0.003) return true;
    return this.ripples.some((r) => r.s > 0 && t - r.t < 5);
  }

  kick() {
    if (!this.ok || this.raf) return;
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  frame(now) {
    this.raf = 0;
    if (!this.ok) return;
    const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0.016;
    this.last = now;
    if (!this.reduced) this.time = (this.time + dt) % 3600;
    if (this.tween) {
      const k = Math.min(1, (now - this.tween.t0) / this.tween.ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.p = this.tween.from + (this.tween.to - this.tween.from) * e;
      if (k >= 1) this.tween = null;
    }
    const P = this.ptr;
    P.x += (P.tx - P.x) * 0.12; P.y += (P.ty - P.y) * 0.12;
    P.amp += (P.tamp - P.amp) * 0.08; P.tamp *= 0.93;
    this.draw(now);

    // adaptive resolution: keep the shader under budget on weaker GPUs
    if (!this.reduced && this.visible) {
      this.frames.push(dt);
      if (this.frames.length > 45) {
        const avg = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
        this.frames.length = 0;
        if (avg > 0.026 && this.scale > 0.4) { this.scale *= 0.8; this.resize(); }
      }
    }
    if (this.needsLoop(now)) this.kick();
    else this.last = 0;
  }

  draw(now) {
    const gl = this.gl, U = this.U;
    gl.viewport(0, 0, this.c.width, this.c.height);
    const pal = paletteAt(this.p);
    gl.uniform2f(U.uRes, this.c.width, this.c.height);
    gl.uniform1f(U.uTime, this.time);
    gl.uniform3fv(U.uShadow, pal[0]);
    gl.uniform3fv(U.uBase, pal[1]);
    gl.uniform3fv(U.uSheen, pal[2]);
    gl.uniform1f(U.uWipe, wipeAt(this.p));
    gl.uniform1f(U.uFold, 1.0 + this.p * 0.6);
    gl.uniform2f(U.uPtr, this.ptr.x, this.ptr.y);
    gl.uniform1f(U.uPtrAmp, this.ptr.amp);
    const t = now / 1000;
    const arr = new Float32Array(32);
    this.ripples.forEach((r, i) => {
      const age = t - r.t;
      const live = r.s > 0 && age >= 0 && age < 5;
      arr[i * 4] = r.x; arr[i * 4 + 1] = r.y; arr[i * 4 + 2] = live ? age : 0; arr[i * 4 + 3] = live ? r.s : 0;
    });
    gl.uniform4fv(U.uR, arr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
