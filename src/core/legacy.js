/* The older screens, shown inside the new shell until their module is rebuilt.
 * One hidden frame (legacy.html?embed=1) is kept loaded; it shares the phone's login and data with the shell.
 */
import { $ } from './dom.js';
let F = null, ready = false, pending = null, depthN = 1, titleCb = () => {}, openCb = () => {}, outCb = () => {};
export const legacyEvents = (h) => { titleCb = h.title || titleCb; openCb = h.open || openCb; outCb = h.out || outCb; };
function frame() {
  if (F) return F;
  F = document.createElement('iframe'); F.id = 'lg30'; F.title = 'TehsilOS'; F.hidden = true; F.src = 'legacy.html?embed=1';
  document.body.appendChild(F); ready = false;
  return F;
}
window.addEventListener('message', e => {
  if (e.origin !== location.origin || !F || e.source !== F.contentWindow) return; const m = e.data || {};
  if (m.cmd === 'ready') { ready = true; if (pending) { post(pending); pending = null; } }
  else if (m.cmd === 'title') { depthN = m.depth || 1; titleCb(m.title || '', depthN); }
  else if (m.cmd === 'open') openCb(m.name, m.args || {});
  else if (m.cmd === 'logout' || m.cmd === 'expired') outCb(m.cmd);
});
function post(m) { if (!ready) { pending = m; return; } F.contentWindow.postMessage(m, location.origin); }
export function legacyShow(name, args) { frame().hidden = false; document.body.classList.add('lg'); depthN = 1; post({ cmd: 'go', name, args: args || {} }); }
export function legacyHide() { if (F) F.hidden = true; document.body.classList.remove('lg'); }
export function legacyBack() { post({ cmd: 'back' }); }
export const legacyDepth = () => (F && !F.hidden ? depthN : 0);
export function legacyQuiet() { if (F && !F.hidden && ready) post({ cmd: 'quiet' }); }
export function legacyReset() { if (F) { F.remove(); F = null; ready = false; pending = null; } }
/** older screens keep an upload queue (Patwari marks); a hidden frame uploads it if anything is waiting */
export function legacyWarm() { frame(); }
