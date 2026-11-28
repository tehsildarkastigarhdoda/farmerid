/* TehsilOS 13 – start-up. */
import './core/style.css';
import { $, esc, initials } from './core/dom.js';
import { kget, kput, kdel } from './core/store.js';
import { S, me, loadSession, saveSession, saveBoot, clearSession, inShell } from './core/session.js';
import { api, onApi } from './core/api.js';
import { reset, current, register } from './core/router.js';
import { mountShell, paintChrome } from './core/shell.js';
import { legacyReset, legacyWarm } from './core/legacy.js';
import { busy, toast } from './core/ui.js';
import './core/refresh.js';
import './modules/login.js';
import './modules/home.js';
import './modules/needs.js';
import './modules/mods.js';
import './modules/staff.js';
import './modules/outbox.js';

const q = new URLSearchParams(location.search);
const toLegacy = () => location.replace('legacy.html' + location.search + location.hash);

async function land() {
  if (me() && me().must_change_pin) return reset('os-pin');
  if (!inShell()) return toLegacy();
  try { await kput('new129:' + me().user_id, 1); } catch (e) {}   // the 12.9 "What's new" is replaced by the new shell
  try { const Q = await kget('queue:' + me().user_id); if (Q && Q.length) legacyWarm(); } catch (e) {}
  return reset('os-home');
}
register('os-retry', { title: 'TehsilOS', form: true, render(el, a) {
  const u = me() || {};
  el.innerHTML = `<div class="pg nr" style="max-width:420px;margin:12vh auto 0"><div class="cd" style="text-align:center;padding:28px 22px">
    <span class="av" style="width:56px;height:56px;font-size:20px;margin:0 auto 14px">${esc(initials(u.name))}</span>
    <h2 style="margin:0 0 6px">Signed in as ${esc(u.name || '')}</h2><p class="sub" style="margin:0 0 18px">${esc(a.msg || 'TehsilOS could not reach the server just now.')} Your work on this phone is safe.</p>
    <button class="btn w" id="rt">Try again</button><button class="btn o w" id="lo" style="margin-top:10px">Log in as someone else</button></div></div>`;
  $('#rt', el).onclick = e => busy(e.currentTarget, 'Connecting', async () => { await saveBoot(await api('bootstrap', {}, { timeout: 60000 })); await land(); });
  $('#lo', el).onclick = () => logout(true);
} });
async function logout(skipAsk) {
  if (!skipAsk) {
    let n = 0; try { n = ((await kget('queue:' + me().user_id)) || []).length; } catch (e) {}
    if (!confirm(n ? `${n} changes are not uploaded yet. They stay on this phone and upload after you log in again.\n\nLog out anyway?` : 'Log out of TehsilOS on this phone?')) return;
  }
  try { if (navigator.onLine) await api('logout', {}, { timeout: 15000 }); } catch (e) {}
  await clearSession(); legacyReset(); reset('os-login'); paintChrome();
}

async function start() {
  if (q.has('board') || q.has('practice')) return toLegacy();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  try { const z = Number(await kget('zoom')) || 1; document.documentElement.style.setProperty('--z', z); } catch (e) {}
  try { await loadSession(); } catch (e) { document.body.innerHTML = '<p style="padding:24px;font:16px Inter,sans-serif">This browser cannot save data. Do not use private or incognito mode.</p>'; return; }
  /* "Keep me logged in" left unticked: the login lasts while this browser stays open */
  if (S.session && (await kget('os:temp')) && !sessionStorage.getItem('os:alive')) { try { await api('logout', {}, { timeout: 8000 }); } catch (e) {} await clearSession(); await kdel('os:temp'); }
  if (!S.session) { mountShell(); return reset('os-login'); }
  if (S.boot && !inShell()) return toLegacy();
  mountShell();
  let fresh = false;
  if (!S.boot) { fresh = true; try { await saveBoot(await api('bootstrap', {}, { timeout: 60000 })); } catch (e) { return reset('os-retry', { msg: e.message }); } }
  await land();
  /* fresh boot in the background; role or tehsil changes take effect */
  if (!fresh) setTimeout(async () => { try { const b = await api('bootstrap', {}, { timeout: 60000 }); const was = JSON.stringify([S.boot && S.boot.rk29, me() && me().role]); await saveBoot(b);
    if (b.user) { S.session.user = b.user; await saveSession(S.session); }
    if (!inShell()) return toLegacy(); if (JSON.stringify([b.rk29, me().role]) !== was) { paintChrome(); if (current() && current().name === 'os-home') reset('os-home'); } } catch (e) {} }, 1500);
}
window.addEventListener('os-login', () => land());
window.addEventListener('os-logout-ask', () => logout(false));
window.addEventListener('os-logout', () => logout(true));
onApi('expired', async () => { await clearSession(); legacyReset(); reset('os-login'); toast('Please log in again. Your saved work is kept on this phone.'); });
start();
