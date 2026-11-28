/* Screens and the Back button.
 * A screen built in the new core is "native"; any other name opens the older screen inside the shell (legacy.js).
 * The page keeps its place: Back returns to where you were; a refresh of the same screen keeps the scroll.
 */
import { $ } from './dom.js';
import { legacyShow, legacyHide, legacyBack, legacyDepth } from './legacy.js';
import { closeSheet, sheetOpen } from './ui.js';

export const VIEWS = {};
export const register = (name, def) => { VIEWS[name] = def; };
const NAV = { stack: [] };
export const current = () => NAV.stack[NAV.stack.length - 1];
export const depth = () => NAV.stack.length;
const hooks = [];
export const onRender = fn => hooks.push(fn);
const se = () => document.scrollingElement || document.documentElement;

export function go(name, args, opt) {
  const c = current(); if (c) c.y = se().scrollTop;
  if (opt && opt.replace && c) NAV.stack[NAV.stack.length - 1] = { name, args: args || {} };
  else { NAV.stack.push({ name, args: args || {} }); history.pushState({ r30: NAV.stack.length }, ''); }
  if (!(opt && opt.keepY)) se().scrollTop = 0;
  return render();
}
/** start over with this screen (after log-in, a tab tap) */
export function reset(name, args) { const c = current(); if (c) c.y = se().scrollTop; NAV.stack = [{ name, args: args || {} }]; history.replaceState({ r30: 1 }, ''); se().scrollTop = 0; return render(); }
export function back() {
  const c = current();
  if (c && !VIEWS[c.name] && legacyDepth() > 1) return legacyBack();
  if (NAV.stack.length > 1) history.back();
}
window.addEventListener('popstate', e => {
  if (sheetOpen()) return;
  const n = (e.state && e.state.r30) || 1;
  if (n < NAV.stack.length) { NAV.stack.length = Math.max(1, n); render(true); }
});

let token = 0;
/** render(): draw the current screen. Returns when it is drawn. */
export async function render(isBack) {
  const c = current(); if (!c) return;
  const my = ++token, v = $('#v30');
  hooks.forEach(f => { try { f(c); } catch (e) {} });
  const def = VIEWS[c.name];
  if (!def) { v.hidden = true; v.innerHTML = ''; legacyShow(c.name, c.args); return; }
  legacyHide(); v.hidden = false;
  const keep = c.y || 0, box = document.createElement('div'); box.className = 'vw'; v.replaceChildren(box);
  try { await def.render(box, c.args, { alive: () => my === token && current() === c }); }
  catch (e) { if (my === token) box.innerHTML = `<div class="pg"><div class="cd er">${String(e.message || e)}</div></div>`; }
  if (my === token && (isBack || c.y)) requestAnimationFrame(() => { se().scrollTop = keep; });
}
/** quiet redraw of the same screen, keeping the place */
export async function redraw() { const c = current(); if (!c) return; c.y = se().scrollTop; return render(true); }
export { closeSheet };
