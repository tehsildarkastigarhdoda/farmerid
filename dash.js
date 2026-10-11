/* Farmer ID Dashboard – the live dashboard (public page and the app share this file).
 * v7.3: 100-square grid, the climb since August, the last 30 days, Assar vs Kastigarh, a pop-up when a file lands. */
(function () {
  const CSS = `
.d7{--g:#1F5A3E;--lt:#7CC79A;--ink:#111816;--mute:#5F6B66;--line:#E3E8E5;--soft:#EDF0EE;--ok:#1E7A46;--late:#B3261E;--sf:#C27A12;--card:#fff;--c1:#B9DCC5;--c2:#6DB088;--c3:#1F5A3E;color:var(--ink);font-variant-numeric:tabular-nums}
.dk body.pub,body.pub.dk{background:#0F1513!important;color:#E7ECE9}
.dk .d7{--ink:#E7ECE9;--mute:#9AA8A1;--line:#26302C;--soft:#1E2824;--card:#151D1A;--g:#7CC79A;--lt:#2E6A49;--c1:#1F4A34;--c2:#2F7D52;--c3:#7CC79A}
.dk body.pub .top{background:rgba(15,21,19,.92)!important;border-color:#26302C!important}.dk body.pub .top .nm b{color:#7CC79A!important}.dk body.pub .top .nm small,.dk body.pub footer,.dk body.pub .upd{color:#9AA8A1!important}
.dk body.pub .upd button{background:#151D1A!important;border-color:#26302C!important;color:#7CC79A!important}.dk .d7-pop{background:#E7ECE9;color:#111816}.dk .d7-down{background:#3A1F1C;color:#F2B8B0}
.d7-tb svg{display:block;width:100%;height:auto}.d7-upd{font-size:12.5px;color:var(--mute);text-align:right}
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
      ${staffEnd > ser.length - 1 ? `<path d="M${last[0]} ${last[1]} L${R} ${top}" style="stroke:var(--sf)" stroke-width="1.4" stroke-dasharray="4 4"/><text x="${R - 2}" y="${top + 26}" text-anchor="end" font-size="9.5" style="fill:var(--sf)">pace to 100% by ${esc(dlong(d.deadline))}</text>` : ''}
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
  const toM = x => Number(String(x).slice(0, 2)) * 60 + Number(String(x).slice(3, 5));
  /* green "Live" only while the figures are fresh; otherwise say which file is awaited */
  function liveTag(t, d) {
    if (!t.as_on) return `<span class="d7-live off"><i></i>No portal file yet today</span>`;
    const nowM = toM(String(d.now || '').slice(11, 16)), age = nowM - toM(t.as_on.slice(11, 16)), working = nowM >= 600 && nowM <= 1230;
    if (working && age > 70 && t.next_slot) return `<span class="d7-live off"><i></i>Waiting for the ${esc(t12(d.today + ' ' + t.next_slot + ':00')).replace(':00 ', ' ')} file</span>`;
    return `<span class="d7-live"><i></i>Live · ${esc(t12(t.as_on))}</span>`;
  }
  /* Through the day: one bar per upload slot (10 … 5, 8 PM); the morning file holds everything since last night's file */
  function dayBars(t, d) {
    const ts = d.slot_times || ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '20:00'];
    const ups = (t.uploads || []).map(u => ({ m: toM(String(u.at).slice(11, 16)), n: u.n })).filter(u => u.m > 0);
    if (!ups.length) return '';
    const nowM = toM(String(d.now || '').slice(11, 16)), sl = ts.map((x, i) => { const s = toM(x), from = i ? s - 10 : 0, to = i < ts.length - 1 ? toM(ts[i + 1]) - 10 : 1440;
      const us = ups.filter(u => u.m >= from && u.m < to); return { x, n: us.reduce((a, u) => a + u.n, 0), k: us.length, past: nowM >= to, cur: nowM >= from && nowM < to }; });
    const W = 460, H = 120, L = 6, R = W - 6, base = 92, cw = (R - L) / ts.length, pace = t.target / ts.length, mx = Math.max(pace * 1.4, ...sl.map(z => z.n), 1), Y = v => base - v * 70 / mx;
    const lab = x => { const h = Number(x.slice(0, 2)); return ((h % 12) || 12) + (h >= 18 ? ' PM' : ''); };
    let g = `<line x1="${L}" y1="${base}" x2="${R}" y2="${base}" style="stroke:var(--line)"/><line x1="${L}" y1="${Y(pace)}" x2="${R}" y2="${Y(pace)}" style="stroke:var(--sf)" stroke-dasharray="4 4" opacity=".8"/>`;
    sl.forEach((z, i) => { const x = L + i * cw + cw * .2, w = cw * .6;
      if (z.k) g += `<rect x="${x}" y="${Y(z.n)}" width="${w}" height="${Math.max(2, base - Y(z.n))}" rx="4" style="fill:${i === 0 ? 'var(--lt)' : 'var(--g)'}"><title>${z.n} new IDs</title></rect><text x="${x + w / 2}" y="${Y(z.n) - 5}" text-anchor="middle" font-size="11" font-weight="600" style="fill:var(--ink)">${z.n}</text>`;
      else g += `<rect x="${x}" y="${base - 3}" width="${w}" height="3" rx="1.5" style="fill:${z.cur ? 'var(--g)' : 'var(--soft)'}" opacity="${z.cur ? .45 : 1}"/>`;
      g += `<text x="${x + w / 2}" y="${base + 15}" text-anchor="middle" font-size="10.5" style="fill:${z.cur ? 'var(--g)' : 'var(--mute)'}" font-weight="${z.cur ? 600 : 400}">${lab(z.x)}</text>`; });
    g += `<text x="${L + cw / 2}" y="${base + 27}" text-anchor="middle" font-size="9" style="fill:var(--mute)">morning</text>`;
    return `<div class="d7-sec">Through the day</div><div class="d7-tb"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="New IDs in each portal file today">${g}</svg></div>`;
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
      <div class="d7-hd"><h2>${esc(t.name)}</h2>${liveTag(t, d)}</div>
      <div class="d7-hero">${waffle(t, d, o)}<div><div class="d7-pct"><span data-to="${p}" data-k="${key}">${p}</span><small>%</small></div>
        <div class="d7-of"><b>${fmt(t.made)}</b> of ${fmt(t.total)} farmers<br>have a Farmer ID</div>
        <div class="d7-leg"><span><i style="background:var(--g)"></i>done</span><span><i style="background:var(--lt)"></i>today</span>${o.staff && !d.closed ? '<span><i style="border:1.2px dashed var(--sf)"></i>should be</span>' : ''}</div></div></div>
      ${d.closed ? '' : `<div class="d7-row"><div><div class="d7-k">Today</div><div class="d7-today">${fmt(t.today)} <span>/ ${fmt(t.target)}</span></div></div><div class="d7-upd">${t.as_on ? 'Updated ' + esc(t12(t.as_on)) : ''}${t.next_slot ? '<br>next file about ' + esc(t12(d.today + ' ' + t.next_slot + ':00')) : ''}</div></div>${dayBars(t, d)}`}
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

/* v7.6 · Report card: one plain sentence first, a grade for every village, the same pictures for the WhatsApp group.
 * Shared by the public page and the app. Assar is always blue, Kastigarh always purple. */
(function () {
  const CSS = `
.rc{--ink:#14201B;--mute:#5E6B65;--line:#E2E7E4;--card:#fff;--soft:#EEF1EE;--A:#1E7A46;--Ab:#E3F2E8;--B:#3D8C5C;--Bb:#EDF6EF;--C:#9A5C00;--Cb:#FCF0D9;--D:#B3261E;--Db:#FBE4E1;--S:#1E7A46;color:var(--ink);font-variant-numeric:tabular-nums}
.rc *{box-sizing:border-box}
.rc-when{font-size:12.5px;color:var(--mute)}
.rc-head{font-size:clamp(20px,5.4vw,26px);line-height:1.3;font-weight:600;letter-spacing:-.01em;margin:4px 0 14px}
.rc-head b{font-weight:700}.rc-red{color:var(--D)}
.rc-vs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rc-team{background:var(--card);border-radius:16px;padding:14px;border:1px solid var(--line);border-top:5px solid var(--tc,#5E6B65)}
.rc-team .nm{font-size:12.5px;font-weight:700;letter-spacing:.04em;color:var(--tc)}
.rc-team .big{font-size:clamp(30px,8vw,40px);font-weight:700;letter-spacing:-.02em;line-height:1.1;margin-top:4px}
.rc-team small{display:block;font-size:12.5px;color:var(--mute);margin-top:2px}
.rc-lead{display:inline-block;font-size:11px;font-weight:700;background:#FFE8A3;color:#6B4A00;border-radius:20px;padding:2px 9px;margin-top:6px}
.rc-sec{font-size:12.5px;font-weight:700;color:var(--mute);margin:18px 0 8px;display:flex;justify-content:space-between;gap:8px}
.rc-th{margin:8px 0}.rc-th .l{display:flex;justify-content:space-between;gap:8px;font-size:13px;margin-bottom:5px}.rc-th .tr{height:14px;background:var(--soft);border-radius:8px;overflow:hidden}.rc-th .tr i{display:block;height:100%;border-radius:8px;transition:width 1s ease}
.rc-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:2px 12px}
.rc-v{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line);width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left;font:inherit;color:inherit}.rc-v:last-child{border-bottom:0}
button.rc-v{cursor:pointer}
.rc-g{width:34px;height:34px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;flex:none}
.rc-gA{background:#E3F2E8;color:#1E7A46}.rc-gB{background:#EDF6EF;color:#3D8C5C}.rc-gC{background:#FCF0D9;color:#9A5C00}.rc-gD{background:#FBE4E1;color:#B3261E}.rc-gS{background:#1E7A46;color:#fff;font-size:15px}.rc-g_{background:#EEF1EE;color:#5E6B65}
.dk .rc-gA{background:#173D28;color:#7CC79A}.dk .rc-gB{background:#1A3324;color:#8FCFA8}.dk .rc-gC{background:#3A2B12;color:#F0B95A}.dk .rc-gD{background:#3A1F1C;color:#F2A69C}.dk .rc-g_{background:#1E2824;color:#9AA8A1}
.rc-v .t{flex:1;min-width:0}.rc-v b{font-size:15px;display:block}.rc-v small{font-size:12.5px;color:var(--mute);display:block;overflow:hidden;text-overflow:ellipsis}
.rc-v .n{text-align:right;font-weight:700;font-size:16px;white-space:nowrap}.rc-v .n small{font-weight:400;font-size:11.5px;display:inline}
.rc-dot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:6px;vertical-align:1px}
.rc-key{display:flex;gap:8px 12px;flex-wrap:wrap;margin-top:10px}.rc-key span{font-size:12px;color:var(--mute);display:flex;align-items:center;gap:5px}.rc-key .rc-g{width:22px;height:22px;font-size:12px;border-radius:6px}
.rc-strip{display:flex;gap:6px;justify-content:space-between;text-align:center}.rc-strip small{display:block;font-size:12px;color:var(--mute);margin-top:3px}
.rc-bar{display:flex;height:10px;border-radius:6px;overflow:hidden;margin-top:10px;background:var(--soft)}
.rc-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px}.rc-cal span{text-align:center;font-size:11px;padding:6px 0;border-radius:7px;background:var(--soft);color:var(--mute)}.rc-cal span.d{background:#1F5A3E;color:#fff}.rc-cal span.t{outline:2px solid #1F5A3E;background:#E8F1EB;color:#1F5A3E;font-weight:700}
.rc-more{margin-top:10px;font-size:13px}
.dk .rc{--ink:#E7ECE9;--mute:#9AA8A1;--line:#26302C;--card:#151D1A;--soft:#1E2824;--Ab:#173D28;--Bb:#1A3324;--Cb:#3A2B12;--Db:#3A1F1C;--A:#7CC79A;--B:#8FCFA8;--C:#F0B95A;--D:#F2A69C}
.dk .rc-cal span.t{background:#1E2824;color:#7CC79A;outline-color:#7CC79A}.dk .rc-lead{background:#4A3B10;color:#FFE08A}
`;
  if (!document.getElementById('rc76css')) { const st = document.createElement('style'); st.id = 'rc76css'; st.textContent = CSS; document.head.appendChild(st); }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-IN');
  const t12 = ts => { if (!ts) return ''; const h = Number(String(ts).slice(11, 13)), m = String(ts).slice(14, 16); return ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM'); };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dt = s => { const d = new Date(s + 'T12:00:00Z'); return { d: d.getUTCDate(), m: MON[d.getUTCMonth()], w: DAY[d.getUTCDay()] }; };
  const dLong = s => { const x = dt(s); return `${x.w} ${x.d} ${x.m}`; };
  const TC = { T_ASSAR: '#1F5A9E', T_KASTIGARH: '#8A3FA0' }, tc = id => TC[id] || '#4E6B5E';
  const WORD = { S: 'finished', A: 'target met', B: 'on track', C: 'slow', D: 'far behind' };
  const g = (x, cls) => `<span class="rc-g rc-g${x || '_'} ${cls || ''}">${x === 'S' ? '✓' : x || '–'}</span>`;
  const key = () => `<div class="rc-key">${['A', 'B', 'C', 'D', 'S'].map(x => `<span>${g(x)}${WORD[x]}</span>`).join('')}</div>`;
  const ORDER = 'SABCD';
  function teams(c, d) { // c = d.camp
    const ts = c.tehsils, lead = ts.length > 1 ? ts.slice().sort((a, b) => b.ids - a.ids)[0] : null, tie = ts.length > 1 && ts[0].ids === ts[1].ids;
    return { ts, lead: tie ? null : lead };
  }
  function headline(c, d) {
    const { ts, lead } = teams(c, d), all = ts.reduce((a, t) => a + t.ids, 0), tg = ts.reduce((a, t) => a + t.target, 0);
    const name = t => `<span style="color:${tc(t.tehsil_id)}">${esc(t.name)}</span>`;
    if (!all) return `No Farmer IDs counted yet today. The first portal file comes at 10 AM.`;
    const s1 = ts.length > 1 ? `Today ${name(lead || ts[0])} has made <b>${fmt((lead || ts[0]).ids)}</b> Farmer IDs and ${name(ts.find(t => t !== (lead || ts[0])))} <b>${fmt(ts.find(t => t !== (lead || ts[0])).ids)}</b>.` : `Today ${name(ts[0])} has made <b>${fmt(ts[0].ids)}</b> Farmer IDs.`;
    const behind = ts.filter(t => t.ids < t.target);
    const s2 = !behind.length ? ' Every village target for today is met.' : behind.length === ts.length ? (ts.length > 1 ? ' Both are behind today’s target.' : ' Behind today’s target.') : ` ${name(behind[0])} is behind today’s target.`;
    return s1 + s2;
  }
  function render(root, d, o) {
    o = o || {}; const c = d && d.camp;
    if (!c || !c.tehsils || !c.tehsils.length) { root.innerHTML = ''; return; }
    const { ts, lead } = teams(c, d), dts = (d.tehsils || []);
    const vs = []; ts.forEach(t => t.villages.forEach(v => vs.push(Object.assign({ tid: t.tehsil_id, tn: t.name }, v))));
    vs.sort((a, b) => ORDER.indexOf(a.grade || 'D') - ORDER.indexOf(b.grade || 'D') || b.ids - a.ids);
    const shown = o.all ? vs : vs.filter(v => v.grade !== 'S');
    const fin = vs.filter(v => v.grade === 'S');
    root.innerHTML = `<div class="rc">
      <div class="rc-when">Farmer ID campaign · ${esc(dLong(c.date))} · day ${c.day_no} of ${c.days}${d.now ? ' · updated ' + esc(t12(d.now)) : ''}</div>
      <div class="rc-head">${headline(c, d)}</div>
      <div class="rc-vs" style="${ts.length === 1 ? 'grid-template-columns:1fr' : ''}">${ts.map(t => `<div class="rc-team" style="--tc:${tc(t.tehsil_id)}"><div class="nm">${esc(t.name.toUpperCase())}</div><div class="big">${fmt(t.ids)}</div><small>of ${fmt(t.target)} target today</small><small>${t.villages.length} villages${t.absent && o.staff ? ' · ' + t.absent + ' absent' : ''}</small>${lead && lead === t ? '<span class="rc-lead">★ Ahead today</span>' : ''}</div>`).join('')}</div>
      <div class="rc-sec"><span>How much is done (since August)</span><span>${c.days_left ? c.days_left + ' day' + (c.days_left === 1 ? '' : 's') + ' left' : 'last day'}</span></div>
      ${dts.filter(t => ts.some(x => x.tehsil_id === t.tehsil_id)).map(t => { const p = t.total ? Math.round(t.made * 100 / t.total) : 0;
        return `<div class="rc-th"><div class="l"><b style="color:${tc(t.tehsil_id)}">${esc(t.name)}</b><span>${fmt(t.made)} of ${fmt(t.total)} farmers · <b>${p}%</b></span></div><div class="tr"><i style="width:${p}%;background:${tc(t.tehsil_id)}"></i></div></div>`; }).join('')}
      <div class="rc-cal">${Array.from({ length: c.days }, (_, i) => { const x = new Date(c.from + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + i); const s = x.toISOString().slice(0, 10); return `<span class="${s < c.date ? 'd' : s === c.date ? 't' : ''}">${x.getUTCDate()}</span>`; }).join('')}</div>
      <div class="rc-sec"><span>Village report card · today</span><span>grade</span></div>
      <div class="rc-card">${shown.map(v => `<${o.onVillage ? 'button' : 'div'} class="rc-v" data-rcv="${esc(v.name)}">${g(v.grade)}<span class="t"><b>${ts.length > 1 ? `<i class="rc-dot" style="background:${tc(v.tid)}"></i>` : ''}${esc(v.name)}</b><small>${esc(v.reason)}${o.staff && v.why ? ' · ' + esc(v.why) : ''}</small></span><span class="n">${fmt(v.ids)}<small> /${fmt(v.target)}</small></span></${o.onVillage ? 'button' : 'div'}>`).join('') || '<div class="rc-v"><span class="t"><small>No village has a target today.</small></span></div>'}</div>
      ${fin.length && !o.all ? `<div class="rc-more">${g('S')} <b>Finished:</b> ${esc(fin.map(v => v.name).join(', '))}</div>` : ''}
      ${key()}</div>`;
    if (o.onVillage) root.querySelectorAll('[data-rcv]').forEach(b => b.onclick = () => o.onVillage(b.dataset.rcv));
  }

  /* ---------- pictures for the WhatsApp group (PNG, 1080 wide) ---------- */
  const F = 'Inter, "Segoe UI", Roboto, Arial, sans-serif';
  const GC = { A: ['#E3F2E8', '#1E7A46'], B: ['#EDF6EF', '#3D8C5C'], C: ['#FCF0D9', '#9A5C00'], D: ['#FBE4E1', '#B3261E'], S: ['#1E7A46', '#FFFFFF'], '': ['#EEF1EE', '#5E6B65'] };
  function cv(h) { const c = document.createElement('canvas'); c.width = 1080; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, 1080, h); x.textBaseline = 'alphabetic'; return [c, x]; }
  function rr(x, X, Y, w, h, r, fill) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); x.fillStyle = fill; x.fill(); }
  function tx(x, s, X, Y, size, color, weight, align) { x.font = `${weight || 400} ${size}px ${F}`; x.fillStyle = color || '#14201B'; x.textAlign = align || 'left'; x.fillText(s, X, Y); }
  function wrap(x, s, X, Y, maxW, size, color, weight, lh) { x.font = `${weight || 400} ${size}px ${F}`; const words = String(s).split(' '); let line = '', y = Y;
    words.forEach(w => { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { tx(x, line, X, y, size, color, weight); line = w; y += lh; } else line = t; }); if (line) tx(x, line, X, y, size, color, weight); return y; }
  function chip(x, gr, X, Y, s) { const c = GC[gr] || GC['']; rr(x, X, Y, s, s, s * 0.28, c[0]); tx(x, gr === 'S' ? '✓' : gr || '–', X + s / 2, Y + s * 0.7, s * 0.52, c[1], 800, 'center'); }
  function head(x, kicker, title, color) { tx(x, kicker.toUpperCase(), 60, 86, 26, '#5E6B65', 700); return wrap(x, title, 60, 146, 960, 50, color || '#14201B', 700, 60); }
  function foot(x, h, left) { x.fillStyle = '#E2E7E4'; x.fillRect(0, h - 78, 1080, 2); tx(x, left, 60, h - 32, 24, '#5E6B65'); tx(x, 'Tehsil offices Assar & Kastigarh', 1020, h - 32, 24, '#5E6B65', 400, 'right'); }
  function teamBox(x, t, X, Y, w, h, sub, bg) { rr(x, X, Y, w, h, 24, bg); x.fillStyle = tc(t.tehsil_id); rr(x, X, Y, w, 10, 5, tc(t.tehsil_id)); tx(x, t.name.toUpperCase(), X + 28, Y + 56, 28, tc(t.tehsil_id), 700); tx(x, fmt(t.ids), X + 28, Y + 136, 78, '#14201B', 700); if (sub) tx(x, sub, X + 28, Y + 180, 26, '#5E6B65'); }
  function trim(cn, y, left) { const h = Math.max(760, Math.ceil(y + 130)); if (h >= cn.height) { foot(cn.getContext('2d'), cn.height, left); return cn; }
    const [c2, x2] = cv(h); x2.drawImage(cn, 0, 0, 1080, h - 80, 0, 0, 1080, h - 80); foot(x2, h, left); return c2; }
  function fitTx(x, s, X, Y, size, color, weight, maxW) { let z = size; x.font = `${weight || 400} ${z}px ${F}`; while (z > 16 && x.measureText(s).width > maxW) { z -= 1; x.font = `${weight || 400} ${z}px ${F}`; } tx(x, s, X, Y, z, color, weight); }
  const tint = id => id === 'T_ASSAR' ? '#F1F5FB' : id === 'T_KASTIGARH' ? '#F7F1F9' : '#F3F5F3';
  function slot(d) {
    const c = d.camp, ts = c.tehsils, vs = [];
    ts.forEach(t => t.villages.forEach(v => vs.push(Object.assign({ tid: t.tehsil_id }, v))));
    const live = vs.filter(v => v.grade !== 'S').sort((a, b) => b.ids - a.ids), fin = vs.filter(v => v.grade === 'S');
    const h = 560 + live.length * 50 + (fin.length ? 50 : 0) + 100;
    const [cn, x] = cv(h), lead = ts.length > 1 ? ts.slice().sort((a, b) => b.ids - a.ids) : ts;
    const asOn = d.now ? t12(d.now) : '', when = `${dt(c.date).d} ${dt(c.date).m}`;
    const title = ts.length > 1 ? (lead[0].ids === lead[1].ids ? `Level today, ${fmt(lead[0].ids)} each` : `${lead[0].name} leads today, ${fmt(lead[0].ids)} to ${fmt(lead[1].ids)}`) : `${ts[0].name}: ${fmt(ts[0].ids)} Farmer IDs today`;
    let y = head(x, `Farmer ID · ${when} · ${asOn} update`, title, ts.length > 1 && lead[0].ids !== lead[1].ids ? tc(lead[0].tehsil_id) : null) + 40;
    const w = ts.length > 1 ? 470 : 960; ts.forEach((t, i) => { const dt0 = (d.tehsils || []).find(z => z.tehsil_id === t.tehsil_id); teamBox(x, t, 60 + i * 490, y, w, 210, `of ${fmt(t.target)} target${dt0 && dt0.last_n ? ' · +' + fmt(dt0.last_n) + ' in the last file' : ''}`, tint(t.tehsil_id)); });
    y += 270; tx(x, 'EVERY VILLAGE TODAY · TARGET 200 (OR WHAT IS LEFT)', 60, y, 24, '#5E6B65', 700); y += 26;
    const mx = Math.max(200, ...live.map(v => v.ids));
    live.forEach(v => { y += 50; tx(x, v.name, 60, y, 28, tc(v.tid), 600); x.globalAlpha = v.grade === 'A' || v.grade === 'B' ? 1 : 0.45; rr(x, 300, y - 24, Math.max(8, 520 * v.ids / mx), 26, 7, tc(v.tid)); x.globalAlpha = 1;
      tx(x, fmt(v.ids), 930, y, 28, '#14201B', 700, 'right'); chip(x, v.grade, 960, y - 32, 40); });
    if (fin.length) { y += 50; tx(x, '✓ Finished: ' + fin.map(v => v.name).join(', '), 60, y, 24, '#1E7A46', 600); }
    const nx = d.tehsils && d.tehsils[0] && d.tehsils[0].next_slot; foot(x, h, nx ? 'Next update ' + nx : 'Updated ' + asOn);
    return cn;
  }
  function close(d) {
    const c = d.camp, ts = c.tehsils, h = 1350, [cn, x] = cv(h), all = ts.reduce((a, t) => a + t.ids, 0), lead = ts.slice().sort((a, b) => b.ids - a.ids);
    const title = `${fmt(all)} Farmer IDs today.` + (ts.length > 1 && lead[0].ids !== lead[1].ids ? ` ${lead[0].name} won the day.` : '');
    let y = head(x, `Farmer ID · day ${c.day_no} of ${c.days} · ${dLong(c.date)}`, title) + 40;
    ts.forEach((t, i) => { const dt0 = (d.tehsils || []).find(z => z.tehsil_id === t.tehsil_id) || {}, p = dt0.total ? Math.round(dt0.made * 100 / dt0.total) : 0, X = 60 + i * 490, w = ts.length > 1 ? 470 : 960;
      rr(x, X, y, w, 170, 22, '#F5F6F3'); tx(x, t.name, X + 26, y + 48, 28, tc(t.tehsil_id), 700); tx(x, fmt(t.ids), X + 26, y + 112, 60, '#14201B', 700); tx(x, `${p}% done · ${c.days_left} day${c.days_left === 1 ? '' : 's'} left`, X + 26, y + 152, 24, '#5E6B65'); });
    y += 200;
    const stars = ts.map(t => t.star).filter(Boolean).sort((a, b) => b.ids - a.ids), star = stars[0];
    const bests = ts.map(t => t.best).filter(Boolean).sort((a, b) => b.ids / Math.max(1, b.villages.length) - a.ids / Math.max(1, a.villages.length)), best = bests[0];
    rr(x, 60, y, 960, star && best ? 270 : 170, 24, '#FFF6DB');
    if (star) { tx(x, '★ Village of the day', 90, y + 50, 26, '#6B4A00', 700); tx(x, `${star.name} · ${fmt(star.ids)} IDs`, 90, y + 98, 36, '#14201B', 700); wrap(x, star.officials.join(', '), 90, y + 136, 900, 22, '#5E6B65', 400, 28); }
    if (best) { const by = y + (star ? 190 : 50); tx(x, '★ Official of the day', 90, by, 26, '#6B4A00', 700); tx(x, `${best.name}, ${best.designation} · ${best.villages.join(', ')}`, 90, by + 44, 28, '#14201B', 600); }
    y += (star && best ? 270 : 170) + 50;
    tx(x, 'FINAL GRADES', 60, y, 24, '#5E6B65', 700); y += 24;
    const G = { S: 0, A: 0, B: 0, C: 0, D: 0 }; ts.forEach(t => Object.keys(G).forEach(k => G[k] += (t.grades || {})[k] || 0));
    ['S', 'A', 'B', 'C', 'D'].forEach((k, i) => { const X = 60 + i * 196; chip(x, k, X + 60, y + 10, 72); tx(x, String(G[k]), X + 96, y + 124, 30, '#14201B', 700, 'center'); tx(x, WORD[k], X + 96, y + 158, 22, '#5E6B65', 400, 'center'); });
    y += 220;
    const need = ts.reduce((a, t) => a + t.villages.filter(v => v.grade !== 'S').reduce((b, v) => b + v.target, 0), 0), nv = ts.reduce((a, t) => a + t.villages.filter(v => v.grade !== 'S').length, 0);
    const low = ts.reduce((a, t) => a + t.villages.filter(v => v.grade === 'C' || v.grade === 'D').length, 0);
    if (c.days_left > 0) y = wrap(x, `Tomorrow: about ${fmt(need)} Farmer IDs needed across ${nv} villages. ${low ? low + ' village' + (low === 1 ? ' was' : 's were') + ' slow today and will be watched from 10 AM.' : ''}`, 60, y, 960, 28, '#14201B', 400, 38);
    else y = wrap(x, 'Last day of the campaign.', 60, y, 960, 28, '#14201B', 400, 38);
    return trim(cn, y, (c.tehsils.every(t => t.final) ? 'Final for ' : 'As at ' + (d.now ? t12(d.now) : '') + ', ') + `${dt(c.date).d} ${dt(c.date).m}`);
  }
  function week(d) {
    const c = d.camp, ts = c.tehsils, h = 1350, [cn, x] = cv(h), done = c.day_no - (ts.every(t => t.final) ? 0 : 1);
    let y = head(x, `Door-to-door campaign · ${dt(c.from).d} to ${dt(c.to).d} ${dt(c.to).m}`, c.days_left > 0 ? `${done} day${done === 1 ? '' : 's'} done, ${c.days - done} to go` : 'Campaign week complete') + 50;
    const cw = 108, X0 = 216;
    (ts[0].week || []).forEach((w, i) => { const q = dt(w.date); tx(x, q.w.slice(0, 3) + ' ' + q.d, X0 + i * (cw + 8) + cw / 2, y, 22, '#5E6B65', 600, 'center'); });
    y += 18;
    ts.forEach(t => { fitTx(x, t.name, 60, y + 60, 28, tc(t.tehsil_id), 700, 145);
      (t.week || []).forEach((w, i) => { const X = X0 + i * (cw + 8);
        if (w.ids === null) { x.setLineDash([8, 6]); x.strokeStyle = '#C9D0CC'; x.lineWidth = 2; x.strokeRect(X + 1, y + 1, cw - 2, 96); x.setLineDash([]); return; }
        rr(x, X, y, cw, 98, 14, tint(t.tehsil_id)); tx(x, fmt(w.ids), X + cw / 2, y + 52, 30, '#14201B', 700, 'center'); tx(x, w.grade ? 'grade ' + w.grade : 'today', X + cw / 2, y + 82, 20, '#5E6B65', 400, 'center'); });
      y += 118; });
    y += 40; tx(x, 'HOW MUCH IS DONE', 60, y, 24, '#5E6B65', 700); y += 20;
    const lines = [];
    ts.forEach(t => { const dt0 = (d.tehsils || []).find(z => z.tehsil_id === t.tehsil_id) || {}, p = dt0.total ? Math.round(dt0.made * 100 / dt0.total) : 0;
      y += 50; tx(x, t.name, 60, y, 28, tc(t.tehsil_id), 700); tx(x, `${p}%${dt0.needed ? ' → needs ' + fmt(dt0.needed) + ' a day to finish' : ''}`, 1020, y, 26, '#14201B', 400, 'right');
      y += 18; rr(x, 60, y, 960, 26, 13, '#EEF1EE'); rr(x, 60, y, Math.max(26, 960 * p / 100), 26, 13, tc(t.tehsil_id)); y += 30;
      const past = (t.week || []).filter(w => w.ids !== null && w.grade), avg = past.length ? past.reduce((a, w) => a + w.ids, 0) / past.length : 0, left = Math.max(0, (dt0.total || 0) - (dt0.made || 0));
      if (avg && left) { const days = Math.ceil(left / avg), fin = new Date(c.date + 'T12:00:00Z'); fin.setUTCDate(fin.getUTCDate() + days); const ok = fin.toISOString().slice(0, 10) <= c.to;
        lines.push(ok ? `At this week's pace ${t.name} finishes by ${fin.getUTCDate()} ${MON[fin.getUTCMonth()]}.` : `${t.name} needs about ${fmt(Math.max(0, (dt0.needed || 0) - Math.round(avg)))} more a day than this week's pace.`); } });
    y += 60; lines.forEach(l => { y = wrap(x, l, 60, y, 960, 28, '#14201B', 400, 38) + 44; });
    return trim(cn, y, `${dLong(c.date)}${d.now ? ', ' + t12(d.now) : ''}`);
  }
  window.RC = { render, headline, picture: (kind, d) => ({ slot, close, week })[kind](d), grade: g, tc, WORD };
})();
