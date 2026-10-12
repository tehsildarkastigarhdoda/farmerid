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

/* v7.7 · The full dashboard: everything, in plain words, for anyone who opens the link. */
(function () {
  const CSS = `
.fd{color:var(--ink,#14201B);font-variant-numeric:tabular-nums}
.fd-nav{position:sticky;top:0;z-index:5;display:flex;gap:6px;overflow-x:auto;padding:8px 0 10px;margin:0 0 6px;background:inherit;scrollbar-width:none}
.fd-nav::-webkit-scrollbar{display:none}
.fd-nav a{flex:none;font-size:13px;font-weight:600;padding:7px 12px;border-radius:20px;background:#fff;border:1px solid #DCE3DF;color:#1F5A3E;text-decoration:none}
.fd-sec{scroll-margin-top:64px;margin-top:30px}
.fd-h{font-size:20px;font-weight:700;letter-spacing:-.01em;margin:0 0 4px}
.fd-sub{font-size:13.5px;color:#5E6B65;margin:0 0 12px;line-height:1.45}
.fd-th{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;margin:16px 0 8px}
.fd-th i{width:10px;height:10px;border-radius:50%}
.fd-grid{display:grid;grid-template-columns:1fr;gap:10px}
@media (min-width:720px){.fd-grid{grid-template-columns:1fr 1fr}}
@media (min-width:1100px){.fd-grid{grid-template-columns:1fr 1fr 1fr}}
.fd-card{background:#fff;border:1px solid #E2E7E4;border-radius:14px;padding:14px}
.fd-vt{display:flex;align-items:center;gap:10px}.fd-vt b{font-size:16px;flex:1;min-width:0}.fd-vt .td{font-size:13px;color:#5E6B65;white-space:nowrap}.fd-vt .td b{font-size:16px;color:#14201B}
.fd-bar{height:10px;background:#EEF1EE;border-radius:6px;overflow:hidden;margin:10px 0 4px}.fd-bar i{display:block;height:100%;border-radius:6px}
.fd-pct{display:flex;justify-content:space-between;font-size:12.5px;color:#5E6B65}.fd-pct b{color:#14201B}
.fd-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px}
.fd-facts span{background:#F4F6F4;border-radius:9px;padding:6px 4px;text-align:center;font-size:11px;color:#5E6B65;line-height:1.2}.fd-facts b{display:block;font-size:16px;color:#14201B}
.fd-facts .w b{color:#9A5C00}.fd-facts .r b{color:#B3261E}
.fd-ppl{font-size:12.5px;color:#5E6B65;margin-top:8px;line-height:1.5}
.fd-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}.fd-tag{font-size:11.5px;font-weight:600;border-radius:20px;padding:3px 9px;background:#EEF1EE;color:#5E6B65}.fd-tag.g{background:#E3F2E8;color:#1E7A46}.fd-tag.a{background:#FCF0D9;color:#9A5C00}.fd-tag.r{background:#FBE4E1;color:#B3261E}
.fd-why{font-size:12.5px;margin-top:8px;color:#14201B}.fd-why span{color:#5E6B65}
.fd-kv{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 10px}.fd-kv span{background:#fff;border:1px solid #E2E7E4;border-radius:10px;padding:8px 12px;font-size:13px;color:#5E6B65}.fd-kv b{font-size:18px;color:#14201B;margin-right:4px}.fd-kv .r b{color:#B3261E}.fd-kv .a b{color:#9A5C00}.fd-kv .g b{color:#1E7A46}
.fd-pv{margin-bottom:10px}.fd-pv .vn{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14.5px;margin-bottom:6px}
.fd-pn{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#5E6B65;margin:8px 0 4px}
.fd-o{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13.5px}.fd-o .d{width:10px;height:10px;border-radius:50%;flex:none;background:#C9D0CC}.fd-o .d.P{background:#1E7A46}.fd-o .d.A{background:#B3261E}
.fd-o small{color:#5E6B65}
.fd-abs{background:#FBE4E1;border-radius:12px;padding:10px 12px;font-size:13.5px;margin:6px 0 10px}.fd-abs b{color:#B3261E}
.fd-hm{overflow-x:auto}.fd-hm table{border-collapse:separate;border-spacing:3px;font-size:12px;min-width:100%}
.fd-hm th{font-weight:600;color:#5E6B65;font-size:11px;padding:2px 4px;text-align:center}.fd-hm th:first-child{text-align:left}
.fd-hm td{text-align:center;border-radius:6px;padding:7px 4px;font-weight:700;min-width:40px}.fd-hm td:first-child{text-align:left;font-weight:600;background:none;white-space:nowrap;padding-right:8px}
.fd-hm .c0{background:transparent;border:1px dashed #D3D9D5;color:transparent}.fd-hm .cA{background:#1E7A46;color:#fff}.fd-hm .cB{background:#B9DCC5}.fd-hm .cC{background:#F4D79B}.fd-hm .cD{background:#F3C3BE}.fd-hm .cT{outline:2px solid #14201B}
.fd-tbl{width:100%;border-collapse:collapse;font-size:13px;background:#fff;border:1px solid #E2E7E4;border-radius:12px;overflow:hidden}
.fd-tbl th{text-align:left;font-size:11.5px;color:#5E6B65;font-weight:600;padding:8px 10px;background:#F4F6F4}.fd-tbl td{padding:8px 10px;border-top:1px solid #EEF1EE;vertical-align:top}
.fd-rb{display:grid;grid-template-columns:minmax(120px,1.4fr) 2fr 48px;gap:8px;align-items:center;font-size:13px;margin:6px 0}.fd-rb .tr{height:12px;background:#EEF1EE;border-radius:6px;overflow:hidden}.fd-rb .tr i{display:block;height:100%}.fd-rb b{text-align:right}
.fd-sl{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0 12px}.fd-sl span{font-size:12px;font-weight:600;border-radius:8px;padding:6px 9px;background:#EEF1EE;color:#5E6B65}
.fd-sl .ok{background:#E3F2E8;color:#1E7A46}.fd-sl .late{background:#FCF0D9;color:#9A5C00}.fd-sl .miss{background:#FBE4E1;color:#B3261E}.fd-sl .due{outline:2px solid #1F5A3E;background:#fff;color:#1F5A3E}
.dk .fd{--ink:#E7ECE9;color:#E7ECE9}.dk .fd-card,.dk .fd-nav a,.dk .fd-kv span,.dk .fd-tbl{background:#151D1A;border-color:#26302C}.dk .fd-nav a{color:#7CC79A}.dk .fd-facts span,.dk .fd-tbl th{background:#1E2824}
.dk .fd-facts b,.dk .fd-vt .td b,.dk .fd-kv b,.dk .fd-pct b,.dk .fd-why{color:#E7ECE9}.dk .fd-sub,.dk .fd-ppl,.dk .fd-o small,.dk .fd-pct,.dk .fd-vt .td{color:#9AA8A1}.dk .fd-tbl td{border-color:#26302C}.dk .fd-abs{background:#3A1F1C}
.dk .fd-bar,.dk .fd-rb .tr{background:#1E2824}
.dk .fd-tag{background:#1E2824;color:#9AA8A1}.dk .fd-tag.g{background:#173D28;color:#7CC79A}.dk .fd-tag.a{background:#3A2B12;color:#F0B95A}.dk .fd-tag.r{background:#3A1F1C;color:#F2A69C}.dk .fd-sl span{background:#1E2824}.dk .fd-sl .ok{background:#173D28;color:#7CC79A}.dk .fd-sl .late{background:#3A2B12;color:#F0B95A}.dk .fd-sl .miss{background:#3A1F1C;color:#F2A69C}
`;
  if (!document.getElementById('fd77css')) { const st = document.createElement('style'); st.id = 'fd77css'; st.textContent = CSS; document.head.appendChild(st); }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-IN');
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dd = s => { const d = new Date(s + 'T12:00:00Z'); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
  const KIND = k => String(k || '').split('+').map(x => ({ IDS: 'IDs below target', ABS: 'Absent', SORT: 'Sorting not done' })[x] || x).join(', ');
  const SL = { ok: 'on time', late: 'late', miss: 'missed', due: 'due now', over: 'missed', up: 'coming' };
  function full(root, d, o) {
    o = o || {};
    if (!d || !d.tehsils) { root.innerHTML = ''; return; }
    const c = d.camp, F = d.full || [], ts = (c ? c.tehsils : []), tcol = id => RC.tc(id);
    const cv = {}; ts.forEach(t => t.villages.forEach(v => cv[t.tehsil_id + '|' + v.name] = v));
    const days = []; if (c) { let x = c.from; for (let i = 0; i < c.days; i++) { days.push(x); const y = new Date(x + 'T12:00:00Z'); y.setUTCDate(y.getUTCDate() + 1); x = y.toISOString().slice(0, 10); } }
    const S = [['today', 'Today'], ['villages', 'Villages'], ['officials', 'Officials'], ['week', 'Day by day'], ['notices', 'Notices'], ['problems', 'Why farmers are left'], ['files', 'Portal files'], ['charts', 'Since August']];
    const sec = (id, h, sub, body) => `<section class="fd-sec" id="fd-${id}"><h2 class="fd-h">${h}</h2>${sub ? `<p class="fd-sub">${sub}</p>` : ''}${body}</section>`;
    const tHead = t => `<div class="fd-th"><i style="background:${tcol(t.tehsil_id)}"></i><span style="color:${tcol(t.tehsil_id)}">Tehsil ${esc(t.name)}</span></div>`;
    // villages
    const villages = F.map(t => tHead(t) + `<div class="fd-grid">${t.villages.map(v => { const k = cv[t.tehsil_id + '|' + v.name] || {};
      const tags = [v.sat_date ? `<span class="fd-tag g">Saturation certificate ${dd(v.sat_date)}</span>` : '', v.sat_sent ? `<span class="fd-tag g">Sent to DC ${dd(v.sat_sent)}</span>` : '', v.locked_on ? `<span class="fd-tag g">Jamabandi locked ${dd(v.locked_on)}</span>` : '',
        k.absent ? `<span class="fd-tag r">${k.absent} absent today</span>` : '', v.mut && v.mut.pending ? `<span class="fd-tag a">${v.mut.pending} inheritance mutations pending</span>` : ''].join('');
      return `<div class="fd-card"><div class="fd-vt">${RC.grade(k.grade || '')}<b>${esc(v.name)}</b><span class="td">today <b>${fmt(k.ids || 0)}</b>${k.target ? ' / ' + fmt(k.target) : ''}</span></div>
        <div class="fd-bar"><i style="width:${v.pct}%;background:${tcol(t.tehsil_id)}"></i></div><div class="fd-pct"><span><b>${fmt(v.made)}</b> of ${fmt(v.total)} farmers have a Farmer ID</span><b>${v.pct}%</b></div>
        <div class="fd-facts"><span><b>${fmt(v.left)}</b>still to do</span><span class="${v.cannot ? 'w' : ''}"><b>${fmt(v.cannot)}</b>cannot get an ID</span><span class="${v.notsorted ? 'r' : ''}"><b>${fmt(v.notsorted)}</b>not checked yet</span><span><b>${fmt(v.pending)}</b>awaiting approval</span></div>
        ${v.blocks.length ? `<div class="fd-why"><span>Main hold-up:</span> ${esc(v.blocks.map(b => b.label + ' (' + b.n + ')').join(', '))}</div>` : ''}
        <div class="fd-ppl">${k.reason ? esc(k.reason) + '<br>' : ''}Patwari: ${esc(v.patwari || '–')}${v.incharge ? ' · In-charge: ' + esc(v.incharge) : ''}</div>${tags ? `<div class="fd-tags">${tags}</div>` : ''}</div>`; }).join('')}</div>`).join('');
    // officials
    const officials = ts.map(t => { const pres = t.deployed - t.unmarked - (t.absent_list || []).length;
      return tHead(t) + `<div class="fd-kv"><span><b>${t.deployed}</b>deployed</span><span class="g"><b>${pres}</b>present</span><span class="r"><b>${(t.absent_list || []).length}</b>absent</span><span class="a"><b>${t.unmarked}</b>not marked yet</span></div>
        ${(t.absent_list || []).length ? `<div class="fd-abs"><b>Absent today:</b> ${esc(t.absent_list.map(a => a.name + ' (' + a.designation + ', ' + a.village + ')').join('; '))}</div>` : ''}
        <div class="fd-grid">${t.villages.filter(v => (v.officials || []).length).map(v => { const ps = {}; v.officials.forEach(x => (ps[x.panchayat || '–'] = ps[x.panchayat || '–'] || []).push(x));
          return `<div class="fd-card fd-pv"><div class="vn">${RC.grade(v.grade)}${esc(v.name)} <span style="font-weight:400;color:#5E6B65;font-size:12.5px">Patwari ${esc(v.patwari || '–')}</span></div>${Object.keys(ps).map(p => `<div class="fd-pn">Panchayat ${esc(p)}</div>${ps[p].map(x => `<div class="fd-o"><i class="d ${x.att}"></i><span>${esc(x.name)} <small>· ${esc(x.designation)} · ${esc(x.department)}${x.att === 'A' ? ' · <b style="color:#B3261E">absent</b>' : x.att === 'P' ? ' · present' : ''}</small></span></div>`).join('')}`).join('')}</div>`; }).join('')}</div>`; }).join('')
      + `<p class="fd-sub" style="margin-top:8px">● green present · ● red absent · ● grey not marked yet. Attendance is marked by the office from the geotagged photographs.</p>`;
    // day by day
    const today = c ? c.date : '';
    const week = F.map(t => tHead(t) + `<div class="fd-hm"><table><tr><th></th>${days.map(x => `<th>${dd(x)}</th>`).join('')}</tr>${t.villages.map(v => { const k = cv[t.tehsil_id + '|' + v.name] || {}, tg = k.target || 200;
      return `<tr><td>${esc(v.name)}</td>${days.map(x => { const n = x === today ? k.ids : v.week[x]; if (n === undefined || n === null || x > today) return '<td class="c0">·</td>'; const r = n / tg; return `<td class="${r >= 1 ? 'cA' : r >= .75 ? 'cB' : r >= .5 ? 'cC' : 'cD'} ${x === today ? 'cT' : ''}">${fmt(n)}</td>`; }).join('')}</tr>`; }).join('')}</table></div>`).join('')
      + `<p class="fd-sub" style="margin-top:8px">Farmer IDs made in each village each day. Dark green = 200 or more (or all that was left) · light green = at least 3/4 · yellow = at least half · pink = less than half. Today is outlined.</p>`;
    // notices
    const nots = F.map(t => tHead(t) + (t.notices.length ? `<table class="fd-tbl"><tr><th>For</th><th>Official</th><th>Why</th><th>Issued</th></tr>${t.notices.map(n => `<tr><td>${dd(n.date)}</td><td><b>${esc(n.name)}</b><br><small style="color:#5E6B65">${esc(n.designation)}</small></td><td>${esc(KIND(n.kind))}${n.repeat ? ' <span class="fd-tag r">second notice · reported to DC</span>' : ''}</td><td>${n.issued_on ? dd(n.issued_on) : '–'}</td></tr>`).join('')}</table>` : '<p class="fd-sub">No show-cause notice issued.</p>')).join('');
    // problems
    const probs = F.map(t => { const mx = Math.max(1, ...t.why.map(w => w.n)); const mut = t.villages.reduce((a, v) => { if (v.mut) { a.p += v.mut.pending; a.at += v.mut.attested; a.b += v.mut.backlog; a.g += v.mut.agristack; } return a; }, { p: 0, at: 0, b: 0, g: 0 });
      return tHead(t) + `<div class="fd-kv"><span class="a"><b>${fmt(t.pending)}</b>Farmer IDs waiting for the Tehsildar's approval on the portal</span><span><b>${fmt(t.villages.reduce((a, v) => a + v.notsorted, 0))}</b>landholders not checked yet</span><span><b>${fmt(t.villages.reduce((a, v) => a + v.cannot, 0))}</b>cannot get an ID</span></div>
        <div class="fd-card">${t.why.length ? t.why.map(w => `<div class="fd-rb"><span>${esc(w.label)}</span><span class="tr"><i style="width:${Math.round(w.n * 100 / mx)}%;background:${w.tier === 'A' ? '#9AA59F' : tcol(t.tehsil_id)}"></i></span><b>${fmt(w.n)}</b></div>`).join('') : '<p class="fd-sub">Nothing recorded.</p>'}
        <p class="fd-sub" style="margin:8px 0 0">Grey bars: these landholders cannot get a Farmer ID (dead, land sold, duplicate and similar). Coloured bars: they can, once the hold-up is cleared.</p></div>
        ${t.sorting.some(x => x.left) ? `<div class="fd-card" style="margin-top:10px"><b style="font-size:14px">Landholders the Patwari has not checked yet</b>${t.sorting.filter(x => x.left).map(x => `<div class="fd-o"><span><b>${esc(x.name)}</b> (Patwari) · ${fmt(x.left)} left${x.due ? ` · <b style="color:#B3261E">${fmt(x.due)} overdue</b>` : ''}<br><small>${esc(x.villages.join(', '))}</small></span></div>`).join('')}</div>` : ''}
        ${mut.p + mut.at + mut.b + mut.g ? `<div class="fd-kv" style="margin-top:10px"><span><b>${mut.p}</b>inheritance mutations pending</span><span><b>${mut.at}</b>attested</span><span><b>${mut.b}</b>in the backlog module</span><span><b>${mut.g}</b>uploaded on AgriStack</span></div>` : ''}`; }).join('');
    // files
    const files = F.map(t => { const s = t.slots || { list: [] }; return tHead(t) + `<div class="fd-sl">${s.list.map(x => `<span class="${x.st === 'over' ? 'miss' : x.st}">${String(x.t).slice(0, 5)} · ${SL[x.st] || x.st}${x.n ? ' · ' + x.n + ' IDs' : ''}</span>`).join('')}</div>`; }).join('')
      + `<p class="fd-sub">The office downloads the registered-farmer file from the AgriStack portal at 10, 11, 12, 1, 2, 3, 4, 5 and 8 PM and uploads it here. On time = within 20 minutes of the hour.</p>`;
    root.innerHTML = `<div class="fd"><nav class="fd-nav">${S.map(([k, l]) => `<a href="#fd-${k}">${l}</a>`).join('')}</nav>
      <section class="fd-sec" id="fd-today" style="margin-top:6px"><div id="fd-rc"></div></section>
      ${sec('villages', 'Every village', 'Sorted slowest first. "Still to do" = farmers who can still get an ID. "Not checked yet" = landholders the Patwari has not looked at.', villages)}
      ${c ? sec('officials', 'Who is working where today', 'Every official deployed in the door-to-door campaign, panchayat by panchayat.', officials) : ''}
      ${c ? sec('week', 'Day by day', `Campaign ${dd(c.from)} to ${dd(c.to)}.`, week) : ''}
      ${sec('notices', 'Show-cause notices', 'Issued for missing the daily target, absence from the camp, or sorting not done.', nots)}
      ${sec('problems', 'Why farmers are still left', 'What is holding up the remaining farmers, tehsil by tehsil.', probs)}
      ${sec('files', 'Portal files today', '', files)}
      <section class="fd-sec" id="fd-charts"><h2 class="fd-h">Since August</h2><div id="fd-dash"></div></section></div>`;
    RC.render(root.querySelector('#fd-rc'), d, { staff: true, all: false });
    if (window.DASH) DASH.render(root.querySelector('#fd-dash'), d, Object.assign({ noPop: !!o.noPop }, o.dash || {}));
    root.querySelectorAll('.fd-nav a').forEach(a => a.onclick = e => { e.preventDefault(); const el = root.querySelector(a.getAttribute('href')); if (el) el.scrollIntoView({ behavior: 'smooth' }); });
  }
  window.RC.full = full;
})();

/* ============ v8.0 · Today: one page for the public and the office. Plain words, three colours, Assar blue, Kastigarh purple. ============ */
(function () {
  const CSS = `
.t8{--ink:#0F1B2D;--mute:#5B6676;--line:#E1E6EE;--card:#fff;--g:#1E7A46;--gb:#E2F3E8;--y:#9A6400;--yb:#FFF1D1;--r:#C0352B;--rb:#FDE3E0;color:var(--ink);font-variant-numeric:tabular-nums;font-size:15px}
.t8 *{box-sizing:border-box}
.t8-upd{font-size:13.5px;color:var(--mute);display:flex;align-items:center;gap:6px;flex-wrap:wrap}.t8-upd i{width:8px;height:8px;border-radius:50%;background:var(--g)}.t8-upd.old{color:#8A5A00}.t8-upd.old i{background:#E0A43A}
.t8-hl{font-size:clamp(20px,5.6vw,26px);font-weight:700;line-height:1.3;margin:6px 0 14px;letter-spacing:-.01em}
.t8-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px}
.t8-sec{font-size:13px;font-weight:800;color:var(--mute);margin:16px 0 8px;text-transform:uppercase;letter-spacing:.04em}
.t8-h2h{width:100%;border-collapse:separate;border-spacing:0}
.t8-h2h th{font-size:13px;padding:9px 6px;color:#fff;font-weight:800;letter-spacing:.04em}.t8-h2h th.as{background:#1F5A9E;border-radius:10px 0 0 0}.t8-h2h th.ka{background:#7B3FA0;border-radius:0 10px 0 0}.t8-h2h th.m{background:none}
.t8-h2h td{padding:10px 6px;border-bottom:1px solid var(--line);text-align:center;font-size:15px}.t8-h2h tr:last-child td{border-bottom:0}.t8-h2h td.m{color:var(--mute);font-size:13px}.t8-h2h td b{font-size:21px}
.t8-h2h td.win b{color:var(--g)}.t8-h2h td.bad b{color:var(--r)}
.t8-lead{display:inline-block;font-size:11.5px;font-weight:800;background:#FFE8A3;color:#6B4A00;border-radius:20px;padding:2px 8px;margin-left:4px;vertical-align:2px}
.t8-race .l{display:flex;justify-content:space-between;font-size:14px;margin-top:8px}.t8-race .trk{position:relative;height:30px;border-radius:15px;margin:4px 0 2px;background:repeating-linear-gradient(90deg,#EEF1F5 0 20px,#E6EAF0 20px 40px)}
.t8-race .fill{position:absolute;left:0;top:0;bottom:0;border-radius:15px;opacity:.2}.t8-race .run{position:absolute;top:0;width:30px;height:30px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;transform:translateX(-50%);transition:left 1.2s ease;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.t8-race .exp{position:absolute;top:-4px;bottom:-4px;border-left:2px dashed var(--ink)}.t8-race .fl{position:absolute;right:6px;top:4px;font-size:16px}
.t8-band{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#fff;padding:11px 14px;border-radius:14px;font-weight:800;letter-spacing:.04em;font-size:16px;margin:22px 0 8px}
.t8-band small{font-weight:600;letter-spacing:0;font-size:13px;opacity:.9}
.t8-file{font-size:13.5px;color:var(--mute);margin:0 0 10px}.t8-file.late{color:var(--r);font-weight:700}
.t8-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.t8-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
@media (min-width:520px){.t8-tiles{grid-template-columns:repeat(4,1fr)}}
.t8-tl{border-radius:13px;padding:9px 9px 8px;min-height:74px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;border:0;font:inherit;cursor:pointer;color:inherit}
.t8-tl b{font-size:13.5px;line-height:1.15}.t8-tl .n{font-size:22px;font-weight:800;line-height:1.1}.t8-tl .n small{font-size:11.5px;font-weight:700;opacity:.8}.t8-tl .w{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.t8-tl.start{background:#E3EEFA;color:#1F4E86}.t8-tl.none{background:#EEF1F5;color:#5B6676}.t8-tl.pd{background:#CDE8D7;color:#145A33}.t8-tl.off{background:#fff;color:#5B6676;outline:2px dashed #C8D0DB;outline-offset:-2px}.t8-tl.done{background:#1E7A46;color:#fff}.t8-tl.ok{background:var(--gb);color:#145A33}.t8-tl.slow{background:var(--yb);color:#7A5000}.t8-tl.behind{background:var(--rb);color:#8E2018}.t8-tl.wait{background:#EEF1F5;color:#5B6676}
.t8-fin{font-size:14px;color:var(--g);font-weight:700;margin-top:8px}
.t8-key{display:flex;gap:6px 12px;flex-wrap:wrap;font-size:12.5px;color:var(--mute);margin-top:10px}.t8-key i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.t8-p{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}.t8-p:last-child{border-bottom:0}.t8-p .t{flex:1;min-width:0}.t8-p b{font-size:15px;display:block}.t8-p small{font-size:13px;color:var(--mute);display:block}
.t8-call{width:42px;height:42px;border-radius:12px;border:2px solid var(--g);display:flex;align-items:center;justify-content:center;color:var(--g);text-decoration:none;flex:none;font-size:18px}
.t8-hr{font-size:14px;margin-bottom:6px}.t8-hr b{font-size:16px}
.t8-bars{display:flex;align-items:flex-end;gap:5px;height:70px}.t8-bars span{flex:1;position:relative;height:100%}.t8-bars i{position:absolute;bottom:0;border-radius:4px 4px 0 0}.t8-bars .y{left:0;right:0;background:#E1E6EE}.t8-bars .t{left:22%;right:22%}
.t8-bx{display:flex;gap:5px;font-size:11px;color:var(--mute);margin-top:3px}.t8-bx span{flex:1;text-align:center}
.t8 details{margin-top:12px}.t8 details>summary{cursor:pointer;font-weight:700;font-size:15px;padding:10px 0;color:#0F1B2D;list-style:none}.t8 details>summary::before{content:'▸ ';color:var(--mute)}.t8 details[open]>summary::before{content:'▾ '}
.t8-tbl{width:100%;border-collapse:collapse;font-size:14px}.t8-tbl th{text-align:left;font-size:12px;color:var(--mute);padding:7px 8px;background:#F4F6F9}.t8-tbl td{padding:8px;border-top:1px solid var(--line);vertical-align:top}
.t8-rb{display:grid;grid-template-columns:minmax(110px,1.3fr) 2fr 44px;gap:8px;align-items:center;font-size:14px;margin:6px 0}.t8-rb .tr{height:12px;background:#EEF1F5;border-radius:6px;overflow:hidden}.t8-rb .tr i{display:block;height:100%}.t8-rb b{text-align:right}
.t8-share{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.t8-btn{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;padding:14px;font-weight:700;font-size:15px;background:#0F1B2D;color:#fff;border:0;cursor:pointer;font-family:inherit;text-decoration:none}.t8-btn.o{background:#fff;color:#0F1B2D;border:2px solid #0F1B2D}.t8-btn.g{background:#1E7A46}
@media (min-width:980px){.t8-wrap{display:grid;grid-template-columns:400px 1fr;gap:22px;align-items:start}.t8-bands{display:grid;grid-template-columns:1fr 1fr;gap:16px}.t8-bands .t8-band{margin-top:0}}
.t8-st{border-radius:16px;padding:14px;display:flex;gap:14px;align-items:center}.t8-st .n{font-size:40px;font-weight:800;line-height:1}.t8-st b{font-size:17px}
.t8-camps .cv{padding:9px 0;border-top:1px solid var(--line)}.t8-camps .cv:first-child{border-top:0}.t8-camps .cv b{font-size:15.5px}.t8-camps .cv small{display:block;color:var(--mute);font-size:13px;margin-top:2px}.t8-nod{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#E2F3E8;border-radius:12px;padding:10px 12px;margin-top:8px;font-size:14px}
.t8-pn{font-size:12px;font-weight:800;color:var(--mute);letter-spacing:.05em;text-transform:uppercase;margin:12px 0 2px}
`;
  if (!document.getElementById('t8css')) { const st = document.createElement('style'); st.id = 't8css'; st.textContent = CSS; document.head.appendChild(st); }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-IN');
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dd = s => { const d = new Date(String(s).slice(0, 10) + 'T12:00:00Z'); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
  const dw = s => { const d = new Date(String(s).slice(0, 10) + 'T12:00:00Z'); return DAY[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
  const t12 = ts => { if (!ts) return ''; const s = String(ts), h = Number(s.length > 8 ? s.slice(11, 13) : s.slice(0, 2)), m = s.length > 8 ? s.slice(14, 16) : s.slice(3, 5); return ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM'); };
  const hr = t => { const h = Number(String(t).slice(0, 2)); return ((h % 12) || 12) + ' ' + (h < 12 ? 'AM' : 'PM'); };
  const TC = { T_ASSAR: '#1F5A9E', T_KASTIGARH: '#7B3FA0' }, tc = id => TC[id] || '#3E5C50';
  const ST = { S: 'fin', P: 'pd', A: 'done', B: 'ok', C: 'slow', D: 'behind', '': 'wait' };
  const WORD = { done: 'Done', ok: 'On track', slow: 'Slow', behind: 'Behind', wait: 'Waiting', fin: 'Finished', pd: 'Practically done', start: 'Started', none: 'Not started', off: 'No camp' };
  const ORD = ['behind', 'slow', 'none', 'start', 'ok', 'done', 'wait', 'off', 'pd', 'fin'];
  const stOf = (v, t) => v.cancelled ? 'off' : v.grade === 'S' ? 'fin' : v.grade === 'P' ? 'pd' : v.grade ? ST[v.grade] : v.ids > 0 ? 'start' : 'none';
  const minsAgo = ts => { if (!ts) return 1e9; const t = Date.parse(String(ts).replace(' ', 'T') + '+05:30'); return Math.round((Date.now() - t) / 60000); };

  function model(d, c) {
    const camp = d && d.camp, F = (d && d.full) || [];
    if (!camp) return null;
    const ts = camp.tehsils.map(t => {
      const dt = (d.tehsils || []).find(x => x.tehsil_id === t.tehsil_id) || {}, f = F.find(x => x.tehsil_id === t.tehsil_id) || { villages: [], why: [], notices: [], slots: { list: [] } };
      const off = c && c.tehsils ? c.tehsils.find(x => x.tehsil_id === t.tehsil_id) : null;
      const vs = t.villages.map(v => { const fv = f.villages.find(x => x.name === v.name) || {}, ov = off ? off.villages.find(x => x.name === v.name) : null;
        return Object.assign({}, fv, { vid: v.village_id || fv.village_id, tid: t.tehsil_id, name: v.name, ids: v.ids, target: v.target, state: stOf(v, t), cancelled: v.cancelled || '', reason: v.reason, why: v.why, patwari: v.patwari || fv.patwari,
          officials: ov ? ov.officials : (v.officials || []), absent: v.absent || 0 }); });
      const live = vs.filter(v => v.state !== 'fin' && v.state !== 'pd').sort((a, b) => ORD.indexOf(a.state) - ORD.indexOf(b.state) || a.ids / (a.target || 1) - b.ids / (b.target || 1));
      const absent = (t.absent_list || []), dep = t.deployed || 0, unm = t.unmarked || 0;
      const sl = (f.slots && f.slots.list) || [], late = sl.find(x => x.st === 'over'), lateMin = late ? Math.max(0, Math.round((Date.now() - Date.parse((d.today || camp.date) + 'T' + late.t + ':00+05:30')) / 60000)) : 0;
      return { tid: t.tehsil_id, name: t.name, col: tc(t.tehsil_id), ids: t.ids, target: t.target, waiting: t.waiting, made: dt.made || 0, total: dt.total || 0, pct: dt.total ? Math.round(dt.made * 100 / dt.total) : 0,
        as_on: dt.as_on, needed: dt.needed, villages: live, finished: vs.filter(v => v.state === 'fin'), pd: vs.filter(v => v.state === 'pd'), all: vs, early: !!t.early || !!t.waiting, behind: vs.filter(v => v.state === 'behind').length, slow: vs.filter(v => v.state === 'slow').length,
        absent, deployed: dep, unmarked: unm, present: Math.max(0, dep - unm - absent.length), slots: sl, slots_y: (f.slots_y && f.slots_y.list) || [], late, lateMin, why: f.why || [], notices: f.notices || [], pending: f.pending || 0,
        star: t.star, best: t.best, grades: t.grades, final: t.final };
    });
    const lastFile = ts.map(t => t.as_on).filter(Boolean).sort().pop();
    return { camp, ts, lastFile, date: camp.date, now: d.now, expected: d.expected_pct || 0, deadline: camp.to, early: ts.every(t => t.early), plan: d.plan || [] };
  }
  const tileHtml = (v, o) => `<button class="t8-tl ${v.state}" data-v8="${esc(v.vid)}" data-t8="${esc(v.tid)}" ${o && o.edge ? `style="box-shadow:inset 4px 0 0 ${tc(v.tid)}"` : ''}><b>${esc(v.name)}</b><span class="n">${['wait', 'none', 'off'].includes(v.state) ? '–' : fmt(v.ids)}${!['wait', 'none', 'off', 'fin', 'pd'].includes(v.state) ? `<small>/${fmt(v.target)}</small>` : ''}</span><span class="w">${WORD[v.state]}</span></button>`;
  function headline(m) {
    const ts = m.ts, nm = t => `<span style="color:${t.col}">${esc(t.name)}</span>`;
    if (ts.every(t => t.waiting) && !ts.some(t => t.ids)) return 'Waiting for today’s first portal file (10 AM).';
    if (m.early) return `So far today ${ts.map(t => nm(t) + ' ' + fmt(t.ids)).join(', ')}. Villages are graded from 1 PM.`;
    const s = ts.slice().sort((a, b) => b.ids - a.ids), beh = ts.filter(t => t.ids < t.target);
    return `Today ${s.map(t => nm(t) + ' ' + fmt(t.ids)).join(', ')}. ` + (!beh.length ? 'Every target met.' : beh.length === ts.length ? (ts.length > 1 ? 'Both behind target.' : 'Behind target.') : `${nm(beh[0])} is behind target.`);
  }
  function h2h(m) {
    const [a, b] = m.ts; if (!b) return '';
    const row = (lab, x, y, hi, fmtF) => { const f = fmtF || fmt; const wa = hi === 'high' ? x > y : hi === 'low' ? x < y : false, wb = hi === 'high' ? y > x : hi === 'low' ? y < x : false, ba = hi === 'low' && x > y && x > 0, bb = hi === 'low' && y > x && y > 0;
      return `<tr><td class="${hi === 'high' && wa ? 'win' : ba ? 'bad' : ''}"><b>${f(x)}</b></td><td class="m">${lab}</td><td class="${hi === 'high' && wb ? 'win' : bb ? 'bad' : ''}"><b>${f(y)}</b></td></tr>`; };
    const lead = a.ids === b.ids ? null : a.ids > b.ids ? 'a' : 'b';
    return `<div class="t8-card" style="padding:6px"><table class="t8-h2h"><tr><th class="as" style="background:${a.col}">${esc(a.name.toUpperCase())}${lead === 'a' ? ' <span class="t8-lead">leads</span>' : ''}</th><th class="m"></th><th class="ka" style="background:${b.col}">${esc(b.name.toUpperCase())}${lead === 'b' ? ' <span class="t8-lead">leads</span>' : ''}</th></tr>
      ${row('IDs today', a.ids, b.ids, 'high')}${row('target today', a.target, b.target, '')}${row('done since Aug', a.pct, b.pct, 'high', x => x + '%')}${row('villages behind', a.behind, b.behind, 'low')}${row('absent', a.absent.length, b.absent.length, 'low')}</table></div>`;
  }
  function race(m) {
    const ex = Math.min(100, m.expected || 0);
    return `<div class="t8-card t8-race">${m.ts.map(t => `<div class="l"><b style="color:${t.col}">${esc(t.name)}</b><b>${t.pct}%</b></div><div class="trk"><div class="fill" style="width:${t.pct}%;background:${t.col}"></div>${ex ? `<div class="exp" style="left:${ex}%"></div>` : ''}<span class="fl">🏁</span><div class="run" style="left:${Math.max(4, Math.min(96, t.pct))}%;background:${t.col}">🏃</div></div>`).join('')}
      <div style="font-size:12.5px;color:#5B6676;margin-top:6px">% of farmers with a Farmer ID since August. ${ex ? `Dashed line: where both should be today (${Math.round(ex)}%).` : ''} Finish: ${dd(m.deadline)}.</div></div>`;
  }
  function gauge(t) {
    const p = t.target ? Math.min(1, t.ids / t.target) : 0, a = Math.PI * (1 - p), x = 60 + 44 * Math.cos(a), y = 60 - 44 * Math.sin(a);
    return `<div class="t8-card" style="padding:9px"><div style="font-size:12.5px;font-weight:800;color:#5B6676">TODAY VS TARGET</div><svg viewBox="0 0 120 70" width="100%" aria-hidden="true"><path d="M16 60 A44 44 0 0 1 104 60" stroke="#E6EAF0" stroke-width="12" fill="none" stroke-linecap="round"/>${p > 0 ? `<path d="M16 60 A44 44 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" stroke="${t.col}" stroke-width="12" fill="none" stroke-linecap="round"/>` : ''}<line x1="60" y1="60" x2="${(60 + 36 * Math.cos(a)).toFixed(1)}" y2="${(60 - 36 * Math.sin(a)).toFixed(1)}" stroke="#0F1B2D" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="5" fill="#0F1B2D"/></svg>
      <div style="text-align:center;margin-top:-4px"><b style="font-size:22px">${fmt(t.ids)}</b> <span style="font-size:13px;color:#5B6676">of ${fmt(t.target)}</span></div></div>`;
  }
  function ring(t) {
    const tot = Math.max(1, t.deployed), C = 2 * Math.PI * 30; let off = 0;
    const seg = (n, col) => { if (!n) return ''; const l = n / tot * C, s = `<circle r="30" cx="40" cy="40" fill="none" stroke="${col}" stroke-width="11" stroke-dasharray="${l.toFixed(1)} ${(C - l).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 40 40)"/>`; off += l; return s; };
    return `<div class="t8-card" style="padding:9px"><div style="font-size:12.5px;font-weight:800;color:#5B6676">ATTENDANCE</div><svg viewBox="0 0 80 80" width="84" style="display:block;margin:4px auto" aria-hidden="true"><circle r="30" cx="40" cy="40" fill="none" stroke="#E6EAF0" stroke-width="11"/>${seg(t.present, '#1E7A46')}${seg(t.absent.length, '#C0352B')}<text x="40" y="45" text-anchor="middle" font-size="14" font-weight="800" fill="#0F1B2D">${t.present}/${t.deployed}</text></svg>
      <div style="font-size:12px;text-align:center;color:#5B6676"><b style="color:#1E7A46">${t.present}</b> present · <b style="color:#C0352B">${t.absent.length}</b> absent · ${t.unmarked} not marked</div></div>`;
  }
  function behind(t, o) {
    const ppl = {}, mob = {};
    t.absent.forEach(a => ppl[a.name] = { name: a.name, d: a.designation, txt: `${a.village} · absent`, red: 1 });
    t.villages.filter(v => v.state === 'behind' || v.state === 'slow').forEach(v => (v.officials || []).forEach(x => { if (x.mobile) mob[x.name] = x.mobile;
      const p = ppl[x.name] = ppl[x.name] || { name: x.name, d: x.designation, txt: '', vs: [] }; if (p.vs) p.vs.push(v.name + ' ' + v.ids + '/' + v.target); }));
    const list = Object.keys(ppl).map(k => ppl[k]).map(p => Object.assign(p, { txt: p.txt || (p.vs || []).join(', ') })).sort((a, b) => (b.red || 0) - (a.red || 0));
    if (!list.length) return '';
    const sh = list.slice(0, 8);
    return `<div class="t8-sec">Who is behind · ${esc(t.name)}</div><div class="t8-card" style="padding:2px 12px">${sh.map(p => `<div class="t8-p"><span class="t"><b>${esc(p.name)}</b><small>${esc(p.d || '')} · ${p.red ? `<b style="color:#C0352B;display:inline;font-size:13px">${esc(p.txt)}</b>` : esc(p.txt)}</small></span>${o.office && mob[p.name] ? `<a class="t8-call" href="tel:${esc(mob[p.name])}" aria-label="Call">✆</a>` : ''}</div>`).join('')}${list.length > 8 ? `<div class="t8-p"><small>and ${list.length - 8} more</small></div>` : ''}</div>`;
  }
  function hours(t) {
    const cum = l => { let s = 0; return l.map(x => { s += Number(x.n) || 0; return x.at || x.st === 'ok' || x.st === 'late' ? s : null; }); };
    const ct = cum(t.slots), cy = (() => { let s = 0; return t.slots_y.map(x => { s += Number(x.n) || 0; return s; }); })();
    const last = ct.reduce((a, x, i) => x !== null ? i : a, -1); if (last < 0) return '';
    const mx = Math.max(1, ...cy, ...ct.filter(x => x !== null)), lab = t.slots[last] ? hr(t.slots[last].t) : '';
    return `<div class="t8-sec">Hour by hour · ${esc(t.name)}</div><div class="t8-card"><div class="t8-hr">By ${lab}: today <b style="color:${t.col}">${fmt(ct[last])}</b> · yesterday by ${lab} <b>${fmt(cy[last] || 0)}</b></div>
      <div class="t8-bars">${t.slots.map((x, i) => `<span><i class="y" style="height:${(cy[i] || 0) / mx * 100}%"></i>${ct[i] !== null ? `<i class="t" style="height:${ct[i] / mx * 100}%;background:${t.col}"></i>` : ''}</span>`).join('')}</div><div class="t8-bx">${t.slots.map(x => `<span>${hr(x.t).replace(' AM', '').replace(' PM', '')}</span>`).join('')}</div>
      <div class="t8-key"><span><i style="background:${t.col}"></i>today, running total</span><span><i style="background:#E1E6EE"></i>yesterday</span></div></div>`;
  }
  const key = m => m && m.early ? `<div class="t8-key"><span><i style="background:#E3EEFA;border:1px solid #BCD2EE"></i>Started</span><span><i style="background:#EEF1F5;border:1px solid #D5DBE3"></i>Not started</span><span><i style="background:#1E7A46"></i>Target met</span><span>Grades (On track, Slow, Behind) from 1 PM</span></div>` : `<div class="t8-key"><span><i style="background:#1E7A46"></i>Done</span><span><i style="background:#E2F3E8;border:1px solid #BFD9C8"></i>On track</span><span><i style="background:#FFF1D1;border:1px solid #EBD39A"></i>Slow</span><span><i style="background:#FDE3E0;border:1px solid #EDB9B3"></i>Behind</span><span><i style="background:#CDE8D7;border:1px solid #A9D3B9"></i>Practically done</span></div>`;
  function band(t, o) {
    const fileLine = t.late ? `<div class="t8-file late">⚠ ${hr(t.late.t)} file late by ${t.lateMin} min</div>` : `<div class="t8-file">${t.as_on ? 'Figures from the ' + t12(t.as_on) + ' file' : 'No file yet today'}</div>`;
    return `<div class="t8-tband"><div class="t8-band" style="background:${t.col}">${esc(t.name.toUpperCase())}<small>${fmt(t.ids)} / ${fmt(t.target)} today</small></div>${fileLine}
      <div class="t8-two">${gauge(t)}${ring(t)}</div>
      <div class="t8-tiles">${t.villages.map(v => tileHtml(v)).join('')}</div>${t.finished.length ? `<div class="t8-fin">✓ Finished: ${esc(t.finished.map(v => v.name).join(', '))}</div>` : ''}${t.pd.length ? `<div class="t8-fin" style="color:#145A33">◑ Practically done (only dead / away / no Aadhaar link left): ${esc(t.pd.map(v => v.name).join(', '))}</div>` : ''}
      ${behind(t, o)}${hours(t)}</div>`;
  }
  function extras(m) {
    const nots = m.ts.map(t => `<div style="font-weight:800;color:${t.col};margin:10px 0 4px">${esc(t.name)}</div>` + (t.notices.length ? `<table class="t8-tbl"><tr><th>For</th><th>Official</th><th>Why</th></tr>${t.notices.slice(0, 40).map(n => `<tr><td>${dd(n.date)}</td><td><b>${esc(n.name)}</b><br><small style="color:#5B6676">${esc(n.designation)}</small></td><td>${esc(String(n.kind).split('+').map(k => ({ IDS: 'Village below target', ABS: 'Absent', SORT: 'Checking not done' })[k] || k).join(', '))}${n.repeat ? ' · second notice' : ''}</td></tr>`).join('')}</table>` : '<p style="color:#5B6676;margin:4px 0">None.</p>')).join('');
    const why = m.ts.map(t => { const mx = Math.max(1, ...t.why.map(w => w.n)); return `<div style="font-weight:800;color:${t.col};margin:10px 0 4px">${esc(t.name)} · ${fmt(t.pending)} waiting for approval on the portal</div>` + t.why.slice(0, 10).map(w => `<div class="t8-rb"><span>${esc(w.label)}</span><span class="tr"><i style="width:${Math.round(w.n * 100 / mx)}%;background:${w.tier === 'A' ? '#9AA5B1' : t.col}"></i></span><b>${fmt(w.n)}</b></div>`).join(''); }).join('') + '<p style="font-size:12.5px;color:#5B6676">Grey: cannot get an ID (dead, land sold, duplicate…). Coloured: can get one once the problem is cleared.</p>';
    return `<details><summary>Show-cause notices</summary>${nots}</details><details><summary>Why farmers are left</summary>${why}</details>`;
  }
  function camps(m, o) {
    if (!m.plan || !m.plan.length) return '';
    return m.plan.map(p => { const when = p.date === m.date ? 'Today’s camps' : 'Tomorrow’s camps';
      return `<details class="t8-camps" ${o.openCamps ? 'open' : ''}><summary>${when} · <span style="color:${tc(p.tehsil_id)}">${esc(p.name)}</span> · ${dw(p.date)} · ${p.villages.length} villages</summary>
        <div class="t8-card">${p.villages.map(v => v.places.map(x => `<div class="cv"><b>${esc(v.name)}</b> · ${esc(x.camp_point || '')}${x.panchayat ? ` <span style="color:#5B6676;font-size:13px">(Panchayat ${esc(x.panchayat)})</span>` : ''}<small>${esc(x.officials.join(', '))}</small></div>`).join('')).join('')}
        <div class="t8-nod"><span>Help: Nodal Officer <b>${esc(p.nodal.name)}</b>, ${esc(p.nodal.designation)}</span><a class="t8-call" href="tel:${esc(p.nodal.mobile)}" aria-label="Call">✆</a></div><div style="font-size:12.5px;color:#5B6676;margin-top:6px">9 AM to 5 PM. Bring Aadhaar card and the mobile linked to Aadhaar. Free of cost.</div></div></details>`; }).join('');
  }
  function today(root, d, o) {
    o = o || {}; const m = model(d, o.c76);
    if (!m) { root.innerHTML = '<div class="t8"><div class="t8-hl">Loading the latest figures…</div></div>'; return; }
    const ago = minsAgo(m.lastFile), old = ago > 90 && ago < 1e8;
    root.innerHTML = `<div class="t8"><div class="t8-upd ${old ? 'old' : ''}"><i></i>${!m.lastFile ? 'No portal file yet today' : old ? 'No new file since ' + t12(m.lastFile) : 'Updated ' + (ago < 1 ? 'just now' : ago + ' min ago') + ' · ' + t12(m.lastFile) + ' file'} · ${dw(m.date)} · day ${m.camp.day_no} of the campaign${m.camp.days_left ? ' · ' + m.camp.days_left + ' day' + (m.camp.days_left === 1 ? '' : 's') + ' to ' + dd(m.deadline) : ''}</div>
      ${o.top || ''}<div class="t8-wrap"><div><div class="t8-hl">${headline(m)}</div>${h2h(m)}<div class="t8-sec">Race to 100% · finish ${dd(m.deadline)}</div>${race(m)}${o.left || ''}</div>
      <div class="t8-bands">${m.ts.map(t => band(t, o)).join('')}</div></div>${key(m)}${camps(m, o)}${o.extras === false ? '' : extras(m)}${o.bottom || ''}</div>`;
    root.querySelectorAll('[data-v8]').forEach(b => b.onclick = () => o.onVillage ? o.onVillage(b.dataset.v8, b.dataset.t8) : village(root, d, b.dataset.v8, Object.assign({}, o, { back: () => today(root, d, o) })));
    requestAnimationFrame(() => root.querySelectorAll('.t8-race .run').forEach(r => { const l = r.style.left; r.style.left = '4%'; requestAnimationFrame(() => setTimeout(() => r.style.left = l, 30)); }));
  }
  function findV(d, vid, c) { const m = model(d, c); if (!m) return null; for (const t of m.ts) { const v = t.all.find(x => String(x.vid) === String(vid)); if (v) return { m, t, v }; } return null; }
  function village(root, d, vid, o) {
    o = o || {}; const f = findV(d, vid, o.c76); if (!f) { root.innerHTML = '<div class="t8"><p>Village not found.</p></div>'; return; }
    const { t, v } = f, S2 = { done: ['#1E7A46', '#fff'], ok: ['#E2F3E8', '#145A33'], slow: ['#FFF1D1', '#7A5000'], behind: ['#FDE3E0', '#8E2018'], wait: ['#EEF1F5', '#5B6676'], fin: ['#1E7A46', '#fff'], pd: ['#CDE8D7', '#145A33'], start: ['#E3EEFA', '#1F4E86'], none: ['#EEF1F5', '#5B6676'], off: ['#FFFFFF', '#5B6676'] }[v.state];
    const ps = {}; (v.officials || []).forEach(x => (ps[x.panchayat || '–'] = ps[x.panchayat || '–'] || []).push(x));
    const ed = !!o.edit, ea = ed && o.att !== false;
    root.innerHTML = `<div class="t8">${o.back && !o.noBack ? '<button class="t8-btn o" id="bk8" style="width:auto;padding:9px 14px;margin-bottom:10px">← Back</button>' : ''}
      <div style="font-size:24px;font-weight:800">${esc(v.name)}</div><div style="color:#5B6676;font-size:14px;margin-bottom:10px"><span style="color:${t.col};font-weight:700">${esc(t.name)}</span> · Patwari ${esc(v.patwari || '–')}</div>
      <div class="t8-st" style="background:${S2[0]};color:${S2[1]}"><span class="n">${['wait', 'none', 'off'].includes(v.state) ? '–' : v.state === 'fin' || v.state === 'pd' ? '✓' : fmt(v.ids)}</span><span><b>${WORD[v.state]}</b><br><span style="font-size:14px">${v.state === 'fin' ? 'No farmer left who can get an ID' : v.state === 'pd' ? 'Only farmers who are dead, living outside or without an Aadhaar-linked mobile are left' : v.state === 'off' ? esc(v.reason || 'No camp today') : v.state === 'none' || v.state === 'start' ? (v.ids ? fmt(v.ids) + ' so far · ' : '') + 'graded from 1 PM · target ' + fmt(v.target) : 'of ' + fmt(v.target) + ' today · ' + esc(v.reason || '')}</span></span></div>
      <div class="t8-two" style="margin-top:10px"><div class="t8-card"><div style="font-size:13px;color:#5B6676">Done since August</div><div style="font-size:26px;font-weight:800">${v.pct || 0}%</div><div style="font-size:13px;color:#5B6676">${fmt(v.made)} of ${fmt(v.total)} farmers</div></div>
        <div class="t8-card"><div style="font-size:13px;color:#5B6676">Farmers left</div><div style="font-size:26px;font-weight:800">${fmt(v.left)}</div><div style="font-size:13px;color:#5B6676">${fmt(v.cannot)} cannot get ID · ${fmt(v.notsorted)} not checked</div></div></div>
      <div class="t8-sec">${ea ? 'Attendance today · P present · A absent · L leave / duty' : 'People working here today'}</div><div class="t8-card" style="padding:4px 12px">${Object.keys(ps).map(p => `<div class="t8-pn">Panchayat ${esc(p)}</div>${ps[p].map(x => `<div class="t8-p"><span class="t"><b>${esc(x.name)}</b><small>${esc(x.designation)} · ${esc(x.department)}${!ea ? (x.att === 'A' ? ' · <b style="color:#C0352B;display:inline;font-size:13px">absent</b>' : x.att === 'P' ? ' · present' : x.att === 'L' ? ' · leave / duty' : ' · not marked') : ''}</small></span>
        ${ea ? `<i class="ob82" data-ob="${esc(x.key)}"></i><span class="pa8 pa81"><button class="${x.att === 'P' ? 'on P' : ''}" data-att8="P" data-k="${esc(x.key)}">P</button><button class="${x.att === 'A' ? 'on A' : ''}" data-att8="A" data-k="${esc(x.key)}">A</button><button class="${x.att === 'L' ? 'on L' : ''}" data-att8="L" data-k="${esc(x.key)}">L</button></span>` : ''}${o.office && x.mobile ? `<a class="t8-call" href="tel:${esc(x.mobile)}" aria-label="Call">✆</a>` : ''}${ed ? `<button class="x8" data-end8="${esc(x.post_id)}" aria-label="Remove">✕</button>` : ''}</div>`).join('')}`).join('') || '<p style="color:#5B6676">Nobody deployed.</p>'}</div>
      ${ed ? '<button class="t8-btn o" id="add8" style="width:100%;margin-top:10px">＋ Add a person</button>' : ''}
      ${(v.blocks || []).length ? `<div class="t8-sec">Why farmers are left</div><div class="t8-card">${v.blocks.map(b => `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14.5px"><span>${esc(b.label)}</span><b>${fmt(b.n)}</b></div>`).join('')}</div>` : ''}
      ${v.sat_date || v.locked_on ? `<div class="t8-sec">Certificate</div><div class="t8-card" style="font-size:14.5px">${v.sat_date ? '✓ Saturation certificate ' + dd(v.sat_date) : ''}${v.sat_sent ? '<br>✓ Sent to the DC office ' + dd(v.sat_sent) : ''}${v.locked_on ? '<br>✓ Jamabandi locked ' + dd(v.locked_on) : ''}</div>` : ''}
      ${o.bottom || ''}</div>`;
    const bk = root.querySelector('#bk8'); if (bk) bk.onclick = o.back;
    if (o.bind) o.bind(root, v, t);
  }

  /* ---------- pictures for the group ---------- */
  const F = 'Inter, "Segoe UI", Roboto, Arial, sans-serif';
  const PC = { done: ['#1E7A46', '#FFFFFF'], ok: ['#E2F3E8', '#145A33'], slow: ['#FFF1D1', '#7A5000'], behind: ['#FDE3E0', '#8E2018'], wait: ['#EEF1F5', '#5B6676'], fin: ['#1E7A46', '#FFFFFF'], pd: ['#CDE8D7', '#145A33'], start: ['#E3EEFA', '#1F4E86'], none: ['#EEF1F5', '#5B6676'], off: ['#FFFFFF', '#5B6676'] };
  function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#F3F5F8'; x.fillRect(0, 0, w, h); return [c, x]; }
  function rr(x, X, Y, w, h, r, fill) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); x.fillStyle = fill; x.fill(); }
  function tx(x, s, X, Y, size, color, weight, align) { x.font = `${weight || 400} ${size}px ${F}`; x.fillStyle = color || '#0F1B2D'; x.textAlign = align || 'left'; x.fillText(String(s), X, Y); }
  function fit(x, s, X, Y, size, color, weight, maxW, align) { let z = size; x.font = `${weight || 400} ${z}px ${F}`; while (z > 12 && x.measureText(s).width > maxW) { z--; x.font = `${weight || 400} ${z}px ${F}`; } tx(x, s, X, Y, z, color, weight, align); }
  function picture(d, shape, close) {
    const m = model(d); if (!m) return null;
    const W = 1080, H = shape === 'story' ? 1920 : 2600, [c, x] = cv(W, H), ts = m.ts;
    const s = ts.slice().sort((a, b) => b.ids - a.ids), all = ts.reduce((a, t) => a + t.ids, 0);
    rr(x, 0, 0, W, 150, 0, '#0F1B2D'); tx(x, `FARMER ID · ${dw(m.date).toUpperCase()} · ${close ? 'DAY CLOSE' : t12(m.lastFile || m.now).toUpperCase()}`, 60, 62, 28, '#AFC0D6', 700);
    const title = close ? `${fmt(all)} Farmer IDs today${ts.length > 1 && s[0].ids !== s[1].ids ? '. ' + s[0].name + ' won the day.' : '.'}` : ts.length > 1 ? (s[0].ids === s[1].ids ? `Level today: ${fmt(s[0].ids)} each` : `${s[0].name} leads, ${fmt(s[0].ids)} to ${fmt(s[1].ids)}`) : `${ts[0].name}: ${fmt(ts[0].ids)} today`;
    fit(x, title, 60, 120, 46, '#FFFFFF', 800, 960);
    let y = 190;
    // head-to-head
    const cw = ts.length > 1 ? 470 : 960;
    ts.forEach((t, i) => { const X = 60 + i * 490; rr(x, X, y, cw, 300, 26, '#FFFFFF'); rr(x, X, y, cw, 62, 26, t.col); x.fillStyle = t.col; x.fillRect(X, y + 30, cw, 32);
      tx(x, t.name.toUpperCase(), X + 28, y + 44, 30, '#FFFFFF', 800);
      tx(x, fmt(t.ids), X + 28, y + 150, 84, '#0F1B2D', 800); tx(x, `of ${fmt(t.target)} today`, X + 30, y + 192, 28, '#5B6676', 500);
      tx(x, `${t.pct}% done since Aug`, X + 30, y + 236, 28, '#0F1B2D', 700);
      tx(x, `${t.behind} behind · ${t.absent.length} absent`, X + 30, y + 276, 28, t.behind || t.absent.length ? '#C0352B' : '#1E7A46', 700); });
    y += 330;
    if (close) { const st = ts.map(t => t.star).filter(Boolean).sort((a, b) => b.ids - a.ids)[0], be = ts.map(t => t.best).filter(Boolean)[0];
      if (st || be) { rr(x, 60, y, 960, be && st ? 150 : 90, 22, '#FFF4D6'); if (st) tx(x, `⭐ Village of the day: ${st.name} · ${fmt(st.ids)}`, 90, y + 56, 32, '#5A3E00', 800); if (be) fit(x, `⭐ Official of the day: ${be.name}, ${be.designation}`, 90, y + (st ? 116 : 56), 30, '#5A3E00', 700, 900); y += (be && st ? 150 : 90) + 30; } }
    if (shape === 'story') { tx(x, 'RACE TO 100%', 60, y + 20, 26, '#5B6676', 800); y += 40; ts.forEach(t => { fit(x, t.name, 60, y + 32, 28, t.col, 800, 250); tx(x, t.pct + '%', 380, y + 32, 28, '#0F1B2D', 800, 'right'); rr(x, 400, y + 8, 620, 34, 17, '#E6EAF0'); rr(x, 400, y + 8, Math.max(34, 620 * t.pct / 100), 34, 17, t.col); y += 56; }); y += 20; }
    // tiles: every tehsil in its own block, worst village first
    const cols = shape === 'story' ? 3 : 4, gap = 14, tw = (960 - gap * (cols - 1)) / cols, th = shape === 'story' ? 140 : 128;
    tx(x, close ? 'EVERY VILLAGE · FINAL' : m.early ? 'EVERY VILLAGE SO FAR · GRADES FROM 1 PM' : 'EVERY VILLAGE TODAY', 60, y + 20, 26, '#5B6676', 800); y += 40;
    const nRows = ts.reduce((a, t) => a + Math.ceil(t.villages.length / cols), 0), extra = ts.reduce((a, t) => a + 70 + (t.finished.length + t.pd.length ? 42 : 0), 0);
    const th2 = shape === 'story' ? Math.max(86, Math.min(th, (H - 130 - y - extra - gap * Math.max(0, nRows - ts.length)) / Math.max(1, nRows))) : th;
    ts.forEach(t => {
      rr(x, 60, y, 960, 54, 14, t.col); tx(x, t.name.toUpperCase(), 84, y + 37, 29, '#FFFFFF', 800); tx(x, `${fmt(t.ids)} / ${fmt(t.target)} today`, 996, y + 37, 25, '#FFFFFF', 600, 'right'); y += 68;
      t.villages.forEach((v, i) => { const X = 60 + (i % cols) * (tw + gap), Y = y + Math.floor(i / cols) * (th2 + gap), p = PC[v.state];
        rr(x, X, Y, tw, th2, 18, p[0]); if (v.state === 'off') { x.strokeStyle = '#C8D0DB'; x.lineWidth = 3; x.setLineDash([10, 8]); x.strokeRect(X + 2, Y + 2, tw - 4, th2 - 4); x.setLineDash([]); }
        fit(x, v.name, X + 20, Y + th2 * 0.3, 26, p[1], 700, tw - 30); const big = ['wait', 'none', 'off'].includes(v.state) ? '–' : fmt(v.ids);
        tx(x, big, X + 20, Y + th2 * 0.68, th2 * 0.32, p[1], 800);
        if (!['wait', 'none', 'off'].includes(v.state)) { x.font = `800 ${th2 * 0.32}px ${F}`; const w0 = x.measureText(big).width; tx(x, '/' + fmt(v.target), X + 24 + w0, Y + th2 * 0.68, 20, p[1], 600); }
        fit(x, WORD[v.state].toUpperCase(), X + 20, Y + th2 - 14, 18, p[1], 800, tw - 30); });
      y += Math.ceil(t.villages.length / cols) * (th2 + gap);
      const fl = [t.finished.length ? '✓ Finished: ' + t.finished.map(v => v.name).join(', ') : '', t.pd.length ? '◑ Practically done: ' + t.pd.map(v => v.name).join(', ') : ''].filter(Boolean).join('   ');
      if (fl) { fit(x, fl, 60, y + 26, 24, '#1E7A46', 700, 960); y += 42; }
      y += 6; });
    // key + footer
    if (shape !== 'story') { const Hn = Math.max(900, Math.ceil(y + 130)); if (Hn < H) { const [c2, x2] = cv(W, Hn); x2.drawImage(c, 0, 0); return foot80(c2, x2, Hn, close, d, m); } }
    return foot80(c, x, H, close, d, m);
  }
  function foot80(c, x, H, close, d, m) {
    let kx = 60; (m && m.early ? [['Started', '#BCD2EE'], ['Not started', '#D5DBE3'], ['Target met', '#1E7A46']] : [['Done', '#1E7A46'], ['On track', '#BFE3CC'], ['Slow', '#F6D88E'], ['Behind', '#F2B8B0']]).forEach(([w, col]) => { rr(x, kx, H - 98, 24, 24, 6, col); tx(x, w, kx + 32, H - 78, 22, '#5B6676', 600); x.font = `600 22px ${F}`; kx += 32 + x.measureText(w).width + 28; });
    const nx = (d.tehsils || [])[0] && d.tehsils[0].next_slot;
    tx(x, close ? 'IDs made tonight count in tomorrow’s first file' : nx ? 'Next update ' + hr(nx) : '', 60, H - 36, 24, '#5B6676', 500);
    tx(x, 'Tehsil offices Assar & Kastigarh', 1020, H - 36, 24, '#5B6676', 500, 'right');
    return c;
  }
  function message(d, close, link) {
    const m = model(d); if (!m) return '';
    const ts = m.ts, L = [], vs = []; ts.forEach(t => t.villages.forEach(v => vs.push(v)));
    L.push(close ? `*Farmer ID · Day close · ${dw(m.date)}*` : `*Farmer ID · ${t12(m.lastFile || m.now)} · ${dw(m.date)}*`);
    L.push(ts.map(t => `${t.name} *${fmt(t.ids)}*`).join(' · '));
    const bh = vs.filter(v => v.state === 'behind'), sl = vs.filter(v => v.state === 'slow'), ns = vs.filter(v => v.state === 'none');
    if (m.early) { L.push('_Villages are graded from 1 PM._'); if (ns.length) L.push('⚪ Not started: ' + ns.map(v => v.name).join(', ')); }
    if (bh.length) L.push('🔴 Behind: ' + bh.map(v => v.name + ' ' + v.ids).join(', '));
    if (sl.length) L.push('🟡 Slow: ' + sl.map(v => v.name + ' ' + v.ids).join(', '));
    const ab = ts.reduce((a, t) => a.concat(t.absent.map(x => x.name)), []); if (ab.length) L.push('🚫 Absent: ' + ab.join(', '));
    if (close) { const st = ts.map(t => t.star).filter(Boolean).sort((a, b) => b.ids - a.ids)[0]; if (st) L.push('⭐ Village of the day: ' + st.name + ' ' + st.ids); if (bh.length + sl.length || ab.length) L.push('_Show-cause notices tomorrow morning._'); }
    const pd = ts.reduce((a, t) => a.concat(t.pd.map(v => v.name)), []); if (pd.length) L.push('◑ Practically done: ' + pd.join(', '));
    if (link) L.push('Full details: ' + link);
    return L.join('\n');
  }
  window.T8 = { today, village, picture, message, model, t12, dw, dd, tc, WORD };
})();
