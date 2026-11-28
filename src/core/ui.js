/* Shared look: icons, toast, bottom sheet, busy buttons, skeletons, rings. */
import { $, esc } from './dom.js';

export const ICON = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  fid: 'M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10zM12 8v6M9 11h6',
  cert: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  meet: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4M7 14h4M7 17h7',
  map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5',
  ppl: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.7.9 2.7 2.7 3 5.2',
  cov: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  camp: 'M4 20l8-16 8 16zM10 20l2-4 2 4', ins: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  doc: 'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2', set: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  court: 'M12 3v18M5 21h14M4 8h16M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z', land: 'M3 20l5-9 4 6 3-4 6 7zM16 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  dak: 'M3 6h18v12H3zM3 6l9 7 9-7', griev: 'M4 5h16v11H9l-5 4zM12 8v3M12 13.5v.01', lock: 'M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3',
  check: 'M4 12l5 5L20 6', back: 'M15 18l-6-6 6-6', out: 'M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9',
  phone: 'M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2', wa: 'M4 20l1.5-4A8 8 0 1 1 9 19z',
  plus: 'M12 5v14M5 12h14', pen: 'M3 17c3-1 4-8 7-8s1 6 4 6 3-3 7-3M3 21h18', x: 'M6 6l12 12M18 6L6 18', del: 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6',
};
export const svg = (k, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON[k] || ICON.more}"/></svg>`;

export function toast(msg, kind) {
  let t = $('#t30'); if (!t) { t = document.createElement('div'); t.id = 't30'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
  t.className = 'on ' + (kind || 'ok'); t.textContent = msg; clearTimeout(toast._t); toast._t = setTimeout(() => { t.className = ''; }, kind === 'err' ? 4500 : 2600);
}
export const fail = m => toast(m, 'err');

/** busy(button, 'Saving', async () => …) – shows a spinner, reports errors, never double-runs */
export async function busy(el, text, fn) {
  if (!el || el.dataset.busy) return; const was = el.innerHTML; el.dataset.busy = '1'; el.disabled = true; el.innerHTML = `<span class="spin"></span>${esc(text)}`;
  try { return await fn(); } catch (e) { fail(e.message); } finally { delete el.dataset.busy; el.disabled = false; if (el.isConnected) el.innerHTML = was; }
}

/* bottom sheet (phone) / dialog (desktop) */
let SH = null;
export function openSheet(html, mount, opt) {
  closeSheet(true);
  const w = document.createElement('div'); w.id = 'sh30'; w.innerHTML = `<div class="bd"></div><div class="pn${opt && opt.wide ? ' wd' : ''}" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(w); document.body.classList.add('noscroll'); SH = w;
  w.querySelector('.bd').onclick = () => closeSheet();
  history.pushState({ sh30: 1 }, '');
  if (mount) mount(w.querySelector('.pn'));
  const f = w.querySelector('[autofocus]'); if (f) setTimeout(() => f.focus(), 60);
  return w.querySelector('.pn');
}
export function closeSheet(silent) { if (!SH) return; SH.remove(); SH = null; document.body.classList.remove('noscroll'); if (!silent && history.state && history.state.sh30) history.back(); }
export const sheetOpen = () => !!SH;
window.addEventListener('popstate', () => { if (SH) { SH.remove(); SH = null; document.body.classList.remove('noscroll'); } });

export const sk = (h, w) => `<div class="sk" style="height:${h || 14}px;width:${w || '100%'}"></div>`;
export function ring(p, size, stroke, col, bg, label) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, p || 0));
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${(c * v).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>${label && size > 60 ? `<text x="50%" y="50%" dy=".35em" text-anchor="middle" font-size="${Math.round(size / 4.4)}" font-weight="600" fill="#0F1A14" font-family="Inter,sans-serif">${Math.round(v * 100)}%</text>` : ''}</svg>`;
}
export const pill = (t, c) => `<span class="pl ${c || ''}">${esc(t)}</span>`;
