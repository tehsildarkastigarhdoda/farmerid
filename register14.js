/* TehsilOS 12.1.0 — unclaimed owners register (ACR Doda).
 * Patwari: his villages, farmers clubbed (name + father), 12 reasons, bulk marking, "later", works offline (main app queue).
 * Office: freeze the DC list, PH-wise progress, village registers (PDF, A4 landscape), GQ check sheet, forwarding letter, Excel.
 * Loaded after tehsilos.js; uses the main app's helpers (api, go, VIEWS, openSheet, enqueue, kget, kput, loadPDF, loadXLSX …).
 */
"use strict";
(function () {
const V14 = '12.1.2';
const C = { ink: '#1E2226', mute: '#5B6168', line: '#ECE6DF', terra: '#9A3F1C', green: '#1F6B42', greenBg: '#E3F2E9', amber: '#8A5A0B', amberBg: '#FBEFD9', teal: '#1D4F50', tealBg: '#E6F1F1' };
const css = document.createElement('style');
css.textContent = `
.r14 .fc{background:#fff;border-radius:16px;padding:12px 14px;box-shadow:0 1px 3px rgba(30,34,38,.08);margin:0 0 10px;display:flex;gap:12px;align-items:flex-start}
.r14 .fc .ck{width:26px;height:26px;flex:none;accent-color:${C.terra};margin-top:2px}
.r14 .fc .bd{flex:1;min-width:0;cursor:pointer}.r14 .fc b{font-size:15.5px}.r14 .fc small{display:block;color:${C.mute};font-size:12.5px;margin-top:2px;word-break:break-word}
.r14 .tg{font-size:11px;font-weight:800;padding:2px 8px;border-radius:10px;margin-left:6px;white-space:nowrap}
.r14 .tg.n{color:${C.terra};background:#F6E3DA}.r14 .tg.s{color:${C.teal};background:${C.tealBg}}.r14 .tg.l{color:${C.amber};background:${C.amberBg}}.r14 .tg.c{color:#5A3E99;background:#ECE6F8}
.r14 .rm{font-size:12.5px;margin-top:6px;color:${C.green}}.r14 .rm.not{color:${C.terra}}
.r14 .why{font-size:12.5px;margin-top:6px;color:${C.teal}}
.r14 .sa{display:flex;gap:8px;margin-top:8px}.r14 .sa button{flex:1;font:inherit;font-weight:800;font-size:13.5px;padding:11px 0;border-radius:10px;border:1px solid #D9D1C7;background:#fff;color:${C.ink}}
.r14 .sa button.y{background:#2E7D4F;color:#fff;border-color:#2E7D4F}
.r14 .srch{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:12px 14px;border:1px solid #DDD5CC;border-radius:12px;margin:0 0 10px;background:#fff}
.r14 .bulk{position:fixed;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 70px);display:flex;justify-content:center;z-index:30;pointer-events:none}
.r14 .bulk div{pointer-events:auto;background:${C.ink};color:#fff;border-radius:16px;padding:10px 12px;display:flex;gap:10px;align-items:center;box-shadow:0 4px 16px rgba(0,0,0,.25);font-weight:800;font-size:14px}
.r14 .bulk button{font:inherit;font-weight:800;font-size:14px;border:0;border-radius:12px;padding:10px 14px;background:${C.terra};color:#fff}.r14 .bulk button.gh{background:#3A4046}
.r14 .vb{display:block;width:100%;text-align:left;font:inherit;background:#fff;border:0;border-radius:18px;padding:16px;box-shadow:0 1px 3px rgba(30,34,38,.08);margin:0 0 12px;color:${C.ink};cursor:pointer}
.r14 .vb b{font-size:19px;font-weight:900}.r14 .vb .big{font-size:30px;font-weight:900;color:${C.terra};line-height:1.15}
.m14 .grp{font-size:12px;font-weight:900;letter-spacing:.3px;margin:14px 0 6px}.m14 .grp.can{color:${C.green}}.m14 .grp.not{color:${C.terra}}
.m14 .pk{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid #E4DDD5;border-radius:12px;margin:0 0 6px;background:#fff;cursor:pointer}
.m14 .pk input{width:22px;height:22px;flex:none;accent-color:${C.terra};margin-top:1px}.m14 .pk b{font-size:14.5px}.m14 .pk small{display:block;color:${C.mute};font-size:12.5px}
.m14 .pk.on{border-color:${C.terra};background:#FBF3EE}
.m14 .own{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid ${C.line};font-size:13.5px}.m14 .own input{width:22px;height:22px;flex:none;accent-color:${C.terra}}
.m14 .own small{display:block;color:${C.mute};font-size:12px}
.m14 .chp{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.m14 .chp button{font:inherit;font-size:12.5px;font-weight:700;padding:7px 11px;border-radius:14px;border:1px solid #E4DDD5;background:#fff}
.m14 .chp button.on{background:${C.ink};color:#fff;border-color:${C.ink}}
.m14 .pv{font-size:13px;background:#fff;border:1px dashed #C9BFB4;border-radius:12px;padding:10px 12px;margin:10px 0;line-height:1.45}
.m14 input[type=text]{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:12px 14px;border:1px solid #DDD5CC;border-radius:12px}
.m14 .bt{display:flex;gap:8px;margin-top:12px}.m14 .bt button{flex:1;font:inherit;font-weight:800;font-size:15px;padding:14px 0;border-radius:14px;border:1px solid #D9D1C7;background:#fff;color:${C.ink}}
.m14 .bt button.y{flex:2;background:${C.terra};color:#fff;border-color:${C.terra}}.m14 .bt button[disabled]{opacity:.45}
body.noscroll .r14 .bulk{display:none}
`;
document.head.appendChild(css);
P10.reg = 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7';

/* ---------- helpers ---------- */
const N = x => Number(x || 0).toLocaleString('en-IN');
const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const dmyt = d => d ? dmy(d) + (String(d).length > 11 ? ' ' + String(d).slice(11, 16) : '') : '';
const view = () => $('#view');
const office = () => ['ADMIN', 'DA', 'NT'].indexOf(role()) >= 0;
const isOQ = () => /\bOQ\b|Office Qanungo/i.test((me() || {}).designation || '');
const NM = { mohd: 'mohammad', md: 'mohammad', muhammad: 'mohammad', mohammed: 'mohammad', mohamad: 'mohammad', gulam: 'ghulam', begam: 'begum', dei: 'devi', sing: 'singh', lall: 'lal' };
const fz = s => String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(x => x && ['sh', 'shri', 'sri', 'smt', 'mst', 'late', 's', 'o', 'd', 'w', 'so', 'do', 'wo'].indexOf(x) < 0).map(x => NM[x] || x).join(' ');
const kshort = s => { const a = String(s || '–').split(/\s*,\s*/); return a.length > 15 ? a.slice(0, 15).join(', ') + ` … (+${a.length - 15} more)` : a.join(', '); };
const firstK = s => { const m = String(s || '').match(/\d+/); return m ? Number(m[0]) : 1e9; };
const loading = t => { view().innerHTML = `<div class="t12 r14"><p class="sub">${esc(t || 'Loading…')}</p><div class="cd" style="height:90px"></div><div class="cd" style="height:140px"></div></div>`; };
const tsIST = ms => { const d = new Date(Number(ms) + 5.5 * 3600e3); return isNaN(d) ? '' : d.toISOString().slice(0, 16).replace('T', ' '); };
function remarkOf(D, r) {
  if (r.made) return { side: 'made', pick: 'M', text: 'Farmer ID made after the list date (no longer on the portal list).' };
  if (r.st === 'CLAIMED') return r.pick === 'N2' ? { side: 'not', pick: 'N2', text: 'Farmer ID made; these khasras were left out of it.' } : { side: 'can', pick: 'C0', text: 'Reported as ID made; the portal still shows it unclaimed – to be checked.' };
  if (r.st !== 'REASON' || !r.rc) return { side: '', pick: '', text: '' };
  const m = D.of[r.rc] || ['N8', ''], p = D.picks.find(x => x[0] === m[0]);
  let s = p[4], note = m[1]; if (m[0] === 'N8') { s = note || ''; note = ''; }
  if (note) s = s.replace(/\.$/, '') + ' – ' + note + '.';
  let rm = String(r.rm || '').trim();
  if (m[0] === 'N1' && /^heirs recorded/i.test(rm)) { s = 'Owner expired; heirs recorded on these khasras – his remaining share to be mutated.'; rm = rm.replace(/^heirs recorded[^;.]*[;.]?\s*/i, ''); }
  if (rm && rm !== 'Land record entry, not an individual' && s.indexOf(rm) < 0) s = (s ? s + ' ' : '') + rm + (/[.!?]$/.test(rm) ? '' : '.');
  return { side: p[1], pick: m[0], text: s || 'Other (remark not written).' };
}
function groups(D) {
  const g = {};
  D.rows.forEach(r => { r.x = remarkOf(D, r); const k = r.fam || r.id; (g[k] = g[k] || { k, n: r.n, p: r.p, rows: [] }).rows.push(r); });
  return Object.keys(g).map(k => { const x = g[k], open = x.rows.filter(r => !r.x.side);
    x.fam = x.rows.length > 1; x.names = x.rows.map(r => r.n); x.nilf = /^(nil|na|n a|none|)$/.test(fz(x.p));
    x.ew = Math.max(0, ...x.rows.filter(r => !r.x.side || r.x.side === 'can').map(r => r.ew || 0)); x.lastbro = x.rows.some(r => r.lastbro && !r.x.side); x.area = x.rows.reduce((t, r) => t + (Number(r.area) || 0), 0);
    x.open = open.length; x.done = !open.length; x.sug = open.find(r => r.sg) || null; x.isNew = x.rows.some(r => r.fl === 'NEW' && !r.x.side);
    x.later = open.length > 0 && open.every(r => r.fl === 'LATER'); x.chg = x.rows.some(r => r.chg && !r.made);
    x.kh = Array.from(new Set(x.rows.map(r => String(r.k || '')).join(',').split(/\s*,\s*/).filter(Boolean)));
    x.kh.sort((a, b) => firstK(a) - firstK(b) || a.localeCompare(b)); x.first = firstK(x.kh[0]); return x; })
    .sort((a, b) => a.first - b.first || a.n.localeCompare(b.n));
}
async function loadVill(vid, force) {
  const key = 'r14:' + vid; S.r14 = S.r14 || {};
  if (!force && S.r14[vid] && Date.now() - S.r14[vid]._at < 120000) return S.r14[vid];
  try { const D = await api('reg14List', { village_id: vid }, 60000); D._at = Date.now(); S.r14[vid] = D; try { await kput(key, D); } catch (e) {} }
  catch (e) { if (!S.r14[vid]) { try { S.r14[vid] = await kget(key); } catch (x) {} } if (!S.r14[vid]) throw e; toast('Offline – last saved list. Your marks will be sent when the signal comes.', 'info'); }
  return S.r14[vid];
}
async function loadMy(force) {
  if (!force && S.r14my && Date.now() - S.r14myAt < 60000) return S.r14my;
  try { S.r14my = await api('reg14My', {}, 60000); S.r14myAt = Date.now(); try { await kput('r14my', S.r14my); } catch (e) {} }
  catch (e) { if (!S.r14my) { try { S.r14my = await kget('r14my'); } catch (x) {} } if (!S.r14my) throw e; }
  return S.r14my;
}
/* save marks through the app's own queue: works offline, shows "waiting to send" */
async function saveMarks(D, rows, f) {
  const ts = nowIST(), ups = [], loc = [];
  rows.forEach(r => { const u = Object.assign({ bucket_id: r.id, client_ts: ts }, f); ups.push(u); loc.push({ bucket_id: r.id, fields: f });
    if (f.later !== undefined) r.fl = f.later ? 'LATER' : (r.fl === 'LATER' ? '' : r.fl);
    if (f.status) { r.st = f.status; r.rc = f.reason_code || ''; if (f.remarks !== undefined) r.rm = f.remarks; r.sg = ''; if (r.fl === 'NEW' || r.fl === 'LATER') r.fl = ''; } });
  try { await kput('r14:' + D.village_id, D); } catch (e) {}
  await enqueue('saveBuckets', { updates: ups }, loc);
  S.r14myAt = 0;
}

/* ---------- Patwari: my villages ---------- */
VIEWS.reg14 = async function () {
  setHeader('Register'); loading();
  let M; try { M = await loadMy(true); } catch (e) { view().innerHTML = `<div class="t12 r14"><p class="lead">${esc(e.message)}</p></div>`; return; }
  if (!M.list) { view().innerHTML = `<div class="t12 r14"><h1>Unclaimed owners register</h1><p class="lead">The office has not started the register yet.<br><small class="hint">Daftar ne abhi register shuru nahi kiya.</small></p></div>`; return; }
  const left = M.villages.reduce((a, v) => a + v.farmers_left, 0);
  view().innerHTML = `<div class="t12 r14"><h1>Unclaimed owners register</h1>
    <p class="sub">DC office list of ${esc(dmyt(M.list.list_at || M.list.at))}${M.due ? ' · <b style="color:' + C.terra + '">due ' + esc(dmy(M.due)) + '</b>' : ''}</p>
    <div class="note" style="background:${C.tealBg};color:${C.teal}">${left ? `<b>${N(left)} kisan baaki.</b> Har kisan ki wajah chunein – register isi se chhapega.` : '<b>Sab ho gaya ✓</b> Register chhapne ke liye taiyar hai.'}<br><small>Mark a reason against every farmer. The register prints from this.</small></div>
    ${M.villages.map(v => `<button class="vb" data-v="${esc(v.village_id)}"><div style="display:flex;justify-content:space-between;align-items:center"><b>${esc(v.name)}</b><span class="pill ${v.left ? 'ur' : 'ok'}">${v.n ? Math.round(100 * v.marked / v.n) : 0}% ho gaya</span></div>
      <div class="big">${N(v.farmers_left)} <span style="font-size:15px;color:${C.mute};font-weight:800">kisan baaki</span></div>
      <div class="bar" style="margin-top:8px"><i style="width:${v.n ? 100 * v.marked / v.n : 0}%"></i></div>
      <small class="hint">${N(v.left)} of ${N(v.n)} owners (buckets) left${v.can_mark ? '' : ' · view only'}</small></button>`).join('')}</div>`;
  $$('[data-v]').forEach(b => b.onclick = () => go('reg14v', { vid: b.dataset.v, f: 'open' }));
};

/* ---------- Patwari: one village ---------- */
VIEWS.reg14v = async function (a) {
  setHeader('Register'); loading();
  let D; try { D = await loadVill(a.vid); } catch (e) { view().innerHTML = `<div class="t12 r14"><p class="lead">${esc(e.message)}</p></div>`; return; }
  a.f = a.f || 'open'; a.q = a.q || ''; a.sel = a.sel || {}; a.lim = a.lim || 60;
  const draw = () => {
    const G = groups(D), q = a.q.trim().toLowerCase();
    const EW = G.filter(g => (g.ew > 0 || g.lastbro) && !g.done).sort((p, q) => q.lastbro - p.lastbro || q.ew - p.ew || q.area - p.area).slice(0, 25), EWk = {}; EW.forEach(g => EWk[g.k] = 1);
    const cnt = { ew: EW.length, open: G.filter(g => !g.done && !g.later).length, sug: G.filter(g => g.sug).length, new: G.filter(g => g.isNew).length, later: G.filter(g => g.later).length, done: G.filter(g => g.done).length };
    const L = a.f === 'ew' && !a.kq ? EW.filter(g => !a.q || (g.names.join(' ') + ' ' + g.p).toLowerCase().indexOf(a.q.trim().toLowerCase()) >= 0) : G.filter(g => a.kq ? g.kh.indexOf(a.kq) >= 0 : a.f === 'open' ? !g.done && !g.later : a.f === 'sug' ? !!g.sug : a.f === 'new' ? g.isNew : a.f === 'later' ? g.later : g.done)
      .filter(g => !q || (g.names.join(' ') + ' ' + g.p).toLowerCase().indexOf(q) >= 0 || g.kh.some(k => String(k).toLowerCase() === q || String(k).toLowerCase().indexOf(q + '/') === 0));
    const tot = D.rows.length, mk = D.rows.filter(r => r.x.side).length, fl = G.filter(g => !g.done).length;
    const pickL = c => { const p = D.picks.find(x => x[0] === ((D.of[c] || [])[0])); return p ? p[2] : c; };
    const card = g => { const on = !!a.sel[g.k], marked = g.rows.filter(r => r.x.side);
      return `<div class="fc">${D.can_edit && !g.done ? `<input type="checkbox" class="ck" data-s="${esc(g.k)}" ${on ? 'checked' : ''} aria-label="Select ${esc(g.n)}">` : ''}
        <div class="bd" data-g="${esc(g.k)}">${g.fam ? `<b>Family of ${esc(g.p)}</b> <span style="color:${C.mute}">· ${g.rows.length} members</span>` : `<b>${esc(g.n)}</b> <span style="color:${C.mute}">s/o ${esc(g.p || '–')}</span>`}${g.nilf ? '<span class="tg c">NO FATHER – CHECK NAME</span>' : ''}${g.lastbro ? '<span class="tg s">LAST BROTHER</span>' : ''}${g.isNew ? '<span class="tg n">NEW</span>' : ''}${g.chg ? '<span class="tg c">CHANGED</span>' : ''}${g.later ? '<span class="tg l">LATER</span>' : ''}${g.sug && !g.done ? '<span class="tg s">SUGGESTED</span>' : ''}
        ${g.fam ? `<small style="color:${C.ink}">${g.rows.map(r => esc(r.n) + (r.x.side === 'made' ? ' ✓ID' : r.x.side ? ' ✓' : '')).join(', ')}</small>` : ''}
        <small>${g.area ? (g.area < 0.01 ? '<b style="color:#8A5A0B">' + g.area.toFixed(3) + ' ha (very small)</b> · ' : g.area.toFixed(2) + ' ha · ') : ''}${g.rows.length} owner${g.rows.length > 1 ? 's' : ''} · khasra ${esc(g.kh.slice(0, 12).join(', '))}${g.kh.length > 12 ? ' …' : ''}</small>
        ${marked.length ? Array.from(new Set(marked.map(r => r.x.side + '|' + r.x.text))).slice(0, 2).map(t => `<div class="rm ${t.split('|')[0] === 'can' ? '' : 'not'}">✓ ${esc(t.split('|').slice(1).join('|'))}</div>`).join('') : ''}
        ${g.sug && !g.done ? `<div class="why"><b>App ka andaza:</b> ${esc(pickL(g.sug.sg))}${g.sug.why ? ' – ' + esc(g.sug.why) : ''}</div>` : ''}</div></div>
        ${g.sug && !g.done && D.can_edit ? `<div class="sa" style="margin:-4px 0 12px"><button class="y" data-cf="${esc(g.k)}">Sahi hai · Confirm</button><button data-g="${esc(g.k)}">Badlein · Change</button></div>` : ''}`; };
    const nSel = Object.keys(a.sel).filter(k => a.sel[k]).length;
    const KH = {}; if (a.f === 'kh' && !a.kq) D.rows.forEach(r => String(r.k || '').split(/\s*,\s*/).filter(Boolean).forEach(k => { const x = KH[k] = KH[k] || { k, n: 0, left: 0 }; x.n++; if (!r.x.side) x.left++; }));
    const KL = Object.keys(KH).map(k => KH[k]).filter(x => !q || String(x.k).toLowerCase().indexOf(q) === 0).sort((x, y) => firstK(x.k) - firstK(y.k) || String(x.k).localeCompare(String(y.k)));
    const body = a.kq ? `<div class="note" style="background:#fff;display:flex;justify-content:space-between;align-items:center"><span><b>Khasra ${esc(a.kq)}</b> · ${N(L.reduce((x, g) => x + g.rows.length, 0))} owners</span><button class="btn12 gh" id="kb" style="padding:8px 12px;font-size:13px">‹ Khasra list</button></div>` + L.map(card).join('')
      : a.f === 'kh' ? `<div class="cd" style="padding:4px 14px">${KL.slice(0, a.lim).map(x => `<button class="row" data-k="${esc(x.k)}"><span>Khasra ${esc(x.k)}<small>${N(x.n)} owners${x.left ? ' · ' + N(x.left) + ' baaki' : ' · ho gaya ✓'}</small></span><span>›</span></button>`).join('')}</div>${KL.length > a.lim ? `<button class="btn12 gh" id="more" style="width:100%">Aur dikhayein (${N(KL.length - a.lim)} more)</button>` : ''}`
      : (L.length ? L.slice(0, a.lim).map(card).join('') : `<p class="lead" style="text-align:center;color:${C.mute}">${a.q ? 'Koi nahi mila.' : a.f === 'open' ? 'Sab ho gaya ✓' : 'Kuch nahi.'}</p>`) + (L.length > a.lim ? `<button class="btn12 gh" id="more" style="width:100%">Aur dikhayein (${N(L.length - a.lim)} more)</button>` : '');
    view().innerHTML = `<div class="t12 r14"><h1>${esc(D.name)}</h1>
      <p class="sub">${N(fl)} kisan baaki · ${N(mk)} of ${N(tot)} owners marked${D.due ? ' · due ' + esc(dmy(D.due)) : ''}${D.can_edit ? '' : ' · view only'}</p>
      <div class="bar" style="margin:0 0 12px"><i style="width:${tot ? 100 * mk / tot : 0}%"></i></div>
      <input class="srch" id="q" type="search" placeholder="${a.f === 'kh' ? 'Khasra no. likhein' : 'Naam ya khasra no. likhein · Search'}" value="${esc(a.q)}" aria-label="Search by name or khasra">
      <div class="chips">${[['ew', 'Aaj ke 25'], ['open', 'Baaki'], ['sug', 'App ka andaza'], ['new', 'Naye'], ['later', 'Baad mein'], ['done', 'Ho gaya'], ['kh', 'Khasra-wise']].map(c => `<button data-f="${c[0]}" class="${a.f === c[0] && !a.kq ? 'on' : ''}">${c[1]}${cnt[c[0]] !== undefined ? ' ' + cnt[c[0]] : ''}</button>`).join('')}</div>
      ${a.f === 'sug' && D.can_edit && cnt.sug ? `<p class="hint">Andaza sahi ho to "Confirm" dabayein. Galat ho to "Change".</p>` : ''}
      ${body}
      ${nSel ? `<div class="bulk"><div><span>${nSel} chune</span><button id="bm">Ek saath wajah</button><button class="gh" id="bc">Hatayein</button></div></div>` : ''}</div>`;
    const qi = $('#q'); qi.oninput = () => { a.q = qi.value; clearTimeout(draw._t); draw._t = setTimeout(() => { draw(); const n = $('#q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 350); };
    $$('[data-f]').forEach(b => b.onclick = () => { a.f = b.dataset.f; a.kq = ''; a.lim = 60; draw(); });
    $$('[data-k]').forEach(b => b.onclick = () => { a.kq = b.dataset.k; a.q = ''; draw(); window.scrollTo(0, 0); });
    if ($('#kb')) $('#kb').onclick = () => { a.kq = ''; draw(); };
    $$('[data-s]').forEach(c => c.onchange = () => { a.sel[c.dataset.s] = c.checked; draw(); });
    $$('[data-g]').forEach(c => c.onclick = () => markSheet(D, G.filter(g => g.k === c.dataset.g), L, draw, a));
    $$('[data-cf]').forEach(c => c.onclick = async () => { const g = G.find(x => x.k === c.dataset.cf); const rows = g.rows.filter(r => !r.x.side && r.sg);
      const code = rows[0].sg, same = rows.filter(r => r.sg === code), heirs = code === 'A02' && /heirs recorded/i.test(rows[0].why || '');
      await saveMarks(D, same, Object.assign({ status: 'REASON', reason_code: code }, heirs ? { remarks: 'Heirs recorded, share left' } : {})); toast('Saved: ' + pickL(code)); draw(); });
    if ($('#more')) $('#more').onclick = () => { a.lim += 60; draw(); };
    if ($('#bm')) $('#bm').onclick = () => markSheet(D, G.filter(g => a.sel[g.k]), null, draw, a);
    if ($('#bc')) $('#bc').onclick = () => { a.sel = {}; draw(); };
  };
  draw();
};

/* ---------- mark one farmer, or several together ---------- */
function markSheet(D, gs, list, redraw, a) {
  if (!D.can_edit) return info('Only the Patwari of this halqa marks reasons here.');
  const rows = []; gs.forEach(g => g.rows.forEach(r => { if (!r.made) rows.push(r); }));
  const anyOpen = rows.some(r => !r.x.side), tick = {}; rows.forEach(r => tick[r.id] = !r.x.side || (gs.length === 1 && !anyOpen));
  const cur = rows.find(r => r.x.side && r.rc) || null, curPick = cur ? (D.of[cur.rc] || [])[0] : '';
  const st = { pick: curPick || '', land: cur && D.of[cur.rc] && (D.of[cur.rc][0] === 'N4') ? cur.rc : 'A05', note: gs.length === 1 && cur ? String(cur.rm || '').replace('Land record entry, not an individual', '') : '' };
  const CH = { C1: ['Camp ki tareekh pata hai'], C2: ['Aayega', 'OTP dega', 'Jammu mein', 'Doda mein'], N1: ['Heirs recorded, share left', 'Waris: ', 'Intqal pending'], N3: ['Kai saal se pata nahi'], N5: ['Jammu mein', 'Bahar naukri'],
    N6: ['Bahut budhe', 'Lakwa'], N7: ['Jammu mein rehta', 'Shaadi ke baad bahar', 'Bahar naukri'], N8: ['Zameen bik gayi, intqal nahi', 'Court case', 'Nabalig', 'Consent se inkaar'] };
  const one = gs.length === 1, title = one ? (gs[0].fam ? `Family of ${gs[0].p} · ${gs[0].rows.length} members` : `${gs[0].n} s/o ${gs[0].p || '–'}`) : `${gs.length} cards together`;
  const idx = list && one ? list.findIndex(g => g.k === gs[0].k) : -1;
  const code = () => st.pick === 'N4' ? st.land : (D.picks.find(p => p[0] === st.pick) || [])[5];
  const preview = () => { if (!st.pick) return ''; const r = remarkOf(D, { st: 'REASON', rc: code(), rm: st.note }); return r.text; };
  const sel = () => rows.filter(r => tick[r.id]);
  openSheet(() => ({ html: `<div class="m14"><div class="snav"><button id="x">Close</button><span></span><span></span></div>
    <h2 class="nm">${esc(title)}</h2>
    <p class="hint">${one ? 'Ek wajah sab tick kiye owners par lagegi. Alag owner ho to uska tick hatayein (split).' : 'Ek wajah sab chune hue kisanon par lagegi.'}<br>One reason for all ticked owners. Untick an owner who is different.</p>
    <div class="cd" style="padding:6px 14px">${rows.map(r => `<label class="own"><input type="checkbox" data-o="${esc(r.id)}" ${tick[r.id] ? 'checked' : ''}><span>${rows.length > 1 ? '<b>' + esc(r.n) + '</b> s/o ' + esc(r.p) + ' · ' : ''}khasra ${esc(kshort(r.k))}<small>${r.x.side ? '✓ ' + esc(r.x.text) : 'Not marked'}${r.inl ? '' : ' · new on the portal after the register list'}</small></span></label>`).join('')}</div>
    <div class="grp can">ID BAN SAKTI HAI · CAN BE CLAIMED</div>
    ${D.picks.filter(p => p[1] === 'can').map(p => pk(p)).join('')}
    <div class="grp not">ID NAHI BAN SAKTI · CANNOT BE CLAIMED</div>
    ${D.picks.filter(p => p[1] === 'not').map(p => pk(p)).join('')}
    <label style="display:block;font-weight:800;font-size:13px;margin:12px 0 6px" for="nt">${st.pick === 'N8' ? 'Remark (zaroori) · required' : 'Chhota note (agar zaroori ho) · optional'}</label>
    <input type="text" id="nt" maxlength="120" value="${esc(st.note)}" placeholder="${st.pick === 'N8' ? 'Wajah likhein' : 'e.g. Waris: Rafiq'}">
    ${CH[st.pick] ? `<div class="chp">${CH[st.pick].map(c => `<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    ${st.pick ? `<div class="pv"><b>Register mein likha jayega:</b><br>${esc(preview())}</div>` : ''}
    <div class="bt"><button id="lt">Baad mein</button><button class="y" id="sv" ${!st.pick || !sel().length || (st.pick === 'N8' && !st.note.trim()) ? 'disabled' : ''}>${one && list ? 'Save · agla kisan' : 'Save'}</button></div>
    <p class="hint" style="text-align:center;margin-top:8px">Signal na ho to bhi save hoga; baad mein apne aap chala jayega.</p></div>`,
    mount: e => {
      $('#x', e).onclick = () => closeSheet();
      $$('[data-o]', e).forEach(c => c.onchange = () => { tick[c.dataset.o] = c.checked; drawSheet(); });
      $$('[data-p]', e).forEach(c => c.onclick = () => { st.pick = c.dataset.p; st.note = $('#nt', e).value; drawSheet(); });
      $$('[data-l]', e).forEach(c => c.onclick = () => { st.land = c.dataset.l; st.note = $('#nt', e).value; drawSheet(); });
      $$('[data-c]', e).forEach(c => c.onclick = () => { const v = c.dataset.c; st.note = /: $/.test(v) ? v : (st.note ? st.note.replace(/\s*$/, '; ') : '') + v; drawSheet(); setTimeout(() => { const n = $('#nt'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 50); });
      const nt = $('#nt', e); nt.oninput = () => { st.note = nt.value; const pv = $('.pv', e); if (pv) pv.innerHTML = '<b>Register mein likha jayega:</b><br>' + esc(preview()); const sv = $('#sv', e); sv.disabled = !st.pick || !sel().length || (st.pick === 'N8' && !st.note.trim()); };
      $('#lt', e).onclick = async () => { const rs = sel().filter(r => !r.x.side); if (rs.length) await saveMarks(D, rs, { later: true }); closeSheet(() => { toast('Baad mein ke liye rakha'); redraw(); }); };
      $('#sv', e).onclick = async () => { const rs = sel(); if (!rs.length || !st.pick) return;
        const f = { status: 'REASON', reason_code: code(), remarks: st.note.trim() };
        await saveMarks(D, rs, f); if (a && a.sel) gs.forEach(g => delete a.sel[g.k]);
        const label = (D.picks.find(p => p[0] === st.pick) || [])[2];
        closeSheet(() => { toast('Saved: ' + label); redraw();
          if (one && list && idx >= 0) { const nx = groups(D).filter(g => !g.done && !g.later && g.k !== gs[0].k && g.first >= gs[0].first)[0]; if (nx) setTimeout(() => markSheet(D, [nx], list, redraw, a), 250); } }); };
    } }));
  function pk(p) { return `<div class="pk ${st.pick === p[0] ? 'on' : ''}" data-p="${p[0]}" role="radio" aria-checked="${st.pick === p[0]}" tabindex="0"><input type="radio" name="pk" ${st.pick === p[0] ? 'checked' : ''} tabindex="-1" aria-hidden="true"><span><b>${esc(p[2])}</b><small>${esc(p[3])}</small></span></div>`
    + (p[0] === 'N4' && st.pick === 'N4' ? `<div class="chp" style="margin:0 0 8px 32px">${D.land.map(l => `<button data-l="${l[0]}" class="${st.land === l[0] ? 'on' : ''}">${esc(l[1])}</button>`).join('')}</div>` : ''); }
}

/* ---------- office ---------- */
async function loadSum(force) { if (!force && S.r14sum && Date.now() - S.r14sumAt < 60000) return S.r14sum; S.r14sum = await api('reg14Sum', {}, 60000); S.r14sumAt = Date.now(); return S.r14sum; }
VIEWS.reg14o = async function () {
  wideOn('Register for ACR'); loading();
  let D; try { D = await loadSum(true); } catch (e) { view().innerHTML = `<div class="t12 r14"><p class="lead">${esc(e.message)}</p></div>`; return; }
  const L = D.list, la = D.last, adm = role() === 'ADMIN', canUp = adm || role() === 'DA';
  const phs = Array.from(new Set(D.villages.map(v => v.ph || '—')));
  const sm = (vs, k) => vs.reduce((a, v) => a + (v[k] || 0), 0);
  const T = { n: sm(D.villages, 'n'), marked: sm(D.villages, 'marked'), left: sm(D.villages, 'left'), made: sm(D.villages, 'made'), can: sm(D.villages, 'can'), not: sm(D.villages, 'not') };
  view().innerHTML = `<div class="t12 r14"><h1>Unclaimed owners register</h1><p class="sub">For ACR Doda · reasons and remarks against each bucket · signed by Patwari, GQ ${esc(D.gq)} and Naib Tehsildar</p>
    <div class="cd"><h3>Register list${L ? `<span class="pill ok">Frozen</span>` : '<span class="pill ur">Not set</span>'}</h3>
      ${L ? `<p class="lead" style="margin:0 0 6px">DC office list of <b>${esc(dmyt(L.list_at || L.at))}</b> · ${N(L.n)} buckets · ${L.villages} villages${L.missing ? ` · <span style="color:${C.terra}">${N(L.missing)} not in the app</span>` : ''}</p><p class="hint">Frozen ${esc(dmyt(L.at))} by ${esc(L.by || '')}. Later hourly uploads do not change this list; Patwari marks keep flowing into it.</p>` : '<p class="lead">Upload the unclaimed bucket list received from the DC office to start the register.</p>'}
      ${canUp ? `<label class="btn12" style="display:block;margin-top:10px;cursor:pointer">${L ? 'Freeze a newer DC list' : 'Upload the DC list and freeze it'}<input type="file" id="fl" accept=".xlsx,.xls" hidden></label>
      <label class="hint" style="display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" id="mg" checked style="width:20px;height:20px;accent-color:${C.terra}">Also merge it into Farmer ID (sorting kept, gone = ID made)</label>` : ''}</div>
    ${la ? `<div class="cd"><h3>Last list upload · what the app did</h3><p class="hint" style="margin:0 0 8px">${esc(dmyt(la.at))}</p>
      <div class="g2" style="margin:0"><div class="k"><b>${N(la.carried)}</b><span>Marks carried to re-issued Bucket IDs</span></div><div class="k"><b>${N(la.changed)}</b><span>Details changed on the portal (recheck)</span></div>
      <div class="k"><b>${N(la.sug14)}</b><span>New guesses for Patwaris to confirm</span></div><div class="k"><b>${N(T.made)}</b><span>ID made since the register list</span></div></div></div>` : ''}
    ${L ? `<div class="g2"><div class="k"><b>${N(T.n)}</b><span>Buckets in the register</span></div><div class="k"><b style="color:${T.left ? C.terra : C.green}">${N(T.left)}</b><span>Not yet marked</span></div>
      <div class="k"><b>${N(T.can)}</b><span>Can be claimed</span></div><div class="k"><b>${N(T.not)}</b><span>Cannot be claimed</span></div></div>
    ${phs.map(ph => { const vs = D.villages.filter(v => (v.ph || '—') === ph), n = sm(vs, 'n'), mk = sm(vs, 'marked'), p = n ? Math.round(100 * mk / n) : 0;
      return `<div class="cd"><h3><span>PH ${esc(ph)}${vs[0].patwari ? ' · ' + esc(vs[0].patwari) : ''}</span><span class="pill ${p >= 100 ? 'ok' : p >= 80 ? 'wt' : 'ur'}">${p}% marked</span></h3>
        ${vs.map(v => `<div class="row" style="cursor:default;flex-wrap:wrap"><span>${esc(v.name)}<small>${N(v.n)} buckets · ${N(v.left)} not marked · ${N(v.can)} can · ${N(v.not)} cannot${v.made ? ' · ' + N(v.made) + ' ID made since' : ''}${v.auto ? ' · ' + N(v.auto) + ' by the app' : ''}</small>
            ${v.dc_un != null && v.dc_un !== v.n ? `<small style="color:${C.terra}">Check: DC figure ${N(v.dc_un)} unclaimed${v.dc_as_on ? ' (as on ' + esc(dmy(v.dc_as_on)) + ')' : ''} vs ${N(v.n)} in the register – differs by ${N(Math.abs(v.dc_un - v.n))}</small>` : v.dc_un != null ? `<small style="color:${C.green}">Matches the DC figure ✓</small>` : ''}
            ${v.fam && v.fam.families ? `<small>${N(v.fam.families)} families: ${N(v.fam.some)} with a member's ID made · ${N(v.fam.none)} with none${v.fam.done ? ' · ' + N(v.fam.done) + ' now complete' : ''}</small>` : ''}</span>
          <span class="acts" style="flex:none"><button class="btn12 ${v.left ? 'gh' : ''}" data-pr="${esc(v.village_id)}" style="min-width:0;padding:9px 12px;font-size:13px">Register PDF</button><button class="btn12 gh" data-cl="${esc(v.village_id)}" style="min-width:0;padding:9px 12px;font-size:13px">Camp list</button></span></div>`).join('')}
        <div class="acts" style="margin-top:8px"><button class="btn12 gh" data-ph="${esc(ph)}">All ${vs.length} village PDFs</button><button class="btn12 gh" data-gq="${esc(ph)}">GQ check sheet</button></div></div>`; }).join('')}
    <div class="cd"><h3>For ACR Doda</h3>
      <button class="row" id="lt"><span>Forwarding letter (PDF)<small>Village-wise summary · Tehsildar's signature</small></span><span>›</span></button>
      <button class="row" id="xl"><span>Excel copy<small>Every register line, one sheet per village</small></span><span>›</span></button>
      <button class="row" id="fu"><span>Follow-up report (PDF)<small>IDs made since the register list, by the reason marked</small></span><span>›</span></button></div>
    ${adm ? `<div class="cd"><h3>Settings</h3><div class="s12"><label for="du">Patwaris to finish marking by</label><input type="date" id="du" value="${esc(S.r14my && S.r14my.due || '')}">
      <label for="gq">Girdawar Qanungo (as printed)</label><input type="text" id="gq" value="${esc(D.gq)}"></div><button class="btn12 gh" id="ss" style="margin-top:10px">Save</button></div>` : ''}` : ''}</div>`;
  if ($('#fl')) $('#fl').onchange = e => { const f = e.target.files[0]; if (f) freezeFile(f, $('#mg').checked); e.target.value = ''; };
  $$('[data-pr]').forEach(b => b.onclick = () => busy(b, 'Making', () => regPDF(b.dataset.pr)));
  $$('[data-ph]').forEach(b => b.onclick = () => busy(b, 'Making', async () => { for (const v of D.villages.filter(v => (v.ph || '—') === b.dataset.ph)) await regPDF(v.village_id, true); toast('PDFs downloaded'); }));
  $$('[data-gq]').forEach(b => b.onclick = () => busy(b, 'Making', () => gqPDF(D.villages.filter(v => (v.ph || '—') === b.dataset.gq), b.dataset.gq)));
  if ($('#lt')) $('#lt').onclick = () => busy($('#lt'), 'Making', () => letterPDF(D));
  if ($('#xl')) $('#xl').onclick = () => busy($('#xl'), 'Making', () => excelAll(D));
  if ($('#fu')) $('#fu').onclick = () => busy($('#fu'), 'Making', () => followPDF(D));
  $$('[data-cl]').forEach(b => b.onclick = () => busy(b, 'Making', () => campPDF(b.dataset.cl)));
  const bad = D.villages.filter(v => v.dc_un != null && v.dc_un !== v.n); if ($('#lt') && bad.length) { const o = $('#lt').onclick; $('#lt').onclick = () => { if (confirm(`${bad.length} village(s) do not match the DC figure (${bad.map(v => v.name).join(', ')}). Make the letter anyway?`)) o(); }; }
  if ($('#ss')) $('#ss').onclick = () => busy($('#ss'), 'Saving', async () => { await api('reg14Set', { due: $('#du').value, gq: $('#gq').value }); S.r14myAt = 0; toast('Saved'); render(); });
  if (adm) { try { const M = await loadMy(); if ($('#du') && M.due) $('#du').value = M.due; } catch (e) {} }
};
async function freezeFile(f, merge) {
  try {
    await loadXLSX(); const wb = XLSX.read(await f.arrayBuffer(), { type: 'array', raw: true }); const out = {}, rows6 = [];
    wb.SheetNames.forEach(sn => { const A = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: false, defval: '' }); const h = A.findIndex(r => r.some(c => /^\s*bucket\s*id\s*$/i.test(String(c)))); if (h < 0) return;
      const H = A[h].map(c => String(c).trim().toLowerCase()), ix = n => H.indexOf(n);
      const I = { id: ix('bucket id'), lgd: ix('village lgd code'), vn: ix('village name'), sv: ix('survey number'), ss: ix('sub survey number'), fn: ix('farmer name'), mb: ix('farmer mobile number'), id2: ix('identifier name') };
      if ([I.id, I.lgd, I.vn, I.sv, I.fn, I.id2].some(x => x < 0)) throw new Error(sn + ': some columns of the DC list are missing.');
      for (let i = h + 1; i < A.length; i++) { const r = A[i], id = String(r[I.id] || '').trim(); if (!id) continue; const g = k => String(I[k] >= 0 ? r[I[k]] : '').trim();
        rows6.push([id, g('lgd'), g('vn'), g('sv'), g('fn'), g('id2')]);
        const o = out[id] = out[id] || { lgd: g('lgd'), vn: g('vn'), sv: [], ss: [], mb: [], fn: g('fn'), id2: g('id2') };
        if (g('sv') && o.sv.indexOf(g('sv')) < 0) o.sv.push(g('sv')); if (o.ss.indexOf(g('ss')) < 0) o.ss.push(g('ss')); if (o.mb.indexOf(g('mb')) < 0) o.mb.push(g('mb')); } });
    const ids = Object.keys(out); if (!ids.length) throw new Error('This is not the DC office unclaimed bucket list (no "Bucket ID" column).');
    const m = f.name.match(/(\d{13})/), fts = m ? m[1] : '', at = fts ? tsIST(fts) : '';
    const snap = ids.map(id => { const o = out[id]; o.sv.sort((a, b) => firstK(a) - firstK(b) || a.localeCompare(b));
      return [id, o.lgd, o.vn, o.sv.join(', '), o.ss.filter(x => x !== '').join(', '), o.mb.filter(x => x !== '').join(', '), o.fn, o.id2]; });
    const vc = {}; snap.forEach(s => vc[s[2]] = (vc[s[2]] || 0) + 1);
    openSheet(() => ({ html: `<div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">Freeze this list for the register?</h2>
      <p class="lead">${esc(f.name)}<br><b>${N(ids.length)} buckets</b> (${N(rows6.length)} rows) · list of ${esc(dmyt(at) || 'unknown time')}</p>
      <div class="cd">${Object.keys(vc).sort().map(v => `<div class="row" style="cursor:default"><span>${esc(v)}</span><b>${N(vc[v])}</b></div>`).join('')}</div>
      <p class="hint">${merge ? 'First the list is merged into Farmer ID: Patwari marks are kept, buckets gone from the list are taken as ID made, and the app sorts what it can. Then it is frozen as the register list.' : 'The list is frozen as the register list only (it is already uploaded in Farmer ID).'}</p>
      <button class="btn btn-primary" id="go">Merge and freeze</button>`,
      mount: e => { $('#x', e).onclick = () => closeSheet(); if (!merge) $('#go', e).textContent = 'Freeze';
        $('#go', e).onclick = () => closeSheet(() => freezeRun(f, merge, rows6, snap, fts, at)); } }));
  } catch (e) { fail(e.message); }
}

/* merge village by village, then freeze; runs as a task so the result stays on screen. A slow village does not stop the others. */
function freezeRun(f, merge, rows6, snap, fts, at) {
  const byL = {}; rows6.forEach(r => (byL[r[1]] = byL[r[1]] || []).push(r));
  const ks = Object.keys(byL).sort((a, b) => byL[a].length - byL[b].length);
  const steps = (merge ? ks.map(k => 'Merging ' + (byL[k][0][2] || k) + ' (' + N(byL[k].length) + ' rows)') : []).concat(['Freezing the register list', 'App guesses for the Patwaris']);
  return runTask('Register list · ' + f.name.slice(0, 40), steps, async (step, task) => {
    const notes = []; let i = 0;
    if (merge) for (; i < ks.length; i++) { step(i); const vn = byL[ks[i]][0][2] || ks[i];
      try { const r = await api('uploadApply', { rows: byL[ks[i]], file_ts: fts, more: i < ks.length - 1 }, 24e4);
        (r.villages || []).forEach(v => { try { delete S.buckets[v.lgd]; delete S.fetchedAt[v.lgd]; kdel('b:' + v.lgd); } catch (x) {} if (v.blocked) notes.push(vn + ': not merged – ' + ((v.warnings || [])[0] || 'a newer list is already in the app') + ' (fine)'); }); }
      catch (x) { notes.push(vn + ': ' + (/time|network|fetch|internet/i.test(x.message) ? 'slow – the server finishes it on its own' : x.message)); } }
    step(i); let x;
    for (let t = 0; t < 3; t++) { try { x = await api('reg14Freeze', { snap, file_ts: fts, list_at: at, file_name: f.name }, 24e4); break; }
      catch (y) { if (t === 2 || !/time|network|fetch|internet|busy|lock/i.test(y.message)) throw y; await new Promise(r => setTimeout(r, 20000)); } }
    step(i + 1); let g = null; try { g = await api('reg14Guess', {}, 24e4); } catch (y) { notes.push('App guesses: will run with the next upload or from the register screen'); }
    S.r14 = {}; S.r14myAt = 0; S.r14sumAt = 0; setTimeout(() => { const c = current(); if (c && c.name === 'reg14o') render(); }, 300);
    return { msg: `Register list frozen ✓ ${N(x.n)} buckets, ${x.villages} villages${x.missing ? ' · ' + N(x.missing) + ' not in the app' : ''}${g ? ' · ' + N(g.sug14) + ' guesses for Patwaris' : ''}${notes.length ? ' · ' + notes.join(' · ') : ''}` };
  });
}
/* errors in tasks show where they came from, so a screenshot is enough to fix them */
const _rt14 = runTask;
runTask = function (t, s, a) { return _rt14(t, s, async (...x) => { try { return await a(...x); } catch (e) {
  if (e && /Cannot read|is not a function|undefined|null/.test(e.message || '') && e.stack && !/\]$/.test(e.message)) { const w = String(e.stack).split('\n').slice(1, 3).map(l => l.trim().replace(/^at /, '').replace(/\(?(?:https?|file):\/\/[^)]*\/([^/):?]+)(?:\?[^:]*)?:(\d+):(\d+)\)?/, '$1:$3')).join(' < '); try { e.message += ' [' + w + ']'; } catch (z) {} }
  throw e; } }); };

/* ---------- PDFs ---------- */
const SHORT = { N1: 'Expired, mutation not attested', N2: 'ID already made, can\'t be made for these khasras', N3: 'Missing / untraceable', N4: 'State land', N5: 'Mobile not linked, not in village', N6: 'Paralysed / very old / face fails', N7: 'Residing outside, not coming for biometric', N8: 'Other reasons' };
const dl = (doc, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(doc.output('blob')); a.download = name; document.body.appendChild(a); a.click(); a.remove(); };
async function regPDF(vid, quiet) {
  const R = await api('reg14Reg', { village_id: vid }, 90000); await loadPDF();
  const doc = new jspdf.jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' }), W = 297, tx = pdfText, c = R.count;
  const listAt = R.list ? dmy(R.list.list_at || R.list.at) : '';
  doc.setFont('times', 'bold'); doc.setFontSize(12.5); const t1 = tx('Register of unclaimed buckets – Farmer ID (Agristack) with reasons and remarks');
  doc.text(t1, W / 2, 12, { align: 'center' }); const tw = doc.getTextWidth(t1); doc.setLineWidth(0.3); doc.line(W / 2 - tw / 2, 13, W / 2 + tw / 2, 13);
  doc.setFont('times', 'normal'); doc.setFontSize(10.5);
  doc.text(tx(`Village: ${R.name} (LGD ${R.lgd})  ·  Patwar Halqa: ${R.ph || '-'}  ·  As per unclaimed bucket list received from DC office${listAt ? ' on ' + listAt : ''}`), W / 2, 18.5, { align: 'center' });
  const pk = Object.assign({}, ...R.picks.map(p => ({ [p[0]]: p[2] })));
  const notTxt = R.picks.filter(p => p[1] === 'not').map(p => `${SHORT[p[0]]} ${N((c.picks[p[0]] || 0) + (p[0] === 'N2' ? 0 : 0))}`).join('; ');
  doc.autoTable({ startY: 22, theme: 'grid', styles: { font: 'times', fontSize: 9.5, cellPadding: 1.3, lineColor: 0, lineWidth: 0.2, textColor: 0 }, margin: { left: 10, right: 10 },
    body: [[`Unclaimed buckets: ${N(c.n)}`, `Can be claimed: ${N(c.can)}`, `Cannot be claimed: ${N(c.not)}`, `ID made since the list: ${N(c.made)}`, `Not yet marked: ${N(c.left)}`], [{ content: tx('Cannot be claimed – ' + notTxt), colSpan: 5 }]].map(r => r.map(x => typeof x === 'string' ? tx(x) : x)) });
  doc.autoTable({ startY: doc.lastAutoTable.finalY + 2, theme: 'grid', margin: { left: 10, right: 10, bottom: 17 }, showHead: 'everyPage', rowPageBreak: 'avoid',
    styles: { font: 'times', fontSize: 8.6, cellPadding: 1.1, lineColor: 0, lineWidth: 0.2, textColor: 0, valign: 'top', overflow: 'linebreak' },
    headStyles: { fillColor: [235, 235, 235], textColor: 0, fontStyle: 'bold', halign: 'center', valign: 'middle' },
    columnStyles: { 0: { cellWidth: 9, halign: 'center' }, 1: { cellWidth: 33, fontSize: 6.8, font: 'courier' }, 2: { cellWidth: 13, halign: 'center' }, 3: { cellWidth: 17, halign: 'center' }, 4: { cellWidth: 48 }, 5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 28 }, 7: { cellWidth: 16, halign: 'center' }, 8: { cellWidth: 28 }, 9: { cellWidth: 73 } },
    head: [['S.No', 'Bucket ID', 'Village LGD Code', 'Village Name', 'Survey Number(s)', 'Sub Survey No.', 'Farmer Name', 'Farmer Mobile No.', 'Identifier Name', 'Reason / remarks']],
    body: R.rows.map((r, i) => [String(i + 1), r.id, r.lgd, r.village, r.surveys, r.subs, r.farmer, r.mob, r.ident, r.remark || 'Not marked: ______________________________'].map(tx)),
    didParseCell: d => { if (d.section === 'body' && d.column.index === 9 && !R.rows[d.row.index].remark) d.cell.styles.fontStyle = 'italic'; } });
  let y = doc.lastAutoTable.finalY + 8; if (y > 175) { doc.addPage(); y = 25; }
  doc.setFontSize(10.5); doc.setFont('times', 'normal'); doc.text(tx('Certified that the reasons and remarks recorded above have been verified.'), 10, y); y += 22;
  const cols = [[`Patwari`, `Halqa ${R.ph || ''}`], ['Girdawar Qanungo', R.gq], ['Naib Tehsildar', 'Kastigarh']], cw = (W - 20) / 3;
  cols.forEach((s, i) => { const x = 10 + cw * i + 12, w = cw - 24; doc.setLineWidth(0.3); doc.line(x, y, x + w, y); doc.setFont('times', 'bold'); doc.text(tx(s[0]), x + w / 2, y + 5, { align: 'center' }); doc.setFont('times', 'normal'); doc.text(tx(s[1]), x + w / 2, y + 10, { align: 'center' }); });
  const n = doc.getNumberOfPages(), gen = 'Generated by TehsilOS on ' + dmyt(R.at) + ' · one line per bucket; all survey numbers of the bucket shown together';
  for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8.5); doc.text('Patwari ________________          Girdawar Qanungo ________________          Naib Tehsildar ________________', W / 2, 200.5, { align: 'center' });
    doc.setFontSize(7.5); doc.setTextColor(70); doc.text(tx(gen + ' - ' + R.name), 10, 205); doc.text(`Page ${i} of ${n}`, W - 10, 205, { align: 'right' }); doc.setTextColor(0); }
  const name = `Register – ${R.name} – unclaimed buckets – ${listAt || dmy(R.at)}.pdf`;
  if (quiet) dl(doc, name); else deliverPDF(doc, name);
}
/* GQ: 20 marked lines per village, picked at random, to check on the spot before signing */
async function gqPDF(vs, ph) {
  await loadPDF(); const doc = new jspdf.jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' }), tx = pdfText; let first = true;
  for (const v of vs) { const R = await api('reg14Reg', { village_id: v.village_id }, 90000);
    let seed = Number(String(R.at).replace(/\D/g, '').slice(0, 8)) || 1; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const M = R.rows.map((r, i) => Object.assign({ i: i + 1 }, r)).filter(r => r.side === 'can' || r.side === 'not'), P = [];
    while (P.length < Math.min(20, M.length)) { const k = Math.floor(rnd() * M.length); if (P.indexOf(M[k]) < 0) P.push(M[k]); }
    P.sort((a, b) => a.i - b.i); if (!first) doc.addPage(); first = false;
    doc.setFont('times', 'bold'); doc.setFontSize(12.5); doc.text(tx(`GQ check sheet – ${R.name} (PH ${R.ph || ph}) – ${P.length} lines picked at random from the register`), 148, 12, { align: 'center' });
    doc.setFont('times', 'normal'); doc.setFontSize(10); doc.text(tx('Check each line on the spot before signing the register. Write Yes if the remark is correct; if not, write what is correct.'), 148, 18, { align: 'center' });
    doc.autoTable({ startY: 22, theme: 'grid', margin: { left: 10, right: 10 }, styles: { font: 'times', fontSize: 9, cellPadding: 1.4, lineColor: 0, lineWidth: 0.2, textColor: 0, valign: 'top' },
      headStyles: { fillColor: [235, 235, 235], textColor: 0, fontStyle: 'bold' }, columnStyles: { 0: { cellWidth: 14 }, 1: { cellWidth: 46 }, 2: { cellWidth: 32 }, 3: { cellWidth: 32 }, 4: { cellWidth: 80 }, 5: { cellWidth: 18 }, 6: { cellWidth: 55 } },
      head: [['Reg. S.No', 'Survey Number(s)', 'Farmer Name', 'Identifier Name', 'Remark in the register', 'Correct?', 'GQ remarks']],
      body: P.map(r => [String(r.i), r.surveys, r.farmer, r.ident, r.remark, '', ''].map(tx)) });
    const y = Math.min(doc.lastAutoTable.finalY + 20, 195); doc.line(220, y, 287, y); doc.setFont('times', 'bold'); doc.text(tx('Girdawar Qanungo ' + R.gq), 253.5, y + 5, { align: 'center' }); }
  deliverPDF(doc, `GQ check sheet – PH ${ph}.pdf`);
}
async function letterPDF(D) {
  await loadPDF(); const doc = new jspdf.jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }), W = 210, tx = pdfText, L = D.list || {};
  const listAt = dmy(L.list_at || L.at); let y = 16;
  doc.setFont('times', 'bold'); doc.setFontSize(13); doc.text('OFFICE OF THE TEHSILDAR KASTIGARH', W / 2, y, { align: 'center' }); y += 10;
  doc.setFont('times', 'normal'); doc.setFontSize(11.5); doc.text('No. ____________________', 18, y); doc.text('Dated: ____________', W - 18, y, { align: 'right' }); y += 10;
  doc.text('To', 18, y); y += 6; doc.text('The Assistant Commissioner Revenue,', 28, y); y += 5.5; doc.text('Doda.', 28, y); y += 10;
  doc.setFont('times', 'bold'); const sub = doc.splitTextToSize(tx(`Subject: Reasons and remarks against unclaimed buckets – Farmer ID (Agristack), Tehsil Kastigarh.`), W - 36); doc.text(sub, 18, y); y += sub.length * 5.5 + 5;
  doc.setFont('times', 'normal'); doc.text('Sir,', 18, y); y += 7;
  const T = k => D.villages.reduce((a, v) => a + (v[k] || 0), 0);
  const body = `In compliance to the directions of your office, the unclaimed bucket data of Tehsil Kastigarh as per the list received from the DC office${listAt ? ' on ' + listAt : ''} (${N(T('n'))} buckets) has been printed village-wise, and the reason and remarks against each owner have been recorded by the concerned Patwaris and verified by the Girdawar Qanungo and the Naib Tehsildar. The signed registers are enclosed. The village-wise position is as under:`;
  const bl = doc.splitTextToSize(tx(body), W - 36); doc.text(bl, 18, y, { align: 'justify', maxWidth: W - 36 }); y += bl.length * 5.2 + 3;
  const rows = D.villages.map((v, i) => [String(i + 1), v.ph, v.name, N(v.n), N(v.made), N(v.can), N(v.not), N(v.left)]);
  rows.push(['', '', 'Total', N(T('n')), N(T('made')), N(T('can')), N(T('not')), N(T('left'))]);
  doc.autoTable({ startY: y, theme: 'grid', margin: { left: 18, right: 18 }, styles: { font: 'times', fontSize: 10, cellPadding: 1.6, lineColor: 0, lineWidth: 0.2, textColor: 0, halign: 'center' },
    headStyles: { fillColor: [235, 235, 235], textColor: 0, fontStyle: 'bold', valign: 'middle' }, columnStyles: { 1: { halign: 'left' }, 2: { halign: 'left' } },
    head: [['S.No', 'Patwar Halqa', 'Village', 'Unclaimed buckets in the list', 'ID made since', 'Can be claimed', 'Cannot be claimed', 'Not marked']], body: rows.map(r => r.map(tx)),
    didParseCell: d => { if (d.section === 'body' && d.row.index === rows.length - 1) d.cell.styles.fontStyle = 'bold'; } });
  y = doc.lastAutoTable.finalY + 6;
  const F = k => D.villages.reduce((a, v) => a + ((v.fam || {})[k] || 0), 0);
  if (F('families')) { const fl = doc.splitTextToSize(tx(`These unclaimed owners belong to ${N(F('families'))} families (brothers / co-sharers on the same khasras). In ${N(F('some'))} families at least one member already has a Farmer ID; in ${N(F('none'))} families no member has one yet${F('done') ? `; in ${N(F('done'))} families all remaining members have got IDs since the list` : ''}. Each co-sharer holds a separate bucket and needs his own Farmer ID.`), W - 36);
    doc.text(fl, 18, y, { align: 'justify', maxWidth: W - 36 }); y += fl.length * 5.2 + 4; }
  const pk = D.picks.filter(p => p[1] === 'not'), cnt = k => D.villages.reduce((a, v) => a + ((v.picks || {})[k] || 0), 0);
  const nb = doc.splitTextToSize(tx('Reasons where the Farmer ID cannot be made: ' + pk.map(p => `${SHORT[p[0]].toLowerCase().replace(/^id /, 'ID ')} ${N(cnt(p[0]))}`).join('; ') + '.'), W - 36);
  if (y + nb.length * 5 > 250) { doc.addPage(); y = 20; } doc.text(nb, 18, y); y += nb.length * 5.2 + 6;
  doc.text('Encl: Village-wise registers (signed).', 18, y); y += 22; if (y > 270) { doc.addPage(); y = 40; }
  doc.text('Yours faithfully,', W - 18, y - 10, { align: 'right' }); doc.setFont('times', 'bold'); doc.text('Tehsildar', W - 30, y + 6, { align: 'center' }); doc.setFont('times', 'normal'); doc.text('Kastigarh', W - 30, y + 11, { align: 'center' });
  deliverPDF(doc, `Forwarding letter – unclaimed buckets register – Kastigarh.pdf`);
}
/* camp call list: owners who can get the ID, family-wise, with the field-survey mobile */
async function campPDF(vid) {
  const R = await api('reg14Camp', { village_id: vid }, 90000); if (!R.rows.length) return info('No owner in ' + R.name + ' is marked "can be claimed" for a camp yet.');
  await loadPDF(); const doc = new jspdf.jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' }), W = 210, tx = pdfText;
  const fam = {}; R.rows.forEach(r => (fam[r.fam] = fam[r.fam] || []).push(r));
  const F = Object.keys(fam).map(k => fam[k]).sort((a, b) => firstK(a[0].khasras) - firstK(b[0].khasras));
  doc.setFont('times', 'bold'); doc.setFontSize(13); doc.text(tx(`Camp call list – ${R.name} (PH ${R.ph || '-'})`), W / 2, 14, { align: 'center' });
  doc.setFont('times', 'normal'); doc.setFontSize(10); doc.text(tx(`${R.rows.length} owners in ${F.length} families who can get the Farmer ID · from the register marks of ${dmyt(R.at)} · for office and camp staff only`), W / 2, 20, { align: 'center' });
  const body = []; let i = 0; F.forEach(g => { if (g.length > 1) body.push([{ content: tx('Family of ' + g[0].father + ' (' + g.length + ')'), colSpan: 6, styles: { fontStyle: 'bold', fillColor: [245, 245, 245] } }]);
    g.forEach(r => body.push([String(++i), r.name, r.father, r.khasras, r.mobile || '', r.remark].map(tx))); });
  doc.autoTable({ startY: 24, theme: 'grid', margin: { left: 10, right: 10 }, styles: { font: 'times', fontSize: 9, cellPadding: 1.3, lineColor: 0, lineWidth: 0.2, textColor: 0, valign: 'top' },
    headStyles: { fillColor: [235, 235, 235], textColor: 0, fontStyle: 'bold' }, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 32 }, 2: { cellWidth: 30 }, 3: { cellWidth: 42 }, 4: { cellWidth: 24 }, 5: { cellWidth: 52 } },
    head: [['S.No', 'Owner', 'Father', 'Khasras', 'Mobile', 'Reason']], body });
  pageNumbers(doc); deliverPDF(doc, `Camp call list – ${R.name}.pdf`);
}
/* follow-up: IDs made since the register list, by the reason that was marked */
async function followPDF(D) {
  await loadPDF(); const doc = new jspdf.jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' }), tx = pdfText, L = D.list || {};
  const K = D.picks.map(p => p[0]).concat(['-']), lab = k => k === '-' ? 'Not marked' : (SHORT[k] || (D.picks.find(p => p[0] === k) || [])[2] || k);
  doc.setFont('times', 'bold'); doc.setFontSize(13); doc.text(tx(`Farmer IDs made since the register list of ${dmy(L.list_at || L.at)} – Tehsil Kastigarh`), 148, 14, { align: 'center' });
  doc.setFont('times', 'normal'); doc.setFontSize(10); doc.text(tx(`As on ${dmyt(new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 16).replace('T', ' '))} · by the reason the Patwari had marked`), 148, 20, { align: 'center' });
  const used = K.filter(k => D.villages.some(v => (v.since || {})[k]));
  const body = D.villages.map(v => [v.ph, v.name, N(v.n), N(v.made)].concat(used.map(k => N((v.since || {})[k] || 0))));
  const T = k => D.villages.reduce((a, v) => a + ((v.since || {})[k] || 0), 0);
  body.push(['', 'Total', N(D.villages.reduce((a, v) => a + v.n, 0)), N(D.villages.reduce((a, v) => a + v.made, 0))].concat(used.map(k => N(T(k)))));
  doc.autoTable({ startY: 25, theme: 'grid', margin: { left: 10, right: 10 }, styles: { font: 'times', fontSize: 9.5, cellPadding: 1.5, lineColor: 0, lineWidth: 0.2, textColor: 0, halign: 'center' },
    headStyles: { fillColor: [235, 235, 235], textColor: 0, fontStyle: 'bold', valign: 'middle' }, columnStyles: { 0: { halign: 'left' }, 1: { halign: 'left' } },
    head: [['PH', 'Village', 'In the register', 'ID made since'].concat(used.map(lab))], body: body.map(r => r.map(tx)),
    didParseCell: d => { if (d.section === 'body' && d.row.index === body.length - 1) d.cell.styles.fontStyle = 'bold'; } });
  if (!used.length) { doc.setFontSize(11); doc.text('No Farmer ID has been made from the register list yet.', 10, doc.lastAutoTable.finalY + 8); }
  deliverPDF(doc, `Follow-up – IDs made since the register list – Kastigarh.pdf`);
}
async function excelAll(D) {
  await loadXLSX(); const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Unclaimed buckets register – Tehsil Kastigarh – list of ' + dmy((D.list || {}).list_at || (D.list || {}).at)], [],
    ['Patwar Halqa', 'Village', 'Buckets in the list', 'ID made since', 'Can be claimed', 'Cannot be claimed', 'Not marked']].concat(D.villages.map(v => [v.ph, v.name, v.n, v.made, v.can, v.not, v.left]))), 'Summary');
  for (const v of D.villages) { const R = await api('reg14Reg', { village_id: v.village_id }, 90000);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['S.No', 'Bucket ID', 'Village LGD Code', 'Village Name', 'Survey Number(s)', 'Sub Survey No.', 'Farmer Name', 'Farmer Mobile No.', 'Identifier Name', 'Can / cannot be claimed', 'Reason / remarks']]
      .concat(R.rows.map((r, i) => [i + 1, r.id, r.lgd, r.village, r.surveys, r.subs, r.farmer, r.mob, r.ident, r.side === 'can' ? 'Can be claimed' : r.side === 'not' ? 'Cannot be claimed' : r.side === 'made' ? 'ID made' : 'Not marked', r.remark]))), String(R.name).slice(0, 30)); }
  dlXlsx(wb, `Unclaimed buckets register – Kastigarh – ${dmy((D.list || {}).list_at || (D.list || {}).at)}.xlsx`);
}
const wideOn = t => { setHeader(t); document.body.classList.add('wide'); };

/* ---------- navigation ---------- */
Object.assign(TABOF10, { reg14o: 'tos12', reg14: 'home', reg14v: 'home' });
Object.assign(PWV95, { reg14: 'reg14', reg14v: 'reg14' });
Object.assign(HELP, {
  reg14: { en: ['Register', 'Your villages in the unclaimed owners register.', 'Tap a village and mark a reason against every farmer.'], hi: ['Register', 'Aapke gaon, register ke liye.', 'Gaon chunein aur har kisan ki wajah lagayein.'] },
  reg14v: { en: ['Village', 'One card per farmer; all his buckets together.', 'Tick several cards to give them one reason together. "App ka andaza" = the app\'s guess: confirm or change.'],
    hi: ['Gaon', 'Har kisan ka ek card; uske saare bucket saath.', 'Kai card tick karke ek saath wajah lagayein. "App ka andaza" sahi ho to Confirm.'] },
  reg14o: { en: ['Register for ACR', 'Freeze the DC list, watch the Patwaris\' progress, print the registers.', 'Print a village even before it is 100% marked: unmarked lines print blank.'], hi: ['ACR register', 'DC list freeze karein, progress dekhein, register chhapein.', 'Bina mark wali line khali chhapegi.'] }
});
const _ub14 = updateBnav;
updateBnav = function () {
  _ub14();
  const pw = $('#pwn95');
  if (pw && S.r14on && !$('[data-pw="reg14"]', pw)) {
    const b = document.createElement('button'); b.dataset.pw = 'reg14';
    b.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P10.reg}"/></svg><span>Register</span>`;
    b.onclick = e => { e.stopPropagation(); const c = current(); if (!c || PWV95[c.name] !== 'reg14') { closeAllSheets(); NAV.stack = [{ name: 'home', args: {} }]; go('reg14', {}); } };
    pw.insertBefore(b, pw.children[1] || null);
  }
  if (pw) { const c = current(); $$('#pwn95 button').forEach(x => { if (x.dataset.pw === 'reg14') x.classList.toggle('on', !!c && PWV95[c.name] === 'reg14'); }); }
};
/* the Patwari opens on his register once per session while farmers are left; the office home gets a register card */
const _render14 = render;
render = async function () {
  const c = current();
  if (c && c.name === 'home' && NAV.stack.length === 1 && S.session && S.boot && !office() && !S.r14Landed && S.r14my && S.r14my.list && S.r14my.villages.some(v => v.can_mark && v.farmers_left)) { S.r14Landed = 1; go('reg14', {}); return; }
  return _render14();
};
const _tos = VIEWS.tos12;
if (_tos) VIEWS.tos12 = async function (a) {
  await _tos(a);
  try { const D = await loadSum(); if (!D.list || current().name !== 'tos12') return; const sm = k => D.villages.reduce((x, v) => x + (v[k] || 0), 0), n = sm('n'), mk = sm('marked'), p = n ? Math.round(100 * mk / n) : 0;
    const phs = Array.from(new Set(D.villages.map(v => v.ph))).map(ph => { const vs = D.villages.filter(v => v.ph === ph), a2 = vs.reduce((x, v) => x + v.n, 0), b2 = vs.reduce((x, v) => x + v.marked, 0); return [ph, a2 ? Math.round(100 * b2 / a2) : 0]; });
    const el = document.createElement('div'); el.className = 'cd'; el.style.cursor = 'pointer';
    el.innerHTML = `<h3><span>ACR register · marked</span><span class="pill ${p >= 100 ? 'ok' : 'ur'}">${p}%</span></h3>${phs.map(x => `<div class="st"><span>PH ${esc(x[0])}</span><div class="bar"><i style="width:${x[1]}%"></i></div><b>${x[1]}%</b></div>`).join('')}<small class="hint">${N(n - mk)} of ${N(n)} buckets not marked · tap to print registers</small>`;
    el.onclick = () => go('reg14o', {}); const host = $('.t12', view()); if (host) { const h = $('h1', host); const after = h && h.nextElementSibling; host.insertBefore(el, after ? after.nextElementSibling : host.firstChild); } } catch (e) {}
};
/* office: a Register entry in Reports */
const _rep = VIEWS.rep8;
if (_rep) VIEWS.rep8 = async function (a) { await _rep(a); try { if (!(office() || isOQ()) || $('#r14e')) return; const v = view(), b = document.createElement('button'); b.id = 'r14e'; b.className = 'btn btn-primary';
  b.style.cssText = 'display:block;width:calc(100% - 28px);margin:12px 14px'; b.textContent = 'Unclaimed owners register (ACR)'; b.onclick = () => go('reg14o', {}); v.insertBefore(b, v.firstChild); } catch (e) {} };
/* who has the register */
setTimeout(async () => { try { if (!S.session || S.practice) return; const M = await loadMy(true); S.r14on = !!(M.list && M.villages.some(v => v.can_mark)); updateBnav();
  const c = current(); if (c && c.name === 'home' && NAV.stack.length === 1 && !office()) render();
  if (S.r14on) { const k = 'new121:' + me().user_id; if (!(await kget(k))) { await kput(k, 1);
    openSheet(() => ({ html: `<div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">Naya: Register</h2>
      <p class="lead">DC office ki unclaimed list aa gayi hai. Har kisan ki wajah lagayein – ACR sahab ko register isi se jayega.</p>
      <div class="nw83"><span>•</span><div><b>Ek kisan, ek card</b><small>Uske saare bucket saath. Ek wajah sab par.</small></div></div>
      <div class="nw83"><span>•</span><div><b>Kai kisan ek saath</b><small>Card tick karein, "Ek saath wajah" dabayein.</small></div></div>
      <div class="nw83"><span>•</span><div><b>Signal nahi?</b><small>Save ho jayega, signal aane par apne aap jayega.</small></div></div>
      <button class="btn btn-primary" id="ok">Shuru karein</button>`, mount: e => { $('#x', e).onclick = () => closeSheet(); $('#ok', e).onclick = () => closeSheet(() => go('reg14', {})); } })); } }
} catch (e) {} }, 2500);
window.TOS14 = { v: V14, regPDF, gqPDF, letterPDF, campPDF, followPDF, freezeRun };
})();
