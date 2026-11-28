/* All modules (the More tab). Modules marked Soon are shown to the Tehsildar only. */
import { esc, on } from '../core/dom.js';
import { pill, svg } from '../core/ui.js';
import { register, go, reset } from '../core/router.js';
import { role, rk, svmOn, mtgWho, certWho } from '../core/session.js';

const MODS = [['Schemes', [['os-home', 'Farmer ID', 'Agristack buckets, camps, 4:30 report', 'fid'], ['svm12', 'SVAMITVA', 'Abadi deh, property cards', 'map']]],
  ['Office', [['m28', 'Meetings', 'Notices, agenda, information, brief, minutes', 'meet'], ['c25', 'Certificates', 'JanSugam reports and remarks', 'cert'], ['dir14', 'Directions', 'Given and their status', 'doc'],
    ['', 'Dak Section', 'Inward, outward, reply due', 'dak'], ['', 'Grievances', 'Samadhan, PG portal', 'griev'], ['', 'RTI', '30-day clock, appeals', 'doc'], ['', 'Establishment (DDO)', 'Staff, leave, notices, bills', 'ppl']]],
  ['Courts and land', [['', 'Revenue Court Cases', 'Cause list, orders, remands', 'court'], ['', 'High Court Cases', 'Para-wise replies, compliance', 'court'], ['', 'State Land & Encroachment', 'Kahcharai, Shamilat, eviction', 'land']]],
  ['Magisterial and other duties', [['', 'Magisterial', 'Istegasa, BNSS 126/136', 'lock'], ['', 'Relief', 'SDRF ex-gratia cases', 'ppl'], ['', 'Elections (AERO)', 'Forms 6/7/8, BLOs', 'check'], ['', 'Census', 'HLO Phase-I', 'ppl']]],
  ['Tools', [['rep8', 'Reports', 'Daily, weekly, DC formats', 'doc'], ['camps10', 'Camps', 'Daily camps, deployment', 'camp'], ['ins19', 'Insights', 'Rank, pace, villages', 'ins'], ['cov10', 'Coverage', 'Village-wise status', 'cov'],
    ['ppl83', 'People', 'Field officials, attendance', 'ppl'], ['os-staff', 'Staff & logins', 'Add people, reset PINs, switch off', 'lock'], ['set8', 'My settings', 'PIN, text size · Log out', 'set']]]];

register('os-mods', { title: 'All modules', render(el) {
  const teh = role() === 'ADMIN', K = rk(), field = K === 'gq' || K === 'oq';
  const hide = { camps10: field, ins19: K === 'gq', ppl83: field, 'os-staff': ['ADMIN', 'DA'].indexOf(role()) < 0, svm12: !svmOn(), m28: !mtgWho(), c25: !certWho(), dir14: !teh && K !== 'nt' && K !== 'da' };
  el.innerHTML = `<div class="pg nr st30"><div class="sub">TehsilOS</div><h1 class="t">All modules</h1>
    ${MODS.map(g => { const L = g[1].filter(m => m[0] ? !hide[m[0]] : teh); if (!L.length) return '';
      return `<div class="hd2">${g[0]}</div><div class="cd pl0">${L.map(m => `<button class="pr${m[0] ? '' : ' off'}" ${m[0] ? `data-g="${m[0]}"` : 'disabled'}><span class="av" style="background:#E8F2EC;color:#0E5E3B">${svg(m[3], 18)}</span><span class="nm"><b>${esc(m[1])}</b><small>${esc(m[2])}</small></span>${m[0] ? '' : pill('Soon', '')}</button>`).join('')}</div>`; }).join('')}
    ${teh ? '<p class="ft">Only you see the modules marked Soon.</p>' : ''}</div>`;
  on(el, '[data-g]', 'click', b => { const n = b.dataset.g; if (n === 'os-home') reset('os-home'); else go(n, {}); });
} });
