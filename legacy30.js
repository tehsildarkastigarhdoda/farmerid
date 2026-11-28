/* TehsilOS 13 – the older screens, inside the new shell (app.html) or on their own (field staff, until Stage 2). */
"use strict";
(function () {
const Q = new URLSearchParams(location.search), EMBED = Q.has('embed') && window.parent !== window;
const SHELL = ['teh', 'nt', 'da', 'oq', 'gq', 'ph'];
const rk = () => { try { return (window.T12X && T12X.rk29 && T12X.rk29()) || ''; } catch (e) { return ''; } };
const _login = VIEWS.login;
/* 13.2.2: a DC office report (village / village claimed / sub-district summary) chosen in Portal data › Bucket lists is saved as a DC report, not refused */
try { const _ppf = parsePortalFile; parsePortalFile = async function (file) {
  try { return await _ppf.apply(this, arguments); }
  catch (e) { let k = null; try { k = OFFICE8() && typeof dcKind15 === 'function' ? await dcKind15(file) : null; } catch (x) {}
    if (k && k.rows && k.rows.length) { await dcx15Upload(file, k); throw new Error('This is a DC office ' + (k.kind === 'SUBDIST' ? 'sub-district' : 'village') + ' report, not a bucket list. It has been saved to the DC figures (Home and the DC pack use it). Nothing to apply here.'); }
    throw e; } }; } catch (e) {}
/* 13.2.1: portal files may take the server a few minutes; wait for them, and never call a slow server "no internet" */
const SLOW30 = /^(uploadApply|regApply|pmkApply|uploadReg|uploadPreview|dcx15Save|dcSheet10Save)$/;
try { const _api0 = api; api = async function (a, p, t) {
  if (SLOW30.test(a)) t = Math.max(Number(t) || 0, 330000);
  try { return await _api0.call(this, a, p, t); }
  catch (e) { if (SLOW30.test(a) && navigator.onLine && /No internet connection/i.test(String(e && e.message))) throw new Error('The server took too long to answer. It may still be working on the file: wait 3 minutes and look at the dates on this page before trying again.'); throw e; } }; } catch (e) {}
/* a front-end patch (13.1.1) runs on the 13.1 server: only a different major.minor means the server needs pasting */
try { let _sv = S.srv92; const mm = x => String(x || '').split('.').slice(0, 2).join('.');
  Object.defineProperty(S, 'srv92', { configurable: true, get: () => _sv, set: v => { _sv = v && mm(v) === mm(APP_V) ? APP_V : v; } }); S.srv92 = _sv; } catch (e) {}

if (!EMBED) {
  if (Q.has('board') || Q.has('practice')) return;
  /* the log-in lives in the new app; office staff use the new app */
  VIEWS.login = function () { if (!S.session) { location.replace('app.html'); return; } return _login.apply(this, arguments); };
  const _r = render; let checked = false;
  render = async function () { if (!checked && S.session && S.boot) { checked = true; let noph = false; try { noph = !!sessionStorage.getItem('os:noph'); } catch (e) {} if (SHELL.indexOf(rk()) >= 0 && !(noph && rk() === 'ph')) { location.replace('app.html'); return; } } return _r.apply(this, arguments); };
  return;
}

/* ---------- inside the shell ---------- */
document.documentElement.classList.add('emb30');
const st = document.createElement('style');
st.textContent = 'html.emb30 #bar,html.emb30 #nav10,html.emb30 #bnav,html.emb30 #netbar,html.emb30 #upd,html.emb30 #up30,html.emb30 #m28h{display:none!important}'
  + 'html.emb30 body,html.emb30 body.ui26{padding:0!important;margin:0!important}html.emb30 #view{padding-top:0!important;margin-left:0!important;padding-left:0!important;padding-bottom:24px!important;max-width:none!important}@media (max-width:899px){html.emb30 #view{padding-bottom:110px!important}}'
  + 'html.emb30 body.ui26 #view{margin-left:0!important;padding-left:0!important}@media (min-width:900px){html.emb30 body.ui26 #view,html.emb30 #view{margin-left:0!important}}';
document.head.appendChild(st);
const post = m => { try { parent.postMessage(m, location.origin); } catch (e) {} };
const NATIVE = { tos12: 1, inbox12: 1, mods28: 1, users: 1, staff94: 1, pin: 'os-pin' };
S.t12Landed = 1;
let gotGo = false, hadSession = false, readySent = false;
function ready() { if (!readySent) { readySent = true; post({ cmd: 'ready' }); } }
function titleOut() { const t = $('#title'); let x = ''; if (t) { const n = t.firstChild; x = (n && n.nodeType === 3 ? n.textContent : n ? n.textContent : '') || t.textContent; } x = String(x).trim(); if (!x || x === 'TehsilOS') { const h = $('#view h1'); if (h) x = h.textContent.trim().slice(0, 40); }
  post({ cmd: 'title', title: x, depth: NAV.stack.length }); }

const _go = go;
go = function (n, a) { if (NATIVE[n]) { post({ cmd: 'open', name: typeof NATIVE[n] === 'string' ? NATIVE[n] : n, args: a || {} }); return; } return _go.apply(this, arguments); };
const _render = render;
render = async function () {
  if (S.session) hadSession = true;
  const c = current();
  if (!gotGo && c && c.name !== 'login') { ready(); return; }   // wait for the shell to say which screen
  if (c && NATIVE[c.name] && NAV.stack.length === 1) { post({ cmd: 'open', name: typeof NATIVE[c.name] === 'string' ? NATIVE[c.name] : c.name, args: c.args || {} }); return; }
  try { return await _render.apply(this, arguments); } finally { titleOut(); }
};
VIEWS.login = function () { $('#view').innerHTML = ''; if (hadSession || gotGo) post({ cmd: S.session ? 'logout' : 'expired' }); ready(); };
try { afterLoginCards = function () {}; } catch (e) {}
try { upd83 = function () {}; } catch (e) {}   // the shell shows the update banner
try { needPin = function () { return false; }; } catch (e) {}

window.addEventListener('message', e => {
  if (e.origin !== location.origin || e.source !== parent) return; const m = e.data || {};
  if (m.cmd === 'go') { gotGo = true; try { closeAllSheets(); } catch (x) {} NAV.stack = [{ name: m.name, args: m.args || {} }]; history.replaceState({ v: 1 }, ''); window.scrollTo(0, 0); render(); }
  else if (m.cmd === 'back') { if (typeof SHEET !== 'undefined' && SHEET) { try { closeAllSheets(); } catch (x) {} return; } if (NAV.stack.length > 1) history.back(); }
  else if (m.cmd === 'quiet') { try { window.Q30 && Q30.quiet('back'); } catch (x) {} }
});
/* if the start-up has nothing to draw (no boot yet), still tell the shell the frame is here */
setTimeout(ready, 4000);
})();
