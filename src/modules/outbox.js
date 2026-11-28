/* Outbox, dispatch numbers and the Tehsildar's signature (frozen mockups O1–O7, 28.11.2026). */
import { $, $$, esc, on, dmy, hm } from '../core/dom.js';
import { svg, toast, fail, busy, pill, sk, openSheet, closeSheet } from '../core/ui.js';
import { api } from '../core/api.js';
import { kget, kput, kdel } from '../core/store.js';
import { me, role, rk } from '../core/session.js';
import { register, go, back, current, redraw } from '../core/router.js';
import { letterPDF, noText, nosNeeded } from '../core/doc.js';

export const outWho = () => ['teh', 'da', 'nt', 'oq'].indexOf(rk()) >= 0;
const KIND = { NOTICE: 'Notice', LETTER: 'Letter', ORDER: 'Order', REPORT: 'Report' };
const KIND_L = { NOTICE: 'Show cause notice', LETTER: 'Letter', ORDER: 'Order', REPORT: 'Report', MEMO: 'Memo', CERT: 'Certificate' };
const COPIES = [['dc', 'DC, Doda', 'Deputy Commissioner, Doda, for favour of information.'],
  ['dm', 'District Magistrate, Doda', 'Worthy District Magistrate, Doda, for kind information please.'],
  ['ssp', 'SSP, Doda', 'Worthy Senior Superintendent of Police, Doda, for kind information please.'],
  ['acr', 'ACR, Doda', 'Assistant Commissioner Revenue, Doda, for favour of information.'],
  ['nt', 'NT Topneel', 'Naib Tehsildar Topneel (Nodal Officer, Farmer ID), for information.'],
  ['pp', 'Incharge, PP Kastigarh', 'Incharge, Police Post Kastigarh, for information and necessary compliance.'],
  ['nazir', 'Nazir', 'Nazir, Tehsil Office Kastigarh, for record and to track the receipt of the reply.'],
  ['file', 'Office file', 'Office file.']];
const DEF_COPIES = { NOTICE: ['dc', 'acr', 'nazir', 'file'], LETTER: ['file'], ORDER: ['file'], REPORT: ['file'] };

/* ---------- the letter model from what the office wrote ---------- */
export function toLetter(F, extra) {
  const k = F.kind || 'LETTER', lt = k === 'LETTER' || k === 'REPORT';
  const paras = (F.paras || []).map(p => String(p || '').trim()).filter(Boolean).map(p => { const lines = p.split('\n'), main = [], sub = [];
    lines.forEach(l => { if (/^\s*-\s+/.test(l)) sub.push(l.replace(/^\s*-\s+/, '')); else if (sub.length) sub[sub.length - 1] += ' ' + l.trim(); else main.push(l); });
    return sub.length ? { t: main.join(' '), sub } : main.join(' '); });
  return Object.assign({ to: String(F.to || '').split('\n').map(x => x.trim()).filter(Boolean), subject: String(F.subject || '').trim(), paras, style: lt ? 'letter' : 'notice', close: lt ? 'Yours faithfully,' : '',
    sign: { lines: k === 'LETTER' ? ['Tehsildar', 'Executive Magistrate 1st Class', 'Kastigarh'] : ['Tehsildar', 'Kastigarh'] },
    copies: (F.copies || []).map(c => String(c.t || '').trim()).filter(Boolean) }, extra || {});
}
const fromLetter = (row) => { const D = row.data || {}; return D.form ? Object.assign({}, D.form) : { kind: row.kind, to: (D.to || []).join('\n'), subject: D.subject || '', paras: (D.paras || []).map(p => typeof p === 'string' ? p : [p.t].concat((p.sub || []).map(s => '- ' + s)).join('\n')), copies: (D.copies || []).map(t => ({ k: '', t })), reply_due: row.reply_due || '' }; };

/* ---------- the list ---------- */
let LIST = null, LAT = 0;
async function loadList(f) { if (!f && LIST && Date.now() - LAT < 30000) return LIST; LIST = await api('out30List', {}, { timeout: 60000 }); LAT = Date.now(); return LIST; }
const dropList = () => { LIST = null; };
const nowIso = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
const noReply = r => r.status === 'ISSUED' && r.reply_due && !r.reply_at;
const overdue = r => noReply(r) && String(r.reply_due).replace('T', ' ') < nowIso();
const dm = s => s ? (/^\d{4}-/.test(s) ? s.slice(8, 10) + '.' + s.slice(5, 7) + (s.length > 11 ? ' ' + s.slice(11, 16) : '') : s) : '';
function state(r) {
  if (r.status === 'DRAFT') return /^Returned:/.test(r.note || '') ? pill('Returned', 'r') : pill('Draft', '');
  if (r.status === 'SIGN') return pill('To sign', 'a'); if (r.status === 'NUMBERED') return pill('Signing', 'a');
  if (r.status === 'SIGNED') return pill('To send', 'a'); if (r.status === 'CANCELLED') return pill('Cancelled', '');
  if (overdue(r)) return pill('No reply', 'r'); if (noReply(r)) return pill('Reply due ' + dm(r.reply_due).slice(0, 5), 'a');
  return r.reply_at ? pill('Reply in', 'g') : pill('Sent', 'g');
}
function sub(r) {
  if (r.status === 'ISSUED') return `${r.to_text} · sent ${esc(r.sent_via || '')} ${dm(r.confirmed_at).slice(0, 5)}${r.reply_due ? ' · reply due ' + dm(r.reply_due) : ''}`;
  if (r.status === 'SIGNED') return `${r.to_text} · signed ${dm(r.signed_at)}`;
  return `${r.subject} · ${r.copies} cop${r.copies === 1 ? 'y' : 'ies'} · by ${r.made_by_name || ''}${/^Returned:/.test(r.note || '') ? ' · ' + r.note : ''}`;
}
const title = r => r.no_text ? `${r.no_text} · ${KIND[r.kind] || KIND_L[r.kind] || ''}` : `${KIND_L[r.kind] || 'Letter'} · ${r.to_text}`;
function rowHtml(r, act) {
  return `<button class="pr ob" data-o="${esc(r.out_id)}"><i class="dot ${['SIGN', 'NUMBERED', 'SIGNED'].indexOf(r.status) >= 0 ? 'a' : overdue(r) ? 'r' : ''}"></i><span class="nm"><b>${esc(title(r))}</b><small>${esc(sub(r))}</small></span>${act ? `<span class="btn s">${act}</span>` : state(r)}</button>`;
}
function openRow(r) {
  if ((r.status === 'SIGN' || r.status === 'NUMBERED') && role() === 'ADMIN') return go('os-sign', { id: r.out_id });
  if ((r.status === 'DRAFT' || r.status === 'SIGN') && (r.made_by === me().user_id || role() === 'ADMIN')) return go('os-out-new', { id: r.out_id });
  return go('os-out-letter', { id: r.out_id });
}

register('os-out', { title: 'Outbox', async render(el, a, ctx) {
  const teh = role() === 'ADMIN';
  a.f = a.f || (teh ? 'sign' : role() === 'DA' ? 'send' : 'all');
  const draw = D => {
    if (!ctx.alive()) return;
    if (!D) { el.innerHTML = `<div class="pg nr st30">${sk(24, '40%')}<div class="cd">${sk(16)}<div style="height:12px"></div>${sk(16, '70%')}</div></div>`; return; }
    const R = D.rows, tid = Object.keys(D.series)[0], ser = D.series[tid] || {};
    const C = { sign: R.filter(r => r.status === 'SIGN' || r.status === 'NUMBERED'), send: R.filter(r => r.status === 'SIGNED'), reply: R.filter(noReply), all: R };
    const mine = R.filter(r => r.status === 'DRAFT' && r.made_by === me().user_id);
    const L = C[a.f] || R;
    const head = a.f === 'sign' ? (teh ? 'Waiting for your signature' : 'Waiting for the Tehsildar') : a.f === 'send' ? 'Signed · to send' : a.f === 'reply' ? 'Replies due' : 'All letters';
    el.innerHTML = `<div class="pg nr st30"><div class="ttl"><div><div class="sub">Tehsil Kastigarh · dispatch register</div><h1 class="t">Outbox</h1></div><button class="btn" id="nw">${svg('plus', 16)}New letter</button></div>
      <button class="cd ser" id="ser" ${D.can.nazir ? '' : 'disabled'}><span><small>Next dispatch number</small><b>${ser.next || '–'}</b><em>${esc(ser.suffix || '/Nazir/TKG')}</em></span>${ser.set ? pill('Confirmed by Nazir', 'g') : pill('Nazir to set', 'a')}</button>
      <div class="chips">${[['sign', 'To sign'], ['send', 'To send'], ['reply', 'Replies due'], ['all', 'All']].map(x => `<button data-f="${x[0]}" class="${a.f === x[0] ? 'on' : ''}">${x[1]}${x[0] !== 'all' ? ' · ' + C[x[0]].length : ''}</button>`).join('')}</div>
      ${mine.length && a.f !== 'all' ? `<div class="hd2">My drafts <span>${mine.length}</span></div><div class="cd pl0">${mine.map(r => rowHtml(r)).join('')}</div>` : ''}
      <div class="hd2">${head} <span>${L.length}</span></div>
      <div class="cd pl0">${L.map(r => rowHtml(r, a.f === 'sign' && teh ? 'Sign' : a.f === 'send' && D.can.nazir ? 'Send' : '')).join('') || '<p class="sub" style="padding:14px 16px;margin:0">Nothing here.</p>'}</div></div>`;
  };
  on(el, '[data-f]', 'click', b => { current().args.f = b.dataset.f; draw(LIST); });
  on(el, '[data-o]', 'click', b => { const r = (LIST.rows || []).find(x => x.out_id === b.dataset.o); if (r) openRow(r); });
  on(el, '#nw', 'click', () => go('os-out-new', {}));
  on(el, '#ser', 'click', () => seriesSheet());
  draw(LIST); try { draw(await loadList(a.fresh)); a.fresh = 0; } catch (e) { if (!LIST) el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; else fail(e.message); }
}, refresh() { LAT = 0; return redraw(); } });

function seriesSheet() {
  const D = LIST, tid = Object.keys(D.series)[0], ser = D.series[tid] || {};
  const last = D.rows.filter(r => r.no_text).sort((x, y) => Number(y.no_from) - Number(x.no_from))[0];
  openSheet(`<div class="shd"><b>Number series</b><button class="x" data-x aria-label="Close">${svg('x', 20)}</button></div>
    <p class="mu" style="margin:-4px 0 14px;line-height:1.5">The app gives the numbers when the Tehsildar signs. Check them against the dispatch register and correct here if the register has moved on (a letter typed outside the app).</p>
    <div class="g2"><label class="fld"><span>Next number</span><input id="sn" inputmode="numeric" value="${esc(ser.next || '')}" autofocus></label><label class="fld"><span>Ending</span><input id="sx" value="${esc(ser.suffix || '/Nazir/TKG')}"></label></div>
    <div class="note" style="margin:12px 0">One number for the letter and one for each copy, as in the register: a letter with 5 copies takes 6 numbers, printed <b id="sp">${esc(noText(Number(ser.next) || 1, (Number(ser.next) || 1) + 5, ser.suffix || '/Nazir/TKG'))}</b>.</div>
    ${last ? `<p class="mu" style="margin:0 0 12px;font-size:13px">Last given: ${esc(last.no_text.split('/')[0])} (${esc(dm(last.signed_at || last.updated_at))})</p>` : ''}
    <button class="btn w" id="ok">Confirm</button>`, p => {
    on(p, '[data-x]', 'click', () => closeSheet());
    const upd = () => { const n = Number($('#sn', p).value) || 1; $('#sp', p).textContent = noText(n, n + 5, $('#sx', p).value.trim() || '/Nazir/TKG'); };
    $('#sn', p).oninput = upd; $('#sx', p).oninput = upd;
    $('#ok', p).onclick = e => busy(e.currentTarget, 'Saving', async () => { await api('out30Series', { tehsil_id: tid, next: Number($('#sn', p).value), suffix: $('#sx', p).value.trim() }, { write: 1 }); await loadList(true); closeSheet(); toast('Number series confirmed'); redraw(); });
  });
}

/* ---------- O2 · new letter ---------- */
register('os-out-new', { title: a => a.id ? 'Letter' : 'New letter', form: true, async render(el, a, ctx) {
  const teh = role() === 'ADMIN', key = 'os:outnew:' + me().user_id + ':' + (a.id || 'new');
  let F = null, row = null;
  if (a.id) { el.innerHTML = `<div class="pg nr">${sk(24, '40%')}</div>`; try { row = (await api('out30Get', { out_id: a.id })).row; F = fromLetter(row); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; } }
  const local = await kget(key); if (local && (!row || local.at > (row.updated_at || ''))) F = local.F;
  if (!F) F = { kind: 'NOTICE', to: '', subject: '', paras: [''], copies: DEF_COPIES.NOTICE.map(k => ({ k, t: COPIES.find(c => c[0] === k)[2] })), reply_due: '' };
  if (!ctx.alive()) return;
  let saved = row ? (row.updated_at || '') : '', sT = 0, lT = 0, outId = a.id || '';
  const returned = row && /^Returned:/.test(row.note || '') ? row.note : '';
  const keepLocal = () => { clearTimeout(lT); lT = setTimeout(() => kput(key, { at: nowIso(), F }), 500); };
  const ready = () => F.subject.trim() && F.paras.some(p => p.trim());
  const keepServer = () => { clearTimeout(sT); sT = setTimeout(async () => { if (!ready() || (row && row.status === 'SIGN')) return; try { const r = await api('out30Save', { out_id: outId || undefined, kind: F.kind, letter: Object.assign(toLetter(F), { form: F }), reply_due: F.reply_due }, { write: 1 });
    outId = r.row.out_id; row = r.row; saved = hm(Date.now()); const s = $('#svd', el); if (s) s.textContent = 'Draft saved ' + saved; dropList(); } catch (e) {} }, 4000); };
  const changed = () => { keepLocal(); keepServer(); };
  let draw = () => {
    const sel = F.copies;
    el.innerHTML = `<div class="pg nr st30"><div class="sub" id="svd">${row && row.status === 'SIGN' ? 'Waiting for signature' + (teh ? ' · you can change it before signing' : '') : 'Outbox · draft saves by itself'}</div>
      ${returned ? `<div class="note r">${esc(returned)}</div>` : ''}
      <div class="chips">${Object.keys(KIND).map(k => `<button data-kind="${k}" class="${F.kind === k ? 'on' : ''}">${KIND[k]}</button>`).join('')}</div>
      <label class="fld"><span>To (one line each)</span><textarea id="to" rows="3" placeholder="Sh. Khalid,&#10;Patwari Halqa Shamthi,&#10;Tehsil Kastigarh.">${esc(F.to)}</textarea></label>
      <label class="fld"><span>Subject</span><textarea id="sj" rows="2" placeholder="Explanation for …">${esc(F.subject)}</textarea></label>
      <div class="hd2">Paragraphs <span>Put **two stars** round words to print them bold · a line starting with - becomes (a), (b), (c)</span></div>
      <div class="cd pl0 pars">${F.paras.map((p, i) => `<div class="par"><b>${i + 1}.</b><textarea data-p="${i}" rows="3" placeholder="Write here.">${esc(p)}</textarea>${F.paras.length > 1 ? `<button class="x" data-rm="${i}" aria-label="Remove paragraph ${i + 1}">${svg('x', 16)}</button>` : ''}</div>`).join('')}
        <button class="addp" id="addp">+ Add a paragraph</button></div>
      <div class="hd2">Copy to <span>${sel.length} cop${sel.length === 1 ? 'y' : 'ies'} → ${sel.length + 1} numbers</span></div>
      <div class="cd cps"><div class="cpc">${COPIES.map(c => { const on_ = sel.some(s => s.k === c[0]); return `<button data-cp="${c[0]}" class="${on_ ? 'on' : ''}" aria-pressed="${on_}">${on_ ? '✓ ' : ''}${esc(c[1])}</button>`; }).join('')}<button data-cp="+" class="ot">+ Other</button></div>
        ${sel.map((s, i) => `<div class="cpr"><b>${i + 1}.</b><textarea data-c="${i}" rows="2">${esc(s.t)}</textarea><button class="x" data-crm="${i}" aria-label="Remove copy ${i + 1}">${svg('x', 16)}</button></div>`).join('')}
        <p class="mu" style="margin:0;font-size:12px">Add a line after a copy (“He is directed to monitor …”) right in its box.</p></div>
      <div class="cd tgr"><span><b>Reply due</b><small>For notices: the Outbox flags it if no reply comes</small></span><input type="datetime-local" id="rd" value="${esc(F.reply_due)}" aria-label="Reply due"></div>
      <div class="r2"><button class="btn o" id="pv">Preview PDF</button><button class="btn" id="go">${row && row.status === 'SIGN' ? (teh ? 'Save and sign' : 'Save') : 'Send for signature'}</button></div>
      <p class="ft" style="margin-top:0">No number or date yet. They are given when the Tehsildar signs.</p>
      ${row && ['DRAFT', 'SIGN'].indexOf(row.status) >= 0 ? `<button class="lk r" id="del" style="align-self:center">Cancel this letter</button>` : ''}</div>`;
  };
  const fit = t => { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; };
  const draw0 = draw; draw = () => { draw0(); $$('textarea', el).forEach(fit); };
  el.addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA') fit(e.target); });
  draw();
  on(el, '[data-kind]', 'click', b => { const k = b.dataset.kind; if (F.kind === k) return; const was = DEF_COPIES[F.kind].join(), now = F.copies.map(c => c.k).join();
    F.kind = k; if (was === now) F.copies = DEF_COPIES[k].map(x => ({ k: x, t: COPIES.find(c => c[0] === x)[2] })); draw(); changed(); });
  on(el, '#to', 'input', t => { F.to = t.value; changed(); });
  on(el, '#sj', 'input', t => { F.subject = t.value.replace(/\n/g, ' '); changed(); });
  on(el, '#rd', 'input', t => { F.reply_due = t.value; changed(); });
  on(el, '[data-p]', 'input', t => { F.paras[Number(t.dataset.p)] = t.value; changed(); });
  on(el, '[data-c]', 'input', t => { F.copies[Number(t.dataset.c)].t = t.value; changed(); });
  on(el, '#addp', 'click', () => { F.paras.push(''); draw(); changed(); const L = $$('[data-p]', el); L[L.length - 1].focus(); });
  on(el, '[data-rm]', 'click', b => { F.paras.splice(Number(b.dataset.rm), 1); draw(); changed(); });
  on(el, '[data-crm]', 'click', b => { F.copies.splice(Number(b.dataset.crm), 1); draw(); changed(); });
  on(el, '[data-cp]', 'click', b => { const k = b.dataset.cp;
    if (k === '+') { F.copies.splice(Math.max(0, F.copies.length - (F.copies.length && F.copies[F.copies.length - 1].k === 'file' ? 1 : 0)), 0, { k: 'x' + Date.now(), t: '' }); }
    else { const i = F.copies.findIndex(c => c.k === k); if (i >= 0) F.copies.splice(i, 1); else { F.copies.push({ k, t: COPIES.find(c => c[0] === k)[2] });
      const rank = c => { const n = COPIES.findIndex(x => x[0] === c.k); return n < 0 ? 5.5 : n; }; F.copies = F.copies.map((c, j) => [c, j]).sort((x, y) => rank(x[0]) - rank(y[0]) || x[1] - y[1]).map(x => x[0]); } }
    draw(); changed(); });
  on(el, '#pv', 'click', b => busy(b, 'Making', async () => { if (!ready()) throw new Error('Write the subject and at least one paragraph.'); openPDF(await letterPDF(toLetter(F, { draft: true, no: '', date: '' }))); }));
  on(el, '#go', 'click', b => busy(b, 'Sending', async () => {
    if (!F.to.trim()) throw new Error('Write who it goes to.'); if (!ready()) throw new Error('Write the subject and at least one paragraph.');
    clearTimeout(sT); const r = await api('out30Save', { out_id: outId || undefined, kind: F.kind, letter: Object.assign(toLetter(F), { form: F }), reply_due: F.reply_due, submit: 1 }, { write: 1 });
    await kdel(key); dropList(); toast(row && row.status === 'SIGN' ? 'Saved' : 'Sent for signature');
    if (teh) return go('os-sign', { id: r.row.out_id }, { replace: true }); back();
  }));
  on(el, '#del', 'click', b => { if (!confirm('Cancel this letter? It will not be signed.')) return; busy(b, 'Cancelling', async () => { await api('out30Cancel', { out_id: outId, note: 'Withdrawn' }, { write: 1 }); await kdel(key); dropList(); toast('Cancelled'); back(); }); });
} });

/* ---------- O3 · to sign (Tehsildar) ---------- */
let SIG = null;
async function signature() { if (SIG) return SIG; const r = await api('sig30Get', {}, { timeout: 60000 }); if (!r.png) return ''; SIG = 'data:image/png;base64,' + r.png; return SIG; }
function mini(L, no, date) {
  const P = L.paras.slice(0, 2), cut = s => { s = String(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); return s.length > 230 ? s.slice(0, 230) + ' …' : s; };
  return `<div class="paper"><div class="lh"><img src="img/emblem.png" alt="" width="22" height="22">GOVT OF UT OF JAMMU &amp; KASHMIR<br>OFFICE OF THE TEHSILDAR EXECUTIVE MAGISTRATE 1<sup>ST</sup>CLASS<br>KASTIGARH DISTRICT DODA, J&amp;K<br>email: <u>tehsildarkastigarhdoda@gmail.com</u></div><hr>
    <b>${L.to.map(esc).join('<br>')}</b><p><b>Subject:-${esc(L.subject)}</b></p>
    ${P.map((p, i) => `<p>${L.paras.length > 1 ? (i + 1) + '.&#8195;&#8195;' : ''}${cut(esc(typeof p === 'string' ? p : p.t))}</p>`).join('')}${L.paras.length > 2 ? `<p class="more">… ${L.paras.length - 2} more paragraph${L.paras.length > 3 ? 's' : ''}</p>` : ''}
    <div class="ft2"><span class="no">No. ${esc(no)}<br>Dated: ${esc(date)}</span><span class="sg"><i>your signature + stamp</i>${L.sign.lines.map(esc).join('<br>')}</span></div>
    ${L.copies.length ? `<div>Copy to the:<br>&#8195;1. ${esc(L.copies[0])}${L.copies.length > 1 ? ' …&#8195;(' + L.copies.length + ')' : ''}</div>` : ''}</div>`;
}
const todayDots = () => { const t = new Date(Date.now() + 5.5 * 3600e3).toISOString(); return t.slice(8, 10) + '.' + t.slice(5, 7) + '.' + t.slice(0, 4); };
function openPDF(d) { const u = URL.createObjectURL(d.output('blob')); const w = window.open(u, '_blank'); if (!w) { const a = document.createElement('a'); a.href = u; a.download = 'letter.pdf'; a.click(); } setTimeout(() => URL.revokeObjectURL(u), 120000); }
async function sharePDF(blob, name) {
  const f = new File([blob], name, { type: 'application/pdf' });
  if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
}

register('os-sign', { title: 'To sign', async render(el, a, ctx) {
  if (role() !== 'ADMIN') { el.innerHTML = '<div class="pg nr"><div class="cd">Only the Tehsildar signs.</div></div>'; return; }
  el.innerHTML = `<div class="pg nr st30">${sk(20, '50%')}<div class="cd">${sk(260)}</div></div>`;
  let D; try { D = await loadList(true); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  const Q = D.rows.filter(r => r.status === 'SIGN' || r.status === 'NUMBERED').sort((x, y) => String(x.updated_at).localeCompare(String(y.updated_at)));
  if (!Q.length) { el.innerHTML = `<div class="pg nr st30"><h1 class="t">To sign</h1><div class="cd">Nothing is waiting for your signature.</div><button class="btn o" id="ob">Outbox</button></div>`; $('#ob', el).onclick = () => go('os-out', { f: 'all' }, { replace: true }); return; }
  const r0 = Q.find(r => r.out_id === a.id) || Q[0], i0 = Q.indexOf(r0);
  let row; try { row = (await api('out30Get', { out_id: r0.out_id })).row; } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  const tid = row.tehsil_id, ser = D.series[tid] || {}, n = nosNeeded(row.data);
  const willNo = row.no_text || (ser.next ? noText(Number(ser.next), Number(ser.next) + n - 1, ser.suffix || '/Nazir/TKG') : '— (Nazir to set the series)'), willDate = row.date || todayDots();
  const L = toLetter(fromLetter(row));
  el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">${esc(KIND_L[row.kind] || 'Letter')} · written by ${esc(r0.made_by_name || '')} ${esc(dm(row.made_at))} · ${i0 + 1} of ${Q.length}</div><h1 class="t sm">${esc(row.to_text)}</h1></div>
    ${mini(L, willNo, willDate)}
    <div class="r2 sm"><button class="btn o s" id="full">Open full page</button><button class="btn o s" id="edit">Change a word</button></div>
    <div class="note">On signing it gets <b>No. ${esc(willNo)}</b> (1 + ${n - 1} cop${n === 2 ? 'y' : 'ies'}) and today's date. The PDF goes to the office Drive and to the Nazir's list to send.</div>
    <button class="btn g w big" id="sign">${svg('pen', 18)}Sign and number</button>
    <div class="r2"><button class="btn o" id="ret">Return with a note</button><button class="btn o" id="skip" ${Q.length > 1 ? '' : 'disabled'}>Skip · next</button></div></div>`;
  $('#full', el).onclick = e => busy(e.currentTarget, 'Making', async () => openPDF(await letterPDF(Object.assign({}, L, { no: row.no_text || willNo, date: willDate, draft: true }))));
  $('#edit', el).onclick = () => go('os-out-new', { id: row.out_id });
  $('#skip', el).onclick = () => go('os-sign', { id: Q[(i0 + 1) % Q.length].out_id }, { replace: true });
  $('#ret', el).onclick = () => openSheet(`<div class="shd"><b>Return to ${esc(r0.made_by_name || 'the writer')}</b><button class="x" data-x aria-label="Close">${svg('x', 20)}</button></div>
    <label class="fld"><span>What to change</span><textarea id="rn" rows="4" autofocus></textarea></label><button class="btn w" id="rok" style="margin-top:12px">Return</button>`, p => {
    on(p, '[data-x]', 'click', () => closeSheet());
    $('#rok', p).onclick = e => busy(e.currentTarget, 'Returning', async () => { await api('out30Return', { out_id: row.out_id, note: $('#rn', p).value }, { write: 1 }); dropList(); closeSheet(true); toast('Returned'); const rest = Q.filter(x => x.out_id !== row.out_id); rest.length ? go('os-sign', { id: rest[0].out_id }, { replace: true }) : back(); }); });
  $('#sign', el).onclick = e => busy(e.currentTarget, 'Signing', async () => {
    const img = await signature(); if (!img) { go('os-signature', {}); throw new Error('Upload your signature first (My signature).'); }
    const r = (await api('out30Number', { out_id: row.out_id }, { write: 1, timeout: 60000 })).row;
    const d = await letterPDF(Object.assign(toLetter(fromLetter(r)), { no: r.no_text, date: r.date, sign: { lines: L.sign.lines, img } }));
    await api('out30File', { out_id: r.out_id, pdf: d.output('datauristring').split(',')[1] }, { write: 1, timeout: 120000 });
    dropList(); const rest = Q.filter(x => x.out_id !== r.out_id), blob = d.output('blob'), name = r.no_text.replace(/\//g, '-') + ' ' + r.subject.slice(0, 50).replace(/[\\/:*?"<>|]/g, ' ') + '.pdf';
    openSheet(`<div class="dn"><span class="ok">${svg('check', 34)}</span><h2>Signed</h2><p><b>No. ${esc(r.no_text)}</b> · Dated ${esc(r.date)}<br>${esc(KIND_L[r.kind] || 'Letter')} to ${esc(r.to_text)}</p>
      <div class="note">The PDF is kept in the office Drive. It is now on the Nazir's list to send${r.reply_due ? '; the reply is due ' + esc(dm(r.reply_due)) : ''}.</div>
      ${rest.length ? `<button class="btn w" id="nx">Next letter · ${rest.length} left</button>` : ''}
      <div class="r2"><button class="btn o" id="dl">Download PDF</button><button class="btn o" id="sh">Share on WhatsApp</button></div>
      <button class="lk" id="bo">Back to Outbox</button></div>`, p => {
      const nx = $('#nx', p); if (nx) nx.onclick = () => { closeSheet(true); go('os-sign', { id: rest[0].out_id }, { replace: true }); };
      $('#dl', p).onclick = () => { const a2 = document.createElement('a'); a2.href = URL.createObjectURL(blob); a2.download = name; a2.click(); };
      $('#sh', p).onclick = () => sharePDF(blob, name);
      $('#bo', p).onclick = () => { closeSheet(true); go('os-out', { f: 'all', fresh: 1 }, { replace: true }); };
    });
  });
} });

/* ---------- O5 · a signed letter (Nazir) ---------- */
register('os-out-letter', { title: 'Outbox', async render(el, a, ctx) {
  el.innerHTML = `<div class="pg nr st30">${sk(24, '50%')}<div class="cd">${sk(40)}</div></div>`;
  let row, D; try { [row, D] = await Promise.all([api('out30Get', { out_id: a.id }).then(x => x.row), loadList()]); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  if (!ctx.alive()) return;
  const lr = D.rows.find(x => x.out_id === row.out_id) || {}, nz = D.can.nazir, teh = role() === 'ADMIN';
  let via = 'By hand';
  const draw = () => { el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">${esc(KIND_L[row.kind] || 'Letter')} · ${row.status === 'CANCELLED' ? 'cancelled' : row.signed_at ? 'signed ' + esc(dm(row.signed_at)) : esc(row.status.toLowerCase())}</div>
      <h1 class="t">${esc(row.no_text || 'Not numbered yet')}</h1><div class="sub" style="color:#3F4A44">${row.date ? 'Dated ' + esc(row.date) + ' · ' : ''}${esc(row.to_text)}</div></div>
      <div class="cd st3"><div><span>Copies</span><b>${row.copies}</b></div><div><span>Written by</span><b>${esc((lr.made_by_name || '').split(' ')[0] || '–')}</b></div><div><span>Reply due</span><b>${row.reply_due ? esc(dm(row.reply_due)) : '–'}</b></div></div>
      ${row.file_id ? `<div class="r2"><button class="btn o" id="op">Open PDF</button><button class="btn o" id="pr">Print ${Number(row.copies) + 1}</button></div>` : ''}
      ${row.status === 'SIGNED' && nz ? `<div class="hd2">Mark it sent</div><div class="cd" style="display:flex;flex-direction:column;gap:10px"><div class="chips" style="flex-wrap:wrap">${['By hand', 'WhatsApp', 'Email (office Gmail)', 'Post'].map(v => `<button data-via="${v}" class="${via === v ? 'on' : ''}">${v}</button>`).join('')}</div>
        <label class="fld"><span>Received by (optional)</span><input id="rb" placeholder="Name, date and time"></label><button class="btn w" id="sent">Sent</button></div>` : ''}
      ${row.status === 'ISSUED' ? `<div class="cd tgr"><span><b>Sent ${esc(row.sent_via || '')}</b><small>${esc(dm(row.confirmed_at))}${lr.confirmed_by_name ? ' · ' + esc(lr.confirmed_by_name) : ''}</small></span>${pill('Sent', 'g')}</div>` : ''}
      ${row.status === 'ISSUED' && (row.reply_due || row.kind === 'NOTICE') ? `<div class="hd2">Reply</div><div class="cd tgr"><span style="font-size:13.5px;color:#3F4A44;line-height:1.45">${row.reply_at ? 'Received ' + esc(dm(row.reply_at)) + '.' : `Not received yet.${row.reply_due ? ` If none comes by ${esc(dm(row.reply_due))}, it shows on Home as “No reply”.` : ''}`}</span>
        ${nz ? `<button class="btn o s" id="rp">${row.reply_at ? 'Undo' : 'Reply received'}</button>` : ''}</div>` : ''}
      ${row.note && !/^Returned:/.test(row.note) ? `<div class="note">${esc(row.note)}</div>` : ''}
      ${teh && row.status !== 'CANCELLED' ? `<button class="lk r" id="cx" style="align-self:center">Cancel this letter${row.no_from ? ' (the number stays used)' : ''}</button>` : ''}</div>`; };
  draw();
  const pdf = async () => { const r = await api('out30Pdf', { out_id: row.out_id }, { timeout: 90000 }); const b = Uint8Array.from(atob(r.pdf), c => c.charCodeAt(0)); return { blob: new Blob([b], { type: 'application/pdf' }), name: r.name }; };
  on(el, '#op', 'click', b => busy(b, 'Opening', async () => { const p = await pdf(); const u = URL.createObjectURL(p.blob); if (!window.open(u, '_blank')) { const x = document.createElement('a'); x.href = u; x.download = p.name; x.click(); } }));
  on(el, '#pr', 'click', b => busy(b, 'Opening', async () => { const p = await pdf(); const u = URL.createObjectURL(p.blob); const w = window.open(u, '_blank'); if (w) setTimeout(() => { try { w.print(); } catch (e) {} }, 1200); }));
  on(el, '[data-via]', 'click', b => { via = b.dataset.via; $$('[data-via]', el).forEach(x => x.classList.toggle('on', x === b)); });
  on(el, '#sent', 'click', b => busy(b, 'Saving', async () => { const rb = $('#rb', el).value.trim(); row = (await api('out30Confirm', { out_id: row.out_id, sent_via: via.replace(/ \(.*\)/, '').toLowerCase() + (rb ? ' · ' + rb : '') }, { write: 1 })).row; row.data = undefined; dropList(); toast('Marked sent'); draw(); }));
  on(el, '#rp', 'click', b => busy(b, 'Saving', async () => { row = Object.assign(row, (await api('out30Reply', { out_id: row.out_id, clear: row.reply_at ? 1 : 0 }, { write: 1 })).row); dropList(); draw(); }));
  on(el, '#cx', 'click', () => openSheet(`<div class="shd"><b>Cancel ${esc(row.no_text || 'this letter')}</b><button class="x" data-x aria-label="Close">${svg('x', 20)}</button></div>
    <label class="fld"><span>Why</span><textarea id="cn" rows="3" autofocus></textarea></label><p class="mu" style="font-size:12.5px">${row.no_from ? 'Its numbers stay used in the register, marked cancelled.' : ''}</p><button class="btn r w" id="cok">Cancel the letter</button>`, p => {
    on(p, '[data-x]', 'click', () => closeSheet());
    $('#cok', p).onclick = e => busy(e.currentTarget, 'Cancelling', async () => { row = Object.assign(row, (await api('out30Cancel', { out_id: row.out_id, note: $('#cn', p).value }, { write: 1 })).row); dropList(); closeSheet(); toast('Cancelled'); draw(); }); }));
} });

/* ---------- O7 · my signature (Tehsildar) ---------- */
/** a photo of ink on paper → the ink alone on a see-through background, trimmed */
function inkOnly(file) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => {
    const k = Math.min(1, 1100 / i.naturalWidth), c = document.createElement('canvas'); c.width = Math.round(i.naturalWidth * k); c.height = Math.round(i.naturalHeight * k);
    const x = c.getContext('2d'); x.drawImage(i, 0, 0, c.width, c.height); const im = x.getImageData(0, 0, c.width, c.height), p = im.data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let j = 0; j < p.length; j += 4) { const r = p[j], g = p[j + 1], b = p[j + 2], mn = Math.min(r, g, b), mx = Math.max(r, g, b), lum = 0.3 * r + 0.59 * g + 0.11 * b;
      let al = p[j + 3]; if (al > 10) { const ink = Math.max((215 - lum) / 70, (mx - mn - 30) / 50); al = Math.round(al * Math.max(0, Math.min(1, ink))); } p[j + 3] = al;
      if (al > 40) { const q = j / 4, px = q % c.width, py = (q - px) / c.width; if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; } }
    if (x1 <= x0) return rej(new Error('No ink found in the picture.'));
    x.putImageData(im, 0, 0); const pad = 8, w = Math.min(c.width, x1 - x0 + 2 * pad), h = Math.min(c.height, y1 - y0 + 2 * pad), o = document.createElement('canvas'); o.width = w; o.height = h;
    o.getContext('2d').drawImage(c, Math.max(0, x0 - pad), Math.max(0, y0 - pad), w, h, 0, 0, w, h); res(o.toDataURL('image/png')); };
    i.onerror = () => rej(new Error('Could not read the picture.')); i.src = URL.createObjectURL(file); });
}
register('os-signature', { title: 'My signature', async render(el, a, ctx) {
  if (role() !== 'ADMIN') { el.innerHTML = '<div class="pg nr"><div class="cd">Only the Tehsildar.</div></div>'; return; }
  el.innerHTML = `<div class="pg nr st30">${sk(24, '40%')}<div class="cd">${sk(150)}</div></div>`;
  let I; try { I = await api('sig30Info', {}); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; }
  let img = ''; try { img = I.has[I.use] ? await signature() : ''; } catch (e) {}
  if (!ctx.alive()) return;
  const draw = () => { el.innerHTML = `<div class="pg nr st30"><div class="hd0"><div class="sub">My settings</div><h1 class="t">My signature</h1></div>
    <div class="cd sgc"><div class="chk">${img ? `<img src="${img}" alt="Your signature">` : `<span>${I.has[I.use] ? 'Loading…' : 'Not uploaded yet'}</span>`}</div>
      <div class="chips">${[['signstamp', 'Signature + stamp'], ['sign', 'Signature only']].map(x => `<button data-use="${x[0]}" class="${I.use === x[0] ? 'on' : ''}">${x[1]}${I.has[x[0]] ? '' : ' · none'}</button>`).join('')}</div></div>
    <div class="cd pl0"><div class="pr"><span class="av" style="background:#E8F2EC;color:#0E5E3B">${svg('lock', 18)}</span><span class="nm"><small style="font-size:13.5px;color:#3F4A44;line-height:1.45">Kept in a private folder of the office Drive. Only your login can fetch it, at the moment you sign. Nobody else sees it, and it is not in the app's code.</small></span></div>
      <div class="pr"><span class="nm"><small style="font-size:13.5px;color:#3F4A44">${I.at ? 'Uploaded ' + esc(dmy(I.at).replace(/-/g, '.')) + ' · ' : ''}used on ${I.used} letter${I.used === 1 ? '' : 's'}</small></span></div></div>
    <label class="btn o w" for="up">Upload a new scan</label><input type="file" id="up" accept="image/*" hidden>
    <p class="ft" style="margin-top:0">Sign on white paper with a blue pen, stamp beside it, photograph it flat. The app removes the paper.</p></div>`; };
  draw();
  on(el, '[data-use]', 'click', b => busy(b, 'Saving', async () => { const u = b.dataset.use; if (!I.has[u]) throw new Error('Upload that one first.'); await api('sig30Use', { use: u }, { write: 1 }); I.use = u; SIG = null; img = await signature(); draw(); }));
  on(el, '#up', 'change', async inp => { const f = inp.files && inp.files[0]; if (!f) return; let png; try { png = await inkOnly(f); } catch (e) { return fail(e.message); }
    openSheet(`<div class="shd"><b>Your signature</b><button class="x" data-x aria-label="Close">${svg('x', 20)}</button></div><div class="chk" style="height:170px"><img src="${png}" alt="Signature, paper removed"></div>
      <p class="mu" style="margin:12px 0 8px">Use this as</p><div class="r2"><button class="btn" data-k="signstamp">Signature + stamp</button><button class="btn o" data-k="sign">Signature only</button></div>`, p => {
      on(p, '[data-x]', 'click', () => closeSheet());
      on(p, '[data-k]', 'click', b => busy(b, 'Uploading', async () => { const k = b.dataset.k; await api('sig30Put', { kind: k, png: png.split(',')[1] }, { write: 1, timeout: 90000 }); if (k !== I.use) await api('sig30Use', { use: k }, { write: 1 });
        I = await api('sig30Info', {}); SIG = null; img = await signature(); closeSheet(); toast('Signature saved'); draw(); })); });
    inp.value = ''; });
} });

/* ---------- Needs you ---------- */
export function outNeeds(D) {
  const L = []; if (!D || !D.rows) return L; const R = D.rows, uid = (me() || {}).user_id;
  const sign = R.filter(r => r.status === 'SIGN' || r.status === 'NUMBERED');
  if (sign.length && role() === 'ADMIN') L.push({ c: 'a', t: `${sign.length} letter${sign.length > 1 ? 's' : ''} to sign`, s: 'Outbox', b: 'Sign', k: 1, go: ['os-sign', {}] });
  const send = R.filter(r => r.status === 'SIGNED');
  if (send.length && D.can && D.can.nazir && role() !== 'ADMIN') L.push({ c: 'a', t: `${send.length} signed letter${send.length > 1 ? 's' : ''} to send`, s: 'Outbox', b: 'Send', k: 1, go: ['os-out', { f: 'send' }] });
  R.filter(overdue).slice(0, 3).forEach(r => L.push({ c: 'r', t: `No reply: ${r.to_text}`, s: `Outbox · ${r.no_text} · due ${dm(r.reply_due)}`, b: 'Open', go: ['os-out-letter', { id: r.out_id }] }));
  R.filter(r => r.status === 'DRAFT' && r.made_by === uid && /^Returned:/.test(r.note || '')).forEach(r => L.push({ c: 'r', t: `Returned: ${r.subject}`, s: 'Outbox · ' + r.note.replace(/^Returned:\s*/, ''), b: 'Open', k: 1, go: ['os-out-new', { id: r.out_id }] }));
  return L;
}
