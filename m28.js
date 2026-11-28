/* TehsilOS 12.8.0 — Meetings.
 * Organisers (Tehsildar, DA, BCG, OQ) make the meeting, agenda and information tables; Patwaris, GQs and the NT submit
 * in the app; the organiser compiles (every figure keeps its source; a missing reply is "Not received", never zero);
 * the Tehsildar approves the brief (locked, versioned); attendance and minutes; directions go to the Directions tracker.
 */
"use strict";
(function () {
const N = x => Number(x || 0).toLocaleString('en-IN');
const view = () => $('#view');
const wideOn = t => { setHeader(t); document.body.classList.add('wide'); };
const loading = t => { view().innerHTML = `<div class="t12 c25 m28"><p class="sub">${esc(t || 'Loading…')}</p><div class="cd" style="height:90px"></div><div class="cd" style="height:140px"></div></div>`; };
const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
const nowS = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
const WD = d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(d + 'T00:00:00Z').getUTCDay()];
const MO = d => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(d.slice(5, 7)) - 1];
const nice = d => d ? WD(d) + ' ' + Number(d.slice(8, 10)) + ' ' + MO(d) : '';
const due = s => s ? nice(String(s).slice(0, 10)) + (String(s).length > 10 ? ', ' + String(s).slice(11, 16) : '') : '';
const X = () => window.C25X || {};
const W28 = () => (S.boot && S.boot.m28 && S.boot.m28.who) || '';
const org = () => W28() === 'teh' || W28() === 'org';
const LEVEL = { DC: 'DC / ACR / SDM review', OWN: 'My review', SPECIAL: 'Special' };
const SRC = { RESP: ['From respondents', 'b'], FID: ['From TehsilOS · Farmer ID', 'ok'], SVM: ['From TehsilOS · SVAMITVA', 'ok'], DIRS: ['Action taken · Directions', 'wt'] };
const TO = { PH: 'Patwaris', GQ: 'GQs', NT: 'NT' };
const pill = (t, c) => `<span class="pill ${c || ''}">${esc(t)}</span>`;
const css = document.createElement('style');
css.textContent = `.m28 .pill.b{background:#EAF0F8;color:#2F5D9E}.m28 .pill.ur{background:#FDECEA;color:#B42318}.m28 .pill.wt{background:#FFF4E0;color:#8A5300}.m28 .pill.ok{background:#E8F2EC;color:#0E5E3B}.m28 .row>span:first-child{flex:1;min-width:0}.m28 .row>span:last-child{flex:none}.m28 .tw{overflow-x:auto;margin:0 -4px}.m28 table.ct{width:100%;border-collapse:collapse;font-size:13px}.m28 .ct th{font-size:11.5px;color:#5E6B63;font-weight:500;text-align:left;padding:6px 4px;border-bottom:1px solid #EEF0EE}
.m28 .ct td{padding:8px 4px;border-bottom:1px solid #F3F4F3;vertical-align:top}.m28 .ct td.n{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}.m28 .ct tr.tot td{font-weight:700;border-top:1px solid #DDE2DE}.m28 .ct .nr{color:#B42318;font-weight:600}
.m28 .dt28{display:flex;gap:14px;align-items:center}.m28 .dt28 .d{width:44px;flex:none;text-align:center}.m28 .dt28 .d span{display:block;font-size:11px;color:#5E6B63}.m28 .dt28 .d b{display:block;font-size:20px;font-weight:600}
.m28 .seg button{font-size:13px}.m28 .it{border-top:1px solid #F0EBE5;padding:10px 0;display:flex;gap:10px;align-items:flex-start}.m28 .it:first-of-type{border-top:0}.m28 .fn{font-size:12px;color:#5E6B63;margin-top:6px;line-height:1.5}
.m28 .att{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #F0EBE5}.m28 .att .seg{width:200px;flex:none}.m28 .cols .rw{display:flex;gap:6px;align-items:center}.m28 .cols select{width:110px;flex:none}`;
document.head.appendChild(css);

/* ---------- data ---------- */
const getList = async () => { const L = await api('mtg28List', {}, 60000); S.m28L = L; return L; };
const getMtg = async id => { const R = await api('mtg28Get', { mtg_id: id }, 60000); return R; };
const statusPill = r => { const b = r.brief || {};
  if (r.minutes || r.status === 'DONE') return pill('Minutes · ' + (r.dirs_done != null ? r.dirs_done + ' / ' + r.dirs + ' done' : 'issued'), 'ok');
  if (b.status === 'APPROVED') return pill('Brief approved v' + b.v, 'ok'); if (b.status === 'SENT') return pill('Brief with Tehsildar', 'b');
  if (b.status === 'BACK') return pill('Brief sent back', 'ur'); if (b.status === 'CHANGED') return pill('Changed after approval', 'wt');
  if (r.status === 'DRAFT') return pill('Draft', ''); if (r.of && r.got < r.of) return pill('Collecting ' + r.got + ' / ' + r.of, 'wt'); return pill(r.of ? 'All replies in' : 'Notice sent', 'b'); };
const mrow = (r, sub, right) => `<button class="row" data-m="${esc(r.mtg_id)}" style="width:100%"><span class="dt28"><span class="d"><span>${WD(r.date)}</span><b>${Number(r.date.slice(8, 10))}</b><span>${MO(r.date)}</span></span><span style="text-align:left">${esc(r.title)}<small>${sub}</small></span></span><span>${right}</span></button>`;

/* ---------- 1. list ---------- */
VIEWS.m28 = async function () {
  wideOn('Meetings'); loading('Meetings…');
  if (!W28()) { view().innerHTML = `<div class="t12 c25 m28"><h1>Meetings</h1><div class="cd">Meetings are for the Tehsildar, the DA, BCG and OQ, and for the Patwaris, GQs and NT who are asked for information.</div></div>`; return; }
  let L; try { L = await getList(); } catch (e) { fail(e.message); return; } if (current().name !== 'm28') return;
  const t = today(), st = S.m28f || (S.m28f = { f: 'up' });
  function draw() {
    let body = '';
    if (org()) {
      const up = L.rows.filter(r => r.date >= t).sort((a, b) => a.date.localeCompare(b.date)), past = L.rows.filter(r => r.date < t), D = L.rows.filter(r => r.dirs);
      const R = st.f === 'up' ? up : st.f === 'past' ? past : D;
      body = `<button class="btn12" id="nw" style="width:100%;margin-bottom:12px">+ New meeting</button>
        <div class="seg" style="margin-bottom:12px"><button type="button" data-f="up" class="${st.f === 'up' ? 'on' : ''}">Upcoming · ${up.length}</button><button type="button" data-f="past" class="${st.f === 'past' ? 'on' : ''}">Past</button><button type="button" data-f="dirs" class="${st.f === 'dirs' ? 'on' : ''}">Directions</button></div>
        <div class="cd">${R.map(r => mrow(r, `${esc(r.time || '')}${r.venue ? ' · ' + esc(r.venue) : ''}${st.f === 'dirs' ? ' · ' + r.dirs_done + ' of ' + r.dirs + ' directions done' : r.of ? ' · ' + r.got + ' of ' + r.of + ' replies' : ''}`, statusPill(r))).join('') || `<p class="mu">${st.f === 'up' ? 'No meeting coming up.' : 'None yet.'}</p>`}</div>
        ${st.f === 'dirs' ? '<button class="cd row" id="dr" style="display:block;border:0;width:100%;text-align:left"><h3>All directions <span>›</span></h3><div class="mu">The Directions tracker – meeting directions and the Tehsildar\'s own.</div></button>' : ''}
        <p class="hint">Organisers: Tehsildar, DA, BCG and OQ. Patwaris, GQs and the NT see only the meetings that ask them for something.</p>`;
    } else {
      body = `<div class="cd"><h3>Asked from you</h3>${L.rows.map(r => mrow(r, r.todo ? `${r.todo} of ${r.items} to submit${r.due ? ' · due ' + due(r.due) : ''}` : 'All submitted', r.todo ? pill('To submit', 'wt') : pill('Submitted', 'ok'))).join('') || '<p class="mu">Nothing asked from you.</p>'}</div>`;
    }
    view().innerHTML = `<div class="t12 c25 m28"><p class="sub" style="margin:0">${esc((me() || {}).name || '')}${org() ? ' · organiser' : ''}</p><h1>Meetings</h1>${body}</div>`;
    on(view(), '[data-f]', 'click', b => { st.f = b.dataset.f; draw(); });
    on(view(), '[data-m]', 'click', b => go(org() ? 'm28m' : 'm28r', { id: b.dataset.m }));
    const nw = $('#nw'); if (nw) nw.onclick = () => go('m28e', {}); const dr = $('#dr'); if (dr) dr.onclick = () => go('dir14', {});
  }
  draw();
};

/* ---------- 2. new / edit meeting ---------- */
VIEWS.m28e = async function (a) {
  wideOn(a.id ? 'Edit meeting' : 'New meeting'); loading();
  if (!org()) return fail('Only the organisers make meetings.');
  let M = null, L = S.m28L; try { if (a.id) M = (await getMtg(a.id)).mtg; if (!L) L = await getList(); } catch (e) { fail(e.message); return; } if (current().name !== 'm28e') return;
  const D = M ? JSON.parse(JSON.stringify({ mtg_id: M.mtg_id, level: M.level, title: M.title, date: M.date, time: M.time, venue: M.venue, chair: M.chair, letter: M.letter, attend: M.attend || {}, items: M.items || [] }))
    : { level: 'DC', title: '', date: '', time: '11:00', venue: '', chair: '', letter: '', attend: { teh: 1, nt: 1, bcg: 1 }, items: [] };
  const PH = L.phs || [], PREV = (L.rows || []).filter(r => r.minutes && r.mtg_id !== D.mtg_id);
  let file = null;
  const fld = (k, label, type, ph) => `<label class="f" for="e_${k}">${label}</label><input id="e_${k}" data-k="${k}" type="${type || 'text'}" value="${esc(D[k] || '')}" placeholder="${esc(ph || '')}">`;
  function draw() {
    view().innerHTML = `<div class="t12 c25 m28"><p class="sub" style="margin:0">Meetings</p><h1>${a.id ? 'Edit meeting' : 'New meeting'}</h1>
      <div class="seg" data-lv style="margin-bottom:6px">${Object.keys(LEVEL).map(k => `<button type="button" data-v="${k}" class="${D.level === k ? 'on' : ''}">${LEVEL[k]}</button>`).join('')}</div>
      <div class="cd">${fld('title', 'Title', 'text', D.level === 'DC' ? 'DC Doda – revenue review' : 'Patwari monthly meeting')}<div class="g2"><div>${fld('date', 'Date', 'date')}</div><div>${fld('time', 'Time', 'time')}</div></div>
        ${fld('venue', 'Venue or VC link', 'text', 'DC office conference hall')}${fld('chair', 'Chair', 'text', D.level === 'DC' ? 'Deputy Commissioner, Doda' : 'Tehsildar Kastigarh')}${D.level !== 'OWN' ? fld('letter', 'Letter No. / date', 'text', 'DCD/Rev/2026/4410 · 26 Nov 2026') : ''}
        <label class="f" for="e_file">${D.level === 'DC' ? 'DC\'s notice and agenda' : 'Notice (optional)'} – PDF or photo</label><input id="e_file" type="file" accept="application/pdf,image/*">${M && M.notice_url ? `<p class="mu" style="margin-top:4px">A file is attached. Choosing another replaces it.</p>` : ''}</div>
      <div class="cd"><h3>Who attends</h3>${[['teh', 'Tehsildar attends'], ['nt', 'NT attends'], ['bcg', 'BCG accompanies with the brief']].map(x => `<label class="rw" style="display:flex;gap:10px;align-items:center;font-size:14px"><input type="checkbox" data-at="${x[0]}" ${D.attend[x[0]] ? 'checked' : ''} style="width:22px;height:22px;flex:none">${x[1]}</label>`).join('')}
        <p class="hl" style="margin-top:6px">Attendance of the staff is marked on the meeting day.</p></div>
      <div class="cd"><h3>Agenda <span class="mu">${D.items.length} item${D.items.length === 1 ? '' : 's'}</span></h3>
        ${D.items.map((it, i) => `<div class="it"><b style="flex:none;width:18px">${i + 1}</b><div style="flex:1;min-width:0"><div style="font-weight:700">${esc(it.title || 'Item ' + (i + 1))}</div><div class="mu">${SRC[it.src || 'RESP'][0]}${(it.src || 'RESP') === 'RESP' ? ' · ' + TO[(it.to || {}).k || 'PH'] + ((it.to || {}).ph && it.to.ph.length ? ' (' + it.to.ph.length + ')' : '') + ' · ' + (it.cols || []).length + ' columns' + (it.due ? ' · due ' + due(it.due) : '') : ''}</div></div>
          <button type="button" class="del" data-ed="${i}" style="color:#0E5E3B">Edit</button>${i ? `<button type="button" class="del" data-up="${i}" aria-label="Move up">↑</button>` : ''}<button type="button" class="del" data-rm="${i}">✕</button></div>`).join('') || '<p class="mu">No item yet.</p>'}
        <button type="button" class="add" id="ad">+ Agenda item</button></div>
      <div class="ft"><button class="btn12" id="sv" style="flex:1">${a.id ? 'Save' : 'Save and open'}</button></div></div>`;
    on(view(), '[data-k]', 'input', el => { D[el.dataset.k] = el.value; });
    on(view(), '[data-lv] button', 'click', b => { D.level = b.dataset.v; draw(); });
    on(view(), '[data-at]', 'change', el => { D.attend[el.dataset.at] = el.checked ? 1 : 0; });
    $('#e_file').onchange = e => { file = e.target.files[0] || null; if (file && file.size > 8e6) { file = null; e.target.value = ''; toast('File too big (keep it under 8 MB).', 'err'); } };
    on(view(), '[data-ed]', 'click', b => itemSheet(Number(b.dataset.ed)));
    on(view(), '[data-rm]', 'click', b => { D.items.splice(Number(b.dataset.rm), 1); draw(); });
    on(view(), '[data-up]', 'click', b => { const i = Number(b.dataset.up); const x = D.items.splice(i, 1)[0]; D.items.splice(i - 1, 0, x); draw(); });
    $('#ad').onclick = () => itemSheet(-1);
    $('#sv').onclick = e => busy(e.target, 'Saving', async () => {
      const m = Object.assign({}, D); if (file) { m.notice_b64 = await fileB64(file); m.notice_type = file.type || 'application/pdf'; m.notice_name = file.name; }
      const R = await api('mtg28Save', { mtg: m }, 120000); S.m28L = null; toast('Saved'); NAV.stack = NAV.stack.filter(x => x.name !== 'm28e'); go('m28m', { id: R.mtg.mtg_id }); });
  }
  function itemSheet(i) {
    const it = i >= 0 ? JSON.parse(JSON.stringify(D.items[i])) : { title: '', want: '', src: 'RESP', cols: [{ l: '', t: 'n' }], to: { k: 'PH', ph: [] }, due: '' };
    it.to = it.to || { k: 'PH', ph: [] }; it.to.ph = it.to.ph || []; it.cols = it.cols || [];
    const dd = { d: String(it.due || '').slice(0, 10), t: String(it.due || '').slice(11, 16) || '17:00' };
    openSheet(() => ({ html: `<div class="snav"><button id="x">Cancel</button><span></span><button id="ok" style="font-weight:800">Done</button></div><div class="c25 m28"><h2 class="nm">${i >= 0 ? 'Agenda item ' + (i + 1) : 'New agenda item'}</h2><div id="ib"></div></div>`,
      mount: el => {
        function body() {
          const b = $('#ib', el);
          b.innerHTML = `<label class="f" for="i_t">Title</label><input id="i_t" value="${esc(it.title)}" placeholder="Pending mutations">
            <label class="f" for="i_w">What is wanted</label><textarea id="i_w" placeholder="Halqa-wise mutations pending for attestation, and those over 30 days">${esc(it.want || '')}</textarea>
            <label class="f">Where the answer comes from</label><div class="seg" data-src style="flex-wrap:wrap">${Object.keys(SRC).map(k => `<button type="button" data-v="${k}" class="${it.src === k ? 'on' : ''}">${{ RESP: 'Ask staff', FID: 'Farmer ID', SVM: 'SVAMITVA', DIRS: 'Action taken' }[k]}</button>`).join('')}</div>
            ${it.src === 'RESP' ? `<label class="f">Information table – one row per halqa / officer</label><div class="cols">${it.cols.map((c, j) => `<div class="rw"><input data-cl="${j}" value="${esc(c.l || '')}" placeholder="Column ${j + 1} – e.g. Pending (no.)" aria-label="Column ${j + 1}"><select data-ct="${j}" aria-label="Type"><option value="n" ${c.t === 'n' ? 'selected' : ''}>Number</option><option value="t" ${c.t !== 'n' ? 'selected' : ''}>Text</option></select>${it.cols.length > 1 ? `<button type="button" class="del" data-cx="${j}">✕</button>` : ''}</div>`).join('')}</div>
              ${it.cols.length < 8 ? '<button type="button" class="add" id="ac">+ Column</button>' : ''}
              <label class="f">Who answers</label><div class="seg" data-to>${Object.keys(TO).map(k => `<button type="button" data-v="${k}" class="${it.to.k === k ? 'on' : ''}">${k === 'PH' ? 'Patwaris' : TO[k]}</button>`).join('')}</div>
              ${it.to.k === 'PH' ? `<p class="hl" style="margin-top:6px">All halqas unless you tick some.</p>${PH.map(p => `<label style="display:inline-flex;gap:6px;align-items:center;margin:4px 12px 4px 0;font-size:14px"><input type="checkbox" data-ph="${esc(p.ph_id)}" ${it.to.ph.indexOf(p.ph_id) >= 0 ? 'checked' : ''} style="width:20px;height:20px">${esc(p.name)}</label>`).join('')}` : ''}
              <div class="g2"><div><label class="f" for="i_d">Due date</label><input id="i_d" type="date" value="${esc(dd.d)}"></div><div><label class="f" for="i_h">By</label><input id="i_h" type="time" value="${esc(dd.t)}"></div></div>`
            : it.src === 'DIRS' ? `<label class="f" for="i_f">Directions of which meeting</label><select id="i_f"><option value="">– choose –</option>${PREV.map(p => `<option value="${esc(p.mtg_id)}" ${it.from === p.mtg_id ? 'selected' : ''}>${esc(p.title)} · ${dmy(p.date)}</option>`).join('')}</select>${PREV.length ? '' : '<p class="mu">No earlier meeting has issued minutes yet.</p>'}`
            : `<div class="okb">Figures come straight from TehsilOS when the brief is made. Nobody has to fill anything.</div>`}`;
          const v = (id, f) => { const x = $(id, b); if (x) x.oninput = x.onchange = () => f(x.value); };
          v('#i_t', x => it.title = x); v('#i_w', x => it.want = x); v('#i_d', x => dd.d = x); v('#i_h', x => dd.t = x); v('#i_f', x => it.from = x);
          on(b, '[data-src] button', 'click', x => { it.src = x.dataset.v; body(); });
          on(b, '[data-to] button', 'click', x => { it.to.k = x.dataset.v; body(); });
          on(b, '[data-cl]', 'input', x => { it.cols[Number(x.dataset.cl)].l = x.value; });
          on(b, '[data-ct]', 'change', x => { it.cols[Number(x.dataset.ct)].t = x.value; });
          on(b, '[data-cx]', 'click', x => { it.cols.splice(Number(x.dataset.cx), 1); body(); });
          on(b, '[data-ph]', 'change', x => { const k = x.dataset.ph; it.to.ph = it.to.ph.filter(y => y !== k); if (x.checked) it.to.ph.push(k); });
          const ac = $('#ac', b); if (ac) ac.onclick = () => { it.cols.push({ l: '', t: 'n' }); body(); };
        }
        body();
        $('#x', el).onclick = () => closeSheet();
        $('#ok', el).onclick = () => { if (!String(it.title).trim()) return toast('Write the title.', 'err');
          if (it.src === 'RESP') { it.cols = it.cols.filter(c => String(c.l || '').trim()); if (!it.cols.length) return toast('Add at least one column.', 'err'); if (!dd.d) return toast('Choose the due date.', 'err'); it.due = dd.d + ' ' + (dd.t || '17:00'); }
          if (it.src === 'DIRS' && !it.from) return toast('Choose the meeting.', 'err');
          if (i >= 0) D.items[i] = it; else D.items.push(it); closeSheet(() => draw()); };
      } }));
  }
  draw();
};

/* ---------- compiled tables ---------- */
function ctab(c) {
  if (!c) return { head: [], rows: [], tot: null, foot: '' };
  if (c.src !== 'RESP') return { head: c.cols || [], rows: (c.rows || []).map(r => r.map(x => x == null ? '' : String(x))), tot: c.total ? c.total.map(x => x == null ? '' : String(x)) : null, foot: (c.src || '') + ' · as on ' + String(c.as_on || '').slice(0, 16) + (c.of != null ? ' · ' + c.done + ' of ' + c.of + ' done' : '') };
  const cols = c.cols || [];
  return { head: ['Halqa / officer'].concat(cols.map(x => x.l)), nums: cols.map(x => x.t === 'n'),
    rows: c.rows.map(r => [r.name.replace(/^Patwari /, '')].concat(r.got ? cols.map(x => r.vals[x.k] == null ? '' : String(r.vals[x.k])) : cols.map((x, i) => i ? '–' : 'Not received'))), got: c.rows.map(r => r.got),
    tot: ['Total (' + c.got + ' of ' + c.of + ')'].concat(cols.map(x => x.t === 'n' ? (c.got ? N(c.total[x.k]) : '–') : '')),
    foot: c.got < c.of ? `Totals cover ${c.got} of ${c.of}. ${c.rows.filter(r => !r.got).map(r => r.name).join(', ')}: not received.` : 'All replies received.',
    edits: [].concat.apply([], c.rows.map(r => (r.edits || []).map(e => `${r.name}: ${e.ch.map(h => h.col + ': ' + (h.from === '' ? '(blank)' : h.from) + ' changed to ' + h.to).join(', ')} · ${e.by}, ${String(e.at).slice(0, 16)} · "${e.why}"`))) };
}
const tableHTML = (t, edit) => `<div class="tw"><table class="ct"><thead><tr>${t.head.map((h, i) => `<th style="${i && t.nums && t.nums[i - 1] ? 'text-align:right' : ''}">${esc(h)}</th>`).join('')}${edit != null ? '<th></th>' : ''}</tr></thead><tbody>
  ${t.rows.map((r, ri) => `<tr>${r.map((x, i) => `<td class="${i && t.nums && t.nums[i - 1] ? 'n' : ''} ${t.got && !t.got[ri] && i === 1 ? 'nr' : ''}">${esc(x)}</td>`).join('')}${edit != null ? `<td><button type="button" class="del" data-fix="${edit}:${ri}" style="color:#0E5E3B">${t.got && !t.got[ri] ? 'Enter' : 'Correct'}</button></td>` : ''}</tr>`).join('')}
  ${t.tot ? `<tr class="tot">${t.tot.map((x, i) => `<td class="${i && t.nums && t.nums[i - 1] ? 'n' : ''}">${esc(x)}</td>`).join('')}${edit != null ? '<td></td>' : ''}</tr>` : ''}</tbody></table></div>`;

/* ---------- documents ---------- */
function head(M) { const B = X().B, L = (M.lh && M.lh.letterhead) || ('OFFICE OF THE TEHSILDAR\nTEHSIL ' + String(M.tehsil || '').toUpperCase()); return [B.h(L)]; }
const signT = M => ['Tehsildar', String(M.tehsil || 'Kastigarh')];
function docNotice(M) { const B = X().B, R = M.items.filter(i => i.src === 'RESP');
  return head(M).concat([B.p('No. ' + (M.no || '__________') + '                                                            Dated: ' + dmy(today())), B.h('MEETING NOTICE'),
    B.p(`A meeting${M.level === 'DC' && M.chair ? ' chaired by the ' + M.chair : ''} – "${M.title}" – will be held on ${dmy(M.date)}${M.time ? ' at ' + M.time : ''}${M.venue ? ' in/at ' + M.venue : ''}.${M.letter ? ' Reference: ' + M.letter + '.' : ''}`),
    B.p('Agenda:'), B.t(['#', 'Agenda item'], M.items.map(i => [i.n, i.title]), [8, 92])]).concat(R.length ? [B.p('The officers named below shall submit the information sought in TehsilOS (Meetings) by the time shown:'),
    B.t(['#', 'Information', 'From', 'By'], R.map(i => [i.n, i.title, TO[(i.to || {}).k || 'PH'] + ((i.to || {}).ph && i.to.ph.length ? ' (' + i.to.ph.length + ' halqas)' : ''), due(i.due)]), [8, 50, 22, 20])] : [])
    .concat([B.sig(signT(M)), B.p('Copy to: ' + [M.attend && M.attend.nt ? 'Naib Tehsildar' : '', 'BCG / Dealing Assistant', 'Office Qanungo', R.some(i => (i.to || {}).k === 'PH') ? 'All Patwaris concerned' : '', R.some(i => (i.to || {}).k === 'GQ') ? 'Girdawar Qanungos' : ''].filter(Boolean).join('; ') + '.')]); }
function docAgenda(M) { const B = X().B; return head(M).concat([B.h('AGENDA'), B.kv([['Meeting', M.title], ['Date and time', dmy(M.date) + (M.time ? ', ' + M.time : '')], ['Venue', M.venue || ''], ['Chair', M.chair || ''], ['Reference', M.letter || '–']]),
  B.t(['#', 'Item', 'Information', 'Source'], M.items.map(i => [i.n, i.title, i.want || '', SRC[i.src][0]]), [6, 28, 46, 20])]); }
function docProforma(M) { const B = X().B, out = head(M).concat([B.h('INFORMATION PROFORMA – ' + M.title.toUpperCase()), B.p('Meeting on ' + dmy(M.date) + '. Fill and submit in TehsilOS (Meetings), or on this sheet if TehsilOS cannot be used.')]);
  M.compiled.forEach((c, k) => { const it = M.items[k]; if (c.src !== 'RESP') return; out.push(B.h(it.n + '. ' + it.title)); if (it.want) out.push(B.p(it.want)); out.push(B.p('Due: ' + due(it.due)));
    out.push(B.t(['Halqa / officer'].concat(c.cols.map(x => x.l)), c.rows.map(r => [r.name].concat(c.cols.map(() => ''))), [30].concat(c.cols.map(() => 70 / c.cols.length)))); });
  out.push(B.sig(['Signature: ____________________', 'Name: ____________________', 'Date: __________'])); return out; }
function docBrief(M, snap) { const B = X().B, br = M.brief || {}, comp = snap ? snap.compiled : M.compiled, items = snap ? snap.items : M.items;
  const out = head(M).concat([B.h('BRIEF – ' + M.title.toUpperCase()), B.kv([['Meeting', dmy(M.date) + (M.time ? ', ' + M.time : '') + (M.venue ? ' · ' + M.venue : '')], ['Chair', M.chair || ''], ['Reference', M.letter || '–'],
    ['Status', snap ? 'Approved by the Tehsildar – v' + snap.v + ' on ' + String(snap.at).slice(0, 16) : 'DRAFT – not approved by the Tehsildar']])]);
  items.forEach((it, k) => { const t = ctab(comp[k]); out.push(B.h(it.n + '. ' + it.title)); if (it.want) out.push(B.small(it.want));
    if (t.head.length) out.push(B.t(t.head, t.rows.concat(t.tot ? [t.tot] : []), t.head.map((h, i) => i ? 70 / Math.max(1, t.head.length - 1) : 30)));
    out.push(B.small('Source: ' + (it.src === 'RESP' ? 'replies in TehsilOS. ' + t.foot : t.foot))); (t.edits || []).forEach(e => out.push(B.small('Changed by compiler – ' + e)));
    if (it.points) out.push(B.p('Points: ' + it.points)); });
  out.push(B.sig(signT(M))); return out; }
function docMinutes(M) { const B = X().B, mn = M.minutes || {}, A = M.att || {}, P = M.people || [], nm = s => P.filter(p => A[p.user_id] === s).map(p => p.name + ' (' + p.desig + ')').join(', ') || '–';
  return head(M).concat([B.p('No. ' + (M.no || '') + '                                                            Dated: ' + dmy(String(mn.issued_at || today()).slice(0, 10))), B.h('MINUTES – ' + M.title.toUpperCase()),
    B.kv([['Date and time', dmy(M.date) + (M.time ? ', ' + M.time : '')], ['Venue', M.venue || ''], ['Chair', M.chair || '']]), B.t(['Present', 'Absent', 'On leave'], [[nm('P'), nm('A'), nm('L')]], [50, 25, 25]),
    B.p(mn.text || ''), B.h('Directions'), B.t(['#', 'Direction', 'By', 'Due'], (mn.dirs || []).map((d, i) => [i + 1, d.text, (P.find(p => p.user_id === d.to_user) || {}).name || '', dmy(d.due)]), [6, 58, 20, 16]), B.sig(signT(M))]); }
function docATR(M) { const B = X().B; return head(M).concat([B.h('ACTION TAKEN REPORT – ' + M.title.toUpperCase()), B.p('Directions of the meeting held on ' + dmy(M.date) + ', as on ' + dmy(today()) + ':'),
  B.t(['#', 'Direction', 'With', 'Due', 'Status'], (M.dirs || []).map((d, i) => [i + 1, d.text, d.to, String(d.due).slice(0, 10), d.status === 'DONE' ? 'Done ' + dmy(String(d.done_at).slice(0, 10)) + (d.note ? ' – ' + d.note : '') : d.status === 'OPEN' ? 'Open' : d.status]), [6, 46, 16, 12, 20]), B.sig(signT(M))]); }
const FT = M => 'TehsilOS · Meetings · ' + (M.no || M.mtg_id);
const fn = (M, k, e) => `${k} – ${M.title} – ${dmy(M.date)}.${e}`.replace(/[\/\\:]/g, '-');
async function make(M, kind, ext, snap) {
  const f = { notice: ['Meeting notice', docNotice], agenda: ['Agenda', docAgenda], proforma: ['Information proforma', docProforma], brief: [snap ? 'Brief v' + snap.v : 'Brief DRAFT', M2 => docBrief(M2, snap)], minutes: ['Minutes', docMinutes], atr: ['Action taken report', docATR] }[kind];
  const blocks = f[1](M); if (ext === 'pdf') await X().toPDF(blocks, fn(M, f[0], 'pdf'), FT(M)); else X().toDOCX(blocks, fn(M, f[0], 'docx'), FT(M));
}

/* ---------- 3. the meeting (organisers, Tehsildar) ---------- */
VIEWS.m28m = async function (a) {
  wideOn('Meeting'); loading();
  let M; try { M = (await getMtg(a.id)).mtg; } catch (e) { fail(e.message); return; } if (current().name !== 'm28m') return;
  const teh = W28() === 'teh', tab = S.m28t && S.m28t.id === a.id ? S.m28t : (S.m28t = { id: a.id, t: M.brief.status === 'SENT' && teh ? 'brief' : M.status === 'DRAFT' ? 'agenda' : M.minutes.issued_at ? 'minutes' : 'replies' });
  const set = R => { M = R.mtg; S.m28L = null; draw(); };
  const pts = {}; M.items.forEach(i => pts[i.item_id] = i.points || '');
  let MN = { text: M.minutes.text || '', dirs: (M.minutes.dirs || []).map(d => Object.assign({}, d)) }, ATT = Object.assign({}, M.att || {});
  function agenda() {
    return `<div class="cd"><h3>Agenda</h3>${M.items.map(i => `<div class="it"><b style="flex:none;width:18px">${i.n}</b><div style="flex:1;min-width:0"><div style="font-weight:700">${esc(i.title)}</div>${i.want ? `<div class="mu">${esc(i.want)}</div>` : ''}<div style="margin-top:4px">${pill(i.src === 'RESP' ? TO[(i.to || {}).k || 'PH'] + (i.due ? ' · due ' + due(i.due) : '') : SRC[i.src][0], SRC[i.src][1])}</div></div></div>`).join('') || '<p class="mu">No item yet.</p>'}
      <button class="btn12 gh" id="ed" style="width:100%;margin-top:10px">Edit meeting and agenda</button></div>
      ${M.status === 'DRAFT' ? `<div class="cd"><h3>Send the requests</h3><p class="hl">The notice gets its number, and every Patwari, GQ or NT asked sees the request on his home with its due time.</p><button class="btn12" id="snd" style="width:100%">Send requests</button></div>` : ''}
      <div class="cd"><h3>Documents</h3>${[['notice', 'Meeting notice', M.no ? 'No. ' + M.no : 'Number given when requests are sent'], ['agenda', 'Agenda', M.items.length + ' items'], ['proforma', 'Information proforma', 'Blank, per item – for offline use']].map(d => `<div class="it" style="align-items:center"><div style="flex:1"><b>${d[1]}</b><div class="mu">${esc(d[2])}</div></div><button class="btn12 gh" data-doc="${d[0]}" data-e="pdf" style="padding:6px 12px;font-size:12.5px">PDF</button><button class="btn12 gh" data-doc="${d[0]}" data-e="doc" style="padding:6px 12px;font-size:12.5px">Word</button></div>`).join('')}
        ${M.notice_url ? `<div class="it"><div style="flex:1"><b>DC's notice (attached)</b></div><a class="btn12 gh" href="${esc(M.notice_url)}" target="_blank" rel="noopener" style="padding:6px 12px;font-size:12.5px;text-decoration:none">Open</a></div>` : ''}
        ${M.no ? '<button class="btn12 gh" id="wa" style="width:100%;margin-top:10px">Share the notice on WhatsApp</button>' : ''}</div>`;
  }
  function replies() {
    const R = M.compiled.filter(c => c.src === 'RESP'), miss = {};
    R.forEach(c => { const it = M.items.find(i => i.item_id === c.item_id); c.rows.filter(r => !r.got).forEach(r => { (miss[r.name] = miss[r.name] || []).push(it); }); });
    const names = Object.keys(miss);
    return `<div class="cd"><h3>Information received</h3><div style="display:flex;align-items:baseline;gap:10px"><span style="font-size:36px;font-weight:700">${M.got} of ${M.of}</span><span class="mu">${M.of - M.got ? (M.of - M.got) + ' not received' : 'all in'}</span></div></div>
      ${M.status === 'DRAFT' ? '<div class="wrn">The requests have not been sent yet (Agenda → Send requests).</div>' : ''}
      <div class="cd"><h3>Not received <span class="mu">${names.length}</span></h3>${names.map(n => `<div class="it" style="align-items:center"><div style="flex:1"><b>${esc(n)}</b><div class="mu">Item${miss[n].length > 1 ? 's' : ''} ${miss[n].map(i => i.n).join(', ')} · due ${due(miss[n].map(i => i.due).sort()[0])}</div></div>${pill('Not received', 'ur')}<button class="btn12 gh" data-rem="${esc(n)}" style="padding:6px 12px;font-size:12.5px">Remind</button></div>`).join('') || '<p class="mu">Nothing pending.</p>'}
        ${names.length > 1 ? '<button class="btn12" id="ra" style="width:100%;margin-top:10px">Remind all on WhatsApp</button>' : ''}</div>
      <div class="cd"><h3>Received</h3>${R.map(c => { const it = M.items.find(i => i.item_id === c.item_id); return `<div class="it"><b style="flex:none;width:18px">${it.n}</b><div style="flex:1"><b>${esc(it.title)}</b><div class="mu">${c.got} of ${c.of}${c.rows.filter(r => r.got).length ? ' · ' + c.rows.filter(r => r.got).map(r => r.name.replace(/^Patwari /, '')).join(', ') : ''}</div></div></div>`; }).join('') || '<p class="mu">No item asks the staff.</p>'}</div>`;
    }
  const remText = (n, its) => `${n}: please submit in TehsilOS → Meetings the information for "${M.title}" (${dmy(M.date)}): ${its.map(i => i.n + '. ' + i.title + ' – due ' + due(i.due)).join('; ')}.`;
  function brief() {
    const b = M.brief || {}, snap = b.snap;
    const st = b.status === 'APPROVED' ? `<div class="okb">Approved v${b.v} by ${esc(b.approved_by || '')} · ${String(b.approved_at).slice(0, 16)}. Locked.${b.note ? ' Note: ' + esc(b.note) : ''}</div>`
      : b.status === 'SENT' ? `<div class="okb" style="background:#EAF0F8;color:#2F5D9E">With the Tehsildar for approval since ${String(b.sent_at).slice(0, 16)}.</div>`
      : b.status === 'BACK' ? `<div class="err">Sent back by the Tehsildar: ${esc(b.note || '')}</div>`
      : b.status === 'CHANGED' ? `<div class="wrn">Changed after approval of v${b.v}. The approved v${b.v} stays as it was; send again for v${Number(b.v) + 1}.</div>` : '<div class="mu">Draft – not sent for approval yet.</div>';
    const items = M.items.map((it, k) => { const c = M.compiled[k], t = ctab(c);
      return `<div class="cd"><h3><span>${it.n}. ${esc(it.title)}</span>${pill(it.src === 'RESP' ? c.got + ' of ' + c.of : 'Live', it.src === 'RESP' ? (c.got < c.of ? 'wt' : 'ok') : 'ok')}</h3>
        ${t.head.length ? tableHTML(t, it.src === 'RESP' ? k : null) : ''}<div class="fn">${esc(t.foot)}</div>${(t.edits || []).map(e => `<div class="fn">Changed by compiler – ${esc(e)}</div>`).join('')}
        <label class="f" for="pt_${k}">Points for the Tehsildar</label><textarea id="pt_${k}" data-pt="${esc(it.item_id)}" style="min-height:60px">${esc(pts[it.item_id] || '')}</textarea></div>`; }).join('');
    return `<div class="cd"><h3>Brief${b.v ? ' · v' + b.v : ''}</h3>${st}
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn12 gh" data-br="pdf" style="flex:1">${snap && b.status === 'APPROVED' ? 'Brief v' + b.v + ' PDF' : 'Draft PDF'}</button><button class="btn12 gh" data-br="doc" style="flex:1">Word</button>${snap && b.status !== 'APPROVED' ? `<button class="btn12 gh" data-br="v" style="flex:1">Approved v${b.v} PDF</button>` : ''}</div>
        ${teh && b.status === 'SENT' ? `<label class="f" for="bn">Your note (optional)</label><input id="bn" placeholder="e.g. Get GQ's figures by 10 AM; keep item 4 open."><div style="display:flex;gap:8px;margin-top:10px"><button class="btn12 gh" id="bk" style="flex:1">Send back</button><button class="btn12" id="ap" style="flex:2;background:#0E5E3B">Approve brief</button></div>` : ''}
        ${!teh && b.status !== 'SENT' && b.status !== 'APPROVED' ? '<button class="btn12" id="sa" style="width:100%;margin-top:10px">Send to Tehsildar for approval</button>' : ''}
        ${teh && b.status !== 'SENT' && b.status !== 'APPROVED' ? '<p class="hint">The organiser sends the brief to you for approval.</p>' : ''}</div>
      ${items}<button class="btn12 gh" id="sp" style="width:100%">Save points</button>`;
  }
  function minutes() {
    const P = M.people || [], mn = M.minutes || {}, iss = !!mn.issued_at;
    return `<div class="cd"><h3>Attendance <span class="mu">${Object.keys(ATT).filter(k => ATT[k] === 'P').length} present</span></h3>
        ${P.map(p => `<div class="att"><div style="flex:1;min-width:0"><b>${esc(p.name)}</b><div class="mu">${esc(p.desig || '')}</div></div><div class="seg" data-att="${esc(p.user_id)}">${[['P', 'Present'], ['A', 'Absent'], ['L', 'Leave']].map(x => `<button type="button" data-v="${x[0]}" class="${ATT[p.user_id] === x[0] ? 'on' : ''}">${x[1]}</button>`).join('')}</div></div>`).join('')}
        <button class="btn12 gh" id="sat" style="width:100%;margin-top:10px">Save attendance</button></div>
      <div class="cd"><h3>Minutes</h3>${iss ? `<div class="okb">Issued ${String(mn.issued_at).slice(0, 16)} by ${esc(mn.by || '')}.</div>` : ''}<textarea id="mt" style="min-height:120px" ${iss ? 'disabled' : ''} placeholder="What was reviewed and decided.">${esc(MN.text)}</textarea>
        <label class="f">Directions – each goes to the Directions tracker</label>
        ${iss ? (M.dirs || []).map((d, i) => `<div class="it"><b style="flex:none;width:18px">${i + 1}</b><div style="flex:1"><div>${esc(d.text)}</div><div style="margin-top:4px">${pill(d.to, 'b')} ${pill('by ' + dmy(String(d.due).slice(0, 10)), '')} ${d.status === 'DONE' ? pill('Done', 'ok') : pill(d.status === 'OPEN' ? 'Open' : d.status, 'wt')}</div></div></div>`).join('')
          : MN.dirs.map((d, i) => `<div class="rw"><textarea data-dt="${i}" style="min-height:50px" placeholder="Direction">${esc(d.text || '')}</textarea><div class="g2" style="margin-top:6px"><select data-du="${i}" aria-label="Who"><option value="">– who –</option>${P.map(p => `<option value="${esc(p.user_id)}" ${d.to_user === p.user_id ? 'selected' : ''}>${esc(p.name)} (${esc(p.desig || '')})</option>`).join('')}</select><input type="date" data-dd="${i}" value="${esc(d.due || '')}" aria-label="Due"></div><button type="button" class="del" data-dx="${i}">Remove</button></div>`).join('') + '<button type="button" class="add" id="adr">+ Direction</button>'}
        ${iss ? '' : '<div style="display:flex;gap:8px;margin-top:12px"><button class="btn12 gh" id="msv" style="flex:1">Save draft</button><button class="btn12" id="mis" style="flex:2">Issue minutes</button></div>'}</div>
      <div class="cd"><h3>Documents</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn12 gh" data-doc="minutes" data-e="pdf" style="flex:1">Minutes PDF</button><button class="btn12 gh" data-doc="minutes" data-e="doc" style="flex:1">Word</button>${iss ? '<button class="btn12 gh" data-doc="atr" data-e="pdf" style="flex:1">Action taken report</button>' : ''}</div></div>`;
  }
  function draw() {
    const T = [['agenda', 'Agenda'], ['replies', 'Replies'], ['brief', 'Brief'], ['minutes', 'Minutes']];
    view().innerHTML = `<div class="t12 c25 m28"><p class="sub" style="margin:0">${LEVEL[M.level] || ''} · ${nice(M.date)}${M.time ? ', ' + esc(M.time) : ''}${M.venue ? ' · ' + esc(M.venue) : ''}</p><h1 style="margin-bottom:2px">${esc(M.title)}</h1><p class="mu" style="margin:0 0 12px">${M.no ? 'No. ' + esc(M.no) + ' · ' : ''}${M.chair ? esc(M.chair) : ''}</p>
      <div class="seg" style="margin-bottom:12px">${T.map(x => `<button type="button" data-tab="${x[0]}" class="${tab.t === x[0] ? 'on' : ''}">${x[1]}</button>`).join('')}</div>
      ${tab.t === 'agenda' ? agenda() : tab.t === 'replies' ? replies() : tab.t === 'brief' ? brief() : minutes()}</div>`;
    on(view(), '[data-tab]', 'click', b => { tab.t = b.dataset.tab; draw(); });
    const q = id => $(id, view()), clk = (id, f) => { const x = q(id); if (x) x.onclick = e => f(e); };
    clk('#ed', () => go('m28e', { id: M.mtg_id }));
    clk('#snd', e => busy(e.target, 'Sending', async () => { set(await api('mtg28Send', { mtg_id: M.mtg_id }, 60000)); toast('Requests sent'); }));
    on(view(), '[data-doc]', 'click', b => busy(b, 'Making', () => make(M, b.dataset.doc, b.dataset.e)));
    clk('#wa', () => sendWA(`${M.level === 'DC' ? 'Meeting' : 'Meeting'}: ${M.title}\n${nice(M.date)}${M.time ? ', ' + M.time : ''}${M.venue ? '\n' + M.venue : ''}\nNo. ${M.no}\n\nAgenda:\n${M.items.map(i => i.n + '. ' + i.title).join('\n')}${M.items.some(i => i.src === 'RESP') ? '\n\nSubmit the information asked from you in TehsilOS → Meetings by the due time.' : ''}`));
    on(view(), '[data-rem]', 'click', b => { const n = b.dataset.rem, its = M.items.filter((it, k) => M.compiled[k].src === 'RESP' && M.compiled[k].rows.some(r => r.name === n && !r.got)); sendWA(remText(n, its)); });
    clk('#ra', () => { const L = []; M.compiled.forEach((c, k) => { if (c.src === 'RESP') c.rows.filter(r => !r.got).forEach(r => { let x = L.find(y => y.n === r.name); if (!x) L.push(x = { n: r.name, its: [] }); x.its.push(M.items[k]); }); }); sendWA(L.map(x => remText(x.n, x.its)).join('\n\n')); });
    on(view(), '[data-pt]', 'input', el => { pts[el.dataset.pt] = el.value; });
    clk('#sp', e => busy(e.target, 'Saving', async () => { set(await api('mtg28Brief', { mtg_id: M.mtg_id, act: 'points', points: pts }, 60000)); toast('Points saved'); }));
    clk('#sa', e => busy(e.target, 'Sending', async () => { await api('mtg28Brief', { mtg_id: M.mtg_id, act: 'points', points: pts }, 60000); set(await api('mtg28Brief', { mtg_id: M.mtg_id, act: 'send' }, 60000)); toast('Sent to the Tehsildar'); }));
    clk('#ap', e => busy(e.target, 'Approving', async () => { set(await api('mtg28Brief', { mtg_id: M.mtg_id, act: 'approve', note: (q('#bn') || {}).value || '' }, 90000)); toast('Brief approved'); }));
    clk('#bk', e => { const n = String((q('#bn') || {}).value || '').trim(); if (n.length < 4) return toast('Write what to change in the note.', 'err'); busy(e.target, 'Sending', async () => { set(await api('mtg28Brief', { mtg_id: M.mtg_id, act: 'back', note: n }, 60000)); toast('Sent back'); }); });
    on(view(), '[data-br]', 'click', b => busy(b, 'Making', () => { const br = M.brief || {}, k = b.dataset.br; const snap = (k === 'v' || br.status === 'APPROVED') && br.snap ? br.snap : null; return make(M, 'brief', k === 'doc' ? 'doc' : 'pdf', snap); }));
    on(view(), '[data-fix]', 'click', b => { const p = b.dataset.fix.split(':'); fixSheet(Number(p[0]), Number(p[1])); });
    on(view(), '[data-att] button', 'click', b => { ATT[b.parentNode.dataset.att] = b.dataset.v; $$('button', b.parentNode).forEach(x => x.classList.toggle('on', x === b)); });
    clk('#sat', e => busy(e.target, 'Saving', async () => { set(await api('mtg28Att', { mtg_id: M.mtg_id, att: ATT }, 60000)); toast('Attendance saved'); }));
    const mt = q('#mt'); if (mt) mt.oninput = () => { MN.text = mt.value; };
    on(view(), '[data-dt]', 'input', el => { MN.dirs[Number(el.dataset.dt)].text = el.value; });
    on(view(), '[data-du]', 'change', el => { MN.dirs[Number(el.dataset.du)].to_user = el.value; });
    on(view(), '[data-dd]', 'change', el => { MN.dirs[Number(el.dataset.dd)].due = el.value; });
    on(view(), '[data-dx]', 'click', b => { MN.dirs.splice(Number(b.dataset.dx), 1); draw(); });
    clk('#adr', () => { MN.dirs.push({ text: '', to_user: '', due: '' }); draw(); });
    clk('#msv', e => busy(e.target, 'Saving', async () => { set(await api('mtg28Min', { mtg_id: M.mtg_id, text: MN.text, dirs: MN.dirs }, 60000)); toast('Draft saved'); }));
    clk('#mis', e => { if (!MN.text.trim()) return toast('Write the minutes.', 'err');
      busy(e.target, 'Issuing', async () => { set(await api('mtg28Min', { mtg_id: M.mtg_id, text: MN.text, dirs: MN.dirs, issue: 1 }, 90000)); toast('Minutes issued · ' + MN.dirs.length + ' directions sent'); }); });
  }
  /* the organiser enters a missing reply or corrects one – always with a reason, shown in the brief */
  function fixSheet(k, ri) {
    const c = M.compiled[k], it = M.items[k], r = c.rows[ri], V = Object.assign({}, r.vals || {});
    openSheet(() => ({ html: `<div class="snav"><button id="x">Cancel</button><span></span><span></span></div><div class="c25 m28"><h2 class="nm">${esc(r.name)}</h2><p class="mu">${it.n}. ${esc(it.title)} · ${r.got ? 'correcting the reply' : 'not received – entering it for him'}</p>
      ${c.cols.map(x => `<label class="f" for="fx_${x.k}">${esc(x.l)}</label><input id="fx_${x.k}" data-fx="${x.k}" value="${esc(V[x.k] == null ? '' : V[x.k])}" ${x.t === 'n' ? 'inputmode="decimal"' : ''}>`).join('')}
      <label class="f" for="fx_w">Why (shown in the brief)</label><input id="fx_w" placeholder="e.g. Patwari gave it on phone"><button class="btn12" id="fx_s" style="width:100%;margin-top:12px">Save</button></div>`,
      mount: el => { $('#x', el).onclick = () => closeSheet(); on(el, '[data-fx]', 'input', x => { V[x.dataset.fx] = x.value; });
        $('#fx_s', el).onclick = e => busy(e.target, 'Saving', async () => { const R = await api('mtg28Resp', { mtg_id: M.mtg_id, item_id: it.item_id, unit: r.unit, vals: V, why: $('#fx_w', el).value }, 60000); closeSheet(() => set(R)); toast('Saved – shown in the brief'); }); } }));
  }
  draw();
};

/* ---------- 4. respondent: submit the information ---------- */
VIEWS.m28r = async function (a) {
  wideOn('Your information'); loading();
  let R; try { R = await getMtg(a.id); } catch (e) { fail(e.message); return; } if (current().name !== 'm28r') return;
  const M = R.mtg; let mine = R.mine || [];
  const V = mine.map(x => Object.assign({}, x.vals));
  function draw() {
    view().innerHTML = `<div class="t12 c25 m28"><p class="sub" style="margin:0">${nice(M.date)}${M.time ? ', ' + esc(M.time) : ''}${M.venue ? ' · ' + esc(M.venue) : ''}</p><h1 style="margin-bottom:2px">${esc(M.title)}</h1><p class="mu" style="margin:0 0 12px">${M.no ? 'No. ' + esc(M.no) : ''}</p>
      ${mine.length ? `<div class="okb" style="margin-bottom:12px;background:#F1F3F1;color:#3F4A44">${mine.length} item${mine.length > 1 ? 's' : ''} asked from you. Fill each and submit.</div>` : '<div class="cd">Nothing is asked from you for this meeting.</div>'}
      ${mine.map((x, i) => `<div class="cd"><h3><span>${x.n}. ${esc(x.title)}</span>${x.status === 'SENT' ? pill('Submitted', 'ok') : pill('To fill', 'wt')}</h3><p class="mu" style="margin:0">${esc(x.unit_name)} · due ${due(x.due)}</p>${x.want ? `<p class="hl" style="margin-top:6px">${esc(x.want)}</p>` : ''}
        <div class="g2">${x.cols.filter(c => c.t === 'n').map(c => `<div><label class="f" for="r${i}_${c.k}">${esc(c.l)}</label><input id="r${i}_${c.k}" data-r="${i}" data-c="${c.k}" inputmode="decimal" value="${esc(V[i][c.k] == null ? '' : V[i][c.k])}"></div>`).join('')}</div>
        ${x.cols.filter(c => c.t !== 'n').map(c => `<label class="f" for="r${i}_${c.k}">${esc(c.l)}</label><textarea id="r${i}_${c.k}" data-r="${i}" data-c="${c.k}" style="min-height:56px">${esc(V[i][c.k] == null ? '' : V[i][c.k])}</textarea>`).join('')}
        ${x.status === 'SENT' ? `<p class="mu" style="margin-top:6px">Submitted ${String(x.at).slice(0, 16)}. Changing it? Submit again.</p>` : ''}</div>`).join('')}
      ${M.items.filter(i => i.src !== 'RESP').length ? `<div class="cd"><h3>Also on the agenda</h3>${M.items.filter(i => i.src !== 'RESP').map(i => `<div class="mu">${i.n}. ${esc(i.title)} – ${SRC[i.src][0]}, nothing to fill</div>`).join('')}</div>` : ''}
      ${mine.length ? '<div class="ft"><button class="btn12 gh" id="dr">Save draft</button><button class="btn12" id="sb">Submit</button></div>' : ''}</div>`;
    on(view(), '[data-r]', 'input', el => { V[Number(el.dataset.r)][el.dataset.c] = el.value; });
    const run = submit => async () => { for (let i = 0; i < mine.length; i++) { const x = mine[i]; const out = await api('mtg28Resp', { mtg_id: M.mtg_id, item_id: x.item_id, unit: x.unit, vals: V[i], submit: submit ? 1 : 0 }, 60000); if (out.mine) mine = out.mine; } S.m28L = null; toast(submit ? 'Submitted' : 'Draft saved'); draw(); };
    const dr = $('#dr'); if (dr) dr.onclick = e => busy(e.target, 'Saving', run(false));
    const sb = $('#sb'); if (sb) sb.onclick = e => { for (let i = 0; i < mine.length; i++) for (const c of mine[i].cols) if (c.t === 'n' && String(V[i][c.k] == null ? '' : V[i][c.k]).trim() === '') return toast(mine[i].n + '. ' + c.l + ': write a number (0 if none).', 'err'); busy(e.target, 'Submitting', run(true)); };
  }
  draw();
};

/* ---------- 5. all modules (the "More" tab) ---------- */
const MODS = [['SCHEMES', [['home', 'Farmer ID', 'Agristack buckets, camps, 4:30 report'], ['svm12', 'SVAMITVA', 'Abadi deh, property cards']]],
  ['OFFICE', [['m28', 'Meetings', 'Notices, agenda, information, brief, minutes'], ['c25', 'Certificates', 'JanSugam reports and remarks'], ['dir14', 'Directions', 'Given and their status'], ['', 'Dak Section', 'Inward, outward, reply due'], ['', 'Grievances', 'Samadhan, PG portal'], ['', 'RTI', '30-day clock, appeals'], ['', 'Establishment (DDO)', 'Staff, leave, notices, bills']]],
  ['COURTS AND LAND', [['', 'Revenue Court Cases', 'Cause list, orders, remands'], ['', 'High Court Cases', 'Para-wise replies, compliance'], ['', 'State Land & Encroachment', 'Kahcharai, Shamilat, eviction']]],
  ['MAGISTERIAL AND OTHER DUTIES', [['', 'Magisterial', 'Istegasa, BNSS 126/136'], ['', 'Relief', 'SDRF ex-gratia cases'], ['', 'Elections (AERO)', 'Forms 6/7/8, BLOs'], ['', 'Census', 'HLO Phase-I']]],
  ['TOOLS', [['rep8', 'Reports', 'Daily, weekly, DC formats'], ['camps10', 'Camps', 'Daily camps, deployment'], ['ins19', 'Insights', 'Rank, pace, villages'], ['cov10', 'Coverage', 'Village-wise status'], ['ppl83', 'People', 'Field officials, attendance'], ['users', 'Staff & logins', 'Add people, reset PINs, switch off'], ['set8', 'My settings', 'PIN, text size · Log out']]]];
VIEWS.mods28 = async function () {
  wideOn('All modules'); const teh = role() === 'ADMIN', rk = (window.T12X && window.T12X.rk29 && window.T12X.rk29()) || '', field = rk === 'gq' || rk === 'oq';
  const hide = { camps10: field, ins19: rk === 'gq', ppl83: field, users: ['ADMIN', 'DA'].indexOf(role()) < 0, svm12: !(window.T12X && window.T12X.svmOn && window.T12X.svmOn()), dir14: !teh && rk !== 'nt' && rk !== 'da' };
  view().innerHTML = `<div class="t12 c25 m28"><p class="sub" style="margin:0">TehsilOS</p><h1>All modules</h1>
    ${MODS.map(g => { const L = g[1].filter(m => m[0] ? !hide[m[0]] && (m[0] !== 'm28' || W28()) && (m[0] !== 'c25' || !!(window.C25X && window.C25X.who && window.C25X.who())) : teh); if (!L.length) return '';
      return `<div class="cd"><p class="mu" style="margin:0 0 4px;font-weight:700;letter-spacing:.3px;font-size:12px">${g[0]}</p>${L.map(m => `<button class="row" ${m[0] ? `data-g="${m[0]}"` : 'disabled'} style="width:100%;${m[0] ? '' : 'opacity:.6'}"><span>${esc(m[1])}<small>${esc(m[2])}</small></span><span>${m[0] ? '›' : pill('Soon', '')}</span></button>`).join('')}</div>`; }).join('')}
    ${teh ? '<p class="hint">Only you see the modules marked Soon.</p>' : ''}</div>`;
  on(view(), '[data-g]', 'click', b => { const n = b.dataset.g; if (n === 'home') { NAV.stack = [{ name: 'home', args: {} }]; render(); } else go(n, {}); });
};

/* ---------- navigation ---------- */
try { Object.assign(TABOF10, { m28: 'm28', m28e: 'm28', m28m: 'm28', m28r: 'm28', mods28: 'mods28' }); } catch (e) {}
try { P10.m28 = 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4M7 14h4M7 17h7'; P10.mods28 = 'M5 12h.01M12 12h.01M19 12h.01'; } catch (e) {}

/* ---------- requests on the home of the Patwaris, GQs, NT, BCG and OQ ---------- */
let N28 = { at: 0, d: null, u: '' };
async function needs28(fresh) {
  const uid = (me() || {}).user_id || ''; if (!fresh && N28.d && N28.u === uid && Date.now() - N28.at < 120000) return N28.d;
  const L = await api('mtg28List', {}, 45000); N28 = { at: Date.now(), d: L, u: uid }; S.m28L = L; return L;
}
window.M28X = { needs: needs28, who: W28 };
const _r28 = render;
let C28 = { at: 0, d: null, u: '' };
render = async function () {
  const out = await _r28.apply(this, arguments);
  try { const c = current(); if (!c || !W28() || c.name !== 'home' || (window.T12X && window.T12X.shell && window.T12X.shell())) return out;
    const L = await needs28(), ph = W28() === 'resp' && /patwari/i.test((me() || {}).designation || '');
    let C = null; if (ph && X().who && X().who() === 'ph') { const uid = (me() || {}).user_id; if (C28.u === uid && Date.now() - C28.at < 120000) C = C28.d; else { try { C = await api('cert25List', {}, 45000); C28 = { at: Date.now(), d: C, u: uid }; } catch (e) {} } }
    if (current() !== c || $('#m28h')) return out;
    const n = (L.needs || []).map(x => ({ t: x.t, s: x.due ? 'Meetings · due ' + due(x.due) : x.date ? 'Meetings · ' + nice(x.date) : 'Meetings', b: x.k === 'reply' ? 'Submit' : x.k === 'approve' ? 'Review' : 'Open', go: [W28() === 'resp' ? 'm28r' : 'm28m', { id: x.mtg_id }], r: x.k === 'reply' }));
    if (C && C.drafts) n.push({ t: C.drafts + ' draft report' + (C.drafts > 1 ? 's' : ''), s: 'Certificates', b: 'Open', go: ['c25', {}] });
    const up = (L.rows || []).filter(r => r.date >= today()).sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!n.length && !ph) return out;
    const host = $('.t12', view()) || view().firstElementChild || view(); const b = document.createElement('div'); b.id = 'm28h'; b.style.cssText = 'margin:0 0 12px';
    const tile = (g, t2, s2) => `<button class="cd" data-g28="${g}" style="border:0;text-align:left;margin:0;padding:12px 14px"><b style="display:block;font-size:14px">${t2}</b><span style="font-size:12px;color:#5E6B63">${esc(s2)}</span></button>`;
    b.innerHTML = `<div class="cd" style="margin:0 0 10px"><h3 style="display:flex;justify-content:space-between"><span>Needs you</span><span style="font-size:12px;color:#5E6B63;font-weight:500">${n.length ? n.length + ' item' + (n.length > 1 ? 's' : '') : ''}</span></h3>
      ${n.slice(0, 4).map((x, i) => `<div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #EEF0EE"><i style="width:10px;height:10px;border-radius:9px;border:2px solid ${x.r ? '#B42318' : '#B26B00'};flex:none"></i><div style="flex:1;min-width:0"><b style="font-size:14px">${esc(x.t)}</b><div style="font-size:12px;color:#5E6B63">${esc(x.s)}</div></div><button class="btn12" data-n28="${i}" style="padding:6px 14px;font-size:13px">${x.b}</button></div>`).join('') || '<div class="mu">Nothing waiting on you.</div>'}</div>
      ${ph ? `<div style="display:grid;grid-template-columns:repeat(${window.T12X && window.T12X.svmOn && window.T12X.svmOn() ? 3 : 2},minmax(0,1fr));gap:8px">${tile('c25', 'Certificates', C && C.drafts ? C.drafts + ' draft' + (C.drafts > 1 ? 's' : '') : 'Reports')}${tile('m28', 'Meetings', up ? nice(up.date) : 'Requests')}${window.T12X && window.T12X.svmOn && window.T12X.svmOn() ? tile('svm12', 'SVAMITVA', 'Your halqa') : ''}</div>` : ''}`;
    host.insertBefore(b, host.firstChild);
    on(b, '[data-n28]', 'click', x => { const it = n[Number(x.dataset.n28)]; go(it.go[0], it.go[1]); }); on(b, '[data-g28]', 'click', x => go(x.dataset.g28, {}));
  } catch (e) {}
  return out;
};
})();
