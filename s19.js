/* TehsilOS 12.2.0 — Step 1.
 * Assar master control (On / View only / Off, Tehsildar Assar login), today's progress (4:30 PM to 4:30 PM) on Home and in the
 * daily report, no master sheet, lighter uploads. Loaded after register14.js; uses the main app's helpers.
 */
"use strict";
(function () {
const V19 = '12.2.0';
const N = x => Number(x || 0).toLocaleString('en-IN');
const view = () => $('#view');
const css = document.createElement('style');
css.textContent = `
.d19 .tb{width:100%;border-collapse:collapse;font-size:12.5px;min-width:340px}.d19 .tb th{font-size:11.5px;color:#5B6168;font-weight:800;text-align:right;padding:6px 4px;border-bottom:1px solid #ECE6DF}
.d19 .tb th:first-child,.d19 .tb td:first-child{text-align:left}.d19 .tb td{padding:7px 4px;border-bottom:1px solid #F3EEE8;text-align:right}.d19 .tb tr.t td{font-weight:900;border-top:2px solid #E4DDD5}
.d19 .up{color:#1F6B42;font-weight:900}.d19 .dn{color:#9A3F1C;font-weight:900}
.d19 .big{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:6px 0 10px}.d19 .big div{background:#F7F4F0;border-radius:12px;padding:10px}.d19 .big b{display:block;font-size:24px;font-weight:900;line-height:1.1}
.d19 .big span{font-size:11.5px;color:#5B6168;font-weight:700}
.a19 .md{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:8px 0}.a19 .md button{font:inherit;font-weight:800;font-size:14px;padding:12px 6px;border-radius:12px;border:1px solid #DDD5CC;background:#fff;color:#1E2226}
.a19 .md button.on{background:#1E2226;color:#fff;border-color:#1E2226}
.a19 input[type=text],.a19 input[type=tel]{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:11px 12px;border:1px solid #DDD5CC;border-radius:12px;margin:4px 0 8px}
html.n19 [data-n19]{display:none!important}
`;
document.head.appendChild(css);

/* ---------- server version: compact uploads only when the server understands them ---------- */
let SV19 = '';
const vge = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) > (y[i] || 0)) return true; if ((x[i] || 0) < (y[i] || 0)) return false; } return true; };
const _api19 = api;
api = async function (a, p, t) {
  if (a === 'uploadApply' && p && Array.isArray(p.rows) && p.rows.length > 200) {
    if (!SV19) { try { SV19 = (await _api19('ping', {}, 15000)).version || ''; } catch (e) {} }
    if (SV19 && vge(SV19, '12.2.0')) { const g = {}, out = [];
      p.rows.forEach(r => { const id = String(r[0] || '').trim(); if (!id) return; const k = id + '|' + String(r[1] || '').trim(); let x = g[k];
        if (!x) { x = g[k] = [r[0], r[1], r[2], [], r[4], r[5]]; out.push(x); } const s = String(r[3] || '').trim(); if (s && x[3].indexOf(s) < 0) x[3].push(s); });
      out.forEach(x => x[3] = x[3].join('\u001f')); p = Object.assign({}, p, { rows: out }); }
  }
  return _api19(a, p, t);
};
setTimeout(async () => { try { SV19 = (await _api19('ping', {}, 15000)).version || ''; } catch (e) {} }, 4000);

/* ---------- no master sheet (both tehsils): hidden wherever it appears ---------- */
const hideMaster = () => { $$('button, .row, a').forEach(b => { if (!b.dataset.n19 && /Master sheet/i.test(b.textContent || '') && b.children.length < 6) b.setAttribute('data-n19', '1'); }); };
document.documentElement.classList.add('n19');
try { new MutationObserver(() => { clearTimeout(hideMaster._t); hideMaster._t = setTimeout(hideMaster, 60); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}

/* ---------- today's progress ---------- */
async function loadDay(force) { if (!force && S.d19 && Date.now() - S.d19At < 120000) return S.d19; S.d19 = await api('day19', {}, 60000); S.d19At = Date.now(); return S.d19; }
function dayTable(D) {
  const T = D.totals, ar = (a, b) => a < b ? `<span class="up">↓ ${N(b - a)}</span>` : a > b ? `<span class="dn">↑ ${N(a - b)}</span>` : '–';
  return `<div class="big"><div><b>${N(T.made + T.part)}</b><span>IDs made (buckets claimed)</span></div><div><b>${N(T.marked)}</b><span>Buckets marked by Patwaris</span></div><div><b>${N(T.pending)}</b><span>Pending now ${ar(T.pending, T.pending_start)}</span></div></div>
    <div style="overflow-x:auto"><table class="tb"><tr><th>Village</th><th>Claimed</th><th>of which part</th><th>Marked</th><th>Pending</th><th>Change</th><th>Unsorted</th></tr>
    ${D.villages.map(v => `<tr><td>${esc(v.name)}</td><td>${N(v.made + v.part)}</td><td>${v.part ? N(v.part) : '–'}</td><td>${N(v.marked)}</td><td>${N(v.pending)}</td><td>${ar(v.pending, v.pending_start)}</td><td>${N(v.unsorted)}</td></tr>`).join('')}
    <tr class="t"><td>Total</td><td>${N(T.made + T.part)}</td><td>${T.part ? N(T.part) : '–'}</td><td>${N(T.marked)}</td><td>${N(T.pending)}</td><td>${ar(T.pending, T.pending_start)}</td><td>${N(T.unsorted)}</td></tr></table></div>
    <p class="hint" style="margin-top:8px">${D.best ? `Best: <b>${esc(D.best.name)}</b> (${N(D.best.n)} claimed). ` : ''}${D.weak ? `Weakest: <b>${esc(D.weak.name)}</b> (${N(D.weak.n)} claimed, ${N(D.weak.pending)} pending). ` : ''}${D.totals.fresh ? N(D.totals.fresh) + ' new buckets appeared on the portal list. ' : ''}Counted from the portal lists uploaded in this period.</p>`;
}
VIEWS.day19 = async function () {
  setHeader('Today'); document.body.classList.add('wide');
  view().innerHTML = `<div class="t12 d19"><p class="sub">Loading…</p></div>`;
  let D; try { D = await loadDay(true); } catch (e) { view().innerHTML = `<div class="t12"><p class="lead">${esc(e.message)}</p></div>`; return; }
  view().innerHTML = `<div class="t12 d19"><h1>Today's progress · ${esc(D.name)}</h1><p class="sub">${esc(D.window.label)}${D.window.closed ? ' · day closed as the DC office counts' : ' · running'}</p><div class="cd">${dayTable(D)}</div></div>`;
};
Object.assign(TABOF10, { day19: 'tos12', assar19: 'tos12' });
const _tos19 = VIEWS.tos12;
if (_tos19) VIEWS.tos12 = async function (a) {
  await _tos19(a);
  try { if (['ADMIN', 'DA', 'NT'].indexOf(role()) < 0) return; const D = await loadDay(); if (current().name !== 'tos12' || $('#d19c')) return;
    const T = D.totals, el = document.createElement('div'); el.className = 'cd d19'; el.id = 'd19c'; el.style.cursor = 'pointer';
    el.innerHTML = `<h3><span>Today · ${esc(D.window.closed ? 'day closed 4:30 PM' : 'since 4:30 PM yesterday')}</span><span class="pill ${T.made + T.part ? 'ok' : 'ur'}">${N(T.made + T.part)} IDs</span></h3>
      <div class="big" style="margin-bottom:0"><div><b>${N(T.made + T.part)}</b><span>Claimed</span></div><div><b>${N(T.marked)}</b><span>Marked</span></div><div><b>${N(T.pending)}</b><span>Pending ${T.pending < T.pending_start ? '↓ ' + N(T.pending_start - T.pending) : ''}</span></div></div>
      <small class="hint">${D.best ? 'Best: ' + esc(D.best.name) + ' · ' : ''}tap for village-wise</small>`;
    el.onclick = () => go('day19', {}); const host = $('.t12', view()); if (host) { const h = $('h1', host); const after = h && h.nextElementSibling; host.insertBefore(el, after ? after.nextElementSibling : host.firstChild); } } catch (e) {}
};
/* the daily report opens with the day's progress */
if (typeof reportPdf90 === 'function') { const _rp = reportPdf90; reportPdf90 = function (e) {
  const doc = _rp(e); try { if (!e || !e.day19) return doc; const D = e.day19, T = D.totals, tx = pdfText, W = doc.internal.pageSize.getWidth();
    doc.insertPage(1); doc.setPage(1); let y = 40;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text(tx(`Tehsil ${D.name} · today's progress`), 36, y); y += 18;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(90); doc.text(tx(D.window.label + (D.window.closed ? ' (day as counted by the DC office)' : ' (running)')), 36, y); doc.setTextColor(0); y += 22;
    const box = (x, v, l) => { doc.setFillColor(247, 244, 240); doc.roundedRect(x, y, (W - 72 - 20) / 3, 52, 6, 6, 'F'); doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text(N(v), x + 10, y + 26); doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(tx(l), x + 10, y + 42); };
    const bw = (W - 72 - 20) / 3; box(36, T.made + T.part, 'IDs made (buckets claimed)'); box(36 + bw + 10, T.marked, 'Buckets marked by Patwaris'); box(36 + 2 * (bw + 10), T.pending, `Pending now (start ${N(T.pending_start)})`); y += 68;
    const ch = (a, b) => a < b ? '-' + N(b - a) : a > b ? '+' + N(a - b) : '0';
    doc.autoTable({ startY: y, margin: { left: 36, right: 36 }, theme: 'grid', styles: { fontSize: 9.5, cellPadding: 4, halign: 'right' }, headStyles: { fillColor: [30, 34, 38], textColor: 255 }, columnStyles: { 0: { halign: 'left' } },
      head: [['Village', 'Claimed', 'of which part', 'Marked', 'Pending', 'Change', 'Unsorted']],
      body: D.villages.map(v => [v.name, N(v.made + v.part), v.part ? N(v.part) : '-', N(v.marked), N(v.pending), ch(v.pending, v.pending_start), N(v.unsorted)]).concat([['Total', N(T.made + T.part), T.part ? N(T.part) : '-', N(T.marked), N(T.pending), ch(T.pending, T.pending_start), N(T.unsorted)]]).map(r => r.map(tx)),
      didParseCell: d => { if (d.section === 'body' && d.row.index === D.villages.length) d.cell.styles.fontStyle = 'bold'; } });
    y = doc.lastAutoTable.finalY + 16; doc.setFontSize(10);
    const line = (D.best ? `Best: ${D.best.name} (${D.best.n} claimed). ` : '') + (D.weak ? `Weakest: ${D.weak.name} (${D.weak.n} claimed, ${D.weak.pending} pending). ` : '') + (T.fresh ? `${T.fresh} new buckets appeared on the portal list. ` : '') + 'Counted from the portal lists uploaded in this period.';
    doc.text(doc.splitTextToSize(tx(line), W - 72), 36, y);
  } catch (x) { try { console.error(x); } catch (z) {} } return doc; }; }

/* ---------- Tehsil Assar: master control ---------- */
VIEWS.assar19 = async function () {
  setHeader('Tehsil Assar'); document.body.classList.add('wide');
  view().innerHTML = `<div class="t12 a19"><p class="sub">Loading…</p></div>`;
  let A; try { A = await api('assar19Get', {}, 30000); } catch (e) { view().innerHTML = `<div class="t12"><p class="lead">${esc(e.message)}</p></div>`; return; }
  const t = A.tehsildar || { name: '', mobile: '', on: false };
  const ML = { ON: ['On', 'Full app, as before'], MON: ['View only', 'Hidden from you. Its DA uploads; its staff and Tehsildar view figures and the hourly status'], OFF: ['Off', 'Every Assar login closed; data kept'] };
  view().innerHTML = `<div class="t12 a19"><h1>Tehsil Assar</h1><p class="sub">Not in your charge. You keep the master switch.</p>
    <div class="cd"><h3>Master switch</h3><div class="md">${['ON', 'MON', 'OFF'].map(m => `<button data-m="${m}" class="${A.mode === m ? 'on' : ''}">${ML[m][0]}</button>`).join('')}</div><p class="hint">${esc(ML[A.mode][1])}.</p></div>
    <div class="cd"><h3>Tehsildar Assar login <span class="pill ${t.on ? 'ok' : 'nu'}">${t.on ? 'On' : 'Off'}</span></h3><p class="hint">View only: figures and the hourly status of Assar. No switches, settings, uploads or reports.</p>
      <label class="hint" for="n19">Name</label><input type="text" id="n19" value="${esc(t.name)}" placeholder="Name of the Tehsildar Assar">
      <label class="hint" for="m19">Mobile (for the login list)</label><input type="tel" id="m19" placeholder="${esc(t.mobile || '10-digit mobile')}" inputmode="numeric">
      <div class="acts"><button class="btn12" id="s19">${t.on ? 'Save' : 'Save and turn on'}</button>${t.on ? '<button class="btn12 gh" id="o19">Turn off</button>' : ''}${A.tehsildar ? '<button class="btn12 gh" id="p19">Reset PIN to 1234</button>' : ''}</div></div>
    <div class="cd"><h3>Assar staff with a login</h3>${A.staff.length ? A.staff.map(x => `<div class="row" style="cursor:default"><span>${esc(x.name)}<small>${esc(x.designation)}</small></span></div>`).join('') : '<p class="hint">None.</p>'}</div></div>`;
  $$('[data-m]').forEach(b => b.onclick = () => { const m = b.dataset.m; if (m === A.mode) return; if (!confirm(`Set Tehsil Assar to "${ML[m][0]}"?`)) return;
    busy(b, 'Switching', async () => { await api('tehsil18Set', { tehsil_id: 'T_ASSAR', mode: m }, 60000); toast('Tehsil Assar: ' + ML[m][0] + ' ✓'); render(); }); });
  const save = (on, extra) => api('succ19Set', Object.assign({ name: $('#n19').value, mobile: $('#m19').value, on }, extra || {}), 30000);
  $('#s19').onclick = () => busy($('#s19'), 'Saving', async () => { if (!$('#n19').value.trim()) throw new Error('Type the name.'); await save(true); toast('Tehsildar Assar login on ✓ (PIN 1234 on first login)'); render(); });
  if ($('#o19')) $('#o19').onclick = () => busy($('#o19'), 'Turning off', async () => { await save(false); toast('Login off'); render(); });
  if ($('#p19')) $('#p19').onclick = () => busy($('#p19'), 'Resetting', async () => { await save(t.on, { pin_reset: 1 }); toast('PIN reset to 1234'); });
};
/* the old Assar feature switches give way to the master control */
const _f19 = VIEWS.feat12;
if (_f19) VIEWS.feat12 = async function (a) {
  await _f19(a);
  try { if (current().name !== 'feat12' || role() !== 'ADMIN') return; $$('.cd', view()).forEach(c => { const h = $('h3', c); if (h && /Tehsil Assar/.test(h.textContent)) c.remove(); });
    const host = $('.t12', view()); if (!host || $('#a19e')) return; const b = document.createElement('button'); b.id = 'a19e'; b.className = 'row'; b.style.cssText = 'width:100%;background:#fff;border-radius:16px;margin:0 0 12px';
    b.innerHTML = '<span><b>Tehsil Assar</b><small>Master switch and the Tehsildar Assar login</small></span><span>›</span>'; b.onclick = () => go('assar19', {}); const h = $('h1', host); host.insertBefore(b, h ? h.nextElementSibling : host.firstChild); } catch (e) {}
};
window.TOS19 = { v: V19 };
})();
