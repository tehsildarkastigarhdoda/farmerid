/* The Patwari's day (frozen boards P1–P4, 28.11.2026): Aaj · Register by the 12 reasons · Aaj ke 25 · one family card.
 * Marks are saved on the phone first and sent when there is signal (core/queue.js). The village lists are the same
 * "unclaimed owners register" data as the older screens (reg14List), kept on the phone under the same keys.
 */
import { $, $$, esc, on, N, today } from '../core/dom.js';
import { svg, toast, fail, busy, pill, sk, openSheet, closeSheet } from '../core/ui.js';
import { api } from '../core/api.js';
import { kget, kput } from '../core/store.js';
import { me, firstName, certWho, mtgWho } from '../core/session.js';
import { register, go, back, current, redraw } from '../core/router.js';
import { enqueue, queued, onQueue, flush } from '../core/queue.js';
import { needsList } from './home.js';

const CH = { C1: ['Camp ki tareekh pata hai'], C2: ['Aayega', 'OTP dega', 'Jammu mein', 'Doda mein'], N1: ['Heirs recorded, share left', 'Waris: ', 'Intqal pending'], N3: ['Kai saal se pata nahi'], N5: ['Jammu mein', 'Bahar naukri'],
  N6: ['Bahut budhe', 'Lakwa'], N7: ['Jammu mein rehta', 'Shaadi ke baad bahar', 'Bahar naukri'], N8: ['Zameen bik gayi, intqal nahi', 'Court case', 'Nabalig', 'Consent se inkaar'] };
const SHORT = { C1: 'Gaon mein – camp mein ID', C2: 'Bahar – aayega / OTP', C3: 'ID bani – khasra jodo', C4: 'Seeding baaki', N1: 'Marhoom – intqal nahi', N2: 'In khasron ki nahi', N3: 'Gumshuda', N4: 'Sarkari zameen',
  N5: 'Mobile link nahi – bahar', N6: 'Lakwa / bahut budhe', N7: 'Bahar rehta – nahi aata', N8: 'Koi aur wajah' };
const PICKS = ['C1', 'C2', 'C3', 'C4', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8'];

/* ---------- data ---------- */
let MY = null, MYAT = 0, PAT = null, PATAT = 0; const VL = {};
async function loadMy(f) { if (!f && MY && Date.now() - MYAT < 60000) return MY;
  try { MY = await api('reg14My', {}, { timeout: 60000 }); MYAT = Date.now(); kput('r14my', MY); } catch (e) { MY = MY || (await kget('r14my')); if (!MY) throw e; } return MY; }
async function loadPat(f) { if (!f && PAT && Date.now() - PATAT < 60000) return PAT;
  try { PAT = await api('pat30', {}, { timeout: 60000 }); PATAT = Date.now(); kput('os:pat30', PAT); } catch (e) { PAT = PAT || (await kget('os:pat30')); if (!PAT) throw e; } return PAT; }
async function loadVill(vid, f) {
  if (!f && VL[vid] && Date.now() - VL[vid]._at < 120000) return VL[vid];
  try { const D = await api('reg14List', { village_id: vid }, { timeout: 60000 }); D._at = Date.now(); VL[vid] = D; kput('r14:' + vid, D); }
  catch (e) { if (!VL[vid]) VL[vid] = await kget('r14:' + vid); if (!VL[vid]) throw e; toast('No signal: the last saved list. Marks go when the signal comes.', 'info'); }
  return VL[vid];
}
const pickOf = (D, r) => r.made ? 'M' : r.st === 'CLAIMED' ? (r.pick === 'N2' ? 'N2' : 'M') : r.st === 'REASON' && r.rc ? ((D.of[r.rc] || ['N8'])[0]) : '';
function groups(D) {
  const g = {};
  D.rows.forEach(r => { r.pk = pickOf(D, r); const k = r.fam || r.id; (g[k] = g[k] || { k, n: r.n, p: r.p, rows: [], vid: D.village_id, vname: D.name }).rows.push(r); });
  return Object.keys(g).map(k => { const x = g[k], open = x.rows.filter(r => !r.pk);
    x.fam = x.rows.length > 1; x.open = open.length; x.done = !open.length; x.later = open.length > 0 && open.every(r => r.fl === 'LATER');
    x.picks = Array.from(new Set(x.rows.map(r => r.pk).filter(Boolean)));
    x.ew = Math.max(0, ...x.rows.filter(r => !r.pk || /^C/.test(r.pk)).map(r => r.ew || 0)); x.lastbro = x.rows.some(r => r.lastbro && !r.pk);
    x.area = x.rows.reduce((t, r) => t + (Number(r.area) || 0), 0); x.sug = open.find(r => r.sg) || null;
    x.kh = Array.from(new Set(x.rows.map(r => String(r.k || '')).join(',').split(/\s*,\s*/).filter(Boolean))); return x; });
}
const famTitle = g => g.fam ? `Family of ${g.p} · ${g.rows.length}` : `${g.n} s/o ${g.p || '–'}`;
const pend = { n: 0 }; onQueue(n => { pend.n = n; const b = $('#oq30'); if (b) { b.hidden = !n; b.textContent = n + ' bhejna baaki · waiting for signal'; } });
const pendBar = () => `<div id="oq30" class="note a" ${pend.n ? '' : 'hidden'}>${pend.n} bhejna baaki · waiting for signal</div>`;

/* ---------- P1 · Aaj ---------- */
register('os-aaj', { title: 'Aaj', async render(el, a, ctx) {
  pend.n = await queued();
  let P = PAT, M = MY, X = {};
  const draw = () => { if (!ctx.alive()) return;
    const V = P ? P.villages : [], tot = V.reduce((s, v) => s + v.ids, 0), tgt = V.reduce((s, v) => s + v.target, 0);
    const notices = P ? P.notices.filter(n => n.status === 'ISSUED' && !n.reply_at) : [];
    const camps = []; V.forEach(v => v.camps.forEach(c => { if (!c.confirmed) camps.push({ v, c }); }));
    const sumP = re => M && M.villages ? M.villages.reduce((s, v) => s + Object.keys(v.picks || {}).filter(k => re.test(k)).reduce((t, k) => t + v.picks[k], 0), 0) : 0;
    const left = M && M.villages ? M.villages.reduce((s, v) => s + (v.farmers_left || 0), 0) : 0, can = sumP(/^C[1-4]$/), not = sumP(/^N[1-8]$/);
    const L = needsList({ c25: X.c25, m28: X.m28 });
    el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">${P ? esc((V[0] && 'Halqa · ' + V.length + ' gaon') || '') + ' · ' + (P.days_left ? 'deadline ' + P.cfg.deadline.slice(8, 10) + '.' + P.cfg.deadline.slice(5, 7) + ' (' + P.days_left + ' din)' : '') : 'Loading…'}</div><h1 class="t">Namaste${firstName() ? ', ' + esc(firstName()) : ''}</h1></div>
      ${pendBar()}
      <div class="cd pt30"><div class="top"><span><small>Aaj ki IDs · aapka halqa</small><b>${P ? N(tot) : '–'}</b><em> / ${N(tgt)}</em></span><span class="mu">${P ? P.cfg.ph + ' har gaon' : ''}<br>${P ? 'DC day · ' + esc(P.window.label.split(' to ')[0].slice(0, 5)) + ' 4:30 se' : ''}</span></div>
        ${V.map(v => { const p = v.target ? Math.min(1, v.ids / v.target) : 0; return `<div class="vr"><span>${esc(v.name)}</span><i><u style="width:${Math.max(2, Math.round(p * 100))}%;background:${p >= 0.5 ? 'var(--g)' : 'var(--am)'}"></u></i><b>${v.ids}/${v.target}</b></div>`; }).join('') || (P ? '<p class="sub">Aapke naam koi gaon nahi.</p>' : sk(60))}</div>
      <div class="hd2">Aapke liye</div>
      <div class="cd pl0">
        ${notices.map(n => `<div class="pr"><i class="dot r"></i><span class="nm"><b>Notice ka jawab</b><small>No. ${esc(n.no)} · ${n.reply_due ? esc(n.reply_due.slice(8, 10) + '.' + n.reply_due.slice(5, 7) + ' ' + n.reply_due.slice(11, 16)) + ' tak' : ''} · Nazir ko dein</small></span></div>`).join('')}
        ${camps.map(x => `<button class="pr" data-camp="${esc(x.v.village_id)}"><i class="dot a"></i><span class="nm"><b>${esc(x.c.camp)} camp · hazri</b><small>1 baje tak absent / leave mark karein, phir "Sab theek"</small></span><span class="btn s o">Mark</span></button>`).join('')}
        <button class="pr" data-go="os-25"><i class="dot a"></i><span class="nm"><b>Aaj ke 25</b><small>Kal ke camp ke liye bulana hai</small></span><span class="btn s o">Kholo</span></button>
        ${L.map((n, i) => `<button class="pr" data-nd="${i}"><i class="dot ${n.c === 'r' ? 'r' : ''}"></i><span class="nm"><b>${esc(n.t)}</b><small>${esc(n.s)}</small></span><span class="btn s o">${esc(n.b)}</span></button>`).join('')}</div>
      <button class="cd st3 lnk" data-go="os-reg"><div><span>Ban sakti hai</span><b style="color:var(--g)">${M ? N(can) : '–'}</b></div><div><span>Nahi ban sakti</span><b>${M ? N(not) : '–'}</b></div><div><span>Wajah baaki</span><b style="color:${left ? 'var(--am)' : 'inherit'}">${M ? N(left) : '–'}</b></div></button>
      <p class="ft" style="margin-top:0">Purani screens: <button class="lk" data-go="home">Farmer ID (old)</button></p></div>`; };
  on(el, '[data-go]', 'click', b => go(b.dataset.go, {}));
  on(el, '[data-camp]', 'click', b => go('os-camp', { vid: b.dataset.camp }));
  on(el, '[data-nd]', 'click', b => { const n = needsList({ c25: X.c25, m28: X.m28 })[Number(b.dataset.nd)]; if (n && n.go) go(n.go[0], n.go[1] || {}); });
  draw();
  const jobs = [loadPat(a.fresh).then(x => { P = x; draw(); }).catch(e => { if (/Unknown action/i.test(e.message)) { try { sessionStorage.setItem('os:noph', '1'); } catch (x) {} location.replace('legacy.html'); return; } fail(e.message); }), loadMy(a.fresh).then(x => { M = x; draw(); }).catch(() => {})];
  if (certWho()) jobs.push(api('cert25List', {}).then(x => { X.c25 = x; draw(); }).catch(() => {}));
  if (mtgWho()) jobs.push(api('mtg28List', {}).then(x => { X.m28 = x; draw(); }).catch(() => {}));
  await Promise.all(jobs); a.fresh = 0; flush();
}, refresh() { PATAT = 0; MYAT = 0; return redraw(); } });

/* ---------- P2 · Register ---------- */
register('os-reg', { title: 'Register', async render(el, a, ctx) {
  a.v = a.v || '';
  el.innerHTML = `<div class="pg nr st30">${sk(24, '40%')}<div class="cd">${sk(200)}</div></div>`;
  let M; try { M = await loadMy(); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  if (!M.list) { el.innerHTML = '<div class="pg nr"><div class="cd">Daftar ne abhi register shuru nahi kiya. The office has not started the register yet.</div></div>'; return; }
  const draw = () => {
    const V = M.villages.filter(v => !a.v || v.village_id === a.v), cnt = {}; let left = 0, n = 0;
    V.forEach(v => { left += v.farmers_left || 0; n += v.n || 0; Object.keys(v.picks || {}).forEach(k => cnt[k] = (cnt[k] || 0) + v.picks[k]); });
    const can = PICKS.filter(p => p[0] === 'C').reduce((s, p) => s + (cnt[p] || 0), 0), not = PICKS.filter(p => p[0] === 'N').reduce((s, p) => s + (cnt[p] || 0), 0);
    const row = p => `<button class="pr rr" data-p="${p}"><b class="cd30 ${p[0] === 'C' ? 'c' : ''}">${p}</b><span class="nm"><b>${esc(SHORT[p])}</b></span><b>${N(cnt[p] || 0)}</b></button>`;
    el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">${N(n)} owners · DC list</div><h1 class="t">Cases</h1></div>${pendBar()}
      <button class="srch fake" data-p="*">${svg('search', 18)}<span>Naam, walid, khasra</span></button>
      <div class="chips"><button data-v="" class="${!a.v ? 'on' : ''}">Sab gaon</button>${M.villages.map(v => `<button data-v="${esc(v.village_id)}" class="${a.v === v.village_id ? 'on' : ''}">${esc(v.name)}</button>`).join('')}</div>
      ${left ? `<button class="note a lnk" data-p="">${N(left)} owners ki wajah baaki · <b>Wajah lagao</b></button>` : ''}
      <div class="hd2">Ban sakti hai <span style="color:var(--g);font-weight:600">${N(can)}</span></div><div class="cd pl0">${PICKS.filter(p => p[0] === 'C').map(row).join('')}</div>
      <div class="hd2">Nahi ban sakti <span>${N(not)}</span></div><div class="cd pl0">${PICKS.filter(p => p[0] === 'N').map(row).join('')}</div></div>`; };
  on(el, '[data-v]', 'click', b => { current().args.v = b.dataset.v; draw(); });
  on(el, '[data-p]', 'click', b => go('os-reg-list', { v: a.v, p: b.dataset.p }));
  draw();
}, refresh() { MYAT = 0; return redraw(); } });

/* the families of one reason (or still open, or a search) */
register('os-reg-list', { title: a => a.p === '' ? 'Wajah baaki' : a.p === '*' ? 'Search' : a.p, async render(el, a, ctx) {
  a.q = a.q || ''; a.lim = a.lim || 60;
  el.innerHTML = `<div class="pg nr st30">${sk(24, '40%')}<div class="cd">${sk(200)}</div></div>`;
  let M, Ds; try { M = await loadMy(); Ds = await Promise.all(M.villages.filter(v => !a.v || v.village_id === a.v).map(v => loadVill(v.village_id))); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  const draw = () => {
    let G = []; Ds.forEach(D => G = G.concat(groups(D)));
    const q = a.q.trim().toLowerCase();
    G = G.filter(g => a.p === '' ? !g.done : a.p === '*' ? true : g.picks.indexOf(a.p) >= 0)
      .filter(g => !q || (g.rows.map(r => r.n).join(' ') + ' ' + g.p).toLowerCase().indexOf(q) >= 0 || g.kh.some(k => String(k).toLowerCase() === q || String(k).toLowerCase().indexOf(q + '/') === 0));
    a.keys = G.map(g => g.vid + '|' + g.k);
    el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">${a.p && a.p !== '*' ? esc(SHORT[a.p]) : a.p === '' ? 'Har owner ki wajah chunein' : 'Naam ya khasra likhein'}</div><h1 class="t">${N(G.length)} ${G.length === 1 ? 'card' : 'cards'}</h1></div>${pendBar()}
      <label class="srch">${svg('search', 18)}<input id="q" placeholder="Naam, walid, khasra" value="${esc(a.q)}" aria-label="Search" ${a.p === '*' ? 'autofocus' : ''}></label>
      <div class="cd pl0">${G.slice(0, a.lim).map(g => `<button class="pr fam" data-k="${esc(g.vid + '|' + g.k)}"><i class="dot ${g.done ? '' : 'a'}"></i><span class="nm"><b>${esc(famTitle(g))}</b><small>${esc(g.vname)} · khasra ${esc(g.kh.slice(0, 8).join(', '))}${g.kh.length > 8 ? ' …' : ''}${g.done ? ' · ' + g.picks.join(', ') : g.later ? ' · baad mein' : ''}</small></span></button>`).join('') || '<p class="sub" style="padding:14px 16px;margin:0">Koi nahi mila.</p>'}</div>
      ${G.length > a.lim ? `<button class="btn o w" id="more">Aur dikhayein (${N(G.length - a.lim)})</button>` : ''}</div>`;
    const qi = $('#q', el); qi.oninput = () => { a.q = qi.value; clearTimeout(draw._t); draw._t = setTimeout(() => { draw(); const n = $('#q', el); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 300); };
  };
  on(el, '[data-k]', 'click', b => go('os-card', { key: b.dataset.k, list: a.keys, p: a.p && a.p !== '*' ? a.p : '' }));
  on(el, '#more', 'click', () => { a.lim += 60; draw(); });
  draw();
} });

/* ---------- P3 · Aaj ke 25 ---------- */
register('os-25', { title: 'Aaj ke 25', async render(el, a, ctx) {
  el.innerHTML = `<div class="pg nr st30">${sk(24, '40%')}<div class="cd">${sk(200)}</div></div>`;
  let M, Ds; try { M = await loadMy(); Ds = await Promise.all(M.villages.map(v => loadVill(v.village_id))); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  const dk = 'os:25:' + me().user_id + ':' + today();
  let keep = await kget(dk);
  const all = {}; Ds.forEach(D => groups(D).forEach(g => all[g.vid + '|' + g.k] = g));
  if (!keep) { keep = Object.keys(all).map(k => all[k]).filter(g => (g.ew > 0 || g.lastbro) && !g.done && !g.later).sort((p, q) => q.lastbro - p.lastbro || q.ew - p.ew || q.area - p.area).slice(0, 25).map(g => g.vid + '|' + g.k); await kput(dk, keep); }
  const L = keep.map(k => all[k]).filter(Boolean), done = L.filter(g => g.done).length;
  el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">Sabse jaldi banne wale pehle · aaj ki list</div><h1 class="t">${done} of ${L.length} ho gaye</h1></div>${pendBar()}
    <div class="bar30"><i style="width:${L.length ? Math.round(done * 100 / L.length) : 0}%"></i></div>
    <p class="sub" style="margin:0">Order: aakhri bhai ka hissa · family mein ID · zameen zyada. Tap karke wajah lagayein.</p>
    <div class="cd pl0">${L.map((g, i) => `<button class="pr fam" data-k="${esc(g.vid + '|' + g.k)}"><b class="no30">${i + 1}</b><span class="nm"><b>${esc(famTitle(g))}</b><small>${esc(g.vname)} · ${g.area ? g.area.toFixed(2) + ' ha · ' : ''}khasra ${esc(g.kh.slice(0, 6).join(', '))}${g.lastbro ? ' · aakhri bhai' : ''}</small></span>${g.done ? pill('Ho gaya', 'g') : pill(g.sug ? 'Andaza: ' + ((Ds.find(D => D.village_id === g.vid).of[g.sug.sg] || [''])[0]) : 'Baaki', g.sug ? '' : 'a')}</button>`).join('') || '<p class="sub" style="padding:14px 16px;margin:0">Aaj ke liye koi nahi. Sab ho gaya ✓</p>'}</div>
    ${L.length ? '<button class="btn o w" id="wa">Lumberdar ke liye list · WhatsApp</button><p class="ft" style="margin-top:-6px">Sirf parivar ke naam. No Aadhaar, no mobile.</p>' : ''}</div>`;
  on(el, '[data-k]', 'click', b => go('os-card', { key: b.dataset.k, list: keep }));
  on(el, '#wa', 'click', () => { const by = {}; L.filter(g => !g.done).forEach(g => (by[g.vname] = by[g.vname] || []).push(g.fam ? 'Parivar ' + g.p : g.n + ' s/o ' + (g.p || '–')));
    const t = 'Kal camp mein in parivaron ko bulayein (Farmer ID):\n' + Object.keys(by).map(v => '*' + v + '*\n' + by[v].map((x, i) => (i + 1) + '. ' + x).join('\n')).join('\n\n');
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); });
} });

/* ---------- P4 · one family card ---------- */
register('os-card', { title: 'Kisan', form: true, async render(el, a, ctx) {
  const [vid, k] = String(a.key || '').split('|');
  let D; try { D = await loadVill(vid); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  const g = groups(D).find(x => x.k === k); if (!g) { el.innerHTML = '<div class="pg nr"><div class="cd">This card is not in the list any more.</div></div>'; return; }
  const rows = g.rows.filter(r => !r.made), tick = {}, anyOpen = rows.some(r => !r.pk);
  /* open owners are ticked; on a family already marked, only the owners of the reason it was opened from (or one owner alone) */
  rows.forEach(r => tick[r.id] = anyOpen ? !r.pk : rows.length === 1 || (!!a.p && r.pk === a.p));
  const cur = rows.find(r => r.pk && r.rc), st = { pick: cur ? (D.of[cur.rc] || [])[0] || '' : '', land: cur && D.of[cur.rc] && D.of[cur.rc][0] === 'N4' ? cur.rc : 'A05', note: cur ? String(cur.rm || '') : '' };
  const list = a.list || [], idx = list.indexOf(a.key);
  const code = () => st.pick === 'N4' ? st.land : (D.picks.find(p => p[0] === st.pick) || [])[5];
  const sel = () => rows.filter(r => tick[r.id]);
  const draw = () => {
    const P = D.picks.filter(p => PICKS.indexOf(p[0]) >= 0);
    el.innerHTML = `<div class="pg nr st30 card30"><div class="hd0"><div class="sub">${esc(g.vname)} · ${rows.length} owner${rows.length > 1 ? 's' : ''} · ${g.kh.length} khasra${idx >= 0 ? ' · ' + (idx + 1) + ' of ' + list.length : ''}</div><h1 class="t sm">${esc(famTitle(g))}</h1></div>
      ${!D.can_edit ? '<div class="note a">View only: the Patwari of this halqa marks reasons.</div>' : ''}
      <div class="cd pl0">${rows.map(r => `<label class="own30"><input type="checkbox" data-o="${esc(r.id)}" ${tick[r.id] ? 'checked' : ''} ${rows.length < 2 ? 'hidden' : ''}><span><b>${esc(r.n)}</b> s/o ${esc(r.p || '–')}<small>khasra ${esc(String(r.k || '–').split(/\s*,\s*/).slice(0, 12).join(', '))}${r.area ? ' · ' + Number(r.area).toFixed(2) + ' ha' : ''}${r.pk ? ' · ✓ ' + r.pk : ''}</small></span></label>`).join('')}</div>
      ${rows.length > 1 ? '<p class="sub" style="margin:-6px 0 0">Ek wajah sab tick kiye owners par. Alag ho to tick hatayein.</p>' : ''}
      ${g.sug && !g.done ? `<div class="note">App ka andaza: <b>${esc(((D.of[g.sug.sg] || [])[0]) || '')} · ${esc(SHORT[(D.of[g.sug.sg] || [])[0]] || '')}</b>${g.sug.why ? ' – ' + esc(g.sug.why) : ''}</div>` : ''}
      <div class="hd2">Wajah · ek chuno</div>
      <div class="pk30">${P.map(p => `<button data-p="${p[0]}" class="${p[1] === 'can' ? 'c' : ''} ${st.pick === p[0] ? 'on' : ''}" aria-pressed="${st.pick === p[0]}"><b>${p[0]}</b> · ${esc(SHORT[p[0]] || p[2])}</button>`).join('')}</div>
      ${st.pick === 'N4' ? `<div class="chips" style="flex-wrap:wrap">${D.land.map(l => `<button data-l="${l[0]}" class="${st.land === l[0] ? 'on' : ''}">${esc(l[1])}</button>`).join('')}</div>` : ''}
      ${CH[st.pick] ? `<div class="chips" style="flex-wrap:wrap">${CH[st.pick].map(c => `<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
      <label class="fld"><span>${st.pick === 'N8' ? 'Remark (zaroori)' : 'Remark (optional)'}</span><input id="nt" maxlength="120" value="${esc(st.note)}" placeholder="${st.pick === 'N8' ? 'Wajah likhein' : 'e.g. Waris: Rafiq'}"></label>
      <div class="r2"><button class="btn o" id="lt">Baad mein</button><button class="btn" id="sv" ${!D.can_edit || !st.pick || !sel().length ? 'disabled' : ''}>${idx >= 0 && idx < list.length - 1 ? 'Save · agla' : 'Save'}</button></div>
      <p class="ft" style="margin-top:0">Signal nahi? Phone par save hoga, signal aate hi jayega.</p></div>`;
  };
  const save = async (f, msg) => {
    const ups = sel().map(r => Object.assign({ bucket_id: r.id, client_ts: new Date().toISOString() }, f));
    sel().forEach(r => { if (f.later !== undefined) r.fl = 'LATER'; if (f.status) { r.st = f.status; r.rc = f.reason_code; r.rm = f.remarks || ''; r.sg = ''; if (r.fl === 'LATER' || r.fl === 'NEW') r.fl = ''; } });
    await kput('r14:' + vid, D); MYAT = 0; await enqueue('saveBuckets', { updates: ups }); toast(msg);
    const nx = list.slice(idx + 1).find(x => { const [v2, k2] = x.split('|'); const D2 = VL[v2]; const g2 = D2 && groups(D2).find(y => y.k === k2); return g2 && !g2.done; });
    if (nx) go('os-card', { key: nx, list, p: a.p }, { replace: true }); else back();
  };
  on(el, '[data-o]', 'change', c => { tick[c.dataset.o] = c.checked; draw(); });
  on(el, '[data-p]', 'click', b => { st.note = $('#nt', el).value; st.pick = b.dataset.p; draw(); });
  on(el, '[data-l]', 'click', b => { st.note = $('#nt', el).value; st.land = b.dataset.l; draw(); });
  on(el, '[data-c]', 'click', b => { const v = b.dataset.c; st.note = /: $/.test(v) ? v : (($('#nt', el).value || '').replace(/\s*$/, '') ? $('#nt', el).value.replace(/\s*$/, '; ') : '') + v; draw(); const n = $('#nt', el); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
  on(el, '#nt', 'input', t => { st.note = t.value; });
  on(el, '#sv', 'click', b => busy(b, 'Saving', async () => { if (st.pick === 'N8' && !st.note.trim()) throw new Error('N8: remark likhna zaroori hai.'); await save({ status: 'REASON', reason_code: code(), remarks: st.note.trim() }, 'Saved: ' + st.pick); }));
  on(el, '#lt', 'click', b => busy(b, 'Saving', async () => { if (!sel().some(r => !r.pk)) return back(); await save({ later: true }, 'Baad mein ke liye rakha'); }));
  draw();
} });
