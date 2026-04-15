(function () {
  var ANIM_MS = 2400;
  var ANIM_NAME = 'bee-hive-orbit';

  var bee = document.querySelector('.bee-hive-fx');
  if (!bee) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var busy = false;
  var fallbackTimer = null;

  function safeOrbitRadius(cx, cy, rect) {
    var r = Math.max(rect.width, rect.height) * 0.55;
    var pad = 28;
    var maxByW = Math.min(cx, window.innerWidth - cx) - pad;
    var maxByH = Math.min(cy, window.innerHeight - cy) - pad;
    var cap = Math.min(maxByW, maxByH, r);
    return Math.max(36, Math.min(r, cap));
  }

  function cleanup() {
    busy = false;
    bee.classList.remove('is-active');
    bee.style.left = '';
    bee.style.top = '';
    bee.style.removeProperty('--orbit-r');
    if (fallbackTimer !== null) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function go(href) {
    cleanup();
    window.location.href = href;
  }

  var links = document.querySelectorAll('.section-contact a.button');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      var href = this.getAttribute('href');
      if (!href) return;

      if (busy) {
        e.preventDefault();
        return;
      }

      var rect = this.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var r = safeOrbitRadius(cx, cy, rect);

      e.preventDefault();
      busy = true;

      bee.style.left = cx + 'px';
      bee.style.top = cy + 'px';
      bee.style.setProperty('--orbit-r', r + 'px');

      function onEnd(ev) {
        if (ev.animationName !== ANIM_NAME) return;
        bee.removeEventListener('animationend', onEnd);
        go(href);
      }

      bee.addEventListener('animationend', onEnd);
      fallbackTimer = setTimeout(function () {
        bee.removeEventListener('animationend', onEnd);
        go(href);
      }, ANIM_MS + 150);

      requestAnimationFrame(function () {
        bee.classList.add('is-active');
      });
    });
  }
})();
