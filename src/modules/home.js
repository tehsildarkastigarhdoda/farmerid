/* Home for every office role (frozen 27.11): hero · Needs you · tiles · week · villages.
 * Opens on the last saved figures at once, then each card refreshes on its own with its own Retry.
 */
import { $, esc, on, N, ist, today, hm, dmy } from '../core/dom.js';
import { svg, sk, ring } from '../core/ui.js';
import { api } from '../core/api.js';
import { kget, kput } from '../core/store.js';
import { S, me, role, rk, svmOn, mtgWho, certWho, desig, firstName } from '../core/session.js';
import { register, go, reset, current } from '../core/router.js';
import { VERSION } from '../core/config.js';
import { outWho, outNeeds } from './outbox.js';

const addD = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
/** SVAMITVA items that need someone (same rules as 12.0) */
export function svmNeeds(D) {
  const out = [], t = D.totals, adm = D.access && D.access.admin;
  const soi = D.maps.filter(m => m.in_base && m.with === 'SOI'), stale = soi.filter(m => !m.last_follow || m.last_follow.slice(0, 10) < addD(today(), -15));
  if (stale.length && (adm || D.access.edit)) out.push({ k: 'SIGN', t: `SOI reminder – ${stale.length} map${stale.length > 1 ? 's' : ''} with no follow-up in 15 days`, a: ['svmr12', { soi: 1 }] });
  const th = D.maps.filter(m => m.in_base && m.with === 'Tehsil' && !m.done);
  if (th.length) out.push({ k: 'TEHSIL', t: `${th.length} map${th.length > 1 ? 's' : ''} waiting on the Tehsil (verify / submit / generate)`, a: ['svm12', { f: 'tehsil' }] });
  const age = D.cards_at ? Math.round((new Date(today()) - new Date(D.cards_at.slice(0, 10))) / 864e5) : 99;
  if (adm && age > 7) out.push({ k: 'UPLOAD', t: 'Upload the Revenue Plus card page' + (D.cards_at ? ` (last ${dmy(D.cards_at)})` : ''), a: ['svmc12', {}] });
  if (D.record && D.record.generated && D.record.generated !== t.cards) out.push({ k: 'CHECK', t: `Revenue Plus shows ${t.cards} cards; the Tehsil record says ${D.record.generated}. OQ to reconcile.`, a: ['svmc12', {}] });
  if (t.undist > 0) out.push({ k: 'DISTRIBUTE', t: `${t.undist} generated card${t.undist > 1 ? 's' : ''} not yet distributed`, a: ['svmc12', { tab: 'dist' }] });
  return out;
}
const SRC = {
  ins: f => api('ins19', f ? { fresh: 1 } : {}, { timeout: 60000 }),
  day: f => api('day19', f ? { fresh: 1 } : {}, { timeout: 60000 }),
  al: f => api('alerts19', f ? { fresh: 1 } : {}),
  c25: () => api('cert25List', {}),
  m28: () => api('mtg28List', {}),
  h29: () => api('home29', {}),
  out: () => api('out30List', { limit: 120 }),
  fid: () => api('fid30Today', {}, { timeout: 90000 }),
  svm: () => api('svm12Get', {}, { timeout: 60000 }).then(D => ({ totals: D.totals, needs: svmNeeds(D).slice(0, 6) })),
};
const H = { data: {}, err: {}, busy: {}, at: 0, uid: '' };
const kk = k => 'os:home:' + ((me() || {}).user_id || '') + ':' + k;
const desk = () => window.innerWidth >= 1100;
const errRow = (k, what) => `<div class="er26"><span>Couldn't load ${what}.</span><button class="btn s o" data-retry="${k}">Retry</button></div>`;
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function keys() { const K = rk(), sv = svmOn() ? ['svm'] : [], cert = certWho() ? ['c25'] : [], mt = mtgWho() ? ['m28'] : [], ob = outWho() ? ['out'] : [];
  return K === 'gq' ? ['h29'].concat(mt, sv) : K === 'oq' ? ['h29'].concat(mt, ob, sv, cert) : ['ins', 'day', 'al'].concat(mt, ob, sv, cert, K === 'teh' || K === 'nt' ? ['fid'] : []); }
async function fetchOne(k, f) {
  H.busy[k] = 1; paint();
  try { const d = await SRC[k](f); H.data[k] = d; H.err[k] = ''; H.at = Date.now(); kput(kk(k), { t: Date.now(), d }); }
  catch (e) { H.err[k] = e.message || 'Could not load'; }
  H.busy[k] = 0; paint();
}
const loadAll = f => Promise.all(keys().map(k => fetchOne(k, f)));

const totals = ins => (ins.villages || []).reduce((a, v) => { a.total += v.total || 0; a.claimed += v.claimed || 0; a.part += v.part || 0; return a; }, { total: 0, claimed: 0, part: 0 });
const heroG = o => `<div class="cd"><div class="hro">${o.pct != null ? ring(o.pct, 96, 9, '#0E5E3B', '#E8F2EC', Math.round(o.pct * 100) + ' percent') : ''}
  <div class="nm"><div class="lb">${o.label}</div><div class="big">${o.big}</div><div class="of">${o.of || ''}</div></div>
  <div class="acts">${o.b.map((b, i) => `<button class="btn${i ? ' o' : ''}" data-go="${b[0]}" ${b[2] ? `data-args="${esc(JSON.stringify(b[2]))}"` : ''}>${b[1]}</button>`).join('')}</div></div></div>`;
const heroSk = k => `<div class="cd">${H.err[k] ? errRow(k, 'figures') : `${sk(14, '40%')}<div style="height:10px"></div>${sk(46, '55%')}<div style="height:10px"></div>${sk(14, '30%')}`}</div>`;
function hero() {
  const K = rk(), C = H.data.c25, MG = H.data.m28, V = H.data.svm, G = H.data.h29, td = today();
  if (K === 'nt') { if (!C) return heroSk('c25'); const ch = C.rows.filter(r => r.fresh && r.mine).length;
    return heroG({ label: 'Certificates · new Patwari reports for you', big: N(C.fresh || 0), of: ch ? ch + ' changed after your report' : 'Whole tehsil', b: [['c25', 'Open Certificates'], ['m28', 'Meetings']] }); }
  if (K === 'da') { const up = MG && MG.rows ? MG.rows.filter(r => r.date >= td && r.of).sort((a, b) => a.date.localeCompare(b.date))[0] : null;
    if (up) return heroG({ pct: up.got / up.of, label: esc(up.title) + ' · information received', big: up.got + ' of ' + up.of, of: (up.of - up.got) + ' not received · meeting ' + dmy(up.date).slice(0, 5), b: [['m28m', 'Response board', { id: up.mtg_id }], ['m28', 'Meetings']] });
    if (!C) return heroSk('c25'); return heroG({ label: 'Certificates · files ready for scrutiny', big: N(C.fresh || 0), of: 'Patwari and NT reports in', b: [['c25', 'Open Certificates'], ['m28', 'Meetings']] }); }
  if (K === 'oq') { if (!V || !V.totals) return heroSk('svm'); const t = V.totals;
    return heroG({ pct: t.props ? t.cards / t.props : 0, label: 'SVAMITVA · property cards', big: N(t.cards), of: 'of ' + N(t.props) + ' · ' + N(t.pending) + ' pending', b: [['svm12', 'Open SVAMITVA'], ['m28', 'Meetings']] }); }
  if (K === 'gq') { if (!G) return heroSk('h29'); const f = G.fid, made = f.claimed + f.part;
    return heroG({ pct: f.total ? made / f.total : 0, label: 'Farmer ID · ' + esc(G.scope), big: N(made), of: 'of ' + N(f.total) + (G.gain != null ? `<span class="gain">+${N(G.gain)} today</span>` : ''), b: [['home', 'Farmer ID'], ['m28', 'Meetings']] }); }
  const I = H.data.ins, D = H.data.day; if (!I) return heroSk('ins');
  const T = totals(I), made = T.claimed + T.part, tdy = D ? (D.totals.made + D.totals.part) : null, pct = T.total ? made / T.total : 0, big = desk();
  return `<div class="cd"><div class="hro">${ring(pct, big ? 132 : 96, big ? 12 : 9, '#0E5E3B', '#E8F2EC', Math.round(pct * 100) + ' percent of buckets claimed')}
    <div class="nm"><div class="lb">Farmer ID · buckets claimed</div><div class="big">${N(made)}</div><div class="of">of ${N(T.total)}${tdy != null ? `<span class="gain">+${N(tdy)} today</span>` : ''}</div>${D && D.totals.catch ? `<div class="of" style="font-size:12.5px">+${N(D.totals.catch)} older (catch-up from lists not uploaded daily: ${esc((D.villages || []).filter(v => v.catch).map(v => v.name + ' since ' + v.catch_since).join(', '))})</div>` : ''}</div>
    <div class="acts"><button class="btn" data-go="portal">Upload portal files</button><button class="btn o" data-go="day19">Today's report</button></div></div>
    <div class="minis"><button class="mini" data-go="ins19">${ring(T.total ? T.part / T.total : 0, 30, 4, '#B26B00', '#FFF1DC')}<span><b>${N(T.part)}</b><span>Part-claimed</span></span></button>
      <button class="mini" data-go="ins19">${ring(I.ids && I.ids.made ? I.ids.pending / I.ids.made : 0, 30, 4, '#2F5D9E', '#E8EEF7')}<span><b>${N(I.ids ? I.ids.pending : 0)}</b><span>Approval due</span></span></button>
      <button class="mini" data-go="ins19">${ring(T.total ? (T.total - made) / T.total : 0, 30, 4, '#5E6B63', '#EEF0EE')}<span><b>${N(T.total - made)}</b><span>Unclaimed</span></span></button></div></div>`;
}
/** everything that needs this person, across modules */
export function needsList(data) {
  const L = [], C = data.c25, A = data.al, V = data.svm, MG = data.m28;
  if (C && C.rows) { const w = C.who, n = Number(C.fresh) || 0, pl = (k, x) => k + ' ' + x + (k > 1 ? 's' : '');
    const T = { nt: `${pl(n, 'new Patwari report')} for you`, da: `${pl(n, 'file')} ready for scrutiny`, teh: `${pl(n, 'file')} ready for your remark` };
    if (n && T[w]) L.push({ c: 'a', t: T[w], s: 'Certificates', b: 'Open', k: 1, go: ['c25', {}] }); }
  if (A && A.alerts) { const st = A.alerts.filter(x => x.k === 'stall');
    if (st.length > 1) L.push({ c: 'a', t: `${st.length} villages: no new Farmer ID in 2 days`, s: st.map(x => String(x.t).split(':')[0]).join(', '), b: 'View', go: ['day19', {}] });
    A.alerts.filter(x => !(st.length > 1 && x.k === 'stall')).forEach(x => L.push({ c: x.k === 'upload' || x.k === 'check' ? 'a' : '', t: x.t, s: 'Farmer ID', b: 'View', go: x.k === 'upload' ? ['portal', {}] : x.k === 'patwari' ? ['reg14', {}] : ['day19', {}] })); }
  if (MG && MG.needs) MG.needs.forEach(n => L.unshift({ c: n.k === 'approve' || n.k === 'back' ? 'r' : 'a', t: n.t, s: 'Meetings' + (n.due ? ' · due ' + dmy(n.due).slice(0, 5) + ' ' + String(n.due).slice(11, 16) : n.date ? ' · ' + dmy(n.date).slice(0, 5) : ''), b: n.k === 'approve' ? 'Review' : n.k === 'reply' ? 'Submit' : 'Open', k: 1, go: [n.k === 'reply' ? 'm28r' : 'm28m', { id: n.mtg_id }] }));
  if (V && V.needs) V.needs.forEach(n => L.push({ c: '', t: n.t, s: 'SVAMITVA · ' + n.k, b: 'Open', go: n.a }));
  outNeeds(data.out).reverse().forEach(n => L.unshift(n));
  if (data.fid && data.fid.unconfirmed) L.unshift({ c: 'a', t: `${data.fid.unconfirmed} camp${data.fid.unconfirmed > 1 ? 's' : ''}: attendance not confirmed`, s: 'Farmer ID · due 1 PM', b: 'View', go: ['os-fid', {}] });
  return L;
}
function needsCard() {
  const L = needsList(H.data), wait = keys().some(k => H.busy[k] && !H.data[k]);
  const errs = ['c25', 'al', 'svm', 'm28', 'out'].filter(k => H.err[k] && !H.data[k]);
  return `<div class="cd"><div class="hd"><b>Needs you</b>${L.length > 6 ? `<button class="lk" data-go="os-needs">All ${L.length}</button>` : `<span>${L.length ? L.length + ' item' + (L.length > 1 ? 's' : '') : ''}</span>`}</div>
    ${L.slice(0, 6).map((n, i) => `<div class="nd"><i class="c ${n.c}"></i><div class="t"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></div><button class="btn s${n.k ? '' : ' o'}" data-nd="${i}">${n.b}</button></div>`).join('')}
    ${!L.length && wait ? `${sk(16)}<div style="height:12px"></div>${sk(16, '70%')}` : ''}${!L.length && !wait && !errs.length ? '<div class="sub" style="padding:6px 0">Nothing is waiting on you.</div>' : ''}
    ${errs.length ? `<div style="margin-top:8px">${errRow(errs[0], errs.map(k => ({ c25: 'certificates', al: 'alerts', svm: 'SVAMITVA', m28: 'meetings', out: 'Outbox' }[k])).join(', '))}</div>` : ''}</div>`;
}
function weekCard() {
  const I = H.data.ins; if (!I) return H.err.ins ? '' : `<div class="cd">${sk(16, '30%')}<div style="height:14px"></div>${sk(60)}</div>`;
  const s = I.series || []; if (s.length < 2) return '';
  const days = []; for (let i = Math.max(1, s.length - 7); i < s.length; i++) days.push({ d: s[i][0], n: Math.max(0, s[i][1] - s[i - 1][1]) });
  const mx = Math.max.apply(null, days.map(x => x.n).concat([1])), td = today(), W = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `<div class="cd"><div class="hd"><b>This week</b><span>IDs made each day${I.pace != null ? ' · pace ' + N(I.pace) + '/day' : ''}</span></div>
    <div class="wk">${days.map(x => `<div class="${x.d === td ? 'td' : ''}"><span>${x.d === td ? 'Today' : W[new Date(x.d + 'T00:00:00Z').getUTCDay()]}</span><i><u style="height:${Math.max(4, Math.round(x.n * 100 / mx))}%;${x.n < mx * 0.45 ? 'background:#B26B00' : ''}"></u></i><em>${N(x.n)}</em></div>`).join('')}</div></div>`;
}
function villCard() {
  const I = H.data.ins, D = H.data.day; if (!I) return H.err.ins ? '' : `<div class="cd">${sk(16, '25%')}${[1, 2, 3, 4].map(() => '<div style="height:14px"></div>' + sk(14)).join('')}</div>`;
  const tdy = {}; if (D && D.villages) D.villages.forEach(v => tdy[v.name] = (v.made || 0) + (v.part || 0)); const cu = {}; if (D && D.villages) D.villages.forEach(v => cu[v.name] = v.catch || 0);
  const V = (I.villages || []).map(v => ({ name: v.name, pct: v.total ? (v.claimed + v.part) * 100 / v.total : 0, pend: v.pending || 0 })).sort((a, b) => b.pct - a.pct);
  const avg = V.length ? V.reduce((a, v) => a + v.pct, 0) / V.length : 0;
  return `<div class="cd"><div class="hd"><b>Villages</b><button class="lk" data-go="ins19">Insights ›</button></div>
    <table class="vt"><thead><tr><th style="width:34%">Village</th><th>Claimed</th><th class="r" style="width:16%">Pending</th><th class="r" style="width:14%">Today</th></tr></thead><tbody>
    ${V.map(v => `<tr><td><b>${esc(v.name)}</b></td><td><div class="vb"><i><u class="${v.pct < avg * 0.8 ? 'a' : ''}" style="width:${v.pct.toFixed(1)}%"></u></i><em>${Math.round(v.pct)}%</em></div></td><td class="r">${N(v.pend)}</td><td class="r">${tdy[v.name] != null ? '+' + N(tdy[v.name]) + (cu[v.name] ? `<br><small style="color:#8A5300">+${N(cu[v.name])} older</small>` : '') : '–'}</td></tr>`).join('')}</tbody></table></div>`;
}
function gqVill() {
  const G = H.data.h29; if (!G) return H.err.h29 ? '' : `<div class="cd">${sk(16, '25%')}${[1, 2, 3].map(() => '<div style="height:14px"></div>' + sk(14)).join('')}</div>`;
  return `<div class="cd"><div class="hd"><b>Villages</b><span>${esc(G.scope)}</span></div><table class="vt"><thead><tr><th style="width:40%">Village</th><th>Claimed</th></tr></thead><tbody>
    ${G.villages.map(v => { const p = v.total ? v.done * 100 / v.total : 0; return `<tr><td><b>${esc(v.name)}</b></td><td><div class="vb"><i><u style="width:${p.toFixed(1)}%"></u></i><em>${Math.round(p)}%</em></div></td></tr>`; }).join('')}</tbody></table></div>`;
}
const tile = (g, ic, bg, fg, name, sub, soon) => `<button class="tile${soon ? ' soon' : ''}" data-go="${g}"><span class="ic" style="background:${bg};color:${fg}">${svg(ic, 19)}</span><span><b>${name}</b><span class="s">${sub}</span></span></button>`;
function tiles() {
  const K = rk(), V = H.data.svm, MG = H.data.m28, mine = needsList(H.data).some(n => n.go && n.go[0] === 'c25');
  const up = MG && MG.rows ? MG.rows.filter(r => r.date >= today()).sort((a, b) => a.date.localeCompare(b.date))[0] : null;
  const mt = mtgWho() ? tile('m28', 'meet', '#F0EEF7', '#5B4B8A', 'Meetings', up ? esc(up.title.length > 22 ? up.title.slice(0, 21) + '…' : up.title) + ' · ' + Number(up.date.slice(8, 10)) + ' ' + MO[Number(up.date.slice(5, 7)) - 1] : 'Notices, brief, minutes') : '';
  const cert = sub => certWho() ? tile('c25', 'cert', '#E8F2EC', '#0E5E3B', 'Certificates', sub || (mine ? 'New for you' : 'Reports and remarks')) : '';
  const fid = sub => tile('os-fid', 'fid', '#E8F2EC', '#0E5E3B', 'Farmer ID', sub);
  const sv = sub => svmOn() ? tile('svm12', 'map', '#EAF0F8', '#2F5D9E', 'SVAMITVA', sub || (V && V.totals ? N(V.totals.cards) + ' of ' + N(V.totals.props) + ' cards' : 'Abadi deh, cards')) : '';
  const all = `<button class="cd rowc" data-go="os-mods"><span>All modules<small>${role() === 'ADMIN' ? '5 live · 11 coming' : 'Everything in TehsilOS'}</small></span><span>›</span></button>`;
  if (K === 'nt') return `<div class="tiles">${cert()}${mt}${fid('Whole tehsil · view')}${sv('View')}</div>${all}`;
  if (K === 'da') return `<div class="tiles">${mt}${cert()}${fid('4:30 report, camps')}${tile('rep8', 'doc', '#F1F3F1', '#3F4A44', 'Reports', 'Daily, weekly')}</div>${all}`;
  if (K === 'oq') return `<div class="tiles">${sv()}${mt}${cert('View')}${fid('View')}</div>${all}`;
  if (K === 'gq') return `<div class="tiles">${fid('Your circle')}${sv('View')}${mt}</div>${all}`;
  const SOON = [['Revenue Court Cases', 'court'], ['State Land & Encroachment', 'land'], ['Dak Section', 'dak'], ['Grievances', 'griev']];
  return `<div class="tiles">${cert()}${mt}${sv()}${tile('camps10', 'camp', '#FFF4E0', '#8A5300', 'Camps', 'Daily camps, deployment')}${tile('ins19', 'ins', '#F0EEF7', '#5B4B8A', 'Insights', 'Rank, pace, villages')}</div>
    ${role() === 'ADMIN' ? `<div class="hd" style="margin:18px 0 10px"><b>Coming soon</b><span>Only you see these</span></div><div class="tiles">${SOON.map(s => tile('os-mods', s[1], '#F1F3F1', '#5E6B63', s[0], 'Planned', 1)).join('')}</div>` : ''}${all}`;
}
let EL = null;
function paint() {
  if (!EL || !current() || current().name !== 'os-home') return;
  const K = rk(), t = ist(), h = t.getUTCHours(), busy = Object.keys(H.busy).some(k => H.busy[k]);
  const lay = K === 'gq' || K === 'oq' ? (desk() ? `<div class="col">${hero()}${gqVill()}</div><div class="col">${needsCard()}${tiles()}</div>` : `<div class="col">${hero()}${needsCard()}${tiles()}${gqVill()}</div>`)
    : desk() ? `<div class="col">${hero()}${villCard()}</div><div class="col">${needsCard()}${weekCard()}${tiles()}</div>` : `<div class="col">${hero()}${needsCard()}${tiles()}${weekCard()}${villCard()}</div>`;
  EL.innerHTML = `<div class="pg hm"><div class="top"><div><div class="sub">Tehsil Kastigarh · ${t.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}</div>
      <h1 class="t">${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}${firstName() ? ', ' + esc(firstName()) : ''}</h1>${K !== 'teh' ? `<div class="sub" style="margin-top:2px">${esc(desig())}${K === 'nt' ? ' · whole tehsil' : ''}</div>` : ''}</div>
      <div class="upd ${busy ? 'ld' : ''}"><i></i>${H.at ? 'Updated ' + hm(H.at) : 'Loading…'}${busy && H.at ? ' · refreshing' : ''}${!busy ? ' · <button class="lk" id="rf">Refresh</button>' : ''}</div></div>
    <div class="grid">${lay}</div><p class="ft">TehsilOS ${VERSION}</p></div>`;
  const rf = $('#rf', EL); if (rf) rf.onclick = () => loadAll(true);
}
register('os-home', { title: 'Home',
  async render(el) {
    EL = el; const uid = (me() || {}).user_id;
    if (H.uid !== uid) { H.data = {}; H.err = {}; H.busy = {}; H.at = 0; H.uid = uid;
      for (const k of Object.keys(SRC)) { const c = await kget(kk(k)); if (c && c.d) { H.data[k] = c.d; H.at = Math.max(H.at, c.t || 0); } } }
    if (!el.dataset.wired) { el.dataset.wired = 1;
      on(el, '[data-go]', 'click', b => { if (current().name !== 'os-home' && !b.closest('.hm')) return; const n = b.dataset.go; if (b.dataset.args) return go(n, JSON.parse(b.dataset.args)); if (n === 'home') return reset('home'); go(n); });
      on(el, '[data-nd]', 'click', b => { const n = needsList(H.data)[Number(b.dataset.nd)]; if (n && n.go) go(n.go[0], n.go[1] || {}); });
      on(el, '[data-retry]', 'click', b => fetchOne(b.dataset.retry));
      let rz = 0; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(paint, 200); }); }
    paint(); loadAll();
  },
  refresh() { loadAll(); } });
export const homeData = () => H.data;
/** for screens other than Home (Needs you): the cached figures, fetched if there are none */
export async function homeEnsure() { const uid = (me() || {}).user_id;
  if (H.uid !== uid) { H.data = {}; H.err = {}; H.busy = {}; H.at = 0; H.uid = uid; for (const k of Object.keys(SRC)) { const c = await kget(kk(k)); if (c && c.d) { H.data[k] = c.d; H.at = Math.max(H.at, c.t || 0); } } }
  return H; }
export const homeLoad = f => loadAll(f);
