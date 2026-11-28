/* The phone's own copy: the same IndexedDB ("farmerid" → "kv") the older screens use, so both share the login and data. */
let _db = null;
function idb() {
  if (_db) return Promise.resolve(_db);
  return new Promise((res, rej) => { const r = indexedDB.open('farmerid', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => { _db = r.result; res(_db); }; r.onerror = () => rej(r.error); });
}
export async function kget(k) { try { const d = await idb(); return await new Promise((res, rej) => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); } catch (e) { return undefined; } }
export async function kput(k, v) { try { const d = await idb(); await new Promise((res, rej) => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }); } catch (e) {} }
export async function kdel(k) { try { const d = await idb(); await new Promise(res => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').delete(k); t.oncomplete = res; t.onerror = res; }); } catch (e) {} }
export async function kkeys() { try { const d = await idb(); return await new Promise(res => { const q = d.transaction('kv').objectStore('kv').getAllKeys(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); }); } catch (e) { return []; } }
