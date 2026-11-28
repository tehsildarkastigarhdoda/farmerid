/* The frame around every screen.
 * Phone: slim header (Back · title · avatar) and a floating bottom bar of five.
 * Desktop: one left sidebar (modules, extras, the person at the bottom); no second header.
 */
import { $, $$, esc, on, initials } from './dom.js';
import { svg, openSheet, closeSheet } from './ui.js';
import { S, me, role, rk } from './session.js';
import { go, reset, back, current, depth, onRender, VIEWS } from './router.js';
import { legacyEvents, legacyQuiet } from './legacy.js';
import { onApi } from './api.js';
import { VERSION } from './config.js';

/* the five tabs per role (frozen 27.11) */
const BARS = {
  teh: [['os-home', 'Home', 'home'], ['home', 'Farmer ID', 'fid'], ['c25', 'Certificates', 'cert'], ['m28', 'Meetings', 'meet'], ['os-mods', 'More', 'more']],
  nt: [['os-home', 'Home', 'home'], ['c25', 'Certificates', 'cert'], ['m28', 'Meetings', 'meet'], ['home', 'Farmer ID', 'fid'], ['os-mods', 'More', 'more']],
  da: [['os-home', 'Home', 'home'], ['m28', 'Meetings', 'meet'], ['c25', 'Certificates', 'cert'], ['home', 'Farmer ID', 'fid'], ['os-mods', 'More', 'more']],
  oq: [['os-home', 'Home', 'home'], ['svm12', 'SVAMITVA', 'map'], ['m28', 'Meetings', 'meet'], ['c25', 'Certificates', 'cert'], ['os-mods', 'More', 'more']],
  gq: [['os-home', 'Home', 'home'], ['home', 'Farmer ID', 'fid'], ['m28', 'Meetings', 'meet'], ['svm12', 'SVAMITVA', 'map'], ['os-mods', 'More', 'more']],
};
const EXTRA = () => { const k = rk(), r = role();
  const L = k === 'gq' ? [['cov10', 'Coverage', 'cov']] : k === 'oq' ? [['cov10', 'Coverage', 'cov'], ['ins19', 'Insights', 'ins']]
    : [['cov10', 'Coverage', 'cov'], ['camps10', 'Camps', 'camp'], ['ins19', 'Insights', 'ins'], ['ppl83', 'People', 'ppl']];
  if (r === 'ADMIN' || r === 'DA') L.push(['os-staff', 'Staff & logins', 'lock']);
  if (r === 'ADMIN') L.push(['mast12', 'Settings & masters', 'set']);
  return L; };
/* which tab a screen belongs to */
const TAB_OF = { 'os-home': 'os-home', 'os-needs': 'os-home', 'os-mods': 'os-mods', 'os-staff': 'os-mods', 'os-person': 'os-mods', 'os-pin': 'os-mods',
  home: 'home', cov10: 'home', camps10: 'home', ins19: 'home', ppl83: 'home', c25: 'c25', c25f: 'c25', c25p: 'c25', c25r: 'c25', c25d: 'c25', c25b: 'c25',
  m28: 'm28', m28e: 'm28', m28m: 'm28', m28r: 'm28', svm12: 'svm12', svmv12: 'svm12', svmk12: 'svm12', svmc12: 'svm12', svmr12: 'svm12', svml12: 'svm12' };
/* older screens that now live in the new core */
export const NATIVE_OF = { tos12: 'os-home', inbox12: 'os-needs', mods28: 'os-mods', users: 'os-staff', staff94: 'os-staff' };

let legacyTitle = '', legacyD = 1;
export function mountShell() {
  if ($('#app30')) return;
  document.body.insertAdjacentHTML('afterbegin', `<div id="nb30"></div>
    <aside id="sb30" aria-label="Main"><div class="br"><span>T</span>TehsilOS</div><nav class="tb"></nav><nav class="x"></nav><button class="u" id="u30"></button></aside>
    <header id="hd30"><button id="bk30" aria-label="Back">${svg('back', 22)}</button><b id="tt30">TehsilOS</b><button id="av30" aria-label="Account"></button></header>
    <div id="up30b" hidden><span>A new version of TehsilOS is ready.</span><button id="up30n">Update now</button></div>
    <main id="v30"></main><nav id="bb30" aria-label="Main"></nav><div id="app30"></div>`);
  $('#bk30').onclick = () => back();
  $('#av30').onclick = $('#u30').onclick = () => accountSheet();
  on(document.body, '[data-tab]', 'click', b => { const n = b.dataset.tab; const c = current(); if (c && c.name === n && depth() === 1) return; reset(n); });
  $('#up30n').onclick = () => location.reload();
  legacyEvents({
    title: (t, d) => { legacyTitle = t; legacyD = d || 1; paintHeader(); },
    open: (name, args) => go(NATIVE_OF[name] || name, args),
    out: () => window.dispatchEvent(new Event('os-logout')),
  });
  onRender(() => paintChrome());
  onApi('busy', n => $('#nb30').classList.toggle('on', n > 0));
  verCheck(); setInterval(verCheck, 300000); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') verCheck(); });
}
export function paintChrome() {
  const show = !!S.session && !!current() && ['os-login', 'os-retry'].indexOf(current().name) < 0;
  document.body.classList.toggle('sh', show);
  if (!show) return;
  const tabs = BARS[rk()] || BARS.teh, c = current(), on_ = TAB_OF[c.name] || (VIEWS[c.name] ? '' : tabs[1][0]);
  const btn = (x, cls) => `<button type="button" data-tab="${x[0]}" class="${cls || ''}${on_ === x[0] ? ' on' : ''}">${svg(x[2], 21)}<span>${esc(x[1])}</span></button>`;
  $('#bb30').innerHTML = tabs.map(x => btn(x)).join('');
  $('#sb30 .tb').innerHTML = tabs.filter(x => x[0] !== 'os-mods').map(x => btn(x)).join('') + btn(['os-mods', 'All modules', 'more']);
  $('#sb30 .x').innerHTML = EXTRA().map(x => btn(x)).join('');
  const u = me() || {};
  $('#u30').innerHTML = `<i>${esc(initials(u.name))}</i><span><b>${esc(u.name || '')}</b><small>${esc(u.designation || u.role || '')}</small></span>`;
  $('#av30').textContent = initials(u.name);
  paintHeader();
}
function paintHeader() {
  const c = current(); if (!c) return; const def = VIEWS[c.name];
  const t = def ? (typeof def.title === 'function' ? def.title(c.args) : def.title) : legacyTitle;
  $('#tt30').textContent = t || 'TehsilOS';
  const canBack = depth() > 1 || (!def && legacyD > 1);
  $('#bk30').style.visibility = canBack ? 'visible' : 'hidden';
  document.title = (t ? t + ' · ' : '') + 'TehsilOS';
}
export function setTitle(t) { $('#tt30').textContent = t; document.title = t + ' · TehsilOS'; }

function accountSheet() {
  const u = me() || {};
  openSheet(`<div class="shd"><b>${esc(u.name || '')}</b><button class="x" data-x aria-label="Close">${svg('x', 20)}</button></div>
    <p class="mu" style="margin:-6px 0 14px">${esc(u.designation || '')}${S.boot && S.boot.tehsils ? ' · ' + esc(S.boot.tehsils.map(t => t.name).join(', ')) : ''}</p>
    <div class="list"><button class="row" data-g="set8"><span>My settings<small>Text size, language</small></span>›</button>
      <button class="row" data-g="os-pin"><span>Change my PIN<small>4 digits</small></span>›</button>
      <button class="row" data-out style="color:#B42318"><span>Log out</span>${svg('out', 18)}</button></div>
    <p class="mu" style="text-align:center;margin-top:14px;font-size:12px">TehsilOS ${VERSION}</p>`, p => {
    on(p, '[data-x]', 'click', () => closeSheet());
    on(p, '[data-g]', 'click', b => { closeSheet(true); go(b.dataset.g); });
    on(p, '[data-out]', 'click', () => { closeSheet(true); window.dispatchEvent(new Event('os-logout-ask')); });
  });
}
const vnum = v => String(v || '0').split('.').reduce((a, x) => a * 1000 + (Number(x) || 0), 0);
async function verCheck() { try { const r = await (await fetch('version.json?t=' + Date.now(), { cache: 'no-store' })).json(); if (r && r.v && vnum(r.v) > vnum(VERSION)) $('#up30b').hidden = false; } catch (e) {} }
