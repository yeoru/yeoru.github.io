/* =========================================================
   Site interactions: cursor, portfolio tabs, hover preview,
   painting lightbox, protected e-mail links, home ink intro.
   ========================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- custom cursor ---------- */
  if (fine) {
    root.classList.add("has-cursor");
    var dot = document.createElement("div"); dot.className = "cursor";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    var label = document.createElement("span"); ring.appendChild(label);
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
    }, { passive: true });
    window.addEventListener("pointerdown", function () { ring.classList.add("is-down"); });
    window.addEventListener("pointerup", function () { ring.classList.remove("is-down"); });
    document.addEventListener("pointerover", function (e) {
      var el = e.target.closest("a, button, [data-cursor]");
      ring.classList.toggle("is-link", !!el);
      var text = el && el.getAttribute("data-cursor");
      ring.classList.toggle("is-label", !!text);
      label.textContent = text || "";
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- portfolio tabs (media = screen, painting = paper) ---------- */
  var tabs = document.querySelectorAll("[role='tab']");
  if (tabs.length) {
    var select = function (id, push) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("aria-controls") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      var panel = document.getElementById(id);
      root.setAttribute("data-surface", panel.getAttribute("data-surface"));
      if (push) history.replaceState(null, "", "#" + id);
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.getAttribute("aria-controls"), true); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        n.focus(); n.click();
      });
    });
    var initial = location.hash.replace("#", "");
    select(document.getElementById(initial) ? initial : tabs[0].getAttribute("aria-controls"), false);
    window.addEventListener("hashchange", function () {
      var h = location.hash.replace("#", "");
      if (document.getElementById(h)) select(h, false);
    });
  }

  /* ---------- floating preview on the media list ---------- */
  var preview = document.querySelector(".preview");
  if (preview && fine) {
    var pimg = preview.querySelector("img");
    var px = 0, py = 0, tx = 0, ty = 0, active = false;
    document.querySelectorAll(".work-row a").forEach(function (a) {
      a.addEventListener("pointerenter", function () {
        pimg.src = a.getAttribute("data-preview"); pimg.alt = "";
        preview.classList.add("on"); active = true;
      });
      a.addEventListener("pointerleave", function () { preview.classList.remove("on"); active = false; });
    });
    window.addEventListener("pointermove", function (e) { tx = e.clientX + 28; ty = e.clientY - preview.offsetHeight / 2; }, { passive: true });
    (function follow() {
      px += (tx - px) * (reduce ? 1 : 0.14); py += (ty - py) * (reduce ? 1 : 0.14);
      var maxX = window.innerWidth - preview.offsetWidth - 16;
      preview.style.transform = "translate3d(" + Math.min(px, maxX) + "px," + py + "px,0)";
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- painting lightbox (each painting can have several views) ---------- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".paint-item button, .thumb-item button"));
    var seq = [], firstOf = [];   // every view of every painting, in order
    buttons.forEach(function (b, i) {
      var views = (b.getAttribute("data-views") || "").split("|");
      var labels = (b.getAttribute("data-labels") || "").split("|");
      firstOf[i] = seq.length;
      views.forEach(function (src, k) {
        seq.push({ src: src, label: labels[k] || "", title: b.getAttribute("data-title"),
                   meta: b.getAttribute("data-meta") || "", alt: b.querySelector("img").alt,
                   count: views.length, n: k + 1 });
      });
    });
    var lbImg = lb.querySelector(".lb-stage img");
    var lbTitle = lb.querySelector(".lb-title");
    var lbMeta = lb.querySelector(".lb-meta");
    var lbLabel = lb.querySelector(".lb-label");
    var idx = 0;
    var show = function (i) {
      idx = (i + seq.length) % seq.length;
      var v = seq[idx];
      lbImg.src = v.src;
      lbImg.alt = v.alt + (v.label ? ", " + v.label.toLowerCase() : "");
      lbTitle.textContent = v.title;
      lbMeta.textContent = v.meta;
      lbLabel.textContent = v.count > 1 ? v.label + " (" + v.n + "/" + v.count + ")" : v.label;
    };
    buttons.forEach(function (b, i) {
      b.addEventListener("click", function () { show(firstOf[i]); lb.showModal(); });
    });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---------- e-mail links assembled at runtime (keeps addresses away from simple scrapers) ---------- */
  document.querySelectorAll("[data-mail-user]").forEach(function (el) {
    var addr = el.getAttribute("data-mail-user") + "@" + el.getAttribute("data-mail-domain");
    el.href = "mailto:" + addr;
    if (!el.textContent.trim() || el.hasAttribute("data-mail-fill")) el.textContent = addr;
  });

  /* ---------- home: one ink gesture behind the title on first load ---------- */
  if (document.body.hasAttribute("data-ink-intro") && window.inkGesture && !reduce && window.innerWidth > 860) {
    var title = document.querySelector(".hero-title");
    var r = title.getBoundingClientRect();
    var W = window.innerWidth, H = window.innerHeight;
    var pts = [], n = 70;
    var x0 = (r.left + r.width * 0.08) / W, x1 = (r.left + r.width * 0.92) / W;
    var yc = 1 - (r.top + r.height * 0.62) / H;
    for (var i = 0; i <= n; i++) {
      var k = i / n;
      pts.push({ x: x0 + (x1 - x0) * k, y: yc + Math.sin(k * Math.PI * 2.2) * 0.035 - k * 0.03 });
    }
    setTimeout(function () { window.inkGesture(pts, { force: 0.85, size: 1.8 }); }, 450);
  }
})();
