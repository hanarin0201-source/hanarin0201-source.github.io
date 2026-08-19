(()=>{
function canSeeGlobal53(){
 const mode=String(S?.adminBadgeVisibility||'all');
 if(me?.globalAdmin)return true;
 if(mode==='all')return true;
 if(mode==='staff')return me?.role==='manager'||me?.role==='organizer';
 return false;
}

roleBadge=function(m){
 const r=roleOf(m);
 const globalLike=r==='admin'||(me?.globalAdmin&&m?.name===me.displayName);
 if(globalLike){
  if(!canSeeGlobal53())return '';
  return '<span class="roleBadge role-global">총관리자</span>';
 }
 if(r==='manager')return '<span class="roleBadge role-manager">모임관리자</span>';
 if(r==='organizer')return '<span class="roleBadge role-organizer">게임편성자</span>';
 if(isTemp(m))return '<span class="roleBadge role-temp">임시편성자</span>';
 return '<span class="roleBadge role-member44">일반회원</span>';
};

function badge53(m){
 return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m);
}
function invite53(m){
 const v=m?.type==='guest'?String(m?.inviter||'').trim():'';
 return v?`<span class="inviteSub45">초대 ${esc(v)}</span>`:'';
}
function genderMark53(m){
 const female=m?.gender==='여';
 return `<span class="genderMark53 ${female?'female':'male'}" title="${female?'여':'남'}" aria-label="${female?'여성':'남성'}">●</span>`;
}
function compactName53(m,id,label='게임'){
 return `<div class="compactLine53"><span class="compactName53">${esc(m.name)}</span>${ageTag(m)}<span class="gamecnt">${label} ${dailyCount(id)}회</span>${badge53(m)}</div>`;
}

function pendingCard53(pg,i){
 const waited=Math.max(0,Math.floor((Date.now()-Number(pg.createdAt||Date.now()))/60000));
 const slots=Array.from({length:4},(_,idx)=>{
  const id=pg.players?.[idx],m=id?M(id):null;
  if(!m)return `<div class="pendingSlot emptySlot ${canGame()?'clickable':''}" ${canGame()?`onclick="openFillPending('${pg.id}')"`:''}>＋ 빈자리</div>`;
  const b=badge53(m);
  return `<div class="pendingSlot pendingSlot53 ${canGame()?'clickable hasX53':''}" ${canGame()?`onclick="openMoveMember('${pg.id}','${id}')"`:''}>${canGame()?`<button class="pendingX" onclick="event.stopPropagation();removePending('${pg.id}','${id}')">×</button>`:''}<div class="slotTop53"><span class="slotLabel">${idx<2?'A팀':'B팀'} ${idx%2+1}</span><span class="slotBadges53">${genderMark53(m)}${b}</span></div><div class="slotName slotName53"><span class="compactName53">${esc(m.name)}</span>${ageTag(m)}</div><div class="meta compactMeta53">게임 ${dailyCount(id)}회 · ${waitMins(m)}분 대기</div>${invite53(m)}</div>`;
 }).join('');
 return `<div class="card pendingCard pendingCard53"><div class="pendingHead"><b>편성대기 ${i+1}조 · ${pg.players?.length||0}/4명</b><div class="pendingTools">${canGame()?`<button class="miniBtn" ${i===0?'disabled':''} onclick="movePendingOrder('${pg.id}','up')">↑</button><button class="miniBtn" ${i===S.pendingGames.length-1?'disabled':''} onclick="movePendingOrder('${pg.id}','down')">↓</button>`:''}<span class="tag">${waited}분</span></div></div><div class="pendingGrid">${slots}</div><div class="pairSummary">${pairSummary(pg.players||[])}</div>${canGame()?`<div class="pendingActs"><button class="btn pri" ${(pg.players?.length||0)!==4?'disabled':''} onclick="openCourtStart('${pg.id}')">코트 선택 · 경기 시작</button><button class="btn ghost" onclick="cancelPending('${pg.id}')">편성 취소</button></div>`:''}</div>`;
}

renderQueue=function(){
 const box=$('queue');if(!box)return;
 try{
  const q=sortedQueue(),selected=new Set(draft.filter(Boolean));
  const composer=canGame()?`<div class="composer"><div class="composerTitle">새 게임 편성</div><div class="slots">${draft.map((id,i)=>{const m=id?M(id):null;return `<div class="slot ${m?'filled':''}"><div class="slotLabel">${i<2?'A팀':'B팀'} ${i%2+1}</div>${m?`<button class="slotX" onclick="draftRemove(${i})">×</button><div class="slotName slotName53">${esc(m.name)} ${ageTag(m)} ${badge53(m)}</div><div class="meta compactMeta53">게임 ${dailyCount(id)}회 · ${waitMins(m)}분 대기</div>${invite53(m)}`:'<div class="meta">개인 게임대기에서 선택</div>'}</div>`}).join('')}</div><div class="pairSummary">${pairSummary(draft.filter(Boolean))}</div><div class="composerActs"><button class="btn ghost" onclick="recommendDraft()">✨ 추천 구성</button><button class="btn pri" ${draft.filter(Boolean).length?'':'disabled'} onclick="registerDraft()">대기 등록</button></div></div>`:'';
  const personal=`<div class="subhead"><b>개인 게임대기</b><span class="tag">${q.length}명</span></div><div class="note">게임횟수가 적은 순서 → 같은 횟수면 대기시간이 긴 순서입니다.</div>${q.length?q.map((id,i)=>{const m=M(id);if(!m)return'';return `<div class="card queueCard queueCard53 ${selected.has(id)?'selected':''}" ${canGame()?`onclick="draftClick('${id}')"`:''}><div class="ord">${i+1}</div>${genderMark53(m)}<div class="queueInfo53"><div class="name queueMain47 compactLine53"><span class="compactName53">${esc(m.name)}</span>${ageTag(m)}<span class="gamecnt">게임 ${dailyCount(id)}회</span>${badge53(m)}</div><div class="meta compactMeta53">${waitMins(m)}분 대기</div>${invite53(m)}</div><b class="queueCheck53">${selected.has(id)?'✓':''}</b></div>`}).join(''):'<div class="empty">개인 게임대기 회원이 없습니다.</div>'}`;
  const pending=`<div class="subhead"><b>편성대기 현황</b><span class="tag">${S.pendingGames.length}조</span></div>${S.pendingGames.length?S.pendingGames.map(pendingCard53).join(''):'<div class="empty">편성대기 중인 조가 없습니다.</div>'}`;
  box.innerHTML=`<div class="title"><h2>게임대기</h2><span class="tag">${S.queue.length+S.pendingGames.reduce((n,g)=>n+(g.players?.length||0),0)}명</span></div>${composer}${personal}${pending}`;
  if(typeof decorateResponsive48==='function')decorateResponsive48();
 }catch(e){console.error('queue render v53',e);box.innerHTML=`<div class="title"><h2>게임대기</h2></div><div class="warn">게임대기 화면을 표시하는 중 오류가 발생했습니다.</div><button class="btn pri" onclick="refreshQueue47()">다시 불러오기</button>`}
};

playerLine=function(id){
 const m=M(id);if(!m)return'-';
 const inv=m?.type==='guest'&&String(m?.inviter||'').trim()?String(m.inviter).trim():'';
 return `<div class="p playingPlayer53"><div class="playingMain53"><span class="playingName53">${esc(m.name)}</span>${ageTag(m)}${badge53(m)}</div><div class="meta playingMeta53">게임 ${dailyCount(id)}회${inv?` · 초대 ${esc(inv)}`:''}</div></div>`;
};

const renderSettings52=renderSettings;
renderSettings=function(){
 renderSettings52();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v52'))el.textContent='콕매치 v53 · 역할 배지 복원 · 성별표시/레이아웃 개선'});
};

if(location.pathname.startsWith('/launch/v53'))history.replaceState(null,'','/?loaded=53');
if(me)renderAll();
})();
