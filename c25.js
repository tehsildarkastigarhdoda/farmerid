/* TehsilOS 12.5.0 — Certificates (JanSugam).
 * Enter the Application No.: the Patwari fills the proforma on the phone (help in English / Hinglish / Urdu),
 * gets the PDF/Word to upload and the "Patwari Report" text; the NT, GQ, BCG and Tehsildar then see it in their inbox,
 * pre-filled, and add only their own check and recommendation. Blank proformas for every role, no App No. needed.
 * Step 1: EWS (P5). Other services show their name and arrive service by service.
 */
"use strict";
(function () {
const V25 = '12.5.0', LIM = 1600;
const N = x => Number(x || 0).toLocaleString('en-IN');
const view = () => $('#view');
const wideOn = t => { setHeader(t); document.body.classList.add('wide'); };
const loading = t => { view().innerHTML = `<div class="t12"><p class="sub">${esc(t || 'Loading…')}</p><div class="cd" style="height:90px"></div><div class="cd" style="height:140px"></div></div>`; };
const dmy = d => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4) : (d || '');
const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
const num = x => { const n = parseFloat(String(x == null ? '' : x).replace(/[, ]/g, '')); return isFinite(n) ? n : 0; };
const has = x => String(x == null ? '' : x).trim() !== '';
const r2 = x => Math.round(x * 100) / 100;
const mask = s => String(s || '').replace(/\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b/g, (m, a, b, c) => 'XXXX XXXX ' + c);

/* ---------- who am I ---------- */
const who = () => { const u = me() || {}; if (S.boot && S.boot.fid25) return ''; if (u.role === 'ADMIN') return 'teh'; if (u.role === 'NT') return 'nt'; if (u.role === 'DA') return 'da';
  const d = String(u.designation || ''); return /patwari/i.test(d) ? 'ph' : /\bGQ\b|girdawar/i.test(d) ? '' : /\bBCG\b/i.test(d) ? 'da' : /\bOQ\b|office\s*qanungo/i.test(d) ? 'oq' : ''; };
const WHO = { ph: 'Patwari', nt: 'Naib Tehsildar', gq: 'Girdawar Qanungo', da: 'BCG (Dealing Assistant)', teh: 'Tehsildar', oq: 'Office Qanungo' };

/* ---------- the 25 services ---------- */
const SVC = [
  ['CHR', 'Character Certificate', 'Remarks'], ['RAS', 'Family Income/Property – Rehabilitation Assistance', 'P1'], ['PRP', 'Property Certificate (up to ₹20 lakh)', 'P2'],
  ['SNC', 'Senior Citizen Certificate', 'Remarks'], ['LHC', 'Legal Heir Certificate', 'P3'], ['DOM', 'Domicile Certificate', 'P11'], ['ST', 'ST Certificate', 'P4'],
  ['GEN', 'General Caste Certificate', 'Remarks'], ['EWS', 'Income & Assets Certificate for EWS', 'P5'], ['RBA', 'RBA Certificate', 'P6'],
  ['IDC', 'Income Dependency Certificate', 'P7'], ['SEB', 'OBC (for J&K) Certificate', 'P8'], ['DEP', 'Dependent Certificate', 'P7'],
  ['PRP2', 'Property Certificate (beyond ₹20 lakh)', 'P2'], ['UNE', 'Certificate of Unemployment', 'Remarks'], ['REL', 'Religion Certificate', 'Remarks'],
  ['NRM', 'Non-remarriage Certificate', 'P9'], ['INC', 'Income Certificate', 'P7'], ['OBCC', 'OBC Certificate – for GoI Institutions', 'P8'],
  ['SC', 'SC Certificate', 'P4'], ['AGR', 'Agriculture Certificate', 'P10'], ['UWD', 'Unmarried / Widow / Divorce Certificate', 'P9'],
  ['IB', 'IB Certificate (area adjoining International Border)', 'P6'], ['PEP', 'Pahari Ethnic People Category Certificate', 'P4'], ['DOG', 'Dogra Certificate', 'Remarks']
].map(r => ({ code: r[0], name: r[1], pf: r[2], live: r[0] === 'EWS' }));
const svc = c => SVC.find(s => s.code === c);
const PREFIX = { EWS: 'EWS', DOM: 'DOM', SEB: 'SEB', IDC: 'IDC', UWD: 'UWD' };
const learnt = () => { try { return JSON.parse(localStorage.getItem('c25pfx') || '{}'); } catch (e) { return {}; } };
const svcOf = app => { const m = /^JK-[A-Z]+-([A-Z]+)\//.exec(app || ''); if (!m) return ''; return PREFIX[m[1]] || learnt()[m[1]] || ''; };
const normApp = s => String(s || '').toUpperCase().replace(/\s+/g, '');
const appOk = s => /^JK-[A-Z]+-[A-Z]+\/\d{4}\/\d+$/.test(s);

/* ---------- language ---------- */
const LANGS = [['en', 'English'], ['hi', 'Hinglish'], ['ur', 'اردو']];
let lang = (() => { try { return localStorage.getItem('c25lang') || ''; } catch (e) { return ''; } })() || (who() === 'ph' ? 'hi' : 'en');
const T = a => !a ? '' : typeof a === 'string' ? a : (a[{ en: 0, hi: 1, ur: 2 }[lang]] || a[0]);
const tl = a => { const s = T(a); return lang === 'ur' && a && a[2] ? `<span dir="rtl" lang="ur" style="display:block;text-align:right;font-size:14px;line-height:1.7">${esc(s)}</span>` : esc(s); };

/* ---------- styles ---------- */
const css = document.createElement('style');
css.textContent = `.c25 .cd h3{margin:0 0 6px}.c25 .f{display:block;font-size:13px;font-weight:800;margin:12px 0 3px}.c25 .hl{font-size:12.5px;color:#5B6168;margin:0 0 5px;line-height:1.45}
.c25 input,.c25 select,.c25 textarea{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:10px 12px;border:1px solid #DDD5CC;border-radius:12px;background:#fff;color:#1E2226}
.c25 textarea{min-height:80px;resize:vertical}.c25 .g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.c25 .g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.c25 .rw{border-top:1px solid #F0EBE5;padding:8px 0}.c25 .rw:first-child{border-top:0}.c25 .err{background:#FBE9E7;color:#A1261B;border-radius:10px;padding:8px 10px;font-size:13px;font-weight:700;margin-top:6px}
.c25 .wrn{background:#FFF4DC;color:#6B4400;border-radius:10px;padding:8px 10px;font-size:13px;font-weight:700;margin-top:6px}.c25 .okb{background:#E6F2EA;color:#1F6B42;border-radius:10px;padding:8px 10px;font-size:13px;font-weight:700;margin-top:6px}
.c25 .seg{display:flex;gap:6px;flex-wrap:wrap}.c25 .seg button{flex:1;min-height:42px;border-radius:10px;border:1.5px solid #CFC7BE;background:#fff;font:800 13.5px Nunito,system-ui,sans-serif;color:#1E2226;padding:0 8px}
.c25 .seg button.on{border:2px solid #9A3F1C;background:#FBEFE9;color:#7A3014}.c25 .seg.g button.on{border-color:#1F6B42;background:#E6F2EA;color:#1F6B42}.c25 .seg.r button.on{border-color:#A1261B;background:#FBE9E7;color:#A1261B}
.c25 .bar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin:8px 0 2px}.c25 .bar i{height:6px;border-radius:3px;background:#E3DBD2}.c25 .bar i.d{background:#1F6B42}.c25 .bar i.c{background:#9A3F1C}
.c25 .lg{display:flex;gap:4px}.c25 .lg button{min-height:32px;padding:0 9px;border-radius:8px;border:1.5px solid #CFC7BE;background:#fff;font:800 12px Nunito,system-ui,sans-serif;color:#1E2226}.c25 .lg button.on{border:2px solid #9A3F1C;background:#FBEFE9;color:#7A3014}
.c25 .tx{background:#F7F4F0;border-radius:12px;padding:10px 12px;font-size:13.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word}
.c25 .mu{font-size:12.5px;color:#5B6168}.c25 .del{border:0;background:none;color:#A1261B;font-weight:800;font-size:13px;padding:4px 0}.c25 .add{border:1.5px dashed #CFC7BE;background:#fff;border-radius:12px;width:100%;min-height:42px;font:800 14px Nunito,system-ui,sans-serif;color:#1E2226;margin-top:8px}
.c25 .ft{display:flex;gap:10px;padding:4px 0 12px}.c25 .ft .btn12{flex:1}
.c25 table.tt{width:100%;border-collapse:collapse;font-size:13px}.c25 table.tt td,.c25 table.tt th{border-top:1px solid #F0EBE5;padding:6px 4px;text-align:left;vertical-align:top}.c25 .pill{white-space:nowrap}
.pwn95{grid-template-columns:none!important;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr)}
.c25 .qa{font-size:13.5px;line-height:1.5;margin-top:6px}.c25 .qa b{display:block}`;
document.head.appendChild(css);

/* =====================================================================================
 * EWS (P5) — fields, help, doubts, checks
 * ===================================================================================== */
const PARTS = [
  ['Applicant', ['Applicant', 'Applicant', 'درخواست گزار']], ['Family', ['Family', 'Parivar', 'خاندان']], ['Income', ['Income', 'Kamai', 'آمدنی']],
  ['Land', ['Land', 'Zameen', 'زمین']], ['House & plot', ['House & plot', 'Ghar aur plot', 'مکان اور پلاٹ']], ['Enquiry', ['Enquiry', 'Poochh-taachh', 'تحقیق']],
  ['Finding', ['Finding', 'Nateeja', 'نتیجہ']]];
const H = {
  name: ['As written on the application.', 'Application mein jaisa likha hai, waisa hi.', 'درخواست میں جیسا لکھا ہے، ویسا ہی۔'],
  father: ['Father\'s name (S/o, D/o or W/o).', 'Walid ka naam (S/o, D/o ya W/o).', 'والد کا نام (ولد، دختر یا زوجہ)۔'],
  cat: ['Central EWS (Government of India) or UT EWS (J&K) – as applied for.', 'Central (Bharat Sarkar) ya UT (J&K) – jo application mein maanga hai.', 'مرکزی (حکومتِ ہند) یا یو ٹی (جموں و کشمیر) – جو درخواست میں مانگا گیا ہو۔'],
  recv: ['Date the application was marked to you on JanSugam.', 'JanSugam par application aapko kis din mili.', 'جن سوگم پر درخواست آپ کو کس تاریخ کو ملی۔'],
  due: ['Last date shown on JanSugam (PSGA).', 'JanSugam par likhi aakhri tareekh (PSGA).', 'جن سوگم پر درج آخری تاریخ۔'],
  visit: ['Date you visited the house: not before the marking date, not after today.', 'Ghar kis din dekha: milne ki tareekh se pehle nahi, aaj ke baad nahi.', 'گھر کس دن دیکھا: ملنے کی تاریخ سے پہلے نہیں، آج کے بعد نہیں۔'],
  rc: ['Ration card number. The family list must match it.', 'Ration card number. Family ki list isi se milayein.', 'راشن کارڈ نمبر۔ خاندان کی فہرست اسی سے ملائیں۔'],
  fam: ['Write everyone on the ration card. The app decides who counts: applicant, parents, spouse, and brothers/sisters/children under 18.', 'Ration card ke sab log likhein. Kaun ginega, app khud batayega: applicant, maa-baap, pati/patni, aur 18 se kam bhai-behan/bachche.', 'راشن کارڈ کے سب افراد لکھیں۔ کون شمار ہوگا، ایپ خود بتائے گی: درخواست گزار، والدین، شوہر/بیوی، اور ۱۸ سال سے کم بہن بھائی/بچے۔'],
  inc: ['Income of FY {FY} – the year before the application. One line per earning member and source, with its basis.', 'Saal {FY} ki kamai – application se pichhla saal. Har kamane wale aur har zariye ki alag line, sabot ke saath.', 'مالی سال {FY} کی آمدنی – درخواست سے پچھلا سال۔ ہر کمانے والے اور ہر ذریعہ کی الگ سطر، ثبوت کے ساتھ۔'],
  basis: ['Basis: salary slip, wage rate × days, crop × area × rate, pension PPO, etc.', 'Sabot: salary slip, mazdoori × din, fasal × raqba × rate, pension PPO waghaira.', 'ثبوت: تنخواہ کی پرچی، مزدوری × دن، فصل × رقبہ × ریٹ، پنشن پی پی او وغیرہ۔'],
  land: ['Every holding of the family in your halqa from the latest Jamabandi. Joint land: only the family\'s share.', 'Halqa mein family ki har zameen, taaza Jamabandi se. Saanjhi zameen: sirf family ka hissa.', 'حلقہ میں خاندان کی ہر زمین، تازہ جمع بندی سے۔ مشترکہ زمین: صرف خاندان کا حصہ۔'],
  out: ['Land or property outside your halqa (any district or State): Yes/No and how you know.', 'Halqa ke bahar zameen/jaidad (kisi bhi zile/riyasat mein): Haan/Nahi aur kaise pata chala.', 'حلقہ سے باہر زمین/جائیداد (کسی بھی ضلع یا ریاست میں): ہاں/نہیں اور کیسے معلوم ہوا۔'],
  house: ['Measure every floor: length × breadth in feet. Walls count; staircase and common area do not.', 'Har manzil napein: lambai × chaurai feet mein. Deewar shamil, seedhi aur common jagah nahi.', 'ہر منزل ناپیں: لمبائی × چوڑائی فٹ میں۔ دیواریں شامل، سیڑھی اور مشترکہ جگہ نہیں۔'],
  plot: ['Plot = covered + open area (courtyard) of the house plot. Farming land next to it is not plot.', 'Plot = ghar ka dhaka hua + khula hissa (aangan). Saath wala khet plot nahi.', 'پلاٹ = مکان کا ڈھکا ہوا + کھلا حصہ (صحن)۔ ساتھ والا کھیت پلاٹ نہیں۔'],
  muni: ['Is the house inside a notified municipality? Kastigarh villages: No.', 'Kya ghar notified municipality mein hai? Kastigarh ke gaon: Nahi.', 'کیا مکان نوٹیفائیڈ میونسپلٹی میں ہے؟ کستی گڑھ کے گاؤں: نہیں۔'],
  comm: ['Shop or other commercial building of the family? It counts in the house/plot tests.', 'Family ki dukaan ya commercial imarat? Woh bhi ghar/plot test mein ginti hai.', 'خاندان کی دکان یا تجارتی عمارت؟ وہ بھی مکان/پلاٹ کے ٹیسٹ میں شمار ہوتی ہے۔'],
  wit: ['At least 2 witnesses with parentage; at least one not related to the applicant.', 'Kam se kam 2 gawah, walidiyat ke saath; ek gawah applicant ka rishtedaar na ho.', 'کم از کم ۲ گواہ، ولدیت کے ساتھ؛ ایک گواہ درخواست گزار کا رشتہ دار نہ ہو۔'],
  recs: ['Tick only the records you saw yourself, with number or year.', 'Sirf woh record tick karein jo khud dekhe, number ya saal ke saath.', 'صرف وہ ریکارڈ ٹک کریں جو خود دیکھے، نمبر یا سال کے ساتھ۔'],
  adv: ['Anything against the claim. If nothing, write NIL.', 'Claim ke khilaf koi baat. Kuch nahi to NIL likhein.', 'دعوے کے خلاف کوئی بات۔ کچھ نہیں تو NIL لکھیں۔'],
  rec: ['If any test fails, the app makes it Not Recommended. Write the reason in your own words.', 'Koi test fail ho to app khud Not Recommended karega. Wajah apne lafzon mein likhein.', 'کوئی ٹیسٹ فیل ہو تو ایپ خود Not Recommended کرے گی۔ وجہ اپنے الفاظ میں لکھیں۔'],
  rule: ['For Not Recommended: the rule failed, e.g. Rule 21(viii)(ii) – house above 1000 sq ft.', 'Not Recommended ke liye: kaunsa rule fail hua, jaise Rule 21(viii)(ii) – ghar 1000 sq ft se bada.', 'Not Recommended کے لیے: کون سا رول فیل ہوا، جیسے رول 21(viii)(ii) – مکان ۱۰۰۰ مربع فٹ سے بڑا۔'],
  encl: ['Every paper you will upload, with its pages. The BCG counts them.', 'Jo bhi kaghaz upload karenge, safhon ke saath. BCG ginega.', 'جو بھی کاغذ اپلوڈ کریں گے، صفحات کے ساتھ۔ بی سی جی گنے گا۔']
};
const DOUBTS = [
  [[['Name differs in Aadhaar and ration card?', 'Aadhaar aur ration card mein naam alag hai?', 'آدھار اور راشن کارڈ میں نام الگ ہے؟'], ['Write it as in the application. Write the difference under Adverse facts.', 'Application wala naam likhein. Farq "Adverse facts" mein likhein.', 'درخواست والا نام لکھیں۔ فرق "Adverse facts" میں لکھیں۔']],
   [['Central or UT – which one?', 'Central ya UT – kaunsa?', 'مرکزی یا یو ٹی – کون سا؟'], ['As applied for. The tests are the same: income below ₹8 lakh, and land, house and plot within limits.', 'Jo application mein hai. Test ek jaise: kamai 8 lakh se kam, zameen, ghar, plot had mein.', 'جو درخواست میں ہے۔ ٹیسٹ ایک جیسے: آمدنی ۸ لاکھ سے کم، زمین، مکان اور پلاٹ حد میں۔']]],
  [[['Parents live separately – count them?', 'Maa-baap alag rehte hain – ginein?', 'والدین الگ رہتے ہیں – شمار کریں؟'], ['Yes. Parents and their income always count (DoPT FAQ 26).', 'Haan. Maa-baap aur unki kamai hamesha ginein (DoPT FAQ 26).', 'ہاں۔ والدین اور ان کی آمدنی ہمیشہ شمار ہوگی (ڈی او پی ٹی FAQ 26)۔']],
   [['Brother is 19 and earns – count him?', 'Bhai 19 saal ka hai aur kamata hai – ginein?', 'بھائی ۱۹ سال کا ہے اور کماتا ہے – شمار کریں؟'], ['No. Brothers/sisters 18 or older are not family for EWS; leave out his income too (FAQ 25).', 'Nahi. 18 ya zyada umar ke bhai-behan EWS family nahi; unki kamai bhi na ginein (FAQ 25).', 'نہیں۔ ۱۸ یا زیادہ عمر کے بہن بھائی ای ڈبلیو ایس خاندان نہیں؛ ان کی آمدنی بھی شمار نہ کریں (FAQ 25)۔']],
   [['Married sister still on the ration card?', 'Shaadishuda behan abhi ration card par hai?', 'شادی شدہ بہن ابھی راشن کارڈ پر ہے؟'], ['Write her. If she is 18 or older the app does not count her.', 'Likhein. 18 ya zyada ho to app usko nahi ginega.', 'لکھیں۔ ۱۸ یا زیادہ ہو تو ایپ اسے شمار نہیں کرے گی۔']]],
  [[['Is pension income?', 'Pension bhi kamai hai?', 'کیا پنشن بھی آمدنی ہے؟'], ['Yes. Gross income includes pension and family pension (FAQ 15–17).', 'Haan. Gross kamai mein pension aur family pension shamil (FAQ 15–17).', 'ہاں۔ مجموعی آمدنی میں پنشن اور فیملی پنشن شامل (FAQ 15–17)۔']],
   [['Applicant wrote one lump sum, e.g. ₹2,40,000?', 'Applicant ne ek hi raqam likhi, jaise ₹2,40,000?', 'درخواست گزار نے ایک ہی رقم لکھی، جیسے ₹2,40,000؟'], ['Not accepted. Break it member-wise with basis; the app adds the total.', 'Nahi chalega. Har member ki alag line, sabot ke saath; total app jodega.', 'قبول نہیں۔ ہر فرد کی الگ سطر، ثبوت کے ساتھ؛ کل رقم ایپ جوڑے گی۔']],
   [['Does farming income count?', 'Kheti ki kamai bhi ginni hai?', 'کیا کھیتی کی آمدنی بھی شمار ہوگی؟'], ['Yes. Income from all sources counts for EWS: salary, farming, business, wages (Rule 21(viii)).', 'Haan. EWS mein har zariye ki kamai: tankhwah, kheti, karobar, mazdoori (Rule 21(viii)).', 'ہاں۔ ای ڈبلیو ایس میں ہر ذریعہ کی آمدنی: تنخواہ، کھیتی، کاروبار، مزدوری (رول 21(viii))۔']]],
  [[['Land still in grandfather\'s name, not divided?', 'Zameen abhi dada ke naam, taqseem nahi hui?', 'زمین ابھی دادا کے نام، تقسیم نہیں ہوئی؟'], ['Do not count it (FAQ 4). Write it under Adverse facts. Parents\' undivided land counts in full (FAQ 1).', 'Na ginein (FAQ 4). Adverse facts mein likhein. Maa-baap ki bina taqseem zameen poori ginti hai (FAQ 1).', 'شمار نہ کریں (FAQ 4)۔ Adverse facts میں لکھیں۔ والدین کی غیر تقسیم شدہ زمین پوری شمار ہوگی (FAQ 1)۔']],
   [['Land in another district?', 'Doosre zile mein zameen?', 'دوسرے ضلع میں زمین؟'], ['All land everywhere is added together (FAQ 2). Write it under "outside halqa".', 'Har jagah ki zameen jodi jaati hai (FAQ 2). "Halqa ke bahar" mein likhein.', 'ہر جگہ کی زمین جوڑی جاتی ہے (FAQ 2)۔ "حلقہ سے باہر" میں لکھیں۔']],
   [['How many kanal is 5 acres?', '5 acre kitne kanal?', '۵ ایکڑ کتنے کنال؟'], ['40 kanal (8 kanal = 1 acre). The app converts.', '40 kanal (8 kanal = 1 acre). App khud badlega.', '۴۰ کنال (۸ کنال = ۱ ایکڑ)۔ ایپ خود تبدیل کرے گی۔']]],
  [[['Two-storey house?', 'Do manzila ghar?', 'دو منزلہ مکان؟'], ['Measure both floors. Any house above 1000 sq ft fails, in a village too (Div. Com. Jammu, 04.04.2026).', 'Dono manzil napein. 1000 sq ft se bada ghar fail, gaon mein bhi (Div. Com. Jammu, 04.04.2026).', 'دونوں منزلیں ناپیں۔ ۱۰۰۰ مربع فٹ سے بڑا مکان فیل، گاؤں میں بھی (ڈویژنل کمشنر جموں، 04.04.2026)۔']],
   [['Does the courtyard count?', 'Aangan bhi ginna hai?', 'کیا صحن بھی شمار ہوگا؟'], ['Yes. The whole house plot, covered + open (FAQ 7).', 'Haan. Poora plot, dhaka + khula (FAQ 7).', 'ہاں۔ پورا پلاٹ، ڈھکا + کھلا (FAQ 7)۔']],
   [['Field next to the house?', 'Ghar ke saath wala khet?', 'گھر کے ساتھ والا کھیت؟'], ['Land used for farming is agricultural land, not plot (FAQ 9). Write it in Land.', 'Kheti wali zameen agricultural hai, plot nahi (FAQ 9). Zameen mein likhein.', 'کھیتی والی زمین زرعی ہے، پلاٹ نہیں (FAQ 9)۔ زمین میں لکھیں۔']]],
  [[['Lambardar is the applicant\'s relative?', 'Lambardar applicant ka rishtedaar hai?', 'لمبردار درخواست گزار کا رشتہ دار ہے؟'], ['Mark him "Relative" and add one witness who is not related.', 'Usko "Relative" likhein aur ek gair-rishtedaar gawah jodein.', 'اسے "Relative" لکھیں اور ایک غیر رشتہ دار گواہ شامل کریں۔']],
   [['Witness mobile number?', 'Gawah ka mobile number?', 'گواہ کا موبائل نمبر؟'], ['Optional. It is not printed in the report or the remark.', 'Zaroori nahi. Report aur remark mein nahi chhapta.', 'ضروری نہیں۔ رپورٹ اور ریمارک میں نہیں چھپتا۔']]],
  [[['Can I write "eligible subject to verification"?', 'Kya "eligible subject to verification" likh sakte hain?', 'کیا "eligible subject to verification" لکھ سکتے ہیں؟'], ['No. Only Recommended or Not Recommended, with the reason.', 'Nahi. Sirf Recommended ya Not Recommended, wajah ke saath.', 'نہیں۔ صرف Recommended یا Not Recommended، وجہ کے ساتھ۔']],
   [['What do I upload?', 'Upload kya karna hai?', 'اپلوڈ کیا کرنا ہے؟'], ['Print the PDF, sign every page, scan it with the annexures, upload it, and paste the remark text.', 'PDF print karein, har safhe par dastakhat, annexures ke saath scan karke upload karein, aur remark paste karein.', 'پی ڈی ایف پرنٹ کریں، ہر صفحے پر دستخط، ضمیموں کے ساتھ اسکین کر کے اپلوڈ کریں، اور ریمارک پیسٹ کریں۔']]]
];
const RELS = ['Self', 'Father', 'Mother', 'Husband', 'Wife', 'Brother', 'Sister', 'Son', 'Daughter', 'Other'];
const SRCS = ['Salary', 'Pension / family pension', 'Daily wages', 'Agriculture', 'Horticulture', 'Livestock', 'Business / shop', 'Rent', 'Other'];
const WREL = ['Not related', 'Relative', 'Lambardar', 'Chowkidar', 'Neighbour'];
const RECS = ['Ration card', 'Jamabandi', 'Girdawari', 'Salary slip / certificate', 'Pension PPO', 'Electoral roll', 'Shajra / map'];
const ENCL0 = [['Annexure A – Ration card copy', ''], ['Annexure B – Jamabandi / Fard', ''], ['Annexure C – Income proofs', ''], ['Annexure D – Witness statements', ''], ['Annexure E – Site sketch', '1']];
const blankPH = () => ({ name: '', father: '', village: '', cat: '', recv: '', due: '', visit: '', rc: '', fam: [{ n: '', age: '', rel: 'Self' }], inc: [], land: [], out: '', outDet: '',
  floors: [{ l: '', b: '' }], pL: '', pB: '', muni: 'N', comm: 'N', commDet: '', wit: [{}, {}], recs: {}, recNo: {}, adv: '', rec: '', why: '', rule: '', encl: ENCL0.map(e => ({ t: e[0], p: e[1] })) });
const counts = m => { const r = m.rel, a = num(m.age); return ['Self', 'Father', 'Mother', 'Husband', 'Wife'].indexOf(r) >= 0 ? true : ['Brother', 'Sister', 'Son', 'Daughter'].indexOf(r) >= 0 ? (has(m.age) && a < 18) : false; };
const fyOf = d => { const x = /^(\d{4})-(\d{2})/.exec(d || today()); const y = Number(x[1]), m = Number(x[2]); const s = m >= 4 ? y - 1 : y - 2; return s + '-' + String(s + 1).slice(2); };
function calc(D) {
  const fam = (D.fam || []).filter(m => has(m.n)), inFam = fam.filter(counts), out = fam.filter(m => !counts(m));
  const incTotal = (D.inc || []).reduce((a, r) => a + num(r.amt), 0);
  const landK = (D.land || []).reduce((a, r) => a + num(r.k) + num(r.m) / 20, 0), acres = landK / 8;
  const built = (D.floors || []).reduce((a, f) => a + num(f.l) * num(f.b), 0), plotFt = num(D.pL) * num(D.pB), plotYd = plotFt / 9, plotLim = D.muni === 'Y' ? 100 : 200;
  const tests = [
    { k: 'inc', label: 'Gross family income FY ' + fyOf(D.recv), limit: 'below ₹8,00,000', found: '₹' + N(incTotal), ok: incTotal < 800000, rule: 'Rule 21(viii) – income' },
    { k: 'land', label: 'Agricultural land (family)', limit: 'below 5 acres (40 kanal)', found: r2(landK) + ' kanal (' + r2(acres) + ' acre)' + (D.out === 'Y' ? ' + outside halqa' : ''), ok: acres < 5, rule: 'Rule 21(viii)(i) – agricultural land' },
    { k: 'flat', label: 'House built-up area', limit: 'below 1000 sq ft', found: N(built) + ' sq ft', ok: built < 1000, rule: 'Rule 21(viii)(ii) – residential flat/house' },
    { k: 'plot', label: 'Residential plot (covered + open)', limit: 'below ' + plotLim + ' sq yd' + (D.muni === 'Y' ? ' (notified municipality)' : ' (elsewhere)'), found: N(Math.round(plotYd)) + ' sq yd', ok: plotYd < plotLim, rule: D.muni === 'Y' ? 'Rule 21(viii)(iii) – plot in notified municipality' : 'Rule 21(viii)(iv) – plot elsewhere' }];
  const pages = (D.encl || []).reduce((a, e) => a + num(e.p), 0);
  return { fy: fyOf(D.recv), fam, inFam, out, incTotal, landK, acres, built, plotFt, plotYd, plotLim, tests, allOk: tests.every(t => t.ok), pages };
}
/* errors per part: [en, hi, ur] */
function errs(i, D) {
  const E = [], c = calc(D), e = (a, b, u) => E.push([a, b, u]);
  if (i === 0) {
    if (!has(D.name)) e('Write the applicant\'s name.', 'Applicant ka naam likhein.', 'درخواست گزار کا نام لکھیں۔');
    if (!has(D.father)) e('Write the father\'s name.', 'Walid ka naam likhein.', 'والد کا نام لکھیں۔');
    if (!has(D.village)) e('Write the village.', 'Gaon likhein.', 'گاؤں لکھیں۔');
    if (!D.cat) e('Choose Central, UT or Both.', 'Central, UT ya Both chunein.', 'مرکزی، یو ٹی یا دونوں چنیں۔');
    if (!D.recv) e('Write the date the application reached you.', 'Application milne ki tareekh likhein.', 'درخواست ملنے کی تاریخ لکھیں۔');
    if (!D.visit) e('Write the date of your visit.', 'Visit ki tareekh likhein.', 'دورے کی تاریخ لکھیں۔');
    if (D.visit && D.recv && D.visit < D.recv) e('Visit date is before the application reached you.', 'Visit ki tareekh application milne se pehle hai.', 'دورے کی تاریخ درخواست ملنے سے پہلے ہے۔');
    if (D.visit && D.visit > today()) e('Visit date is in the future.', 'Visit ki tareekh aage ki hai.', 'دورے کی تاریخ آگے کی ہے۔');
  }
  if (i === 1) {
    if (!has(D.rc)) e('Write the ration card number.', 'Ration card number likhein.', 'راشن کارڈ نمبر لکھیں۔');
    if (!c.fam.some(m => m.rel === 'Self')) e('Add the applicant ("Self").', 'Applicant ("Self") jodein.', 'درخواست گزار ("Self") شامل کریں۔');
    c.fam.forEach(m => { if (!has(m.age)) e(m.n + ': write the age.', m.n + ': umar likhein.', m.n + ': عمر لکھیں۔'); });
    (D.fam || []).forEach(m => { if (!has(m.n) && (has(m.age) || m.rel !== 'Self')) e('A family line has no name.', 'Ek line mein naam nahi.', 'ایک سطر میں نام نہیں۔'); });
  }
  if (i === 2) {
    if (!(D.inc || []).length) e('Add at least one income line (write 0 with basis if no income).', 'Kam se kam ek kamai ki line jodein (kamai nahi to 0 aur wajah).', 'کم از کم ایک آمدنی کی سطر شامل کریں (آمدنی نہیں تو 0 اور وجہ)۔');
    (D.inc || []).forEach((r, k) => { const n = 'Line ' + (k + 1);
      if (!has(r.m)) e(n + ': choose the member.', n + ': member chunein.', n + ': فرد چنیں۔');
      if (!has(r.basis)) e(n + ': write the basis of the amount.', n + ': raqam ka sabot likhein.', n + ': رقم کا ثبوت لکھیں۔');
      if (!has(r.amt)) e(n + ': write the amount.', n + ': raqam likhein.', n + ': رقم لکھیں۔');
      if (has(r.m) && !c.inFam.some(m => m.n === r.m)) e(n + ': ' + r.m + ' is not counted family – remove this line.', n + ': ' + r.m + ' family mein nahi ginta – line hatayein.', n + ': ' + r.m + ' خاندان میں شمار نہیں – سطر ہٹائیں۔'); });
  }
  if (i === 3) {
    (D.land || []).forEach((r, k) => { const n = 'Land ' + (k + 1); if (!has(r.kh) || !has(r.ks)) e(n + ': write Khewat and Khasra numbers.', n + ': Khewat aur Khasra number likhein.', n + ': کھیوٹ اور خسرہ نمبر لکھیں۔');
      if (!has(r.k) && !has(r.m)) e(n + ': write the family\'s share.', n + ': family ka hissa likhein.', n + ': خاندان کا حصہ لکھیں۔'); });
    if (!D.out) e('Land outside your halqa: choose Yes or No.', 'Halqa ke bahar zameen: Haan ya Nahi chunein.', 'حلقہ سے باہر زمین: ہاں یا نہیں چنیں۔');
    if (D.out && !has(D.outDet)) e(D.out === 'Y' ? 'Write where and how much land outside.' : 'Write how you know there is no land outside (affidavit, enquiry, online record).', D.out === 'Y' ? 'Bahar kahan aur kitni zameen, likhein.' : 'Kaise pata ki bahar zameen nahi (halafnama, poochh-taachh, online record).', D.out === 'Y' ? 'باہر کہاں اور کتنی زمین، لکھیں۔' : 'کیسے معلوم کہ باہر زمین نہیں (حلف نامہ، تحقیق، آن لائن ریکارڈ)۔');
  }
  if (i === 4) {
    if (!(D.floors || []).some(f => num(f.l) && num(f.b))) e('Measure the house: length and breadth.', 'Ghar napein: lambai aur chaurai.', 'مکان ناپیں: لمبائی اور چوڑائی۔');
    if (!num(D.pL) || !num(D.pB)) e('Measure the plot (covered + open).', 'Plot napein (dhaka + khula).', 'پلاٹ ناپیں (ڈھکا + کھلا)۔');
    if (c.plotFt && c.built && c.plotFt < Math.max.apply(null, (D.floors || []).map(f => num(f.l) * num(f.b)))) e('Plot is smaller than the house – check the measurements.', 'Plot ghar se chhota hai – naap dobara dekhein.', 'پلاٹ مکان سے چھوٹا ہے – پیمائش دوبارہ دیکھیں۔');
    if (D.comm === 'Y' && !has(D.commDet)) e('Write the commercial property and its area.', 'Commercial jaidad aur uska raqba likhein.', 'تجارتی جائیداد اور اس کا رقبہ لکھیں۔');
  }
  if (i === 5) {
    const W = (D.wit || []).filter(w => has(w.n));
    if (W.length < 2) e('Write at least 2 witnesses.', 'Kam se kam 2 gawah likhein.', 'کم از کم ۲ گواہ لکھیں۔');
    W.forEach(w => { if (!has(w.p)) e(w.n + ': write parentage.', w.n + ': walidiyat likhein.', w.n + ': ولدیت لکھیں۔'); if (!w.r) e(w.n + ': choose relation to applicant.', w.n + ': applicant se rishta chunein.', w.n + ': درخواست گزار سے رشتہ چنیں۔'); });
    if (W.length && !W.some(w => w.r && w.r !== 'Relative')) e('At least one witness must not be a relative.', 'Ek gawah rishtedaar na ho.', 'ایک گواہ رشتہ دار نہ ہو۔');
    const R = Object.keys(D.recs || {}).filter(k => D.recs[k]); if (!R.length) e('Tick the records you examined.', 'Jo record dekhe, tick karein.', 'جو ریکارڈ دیکھے، ٹک کریں۔');
    R.forEach(k => { if (!has((D.recNo || {})[k])) e(k + ': write its number or year.', k + ': number ya saal likhein.', k + ': نمبر یا سال لکھیں۔'); });
    if (!has(D.adv)) e('Adverse facts: write the facts or NIL.', 'Adverse facts: baat likhein ya NIL.', 'منفی حقائق: بات لکھیں یا NIL۔');
  }
  if (i === 6) {
    if (!D.rec) e('Choose Recommended or Not Recommended.', 'Recommended ya Not Recommended chunein.', 'Recommended یا Not Recommended چنیں۔');
    if (D.rec === 'R' && !c.allOk) e('A test fails – it cannot be Recommended.', 'Ek test fail hai – Recommended nahi ho sakta.', 'ایک ٹیسٹ فیل ہے – Recommended نہیں ہو سکتا۔');
    if (!has(D.why) || String(D.why).trim().length < 15) e('Write the reason (at least one full sentence).', 'Wajah likhein (kam se kam ek poora jumla).', 'وجہ لکھیں (کم از کم ایک پورا جملہ)۔');
    if (D.rec === 'N' && !has(D.rule)) e('Write the rule or clause that fails.', 'Kaunsa rule/clause fail hua, likhein.', 'کون سا رول/شق فیل ہوئی، لکھیں۔');
    if (!(D.encl || []).some(x => has(x.t) && num(x.p))) e('List the enclosures with pages.', 'Enclosures aur unke safhe likhein.', 'ضمیمے اور ان کے صفحات لکھیں۔');
    (D.encl || []).forEach(x => { if (has(x.t) && !num(x.p)) e(x.t + ': write pages, or remove the line.', x.t + ': safhe likhein ya line hatayein.', x.t + ': صفحات لکھیں یا سطر ہٹائیں۔'); });
  }
  return E;
}
const allErrs = D => PARTS.map((p, i) => errs(i, D));

/* ---------- words ---------- */
function words(n) {
  n = Math.round(Number(n) || 0); if (!n) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'],
    b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const two = x => x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? ' ' + a[x % 10] : ''), three = x => (x >= 100 ? a[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' : '') : '') + (x % 100 ? two(x % 100) : '');
  const p = []; const cr = Math.floor(n / 1e7); n %= 1e7; const lk = Math.floor(n / 1e5); n %= 1e5; const th = Math.floor(n / 1e3); n %= 1e3;
  if (cr) p.push(three(cr) + ' Crore'); if (lk) p.push(two(lk) + ' Lakh'); if (th) p.push(two(th) + ' Thousand'); if (n) p.push(three(n));
  return p.join(' ');
}

/* =====================================================================================
 * Texts: the remarks (≤1600) and the documents
 * ===================================================================================== */
const fit = (parts) => { let s = parts.filter(Boolean).join(' '); return s.length <= LIM ? s : s.slice(0, LIM - 1) + '…'; };
const recW = r => r === 'R' ? 'RECOMMENDED' : r === 'N' ? 'NOT RECOMMENDED' : '';
function phRemark(row, D) {
  const c = calc(D), by = (D.by || (me() || {})), ph = row.ph_name || '', R = Object.keys(D.recs || {}).filter(k => D.recs[k]);
  const incs = (D.inc || []).map(r => `${r.m} – ${r.src} ₹${N(r.amt)} (${r.basis})`), incsShort = (D.inc || []).map(r => `${r.m} ₹${N(r.amt)}`);
  const head = `I, ${by.name || ''}, Patwari Halqa ${ph}, personally examined ${R.map(k => k + ' (' + (D.recNo || {})[k] + ')').join(', ')} and visited the applicant's house at ${D.village} on ${dmy(D.visit)}.`;
  const fam = `Family as per ration card No. ${D.rc}: ${c.inFam.map(m => m.n + ' (' + m.rel + ', ' + m.age + ')').join(', ')}${c.out.length ? '; not counted (18+ or other): ' + c.out.map(m => m.n + ' (' + m.age + ')').join(', ') : ''}.`;
  const tail = [`Agricultural land ${r2(c.landK)} kanal (${r2(c.acres)} acre)${D.out === 'Y' ? '; outside halqa: ' + D.outDet : '; no land outside halqa (' + D.outDet + ')'}.`,
    `House built-up ${N(c.built)} sq ft; plot ${N(Math.round(c.plotYd))} sq yd${D.muni === 'Y' ? ' in a notified municipality' : ', not in a notified municipality'}${D.comm === 'Y' ? '; commercial: ' + D.commDet : ''}.`,
    c.allOk ? 'All EWS tests within limits (Rule 21(viii), SRO 518).' : 'Fails: ' + c.tests.filter(t => !t.ok).map(t => t.label + ' ' + t.found).join('; ') + '.',
    `Witnesses: ${(D.wit || []).filter(w => has(w.n)).map(w => w.n + ' s/o ' + w.p + ' (' + w.r + ')').join(', ')}.`, `Adverse facts: ${D.adv}.`,
    `${recW(D.rec)} – ${D.why}${D.rec === 'N' ? ' (' + D.rule + ')' : ''}.`, `– ${by.name || ''}, Patwari ${ph}, ${by.user_id || ''}, ${dmy(today())}`];
  let s = [head, fam, `Gross family income FY ${c.fy}: ₹${N(c.incTotal)} (${incs.join('; ')}).`].concat(tail).join(' ');
  if (s.length > LIM) s = [head, fam, `Gross family income FY ${c.fy}: ₹${N(c.incTotal)} (${incsShort.join('; ')}).`].concat(tail).join(' ');
  return fit([s]);
}
const facts = (row) => { const D = row.ph || {}, c = calc(D); return `Income FY ${c.fy} ₹${N(c.incTotal)}; family ${c.inFam.length}; land ${r2(c.landK)} kanal; house ${N(c.built)} sq ft; plot ${N(Math.round(c.plotYd))} sq yd`; };
const VITEMS = [['fam', 'Family composition'], ['inc', 'Family income and its basis'], ['land', 'Agricultural land and share'], ['out', 'Land/property outside the halqa'], ['house', 'House built-up area'], ['plot', 'Plot area'], ['wit', 'Witnesses']];
function ntRemark(row, X, part) {
  const ph = row.ph || {}, by = X.by || me() || {}, V = X.vi || {}, ok = VITEMS.filter(v => V[v[0]] && V[v[0]].s === 'Y').map(v => v[1].toLowerCase()), no = VITEMS.filter(v => V[v[0]] && V[v[0]].s === 'N').map(v => v[1].toLowerCase() + (V[v[0]].h ? ' (' + V[v[0]].h + ')' : ''));
  return fit([`Report of Patwari ${row.ph_name || ''} dated ${dmy((ph.done_at || '').slice(0, 10))} examined. ${facts(row)}.`, ok.length ? `Verified: ${ok.join(', ')}.` : '', no.length ? `Not verified: ${no.join('; ')}.` : '',
    `Own check: ${X.own}.`, `${recW(X.rec)} – ${X.why}${X.rec === 'N' ? ' (' + X.rule + ')' : ''}.`, `– ${by.name || ''}, ${part === 'gq' ? 'Girdawar Qanungo' : 'Naib Tehsildar'}, ${by.user_id || ''}, ${dmy(today())}`]);
}
const DADOCS = ['Application form complete', 'Ration card copy', 'Income proofs match the Patwari\'s lines', 'Applicant\'s self-declaration / affidavit', 'Patwari report signed and dated on every page', 'NT remark has its own check', 'Site sketch attached'];
const DADEF = ['Visit date or report date missing', 'Witness unnamed or without parentage', 'Income line without basis', 'Family list does not match the ration card', 'Enclosure missing or pages short', 'Site sketch missing or without measurements', 'Signature or date missing'];
function daFlags(row, fam) {
  const D = row.ph || {}, c = calc(D), F = [], nt = row.nt || {};
  allErrs(D).forEach((E, i) => E.forEach(e => F.push(PARTS[i][0] + ': ' + e[0])));
  if (D.rec === 'R' && !c.allOk) F.push('Recommended although a test fails.');
  (fam || []).forEach(f => { if (f.income != null && Math.abs(f.income - c.incTotal) > 1) F.push(`Family case ${f.app_no} (${f.applicant}, ${f.service}) shows income ₹${N(f.income)}, this one ₹${N(c.incTotal)}.`);
    if (f.family != null && f.service === 'EWS' && f.family !== c.inFam.length) F.push(`Family case ${f.app_no} counts ${f.family} members, this one ${c.inFam.length}.`); });
  if (nt.at && nt.rec && D.rec && nt.rec !== D.rec) F.push('NT recommendation differs from the Patwari\'s.');
  if (nt.at && nt.own && phRemark(row, D).indexOf(String(nt.own).slice(0, 40)) >= 0) F.push('NT\'s own check repeats the Patwari\'s text.');
  const bo = nt.based_on || {}; if (nt.at && bo.ph != null && bo.ph < Number(D.v || 0)) F.push(`NT's report is based on the Patwari's v${bo.ph}; the Patwari has since made v${D.v}.`);
  return F;
}
function daRemark(row, X) {
  const by = X.by || me() || {}, c = calc(row.ph || {});
  return fit([`Scrutinised: Patwari report (${dmy(((row.ph || {}).done_at || '').slice(0, 10))})${row.nt && row.nt.at ? ', NT remark (' + dmy(row.nt.at.slice(0, 10)) + ')' : ''}${row.gq && row.gq.at ? ', GQ remark (' + dmy(row.gq.at.slice(0, 10)) + ')' : ''}.`,
    `Documents checked: ${DADOCS.filter((d, i) => (X.docs || {})[i]).join(', ') || 'none'}.`, `Pages listed ${c.pages}, uploaded ${X.pages}.`, `${facts(row)}.`,
    `Own check: ${X.own}.`, `${recW(X.rec)} – ${X.why}${X.rec === 'N' ? ' (' + X.rule + ')' : ''}.`, `– ${by.name || ''}, BCG / Dealing Assistant, ${by.user_id || ''}, ${dmy(today())}`]);
}
function memoText(row, X) {
  return `RETURN MEMO – ${row.app_no}\nApplicant: ${row.applicant}, ${row.village}\nTo: Patwari Halqa ${row.ph_name || ''}\n\nThe report is returned for these defects:\n${(X.defects || []).map((d, i) => (i + 1) + '. ' + d).join('\n')}\n\nCorrect them in TehsilOS → Certificates and upload the corrected report on JanSugam within 2 days.\n– ${(me() || {}).name || ''}, BCG, Tehsil Kastigarh, ${dmy(today())}`;
}
function tehRemark(row, X) {
  const c = calc(row.ph || {}), d = k => row[k] && row[k].at ? dmy(row[k].at.slice(0, 10)) : '';
  return fit([`Reports of Patwari ${row.ph_name || ''} (${dmy(((row.ph || {}).done_at || '').slice(0, 10))})${d('nt') ? ', NT (' + d('nt') + ')' : ''}${d('gq') ? ', GQ (' + d('gq') + ')' : ''}${d('da') ? ' and BCG scrutiny (' + d('da') + ')' : ''} perused.`,
    `${facts(row)}.`, `${X.why}.`, X.rec === 'R' ? `Certificate for FY ${c.fy} approved.` : `Application rejected under ${X.rule}.${has(X.notice) ? ' Notice to the applicant issued on ' + dmy(X.notice) + (has(X.reply) ? '; reply: ' + X.reply : '; no reply received') + '.' : ''}`,
    `– Tehsildar Kastigarh, ${dmy(today())}`]);
}

/* ---------- document model → PDF and Word ---------- */
const REFS = 'Rule 21(viii), J&K Reservation Rules 2005 (inserted by SRO 518 dt 02.09.2019); DoPT OM 36039/1/2019-Estt(Res) dt 31.01.2019; DoPT FAQs OM 43011/11/2022-Estt(Res-II) dt 19.09.2022; Divisional Commissioner Jammu, judgment dt 04.04.2026 (Anil Singh & Ors) – any house above 1000 sq ft built-up fails, village or town.';
const B = { h: t => ({ h: t }), p: t => ({ p: t }), small: t => ({ p: t, s: 1 }), t: (head, rows, w) => ({ t: { head, rows, w } }), kv: rows => ({ t: { rows, w: [35, 65], kv: 1 } }), brk: () => ({ brk: 1 }), sig: l => ({ sig: l }), sketch: m => ({ sketch: m }) };
const blk = (x, n) => has(x) ? String(x) : (n ? '_'.repeat(n) : '');
function docPH(row, D, opt) {
  opt = opt || {}; const blank = !!opt.blank, c = calc(D), by = D.by || {}, ph = row.ph_name || '', bl = (v, n) => blank ? '_'.repeat(n || 18) : blk(v);
  const tick = (on) => on ? '[X]' : '[  ]';
  const fam = blank ? Array.from({ length: 8 }, (x, i) => [i + 1, '', '', '', '']) : c.fam.map((m, i) => [i + 1, m.n, m.rel, m.age, counts(m) ? 'Counted' : 'Not counted (' + (has(m.age) && num(m.age) >= 18 ? '18+' : 'not family') + ')']);
  const inc = blank ? Array.from({ length: 5 }, (x, i) => [i + 1, '', '', '', '']) : (D.inc || []).map((r, i) => [i + 1, r.m, r.src, r.basis, 'Rs ' + N(r.amt)]);
  const land = blank ? Array.from({ length: 4 }, (x, i) => [i + 1, '', '', '', '', '']) : (D.land || []).map((r, i) => [i + 1, r.v || D.village, r.kh, r.ks, (num(r.k) || 0) + ' K ' + (num(r.m) || 0) + ' M', r.src || 'Jamabandi']);
  const wit = blank ? Array.from({ length: 3 }, (x, i) => [i + 1, '', '', '', '']) : (D.wit || []).filter(w => has(w.n)).map((w, i) => [i + 1, w.n, w.p, w.vl || D.village, w.r]);
  const R = blank ? RECS.map(k => [k, '[  ]', '']) : RECS.concat(Object.keys(D.recs || {}).filter(k => RECS.indexOf(k) < 0)).map(k => [k, tick((D.recs || {})[k]), (D.recs || {})[k] ? (D.recNo || {})[k] : '']);
  const enc = blank ? ENCL0.map((e, i) => [i + 1, e[0], '']) : (D.encl || []).filter(e => has(e.t)).map((e, i) => [i + 1, e.t, num(e.p)]);
  const out = [
    B.h('FIELD VERIFICATION REPORT – EWS (INCOME & ASSETS CERTIFICATE)'), B.small('Patwari Halqa ' + (blank ? '__________' : ph) + ', Tehsil Kastigarh, District Doda · Proforma P5-EWS v1.0'), B.small('Law applied: ' + REFS),
    B.h('A. Application and applicant'),
    B.kv([['Application No.', blank ? '' : row.app_no], ['Applicant', bl(D.name)], ['Father / husband', bl(D.father)], ['Village', bl(D.village)],
      ['Category applied', blank ? '[  ] Central   [  ] UT   [  ] Both' : D.cat], ['Application marked on', blank ? '' : dmy(D.recv)], ['Date of spot visit', blank ? '' : dmy(D.visit)]]),
    B.h('B. Family (as per ration card No. ' + bl(D.rc, 14) + ')'), B.small('Counted: applicant, parents, spouse, brothers/sisters and children below 18 (DoPT FAQ 25–26). Persons 18+ other than parents/spouse are not counted.'),
    B.t(['#', 'Name', 'Relation', 'Age', 'Counted / not counted (reason)'], fam, [6, 30, 16, 10, 38]),
    B.h('C. Gross family income – FY ' + (blank ? '20__-__' : c.fy) + ' (year before the application)'), B.t(['#', 'Member', 'Source', 'Basis (slip, rate × days, crop × area × rate, PPO)', 'Amount'], inc, [6, 20, 18, 38, 18]),
    B.p('Total gross family income: ' + (blank ? 'Rs ____________ (in words ______________________________)' : 'Rs ' + N(c.incTotal) + ' (Rupees ' + words(c.incTotal) + ' only)')),
    B.h('D. Agricultural land of the family (latest Jamabandi)'), B.t(['#', 'Village', 'Khewat', 'Khasra', 'Family share (K-M)', 'Source'], land, [6, 18, 14, 22, 20, 20]),
    B.p('Total: ' + (blank ? '______ kanal = ______ acre' : r2(c.landK) + ' kanal = ' + r2(c.acres) + ' acre (8 kanal = 1 acre)') + '.   Land/property outside the halqa: ' + (blank ? '[  ] Yes  [  ] No' : D.out === 'Y' ? 'YES' : 'NO') + ' – ' + (blank ? '_'.repeat(40) : D.outDet) + '.'),
    B.h('E. House and plot'),
    B.kv([['House built-up area (all floors)', blank ? '______ sq ft  (floor-wise L × B: _______________)' : N(c.built) + ' sq ft (' + (D.floors || []).filter(f => num(f.l)).map((f, i) => 'floor ' + (i + 1) + ': ' + num(f.l) + ' × ' + num(f.b)).join('; ') + ')'],
      ['Plot (covered + open)', blank ? '____ × ____ ft = ______ sq ft = ______ sq yd' : num(D.pL) + ' × ' + num(D.pB) + ' ft = ' + N(c.plotFt) + ' sq ft = ' + N(Math.round(c.plotYd)) + ' sq yd'],
      ['Notified municipality?', blank ? '[  ] Yes  [  ] No' : D.muni === 'Y' ? 'Yes' : 'No'], ['Commercial property', blank ? '[  ] Yes  [  ] No  ______' : D.comm === 'Y' ? 'Yes – ' + D.commDet : 'No']]),
    B.h('F. EWS tests (applied together)'), B.t(['Test', 'Limit', 'Found', 'Result'], blank ? calc(blankPH()).tests.map(t => [t.label.replace(/FY .*/, 'FY ____'), t.limit, '', '[  ] Within  [  ] Exceeds']) : c.tests.map(t => [t.label, t.limit, t.found, t.ok ? 'WITHIN' : 'EXCEEDS']), [32, 26, 24, 18]),
    B.h('G. Local enquiry'), B.t(['#', 'Witness', 'Parentage', 'Village', 'Relation to applicant'], wit, [6, 26, 26, 20, 22]),
    B.t(['Record examined personally', 'Seen', 'No. / year'], R, [50, 12, 38]),
    B.p('Adverse facts: ' + (blank ? '_'.repeat(70) : D.adv)),
    B.h('H. Recommendation'),
    B.t(['RECOMMENDED', 'NOT RECOMMENDED'], [[blank ? '[  ]' : tick(D.rec === 'R'), blank ? '[  ]' : tick(D.rec === 'N')]], [50, 50]),
    B.p('Reason: ' + (blank ? '_'.repeat(80) : D.why)), B.p('Rule / clause failed (if not recommended): ' + (blank ? '_'.repeat(40) : D.rec === 'N' ? D.rule : 'Not applicable')),
    B.h('I. Enclosures'), B.t(['#', 'Document', 'Pages'], enc, [8, 77, 15]), B.p('Total pages: ' + (blank ? '______ (in words ____________)' : c.pages + ' (' + words(c.pages) + ')')),
    B.h('J. Certificate of the Patwari'),
    B.p(`I, ${blank ? '____________________' : by.name || ''}, Patwari Halqa ${blank ? '__________' : ph}, certify that I have personally examined the records named in Part G and visited the applicant's house on ${blank ? '__________' : dmy(D.visit)}. Every figure above is from the record or measurement shown against it. I am liable to disciplinary and legal action if any fact is found false or suppressed.`),
    B.sig(['Signature: ____________________', 'Name: ' + (blank ? '' : by.name || ''), 'Patwari Halqa ' + (blank ? '' : ph), 'User ID: ' + (blank ? '' : by.user_id || ''), 'Date: ' + (blank ? '' : dmy(today()))]),
    B.brk(), B.h('Annexure E – Site sketch'), B.sketch(!!opt.model)];
  return out;
}
function docNT(row, X, part, opt) {
  opt = opt || {}; const blank = !!opt.blank, D = row.ph || {}, c = calc(D), by = X.by || {}, V = X.vi || {};
  const pf = { fam: c.inFam.length + ' counted', inc: 'Rs ' + N(c.incTotal), land: r2(c.landK) + ' kanal', out: D.out === 'Y' ? 'Yes' : D.out === 'N' ? 'No' : '', house: N(c.built) + ' sq ft', plot: N(Math.round(c.plotYd)) + ' sq yd', wit: (D.wit || []).filter(w => has(w.n)).length + ' named' };
  const ttl = part === 'gq' ? 'GIRDAWAR QANUNGO' : 'NAIB TEHSILDAR';
  return [B.h(ttl + ' VERIFICATION REPORT – EWS'), B.small('Tehsil Kastigarh, District Doda · Proforma P5-' + (part === 'gq' ? 'GQ' : 'NT') + ' v1.0'),
    B.kv([['Application No.', blank ? '' : row.app_no], ['Applicant', blank ? '' : row.applicant + ', ' + row.village], ['Patwari report', blank ? 'Halqa ________ dated ________' : 'Halqa ' + (row.ph_name || '') + ' dated ' + dmy((D.done_at || '').slice(0, 10))]]),
    B.h('A. Items checked'), B.t(['Item', 'Patwari\'s figure', 'Verified / Not verified', 'How verified (record, call, visit)'], VITEMS.map(v => [v[1], blank ? '' : pf[v[0]], blank ? '[  ] V   [  ] NV' : V[v[0]] ? (V[v[0]].s === 'Y' ? 'VERIFIED' : 'NOT VERIFIED') : '-', blank ? '' : (V[v[0]] || {}).h || '']), [28, 20, 18, 34]),
    B.h('B. Own check (a fact not in the Patwari\'s report)'), B.p(blank ? '_'.repeat(160) : X.own),
    B.h('C. Recommendation'), B.t(['RECOMMENDED', 'NOT RECOMMENDED'], [[blank ? '[  ]' : X.rec === 'R' ? '[X]' : '[  ]', blank ? '[  ]' : X.rec === 'N' ? '[X]' : '[  ]']], [50, 50]),
    B.p('Reason: ' + (blank ? '_'.repeat(80) : X.why)), B.p('Rule / clause failed: ' + (blank ? '_'.repeat(40) : X.rec === 'N' ? X.rule : 'Not applicable')),
    B.p('I have personally checked the items marked Verified as stated. I am liable to disciplinary and legal action if any fact is found false.'),
    B.sig(['Signature: ____________________', 'Name: ' + (blank ? '' : by.name || ''), (part === 'gq' ? 'Girdawar Qanungo' : 'Naib Tehsildar'), 'User ID: ' + (blank ? '' : by.user_id || ''), 'Date: ' + (blank ? '' : dmy(today()))]), B.small('References: ' + REFS)];
}
function docDA(row, X, opt) {
  opt = opt || {}; const blank = !!opt.blank, c = calc(row.ph || {}), by = X.by || {};
  return [B.h('SCRUTINY NOTE – EWS'), B.small('BCG / Dealing Assistant, Tehsil Kastigarh · Proforma P5-DA v1.0'),
    B.kv([['Application No.', blank ? '' : row.app_no], ['Applicant', blank ? '' : row.applicant + ', ' + row.village]]),
    B.h('A. Documents and reports checked'), B.t(['Item', 'Checked'], DADOCS.map((d, i) => [d, blank ? '[  ] Yes  [  ] No' : (X.docs || {})[i] ? 'YES' : 'NO']), [75, 25]),
    B.p('Pages listed by the Patwari: ' + (blank ? '______' : c.pages) + '.   Pages uploaded on JanSugam: ' + (blank ? '______' : X.pages) + '.'),
    B.h('B. Flags considered'), B.p(blank ? '_'.repeat(160) : (X.flags || []).length ? X.flags.join(' | ') : 'None.'),
    B.h('C. Own check'), B.p(blank ? '_'.repeat(160) : X.own),
    B.h('D. Recommendation'), B.t(['RECOMMENDED', 'NOT RECOMMENDED'], [[blank ? '[  ]' : X.rec === 'R' ? '[X]' : '[  ]', blank ? '[  ]' : X.rec === 'N' ? '[X]' : '[  ]']], [50, 50]),
    B.p('Reason: ' + (blank ? '_'.repeat(80) : X.why)), B.p('Rule / clause failed: ' + (blank ? '_'.repeat(40) : X.rec === 'N' ? X.rule : 'Not applicable')),
    B.sig(['Signature: ____________________', 'Name: ' + (blank ? '' : by.name || ''), 'BCG / Dealing Assistant', 'User ID: ' + (blank ? '' : by.user_id || ''), 'Date: ' + (blank ? '' : dmy(today()))])];
}
function docMemo(row, X) { return [B.h('RETURN MEMO'), B.small('Tehsil Kastigarh · Certificates'), B.kv([['Application No.', row.app_no], ['Applicant', row.applicant + ', ' + row.village], ['To', 'Patwari Halqa ' + (row.ph_name || '')]]),
  B.p('The report is returned for the following defects:'), B.t(['#', 'Defect'], (X.defects || []).map((d, i) => [i + 1, d]), [8, 92]), B.p('Correct them and upload the corrected report on JanSugam within 2 days.'),
  B.sig(['Signature: ____________________', 'Name: ' + ((me() || {}).name || ''), 'BCG / Dealing Assistant', 'Date: ' + dmy(today())])]; }

async function toPDF(blocks, name, foot) {
  await loadPDF(); const d = new jspdf.jsPDF({ unit: 'pt', format: 'a4' }), tx = t => pdfText(String(t).replace(/×/g, 'x').replace(/–/g, '-')), W = 595, L = 44, R = W - 44, MW = R - L; let y = 50;
  const room = h => { if (y + h > 790) { d.addPage(); y = 50; } };
  blocks.forEach((b, bi) => {
    if (b.brk) { d.addPage(); y = 50; return; }
    if (b.h) { const top = bi === 0 || (blocks[bi - 1] || {}).brk; room(30); d.setFont('times', 'bold'); d.setFontSize(top ? 13 : 11.5); const L2 = d.splitTextToSize(tx(b.h), MW); d.text(L2, top ? W / 2 : L, y + 4, { align: top ? 'center' : 'left' }); y += L2.length * 14 + 6; return; }
    if (b.p) { d.setFont('times', 'normal'); d.setFontSize(b.s ? 8.8 : 10.5); const L2 = d.splitTextToSize(tx(b.p), MW); room(L2.length * (b.s ? 11 : 13.5)); d.text(L2, L, y + 2); y += L2.length * (b.s ? 11 : 13.5) + 6; return; }
    if (b.t) { const tw = b.t.w.reduce((a, x) => a + x, 0), cs = {}; b.t.w.forEach((x, i) => cs[i] = { cellWidth: MW * x / tw }); if (b.t.kv) cs[0].fontStyle = 'bold';
      d.autoTable({ startY: y, theme: 'grid', margin: { left: L, right: W - R }, styles: { font: 'times', fontSize: 9.5, cellPadding: 3.5, textColor: 20, lineColor: 40, lineWidth: 0.5, valign: 'top', minCellHeight: 16 },
        headStyles: { fillColor: [235, 235, 235], textColor: 10, fontStyle: 'bold' }, columnStyles: cs, head: b.t.head ? [b.t.head.map(x => tx(String(x)))] : undefined, body: b.t.rows.map(r => r.map(x => tx(String(x == null ? '' : x)))) });
      y = d.lastAutoTable.finalY + 8; return; }
    if (b.sig) { room(b.sig.length * 14 + 20); d.setFont('times', 'normal'); d.setFontSize(10.5); y += 14; b.sig.forEach(l => { d.text(tx(l), R, y, { align: 'right' }); y += 14; }); y += 6; return; }
    if (b.sketch !== undefined) { sketchPDF(d, L, y, MW, b.sketch); y = 790; }
  });
  const n = d.getNumberOfPages(); for (let i = 1; i <= n; i++) { d.setPage(i); d.setFont('times', 'normal'); d.setFontSize(8); d.text(tx(foot + ' · page ' + i + ' of ' + n), W / 2, 822, { align: 'center' }); }
  return deliverPDF(d, name);
}
function sketchPDF(d, L, y, MW, model) {
  const tx = t => pdfText(String(t).replace(/×/g, 'x').replace(/–/g, '-')); d.setFont('times', 'normal'); d.setFontSize(9.2);
  const must = 'Must show: north arrow; Khasra No. of the plot and of all four neighbours with owners; every side in feet; built-up area hatched, open area plain, agricultural land shaded; path/road with width; a landmark; on the face: L × B = built-up, plot = built-up + open, balance = agricultural; date; signatures of Patwari and Lambardar. Rejected if: no measurements, no north arrow, no neighbouring Khasras, or figures differ from Part E.';
  const M = d.splitTextToSize(tx(must), MW); d.text(M, L, y); y += M.length * 11 + 8;
  const H2 = 500; d.setLineWidth(0.8); d.rect(L, y, MW, H2);
  if (!model) { d.setDrawColor(200); for (let x = L + 20; x < L + MW; x += 20) d.line(x, y, x, y + H2); for (let z = y + 20; z < y + H2; z += 20) d.line(L, z, L + MW, z); d.setDrawColor(0); return; }
  const ox = L + 60, oy = y + 90; d.setFontSize(9);
  d.rect(ox, oy, 300, 220); d.text(tx('Plot: Khasra 512 (min) – 130 sq yd'), ox + 4, oy - 6);
  d.setFillColor(215); d.rect(ox + 20, oy + 20, 156, 72, 'FD'); d.text(tx('HOUSE 39 × 18 ft = 702 sq ft (hatched)'), ox + 24, oy + 60);
  d.text(tx('Courtyard (open)'), ox + 200, oy + 60); d.text(tx('45 ft'), ox + 140, oy + 234); d.text(tx('26 ft'), ox + 306, oy + 110);
  d.setFillColor(240); d.rect(ox, oy + 240, 300, 80, 'FD'); d.text(tx('Agricultural land – Khasra 512 (balance 1 K 15 M, shaded)'), ox + 6, oy + 284);
  d.text(tx('N: Kh. 510 – Ram Lal'), ox + 90, oy - 24); d.text(tx('S: Kh. 515 – own field'), ox + 90, oy + 340); d.text(tx('E: Kh. 513 – Kuldeep Singh'), ox + 310, oy + 160); d.text(tx('W: Path 6 ft → Gagla road'), ox - 54, oy + 160, { angle: 90 });
  d.line(L + MW - 40, y + 60, L + MW - 40, y + 20); d.line(L + MW - 40, y + 20, L + MW - 46, y + 30); d.line(L + MW - 40, y + 20, L + MW - 34, y + 30); d.text('N', L + MW - 43, y + 14);
  d.text(tx('Landmark: Govt. Middle School Gagla, 150 m east.  Built-up 702 sq ft; plot 45 x 26 = 1,170 sq ft (130 sq yd); open 468 sq ft.  GPS: 33.1xx N, 75.6xx E.  Date: 22-11-2026'), L + 6, y + H2 - 26);
  d.text(tx('Patwari: ____________        Lambardar: ____________'), L + 6, y + H2 - 10);
}
function toDOCX(blocks, name, foot) {
  const W = 9900, out = [];
  blocks.forEach(b => {
    if (b.brk) { out.push(P81('', { brk: 1, after: 0 })); return; }
    if (b.h) { out.push(P81([[b.h, { b: 1, sz: out.length ? 23 : 26 }]], { jc: out.length ? 'left' : 'center', before: out.length ? 140 : 0, after: 60, keep: 1 })); return; }
    if (b.p) { out.push(P81([[b.p, { sz: b.s ? 18 : 22 }]], { after: 80, jc: 'both' })); return; }
    if (b.t) { const tw = b.t.w.reduce((a, x) => a + x, 0), ws = b.t.w.map(x => Math.round(W * x / tw)); const rows = [];
      if (b.t.head) rows.push({ head: 1, cells: b.t.head.map((h, i) => C81(P81([[String(h), { b: 1, sz: 20 }]], { after: 0, jc: 'left' }), ws[i], { shade: 'EBEBEB' })) });
      b.t.rows.forEach(r => rows.push({ cells: r.map((x, i) => C81(P81([[String(x == null ? '' : x), { sz: 20, b: b.t.kv && i === 0 ? 1 : 0 }]], { after: 0, jc: 'left' }), ws[i])) }));
      out.push(T81(rows, ws)); out.push(P81('', { after: 60 })); return; }
    if (b.sig) { out.push(P81('', { after: 200 })); b.sig.forEach(l => out.push(P81([[l, { sz: 22 }]], { jc: 'right', after: 20 }))); return; }
    if (b.sketch !== undefined) { out.push(P81([['Must show: north arrow; Khasra No. of the plot and all four neighbours with owners; every side in feet; built-up area hatched, open area plain, agricultural land shaded; path/road with width; a landmark; on the face: L × B = built-up, plot = built-up + open, balance = agricultural; date; signatures of Patwari and Lambardar. Rejected if: no measurements, no north arrow, no neighbouring Khasras, or figures differ from Part E.', { sz: 19 }]], { after: 100 }));
      out.push(T81([{ cells: [C81(Array.from({ length: 28 }, () => P81('', { after: 120 })).join(''), W)] }], [W])); }
  });
  out.push(P81([[foot, { sz: 16 }]], { jc: 'center', before: 120 }));
  deliverBlob(docx81(out.join(''), { sz: 22 }), name);
}
const FOOT = { ph: 'P5-EWS v1.0 | 12/2026 · TehsilOS', nt: 'P5-NT v1.0 | 12/2026 · TehsilOS', gq: 'P5-GQ v1.0 | 12/2026 · TehsilOS', da: 'P5-DA v1.0 | 12/2026 · TehsilOS', memo: 'Return memo · TehsilOS' };
const fname = (row, k, ext) => `${k} – ${row.applicant || 'blank'} – ${String(row.app_no || 'EWS').replace(/\//g, '-')}.${ext}`;

/* ---------- model sample (for the Patwari's Guide) ---------- */
const MODEL = { row: { app_no: 'JK-REV-EWS/2026/00000 (MODEL)', applicant: 'Model Applicant', village: 'Gagla', ph_name: 'Shamthi' },
  D: { name: 'Model Applicant', father: 'Model Father', village: 'Gagla', cat: 'UT', recv: '2026-11-18', due: '2026-12-02', visit: '2026-11-22', rc: 'JK-DOD-000000',
    fam: [{ n: 'Model Applicant', age: '21', rel: 'Self' }, { n: 'Model Father', age: '52', rel: 'Father' }, { n: 'Model Mother', age: '47', rel: 'Mother' }, { n: 'Elder Sister', age: '23', rel: 'Sister' }],
    inc: [{ m: 'Model Mother', src: 'Daily wages', basis: '₹9,330 per month × 12 (wage slip, Nov 2025)', amt: '111960' }, { m: 'Model Father', src: 'Agriculture', basis: 'Maize 2 kanal × 3 qtl × ₹2,200 + vegetables ₹26,800 (Girdawari Kharif 2025)', amt: '40000' }],
    land: [{ v: 'Gagla', kh: '41', ks: '512 min', k: '2', m: '0', src: 'Jamabandi 2022-23' }], out: 'N', outDet: 'Applicant\'s affidavit; Lambardar enquiry; none found in online record by name',
    floors: [{ l: '39', b: '18' }], pL: '45', pB: '26', muni: 'N', comm: 'N', commDet: '', wit: [{ n: 'Lambardar Model', p: 'Model Parent', r: 'Lambardar' }, { n: 'Neighbour Model', p: 'Model Parent', r: 'Not related' }],
    recs: { 'Ration card': true, 'Jamabandi': true, 'Girdawari': true, 'Salary slip / certificate': true }, recNo: { 'Ration card': 'JK-DOD-000000', 'Jamabandi': '2022-23, Khewat 41', 'Girdawari': 'Kharif 2025', 'Salary slip / certificate': 'Wage slip Nov 2025' },
    adv: 'NIL', rec: 'R', why: 'Family income ₹1,51,960 is below ₹8 lakh and land, house and plot are within the limits of Rule 21(viii).', rule: '',
    encl: [{ t: 'Annexure A – Ration card copy', p: '1' }, { t: 'Annexure B – Jamabandi / Fard', p: '2' }, { t: 'Annexure C – Income proofs', p: '2' }, { t: 'Annexure D – Witness statements', p: '2' }, { t: 'Annexure E – Site sketch', p: '1' }],
    by: { name: 'Model Patwari', user_id: 'U_MODEL' } } };

/* =====================================================================================
 * Views
 * ===================================================================================== */
const load = async app => { const R = await api('cert25Get', { app_no: app }, 45000); S.c25 = S.c25 || {}; if (R.found) S.c25[app] = R; return R; };
const save = async (app, part, data, final, service) => { const R = await api('cert25Save', { app_no: app, part, data, final: !!final, service: service || 'EWS' }, 60000); S.c25 = S.c25 || {}; S.c25[app] = { found: true, row: R.row, family: R.family }; return R; };
const lgBar = () => `<div class="lg" role="group" aria-label="Help language">${LANGS.map(l => `<button type="button" data-lg="${l[0]}" class="${lang === l[0] ? 'on' : ''}">${l[1]}</button>`).join('')}</div>`;
const bindLg = (host, re) => on(host, '[data-lg]', 'click', b => { lang = b.dataset.lg; try { localStorage.setItem('c25lang', lang); } catch (e) {} re(); });
const vtag = o => o ? 'v' + (o.v || 1) : '';
const recPill = r => r === 'R' ? '<span class="pill ok">Recommended</span>' : r === 'N' ? '<span class="pill ur">Not recommended</span>' : '';
const made = r => [r.nt ? 'NT' : '', r.da ? 'BCG' : '', r.teh ? 'Tehsildar' : ''].filter(Boolean);

/* 1. Certificates page – what exists, newest first; no status, no dates due */
VIEWS.c25 = async function () {
  wideOn('Certificates'); loading('Certificates…');
  const w = who(); if (!w) { view().innerHTML = `<div class="t12 c25"><h1>Certificates</h1><div class="cd">Certificates are made by the Patwari, Naib Tehsildar, BCG and Tehsildar. Your login is not one of these.</div></div>`; return; }
  let L = { rows: [] }; try { L = await api('cert25List', {}, 45000); } catch (e) { toast(e.message, 'err'); }
  if (current().name !== 'c25') return;
  const st = S.c25l || (S.c25l = { f: w === 'ph' || w === 'oq' ? 'all' : 'new', q: '' });
  const TITLE = { ph: 'My reports', nt: 'From your Patwaris', oq: 'Reports made', da: 'Files with Patwari and NT reports', teh: 'Files with a scrutiny note' };
  function rows() { const q = st.q.toLowerCase(); return L.rows.filter(r => (st.f === 'new' ? r.fresh : st.f === 'mine' ? r.mine : true) && (!q || (r.app_no + ' ' + r.applicant + ' ' + r.village).toLowerCase().indexOf(q) >= 0)); }
  const line = r => { const docs = made(r);
    const sub = w === 'ph' ? `…/${esc(r.app_no.split('/').pop())} · ${r.ph ? vtag(r.ph) + ' · ' + dmy(r.ph.at.slice(0, 10)) : 'draft'}${docs.length ? ' · ' + docs.join(', ') + ' made' : ''}`
      : `Patwari ${esc(r.ph_name)} · ${vtag(r.ph)} · ${dmy(((r.ph || {}).at || '').slice(0, 10))}${r.mine && r.fresh ? ' · changed after your report' : ''}`;
    const chip = w === 'ph' ? (r.draft ? '<span class="pill wt">Draft</span>' : '<span class="pill ok">Generated</span>') : r.mine && !r.fresh ? '<span class="pill ok">Made by you</span>' : r.mine ? '<span class="pill wt">New version</span>' : recPill(r.ph && r.ph.rec);
    return `<button class="row" data-app="${esc(r.app_no)}"><span>${r.fresh ? '<i style="display:inline-block;width:8px;height:8px;border-radius:9px;background:#0E5E3B;margin-right:6px"></i>' : ''}${esc(r.applicant || '(no name yet)')} · ${esc(r.service || '')}<small>${sub}</small></span><span>${chip}</span></button>`; };
  function draw() {
    const R = rows();
    view().innerHTML = `<div class="t12 c25"><p class="sub" style="margin:0">${esc((me() || {}).name || '')} · ${WHO[w]}</p><h1>Certificates</h1>
      ${w === 'ph' ? `<div class="cd"><label class="f" for="c25app" style="margin-top:0">Make a report – Application No.</label><input id="c25app" placeholder="JK-REV-EWS/2026/24523" autocomplete="off" autocapitalize="characters">
        <div id="c25sv" class="mu" style="margin-top:6px">Paste from JanSugam.</div><button class="btn12" id="c25go" style="width:100%;margin-top:10px">New report</button></div>` : ''}
      <input id="c25q" type="search" placeholder="Search – Application No. or name" aria-label="Search" value="${esc(st.q)}" style="margin-bottom:10px">
      ${w !== 'ph' ? `<div class="seg" style="margin-bottom:12px">${[['new', 'New for you · ' + L.rows.filter(r => r.fresh).length], ['all', 'All'], ['mine', 'Made by me']].filter(x => w !== 'oq' || x[0] === 'all').map(x => `<button type="button" data-f="${x[0]}" class="${st.f === x[0] ? 'on' : ''}">${x[1]}</button>`).join('')}</div>` : ''}
      <div class="cd"><h3>${TITLE[w]} <span class="mu">${R.length}</span></h3>${R.slice(0, 60).map(line).join('') || `<p class="mu">${st.f === 'new' ? 'Nothing new for you.' : 'None yet.'}</p>`}</div>
      <button class="cd row" data-go="c25b" style="display:block;border:0;width:100%;text-align:left"><h3>Blank proformas <span>›</span></h3><div class="mu">All 25 services · Word or PDF · model samples</div></button>
      <p class="hint" style="text-align:center">TehsilOS makes the reports and remark text only. All action stays on JanSugam / Revenue Plus.</p></div>`;
    const q = $('#c25q'); q.oninput = () => { st.q = q.value; const pos = q.selectionStart; draw(); const q2 = $('#c25q'); q2.focus(); try { q2.setSelectionRange(pos, pos); } catch (e) {} };
    on(view(), '[data-f]', 'click', b => { st.f = b.dataset.f; draw(); });
    on(view(), '[data-app]', 'click', b => go('c25f', { app: b.dataset.app }));
    on(view(), '[data-go]', 'click', b => go(b.dataset.go, {}));
    const inp = $('#c25app'); if (inp) { const sv = $('#c25sv');
      inp.oninput = () => { const a = normApp(inp.value), s = svc(svcOf(a)); sv.innerHTML = !a ? 'Paste from JanSugam.' : !appOk(a) ? '<span style="color:#A1261B">Format: JK-REV-EWS/2026/24523</span>' : s ? `<b style="color:#1F6B42">${esc(s.name)} · ${s.pf}</b>${s.live ? '' : ' – proforma comes in the next update'}` : 'New prefix – you will choose the service once.'; };
      $('#c25go').onclick = async () => { const app = normApp(inp.value); if (!appOk(app)) return toast('Format: JK-REV-EWS/2026/24523', 'err');
        let code = svcOf(app); if (!code) { code = await pickSvc(app); if (!code) return; }
        if (!svc(code).live) return info(svc(code).name + ': the proforma comes in the next update. Use Blank proformas for now.');
        go('c25p', { app, i: 0 }); }; }
  }
  draw();
};

/* 2. The file – every document made for one application, newest version first */
VIEWS.c25f = async function (a) {
  const app = a.app, w = who(); wideOn('File'); loading('Opening ' + app + '…');
  let R; try { R = await load(app); } catch (e) { fail(e.message); return; } if (current().name !== 'c25f') return;
  if (!R.found) { if (w === 'ph') return go('c25p', { app, i: 0 }); view().innerHTML = `<div class="t12 c25"><h1>${esc(app)}</h1><div class="cd">The Patwari has not made a report for this application yet.</div></div>`; return; }
  const row = R.row, P = row.ph || {}, gen = !!P.done_at;
  const steps = [['ph', 'Patwari report', P.done_at, P], ['nt', 'NT report', row.nt && row.nt.at, row.nt], ['da', 'BCG scrutiny note', row.da && row.da.at, row.da], ['teh', 'Tehsildar remark', row.teh && row.teh.at, row.teh]];
  const behind = (k, o) => { const b = (o && o.based_on) || {}; const out = []; if (k !== 'ph' && b.ph != null && b.ph < Number(P.v || 0)) out.push(`Patwari v${b.ph}`); if ((k === 'da' || k === 'teh') && b.nt != null && b.nt < Number((row.nt || {}).v || 0)) out.push(`NT v${b.nt}`); if (k === 'teh' && b.da != null && b.da < Number((row.da || {}).v || 0)) out.push(`BCG v${b.da}`); return out; };
  const docBtns = k => `<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">${k !== 'teh' ? `<button class="btn12 gh" data-d="${k}" data-t="pdf" style="padding:6px 12px;font-size:12.5px">PDF</button><button class="btn12 gh" data-d="${k}" data-t="doc" style="padding:6px 12px;font-size:12.5px">Word</button>` : ''}<button class="btn12 gh" data-d="${k}" data-t="cp" style="padding:6px 12px;font-size:12.5px">Copy remark</button></div>`;
  const mineK = w === 'ph' ? 'ph' : w === 'oq' ? '' : w;
  const canMake = mineK && (mineK === 'ph' || (gen && (mineK === 'nt' || (mineK === 'da' && row.nt && row.nt.at) || (mineK === 'teh' && row.da && row.da.at))));
  const myDoc = mineK ? (mineK === 'ph' ? (gen ? P : null) : row[mineK] && row[mineK].at ? row[mineK] : null) : null;
  view().innerHTML = `<div class="t12 c25"><p class="sub" style="margin:0">${esc(app)}</p><h1 style="margin-bottom:2px">${esc(row.applicant || '')}</h1><p class="mu" style="margin:0 0 12px">${esc(P.father ? 'D/o / S/o ' + P.father + ' · ' : '')}${esc(row.village || '')} · ${esc(row.service || 'EWS')} · Halqa ${esc(row.ph_name || '')}</p>
    <div class="cd">${steps.map((s, i) => { const o = s[3] || {}, has2 = !!s[2], bh = has2 ? behind(s[0], o) : [];
      return `<div class="rw" style="display:flex;gap:12px"><span style="width:24px;height:24px;flex:none;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;${has2 ? 'background:#0E5E3B;color:#fff' : 'border:2px dashed #C9D0CB;color:#8A948E'}">${i + 1}</span>
        <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b style="font-size:14.5px;${has2 ? '' : 'color:#5E6B63'}">${s[1]}${has2 ? ' · v' + (o.v || 1) : ''}</b>${has2 ? recPill(o.rec) : ''}</div>
        <div class="mu" style="margin-top:3px">${has2 ? esc((o.by || {}).name || '') + ' · ' + dmy(String(s[2]).slice(0, 10)) + ' ' + String(s[2]).slice(11, 16) + ((o.prev || []).length ? ' · ' + o.prev.length + ' earlier version' + (o.prev.length > 1 ? 's' : '') + ' kept' : '') : s[0] === 'ph' && P.name ? 'Draft – not generated yet' : 'Not made yet'}</div>
        ${s[0] === 'ph' && P.next ? '<div class="wrn">The Patwari is preparing a new version (draft).</div>' : ''}
        ${bh.length ? `<div class="wrn">Based on ${bh.join(' and ')} – a newer version exists.</div>` : ''}${has2 ? docBtns(s[0]) : ''}</div></div>`; }).join('')}</div>
    ${canMake ? `<button class="btn12" id="mk" style="width:100%">${myDoc ? 'Make a new version of my ' + (mineK === 'ph' ? 'report' : mineK === 'da' ? 'scrutiny note' : mineK === 'teh' ? 'remark' : 'report') : mineK === 'ph' ? 'Continue my report' : mineK === 'da' ? 'Make my scrutiny note' : mineK === 'teh' ? 'Make my remark' : 'Make my report'}</button>` : ''}
    <p class="hint" style="text-align:center;margin-top:12px">Send-backs and approvals happen on JanSugam. Here you only make a new version when asked.</p></div>`;
  const mk = $('#mk'); if (mk) mk.onclick = () => go(mineK === 'ph' ? 'c25p' : 'c25r', { app, i: 0 });
  on(view(), '[data-d]', 'click', b => busy(b, 'Making', async () => { const k = b.dataset.d, t = b.dataset.t, o = row[k];
    if (t === 'cp') { const txt = k === 'ph' ? phRemark(row, P) : k === 'da' ? daRemark(row, o) : k === 'teh' ? tehRemark(row, o) : ntRemark(row, o, 'nt'); toast(await copyText(txt) ? 'Remark copied' : 'Could not copy', 'ok'); return; }
    const blocks = k === 'ph' ? docPH(row, P) : k === 'da' ? docDA(row, o) : docNT(row, o, 'nt'), nm = { ph: 'EWS Patwari report', nt: 'EWS NT report', da: 'EWS scrutiny note' }[k];
    if (t === 'pdf') await toPDF(blocks, fname(row, nm, 'pdf'), FOOT[k] + ' · ' + row.app_no + ' · v' + (o.v || 1)); else toDOCX(blocks, fname(row, nm, 'docx'), FOOT[k] + ' · ' + row.app_no + ' · v' + (o.v || 1)); }));
};
function pickSvc(app) {
  const pre = /^JK-[A-Z]+-([A-Z]+)\//.exec(app)[1];
  return new Promise(res => openSheet(() => ({ html: `<div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">Which service is ${esc(pre)}?</h2><p class="hint">Chosen once; this phone remembers it.</p>
    ${SVC.map(s => `<button class="row" data-c="${s.code}"><span>${esc(s.name)}</span><span>${s.pf}</span></button>`).join('')}`,
    mount: el => { $('#x', el).onclick = () => closeSheet(() => res('')); on(el, '[data-c]', 'click', b => { const L = learnt(); L[pre] = b.dataset.c; try { localStorage.setItem('c25pfx', JSON.stringify(L)); } catch (e) {} closeSheet(() => res(b.dataset.c)); }); } })));
}

/* 2. Patwari form */
VIEWS.c25p = async function (a) {
  const app = a.app; wideOn('EWS report'); loading('Opening ' + app + '…');
  let R = (S.c25 || {})[app]; if (!R) { try { R = await load(app); } catch (e) { fail(e.message); return; } }
  if (current().name !== 'c25p') return;
  const row = R.found ? R.row : { app_no: app, ph_status: '', ph_name: '' };
  const src = Object.assign({}, (row.ph || {}).next || row.ph || {}); ['prev', 'next', 'v', 'based_on', 'draft_next', 'done_at', 'by', 'at'].forEach(k => delete src[k]);
  let D = Object.assign(blankPH(), src); let local = null; try { local = await kget('c25:' + app); } catch (e) {}
  if (local && (!row.updated_at || local.t > row.updated_at)) D = Object.assign(D, local.D);
  const newV = !!(row.ph && row.ph.done_at);
  let i = Math.min(Math.max(0, Number(a.i) || 0), 6);
  const keep = () => { try { kput('c25:' + app, { t: new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 19).replace('T', ' '), D }); } catch (e) {} };
  const set = (path, v) => { const p = path.split('.'); let o = D; for (let k = 0; k < p.length - 1; k++) { if (o[p[k]] == null) o[p[k]] = /^\d+$/.test(p[k + 1]) ? [] : {}; o = o[p[k]]; } o[p[p.length - 1]] = v; keep(); };
  const fld = (k, label, hk, type, extra) => `<label class="f" for="f_${k}">${label}</label>${hk ? `<p class="hl">${tl(H[hk])}</p>` : ''}<input id="f_${k}" data-k="${k}" type="${type || 'text'}" value="${esc(String(k.split('.').reduce((o, x) => o == null ? '' : o[x], D) || ''))}" ${extra || ''}>`;
  const seg = (k, opts, cls) => `<div class="seg ${cls || ''}" data-seg="${k}">${opts.map(o => `<button type="button" data-v="${o[0]}" class="${String(k.split('.').reduce((x, y) => x == null ? '' : x[y], D)) === o[0] ? 'on' : ''}">${esc(o[1])}</button>`).join('')}</div>`;
  const sel = (k, opts, cur) => `<select data-k="${k}"><option value="">– choose –</option>${opts.map(o => `<option ${o === cur ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  const doubts = () => `<div class="cd"><h3>${lang === 'ur' ? '<span dir="rtl">شک ہے؟</span>' : lang === 'hi' ? 'Shak hai?' : 'Doubts?'}</h3>${DOUBTS[i].map(q => `<div class="qa">${lang === 'ur' ? `<div dir="rtl" lang="ur" style="text-align:right;line-height:1.8"><b>${esc(q[0][2])}</b>${esc(q[1][2])}</div>` : `<b>${esc(T(q[0]))}</b>${esc(T(q[1]))}</div>`}`).join('')}
    <button type="button" class="btn12 gh" id="c25model" style="margin-top:10px;width:100%">Model sample (PDF)</button></div>`;
  function body() {
    const c = calc(D);
    if (i === 0) return `<div class="cd">${fld('name', 'Applicant\'s name', 'name')}${fld('father', 'Father / husband', 'father')}${fld('village', 'Village', '')}
      <label class="f">Category applied for</label><p class="hl">${tl(H.cat)}</p>${seg('cat', [['Central', 'Central'], ['UT', 'UT'], ['Both', 'Both']])}
      ${fld('recv', 'Marked to you on', 'recv', 'date')}${fld('visit', 'Date of your visit', 'visit', 'date', `max="${today()}"`)}</div>`;
    if (i === 1) return `<div class="cd">${fld('rc', 'Ration card No.', 'rc')}<label class="f">Members</label><p class="hl">${tl(H.fam)}</p>
      ${D.fam.map((m, k) => `<div class="rw"><div class="g3"><input data-k="fam.${k}.n" value="${esc(m.n || '')}" placeholder="Name" aria-label="Name" style="grid-column:span 2"><input data-k="fam.${k}.age" value="${esc(m.age || '')}" inputmode="numeric" placeholder="Age" aria-label="Age"></div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">${sel('fam.' + k + '.rel', RELS, m.rel)}<span class="pill ${counts(m) ? 'ok' : 'wt'}" style="flex:none">${has(m.n) ? counts(m) ? 'Counted' : 'Not counted' : ''}</span>${k ? `<button type="button" class="del" data-del="fam.${k}">Remove</button>` : ''}</div></div>`).join('')}
      <button type="button" class="add" data-add="fam">+ Add member</button><p class="mu" style="margin-top:8px">Counted: <b>${c.inFam.length}</b>${c.out.length ? ' · not counted: ' + esc(c.out.map(m => m.n).join(', ')) : ''}</p></div>`;
    if (i === 2) { const mem = c.inFam.map(m => m.n); return `<div class="cd"><p class="hl">${tl(H.inc.map(s => s.replace('{FY}', c.fy)))}</p><p class="hl">${tl(H.basis)}</p>
      ${D.inc.map((r, k) => `<div class="rw"><div class="g2">${sel('inc.' + k + '.m', mem, r.m)}${sel('inc.' + k + '.src', SRCS, r.src)}</div><input data-k="inc.${k}.basis" value="${esc(r.basis || '')}" placeholder="Basis – e.g. ₹9,330 × 12 (wage slip)" aria-label="Basis" style="margin-top:6px">
        <div style="display:flex;gap:8px;align-items:center;margin-top:6px"><input data-k="inc.${k}.amt" value="${esc(r.amt || '')}" inputmode="numeric" placeholder="₹ per year" aria-label="Amount per year"><button type="button" class="del" data-del="inc.${k}">Remove</button></div></div>`).join('')}
      <button type="button" class="add" data-add="inc">+ Add income line</button><div class="okb" id="c25tot">Total FY ${c.fy}: ₹${N(c.incTotal)} (${words(c.incTotal)})</div></div>`; }
    if (i === 3) return `<div class="cd"><p class="hl">${tl(H.land)}</p>
      ${D.land.map((r, k) => `<div class="rw"><div class="g2"><input data-k="land.${k}.v" value="${esc(r.v || D.village || '')}" placeholder="Village" aria-label="Village"><input data-k="land.${k}.kh" value="${esc(r.kh || '')}" placeholder="Khewat No." aria-label="Khewat"></div>
        <input data-k="land.${k}.ks" value="${esc(r.ks || '')}" placeholder="Khasra No(s)." aria-label="Khasra" style="margin-top:6px"><div class="g3" style="margin-top:6px"><input data-k="land.${k}.k" value="${esc(r.k || '')}" inputmode="decimal" placeholder="Kanal" aria-label="Kanal"><input data-k="land.${k}.m" value="${esc(r.m || '')}" inputmode="numeric" placeholder="Marla" aria-label="Marla"><input data-k="land.${k}.src" value="${esc(r.src || '')}" placeholder="Jamabandi year" aria-label="Source"></div>
        <button type="button" class="del" data-del="land.${k}">Remove</button></div>`).join('')}
      <button type="button" class="add" data-add="land">+ Add land</button><div class="okb" id="c25land">Total ${r2(c.landK)} kanal = ${r2(c.acres)} acre</div>
      <label class="f">Land / property outside your halqa</label><p class="hl">${tl(H.out)}</p>${seg('out', [['N', 'No'], ['Y', 'Yes']])}
      <input data-k="outDet" value="${esc(D.outDet || '')}" placeholder="${D.out === 'Y' ? 'Where, how much' : 'How you know: affidavit, enquiry, online record'}" aria-label="Details" style="margin-top:6px"></div>`;
    if (i === 4) return `<div class="cd"><label class="f">House – each floor (feet)</label><p class="hl">${tl(H.house)}</p>
      ${D.floors.map((f, k) => `<div class="rw" style="display:flex;gap:8px;align-items:center"><span class="mu" style="flex:none">Floor ${k + 1}</span><input data-k="floors.${k}.l" value="${esc(f.l || '')}" inputmode="decimal" placeholder="Length" aria-label="Length"><span>×</span><input data-k="floors.${k}.b" value="${esc(f.b || '')}" inputmode="decimal" placeholder="Breadth" aria-label="Breadth">${k ? `<button type="button" class="del" data-del="floors.${k}">✕</button>` : ''}</div>`).join('')}
      <button type="button" class="add" data-add="floors">+ Add floor</button>
      <label class="f">Plot – covered + open (feet)</label><p class="hl">${tl(H.plot)}</p><div style="display:flex;gap:8px;align-items:center"><input data-k="pL" value="${esc(D.pL || '')}" inputmode="decimal" placeholder="Length" aria-label="Plot length"><span>×</span><input data-k="pB" value="${esc(D.pB || '')}" inputmode="decimal" placeholder="Breadth" aria-label="Plot breadth"></div>
      <div id="c25hp">${hp(c)}</div>
      <label class="f">Notified municipality?</label><p class="hl">${tl(H.muni)}</p>${seg('muni', [['N', 'No'], ['Y', 'Yes']])}
      <label class="f">Commercial property</label><p class="hl">${tl(H.comm)}</p>${seg('comm', [['N', 'No'], ['Y', 'Yes']])}${D.comm === 'Y' ? `<input data-k="commDet" value="${esc(D.commDet || '')}" placeholder="What, where, area" aria-label="Commercial details" style="margin-top:6px">` : ''}</div>`;
    if (i === 5) return `<div class="cd"><label class="f">Witnesses</label><p class="hl">${tl(H.wit)}</p>
      ${D.wit.map((w, k) => `<div class="rw"><div class="g2"><input data-k="wit.${k}.n" value="${esc(w.n || '')}" placeholder="Name" aria-label="Witness name"><input data-k="wit.${k}.p" value="${esc(w.p || '')}" placeholder="Parentage" aria-label="Parentage"></div>
        <div class="g2" style="margin-top:6px">${sel('wit.' + k + '.r', WREL, w.r)}<input data-k="wit.${k}.mob" value="${esc(w.mob || '')}" inputmode="tel" placeholder="Mobile (optional)" aria-label="Mobile"></div>${k > 1 ? `<button type="button" class="del" data-del="wit.${k}">Remove</button>` : ''}</div>`).join('')}
      <button type="button" class="add" data-add="wit">+ Add witness</button>
      <label class="f">Records you examined</label><p class="hl">${tl(H.recs)}</p>${RECS.map(r => `<div class="rw"><label style="display:flex;gap:10px;align-items:center;font-size:14px"><input type="checkbox" data-ck="${esc(r)}" ${(D.recs || {})[r] ? 'checked' : ''} style="width:22px;height:22px;flex:none">${esc(r)}</label>${(D.recs || {})[r] ? `<input data-k="recNo.${r}" value="${esc((D.recNo || {})[r] || '')}" placeholder="No. / year" aria-label="${esc(r)} number" style="margin-top:6px">` : ''}</div>`).join('')}
      <label class="f" for="f_adv">Adverse facts</label><p class="hl">${tl(H.adv)}</p><textarea id="f_adv" data-k="adv">${esc(D.adv || '')}</textarea></div>`;
    if (i === 6) return `<div class="cd"><h3>EWS tests</h3><table class="tt">${c.tests.map(t => `<tr><td>${esc(t.label)}<div class="mu">${esc(t.limit)}</div></td><td style="text-align:right">${esc(t.found)}<div><span class="pill ${t.ok ? 'ok' : 'ur'}">${t.ok ? 'Within' : 'Exceeds'}</span></div></td></tr>`).join('')}</table></div>
      <div class="cd"><label class="f">Recommendation</label><p class="hl">${tl(H.rec)}</p>${c.allOk ? seg('rec', [['R', 'Recommended'], ['N', 'Not recommended']], D.rec === 'N' ? 'r' : 'g') : '<div class="err">A test fails: Not recommended.</div>'}
      <label class="f" for="f_why">Reason</label><textarea id="f_why" data-k="why">${esc(D.why || '')}</textarea>
      ${D.rec === 'N' ? `<label class="f">Rule / clause failed</label><p class="hl">${tl(H.rule)}</p><input data-k="rule" value="${esc(D.rule || c.tests.filter(t => !t.ok).map(t => t.rule).join('; '))}">` : ''}
      <label class="f">Enclosures</label><p class="hl">${tl(H.encl)}</p>${D.encl.map((e, k) => `<div class="rw" style="display:flex;gap:8px;align-items:center"><input data-k="encl.${k}.t" value="${esc(e.t || '')}" aria-label="Document"><input data-k="encl.${k}.p" value="${esc(e.p || '')}" inputmode="numeric" placeholder="Pages" aria-label="Pages" style="width:80px;flex:none"><button type="button" class="del" data-del="encl.${k}">✕</button></div>`).join('')}
      <button type="button" class="add" data-add="encl">+ Add enclosure</button><p class="mu" style="margin-top:6px">Total pages: <b>${c.pages}</b></p></div>`;
  }
  const hp = c => `<div class="okb">Built-up ${N(c.built)} sq ft${c.built >= 1000 ? ' – <span style="color:#A1261B">above 1000</span>' : ''} · plot ${N(c.plotFt)} sq ft = ${N(Math.round(c.plotYd))} sq yd (limit ${c.plotLim})</div>`;
  function draw() {
    const E = errs(i, D), AE = allErrs(D);
    view().innerHTML = `<div class="t12 c25"><p class="sub" style="margin:0">${esc(app)}${row.ph_name ? ' · Halqa ' + esc(row.ph_name) : ''}</p><h1 style="margin-bottom:2px">${esc(D.name || 'EWS report')}</h1>
      ${newV ? `<div class="wrn" style="margin-bottom:10px">New version v${Number(row.ph.v || 1) + 1}. v${row.ph.v || 1} stays in the file until you generate this one.</div>` : ''}
      <div class="bar">${PARTS.map((p, k) => `<i class="${k === i ? 'c' : AE[k].length ? '' : 'd'}"></i>`).join('')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><span class="mu">Part ${i + 1} of 7 · ${esc(T(PARTS[i][1]))}</span>${lgBar()}</div>
      ${body()}<div id="c25e">${E.map(e => `<div class="err">${tl(e)}</div>`).join('')}</div>
      <div class="ft"><button class="btn12 gh" id="c25b">${i ? 'Back' : 'Save draft'}</button><button class="btn12" id="c25n">${i < 6 ? 'Next' : newV ? 'Generate v' + (Number(row.ph.v || 1) + 1) : 'Generate report'}</button></div>${doubts()}</div>`;
    bindLg(view(), draw);
    on(view(), '[data-k]', 'input', el => { set(el.dataset.k, el.value); live(); });
    on(view(), 'select[data-k]', 'change', el => { set(el.dataset.k, el.value); draw(); });
    on(view(), '[data-seg] button', 'click', b => { set(b.parentNode.dataset.seg, b.dataset.v); draw(); });
    on(view(), '[data-ck]', 'change', el => { D.recs = D.recs || {}; D.recs[el.dataset.ck] = el.checked; keep(); draw(); });
    on(view(), '[data-add]', 'click', b => { const k = b.dataset.add; D[k] = D[k] || []; D[k].push(k === 'fam' ? { rel: '' } : {}); keep(); draw(); });
    on(view(), '[data-del]', 'click', b => { const p = b.dataset.del.split('.'); D[p[0]].splice(Number(p[1]), 1); keep(); draw(); });
    $('#c25model').onclick = e => busy(e.target, 'Making', () => toPDF(docPH(MODEL.row, MODEL.D, { model: 1 }), 'MODEL SAMPLE – EWS Patwari report.pdf', FOOT.ph + ' · MODEL SAMPLE – NOT A REAL CASE'));
    $('#c25b').onclick = e => { if (i) { i--; draw(); window.scrollTo(0, 0); } else busy(e.target, 'Saving', async () => { await save(app, 'ph', D, false); toast('Draft saved'); }); };
    $('#c25n').onclick = e => { if (i < 6) { i++; draw(); window.scrollTo(0, 0); save(app, 'ph', D, false).catch(() => {}); return; }
      const bad = AE.map((x, k) => x.length ? k : -1).filter(k => k >= 0); if (bad.length) { i = bad[0]; draw(); window.scrollTo(0, 0); return toast('Fix part ' + (i + 1) + ' first', 'err'); }
      busy(e.target, 'Generating', async () => { D.incTotal = calc(D).incTotal; D.famCount = calc(D).inFam.length; await save(app, 'ph', D, true); try { kdel('c25:' + app); } catch (x) {} go('c25d', { app }); }); };
  }
  function live() { const c = calc(D), t = $('#c25tot'), l = $('#c25land'), h = $('#c25hp'); if (t) t.textContent = `Total FY ${c.fy}: ₹${N(c.incTotal)} (${words(c.incTotal)})`; if (l) l.textContent = `Total ${r2(c.landK)} kanal = ${r2(c.acres)} acre`; if (h) h.innerHTML = hp(c);
    const E = errs(i, D); $('#c25e').innerHTML = E.map(e => `<div class="err">${tl(e)}</div>`).join(''); }
  if (calc(D).allOk === false && D.rec === 'R') D.rec = 'N';
  draw();
};

/* 3. Patwari: report ready */
VIEWS.c25d = async function (a) {
  const app = a.app; wideOn('Report ready'); let R = (S.c25 || {})[app]; if (!R) { loading(); try { R = await load(app); } catch (e) { fail(e.message); return; } }
  const row = R.row, D = row.ph, txt = phRemark(row, D);
  view().innerHTML = `<div class="t12 c25"><p class="sub" style="margin:0">${esc(app)}</p><h1>Report ready</h1>
    <div class="okb" style="margin-bottom:10px">v${D.v || 1} generated. The NT, BCG and Tehsildar can now see it in TehsilOS.</div>
    <div class="cd"><h3>1 · Upload on JanSugam ("Upload Report")</h3><div style="display:flex;gap:8px"><button class="btn12" id="pdf" style="flex:1">PDF</button><button class="btn12 gh" id="doc" style="flex:1">Word</button></div><p class="mu" style="margin-top:6px">Print, sign every page, scan with the annexures, upload.</p></div>
    <div class="cd"><h3>2 · Paste in "Patwari Report" <span class="mu">${txt.length} / ${LIM}</span></h3><div class="tx">${esc(txt)}</div><button class="btn12" id="cp" style="width:100%;margin-top:10px">Copy text</button></div>
    <div style="display:flex;gap:8px"><button class="btn12 gh" id="fl" style="flex:1">Open the file</button><button class="btn12 gh" id="hm" style="flex:1">Certificates</button></div></div>`;
  $('#pdf').onclick = e => busy(e.target, 'Making', () => toPDF(docPH(row, D), fname(row, 'EWS Patwari report', 'pdf'), FOOT.ph + ' · ' + row.app_no + ' · v' + (D.v || 1)));
  $('#doc').onclick = e => busy(e.target, 'Making', async () => toDOCX(docPH(row, D), fname(row, 'EWS Patwari report', 'docx'), FOOT.ph + ' · ' + row.app_no + ' · v' + (D.v || 1)));
  $('#cp').onclick = async () => toast(await copyText(txt) ? 'Copied – paste in JanSugam' : 'Could not copy', 'ok');
  $('#fl').onclick = () => go('c25f', { app }); $('#hm').onclick = () => { NAV.stack = NAV.stack.filter(x => x.name === 'tos12' || x.name === 'home').slice(0, 1); go('c25', {}); };
};

/* 4. NT / BCG / Tehsildar */
VIEWS.c25r = async function (a) {
  const app = a.app, w = who(); wideOn('Certificate'); loading('Opening ' + app + '…');
  let R; try { R = await load(app); } catch (e) { fail(e.message); return; } if (current().name !== 'c25r') return;
  if (!R.found) { view().innerHTML = `<div class="t12 c25"><h1>${esc(app)}</h1><div class="cd">The Patwari has not started this application in TehsilOS yet.</div></div>`; return; }
  const row = R.row, fam = R.family || [], D = row.ph || {}, c = calc(D);
  const part = w === 'oq' ? '' : w; const mineOld = part ? row[part] || {} : {}, seen = (mineOld.based_on || {}).ph, ntSeen = ((row.nt || {}).based_on || {}).ph;
  const X = Object.assign({ vi: {}, docs: {}, defects: [], own: '', rec: '', why: '', rule: '', pages: '' }, mineOld); delete X.prev; delete X.based_on; if (typeof X.v === 'object') { X.vi = X.v; } delete X.v;
  const sum = `<div class="cd"><h3>Patwari's facts <span class="pill ${D.rec === 'R' ? 'ok' : 'ur'}">${D.rec === 'R' ? 'Recommended' : D.rec === 'N' ? 'Not recommended' : '–'}</span></h3>
    <p class="mu" style="color:#1E2226">${esc(row.applicant)} · ${esc(row.village)} · Halqa ${esc(row.ph_name || '')} · report ${dmy((D.done_at || '').slice(0, 10))}</p>
    <table class="tt">${c.tests.map(t => `<tr><td>${esc(t.label)}</td><td style="text-align:right">${esc(t.found)} <span class="pill ${t.ok ? 'ok' : 'ur'}">${t.ok ? 'Within' : 'Exceeds'}</span></td></tr>`).join('')}
    <tr><td>Family counted</td><td style="text-align:right">${c.inFam.length} – ${esc(c.inFam.map(m => m.n + ' ' + m.age).join(', '))}</td></tr>
    <tr><td>Income lines</td><td style="text-align:right">${esc((D.inc || []).map(r => r.m + ' ₹' + N(r.amt) + ' (' + r.basis + ')').join('; '))}</td></tr>
    <tr><td>Witnesses</td><td style="text-align:right">${esc((D.wit || []).filter(x => has(x.n)).map(x => x.n + ' (' + x.r + ')').join(', '))}</td></tr></table>
    ${fam.filter(f => f.income != null).map(f => `<div class="wrn">Family case ${esc(f.app_no)} (${esc(f.applicant)}, ${esc(f.service)}): income ₹${N(f.income)}${f.family != null ? ', ' + f.family + ' counted' : ''}${Math.abs(f.income - c.incTotal) > 1 ? ' – differs from this case' : ''}.</div>`).join('')}
    <button class="btn12 gh" id="phpdf" style="width:100%;margin-top:10px">Patwari's report (PDF)</button></div>`;
  const pv = n => n == null ? null : Number(D.v || 1) === n ? D : (D.prev || []).find(o => Number(o.v || 1) === n) || null;
  const facts = o => { const k = calc(o); return [['Income', '₹' + N(k.incTotal)], ['Family', String(k.inFam.length)], ['Land', r2(k.landK) + ' kanal'], ['House', N(k.built) + ' sq ft'], ['Plot', N(Math.round(k.plotYd)) + ' sq yd'], ['Patwari says', o.rec === 'R' ? 'Recommended' : o.rec === 'N' ? 'Not recommended' : '–']]; };
  const cmp = (n, who2) => { const o = pv(n); if (!o || n >= Number(D.v || 1)) return ''; const a = facts(o), b = facts(D);
    return `<div class="cd"><h3>Patwari v${n} → v${D.v || 1}</h3><p class="mu" style="margin:0 0 6px">${who2} saw v${n}. Changes in red.</p><table class="tt"><tr><td class="mu">Item</td><td class="mu">v${n}</td><td class="mu">v${D.v || 1}</td></tr>${a.map((x, k) => `<tr><td>${x[0]}</td><td>${esc(x[1])}</td><td style="${x[1] !== b[k][1] ? 'color:#B42318;font-weight:700' : ''}">${esc(b[k][1])}</td></tr>`).join('')}</table></div>`; };
  const verNote = part && mineOld.at && seen != null && seen < Number(D.v || 1) ? `<div class="wrn">Your v${mineOld.v || 1} was based on Patwari v${seen}. The Patwari has since made v${D.v}. Check the changes and make a new version.</div>${cmp(seen, 'Your last report')}` : '';
  const ntCmp = part === 'da' || part === 'teh' ? cmp(ntSeen, 'The NT') : '';
  const recSeg = () => `<div class="seg ${X.rec === 'N' ? 'r' : 'g'}" data-rec><button type="button" data-v="R" class="${X.rec === 'R' ? 'on' : ''}">Recommended</button><button type="button" data-v="N" class="${X.rec === 'N' ? 'on' : ''}">Not recommended</button></div>`;
  const common = lbl => `<label class="f" for="own">${lbl}</label><p class="hl">A fact not in the reports below you – a call made, a record checked, a mismatch found. Remarks without it are not produced.</p><textarea id="own" data-x="own">${esc(X.own || '')}</textarea>
    <label class="f">Recommendation</label>${recSeg()}<label class="f" for="why">Reason</label><input id="why" data-x="why" value="${esc(X.why || '')}">${X.rec === 'N' ? `<label class="f" for="rule">Rule / clause failed</label><input id="rule" data-x="rule" value="${esc(X.rule || '')}">` : ''}`;
  const chk = () => { const E = []; if (String(X.own || '').trim().length < 25) E.push('Write your own check (at least one full sentence).'); if (X.own && phRemark(row, D).indexOf(String(X.own).trim().slice(0, 40)) >= 0) E.push('Your own check repeats the Patwari\'s text.');
    if (!X.rec) E.push('Choose Recommended or Not recommended.'); if (String(X.why || '').trim().length < 10) E.push('Write the reason.'); if (X.rec === 'N' && !has(X.rule)) E.push('Write the rule or clause failed.'); return E; };
  function calcOut() {
    const E = part === 'teh' ? ((String(X.why || '').trim().length < 10 ? ['Write your reason.'] : []).concat(!X.rec ? ['Choose Approve or Reject.'] : []).concat(X.rec === 'N' && !has(X.rule) ? ['Write the rule.'] : [])) : part ? chk() : [];
    if (part === 'da' && !has(X.pages)) E.push('Write the pages uploaded.');
    return { E, txt: !part || E.length ? '' : part === 'da' ? daRemark(row, X) : part === 'teh' ? tehRemark(row, X) : ntRemark(row, X, part) };
  }
  function oBox() { const o = calcOut(); return `<h3>Remark for JanSugam <span class="mu">${o.txt.length} / ${LIM}</span></h3>${o.E.length ? o.E.map(e => `<div class="err">${esc(e)}</div>`).join('') : `<div class="tx">${esc(o.txt)}</div>`}
      <button class="btn12" id="cp" style="width:100%;margin-top:10px" ${o.E.length ? 'disabled' : ''}>Save and copy remark</button>`; }
  function out() { const b = $('#c25o'); if (b) b.innerHTML = oBox(); }
  function draw() {
    let mid = '', outBtns = '';
    if (part === 'nt' || part === 'gq') {
      mid = `<div class="cd"><h3>Items you checked</h3>${VITEMS.map(v => { const s = (X.vi[v[0]] || {}).s || ''; return `<div class="rw"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span style="font-size:14px;font-weight:700">${v[1]}</span><div class="seg" data-vi="${v[0]}" style="flex:none;width:170px"><button type="button" data-v="Y" class="${s === 'Y' ? 'on' : ''}">Verified</button><button type="button" data-v="N" class="${s === 'N' ? 'on' : ''}">Not</button></div></div>${s ? `<input data-vh="${v[0]}" value="${esc((X.vi[v[0]] || {}).h || '')}" placeholder="How – record, call, visit" aria-label="How verified" style="margin-top:6px">` : ''}</div>`; }).join('')}</div>
        <div class="cd">${common('Your own check (required)')}</div>`;
      outBtns = `<div style="display:flex;gap:8px;margin-top:10px"><button class="btn12 gh" data-out="pdf" style="flex:1">${part === 'gq' ? 'GQ' : 'NT'} report PDF</button><button class="btn12 gh" data-out="doc" style="flex:1">Word</button></div>`;
    } else if (part === 'da') {
      const F = daFlags(row, fam);
      mid = `<div class="cd"><h3 style="color:${F.length ? '#A1261B' : '#1F6B42'}">${F.length ? 'App found ' + F.length + ' problem' + (F.length > 1 ? 's' : '') : 'App found no problem'}</h3>${F.map(f => `<div class="mu" style="color:#1E2226;padding:4px 0">• ${esc(f)}</div>`).join('')}</div>
        <div class="cd"><h3>Return memo (if needed)</h3><p class="hl">Tick the defects to make a memo for WhatsApp or print. Send the case back on JanSugam yourself – nothing is saved here.</p>${F.concat(DADEF).map((d, k) => `<label class="rw" style="display:flex;gap:10px;align-items:flex-start;font-size:13.5px"><input type="checkbox" data-df="${esc(d)}" ${X.defects.indexOf(d) >= 0 ? 'checked' : ''} style="width:22px;height:22px;flex:none">${esc(d)}</label>`).join('')}
          <input data-dfo placeholder="Other defect (optional)" aria-label="Other defect" style="margin-top:6px"><button class="btn12 gh" id="ret" style="width:100%;margin-top:10px">Make return memo</button></div>
        <div class="cd"><h3>Or: all clear</h3>${DADOCS.map((d, k) => `<label class="rw" style="display:flex;gap:10px;align-items:center;font-size:13.5px"><input type="checkbox" data-doc="${k}" ${X.docs[k] ? 'checked' : ''} style="width:22px;height:22px;flex:none">${esc(d)}</label>`).join('')}
          <label class="f" for="pg">Pages uploaded on JanSugam (Patwari listed ${c.pages})</label><input id="pg" data-x="pages" inputmode="numeric" value="${esc(X.pages || '')}">${common('Your own check (required)')}</div>`;
      outBtns = `<div style="display:flex;gap:8px;margin-top:10px"><button class="btn12 gh" data-out="pdf" style="flex:1">Scrutiny note PDF</button><button class="btn12 gh" data-out="doc" style="flex:1">Word</button></div>`;
    } else if (part === 'teh') {
      mid = `<div class="cd"><h3>Approve or reject</h3><div class="seg ${X.rec === 'N' ? 'r' : 'g'}" data-rec><button type="button" data-v="R" class="${X.rec === 'R' ? 'on' : ''}">Approve</button><button type="button" data-v="N" class="${X.rec === 'N' ? 'on' : ''}">Reject</button></div>
        <label class="f" for="why">Your reason (one line, your own)</label><input id="why" data-x="why" value="${esc(X.why || '')}" placeholder="e.g. Income ₹1.52 lakh and all property tests within Rule 21(viii)">
        ${X.rec === 'N' ? `<label class="f" for="rule">Rule / clause</label><input id="rule" data-x="rule" value="${esc(X.rule || '')}"><label class="f" for="nt2">Notice to applicant issued on</label><input id="nt2" type="date" data-x="notice" value="${esc(X.notice || '')}"><label class="f" for="rp">Reply received (if any)</label><input id="rp" data-x="reply" value="${esc(X.reply || '')}">` : ''}</div>`;
    }
    view().innerHTML = `<div class="t12 c25"><p class="sub" style="margin:0">${esc(app)} · ${WHO[w]}</p><h1>${esc(row.applicant || '')} · EWS</h1>${sum}
      ${verNote}${ntCmp}${row.ph_status !== 'DONE' ? `<div class="wrn">The Patwari has not generated his report yet.</div>` : mid}
      ${part && row.ph_status === 'DONE' ? `<div class="cd"><div id="c25o">${oBox()}</div>${part !== 'teh' ? outBtns : ''}</div>` : ''}</div>`;
    $('#phpdf').onclick = e => busy(e.target, 'Making', () => toPDF(docPH(row, D), fname(row, 'EWS Patwari report', 'pdf'), FOOT.ph + ' · ' + row.app_no));
    on(view(), '[data-x]', 'input', el => { X[el.dataset.x] = el.value; out(); });
    on(view(), '[data-rec] button', 'click', b => { X.rec = b.dataset.v; draw(); });
    on(view(), '[data-vi] button', 'click', b => { const k = b.parentNode.dataset.vi; X.vi[k] = Object.assign(X.vi[k] || {}, { s: b.dataset.v }); draw(); });
    on(view(), '[data-vh]', 'input', el => { X.vi[el.dataset.vh].h = el.value; out(); });
    on(view(), '[data-doc]', 'change', el => { X.docs[el.dataset.doc] = el.checked; out(); });
    on(view(), '[data-df]', 'change', el => { const d = el.dataset.df; X.defects = X.defects.filter(x => x !== d); if (el.checked) X.defects.push(d); });
    const ret = $('#ret'); if (ret) ret.onclick = e => { const o = ($('[data-dfo]') || {}).value; const defects = X.defects.concat(has(o) ? [o.trim()] : []); if (!defects.length) return toast('Tick at least one defect', 'err');
      const M = { defects }, t = memoText(Object.assign({}, row), M);
        openSheet(() => ({ html: `<div class="snav"><button id="x">Close</button><span></span><span></span></div><h2 class="nm">Return memo</h2><p class="mu">Send the case back on JanSugam. This memo is not saved in TehsilOS.</p><div class="tx c25" style="margin:10px 0">${esc(t)}</div><button class="btn12" id="wa" style="width:100%">Send on WhatsApp</button><button class="btn12 gh" id="mp" style="width:100%;margin-top:8px">Memo PDF</button>`,
          mount: el => { $('#x', el).onclick = () => closeSheet(); $('#wa', el).onclick = () => sendWA(t); $('#mp', el).onclick = ev => busy(ev.target, 'Making', () => toPDF(docMemo(row, M), fname(row, 'Return memo', 'pdf'), FOOT.memo + ' · ' + row.app_no)); } })); };
    on(view(), '#c25o', 'click', (box, ev) => { const e = { target: ev.target.closest('#cp') }; if (!e.target || e.target.disabled) return; const txt = calcOut().txt; busy(e.target, 'Saving', async () => { if (part === 'da') X.flags = daFlags(row, fam); const Y = Object.assign({}, X); delete Y.by; delete Y.at; if (part !== 'da') { delete Y.docs; delete Y.defects; delete Y.pages; } if (part !== 'nt') delete Y.vi; delete Y.v; delete Y.prev; delete Y.based_on;
      await save(app, part, Y); toast(await copyText(txt) ? 'Saved and copied – paste in JanSugam' : 'Saved', 'ok'); NAV.stack = NAV.stack.filter(x => x.name !== 'c25r' && x.name !== 'c25f'); go('c25f', { app }); }); });
    on(view(), '[data-out]', 'click', b => busy(b, 'Making', async () => { const Y = Object.assign({}, X, { by: me() }); const blocks = part === 'da' ? docDA(row, Object.assign(Y, { flags: daFlags(row, fam) })) : docNT(row, Y, part);
      const nm = part === 'da' ? 'EWS scrutiny note' : part === 'gq' ? 'EWS GQ report' : 'EWS NT report'; if (b.dataset.out === 'pdf') await toPDF(blocks, fname(row, nm, 'pdf'), FOOT[part] + ' · ' + row.app_no); else toDOCX(blocks, fname(row, nm, 'docx'), FOOT[part] + ' · ' + row.app_no); }));
  }
  draw();
};

/* 5. Blank proformas */
VIEWS.c25b = async function () {
  wideOn('Blank proformas'); const w = who();
  const kinds = [['ph', 'Patwari'], ['nt', 'NT'], ['gq', 'GQ'], ['da', 'BCG'], ['model', 'Model sample']];
  view().innerHTML = `<div class="t12 c25"><h1>Blank proformas</h1><p class="sub">Any service · no Application No. needed</p><input id="q" type="search" placeholder="Search – e.g. EWS, domicile" aria-label="Search service">
    <div class="cd" id="lst" style="margin-top:10px">${SVC.map(s => `<div class="rw" data-s="${esc(s.name.toLowerCase() + ' ' + s.code.toLowerCase())}"><div style="font-weight:800;font-size:14.5px">${esc(s.name)} <span class="pill ${s.live ? 'ok' : 'wt'}">${s.pf}</span></div>
      ${s.live ? `<div class="seg" style="margin-top:6px">${kinds.map(k => `<button type="button" data-k="${k[0]}">${k[1]}</button>`).join('')}</div><div style="display:flex;gap:8px;margin-top:6px"><button class="btn12" data-f="pdf" style="flex:1">PDF</button><button class="btn12 gh" data-f="doc" style="flex:1">Word</button></div>` : '<div class="mu">Comes in the next update.</div>'}</div>`).join('')}</div></div>`;
  let kind = w === 'gq' ? 'gq' : w === 'da' ? 'da' : w === 'nt' ? 'nt' : 'ph';
  const mark = () => $$('[data-k]', view()).forEach(b => b.classList.toggle('on', b.dataset.k === kind)); mark();
  on(view(), '[data-k]', 'click', b => { kind = b.dataset.k; mark(); });
  $('#q').oninput = e => { const q = e.target.value.toLowerCase().trim(); $$('[data-s]', view()).forEach(r => r.hidden = q && r.dataset.s.indexOf(q) < 0); };
  on(view(), '[data-f]', 'click', b => busy(b, 'Making', async () => {
    const empty = { app_no: '', applicant: '', village: '', ph_name: '', ph: blankPH() };
    const blocks = kind === 'model' ? docPH(MODEL.row, MODEL.D, { model: 1 }) : kind === 'ph' ? docPH(empty, blankPH(), { blank: 1 }) : kind === 'da' ? docDA(empty, {}, { blank: 1 }) : docNT(empty, {}, kind, { blank: 1 });
    const nm = 'EWS – ' + (kind === 'model' ? 'MODEL SAMPLE Patwari report' : 'blank ' + kinds.find(k => k[0] === kind)[1] + ' proforma'), ft = (FOOT[kind] || FOOT.ph) + (kind === 'model' ? ' · MODEL SAMPLE – NOT A REAL CASE' : '');
    if (b.dataset.f === 'pdf') await toPDF(blocks, nm + '.pdf', ft); else toDOCX(blocks, nm + '.docx', ft); }));
};

/* ---------- entry points ---------- */
Object.assign(TABOF10, { c25: 'tos12', c25f: 'tos12', c25p: 'tos12', c25d: 'tos12', c25r: 'tos12', c25b: 'tos12' });
Object.assign(PWV95, { c25: 'c25', c25f: 'c25', c25p: 'c25', c25d: 'c25', c25r: 'c25', c25b: 'c25' });
if (typeof WRITE_API !== 'undefined' && WRITE_API.indexOf('cert25Save') < 0) WRITE_API.push('cert25Save');
Object.assign(HELP, {
  c25: { en: ['Certificates', 'Type the JanSugam Application No. to open its report.', 'The Patwari fills it first; the NT, GQ, BCG and Tehsildar then add their own check.'], hi: ['Certificates', 'JanSugam ka Application No. likhein.', 'Pehle Patwari bharega; phir NT, GQ, BCG aur Tehsildar apni jaanch jodenge.'] },
  c25p: { en: ['EWS report', 'Seven short parts. Red lines must be fixed before the report is generated.', 'Help language: English, Hinglish or Urdu at the top.'], hi: ['EWS report', 'Saat chhote hisse. Laal galtiyan theek karke hi report banegi.', 'Madad ki zubaan upar badlein: English, Hinglish ya Urdu.'] }
});
const _ub25 = updateBnav;
updateBnav = function () {
  _ub25();
  const pw = $('#pwn95'), w = who();
  if (pw && w && !$('[data-pw="c25"]', pw)) {
    const b = document.createElement('button'); b.dataset.pw = 'c25';
    b.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg><span>Certs</span>`;
    b.onclick = e => { e.stopPropagation(); const c = current(); if (!c || PWV95[c.name] !== 'c25') { closeAllSheets(); NAV.stack = [{ name: 'home', args: {} }]; go('c25', {}); } };
    pw.appendChild(b);
  }
  if (pw) { const c = current(); $$('#pwn95 button').forEach(x => { if (x.dataset.pw === 'c25') x.classList.toggle('on', !!c && PWV95[c.name] === 'c25'); }); }
};
const _t25 = VIEWS.tos12;
if (_t25) VIEWS.tos12 = async function (a) {
  const pr = _t25(a);
  try { if (who() && !$('#c25q0')) { const h = $('.t12', view()); if (h) { const q = document.createElement('button'); q.id = 'c25q0'; q.className = 'cd row'; q.style.cssText = 'display:block;border:0;width:100%;text-align:left';
    q.innerHTML = '<h3>Certificates <span>›</span></h3><div class="lbl">Open while the tehsil status loads</div>'; q.onclick = () => go('c25', {}); h.insertBefore(q, h.firstChild); } } } catch (e) {}
  await pr;
  try { if (current().name !== 'tos12' || $('#c25t') || !who()) return; const host = $('.t12', view()); if (!host) return;
    const b = document.createElement('button'); b.id = 'c25t'; b.className = 'cd row'; b.style.cssText = 'display:block;border:0;width:100%;text-align:left';
    b.innerHTML = `<h3>Certificates <span class="pill ok">New</span></h3><div class="lbl">JanSugam reports and remarks – Patwari → NT → BCG → you</div><div class="lbl" style="margin-top:6px">Open ›</div>`;
    b.onclick = () => go('c25', {}); const more = $$('.cd', host).find(c => /^More/.test(($('h3', c) || {}).textContent || '')); host.insertBefore(b, more || null); } catch (e) {}
};
})();
