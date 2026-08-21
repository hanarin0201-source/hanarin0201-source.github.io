(()=>{
const POLL19_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v19-api';
const DEV_NAME19='박태영';

function polls19(){S.attendancePolls=Array.isArray(S?.attendancePolls)?S.attendancePolls:[];return S.attendancePolls}
function poll19(id){return polls19().find(p=>String(p.id)===String(id))}
function votes19(p){return p?.memberVotes&&typeof p.memberVotes==='object'?p.memberVotes:{}}
function guests19(p){return Array.isArray(p?.guestEntries)?p.guestEntries:[]}
function yesMembers19(p){const v=votes19(p);return Object.keys(v).filter(id=>v[id]==='yes').map(id=>M(id)).filter(m=>m&&m.type!=='guest')}
function mine19(){if(me?.memberId){const m=M(String(me.memberId));if(m)return m}const n=String(me?.displayName||'').trim();return (S.members||[]).find(m=>String(m?.name||'').trim()===n)||null}
function staff19(){const m=mine19();return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer'||me.tempOrganizer||(m&&typeof isTemp==='function'&&isTemp(m)))}
function canVote19(){const m=mine19();return !!m&&m.type!=='guest'}
function hiddenAdmin19(){return String(S?.adminBadgeVisibility||'all')==='hidden'}
function viewerDev19(){return !!me&&String(me.displayName||'').trim()===DEV_NAME19&&me.globalAdmin===true}
function roleRank19(m){
 const self=(me?.memberId&&String(m?.id)===String(me.memberId))||(!me?.memberId&&String(m?.name||'').trim()===String(me?.displayName||'').trim());
 if(self)return -100;const r=roleOf(m);if(r==='admin')return hiddenAdmin19()&&!viewerDev19()?4:0;if(r==='manager')return 1;if(r==='organizer')return 2;if(typeof isTemp==='function'&&isTemp(m))return 3;return 4;
}
function memberOrder19(){return new Map((S.members||[]).map((m,i)=>[String(m.id),i]))}
function count19(p){const member=yesMembers19(p).length,guest=guests19(p).length;return {member,guest,total:member+guest}}
function totalLimit19(p){return Math.max(0,Number(p?.totalLimit)||0)}
function guestLimit19(p){return Math.max(0,Number(p?.guestLimit)||0)}
function expired19(p){const d=String(p?.date||''),e=String(p?.endTime||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!/^\d{2}:(00|30)$/.test(e))return false;return Date.parse(`${d}T${e}:00+09:00`)<=Date.now()}
function genderPerson19(m){const f=m?.gender==='여',label=f?'여성':'남성';return `<span class="pollGenderPerson19 ${f?'female':'male'}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`}
function gradeTag19(m){return `<span class="tag">${esc(String(m?.age||'30'))}${esc(String(m?.cls||'C'))}</span>`}
function role19(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
function status19(p){const c=count19(p),tl=totalLimit19(p),gl=guestLimit19(p);return `<div class="pollCapacity19"><span><b>전체</b> ${tl?`${c.total}/${tl}`:`${c.total}명`}</span><span><b>회원</b> ${c.member}명</span><span><b>게스트</b> ${gl?`${c.guest}/${gl}`:`${c.guest}명`}</span></div>`}

async function request19(action,body={}){
 const r=await fetch(POLL19_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'처리에 실패했습니다.');if(x.data){S=x.data;normalizeClient()}return x;
}

function timeOptions19(selected='18:30',forStart=false){const out=[];for(let h=0;h<24;h++)for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;out.push(`<option value="${v}" ${v===selected?'selected':''} ${forStart&&v==='23:30'?'disabled':''}>${v}</option>`)}return out.join('')}
function addMinutes19(t,min){const [h,m]=String(t||'18:30').split(':').map(Number),n=h*60+m+min;return `${String(Math.min(23,Math.floor(n/60))).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`}
function today19(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function autoTitle19(date,time,location){const a=String(date||'').split('-').map(Number);if(a.length!==3||!a[1])return '운동';return `${a[1]}월 ${a[2]}일 ${time||''}${location?' '+location:''} 운동`}
function pollForm19(p=null){
 const date=p?.date||today19(),start=p?.time||'18:30',end=p?.endTime||addMinutes19(start,180),loc=p?.location||'',title=p?.title||autoTitle19(date,start,loc),total=totalLimit19(p),guest=guestLimit19(p);
 return `<h3>${p?'운동 참석 투표 수정':'운동 참석 투표 만들기'}</h3><div class="pollForm19">
  <div class="field"><label>일자</label><input id="pollDate19" type="date" value="${esc(date)}"></div>
  <div class="grid2"><div class="field"><label>운동 시작시간</label><select id="pollStart19">${timeOptions19(start,true)}</select></div><div class="field"><label>운동 종료시간</label><select id="pollEnd19">${timeOptions19(end,false)}</select></div></div>
  <div class="field"><label>운동 장소</label><input id="pollLocation19" maxlength="40" value="${esc(loc)}" placeholder="예: 신리천 2코트"></div>
  <div class="field"><label>투표 제목</label><input id="pollTitle19" maxlength="60" value="${esc(title)}"></div>
  <div class="grid2 pollLimitGrid19"><div class="field"><label>전체 인원 제한</label><input id="pollTotalLimit19" type="number" inputmode="numeric" min="0" max="999" value="${total}"><div class="meta">0 = 제한 없음</div></div><div class="field"><label>게스트 인원 제한</label><input id="pollGuestLimit19" type="number" inputmode="numeric" min="0" max="999" value="${guest}"><div class="meta">0 = 제한 없음</div></div></div>
  <div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="${p?`savePollEdit90('${esc(p.id)}')`:'createPoll72()'}">${p?'수정 저장':'투표 시작'}</button></div></div>`;
}
function bindPollForm19(){
 const start=$('pollStart19'),end=$('pollEnd19'),date=$('pollDate19'),loc=$('pollLocation19'),title=$('pollTitle19');if(!start||!end)return;
 const enforce=()=>{let first='';[...end.options].forEach(o=>{o.disabled=String(o.value)<=String(start.value);if(!o.disabled&&!first)first=o.value});if(String(end.value)<=String(start.value))end.value=first||''};
 let manual=false;const sync=()=>{if(!manual&&title)title.value=autoTitle19(date?.value||'',start.value||'',loc?.value.trim()||'')};
 enforce();start.addEventListener('change',()=>{enforce();sync()});date?.addEventListener('change',sync);loc?.addEventListener('input',sync);title?.addEventListener('input',()=>{manual=true});
}
function readPollForm19(){
 const date=$('pollDate19')?.value||'',time=$('pollStart19')?.value||'',endTime=$('pollEnd19')?.value||'',location=$('pollLocation19')?.value.trim()||'',title=$('pollTitle19')?.value.trim()||'',totalLimit=Math.max(0,Math.floor(Number($('pollTotalLimit19')?.value)||0)),guestLimit=Math.max(0,Math.floor(Number($('pollGuestLimit19')?.value)||0));
 if(!date||!time||!endTime)return {error:'운동 일자와 시작·종료시간을 입력해주세요.'};if(endTime<=time)return {error:'운동 종료시간은 시작시간보다 늦게 선택해주세요.'};if(!location)return {error:'운동 장소를 입력해주세요.'};if(totalLimit>0&&guestLimit>0&&guestLimit>totalLimit)return {error:'게스트 제한인원은 전체 제한인원보다 많을 수 없습니다.'};return {date,time,endTime,location,title:title||autoTitle19(date,time,location),totalLimit,guestLimit};
}
window.openPollCreate72=function(){if(!staff19())return alert('개발자·모임장·운영진·편성자만 투표를 만들 수 있습니다.');openModal(pollForm19());setTimeout(bindPollForm19,0)};
window.openPollEdit90=function(id){if(!staff19())return alert('투표 수정 권한이 없습니다.');const p=poll19(id);if(!p)return alert('투표를 찾을 수 없습니다.');openModal(pollForm19(p));setTimeout(bindPollForm19,0)};
window.createPoll72=async function(){const v=readPollForm19();if(v.error)return alert(v.error);try{await request19('poll_create',v);closeModal();renderStats();goView('stats')}catch(e){showError(e)}};
window.savePollEdit90=async function(id){const v=readPollForm19();if(v.error)return alert(v.error);try{await request19('poll_update',{pollId:id,...v});closeModal();renderStats()}catch(e){showError(e)}};
window.deletePoll72=async function(id){if(!staff19())return alert('투표 삭제 권한이 없습니다.');if(!confirm('이 참석 투표를 삭제하시겠습니까?'))return;try{await request19('poll_delete',{pollId:id});renderStats()}catch(e){showError(e)}};
window.votePoll72=async function(id){if(!canVote19())return alert('회원만 참석할 수 있습니다.');try{await request19('poll_vote',{pollId:id});renderStats()}catch(e){showError(e)}};

function currentYear19(){return Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric'}).format(new Date()))||new Date().getFullYear()}
function ageBand19(year){const y=Number(year),age=currentYear19()-y;if(!Number.isFinite(age)||age<0)return '30';return String(Math.max(10,Math.min(80,Math.floor(age/10)*10)))}
function inviterOptions19(){return (S.members||[]).filter(m=>m.type!=='guest').map(m=>String(m.name||'').trim()).filter(Boolean).sort((a,b)=>a.localeCompare(b,'ko')).map(n=>`<option value="${esc(n)}"></option>`).join('')}
window.openGuestAdd72=function(id){
 if(!staff19())return alert('게스트 입력 권한이 없습니다.');const p=poll19(id);if(!p)return;if(p.guestClosed)return alert('게스트 모집이 마감되었습니다.');const c=count19(p),tl=totalLimit19(p),gl=guestLimit19(p);
 openModal(`<h3>게스트 참가 추가</h3>${status19(p)}<div class="field"><label>이름</label><input id="pollGuestName19" maxlength="30" autocomplete="off" placeholder="게스트 이름"></div><div class="grid2"><div class="field"><label>출생연도</label><input id="pollGuestYear19" type="number" inputmode="numeric" min="1900" max="${currentYear19()}" placeholder="예: 1992"></div><div class="field"><label>연령대</label><select id="pollGuestAge19">${[10,20,30,40,50,60,70,80].map(x=>`<option value="${x}" ${x===30?'selected':''}>${x}대</option>`).join('')}</select></div></div><div class="grid2"><div class="field"><label>성별</label><select id="pollGuestGender19"><option>남</option><option>여</option></select></div><div class="field"><label>급수</label><select id="pollGuestCls19">${['A','B','C','D','E'].map(x=>`<option ${x==='C'?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="field"><label>초대인</label><input id="pollGuestInviter19" list="pollGuestInviters19" maxlength="30" autocomplete="off" placeholder="초대한 회원 이름"><datalist id="pollGuestInviters19">${inviterOptions19()}</datalist></div><div class="note">${tl?`전체 ${tl}명 제한 · 현재 ${c.total}명. `:''}${gl?`게스트 ${gl}명 제한 · 현재 ${c.guest}명.`:''}</div><div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="addPollGuest72('${esc(id)}')">게스트 추가</button></div>`);
 const y=$('pollGuestYear19'),a=$('pollGuestAge19');y?.addEventListener('input',()=>{if(/^\d{4}$/.test(String(y.value||''))&&a)a.value=ageBand19(y.value)});setTimeout(()=>$('pollGuestName19')?.focus(),30);
};
window.addPollGuest72=async function(id){const name=$('pollGuestName19')?.value.trim()||'',year=$('pollGuestYear19')?.value.trim()||'',inviter=$('pollGuestInviter19')?.value.trim()||'';if(!name)return alert('게스트 이름을 입력해주세요.');if(!/^\d{4}$/.test(year)||Number(year)<1900||Number(year)>currentYear19())return alert('출생연도를 4자리로 입력해주세요.');if(!inviter)return alert('초대인을 입력해주세요.');try{await request19('poll_guest_add',{pollId:id,name,year,age:ageBand19(year),gender:$('pollGuestGender19')?.value||'남',cls:$('pollGuestCls19')?.value||'C',inviter});closeModal();renderStats()}catch(e){showError(e)}};
window.removePollGuest72=async function(pid,gid){if(!staff19())return;try{await request19('poll_guest_remove',{pollId:pid,guestId:gid});openPollAttendees18(pid);renderStats()}catch(e){showError(e)}};
window.removePollMember19=async function(pid,mid){if(!staff19())return;if(!confirm('이 회원을 참석명단에서 제외하시겠습니까?'))return;try{await request19('poll_member_remove',{pollId:pid,memberId:mid});openPollAttendees18(pid);renderStats()}catch(e){showError(e)}};
window.toggleGuestClosed19=async function(pid,closed){if(!staff19())return;const msg=closed?'게스트 모집을 마감하시겠습니까?':'게스트 모집을 다시 시작하시겠습니까?';if(!confirm(msg))return;try{await request19('poll_guest_close',{pollId:pid,closed:!!closed});renderStats()}catch(e){showError(e)}};

function attendeeTint19(){
 const root=$('modalSheet')||document;root.querySelectorAll('.pollAttendeeCard19').forEach(row=>{const tag=row.querySelector('.tag');if(!tag)return;const cs=getComputedStyle(tag);let base=cs.backgroundColor;if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;const m=String(base).match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return;const txt=(tag.textContent||'').toUpperCase(),a=/B$/.test(txt)?.30:/C$/.test(txt)?.20:.24;row.style.setProperty('background-color',`rgba(${m[1]},${m[2]},${m[3]},${a})`,'important');row.style.setProperty('transition','none','important')});
}
window.openPollAttendees18=function(id){
 const p=poll19(id);if(!p)return;const order=memberOrder19(),members=yesMembers19(p).sort((a,b)=>roleRank19(a)-roleRank19(b)||(order.get(String(a.id))??99999)-(order.get(String(b.id))??99999)),gs=guests19(p),c=count19(p);
 const memberRows=members.map(m=>`<div class="pollAttendeeCard19 attendeeRow"><div class="pollAttendeeMain19">${genderPerson19(m)}<span class="pollAttendeeName19">${esc(m.name)}</span>${gradeTag19(m)}${role19(m)}</div>${staff19()?`<button class="pollRemove19" onclick="removePollMember19('${esc(p.id)}','${esc(m.id)}')">×</button>`:''}</div>`).join('');
 const guestRows=gs.map(g=>`<div class="pollAttendeeCard19 attendeeRow"><div><div class="pollAttendeeMain19">${genderPerson19(g)}<span class="pollAttendeeName19">${esc(g.name)}</span>${gradeTag19(g)}${role19({type:'guest'})}</div><div class="pollGuestMeta19">${esc(g.year||'')}년생${g.inviter?` · 초대 ${esc(g.inviter)}`:''}</div></div>${staff19()?`<button class="pollRemove19" onclick="removePollGuest72('${esc(p.id)}','${esc(g.id)}')">×</button>`:''}</div>`).join('');
 openModal(`<h3>참석 명단 · 총 ${c.total}명</h3>${status19(p)}<div class="pollAttendeeSection19"><div class="pollAttendeeTitle19"><b>회원</b><span class="tag">${members.length}명</span></div>${memberRows||'<div class="empty">참석 회원이 없습니다.</div>'}</div><div class="pollAttendeeSection19"><div class="pollAttendeeTitle19"><b>게스트</b><span class="tag">${gs.length}명</span></div>${guestRows||'<div class="empty">등록된 게스트가 없습니다.</div>'}</div><button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`);setTimeout(attendeeTint19,0);
};
window.openPollMembers72=window.openPollAttendees18;window.openPollGuests72=window.openPollAttendees18;

function renderPollCard19(p){
 const c=count19(p),mine=mine19(),vote=mine?votes19(p)[String(mine.id)]||'':'',staff=staff19(),closed=!!p.guestClosed;
 return `<div class="card pollCard72 pollCard19"><div class="pollHead72"><div><b>${esc(p.title||'운동 참석 투표')}</b><div class="meta pollWhen19">${esc(p.date||'')} · ${esc(p.time||'')}~${esc(p.endTime||'')} · ${esc(p.location||'')}</div></div>${staff?`<div class="pollHeadBtns19"><button class="miniBtn" onclick="openPollEdit90('${esc(p.id)}')">수정</button><button class="miniBtn" onclick="deletePoll72('${esc(p.id)}')">삭제</button></div>`:''}</div>${status19(p)}<div class="pollActionGrid19">${canVote19()?`<button class="btn ${vote==='yes'?'pri':'ghost'}" ${vote==='yes'?'disabled':''} onclick="votePoll72('${esc(p.id)}')">${vote==='yes'?'✓ 참석 완료':'참석'}</button>`:'<button class="btn ghost" disabled>참석</button>'}<button class="btn ghost" onclick="openPollAttendees18('${esc(p.id)}')">참석 명단 ${c.total}명</button></div>${staff?`<div class="pollGuestAdmin19">${closed?`<button class="btn ghost pollGuestClosed19" disabled>게스트 마감</button><button class="miniBtn" onclick="toggleGuestClosed19('${esc(p.id)}',false)">모집 재개</button>`:`<button class="btn ghost" onclick="openGuestAdd72('${esc(p.id)}')">+ 게스트 참가 추가</button><button class="miniBtn" onclick="toggleGuestClosed19('${esc(p.id)}',true)">게스트 모집 마감</button>`}</div>`:''}</div>`;
}
function renderPolls19(){const ps=polls19().filter(p=>!expired19(p)).slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')));return `<div class="subhead pollHead90"><b>운동 참석 투표</b>${staff19()?'<button class="btn pri" onclick="openPollCreate72()">+ 투표 만들기</button>':''}</div>${ps.length?ps.map(renderPollCard19).join(''):'<div class="empty pollEmpty90">진행 중인 참석 투표가 없습니다.</div>'}`}
function replacePollSection19(){const box=$('stats');if(!box)return;let wrap=box.querySelector('.pollWrap90');if(!wrap){wrap=document.createElement('div');wrap.className='pollWrap90';const recent=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('오늘 최근 경기'));if(recent)recent.insertAdjacentElement('beforebegin',wrap);else box.appendChild(wrap)}wrap.innerHTML=renderPolls19()}
const renderStatsBefore19=renderStats;renderStats=function(){renderStatsBefore19();replacePollSection19()};
const renderSettingsBefore19=renderSettings;renderSettings=function(){renderSettingsBefore19();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.9 · 참석정원/게스트정원 · 참석명단 관리 · 게스트 마감'});};
if(me&&currentView==='stats')renderStats();
})();
