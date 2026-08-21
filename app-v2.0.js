(()=>{
const TODAY20=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let selectedPollDate20=TODAY20(),calendarMonth20=selectedPollDate20.slice(0,7),removeBusy20=new Set();

function activePolls20(){return polls19().filter(p=>!expired19(p)).slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')))}
function monthParts20(ym){const [y,m]=String(ym).split('-').map(Number);return {y,m}}
function monthShift20(ym,d){const {y,m}=monthParts20(ym),x=new Date(Date.UTC(y,m-1+d,1));return `${x.getUTCFullYear()}-${String(x.getUTCMonth()+1).padStart(2,'0')}`}
function date20(y,m,d){return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function calendarHtml20(){
 const today=TODAY20(),currentMonth=today.slice(0,7),{y,m}=monthParts20(calendarMonth20),first=new Date(Date.UTC(y,m-1,1)).getUTCDay(),last=new Date(Date.UTC(y,m,0)).getUTCDate();
 const pollDates=new Set(activePolls20().map(p=>String(p.date||'')));
 const cells=[];for(let i=0;i<first;i++)cells.push('<span class="pollCalBlank20"></span>');
 for(let d=1;d<=last;d++){
  const dt=date20(y,m,d),past=dt<today,has=pollDates.has(dt),sel=dt===selectedPollDate20,isToday=dt===today;
  cells.push(`<button class="pollCalDay20 ${has?'hasPoll':''} ${sel?'selected':''} ${isToday?'today':''}" ${past?'disabled':''} onclick="selectPollDate20('${dt}')"><span>${d}</span>${has?'<i></i>':''}</button>`);
 }
 const prevDisabled=calendarMonth20<=currentMonth;
 return `<div class="pollCalendar20"><div class="pollCalHead20"><button class="pollCalNav20" ${prevDisabled?'disabled':''} onclick="movePollMonth20(-1)">‹</button><b>${y}년 ${m}월</b><button class="pollCalNav20" onclick="movePollMonth20(1)">›</button></div><div class="pollCalWeek20"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div><div class="pollCalGrid20">${cells.join('')}</div><div class="pollCalLegend20"><span><i></i> 투표 있음</span><span>선택일 ${selectedPollDate20.slice(5).replace('-','/')}</span></div></div>`;
}
window.selectPollDate20=function(dt){if(String(dt)<TODAY20())return;selectedPollDate20=String(dt);calendarMonth20=selectedPollDate20.slice(0,7);replacePollSection19()};
window.movePollMonth20=function(delta){const next=monthShift20(calendarMonth20,Number(delta)||0),today=TODAY20(),current=today.slice(0,7);if(next<current)return;calendarMonth20=next;selectedPollDate20=next===current?today:`${next}-01`;replacePollSection19()};

renderPolls19=function(){
 const ps=activePolls20().filter(p=>String(p.date||'')===selectedPollDate20);
 return `${calendarHtml20()}<div class="subhead pollHead90"><b>운동 참석 투표</b>${staff19()?'<button class="btn pri" onclick="openPollCreate72()">+ 투표 만들기</button>':''}</div>${ps.length?ps.map(renderPollCard19).join(''):`<div class="empty pollEmpty90">${selectedPollDate20.slice(5).replace('-','/')} 예정된 참석 투표가 없습니다.</div>`}`;
};

function gradeKey20(txt){const m=String(txt||'').trim().toUpperCase().match(/([A-E])$/);return m?m[1]:''}
function rgba20(c,a){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);return m?`rgba(${m[1]},${m[2]},${m[3]},${a})`:''}
function memberGradeVisuals20(){
 const map={};const box=$('members');if(!box)return map;
 box.querySelectorAll('.memberCard').forEach(card=>{const tag=card.querySelector('.tag'),g=gradeKey20(tag?.textContent);if(!tag||!g||map[g])return;const ts=getComputedStyle(tag),cs=getComputedStyle(card);map[g]={tagBg:ts.backgroundColor,tagColor:ts.color,tagBorder:ts.borderColor,cardBg:cs.backgroundColor}});return map;
}
function applyAttendeeVisuals20(){
 const root=$('modalSheet');if(!root)return;const refs=memberGradeVisuals20();
 root.querySelectorAll('.pollAttendeeCard20').forEach(row=>{const tag=row.querySelector('.tag'),g=gradeKey20(tag?.textContent);if(!tag||!g)return;const v=refs[g];if(v){tag.style.setProperty('background',v.tagBg,'important');tag.style.setProperty('color',v.tagColor,'important');if(v.tagBorder&&v.tagBorder!=='rgba(0, 0, 0, 0)')tag.style.setProperty('border-color',v.tagBorder,'important');row.style.setProperty('background-color',v.cardBg,'important')}else{const cs=getComputedStyle(tag),a=g==='B'?.30:g==='C'?.20:.24;const bg=rgba20(cs.backgroundColor||cs.color,a);if(bg)row.style.setProperty('background-color',bg,'important')}
  row.style.setProperty('border-radius','12px','important');row.style.setProperty('transition','none','important');
 });
}
function attendeeRows20(p){
 const order=memberOrder19(),members=yesMembers19(p).sort((a,b)=>roleRank19(a)-roleRank19(b)||(order.get(String(a.id))??99999)-(order.get(String(b.id))??99999)),gs=guests19(p),c=count19(p);
 const mr=members.map(m=>`<div class="pollAttendeeCard19 pollAttendeeCard20" data-kind="member" data-id="${esc(m.id)}"><div class="pollAttendeeMain19">${genderPerson19(m)}<span class="pollAttendeeName19">${esc(m.name)}</span>${gradeTag19(m)}${role19(m)}</div>${staff19()?`<button class="pollRemove19" onclick="removePollMember20('${esc(p.id)}','${esc(m.id)}',this)">×</button>`:''}</div>`).join('');
 const gr=gs.map(g=>`<div class="pollAttendeeCard19 pollAttendeeCard20" data-kind="guest" data-id="${esc(g.id)}"><div><div class="pollAttendeeMain19">${genderPerson19(g)}<span class="pollAttendeeName19">${esc(g.name)}</span>${gradeTag19(g)}${role19({type:'guest'})}</div><div class="pollGuestMeta19">${esc(g.year||'')}년생${g.inviter?` · 초대 ${esc(g.inviter)}`:''}</div></div>${staff19()?`<button class="pollRemove19" onclick="removePollGuest20('${esc(p.id)}','${esc(g.id)}',this)">×</button>`:''}</div>`).join('');
 return {members,gs,c,html:`<h3 id="pollAttendeeTitle20">참석 명단 · 총 ${c.total}명</h3>${status19(p)}<div class="pollAttendeeSection19"><div class="pollAttendeeTitle19"><b>회원</b><span class="tag" id="pollMemberCount20">${members.length}명</span></div><div id="pollMemberRows20">${mr||'<div class="empty">참석 회원이 없습니다.</div>'}</div></div><div class="pollAttendeeSection19"><div class="pollAttendeeTitle19"><b>게스트</b><span class="tag" id="pollGuestCount20">${gs.length}명</span></div><div id="pollGuestRows20">${gr||'<div class="empty">등록된 게스트가 없습니다.</div>'}</div></div><button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`};
}
window.openPollAttendees18=function(id){const p=poll19(id);if(!p)return;openModal(attendeeRows20(p).html);requestAnimationFrame(applyAttendeeVisuals20)};

function refreshAttendeeCounts20(p){
 const c=count19(p),t=$('pollAttendeeTitle20'),mc=$('pollMemberCount20'),gc=$('pollGuestCount20');if(t)t.textContent=`참석 명단 · 총 ${c.total}명`;if(mc)mc.textContent=`${c.member}명`;if(gc)gc.textContent=`${c.guest}명`;
 const cap=$('modalSheet')?.querySelector('.pollCapacity19');if(cap){const wrap=document.createElement('div');wrap.innerHTML=status19(p);cap.replaceWith(wrap.firstElementChild)}
}
function removeRowNow20(btn,p,kind){const row=btn?.closest('.pollAttendeeCard20');if(row)row.remove();const host=$(kind==='member'?'pollMemberRows20':'pollGuestRows20');if(host&&!host.querySelector('.pollAttendeeCard20'))host.innerHTML=`<div class="empty">${kind==='member'?'참석 회원이 없습니다.':'등록된 게스트가 없습니다.'}</div>`;refreshAttendeeCounts20(p)}
function updateBackgroundPoll20(pid){const p=poll19(pid);if(!p)return;const card=[...($('stats')?.querySelectorAll('.pollCard19')||[])].find(c=>(c.querySelector('[onclick*="openPollAttendees18"]')?.getAttribute('onclick')||'').includes(`'${pid}'`));if(!card)return;const c=count19(p),b=card.querySelector('[onclick*="openPollAttendees18"]');if(b)b.textContent=`참석 명단 ${c.total}명`;const cap=card.querySelector('.pollCapacity19');if(cap){const w=document.createElement('div');w.innerHTML=status19(p);cap.replaceWith(w.firstElementChild)}}
window.removePollMember20=async function(pid,mid,btn){if(!staff19())return;if(!confirm('이 회원을 참석명단에서 제외하시겠습니까?'))return;const key=`m:${pid}:${mid}`;if(removeBusy20.has(key))return;const p=poll19(pid);if(!p)return;const old={...votes19(p)};delete p.memberVotes[String(mid)];removeBusy20.add(key);btn&&(btn.disabled=true);removeRowNow20(btn,p,'member');updateBackgroundPoll20(pid);try{await request19('poll_member_remove',{pollId:pid,memberId:mid});updateBackgroundPoll20(pid)}catch(e){p.memberVotes=old;showError(e);openPollAttendees18(pid)}finally{removeBusy20.delete(key)}};
window.removePollGuest20=async function(pid,gid,btn){if(!staff19())return;if(!confirm('이 게스트를 참석명단에서 삭제하시겠습니까?'))return;const key=`g:${pid}:${gid}`;if(removeBusy20.has(key))return;const p=poll19(pid);if(!p)return;const old=guests19(p).slice();p.guestEntries=old.filter(g=>String(g.id)!==String(gid));removeBusy20.add(key);btn&&(btn.disabled=true);removeRowNow20(btn,p,'guest');updateBackgroundPoll20(pid);try{await request19('poll_guest_remove',{pollId:pid,guestId:gid});updateBackgroundPoll20(pid)}catch(e){p.guestEntries=old;showError(e);openPollAttendees18(pid)}finally{removeBusy20.delete(key)}};
/* keep legacy names routed through v2.0 confirmations/optimistic path */
window.removePollMember19=function(pid,mid){const row=$('modalSheet')?.querySelector(`.pollAttendeeCard20[data-kind="member"][data-id="${CSS.escape(String(mid))}"]`);return removePollMember20(pid,mid,row?.querySelector('.pollRemove19'))};
window.removePollGuest72=function(pid,gid){const row=$('modalSheet')?.querySelector(`.pollAttendeeCard20[data-kind="guest"][data-id="${CSS.escape(String(gid))}"]`);return removePollGuest20(pid,gid,row?.querySelector('.pollRemove19'))};

const settingsBefore20=renderSettings;renderSettings=function(){settingsBefore20();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.0 · 참석투표 달력 · 참석명단 즉시반응 · 급수색 통일'})};
if(me&&currentView==='stats')renderStats();
})();