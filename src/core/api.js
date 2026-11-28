/* Talking to the server.
 * - Reading calls made within 30 ms of each other travel together in one request (multi16).
 * - "Session expired" is checked twice with a light call before anyone is logged out.
 * - A slow or lost connection is reported as such and never logs anyone out.
 */
import { API_URL, VERSION } from './config.js';
import { sleep } from './dom.js';
import { S } from './session.js';

export class NetError extends Error {}
const listeners = { expired: [], busy: [] };
export const onApi = (ev, fn) => listeners[ev].push(fn);
let inflight = 0; const busyN = d => { inflight = Math.max(0, inflight + d); listeners.busy.forEach(f => f(inflight)); };

const READS = new Set(['ins19', 'day19', 'alerts19', 'cert25List', 'mtg28List', 'svm12Get', 'home29', 'listUsers', 'sig15', 'dir14List', 'staff30', 'out30List', 'out30Get']);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

async function raw(action, data, timeout) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), timeout || 45000);
  const body = Object.assign({ action, token: S.session ? S.session.token : '', client_now: new Date().toISOString(), hb: S.session ? { v: VERSION, pending: 0 } : undefined }, data || {});
  if (data && data.__write) { delete body.__write; body.req_id = uid() + uid(); }
  busyN(1);
  let out;
  try { const r = await fetch(API_URL, { method: 'POST', redirect: 'follow', signal: ctl.signal, body: JSON.stringify(body) }); out = await r.json(); }
  catch (e) { throw new NetError(ctl.signal.aborted ? 'The server is slow to answer. Try again in a minute.' : navigator.onLine ? 'Could not reach the server. It may be busy: try again in a minute.' : 'No internet connection. Try again when you have signal.'); }
  finally { clearTimeout(t); busyN(-1); }
  return out;
}

let checking = null;
/** Is the session really gone? Two checks, 1.5 s and 4 s apart. */
async function confirmExpired() {
  if (checking) return checking;
  checking = (async () => {
    for (const w of [1500, 4000]) { await sleep(w);
      try { const r = await raw('sess30', {}, 30000); if (r.ok) return false; if (r.error !== 'SESSION_EXPIRED') return false; } catch (e) { return false; } }
    return true;
  })();
  try { return await checking; } finally { checking = null; }
}

async function single(action, data, timeout, retried) {
  const r = await raw(action, data, timeout);
  if (r.ok) return r;
  if (r.error === 'SESSION_EXPIRED' && S.session && action !== 'login') {
    if (await confirmExpired()) { listeners.expired.forEach(f => f()); throw new Error('Please log in again.'); }
    if (!retried) return single(action, data, timeout, true);
  }
  throw new Error(plain(r.error));
}
export function plain(m) {
  m = String(m || 'Something went wrong.');
  if (/Service Spreadsheets|Service error|timed out|Exceeded maximum|Internal error|BUSY\|/i.test(m)) return 'Google was busy. Try again in a minute.';
  if (/Lock timeout/i.test(m)) return 'The server is busy with another save. Try again in a few seconds.';
  return m.replace(/^OFF18\||^MON18\|/, '');
}

/* batching */
const Q = { list: [], t: 0 };
async function flush() {
  const calls = Q.list.splice(0, 12); if (Q.list.length) setTimeout(flush, 0); if (!calls.length) return;
  if (calls.length === 1) { const c = calls[0]; try { c.res(await single(c.action, c.data, c.timeout)); } catch (e) { c.rej(e); } return; }
  let r;
  try { r = await single('multi16', { calls: calls.map(c => Object.assign({ action: c.action }, c.data)) }, Math.max(...calls.map(c => c.timeout)) + 15000); }
  catch (e) { calls.forEach(c => c.rej(e)); return; }
  calls.forEach((c, i) => { const x = (r.results || [])[i];
    if (!x) return c.rej(new Error('Something went wrong.'));
    if (x.ok) return c.res(x);
    if (x.error === 'SESSION_EXPIRED') return single(c.action, c.data, c.timeout).then(c.res, c.rej);
    c.rej(new Error(plain(x.error))); });
}
/** api(action, data, {timeout, write}) */
export function api(action, data, opt) {
  opt = opt || {}; const timeout = opt.timeout || 45000;
  if (opt.write) return single(action, Object.assign({ __write: 1 }, data || {}), timeout);
  if (!READS.has(action) || !S.session) return single(action, data, timeout);
  return new Promise((res, rej) => { Q.list.push({ action, data: data || {}, timeout, res, rej }); clearTimeout(Q.t); Q.t = setTimeout(flush, 30); });
}
