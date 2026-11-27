/* TehsilOS 12.0.0 — tehsil status home and the SVAMITVA module, on top of the Farmer ID app.
 * Loaded after app.html's own script; uses its helpers (api, go, render, VIEWS, openSheet, setHeader, $, $$, esc, on, toast).
 */
"use strict";
(function () {
const V12 = '12.0.0';
const C = { ink: '#1E2226', mute: '#5B6168', soft: '#F7F4F0', line: '#ECE6DF', terra: '#9A3F1C', green: '#1F6B42', greenBg: '#E3F2E9', amber: '#8A5A0B', amberBg: '#FBEFD9' };

/* ---------- look ---------- */
const css = document.createElement('style');
css.textContent = `
.t12{font-family:Nunito,system-ui,sans-serif;color:${C.ink};padding:14px 14px 110px;max-width:760px;margin:0 auto}
.t12 h1{font-size:22px;font-weight:900;margin:2px 0 2px}.t12 .sub{font-size:13px;color:${C.mute};margin:0 0 10px}
.t12 .lead{font-size:15px;line-height:1.45;margin:0 0 12px}
.t12 .cd{background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 1px 3px rgba(30,34,38,.08);margin:0 0 12px}
.t12 .cd h3{font-size:15px;font-weight:800;margin:0 0 8px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.t12 .big{font-size:32px;font-weight:900;line-height:1.1}.t12 .lbl{font-size:12.5px;color:${C.mute}}
.t12 .g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0 0 12px}
.t12 .g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.t12 .k{background:#fff;border-radius:16px;padding:12px 14px;box-shadow:0 1px 3px rgba(30,34,38,.08)}
.t12 .k b{display:block;font-size:26px;font-weight:900}.t12 .k span{font-size:12px;color:${C.mute}}
.t12 .pill{font-size:12px;font-weight:800;padding:3px 9px;border-radius:20px;white-space:nowrap}
.t12 .ok{color:${C.green};background:${C.greenBg}}.t12 .wt{color:${C.amber};background:${C.amberBg}}.t12 .ur{color:${C.terra};background:#F6E3DA}.t12 .nu{color:${C.mute};background:#F0EBE5}
.t12 .bar{height:9px;background:#EFE9E3;border-radius:6px;overflow:hidden;display:flex}.t12 .bar i{display:block;height:9px;background:#2E7D4F}.t12 .bar i.p{background:#E0A33A}
.t12 .st{display:flex;align-items:center;gap:10px;font-size:13px;margin:7px 0}.t12 .st span{width:150px;flex:none}.t12 .st .bar{flex:1}.t12 .st b{width:28px;text-align:right}
.t12 .row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-top:1px solid ${C.line};text-decoration:none;color:inherit;width:100%;background:none;border-left:0;border-right:0;border-bottom:0;font:inherit;text-align:left;cursor:pointer}
.t12 .row:first-of-type{border-top:0}.t12 .row small{display:block;color:${C.mute};font-size:12px;font-weight:600}
.t12 .chips{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px}.t12 .chips button{font:inherit;font-size:12.5px;font-weight:800;padding:7px 12px;border-radius:16px;border:1px solid #E4DDD5;background:#fff;color:${C.ink};cursor:pointer}
.t12 .chips button.on{background:${C.ink};color:#fff;border-color:${C.ink}}
.t12 .btn12{font:inherit;font-weight:800;font-size:14px;padding:12px 14px;border-radius:14px;border:0;background:${C.terra};color:#fff;cursor:pointer;text-align:center;text-decoration:none;display:inline-block}
.t12 .btn12.gh{background:${C.soft};color:${C.ink};border:1px solid #E4DDD5}.t12 .btn12[disabled]{opacity:.5}
.t12 .acts{display:flex;gap:8px;flex-wrap:wrap}.t12 .acts .btn12{flex:1;min-width:130px}
.t12 .note{font-size:13px;line-height:1.45;border-radius:14px;padding:10px 12px;margin:0 0 12px}
.t12 .tl{display:flex;gap:12px}.t12 .tl .d{display:flex;flex-direction:column;align-items:center}.t12 .tl .d i{width:24px;height:24px;border-radius:12px;font-style:normal;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;background:#E4DDD5;color:${C.mute}}
.t12 .tl .d i.y{background:#2E7D4F;color:#fff}.t12 .tl .d i.n{background:#E0A33A;color:#fff}.t12 .tl .d s{width:2px;height:26px;background:#E4DDD5;text-decoration:none}.t12 .tl .d s.y{background:#2E7D4F}
.t12 .tl p{margin:2px 0 0;font-size:13.5px}.t12 .tl small{display:block;color:${C.mute};font-size:12px}
.t12 table{border-collapse:collapse;width:100%;font-size:13px}.t12 th,.t12 td{border-bottom:1px solid ${C.line};padding:7px 4px;text-align:right}.t12 th:first-child,.t12 td:first-child{text-align:left}
.t12 th{font-size:11.5px;color:${C.mute};font-weight:800}
.t12 .sw{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid ${C.line};gap:10px}.t12 .sw:first-of-type{border-top:0}
.t12 .sw input{width:24px;height:24px;accent-color:#2E7D4F}
.t12 .hint{font-size:12px;color:${C.mute};line-height:1.4}
.s12 label{display:block;font-weight:800;font-size:13px;margin:12px 0 6px}.s12 input[type=text],.s12 input[type=date],.s12 input[type=number],.s12 textarea,.s12 select{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:12px 14px;border:1px solid #D8D0C7;border-radius:12px;background:#FBF9F6}
.s12 .ck{display:flex;gap:10px;align-items:center;font-weight:600;margin:8px 0}.s12 .ck input{width:20px;height:20px;accent-color:${C.terra}}
.s12 .nx{font-size:12.5px;background:${C.greenBg};border-radius:12px;padding:10px 12px;margin:12px 0;line-height:1.4}
`;
document.head.appendChild(css);
P10.map = 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14';
P10.os = 'M4 5h16v14H4zM4 9h16M8 13h3M8 16h6';

/* ---------- helpers ---------- */
const N = x => Number(x || 0).toLocaleString('en-IN');
const pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '–';
const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const todayL = () => { const n = new Date(Date.now() + 5.5 * 3600e3); return n.toISOString().slice(0, 10); };
const T12 = () => (S.boot && S.boot.tos12) || {};
const svmOn = () => !!(T12().svm && T12().svm.view);
const office = () => { const r = role(); return ['ADMIN', 'DA', 'NT'].indexOf(r) >= 0; };
/* 12.9.0: the role on the TehsilOS shell (the main NT only; BCG, OQ and GQ logins too) */
const rk29 = () => { if (!S.boot || S.boot.fid25) return ''; if (S.boot.rk29 != null) return S.boot.rk29; const u = me() || {}, d = String(u.designation || '');
  if (u.role === 'ADMIN') return 'teh'; if (u.role === 'NT') return S.boot.m28 && !S.boot.m28.ntMain ? '' : 'nt'; if (u.role === 'DA' || /\bBCG\b/i.test(d)) return 'da';
  if (/\bOQ\b|office\s*qanungo/i.test(d)) return 'oq'; if (/\bGQ\b|girdawar/i.test(d)) return 'gq'; if (/patwari/i.test(d)) return 'ph'; return u.role === 'COMP' ? 'comp' : ''; };
const shell = () => { const k = rk29(); return (k === 'teh' || k === 'nt' || k === 'da') ? svmOn() && (office() || k === 'da') : (k === 'oq' || k === 'gq') && !!(S.boot && S.boot.tos12); };
const wideOn = t => { setHeader(t); document.body.classList.add('wide'); };
const view = () => $('#view');
const loading = t => { view().innerHTML = `<div class="t12"><p class="sub">${esc(t || 'Loading…')}</p><div class="cd" style="height:90px"></div><div class="cd" style="height:140px"></div></div>`; };
async function svmLoad(force) {
  if (!force && S.svm12 && Date.now() - (S.svm12At || 0) < 60000) return S.svm12;
  try { S.svm12 = await api('svm12Get', {}, 60000); S.svm12At = Date.now(); try { await kput('svm12', S.svm12); } catch (e) {} }
  catch (e) { if (!S.svm12) { try { S.svm12 = await kget('svm12'); } catch (x) {} } if (!S.svm12) throw e; toast('Offline – showing the last saved figures', 'info'); }
  return S.svm12;
}
const STEPS = ['Map 1.0 received', 'Map 1.0 verified & submitted to SOI', 'Map 2.0 received from SOI', 'Map 2.0 verified & submitted to SOI', 'Final data received from SOI'];
const STEPK = ['m1_recd', 'm1_sub', 'm2_recd', 'm2_sub', 'fd_recd'];
const stageText = m => !m.in_base ? 'Re-drone flying required' : m.done ? 'Complete – cards generated' : m.stage === 5 ? 'Final data received – cards to be generated' : 'Waiting: ' + STEPS[m.stage];
const withPill = m => m.done ? '<span class="pill ok">Done</span>' : `<span class="pill ${m.with === 'SOI' ? 'wt' : 'ur'}">${esc(m.with)}${m.days != null ? ' · ' + m.days + ' d' : ''}</span>`;
const vName = (D, vid) => (D.villages.find(v => v.village_id === vid) || {}).name || vid;
async function copyText(t) { try { await navigator.clipboard.writeText(t); toast('Copied ✓'); } catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); toast('Copied ✓'); } catch (x) { fail('Could not copy.'); } a.remove(); } }
const back12 = (name, args) => { closeAllSheets(); go(name, args || {}); };

/* ---------- needs you (SVAMITVA part) ---------- */
function needs(D) {
  const out = [], t = D.totals, adm = D.access.admin;
  const soi = D.maps.filter(m => m.in_base && m.with === 'SOI'), stale = soi.filter(m => !m.last_follow || m.last_follow.slice(0, 10) < addD(todayL(), -15));
  if (stale.length && (adm || D.access.edit)) out.push({ k: 'SVAMITVA · SIGN', t: `SOI reminder – ${stale.length} map${stale.length > 1 ? 's' : ''} with no follow-up in 15 days`, a: ['svmr12', { soi: 1 }] });
  const th = D.maps.filter(m => m.in_base && m.with === 'Tehsil' && !m.done);
  if (th.length) out.push({ k: 'SVAMITVA · TEHSIL', t: `${th.length} map${th.length > 1 ? 's' : ''} waiting on the Tehsil (verify / submit / generate)`, a: ['svm12', { f: 'tehsil' }] });
  const age = D.cards_at ? Math.round((new Date(todayL()) - new Date(D.cards_at.slice(0, 10))) / 864e5) : 99;
  if (adm && age > 7) out.push({ k: 'SVAMITVA · UPLOAD', t: 'Upload the Revenue Plus card page' + (D.cards_at ? ` (last ${dmy(D.cards_at)})` : ''), a: ['svmc12', {}] });
  if (D.record && D.record.generated && D.record.generated !== t.cards) out.push({ k: 'SVAMITVA · CHECK', t: `Revenue Plus shows ${t.cards} cards; the Tehsil record says ${D.record.generated}. OQ to reconcile.`, a: ['svmc12', {}] });
  if (t.undist > 0) out.push({ k: 'SVAMITVA · DISTRIBUTE', t: `${t.undist} generated card${t.undist > 1 ? 's' : ''} not yet distributed`, a: ['svmc12', { tab: 'dist' }] });
  return out;
}
const addD = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

/* ---------- 1. Home: tehsil status ---------- */
VIEWS.tos12 = async function () {
  wideOn(''); loading('Tehsil status…');
  const u = me() || {}, h = Number(new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(11, 13));
  const [D, F] = await Promise.all([svmOn() ? svmLoad().catch(() => null) : Promise.resolve(null), api('home82', {}, 45000).catch(() => null)]);
  if (current().name !== 'tos12') return;
  const kas = F && F.c76 && (F.c76.tehsils || []).find(t => t.tehsil_id === 'T_KASTIGARH');
  const ids = kas && typeof kas.ids === 'number' ? kas.ids : null;
  const N12 = D ? needs(D) : [];
  const sv = D ? D.totals : null;
  const story = [];
  if (ids != null) story.push(`Farmer ID: ${N(ids)} IDs today.`);
  if (sv) story.push(`SVAMITVA: ${N(sv.cards)} of ${N(sv.props)} cards made; ${sv.tehsil ? sv.tehsil + ' maps wait on the Tehsil' : 'nothing pending with the Tehsil'}${sv.soi ? ', ' + sv.soi + ' with SOI' : ''}.`);
  if (N12.length) story.push(`<b>${N12.length} thing${N12.length > 1 ? 's' : ''} need${N12.length > 1 ? '' : 's'} you.</b>`);
  const phs = D ? Array.from(new Set(D.villages.filter(v => v.in_base).map(v => v.ph))).map(p => { const vs = D.villages.filter(v => v.ph === p && v.in_base), pend = vs.reduce((a, v) => a + (v.maps - v.complete), 0); return { p, pend }; }) : [];
  view().innerHTML = `<div class="t12">
    <p class="sub" style="margin:0">TEHSILOS · TEHSIL KASTIGARH</p>
    <h1>${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}${u.name ? ', ' + esc(String(u.name).split(' ')[0]) : ''}.</h1>
    <p class="lead">${story.join(' ') || 'Open a module below.'}</p>
    <button class="cd row" data-go="home" style="display:block;border:0">
      <h3>Farmer ID <span class="pill ok">Live</span></h3>
      ${ids != null ? `<div><span class="big">${N(ids)}</span> <span class="lbl">IDs today · Kastigarh</span></div>` : '<div class="lbl">Hourly progress, sorting, saturation certificates, show-cause notices</div>'}
      <div class="lbl" style="margin-top:6px">Open Today ›</div></button>
    ${D ? `<button class="cd row" data-go="svm12" style="display:block;border:0">
      <h3>SVAMITVA <span class="pill ${sv.tehsil ? 'ur' : sv.soi ? 'wt' : 'ok'}">${sv.tehsil ? 'At Tehsil' : sv.soi ? 'With SOI' : 'Complete'}</span></h3>
      <div><span class="big">${N(sv.cards)}</span> <span class="lbl">of ${N(sv.props)} property cards generated</span></div>
      <div class="bar" style="margin:8px 0 6px"><i style="width:${sv.props ? Math.min(100, 100 * sv.cards / sv.props) : 0}%"></i><i class="p" style="width:${sv.props ? Math.max(0, 100 - 100 * sv.cards / sv.props) : 0}%"></i></div>
      <div class="lbl">${N(sv.pending)} pending · ${sv.soi} maps with SOI · ${sv.tehsil} at Tehsil · ${N(sv.given)} distributed</div></button>` : ''}
    ${N12.length ? `<div class="cd"><h3>Needs you <button class="btn12 gh" data-go="inbox12" style="padding:6px 10px;font-size:12px">All</button></h3>${N12.slice(0, 4).map((n, i) => `<button class="row" data-n="${i}"><span><small>${esc(n.k)}</small>${esc(n.t)}</span><span>›</span></button>`).join('')}</div>` : ''}
    ${phs.length ? `<div class="cd"><h3>Patwar Halqas · SVAMITVA</h3><div class="g3">${phs.map(x => `<div class="k" style="box-shadow:none;background:${C.soft}"><b style="font-size:15px">${esc(String(x.p).replace(/^PH\s*/, ''))}</b><span class="${x.pend ? '' : ''}" style="color:${x.pend ? C.amber : C.green};font-weight:800">${x.pend ? x.pend + ' maps pending' : 'Complete ✓'}</span></div>`).join('')}</div></div>` : ''}
    <div class="cd"><h3>More</h3>
      <button class="row" data-go="camps10"><span>Camps<small>Daily camps and deployment</small></span><span>›</span></button>
      <button class="row" data-go="ppl83"><span>People<small>Staff, logins, villages</small></span><span>›</span></button>
      ${role() === 'ADMIN' ? `<button class="row" data-go="mast12"><span>Settings &amp; masters<small>Villages, halqas, card prefixes, modules, Assar</small></span><span>›</span></button>
      <button class="row" data-go="feat12"><span>Tehsil Assar<small>Archive / unarchive features</small></span><span>›</span></button>` : ''}
      <button class="row" data-go="set8"><span>My settings<small>PIN, text size, language</small></span><span>›</span></button></div>
    <p class="hint" style="text-align:center">TehsilOS ${V12}</p></div>`;
  on(view(), '[data-go]', 'click', b => { const n = b.dataset.go; if (n === 'home') { NAV.stack = [{ name: 'home', args: {} }]; history.replaceState({}, ''); render(); } else go(n, {}); });
  on(view(), '[data-n]', 'click', b => { const n = N12[Number(b.dataset.n)]; go(n.a[0], n.a[1]); });
};

/* ---------- 9. Needs you ---------- */
VIEWS.inbox12 = async function () {
  wideOn('Needs you'); loading();
  let D = null; if (svmOn()) D = await svmLoad();
  const L = D ? needs(D) : [];
  view().innerHTML = `<div class="t12"><h1>Needs you</h1><p class="sub">Everything waiting, oldest first. Farmer ID approvals stay on its Today screen.</p>
    ${L.map((n, i) => `<div class="cd"><div class="lbl" style="font-weight:800">${esc(n.k)}</div><div style="font-weight:800;font-size:15px;margin:4px 0 10px">${esc(n.t)}</div><button class="btn12" data-n="${i}">Open</button></div>`).join('') || '<div class="cd">Nothing is waiting on you in SVAMITVA. ✓</div>'}
    <button class="cd row" data-fid style="display:block;border:0"><h3>Farmer ID · Today <span>›</span></h3><div class="lbl">Show-cause approvals, replies, uploads and day close</div></button></div>`;
  on(view(), '[data-n]', 'click', b => { const n = L[Number(b.dataset.n)]; go(n.a[0], n.a[1]); });
  on(view(), '[data-fid]', 'click', () => { NAV.stack = [{ name: 'home', args: {} }]; history.replaceState({}, ''); render(); });
};

/* ---------- 2. SVAMITVA overview ---------- */
VIEWS.svm12 = async function (a) {
  wideOn('SVAMITVA'); loading('SVAMITVA…');
  const D = await svmLoad(a && a.fresh); if (current().name !== 'svm12') return;
  const t = D.totals, base = t.maps, f = (a && a.f) || '';
  const outside = D.maps.filter(m => !m.in_base);
  const soi2 = D.maps.filter(m => m.in_base && m.stage === 2).length, soi4 = D.maps.filter(m => m.in_base && m.stage === 4).length;
  view().innerHTML = `<div class="t12">
    <p class="sub" style="margin:0">TEHSILOS · SVAMITVA</p><h1>Tehsil ${esc(D.tehsil)}</h1>
    <p class="sub">${base} maps · ${D.villages.filter(v => v.in_base).length} villages · as on ${dmy(D.as_on)} ${esc(D.as_on.slice(11, 16))}</p>
    <div class="g2">
      <div class="k"><b>${N(t.props)}</b><span>Cards that can be generated</span></div>
      <div class="k"><b style="color:${C.green}">${N(t.cards)}</b><span>Generated · ${pct(t.cards, t.props)}</span></div>
      <div class="k"><b style="color:${C.amber}">${N(t.pending)}</b><span>Pending${t.tehsil ? ' · ' + t.tehsil + ' maps at Tehsil' : ' · nil at Tehsil'}</span></div>
      <div class="k"><b>${N(t.given)}</b><span>Distributed · ${pct(t.given, t.cards)}</span></div></div>
    <div class="cd"><h3>Where the ${base} maps stand</h3>
      ${STEPS.map((s, i) => `<div class="st"><span>${i + 1} · ${esc(s.replace(' verified & submitted to SOI', ' to SOI').replace(' from SOI', ''))}</span><div class="bar"><i style="width:${base ? 100 * t.steps[i] / base : 0}%"></i></div><b>${t.steps[i]}</b></div>`).join('')}
      <div class="note ${t.tehsil ? 'ur' : 'wt'}" style="margin:10px 0 0"><b>Waiting on SOI:</b> ${soi2} for Map 2.0 · ${soi4} for final data. <b>At Tehsil: ${t.tehsil || 'nil'}.</b></div></div>
    <div class="cd"><h3>Villages ${D.access.edit ? '<span class="pill nu">Tap to update</span>' : ''}</h3>
      ${D.villages.filter(v => v.in_base).map(v => `<button class="row" data-v="${esc(v.village_id)}"><span><b>${esc(v.name)}</b> <small style="display:inline">· ${esc(v.ph)}</small><small>${v.complete}/${v.maps} maps complete · ${N(v.cards)}/${N(v.props)} cards · ${N(v.given)} given</small></span>${v.complete === v.maps && v.cards >= v.props ? '<span class="pill ok">✓</span>' : `<span class="pill wt">${v.maps - v.complete} maps · ${N(Math.max(0, v.props - v.cards))}</span>`}</button>`).join('')}</div>
    ${f === 'tehsil' ? `<div class="cd"><h3>Waiting on the Tehsil</h3>${D.maps.filter(m => m.in_base && m.with === 'Tehsil' && !m.done).map(m => `<button class="row" data-k="${esc(m.map_id)}"><span>${esc(vName(D, m.village_id))} · Kh ${esc(m.khasra)}<small>${esc(m.next)}</small></span>${withPill(m)}</button>`).join('') || '<p class="hint">Nothing.</p>'}</div>` : ''}
    ${outside.length ? `<div class="cd"><h3>Not yet in the base <span class="pill nu">Only you see this</span></h3><p class="hint">Map 1.0 not received by the Tehsil (re-drone flying by SOI). They join the figures when Map 1.0 is marked received.</p>${outside.map(m => `<button class="row" data-k="${esc(m.map_id)}"><span>${esc(vName(D, m.village_id))} · Kh ${esc(m.khasra)}<small>${esc(m.remarks || 'Re-drone flying required')}</small></span><span class="pill wt">SOI</span></button>`).join('')}</div>` : ''}
    <div class="acts"><button class="btn12" data-go="svmc12">Property cards</button><button class="btn12 gh" data-go="svmr12">Reports</button></div>
    <p class="hint" style="margin-top:12px">Cards generated come from the Revenue Plus page (${D.cards_at ? 'uploaded ' + dmy(D.cards_at) : 'not uploaded yet'}). Totals: Tehsil record, changed only by the OQ or DA.</p></div>`;
  on(view(), '[data-v]', 'click', b => go('svmv12', { vid: b.dataset.v }));
  on(view(), '[data-k]', 'click', b => go('svmk12', { id: b.dataset.k }));
  on(view(), '[data-go]', 'click', b => go(b.dataset.go, {}));
};

/* ---------- 3. Village → khasras ---------- */
VIEWS.svmv12 = async function (a) {
  const D = await svmLoad(); const v = D.villages.find(x => x.village_id === a.vid); if (!v) throw new Error('Village not found.');
  wideOn(v.name);
  const f = a.f || 'all', ms = D.maps.filter(m => m.village_id === v.village_id && m.in_base);
  const pend = ms.filter(m => !m.done), by = k => pend.filter(m => m.stage === k).length;
  const show = f === 'all' ? ms : f === 'pend' ? pend : pend.filter(m => String(m.stage) === f);
  view().innerHTML = `<div class="t12">
    <h1>${esc(v.name)}</h1><p class="sub">${esc(v.ph)}${v.patwari ? ' · Patwari ' + esc(v.patwari) : ''} · ${v.maps} maps</p>
    <div class="note ${pend.length ? 'wt' : 'ok'}">${pend.length ? `<b>${N(Math.max(0, v.props - v.cards))} cards waiting.</b> ${pend.filter(m => m.with === 'Tehsil').length ? pend.filter(m => m.with === 'Tehsil').length + ' maps wait on the Tehsil. ' : 'Nothing pending with the Tehsil. '}${[[2, 'Map 2.0'], [4, 'final data'], [0, 'Map 1.0']].filter(x => by(x[0])).map(x => 'SOI owes ' + x[1] + ' for ' + by(x[0])).join(', ')}.` : '<b>Complete.</b> All maps done.'}</div>
    <div class="g2"><div class="k"><b>${N(v.props)}</b><span>Cards that can be generated</span></div><div class="k"><b>${N(v.cards)}</b><span>Generated (Revenue Plus)</span></div><div class="k"><b>${N(v.given)}</b><span>Distributed</span></div><div class="k"><b>${v.complete}/${v.maps}</b><span>Maps complete</span></div></div>
    <div class="chips">${[['all', 'All ' + ms.length], ['pend', 'Pending ' + pend.length], ['2', 'Map 2.0 · ' + by(2)], ['4', 'Final data · ' + by(4)]].filter(x => x[0] === 'all' || x[0] === 'pend' || by(Number(x[0]))).map(x => `<button data-f="${x[0]}" class="${f === x[0] ? 'on' : ''}">${esc(x[1])}</button>`).join('')}</div>
    <div class="cd">${show.map(m => `<button class="row" data-k="${esc(m.map_id)}"><span><b>Kh ${esc(m.khasra)}</b><small>${m.done ? 'Complete – cards generated' : 'Step ' + (Math.min(m.stage, 4) + 1) + ' of 5 · ' + esc(stageText(m).replace('Waiting: ', ''))}${m.last_follow ? ' · follow-up ' + esc(dmy(m.last_follow.slice(0, 10))) : ''}</small></span>${withPill(m)}</button>`).join('') || '<p class="hint">Nothing here.</p>'}</div>
    <div class="acts">${D.access.edit ? '<button class="btn12" id="vt">Village totals</button>' : ''}<button class="btn12 gh" id="vc">Cards &amp; distribution</button></div></div>`;
  on(view(), '[data-f]', 'click', b => { current().args.f = b.dataset.f; render(); });
  on(view(), '[data-k]', 'click', b => go('svmk12', { id: b.dataset.k }));
  $('#vc').onclick = () => go('svmc12', { vid: v.village_id, tab: 'dist' });
  if ($('#vt')) $('#vt').onclick = () => villTotals(v);
};
function villTotals(v) {
  openSheet(() => ({ html: `<div class="s12"><div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">${esc(v.name)} – village totals</h2>
    <p class="hint">Only the OQ, the Dealing Assistant or the Tehsildar change these. Every change is kept in the history.</p>
    <label for="vp">Total properties – cards that can be generated (all maps)</label><input id="vp" type="number" min="0" value="${v.props}">
    <label for="vg">Cards distributed as per the record</label><input id="vg" type="number" min="0" value="${v.given_rec}">
    <label for="vce">Village completion certificate</label><select id="vce">${['', 'Yes', 'No', 'Not due', 'Under re-look'].map(x => `<option ${x === v.cert ? 'selected' : ''}>${x}</option>`).join('')}</select>
    <label for="vn">Reason for the change</label><input id="vn" type="text" placeholder="e.g. corrected by OQ from SOI final data">
    <button class="btn btn-primary" id="ok" style="margin-top:14px">Save</button></div>`,
    mount: e => { $('#x', e).onclick = () => closeSheet(); $('#ok', e).onclick = () => busy($('#ok', e), 'Saving', async () => {
      await api('svm12Vill', { village_id: v.village_id, props: $('#vp', e).value, given_rec: $('#vg', e).value, cert: $('#vce', e).value, note: $('#vn', e).value });
      S.svm12At = 0; toast('Saved ✓'); closeSheet(() => render()); }); } }));
}

/* ---------- 4. Khasra journey ---------- */
VIEWS.svmk12 = async function (a) {
  const D = await svmLoad(); const m = D.maps.find(x => x.map_id === a.id); if (!m) throw new Error('Khasra not found.');
  wideOn('Kh ' + m.khasra);
  let L = []; try { L = (await api('svm12Log', { map_id: m.map_id })).log; } catch (e) {}
  if (current().name !== 'svmk12') return;
  const st = m.in_base ? m.stage : 0, ed = D.access.edit;
  const dates = [m.dates.m1_recd, m.dates.m1_sub, m.dates.m2_recd, m.dates.m2_sub, m.dates.fd_recd];
  view().innerHTML = `<div class="t12">
    <h1>Khasra ${esc(m.khasra)}</h1><p class="sub">${esc(vName(D, m.village_id))} · abadi map ${withPill(m)}</p>
    <div class="cd"><h3>Journey · ${m.done ? 'complete' : 'step ' + (Math.min(st, 4) + 1) + ' of 5'}</h3>
      ${STEPS.map((s, i) => { const y = m.flags[i], cur = !y && i === st && m.in_base; return `<div class="tl"><div class="d"><i class="${y ? 'y' : cur ? 'n' : ''}">${y ? '✓' : i + 1}</i>${i < 4 ? `<s class="${y ? 'y' : ''}"></s>` : ''}</div><div><p style="font-weight:${cur ? 800 : 700};color:${cur ? C.amber : y ? C.ink : C.mute}">${esc(s)}${cur ? ' – waiting' : ''}</p><small>${y ? (dates[i] ? dmy(dates[i]) : 'date not recorded') + (i === 1 && m.refs.m1 ? ' · ' + esc(m.refs.m1) : '') + (i === 2 && m.refs.m2 ? ' · ' + esc(m.refs.m2) : '') : cur && m.days != null ? m.days + ' days since the last step' : ''}</small></div></div>`; }).join('')}
      <div class="tl"><div class="d"><i class="${m.done ? 'y' : ''}">${m.done ? '✓' : '6'}</i></div><div><p style="color:${m.done ? C.ink : C.mute};font-weight:700">Property cards generated</p><small>${m.done ? 'Done' : 'After the final data'}</small></div></div></div>
    ${m.done ? '' : `<div class="cd" style="border:2px solid #E0A33A"><div class="lbl" style="font-weight:800;color:${C.amber}">NEXT STEP</div><div style="font-size:15px;font-weight:800;margin:2px 0 4px">${esc(m.next)}</div>
      <div class="hint">Who: <b>${esc(m.with)}</b>${m.with === 'SOI' ? ' · Tehsildar sends the reminder, OQ follows up' : ''}</div>
      ${ed ? `<div class="acts" style="margin-top:10px">${st < 5 ? `<button class="btn12" id="mk">${esc(STEPS[st].replace(' verified & submitted to SOI', ' submitted to SOI'))} ✓</button>` : ''}${m.with === 'SOI' ? '<button class="btn12 gh" id="fu">Log SOI follow-up</button>' : ''}</div>` : ''}</div>`}
    <div class="cd"><h3>Remarks ${ed ? '<button class="btn12 gh" id="rm" style="padding:6px 10px;font-size:12px">Edit</button>' : ''}</h3><div class="hint">${esc(m.remarks || '—')}${m.last_follow ? '<br>Last SOI follow-up: ' + esc(m.last_follow) : ''}${m.props ? '<br>Properties in this map: ' + N(m.props) : ''}</div></div>
    <div class="cd"><h3>History</h3>${L.length ? L.slice(0, 15).map(l => `<div class="hint" style="padding:4px 0">${esc(dmy(l.at.slice(0, 10)))} ${esc(l.at.slice(11, 16))} · ${esc(l.by)} · ${esc(l.what)}${l.new && l.what.indexOf('Map') >= 0 ? ' (' + esc(dmy(l.new)) + ')' : ''}${l.note ? ' – ' + esc(l.note) : ''}</div>`).join('') : '<p class="hint">Starting position loaded from the Tehsil sheet of 23.10.2026.</p>'}
      ${ed && m.stage > 0 && !m.done ? '<button class="btn12 gh" id="ud" style="margin-top:8px;font-size:12px;padding:8px 10px">Undo the last step</button>' : ''}</div></div>`;
  if ($('#mk')) $('#mk').onclick = () => stepSheet(m, st);
  if ($('#fu')) $('#fu').onclick = () => noteSheet(m, 'follow');
  if ($('#rm')) $('#rm').onclick = () => noteSheet(m, 'remarks');
  if ($('#ud')) $('#ud').onclick = () => { const i = m.flags.lastIndexOf(true); if (i < 0) return; if (!confirmBox('Undo "' + STEPS[i] + '" for Kh ' + m.khasra + '?')) return;
    busy($('#ud'), 'Undoing', async () => { await api('svm12Step', { map_id: m.map_id, step: STEPK[i], undo: 1 }); S.svm12At = 0; toast('Undone ✓'); render(); }); };
};
const confirmBox = t => { try { return window.confirm(t); } catch (e) { return true; } };
const STEP_HI = ['Map 1.0 aa gaya? Date daalein.', 'Patwari ne jaanch li? SOI ko bheja? Date aur letter no. daalein.', 'Map 2.0 aa gaya? Date aur letter daalein.', 'Map 2.0 jaanch kar SOI ko bheja? Date daalein.', 'SOI se final data aa gaya? Date aur properties ki ginti daalein.'];
const STEP_CK = [['Map 1.0 is for this khasra'], ['Patwari checked it on the ground', 'Corrections (if any) marked on the map'], ['Map 2.0 is for this khasra (not another)', 'Copy handed to the Patwari for ground check'], ['Patwari verified Map 2.0', 'Objections / corrections noted'], ['Final data is for this khasra']];
const STEP_NX = ['Step 2 opens: the Patwari checks Map 1.0, then the OQ submits it to SOI.', 'Step 3 opens: waiting for Map 2.0 from SOI. Days are counted from today.', 'Step 4 opens: the Patwari verifies Map 2.0, then the OQ sends it back to SOI.', 'Step 5 opens: waiting for the final data from SOI. Days are counted from today.', 'Cards can now be generated. Upload the Revenue Plus page after generation.'];
function stepSheet(m, i) {
  openSheet(() => ({ html: `<div class="s12"><div class="snav"><button id="x">Close</button><span></span><span></span></div>
    <p class="hint" style="font-weight:800;margin:0">KH ${esc(m.khasra)} · STEP ${i + 1}</p><h2 class="nm">${esc(STEPS[i])}</h2><p class="hint">${esc(STEP_HI[i])}</p>
    <label for="sd">Date</label><input id="sd" type="date" value="${todayL()}" max="${todayL()}">
    ${i === 1 || i === 2 ? `<label for="sr">${i === 1 ? 'Letter No. & date sent to SOI' : 'SOI letter / e-mail reference'} (optional)</label><input id="sr" type="text" placeholder="e.g. TK/SVM/2026/…">` : ''}
    ${i === 4 ? '<label for="sp">Properties in the final data of this khasra (optional)</label><input id="sp" type="number" min="0" placeholder="e.g. 12">' : ''}
    <div style="margin-top:10px">${STEP_CK[i].map((c, j) => `<label class="ck"><input type="checkbox" data-c="${j}"> ${esc(c)}</label>`).join('')}</div>
    <div class="nx"><b>What happens next:</b> ${esc(STEP_NX[i])}</div>
    <button class="btn btn-primary" id="ok">Save · step ${i + 1} done</button><p class="hint" style="text-align:center">Saved in your name and kept in the khasra history.</p></div>`,
    mount: e => { $('#x', e).onclick = () => closeSheet(); $('#ok', e).onclick = () => {
      if ($$('[data-c]', e).some(c => !c.checked)) return fail('Tick the checks first.');
      busy($('#ok', e), 'Saving', async () => { await api('svm12Step', { map_id: m.map_id, step: STEPK[i], on: $('#sd', e).value, ref: $('#sr', e) ? $('#sr', e).value : '', props: $('#sp', e) ? $('#sp', e).value : '' });
        S.svm12At = 0; toast('Saved ✓ step ' + (i + 1) + ' done'); closeSheet(() => render()); }); }; } }));
}
function noteSheet(m, k) {
  openSheet(() => ({ html: `<div class="s12"><div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">${k === 'follow' ? 'SOI follow-up' : 'Remarks'} · Kh ${esc(m.khasra)}</h2>
    ${k === 'follow' ? '<label for="nt">Letter No. / call / e-mail and what SOI said</label><input id="nt" type="text" placeholder="e.g. Letter TK/123 dated today; SOI promised next week">' : `<label for="nt">Remarks</label><textarea id="nt" rows="3">${esc(m.remarks)}</textarea><label for="np">Properties in this map (optional)</label><input id="np" type="number" min="0" value="${esc(m.props)}">`}
    <button class="btn btn-primary" id="ok" style="margin-top:14px">Save</button></div>`,
    mount: e => { $('#x', e).onclick = () => closeSheet(); $('#ok', e).onclick = () => busy($('#ok', e), 'Saving', async () => {
      const p = { map_id: m.map_id }; if (k === 'follow') { if (!$('#nt', e).value.trim()) throw new Error('Write the follow-up.'); p.follow = $('#nt', e).value.trim(); } else { p.remarks = $('#nt', e).value; p.props = $('#np', e).value; }
      await api('svm12Note', p); S.svm12At = 0; toast('Saved ✓'); closeSheet(() => render()); }); } }));
}

/* ---------- 6. Cards & distribution ---------- */
function parseRP(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html'), out = [];
  doc.querySelectorAll('table').forEach(tb => {
    const head = Array.from(tb.querySelectorAll('tr')).find(r => /card\s*no/i.test(r.textContent)); if (!head) return;
    const hs = Array.from(head.children).map(c => c.textContent.trim().toLowerCase());
    const ix = k => hs.findIndex(h => h.indexOf(k) >= 0), ic = ix('card'), io = ix('owner'), ip = ix('property');
    tb.querySelectorAll('tr').forEach(r => { const c = Array.from(r.children).map(x => x.textContent.replace(/\s+/g, ' ').trim());
      const no = (c[ic >= 0 ? ic : 0] || '').replace(/\s/g, ''); if (!/^\d{8,20}$/.test(no)) return;
      out.push({ card_no: no, owner: c[io >= 0 ? io : 1] || '', kind: c[ip >= 0 ? ip : 3] || '' }); }); // mobile numbers are never read
  });
  return out;
}
VIEWS.svmc12 = async function (a) {
  wideOn('Property cards'); loading();
  const D = await svmLoad(); const tab = a.tab || 'up', vid = a.vid || '';
  let cards = []; if (tab === 'dist') { try { cards = (await api('svm12CardList', { village_id: vid }, 60000)).cards; } catch (e) { fail(e.message); } }
  if (current().name !== 'svmc12') return;
  const canUp = D.access.admin || (T12().oq) || role() === 'DA', ed = D.access.edit, rec = D.record || {};
  const vs = D.villages.filter(v => v.in_base);
  const fl = a.fl || 'not', shown = cards.filter(c => fl === 'all' ? true : fl === 'not' ? !c.given : fl === 'given' ? c.given : c.kind === 'Common');
  view().innerHTML = `<div class="t12"><h1>Property cards</h1><p class="sub">From the Revenue Plus "Property Card View" page${D.cards_at ? ' · uploaded ' + dmy(D.cards_at) + (D.cards_by ? ' by ' + esc(D.cards_by) : '') : ''}</p>
    <div class="chips"><button data-t="up" class="${tab === 'up' ? 'on' : ''}">Generated</button><button data-t="dist" class="${tab === 'dist' ? 'on' : ''}">Distribution</button></div>
    ${tab === 'up' ? `<div class="cd"><h3>Generated, village-wise ${canUp ? '<label class="btn12" style="padding:7px 12px;font-size:13px">Upload page<input id="rp" type="file" accept=".htm,.html,text/html" hidden></label>' : ''}</h3>
      <table><tr><th>Village</th><th>Can be</th><th>Generated</th><th>Pending</th><th>Given</th></tr>${vs.map(v => `<tr><td>${esc(v.name)}</td><td>${N(v.props)}</td><td>${N(v.cards)}</td><td>${N(Math.max(0, v.props - v.cards))}</td><td>${N(v.given)}</td></tr>`).join('')}
      <tr><th>Total</th><th>${N(D.totals.props)}</th><th>${N(D.totals.cards)}</th><th>${N(D.totals.pending)}</th><th>${N(D.totals.given)}</th></tr></table>
      ${rec.generated && rec.generated !== D.totals.cards ? `<div class="note wt" style="margin:10px 0 0"><b>Check:</b> Revenue Plus shows ${N(D.totals.cards)} cards; the Tehsil record of ${dmy(rec.as_on)} says ${N(rec.generated)}. The OQ reconciles; Revenue Plus is used in reports.</div>` : ''}
      <p class="hint" style="margin-top:10px">How: open Revenue Plus → Property Card View → list all cards → save the page (Ctrl+S / Share → Save page) → upload it here. Mobile numbers on the page are not read or kept.</p></div>` :
    `<div class="chips">${['', ...vs.map(v => v.village_id)].map(x => `<button data-v="${x}" class="${vid === x ? 'on' : ''}">${x ? esc(vName(D, x)) : 'All villages'}</button>`).join('')}</div>
     <div class="cd"><h3>Distribution ${vid ? '· ' + esc(vName(D, vid)) : ''}<span class="pill ${D.totals.undist ? 'wt' : 'ok'}">${N(vid ? (vs.find(v => v.village_id === vid) || {}).given : D.totals.given)} given</span></h3>
      <div class="chips">${[['not', 'Not marked · ' + cards.filter(c => !c.given).length], ['given', 'Marked given · ' + cards.filter(c => c.given).length], ['common', 'Common · ' + cards.filter(c => c.kind === 'Common').length], ['all', 'All · ' + cards.length]].map(x => `<button data-fl="${x[0]}" class="${fl === x[0] ? 'on' : ''}">${esc(x[1])}</button>`).join('')}</div>
      ${shown.slice(0, 120).map(c => `<div class="row"><span><b>${esc(c.owner || '—')}</b><small>${esc(c.card_no)} · ${esc(c.kind)} · ${esc(vName(D, c.village_id))}${c.map_id ? ' · Kh ' + esc((D.maps.find(m => m.map_id === c.map_id) || {}).khasra || '') : ''}</small></span>${c.given ? `<span class="pill ok">Given ${esc(dmy(c.given_on))}</span>` : ed ? `<button class="btn12" data-g="${esc(c.card_no)}" style="padding:8px 12px;font-size:12px">Mark given</button>` : '<span class="pill nu">Not marked</span>'}</div>`).join('') || '<p class="hint">No cards here.</p>'}
      ${shown.length > 120 ? `<p class="hint">Showing 120 of ${shown.length}. Choose a village.</p>` : ''}
      <p class="hint" style="margin-top:8px">The distributed figure is the higher of the Tehsil record and the cards marked here, so marking starts adding once it passes the record.</p></div>`}</div>`;
  on(view(), '[data-t]', 'click', b => { Object.assign(current().args, { tab: b.dataset.t }); render(); });
  on(view(), '[data-v]', 'click', b => { Object.assign(current().args, { vid: b.dataset.v }); render(); });
  on(view(), '[data-fl]', 'click', b => { Object.assign(current().args, { fl: b.dataset.fl }); render(); });
  on(view(), '[data-g]', 'click', b => giveSheet(D, cards.find(c => c.card_no === b.dataset.g)));
  const f = $('#rp'); if (f) f.onchange = async () => { const file = f.files[0]; if (!file) return; try {
    const rows = parseRP(await file.text()); if (!rows.length) throw new Error('No property cards found in this file. Save the full "Property Card View" page and try again.');
    let r; try { r = await api('svm12Cards', { rows }, 90000); } catch (e) { const m = String(e.message || ''); if (m.indexOf('PARTIAL12|') !== 0) throw e;
      if (!confirmBox(m.slice(10) + '\n\nUpload anyway? Cards not on this page will be marked as no longer listed.')) return; r = await api('svm12Cards', { rows, force: 1 }, 90000); }
    S.svm12At = 0;
    toast(`${N(r.total)} cards read ✓ ${r.added} new${r.gone ? ', ' + r.gone + ' no longer listed' : ''}${r.unknown.length ? ' · unknown prefix ' + r.unknown.join(', ') : ''}`, 'ok', 7000); render(); } catch (e) { fail(e.message); } };
};
function giveSheet(D, c) {
  if (!c) return; const ms = D.maps.filter(m => m.village_id === c.village_id);
  openSheet(() => ({ html: `<div class="s12"><div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">Card handed over</h2><p class="hint">${esc(c.owner)} · ${esc(c.card_no)} · ${esc(c.kind)}</p>
    <label for="gd">Date given</label><input id="gd" type="date" value="${todayL()}" max="${todayL()}">
    <label for="gt">Received by (name)</label><input id="gt" type="text" value="${esc(c.kind === 'Common' ? '' : c.owner)}">
    <label for="gk">Khasra (optional)</label><select id="gk"><option value="">—</option>${ms.map(m => `<option value="${esc(m.map_id)}" ${m.map_id === c.map_id ? 'selected' : ''}>Kh ${esc(m.khasra)}</option>`).join('')}</select>
    <button class="btn btn-primary" id="ok" style="margin-top:14px">Save · given</button></div>`,
    mount: e => { $('#x', e).onclick = () => closeSheet(); $('#ok', e).onclick = () => busy($('#ok', e), 'Saving', async () => {
      await api('svm12Give', { card_no: c.card_no, given: true, on: $('#gd', e).value, to: $('#gt', e).value, map_id: $('#gk', e).value }); S.svm12At = 0; toast('Marked given ✓'); closeSheet(() => render()); }); } }));
}

/* ---------- 7. Reports ---------- */
function dcRow(D) { const t = D.totals; const soi2 = D.maps.filter(m => m.in_base && m.stage === 2), soi4 = D.maps.filter(m => m.in_base && m.stage === 4), th = D.maps.filter(m => m.in_base && m.with === 'Tehsil' && !m.done);
  const vl = ms => Array.from(new Set(ms.map(m => vName(D, m.village_id)))).join(', ');
  const parts = []; if (soi2.length) parts.push(`${soi2.length} maps Map 2.0 awaited from SOI (${vl(soi2)})`); if (soi4.length) parts.push(`${soi4.length} maps final data awaited from SOI though Map 2.0 submitted (${vl(soi4)})`); if (th.length) parts.push(`${th.length} maps pending at Tehsil level (${vl(th)})`);
  return { total: t.props, gen: t.cards, dist: t.given, pend: t.pending, reason: parts.length ? parts.join('; ') + '.' + (th.length ? '' : ' Nil pending at Tehsil level.') : 'Nil.' }; }
VIEWS.svmr12 = async function (a) {
  wideOn('Reports'); loading();
  const D = await svmLoad(); if (current().name !== 'svmr12') return; const r = dcRow(D);
  const asOn = dmy(D.as_on) + ', ' + D.as_on.slice(11, 16);
  view().innerHTML = `<div class="t12"><h1>Reports</h1><p class="sub">SVAMITVA · Tehsil ${esc(D.tehsil)} · figures come only from the app</p>
    <div class="cd"><div class="lbl" style="font-weight:800">DC OFFICE ROW · AS ON ${esc(asOn)}</div>
      <table style="margin-top:6px"><tr><td>Total property cards that can be generated</td><td><b>${N(r.total)}</b></td></tr><tr><td>Cards generated</td><td><b>${N(r.gen)}</b></td></tr><tr><td>Cards distributed</td><td><b>${N(r.dist)}</b></td></tr><tr><td>Cards pending generation</td><td><b>${N(r.pend)}</b></td></tr></table>
      <p class="hint" style="margin:8px 0"><b>Reason:</b> ${esc(r.reason)}</p>
      <div class="acts"><button class="btn12" id="cp">Copy for DC sheet</button><button class="btn12 gh" id="xl">Excel</button><button class="btn12 gh" id="pd">PDF</button></div></div>
    <div class="cd">
      <button class="row" id="rv"><span>Review PDF (portrait)<small>Glance · steps · PH · village · khasra pendency · distribution</small></span><span>›</span></button>
      ${D.access.edit ? '<button class="row" id="sl"><span>SOI reminder letter (.docx)<small>Khasras pending with SOI · number left blank</small></span><span>›</span></button>' : ''}
      <button class="row" id="wa"><span>WhatsApp summary<small>Plain text, ready to copy</small></span><span>›</span></button>
      <button class="row" id="lg"><span>Change log<small>Who changed which figure, and when</small></span><span>›</span></button></div></div>`;
  $('#cp').onclick = () => copyText(`SVAMITVA – Tehsil ${D.tehsil} (as on ${asOn})\nTotal property cards that can be generated: ${r.total}\nProperty cards generated: ${r.gen}\nProperty cards distributed: ${r.dist}\nProperty cards pending: ${r.pend}\nReason of pendency: ${r.reason}`);
  $('#xl').onclick = () => busy($('#xl'), 'Making', async () => { await loadXLSX(); const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['SVAMITVA – Tehsil ' + D.tehsil + ' – as on ' + asOn], [], ['Tehsil', 'Total properties (cards that can be generated)', 'Cards generated', 'Cards distributed', 'Cards pending', 'Reason of pendency'], [D.tehsil, r.total, r.gen, r.dist, r.pend, r.reason]]), 'DC row');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['PH', 'Village', 'Maps', 'Map 1.0 recd', 'Map 1.0 to SOI', 'Map 2.0 recd', 'Map 2.0 to SOI', 'Final data', 'Cards can be generated', 'Generated', 'Pending', 'Distributed']].concat(D.villages.filter(v => v.in_base).map(v => [v.ph, v.name, v.maps].concat(v.steps, [v.props, v.cards, Math.max(0, v.props - v.cards), v.given])))), 'Village-wise');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Village', 'Khasra', 'Pending at step', 'Pending with', 'Next step', 'Last SOI follow-up']].concat(D.maps.filter(m => m.in_base && !m.done).map(m => [vName(D, m.village_id), m.khasra, stageText(m), m.with, m.next, m.last_follow]))), 'Pending khasras');
    dlXlsx(wb, `SVAMITVA – ${D.tehsil} – ${dmy(D.as_on)}.xlsx`); });
  $('#pd').onclick = () => busy($('#pd'), 'Making', () => reviewPDF(D, true));
  $('#rv').onclick = () => busy($('#rv'), 'Making', () => reviewPDF(D, false));
  if ($('#sl')) $('#sl').onclick = () => soiLetter(D);
  $('#wa').onclick = () => { const t = D.totals, soi = D.maps.filter(m => m.in_base && m.with === 'SOI');
    copyText(`*SVAMITVA – Tehsil ${D.tehsil}* (${asOn})\nProperty cards: *${N(t.cards)} of ${N(t.props)}* generated (${pct(t.cards, t.props)}); ${N(t.given)} distributed.\nPending: ${N(t.pending)} cards – ${soi.length} maps with SOI${t.tehsil ? ', ' + t.tehsil + ' at Tehsil' : '; nil at Tehsil'}.\n${r.reason}`); };
  $('#lg').onclick = () => go('svml12', {});
  if (a && a.soi && $('#sl')) setTimeout(() => $('#sl').click(), 300);
};
VIEWS.svml12 = async function () {
  wideOn('Change log'); loading(); const L = (await api('svm12Log', {})).log; const D = await svmLoad();
  view().innerHTML = `<div class="t12"><h1>Change log</h1><p class="sub">Last 200 changes in SVAMITVA</p><div class="cd">${L.map(l => `<div class="row" style="cursor:default"><span>${esc(l.what)}${l.map_id ? ' · ' + esc(vName(D, (D.maps.find(m => m.map_id === l.map_id) || {}).village_id)) + ' Kh ' + esc((D.maps.find(m => m.map_id === l.map_id) || {}).khasra || '') : ''}${l.card_no ? ' · card ' + esc(l.card_no) : ''}<small>${esc(dmy(l.at.slice(0, 10)))} ${esc(l.at.slice(11, 16))} · ${esc(l.by)}${l.old || l.new ? ' · ' + esc(l.old || '—') + ' → ' + esc(l.new || '—') : ''}${l.note ? ' · ' + esc(l.note) : ''}</small></span></div>`).join('') || '<p class="hint">No changes yet.</p>'}</div></div>`;
};
async function reviewPDF(D, rowOnly) {
  await loadPDF(); const doc = new jspdf.jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }), W = 210, t = D.totals, r = dcRow(D), asOn = dmy(D.as_on) + ' ' + D.as_on.slice(11, 16), tx = pdfText;
  const _at = doc.autoTable.bind(doc); doc.autoTable = o => _at(Object.assign({}, o, { head: (o.head || []).map(r => r.map(c => typeof c === 'string' ? tx(c) : c)), body: (o.body || []).map(r => r.map(c => typeof c === 'string' ? tx(c) : c)) }));
  const head = [31, 56, 100], sty = { font: 'helvetica', fontSize: 10, cellPadding: 1.8 }, hs = { fillColor: head, textColor: 255, fontStyle: 'bold' };
  const title = (s, y) => { doc.setFillColor(47, 85, 151); doc.rect(12, y, W - 24, 7, 'F'); doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11.5); doc.text(tx(s), 14, y + 5); doc.setTextColor(0); return y + 10; };
  doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.setTextColor(...head); doc.text(tx('SVAMITVA – Tehsil ' + D.tehsil), 12, 16); doc.setTextColor(80); doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text(tx(`Data as on ${asOn} · ${t.maps} abadi maps (Map 1.0 received by the Tehsil) · TehsilOS`), 12, 22); doc.setTextColor(0);
  let y = title('1. Position at a glance', 27);
  doc.autoTable({ startY: y, theme: 'grid', styles: Object.assign({}, sty, { fontSize: 11 }), headStyles: hs, head: [['Total cards that can be generated', 'Generated', 'Pending', 'Distributed']], body: [[N(t.props), `${N(t.cards)} (${pct(t.cards, t.props)})`, N(t.pending), `${N(t.given)} (${pct(t.given, t.cards)})`]] });
  y = doc.lastAutoTable.finalY + 4; doc.setFontSize(10.5); doc.text(doc.splitTextToSize(tx('Reason of pendency: ' + r.reason), W - 24), 12, y + 3); y += 12;
  if (!rowOnly) {
    y = title('2. Step-wise progress (' + t.maps + ' maps)', y);
    const SOIs = [0, 2, 4];
    doc.autoTable({ startY: y, theme: 'grid', styles: sty, headStyles: hs, head: [['Step', 'Stage', 'Achieved', 'Pending at this step', 'Pending with']],
      body: STEPS.map((s, i) => [i + 1, s, t.steps[i], i ? t.steps[i - 1] - t.steps[i] : t.maps - t.steps[0], (i ? t.steps[i - 1] - t.steps[i] : 0) ? (SOIs.indexOf(i) >= 0 ? 'SOI' : 'Tehsil') : '–']).concat([[6, 'Total property cards that can be generated', N(t.props), '–', '–'], [7, 'Property cards generated', N(t.cards), '–', '–'], [8, 'Property cards pending', N(t.pending), '–', t.pending ? (t.tehsil ? 'SOI / Tehsil' : 'SOI') : '–']]) });
    y = doc.lastAutoTable.finalY + 6; y = title('3. Patwar Halqa-wise', y);
    const phs = Array.from(new Set(D.villages.filter(v => v.in_base).map(v => v.ph))), ph = p => D.villages.filter(v => v.in_base && v.ph === p), sm = (vs, f) => vs.reduce((a, v) => a + f(v), 0);
    doc.autoTable({ startY: y, theme: 'grid', styles: sty, headStyles: hs, head: [['Patwar Halqa', 'Map 1.0 recd', 'Map 1.0 to SOI', 'Map 2.0 recd', 'Map 2.0 to SOI', 'Final data', 'Cards can be', 'Generated', 'Pending', 'Distributed']],
      body: phs.map(p => { const vs = ph(p); return [p].concat([0, 1, 2, 3, 4].map(i => sm(vs, v => v.steps[i])), [sm(vs, v => v.props), sm(vs, v => v.cards), sm(vs, v => Math.max(0, v.props - v.cards)), sm(vs, v => v.given)]); })
        .concat([['Tehsil'].concat(t.steps, [t.props, t.cards, t.pending, t.given])]) });
    doc.addPage(); y = title('4. Village-wise', 14);
    doc.autoTable({ startY: y, theme: 'grid', styles: sty, headStyles: hs, head: [['PH', 'Village', 'Maps', 'M1 recd', 'M1 SOI', 'M2 recd', 'M2 SOI', 'Final', 'Cards can be', 'Gen.', 'Pend.', 'Distr.']],
      body: D.villages.filter(v => v.in_base).map(v => [v.ph, v.name, v.maps].concat(v.steps, [v.props, v.cards, Math.max(0, v.props - v.cards), v.given])) });
    y = doc.lastAutoTable.finalY + 6; y = title('5. Khasra-wise pendency – step and next action', y);
    const P = D.maps.filter(m => m.in_base && !m.done);
    doc.autoTable({ startY: y, theme: 'grid', styles: sty, headStyles: hs, head: [['Village', 'Khasra', 'Pending at step', 'With', 'Next step', 'Last follow-up']],
      body: P.map(m => [vName(D, m.village_id), m.khasra, stageText(m).replace('Waiting: ', ''), m.with, m.next, m.last_follow || '']).map(r => r.map(tx)) });
    y = doc.lastAutoTable.finalY + 6; if (y > 250) { doc.addPage(); y = 14; } y = title('6. Distribution', y);
    doc.autoTable({ startY: y, theme: 'grid', styles: sty, headStyles: hs, head: [['Cards generated', 'Distributed', 'Balance']], body: [[N(t.cards), N(t.given), N(t.undist)]] });
  }
  pageNumbers(doc); deliverPDF(doc, `SVAMITVA ${rowOnly ? 'DC row' : 'review'} – ${D.tehsil} – ${dmy(D.as_on)}.pdf`);
}
function soiLetter(D) {
  const P = D.maps.filter(m => m.in_base && m.with === 'SOI' && !m.done); if (!P.length) return info('Nothing is pending with SOI.');
  const head = D.letter.head.length ? D.letter.head : ['GOVERNMENT OF JAMMU AND KASHMIR', 'OFFICE OF THE TEHSILDAR EXECUTIVE MAGISTRATE 1ST CLASS', 'TEHSIL ' + String(D.tehsil).toUpperCase() + ', DISTRICT DODA'];
  const W = [600, 1700, 1500, 3400, 2700], cell = (s, i, b) => C81(P81(b ? [[String(s), { b: true }]] : String(s), { jc: 'left', after: 0, sz: 20 }), W[i], b ? { shade: 'E7E6E6' } : {});
  const rows = [{ head: true, cells: ['S.No', 'Village', 'Khasra (abadi)', 'Pending with SOI', 'Our step done on'].map((h, i) => cell(h, i, true)) }]
    .concat(P.map((m, i) => ({ cells: [String(i + 1), vName(D, m.village_id), m.khasra, m.stage === 2 ? 'Map 2.0 (Map 1.0 submitted)' : m.stage === 4 ? 'Final data (Map 2.0 submitted)' : 'Re-drone flying / Map 1.0', dmy(m.stage === 2 ? m.dates.m1_sub : m.dates.m2_sub) || '—'].map((c, j) => cell(c, j)) })));
  const x = [lh93(head), P81('No. ________________                                        Dated: ________________', { jc: 'left', after: 160 }),
    P81([['To', { b: true }]], { jc: 'left', after: 20 }), P81('The Officer In-charge,', { ind: 600, jc: 'left', after: 0 }), P81('Survey of India (SVAMITVA),', { ind: 600, jc: 'left', after: 0 }), P81('________________.', { ind: 600, jc: 'left', after: 140 }),
    P81([['Subject: ', { b: true }], `Release of pending Map 2.0 / final data under SVAMITVA scheme – Tehsil ${D.tehsil}, District Doda.`], { ind: 1100, hang: 1100, after: 140 }),
    P81('Sir,', { jc: 'left' }),
    P81(`The Tehsil has completed its part of the work for the abadi maps of Tehsil ${D.tehsil}. Generation and distribution of property cards for the following abadi khasras is held up as the maps / data shown against them are awaited from your office:`),
    T81(rows, W), P81('', { after: 60 }),
    P81('It is requested that the pending Map 2.0 / final data may kindly be released at the earliest so that property cards can be generated and distributed to the owners. The Tehsil shall complete its part within the shortest time on receipt.'),
    P81('Yours faithfully,', { jc: 'right', before: 200, after: 0 }), P81([['Tehsildar', { b: true }]], { jc: 'right', after: 0, before: 360 }), P81(D.tehsil, { jc: 'right', after: 200 }),
    P81('No. ________________                                        Dated: ________________', { jc: 'left', after: 60 }),
    P81([['Copy to the:', { b: true }]], { jc: 'left', after: 40 }), P81('1.  Worthy Deputy Commissioner, Doda for kind information please.', { ind: 600, hang: 360, jc: 'left', after: 20 }),
    P81('2.  Assistant Commissioner Revenue, Doda for kind information.', { ind: 600, hang: 360, jc: 'left', after: 20 }), P81('3.  Office record file.', { ind: 600, hang: 360, jc: 'left', after: 20 })];
  addFile(docx81(x.join(''), { sz: 23 }), `${D.tehsil} – SOI reminder – SVAMITVA – ${dmy(todayL())}.docx`, 'SOI reminder ready ✓ Fill in the number and date, then sign');
}

/* ---------- 10. Settings & masters (Tehsildar) ---------- */
VIEWS.mast12 = async function () {
  wideOn('Settings & masters'); loading();
  const D = svmOn() ? await svmLoad() : null; let H = null; try { H = await api('health12', {}); } catch (e) {}
  if (current().name !== 'mast12') return;
  const pre = D ? D.prefix || {} : {};
  view().innerHTML = `<div class="t12"><h1>Settings &amp; masters</h1><p class="sub">Tehsil Kastigarh · Tehsildar only</p>
    <div class="cd"><h3>Masters</h3>
      <button class="row" data-go="set8"><span>Tehsil, letterhead, villages, halqas<small>In the app's Settings</small></span><span>›</span></button>
      <button class="row" data-go="ppl83"><span>People and logins<small>OQ Adil: designation "Office Qanungo (OQ)" gets SVAMITVA edit rights</small></span><span>›</span></button></div>
    ${D ? `<div class="cd"><h3>Revenue Plus card prefix → village</h3><p class="hint">The first 6 digits of a card number decide its village.</p>
      ${Object.keys(pre).sort().map(p => `<div class="sw"><span><b>${esc(p)}</b></span><select data-p="${esc(p)}" style="font:inherit;padding:8px;border-radius:10px">${D.villages.map(v => `<option value="${esc(v.village_id)}" ${pre[p] === v.village_id ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></div>`).join('')}
      <button class="btn12" id="ps" style="margin-top:10px">Save prefixes</button></div>` : ''}
    <div class="cd"><h3>Modules · Kastigarh</h3><button class="row" data-go="feat12"><span>Module and feature switches<small>SVAMITVA, camp orders (archived), attendance (dropped), Assar</small></span><span>›</span></button></div>
    <div class="cd"><h3>Safety</h3><div class="hint">Version ${esc(H ? H.version : V12)} · database ${esc(H ? H.schema : '')}<br>Daily backup: ${H && H.backup_at ? 'last ' + esc(dmy(H.backup_at.slice(0, 10))) + ' ' + esc(H.backup_at.slice(11, 16)) + ' · last 30 kept in the office Drive' : '<b>not set up yet</b> – run setup12 once in the Apps Script editor'}</div></div></div>`;
  on(view(), '[data-go]', 'click', b => go(b.dataset.go, {}));
  if ($('#ps')) $('#ps').onclick = () => busy($('#ps'), 'Saving', async () => { const m = {}; $$('[data-p]').forEach(s => m[s.dataset.p] = s.value); await api('svm12Prefix', { prefix: m }); S.svm12At = 0; toast('Saved ✓'); });
};

/* ---------- 11. Assar section and feature switches ---------- */
VIEWS.feat12 = async function () {
  wideOn('Feature switches'); loading();
  const R = await api('feat12Get', {}); if (current().name !== 'feat12') return;
  view().innerHTML = `<div class="t12"><h1>Feature switches</h1><p class="sub">Only you see and change these. Each change goes into the Audit log.</p>
    ${R.tehsils.map(t => { const live = t.features.filter(f => f.state !== 'ARCH').length; return `<div class="cd"><h3>Tehsil ${esc(t.name)} <span class="pill nu">${live} live · ${t.features.length - live} archived</span></h3>
      ${t.tehsil_id === 'T_ASSAR' ? `<div class="note" style="background:#E6F1F1;color:#1D4F50">Farmer ID only. Archived features disappear for Assar staff; their data is kept and returns when you unarchive.${t.mode === 'MON' ? ' Assar is in monitoring view.' : ''}</div>` : ''}
      ${t.features.map(f => `<label class="sw"><span>${esc(f.label)}<small class="hint" style="display:block">${f.state === 'ARCH' ? 'Archived' : 'Live'} · ${esc(f.module)}</small></span><input type="checkbox" data-t="${esc(t.tehsil_id)}" data-k="${esc(f.key)}" ${f.state !== 'ARCH' ? 'checked' : ''} aria-label="${esc(f.label)}"></label>`).join('')}</div>`; }).join('')}
    ${R.history.length ? `<div class="cd"><h3>Recent changes</h3>${R.history.map(h => `<div class="hint" style="padding:3px 0">${esc(dmy(String(h.at).slice(0, 10)))} ${esc(String(h.at).slice(11, 16))} · ${esc(h.detail)}</div>`).join('')}</div>` : ''}</div>`;
  on(view(), 'input[data-k]', 'change', (c) => { const st = c.checked ? 'ON' : 'ARCH'; c.disabled = true;
    api('feat12Set', { tehsil_id: c.dataset.t, key: c.dataset.k, state: st }).then(() => { toast(c.checked ? 'Unarchived ✓' : 'Archived ✓'); S.boot.tos12 && S.boot.tos12.feats && S.boot.tos12.feats[c.dataset.t] && (S.boot.tos12.feats[c.dataset.t][c.dataset.k] = st); applyFeats(); render(); })
      .catch(e => { fail(e.message); c.checked = !c.checked; c.disabled = false; }); });
};

/* ---------- help (Hinglish lines for Patwaris and the DA) ---------- */
Object.assign(HELP, {
  svm12: { en: ['SVAMITVA', 'Every abadi map goes through 5 steps: Map 1.0 → submitted → Map 2.0 → submitted → final data. Then cards are generated and distributed.', 'Tap a village to see its khasras. Amber = waiting on SOI, red = waiting on the Tehsil.'], hi: ['SVAMITVA', 'Har abadi map ke 5 kadam hain. Gaon par tap karein, khasra dekhein.', 'Peela = SOI ke paas, laal = Tehsil ke paas.'] },
  svmv12: { en: ['Village', 'Each khasra shows its step and with whom it is pending.', 'Tap a khasra to mark the next step.'], hi: ['Gaon', 'Har khasra ka kadam aur kiske paas pending hai.', 'Agla kadam mark karne ke liye khasra par tap karein.'] },
  svmk12: { en: ['Khasra', 'The journey shows every step with its date.', 'Use the button under Next step when that step is done. Wrong mark? Undo the last step.'], hi: ['Khasra', 'Har kadam ki date yahan dikhti hai.', 'Kaam ho gaya? Next step ka button dabayein. Galti? Undo karein.'] },
  svmc12: { en: ['Property cards', 'Generated cards come from the Revenue Plus page – nobody types them.', 'Distribution: tap Mark given when a card is handed over.'], hi: ['Property cards', 'Banaye gaye cards Revenue Plus se aate hain.', 'Card de diya? "Mark given" dabayein.'] },
  svmr12: ['Reports', 'The DC row, the review PDF, the SOI reminder and the WhatsApp text are made from the same figures.'],
  tos12: ['Home', 'One line per module, then what needs you.', 'Farmer ID opens its Today screen; SVAMITVA opens the maps and cards.']
});

/* ---------- feature switches on the phone ---------- */
function applyFeats() {
  const F = (T12().feats || {}), u = me() || {}, mine = (u.tehsils && u.tehsils.length ? u.tehsils : [u.tehsil_id]).filter(Boolean);
  const tids = role() === 'ADMIN' ? ['T_KASTIGARH'] : mine;
  ['camporders', 'attendance'].forEach(k => document.documentElement.classList.toggle('f12-' + k + '-off', tids.length > 0 && tids.every(t => F[t] && F[t][k] === 'ARCH')));
  if (typeof TASKS10 !== 'undefined') { for (let i = TASKS10.length - 1; i >= 0; i--) { const k = TASKS10[i][1]; if ((k === 'co10' && document.documentElement.classList.contains('f12-camporders-off')) || (k === 'att81' && document.documentElement.classList.contains('f12-attendance-off'))) { S.t12Hidden = S.t12Hidden || []; S.t12Hidden.push(TASKS10.splice(i, 1)[0]); } } }
}

/* ---------- navigation ---------- */
const TABS_ORIG = TABS10.map(x => x.slice());
const TABS_OS = [['tos12', 'Home', 'os'], ['home', 'Farmer ID', 'home'], ['cov10', 'Coverage', 'cov'], ['svm12', 'SVAMITVA', 'map'], ['rep8', 'Reports', 'doc']];
Object.assign(TABOF10, { tos12: 'tos12', inbox12: 'tos12', mast12: 'tos12', feat12: 'tos12', camps10: 'home', plan81: 'home', co10: 'home', ppl83: 'tos12', att81: 'tos12', staff94: 'tos12', users: 'tos12', perf82: 'tos12',
  svm12: 'svm12', svmv12: 'svm12', svmk12: 'svm12', svmc12: 'svm12', svmr12: 'svm12', svml12: 'svm12' });
Object.assign(PWV95, { svm12: 'svm12', svmv12: 'svm12', svmk12: 'svm12', svmc12: 'svm12', svmr12: 'svm12', svml12: 'svm12' });
const _ub12 = updateBnav;
updateBnav = function () {
  const want = shell() ? TABS_OS : TABS_ORIG, sig = want.map(x => x[0]).join(',');
  if (TABS10.map(x => x[0]).join(',') !== sig) { TABS10.length = 0; want.forEach(x => TABS10.push(x.slice())); const n = $('#nav10'); if (n) n.remove(); }
  _ub12();
  const n10 = $('#nav10'); if (n10) { const br = $('.br', n10); const nm = S.boot && S.boot.fid25 ? 'Farmer ID' : 'TehsilOS'; if (br && br.textContent !== nm) br.textContent = nm; }
  const pw = $('#pwn95');
  if (pw && svmOn() && !$('[data-pw="svm12"]', pw)) {
    const b = document.createElement('button'); b.dataset.pw = 'svm12'; b.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${P10.map}"/></svg><span>SVAMITVA</span>`;
    b.onclick = e => { e.stopPropagation(); if (current().name !== 'svm12') { closeAllSheets(); NAV.stack = [{ name: 'home', args: {} }]; go('svm12', {}); } };
    pw.appendChild(b);
  }
  if (pw) { const c = current(); $$('#pwn95 button').forEach(x => { if (x.dataset.pw === 'svm12') x.classList.toggle('on', !!c && PWV95[c.name] === 'svm12'); }); }
};
/* the office opens on the tehsil status home once per session */
const _render12 = render;
render = async function () {
  const c = current();
  if (c && c.name === 'home' && NAV.stack.length === 1 && S.session && S.boot && shell() && !S.t12Landed) { S.t12Landed = 1; try { applyFeats(); } catch (e) {} go('tos12', {}); return; }
  if (S.boot && !S.t12Feats) { S.t12Feats = 1; try { applyFeats(); } catch (e) {} }
  return _render12();
};
setTimeout(async () => { try { if (!S.session || S.practice || !svmOn()) return; const k = 'new120:' + me().user_id; if (await kget(k)) return; await kput(k, 1);
  const L = [['TehsilOS', 'The Farmer ID app is now TehsilOS: one app for the tehsil. Farmer ID works exactly as before.'], ['SVAMITVA', 'Every abadi map, step by step: Map 1.0 → Map 2.0 → final data → cards → distribution. Tap a khasra to mark the next step.'],
    ['Property cards', 'Generated cards come from the Revenue Plus page. Mark each card given when it is handed over.'], ['Reports', 'The DC row, the review PDF, the SOI reminder and the WhatsApp text – all from the same figures.']];
  openSheet(() => ({ html: `<div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">What’s new · TehsilOS ${V12}</h2>${L.map(e => `<div class="nw83"><span>•</span><div><b>${esc(e[0])}</b><small>${esc(e[1])}</small></div></div>`).join('')}<button class="btn btn-primary" id="ok">Got it</button>`,
    mount: e => { $('#x', e).onclick = $('#ok', e).onclick = () => closeSheet(); } })); } catch (e) {} }, 4000);
document.title = 'TehsilOS';
try { const t = $('#title'); if (t && t.textContent === 'Farmer ID') t.textContent = 'TehsilOS'; } catch (e) {}
try { if (typeof current === 'function' && current()) render(); } catch (e) {}
window.TOS12 = { v: V12 };
/* 12.6.0: shared with the new home (ui26.js) */
window.T12X = { svmLoad, needs, svmOn, office, TABS_OS, rk29, shell };
})();
