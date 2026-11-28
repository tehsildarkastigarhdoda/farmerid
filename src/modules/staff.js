/* Staff & logins (frozen mockups U1–U4, 28.11.2026): list · person · PIN reset done · add a person. */
import { $, esc, on, initials, ago, N } from '../core/dom.js';
import { svg, toast, fail, busy, pill, sk, openSheet, closeSheet } from '../core/ui.js';
import { api } from '../core/api.js';
import { me, role } from '../core/session.js';
import { register, go, current, back, redraw } from '../core/router.js';
import { VERSION } from '../core/config.js';

let D = null, at = 0;
const load = async f => { if (!f && D && Date.now() - at < 60000) return D; D = await api('staff30', {}, { timeout: 60000 }); at = Date.now(); return D; };
const OFFICE = u => ['ADMIN', 'DA', 'NT'].indexOf(u.role) >= 0 || /\b(OQ|BCG|GQ)\b/.test(u.designation || '');
const PATWARI = u => /patwari/i.test(u.designation || '');
const tone = u => OFFICE(u) ? ['#EAF0F8', '#2F5D9E'] : PATWARI(u) ? ['#F0EEF7', '#5B4B8A'] : ['#FFF4E0', '#8A5300'];
const roleTag = u => u.role === 'ADMIN' ? pill('Admin', 'g') : u.role === 'DA' ? pill('DA', 'b') : u.role === 'NT' ? pill('NT', 'b') : u.role === 'COMP' ? pill('Operator', '') : '';
const vnum = v => String(v || '0').split('.').reduce((a, x) => a * 1000 + (Number(x) || 0), 0);
const tname = id => ((D && D.tehsils) || []).find(t => t.tehsil_id === id) || { name: '' };
const mob = m => m ? String(m).replace(/^(\d{5})(\d{5})$/, '$1 $2') : '';
const daysSince = s => s ? Math.round((Date.now() - new Date(String(s).slice(0, 10) + 'T00:00:00Z')) / 864e5) : 999;
function sub(u) { const seen = u.seen_at ? 'seen ' + ago(u.seen_at) : 'never logged in';
  return [u.designation, (u.tehsils || []).map(t => tname(t).name).filter(Boolean).join(' + ') || tname(u.tehsil_id).name, u.active === 'Y' ? seen : 'switched off'].filter(Boolean).join(' · '); }
function badge(u) {
  if (u.active !== 'Y') return pill('Off', '');
  if (!u.seen_at) return pill('Never logged in', 'a');
  const d = daysSince(u.seen_at); if (d >= 3) return pill('Not seen ' + d + ' d', 'a');
  if (u.app_v && vnum(u.app_v) < vnum('12.9.0')) return pill('Old app ' + u.app_v, 'r');
  return roleTag(u);
}
const row = u => { const c = tone(u); return `<button class="pr${u.active === 'Y' ? '' : ' off'}" data-u="${esc(u.user_id)}"><span class="av" style="background:${c[0]};color:${c[1]}">${esc(initials(u.name))}</span><span class="nm"><b>${esc(u.name)}</b><small>${esc(sub(u))}</small></span>${badge(u)}</button>`; };

register('os-staff', { title: 'Staff & logins', async render(el, a, ctx) {
  const st = a.st || (a.st = { f: 'all', q: '' });
  const draw = () => {
    if (!ctx.alive()) return;
    if (!D) { el.innerHTML = `<div class="pg nr">${sk(24, '50%')}<div style="height:16px"></div><div class="cd">${sk(14)}<div style="height:14px"></div>${sk(14, '80%')}<div style="height:14px"></div>${sk(14, '60%')}</div></div>`; return; }
    const U = D.users, q = st.q.toLowerCase();
    const F = { all: u => u.active === 'Y', office: OFFICE, ph: PATWARI, field: u => !OFFICE(u) && !PATWARI(u), off: u => u.active !== 'Y' };
    const L = U.filter(u => (st.f === 'off' ? u.active !== 'Y' : st.f === 'pins' ? false : u.active === 'Y' && F[st.f](u)) && (!q || (u.name + ' ' + u.designation + ' ' + (u.mobile || '')).toLowerCase().indexOf(q) >= 0));
    const n = k => U.filter(u => k === 'off' ? u.active !== 'Y' : u.active === 'Y' && F[k](u)).length;
    const groups = [['Office', L.filter(OFFICE)], ['Patwaris', L.filter(u => !OFFICE(u) && PATWARI(u))], ['Field staff', L.filter(u => !OFFICE(u) && !PATWARI(u))]].filter(g => g[1].length);
    const sort = A => A.slice().sort((x, y) => (x.active === y.active ? 0 : x.active === 'Y' ? -1 : 1) || String(x.name).localeCompare(y.name));
    el.innerHTML = `<div class="pg nr st30"><div class="sub">TehsilOS · ${esc(D.tehsils.map(t => t.name).join(' and '))}</div><h1 class="t">Staff &amp; logins</h1>
      <div class="r2"><button class="btn" id="add">${svg('plus', 18)}Add a person</button><button class="btn o" id="inv">${svg('wa', 18)}WhatsApp invite</button></div>
      <label class="srch">${svg('search', 18)}<input id="q" placeholder="Search name, post, mobile" value="${esc(st.q)}" aria-label="Search"></label>
      <div class="chips">${[['all', 'All'], ['office', 'Office'], ['ph', 'Patwaris'], ['field', 'Field'], ['off', 'Switched off']].map(x => `<button data-f="${x[0]}" class="${st.f === x[0] ? 'on' : ''}">${x[1]} · ${n(x[0])}</button>`).join('')}${D.pins.length ? `<button data-f="pins" class="${st.f === 'pins' ? 'on' : ''}">PIN requests · ${D.pins.length}</button>` : ''}</div>
      ${D.pins.length && (st.f === 'all' || st.f === 'pins') ? `<div class="hd2">PIN requests <span>${D.pins.length}</span></div><div class="cd pl0">${D.pins.map(p => `<div class="pr"><span class="av">${esc(initials(p.name))}</span><span class="nm"><b>${esc(p.name)}</b><small>${esc(p.designation)} · asked ${esc(ago(p.at))}</small></span><button class="btn s" data-ap="${esc(p.req_id)}">Approve</button></div>`).join('')}</div>` : ''}
      ${st.f === 'pins' ? '' : groups.map(g => `<div class="hd2">${g[0]} <span>${g[1].length}</span></div><div class="cd pl0">${sort(g[1]).map(row).join('')}</div>`).join('') || '<p class="sub">Nobody matches.</p>'}
      <p class="ft">Nobody – not even the Tehsildar – can see a person's PIN. A reset sends it back to 1234 and he sets his own.</p></div>`;
    const qi = $('#q', el); qi.oninput = () => { st.q = qi.value; const p = qi.selectionStart; draw(); const q2 = $('#q', el); q2.focus(); try { q2.setSelectionRange(p, p); } catch (e) {} };
  };
  if (!el.dataset.w) { el.dataset.w = 1;
    on(el, '[data-f]', 'click', b => { const s = current().args.st; s.f = b.dataset.f; draw(); });
    on(el, '[data-u]', 'click', b => go('os-person', { id: b.dataset.u }));
    on(el, '#add', 'click', () => go('os-person', { id: '' }));
    on(el, '#inv', 'click', () => wa(`TehsilOS – Tehsil Kastigarh\nOpen: https://tehsildarkastigarhdoda.github.io/farmerid/app.html\nLog in with your first name. First PIN: 1234 – then set your own 4-digit PIN.`));
    on(el, '[data-ap]', 'click', b => busy(b, 'Approving', async () => { const r = await api('pinApprove', { req_id: b.dataset.ap }, { write: 1 }); await load(true); draw(); resetDone(r, true); })); }
  draw(); try { await load(a.fresh); a.fresh = 0; draw(); } catch (e) { if (!D) el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; else fail(e.message); }
}, refresh() { at = 0; const c = current(); if (c) c.args.fresh = 1; return redraw(); } });

function wa(t) { const u = 'https://wa.me/?text=' + encodeURIComponent(t); window.open(u, '_blank', 'noopener'); }
function resetDone(r, approved) {
  const msg = `Namaste ${r.name} ji. Your TehsilOS PIN has been reset. Log in with your first name and PIN 1234, then set your own 4-digit PIN.\nhttps://tehsildarkastigarhdoda.github.io/farmerid/app.html`;
  openSheet(`<div class="dn"><span class="ok">${svg('check', 34)}</span><h2>PIN reset</h2><p>${esc(r.name)} logs in with <b>1234</b> and sets his own 4-digit PIN.<br>He has been logged out on every phone.</p>
    <div class="note">Nobody – not even the Tehsildar – can see a person's PIN. A reset is the only way.</div>
    ${r.mobile ? `<a class="btn g w" href="https://wa.me/91${esc(String(r.mobile).slice(-10))}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${svg('wa', 18)}Send him the message on WhatsApp</a>` : `<button class="btn g w" data-wa>${svg('wa', 18)}Share the message on WhatsApp</button>`}
    <button class="btn o w" data-x>Done</button></div>`, p => { on(p, '[data-x]', 'click', () => closeSheet()); on(p, '[data-wa]', 'click', () => wa(msg)); });
}

register('os-person', { title: a => a.id ? 'Person' : 'Add a person', form: true, async render(el, a, ctx) {
  if (!D) { el.innerHTML = `<div class="pg nr">${sk(24, '50%')}</div>`; try { await load(); } catch (e) { el.innerHTML = `<div class="pg nr"><div class="cd er">${esc(e.message)}</div></div>`; return; } }
  if (!ctx.alive()) return;
  const u = a.id ? D.users.find(x => x.user_id === a.id) : null; if (a.id && !u) { el.innerHTML = '<div class="pg nr"><div class="cd">This login is not in the list any more.</div></div>'; return; }
  const F = Object.assign({ name: '', designation: 'Patwari', mobile: '', tehsil_id: (me().tehsils || [])[0] || me().tehsil_id || (D.tehsils[0] || {}).tehsil_id, active: 'Y' }, u ? { name: u.name, designation: u.designation, mobile: u.mobile || '', tehsil_id: u.tehsil_id, active: u.active } : {});
  const isMe = u && u.user_id === D.me, adm = role() === 'ADMIN';
  const opts = D.designations.concat(D.designations.indexOf(F.designation) < 0 && F.designation ? [F.designation] : []);
  el.innerHTML = `<div class="pg nr st30"><div class="sub">Staff &amp; logins</div><h1 class="t">${u ? esc(u.name) : 'Add a person'}</h1>
    ${u ? `<div class="cd st3"><div><span>Last seen</span><b>${esc(u.seen_at ? ago(u.seen_at) : 'never')}</b></div><div><span>App</span><b>${esc(u.app_v || '–')}</b></div><div><span>PIN</span><b>${u.pin_own ? 'Own PIN set' : 'Still 1234'}</b></div></div>` : ''}
    <label class="fld"><span>Name</span><input id="f_name" value="${esc(F.name)}" placeholder="First name and surname" autocapitalize="words"></label>
    <label class="fld"><span>Post</span><select id="f_des">${opts.map(d => `<option ${d === F.designation ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select></label>
    <p class="sub" style="margin:-6px 0 0">The post sets what he can do: Patwari → his halqa; BCG, OQ, GQ → office modules.</p>
    <div class="g2"><label class="fld"><span>Mobile</span><input id="f_mob" inputmode="numeric" maxlength="10" value="${esc(F.mobile)}" placeholder="10 digits"></label>
      <label class="fld"><span>Tehsil</span><select id="f_teh" ${adm ? '' : 'disabled'}>${D.tehsils.map(t => `<option value="${esc(t.tehsil_id)}" ${t.tehsil_id === F.tehsil_id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label></div>
    ${u ? `<div class="cd"><div class="tgr"><span><b>Login on</b><small>Switch off to stop his login at once</small></span><button class="tg ${F.active === 'Y' ? 'on' : ''}" id="f_on" role="switch" aria-checked="${F.active === 'Y'}" aria-label="Login on" ${isMe ? 'disabled' : ''}></button></div></div>
      ${isMe ? '' : `<div class="cd pl0 acts3"><button data-act="reset"><b>Reset PIN</b><span>Back to 1234 · logs him out</span></button><button data-act="out"><b>Log him out everywhere</b><span>${u.logins ? u.logins + ' phone' + (u.logins > 1 ? 's' : '') + ' / computer' + (u.logins > 1 ? 's' : '') : 'No live login'}</span></button><button data-act="del" class="r"><b>Delete this person</b><span>Kept in the records as deleted</span></button></div>`}`
      : `<div class="note g">He logs in with his first name and PIN 1234, then sets his own PIN.</div>`}
    <div class="sv"><button class="btn w" id="sv">${u ? 'Save changes' : 'Add and send WhatsApp invite'}</button></div></div>`;
  const tg = $('#f_on', el); if (tg) tg.onclick = () => { F.active = F.active === 'Y' ? 'N' : 'Y'; tg.classList.toggle('on', F.active === 'Y'); tg.setAttribute('aria-checked', F.active === 'Y'); };
  $('#sv', el).onclick = e => busy(e.currentTarget, 'Saving', async () => {
    const req = { user_id: u ? u.user_id : undefined, name: $('#f_name', el).value.trim(), designation: $('#f_des', el).value, mobile: $('#f_mob', el).value.replace(/\D/g, ''), tehsil_id: $('#f_teh', el).value, active: F.active };
    if (!req.name) throw new Error('Write the name.'); if (req.mobile && req.mobile.length !== 10) throw new Error('Mobile must be 10 digits.');
    if (u && u.role === 'NT' && u.tehsils) req.tehsils = (u.tehsils || []).join(',');
    const r = await api('saveUser', req, { write: 1 }); await load(true); toast(u ? 'Saved' : 'Added');
    if (!u) wa(`Namaste ${r.user.name} ji. You are added to TehsilOS, Tehsil Kastigarh.\nOpen: https://tehsildarkastigarhdoda.github.io/farmerid/app.html\nLog in with your first name and PIN 1234, then set your own 4-digit PIN.`);
    back();
  });
  on(el, '[data-act]', 'click', b => { const k = b.dataset.act;
    if (k === 'reset') { if (!confirm(`Reset ${u.name}'s PIN to 1234? He will be logged out on every phone.`)) return; busy(b, 'Resetting', async () => { const r = await api('resetPin', { user_id: u.user_id }, { write: 1 }); await load(true); resetDone(r); }); }
    if (k === 'out') { if (!confirm(`Log ${u.name} out of every phone and computer?`)) return; busy(b, 'Logging out', async () => { const r = await api('logoutAll30', { user_id: u.user_id }, { write: 1 }); await load(true); toast(r.n ? 'Logged out of ' + r.n : 'No live login'); }); }
    if (k === 'del') { if (!confirm(`Delete ${u.name}? He can no longer log in. His past work stays in the records.`)) return; busy(b, 'Deleting', async () => { await api('deleteUser', { user_id: u.user_id }, { write: 1 }); await load(true); toast('Deleted'); back(); }); } });
} });

register('os-pin', { title: 'Change my PIN', form: true, render(el, a) {
  const must = me() && me().must_change_pin;
  el.innerHTML = `<div class="pg nr st30"><div class="sub">${must ? 'First log-in' : 'My settings'}</div><h1 class="t">${must ? 'Set your own PIN' : 'Change my PIN'}</h1>
    <p class="sub" style="margin:0">4 digits that only you know. <span>Sirf aapko pata ho.</span></p>
    <label class="fld"><span>${must ? 'PIN you logged in with (1234)' : 'Current PIN'}</span><input id="p0" type="password" inputmode="numeric" maxlength="4" autocomplete="current-password"></label>
    <label class="fld"><span>New PIN (4 digits)</span><input id="p1" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password"></label>
    <label class="fld"><span>New PIN again</span><input id="p2" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password"></label>
    <div class="sv"><button class="btn w" id="sv">Save my PIN</button></div></div>`;
  $('#sv', el).onclick = e => busy(e.currentTarget, 'Saving', async () => {
    const c = $('#p0', el).value.trim(), p = $('#p1', el).value.trim(), p2 = $('#p2', el).value.trim();
    if (!/^\d{4}$/.test(p)) throw new Error('The new PIN must be 4 digits.'); if (p !== p2) throw new Error('The two new PINs are not the same.'); if (p === '1234' || /^(\d)\1{3}$/.test(p)) throw new Error('Choose a PIN that is not 1234 and not the same digit four times.');
    await api('changePin', { current: c, pin: p }, { write: 1 });
    const m = await import('../core/session.js'); m.S.session.user.must_change_pin = false; await m.saveSession(m.S.session); toast('PIN saved');
    window.dispatchEvent(new Event('os-login'));
  });
} });
