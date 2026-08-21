(()=>{
const POLL22_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v21-api';
const DEV22='박태영';
let selectedDate22=today22(),month22=selectedDate22.slice(0,7),busy22=new Set();

function today22(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function polls22(){S.attendancePolls=Array.isArray(S?.attendancePolls)?S.attendancePolls:[];return S.attendancePolls}
function poll22(id){return polls22().find(p=>String(p.id)===String(id))}
function votes22(p){p.memberVotes=p?.memberVotes&&typeof p.memberVotes==='object'?p.memberVotes:{};return p.memberVotes}
function guests22(p){p.guestEntries=Array.isArray(p?.guestEntries)?p.guestEntries:[];return p.guestEntries}
function mine22(){if(me?.memberId){const m=M(String(me.memberId));if(m)return m}const n=String(me?.displayName||'').trim();return (S.members||[]).find(m=>String(m?.name||'').trim()===n)||null}
function staff22(){const m=mine22();return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer'||me.tempOrganizer||(m&&typeof isTemp==='function'&&isTemp(m)))}
function permanentStaff22(){return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer')}
function canVote22(){const m=mine22();return !!m&&m.type!=='guest'}
function endMs22(p){const d=String(p?.date||''),t=String(p?.endTime||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!/^\d{2}:(00|30)$/.test(t))return 0;return Date.parse(`${d}T${t}:00+09:00`)}
function ended22(p){const e=endMs22(p);return !!e&&e<=Date.now()}
function yesMembers22(p){const v=votes22(p);return Object.keys(v).filter(id=>v[id]==='yes').map(id=>M(id)).filter(m=>m&&m.type!=='guest')}
function count22(p){const member=yesMembers22(p).length,guest=guests22(p).length;return {member,guest,total:member+guest}}
function totalLimit22(p){return Math.max(0,Math.floor(Number(p?.totalLimit)||0))}
function guestLimit22(p){return Math.max(0,Math.floor(Number(p?.guestLimit)||0))}
function hiddenAdmin22(){return String(S?.adminBadgeVisibility||'all')==='hidden'}
function viewerDev22(){return !!me&&String(me.displayName||'').trim()===DEV22&&me.globalAdmin===true}
function roleRank22(m){const self=(me?.memberId&&String(m?.id)===String(me.memberId))||(!me?.memberId&&String(m?.name||'').trim()===String(me?.displayName||'').trim());if(self)return -100;const r=roleOf(m);if(r==='admin')return hiddenAdmin22()&&!viewerDev22()?4:0;if(r==='manager')return 1;if(r==='organizer')return 2;if(typeof isTemp==='function'&&isTemp(m))return 3;return 4}
function role22(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
function gender22(m){const f=m?.gender==='여',label=f?'여성':'남성';return `<span class="pollGenderPerson19 ${f?'female':'male'}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`}
function grade22(m){return `<span class="tag">${esc(String(m?.age||'30'))}${esc(String(m?.cls||'C'))}</span>`}
function ymShift22(ym,delta){const [y,m]=String(ym).split('-').map(Number),d=new Date(Date.UTC(y,m-1+delta,1));return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`}
function date22(y,m,d){return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function earliestMonth22(){const months=polls22().map(p=>String(p?.date||'').slice(0,7)).filter(v=>/^\d{4}-\d{2}$/.test(v));return months.length?months.sort()[0]:today22().slice(0,7)}
function gradeSummary22(list){const c={A:0,B:0,C:0,D:0,E:0};for(const x of list){const g=String(x?.cls||'').trim().toUpperCase();if(g in c)c[g]++}const s=Object.entries(c).filter(([,n])=>n>0).map(([g,n])=>`${g}조 ${n}명`);return s.length?s.join(' · '):'급수 없음'}
function pollWhen22(p){const date=String(p?.date||''),time=String(p?.time||''),end=String(p?.endTime||''),loc=String(p?.location||'');return [date,time&&end?`${time}~${end}`:time,loc].filter(Boolean).map(x=>esc(x)).join(' · ')}

async function request22(action,body={}){const r=await fetch(POLL22_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'처리에 실패했습니다.');if(x.data){S=x.data;normalizeClient()}return x}

function calendar22(){
 const [y,m]=month22.split('-').map(Number),first=new Date(Date.UTC(y,m-1,1)).getUTCDay(),last=new Date(Date.UTC(y,m,0)).getUTCDate(),has=new Set(polls22().map(p=>String(p.date||''))),cells=[],minMonth=earliestMonth22();
 for(let i=0;i<first;i++)cells.push('<span class="pollCalBlank21"></span>');
 for(let d=1;d<=last;d++){const dt=date22(y,m,d),withPoll=has.has(dt),sel=dt===selectedDate22,isToday=dt===today22(),past=dt<today22();cells.push(`<button class="pollCalDay21 ${withPoll?'hasPoll':''} ${sel?'selected':''} ${isToday?'today':''} ${past?'past22':''}" onclick="selectPollDate22('${dt}')"><span>${d}</span></button>`)}
 return `<div class="pollCalendar21 pollCalendar22"><div class="pollCalHead21"><button class="pollCalNav21" ${month22<=minMonth?'disabled':''} onclick="movePollMonth22(-1)">‹</button><b>${y}년 ${m}월</b><button class="pollCalNav21" onclick="movePollMonth22(1)">›</button></div><div class="pollCalWeek21"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div><div class="pollCalGrid21">${cells.join('')}</div><div class="pollCalLegend21"><span><i></i> 투표 있음</span><span>선택 ${selectedDate22.slice(5).replace('-','/')}</span></div></div>`;
}
window.selectPollDate22=function(dt){selectedDate22=String(dt);month22=selectedDate22.slice(0,7);replacePoll22()};
window.movePollMonth22=function(delta){const next=ymShift22(month22,Number(delta)||0);if(next<earliestMonth22())return;month22=next;selectedDate22=next===today22().slice(0,7)?today22():`${next}-01`;replacePoll22()};

function countBoxes22(p){const c=count22(p),tl=totalLimit22(p),gl=guestLimit22(p);return `<div class="pollCounts21"><div class="pollCountBox21 total"><b>${tl?`${c.total}/${tl}`:c.total}</b><span>전체</span><small>${tl?'정원':'참석'}</small></div><div class="pollCountBox21 member"><b>${c.member}</b><span>회원</span><small>참석</small></div><div class="pollCountBox21 guest"><b>${gl?`${c.guest}/${gl}`:c.guest}</b><span>게스트</span><small>${gl?'정원':'참석'}</small></div></div>`}
function pollCard22(p){
 const c=count22(p),m=mine22(),on=!!m&&votes22(p)[String(m.id)]==='yes',staff=staff22(),closed=!!p.guestClosed,ended=ended22(p),canDelete=ended?permanentStaff22():staff;
 const headBtns=ended?(canDelete?`<div class="pollHeadBtns19"><button class="miniBtn" onclick="deletePoll72('${esc(p.id)}')">삭제</button></div>`:''):(staff?`<div class="pollHeadBtns19"><button class="miniBtn" onclick="openPollEdit90('${esc(p.id)}')">수정</button><button class="miniBtn" onclick="deletePoll72('${esc(p.id)}')">삭제</button></div>`:'');
 const left=ended?'<button class="btn ghost pollClosed22" disabled>운동 종료 · 조회만 가능</button>':(canVote22()?`<button class="btn ${on?'pollAttendOn21':'pri'}" onclick="togglePollVote22('${esc(p.id)}',this)">${on?'✓ 참석중 · 다시 누르면 취소':'참석'}</button>`:'<button class="btn ghost" disabled>회원만 참석</button>');
 const guestAdmin=!ended&&staff?`<div class="pollGuestAdmin21">${closed?`<button class="btn ghost pollGuestClosed19" disabled>게스트 마감</button><button class="miniBtn" onclick="toggleGuestClosed19('${esc(p.id)}',false)">모집 재개</button>`:`<button class="btn ghost" onclick="openGuestAdd72('${esc(p.id)}')">+ 게스트 참가 추가</button><button class="miniBtn" onclick="toggleGuestClosed19('${esc(p.id)}',true)">게스트 모집 마감</button>`}</div>`:'';
 return `<div class="card pollCard21 ${ended?'pollEnded22':''}"><div class="pollTitleRow21"><div class="pollTitle21">${esc(p.title||'운동 참석 투표')} ${ended?'<span class="pollEndedBadge22">종료</span>':''}<div class="pollWhen22">${pollWhen22(p)}</div></div>${headBtns}</div>${countBoxes22(p)}<div class="pollActions21">${left}<button class="btn ghost" onclick="openPollAttendees22('${esc(p.id)}')">참석 명단 ${c.total}명</button></div>${guestAdmin}</div>`;
}
function section22(){const ps=polls22().filter(p=>String(p.date||'')===selectedDate22).slice().sort((a,b)=>String(a.time||'').localeCompare(String(b.time||'')));const past=selectedDate22<today22();return `${calendar22()}<div class="subhead pollHead90"><b>운동 참석 투표</b>${staff22()?'<button class="btn pri" onclick="openPollCreate72()">+ 투표 만들기</button>':''}</div>${ps.length?ps.map(pollCard22).join(''):`<div class="empty pollEmpty90">${selectedDate22.slice(5).replace('-','/')} ${past?'기록된 참석 투표가 없습니다.':'예정된 참석 투표가 없습니다.'}</div>`}`}
function replacePoll22(){const box=$('stats');if(!box)return;let wrap=box.querySelector('.pollWrap90');if(!wrap){wrap=document.createElement('div');wrap.className='pollWrap90';const recent=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('오늘 최근 경기'));if(recent)recent.insertAdjacentElement('beforebegin',wrap);else box.appendChild(wrap)}wrap.innerHTML=section22()}

window.togglePollVote22=async function(pid,btn){const key='v:'+pid;if(busy22.has(key))return;const p=poll22(pid),m=mine22();if(!p||!m||m.type==='guest')return;if(ended22(p))return alert('운동이 종료되어 참석투표를 수정할 수 없습니다.');const mid=String(m.id),old={...votes22(p)},was=old[mid]==='yes';if(was)delete p.memberVotes[mid];else{const c=count22(p),l=totalLimit22(p);if(l>0&&c.total>=l)return alert(`참석 인원 ${l}명이 모두 찼습니다.`);p.memberVotes[mid]='yes'}busy22.add(key);if(btn)btn.disabled=true;replacePoll22();try{await request22('poll_toggle_vote',{pollId:pid});replacePoll22()}catch(e){p.memberVotes=old;showError(e);replacePoll22()}finally{busy22.delete(key)}};

function attendeeHtml22(id){
 const p=poll22(id);if(!p)return'';const order=new Map((S.members||[]).map((m,i)=>[String(m.id),i])),members=yesMembers22(p).sort((a,b)=>roleRank22(a)-roleRank22(b)||(order.get(String(a.id))??99999)-(order.get(String(b.id))??99999)),gs=guests22(p).slice(),editable=staff22()&&!ended22(p),c=count22(p);
 const mr=members.map(m=>`<div class="pollAttendeeCard21 attendeeRow" data-kind="member" data-id="${esc(m.id)}"><div class="pollAttendeeMain21">${gender22(m)}<span class="pollAttendeeName21">${esc(m.name)}</span>${grade22(m)}${role22(m)}</div>${editable?`<button class="pollRemove21" onclick="removePollMember21('${esc(id)}','${esc(m.id)}',this)">×</button>`:''}</div>`).join('');
 const gr=gs.map(g=>`<div class="pollAttendeeCard21 attendeeRow" data-kind="guest" data-id="${esc(g.id)}"><div><div class="pollAttendeeMain21">${gender22(g)}<span class="pollAttendeeName21">${esc(g.name)}</span>${grade22(g)}${role22({type:'guest'})}</div><div class="pollGuestMeta21">${esc(g.year||'')}년생${g.inviter?` · 초대 ${esc(g.inviter)}`:''}</div></div>${editable?`<button class="pollRemove21" onclick="removePollGuest21('${esc(id)}','${esc(g.id)}',this)">×</button>`:''}</div>`).join('');
 return `<h3>참석 명단 · 총 ${c.total}명</h3>${ended22(p)?'<div class="note pollArchiveNote22">종료된 운동입니다. 참석 기록은 조회만 가능합니다.</div>':''}${countBoxes22(p)}<div class="pollAttendeeSection21"><div class="pollAttendeeHead21 pollAttendeeHead22"><b>회원</b><span class="tag">${members.length}명</span><small>${gradeSummary22(members)}</small></div><div id="pollMemberRows21">${mr||'<div class="empty">참석 회원이 없습니다.</div>'}</div></div><div class="pollAttendeeSection21"><div class="pollAttendeeHead21 pollAttendeeHead22"><b>게스트</b><span class="tag">${gs.length}명</span><small>${gradeSummary22(gs)}</small></div><div id="pollGuestRows21">${gr||'<div class="empty">등록된 게스트가 없습니다.</div>'}</div></div><button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`;
}
function copyGradeLook22(){const root=$('modalSheet');if(!root)return;const refs={};document.querySelectorAll('#members .memberCard').forEach(card=>{const tag=card.querySelector('.tag'),txt=String(tag?.textContent||'').trim().toUpperCase(),g=(txt.match(/([A-E])$/)||[])[1];if(!tag||!g||refs[g])return;const ts=getComputedStyle(tag),cs=getComputedStyle(card);refs[g]={bg:ts.backgroundColor,color:ts.color,border:ts.borderColor,card:cs.backgroundColor}});root.querySelectorAll('.pollAttendeeCard21').forEach(row=>{const tag=row.querySelector('.tag'),g=(String(tag?.textContent||'').trim().toUpperCase().match(/([A-E])$/)||[])[1],r=refs[g];if(!tag||!r)return;tag.style.setProperty('background',r.bg,'important');tag.style.setProperty('color',r.color,'important');tag.style.setProperty('border-color',r.border,'important');row.style.setProperty('background-color',r.card,'important');row.style.setProperty('border-radius','12px','important')})}
window.openPollAttendees22=function(id){const html=attendeeHtml22(id);if(!html)return;openModal(html);requestAnimationFrame(copyGradeLook22)};
window.openPollAttendees21=window.openPollAttendees22;window.openPollAttendees18=window.openPollAttendees22;window.openPollMembers72=window.openPollAttendees22;window.openPollGuests72=window.openPollAttendees22;

window.togglePollVote21=function(pid,btn){const p=poll22(pid);if(p&&ended22(p))return alert('운동이 종료되어 참석투표를 수정할 수 없습니다.');return window.togglePollVote22(pid,btn)};
window.votePoll72=window.togglePollVote21;

for(const name of ['removePollMember21','removePollMember19','removePollGuest21','removePollGuest72']){
 const prev=window[name];if(typeof prev!=='function')continue;
 window[name]=function(pid,...args){const p=poll22(pid);if(p&&ended22(p))return alert('운동이 종료되어 참석명단을 수정할 수 없습니다.');return prev.call(this,pid,...args)}
}
const prevGuestAdd22=window.openGuestAdd72;if(typeof prevGuestAdd22==='function')window.openGuestAdd72=function(id){const p=poll22(id);if(p&&ended22(p))return alert('운동이 종료되어 게스트를 추가할 수 없습니다.');return prevGuestAdd22(id)};
const prevGuestClose22=window.toggleGuestClosed19;if(typeof prevGuestClose22==='function')window.toggleGuestClosed19=function(id,closed){const p=poll22(id);if(p&&ended22(p))return alert('운동이 종료되어 게스트 모집상태를 변경할 수 없습니다.');return prevGuestClose22(id,closed)};
const prevEdit22=window.openPollEdit90;if(typeof prevEdit22==='function')window.openPollEdit90=function(id){const p=poll22(id);if(p&&ended22(p))return alert('운동이 종료되어 투표를 수정할 수 없습니다.');return prevEdit22(id)};
const prevDelete22=window.deletePoll72;if(typeof prevDelete22==='function')window.deletePoll72=function(id){const p=poll22(id);if(p&&ended22(p)&&!permanentStaff22())return alert('종료된 투표는 모임장 또는 운영진만 삭제할 수 있습니다.');return prevDelete22(id)};
const prevCreate22=window.openPollCreate72;if(typeof prevCreate22==='function')window.openPollCreate72=function(){prevCreate22();setTimeout(()=>{const d=$('pollDate19')||$('pollDate72');if(d){const target=selectedDate22>=today22()?selectedDate22:today22();d.min=today22();d.value=target;d.dispatchEvent(new Event('change',{bubbles:true}))}},0)};

const renderStatsPrev22=renderStats;renderStats=function(){renderStatsPrev22();replacePoll22()};
const renderSettingsPrev22=renderSettings;renderSettings=function(){renderSettingsPrev22();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.2 · 투표기록 보존 · 종료 후 조회전용 · 급수별 집계 · 달력 가독성 개선'})};

setInterval(()=>{if(me&&currentView==='stats'&&polls22().some(p=>endMs22(p)&&Math.abs(endMs22(p)-Date.now())<65000))renderStats()},30000);
if(me&&currentView==='stats')renderStats();
})();
