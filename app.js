(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement, body = document.body;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Theme (dark by default) ---------- */
  var tb = document.getElementById('theme');
  function applyTheme(t) { root.setAttribute('data-theme', t); if (tb) tb.textContent = t === 'dark' ? 'light mode' : 'dark mode'; }
  applyTheme(store('theme') || 'dark');
  if (tb) tb.onclick = function () { var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; applyTheme(n); store('theme', n); };

  /* ---------- Boot screen: shows when storage is empty (first visit / cleared cookies) ---------- */
  var boot = document.getElementById('boot');
  if (boot && !store('booted') && !reduce) {
    var lines = [
      'portfolio_os bootloader v2.6 (c) roheeth_labs',
      '----------------------------------------------',
      '[ 0.000] BIOS check ......................... ok',
      '[ 0.012] memory test: 64K of nostalgia ...... ok',
      '[ 0.031] detecting CPU: caffeine-powered x1 .. ok',
      '[ 0.054] mounting /dev/brain ................ ok',
      '[ 0.077] mounting /home/roheeth ............. ok',
      '[ 0.102] loading kernel modules:',
      '           appsec.ko ........................ loaded',
      '           mobile_android_ios.ko ............ loaded',
      '           cloud_azure_gcp.ko ............... loaded',
      '           threat_model_stride.ko ........... loaded',
      '           devsecops_pipeline.ko ............ loaded',
      '           ai_mcp_security.ko ............... loaded',
      '[ 0.188] starting network services .......... ok',
      '[ 0.203] connecting to city grid ............ ok',
      '[ 0.229] loading city-wide profiler ......... ok',
      '[ 0.251] syncing with the OASIS ............. ok',
      '[ 0.274] checking for white rabbits ......... 1 found',
      '[ 0.298] counting secrets ................... too many',
      '[ 0.316] decrypting skills.db ............... ok',
      '[ 0.340] decrypting certs.db (11 badges) .... ok',
      '[ 0.362] loading experience: 5 years ........ ok',
      '[ 0.381] hiding 3 keys across the site ...... done',
      '[ 0.405] starting terminal on tty` .......... ok',
      '[ 0.427] calibrating glitch effects ......... ok',
      '[ 0.449] warming up the matrix rain ......... ok',
      '[ 0.470] running final integrity check ...... passed',
      '----------------------------------------------',
      'all systems nominal.',
      '',
      'Hello, friend.'
    ];
    boot.classList.add('show');
    var bootOut = boot.querySelector('.out'), bi = 0, stopped = false;
    var finish = function () { stopped = true; boot.classList.remove('show'); store('booted', '1'); };
    boot.querySelector('.skip').onclick = finish;
    (function next() {
      if (stopped) return;
      if (bi >= lines.length) return setTimeout(finish, 1400);
      bootOut.textContent += lines[bi++] + '\n';
      setTimeout(next, bi < 3 ? 400 : 175);
    })();
  }

  /* ---------- Console message ---------- */
  console.log('%cHello, friend.', 'color:#2bd47d;font-size:18px;font-weight:bold');
  console.log('%cYou opened DevTools. Respect. Press ` on the page for a terminal. There are three keys hidden on this site.', 'color:#5fd3f3');

  /* ---------- Matrix rain ---------- */
  var cv = document.getElementById('rain');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), cols, drops, fs = 14;
    var chars = 'アイウエオカキクケコ0123456789ABCDEF<>/{}';
    function size() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; cols = Math.floor(cv.width / fs); drops = Array(cols).fill(0).map(function () { return Math.random() * -50; }); }
    size(); addEventListener('resize', size);
    setInterval(function () {
      ctx.fillStyle = 'rgba(7,9,13,0.12)'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#2bd47d'; ctx.font = fs + 'px monospace';
      for (var c = 0; c < cols; c++) {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], c * fs, drops[c] * fs);
        if (drops[c] * fs > cv.height && Math.random() > 0.975) drops[c] = 0;
        drops[c]++;
      }
    }, 55);
  }

  /* ---------- Typing role line ---------- */
  var typed = document.getElementById('typed');
  if (typed) {
    var roles = ['Senior Security Engineer', 'Application Security', 'AI & MCP Security', 'DevSecOps', 'Professional Bug Hunter'];
    if (reduce) typed.textContent = roles[0];
    else { var r = 0, c = 0, del = false;
      (function tick() { var w = roles[r];
        if (!del) { typed.textContent = w.slice(0, ++c); if (c === w.length) { del = true; return setTimeout(tick, 1600); } }
        else { typed.textContent = w.slice(0, --c); if (c === 0) { del = false; r = (r + 1) % roles.length; return setTimeout(tick, 300); } }
        setTimeout(tick, del ? 35 : 80); })(); }
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { reduce ? el.classList.add('in') : io.observe(el); });

  /* ---------- Count-up ---------- */
  var stats = document.querySelector('.stats');
  if (stats) { var done = false;
    new IntersectionObserver(function (es, obs) { if (!es[0].isIntersecting || done) return; done = true; obs.disconnect();
      document.querySelectorAll('[data-count]').forEach(function (el) { var end = +el.dataset.count, suf = el.dataset.suffix || '', t0;
        if (reduce) { el.textContent = end + suf; return; }
        (function step(ts) { t0 = t0 || ts; var p = Math.min((ts - t0) / 1400, 1); el.textContent = Math.floor(p * end) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(step); })(performance.now()); });
    }, { threshold: .5 }).observe(stats); }

  /* ---------- Skill filters ---------- */
  document.querySelectorAll('.tab').forEach(function (b) { b.onclick = function () {
    document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active');
    document.querySelectorAll('[data-cat]').forEach(function (c) { c.classList.toggle('hidden', b.dataset.filter !== 'all' && c.dataset.cat !== b.dataset.filter); }); }; });

  /* ---------- Badge flip ---------- */
  document.querySelectorAll('.badge').forEach(function (b) { b.tabIndex = 0;
    b.onclick = function (e) { if (e.target.closest('.cert-open')) return; b.classList.toggle('flip'); };
    b.onkeydown = function (e) { if (e.key === 'Enter') b.click(); }; });

  /* ---------- Certificate images: certs/<name>.jpg, .jpeg or .png (first one found wins) ---------- */
  document.querySelectorAll('.cert-img').forEach(function (img) {
    var exts = ['.jpg', '.jpeg', '.png'], k = 0, link = img.parentNode.querySelector('.cert-open');
    function tryNext() { if (k >= exts.length) { img.alt = 'Certificate image missing'; return; } img.src = img.dataset.cert + exts[k++]; }
    img.onerror = tryNext;
    img.onload = function () { if (link) link.href = img.src; };
    tryNext();
  });

  /* ---------- ctOS-style profiler on hover ---------- */
  var pf = document.getElementById('profiler');
  if (pf && matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-profile]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var d = el.dataset.profile.split('|');
        pf.innerHTML = '<div class="hd">PROFILER // ' + d[0] + '</div>' +
          '<div class="row"><span class="k">class</span><span>' + d[1] + '</span></div>' +
          '<div class="row"><span class="k">note</span><span>' + d[2] + '</span></div>' +
          '<div class="bar"><i style="width:' + (d[3] || 80) + '%"></i></div>';
        pf.classList.add('show');
      });
      el.addEventListener('mousemove', function (e) { pf.style.left = Math.min(e.clientX + 16, innerWidth - 256) + 'px'; pf.style.top = Math.min(e.clientY + 16, innerHeight - 110) + 'px'; });
      el.addEventListener('mouseleave', function () { pf.classList.remove('show'); });
    });
  }

  /* ---------- Mood of the day (pop-culture flavoured, original lines) ---------- */
  var mood = document.getElementById('mood');
  var moods = [
    ['Control is an illusion. Patch management is not.', 'a Mr. Robot mood'],
    ['Everything is connected. That is exactly why I audit it.', 'a Watch Dogs mood'],
    ['Follow the white rabbit, but check its certificate first.', 'a Matrix mood'],
    ['The only winning move is to threat-model before launch.', 'a WarGames mood'],
    ['Three keys, one egg, zero shortcuts.', 'a Ready Player One mood'],
    ['On the grid, every packet tells a story.', 'a Tron mood'],
    ['Rearrange "too many secrets" and you get a job description.', 'a Sneakers mood']
  ];
  function showMood(i) { if (mood) mood.innerHTML = moods[i][0] + '<span class="src">— ' + moods[i][1] + '</span>'; }
  var mi = Math.floor(Math.random() * moods.length); showMood(mi);
  var mb = document.getElementById('mood-btn'); if (mb) mb.onclick = function () { mi = (mi + 1) % moods.length; showMood(mi); };

  /* ---------- The Hunt: three keys (Ready Player One nod) ---------- */
  var KEYS = ['copper', 'jade', 'crystal'];
  function hasKey(k) { return store('key-' + k) === '1'; }
  function renderKeys() {
    KEYS.forEach(function (k) { var el = document.querySelector('.key.' + k); if (el) { el.classList.toggle('got', hasKey(k)); el.querySelector('b').textContent = hasKey(k) ? 'FOUND' : 'locked'; } });
    var msg = document.getElementById('egg-msg');
    if (msg && KEYS.every(hasKey)) msg.textContent = 'All three keys found. You win the egg: a coffee chat with me. Email roheeth.s.it@gmail.com with the subject "I found the egg".';
  }
  function giveKey(k, why) { if (!hasKey(k)) { store('key-' + k, '1'); toast('🔑 ' + k.toUpperCase() + ' KEY acquired — ' + why); } renderKeys(); }
  renderKeys();

  // Crystal key: the tiny hidden pixel (an Adventure-style easter egg)
  document.querySelectorAll('.egg').forEach(function (e) { e.onclick = function () { giveKey('crystal', 'you found the hidden dot'); }; });

  /* ---------- Toast ---------- */
  function toast(t) { var d = document.createElement('div'); d.textContent = t;
    d.style.cssText = 'position:fixed;left:50%;top:70px;transform:translateX(-50%);background:#05070a;color:#2bd47d;border:1px solid #2bd47d;padding:10px 16px;z-index:60;font-size:.85rem;box-shadow:0 0 20px rgba(43,212,125,.3)';
    body.appendChild(d); setTimeout(function () { d.remove(); }, 3200); }

  /* ---------- Terminal ---------- */
  var term = document.getElementById('term'), out = document.getElementById('term-out'), tin = document.getElementById('term-in');
  function openTerm() { if (term) { term.classList.add('open'); tin.focus(); } }
  function closeTerm() { if (term) term.classList.remove('open'); }
  var cmds = {
    help: 'whoami · skills · work · certs · contact · keys · hello friend · shall we play a game · matrix · ctos · recruiter · clear',
    whoami: 'roheeth :: Senior Security Engineer :: 5 yrs :: breaks things so you don\'t have to.',
    skills: 'AppSec (web/mobile/API) | AI & MCP security | Azure & GCP audits | STRIDE | DevSecOps',
    work: 'Photon Interactive (2021-24) -> Bahwan CyberTek (2024-now). See the nav.',
    certs: 'CAP, CCSP-AWS, API Security Architect, Splunk SOC, Android Bug Bounty, +6 more.',
    contact: 'email: roheeth.s.it@gmail.com\nlinkedin: https://www.linkedin.com/in/roheeth-s-057416166/\ncredly: https://www.credly.com/users/roheeth-s/badges/credly',
    keys: function () { return 'Keys found: ' + KEYS.filter(hasKey).join(', ') + (KEYS.some(hasKey) ? '' : 'none yet') + '. Hints: greet me properly · old cheat codes still work · look for a tiny dot.'; },
    'hello friend': function () { giveKey('copper', 'you greeted the terminal'); return 'Hello, friend. Here is something for you: the COPPER key.'; },
    'shall we play a game': function () { var h = document.getElementById('hunt'); if (h) { closeTerm(); h.scrollIntoView(); return ''; } return 'How about The Hunt? It lives on the home page.'; },
    'shall we play a game?': function () { return cmds['shall we play a game'](); },
    matrix: 'There is no spoon. Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A',
    ctos: 'City profiler online. Hover over cards to profile them.',
    recruiter: function () { location.href = 'resume.html'; return 'Switching to recruiter view...'; },
    sudo: 'Nice try. This incident will be reported (to nobody).',
    fsociety: 'We are... just one person with a terminal. But thanks for asking.'
  };
  if (tin) {
    out.textContent = 'portfolio_os terminal. Type "help".';
    tin.onkeydown = function (e) { if (e.key !== 'Enter') return;
      var line = tin.value; tin.value = ''; out.textContent += '\n$ ' + line;
      var k = line.trim().toLowerCase().replace(/[,]/g, '');
      if (k === 'clear') { out.textContent = ''; return; }
      var c = cmds[k] || (k.indexOf('sudo') === 0 ? cmds.sudo : null);
      var res = typeof c === 'function' ? c() : c;
      if (res === undefined || res === null) res = 'command not found: ' + k + '. Try "help".';
      if (res) out.textContent += '\n' + res;
      out.scrollTop = out.scrollHeight; };
  }
  document.addEventListener('keydown', function (e) { if (e.key === '`' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); term && term.classList.contains('open') ? closeTerm() : openTerm(); } });
  var tc = document.getElementById('term-close'); if (tc) tc.onclick = closeTerm;
  var to = document.getElementById('term-open'); if (to) to.onclick = openTerm;

  /* ---------- Konami -> matrix mode + jade key ---------- */
  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'], pos = 0;
  document.addEventListener('keydown', function (e) { var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === seq[pos]) { if (++pos === seq.length) { pos = 0; body.classList.toggle('matrix'); giveKey('jade', 'old cheat codes never die'); } }
    else pos = k === seq[0] ? 1 : 0; });

  /* ---------- Progress bar + glitch page transition ---------- */
  var bar = document.getElementById('progress');
  addEventListener('scroll', function () { bar.style.width = (root.scrollTop / ((root.scrollHeight - root.clientHeight) || 1) * 100) + '%'; }, { passive: true });
  var xf = document.getElementById('xfade');
  document.querySelectorAll('a[href$=".html"]').forEach(function (a) { a.addEventListener('click', function (e) {
    if (reduce || !xf || e.metaKey || e.ctrlKey) return; e.preventDefault(); xf.classList.add('go'); setTimeout(function () { location.href = a.href; }, 330); }); });
  addEventListener('pageshow', function () { if (xf) xf.classList.remove('go'); });
})();
