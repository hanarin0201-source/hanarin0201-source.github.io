(()=>{
const GROUPS_V47='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-groups-v47';

/* PC-safe pointer handling: dragging/selecting inside a modal must never count as a backdrop click. */
let pointer47={down:false,insideSheet:false,interactive:false,x:0,y:0,dragged:false};
function markPointerDown47(e){
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 pointer47={down:true,insideSheet:!!t.closest('#modalSheet'),interactive:!!t.closest('.queueCard,.pendingSlot,.courtCard,.choiceBtn'),x:Number(e.clientX)||0,y:Number(e.clientY)||0,dragged:false};
}
function markPointerMove47(e){if(!pointer47.down)return;const dx=(Number(e.clientX)||0)-pointer47.x,dy=(Number(e.clientY)||0)-pointer47.y;if(Math.hypot(dx,dy)>5)pointer47.dragged=true}
function markPointerEnd47(){setTimeout(()=>{pointer47.down=false;pointer47.insideSheet=false;pointer47.interactive=false;pointer47.dragged=false},0)}
if(window.PointerEvent){document.addEventListener('pointerdown',markPointerDown47,true);document.addEventListener('pointermove',markPointerMove47,true);document.addEventListener('pointerup',markPointerEnd47,true)}else{document.addEventListener('mousedown',markPointerDown47,true);document.addEventListener('mousemove',markPointerMove47,true);document.addEventListener('mouseup',markPointerEnd47,true)}
document.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 if(t.id==='modal'&&pointer47.insideSheet){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();return}
 if(pointer47.dragged&&t.closest('.queueCard,.pendingSlot,.courtCard,.choiceBtn')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
},true);

/* Desktop keyboard conveniences without changing mobile behavior. */
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter'||e.isComposing)return;
 const id=(e.target instanceof Element?e.target.id:'');
 if(id==='loginName'){e.preventDefault();startLogin()}
 else if(id==='loginPin'){e.preventDefault();submitLogin()}
});

function badge47(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
function invite47(m){const v=m?.type==='guest'?String(m?.inviter||'').trim():'';return v?`<span class="inviteSub45">초대 ${esc(v)}</span>`:''}
function pendingCard47(pg,i){
 const waited=Math.max(0,Math.floor((Date.now()-Number(pg.createdAt||Date.now()))/60000));
 const slots=Array.from({length:4},(_,idx)=>{
  const id=pg.players?.[idx],m=id?M(id):null;
  if(!m)return `<div class="pendingSlot emptySlot ${canGame()?'clickable':''}" ${canGame()?`onclick="openFillPending('${pg.id}')"`:''}>＋ 빈자리</div>`;
  return `<div class="pendingSlot ${canGame()?'clickable':''}" ${canGame()?`onclick="openMoveMember('${pg.id}','${id}')"`:''}>${canGame()?`<button class="pendingX" onclick="event.stopPropagation();removePending('${pg.id}','${id}')">×</button>`:''}<div class="slotLabel">${idx<2?'A팀':'B팀'} ${idx%2+1}</div><div class="slotName">${esc(m.name)} ${ageTag(m)} ${badge47(m)}</div><div class="meta">게임 ${dailyCount(id)}회 · ${waitMins(m)}분 대기</div>${invite47(m)}</div>`;
 }).join('');
 return `<div class="card pendingCard"><div class="pendingHead"><b>편성대기 ${i+1}조 · ${pg.players?.length||0}/4명</b><div class="pendingTools">${canGame()?`<button class="miniBtn" ${i===0?'disabled':''} onclick="movePendingOrder('${pg.id}','up')">↑</button><button class="miniBtn" ${i===S.pendingGames.length-1?'disabled':''} onclick="movePendingOrder('${pg.id}','down')">↓</button>`:''}<span class="tag">${waited}분</span></div></div><div class="pendingGrid">${slots}</div><div class="pairSummary">${pairSummary(pg.players||[])}</div>${canGame()?`<div class="pendingActs"><button class="btn pri" ${(pg.players?.length||0)!==4?'disabled':''} onclick="openCourtStart('${pg.id}')">코트 선택 · 경기 시작</button><button class="btn ghost" onclick="cancelPending('${pg.id}')">편성 취소</button></div>`:''}</div>`;
}

/* Rebuild the waiting view once, instead of stacking the v35~v46 DOM-reorder wrappers. */
renderQueue=function(){
 const box=$('queue');if(!box)return;
 try{
  const q=sortedQueue(),selected=new Set(draft.filter(Boolean));
  const composer=canGame()?`<div class="composer"><div class="composerTitle">새 게임 편성</div><div class="slots">${draft.map((id,i)=>{const m=id?M(id):null;return `<div class="slot ${m?'filled':''}"><div class="slotLabel">${i<2?'A팀':'B팀'} ${i%2+1}</div>${m?`<button class="slotX" onclick="draftRemove(${i})">×</button><div class="slotName">${esc(m.name)} ${ageTag(m)} ${badge47(m)}</div><div class="meta">게임 ${dailyCount(id)}회 · ${waitMins(m)}분 대기</div>${invite47(m)}`:'<div class="meta">개인 게임대기에서 선택</div>'}</div>`}).join('')}</div><div class="pairSummary">${pairSummary(draft.filter(Boolean))}</div><div class="composerActs"><button class="btn ghost" onclick="recommendDraft()">✨ 추천 구성</button><button class="btn pri" ${draft.filter(Boolean).length?'':'disabled'} onclick="registerDraft()">대기 등록</button></div></div>`:'';
  const personal=`<div class="subhead"><b>개인 게임대기</b><span class="tag">${q.length}명</span></div><div class="note">게임횟수가 적은 순서 → 같은 횟수면 대기시간이 긴 순서입니다.</div>${q.length?q.map((id,i)=>{const m=M(id);if(!m)return'';return `<div class="card queueCard ${selected.has(id)?'selected':''}" ${canGame()?`onclick="draftClick('${id}')"`:''}><div class="ord">${i+1}</div><div><div class="name queueMain47">${esc(m.name)} ${ageTag(m)} <span class="gamecnt">게임 ${dailyCount(id)}회</span> ${badge47(m)}</div><div class="meta">${esc(m.gender||'')} · ${waitMins(m)}분 대기</div>${invite47(m)}</div><b>${selected.has(id)?'✓':''}</b></div>`}).join(''):'<div class="empty">개인 게임대기 회원이 없습니다.</div>'}`;
  const pending=`<div class="subhead"><b>편성대기 현황</b><span class="tag">${S.pendingGames.length}조</span></div>${S.pendingGames.length?S.pendingGames.map(pendingCard47).join(''):'<div class="empty">편성대기 중인 조가 없습니다.</div>'}`;
  box.innerHTML=`<div class="title"><h2>게임대기</h2><span class="tag">${S.queue.length+S.pendingGames.reduce((n,g)=>n+(g.players?.length||0),0)}명</span></div>${composer}${personal}${pending}`;
 }catch(e){console.error('queue render v47',e);box.innerHTML=`<div class="title"><h2>게임대기</h2></div><div class="warn">게임대기 화면을 표시하는 중 오류가 발생했습니다.</div><button class="btn pri" onclick="refreshQueue47()">다시 불러오기</button>`}
};
window.refreshQueue47=function(){loadState(true).then(()=>renderQueue()).catch(showError)};

async function groupsRequest47(action,body={}){
 const r=await fetch(GROUPS_V47,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'모임 관리 작업에 실패했습니다.')}return x;
}
loadGroups=async function(){if(!canManageGroups())return;const x=await groupsRequest47('list_groups');groupSummaries=x.groups||[];renderGroups();return x};
saveGroup=async function(id){
 const name=$('fgName')?.value.trim()||'',pin=$('fgPin')?.value.trim()||'';if(!name)return alert('모임 이름을 입력해주세요.');
 try{const x=await groupsRequest47(id?'update_group':'create_group',{groupId:id||'',name,pin});closeModal();await loadGroups();if(!id)alert(`${x.groupName||name} 모임을 생성했습니다. 총관리자가 회원명부에 자동 등록되었습니다.`)}catch(e){showError(e)}
};
deleteGroup=async function(id){
 const g=groupSummaries.find(x=>x.groupId===id);if(!g||!confirm(`${g.name} 모임을 삭제하시겠습니까?\n데이터는 보존되며 삭제된 모임에서 복구 또는 완전삭제를 선택할 수 있습니다.`))return;
 try{await groupsRequest47('delete_group',{groupId:id});await loadGroups();if(currentGroupId===id){const next=groupSummaries.find(x=>x.isActive);if(next){currentGroupId=next.groupId;localStorage.setItem(GROUP_KEY,currentGroupId);await loadState(true)}}renderGroups()}catch(e){showError(e)}
};
restoreGroup=async function(id){try{await groupsRequest47('restore_group',{groupId:id});await loadGroups()}catch(e){showError(e)}};
const purge42=window.purgeGroup42;
if(typeof purge42==='function')window.purgeGroup42=async function(id){const wasCurrent=currentGroupId===id;await purge42(id);if(wasCurrent&&!groupSummaries.some(x=>x.groupId===id)){const next=groupSummaries.find(x=>x.isActive);if(next){currentGroupId=next.groupId;localStorage.setItem(GROUP_KEY,currentGroupId);await loadState(true).catch(()=>{})}renderGroups()}};

const renderSettings46=renderSettings;
renderSettings=function(){renderSettings46();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v46'))el.textContent='콕매치 v47 · PC 호환성 · 모임관리/게임대기 안정화'})};

if(location.pathname.startsWith('/launch/v47'))history.replaceState(null,'','/?loaded=47');
if(me)renderAll();
})();
