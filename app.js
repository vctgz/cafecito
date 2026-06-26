/*
 * Cafecito. App logic. Plain ES2015, no framework, no build step.
 * Renders the hero rotator + line-up from RISERS (risers.js) and turns any
 * riser's morning ritual into Google Calendar events (deep links) or a
 * downloadable .ics. State lives in one object; render functions are pure-ish
 * reads of it. Nothing here touches the network.
 */
(function () {
  'use strict';

  /* ───────── tiny DOM helper ───────── */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  // Build an element. Data only ever reaches the DOM via textContent / value /
  // attributes, never innerHTML, so riser strings can't inject markup.
  function el(tag, props) {
    var n = document.createElement(tag), i, k, v;
    if (props) for (k in props) {
      v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.style.cssText = v;
      else if (k.lastIndexOf('on', 0) === 0 && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, '');
      else n.setAttribute(k, v);
    }
    for (i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      n.appendChild(c.nodeType ? c : document.createTextNode(c));
    }
    return n;
  }

  var photoOf = function (r) { return 'assets/risers/' + r.key + '.jpg'; };
  var duoOf = function (r) { return 'url(#duo-' + r.duo + ')'; };

  /* ───────── wake-time "clubs" (the filter) ───────── */
  var CLUBS = [
    { id: 'all',   label: 'All' },
    { id: 'owls',  label: 'Night owls', test: function (h) { return h < 4; } },
    { id: 'four',  label: '4 AM',       test: function (h) { return h === 4; } },
    { id: 'five',  label: '5 AM',       test: function (h) { return h === 5; } },
    { id: 'six',   label: '6 o’clock', test: function (h) { return h === 6; } },
    { id: 'civil', label: '7 AM +',     test: function (h) { return h >= 7; } }
  ];

  /* ───────── state ───────── */
  var S = { heroIdx: 0, visible: 6, club: 'all', q: '', plannerIdx: null, wake: null, paused: false, hover: false };
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────── derived ───────── */
  function earliestWake() {
    var best = null;
    RISERS.forEach(function (r) { var v = r.wake.h * 60 + r.wake.m; if (best === null || v < best) best = v; });
    var h = Math.floor(best / 60), m = best % 60, hh = h % 12 || 12;
    return hh + ':' + String(m).padStart(2, '0');
  }
  function matches(r) {
    var club = CLUBS.filter(function (c) { return c.id === S.club; })[0];
    if (club && club.test && !club.test(r.wake.h)) return false;
    if (S.q) {
      var hay = (r.name + ' ' + r.role + ' ' + r.ritual + ' ' + r.time).toLowerCase();
      return S.q.toLowerCase().split(/\s+/).every(function (t) { return hay.indexOf(t) >= 0; });
    }
    return true;
  }
  function filtered() {
    var out = [];
    RISERS.forEach(function (r, i) { if (matches(r)) out.push({ r: r, i: i }); });
    return out;
  }

  /* ───────── calendar export (Google Calendar deep links + .ics) ───────── */
  function dateBase(w) { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, w.h, w.m, 0, 0); }
  function fmtClock(d) { var h = d.getHours(), m = d.getMinutes(), ap = h < 12 ? 'AM' : 'PM', hh = h % 12 || 12; return hh + ':' + String(m).padStart(2, '0') + ' ' + ap; }
  function fmtZ(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function durOf(sch, i) { var nx = sch[i + 1]; return nx ? Math.min(Math.max(nx.t - sch[i].t, 10), 45) : 20; }

  function gcalUrl(r, s, start, dur) {
    var e = encodeURIComponent, end = new Date(start.getTime() + dur * 60000);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + e('☕ ' + s.label) +
      '&dates=' + fmtZ(start) + '/' + fmtZ(end) +
      '&details=' + e(s.detail + '\n\nvia Cafécito · ' + r.name + '’s morning ritual');
  }
  function buildSteps(r, wake) {
    var base = dateBase(wake), sch = r.schedule;
    return sch.map(function (s, i) {
      var date = new Date(base.getTime() + s.t * 60000), dur = durOf(sch, i);
      return { time: fmtClock(date), label: s.label, detail: s.detail,
        open: function () { window.open(gcalUrl(r, s, date, dur), '_blank', 'noopener'); } };
    });
  }
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
  function downloadIcs(r, wake) {
    var base = dateBase(wake), sch = r.schedule, stamp = fmtZ(new Date());
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cafecito//Morning//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    sch.forEach(function (s, i) {
      var st = new Date(base.getTime() + s.t * 60000), en = new Date(st.getTime() + durOf(sch, i) * 60000);
      L.push('BEGIN:VEVENT', 'UID:cafecito-' + r.key + '-' + i + '-' + stamp + '@cafecito', 'DTSTAMP:' + stamp,
        'DTSTART:' + fmtZ(st), 'DTEND:' + fmtZ(en),
        'SUMMARY:' + icsEsc('☕ ' + s.label + ' · ' + r.name),
        'DESCRIPTION:' + icsEsc(s.detail + ' · via Cafécito'));
      if (i === 0) L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Rise and shine', 'TRIGGER:PT0M', 'END:VALARM');
      L.push('END:VEVENT');
    });
    L.push('END:VCALENDAR');
    var blob = new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = el('a', { href: url, download: 'cafecito-' + r.key + '.ics' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /* ───────── render: hero ───────── */
  var mount = {};
  function renderHero() {
    var n = RISERS.length, idx = ((S.heroIdx % n) + n) % n, r = RISERS[idx];
    var img = mount.heroImg;
    if (img.getAttribute('src') !== photoOf(r)) { img.src = photoOf(r); }
    img.alt = 'Portrait of ' + r.name;
    img.style.filter = duoOf(r);
    mount.frame.style.background = r.tint;
    // a space keeps Bagel Fat One's bubbly "5" from reading as "S" beside "AM"
    mount.badgeTime.textContent = r.badge.replace(/(\d)(AM|PM)$/, '$1 $2');
    mount.chitTime.textContent = r.time;
    mount.chitName.textContent = r.name;
    mount.chitRitual.textContent = r.ritual;
    mount.counter.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0') +
      '  ·  featuring ' + r.name;
  }

  /* ───────── render: line-up ───────── */
  function card(item) {
    var r = item.r;
    var media = el('button', { 'class': 'card__media', type: 'button',
      'aria-label': 'Feature ' + r.name + ' in the hero',
      onclick: function () { S.heroIdx = item.i; S.paused = true; renderHero(); scrollToHero(); } },
      el('img', { 'class': 'card__img', src: photoOf(r), alt: 'Portrait of ' + r.name,
        loading: 'lazy', decoding: 'async', width: 540, height: 540, style: 'filter:' + duoOf(r) }),
      el('span', { 'class': 'halftone', 'aria-hidden': 'true' }),
      el('span', { 'class': 'card__time', text: r.time }),
      el('span', { 'class': 'card__coin', text: r.price })
    );
    media.style.background = r.tint;
    var art = el('article', { 'class': 'card' },
      media,
      el('div', { 'class': 'card__body' },
        el('h3', { 'class': 'card__name', text: r.name }),
        el('div', { 'class': 'card__role', text: r.role }),
        el('p', { 'class': 'card__ritual', text: r.ritual }),
        el('button', { 'class': 'btn btn--small card__cta', type: 'button',
          onclick: function () { openPlanner(item.i); } }, 'Plan this morning →')
      )
    );
    // each card keeps its accent-colored hard shadow (the funk signature)
    art.style.boxShadow = '7px 7px 0 ' + r.shadow;
    return art;
  }

  function renderLineup() {
    var list = filtered();
    var paged = S.q || S.club !== 'all' ? list : list.slice(0, S.visible);
    var grid = mount.grid;
    grid.textContent = '';
    if (!paged.length) {
      grid.appendChild(el('div', { 'class': 'empty-state' },
        el('b', null, 'No risers match'),
        'Try another hour, or ',
        el('button', { type: 'button', onclick: clearFilters }, 'clear the filters'),
        '.'));
    } else {
      paged.forEach(function (it) { grid.appendChild(card(it)); });
    }
    var hasMore = !S.q && S.club === 'all' && S.visible < list.length;
    mount.loadmore.hidden = !hasMore;
    if (hasMore) mount.loadmoreBtn.textContent = 'Load more risers  (+' + Math.min(6, list.length - S.visible) + ')';
    mount.resultCount.textContent = list.length === RISERS.length
      ? RISERS.length + ' risers' : list.length + ' of ' + RISERS.length;
  }

  function clearFilters() {
    S.q = ''; S.club = 'all'; S.visible = 6;
    mount.search.value = '';
    syncChips();
    renderLineup();
  }
  function syncChips() {
    Array.prototype.forEach.call(mount.chips.children, function (b) {
      b.setAttribute('aria-pressed', b.dataset.club === S.club ? 'true' : 'false');
    });
  }

  /* ───────── planner modal ───────── */
  var lastFocus = null;
  function openPlanner(idx) {
    S.plannerIdx = idx; S.wake = { h: RISERS[idx].wake.h, m: RISERS[idx].wake.m }; S.paused = true;
    lastFocus = document.activeElement;
    renderPlanner();
    mount.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (mount.page) mount.page.inert = true; // take the background out of the a11y tree entirely
    mount.modalClose.focus();
    document.addEventListener('keydown', onModalKey, true);
  }
  function closePlanner() {
    S.plannerIdx = null;
    mount.modal.hidden = true;
    document.body.style.overflow = '';
    if (mount.page) mount.page.inert = false;
    document.removeEventListener('keydown', onModalKey, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onModalKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closePlanner(); return; }
    if (e.key !== 'Tab') return;
    var f = mount.modal.querySelectorAll('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function timelineEl(r) {
    var steps = buildSteps(r, S.wake);
    var tl = el('div', { 'class': 'timeline' });
    steps.forEach(function (s) {
      tl.appendChild(el('div', { 'class': 'tl-step' },
        el('span', { 'class': 'tl-dot', 'aria-hidden': 'true' }),
        el('div', { 'class': 'tl-row' },
          el('div', null,
            el('div', { 'class': 'tl-time' }, s.time + ' ', el('span', { 'class': 'tl-label', text: s.label })),
            el('div', { 'class': 'tl-detail', text: s.detail })
          ),
          el('button', { 'class': 'tl-add', type: 'button',
            'aria-label': 'Add “' + s.label + '” to Google Calendar', onclick: s.open }, '+ add')
        )
      ));
    });
    return tl;
  }

  function renderPlanner() {
    var r = RISERS[S.plannerIdx], wake = S.wake;
    var wakeVal = String(wake.h).padStart(2, '0') + ':' + String(wake.m).padStart(2, '0');

    var photo = el('div', { 'class': 'planner__photo' },
      el('img', { src: photoOf(r), alt: 'Portrait of ' + r.name, style: 'filter:' + duoOf(r) }),
      el('span', { 'class': 'halftone', 'aria-hidden': 'true' }));
    photo.style.background = r.tint;

    var schedRoot = el('div', { id: 'planner-timeline' }, timelineEl(r));

    var wakeInput = el('input', { type: 'time', value: wakeVal, id: 'wake-input',
      onchange: function (e) {
        var v = e.target.value; if (!v) return;
        var p = v.split(':'); S.wake = { h: +p[0], m: +p[1] };
        schedRoot.replaceChild(timelineEl(r), schedRoot.firstChild);
      } });

    var body = el('div', { 'class': 'planner' },
      el('div', { 'class': 'planner__riser' },
        photo,
        el('h2', { 'class': 'planner__name', text: r.name }),
        el('div', { 'class': 'planner__role', text: r.role + ' · est. ' + r.est }),
        el('p', { 'class': 'planner__ritual', text: r.ritual }),
        el('div', { 'class': 'planner__wakefact' }, 'documented wake · ', el('b', { text: r.time }))
      ),
      el('div', { 'class': 'planner__sched' },
        el('h2', { 'class': 'planner__title', text: 'Your morning, on the calendar' }),
        el('p', { 'class': 'planner__intro', text: 'Set your wake time. Every event slides to match their rhythm. Add one, or import the whole morning.' }),
        el('div', { 'class': 'wake' },
          el('label', { 'class': 'wake__label', 'for': 'wake-input' }, 'I wake at'),
          wakeInput,
          el('button', { 'class': 'wake__reset', type: 'button',
            onclick: function () { S.wake = { h: r.wake.h, m: r.wake.m }; renderPlanner();
              var w = mount.plannerMount.querySelector('#wake-input'); if (w) w.focus(); } }, 'use their hour')
        ),
        schedRoot,
        el('div', { 'class': 'modal__actions' },
          el('button', { 'class': 'btn btn--teal', type: 'button',
            onclick: function () { downloadIcs(r, S.wake); } },
            'Add all ' + r.schedule.length + ' events to Google Calendar'),
          el('p', { 'class': 'help' }, '✓ “+ add” opens Google Calendar with the event prefilled. “Add all” downloads a calendar file. In Google Calendar, choose Settings → Import to drop the whole morning in.')
        )
      )
    );
    mount.plannerMount.textContent = '';
    mount.plannerMount.appendChild(body);
  }

  /* ───────── rotator ───────── */
  function scrollToHero() {
    var top = mount.hero.getBoundingClientRect().top + window.pageYOffset - 12;
    window.scrollTo({ top: top, behavior: REDUCED ? 'auto' : 'smooth' });
  }
  function tick() {
    if (S.paused || S.hover || S.plannerIdx !== null || document.hidden) return;
    S.heroIdx = (S.heroIdx + 1) % RISERS.length;
    renderHero();
  }

  /* ───────── wire up ───────── */
  function init() {
    mount = {
      page: $('#page'),
      hero: $('#hero'), heroImg: $('#hero-img'), frame: $('#hero-frame'),
      badgeTime: $('#hero-badge-time'), chitTime: $('#chit-time'), chitName: $('#chit-name'),
      chitRitual: $('#chit-ritual'), counter: $('#rotator-counter'),
      statCount: $('#stat-count'), statEarliest: $('#stat-earliest'),
      search: $('#riser-search'), chips: $('#club-chips'), grid: $('#grid'),
      loadmore: $('#loadmore'), loadmoreBtn: $('#loadmore-btn'), resultCount: $('#result-count'),
      modal: $('#modal'), modalClose: $('#modal-close'), plannerMount: $('#planner-mount')
    };

    // stats
    mount.statCount.textContent = RISERS.length;
    mount.statEarliest.textContent = earliestWake();
    document.querySelectorAll('[data-riser-count]').forEach(function (n) { n.textContent = RISERS.length; });

    // club chips
    CLUBS.forEach(function (c) {
      mount.chips.appendChild(el('button', { 'class': 'chip', type: 'button', 'data-club': c.id,
        'aria-pressed': c.id === 'all' ? 'true' : 'false',
        onclick: function () { S.club = c.id; S.visible = 6; syncChips(); renderLineup(); } }, c.label));
    });

    // search (debounced so the card re-render/animation doesn't fire on every keystroke)
    var sq;
    mount.search.addEventListener('input', function (e) {
      var v = e.target.value.trim();
      clearTimeout(sq);
      sq = setTimeout(function () { S.q = v; S.visible = 6; renderLineup(); }, 140);
    });

    // load more
    mount.loadmoreBtn.addEventListener('click', function () { S.visible += 6; renderLineup(); });

    // rotator controls
    $('#rotator-prev').addEventListener('click', function () { S.heroIdx = (S.heroIdx - 1 + RISERS.length) % RISERS.length; S.paused = true; renderHero(); });
    $('#rotator-next').addEventListener('click', function () { S.heroIdx = (S.heroIdx + 1) % RISERS.length; S.paused = true; renderHero(); });
    mount.hero.addEventListener('mouseenter', function () { S.hover = true; });
    mount.hero.addEventListener('mouseleave', function () { S.hover = false; });
    mount.hero.addEventListener('focusin', function () { S.hover = true; });
    mount.hero.addEventListener('focusout', function () { S.hover = false; });

    // "plan current hero" triggers (nav, hero CTA, footer)
    document.querySelectorAll('[data-plan-hero]').forEach(function (b) {
      b.addEventListener('click', function () { openPlanner(((S.heroIdx % RISERS.length) + RISERS.length) % RISERS.length); });
    });

    // modal close (button + backdrop)
    mount.modalClose.addEventListener('click', closePlanner);
    mount.modal.addEventListener('mousedown', function (e) { if (e.target === mount.modal) closePlanner(); });

    renderHero();
    renderLineup();
    if (!REDUCED) setInterval(tick, 6000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
