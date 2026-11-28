/* Work saved on the phone first, sent when there is signal (Patwari marks). Kept per person in the phone's store. */
import { kget, kput } from './store.js';
import { api } from './api.js';
import { me } from './session.js';
import { toast } from './ui.js';
const key = () => 'oq30:' + ((me() || {}).user_id || '');
const subs = [];
let busy = false;
export const onQueue = fn => subs.push(fn);
const tell = n => subs.forEach(f => { try { f(n); } catch (e) {} });
export async function queued() { return ((await kget(key())) || []).length; }
export async function enqueue(action, data) {
  const L = (await kget(key())) || []; L.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), action, data, at: new Date().toISOString() });
  await kput(key(), L); tell(L.length); flush(); return L.length;
}
export async function flush() {
  if (busy || !navigator.onLine || !me()) return; busy = true;
  try {
    for (;;) { const L = (await kget(key())) || []; if (!L.length) break;
      const it = L[0];
      try { const r = await api(it.action, Object.assign({}, it.data, { __q30: it.id }), { write: 1, timeout: 60000 });
        const bad = ((r && r.results) || []).filter(x => x && x.ok === false);
        if (bad.length) { const X = (await kget(key() + ':x')) || []; await kput(key() + ':x', X.concat(bad.map(b => ({ at: it.at, bucket_id: b.bucket_id, error: b.error }))).slice(-200)); toast(bad.length + ' mark' + (bad.length > 1 ? 's' : '') + ' not saved: ' + (bad[0].error || 'refused'), 'err'); } }
      catch (e) { if (/connection|slow|signal|internet/i.test(e.message)) break; it.err = e.message; it.tries = (it.tries || 0) + 1;
        if (it.tries < 3) { await kput(key(), L); break; }
        const X = (await kget(key() + ':x')) || []; await kput(key() + ':x', X.concat([{ at: it.at, error: e.message, data: it.data }]).slice(-200)); toast('Some marks could not be saved: ' + e.message, 'err'); }
      const L2 = (await kget(key())) || []; await kput(key(), L2.filter(x => x.id !== it.id)); tell(L2.length - 1); }
  } finally { busy = false; }
}
window.addEventListener('online', () => setTimeout(flush, 1500));
setInterval(flush, 60000);
