/* Log in (frozen mockups L1–L3, 28.11.2026): choose your name → PIN on a keypad → Forgot PIN. */
import { $, $$, esc, on, initials } from '../core/dom.js';
import { svg, toast, fail, busy } from '../core/ui.js';
import { api } from '../core/api.js';
import { kget, kput, kdel } from '../core/store.js';
import { register } from '../core/router.js';
import { saveSession } from '../core/session.js';

const brand = `<div class="lgb"><span>T</span><div><b>TehsilOS</b><small>Tehsil Kastigarh</small></div></div>`;
const desigOf = u => String(u.label || '').split(' – ')[1] || '';
const nameOf = u => String(u.label || '').split(' – ')[0];
const tone = i => [['#E8F2EC', '#0E5E3B'], ['#EAF0F8', '#2F5D9E'], ['#F0EEF7', '#5B4B8A'], ['#FFF4E0', '#8A5300']][i % 4];

register('os-login', { title: 'Log in', form: true, async render(el, a, ctx) {
  let list = (await kget('loginList')) || [], recent = (await kget('recentUsers')) || [], who = null, pin = '', step = 'name', busyLogin = false;
  const person = (u, i) => { const c = tone(i); return `<button class="pr" data-id="${esc(u.user_id)}"><span class="av" style="background:${c[0]};color:${c[1]}">${esc(initials(nameOf(u)))}</span><span class="nm"><b>${esc(nameOf(u))}</b><small>${esc(desigOf(u))}${u.tehsil ? ' · ' + esc(u.tehsil) : ''}</small></span>${svg('back', 18).replace('M15 18l-6-6 6-6', 'M9 18l6-6-6-6')}</button>`; };
  function draw() {
    if (!ctx.alive()) return;
    if (step === 'name') {
      const rec = recent.map(id => list.find(u => u.user_id === id)).filter(Boolean);
      el.innerHTML = `<div class="lg30">${brand}<div class="lgh"><h1>Log in</h1><p>Choose your name. <span>Apna naam chunein.</span></p></div>
        ${rec.length ? `<div class="sec">On this phone</div><div class="cd pl0">${rec.map(person).join('')}</div>` : ''}
        <div class="sec">${rec.length ? 'Someone else' : 'Your name'}</div>
        <label class="srch">${svg('search', 18)}<input id="q" placeholder="Type 2 letters of your name" autocomplete="off" autocapitalize="words" aria-label="Your name"></label>
        <div id="names"></div><p class="ft">Name not here? Ask the Dealing Assistant to add you.</p></div>`;
      const q = $('#q', el), names = $('#names', el);
      q.oninput = () => { const s = q.value.trim().toLowerCase();
        const L = s.length < 2 ? [] : list.filter(u => nameOf(u).toLowerCase().split(/\s+/).some(w => w.startsWith(s)) || nameOf(u).toLowerCase().startsWith(s)).slice(0, 12);
        names.innerHTML = s.length < 2 ? '' : L.length ? `<div class="cd pl0">${L.map(person).join('')}</div>` : `<p class="ft">${navigator.onLine ? 'No name found. Ask the Dealing Assistant to add you.' : 'Connect to the internet to see the names.'}</p>`; };
      if (!rec.length) setTimeout(() => q.focus(), 50);
    } else if (step === 'pin') {
      el.innerHTML = `<div class="lg30">${brand}
        <div class="cd who"><span class="av">${esc(initials(nameOf(who)))}</span><span class="nm"><b>${esc(nameOf(who))}</b><small>${esc(desigOf(who))}${who.tehsil ? ' · ' + esc(who.tehsil) : ''}</small></span><button class="lk" id="chg">Change</button></div>
        <div class="pn"><div class="pt">Your PIN</div><div class="dots" aria-live="polite" aria-label="${pin.length} digits typed">${Array.from({ length: 4 }, (x, i) => `<i class="${i < pin.length ? 'f' : ''}"></i>`).join('')}</div></div>
        <div class="kp">${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map(k => `<button type="button" data-k="${k}" class="${k === 'ok' ? 'ok' : k === 'del' ? 'dl' : ''}" aria-label="${k === 'del' ? 'Delete' : k === 'ok' ? 'Log in' : k}">${k === 'del' ? svg('del', 22) : k === 'ok' ? (busyLogin ? '<span class="spin"></span>' : svg('check', 22)) : k}</button>`).join('')}</div>
        <label class="keep"><input type="checkbox" id="keep" checked>Keep me logged in on this phone</label>
        <p style="text-align:center;margin:8px 0 0"><button class="lk" id="fgt" style="font-size:14px">Forgot PIN?</button></p></div>`;
      $('#chg', el).onclick = () => { step = 'name'; who = null; pin = ''; draw(); };
      $('#fgt', el).onclick = () => { step = 'forgot'; draw(); };
    } else {
      const rs = who.resetter || {}, st = who.reset;
      el.innerHTML = `<div class="lg30">${brand}<div class="lgh"><h1 style="font-size:24px">Forgot your PIN?</h1><p>${esc(nameOf(who))} · ${esc(desigOf(who))}</p></div>
        ${st === 'APPROVED' ? `<div class="note g">Reset approved. Log in with <b>1234</b>, then set your own PIN. Valid for 24 hours.<br><span>1234 daalein, phir naya PIN banayein.</span></div>`
          : st === 'PENDING' ? `<div class="note">Request sent. Waiting for ${esc(rs.name || 'the Dealing Assistant')} to approve.<br><span>Reset maanga hai – approval ka intezaar.</span></div><button class="btn o w" id="chk" style="margin-top:12px">Check again</button>`
          : `<div class="cd"><b style="font-size:15px">Ask for a new PIN</b><p class="mu" style="font-size:13px;margin:6px 0 14px;line-height:1.55">Your request goes to ${esc(rs.name || 'the Dealing Assistant')}. When it is approved, log in with <b>1234</b> and set your own PIN.</p><button class="btn w" id="rq">Send request</button></div>`}
        ${rs.mobile ? `<a class="cd callr" href="tel:${esc(rs.mobile)}"><span class="av">${svg('phone', 18)}</span><span><b>Call ${esc(rs.name)}</b><small>${esc(rs.mobile)}</small></span></a>` : ''}
        <p style="text-align:center"><button class="lk" id="bk" style="font-size:14px">‹ Back to PIN</button></p></div>`;
      $('#bk', el).onclick = () => { step = 'pin'; pin = ''; draw(); };
      const rq = $('#rq', el); if (rq) rq.onclick = () => busy(rq, 'Sending', async () => { const r = await api('pinRequest', { user_id: who.user_id }); who.reset = r.status; draw(); });
      const ck = $('#chk', el); if (ck) ck.onclick = () => busy(ck, 'Checking', async () => { const r = await api('loginList'); list = r.users; await kput('loginList', list); const u = list.find(x => x.user_id === who.user_id); if (u) who = u; draw(); });
    }
  }
  on(el, '.pr', 'click', b => { who = list.find(u => u.user_id === b.dataset.id); if (!who) return; pin = ''; step = 'pin'; draw(); });
  on(el, '.kp button', 'click', b => { const k = b.dataset.k; if (busyLogin) return;
    if (k === 'del') pin = pin.slice(0, -1); else if (k === 'ok') return submit(); else if (pin.length < 4) pin += k;
    draw(); if (pin.length === 4) submit(); });
  async function submit() {
    if (pin.length < 4) return fail('Type your PIN.');
    busyLogin = true; draw();
    try {
      const r = await api('login', { user_id: who.user_id, pin, boot: 1 }, { timeout: 60000 });
      const boot = r.boot || (await api('bootstrap', {}, { timeout: 60000 }));
      await saveSession({ token: r.token, user: r.user }, boot);
      recent = [who.user_id].concat(recent.filter(x => x !== who.user_id)).slice(0, 5); await kput('recentUsers', recent); await kput('lastActive', Date.now());
      const keep = $('#keep', el); if (keep && !keep.checked) { await kput('os:temp', 1); try { sessionStorage.setItem('os:alive', '1'); } catch (e) {} } else await kdel('os:temp');
      toast('Welcome, ' + String(r.user.name || '').split(' ')[0]);
      window.dispatchEvent(new Event('os-login'));
    } catch (e) { fail(e.message); pin = ''; busyLogin = false; draw(); }
  }
  draw();
  if (navigator.onLine) try { const r = await api('loginList'); list = r.users; await kput('loginList', list); if (step === 'name' && ctx.alive()) { const q = $('#q', el), v = q ? q.value : ''; draw(); const q2 = $('#q', el); if (q2 && v) { q2.value = v; q2.oninput(); } } } catch (e) {}
} });
