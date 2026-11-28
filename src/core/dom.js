/* Small DOM helpers used everywhere. */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** on(root, selector, event, fn(el, ev)) – delegated, survives re-renders of children */
export function on(root, sel, ev, fn) { root.addEventListener(ev, e => { const t = e.target.closest && e.target.closest(sel); if (t && root.contains(t)) fn(t, e); }); }
export const N = x => Number(x || 0).toLocaleString('en-IN');
export const ist = (t = Date.now()) => new Date(t + 5.5 * 3600e3);
export const today = () => ist().toISOString().slice(0, 10);
export const hm = t => ist(t).toISOString().slice(11, 16);
export const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const nice = d => d ? WD[new Date(d.slice(0, 10) + 'T00:00:00Z').getUTCDay()] + ' ' + Number(d.slice(8, 10)) + ' ' + MO[Number(d.slice(5, 7)) - 1] : '';
export const ago = s => { if (!s) return 'never'; const d = String(s).slice(0, 10), t = today(); if (d === t) return 'today ' + String(s).slice(11, 16); const n = Math.round((new Date(t) - new Date(d)) / 864e5); return n === 1 ? 'yesterday' : n < 30 ? n + ' days ago' : dmy(d); };
export const initials = n => String(n || '?').trim().split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase();
export const sleep = ms => new Promise(r => setTimeout(r, ms));
