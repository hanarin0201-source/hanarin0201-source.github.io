(()=>{
const V72_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v72-api';
const busy72=new Set();

function mine72(){
 if(me?.memberId){const m=M(String(me.memberId));if(m)return m}
 const n=String(me?.displayName||'').trim();
 return S.members.find(m=>String(m.name||'').trim()===n)||null;
}
function pollAdmin72(){return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer')}
function canVote72(){const m=mine72();return !!m&&m.type!=='guest'}
function polls72(){S.attendancePolls=Array.isArray(S.attendancePolls)?S.attendancePolls:[];return S.attendancePolls}
function voteMap72(p){return p?.memberVotes&&typeof p.memberVotes==='object'?p.memberVotes:{}}
function guests72(p){return Array.isArray(p?.guestEntries)?p.guestEntries:[]}
function yesMembers72(p){
 const v=voteMap72(p);
 return Object.keys(v).filter(id=>v[id]==='yes').map(M).filter(m=>m&&m.type!=='guest');
}
function roleRank72(m){
 const r=roleOf(m);
 if(r==='admin')return 0;
 if(r==='manager')return 1;
 if(r==='organizer')return 2;
 if(isTemp(m))return 3;
 return 4;
}
function genderChip72(m){
 const f=m?.gender==='여';
 return `<span class="pollGender72 ${f?'female':'male'}">${f?'여':'남'}</span>`;
}
function pollWhen72(p){
 const a=String(p?.date||'').split('-').map(Number),wd=['일','월','화','수','목','금','토'];
 if(a.length!==3||!a[0])return `${esc(p?.date||'')} ${esc(p?.time||'')}`;
 const d=new Date(Date.UTC(a[0],a[1]-1,a[2]));
 return `${a[1]}월 ${a[2]}일 (${wd[d.getUTCDay()]}) ${esc(p?.time||'')}`;
}
function avgWaitMin72(){
 const count=Math.max(0,Number(S.waitSampleCount)||0),ms=Math.max(0,Number(S.waitSampleTotalMs)||0);
 return count?Math.max(0,Math.round(ms/count/60000)):0;
}
async function v72Request(action,body={}){
 const r=await fetch(V72_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){
  if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}
  throw new Error(x.error||'처리에 실패했습니다.');
 }
 return x;
}
async function applyV72(action,body={},render=true){
 const key=action+':'+String(body.pollId||body.gameId||body.pendingId||body.court||'');
 if(busy72.has(key))return null;
 busy72.add(key);
 try{
  const x=await v72Request(action,body);
  if(x.data){S=x.data;normalizeClient();if(render)renderAll()}
  return x;
 }finally{busy72.delete(key)}
}

/* Court name: accept digits only, display remains N코트. */
renameCourt=function(n){
 if(!canGame())return;
 const cur=String(courtLabel(n)||'').replace(/\D/g,'')||String(n);
 openModal(`<h3>코트 번호 수정</h3><div class="note">숫자만 입력할 수 있습니다. 화면에는 자동으로 <b>코트</b>가 붙어 표시됩니다.</div><div class="field"><label>코트 번호</label><input id="courtNumber72" class="courtNumber72" type="number" min="1" max="999" step="1" inputmode="numeric" pattern="[0-9]*" value="${esc(cur)}"></div><div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="saveCourtNumber72(${Number(n)})">저장</button></div>`);
 setTimeout(()=>$('courtNumber72')?.select(),30);
};
window.saveCourtNumber72=async function(court){
 const raw=String($('courtNumber72')?.value||'').trim();
 if(!/^\d+$/.test(raw)||Number(raw)<1)return alert('코트 번호는 1 이상의 숫자만 입력해주세요.');
 try{await applyV72('set_court_name',{court:Number(court),name:`${Number(raw)}코트`});closeModal()}catch(e){showError(e)}
};

/* Route game start/end through v72 so wait samples and attendance remain consistent. */
const act71=act;
act=async function(action,body={},opts={}){
 if(action==='begin_game'||action==='finish_game'||action==='set_court_name')return applyV72(action,body,true);
 return act71(action,body,opts);
};

/* Attendance polls */
function renderPollCard72(p){
 const members=yesMembers72(p),guests=guests72(p),mine=mine72(),vote=mine?voteMap72(p)[String(mine.id)]||'':'';
 const staff=pollAdmin72();
 return `<div class="card pollCard72">
  <div class="pollHead72"><div><b>${esc(p.title||'운동 참석 투표')}</b><div class="pollWhen72">${pollWhen72(p)}</div><div class="meta">개설 ${esc(p.createdBy||'운영진')}</div></div>${staff?`<button class="miniBtn" onclick="deletePoll72('${esc(p.id)}')">삭제</button>`:''}</div>
  <div class="pollCounts72">
   <button class="pollCountBtn72" onclick="openPollMembers72('${esc(p.id)}')"><b>${members.length}명</b>회원 참석</button>
   <button class="pollCountBtn72" onclick="openPollGuests72('${esc(p.id)}')"><b>${guests.length}명</b>게스트</button>
  </div>
  ${canVote72()?`<div class="pollVote72"><button class="btn ${vote==='yes'?'pri':'ghost'}" onclick="votePoll72('${esc(p.id)}','yes')">참석</button><button class="btn ${vote==='no'?'danger':'ghost'}" onclick="votePoll72('${esc(p.id)}','no')">불참</button></div><div class="pollMine72">내 응답: ${vote==='yes'?'참석':vote==='no'?'불참':'미응답'}</div>`:'<div class="note">게스트는 직접 투표하지 않고 운영진이 참가명단에 입력합니다.</div>'}
  ${staff?`<div class="pollAdmin72"><button class="btn ghost" onclick="openGuestAdd72('${esc(p.id)}')">+ 게스트 참가 추가</button></div>`:''}
 </div>`;
}
function renderPolls72(){
 const ps=polls72().slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')));
 return `<div class="subhead"><b>운동 참석 투표</b>${pollAdmin72()?'<button class="btn pri" onclick="openPollCreate72()">+ 투표 만들기</button>':''}</div>${ps.length?ps.map(renderPollCard72).join(''):'<div class="empty">진행 중인 참석 투표가 없습니다.</div>'}`;
}
window.openPollCreate72=function(){
 if(!pollAdmin72())return alert('게임편성자 이상 권한이 필요합니다.');
 const d=typeof businessDay71==='function'?businessDay71():todayKst();
 openModal(`<h3>운동 참석 투표 만들기</h3><div class="field"><label>일자</label><input id="pollDate72" type="date" value="${esc(d)}"></div><div class="field"><label>운동 시작 시간</label><input id="pollTime72" type="time" value="19:00"></div><div class="field"><label>제목</label><input id="pollTitle72" maxlength="40" value="운동 참석 투표"></div><div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="createPoll72()">투표 시작</button></div>`);
};
window.createPoll72=async function(){
 const date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',title=$('pollTitle72')?.value.trim()||'운동 참석 투표';
 if(!date||!time)return alert('운동 일자와 시간을 입력해주세요.');
 try{await applyV72('poll_create',{date,time,title});closeModal();goView('stats')}catch(e){showError(e)}
};
window.votePoll72=async function(id,vote){
 if(!canVote72())return alert('게스트는 투표할 수 없습니다.');
 try{await applyV72('poll_vote',{pollId:id,vote})}catch(e){showError(e)}
};
window.deletePoll72=async function(id){
 if(!pollAdmin72())return;
 if(!confirm('이 참석 투표를 삭제하시겠습니까?'))return;
 try{await applyV72('poll_delete',{pollId:id})}catch(e){showError(e)}
};
window.openPollMembers72=function(id){
 const p=polls72().find(x=>String(x.id)===String(id));if(!p)return;
 const ms=yesMembers72(p).sort((a,b)=>roleRank72(a)-roleRank72(b)||String(a.name||'').localeCompare(String(b.name||''),'ko'));
 openModal(`<h3>참석 회원 ${ms.length}명</h3><div class="note">총관리자 → 모임관리자 → 게임편성자 → 임시편성자 → 일반회원 순으로 표시됩니다.</div>${ms.length?ms.map(m=>`<div class="pollMember72">${genderChip72(m)}<span class="pollName72">${esc(m.name)}</span><span class="tag">${esc(m.cls||'C')}</span>${roleBadge(m)}</div>`).join(''):'<div class="empty">참석을 선택한 회원이 없습니다.</div>'}<button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`);
};
window.openPollGuests72=function(id){
 const p=polls72().find(x=>String(x.id)===String(id));if(!p)return;const gs=guests72(p);
 openModal(`<h3>참석 게스트 ${gs.length}명</h3>${gs.length?gs.map(g=>`<div class="pollGuestRow72"><div>${genderChip72(g)} <b>${esc(g.name)}</b> <span class="tag">${esc(g.cls||'C')}</span><span class="meta"> ${esc(g.age||'30')}대</span></div>${pollAdmin72()?`<button class="miniBtn" onclick="removePollGuest72('${esc(p.id)}','${esc(g.id)}')">삭제</button>`:''}</div>`).join(''):'<div class="empty">등록된 게스트가 없습니다.</div>'}${pollAdmin72()?`<button class="btn pri" style="width:100%;margin-top:10px" onclick="closeModal();openGuestAdd72('${esc(p.id)}')">+ 게스트 참가 추가</button>`:''}<button class="btn ghost" style="width:100%;margin-top:7px" onclick="closeModal()">닫기</button>`);
};
window.openGuestAdd72=function(id){
 if(!pollAdmin72())return;
 openModal(`<h3>게스트 참가 추가</h3><div class="field"><label>이름</label><input id="pollGuestName72" maxlength="30" placeholder="게스트 이름"></div><div class="grid2"><div class="field"><label>성별</label><select id="pollGuestGender72"><option>남</option><option>여</option></select></div><div class="field"><label>연령대</label><select id="pollGuestAge72">${[10,20,30,40,50,60,70,80].map(x=>`<option value="${x}">${x}대</option>`).join('')}</select></div><div class="field"><label>급수</label><select id="pollGuestCls72">${['A','B','C','D','E'].map(x=>`<option ${x==='C'?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="addPollGuest72('${esc(id)}')">참가명단 반영</button></div>`);
};
window.addPollGuest72=async function(id){
 const name=$('pollGuestName72')?.value.trim()||'';if(!name)return alert('게스트 이름을 입력해주세요.');
 try{await applyV72('poll_guest_add',{pollId:id,name,gender:$('pollGuestGender72')?.value||'남',age:$('pollGuestAge72')?.value||'30',cls:$('pollGuestCls72')?.value||'C'});closeModal();goView('stats')}catch(e){showError(e)}
};
window.removePollGuest72=async function(pid,gid){
 if(!pollAdmin72())return;
 try{await applyV72('poll_guest_remove',{pollId:pid,guestId:gid});openPollGuests72(pid)}catch(e){showError(e)}
};

const renderStats71=renderStats;
renderStats=function(){
 renderStats71();const box=$('stats');if(!box)return;
 const grid=box.querySelector('.statsGrid');if(grid){
  grid.classList.add('statsGrid72');
  grid.insertAdjacentHTML('beforeend',`<div class="stat"><b>${avgWaitMin72()}분</b>평균 게임 대기시간</div>`);
 }
 const recent=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('오늘 최근 경기'));
 if(recent)recent.insertAdjacentHTML('beforebegin',renderPolls72());else box.insertAdjacentHTML('beforeend',renderPolls72());
};

/* Settings: common cards -> court settings -> reset accordion -> admin extras. */
window.toggleReset72=function(){
 const w=$('resetWrap72');if(w)w.classList.toggle('open');
};
function arrangeSettings72(){
 const box=$('settings');if(!box)return;const title=box.querySelector('.title');if(!title)return;
 [...box.querySelectorAll(':scope > .subhead')].forEach(x=>{if((x.textContent||'').includes('모임 리셋'))x.remove()});
 let cards=[...box.querySelectorAll(':scope > .card')];
 const by=t=>cards.find(c=>(c.textContent||'').includes(t));
 const current=by('현재 모임'),my=by('오늘 내 상태'),partner=box.querySelector(':scope > .partnerCard66'),court=by('코트 설정'),temp=by('당일 임시편성자'),version=by('프로그램 버전'),home=by('홈 화면에 추가');
 const resets=cards.filter(c=>c.classList.contains('resetTier40')||c.classList.contains('rosterReset60'));
 let resetWrap=null;
 if(resets.length){
  resetWrap=document.createElement('div');resetWrap.id='resetWrap72';resetWrap.className='card resetWrap72';
  resetWrap.innerHTML=`<button class="resetHead72" onclick="toggleReset72()"><b>리셋</b><span class="resetArrow72">⌄</span></button><div class="resetPanel72"></div>`;
  const panel=resetWrap.querySelector('.resetPanel72');resets.forEach(c=>panel.appendChild(c));
 }
 const reserved=new Set([current,my,partner,court,temp,version,home,...resets].filter(Boolean));
 const extras=cards.filter(c=>!reserved.has(c));
 const desired=[current,my,partner,court,resetWrap,temp,...extras,version,home].filter(Boolean);
 let cursor=title;
 desired.forEach(n=>{cursor.after(n);cursor=n});
}
const renderSettings71=renderSettings;
renderSettings=function(){
 renderSettings71();arrangeSettings72();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v71'))el.textContent='콕매치 v72 · 참석투표 · 평균대기 · 설정정리'});
};

if(location.pathname.startsWith('/launch/v72'))history.replaceState(null,'','/?loaded=72');
if(me)renderAll();
})();
