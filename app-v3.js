/* ===== Shine Dental v3 "Noir & Brass" — interactions + Tweaks ===== */
(function () {
  // --- inline brand logo from SVG (recolor cls-1=cream / cls-2=gold via CSS) ---
  fetch('assets/shine-logo.svg').then(function (r) { return r.text(); }).then(function (txt) {
    var svg = txt.replace(/<\?xml[^>]*\?>/i, '');
    document.querySelectorAll('.logo-mark').forEach(function (el) { el.innerHTML = svg; });
  }).catch(function () {
    document.querySelectorAll('.logo-mark').forEach(function (el) {
      el.innerHTML = '<span style="font-family:var(--font-display);font-size:24px;color:var(--cream)">Shine<span style="color:var(--gold)"> Dental</span></span>';
      el.style.height = 'auto';
    });
  });

  // --- sticky nav ---
  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', (window.pageYOffset || 0) > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- reveal on scroll (gated by .anim) ---
  document.documentElement.classList.add('anim');
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  reveals.forEach(function (el) {
    var sibs = [].slice.call(el.parentNode.children).filter(function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    if (sibs.length > 1) {
      var idx = sibs.indexOf(el);
      el.style.transitionDelay = Math.min(idx * 0.09, 0.6) + 's';
    }
  });
  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var r = reveals[i].getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) { reveals[i].classList.add('in'); reveals.splice(i, 1); }
    }
  }
  var ticking = false;
  function onScrollReveal() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { checkReveals(); ticking = false; });
  }
  window.addEventListener('scroll', onScrollReveal, { passive: true });
  window.addEventListener('resize', onScrollReveal, { passive: true });
  window.addEventListener('load', checkReveals);
  checkReveals();

  // --- highlight today's hours ---
  var today = new Date().getDay();
  var row = document.querySelector('.hours-row[data-day="' + today + '"]');
  if (row && !row.classList.contains('closed')) row.classList.add('today');

  // ============ TWEAKS ============
  var TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "hero": "split",
    "accent": "gold",
    "grain": "on"
  }/*EDITMODE-END*/;

  var state = Object.assign({}, TWEAK_DEFAULTS);
  try { state = Object.assign(state, JSON.parse(localStorage.getItem('shine_v3_tweaks') || '{}')); } catch (e) {}

  function apply() {
    document.body.setAttribute('data-hero', state.hero);
    document.body.setAttribute('data-accent', state.accent);
    document.body.setAttribute('data-grain', state.grain);
  }
  apply();

  function setTweak(key, val) {
    state[key] = val; apply();
    try { localStorage.setItem('shine_v3_tweaks', JSON.stringify(state)); } catch (e) {}
    var edits = {}; edits[key] = val;
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: edits }, '*'); } catch (e) {}
    syncUI();
  }

  var panel = document.createElement('div');
  panel.id = 'tweaks-panel';
  panel.style.cssText = 'position:fixed;right:20px;bottom:20px;width:290px;z-index:9999;display:none;font-family:"Hanken Grotesk",system-ui,sans-serif;background:#15110C;border:1px solid rgba(201,168,106,.3);border-radius:6px;box-shadow:0 18px 50px rgba(0,0,0,.6);overflow:hidden;';
  panel.innerHTML = ''
    + '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(201,168,106,.18);cursor:grab;" data-drag>'
    +   '<span style="font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#C9A86A;">Tweaks</span>'
    +   '<button data-close style="background:none;border:none;color:#857C6C;font-size:20px;line-height:1;cursor:pointer;padding:0 2px;">×</button>'
    + '</div>'
    + '<div style="padding:18px 16px;display:flex;flex-direction:column;gap:20px;">'
    +   group('Hero', seg('hero', [['split', 'Editorial'], ['full', 'Full Image']]))
    +   group('Accent', swatch('accent', [['gold', '#C9A86A'], ['rose', '#C99A8A'], ['jade', '#8FB39C']]))
    +   group('Film grain', seg('grain', [['on', 'On'], ['off', 'Off']]))
    + '</div>';
  document.body.appendChild(panel);

  function group(label, inner) {
    return '<div><div style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#857C6C;margin-bottom:11px;">' + label + '</div>' + inner + '</div>';
  }
  function seg(key, opts) {
    var btns = opts.map(function (o) {
      return '<button data-key="' + key + '" data-val="' + o[0] + '" style="flex:1;border:none;background:none;padding:9px 6px;font-family:inherit;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#B7AD9A;cursor:pointer;border-radius:3px;transition:.2s;">' + o[1] + '</button>';
    }).join('');
    return '<div data-seg="' + key + '" style="display:flex;gap:3px;background:#100D09;border:1px solid rgba(201,168,106,.18);border-radius:5px;padding:3px;">' + btns + '</div>';
  }
  function swatch(key, opts) {
    var btns = opts.map(function (o) {
      return '<button data-key="' + key + '" data-val="' + o[0] + '" title="' + o[0] + '" style="width:42px;height:42px;border-radius:50%;border:2px solid transparent;background:' + o[1] + ';cursor:pointer;transition:.2s;"></button>';
    }).join('');
    return '<div data-sw="' + key + '" style="display:flex;gap:14px;">' + btns + '</div>';
  }

  panel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-val]');
    if (b) { setTweak(b.getAttribute('data-key'), b.getAttribute('data-val')); return; }
    if (e.target.closest('[data-close]')) dismiss();
  });

  function syncUI() {
    panel.querySelectorAll('[data-seg]').forEach(function (s) {
      var key = s.getAttribute('data-seg');
      s.querySelectorAll('[data-val]').forEach(function (b) {
        var on = b.getAttribute('data-val') === state[key];
        b.style.background = on ? '#C9A86A' : 'none';
        b.style.color = on ? '#100D09' : '#B7AD9A';
      });
    });
    panel.querySelectorAll('[data-sw]').forEach(function (s) {
      var key = s.getAttribute('data-sw');
      s.querySelectorAll('[data-val]').forEach(function (b) {
        var on = b.getAttribute('data-val') === state[key];
        b.style.borderColor = on ? '#ECE5D7' : 'transparent';
        b.style.transform = on ? 'scale(1.06)' : 'none';
      });
    });
  }
  syncUI();

  // drag
  (function () {
    var handle = panel.querySelector('[data-drag]');
    var dx, dy, dragging = false;
    handle.addEventListener('mousedown', function (e) {
      if (e.target.closest('[data-close]')) return;
      dragging = true; var r = panel.getBoundingClientRect();
      dx = e.clientX - r.left; dy = e.clientY - r.top;
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
      panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px';
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      panel.style.left = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, e.clientX - dx)) + 'px';
      panel.style.top = Math.max(8, Math.min(window.innerHeight - panel.offsetHeight - 8, e.clientY - dy)) + 'px';
    });
    window.addEventListener('mouseup', function () { dragging = false; });
  })();

  function open() { panel.style.display = 'block'; syncUI(); }
  function dismiss() {
    panel.style.display = 'none';
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  }
  window.addEventListener('message', function (e) {
    var t = e && e.data && e.data.type;
    if (t === '__activate_edit_mode') open();
    else if (t === '__deactivate_edit_mode') panel.style.display = 'none';
  });
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*');
  } catch (e) {}
})();
