/* Who is logged in. The same keys as the older screens ("session", "boot"), so both stay logged in together. */
import { kget, kput, kdel, kkeys } from './store.js';
export const S = { session: null, boot: null };
export const me = () => (S.session && S.session.user) || null;
export const role = () => (me() || {}).role || '';
export async function loadSession() { S.session = (await kget('session')) || null; S.boot = (await kget('boot')) || null; return S.session; }
export async function saveSession(sess, boot) { S.session = sess; await kput('session', sess); if (boot) { S.boot = boot; await kput('boot', boot); } }
export async function saveBoot(b) { S.boot = b; await kput('boot', b); }
export async function clearSession() {
  S.session = null; S.boot = null;
  await kdel('session'); await kdel('boot'); await kdel('home');
  for (const k of await kkeys()) if (/^(b:|r:|stats:|d15:|td10:|ui26:|os:)/.test(String(k))) await kdel(k);
}
/** The person's place in TehsilOS: teh, nt, da, oq, gq, ph, comp, or '' (Farmer ID only / not in the shell). */
export function rk() {
  if (!S.boot || S.boot.fid25) return '';
  if (S.boot.rk29 != null) return S.boot.rk29;
  const u = me() || {}, d = String(u.designation || '');
  if (u.role === 'ADMIN') return 'teh'; if (u.role === 'NT') return S.boot.m28 && !S.boot.m28.ntMain ? '' : 'nt';
  if (u.role === 'DA' || /\bBCG\b/i.test(d)) return 'da'; if (/\bOQ\b|office\s*qanungo/i.test(d)) return 'oq';
  if (/\bGQ\b|girdawar/i.test(d)) return 'gq'; if (/patwari/i.test(d)) return 'ph'; return u.role === 'COMP' ? 'comp' : '';
}
/** Stage 1: the new shell is for the office roles; field staff keep the older Farmer ID screens until Stage 2. */
export const inShell = () => ['teh', 'nt', 'da', 'oq', 'gq', 'ph'].indexOf(rk()) >= 0;
export const firstName = () => String((me() || {}).name || '').split(' ')[0];
/** module switches as the server gives them */
export const svmOn = () => !!(S.boot && S.boot.tos12 && S.boot.tos12.svm && S.boot.tos12.svm.view);
export const mtgWho = () => (S.boot && S.boot.m28 && S.boot.m28.who) || '';
export function certWho() {
  const u = me() || {}; if (!S.boot || S.boot.fid25) return ''; if (u.role === 'ADMIN') return 'teh'; if (u.role === 'NT') return S.boot.m28 && !S.boot.m28.ntMain ? '' : 'nt'; if (u.role === 'DA') return 'da';
  const d = String(u.designation || ''); return /patwari/i.test(d) ? 'ph' : /\bGQ\b|girdawar/i.test(d) ? '' : /\bBCG\b/i.test(d) ? 'da' : /\bOQ\b|office\s*qanungo/i.test(d) ? 'oq' : '';
}
export const desig = () => { const u = me() || {}; return u.role === 'ADMIN' ? 'Tehsildar Kastigarh' : u.role === 'NT' ? 'Naib Tehsildar' : u.role === 'DA' ? 'Dealing Assistant' : (u.designation || ''); };
