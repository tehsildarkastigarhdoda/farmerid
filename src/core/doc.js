/* The document engine: one letter model → a PDF in the Tehsildar's format
 * (letterhead with emblem and a rule; bold addressee; bold Subject:-; numbered paragraphs;
 *  No./Dated bottom-left; signature and stamp bottom-right; Copy to the:).
 *
 * Letter model:
 * { head?: [lines] (default: Kastigarh letterhead; "1{ST}" prints a superscript), email?,
 *   to: [lines], subject, ref?, salute?, paras: [string | {t, sub: [string]}], close?: 'Yours faithfully,',
 *   no, date, sign: { lines: ['Tehsildar', 'Kastigarh'], img?: dataURL }, copies: [string], copyLabel?, encl?: [string],
 *   style?: 'notice' | 'letter', draft?: bool }
 * Inside any text, **bold** prints bold.
 */
const LIB = 'lib/jspdf.umd.min.js';
const HEAD = ['GOVT OF UT OF JAMMU & KASHMIR', 'OFFICE OF THE TEHSILDAR EXECUTIVE MAGISTRATE 1{ST}CLASS', 'KASTIGARH DISTRICT DODA, J&K'];
const EMAIL = 'tehsildarkastigarhdoda@gmail.com';
let emblem = null;

function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.charset = 'utf-8'; s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load the PDF tool. Check the connection.')); document.head.appendChild(s); }); }
async function lib() { if (!(window.jspdf && window.jspdf.jsPDF)) await loadScript(LIB); return window.jspdf.jsPDF; }
async function toData(url) { const b = await (await fetch(url)).blob(); return new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }); }
/** any image → a plain 8-bit RGBA PNG (the PDF tool misreads some PNG files) and its size */
const norm = (src, max) => new Promise(r => { const i = new Image(); i.onload = () => { const c = document.createElement('canvas'), k = max && i.naturalWidth > max ? max / i.naturalWidth : 1; c.width = Math.round(i.naturalWidth * k); c.height = Math.round(i.naturalHeight * k); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); r({ src: c.toDataURL('image/png'), w: c.width, h: c.height }); }; i.onerror = () => r(null); i.src = src; });

/* text that jsPDF's standard fonts can print */
const clean = s => String(s == null ? '' : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...').replace(/×/g, 'x').replace(/₹/g, 'Rs. ').replace(/ /g, ' ');
/** "a **b** c" → [{w:'a',b:0},{w:'b',b:1},{w:'c',b:0}] (words) */
function words(s) {
  const out = []; clean(s).split(/(\*\*[^*]+\*\*)/).forEach(seg => { if (!seg) return; const b = /^\*\*/.test(seg) ? 1 : 0; const t = b ? seg.slice(2, -2) : seg;
    t.split(/(\s+)/).forEach((w, i) => { if (!w) return; if (/^\s+$/.test(w)) { if (out.length) out[out.length - 1].sp = 1; return; } out.push({ w, b, sp: 0 }); }); });
  return out;
}

export async function letterPDF(L) {
  const jsPDF = await lib(); const d = new jsPDF({ unit: 'pt', format: 'a4' });
  if (!emblem) { try { emblem = (await norm(await toData('img/emblem.png'))) || ''; } catch (e) { emblem = ''; } }
  const W = 595, H = 842, ML = 88, MR = 537, MW = MR - ML, FS = 11.5, LD = 13.6, BOT = 806;
  const style = L.style || 'notice';
  let y = 0, page = 1;
  const font = (b, sz) => { d.setFont('times', b ? 'bold' : 'normal'); d.setFontSize(sz || FS); };
  const wd = (w, b, sz) => { font(b, sz); return d.getTextWidth(w); };

  function header() {
    let t = 12;
    if (emblem) { d.addImage(emblem.src, 'PNG', W / 2 - 21, t, 42, 42 * emblem.h / emblem.w, 'emblem', 'FAST'); t += 42 * emblem.h / emblem.w + 12; }
    const lines = L.head || HEAD; d.setTextColor(0);
    lines.forEach(l => { d.setFont('helvetica', 'bold'); d.setFontSize(10); const m = /^(.*)\{(\w+)\}(.*)$/.exec(l);
      if (m) { const a = clean(m[1]), s = m[2], c = clean(m[3]); const wa = d.getTextWidth(a), wc = d.getTextWidth(c); d.setFontSize(6.5); const ws = d.getTextWidth(s); const x0 = W / 2 - (wa + ws + wc + 1) / 2;
        d.setFontSize(10); d.text(a, x0, t); d.setFontSize(6.5); d.text(s, x0 + wa + 1.2, t - 3.6); d.setFontSize(10); d.text(c, x0 + wa + ws + 2.4, t); }
      else d.text(clean(l), W / 2, t, { align: 'center' });
      t += 13; });
    const em = L.email === undefined ? EMAIL : L.email;
    if (em) { d.setFont('helvetica', 'bold'); d.setFontSize(10); const lab = 'email: ', wl = d.getTextWidth(lab), we = d.getTextWidth(em), x0 = W / 2 - (wl + we) / 2;
      d.text(lab, x0, t); d.setTextColor(31, 92, 166); d.text(em, x0 + wl, t); d.setDrawColor(31, 92, 166); d.setLineWidth(0.6); d.line(x0 + wl, t + 1.5, x0 + wl + we, t + 1.5); d.setTextColor(0); t += 18; }
    d.setDrawColor(0); d.setLineWidth(0.7); d.line(58, t, W - 58, t);
    if (L.draft) { d.setFont('helvetica', 'bold'); d.setFontSize(9); d.setTextColor(178, 35, 24); d.text('DRAFT – NOT SIGNED'.replace('–', '-'), W - 58, 18, { align: 'right' }); d.setTextColor(0); }
    if (page > 1) { d.setFont('times', 'normal'); d.setFontSize(9); d.text('Page ' + page, W / 2, H - 22, { align: 'center' }); }
    return t + 30;
  }
  const newPage = () => { d.addPage(); page++; y = header(); };
  const room = h => { if (y + h > BOT) newPage(); };

  /** lay out words between x0 (first line x1) and x2; returns lines of {ws:[...], x, last} */
  function layout(ws, x1, xr, xn, sz) {
    const sp = wd(' ', 0, sz), lines = []; let cur = [], w = 0, x = x1;
    ws.forEach(t => { const tw = wd(t.w, t.b, sz); const add = cur.length ? (cur[cur.length - 1].sp ? sp : 0) + tw : tw;
      if (cur.length && x + w + add > xr) { lines.push({ ws: cur, x }); cur = [t]; w = tw; x = xn; } else { cur.push(t); w += add; } });
    if (cur.length) lines.push({ ws: cur, x, last: 1 }); if (lines.length) lines[lines.length - 1].last = 1; return lines;
  }
  function drawLines(lines, xr, sz, lead, justify) {
    lines.forEach(ln => { room(lead);
      const sp = wd(' ', 0, sz), tot = ln.ws.reduce((a, t) => a + wd(t.w, t.b, sz), 0), gaps = ln.ws.slice(0, -1).filter(t => t.sp).length;
      const g = justify && !ln.last && gaps > 0 ? (xr - ln.x - tot) / gaps : sp; let x = ln.x;
      ln.ws.forEach(t => { font(t.b, sz); d.text(t.w, x, y); x += d.getTextWidth(t.w) + (t.sp ? g : 0); });
      y += lead; });
  }
  /** a paragraph: label (e.g. "1.") at lx, first-line text at x1, wrapped lines at xn */
  function para(label, text, lx, x1, xn, opt) {
    const sz = (opt && opt.sz) || FS, lead = (opt && opt.lead) || LD, ws = words(text);
    const lines = layout(ws, x1, MR, xn, sz); room(Math.min(lines.length, 2) * lead);
    if (label) { font(opt && opt.lb, sz); d.text(label, lx, y); }
    drawLines(lines, MR, sz, lead, !(opt && opt.left));
  }

  y = header();
  /* addressee */
  if (L.to && L.to.length) { L.to.forEach(l => { room(LD); font(1); d.text(clean(l), ML, y); y += LD; }); y += 12; }
  /* subject */
  if (L.subject) { para('', '**Subject:-' + String(L.subject).replace(/\*\*/g, '') + '**', ML, ML, ML); y += 2; }
  if (L.ref) { para('', '**Reference:-** ' + L.ref, ML, ML, ML); y += 4; }
  y += 8;
  if (L.salute) { room(LD); font(0); d.text(clean(L.salute), ML, y); y += LD + 4; }
  /* paragraphs */
  const P = L.paras || [];
  P.forEach((p, i) => {
    const t = typeof p === 'string' ? p : p.t, n = P.length > 1 || (L.number !== false && P.length > 1) ? (i + 1) + '.' : '';
    if (style === 'letter') para(n, t, ML + 14, n ? ML + 34 : ML, n ? ML + 34 : ML);
    else if (n) para(n, t, ML, ML + 36, ML); else para('', t, ML, ML + 36, ML);
    (typeof p === 'object' && p.sub || []).forEach((s, k) => para('(' + String.fromCharCode(97 + k) + ')', s, ML, ML + 36, ML + 36));
  });
  if (L.after) { y += 4; para('', L.after, ML, ML + 36, ML); }
  /* closing, No./Dated, signature */
  const S = L.sign || { lines: ['Tehsildar', 'Kastigarh'] }, sx = MR - 50;
  let need = 40 + S.lines.length * LD + (L.close ? LD : 0); room(need + 30);
  if (L.close) { y += 2; font(0); d.text(clean(L.close), MR, y, { align: 'right' }); y += LD; }
  y += L.close ? 34 : 22;
  const sy = y;
  if (L.no || L.date) { font(0); if (L.no) d.text('No. ' + clean(L.no), ML, sy + 2 * LD); d.text('Dated: ' + clean(L.date || ''), ML, sy + 3 * LD); }
  font(0); S.lines.forEach((l, i) => d.text(clean(l), sx, sy + (i + (S.lines.length > 2 ? 1 : 2)) * LD, { align: 'center' }));
  if (S.img) { const im = await norm(S.img, 560); const w = 118, h = im ? w * im.h / im.w : 0; if (im) d.addImage(im.src, 'PNG', sx - w / 2 + 10, sy + LD * 2.2 - h * 0.62, w, h, 'sign', 'FAST'); }
  y = sy + (Math.max(S.lines.length, 3) + 1) * LD + 14;
  /* enclosures */
  if (L.encl && L.encl.length) { room(LD * 2); font(1, 11.5); d.text('Encl:-', ML, y); y += LD; L.encl.forEach((e, i) => para((i + 1) + '.', e, ML + 14, ML + 34, ML + 34, { sz: 11.5, lead: 14.5 })); y += 6; }
  /* copy to */
  if (L.copies && L.copies.length) {
    room(LD * 3); font(style === 'letter', 11); d.text(clean(L.copyLabel || (style === 'letter' ? 'Copy to the:-' : 'Copy to the:')), ML, y); y += LD;
    L.copies.forEach((c, i) => para((i + 1) + '.', c, ML + 14, ML + 30, ML + 30, { sz: 11, lead: 12.8 }));
  }
  return d;
}
/** count of numbers a letter takes in the dispatch series: the original plus one per copy (574-79 = 6) */
export const nosNeeded = L => 1 + ((L.copies || []).length || 0);
/** "574-79/Nazir/TKG" */
export function noText(from, to, suffix) { const a = String(from), b = String(to); let t = a;
  if (to > from) { let k = 0; while (k < a.length - 1 && a.length === b.length && a[k] === b[k]) k++; t = a + '-' + (a.length === b.length ? b.slice(Math.min(k, a.length - 2)) : b); }
  return t + (suffix || '/Nazir/TKG'); }
export async function savePDF(L, name) { const d = await letterPDF(L); d.save(name); return d; }
export async function pdfBlob(L) { return (await letterPDF(L)).output('blob'); }
