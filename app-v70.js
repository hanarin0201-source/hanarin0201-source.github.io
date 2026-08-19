(()=>{
const WAIT70='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-wait-v70';
function actor70(){return me?.globalAdmin?'admin':me?.tempOrganizer?'temp':String(me?.role||'member')}
function staff70(){return ['admin','manager','organizer','temp'].includes(actor70())}
function mine70(){if(me?.memberId){const m=M(String(me.memberId));if(m)return m}const n=String(me?.displayName||'').trim();return S.members.find(m=>String(m.name||'').trim()===n)||null}
function slot70(kind,html){return `<span class="memberBtnSlot65 memberBtn-${kind}65">${html||'<span class="memberBtnPlaceholder65" aria-hidden="true"></span>'}</span>`}
function ownControls70(m){let first='',second='';if(m.state!=='playing'&&m.state!=='matched'){if(m.state==='waiting'){first=`<button class="btn danger" onclick="setMyMemberState70('out')">퇴장</button>`;second=`<button class="btn watch" onclick="setMyMemberState70('spectator')">관람</button>`}else if(m.state==='spectator'){first=`<button class="btn enter" onclick="setMyMemberState70('waiting')">입장</button>`;second=`<button class="btn danger" onclick="setMyMemberState70('out')">퇴장</button>`}else{first=`<button class="btn enter" onclick="setMyMemberState70('waiting')">입장</button>`;second=`<button class="btn watch" onclick="setMyMemberState70('spectator')">관람</button>`}}return `<div class="memberActions60 memberActions65 memberActions69"><div class="status">${stateLabel(m.state)}</div><div class="memberBtns memberBtns65">${slot70('primary',first)}${slot70('secondary',second)}${slot70('edit','')}</div></div>`}
window.setMyMemberState70=async function(mode){try{await act('set_my_attendance',{mode})}catch(e){showError(e)}};

const renderMembers69=renderMembers;
renderMembers=function(){
 const actualStaff=staff70();
 if(actualStaff){renderMembers69();const note=$('members')?.querySelector('.note');if(note)note.textContent='모든 회원이 현재 모임의 전체 회원명부를 볼 수 있습니다. 운영권한 사용자는 권한 범위에 따라 회원 상태와 정보를 관리할 수 있습니다.';return}
 const oldTemp=me?.tempOrganizer;if(me)me.tempOrganizer=true;
 try{renderMembers69()}finally{if(me)me.tempOrganizer=oldTemp}
 const box=$('members');if(!box)return;
 const note=box.querySelector('.note');if(note)note.textContent='모든 회원이 현재 모임의 전체 회원명부를 볼 수 있습니다. 일반회원과 게스트는 본인의 입장·관람·퇴장만 변경할 수 있습니다.';
 const self=box.querySelector('.memberSelf69'),my=mine70();
 [...box.querySelectorAll('.memberCard')].forEach(card=>{
  card.querySelector('.pairBtn:not(.partnerSetBtn66)')?.remove();
  const actions=card.querySelector('.memberActions65,.memberActions60');if(!actions)return;
  if(card===self&&my)actions.outerHTML=ownControls70(my);
  else{const status=actions.querySelector('.status')?.textContent||'';actions.outerHTML=`<div class="memberActions60 memberActions65 memberReadonly70"><div class="status">${esc(status)}</div></div>`}
 });
};

function todayStart70(){const d=todayKst().split('-').map(Number);return Date.UTC(d[0],d[1]-1,d[2])-9*60*60*1000}
function currentWaitMin70(m){const j=Number(m?.joinedAt)||0;return j?Math.max(0,Math.floor((Date.now()-j)/60000)):0}
function totalWaitMin70(m){let ms=String(m?.waitDay||'')===todayKst()?Math.max(0,Number(m?.waitTotalMs)||0):0;const j=Number(m?.joinedAt)||0;if(j&&(m?.state==='waiting'||m?.state==='matched'))ms+=Math.max(0,Date.now()-Math.max(j,todayStart70()));return Math.max(0,Math.floor(ms/60000))}
function decorateWait70(){const box=$('queue');if(!box)return;const q=sortedQueue();[...box.querySelectorAll('.queueCard54,.queueCard53')].forEach((card,i)=>{const m=M(q[i]);if(!m)return;const meta=card.querySelector('.queueInfo53 .compactMeta53')||card.querySelector('.queueInfo53 .meta');if(meta)meta.innerHTML=`<span class="waitCurrent70">현재 ${currentWaitMin70(m)}분 대기중</span><span class="waitSep70"> · </span><span class="waitTotal70">오늘 총 ${totalWaitMin70(m)}분 대기</span>`})}
const renderQueue69=renderQueue;
renderQueue=function(){renderQueue69();decorateWait70()};
setInterval(()=>{if(me&&currentView==='queue')decorateWait70()},30000);

async function waitRequest70(action,body={}){const r=await fetch(WAIT70,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});const x=await r.json().catch(()=>({}));if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'대기시간 처리에 실패했습니다.')}return x}
const act69=act;
act=async function(action,body={},opts={}){if(['set_my_attendance','set_member_attendance','begin_game','finish_game'].includes(action)){const x=await waitRequest70(action,body);if(x.data){S=x.data;normalizeClient();renderAll()}return x}return act69(action,body,opts)};

const renderSettings69=renderSettings;
renderSettings=function(){renderSettings69();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v69'))el.textContent='콕매치 v70 · 전체회원명부 공개 · 당일 누적대기시간'})};
if(location.pathname.startsWith('/launch/v70'))history.replaceState(null,'','/?loaded=70');
if(me)renderAll();
})();
