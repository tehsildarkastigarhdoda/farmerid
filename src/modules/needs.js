/* Needs you – the full list, across modules. */
import { esc, on, hm } from '../core/dom.js';
import { sk } from '../core/ui.js';
import { register, go, current } from '../core/router.js';
import { needsList, homeEnsure, homeLoad } from './home.js';

register('os-needs', { title: 'Needs you', async render(el, a, ctx) {
  const H = await homeEnsure();
  const draw = () => { if (!ctx.alive()) return; const L = needsList(H.data), wait = Object.keys(H.busy).some(k => H.busy[k]);
    el.innerHTML = `<div class="pg nr st30"><div class="sub">${H.at ? 'Updated ' + hm(H.at) : 'Loading…'}</div><h1 class="t">Needs you</h1>
      <div class="cd">${L.map((n, i) => `<div class="nd"><i class="c ${n.c}"></i><div class="t"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></div><button class="btn s${n.k ? '' : ' o'}" data-nd="${i}">${n.b}</button></div>`).join('')
        || (wait ? `${sk(16)}<div style="height:12px"></div>${sk(16, '70%')}` : '<div class="sub" style="padding:6px 0">Nothing is waiting on you.</div>')}</div></div>`; };
  on(el, '[data-nd]', 'click', b => { const n = needsList(H.data)[Number(b.dataset.nd)]; if (n && n.go) go(n.go[0], n.go[1] || {}); });
  draw(); if (!H.at || Date.now() - H.at > 120000) { await homeLoad(); draw(); }
}, refresh() { return homeLoad(); } });
