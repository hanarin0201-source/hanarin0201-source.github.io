(()=>{
const POLL90_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v90-api';
let pollSyncBusy90=false;

function mine90(){
 if(me?.memberId){const m=M(String(me.memberId));if(m)return m}
 const n=String(me?.displayName||'').trim();
 return (S.members||[]).find(m=>String(m.name||'').trim()===n)||null;
}
function pollAdmin90(){
 const m=mine90();
 return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer'||me.tempOrganizer||isTemp(m));
}
function pollList90(){S.attendancePolls=Array.isArray(S.attendancePolls)?S.attendancePolls:[];return S.attendancePolls}
function voteMap90(p){return p?.memberVotes&&typeof p.memberVotes==='object'?p.memberVotes:{}}
function guests90(p){return Array.isArray(p?.guestEntries)?p.guestEntries:[]}
function yesMembers90(p){const v=voteMap90(p);return Object.keys(v).filter(id=>v[id]==='yes').map(M).filter(m=>m&&m.type!=='guest')}
function canVote90(){const m=mine90();return !!m&&m.type!=='guest'}
function roleRank90(m){const r=roleOf(m);if(r==='admin')return 0;if(r==='manager')return 1;if(r==='organizer')return 2;if(isTemp(m))return 3;return 4}
function genderChip90(m){const f=m?.gender==='여';return `<span class="pollGender72 ${f?'female':'male'}">${f?'여':'남'}</span>`}
function today90(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function dateWeekday90(v){const a=String(v||'').split('-').map(Number);if(a.length!==3||!a[0])return '-';const d=new Date(Date.UTC(a[0],a[1]-1,a[2]));return ['일','월','화','수','목','금','토'][d.getUTCDay()]+'요일'}
function autoTitle90(date,time,location){const a=String(date||'').split('-').map(Number);if(a.length!==3||!a[1]||!a[2])return '참석투표';const place=String(location||'').trim();return `${a[1]}월 ${a[2]}일 ${time||''}${place?' '+place:''} 참석투표`}
function timeOptions90(selected='18:30'){const out=[];for(let h=0;h<24;h++)for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;out.push(`<option value="${v}" ${v===selected?'selected':''}>${v}</option>`)}return out.join('')}
function addMinutes90(t,min){const [h,m]=String(t||'00:00').split(':').map(Number);const total=(h*60+m+min)%(24*60);return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`}
function pollEndMs90(p){const d=String(p?.date||''),e=String(p?.endTime||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||!/^\d{2}:(00|30)$/.test(e))return 0;return Date.parse(`${d}T${e}:00+09:00`)}
function isExpired90(p){const end=pollEndMs90(p);return !!end&&end<=Date.now()}

async function request90(action,body={}){
 const r=await fetch(POLL90_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'처리에 실패했습니다.')}
 if(x.data){S=x.data;normalizeClient()}
 return x;
}
async function syncPolls90(render=true){
 if(pollSyncBusy90||!me||!T)return;
 pollSyncBusy90=true;
 try{await request90('poll_sync');if(render&&currentView==='stats')renderStats()}catch(e){console.warn('poll sync v90',e)}finally{pollSyncBusy90=false}
}

function renderPollCard90(p){
 const members=yesMembers90(p),guests=guests90(p),mine=mine90(),vote=mine?voteMap90(p)[String(mine.id)]||'':'';
 const staff=pollAdmin90();
 return `<div class="card pollCard72 pollCard90">
  <div class="pollHead72"><div><b>${esc(p.title||'운동 참석 투표')}</b><div class="pollBlank90">&nbsp;</div></div><div class="pollHeadBtns90">${staff?`<button class="miniBtn" onclick="openPollEdit90('${esc(p.id)}')">수정</button><button class="miniBtn" onclick="deletePoll72('${esc(p.id)}')">삭제</button>`:''}</div></div>
  <div class="pollCounts72">
   <button class="pollCountBtn72" onclick="openPollMembers72('${esc(p.id)}')"><b>${members.length}명</b>회원 참석</button>
   <button class="pollCountBtn72" onclick="openPollGuests72('${esc(p.id)}')"><b>${guests.length}명</b>게스트</button>
  </div>
  ${canVote90()?`<div class="pollVote72"><button class="btn ${vote==='yes'?'pri':'ghost'}" onclick="votePoll72('${esc(p.id)}','yes')">참석</button><button class="btn ${vote==='no'?'danger':'ghost'}" onclick="votePoll72('${esc(p.id)}','no')">불참</button></div><div class="pollMine72">내 응답: ${vote==='yes'?'참석':vote==='no'?'불참':'미응답'}</div>`:'<div class="note">게스트는 직접 투표하지 않고 운영진이 참가명단에 입력합니다.</div>'}
  ${staff?`<div class="pollAdmin72"><button class="btn ghost" onclick="openGuestAdd72('${esc(p.id)}')">+ 게스트 참가 추가</button></div>`:''}
 </div>`;
}
function renderPolls90(){
 const ps=pollList90().filter(p=>!isExpired90(p)).slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')));
 return `<div class="subhead pollHead90"><b>운동 참석 투표</b>${pollAdmin90()?'<button class="btn pri" onclick="openPollCreate72()">+ 투표 만들기</button>':''}</div>${ps.length?ps.map(renderPollCard90).join(''):'<div class="empty pollEmpty90">진행 중인 참석 투표가 없습니다.</div>'}`;
}
function replacePollSection90(){
 const box=$('stats');if(!box)return;
 const oldHead=[...box.querySelectorAll(':scope > .subhead')].find(x=>(x.textContent||'').includes('운동 참석 투표'));
 if(oldHead){
  let n=oldHead.nextElementSibling;oldHead.remove();
  while(n&&(n.classList.contains('pollCard72')||n.classList.contains('empty'))){const nx=n.nextElementSibling;n.remove();n=nx}
 }
 box.querySelectorAll(':scope > .pollHead90,:scope > .pollCard90,:scope > .pollEmpty90').forEach(x=>x.remove());
 const recent=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('오늘 최근 경기'));
 const wrap=document.createElement('div');wrap.className='pollWrap90';wrap.innerHTML=renderPolls90();
 if(recent)recent.insertAdjacentElement('beforebegin',wrap);else box.appendChild(wrap);
}

function pollForm90(p=null){
 const date=p?.date||today90(),start=p?.time||'18:30',end=p?.endTime||addMinutes90(start,180),loc=p?.location||'',title=p?.title||autoTitle90(date,start,loc);
 return `<h3>${p?'운동 참석 투표 수정':'운동 참석 투표 만들기'}</h3><div class="pollCreateForm74 pollForm90">
  <div class="field"><label>일자</label><div class="pollDateRow76"><input id="pollDate72" type="date" value="${esc(date)}"><span id="pollWeekday76" class="pollWeekday76">${dateWeekday90(date)}</span></div></div>
  <div class="grid2 pollTimeGrid90"><div class="field"><label>운동 시작시간</label><select id="pollTime72">${timeOptions90(start)}</select></div><div class="field"><label>운동 종료시간</label><select id="pollEndTime90">${timeOptions90(end)}</select></div></div>
  <div class="meta pollTimeNote90">시작·종료시간은 30분 단위로 선택합니다.</div>
  <div class="field"><label>운동 장소</label><input id="pollLocation73" maxlength="40" placeholder="예: 신리천 2코트" value="${esc(loc)}"></div>
  <div class="field"><label>투표 제목</label><input id="pollTitle72" maxlength="60" value="${esc(title)}"><div class="meta">일자·시작시간·장소를 기준으로 자동 작성되며 자유롭게 수정할 수 있습니다.</div></div>
  <div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="${p?`savePollEdit90('${esc(p.id)}')`:'createPoll72()'}">${p?'수정 저장':'투표 시작'}</button></div></div>`;
}
function bindPollForm90(){
 const title=$('pollTitle72');if(title)title.dataset.manual='0';
 const sync=()=>{const el=$('pollWeekday76');if(el)el.textContent=dateWeekday90($('pollDate72')?.value||'');if(title&&title.dataset.manual!=='1')title.value=autoTitle90($('pollDate72')?.value||'',$('pollTime72')?.value||'',$('pollLocation73')?.value.trim()||'')};
 $('pollDate72')?.addEventListener('change',sync);
 $('pollLocation73')?.addEventListener('input',sync);
 $('pollTime72')?.addEventListener('change',()=>{const st=$('pollTime72')?.value||'18:30',en=$('pollEndTime90')?.value||'';if(en<=st){const end=addMinutes90(st,120);if($('pollEndTime90'))$('pollEndTime90').value=end}sync()});
 title?.addEventListener('input',()=>{title.dataset.manual='1'});
}
window.openPollCreate72=function(){if(!pollAdmin90())return alert('편성자 이상 권한이 필요합니다.');openModal(pollForm90(null));bindPollForm90()};
window.openPollEdit90=function(id){if(!pollAdmin90())return alert('투표 수정 권한이 없습니다.');const p=pollList90().find(x=>String(x.id)===String(id));if(!p)return alert('투표를 찾을 수 없습니다.');openModal(pollForm90(p));bindPollForm90()};
function readPollForm90(){const date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',endTime=$('pollEndTime90')?.value||'',location=$('pollLocation73')?.value.trim()||'';let title=$('pollTitle72')?.value.trim()||'';if(!date||!time||!endTime)return {error:'운동 일자와 시작·종료시간을 선택해주세요.'};if(endTime<=time)return {error:'운동 종료시간은 시작시간보다 늦게 선택해주세요.'};if(!location)return {error:'운동 장소를 입력해주세요.'};if(!title)title=autoTitle90(date,time,location);return {date,time,endTime,location,title}}
window.createPoll72=async function(){const v=readPollForm90();if(v.error)return alert(v.error);try{await request90('poll_create',v);closeModal();renderAll();goView('stats')}catch(e){showError(e)}};
window.savePollEdit90=async function(id){const v=readPollForm90();if(v.error)return alert(v.error);try{await request90('poll_update',{pollId:id,...v});closeModal();renderAll();goView('stats')}catch(e){showError(e)}};
window.votePoll72=async function(id,vote){if(!canVote90())return alert('게스트는 투표할 수 없습니다.');try{await request90('poll_vote',{pollId:id,vote});renderAll()}catch(e){showError(e)}};
window.deletePoll72=async function(id){if(!pollAdmin90())return;if(!confirm('이 참석 투표를 삭제하시겠습니까?'))return;try{await request90('poll_delete',{pollId:id});renderAll()}catch(e){showError(e)}};
window.addPollGuest72=async function(id){const name=$('pollGuestName72')?.value.trim()||'';if(!name)return alert('게스트 이름을 입력해주세요.');try{await request90('poll_guest_add',{pollId:id,name,gender:$('pollGuestGender72')?.value||'남',age:$('pollGuestAge72')?.value||'30',cls:$('pollGuestCls72')?.value||'C'});closeModal();renderAll();goView('stats')}catch(e){showError(e)}};
window.removePollGuest72=async function(pid,gid){if(!pollAdmin90())return;try{await request90('poll_guest_remove',{pollId:pid,guestId:gid});renderAll();openPollGuests72(pid)}catch(e){showError(e)}};

const renderStats89=renderStats;
renderStats=function(){renderStats89();replacePollSection90()};
const goView89=goView;
goView=function(id){goView89(id);if(id==='stats'){syncPolls90(false).then(()=>{if(currentView==='stats')renderStats()})}};

setInterval(()=>{if(!me)return;const expired=pollList90().some(isExpired90);if(expired)syncPolls90(currentView==='stats')},30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&me)syncPolls90(currentView==='stats')});

const renderSettings89=renderSettings;
renderSettings=function(){renderSettings89();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v89'))el.textContent='콕매치 v90 · 참석투표 수정 · 시작/종료시간 · 종료 후 자동정리'})};
if(location.pathname.startsWith('/launch/v90'))history.replaceState(null,'','/?loaded=90');
if(me){syncPolls90(false).finally(()=>renderAll())}
})();
