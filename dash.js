/* Farmer ID Dashboard – the live dashboard (public page and the app share this file).
 * v7.3: 100-square grid, the climb since August, the last 30 days, Assar vs Kastigarh, a pop-up when a file lands. */
(function () {
  const CSS = `
.d7{--g:#1F5A3E;--lt:#7CC79A;--ink:#111816;--mute:#5F6B66;--line:#E3E8E5;--soft:#EDF0EE;--ok:#1E7A46;--late:#B3261E;--sf:#C27A12;--card:#fff;--c1:#B9DCC5;--c2:#6DB088;--c3:#1F5A3E;color:var(--ink);font-variant-numeric:tabular-nums}
@media (prefers-color-scheme:dark){body.pub{background:#0F1513!important;color:#E7ECE9}
  body.pub .d7{--ink:#E7ECE9;--mute:#9AA8A1;--line:#26302C;--soft:#1E2824;--card:#151D1A;--g:#7CC79A;--lt:#2E6A49;--c1:#1F4A34;--c2:#2F7D52;--c3:#7CC79A}
  body.pub .top{background:rgba(15,21,19,.92)!important;border-color:#26302C!important}body.pub .top .nm b{color:#7CC79A!important}body.pub .top .nm small,body.pub footer,body.pub .upd{color:#9AA8A1!important}
  body.pub .upd button{background:#151D1A!important;border-color:#26302C!important;color:#7CC79A!important}body.pub .d7-pop{background:#E7ECE9;color:#111816}}
.d7 *{box-sizing:border-box}
.d7-sum{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:baseline;margin:2px 0 14px;color:var(--mute);font-size:14px}.d7-sum b{color:var(--ink);font-weight:600}
.d7-cols{display:grid;grid-template-columns:1fr;gap:14px}
@media (min-width:760px),(orientation:landscape) and (min-width:560px){.d7-cols{grid-template-columns:1fr 1fr}}
.d7-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;min-width:0}
.d7-hd{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}.d7-hd h2{margin:0;font-size:17px;font-weight:600;letter-spacing:-.01em}
.d7-live{font-size:12.5px;color:var(--mute);display:inline-flex;align-items:center;gap:6px}
.d7-live i{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(30,122,70,.45);animation:d7p 2.4s infinite}.d7-live.off i{background:#9AA59F;animation:none}
@keyframes d7p{0%{box-shadow:0 0 0 0 rgba(30,122,70,.45)}70%{box-shadow:0 0 0 8px rgba(30,122,70,0)}100%{box-shadow:0 0 0 0 rgba(30,122,70,0)}}
.d7-hero{display:flex;gap:18px;align-items:center;margin-top:14px}.d7-hero svg{flex:none;width:clamp(116px,32vw,140px);height:auto}
.d7-pct{font-size:clamp(42px,6vw,54px);font-weight:600;line-height:1;letter-spacing:-.03em}.d7-pct small{font-size:.38em;font-weight:500;color:var(--mute);margin-left:2px}
.d7-of{font-size:13.5px;color:var(--mute);margin-top:6px;line-height:1.5}.d7-of b{color:var(--ink);font-weight:600}
.d7-leg{display:flex;gap:12px;flex-wrap:wrap;font-size:11.5px;color:var(--mute);margin-top:8px}.d7-leg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px}
.d7-row{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-top:1px solid var(--line);margin-top:16px;padding-top:12px}
.d7-k{font-size:11.5px;color:var(--mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600}
.d7-sec{font-size:11.5px;color:var(--mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin:18px 0 8px}
.d7-today{font-size:28px;font-weight:600;letter-spacing:-.02em;margin-top:2px}.d7-today span{font-size:14px;color:var(--mute);font-weight:500}
.d7-hb{display:flex;align-items:flex-end;gap:4px;height:42px}.d7-hb i{width:11px;border-radius:3px 3px 1px 1px;background:var(--g);min-height:3px}.d7-hb i.z{background:var(--soft)}
.d7-climb svg{display:block;width:100%;height:auto}
.d7-cal{display:grid;grid-template-columns:repeat(15,1fr);gap:4px}.d7-cal span{aspect-ratio:1;border-radius:3px;background:var(--soft)}
.d7-cal .a{background:var(--c1)}.d7-cal .b{background:var(--c2)}.d7-cal .c{background:var(--c3)}.d7-cal .t{background:transparent;outline:1.5px solid var(--g);outline-offset:-1.5px}
.d7-cl{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mute);margin-top:6px}
.d7-tp{display:flex;justify-content:space-between;gap:10px;padding:4px 0;font-size:14px}.d7-tp span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.d7-tp em{font-style:normal;color:var(--mute);font-size:12.5px;margin-left:6px}.d7-tp b{font-weight:600}
.d7-camps{display:flex;flex-wrap:wrap;gap:6px}.d7-camps span{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-size:12.5px;color:var(--mute)}
.d7-down{background:#FDF0EE;color:var(--late);border-radius:8px;padding:6px 10px;font-size:13px;margin-top:10px}
.d7-fc{font-size:13px;color:var(--mute);margin-top:8px}
.d7-more{margin-top:4px}.d7-more summary{list-style:none;cursor:pointer;font-size:13px;color:var(--g);font-weight:500;padding:12px 0 0;border-top:1px solid var(--line);margin-top:16px}.d7-more summary::-webkit-details-marker{display:none}
@media (min-width:600px){.d7-more summary{display:none}}
.d7-race{margin-top:14px}.d7-rg{display:grid;grid-template-columns:1fr;gap:6px 28px;margin-top:6px}@media (min-width:760px){.d7-rg{grid-template-columns:1fr 1fr}}
.d7-rr{display:grid;grid-template-columns:84px 1fr 56px;gap:10px;align-items:center;font-size:14px;margin:6px 0}.d7-rr s{height:10px;border-radius:5px;background:var(--soft);position:relative;text-decoration:none;overflow:hidden}
.d7-rr s i{position:absolute;left:0;top:0;bottom:0;border-radius:5px;width:0;transition:width 1.2s cubic-bezier(.2,.8,.2,1)}.d7-rr b{font-weight:600;text-align:right}
.d7-pop{position:fixed;top:76px;left:50%;transform:translate(-50%,-14px);opacity:0;background:#111816;color:#fff;border-radius:999px;padding:10px 18px;display:flex;gap:10px;align-items:center;white-space:nowrap;box-shadow:0 12px 32px rgba(17,24,22,.28);font-size:14px;z-index:200;transition:opacity .35s,transform .35s;pointer-events:none;font-family:inherit}
.d7-pop.on{opacity:1;transform:translate(-50%,0)}.d7-pop i{width:8px;height:8px;border-radius:50%;background:#7CC79A;box-shadow:0 0 0 5px rgba(124,199,154,.22)}
.d7-vt{width:100%;border-collapse:collapse;margin-top:14px;font-size:13.5px}
.d7-vt th{text-align:left;font-size:11.5px;font-weight:600;color:var(--mute);letter-spacing:.03em;text-transform:uppercase;padding:6px;border-bottom:1px solid var(--line)}
.d7-vt td{padding:8px 6px;border-bottom:1px solid var(--line)}.d7-vt tr.tap{cursor:pointer}
.d7-vt .vb{display:flex;align-items:center;gap:8px}.d7-vt .vb s{flex:1;max-width:120px;height:5px;border-radius:3px;background:var(--soft);position:relative;text-decoration:none}.d7-vt .vb s i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--g)}
.d7-st{font-size:12px;font-weight:500;border-radius:6px;padding:2px 7px}.d7-st.late{background:#FDF0EE;color:var(--late)}.d7-st.ok{background:#EAF5EE;color:var(--ok)}.d7-st.due{background:#FFF6E8;color:#B26A00}.d7-st.mute{background:var(--soft);color:var(--mute)}.d7-st.done{background:var(--g);color:#fff}
.d7-final{border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:14px;background:var(--card)}.d7-final h2{margin:0 0 4px;font-size:18px}
@media (prefers-reduced-motion:reduce){.d7-live i{animation:none}.d7-rr s i,.d7-pop{transition:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-IN');
  const nr = n => { const x = Math.round(Number(n || 0) * 10) / 10; return Number.isInteger(x) ? String(x) : x.toFixed(1); };
  const t12 = ts => { if (!ts) return ''; const h = Number(String(ts).slice(11, 13)), m = String(ts).slice(14, 16); return ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM'); };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dlong = d => { if (!d) return ''; const x = new Date(d + 'T12:00:00Z'); return x.getUTCDate() + ' ' + MON[x.getUTCMonth()]; };
  const addD = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  const daysB = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 86400000);
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const STW = { ok: 'Met', late: 'Behind', due: 'On pace', mute: '–', done: 'Done' };

  /* 100 squares, one per cent: done, made today, left; staff also see where we should be today */
  function waffle(t, d, o) {
    const p = t.total ? t.made * 100 / t.total : 0, td = t.total ? t.today * 100 / t.total : 0, full = Math.floor(p), done = Math.max(0, Math.floor(p - td)), exp = o.staff && !d.closed ? Math.floor(d.expected_pct || 0) : 0;
    let h = '';
    for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), c = i % 10, x = c * 15 + .6, y = (9 - r) * 15 + .6;
      const cls = i < done ? 'var(--g)' : i < full ? 'var(--lt)' : 'var(--soft)', mk = i >= full && i < exp ? ' stroke="var(--sf)" stroke-width="1.2" stroke-dasharray="2 2"' : '';
      h += `<rect x="${x}" y="${y}" width="12.3" height="12.3" rx="2.6" style="fill:${cls}"${mk}/>`; }
    return `<svg viewBox="0 0 150 150" role="img" aria-label="${p.toFixed(1)}% done">${h}</svg>`;
  }
  /* cumulative IDs since the start; staff: the dashed line from today to 100% at the deadline */
  function climb(t, d, o) {
    const ser = t.days && t.days.n && t.days.n.length ? t.days.n : null; if (!ser || ser.length < 3) return '';
    const W = 460, H = 132, L = 8, R = W - 8, top = 14, bot = 108, sum = ser.reduce((a, b) => a + b, 0), base = Math.max(0, t.made - sum);
    const staffEnd = o.staff && !d.closed && d.deadline && d.deadline > d.today ? daysB(t.days.from, d.deadline) : ser.length - 1;
    const span = Math.max(ser.length - 1, staffEnd), X = i => L + (R - L) * i / Math.max(1, span), Y = v => bot - (bot - top) * Math.min(1, v / Math.max(1, t.total));
    let cum = base; const k = (base + sum) > 0 ? t.made / (base + sum) : 1; const pts = ser.map((n, i) => { cum += n; return [X(i), Y(cum * k)]; });
    const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '), last = pts[pts.length - 1], gid = 'cg' + esc(t.tehsil_id);
    return `<div class="d7-climb"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--g)" stop-opacity=".26"/><stop offset="1" style="stop-color:var(--g)" stop-opacity="0"/></linearGradient></defs>
      <g style="stroke:var(--line)"><line x1="${L}" y1="${top}" x2="${R}" y2="${top}"/><line x1="${L}" y1="${(top + bot) / 2}" x2="${R}" y2="${(top + bot) / 2}"/><line x1="${L}" y1="${bot}" x2="${R}" y2="${bot}"/></g>
      <text x="${R}" y="${top - 4}" text-anchor="end" font-size="9.5" style="fill:var(--mute)">100%</text><text x="${R}" y="${(top + bot) / 2 - 4}" text-anchor="end" font-size="9.5" style="fill:var(--mute)">50%</text>
      <path d="${path} L${last[0]} ${bot} L${L} ${bot} Z" fill="url(#${gid})"/><path d="${path}" fill="none" style="stroke:var(--g)" stroke-width="2.2" stroke-linejoin="round"/>
      ${staffEnd > ser.length - 1 ? `<path d="M${last[0]} ${last[1]} L${R} ${top}" style="stroke:var(--sf)" stroke-width="1.4" stroke-dasharray="4 4"/><text x="${R - 2}" y="${top + 13}" text-anchor="end" font-size="9.5" style="fill:var(--sf)">pace to 100% by ${esc(dlong(d.deadline))}</text>` : ''}
      <circle cx="${last[0]}" cy="${last[1]}" r="9" style="fill:var(--g)" opacity=".18"/><circle cx="${last[0]}" cy="${last[1]}" r="4" style="fill:var(--g)"/>
      <text x="${L}" y="${H - 6}" font-size="9.5" style="fill:var(--mute)">${esc(dlong(t.days.from))}</text><text x="${last[0]}" y="${H - 6}" text-anchor="${last[0] > R - 30 ? 'end' : 'middle'}" font-size="9.5" style="fill:var(--mute)">today</text></svg></div>`;
  }
  function cal(t) {
    const ser = t.days && t.days.n ? t.days.n.slice(-30) : []; if (ser.length < 2) return '';
    const mx = Math.max(1, ...ser.slice(0, -1), ser[ser.length - 1]), pad = 30 - ser.length;
    return `<div class="d7-cal">${Array(pad).fill('<span></span>').join('')}${ser.map((n, i) => { const last = i === ser.length - 1, c = n === 0 ? '' : n / mx < .34 ? 'a' : n / mx < .67 ? 'b' : 'c';
      return `<span class="${last ? 't' : c}" title="${n} IDs"></span>`; }).join('')}</div><div class="d7-cl"><span>30 days ago</span><span>today</span></div>`;
  }
  function hourBars(t) {
    const by = {}; (t.uploads || []).forEach(u => { const h = Math.max(9, Math.min(18, Number(String(u.at).slice(11, 13)))); by[h] = (by[h] || 0) + u.n; });
    const hrs = [10, 11, 12, 13, 14, 15, 16, 17], mx = Math.max(1, ...hrs.map(h => by[h] || 0));
    if (Object.keys(by).length < 2) return '';
    return `<div class="d7-hb">${hrs.map(h => `<i class="${by[h] ? '' : 'z'}" style="height:${by[h] ? Math.max(4, Math.round(by[h] * 40 / mx)) : 3}px" title="${(h % 12) || 12}: ${by[h] || 0}"></i>`).join('')}</div>`;
  }
  function villageRows(t, o) {
    const rank = { late: 0, due: 1, ok: 3, mute: 2, done: 4 };
    const vs = t.villages.map(v => Object.assign({}, v, { s: v.made >= v.total && v.total ? 'done' : v.cls || 'mute' })).sort((a, b) => rank[a.s] - rank[b.s] || a.made / a.total - b.made / b.total);
    return `<table class="d7-vt"><thead><tr><th>Village</th><th>Till date</th><th>Today</th><th></th></tr></thead><tbody>${vs.map(v => { const p = Math.round(v.made * 1000 / Math.max(1, v.total)) / 10;
      return `<tr class="${o.onVillage ? 'tap' : ''}" data-v="${esc(v.village_id)}"><td>${esc(v.name)}</td><td><span class="vb"><s><i style="width:${Math.min(100, p)}%"></i></s>${p}%</span></td><td>${v.target ? `${fmt(v.today)} / ${fmt(v.target)}` : v.today ? fmt(v.today) : '–'}</td><td><span class="d7-st ${v.s}">${STW[v.s]}</span></td></tr>`; }).join('')}</tbody></table>`;
  }
  function panel(d, t, o) {
    const p = t.total ? Math.round(t.made * 1000 / t.total) / 10 : 0, key = 'd7p:' + t.tehsil_id, fc = o.forecast && o.forecast[t.tehsil_id];
    const extra = `${!d.closed && (t.top2 || []).length ? `<div class="d7-sec">Top today</div>${t.top2.map((x, i) => `<div class="d7-tp"><span>${i + 1}. ${esc(x.name)}<em>${esc(x.designation || '')}${(x.villages || []).length ? ' · ' + esc(x.villages.join(', ')) : ''}</em></span><b>${nr(x.today)}</b></div>`).join('')}` : ''}
      ${!d.closed && !o.staff && (t.camps || []).length ? `<div class="d7-sec">Camps today</div><div class="d7-camps">${t.camps.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}`;
    const c30 = cal(t);
    return `<section class="d7-card" id="d7-${esc(t.tehsil_id)}">
      <div class="d7-hd"><h2>${esc(t.name)}</h2><span class="d7-live ${t.as_on ? '' : 'off'}"><i></i>${t.as_on ? 'Live · ' + esc(t12(t.as_on)) : 'No portal file yet today'}</span></div>
      <div class="d7-hero">${waffle(t, d, o)}<div><div class="d7-pct"><span data-to="${p}" data-k="${key}">${p}</span><small>%</small></div>
        <div class="d7-of"><b>${fmt(t.made)}</b> of ${fmt(t.total)} farmers<br>have a Farmer ID</div>
        <div class="d7-leg"><span><i style="background:var(--g)"></i>done</span><span><i style="background:var(--lt)"></i>today</span>${o.staff && !d.closed ? '<span><i style="border:1.2px dashed var(--sf)"></i>should be</span>' : ''}</div></div></div>
      ${d.closed ? '' : `<div class="d7-row"><div><div class="d7-k">Today</div><div class="d7-today">${fmt(t.today)} <span>/ ${fmt(t.target)}</span></div></div>${hourBars(t)}</div>`}
      ${t.down ? '<div class="d7-down">Portal down: figures as of the last file</div>' : ''}
      ${climb(t, d, o) ? `<div class="d7-sec">The climb since ${esc(dlong(t.days.from))}</div>${climb(t, d, o)}` : ''}
      ${fc && !d.closed ? `<div class="d7-fc">At the last 7 days’ pace: about ${fmt(fc.expected)} (${fc.total ? Math.round(fc.expected * 100 / fc.total) : 0}%) by ${esc(dlong(d.deadline))}.</div>` : ''}
      <details class="d7-more"${o.wide ? ' open' : ''}><summary>Last 30 days and top today</summary><div>${c30 ? `<div class="d7-sec">Last 30 days</div>${c30}` : ''}${extra}</div></details>
      ${o.staff && !o.noVill && (t.villages || []).length ? villageRows(t, o) : ''}
    </section>`;
  }
  function race(d, ts) {
    if (ts.length !== 2 || d.closed) return '';
    const [a, b] = ts, mx = Math.max(1, a.today, b.today), lead = a.today === b.today ? 'Level today' : (a.today > b.today ? a.name : b.name) + ' leads by ' + fmt(Math.abs(a.today - b.today)) + ' today';
    const pc = t => t.total ? Math.round(t.made * 1000 / t.total) / 10 : 0;
    const row = (t, w, v, i) => `<div class="d7-rr"><span>${esc(t.name)}</span><s><i data-w="${w}" style="background:${i ? 'var(--lt)' : 'var(--g)'}"></i></s><b>${v}</b></div>`;
    return `<section class="d7-card d7-race"><div class="d7-hd"><h2>${esc(a.name)} vs ${esc(b.name)}</h2><span class="d7-live" style="font-size:13px">${esc(lead)}</span></div>
      <div class="d7-rg"><div><div class="d7-sec" style="margin-top:6px">Today</div>${row(a, a.today * 100 / mx, fmt(a.today), 0)}${row(b, b.today * 100 / mx, fmt(b.today), 1)}</div>
      <div><div class="d7-sec" style="margin-top:6px">Till date</div>${row(a, pc(a), pc(a) + '%', 0)}${row(b, pc(b), pc(b) + '%', 1)}</div></div></section>`;
  }
  function countUp(root) {
    root.querySelectorAll('[data-to]').forEach(el => { const to = Number(el.dataset.to), from = Math.min(to, Number(ls.get(el.dataset.k) || 0)); ls.set(el.dataset.k, to);
      const fx = v => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');
      if (from === to || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) { el.textContent = fx(to); return; }
      const t0 = performance.now(), dur = 900; const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = fx(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  }
  /* a new file: "+41 Farmer IDs in Assar just now" */
  function pop(d, ts) {
    const msgs = [];
    ts.forEach(t => { const k = 'd7n:' + t.tehsil_id, prev = ls.get(k), now = d.today + '|' + t.today; ls.set(k, now);
      if (!prev) return; const [pd, pn] = prev.split('|'); if (pd === d.today && t.today > Number(pn)) msgs.push(`+${fmt(t.today - Number(pn))} Farmer IDs in ${t.name} just now`); });
    if (!msgs.length) return;
    let el = document.getElementById('d7pop'); if (!el) { el = document.createElement('div'); el.id = 'd7pop'; el.className = 'd7-pop'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.innerHTML = `<i></i>${esc(msgs.join(' · '))}`; el.classList.add('on'); clearTimeout(pop._t); pop._t = setTimeout(() => el.classList.remove('on'), 4500);
  }
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { const w = innerWidth >= 600; document.querySelectorAll('.d7-more').forEach(e => { if (w) e.open = true; }); }, 150); });
  window.DASH = {
    render(root, d, o) {
      o = o || {};
      if (!d || !d.tehsils) { root.innerHTML = '<div class="d7"><div class="d7-cols"><div class="d7-card" style="height:300px"></div><div class="d7-card" style="height:300px"></div></div></div>'; return; }
      if (o.order) { const ix = id => { const i = o.order.indexOf(id); return i < 0 ? 99 : i; }; d.tehsils.sort((a, b) => ix(a.tehsil_id) - ix(b.tehsil_id)); }
      o.wide = (root.clientWidth || innerWidth) >= 600 || innerWidth >= 600;
      const ts = d.tehsils.filter(t => !o.only || o.only.indexOf(t.tehsil_id) >= 0), tot = ts.reduce((a, t) => a + t.total, 0), made = ts.reduce((a, t) => a + t.made, 0), td = ts.reduce((a, t) => a + t.today, 0);
      root.innerHTML = `<div class="d7">${d.closed ? `<div class="d7-final"><h2>Final position</h2><span class="d7-of">${fmt(made)} of ${fmt(tot)} farmers have a Farmer ID.</span></div>` : o.noSum ? '' : `<div class="d7-sum"><span>Today <b>${fmt(td)}</b> Farmer IDs</span><span>Till date <b>${fmt(made)}</b> of ${fmt(tot)} (${tot ? Math.round(made * 1000 / tot) / 10 : 0}%)</span></div>`}
        <div class="d7-cols">${ts.map(t => panel(d, t, o)).join('')}</div>${o.noRace ? '' : race(d, ts)}</div>`;
      countUp(root); if (!o.noPop) pop(d, ts);
      requestAnimationFrame(() => setTimeout(() => root.querySelectorAll('.d7-rr i[data-w]').forEach(e => e.style.width = Math.min(100, Number(e.dataset.w)) + '%'), 60));
      if (o.onVillage) root.querySelectorAll('tr.tap[data-v]').forEach(b => b.onclick = () => o.onVillage(b.dataset.v));
    },
    t12
  };
})();
