(()=>{
const HOLIDAY23={
 '2026-02-16':'설날 연휴','2026-02-17':'설날','2026-02-18':'설날 연휴','2026-03-02':'삼일절 대체공휴일','2026-05-24':'부처님오신날','2026-05-25':'부처님오신날 대체공휴일','2026-06-03':'전국동시지방선거일','2026-08-17':'광복절 대체공휴일','2026-09-24':'추석 연휴','2026-09-25':'추석','2026-09-26':'추석 연휴','2026-10-05':'개천절 대체공휴일',
 '2027-02-06':'설날 연휴','2027-02-07':'설날','2027-02-08':'설날 연휴','2027-02-09':'설날 대체공휴일','2027-05-03':'노동절 대체공휴일','2027-05-13':'부처님오신날','2027-07-19':'제헌절 대체공휴일','2027-08-16':'광복절 대체공휴일','2027-09-14':'추석 연휴','2027-09-15':'추석','2027-09-16':'추석 연휴','2027-10-04':'개천절 대체공휴일','2027-10-11':'한글날 대체공휴일','2027-12-27':'기독탄신일 대체공휴일'
};
const FIXED23={'01-01':'신정','03-01':'삼일절','05-01':'노동절','05-05':'어린이날','06-06':'현충일','07-17':'제헌절','08-15':'광복절','10-03':'개천절','10-09':'한글날','12-25':'기독탄신일'};

function today23(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function holidayName23(date){return HOLIDAY23[date]||FIXED23[String(date||'').slice(5)]||''}
function calendarDate23(btn){const s=String(btn?.getAttribute?.('onclick')||'');return (s.match(/selectPollDate22\('([0-9]{4}-[0-9]{2}-[0-9]{2})'\)/)||[])[1]||''}
function selectedCalendarDate23(){const btn=document.querySelector('#stats .pollCalDay21.selected');return calendarDate23(btn)||today23()}
function weekday23(date){const a=String(date||'').split('-').map(Number);if(a.length!==3||!a[0])return -1;return new Date(Date.UTC(a[0],a[1]-1,a[2])).getUTCDay()}

function decorateCalendar23(){
 const box=$('stats');if(!box)return;
 for(const btn of box.querySelectorAll('.pollCalDay21')){
  const date=calendarDate23(btn);if(!date)continue;const wd=weekday23(date),holiday=holidayName23(date);
  btn.classList.toggle('sun23',wd===0);btn.classList.toggle('sat23',wd===6);btn.classList.toggle('holiday23',!!holiday);
  if(holiday)btn.title=holiday;else if(btn.title)btn.removeAttribute('title');
 }
}

function genderPerson23(m){
 const female=m?.gender==='여',label=female?'여성':'남성';
 return `<span class="genderPerson54 compact54 composerGender23 ${female?'female':'male'}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`;
}
function decorateComposerGender23(){
 const box=$('queue');if(!box||!Array.isArray(draft))return;
 const slots=[...box.querySelectorAll('.composer54 .slot54,.composer .slots > .slot')].slice(0,4);
 slots.forEach((slot,i)=>{
  const id=draft[i],m=id?M(id):null,name=slot.querySelector('.slotName');
  if(!m||!name)return;
  name.querySelectorAll('.composerGender23').forEach((x,j)=>{if(j)x.remove()});
  if(!name.querySelector('.composerGender23'))name.insertAdjacentHTML('afterbegin',genderPerson23(m));
 });
}

function fixPollForm23(){
 const form=$('modalSheet');if(!form)return;const d=form.querySelector('input[type="date"]');
 if(d){d.min=today23();d.style.maxWidth='100%';d.style.minWidth='0';d.style.width='100%';d.style.boxSizing='border-box'}
}
function rejectPast23(date,msg='과거 날짜의 투표는 생성할 수 없습니다.'){
 if(date&&String(date)<today23()){alert(msg);return true}return false;
}

const renderQueue22=renderQueue;
renderQueue=function(){const r=renderQueue22();decorateComposerGender23();return r};
for(const name of ['draftClick','draftRemove','clearDraft','recommendDraft']){
 const prev=window[name]||globalThis[name];if(typeof prev!=='function')continue;
 const wrapped=function(...args){const r=prev.apply(this,args);decorateComposerGender23();return r};
 try{window[name]=wrapped}catch{}
 try{globalThis[name]=wrapped}catch{}
}

const openCreate22=window.openPollCreate72;
if(typeof openCreate22==='function')window.openPollCreate72=function(...args){
 const selected=selectedCalendarDate23();if(rejectPast23(selected))return;
 const r=openCreate22.apply(this,args);fixPollForm23();return r;
};
const create22=window.createPoll72;
if(typeof create22==='function')window.createPoll72=function(...args){const d=$('pollDate19')?.value||$('pollDate72')?.value||'';if(rejectPast23(d))return;return create22.apply(this,args)};
const edit22=window.openPollEdit90;
if(typeof edit22==='function')window.openPollEdit90=function(...args){const r=edit22.apply(this,args);fixPollForm23();return r};
const saveEdit22=window.savePollEdit90;
if(typeof saveEdit22==='function')window.savePollEdit90=function(...args){const d=$('pollDate19')?.value||$('pollDate72')?.value||'';if(rejectPast23(d,'과거 날짜로 투표를 변경할 수 없습니다.'))return;return saveEdit22.apply(this,args)};

const selectDate22=window.selectPollDate22;
if(typeof selectDate22==='function')window.selectPollDate22=function(...args){const r=selectDate22.apply(this,args);decorateCalendar23();return r};
const moveMonth22=window.movePollMonth22;
if(typeof moveMonth22==='function')window.movePollMonth22=function(...args){const r=moveMonth22.apply(this,args);decorateCalendar23();return r};

const renderStats22=renderStats;
renderStats=function(){const r=renderStats22();decorateCalendar23();return r};
const renderSettings22=renderSettings;
renderSettings=function(){renderSettings22();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.3 · 편성 성별 즉시표시 · 과거투표 차단 · 주말/공휴일 달력 · 투표폼 폭 보정'})};

if(me){if(currentView==='queue')decorateComposerGender23();if(currentView==='stats')decorateCalendar23()}
})();
