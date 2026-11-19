/* TehsilOS 12.3.0 — Step 2: the app works it out from the portal reports.
 * Portal reports upload (any mix of files; the phone strips Aadhaar and mobiles), Farmer ID lookup, Insights (rank, village
 * bars, pace and target, approvals, land), tap-a-number lists, office lists (reconciliation, approval pending, checks,
 * part-claimed, easy wins / last brother), morning brief picture, one register layout for the village pending PDF.
 */
"use strict";
(function () {
const V = '12.3.0';
const N = x => Number(x || 0).toLocaleString('en-IN');
const view = () => $('#view');
const office = () => ['ADMIN', 'DA', 'NT'].indexOf(role()) >= 0;
const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const istNow = ms => new Date((ms || Date.now()) + 5.5 * 3600e3).toISOString().slice(0, 19).replace('T', ' ');
const css = document.createElement('style');
css.textContent = `
.p19 .fl{display:flex;justify-content:space-between;gap:8px;padding:9px 0;border-top:1px solid #F0EBE5;font-size:13.5px}.p19 .fl small{display:block;color:#5B6168}
.p19 .ok{color:#1F6B42;font-weight:800}.p19 .no{color:#9A3F1C;font-weight:800}
.p19 .vb{margin:10px 0}.p19 .vb .nm{display:flex;justify-content:space-between;font-size:13.5px;font-weight:800;margin-bottom:4px}.p19 .sb{display:flex;height:22px;border-radius:7px;overflow:hidden;background:#EFE9E3}
.p19 .sb button{border:0;padding:0;height:22px;cursor:pointer;min-width:2px}.p19 .lg{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:#3F454B;margin:4px 0 8px}.p19 .lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.p19 .rk{font-size:40px;font-weight:900;line-height:1}.p19 .spark{width:100%;height:60px}
.p19 .res{background:#fff;border-radius:16px;padding:12px 14px;box-shadow:0 1px 3px rgba(30,34,38,.08);margin:0 0 10px}.p19 .res b{font-size:15.5px}.p19 .res small{display:block;color:#5B6168;font-size:12.5px}
.p19 .pill2{display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:10px}.p19 .pa{background:#E3F2E9;color:#1F6B42}.p19 .pp{background:#FBEFD9;color:#8A5A0B}.p19 .px{background:#F6E3DA;color:#9A3F1C}
.p19 .srch{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:12px 14px;border:1px solid #DDD5CC;border-radius:12px;margin:0 0 10px;background:#fff}
.p19 table.t{width:100%;border-collapse:collapse;font-size:12.5px}.p19 table.t td,.p19 table.t th{padding:6px 4px;border-bottom:1px solid #F0EBE5;text-align:right}.p19 table.t td:first-child,.p19 table.t th:first-child{text-align:left}
.p19 table.t th{font-size:11.5px;color:#5B6168}.p19 .bad{color:#9A3F1C;font-weight:900}
`;
document.head.appendChild(css);
const COL = { claimed: '#2E7D4F', part: '#7FB394', can: '#D9A441', not: '#9AA3AD', unsorted: '#C8553D' };
const LAB = { claimed: 'ID made', part: 'ID made, khasras left', can: 'Can be claimed', not: 'Cannot be claimed', unsorted: 'Not sorted' };

/* ======================= portal reports upload ======================= */
function kindOf(H) {
  const h = H.map(x => String(x || '').trim().toLowerCase());
  const has = x => h.indexOf(x) >= 0;
  if (has('enrollmentnumber') && has('approvalstatus')) return 'reg';
  if (has('bucket id') && has('aadhaar name')) return 'claim';
  if (has('bucket id') && has('identifier name') && !has('aadhaar name')) return 'uncl';
  if (has('bucketid') && has('ownerextent')) return 'area';
  if (h.some(x => /^village name/.test(x)) && h.some(x => /count of buckets claimed/.test(x))) return 'sumv';
  if (h.some(x => /^sub district name/.test(x))) return 'sumd';
  return '';
}
const KL = { reg: 'Registered farmers', claim: 'Claimed bucket details', uncl: 'Unclaimed bucket details', area: 'Village-wise bucket data (land shares)', sumv: 'Village summary', sumd: 'Sub-district summary' };
async function readFile(f) {
  await loadXLSX(); const buf = await f.arrayBuffer(); const wb = /\.csv$/i.test(f.name) ? XLSX.read(new TextDecoder().decode(buf), { type: 'string', raw: true }) : XLSX.read(buf, { type: 'array', raw: true });
  const out = []; wb.SheetNames.forEach(sn => { const A = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: false, defval: '' }); let hi = -1, k = '';
    for (let i = 0; i < Math.min(8, A.length); i++) { k = kindOf(A[i]); if (k) { hi = i; break; } } if (hi >= 0) out.push({ kind: k, H: A[hi].map(x => String(x).trim().toLowerCase()), rows: A.slice(hi + 1) }); });
  return out;
}
function compact(parts) {
  const R = { reg: [], claim: {}, uncl: {}, area: {}, sumv: [], sumd: [] };
  parts.forEach(p => { const ix = n => p.H.indexOf(n), fx = re => p.H.findIndex(x => re.test(x)), g = (r, i) => i >= 0 ? String(r[i] == null ? '' : r[i]).trim() : '';
    if (p.kind === 'reg') { const I = ['enrollmentnumber', 'centralid', 'frnameen', 'gender', 'age', 'approvalstatus', 'villagelgdcode', 'lowestnamematchscore', 'insertedby'].map(ix);
      p.rows.forEach(r => { if (!g(r, I[0])) return; R.reg.push([g(r, I[0]), g(r, I[1]), g(r, I[2]), g(r, I[3]), g(r, I[4]), g(r, I[5]), g(r, I[6]), g(r, I[7]), g(r, I[8]) === 'SELF' ? 'Y' : '']); }); }
    if (p.kind === 'claim') { const I = ['bucket id', 'village lgd code', 'farmer name', 'identifier name', 'aadhaar name', 'aadhaar identifier name', 'enrollement number', 'farmer id', 'survey number'].map(ix);
      p.rows.forEach(r => { const id = g(r, I[0]); if (!id) return; const k = id + '|' + g(r, I[6]); const x = R.claim[k] = R.claim[k] || [id, g(r, I[1]), g(r, I[2]), g(r, I[3]), g(r, I[4]), g(r, I[5]).replace(/^\((father|husband|mother)\)\s*/i, ''), g(r, I[6]), g(r, I[7]), []];
        const s = g(r, I[8]); if (s && x[8].indexOf(s) < 0) x[8].push(s); }); }
    if (p.kind === 'uncl') { const I = ['bucket id', 'village lgd code', 'survey number', 'farmer name', 'identifier name'].map(ix);
      p.rows.forEach(r => { const id = g(r, I[0]); if (!id) return; const x = R.uncl[id] = R.uncl[id] || [id, g(r, I[1]), [], g(r, I[3]), g(r, I[4])]; const s = g(r, I[2]); if (s && x[2].indexOf(s) < 0) x[2].push(s); }); }
    if (p.kind === 'area') { const I = ['bucketid', 'ownerextent'].map(ix); p.rows.forEach(r => { const id = g(r, I[0]); if (!id) return; const x = R.area[id] = R.area[id] || [id, 0, 0]; x[1] += Number(g(r, I[1])) || 0; x[2]++; }); }
    if (p.kind === 'sumv') { const iv = fx(/^village lgd code/), inm = fx(/^village name/), it = fx(/^count of buckets \(/), ic = fx(/^count of buckets claimed/);
      p.rows.forEach(r => { const k = iv >= 0 && g(r, iv) ? g(r, iv) : g(r, inm); if (!k || /total/i.test(k)) return; R.sumv.push([k, g(r, it), g(r, ic)]); }); }
    if (p.kind === 'sumd') { const inm = fx(/^sub district name/), it = fx(/^count of buckets \(/), ic = fx(/^count of buckets claimed/), ip = fx(/^count of buckets pending/);
      p.rows.forEach(r => { if (!g(r, inm) || /total/i.test(g(r, inm))) return; R.sumd.push([g(r, inm), g(r, it), g(r, ic), g(r, ip)]); }); } });
  const kh = a => a.sort((x, y) => (parseInt(x) || 1e9) - (parseInt(y) || 1e9) || x.localeCompare(y)).join(', ');
  return { reg: R.reg, claim: Object.keys(R.claim).map(k => { const x = R.claim[k]; x[8] = kh(x[8]); return x; }), uncl: Object.keys(R.uncl).map(k => { const x = R.uncl[k]; x[2] = kh(x[2]); return x; }),
    area: Object.keys(R.area).map(k => { const x = R.area[k]; x[1] = Math.round(x[1] * 1e6) / 1e6; return x; }), sumv: R.sumv, sumd: R.sumd };
}
VIEWS.pp19 = async function () {
  setHeader('Portal reports'); document.body.classList.add('wide');
  let L = null; try { L = (await api('ins19', {}, 60000)).last; } catch (e) {}
  view().innerHTML = `<div class="t12 p19"><h1>Portal reports</h1><p class="sub">Whenever the DC office gives the full set. Pick all the files at once; the app knows each one.</p>
    <div class="cd"><label class="btn12" style="display:block;cursor:pointer;text-align:center">Choose the files<input type="file" id="f19" multiple accept=".xlsx,.xls,.csv" hidden></label>
      <p class="hint" style="margin-top:8px">Unclaimed details · Claimed details · Registered farmers (CSV) · Village-wise bucket data · Village and sub-district summaries. Aadhaar numbers and mobiles are removed on this phone; they are never sent.</p></div>
    ${L ? `<div class="cd"><h3>Last time · ${esc(dmy(L.at.slice(0, 10)))} ${esc(L.at.slice(11, 16))}</h3>${res19(L)}</div>` : ''}<div id="pk19"></div></div>`;
  $('#f19').onchange = async e => { const fs = Array.from(e.target.files || []); e.target.value = ''; if (!fs.length) return; const box = $('#pk19'); box.innerHTML = '<div class="cd"><p class="hint">Reading the files…</p></div>';
    try { const parts = []; const names = []; for (const f of fs) { const p = await readFile(f); p.forEach(x => { x.file = f.name; parts.push(x); }); names.push([f.name, p.map(x => KL[x.kind]).join(', ') || 'not recognised']); }
      const C = compact(parts), cnt = { reg: C.reg.length, claim: C.claim.length, uncl: C.uncl.length, area: C.area.length, sumv: C.sumv.length, sumd: C.sumd.length };
      box.innerHTML = `<div class="cd"><h3>${fs.length} files</h3>${names.map(n => `<div class="fl"><span>${esc(n[0])}<small>${esc(n[1])}</small></span><span class="${/not rec/.test(n[1]) ? 'no' : 'ok'}">${/not rec/.test(n[1]) ? '✗' : '✓'}</span></div>`).join('')}
        <div class="fl"><span><b>Will send</b><small>${Object.keys(cnt).filter(k => cnt[k]).map(k => KL[k] + ': ' + N(cnt[k])).join(' · ')}</small></span></div>
        ${cnt.claim && cnt.uncl ? '' : '<p class="hint" style="color:#9A3F1C">Claimed and unclaimed details both are needed to work out claimed / part-claimed / unclaimed. With only one of them, the app stores it and waits.</p>'}
        <button class="btn btn-primary" id="go19" style="margin-top:8px">Upload and work it out</button></div>`;
      $('#go19').onclick = () => run19(C, cnt); } catch (x) { box.innerHTML = `<div class="cd"><p class="no">${esc(x.message)}</p></div>`; } };
};
function res19(r) {
  const rc = r.rc || [], bad = rc.filter(x => x.dc_claimed != null && x.dc_claimed !== x.app_claimed);
  return `<div class="fl"><span>Villages worked out<small>${esc((r.villages || []).join(', '))}</small></span></div>
    <div class="fl"><span>Part-claimed (ID made, khasras left)</span><b>${N(r.part)}</b></div><div class="fl"><span>Newly claimed</span><b>${N(r.claimed)}</b></div>
    <div class="fl"><span>Shown claimed but not on the portal: reverted</span><b>${N(r.reverted)}</b></div><div class="fl"><span>Buckets added (claimed before the app)</span><b>${N(r.added)}</b></div>
    <div class="fl"><span>To check (field says ID made, portal does not)</span><b>${N(r.conflict)}</b></div><div class="fl"><span>Aadhaar name does not match the land record</span><b>${N(r.name)}</b></div>
    <div class="fl"><span>Age: minor or 90+</span><b>${N(r.age)}</b></div><div class="fl"><span>Joint buckets with co-owners left</span><b>${N(r.joint)}</b></div>
    ${rc.length ? `<table class="t" style="margin-top:8px"><tr><th>Village</th><th>App claimed</th><th>DC claimed</th><th>App pending</th><th>DC pending</th></tr>${rc.map(x => `<tr><td>${esc(x.name)}</td><td>${N(x.app_claimed)}</td><td class="${x.dc_claimed != null && x.dc_claimed !== x.app_claimed ? 'bad' : ''}">${x.dc_claimed == null ? '–' : N(x.dc_claimed)}</td><td>${N(x.app_pending)}</td><td>${x.dc_pending == null ? '–' : N(x.dc_pending)}</td></tr>`).join('')}</table>
    <p class="hint">${bad.length ? bad.length + ' village(s) differ from the DC summary – usually the summary is a little older or newer than the detail files.' : 'Matches the DC summary ✓'}</p>` : ''}`;
}
function run19(C, cnt) {
  const order = ['reg', 'claim', 'uncl', 'area', 'sumv', 'sumd'].filter(k => cnt[k]); const since = istNow(Date.now() - 180000);
  closeAllSheets();
  return runTask('Portal reports', order.map(k => 'Sending ' + KL[k] + ' (' + N(cnt[k]) + ')').concat(['Working it out']), async step => {
    for (let i = 0; i < order.length; i++) { step(i); await api('pp19Put', { kind: order[i], rows: C[order[i]] }, 24e4); }
    step(order.length); let r = null;
    if (cnt.claim && cnt.uncl) { for (let t = 0; t < 2; t++) { try { r = await api('pp19Finish', { since }, 3e5); break; } catch (e) { if (t || !/time|internet|network/i.test(e.message)) throw e; await new Promise(z => setTimeout(z, 20000)); } } }
    S.i19At = 0; S.r14 = {}; S.r14myAt = 0; setTimeout(() => { const c = current(); if (c && (c.name === 'pp19' || c.name === 'ins19')) render(); }, 400);
    return { msg: r ? `Done ✓ ${r.villages.length} villages · ${N(r.part)} part-claimed · ${N(r.claimed)} claimed · ${N(r.reverted)} reverted · ${N(r.added)} added · ${N(r.conflict + r.name + r.age)} to check` : 'Stored ✓ (send claimed and unclaimed details together to work it out)' };
  });
}

/* ======================= Farmer ID lookup ======================= */
VIEWS.fl19 = async function (a) {
  setHeader('Farmer ID lookup'); a = a || {};
  view().innerHTML = `<div class="t12 p19"><h1>Farmer ID lookup</h1><p class="sub">Name, father's name, khasra, Farmer ID or enrolment number</p>
    <input class="srch" id="q19" type="search" value="${esc(a.q || '')}" placeholder="e.g. Gulam Rasool · 1043 · 75576326849" aria-label="Search"><div id="r19"></div></div>`;
  const q = $('#q19'), out = $('#r19'); let t = null;
  const doit = async () => { const s = q.value.trim(); a.q = s; if (s.length < 2) { out.innerHTML = ''; return; } out.innerHTML = '<p class="hint">Searching…</p>';
    let R; try { R = await api('fl19', { q: s }, 30000); try { await kput('fl19:' + s.toLowerCase(), R); } catch (e) {} } catch (e) { try { R = await kget('fl19:' + s.toLowerCase()); } catch (x) {} if (!R) { out.innerHTML = `<p class="no">${esc(e.message)}</p>`; return; } }
    if (q.value.trim() !== s) return;
    out.innerHTML = R.rows.length ? R.rows.map((r, i) => `<div class="res"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(r.name)}</b><span class="pill2 ${r.status === 'APPROVED' ? 'pa' : r.status === 'PENDING' ? 'pp' : 'px'}">${r.status === 'APPROVED' ? 'Approved' : r.status === 'PENDING' ? 'Approval pending' : 'Not in the list'}</span></div>
      <small>${r.father ? 'Father / husband: ' + esc(r.father) + ' · ' : ''}${esc(r.village)}${r.age ? ' · age ' + esc(r.age) : ''}</small>
      <div class="fl"><span>Farmer ID<small>Enrolment ${esc(r.enrol)}</small></span><b>${esc(r.farmer_id || '–')}</b></div>
      ${r.lands.map(l => `<div class="fl"><span>Land in the ID · ${esc(l.village)}<small>${esc(l.name)} s/o ${esc(l.father)} · khasra ${esc(l.claimed)}</small>${l.left ? `<small class="no">Left out: khasra ${esc(l.left)}</small>` : ''}</span></div>`).join('')}
      ${r.family.length ? `<div class="fl"><span>Family (same father)<small>${r.family.map(f => esc(f.name) + (f.done ? ' ✓' : ' – not yet')).join(', ')}</small></span></div>` : ''}
      <button class="btn12 gh" data-sh="${i}" style="margin-top:6px">Share status with the farmer</button></div>`).join('') + (R.more ? '<p class="hint">More found – type more of the name.</p>' : '') : '<p class="hint">No Farmer ID found. If he has land here, his buckets are still unclaimed.</p>';
    $$('[data-sh]', out).forEach(b => b.onclick = () => { const r = R.rows[Number(b.dataset.sh)]; const txt = `${r.name}: Farmer ID ${r.farmer_id || r.enrol} – ${r.status === 'APPROVED' ? 'approved ✓' : r.status === 'PENDING' ? 'made, approval pending' : 'not found'}.${r.lands.some(l => l.left) ? ' Some khasras are not yet in the ID.' : ''}`;
      if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank'); }); };
  q.oninput = () => { clearTimeout(t); t = setTimeout(doit, 450); }; if (a.q) doit(); q.focus();
};

/* ======================= Insights ======================= */
async function ins(force) { if (!force && S.i19 && Date.now() - S.i19At < 120000) return S.i19; S.i19 = await api('ins19', {}, 60000); S.i19At = Date.now(); return S.i19; }
const segs = v => ({ claimed: v.claimed, part: v.part, can: v.can, not: v.not, unsorted: v.unsorted });
function spark(series) { if (!series || series.length < 2) return '<p class="hint">The line starts after two days of uploads.</p>'; const ys = series.map(s => s[1]), lo = Math.min(...ys), hi = Math.max(...ys), w = 300, h = 60;
  const pts = series.map((s, i) => [i * w / (series.length - 1), h - 6 - (hi === lo ? 0 : (s[1] - lo) * (h - 12) / (hi - lo))]);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="IDs made over the last ${series.length} days"><polyline fill="none" stroke="#2E7D4F" stroke-width="2.5" points="${pts.map(p => p.join(',')).join(' ')}"/></svg>
    <div class="hint" style="display:flex;justify-content:space-between"><span>${esc(dmy(series[0][0]))}: ${N(series[0][1])}</span><span>${esc(dmy(series[series.length - 1][0]))}: ${N(series[series.length - 1][1])}</span></div>`; }
VIEWS.ins19 = async function () {
  setHeader('Insights'); document.body.classList.add('wide'); view().innerHTML = '<div class="t12 p19"><p class="sub">Loading…</p></div>';
  let D; try { D = await ins(true); } catch (e) { view().innerHTML = `<div class="t12"><p class="lead">${esc(e.message)}</p></div>`; return; }
  const T = D.villages.reduce((a, v) => { Object.keys(segs(v)).forEach(k => a[k] = (a[k] || 0) + v[k]); a.total += v.total; a.area_un += v.area_un; a.area_land += v.area_land; a.small += v.small; return a; }, { total: 0, area_un: 0, area_land: 0, small: 0 });
  const made = T.claimed + T.part, sat = T.total ? made * 100 / T.total : 0, tg = D.target, need = Math.ceil(T.total * tg.pct / 100) - made;
  const daysTo = tg.date ? Math.max(1, Math.round((new Date(tg.date) - new Date(istNow().slice(0, 10))) / 864e5)) : null, perDay = daysTo ? Math.max(0, Math.ceil(need / daysTo)) : null;
  const eta = D.pace > 0 && need > 0 ? new Date(Date.now() + Math.ceil(need / D.pace) * 864e5 + 5.5 * 3600e3).toISOString().slice(0, 10) : '';
  const rk = D.rank.length ? D.rank[D.rank.length - 1] : null;
  const pendAll = D.villages.reduce((a, v) => a + v.can + v.unsorted, 0) || 1;
  view().innerHTML = `<div class="t12 p19"><h1>Insights · ${esc(D.tehsil)}</h1>
    ${rk ? `<div class="cd"><h3>District rank <span class="hint">${esc(dmy(rk.date))}</span></h3><div style="display:flex;gap:14px;align-items:center"><div class="rk">${rk.rank || '–'}<span style="font-size:16px;color:#5B6168"> of ${rk.of}</span></div>
      <div class="hint">Lowest share pending among sub-districts${rk.pct != null ? ' · ' + rk.pct.toFixed(1) + '% pending' : ''}<br>Top 3: ${esc(rk.top.join(', '))}${D.rank.length > 1 ? '<br>Last ' + D.rank.length + ' uploads: ' + D.rank.map(x => x.rank || '–').join(' → ') : ''}</div></div></div>` : ''}
    <div class="cd"><h3>Villages <span class="hint">tap a colour for the list</span></h3><div class="lg">${Object.keys(COL).map(k => `<span><i style="background:${COL[k]}"></i>${LAB[k]}</span>`).join('')}</div>
      ${D.villages.map(v => { const s = segs(v), t = v.total || 1; return `<div class="vb"><div class="nm"><span>${esc(v.name)}</span><span>${Math.round((v.claimed + v.part) * 100 / t)}% made · ${N(v.pending)} pending</span></div><div class="sb">${Object.keys(s).map(k => s[k] ? `<button style="width:${s[k] * 100 / t}%;background:${COL[k]}" data-v="${esc(v.village_id)}" data-k="${k === 'claimed' ? 'claimed' : k}" aria-label="${esc(v.name)} ${LAB[k]} ${s[k]}"></button>` : '').join('')}</div></div>`; }).join('')}</div>
    <div class="cd"><h3>Pace and target</h3><div class="g2" style="margin:0"><div class="k"><b>${N(made)}</b><span>Buckets with ID made (${sat.toFixed(1)}%)</span></div><div class="k"><b>${D.pace == null ? '–' : N(D.pace)}</b><span>IDs a day, last 7 days</span></div></div>
      ${spark(D.series)}
      <p class="lead" style="margin:8px 0 0">${need > 0 ? `Target <b>${tg.pct}%</b>${tg.date ? ' by <b>' + esc(dmy(tg.date)) + '</b>' : ''}: ${N(need)} more needed${perDay != null ? ` = <b>${N(perDay)} a day</b>` : ''}.${eta ? ' At the current pace: ' + esc(dmy(eta)) + '.' : ''}` : `Target ${tg.pct}% reached ✓`}</p>
      ${perDay ? `<p class="hint">Village share of the daily need: ${D.villages.filter(v => v.can + v.unsorted).map(v => esc(v.name) + ' ' + Math.ceil(perDay * (v.can + v.unsorted) / pendAll)).join(' · ')}</p>` : ''}
      ${role() === 'ADMIN' ? `<div class="s12" style="margin-top:8px"><label for="tp">Target %</label><input type="number" id="tp" value="${tg.pct}" min="1" max="100"><label for="td">By date</label><input type="date" id="td" value="${esc(tg.date)}"></div><button class="btn12 gh" id="ts" style="margin-top:8px">Save target</button>` : ''}</div>
    <div class="cd"><h3>Farmer IDs and approval</h3><div class="g3" style="margin:0"><div class="k"><b>${N(D.ids.made)}</b><span>IDs made</span></div><div class="k"><b>${N(D.ids.approved)}</b><span>Approved</span></div><div class="k"><b class="${D.ids.pending ? 'no' : ''}">${N(D.ids.pending)}</b><span>Approval pending</span></div></div>
      <div class="sb" style="margin-top:8px"><button style="width:${D.ids.made ? D.ids.approved * 100 / D.ids.made : 0}%;background:#2E7D4F" aria-label="Approved"></button><button style="width:${D.ids.made ? D.ids.pending * 100 / D.ids.made : 0}%;background:#D9A441" aria-label="Pending"></button></div></div>
    <div class="cd"><h3>Unclaimed land</h3><p class="lead" style="margin:0">${T.area_un.toFixed(0)} ha unclaimed: <b>${T.area_land.toFixed(0)} ha</b> is Shamlat / Kahcharai / State-type entries; <b>${(T.area_un - T.area_land).toFixed(0)} ha</b> with private owners.</p>
      <p class="hint">${N(T.small)} private owners hold less than 0.01 ha (about 4 marla). ${D.villages.filter(v => v.small).map(v => `<button class="btn12 gh" data-v="${esc(v.village_id)}" data-k="small" style="padding:4px 8px;font-size:12px;margin:2px">${esc(v.name)} ${v.small}</button>`).join('')}</p></div>
    ${D.patwari.length ? `<div class="cd"><h3>Patwari marking${D.due ? ' · due ' + esc(dmy(D.due)) : ''}</h3>${D.patwari.map(p => `<div class="st"><span>${esc(p.name)}</span><div class="bar"><i style="width:${p.n ? p.marked * 100 / p.n : 0}%"></i></div><b>${p.n ? Math.round(p.marked * 100 / p.n) : 0}%</b></div>`).join('')}</div>` : ''}
    <div class="cd"><h3>Lists and reports</h3>
      <button class="row" data-r="rc"><span>Reconciliation · app vs DC<small>Village-wise, PDF and Excel</small></span><span>›</span></button>
      <button class="row" data-r="approval"><span>Approval pending<small>${N(D.ids.pending)} farmers, village-wise · Excel</small></span><span>›</span></button>
      <button class="row" data-r="check"><span>Check list<small>Name mismatch, field-vs-portal, minors, 90+ · Excel</small></span><span>›</span></button>
      <button class="row" data-r="part"><span>Part-claimed: khasras to add<small>Farmer ID and the khasras left · Excel</small></span><span>›</span></button>
      <button class="row" data-r="ew"><span>Easy wins and last-brother families<small>PDF per halqa, for camps</small></span><span>›</span></button>
      <button class="row" data-r="brief"><span>Morning brief (picture)<small>For your WhatsApp group</small></span><span>›</span></button>
      <button class="row" data-go="pp19"><span>Portal reports upload<small>When the DC office gives the full set</small></span><span>›</span></button></div></div>`;
  $$('[data-v][data-k]').forEach(b => b.onclick = () => listSheet(b.dataset.v, b.dataset.k));
  if ($('#ts')) $('#ts').onclick = () => busy($('#ts'), 'Saving', async () => { await api('tgt19Set', { pct: $('#tp').value, date: $('#td').value }); S.i19At = 0; toast('Target saved'); render(); });
  $$('[data-go]', view()).forEach(b => b.onclick = () => go(b.dataset.go, {}));
  $$('[data-r]').forEach(b => b.onclick = () => busy(b, 'Making', () => report(b.dataset.r, D)));
};
async function listSheet(vid, kind) {
  const R = await api('bl19', { village_id: vid, kind }, 60000); const KN = Object.assign({}, LAB, { small: 'Private owners under 0.01 ha', check: 'To check' });
  openSheet(() => ({ html: `<div class="snav"><button id="x">Close</button><span></span><button id="xl">Excel</button></div><h2 class="nm">${esc(R.village)} · ${esc(KN[kind] || kind)} · ${N(R.rows.length)}</h2>
    <div class="cd p19" style="padding:4px 14px">${R.rows.slice(0, 300).map(r => `<div class="fl"><span><b>${esc(r.n)}</b> s/o ${esc(r.p)}<small>khasra ${esc(String(r.k).split(', ').slice(0, 12).join(', '))}${String(r.k).split(', ').length > 12 ? ' …' : ''}${r.area ? ' · ' + Number(r.area).toFixed(3) + ' ha' : ''}${r.fid ? ' · ID ' + esc(r.fid) : ''}</small><small>${esc(r.remark)}${r.chk ? ' · ' + esc(r.chk) : ''}</small></span></div>`).join('')}${R.rows.length > 300 ? '<p class="hint">First 300 shown – Excel has all.</p>' : ''}</div>`,
    mount: e => { $('#x', e).onclick = () => closeSheet(); $('#xl', e).onclick = async () => { await loadXLSX(); const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Landholder', 'Father / husband', 'Khasras', 'Land (ha)', 'Farmer ID', 'Remark', 'Check']].concat(R.rows.map(r => [r.n, r.p, r.k, r.area, r.fid, r.remark, r.chk])), String(kind).slice(0, 30)));
      dlXlsx(wb, `${R.village} – ${KN[kind] || kind}.xlsx`); }; } }));
}
async function report(kind, D) {
  if (kind === 'brief') return brief(D);
  if (kind === 'rc') { const L = await api('ins19', {}, 60000); let rc = (L.last && L.last.rc) || []; if (!rc.length) return info('Upload the portal reports once to reconcile.');
    await loadPDF(); const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' }), tx = pdfText; doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(tx(`Tehsil ${D.tehsil} – Farmer ID figures: app vs DC office`), 40, 50);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text(tx(`Portal reports of ${dmy(L.last.at.slice(0, 10))} ${L.last.at.slice(11, 16)}`), 40, 66);
    doc.autoTable({ startY: 80, theme: 'grid', styles: { fontSize: 9.5, halign: 'right' }, headStyles: { fillColor: [30, 34, 38] }, columnStyles: { 0: { halign: 'left' } },
      head: [['Village', 'Buckets (app)', 'Buckets (DC)', 'ID made (app)', 'ID made (DC)', 'of which part', 'Pending (app)', 'Pending (DC)', 'Difference']],
      body: rc.map(x => [x.name, N(x.app_total), x.dc_total == null ? '-' : N(x.dc_total), N(x.app_claimed), x.dc_claimed == null ? '-' : N(x.dc_claimed), N(x.part), N(x.app_pending), x.dc_pending == null ? '-' : N(x.dc_pending), x.dc_claimed == null ? '-' : String(x.app_claimed - x.dc_claimed)]).map(r => r.map(tx)) });
    doc.setFontSize(9); doc.text(tx('ID made = buckets claimed in full plus part-claimed (ID made, some khasras left). A small difference means the DC summary and the detail files were taken at different times.'), 40, doc.lastAutoTable.finalY + 16, { maxWidth: 515 });
    return deliverPDF(doc, `Reconciliation – ${D.tehsil}.pdf`); }
  if (kind === 'ew') { const R = await api('ew19', {}, 9e4); if (!R.rows.length) return info('Nothing yet – upload the portal reports first.'); await loadPDF();
    const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' }), tx = pdfText, phs = Array.from(new Set(R.rows.map(r => r.ph || '-'))); let first = true;
    phs.forEach(ph => { const L = R.rows.filter(r => (r.ph || '-') === ph).slice(0, 60); if (!first) doc.addPage(); first = false;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(tx(`Easy wins – PH ${ph} – families most likely to get IDs now`), 40, 46); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
      doc.text(tx('Last brother = every other member of the family has his ID. Score: brother has ID 3, Aadhaar+mobile known 2, land 0.05 ha+ 1, app guess 1.'), 40, 62, { maxWidth: 515 });
      doc.autoTable({ startY: 76, theme: 'grid', styles: { fontSize: 8.8, cellPadding: 3, valign: 'top' }, headStyles: { fillColor: [30, 34, 38] }, columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 60 }, 2: { cellWidth: 70 }, 3: { cellWidth: 140 }, 4: { cellWidth: 140 } },
        head: [['#', 'Village', 'Father', 'Owners still to get ID', 'Khasras', 'Note', 'Done?']], body: L.map((r, i) => [String(i + 1), r.village, r.father, r.names.join(', '), r.khasras, (r.lastbro ? 'LAST BROTHER · ' : '') + 'score ' + r.score + (r.area ? ' · ' + r.area.toFixed(2) + ' ha' : ''), ''].map(tx)) }); });
    return deliverPDF(doc, `Easy wins – ${D.tehsil}.pdf`); }
  const R = await api('lists19', { kind }, 9e4); if (!R.rows.length) return info('Nothing in this list.'); await loadXLSX(); const wb = XLSX.utils.book_new(), keys = Object.keys(R.rows[0]);
  const HD = { village: 'Village', name: 'Name', father: 'Father / husband', enrol: 'Enrolment no.', farmer_id: 'Farmer ID', age: 'Age', score: 'Name match score', khasras: 'Khasras', flags: 'Check', claimants: 'Claimed by (Aadhaar name, father, ID)', claimed: 'Khasras in the ID', left: 'Khasras left out', joint: 'Co-owners who claimed' };
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([keys.map(k => HD[k] || k)].concat(R.rows.map(r => keys.map(k => r[k])))), kind);
  dlXlsx(wb, `${{ approval: 'Approval pending', check: 'Check list', part: 'Part-claimed – khasras to add' }[kind]} – ${D.tehsil}.xlsx`);
}
/* the morning brief: one picture for the staff group */
async function brief(D) {
  let d = null; try { d = await api('day19', {}, 60000); } catch (e) {}
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350; const g = c.getContext('2d');
  g.fillStyle = '#F7F4F0'; g.fillRect(0, 0, 1080, 1350); g.fillStyle = '#1E2226'; g.font = '900 56px Nunito, sans-serif'; g.fillText('Farmer ID · ' + D.tehsil, 60, 110);
  g.font = '700 32px Nunito, sans-serif'; g.fillStyle = '#5B6168'; g.fillText(d ? d.window.label : dmy(istNow().slice(0, 10)), 60, 160);
  const box = (x, y, v, l, col) => { g.fillStyle = '#fff'; g.fillRect(x, y, 300, 170); g.fillStyle = col || '#1E2226'; g.font = '900 72px Nunito, sans-serif'; g.fillText(v, x + 24, y + 92); g.fillStyle = '#5B6168'; g.font = '700 26px Nunito, sans-serif'; g.fillText(l, x + 24, y + 140); };
  const T = d ? d.totals : null; box(60, 210, T ? N(T.made + T.part) : '–', 'IDs made', '#1F6B42'); box(390, 210, T ? N(T.marked) : '–', 'Marked by Patwaris'); box(720, 210, N(D.ids.pending), 'Approval pending', '#9A3F1C');
  let y = 460; g.fillStyle = '#1E2226'; g.font = '800 34px Nunito, sans-serif'; g.fillText('Village', 60, y); g.fillText('IDs', 560, y); g.fillText('Pending', 720, y); y += 20;
  (d ? d.villages : []).forEach(v => { y += 54; g.font = '700 32px Nunito, sans-serif'; g.fillStyle = '#1E2226'; g.fillText(v.name, 60, y); g.fillText(N(v.made + v.part), 560, y); g.fillText(N(v.pending), 720, y); });
  y += 80; g.font = '700 30px Nunito, sans-serif'; g.fillStyle = '#1F6B42'; if (d && d.best) g.fillText('Best: ' + d.best.name + ' (' + d.best.n + ')', 60, y); y += 46; g.fillStyle = '#9A3F1C'; if (d && d.weak) g.fillText('Needs push: ' + d.weak.name + ' (' + d.weak.n + ' IDs, ' + N(d.weak.pending) + ' pending)', 60, y);
  y += 60; g.fillStyle = '#1E2226'; const tg = D.target; const made = D.villages.reduce((a, v) => a + v.claimed + v.part, 0), tot = D.villages.reduce((a, v) => a + v.total, 0), need = Math.ceil(tot * tg.pct / 100) - made;
  if (need > 0 && tg.date) { const days = Math.max(1, Math.round((new Date(tg.date) - new Date(istNow().slice(0, 10))) / 864e5)); g.fillText(`Target ${tg.pct}% by ${dmy(tg.date)}: ${N(Math.ceil(need / days))} IDs a day`, 60, y); }
  g.font = '600 24px Nunito, sans-serif'; g.fillStyle = '#5B6168'; g.fillText('TehsilOS · ' + istNow().slice(0, 16), 60, 1300);
  const blob = await new Promise(r => c.toBlob(r, 'image/png')); const file = new File([blob], 'Farmer ID brief.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text: 'Farmer ID · ' + D.tehsil }); return; } catch (e) {} }
  addFile(blob, 'Farmer ID brief ' + istNow().slice(0, 10) + '.png', 'Picture ready ✓');
}

/* ======================= wiring ======================= */
Object.assign(TABOF10, { pp19: 'tos12', ins19: 'tos12', fl19: 'tos12' });
Object.assign(PWV95, { fl19: 'reg14' });
Object.assign(HELP, {
  pp19: ['Portal reports', 'When the DC office gives the full set of portal files, choose them all at once.', 'The app works out claimed, part-claimed and unclaimed from them; the portal is always right.'],
  fl19: { en: ['Farmer ID lookup', 'Search by name, father, khasra, Farmer ID or enrolment number.', 'Share the status with the farmer in one tap.'], hi: ['Farmer ID dhoondein', 'Naam, walid, khasra, Farmer ID ya enrolment no. se dhoondein.', 'Kisan ko status ek tap mein bhejein.'] },
  ins19: ['Insights', 'Rank, villages, pace and target, approvals and land.', 'Tap any colour in a village bar to see those buckets.']
});
/* Home: an Insights card; More: portal reports and lookup */
const _t = VIEWS.tos12;
if (_t) VIEWS.tos12 = async function (a) {
  await _t(a);
  try { const more = $$('.cd', view()).find(c => /^\s*More/.test(($('h3', c) || {}).textContent || '')); if (more && !$('#m19', more)) { const h = $('h3', more), d = document.createElement('div'); d.id = 'm19';
      d.innerHTML = `${office() ? '<button class="row" data-go="ins19"><span>Insights<small>Rank, villages, pace, target, approvals, land</small></span><span>›</span></button><button class="row" data-go="pp19"><span>Portal reports upload<small>Full set from the DC office</small></span><span>›</span></button>' : ''}<button class="row" data-go="fl19"><span>Farmer ID lookup<small>Is his ID made? Approved?</small></span><span>›</span></button>`;
      h.after(d); $$('[data-go]', d).forEach(b => b.onclick = e => { e.stopPropagation(); go(b.dataset.go, {}); }); }
    if (!office() || $('#i19c')) return; const D = await ins(); if (current().name !== 'tos12') return; const rk = D.rank.length ? D.rank[D.rank.length - 1] : null;
    const t = D.villages.reduce((x, v) => ({ m: x.m + v.claimed + v.part, t: x.t + v.total }), { m: 0, t: 0 });
    const el = document.createElement('button'); el.id = 'i19c'; el.className = 'cd row p19'; el.style.cssText = 'display:block;border:0;width:100%;text-align:left';
    el.innerHTML = `<h3><span>Insights</span>${rk && rk.rank ? `<span class="pill ok">District rank ${rk.rank} of ${rk.of}</span>` : ''}</h3><div class="sb" style="margin:6px 0">${['claimed', 'part', 'can', 'not', 'unsorted'].map(k => { const s = D.villages.reduce((x, v) => x + v[k], 0); return s ? `<span style="display:block;width:${s * 100 / (t.t || 1)}%;background:${COL[k]}"></span>` : ''; }).join('')}</div>
      <small class="hint">${(t.m * 100 / (t.t || 1)).toFixed(1)}% buckets with ID made · ${D.pace != null ? N(D.pace) + ' a day · ' : ''}${N(D.ids.pending)} approvals pending · tap for more</small>`;
    el.onclick = () => go('ins19', {}); const host = $('.t12', view()); const d19 = $('#d19c', view()); if (d19) d19.after(el); else if (host) { const h = $('h1', host); host.insertBefore(el, h ? h.nextElementSibling : host.firstChild); } } catch (e) {}
};
/* Patwari register: a lookup button on his screen */
const _r14 = VIEWS.reg14;
if (_r14) VIEWS.reg14 = async function (a) { await _r14(a); try { const h = $('.t12 h1', view()); if (h && !$('#fl19b')) { const b = document.createElement('button'); b.id = 'fl19b'; b.className = 'btn12 gh'; b.style.cssText = 'width:100%;margin:0 0 12px'; b.textContent = 'Farmer ID lookup · ID bani ya nahi?'; b.onclick = () => go('fl19', {}); h.nextElementSibling ? h.nextElementSibling.after(b) : h.after(b); } } catch (e) {} };
/* Reports tab: entries */
const _rp = VIEWS.rep8;
if (_rp) VIEWS.rep8 = async function (a) { await _rp(a); try { if (!office() || $('#r19e')) return; const v = view(), d = document.createElement('div'); d.id = 'r19e'; d.style.cssText = 'display:flex;gap:8px;margin:12px 14px;flex-wrap:wrap';
  d.innerHTML = '<button class="btn" data-go="ins19" style="flex:1">Insights and lists</button><button class="btn" data-go="pp19" style="flex:1">Portal reports upload</button>'; $$('[data-go]', d).forEach(b => b.onclick = () => go(b.dataset.go, {})); v.insertBefore(d, v.firstChild); } catch (e) {} };
/* one layout: a village's pending list PDF prints the register once a register list is frozen */
if (typeof pendFile14 === 'function') { const _pf = pendFile14; pendFile14 = function (e, t, a, s) {
  if (t === 'pdf' && Array.isArray(e) && e.length === 1 && window.TOS14 && TOS14.regPDF && S.r14my && S.r14my.list) { closeAllSheets(); return runTask('Register · ' + (a || ''), ['Making the register'], async () => { await TOS14.regPDF(String(e[0])); return { msg: 'Register ready ✓' }; }); }
  return _pf(e, t, a, s); }; }
window.TOS19P = { v: V };
})();
