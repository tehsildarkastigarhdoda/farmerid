/* TehsilOS 12.6.0 — new shell and home (design brief of 27.11.2026).
 * Desktop: one left sidebar (no second header). Phone: slim header + floating bottom bar.
 * Home: opens on the last saved figures, refreshes quietly; every card loads on its own with its own Retry.
 */
"use strict";
(function () {
const V26 = '12.9.0';
const view = () => $('#view');
const isDesk = () => window.matchMedia('(min-width: 900px)').matches;
const istNow = () => new Date(Date.now() + 5.5 * 3600e3);
const hm = t => { const d = new Date(t + 5.5 * 3600e3); return d.toISOString().slice(11, 16); };
const N = x => Number(x || 0).toLocaleString('en-IN');
const firstName = () => String((me() || {}).name || '').split(' ')[0];

/* ---------- fonts and look ---------- */
if (!$('#f26')) { const l = document.createElement('link'); l.id = 'f26'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'; document.head.appendChild(l); }
const css = document.createElement('style'); css.id = 'css26';
css.textContent = `
body.ui26{--g26:#0E5E3B;--g26t:#E8F2EC;--ink26:#0F1A14;--mu26:#5E6B63;--ln26:#E6E9E6;--bg26:#F6F7F5;--am26:#B26B00;--am26t:#FFF4E0;--rd26:#B42318;--rd26t:#FDECEA;
  background:var(--bg26)!important;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important;color:var(--ink26)}
body.ui26 #topo15{display:none!important}
body.ui26 #bar{background:var(--bg26)!important;border:0!important;box-shadow:none!important}
body.ui26 #bar #back{border:0!important;background:none!important;color:var(--ink26)!important;font:600 14px Inter,sans-serif!important;padding:6px 4px!important;box-shadow:none!important}
body.ui26 #bar #me7{width:38px!important;height:38px!important;border-radius:999px!important;background:#fff!important;border:1px solid var(--ln26)!important;color:var(--ink26)!important;box-shadow:none!important;font:600 14px Inter,sans-serif!important;padding:0!important;min-width:0!important}
body.ui26 #bar #me7 svg{display:none}body.ui26 #bar #me7{font-size:0!important}body.ui26 #bar #me7::after{font-size:14px;font-weight:600}body.ui26.t26 #bar #back{visibility:hidden}
body.ui26 #bar #me7::after{content:attr(data-i26)}
body.ui26 #nav10{background:rgba(255,255,255,.96)!important;border:1px solid var(--ln26)!important;box-shadow:0 8px 24px rgba(15,26,20,.08)!important;border-radius:22px!important}
body.ui26 #nav10 .tb button{color:#6B7670!important;font-weight:500!important;font-family:Inter,sans-serif!important}
body.ui26 #nav10 .tb button.on{color:var(--ink26)!important;font-weight:600!important;background:transparent!important}
body.ui26 #nav10 .tb button.on svg{background:transparent!important}
body.ui26 #nav10 .x26,body.ui26 #nav10 .u26{display:none}
@media (min-width:900px){
  body.ui26{padding-top:0!important;padding-left:248px!important}
  body.ui26 #bar{display:none!important}
  body.ui26 #nav10{top:0!important;left:0!important;bottom:0!important;right:auto!important;width:248px!important;height:auto!important;border-radius:0!important;border:0!important;border-right:1px solid var(--ln26)!important;box-shadow:none!important;background:#fff!important;
    flex-direction:column!important;align-items:stretch!important;padding:22px 14px 14px!important;gap:6px!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
  body.ui26 #nav10 .br{display:flex!important;align-items:center;gap:10px;font:600 17px Inter,sans-serif!important;letter-spacing:-.3px;color:var(--ink26)!important;padding:0 10px 14px}
  body.ui26 #nav10 .br::before{content:"T";width:30px;height:30px;border-radius:9px;background:var(--g26);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
  body.ui26 #nav10 .br{order:0}body.ui26 #nav10 .sr{order:1;flex:none!important;height:38px!important;display:flex!important;max-width:none!important;min-height:38px!important;border-radius:10px!important;background:var(--bg26)!important;box-shadow:none!important;border:1px solid var(--ln26);margin:0 0 10px!important;font-size:13px}
  body.ui26 #nav10 .sr input{font-size:13px!important}
  body.ui26 #nav10 .tb{order:2}body.ui26 #nav10 .x26{order:3}body.ui26 #nav10 .u26{order:4}
  body.ui26 #nav10 .tb,body.ui26 #nav10 .x26{flex:none!important;display:flex!important;flex-direction:column!important;gap:2px!important;padding:0!important;background:none!important;border-radius:0!important;width:auto!important}
  body.ui26 #nav10 .tb button,body.ui26 #nav10 .x26 button{display:flex!important;align-items:center!important;flex-direction:row!important;justify-content:flex-start!important;gap:12px!important;height:40px!important;min-height:40px!important;padding:0 12px!important;border-radius:10px!important;font:500 14px Inter,sans-serif!important;color:#3F4A44!important;border:0;background:none;cursor:pointer;text-align:left;width:100%}
  body.ui26 #nav10 .tb .i{display:flex!important;width:auto!important;height:auto!important;background:none!important}
  body.ui26 #nav10 .tb .i svg{width:18px;height:18px}
  body.ui26 #nav10 .tb button.on,body.ui26 #nav10 .x26 button.on{background:#F1F3F1!important;color:var(--ink26)!important;font-weight:600!important}
  body.ui26 #nav10 .x26{margin-top:10px;padding-top:10px!important;border-top:1px solid #EEF0EE}
  body.ui26 #nav10 .av10{display:none!important}
  body.ui26 #nav10 .u26{display:flex!important;margin-top:auto;align-items:center;gap:10px;padding:12px 10px 4px;border-top:1px solid #EEF0EE;background:none;border-left:0;border-right:0;border-bottom:0;cursor:pointer;text-align:left;font-family:Inter,sans-serif}
  body.ui26 #view{padding-top:8px!important}
  body.ui26.wide #view,body.ui26 #view{max-width:none!important}
  body.ui26 #undo,body.ui26 #toast{left:calc(248px + 24px)!important}
}
body.ui26 .bk26{display:none}
@media (min-width:900px){body.ui26 .bk26{display:inline-flex;align-items:center;gap:6px;margin:14px 0 0 max(20px,calc((100% - 1180px)/2));border:0;background:none;color:var(--mu26);font:500 13px Inter,sans-serif;cursor:pointer;padding:4px 0}
  body.ui26 .bk26:hover{color:var(--ink26)}}
.h26{box-sizing:border-box;width:100%;max-width:1180px;margin:0 auto;padding:16px 16px 24px;font-family:Inter,system-ui,sans-serif;color:#0F1A14}
.h26 *{box-sizing:border-box}
.h26 .top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap}
.h26 .dt{font-size:12.5px;color:#5E6B63}
.h26 h1{font:600 24px/1.2 Inter,sans-serif;letter-spacing:-.5px;margin:2px 0 0}
.h26 .up{display:flex;align-items:center;gap:8px;font-size:12px;color:#5E6B63}
.h26 .up i{width:6px;height:6px;border-radius:9px;background:#0E5E3B;display:inline-block}
.h26 .up.ld i{animation:p26 1.2s ease-in-out infinite}
@keyframes p26{50%{opacity:.25}}
.h26 .grid{display:grid;grid-template-columns:minmax(0,1fr);gap:18px;margin-top:18px}
.h26 .col{display:flex;flex-direction:column;gap:18px;min-width:0}
@media (min-width:1100px){.h26{padding:20px 32px 32px}.h26 h1{font-size:28px}.h26 .grid{grid-template-columns:minmax(0,1.75fr) minmax(0,1fr);gap:20px}}
.h26 .cd{background:#fff;border:1px solid #E6E9E6;border-radius:20px;padding:20px;box-shadow:0 1px 2px rgba(15,26,20,.03)}
.h26 .hd{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:10px}
.h26 .hd b{font-size:16px;font-weight:600}.h26 .hd span,.h26 .hd button{font-size:12px;color:#5E6B63}
.h26 .lk{border:0;background:none;color:#0E5E3B!important;font:600 12px Inter,sans-serif;cursor:pointer;padding:0}
.h26 .hro{display:flex;gap:22px;align-items:center;flex-wrap:wrap}
.h26 .hro .nm26{flex:1;min-width:200px}
.h26 .lb{font-size:13px;font-weight:500;color:#5E6B63}
.h26 .bg26{font-size:44px;font-weight:600;letter-spacing:-1.5px;line-height:1.1;font-variant-numeric:tabular-nums}
.h26 .of{font-size:13.5px;color:#5E6B63}
.h26 .gain{display:inline-block;font-size:12.5px;font-weight:600;color:#0E5E3B;background:#E8F2EC;border-radius:999px;padding:3px 10px;margin-left:6px}
.h26 .acts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px}
@media (min-width:1100px){.h26 .hro{flex-wrap:nowrap}.h26 .hro .acts{display:flex;flex-direction:column;width:190px;margin-top:0}}
.h26 .b1,.h26 .b2{height:46px;border-radius:12px;font:600 14px Inter,sans-serif;cursor:pointer;padding:0 14px}
.h26 .b1{border:0;background:#0F1A14;color:#fff}.h26 .b2{border:1px solid #D5DBD6;background:#fff;color:#0F1A14}
.h26 .minis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:18px;padding-top:16px;border-top:1px solid #EEF0EE}
.h26 .mini{display:flex;align-items:center;gap:8px;border:0;background:none;padding:0;text-align:left;cursor:pointer;font-family:inherit;color:inherit}
.h26 .mini b{display:block;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}.h26 .mini span{font-size:11.5px;color:#5E6B63}
.h26 .nd{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid #F1F3F1}
.h26 .nd:first-of-type{border-top:0}
.h26 .nd .c{width:10px;height:10px;border-radius:9px;border:2px solid #9AA49E;flex:none}
.h26 .nd .c.r{border-color:#B42318}.h26 .nd .c.a{border-color:#B26B00}
.h26 .nd .t{flex:1;min-width:0}.h26 .nd .t b{display:block;font-size:14px;font-weight:600}.h26 .nd .t span{font-size:12px;color:#5E6B63}
.h26 .pb{height:32px;padding:0 14px;border-radius:999px;font:600 12.5px Inter,sans-serif;cursor:pointer;border:1px solid #D5DBD6;background:#fff;color:#0F1A14;flex:none}
.h26 .pb.k{border:0;background:#0F1A14;color:#fff}
.h26 .wk{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;text-align:center}
.h26 .wk div{display:flex;flex-direction:column;align-items:center;gap:6px}
.h26 .wk span{font-size:11px;color:#5E6B63}.h26 .wk em{font-style:normal;font-size:12px;font-weight:600}
.h26 .wk i{width:100%;height:46px;border-radius:10px;background:#EEF0EE;display:flex;align-items:flex-end;overflow:hidden}
.h26 .wk i u{display:block;width:100%;border-radius:10px;background:#0E5E3B;text-decoration:none}
.h26 .wk .td i{outline:2px solid #0F1A14;outline-offset:2px}.h26 .wk .td span{color:#0F1A14;font-weight:600}
.h26 table{width:100%;border-collapse:collapse;font-size:13px}
.h26 th{font-weight:500;font-size:12px;color:#5E6B63;text-align:left;padding:8px 0;border-bottom:1px solid #EEF0EE}
.h26 td{padding:10px 0;border-bottom:1px solid #F3F4F3}
.h26 tr:last-child td{border-bottom:0}
.h26 .vb{display:flex;align-items:center;gap:10px}.h26 .vb i{flex:1;height:6px;border-radius:9px;background:#EEF0EE;overflow:hidden}
.h26 .vb i u{display:block;height:6px;border-radius:9px;background:#0E5E3B}.h26 .vb i u.a{background:#B26B00}
.h26 .vb em{font-style:normal;width:38px;text-align:right;font-variant-numeric:tabular-nums}
.h26 .tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.h26 .tile{background:#fff;border:1px solid #E6E9E6;border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:12px;text-align:left;cursor:pointer;font-family:inherit;color:inherit}
.h26 .tile .ic{width:38px;height:38px;border-radius:999px;display:flex;align-items:center;justify-content:center}
.h26 .tile b{display:block;font-size:14px;font-weight:600}.h26 .tile span.s{display:block;font-size:12px;color:#5E6B63;margin-top:2px}
.h26 .row26{display:flex;justify-content:space-between;align-items:center;width:100%;border:0;border-top:1px solid #F1F3F1;background:none;padding:13px 0;font:500 14px Inter,sans-serif;color:#0F1A14;cursor:pointer;text-align:left}
.h26 .row26:first-of-type{border-top:0}.h26 .row26 small{display:block;font-size:12px;color:#5E6B63;font-weight:400;margin-top:2px}
.h26 .sk{border-radius:10px;background:linear-gradient(90deg,#EEF0EE 25%,#F5F6F5 50%,#EEF0EE 75%);background-size:200% 100%;animation:s26 1.4s linear infinite}
@keyframes s26{to{background-position:-200% 0}}
.h26 .er{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13px;color:#5E6B63}
.h26 .ft{text-align:center;font-size:12px;color:#8A948E;margin-top:8px}
.h26 .tabs{display:flex;gap:6px;flex-wrap:wrap}
.h26 .tabs button{height:30px;padding:0 12px;border-radius:999px;border:1px solid #E6E9E6;background:#fff;color:#3F4A44;font:500 12px Inter,sans-serif;cursor:pointer}
.h26 .tabs button.on{border-color:#0F1A14;background:#0F1A14;color:#fff}
`;
document.head.appendChild(css);

/* ---------- shell ---------- */
const ICO = { cert: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6', camp: 'M4 20l8-16 8 16zM10 20l2-4 2 4', ins: 'M4 20V10M10 20V4M16 20v-7M22 20H2', ppl: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.7.9 2.7 2.7 3 5.2',
  cov: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', set: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15', doc: 'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2', meet: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4M7 14h4M7 17h7', court: 'M12 3v18M5 21h14M4 8h16M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z', land: 'M3 20l5-9 4 6 3-4 6 7zM16 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', dak: 'M3 6h18v12H3zM3 6l9 7 9-7', griev: 'M4 5h16v11H9l-5 4zM12 8v3M12 13.5v.01', fid: 'M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10zM12 8v6M9 11h6', sw: 'M7 7h10M7 7l3-3M7 7l3 3M17 17H7M17 17l-3-3M17 17l-3 3' };
const svg = (k, s) => `<svg width="${s || 18}" height="${s || 18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICO[k]}"/></svg>`;
try { P10.cert = ICO.cert; } catch (e) {}
const X = () => window.T12X || {};
const on26 = () => !!(S.session && S.boot && X().shell && X().shell() && !S.boot.fid25);
const RK = () => (X().rk29 && X().rk29()) || 'teh';
const BARS = { teh: [['tos12', 'Home', 'os'], ['home', 'Farmer ID', 'home'], ['c25', 'Certificates', 'cert'], ['m28', 'Meetings', 'm28'], ['mods28', 'More', 'mods28']],
  nt: [['tos12', 'Home', 'os'], ['c25', 'Certificates', 'cert'], ['m28', 'Meetings', 'm28'], ['home', 'Farmer ID', 'home'], ['mods28', 'More', 'mods28']],
  da: [['tos12', 'Home', 'os'], ['m28', 'Meetings', 'm28'], ['c25', 'Certificates', 'cert'], ['home', 'Farmer ID', 'home'], ['mods28', 'More', 'mods28']],
  oq: [['tos12', 'Home', 'os'], ['svm12', 'SVAMITVA', 'map'], ['m28', 'Meetings', 'm28'], ['c25', 'Certificates', 'cert'], ['mods28', 'More', 'mods28']],
  gq: [['tos12', 'Home', 'os'], ['home', 'Farmer ID', 'home'], ['m28', 'Meetings', 'm28'], ['svm12', 'SVAMITVA', 'map'], ['mods28', 'More', 'mods28']] };
const setBar = () => { try { const T = X().TABS_OS, want = BARS[RK()] || BARS.teh; if (T && T.map(x => x[0]).join() !== want.map(x => x[0]).join()) { T.length = 0; want.forEach(x => T.push(x.slice())); } } catch (e) {} };
setBar();
try { Object.assign(TABOF10, { c25: 'c25', c25f: 'c25', c25p: 'c25', c25d: 'c25', c25r: 'c25', c25b: 'c25' }); } catch (e) {}
const EXTRA = () => (RK() === 'gq' ? [['cov10', 'Coverage', 'cov']] : RK() === 'oq' ? [['cov10', 'Coverage', 'cov'], ['ins19', 'Insights', 'ins']] : [['cov10', 'Coverage', 'cov'], ['camps10', 'Camps', 'camp'], ['ins19', 'Insights', 'ins'], ['ppl83', 'People', 'ppl']]).concat(role() === 'ADMIN' ? [['mast12', 'Settings & masters', 'set'], ['assar19', 'Tehsil Assar', 'sw']] : []);
const _ub26 = updateBnav;
updateBnav = function () {
  setBar(); _ub26();
  const want = on26(); document.body.classList.toggle('ui26', want);
  if (!want) return;
  const n = $('#nav10'); if (!n) return;
  if (!$('.x26', n)) { const x = document.createElement('div'); x.className = 'x26';
    x.innerHTML = EXTRA().map(e => `<button data-x26="${e[0]}">${svg(e[2])}<span>${esc(e[1])}</span></button>`).join(''); n.appendChild(x);
    on(x, '[data-x26]', 'click', b => { closeAllSheets(); go(b.dataset.x26, {}); }); }
  if (!$('.u26', n)) { const u = me() || {}, b = document.createElement('button'); b.className = 'u26'; b.setAttribute('aria-label', 'My settings and log out');
    b.innerHTML = `<span style="width:34px;height:34px;border-radius:999px;background:#E8F2EC;color:#0E5E3B;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;flex:none">${esc(ini())}</span><span style="flex:1;min-width:0"><span style="display:block;font-size:13px;font-weight:600;color:#0F1A14">${esc(u.name || '')}</span><span style="display:block;font-size:12px;color:#5E6B63">${esc(desig())}</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E6B63" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
    b.onclick = () => go('set8', {}); n.appendChild(b); }
  const c = current(); $$('[data-x26]', n).forEach(b => b.classList.toggle('on', !!c && b.dataset.x26 === c.name));
  const m = $('#me7'); if (m) m.setAttribute('data-i26', ini());
};
const ini = () => String((me() || {}).name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
const desig = () => { const u = me() || {}; return u.role === 'ADMIN' ? 'Tehsildar Kastigarh' : u.role === 'NT' ? 'Naib Tehsildar' : u.role === 'DA' ? 'Dealing Assistant' : (u.designation || ''); };
/* desktop: a small Back link replaces the old header bar */
const _r26 = render;
render = async function () {
  try { const c = current(); document.body.classList.toggle('t26', !!c && c.name === 'tos12'); } catch (e) {}
  const out = await _r26.apply(this, arguments);
  try { if (on26() && NAV.stack.length > 1 && current().name !== 'tos12' && !$('.bk26', view())) { const b = document.createElement('button'); b.className = 'bk26'; b.innerHTML = '‹ Back'; b.onclick = () => history.back(); view().insertBefore(b, view().firstChild); } } catch (e) {}
  return out;
};

/* ---------- home ---------- */
const SRC = {
  ins: f => api('ins19', f ? { fresh: 1 } : {}, 60000),
  day: f => api('day19', f ? { fresh: 1 } : {}, 60000),
  al: f => api('alerts19', f ? { fresh: 1 } : {}, 45000),
  c25: () => api('cert25List', {}, 45000),
  m28: () => (window.M28X ? window.M28X.needs(true) : Promise.resolve(null)),
  h29: () => api('home29', {}, 45000),
  svm: f => X().svmLoad(f).then(D => ({ totals: D.totals, needs: X().needs(D).slice(0, 6) }))
};
const H = { data: {}, err: {}, busy: {}, at: 0, vil: 'all' };
const kk = k => 'ui26:' + ((me() || {}).user_id || '') + ':' + k;
async function fetchOne(k, draw, f) {
  H.busy[k] = 1; draw();
  try { const d = await SRC[k](f); H.data[k] = d; H.err[k] = ''; H.at = Date.now(); try { kput(kk(k), { t: Date.now(), d }); } catch (e) {} }
  catch (e) { H.err[k] = e.message || 'Could not load'; }
  H.busy[k] = 0; if (current() && current().name === 'tos12') draw();
}
const sk = (h, w) => `<div class="sk" style="height:${h}px;width:${w || '100%'}"></div>`;
const errRow = (k, what) => `<div class="er"><span>Couldn't load ${what}.</span><button class="pb" data-retry="${k}">Retry</button></div>`;
const ring = (pct, size, sw, col, tint, label) => { const r = (size - sw) / 2, c = 2 * Math.PI * r, d = Math.max(0, Math.min(1, pct)) * c;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'} style="flex:none"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${tint}" stroke-width="${sw}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${d.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>${label && size > 60 ? `<text x="${size / 2}" y="${size / 2 + 6}" text-anchor="middle" font-family="Inter,sans-serif" font-size="${size > 110 ? 24 : 17}" font-weight="600" fill="#0F1A14">${Math.round(pct * 100)}%</text>` : ''}</svg>`; };
function totals(ins) { return (ins.villages || []).reduce((a, v) => { a.total += v.total || 0; a.claimed += v.claimed || 0; a.part += v.part || 0; return a; }, { total: 0, claimed: 0, part: 0 }); }
const heroG = o => `<div class="cd"><div class="hro">${o.pct != null ? ring(o.pct, 96, 9, '#0E5E3B', '#E8F2EC', Math.round(o.pct * 100) + ' percent') : ''}
    <div class="nm26"><div class="lb">${o.label}</div><div style="margin-top:4px"><span class="bg26">${o.big}</span></div><div class="of">${o.of || ''}</div></div>
    <div class="acts">${o.b.map((b, i) => `<button class="${i ? 'b2' : 'b1'}" data-go="${b[0]}" ${b[2] ? `data-args="${esc(JSON.stringify(b[2]))}"` : ''}>${b[1]}</button>`).join('')}</div></div></div>`;
const heroSk = k => `<div class="cd">${H.err[k] ? errRow(k, 'figures') : `${sk(14, '40%')}<div style="height:10px"></div>${sk(46, '55%')}<div style="height:10px"></div>${sk(14, '30%')}`}</div>`;
function heroRole(K) {
  const C = H.data.c25, MG = H.data.m28, V = H.data.svm, G = H.data.h29, td = istNow().toISOString().slice(0, 10);
  if (K === 'nt') { if (!C) return heroSk('c25'); const ch = C.rows.filter(r => r.fresh && r.mine).length;
    return heroG({ label: 'Certificates · new Patwari reports for you', big: N(C.fresh || 0), of: ch ? ch + ' changed after your report' : 'Whole tehsil', b: [['c25', 'Open Certificates'], ['m28', 'Meetings']] }); }
  if (K === 'da') { const up = MG && MG.rows ? MG.rows.filter(r => r.date >= td && r.of).sort((a, b) => a.date.localeCompare(b.date))[0] : null;
    if (up) return heroG({ pct: up.got / up.of, label: esc(up.title) + ' · information received', big: up.got + ' of ' + up.of, of: (up.of - up.got) + ' not received · meeting ' + String(up.date).slice(8, 10) + '-' + String(up.date).slice(5, 7), b: [['m28m', 'Response board', { id: up.mtg_id }], ['m28', 'Meetings']] });
    if (!C) return heroSk('c25'); return heroG({ label: 'Certificates · files ready for scrutiny', big: N(C.fresh || 0), of: 'Patwari and NT reports in', b: [['c25', 'Open Certificates'], ['m28', 'Meetings']] }); }
  if (K === 'oq') { if (!V || !V.totals) return heroSk('svm'); const t = V.totals;
    return heroG({ pct: t.props ? t.cards / t.props : 0, label: 'SVAMITVA · property cards', big: N(t.cards), of: 'of ' + N(t.props) + ' · ' + N(t.pending) + ' pending', b: [['svm12', 'Open SVAMITVA'], ['m28', 'Meetings']] }); }
  if (K === 'gq') { if (!G) return heroSk('h29'); const f = G.fid, made = f.claimed + f.part;
    return heroG({ pct: f.total ? made / f.total : 0, label: 'Farmer ID · ' + esc(G.scope), big: N(made), of: 'of ' + N(f.total) + (G.gain != null ? `<span class="gain">+${N(G.gain)} today</span>` : ''), b: [['home', 'Farmer ID'], ['m28', 'Meetings']] }); }
  return '';
}
function heroCard() {
  const K = RK(); if (K !== 'teh') return heroRole(K);
  const I = H.data.ins, D = H.data.day;
  if (!I) return `<div class="cd">${H.err.ins ? errRow('ins', 'Farmer ID figures') : `${sk(14, '40%')}<div style="height:10px"></div>${sk(46, '55%')}<div style="height:10px"></div>${sk(14, '30%')}`}</div>`;
  const T = totals(I), made = T.claimed + T.part, today = D ? (D.totals.made + D.totals.part) : null, pct = T.total ? made / T.total : 0;
  return `<div class="cd"><div class="hro">${ring(pct, isDesk() && window.innerWidth >= 1100 ? 132 : 96, isDesk() && window.innerWidth >= 1100 ? 12 : 9, '#0E5E3B', '#E8F2EC', Math.round(pct * 100) + ' percent of buckets claimed')}
    <div class="nm26"><div class="lb">Farmer ID · buckets claimed</div><div style="margin-top:4px"><span class="bg26">${N(made)}</span></div><div class="of">of ${N(T.total)}${today != null ? `<span class="gain">+${N(today)} today</span>` : ''}</div></div>
    <div class="acts"><button class="b1" data-go="${VIEWS.portal ? 'portal' : 'pp19'}">Upload portal files</button><button class="b2" data-go="day19">Today's report</button></div></div>
    <div class="minis">
      <button class="mini" data-go="ins19">${ring(T.total ? T.part / T.total : 0, 30, 4, '#B26B00', '#FFF1DC')}<span><b>${N(T.part)}</b><span>Part-claimed</span></span></button>
      <button class="mini" data-go="ins19">${ring(I.ids && I.ids.made ? I.ids.pending / I.ids.made : 0, 30, 4, '#2F5D9E', '#E8EEF7')}<span><b>${N(I.ids ? I.ids.pending : 0)}</b><span>Approval due</span></span></button>
      <button class="mini" data-go="ins19">${ring(T.total ? (T.total - made) / T.total : 0, 30, 4, '#5E6B63', '#EEF0EE')}<span><b>${N(T.total - made)}</b><span>Unclaimed</span></span></button>
    </div></div>`;
}
function needsList() {
  const L = [], C = H.data.c25, A = H.data.al, V = H.data.svm;
  if (C && C.rows) { const w = C.who, n = Number(C.fresh) || 0, d = Number(C.drafts) || 0, pl = (k, x) => k + ' ' + x + (k > 1 ? 's' : '');
    const T = { nt: `${pl(n, 'new Patwari report')} for you`, da: `${pl(n, 'file')} ready for scrutiny`, teh: `${pl(n, 'file')} ready for your remark` };
    if (n && T[w]) L.push({ c: 'a', t: T[w], s: 'Certificates', b: 'Open', k: 1, go: ['c25', {}] });
    if (d && w === 'ph') L.push({ c: '', t: `${pl(d, 'draft report')}`, s: 'Certificates', b: 'Open', go: ['c25', {}] }); }
  if (A && A.alerts) { const st = A.alerts.filter(x => x.k === 'stall');
    if (st.length > 1) L.push({ c: 'a', t: `${st.length} villages: no new Farmer ID in 2 days`, s: st.map(x => String(x.t).split(':')[0]).join(', '), b: 'View', go: ['day19', {}] });
    A.alerts.filter(x => !(st.length > 1 && x.k === 'stall')).forEach(x => L.push({ c: x.k === 'upload' || x.k === 'check' ? 'a' : '', t: x.t, s: 'Farmer ID', b: 'View', go: x.k === 'upload' ? [VIEWS.portal ? 'portal' : 'pp19', {}] : x.k === 'patwari' ? ['reg14', {}] : ['day19', {}] })); }
  const MG = H.data.m28; if (MG && MG.needs) MG.needs.forEach(n => L.unshift({ c: n.k === 'approve' ? 'r' : n.k === 'back' ? 'r' : 'a', t: n.t, s: 'Meetings' + (n.due ? ' · due ' + String(n.due).slice(8, 10) + '-' + String(n.due).slice(5, 7) + ' ' + String(n.due).slice(11, 16) : n.date ? ' · ' + String(n.date).slice(8, 10) + '-' + String(n.date).slice(5, 7) : ''), b: n.k === 'approve' ? 'Review' : n.k === 'reply' ? 'Submit' : 'Open', k: 1, go: [n.k === 'reply' ? 'm28r' : 'm28m', { id: n.mtg_id }] }));
  if (V && V.needs) V.needs.forEach(n => L.push({ c: '', t: n.t, s: 'SVAMITVA · ' + n.k, b: 'Open', go: n.a }));
  return L;
}
function needsCard() {
  const L = needsList(), wait = ['c25', 'al', 'svm', 'm28', 'h29'].some(k => H.busy[k] && !H.data[k]);
  const errs = ['c25', 'al', 'svm'].filter(k => H.err[k] && !H.data[k]);
  return `<div class="cd"><div class="hd"><b>Needs you</b>${L.length > 6 ? `<button class="lk" data-go="inbox12">All ${L.length}</button>` : `<span>${L.length ? L.length + ' item' + (L.length > 1 ? 's' : '') : ''}</span>`}</div>
    ${L.slice(0, 6).map((n, i) => `<div class="nd"><i class="c ${n.c}"></i><div class="t"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></div><button class="pb ${n.k ? 'k' : ''}" data-nd="${i}">${n.b}</button></div>`).join('')}
    ${!L.length && wait ? `${sk(16)}<div style="height:12px"></div>${sk(16, '70%')}` : ''}${!L.length && !wait && !errs.length ? '<div class="dt" style="padding:6px 0">Nothing is waiting on you.</div>' : ''}
    ${errs.length ? `<div style="margin-top:8px">${errRow(errs[0], errs.map(k => ({ c25: 'certificates', al: 'alerts', svm: 'SVAMITVA' }[k])).join(', '))}</div>` : ''}</div>`;
}
function weekCard() {
  const I = H.data.ins; if (!I) return H.err.ins ? '' : `<div class="cd">${sk(16, '30%')}<div style="height:14px"></div>${sk(60)}</div>`;
  const s = I.series || []; if (s.length < 2) return '';
  const days = []; for (let i = Math.max(1, s.length - 7); i < s.length; i++) days.push({ d: s[i][0], n: Math.max(0, s[i][1] - s[i - 1][1]) });
  const mx = Math.max.apply(null, days.map(x => x.n).concat([1])), td = istNow().toISOString().slice(0, 10), W = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `<div class="cd"><div class="hd"><b>This week</b><span>IDs made each day${I.pace != null ? ' · pace ' + N(I.pace) + '/day' : ''}</span></div>
    <div class="wk">${days.map(x => `<div class="${x.d === td ? 'td' : ''}"><span>${x.d === td ? 'Today' : W[new Date(x.d + 'T00:00:00Z').getUTCDay()]}</span><i><u style="height:${Math.max(4, Math.round(x.n * 100 / mx))}%;${x.n < mx * 0.45 ? 'background:#B26B00' : ''}"></u></i><em>${N(x.n)}</em></div>`).join('')}</div></div>`;
}
function villCard() {
  const I = H.data.ins, D = H.data.day; if (!I) return H.err.ins ? '' : `<div class="cd">${sk(16, '25%')}${[1, 2, 3, 4].map(() => '<div style="height:14px"></div>' + sk(14)).join('')}</div>`;
  const tdy = {}; if (D && D.villages) D.villages.forEach(v => tdy[v.name] = (v.made || 0) + (v.part || 0));
  const V = (I.villages || []).map(v => ({ name: v.name, id: v.village_id, pct: v.total ? (v.claimed + v.part) * 100 / v.total : 0, pend: v.pending || 0 })).sort((a, b) => b.pct - a.pct);
  const avg = V.length ? V.reduce((a, v) => a + v.pct, 0) / V.length : 0;
  return `<div class="cd"><div class="hd"><b>Villages</b><button class="lk" data-go="ins19">Insights ›</button></div>
    <table><thead><tr><th style="width:34%">Village</th><th>Claimed</th><th style="text-align:right;width:16%">Pending</th><th style="text-align:right;width:14%">Today</th></tr></thead><tbody>
    ${V.map(v => `<tr><td style="font-weight:600">${esc(v.name)}</td><td><div class="vb"><i><u class="${v.pct < avg * 0.8 ? 'a' : ''}" style="width:${v.pct.toFixed(1)}%"></u></i><em>${Math.round(v.pct)}%</em></div></td><td style="text-align:right;font-variant-numeric:tabular-nums">${N(v.pend)}</td><td style="text-align:right;font-variant-numeric:tabular-nums">${tdy[v.name] != null ? '+' + N(tdy[v.name]) : '–'}</td></tr>`).join('')}</tbody></table></div>`;
}
function tilesCard() {
  const C = H.data.c25, V = H.data.svm, mine = needsList().filter(n => n.go && n.go[0] === 'c25').length;
  const t = (go, ic, bg, fg, name, sub) => `<button class="tile" data-go="${go}"><span class="ic" style="background:${bg};color:${fg}">${svg(ic, 19)}</span><span><b>${name}</b><span class="s">${sub}</span></span></button>`;
  const MG = H.data.m28, up = MG && MG.rows ? MG.rows.filter(r => r.date >= istNow().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date))[0] : null, c25on = !!(window.C25X && window.C25X.who && window.C25X.who());
  const SOON = [['Revenue Court Cases', 'court'], ['State Land & Encroachment', 'land'], ['Dak Section', 'dak'], ['Grievances', 'griev']];
  const K = RK(), mt = window.M28X && window.M28X.who() ? t('m28', 'meet', '#F0EEF7', '#5B4B8A', 'Meetings', up ? esc(up.title.length > 22 ? up.title.slice(0, 21) + '…' : up.title) + ' · ' + Number(up.date.slice(8, 10)) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(up.date.slice(5, 7)) - 1] : 'Notices, brief, minutes') : '';
  const cert = sub => c25on ? t('c25', 'cert', '#E8F2EC', '#0E5E3B', 'Certificates', sub || (mine ? 'New for you' : 'Reports and remarks')) : '', fidT = sub => t('home', 'fid', '#E8F2EC', '#0E5E3B', 'Farmer ID', sub), svT = sub => X().svmOn() ? t('svm12', 'map', '#EAF0F8', '#2F5D9E', 'SVAMITVA', sub || (V && V.totals ? N(V.totals.cards) + ' of ' + N(V.totals.props) + ' cards' : 'Abadi deh, cards')) : '';
  const all = `<button class="cd row26" data-go="mods28" style="width:100%;margin-top:12px;padding:14px 20px"><span>All modules<small>${role() === 'ADMIN' ? '5 live · 11 coming' : 'Everything in TehsilOS'}</small></span><span>›</span></button>`;
  if (K === 'nt') return `<div class="tiles">${cert()}${mt}${fidT('Whole tehsil · view')}${svT('View')}</div>${all}`;
  if (K === 'da') return `<div class="tiles">${mt}${cert()}${fidT('4:30 report, camps')}${t('rep8', 'doc', '#F1F3F1', '#3F4A44', 'Reports', 'Daily, weekly')}</div>${all}`;
  if (K === 'oq') return `<div class="tiles">${svT()}${mt}${cert('View')}${fidT('View')}</div>${all}`;
  if (K === 'gq') return `<div class="tiles">${fidT('Your circle')}${svT('View')}${mt}</div>${all}`;
  return `<div class="tiles">${c25on ? t('c25', 'cert', '#E8F2EC', '#0E5E3B', 'Certificates', C ? (mine ? 'New for you' : 'Reports and remarks') : 'Reports and remarks') : ''}
    ${window.M28X && window.M28X.who() ? t('m28', 'meet', '#F0EEF7', '#5B4B8A', 'Meetings', up ? esc(up.title.length > 22 ? up.title.slice(0, 21) + '…' : up.title) + ' · ' + Number(up.date.slice(8, 10)) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(up.date.slice(5, 7)) - 1] : 'Notices, brief, minutes') : ''}
    ${t('svm12', 'map', '#EAF0F8', '#2F5D9E', 'SVAMITVA', V && V.totals ? N(V.totals.cards) + ' of ' + N(V.totals.props) + ' cards' : 'Abadi deh, cards')}
    ${t('camps10', 'camp', '#FFF4E0', '#8A5300', 'Camps', 'Daily camps, deployment')}
    ${t('ins19', 'ins', '#F0EEF7', '#5B4B8A', 'Insights', 'Rank, pace, villages')}</div>
    ${role() === 'ADMIN' ? `<div class="hd" style="margin:18px 0 10px"><b>Coming soon</b><span>Only you see these</span></div><div class="tiles">${SOON.map(s => `<button class="tile" data-go="mods28" style="opacity:.55;position:relative"><span class="ic" style="background:#F1F3F1;color:#5E6B63">${svg(s[1], 19)}</span><span><b>${s[0]}</b><span class="s">Planned</span></span></button>`).join('')}</div>` : ''}
    <button class="cd row26" data-go="mods28" style="width:100%;margin-top:12px;padding:14px 20px"><span>All modules<small>${role() === 'ADMIN' ? '5 live · 11 coming' : 'Everything in TehsilOS'}</small></span><span>›</span></button>`;
}
function gqVill() {
  const G = H.data.h29; if (!G) return H.err.h29 ? '' : `<div class="cd">${sk(16, '25%')}${[1, 2, 3].map(() => '<div style="height:14px"></div>' + sk(14)).join('')}</div>`;
  return `<div class="cd"><div class="hd"><b>Villages</b><span>${esc(G.scope)}</span></div><table><thead><tr><th style="width:40%">Village</th><th>Claimed</th></tr></thead><tbody>
    ${G.villages.map(v => { const p = v.total ? v.done * 100 / v.total : 0; return `<tr><td style="font-weight:600">${esc(v.name)}</td><td><div class="vb"><i><u style="width:${p.toFixed(1)}%"></u></i><em>${Math.round(p)}%</em></div></td></tr>`; }).join('')}</tbody></table></div>`;
}
function moreCard() {
  return `<div class="cd" style="padding:8px 20px"><button class="row26" data-go="cov10"><span>Coverage<small>Village-wise status</small></span><span>›</span></button>
    ${['teh', 'nt', 'da'].indexOf(RK()) >= 0 ? '<button class="row26" data-go="ppl83"><span>People<small>Staff, logins, villages</small></span><span>›</span></button>' : ''}
    ${role() === 'ADMIN' ? `<button class="row26" data-go="mast12"><span>Settings &amp; masters<small>Villages, halqas, card prefixes, modules</small></span><span>›</span></button>
    <button class="row26" data-go="assar19"><span>Tehsil Assar<small>Master switch · closing date</small></span><span>›</span></button>` : ''}
    <button class="row26" data-go="set8"><span>My settings<small>PIN, text size, language · Log out</small></span><span>›</span></button></div>`;
}
function draw() {
  if (!current() || current().name !== 'tos12') return;
  const h = istNow().getUTCHours(), d = istNow(), busy = Object.keys(H.busy).some(k => H.busy[k]);
  const when = H.at ? 'Updated ' + hm(H.at) : 'Loading…';
  const desk = window.innerWidth >= 1100;
  view().innerHTML = `<div class="h26">
    <div class="top"><div><div class="dt">Tehsil Kastigarh · ${d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}</div>
      <h1>${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}${firstName() ? ', ' + esc(firstName()) : ''}</h1>${RK() !== 'teh' ? `<div class="dt" style="margin-top:2px">${esc(desig())}${RK() === 'nt' ? ' · whole tehsil' : ''}</div>` : ''}</div>
      <div class="up ${busy ? 'ld' : ''}"><i></i>${when}${busy && H.at ? ' · refreshing' : ''}${!busy ? ` · <button class="lk" id="rf26">Refresh</button>` : ''}</div></div>
    <div class="grid">${RK() === 'gq' || RK() === 'oq' ? (desk ? `<div class="col">${heroCard()}${gqVill()}</div><div class="col">${needsCard()}${tilesCard()}${moreCard()}</div>` : `<div class="col">${heroCard()}${needsCard()}${tilesCard()}${gqVill()}${moreCard()}</div>`)
      : desk ? `<div class="col">${heroCard()}${villCard()}</div><div class="col">${needsCard()}${weekCard()}${tilesCard()}${moreCard()}</div>`
      : `<div class="col">${heroCard()}${needsCard()}${tilesCard()}${weekCard()}${villCard()}${moreCard()}</div>`}</div>
    <div class="ft">TehsilOS ${esc(V26)}</div></div>`;
  const L = needsList();
  on(view(), '[data-go]', 'click', b => { const n = b.dataset.go; if (b.dataset.args) { go(n, JSON.parse(b.dataset.args)); return; } if (n === 'home') { NAV.stack = [{ name: 'home', args: {} }]; history.replaceState({}, ''); render(); } else go(n, {}); });
  on(view(), '[data-nd]', 'click', b => { const n = L[Number(b.dataset.nd)]; if (n && n.go) go(n.go[0], n.go[1] || {}); });
  on(view(), '[data-retry]', 'click', b => fetchOne(b.dataset.retry, draw));
  const rf = $('#rf26'); if (rf) rf.onclick = () => loadAll(true);
}
function loadAll(f) {
  const K = RK(), sv = X().svmOn() ? ['svm'] : [], cert = window.C25X && window.C25X.who && window.C25X.who() ? ['c25'] : [];
  const ks = K === 'gq' ? ['h29', 'm28'].concat(sv) : K === 'oq' ? ['h29', 'm28'].concat(sv, cert) : ['ins', 'day', 'al', 'm28'].concat(sv, cert);
  ks.forEach(k => fetchOne(k, draw, f));
}
let rz = 0; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (current() && current().name === 'tos12' && document.body.classList.contains('ui26')) draw(); }, 200); });
const _old26 = VIEWS.tos12;
VIEWS.tos12 = async function (a) {
  if (!on26()) return _old26(a);
  try { setHeader(''); } catch (e) {} document.body.classList.add('wide', 't26');
  if (!H.uid || H.uid !== (me() || {}).user_id) { H.data = {}; H.err = {}; H.busy = {}; H.at = 0; H.uid = (me() || {}).user_id;
    for (const k of Object.keys(SRC)) { try { const c = await kget(kk(k)); if (c && c.d) { H.data[k] = c.d; H.at = Math.max(H.at, c.t || 0); } } catch (e) {} } }
  draw(); loadAll();
};
})();
