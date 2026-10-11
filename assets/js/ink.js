/* =========================================================
   Ink layer — a small WebGL pigment simulation.
   The pointer deposits ink (a blue-black core with a rose or
   teal halo). Ink drifts on a slow curl-noise current, bleeds
   into its neighbours and fades. A click presses a stamp.

   Channels in the simulation texture:
     R = sumi (blue-black ink)   G = rose   B = teal
   On paper it multiplies like ink; on screen it glows like light.
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var canvas = document.createElement("canvas");
  canvas.className = "ink-layer";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false });
  if (!gl) { canvas.remove(); return; }

  var VERT = "attribute vec2 p; varying vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.0,1.0); }";

  var NOISE = [
    "float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }",
    "float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);",
    "  return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }"
  ].join("\n");

  var SIM = [
    "precision highp float;",
    "varying vec2 uv;",
    "uniform sampler2D prev;",
    "uniform vec2 px; uniform float aspect, t, force, size, decay;",
    "uniform vec2 m0, m1; uniform vec2 pig;",
    NOISE,
    "vec2 curl(vec2 p){ float e=0.05;",
    "  float a=vnoise(p+vec2(0.0,e)), b=vnoise(p-vec2(0.0,e)), c=vnoise(p+vec2(e,0.0)), d=vnoise(p-vec2(e,0.0));",
    "  return vec2(a-b, -(c-d))/(2.0*e); }",
    "float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-7),0.0,1.0); return length(pa-ba*h); }",
    "void main(){",
    "  vec2 q = vec2(uv.x*aspect, uv.y);",
    "  vec2 a = vec2(m0.x*aspect, m0.y), b = vec2(m1.x*aspect, m1.y);",
    "  float d = seg(q, a, b);",
    "  vec2 v = curl(q*2.4 + vec2(t*0.021, -t*0.017)) * 0.00042;",
    "  v += (m1-m0) * exp(-d*d/0.0035) * 0.30 * step(0.001, force);",
    "  vec2 s = uv - v;",
    "  vec4 c = texture2D(prev, s);",
    "  vec4 n = texture2D(prev, s+vec2(px.x,0.0)) + texture2D(prev, s-vec2(px.x,0.0))",
    "         + texture2D(prev, s+vec2(0.0,px.y)) + texture2D(prev, s-vec2(0.0,px.y));",
    "  c = mix(c, n*0.25, 0.24);",
    "  c = c*decay - 0.0031;",
    "  float g = vnoise(q*46.0)*0.55 + vnoise(q*11.0 + t*0.3)*0.45;",
    "  float core = exp(-d*d/(0.00016*size)) * force;",
    "  float halo = exp(-d*d/(0.0017*size)) * force;",
    "  c.r += core * (0.42 + 0.7*g);",
    "  c.g += halo * pig.x * (0.18 + 0.5*g);",
    "  c.b += halo * pig.y * (0.18 + 0.5*g);",
    "  gl_FragColor = clamp(c, 0.0, 1.0);",
    "}"
  ].join("\n");

  var SHOW = [
    "precision highp float;",
    "varying vec2 uv;",
    "uniform sampler2D ink; uniform vec2 px; uniform float screen;",
    "uniform vec3 cSumi, cRose, cTeal;",
    "float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }",
    "void main(){",
    "  vec4 c = texture2D(ink, uv);",
    "  vec4 bl = (texture2D(ink, uv+vec2(px.x*3.0,0.0)) + texture2D(ink, uv-vec2(px.x*3.0,0.0))",
    "          + texture2D(ink, uv+vec2(0.0,px.y*3.0)) + texture2D(ink, uv-vec2(0.0,px.y*3.0))) * 0.25;",
    "  float grain = 0.82 + 0.36*h21(floor(gl_FragCoord.xy));",
    "  vec3 dn = clamp(c.rgb * grain, 0.0, 1.0);",
    "  vec3 edge = max(c.rgb - bl.rgb, 0.0) * 2.2;",           /* pigment pools at the rim, like watercolour */
    "  dn = clamp(dn + edge, 0.0, 1.0);",
    "  if (screen < 0.5) {",
    "    vec3 m = vec3(1.0);",
    "    m *= mix(vec3(1.0), cTeal, smoothstep(0.0, 0.85, dn.b));",
    "    m *= mix(vec3(1.0), cRose, smoothstep(0.0, 0.85, dn.g));",
    "    m *= mix(vec3(1.0), cSumi, smoothstep(0.0, 0.75, dn.r));",
    "    gl_FragColor = vec4(m, 1.0);",
    "  } else {",
    "    vec3 glow = cTeal*1.5*dn.b + cRose*1.4*dn.g + vec3(0.62,0.78,0.82)*0.55*dn.r;",
    "    gl_FragColor = vec4(glow, 1.0);",
    "  }",
    "}"
  ].join("\n");

  function shader(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
    return s;
  }
  function program(fs) {
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, "p");
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { throw new Error(gl.getProgramInfoLog(p)); }
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p: p, u: u };
  }

  var sim, show;
  try { sim = program(SIM); show = program(SHOW); }
  catch (e) { canvas.remove(); return; }

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function target(w, h) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex: tex, fb: fb };
  }

  var W, H, SW, SH, A, B;
  function resize() {
    W = Math.max(1, Math.round(window.innerWidth));
    H = Math.max(1, Math.round(window.innerHeight));
    canvas.width = W; canvas.height = H;
    var scale = Math.min(0.5, 900 / Math.max(W, H));
    SW = Math.max(2, Math.round(W * scale)); SH = Math.max(2, Math.round(H * scale));
    if (A) { gl.deleteTexture(A.tex); gl.deleteFramebuffer(A.fb); gl.deleteTexture(B.tex); gl.deleteFramebuffer(B.fb); }
    A = target(SW, SH); B = target(SW, SH);
    wake();
  }

  // pointer state in uv space (y up)
  var cur = { x: 0.5, y: 0.5 }, last = { x: 0.5, y: 0.5 }, moved = false, stamp = 0;
  var lastInput = 0, running = false, start = performance.now();
  var queue = [];   // scripted strokes (home intro)

  function toUV(e) { return { x: e.clientX / W, y: 1 - e.clientY / H }; }
  window.addEventListener("pointermove", function (e) {
    var p = toUV(e);
    if (!moved) { last.x = cur.x; last.y = cur.y; }
    cur = p; moved = true; wake();
  }, { passive: true });
  window.addEventListener("pointerdown", function (e) {
    var p = toUV(e); cur = p; last = { x: p.x, y: p.y + 0.0001 }; stamp = 1; moved = true; wake();
  }, { passive: true });
  window.addEventListener("pointerleave", function () { moved = false; });

  function wake() { lastInput = performance.now(); if (!running && !document.hidden) { running = true; requestAnimationFrame(frame); } }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });

  var hex = function (h) { return [parseInt(h.substr(1, 2), 16) / 255, parseInt(h.substr(3, 2), 16) / 255, parseInt(h.substr(5, 2), 16) / 255]; };
  var C_SUMI = hex("#16181d"), C_ROSE = hex("#d4687e"), C_TEAL = hex("#3b7f93");

  function frame(now) {
    var t = (now - start) / 1000;
    var force = 0, size = 1;

    if (queue.length) {                       // scripted stroke step
      var s = queue.shift();
      last = s.a; cur = s.b; force = s.f; size = s.s;
      lastInput = now;
    } else if (moved) {
      var dx = cur.x - last.x, dy = cur.y - last.y;
      var speed = Math.sqrt(dx * dx + dy * dy);
      force = speed > 0.00005 || stamp ? Math.min(1, 0.55 + speed * 18) : 0;
      if (stamp) { force = 1.6; size = 3.2; }
    }

    // pigment drifts between rose and teal over time
    var r = 0.5 + 0.5 * Math.sin(t * 0.35);
    var pigR = 0.25 + 0.75 * r, pigT = 0.25 + 0.75 * (1 - r);

    gl.viewport(0, 0, SW, SH);
    gl.useProgram(sim.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, B.fb);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(sim.u.prev, 0);
    gl.uniform2f(sim.u.px, 1 / SW, 1 / SH);
    gl.uniform1f(sim.u.aspect, W / H);
    gl.uniform1f(sim.u.t, t);
    gl.uniform1f(sim.u.force, force);
    gl.uniform1f(sim.u.size, size);
    gl.uniform1f(sim.u.decay, 0.9935);
    gl.uniform2f(sim.u.m0, last.x, last.y);
    gl.uniform2f(sim.u.m1, cur.x, cur.y);
    gl.uniform2f(sim.u.pig, pigR, pigT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    var tmp = A; A = B; B = tmp;

    gl.viewport(0, 0, W, H);
    gl.useProgram(show.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(show.u.ink, 0);
    gl.uniform2f(show.u.px, 1 / SW, 1 / SH);
    gl.uniform1f(show.u.screen, document.documentElement.getAttribute("data-surface") === "screen" ? 1 : 0);
    gl.uniform3fv(show.u.cSumi, C_SUMI);
    gl.uniform3fv(show.u.cRose, C_ROSE);
    gl.uniform3fv(show.u.cTeal, C_TEAL);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    last.x = cur.x; last.y = cur.y; moved = false; stamp = 0;

    // keep simulating ~9s after the last input so ink can fade, then sleep
    if (now - lastInput < 9000 && !document.hidden) requestAnimationFrame(frame);
    else running = false;
  }

  // Public hook: draw a scripted gesture (used once on the home page)
  window.inkGesture = function (points, opts) {
    opts = opts || {};
    for (var i = 1; i < points.length; i++) {
      queue.push({ a: points[i - 1], b: points[i], f: opts.force || 0.9, s: opts.size || 1.4 });
    }
    wake();
  };

  window.addEventListener("resize", function () { clearTimeout(resize._t); resize._t = setTimeout(resize, 150); });
  resize();
})();
