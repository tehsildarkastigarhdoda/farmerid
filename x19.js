/* TehsilOS 12.4.0 — Step 3: alerts, follow-ups and handover.
 * Home alerts; Insights → more lists: wrong-person claims, Patwari scorecard, mutation drive, name corrections,
 * small-share note to the DC, approval follow-up letter (tracked), camp planner (with result), charge handover report.
 */
"use strict";
(function () {
const N = x => Number(x || 0).toLocaleString('en-IN');
const view = () => $('#view');
const office = () => ['ADMIN', 'DA', 'NT'].indexOf(role()) >= 0;
const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const istNow = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 19).replace('T', ' ');
const css = document.createElement('style');
css.textContent = `.x19 .al{display:flex;gap:10px;padding:9px 0;border-top:1px solid #F0EBE5;font-size:13.5px}.x19 .al i{flex:none;width:8px;height:8px;border-radius:50%;background:#C8553D;margin-top:6px}
.x19 .f{display:block;font-size:12px;font-weight:800;color:#5B6168;margin:8px 0 3px}.x19 input,.x19 select{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:10px 12px;border:1px solid #DDD5CC;border-radius:12px;background:#fff}
.x19 .ck{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid #F0EBE5;font-size:13.5px}.x19 .ck input{width:22px;height:22px;flex:none;accent-color:#9A3F1C}.x19 .ck small{display:block;color:#5B6168}`;
document.head.appendChild(css);
const pdfP = async () => { await loadPDF(); const d = new jspdf.jsPDF({ unit: 'pt', format: 'a4' }); d.setFont('helvetica', 'normal'); return d; };
const xl = async (name, head, rows) => { await loadXLSX(); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([head].concat(rows)), 'List'); dlXlsx(wb, name); };
const title = (d, t, sub) => { const tx = pdfText; d.setFont('helvetica', 'bold'); d.setFontSize(13.5); d.text(tx(t), 40, 46); d.setFont('helvetica', 'normal'); d.setFontSize(9.5); if (sub) d.text(d.splitTextToSize(tx(sub), 515), 40, 62); };
const tbl = (d, y, head, body, cs) => d.autoTable({ startY: y, theme: 'grid', margin: { left: 40, right: 40 }, styles: { fontSize: 8.8, cellPadding: 3, valign: 'top' }, headStyles: { fillColor: [30, 34, 38] }, columnStyles: cs || {}, head: [head], body: body.map(r => r.map(x => pdfText(String(x == null ? '' : x)))) });
const letterHead = (d, to, subject, no) => { const tx = pdfText, W = 595; let y = 50; d.setFont('times', 'bold'); d.setFontSize(13); d.text('OFFICE OF THE TEHSILDAR KASTIGARH', W / 2, y, { align: 'center' }); y += 26;
  d.setFont('times', 'normal'); d.setFontSize(11.5); d.text(tx('No. ' + (no || '____________________')), 50, y); d.text('Dated: ' + dmy(istNow().slice(0, 10)), W - 50, y, { align: 'right' }); y += 26;
  d.text('To', 50, y); y += 16; d.splitTextToSize(tx(to), 400).forEach(l => { d.text(l, 70, y); y += 15; }); y += 10;
  d.setFont('times', 'bold'); const s = d.splitTextToSize(tx('Subject: ' + subject), 495); d.text(s, 50, y); y += s.length * 15 + 10; d.setFont('times', 'normal'); d.text('Sir,', 50, y); return y + 20; };
const sign = (d, y) => { if (y > 720) { d.addPage(); y = 80; } d.setFont('times', 'normal'); d.setFontSize(11.5); d.text('Yours faithfully,', 545, y, { align: 'right' }); d.setFont('times', 'bold'); d.text('Tehsildar', 520, y + 40, { align: 'center' }); d.setFont('times', 'normal'); d.text('Kastigarh', 520, y + 55, { align: 'center' }); };
const para = (d, y, t) => { const L = d.splitTextToSize(pdfText(t), 495); d.setFont('times', 'normal'); d.setFontSize(11.5); d.text(L, 50, y, { align: 'justify', maxWidth: 495 }); return y + L.length * 15 + 8; };

/* ---------- Home: alerts ---------- */
const _t = VIEWS.tos12;
if (_t) VIEWS.tos12 = async function (a) {
  await _t(a);
  try { if (!office() || $('#al19')) return; const A = await api('alerts19', {}, 45000); if (current().name !== 'tos12' || !A.alerts.length || $('#al19')) return;
    const el = document.createElement('div'); el.id = 'al19'; el.className = 'cd x19';
    el.innerHTML = `<h3><span>Needs attention</span><span class="pill ur">${A.alerts.length}</span></h3>${A.alerts.slice(0, 6).map(x => `<div class="al"><i></i><span>${esc(x.t)}</span></div>`).join('')}`;
    const host = $('.t12', view()); const h = $('h1', host); if (host) host.insertBefore(el, h ? h.nextElementSibling : host.firstChild); } catch (e) {}
};

/* ---------- Insights: the step-3 lists ---------- */
const _i = VIEWS.ins19;
if (_i) VIEWS.ins19 = async function (a) {
  await _i(a);
  try { const box = $$('.cd', view()).find(c => /Lists and reports/.test(($('h3', c) || {}).textContent || '')); if (!box || $('#x19l')) return;
    const d = document.createElement('div'); d.id = 'x19l';
    d.innerHTML = [['wrong', 'Wrong-person claims', 'Claims that may lock out the real owner · Excel'], ['score', 'Patwari scorecard (week)', 'Marked, IDs and work left per halqa · PDF'],
      ['mut', 'Mutation drive list', 'Expired owners with heirs found · PDF per halqa'], ['names', 'Name correction list', 'Land record vs Aadhaar · Excel'],
      ['small', 'Small shares: note to the DC', 'Owners under 0.01 ha, village-wise · letter'], ['appr', 'Approval follow-up letter', 'Pending approvals to the approving authority · tracked'],
      ['camp', 'Camp planner', 'Who to call, a Hinglish notice, and the result'], ['hand', 'Charge handover report', 'Everything a successor needs · PDF']]
      .map(r => `<button class="row" data-x="${r[0]}"><span>${r[1]}<small>${r[2]}</small></span><span>›</span></button>`).join('');
    box.appendChild(d); $$('[data-x]', d).forEach(b => b.onclick = () => b.dataset.x === 'camp' ? go('camp19', {}) : b.dataset.x === 'appr' ? go('appr19', {}) : busy(b, 'Making', () => make(b.dataset.x))); } catch (e) {}
};
async function make(k) {
  const tx = pdfText;
  if (k === 'wrong') { const R = await api('wrong19', {}, 9e4); if (!R.rows.length) return info('No wrong-person claim found.');
    return xl('Wrong-person claims – Kastigarh.xlsx', ['Why', 'Village', 'Land record (name s/o father)', 'Claimed by (Aadhaar name, father)', 'Farmer ID', 'Khasras'], R.rows.map(r => [r.why, r.village, r.land, r.aadhaar, r.farmer_id, r.khasras])); }
  if (k === 'names') { const R = await api('names19', {}, 9e4); if (!R.rows.length) return info('Nothing to correct.');
    return xl('Name correction list – Kastigarh.xlsx', ['Case', 'Village', 'Land record (name s/o father)', 'Aadhaar (name, father)', 'Farmer ID', 'Khasras', 'Corrected? (date)'], R.rows.map(r => [r.kind, r.village, r.land, r.aadhaar, r.farmer_id, r.khasras, ''])); }
  if (k === 'score') { const R = await api('score19', {}, 9e4); const d = await pdfP(); title(d, 'Patwari scorecard – week ' + dmy(R.from) + ' to ' + dmy(R.to), 'Marked = owners given a reason this week. IDs = buckets with ID made in his villages this week (from the uploads). Work left = owners not yet marked in the register.');
    tbl(d, 82, ['Halqa', 'Patwari', 'Villages', 'Marked', 'IDs made', 'Work left', 'Register done'], R.rows.map(r => [r.ph, r.patwari, r.villages, N(r.marked), r.ids == null ? '-' : N(r.ids), N(r.left), r.done_pct == null ? '-' : r.done_pct + '%']));
    if (R.best) { d.setFontSize(11); d.setFont('helvetica', 'bold'); d.text(tx('Patwari of the week: ' + R.best), 40, d.lastAutoTable.finalY + 22); }
    return deliverPDF(d, 'Patwari scorecard – ' + dmy(R.to) + '.pdf'); }
  if (k === 'mut') { const R = await api('mut19', {}, 9e4); if (!R.rows.length) return info('No expired owner marked yet.'); const d = await pdfP(); const phs = Array.from(new Set(R.rows.map(r => r.ph || '-'))); let f = true;
    phs.forEach(ph => { if (!f) d.addPage(); f = false; const L = R.rows.filter(r => (r.ph || '-') === ph); title(d, 'Mutation drive – PH ' + ph + ' – ' + L.length + ' expired owners', 'Inheritance mutation first; the heirs can then get Farmer IDs. Heirs found = landholders on the same khasras whose father is the expired owner.');
      tbl(d, 82, ['#', 'Village', 'Expired owner s/o father', 'Khasras', 'Heirs found', 'Mutation no. / date'], L.map((r, i) => [i + 1, r.village, r.owner + ' s/o ' + r.father, r.khasras, r.heirs, '']), { 0: { cellWidth: 22 }, 3: { cellWidth: 140 }, 4: { cellWidth: 110 }, 5: { cellWidth: 80 } }); });
    return deliverPDF(d, 'Mutation drive list – Kastigarh.pdf'); }
  if (k === 'small') { const I = await api('ins19', {}, 6e4); const V = I.villages.filter(v => v.small); const T = V.reduce((a, v) => a + v.small, 0); const d = await pdfP();
    let y = letterHead(d, 'The Deputy Commissioner,\nDoda.', 'Farmer ID (Agristack): owners with very small shares of land – guidance sought.', '');
    y = para(d, y, `Of the unclaimed buckets of Tehsil Kastigarh, ${N(T)} private owners hold a share of less than 0.01 hectare (about 4 marla) each, as per the village-wise bucket data of the portal. Most of these are co-sharers in large joint khasras; many live outside or see no benefit in coming forward for so small a share, and they remain on the unclaimed list in spite of repeated efforts. The village-wise position is as under:`);
    d.autoTable({ startY: y, margin: { left: 50, right: 50 }, theme: 'grid', styles: { font: 'times', fontSize: 10.5 }, headStyles: { fillColor: [235, 235, 235], textColor: 0 }, head: [['Village', 'Owners with less than 0.01 ha', 'Unclaimed buckets']], body: V.map(v => [v.name, N(v.small), N(v.pending)]).concat([['Total', N(T), N(I.villages.reduce((a, v) => a + v.pending, 0))]]).map(r => r.map(tx)) });
    y = para(d, d.lastAutoTable.finalY + 16, 'It is requested that guidance may kindly be given whether such owners may be shown as a separate category in the reports, or whether their shares may be claimed through the main family member, so that the figures reflect the actual position.');
    sign(d, y + 10); return deliverPDF(d, 'Note to DC – small shares – Kastigarh.pdf'); }
  if (k === 'hand') { const H = await api('hand19', {}, 6e4), I = await api('ins19', {}, 6e4); const d = await pdfP();
    title(d, 'Charge handover – TehsilOS – Tehsil ' + H.tehsil, 'Made on ' + dmy(H.at.slice(0, 10)) + ' ' + H.at.slice(11, 16) + ' · app version ' + H.version + ' · last backup ' + (H.backup_at || '-'));
    const T = I.villages.reduce((a, v) => ({ t: a.t + v.total, m: a.m + v.claimed + v.part, p: a.p + v.pending, u: a.u + v.unsorted }), { t: 0, m: 0, p: 0, u: 0 });
    tbl(d, 82, ['Farmer ID position', 'Figure'], [['Buckets', N(T.t)], ['With Farmer ID made (incl. part)', N(T.m)], ['Pending', N(T.p)], ['Not yet sorted by Patwaris', N(T.u)], ['Farmer IDs made / approved / pending approval', N(I.ids.made) + ' / ' + N(I.ids.approved) + ' / ' + N(I.ids.pending)], ['Pace (IDs a day, 7 days)', I.pace == null ? '-' : N(I.pace)], ['Target', H.target.pct + '%' + (H.target.date ? ' by ' + dmy(H.target.date) : '')], ['Register for ACR', H.register ? 'List of ' + dmy(String(H.register.list_at || H.register.at).slice(0, 10)) + ', ' + N(H.register.n) + ' buckets' : 'Not started'], ['Tehsil Assar', H.assar]]);
    tbl(d, d.lastAutoTable.finalY + 14, ['Village', 'Patwar Halqa'], H.villages.map(v => [v.name, v.ph]));
    tbl(d, d.lastAutoTable.finalY + 14, ['Patwar Halqa', 'Patwari'], H.halqas.map(h => [h.name, h.patwari]));
    tbl(d, d.lastAutoTable.finalY + 14, ['Staff with a login', 'Designation', 'Role', 'Mobile'], H.staff.map(s => [s.name, s.designation, s.role, s.mobile]));
    d.addPage(); title(d, 'How the app runs', '');
    tbl(d, 70, ['What', 'How'], [['App', 'tehsildarkastigarhdoda.github.io/farmerid/app.html (front end on GitHub; private server code in the tehsilos-server repository)'], ['Data', 'One Google Sheet on the office Gmail; daily copy kept for 30 days in Drive ("TehsilOS backups")'],
      ['Hourly', 'DA uploads the portal unclaimed list of each village; the app merges it (Patwari marks kept, gone = ID made)'], ['Portal reports', 'When the DC office gives the full set: Home → More → Portal reports upload; the portal is always taken as right'],
      ['Patwaris', 'Register screen: mark a reason for every unclaimed owner (offline works); Farmer ID lookup'], ['Reports', 'Daily report (4:30 PM day), Insights and lists, ACR register, SVAMITVA'],
      ['Logins', 'Home → More → People; new PIN 1234 on first login; the Tehsildar resets PINs'], ['Update the server', 'Paste Code.gs in Apps Script → Deploy → Manage deployments → Edit → New version']]);
    return deliverPDF(d, 'Charge handover – TehsilOS – ' + H.tehsil + '.pdf'); }
}

/* ---------- approval follow-up letter ---------- */
VIEWS.appr19 = async function () {
  setHeader('Approval follow-up'); view().innerHTML = '<div class="t12 x19"><p class="sub">Loading…</p></div>';
  const [G, L] = await Promise.all([api('appr19Get', {}, 3e4), api('lists19', { kind: 'approval' }, 9e4)]);
  const byV = {}; L.rows.forEach(r => byV[r.village] = (byV[r.village] || 0) + 1);
  view().innerHTML = `<div class="t12 x19"><h1>Approval follow-up</h1><p class="sub">${N(L.rows.length)} Farmer IDs are made but not yet approved.</p>
    ${G.letter ? `<div class="cd"><h3>Last letter · ${esc(dmy(G.letter.at.slice(0, 10)))}${G.letter.no ? ' · No. ' + esc(G.letter.no) : ''}</h3><p class="lead" style="margin:0"><b>${N(G.letter.approved)}</b> of ${N(G.letter.n)} approved since the letter.</p></div>` : ''}
    <div class="cd"><h3>New letter</h3><label class="f" for="to">To</label><input id="to" value="${esc((G.letter && G.letter.to) || 'The Chief Agriculture Officer, Doda')}">
      <label class="f" for="no">Letter no. (optional)</label><input id="no" value="">
      <p class="hint" style="margin-top:8px">${Object.keys(byV).sort().map(v => esc(v) + ' ' + byV[v]).join(' · ')}</p>
      <button class="btn btn-primary" id="mk" style="margin-top:10px">Make the letter with the list</button></div></div>`;
  $('#mk').onclick = () => busy($('#mk'), 'Making', async () => { const d = await pdfP(), to = $('#to').value, no = $('#no').value;
    let y = letterHead(d, to, 'Farmer ID (Agristack), Tehsil Kastigarh: approval of Farmer IDs pending.', no);
    y = para(d, y, `${N(L.rows.length)} Farmer IDs of Tehsil Kastigarh have been made and submitted on the portal but are still awaiting approval. The village-wise position is given below and the complete list is enclosed. It is requested that these may kindly be approved at the earliest, so that the farmers are not left out of the benefits and the saturation figures of the tehsil reflect the work done.`);
    d.autoTable({ startY: y, margin: { left: 50, right: 50 }, theme: 'grid', styles: { font: 'times', fontSize: 10.5 }, headStyles: { fillColor: [235, 235, 235], textColor: 0 }, head: [['Village', 'Farmer IDs pending approval']], body: Object.keys(byV).sort().map(v => [v, N(byV[v])]).concat([['Total', N(L.rows.length)]]) });
    y = para(d, d.lastAutoTable.finalY + 14, 'Encl: List of pending Farmer IDs.'); sign(d, y + 10);
    d.addPage(); title(d, 'Annexure: Farmer IDs pending approval – Tehsil Kastigarh', '');
    tbl(d, 72, ['#', 'Village', 'Name', 'Father / husband', 'Enrolment no.', 'Farmer ID'], L.rows.map((r, i) => [i + 1, r.village, r.name, r.father, r.enrol, r.farmer_id]), { 0: { cellWidth: 26 } });
    await api('appr19Save', { to, no, enrols: L.rows.map(r => r.enrol) }, 3e4); deliverPDF(d, 'Approval follow-up – Kastigarh.pdf'); });
};

/* ---------- camp planner ---------- */
VIEWS.camp19 = async function (a) {
  setHeader('Camp planner'); a = a || {}; view().innerHTML = '<div class="t12 x19"><p class="sub">Loading…</p></div>';
  const [E, C] = await Promise.all([api('ew19', {}, 9e4), api('camp19List', {}, 3e4)]); const vs = Array.from(new Set(E.rows.map(r => r.village))).sort();
  a.v = a.v || vs[0] || ''; const L = E.rows.filter(r => r.village === a.v).slice(0, 60); a.sel = a.sel || {};
  view().innerHTML = `<div class="t12 x19"><h1>Camp planner</h1>
    ${C.camps.length ? `<div class="cd"><h3>Camps and their result</h3>${C.camps.slice(0, 8).map(c => `<div class="al" style="justify-content:space-between"><span>${esc(c.village)} · ${esc(dmy(c.date))}${c.venue ? ' · ' + esc(c.venue) : ''}</span><b>${N(c.done)} of ${N(c.n)} got IDs</b></div>`).join('')}</div>` : ''}
    <div class="cd"><h3>New camp</h3><label class="f" for="v">Village</label><select id="v">${vs.map(v => `<option ${v === a.v ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>
      <label class="f" for="d">Date</label><input type="date" id="d" value="${esc(a.d || '')}"><label class="f" for="ve">Venue</label><input id="ve" value="${esc(a.ve || '')}" placeholder="e.g. Panchayat Ghar">
      <p class="hint" style="margin-top:10px">Families most likely to get IDs now (last brother first). Untick any you do not want.</p>
      ${L.map((r, i) => `<label class="ck"><input type="checkbox" data-i="${i}" ${a.sel[i] === false ? '' : 'checked'}><span><b>${esc(r.names.join(', '))}</b> s/o ${esc(r.father)}${r.lastbro ? ' · <b style="color:#1D4F50">LAST BROTHER</b>' : ''}<small>khasra ${esc(r.khasras)}</small></span></label>`).join('') || '<p class="hint">No family to suggest in this village yet.</p>'}
      <button class="btn btn-primary" id="go" style="margin-top:10px">Save camp, make the list and the notice</button></div></div>`;
  $('#v').onchange = () => { a.v = $('#v').value; a.sel = {}; render(); }; $('#d').onchange = () => a.d = $('#d').value; $('#ve').oninput = () => a.ve = $('#ve').value;
  $$('[data-i]').forEach(c => c.onchange = () => a.sel[c.dataset.i] = c.checked);
  $('#go').onclick = () => busy($('#go'), 'Saving', async () => { const date = $('#d').value; if (!date) throw new Error('Choose the date.'); const ven = $('#ve').value.trim();
    const pick = L.filter((r, i) => a.sel[i] !== false); const vid = (L[0] || {}).village_id || ''; const lst = vid ? await api('reg14List', { village_id: vid }, 6e4).catch(() => null) : null;
    const ids = lst ? lst.rows.filter(r => !r.side && pick.some(p => p.father === r.p && p.names.indexOf(r.n) >= 0)).map(r => r.id) : [];
    if (vid) await api('camp19Save', { village_id: vid, date, venue: ven, ids }, 3e4);
    const d = await pdfP(); title(d, `Farmer ID camp – ${a.v} – ${dmy(date)}${ven ? ' – ' + ven : ''}`, `${pick.length} families to be called. Bring Aadhaar card and the mobile linked with Aadhaar.`);
    tbl(d, 82, ['#', 'Owners to get ID', 'Father', 'Khasras', 'Note', 'ID made?'], pick.map((r, i) => [i + 1, r.names.join(', '), r.father, r.khasras, r.lastbro ? 'Last brother' : '', '']), { 0: { cellWidth: 22 }, 3: { cellWidth: 150 } });
    const note = `ELAAN · Farmer ID camp\n${a.v} mein ${dmy(date)} ko${ven ? ' ' + ven + ' par' : ''} Farmer ID camp lagega. Jin kisanon ki zameen gaon mein hai aur Farmer ID abhi nahi bani, woh Aadhaar card aur Aadhaar se juda mobile lekar zaroor aayein. ID muft banti hai.\n– Tehsildar Kastigarh`;
    deliverPDF(d, `Camp list – ${a.v} – ${dmy(date)}.pdf`); setTimeout(() => { if (navigator.share) navigator.share({ text: note }).catch(() => {}); else window.open('https://wa.me/?text=' + encodeURIComponent(note), '_blank'); }, 800); });
};
Object.assign(TABOF10, { camp19: 'tos12', appr19: 'tos12' });
/* morning brief: add the district rank line (TOS19P brief draws its own picture; nothing to change if rank unknown) */
window.TOS19X = { v: '12.4.0' };
})();
