/* Fresh by itself: back on the screen after 30 s, back online, or every few minutes while open (never while typing). */
import { $ } from './dom.js';
import { S, role } from './session.js';
import { current, VIEWS, redraw } from './router.js';
import { sheetOpen } from './ui.js';
import { legacyQuiet } from './legacy.js';
let hiddenAt = 0, last = Date.now(), act = 0, typed = false;
document.addEventListener('input', e => { if ($('#v30') && $('#v30').contains(e.target)) typed = true; }, true);
['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(ev => window.addEventListener(ev, () => { act = Date.now(); }, { passive: true, capture: true }));
export const markRendered = () => { last = Date.now(); typed = false; };
async function quiet() {
  const c = current(); if (!c || !S.session || sheetOpen() || document.visibilityState !== 'visible' || !navigator.onLine) return;
  last = Date.now();
  if (!VIEWS[c.name]) return legacyQuiet();
  const def = VIEWS[c.name]; if (def.form || typed) return;
  const ae = document.activeElement; if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;
  if (def.refresh) return def.refresh(); return redraw();
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 30000) setTimeout(quiet, 300); });
window.addEventListener('online', () => setTimeout(quiet, 1200));
setInterval(() => { const every = ['ADMIN', 'DA', 'NT'].indexOf(role()) >= 0 ? 180000 : 300000; if (Date.now() - last > every && Date.now() - act > 20000) quiet(); }, 30000);
