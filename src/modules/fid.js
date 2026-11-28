/* Farmer ID for the office (frozen boards F1, F2, F4, 28.11.2026): Today · a village's camps and attendance · Day close. */
import { $, $$, esc, on, N, hm } from '../core/dom.js';
import { svg, toast, fail, busy, pill, sk, ring, openSheet, closeSheet } from '../core/ui.js';
import { api } from '../core/api.js';
import { kget, kput } from '../core/store.js';
import { me, role, rk } from '../core/session.js';
import { register, go, back, current, redraw, reset } from '../core/router.js';

let T = null, TAT = 0;
async function loadToday(f) { if (!f && T && Date.now() - TAT < 45000) return T; T = await api('fid30Today', {}, { timeout: 90000 }); TAT = Date.now(); kput('os:fid30:' + me().user_id, T); return T; }
const h12 = s => { if (!s) return ''; const [h, m] = s.split(':').map(Number); return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); };
const d5 = d => d ? d.slice(8, 10) + '.' + d.slice(5, 7) : '';
const col = (n, t) => !t ? 'var(--mu)' : n >= t / 2 ? 'var(--g)' : n > 0 ? 'var(--am)' : 'var(--rd)';
const ROLE_MARK = () => ['ADMIN', 'DA', 'NT'].indexOf(role()) >= 0;

/* ---------- F1 · Today ---------- */
register('os-fid', { title: 'Farmer ID', async render(el, a, ctx) {
  if (!T) { const c = await kget('os:fid30:' + me().user_id); if (c && c.date) T = c; }
  let I = null;
  const draw = () => { if (!ctx.alive()) return;
    if (!T) { el.innerHTML = `<div class="pg nr st30">${sk(24, '50%')}<div class="cd">${sk(140)}</div><div class="cd">${sk(220)}</div></div>`; return; }
    const S = T.totals, run = T.villages.filter(v => v.running), p = S.target ? Math.min(1, S.ids / S.target) : 0;
    const below = run.filter(v => v.target && v.ids < v.target / 2).length, stale = run.filter(v => v.ids === 0);
    el.innerHTML = `<div class="pg nr st30 fid30"><div class="hd0"><div class="sub">Today · ${esc(T.window.label)}${T.days_left ? ' · ' + T.days_left + ' day' + (T.days_left > 1 ? 's' : '') + ' to ' + d5(T.cfg.deadline) : ''}</div><h1 class="t">Kastigarh today</h1></div>
      <div class="cd"><div class="hro2">${ring(p, 92, 9, '#0E5E3B', '#E8F2EC', Math.round(p * 100) + ' percent')}<div><small>IDs made today</small><div class="big">${N(S.ids)}</div><div class="of">of <b>${N(S.target)}</b> camps' target</div></div></div>
        <div class="note" style="margin-top:12px">Camps' target = ${S.present} officials present × ${T.cfg.per}. Patwaris: ${T.cfg.ph} a village (${N(S.ph_target)} in all).${T.last_file ? ' As on the ' + h12(T.last_file.slice(11, 16)) + ' portal file.' : ''}</div>
        <div class="minis3"><div><b>${I && I.ids ? N(I.ids.pending) : '–'}</b><span>Approvals due (yours)</span></div><div><b>${N(S.can)}</b><span>Can still get</span></div><div><b>${N(S.pending)}</b><span>Pending in all</span></div></div></div>
      <button class="cd upl" data-go="pp19"><i class="dot g"></i><span><b>Last file ${T.last_file ? h12(T.last_file.slice(11, 16)) + (T.last_file.slice(0, 10) !== T.date ? ' (' + d5(T.last_file) + ')' : '') : '–'}</b><small>${T.next_slot ? 'Next: ' + h12(T.next_slot) + (T.next_slot === '16:15' ? ', before the DC\'s 4:30' : '') : 'No more uploads asked today'}</small></span><span class="btn s">Upload</span></button>
      ${T.unconfirmed && ROLE_MARK() ? `<div class="note a">${T.unconfirmed} camp${T.unconfirmed > 1 ? 's have' : ' has'} not confirmed attendance (due ${h12(T.cfg.confirm_by)}).</div>` : ''}
      <div class="hd2">Camps today <span>${S.camps} running · ${S.present} present${S.absent ? ' · ' + S.absent + ' absent' : ''}</span></div>
      <div class="cd pl0">${run.sort((x, y) => (x.target ? x.ids / x.target : 9) - (y.target ? y.ids / y.target : 9)).map(v => { const q = v.target ? Math.min(1, v.ids / v.target) : 0, ab = v.camps.reduce((s, c) => s + c.officials.filter(o => o.att === 'A').length, 0);
        return `<button class="pr vrow" data-v="${esc(v.village_id)}"><span class="nm"><b>${esc(v.name)}</b><small>${v.camps.length > 1 ? v.camps.length + ' camps · ' : esc(v.camps[0].camp) + ' camp · '}${v.camps.reduce((s, c) => s + c.present, 0)} present${ab ? ' · ' + ab + ' absent' : ''}${v.patwari ? ' · PH ' + esc(v.patwari.name) : ''}${v.camps.some(c => !c.confirmed) ? '' : ' · confirmed'}${v.catch ? ` · <span style="color:#8A5300">+${N(v.catch)} older, since ${esc(v.catch_since)} (not today)</span>` : ''}</small>
          <i class="bar30"><i style="width:${Math.max(3, Math.round(q * 100))}%;background:${col(v.ids, v.target)}"></i></i></span><span class="num"><b>${v.ids}</b> / ${v.target}</span></button>`; }).join('') || '<p class="sub" style="padding:14px 16px;margin:0">No camps posted today.</p>'}</div>
      ${stale.length && T.window.to.slice(11, 13) >= '13' ? `<div class="note r"><b>No ID yet today:</b> ${stale.map(v => esc(v.name)).join(', ')}.</div>` : ''}
      ${['ADMIN', 'DA', 'NT'].indexOf(role()) >= 0 ? `<button class="btn o w" data-go="os-close">Day close · ${below} village${below === 1 ? '' : 's'} below half</button>` : ''}
      <button class="btn w" id="wa30" style="margin-top:10px">Share to WhatsApp group</button>
      <p class="ft">Older Farmer ID screens: <button class="lk" data-go="home">open</button> · Updated ${hm(TAT || Date.now())}</p></div>`;
    const w = el.querySelector('#wa30'); if (w) w.onclick = () => share30(T); };
  on(el, '[data-go]', 'click', b => go(b.dataset.go, {}));
  on(el, '[data-v]', 'click', b => go('os-camp', { vid: b.dataset.v }));
  draw();
  try { await Promise.all([loadToday(a.fresh).then(draw), api('ins19', {}).then(x => { I = x; draw(); }).catch(() => {})]); a.fresh = 0; } catch (e) { if (/Unknown action/i.test(e.message)) return reset('home'); if (!T) el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; else fail(e.message); }
}, refresh() { TAT = 0; const c = current(); if (c) c.args.fresh = 1; return redraw(); } });

/* ---------- F2 · a village's camps: attendance by exception ---------- */
register('os-camp', { title: 'Camp', async render(el, a, ctx) {
  const ph = rk() === 'ph';
  let V = null;
  const find = () => { if (T && !ph) V = T.villages.find(v => v.village_id === a.vid) || V; };
  find();
  const draw = () => { if (!ctx.alive()) return;
    if (!V) { el.innerHTML = `<div class="pg nr st30">${sk(24, '50%')}<div class="cd">${sk(200)}</div></div>`; return; }
    el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">${V.camps.length} camp${V.camps.length === 1 ? '' : 's'} · village ${esc(V.name)} · today</div><h1 class="t">${esc(V.name)}</h1></div>
      <div class="cd st3"><div><span>IDs today</span><b style="color:${col(V.ids, V.target)}">${V.ids}</b></div><div><span>Camps' target</span><b>${V.target}</b></div><div><span>Can still get</span><b>${N(V.can)}</b></div></div>
      <p class="sub" style="margin:-6px 0 0">Target = officials present × 10 (not Patwaris, not GRS/Chowkidar/Lumberdar/AWW). ${V.patwari ? 'PH ' + esc(V.patwari.name) + ': 40 for this village.' : ''} The portal gives IDs by village, not by camp.</p>
      ${V.camps.map((c, ci) => `<div class="hd2">${esc(c.camp)} camp <span>${c.confirmed ? 'confirmed ' + esc(String(c.confirmed.at).slice(11, 16)) : 'not confirmed'}</span></div>
        <div class="cd pl0">${c.officials.map(o => `<div class="att30"><span class="nm"><b>${esc(o.name)}</b><small>${esc(o.designation)} · ${esc(o.department)}${o.patwari ? ' · Patwari' : o.mob ? ' · mobiliser' : ''}</small></span>
          <span class="seg">${[['P', 'Present'], ['A', 'Absent'], ['L', 'Leave']].map(s => `<button data-k="${esc(o.key)}" data-s="${s[0]}" class="${(o.att || 'P') === s[0] ? 'on ' + s[0] : ''}" aria-pressed="${(o.att || 'P') === s[0]}">${s[1]}</button>`).join('')}</span></div>`).join('')}
          ${c.confirmed ? '' : `<button class="addp" data-cf="${ci}">Sab theek · confirm attendance</button>`}</div>`).join('')}
      <p class="ft" style="margin-top:0">Everyone counts present unless marked. Mark by 1 PM; after that the Tehsildar and the NT are reminded.</p></div>`; };
  const mark = (items, confirm, camp) => api('att30', { village_id: a.vid, items, confirm: confirm ? 1 : 0, camp }, { write: 1 }).then(r => { V = r.village; TAT = 0; draw(); });
  on(el, '[data-s]', 'click', b => busy(b, '', () => mark([{ key: b.dataset.k, status: b.dataset.s === 'P' ? '' : b.dataset.s }])));
  on(el, '[data-cf]', 'click', b => busy(b, 'Saving', async () => { await mark([], true, V.camps[Number(b.dataset.cf)].camp); toast('Attendance confirmed'); }));
  draw();
  try { if (ph) { const P = await api('pat30', {}, { timeout: 60000 }); const x = P.villages.find(v => v.village_id === a.vid); V = x ? Object.assign({ patwari: { name: me().name } }, x) : null; if (!V) throw new Error('This village is not in your halqa.'); }
    else { await loadToday(); find(); } draw(); } catch (e) { if (!V) el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; else fail(e.message); }
} });

/* ---------- F4 · Day close ---------- */
register('os-close', { title: 'Day close', async render(el, a, ctx) {
  el.innerHTML = `<div class="pg nr st30">${sk(24, '50%')}<div class="cd">${sk(240)}</div></div>`;
  let C; try { C = await api('fid30Close', {}, { timeout: 90000 }); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  const pick = {}, abs = {}; C.villages.forEach(v => pick[v.village_id] = false); C.absent.forEach(o => abs[o.key] = true);
  const lvl = n => n >= 3 ? pill('3rd · DC', 'r') : n === 2 ? pill('2nd', 'a') : pill('1st', '');
  const draw = () => {
    const B = C.villages.filter(v => v.below), rest = C.villages.filter(v => !v.below);
    const people = {}; C.villages.filter(v => pick[v.village_id]).forEach(v => { v.officials.forEach(o => people[o.key] = o.department); if (v.patwari) people[v.patwari.user_id] = 'Revenue'; });
    C.absent.filter(o => abs[o.key]).forEach(o => people[o.key] = o.department);
    const depts = Array.from(new Set(Object.keys(people).map(k => people[k])));
    const vrow = v => `<label class="pr ck30"><input type="checkbox" data-v="${esc(v.village_id)}" ${pick[v.village_id] ? 'checked' : ''} ${C.can_issue ? '' : 'disabled'}><span class="nm"><b>${esc(v.name)}</b><small>${v.camps.map(c => esc(c.camp) + ' ' + c.present + ' present').join(' · ')}${v.patwari ? ' · PH ' + esc(v.patwari.name) : ''}<br>${v.officials.map(o => esc(o.name) + ' (' + esc(o.designation) + ')').join(', ') || 'No official counted'}</small></span><b class="num" style="color:${col(v.ids, v.target)}">${v.ids}/${v.target}</b></label>`;
    el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">Day ${esc(C.window.label)}</div><h1 class="t">${B.length} village${B.length === 1 ? '' : 's'} below half</h1></div>
      ${C.issued ? `<div class="note g">Notices for this day are made (${C.issued} officials). Outbox › To sign.</div>` : ''}
      <p class="sub" style="margin:-6px 0 0">${C.can_issue ? 'Tick the villages whose camps get notices. The officials present there and the Patwari of the village are added by themselves.' : 'The Tehsildar picks the villages.'}</p>
      <div class="cd pl0">${B.map(vrow).join('') || '<p class="sub" style="padding:14px 16px;margin:0">None below half.</p>'}</div>
      ${rest.length ? `<details class="cd pl0 more30"><summary>Others · ${rest.length}</summary>${rest.map(vrow).join('')}</details>` : ''}
      <div class="hd2">Absent from camp <span>${C.absent.length}</span></div>
      <div class="cd pl0">${C.absent.map(o => `<label class="pr ck30"><input type="checkbox" data-a="${esc(o.key)}" ${abs[o.key] ? 'checked' : ''} ${C.can_issue ? '' : 'disabled'}><span class="nm"><b>${esc(o.name)}, ${esc(o.designation)}</b><small>${esc(o.camp)} camp · ${esc(o.village)}</small></span>${lvl(o.level)}</label>`).join('') || '<p class="sub" style="padding:14px 16px;margin:0">No one marked absent.</p>'}</div>
      ${depts.length ? `<div class="hd2">Notices · one per department <span>${depts.length}</span></div><div class="cd pl0">${depts.map(d => { const ks = Object.keys(people).filter(k => people[k] === d); return `<div class="pr"><span class="nm"><b>${esc(d)} · ${ks.length} official${ks.length > 1 ? 's' : ''}</b><small>${ks.map(k => { const o = C.villages.reduce((x, v) => x || v.officials.find(y => y.key === k) || (v.patwari && v.patwari.user_id === k ? Object.assign({ designation: 'Patwari' }, v.patwari) : null), null) || C.absent.find(y => y.key === k) || {}; return esc(o.name || '') + (o.level > 1 ? ' (' + (o.level === 2 ? '2nd' : '3rd') + ')' : ''); }).join(', ')}</small></span></div>`; }).join('')}</div>` : ''}
      <div class="note">Each notice carries its officials' camp, IDs and target, any earlier notice by number and date, reply by 11:00 AM tomorrow, and copies to the department's DDO, ACR, NT Topneel, Nazir and the office file.</div>
      ${C.can_issue ? `<button class="btn w" id="go" ${depts.length ? '' : 'disabled'}>Approve ${depts.length || ''} · to sign</button><p class="ft" style="margin-top:-6px">They go to Outbox › To sign, numbered when you sign.</p>` : ''}</div>`; };
  on(el, '[data-v]', 'change', c => { pick[c.dataset.v] = c.checked; draw(); });
  on(el, '[data-a]', 'change', c => { abs[c.dataset.a] = c.checked; draw(); });
  on(el, '#go', 'click', b => busy(b, 'Making notices', async () => {
    const r = await api('fid30Issue', { date: C.date, villages: Object.keys(pick).filter(k => pick[k]), absent: Object.keys(abs).filter(k => abs[k]), again: C.issued ? 1 : 0 }, { write: 1, timeout: 90000 });
    toast(r.made.length + ' notice' + (r.made.length > 1 ? 's' : '') + ' to sign'); go('os-sign', {}, { replace: true }); }));
  draw();
} });

/* the day's figures as a WhatsApp message: IDs from the hourly file (8 PM to 8 PM), camps against target */
async function share30(T) {
  const S = T.totals, V = T.villages || [], run = V.filter(v => v.running), got = V.filter(v => v.ids).sort((a, b) => b.ids - a.ids), none = run.filter(v => !v.ids);
  const L = [`*Farmer ID · Tehsil Kastigarh*`, T.window.label, '', `*IDs made: ${N(S.ids)}*` + (S.target ? ` (camps' target ${N(S.target)})` : '')];
  if (got.length) L.push(got.map(v => `${v.name} ${N(v.ids)}` + (v.running && v.target ? `/${N(v.target)}` : '')).join(' · '));
  if (none.length) L.push(`No ID yet: ${none.map(v => v.name).join(', ')}`);
  L.push('', `Camps: ${S.camps} · present ${S.present}${S.absent ? ' · absent ' + S.absent : ''}`, `Pending in all: ${N(S.pending)} · can still get ${N(S.can)}`);
  if (T.last_file) L.push(`As on the ${T.last_file.slice(11, 16)} portal file`);
  const txt = L.join('\n');
  try { if (navigator.share) { await navigator.share({ text: txt }); return; } } catch (e) { if (e.name === 'AbortError') return; }
  window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}
