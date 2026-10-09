/* Farmer ID Dashboard – the live dashboard (public page and the app share this file). v7.3: quiet numbers, one pace bar. */
(function () {
  const CSS = `
.d7{--g:#1F5A3E;--ink:#111816;--mute:#5F6B66;--line:#E3E8E5;--soft:#EEF1EF;--ok:#1E7A46;--late:#B3261E;--sf:#C27A12;--card:#fff;color:var(--ink);font-variant-numeric:tabular-nums}
body.pub .d7{--card:#fff}
@media (prefers-color-scheme:dark){body.pub{background:#0F1513!important;color:#E7ECE9}body.pub .d7{--ink:#E7ECE9;--mute:#9AA8A1;--line:#26302C;--soft:#1C2522;--card:#151D1A;--g:#7CC79A}
  body.pub .top{background:rgba(15,21,19,.92)!important;border-color:#26302C!important}body.pub .top .nm b{color:#7CC79A!important}body.pub .top .nm small,body.pub footer,body.pub .upd{color:#9AA8A1!important}}
.d7 *{box-sizing:border-box}
.d7-sum{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:baseline;margin:2px 0 14px;color:var(--mute);font-size:14px}.d7-sum b{color:var(--ink);font-weight:600}
.d7-cols{display:grid;grid-template-columns:1fr;gap:14px}
@media (min-width:760px),(orientation:landscape) and (min-width:560px){.d7-cols{grid-template-columns:1fr 1fr}}
.d7-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px;min-width:0}
.d7-hd{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.d7-hd h2{margin:0;font-size:17px;font-weight:600;letter-spacing:-.01em}
.d7-live{font-size:12.5px;color:var(--mute);display:inline-flex;align-items:center;gap:6px}
.d7-live i{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(30,122,70,.45);animation:d7p 2.4s infinite}
.d7-live.off i{background:#9AA59F;animation:none}
@keyframes d7p{0%{box-shadow:0 0 0 0 rgba(30,122,70,.45)}70%{box-shadow:0 0 0 8px rgba(30,122,70,0)}100%{box-shadow:0 0 0 0 rgba(30,122,70,0)}}
.d7-pct{font-size:clamp(46px,7vw,64px);font-weight:600;line-height:1;letter-spacing:-.03em;margin:18px 0 4px}
.d7-pct small{font-size:.42em;font-weight:500;color:var(--mute);letter-spacing:0;margin-left:2px}
.d7-of{font-size:14px;color:var(--mute)}.d7-of b{color:var(--ink);font-weight:600}
.d7-pb{position:relative;height:8px;border-radius:4px;background:var(--soft);margin:14px 0 6px}
.d7-pb i{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--g);transition:width 1.1s cubic-bezier(.2,.8,.2,1)}
.d7-pb u{position:absolute;top:-5px;width:2px;height:18px;background:var(--ink);opacity:.55}
.d7-pbl{display:flex;justify-content:space-between;font-size:12px;color:var(--mute)}
.d7-row{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-top:1px solid var(--line);margin-top:16px;padding-top:14px}
.d7-k{font-size:12px;color:var(--mute);letter-spacing:.03em;text-transform:uppercase;font-weight:600}
.d7-today{font-size:28px;font-weight:600;letter-spacing:-.02em;margin-top:2px}.d7-today span{font-size:14px;color:var(--mute);font-weight:500}
.d7-hb{display:flex;align-items:flex-end;gap:4px;height:44px}.d7-hb i{width:12px;border-radius:3px 3px 1px 1px;background:var(--g);opacity:.85;min-height:2px}.d7-hb i.z{background:var(--soft);opacity:1}
.d7-hbl{font-size:11px;color:var(--mute);text-align:right;margin-top:3px}
.d7-fc{font-size:13px;color:var(--mute);margin-top:10px}
.d7-top{margin-top:14px;border-top:1px solid var(--line);padding-top:12px}
.d7-tp{display:flex;justify-content:space-between;gap:10px;padding:5px 0;font-size:14px}.d7-tp span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.d7-tp em{font-style:normal;color:var(--mute);font-size:12.5px;margin-left:6px}.d7-tp b{font-weight:600}
.d7-camps{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.d7-camps span{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-size:12.5px;color:var(--mute)}
.d7-down{background:#FDF0EE;color:var(--late);border-radius:8px;padding:6px 10px;font-size:13px;margin-top:10px}
.d7-vt{width:100%;border-collapse:collapse;margin-top:14px;font-size:13.5px}
.d7-vt th{text-align:left;font-size:11.5px;font-weight:600;color:var(--mute);letter-spacing:.03em;text-transform:uppercase;padding:6px 6px;border-bottom:1px solid var(--line)}
.d7-vt td{padding:8px 6px;border-bottom:1px solid var(--line);vertical-align:middle}.d7-vt tr.tap{cursor:pointer}.d7-vt tr.tap:hover td{background:var(--soft)}
.d7-vt .vb{display:flex;align-items:center;gap:8px}.d7-vt .vb s{flex:1;max-width:120px;height:5px;border-radius:3px;background:var(--soft);position:relative;text-decoration:none}.d7-vt .vb s i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--g)}
.d7-st{font-size:12px;font-weight:500;border-radius:6px;padding:2px 7px;white-space:nowrap}.d7-st.late{background:#FDF0EE;color:var(--late)}.d7-st.ok{background:#EAF5EE;color:var(--ok)}.d7-st.due{background:#FFF6E8;color:#B26A00}.d7-st.mute{background:var(--soft);color:var(--mute)}.d7-st.done{background:var(--g);color:#fff}
.d7-final{border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:14px;background:var(--card)}.d7-final h2{margin:0 0 4px;font-size:18px}
@media (prefers-reduced-motion:reduce){.d7-live i{animation:none}.d7-pb i{transition:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-IN');
  const nr = n => { const x = Math.round(Number(n || 0) * 10) / 10; return Number.isInteger(x) ? String(x) : x.toFixed(1); };
  const t12 = ts => { if (!ts) return ''; const h = Number(String(ts).slice(11, 13)), m = String(ts).slice(14, 16); return ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM'); };
  const dlong = d => { if (!d) return ''; const x = new Date(d + 'T12:00:00Z'); return x.getUTCDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.getUTCMonth()]; };
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const STW = { ok: 'Met', late: 'Behind', due: 'On pace', mute: '–', done: 'Done' };

  function hourBars(t) {
    const by = {}; (t.uploads || []).forEach(u => { const h = Math.max(9, Math.min(18, Number(String(u.at).slice(11, 13)))); by[h] = (by[h] || 0) + u.n; });
    const hrs = [10, 11, 12, 13, 14, 15, 16, 17], mx = Math.max(1, ...hrs.map(h => by[h] || 0));
    if (Object.keys(by).length < 2) return '';
    return `<div><div class="d7-hb">${hrs.map(h => `<i class="${by[h] ? '' : 'z'}" style="height:${by[h] ? Math.max(4, Math.round(by[h] * 44 / mx)) : 3}px" title="${(h % 12) || 12}: ${by[h] || 0}"></i>`).join('')}</div><div class="d7-hbl">10 AM – 5 PM</div></div>`;
  }
  function villageRows(t, o) {
    const rank = { late: 0, due: 1, ok: 3, mute: 2, done: 4 };
    const vs = t.villages.map(v => Object.assign({}, v, { s: v.made >= v.total && v.total ? 'done' : v.cls || 'mute' })).sort((a, b) => rank[a.s] - rank[b.s] || a.made / a.total - b.made / b.total);
    return `<table class="d7-vt"><thead><tr><th>Village</th><th>Till date</th><th>Today</th><th></th></tr></thead><tbody>${vs.map(v => { const p = Math.round(v.made * 1000 / Math.max(1, v.total)) / 10;
      return `<tr class="${o.onVillage ? 'tap' : ''}" data-v="${esc(v.village_id)}"><td>${esc(v.name)}</td><td><span class="vb"><s><i style="width:${Math.min(100, p)}%"></i></s>${p}%</span></td><td>${v.target ? `${fmt(v.today)} / ${fmt(v.target)}` : v.today ? fmt(v.today) : '–'}</td><td><span class="d7-st ${v.s}">${STW[v.s]}</span></td></tr>`; }).join('')}</tbody></table>`;
  }
  function panel(d, t, o) {
    const exp = d.expected_pct || 0, key = 'd7p:' + t.tehsil_id, fc = o.forecast && o.forecast[t.tehsil_id];
    return `<section class="d7-card" id="d7-${esc(t.tehsil_id)}">
      <div class="d7-hd"><h2>${esc(t.name)}</h2><span class="d7-live ${t.as_on ? '' : 'off'}"><i></i>${t.as_on ? 'Live · ' + esc(t12(t.as_on)) : 'No portal file yet today'}</span></div>
      <div class="d7-pct"><span data-to="${t.pct}" data-k="${key}">${t.pct}</span><small>%</small></div>
      <div class="d7-of"><b>${fmt(t.made)}</b> of ${fmt(t.total)} farmers have a Farmer ID</div>
      <div class="d7-pb"><i style="width:${Math.min(100, t.pct)}%"></i>${o.staff && !d.closed && exp ? `<u style="left:${Math.min(100, exp)}%" title="Where we should be today"></u>` : ''}</div>
      ${o.staff && !d.closed && exp ? `<div class="d7-pbl"><span>${fmt(Math.max(0, t.total - t.made))} to go</span><span>│ should be ${exp}% today</span></div>` : `<div class="d7-pbl"><span>${fmt(Math.max(0, t.total - t.made))} to go</span><span></span></div>`}
      ${d.closed ? '' : `<div class="d7-row"><div><div class="d7-k">Today</div><div class="d7-today">${fmt(t.today)} <span>/ ${fmt(t.target)}</span></div></div>${hourBars(t)}</div>`}
      ${t.down ? '<div class="d7-down">Portal down: figures as of the last file</div>' : ''}
      ${fc && !d.closed ? `<div class="d7-fc">At the last 7 days’ pace: about ${fmt(fc.expected)} (${fc.total ? Math.round(fc.expected * 100 / fc.total) : 0}%) by ${esc(dlong(d.deadline))}.</div>` : ''}
      ${(t.top2 || []).length && !d.closed ? `<div class="d7-top"><div class="d7-k">Top today</div>${t.top2.map((x, i) => `<div class="d7-tp"><span>${i + 1}. ${esc(x.name)}<em>${esc(x.designation || '')}${(x.villages || []).length ? ' · ' + esc(x.villages.join(', ')) : ''}</em></span><b>${nr(x.today)}</b></div>`).join('')}</div>` : ''}
      ${(t.camps || []).length && !d.closed && !o.staff ? `<div class="d7-top"><div class="d7-k">Camps today</div><div class="d7-camps">${t.camps.map(c => `<span>${esc(c)}</span>`).join('')}</div></div>` : ''}
      ${o.staff && !o.noVill && (t.villages || []).length ? villageRows(t, o) : ''}
    </section>`;
  }
  function countUp(root) {
    root.querySelectorAll('[data-to]').forEach(el => { const to = Number(el.dataset.to), from = Math.min(to, Number(ls.get(el.dataset.k) || 0)); ls.set(el.dataset.k, to);
      const fx = v => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');
      if (from === to || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) { el.textContent = fx(to); return; }
      const t0 = performance.now(), dur = 900; const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = fx(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  }
  window.DASH = {
    render(root, d, o) {
      o = o || {};
      if (!d || !d.tehsils) { root.innerHTML = '<div class="d7"><div class="d7-cols"><div class="d7-card" style="height:260px"></div><div class="d7-card" style="height:260px"></div></div></div>'; return; }
      if (o.order) { const ix = id => { const i = o.order.indexOf(id); return i < 0 ? 99 : i; }; d.tehsils.sort((a, b) => ix(a.tehsil_id) - ix(b.tehsil_id)); }
      const ts = d.tehsils.filter(t => !o.only || o.only.indexOf(t.tehsil_id) >= 0), tot = ts.reduce((a, t) => a + t.total, 0), made = ts.reduce((a, t) => a + t.made, 0), td = ts.reduce((a, t) => a + t.today, 0);
      root.innerHTML = `<div class="d7">${d.closed ? `<div class="d7-final"><h2>Final position</h2><span class="d7-of">${fmt(made)} of ${fmt(tot)} farmers have a Farmer ID.</span></div>` : o.noSum ? '' : `<div class="d7-sum"><span>Today <b>${fmt(td)}</b> Farmer IDs</span><span>Till date <b>${fmt(made)}</b> of ${fmt(tot)} (${tot ? Math.round(made * 1000 / tot) / 10 : 0}%)</span></div>`}
        <div class="d7-cols">${ts.map(t => panel(d, t, o)).join('')}</div></div>`;
      countUp(root);
      if (o.onVillage) root.querySelectorAll('tr.tap[data-v]').forEach(b => b.onclick = () => o.onVillage(b.dataset.v));
    },
    t12
  };
})();
