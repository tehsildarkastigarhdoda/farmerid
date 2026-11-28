/* TehsilOS 12.9.1 — stability.
 * 1. The page keeps its place: a refresh of the same screen keeps the scroll; Back returns to where you were.
 * 2. Fresh by itself: when the app comes back to the screen (or every few minutes while open) the screen reloads quietly
 *    in the background – the old figures stay in view until the new ones are ready. Never while you are typing.
 * 3. No false log-outs: "session expired" is checked twice before the login screen is shown; a slow or lost
 *    connection never logs anyone out. Every real expiry is recorded so its cause can be found.
 */
"use strict";
(function () {
const scroller = () => document.scrollingElement || document.documentElement;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const FORM = /^(login|pin|c25p|c25r|c25d|m28e|m28r|svmk12|check8|chk15|chk95|sort|sort73|match|match81|match95|spot|paper|portal|pp19|upreg90|plan81|deploy|dep76|scn73|ntc15|staff94|users|mast12|feat12|assar19|set8|settings)$/;

/* ---------- 1. keep the place ---------- */
const Y = new WeakMap(); let last = null, typed = false, rAt = Date.now(), quietOn = false;
document.addEventListener('input', e => { const v = $('#view'); if (v && v.contains(e.target)) typed = true; }, true);
const _r30 = render;
render = async function () {
  const c = current(), se = scroller(), v = $('#view');
  const same = !!c && last === c;
  if (last && last !== c) Y.set(last, se.scrollTop);
  const want = same ? se.scrollTop : (c && Y.get(c)) || 0;
  if (same && v && !quietOn) v.style.minHeight = v.offsetHeight + 'px';
  if (!quietOn) typed = false;
  last = c;
  try { return await _r30.apply(this, arguments); }
  finally {
    rAt = Date.now();
    if (current() === c && c) requestAnimationFrame(() => { try { if (want && !SHEET) se.scrollTop = Math.min(want, se.scrollHeight); if (v) v.style.minHeight = ''; } catch (e) {} });
    else if (v) v.style.minHeight = '';
  }
};

/* ---------- 2. fresh by itself ---------- */
let hiddenAt = 0, lastQuiet = Date.now();
function chip(t) {
  let c = $('#up30'); if (!c) { c = document.createElement('div'); c.id = 'up30'; c.setAttribute('role', 'status'); c.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 8px);z-index:60;background:#0F1A14;color:#fff;font:600 12px Inter,system-ui,sans-serif;padding:6px 12px;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.18);transition:opacity .3s;pointer-events:none'; document.body.appendChild(c); }
  c.textContent = t; c.style.opacity = '1'; clearTimeout(chip._t); if (!/…$/.test(t)) chip._t = setTimeout(() => { c.style.opacity = '0'; }, 1800);
}
async function quiet(why) {
  const c = current(); if (!c || !S.session || SHEET || quietOn || document.visibilityState !== 'visible' || !navigator.onLine) return;
  if (typed || FORM.test(c.name)) return;
  const ae = document.activeElement; if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;
  quietOn = true; lastQuiet = Date.now();
  // forget the short-lived copies so the screen fetches anew
  ['homeAt', 'dashAt', 'svm12At', 'dir14At', 'checklistAt', 't10At', 'd15At', 'up15At', 'c76At', 'sig16At'].forEach(k => { try { S[k] = 0; } catch (e) {} });
  try { if (typeof refreshStats === 'function') refreshStats._at = 0; } catch (e) {}
  const v = $('#view'), se = scroller(), y = se.scrollTop; let ghost = null;
  try {
    if (v && c.name !== 'tos12') { ghost = v.cloneNode(true); ghost.removeAttribute('id'); ghost.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); ghost.setAttribute('aria-hidden', 'true'); ghost.style.pointerEvents = 'none';
      v.parentNode.insertBefore(ghost, v.nextSibling); v.style.position = 'absolute'; v.style.left = '0'; v.style.right = '0'; v.style.visibility = 'hidden'; }
    if (why !== 'timer') chip('Updating…');
    await Promise.race([render(), sleep(60000)]);
    if (why !== 'timer') chip('Updated ' + new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(11, 16));
  } catch (e) {}
  finally {
    if (ghost) ghost.remove(); if (v) { v.style.position = ''; v.style.left = ''; v.style.right = ''; v.style.visibility = ''; }
    if (current() === c) requestAnimationFrame(() => { se.scrollTop = Math.min(y, se.scrollHeight); });
    quietOn = false;
  }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 30000) setTimeout(() => quiet('back'), 400); });
window.addEventListener('online', () => setTimeout(() => quiet('online'), 1500));
window.addEventListener('pageshow', e => { if (e.persisted) setTimeout(() => quiet('back'), 400); });
setInterval(() => { const every = ['ADMIN', 'DA', 'NT'].indexOf(typeof role === 'function' ? role() : '') >= 0 ? 180000 : 300000;
  if (Date.now() - Math.max(lastQuiet, rAt) > every && Date.now() - (window.__act30 || 0) > 20000) quiet('timer'); }, 30000);
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { window.__act30 = Date.now(); }, { passive: true, capture: true }));
window.Q30 = { quiet };

/* ---------- 3. no false log-outs ---------- */
const _exp = expireSession; let checking = false;
expireSession = async function () {
  if (checking || !S.session) return; checking = true;
  try {
    for (const w of [1500, 4000]) { await sleep(w);
      try { await api('sess30', { _chk30: 1 }, 30000); return; } catch (e) { const m = String(e && e.message || ''); if (!/log in again|SESSION_EXPIRED/i.test(m)) return; } }
    try { const L = (await kget('exp30')) || []; L.unshift({ at: new Date().toISOString(), view: current() && current().name, v: typeof APP_V !== 'undefined' ? APP_V : '' }); await kput('exp30', L.slice(0, 10)); } catch (e) {}
    return await _exp.apply(this, arguments);
  } finally { checking = false; }
};
const _api30 = api;
api = async function (a, p, t) {
  try { return await _api30(a, p, t); }
  catch (e) { const m = String(e && e.message || '');
    if (/Please log in again/i.test(m) && S.session && !(p && (p._x30 || p._chk30)) && a !== 'login') { await sleep(300); return _api30(a, Object.assign({}, p || {}, { _x30: 1 }), t); }
    throw e; }
};
/* the start-up that could not reach the server: keep the person signed in and offer Retry, not the login screen */
const _login30 = VIEWS.login;
VIEWS.login = async function (a) {
  if (S.session && S.session.token && S.session.user && !(a && a.fresh)) {
    setHeader(''); const u = S.session.user;
    $('#view').innerHTML = `<div class="t12" style="max-width:420px;margin:12vh auto 0;padding:0 16px"><div class="cd" style="text-align:center;padding:28px 22px">
      <div style="width:56px;height:56px;border-radius:999px;background:#E8F2EC;color:#0E5E3B;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font:700 20px Inter,sans-serif">${esc(String(u.name || '?').trim().split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase())}</div>
      <h2 style="margin:0 0 6px">Signed in as ${esc(u.name || '')}</h2><p class="mu" style="margin:0 0 18px">TehsilOS could not reach the server just now. Your work on this phone is safe.</p>
      <button class="btn12" id="rt30" style="width:100%">Try again</button><button class="btn12 gh" id="lo30" style="width:100%;margin-top:10px">Log in as someone else</button></div></div>`;
    $('#rt30').onclick = e => busy(e.target, 'Connecting', async () => { const b = await api('bootstrap', {}, 60000); S.boot = b; await kput('boot', b); NAV.stack = [{ name: 'home', args: {} }]; history.replaceState({}, ''); S.t12Landed = 0; render(); try { refreshBoot(); scheduleSync(800); } catch (x) {} });
    $('#lo30').onclick = () => { try { logout(); } catch (x) { S.session = null; render(); } };
    return;
  }
  return _login30.apply(this, arguments);
};
/* after a log-in, send the record of earlier expiries (for finding the cause) */
setTimeout(async () => { try { const L = await kget('exp30'); if (L && L.length && S.session) { await api('logError', { error: 'Logged out (session expired): ' + L.map(x => x.at.slice(0, 16) + ' on ' + x.view + ' v' + x.v).join('; ') }, 30000).catch(() => {}); await kdel('exp30'); } } catch (e) {} }, 15000);

/* ---------- 4. small ones ---------- */
})();
