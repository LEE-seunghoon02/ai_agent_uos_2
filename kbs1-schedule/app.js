const LANES = [
  {k:'fact', n:'팩트&시사'},
  {k:'know', n:'지식&인사이트'},
  {k:'heal', n:'힐링&여행'},
  {k:'human',n:'세대공감&휴먼'},
  {k:'local',n:'공익&로컬'},
  {k:'life', n:'실생활&안전'},
];
const LN = Object.fromEntries(LANES.map(l=>[l.k,l.n]));
const START = 5*60, END = 29*60, PX = 3; // 3px per minute
const W = (END-START)*PX;

const SVG = {
  D:'<svg viewBox="0 0 16 16"><path d="M4.5 6.2a3.5 3.5 0 1 1 7 0c0 2.2-2.4 2.6-2.4 4.7a2.1 2.1 0 0 1-3.9 1.1"/><path d="M6.6 6.4a1.4 1.4 0 0 1 2.8 0"/></svg>',
  S:'<svg viewBox="0 0 16 16"><path d="M5.2 9V4.6a.9.9 0 0 1 1.8 0V8M7 8V3.3a.9.9 0 0 1 1.8 0V8M8.8 8V4.2a.9.9 0 0 1 1.8 0V9M10.6 9V6.3a.9.9 0 0 1 1.8 0v3.6A4.3 4.3 0 0 1 8.1 14.2h-.6a4 4 0 0 1-3.2-1.6L2.7 10.5a.95.95 0 0 1 1.5-1.2L5.2 10.4"/></svg>',
  T:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="1.3" fill="currentColor"/><path d="M5.4 5.4a3.7 3.7 0 0 0 0 5.2M10.6 5.4a3.7 3.7 0 0 1 0 5.2M3.3 3.3a6.6 6.6 0 0 0 0 9.4M12.7 3.3a6.6 6.6 0 0 1 0 9.4"/></svg>',
  B:'<svg viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="8" height="6" rx="1"/><path d="M4 11.5l-1.5 1.8V8.5M9.5 5.5h4a1 1 0 0 1 1 1V11a1 1 0 0 1-1 1H13v1.7L11.4 12H8.5a1 1 0 0 1-1-1V8.5"/></svg>',
  V:'<svg viewBox="0 0 16 16"><rect x="1.5" y="4" width="9" height="8" rx="1.2"/><path d="M10.5 7l4-2.2v6.4l-4-2.2"/></svg>',
  X:'<svg viewBox="0 0 16 16"><path d="M3 6.5a5 5 0 0 1 8.9-2.2M12.3 1.8v2.8H9.5M13 9.5a5 5 0 0 1-8.9 2.2M3.7 14.2v-2.8h2.8"/></svg>',
};
const FL = { // order shown in the box (top-right)
  R:{t:'재방송', h:'<i class="b c x-R">재</i>'},
  L:{t:'일부 지역 자체방송', h:'<i class="b c x-L">지</i>'},
  U:{t:'UHD', h:'<i class="b x-U">UHD</i>'},
  C:{t:'자막방송', h:'<i class="b x-C">CC</i>'},
  D:{t:'화면해설(DVS)', h:'<i class="b ic">'+SVG.D+'</i>'},
  S:{t:'한국수어', h:'<i class="b ic">'+SVG.S+'</i>'},
  F:{t:'5.1 채널', h:'<i class="b x-5">5.1</i>'},
  T:{t:'스테레오', h:'<i class="b ic">'+SVG.T+'</i>'},
  B:{t:'음성 다중', h:'<i class="b ic">'+SVG.B+'</i>'},
  V:{t:'보이는 라디오', h:'<i class="b ic">'+SVG.V+'</i>'},
  X:{t:'교체편성', h:'<i class="b ic">'+SVG.X+'</i>'},
};
const GRL = [['A','전체시청'],['7','7세이상'],['12','12세이상'],['15','15세이상'],['19','19세이상']];
const GR = Object.fromEntries(GRL);
const gBadge = g => g==='-'?'':`<i class="b c g-${g}">${g}</i>`;
const ORDER = 'RLUCDSFTBVX';
const fBadges = f => ORDER.split('').filter(c=>f.includes(c)).map(c=>FL[c].h).join('');
const hm = m => String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const dur = m => m>=60 ? `${Math.floor(m/60)}시간${m%60?' '+m%60+'분':''}` : `${m}분`;
const esc = s => s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

let day = 0, sel = null;
const $ = id => document.getElementById(id);

function tabs(){
  $('tabs').innerHTML = DAYS.map((d,i)=>{
    const md = d.label.replace('월 ','.').replace('일','');
    return `<button class="tab${/토|일/.test(d.dow)?' we':''}" role="tab" id="tab${i}" aria-selected="${i===day}" data-i="${i}"><b>${md}</b><span>${d.dow}</span></button>`;
  }).join('');
  $('tabs').querySelectorAll('.tab').forEach(b=>b.onclick=()=>{day=+b.dataset.i;sel=null;tabs();render();});
}

function render(){
  const d = DAYS[day];
  let h = `<div class="row ruler"><div class="lab"></div><div class="track" style="width:${W}px">`;
  for(let m=START;m<=END;m+=30){
    const x=(m-START)*PX, full=m%60===0;
    h += `<div class="tick${full?' h':''}" style="left:${x}px"></div>`;
    if(full && m<END) h += `<div class="tlab${m>=24*60?' late':''}" style="left:${x}px">${String(m/60).padStart(2,'0')}</div>`;
  }
  h += `</div></div>`;
  for(const ln of LANES){
    const ps = d.progs.map((p,i)=>({...p,idx:i})).filter(p=>p.l===ln.k);
    const tot = ps.reduce((a,p)=>a+p.e-p.s,0);
    h += `<div class="row lane" data-k="${ln.k}"><div class="lab"><div class="n">${ln.n}</div><div class="m">${ps.length?dur(tot)+' · '+ps.length+'편':'편성 없음'}</div></div><div class="track" style="width:${W}px">`;
    for(let m=START;m<END;m+=60) h += `<div class="tick h" style="left:${(m-START)*PX}px"></div>`;
    for(const p of ps){
      const w=(p.e-p.s)*PX-2, x=(p.s-START)*PX+1;
      h += `<button class="bar${w<54?' narrow':''}" data-i="${p.idx}" style="left:${x}px;width:${w}px" aria-label="${hm(p.s)} ${esc(p.t)}" title="${hm(p.s)}–${hm(p.e)} ${esc(p.t)}">`+
           `<span class="badges">${gBadge(p.g)}${fBadges(p.f)}</span>`+
           `<span class="name">${esc(p.t)}</span><span class="tm">${hm(p.s)}</span></button>`;
    }
    h += `</div></div>`;
  }
  $('inner').innerHTML = h;
  // fit lane height to the tallest bar content (badges wrap downward in short bars)
  document.querySelectorAll('.row.lane').forEach(row=>{
    const bars=[...row.querySelectorAll('.bar')];
    let need=44;
    bars.forEach(b=>{b.style.height='auto'; need=Math.max(need,b.scrollHeight);});
    row.style.height=(need+12)+'px';
    bars.forEach(b=>b.style.height=need+'px');
  });
  $('inner').querySelectorAll('.bar').forEach(b=>b.onclick=()=>select(+b.dataset.i));
  if(typeof drawFlow==='function') drawFlow(true);
  if(sel===null){ sel = d.progs.findIndex(p=>p.s<=21*60 && p.e>21*60); if(sel<0) sel=0; }
  select(sel,false);
}

function select(i, scroll=true){
  sel=i;
  const d=DAYS[day], p=d.progs[i];
  document.querySelectorAll('.bar').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));
  const fl=[];
  if(p.g!=='-') fl.push(`<span>${gBadge(p.g)}${GR[p.g]}</span>`);
  ORDER.split('').filter(c=>p.f.includes(c)).forEach(c=>fl.push(`<span>${FL[c].h}${FL[c].t}</span>`));
  if(!p.f.includes('R')) fl.unshift('<span style="color:var(--accent);font-weight:600">본방송</span>');
  $('dcard').innerHTML = `<div class="eyebrow"><span class="chip">${LN[p.l]}</span><span style="font-family:var(--mono)">${d.label}(${d.dow}) ${hm(p.s)}–${hm(p.e)}</span><span>${dur(p.e-p.s)}</span></div>
    <div class="dt">${esc(p.t)}</div><p class="intent">${esc(p.i)}</p><div class="flist">${fl.join('')}</div>`;
  const same = d.progs.map((q,j)=>({...q,j})).filter(q=>q.l===p.l);
  $('scard').innerHTML = `<h3>이날 ‘${LN[p.l]}’ 편성 ${same.length}편</h3><ol>`+
    same.map(q=>`<li class="${q.j===i?'cur':''}"><button data-i="${q.j}"><span class="sm">${hm(q.s)}–${hm(q.e)}</span><span class="st">${esc(q.t)}</span></button></li>`).join('')+`</ol>`;
  $('scard').querySelectorAll('button').forEach(b=>b.onclick=()=>select(+b.dataset.i));
  if(scroll){
    const c=$('chart'), lab=132, x=(p.s-START)*PX;
    if(x < c.scrollLeft || x > c.scrollLeft + c.clientWidth - lab - 80) c.scrollLeft = Math.max(0, x - 120);
  }
}

document.querySelectorAll('.jump').forEach(b=>b.onclick=()=>{$('chart').scrollLeft=(+b.dataset.h*60-START)*PX-8;});

$('legend').innerHTML =
  `<dt>시청등급</dt><dd>${GRL.map(([g,t])=>`<span>${gBadge(g)}${t}</span>`).join('')}</dd>`+
  `<dt>방송구분</dt><dd>${ORDER.split('').map(c=>`<span>${FL[c].h}${FL[c].t}</span>`).join('')}</dd>`;


const audOf = t => { for(const [k,g,x] of AUD) if(t.includes(k)) return {g:g.split(' '), x:(x||'').split(' ')}; return {g:[],x:[]}; };
const ACOL = k => `var(--a-${k})`;
let age = null;

function ages(){
  $('ages').innerHTML = AGES.map(a=>`<button class="age" id="age-${a.k}" style="--c:${ACOL(a.k)}" aria-pressed="${age===a.k}" data-k="${a.k}"><i></i>${a.n}</button>`).join('');
  $('ages').querySelectorAll('.age').forEach(b=>b.onclick=()=>{ age = age===b.dataset.k ? null : b.dataset.k; ages(); drawFlow(true); });
}

function chainOf(d){
  return d.progs.map((p,i)=>({...p,i})).filter(p=>p.e-p.s>=15 && p.s<25*60 && audOf(p.t).g.includes(age));
}

function drawFlow(jump=false){
  const inner=$('inner');
  inner.querySelector('svg.flow')?.remove();
  inner.querySelectorAll('.bar.inpath').forEach(b=>b.classList.remove('inpath'));
  const aud=$('aud');
  if(!age){
    inner.classList.remove('dim');
    $('flowlist').innerHTML='';
    $('audsum').textContent='연령대를 누르면 그 연령대가 관심을 가질 만한 프로그램이 편성표 위에서 화살표로 이어집니다. 앞 프로그램이 끝나는 지점에서 다음 프로그램이 시작하는 지점으로, 네트워크 공정표처럼 따라가며 볼 수 있습니다.';
    return;
  }
  const d=DAYS[day], A=AGES.find(a=>a.k===age), col=ACOL(age);
  inner.style.setProperty('--agec',col); aud.style.setProperty('--agec',col);
  inner.classList.add('dim');
  const ch=chainOf(d);
  const ir=inner.getBoundingClientRect();
  const box=i=>{const b=inner.querySelector(`.bar[data-i="${i}"]`); b.classList.add('inpath'); const r=b.getBoundingClientRect(); return {l:r.left-ir.left,r:r.right-ir.left,t:r.top-ir.top,b:r.bottom-ir.top,m:(r.top+r.bottom)/2-ir.top};};
  const bs=ch.map(p=>box(p.i));
  const W2=inner.scrollWidth, H2=inner.offsetHeight;
  let s=`<svg class="flow" width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}" style="color:${col}" aria-hidden="true">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`;
  for(let k=0;k<ch.length-1;k++){
    const a=bs[k], b=bs[k+1], gap=ch[k+1].s-ch[k].e;
    const dash = gap>30 ? ' stroke-dasharray="5 4"' : '';
    let path;
    if(Math.abs(a.m-b.m)<2){
      if(b.l-a.r>28) path=`M${a.r} ${a.m} L${b.l-1} ${b.m}`;
      else { const y=a.t; path=`M${a.r-18} ${y} C${a.r-6} ${y-26} ${b.l+6} ${y-26} ${b.l+18} ${y-1}`; }
    } else {
      const dx=Math.max(34,(b.l-a.r)/2);
      path=`M${a.r} ${a.m} C${a.r+dx} ${a.m} ${b.l-dx} ${b.m} ${b.l-1} ${b.m}`;
    }
    s+=`<path d="${path}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"${dash} marker-end="url(#ah)"/>`;
  }
  bs.forEach((b,k)=>{ s+=`<circle cx="${b.l+1}" cy="${b.t+1}" r="9" fill="currentColor"/><text x="${b.l+1}" y="${b.t+4.6}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10.5" font-weight="600" fill="var(--paper)">${k+1}</text>`; });
  s+='</svg>';
  inner.insertAdjacentHTML('beforeend',s);

  const tot=ch.reduce((x,p)=>x+p.e-p.s,0);
  const links=ch.slice(1).filter((p,k)=>p.s-ch[k].e<=30).length;
  $('audsum').innerHTML = ch.length
    ? `<b>${d.label}(${d.dow}) · ${A.n}</b> 흐름: ${ch.length}편, 모두 ${dur(tot)}. 30분 안에 바로 이어 볼 수 있는 연결은 ${links}곳입니다.`
    : `<b>${d.label}(${d.dow}) · ${A.n}</b>: 이날은 이 연령대에 맞는 15분 이상 편성이 없습니다.`;
  $('flowlist').innerHTML = ch.map((p,k)=>{
    const ex=audOf(p.t).x.includes(age);
    let g='';
    if(k>0){ const gp=p.s-ch[k-1].e; g=`<li><span class="gap${gp>30?' far':''}">${gp===0?'바로 이어서':dur(gp)+' 뒤'} →</span></li>`; }
    return g+`<li><button class="step" data-i="${p.i}"><span class="no">${k+1}</span><span class="st">${hm(p.s)}</span><span>${esc(p.t)}</span>${ex?'<span class="ex">기획의도 명시</span>':''}</button></li>`;
  }).join('');
  $('flowlist').querySelectorAll('.step').forEach(b=>b.onclick=()=>select(+b.dataset.i));
  if(jump && ch.length){ $('chart').scrollLeft=Math.max(0,bs[0].l-160); }
}

ages(); tabs(); render();
document.fonts && document.fonts.ready.then(()=>render());
$('chart').scrollLeft = (6*60-START)*PX - 8;
