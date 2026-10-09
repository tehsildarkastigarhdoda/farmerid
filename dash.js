/* Farmer ID Dashboard – the live dashboard (public page and the app's Home share this file). */
(function () {
  const CSS = `
.d7{--g:#1F5A3E;--g2:#123826;--sf:#E39B2D;--ok:#1E8A4C;--due:#B26A00;--late:#B42318;--mute:#55635B;--line:#E0E6E2;color:#16201B}
.d7 *{box-sizing:border-box}
.d7-story{font-size:clamp(17px,2.2vw,22px);line-height:1.45;font-weight:600;margin:4px 0 14px;color:#16201B}
.d7-story b{color:var(--g)}.d7-story .lead{display:block;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--sf);margin-bottom:4px}
.d7-card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 1px 3px rgba(22,32,27,.06);padding:14px 16px;min-width:0}
.d7-mtn{padding:0;overflow:hidden;background:linear-gradient(180deg,#EAF4FF 0%,#F6FBF7 70%)}
.d7-mtn svg{display:block;width:100%;height:auto}
.d7-mtn .cap{display:flex;gap:14px;flex-wrap:wrap;justify-content:space-between;padding:8px 16px 12px;font-size:13px;color:var(--mute)}
.d7-mtn .cap b{color:#16201B}
.d7-jump{display:none;gap:8px;margin:14px 0 0}.d7-jump a{flex:1;text-align:center;border:1.5px solid #CFDCD3;border-radius:12px;padding:8px;font-weight:800;color:var(--g);text-decoration:none;background:#fff}
.d7-cols{display:grid;grid-template-columns:1fr;gap:14px;margin-top:14px}
@media (min-width:760px),(orientation:landscape) and (min-width:560px){.d7-cols{grid-template-columns:1fr 1fr}}
@media (max-width:759px) and (orientation:portrait){.d7-jump{display:flex}}
.d7-t h2{margin:0;font-size:22px;color:var(--g);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.d7-live{font-size:12.5px;font-weight:700;color:var(--mute);display:inline-flex;align-items:center;gap:6px}
.d7-live i{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(30,138,76,.5);animation:d7p 2s infinite}
.d7-live.off i{background:#9AA59F;animation:none}
@keyframes d7p{0%{box-shadow:0 0 0 0 rgba(30,138,76,.5)}70%{box-shadow:0 0 0 9px rgba(30,138,76,0)}100%{box-shadow:0 0 0 0 rgba(30,138,76,0)}}
.d7-big{display:flex;align-items:baseline;gap:8px;margin:10px 0 2px}.d7-big b{font-size:clamp(44px,7vw,64px);line-height:1;font-weight:800;color:var(--g);font-variant-numeric:tabular-nums}
.d7-big span{font-size:16px;color:var(--mute);font-weight:600}
.d7-bar{height:12px;border-radius:6px;background:#E6EBE8;overflow:hidden;margin:6px 0 4px}.d7-bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#3C9461,#1F5A3E);transition:width 1s}
.d7-sub{font-size:13px;color:var(--mute)}
.d7-sec{font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin:16px 0 8px}
.d7-strip{display:flex;align-items:flex-end;gap:6px;height:86px;padding-top:6px;position:relative}
.d7-strip div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;position:relative}
.d7-strip div i{display:block;width:100%;max-width:34px;border-radius:6px 6px 2px 2px;background:var(--g);min-height:3px}
.d7-strip div.gh i{background:repeating-linear-gradient(45deg,#E6EBE8,#E6EBE8 4px,#F3F5F2 4px,#F3F5F2 8px)}
.d7-strip div em{font-style:normal;font-size:11px;font-weight:800;color:var(--g);margin-bottom:2px}
.d7-strip div small{font-size:10.5px;color:var(--mute);margin-top:3px}
.d7-strip .tg{position:absolute;left:0;right:0;border-top:2px dashed var(--sf);height:0}
.d7-pod{display:flex;gap:10px;align-items:flex-end}
.d7-pod div{flex:1;border-radius:14px;padding:10px 12px;background:#FFF8E6;border:1px solid #F1D9A3;min-width:0}
.d7-pod div:first-child{background:linear-gradient(160deg,#FFF1C2,#FFE08A);border-color:#E9C460;padding-top:16px}
.d7-pod b{display:block;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.d7-pod small{font-size:12.5px;color:#5A4A1A}.d7-pod .m{font-size:24px;float:right}
.d7-camps{display:flex;flex-wrap:wrap;gap:6px}.d7-camps span{background:#E7F5EC;color:var(--g);border-radius:999px;padding:4px 11px;font-weight:700;font-size:13px}
.d7-till{display:flex;gap:10px;flex-wrap:wrap}.d7-till div{flex:1;min-width:120px;background:#F6F8F6;border-radius:12px;padding:9px 11px}.d7-till b{display:block;font-size:20px;color:var(--g)}.d7-till span{font-size:12px;color:var(--mute)}
.d7-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
.d7-tile{position:relative;border-radius:12px;overflow:hidden;background:#EEF2EF;border:2px solid transparent;padding:9px 9px 8px;min-height:74px;cursor:default;text-align:left;font:inherit;color:inherit}
.d7-tile.tap{cursor:pointer}
.d7-tile .f{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg,#B9E2C3,#8FD0A0);transition:height 1s}
.d7-tile b,.d7-tile small{position:relative;display:block}.d7-tile b{font-size:13.5px;line-height:1.2}.d7-tile small{font-size:12px;color:#2D3A33;margin-top:3px}
.d7-tile.ok{border-color:var(--ok)}.d7-tile.due{border-color:var(--sf)}.d7-tile.late{border-color:var(--late)}
.d7-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--mute);margin-top:8px}.d7-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;border:2px solid;vertical-align:-2px;margin-right:4px}
.d7-down{background:#FDECEA;color:var(--late);border-radius:10px;padding:6px 10px;font-weight:700;font-size:13px;margin-top:8px}
.d7-final{background:linear-gradient(135deg,#1F5A3E,#123826);color:#fff;border-radius:18px;padding:18px 20px;margin-bottom:14px}.d7-final h2{margin:0 0 6px;color:#fff}
.d7-cf{position:fixed;inset:0;pointer-events:none;z-index:99;overflow:hidden}.d7-cf i{position:absolute;top:-12px;width:9px;height:14px;border-radius:2px;animation:d7f 2.6s ease-in forwards}
@keyframes d7f{to{transform:translateY(105vh) rotate(720deg);opacity:.9}}
@media (prefers-reduced-motion:reduce){.d7-live i,.d7-cf i{animation:none}.d7-bar i,.d7-tile .f{transition:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-IN');
  const nr = n => { const x = Math.round(Number(n || 0) * 10) / 10; return Number.isInteger(x) ? String(x) : x.toFixed(1); };
  const t12 = ts => { if (!ts) return ''; const h = Number(String(ts).slice(11, 13)), m = String(ts).slice(14, 16); return ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM'); };
  const dmy = d => d ? d.slice(8, 10) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4) : '';
  const dlong = d => { if (!d) return ''; const x = new Date(d + 'T12:00:00Z'); return x.getUTCDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][x.getUTCMonth()]; };
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const join = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

  function story(d, o) {
    const ts = d.tehsils, hm = (d.now || '').slice(11, 16), made = ts.reduce((a, t) => a + t.made, 0), total = ts.reduce((a, t) => a + t.total, 0), need = ts.reduce((a, t) => a + t.needed, 0);
    if (d.closed) return `<span class="lead">Campaign closed</span>${ts.map(t => `<b>${esc(t.name)}</b>: ${fmt(t.made)} Farmer IDs (${t.pct}%)`).join(' · ')}. Thank you to every official, Patwari and operator who made this possible.`;
    const lead = hm < '09:00' ? 'Camps start at 9 AM' : ts.every(t => t.closed_day) ? 'Day closed: final figures' : 'Live today';
    let s = `<span class="lead">${lead}</span>`;
    s += ts.some(t => t.today) ? 'Today ' + join(ts.map(t => `<b>${esc(t.name)}</b> made <b>${fmt(t.today)}</b>`)) + ' Farmer IDs. ' : 'No Farmer ID counted yet today. ';
    s += `Till date <b>${fmt(made)}</b> of ${fmt(total)} (${total ? Math.round(made * 1000 / total) / 10 : 0}%). Needed: <b>${fmt(need)} a day</b>.`;
    if (o.forecast) { const ex = ts.reduce((a, t) => a + ((o.forecast[t.tehsil_id] || {}).expected || 0), 0), pc = total ? Math.round(ex * 100 / total) : 0;
      s += ` <span style="color:${pc >= 100 ? 'var(--ok)' : 'var(--late)'}">At the last 7 days' pace: about ${fmt(ex)} (${pc}%) by the internal deadline.</span>`; }
    return s;
  }
  function mountain(d, narrow) {
    const W = narrow ? 560 : 1000, H = narrow ? 330 : 300, f = narrow ? 1.45 : 1, x0 = narrow ? 40 : 70, x1 = W - (narrow ? 70 : 120);
    const pt = p => { const t = Math.max(0, Math.min(1, p / 100)); return [x0 + (x1 - x0) * t, (H - 64) - (H - 132) * Math.pow(t, 1.25)]; };
    let path = ''; for (let i = 0; i <= 50; i++) { const [x, y] = pt(i * 2); path += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    const [ex, ey] = pt(d.expected_pct), [sx, sy] = pt(100);
    const ts = d.tehsils.slice().sort((a, b) => a.pct - b.pct);
    const cl = ts.map((t, i) => { const [x, y] = pt(t.pct), behind = !d.closed && t.pct < d.expected_pct, col = behind ? '#B42318' : '#1E8A4C', up = i % 2 ? 1 : -1, ly = y + (up < 0 ? -40 * f : 44 * f), w = Math.max(118, t.name.length * 13 + 66) * f, lx = Math.min(W - w - 6, Math.max(6, x - w / 2));
      return `<g><line x1="${x}" y1="${y}" x2="${x}" y2="${ly + (up < 0 ? 12 : -12) * f}" stroke="${col}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${13 * f}" fill="#fff" stroke="${col}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${5 * f}" fill="${col}"/>
        <rect x="${lx}" y="${ly - 16 * f}" width="${w}" height="${30 * f}" rx="${15 * f}" fill="${col}"/><text x="${lx + w / 2}" y="${ly + 5 * f}" text-anchor="middle" font-size="${16 * f}" font-weight="800" fill="#fff">${esc(t.name)} ${t.pct}%</text></g>`; }).join('');
    const hi = d.expected_pct > 55;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Progress to the deadline">
      <path d="M0 ${H} L0 ${H * .63} C${W * .12} ${H * .5} ${W * .2} ${H * .57} ${W * .3} ${H * .43} C${W * .4} ${H * .3} ${W * .47} ${H * .4} ${W * .56} ${H * .27} C${W * .65} ${H * .13} ${W * .72} ${H * .23} ${W * .8} ${H * .13} C${W * .88} ${H * .03} ${W * .94} ${H * .1} ${W} ${H * .07} L${W} ${H} Z" fill="#DCEBE1" opacity=".7"/>
      <path d="${path} L${sx} ${H} L${x0} ${H} Z" fill="#8CC79C"/><path d="${path}" fill="none" stroke="#2F7D52" stroke-width="5" stroke-linecap="round"/>
      ${[25, 50, 75].map(p => { const [x, y] = pt(p); return `<text x="${x}" y="${y + 30 * f}" text-anchor="middle" font-size="${13 * f}" fill="#2F5E44" font-weight="700">${p}%</text>`; }).join('')}
      <g><line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy - 34}" stroke="#16201B" stroke-width="3"/><path d="M${sx} ${sy - 34} L${sx + 30} ${sy - 26} L${sx} ${sy - 18} Z" fill="#E39B2D"/>
        <text x="${sx + 30}" y="${sy - 42}" text-anchor="end" font-size="${14 * f}" font-weight="800" fill="#16201B">100%</text></g>
      ${d.closed ? '' : `<g><line x1="${ex}" y1="${ey}" x2="${ex}" y2="${ey - 40}" stroke="#B26A00" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M${ex} ${ey - 40} L${ex + 22} ${ey - 34} L${ex} ${ey - 28} Z" fill="#E39B2D"/>
        <text x="${hi ? ex - 6 : ex + 26}" y="${hi ? ey - 30 : ey - 31}" text-anchor="${hi ? 'end' : 'start'}" font-size="${13 * f}" font-weight="800" fill="#6B3F00">Should be here today: ${d.expected_pct}%</text></g>`}
      ${cl}</svg>`;
  }
  function strip(t) {
    const per = Math.max(1, Math.round(t.target / 8)), slots = [10, 11, 12, 13, 14, 15, 16, 17], by = {};
    (t.uploads || []).forEach(u => { const h = Number(String(u.at).slice(11, 13)); const s = Math.max(10, Math.min(17, h)); by[s] = (by[s] || 0) + u.n; });
    const mx = Math.max(per * 1.3, ...Object.values(by), 1);
    return `<div class="d7-strip"><span class="tg" style="bottom:${Math.round(per * 64 / mx) + 18}px" title="Pace for ${t.target} a day"></span>${slots.map(s => by[s] ? `<div><em>${by[s]}</em><i style="height:${Math.round(by[s] * 64 / mx)}px"></i><small>${(s % 12) || 12}</small></div>`
      : `<div class="gh"><i style="height:${Math.round(per * 64 / mx)}px"></i><small>${(s % 12) || 12}</small></div>`).join('')}</div>
      <div class="d7-sub">Bars: new IDs in each hourly portal file · dashed line: the pace for ${t.target} a day</div>`;
  }
  function panel(d, t, o) {
    const p = Math.min(100, Math.round(t.today * 100 / Math.max(1, t.target))), key = 'd7c:' + t.tehsil_id;
    return `<section class="d7-card d7-t" id="d7-${esc(t.tehsil_id)}"><h2>${esc(t.name)}<span class="d7-live ${t.as_on ? '' : 'off'}"><i></i>${t.as_on ? 'Portal file ' + esc(t12(t.as_on)) + (t.last_n ? ' · +' + t.last_n : '') : 'No portal file yet today'}</span></h2>
      ${d.closed ? '' : `<div class="d7-big"><b data-to="${t.today}" data-k="${key}">${fmt(t.today)}</b><span>/ ${fmt(t.target)} IDs today</span></div><div class="d7-bar"><i style="width:${p}%"></i></div>
      ${t.down ? '<div class="d7-down">⛔ Portal down: figures as of the last file</div>' : ''}
      <div class="d7-sec">Through the day</div>${strip(t)}`}
      ${(t.top2 || []).length && !d.closed ? `<div class="d7-sec">Top 2 today</div><div class="d7-pod">${t.top2.map((x, i) => `<div><span class="m">${i ? '🥈' : '🥇'}</span><b>${esc(x.name)}</b><small>${nr(x.today)} IDs · ${esc((x.villages || []).join(', '))}</small></div>`).join('')}</div>` : ''}
      ${(t.camps || []).length && !d.closed ? `<div class="d7-sec">Camps today</div><div class="d7-camps">${t.camps.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
      <div class="d7-sec">Till date</div><div class="d7-till"><div><b>${fmt(t.made)}</b><span>of ${fmt(t.total)} · ${t.pct}%</span></div>${d.closed ? '' : `<div><b>${fmt(t.needed)}</b><span>needed a day</span></div>`}<div><b>${fmt(Math.max(0, t.total - t.made))}</b><span>still to make</span></div></div>
      <div class="d7-sec">Villages (${t.villages.length})</div><div class="d7-tiles">${t.villages.map(v => { const vp = Math.round(v.made * 100 / Math.max(1, v.total));
        return `<${o.onVillage ? 'button' : 'div'} class="d7-tile ${d.closed ? '' : v.cls}${o.onVillage ? ' tap' : ''}" data-v="${esc(v.village_id)}"><span class="f" style="height:${vp}%"></span><b>${esc(v.name)}</b><small>${vp}% · ${fmt(v.made)}/${fmt(v.total)}</small>${d.closed ? '' : `<small>${v.today ? '+' + v.today + ' today' : '–'}</small>`}</${o.onVillage ? 'button' : 'div'}>`; }).join('')}</div>
      ${d.closed ? '' : '<div class="d7-legend"><span><i style="border-color:#1E8A4C"></i>target met today</span><span><i style="border-color:#E39B2D"></i>on pace</span><span><i style="border-color:#B42318"></i>behind</span><span>fill = done till date</span></div>'}</section>`;
  }
  function countUp(root) {
    root.querySelectorAll('[data-to]').forEach(el => { const to = Number(el.dataset.to), from = Math.min(to, Number(ls.get(el.dataset.k) || 0)); ls.set(el.dataset.k, to);
      if (from === to || window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 900; const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  }
  function confetti() {
    const box = document.createElement('div'); box.className = 'd7-cf'; const cols = ['#1F5A3E', '#E39B2D', '#3C9461', '#F2C14E', '#7CC48E', '#B42318'];
    for (let i = 0; i < 90; i++) { const c = document.createElement('i'); c.style.left = Math.random() * 100 + 'vw'; c.style.background = cols[i % cols.length]; c.style.animationDelay = Math.random() * .7 + 's'; c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)'; box.appendChild(c); }
    document.body.appendChild(box); setTimeout(() => box.remove(), 3600);
  }
  function celebrate(d) {
    if (d.closed) return; let hit = false;
    d.tehsils.forEach(t => { const k1 = 'd7m:' + t.tehsil_id + ':' + d.today; if (t.today >= t.target && !ls.get(k1)) { ls.set(k1, 1); hit = true; }
      const th = Math.floor(t.made / 1000) * 1000, k2 = 'd7k:' + t.tehsil_id; if (th >= 1000 && Number(ls.get(k2) || 0) < th) { if (ls.get(k2) !== null) hit = true; ls.set(k2, th); } });
    if (hit) setTimeout(confetti, 600);
  }
  window.DASH = {
    render(root, d, o) {
      o = o || {};
      if (!d || !d.tehsils) { root.innerHTML = '<div class="d7"><div class="d7-card" style="height:220px"></div></div>'; return; }
      if (o.order) { const ix = id => { const i = o.order.indexOf(id); return i < 0 ? 99 : i; }; d.tehsils.sort((a, b) => ix(a.tehsil_id) - ix(b.tehsil_id)); }
      root.innerHTML = `<div class="d7"><div class="d7-story">${story(d, o)}</div>
        <div class="d7-card d7-mtn">${mountain(d, (root.clientWidth || innerWidth) < 600)}<div class="cap"><span>The climb to <b>100%</b></span><span>${d.closed ? 'Final position' : '<b style="color:#B42318">Red</b> = below the flag · <b style="color:#1E8A4C">green</b> = at or above it'}</span></div></div>
        ${d.tehsils.length > 1 ? `<div class="d7-jump">${d.tehsils.map(t => `<a href="#d7-${esc(t.tehsil_id)}">${esc(t.name)}</a>`).join('')}</div>` : ''}
        <div class="d7-cols">${d.tehsils.map(t => panel(d, t, o)).join('')}</div></div>`;
      countUp(root); celebrate(d);
      root.querySelectorAll('.d7-jump a').forEach(a => a.onclick = e => { e.preventDefault(); const x = document.getElementById(a.getAttribute('href').slice(1)); if (x) x.scrollIntoView({ behavior: 'smooth' }); });
      if (o.onVillage) root.querySelectorAll('.d7-tile[data-v]').forEach(b => b.onclick = () => o.onVillage(b.dataset.v));
    },
    confetti, t12
  };
})();
