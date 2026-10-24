/* ==========================================================
   PERFORMANCE LOADER
   - Phones / tablets / touch / data-saver  ->  "lite" mode (set in <head>)
   - Desktops                               ->  video background + 3D models, loaded AFTER the page is ready
   ========================================================== */
(function () {
  var root = document.documentElement;
  var lite = root.classList.contains('lite');

  /* ---------- scroll animations (AOS) ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.AOS) AOS.init({ once: true, disable: function () { return lite; } });
  });

  /* ---------- helpers ---------- */
  function loadVideo(v) {
    if (!v || v.getAttribute('src') || !v.dataset.src) return;
    v.src = v.dataset.src;
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  // play only while visible (saves battery + GPU)
  function playWhenVisible(v, margin) {
    if (!v) return;
    if (!('IntersectionObserver' in window)) { loadVideo(v); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { loadVideo(v); if (v.paused && v.src) { var p = v.play(); p && p.catch(function(){}); } }
        else if (v.src) v.pause();
      });
    }, { rootMargin: margin || '150px' }).observe(v);
  }

  /* ---------- videos ---------- */
  var glob  = document.querySelector('video.about-img');          // small "global" clip in About
  playWhenVisible(glob);                                           // phones + desktop: loads only when scrolled to

  if (!lite) {
    window.addEventListener('load', function () {
      var bg = document.querySelector('.back-vid');
      var bh = document.querySelector('.blackhole-box video');
      loadVideo(bg);
      playWhenVisible(bh, '0px');                                  // black hole only plays at the top of the page
    });

    /* ---------- 3D (Spline) – desktop only, after everything else ---------- */
    var start3D = function () {
      var box = document.querySelector('.hero-vid-box');
      if (!box) return;
      var s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
      document.head.appendChild(s);
      [['hero3d1', 'https://prod.spline.design/pAtKCXsMYYo8HU6x/scene.splinecode'],
       ['hero3d',  'https://prod.spline.design/XJAKoWa9P1-Jv9vC/scene.splinecode']].forEach(function (m) {
        var el = document.createElement('spline-viewer');
        el.className = m[0];
        el.setAttribute('url', m[1]);
        box.appendChild(el);
      });
      var fb = box.querySelector('.hero-fallback');
      if (fb) fb.style.display = 'none';
    };
    window.addEventListener('load', function () {
      (window.requestIdleCallback || function (f) { setTimeout(f, 800); })(start3D, { timeout: 3000 });
    });
  }
})();
