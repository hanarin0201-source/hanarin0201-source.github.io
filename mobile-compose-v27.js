(()=>{
const APP_VERSION='27';
const REMOVE_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v27-remove';

// v26 Safari popup fix: closing/opening a modal that does not exist must never throw.
closeM=function(id){const el=$(id);if(el)el.classList.remove('on')};
openM=function(id){const el=$(id);if(el)el.classList.add('on')};

const css=document.createElement('style');
css.textContent=`
.v27Slot{padding:0!important;overflow:hidden;display:grid!important;grid-template-columns:1fr 40px!important;gap:0!important;align-items:stretch!important}
.v27MemberMain{border:0;background:transparent;min-width:0;padding:7px;display:flex;align-items:center;gap:7px;text-align:left;color:inherit}
.v27MemberMain:active{background:#edf2ff}
.v27Remove{border:0;border-left:1px solid #dbe3f8;background:#fff2f2;color:#d94646;font-size:22px;font-weight:900;display:grid;place-items:center;min-height:56px}
.v27Remove:active{background:#ffe3e3}
`;
document.head.appendChild(css);

const op27=()=>typeof window.gameOp24==='function'&&window.gameOp24();
function otherGroups27(id){return (S.pendingGames||[]).filter(g=>g.id!==id&&Array.isArray(g.players)&&g.players.length>0)}
async function removeReq27(pendingId,memberId){
 const r=await fetch(REMOVE_API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+T},body:JSON.stringify({pendingId,memberId})});
 const x=await r.json().catch(()=>({error:'통신 오류'}));
 if(!r.ok)throw new Error(x.error||'개인 게임대기로 이동하지 못했습니다.');
 return x
}
window.removePendingMember27=async(pendingId,memberId)=>{
 if(!op27())return;
 try{
  const x=await removeReq27(pendingId,memberId);
  useActionData(x)
 }catch(e){alert(e.message);await load().catch(()=>{})}
};

window.pendingCard=function(pg,i){
 const ids=Array.isArray(pg.players)?pg.players:[],op=op27();
 const tools=op?'<div class="pendingTools"><button class="orderBtn" '+(i===0?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'up\')">↑ 위</button><button class="orderBtn" '+(i===S.pendingGames.length-1?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'down\')">↓ 아래</button><span class="tag">'+ids.length+'/4명</span></div>':'<span class="tag">'+ids.length+'/4명</span>';
 const canChange=op&&((S.queue?.length||0)>0||otherGroups27(pg.id).length>0);
 const slots=Array.from({length:4},(_,j)=>{
  const id=ids[j],m=id?M(id):null,label=j<2?'A팀 '+(j+1):'B팀 '+(j-1);
  if(m){
   const info=avatar(m,true)+'<div><b>'+m.name+(canChange?'<span class="changeHint">이동/변경</span>':'')+'<span class="pendingSlotLabel">'+label+'</span></b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(id)+'회 · <span class="pendingWait">'+mins(m)+'분 대기</span></div></div>';
   if(!op)return '<div class="pendingPerson">'+info+'</div>';
   return '<div class="pendingPerson v27Slot"><button class="v27MemberMain" onclick="openPendingMember24(\''+pg.id+'\',\''+id+'\')">'+info+'</button><button class="v27Remove" aria-label="개인 게임대기로 이동" title="개인 게임대기로 이동" onclick="removePendingMember27(\''+pg.id+'\',\''+id+'\')">×</button></div>'
  }
  const canFill=op&&((S.queue?.length||0)>0||otherGroups27(pg.id).length>0);
  return canFill?'<button class="pendingEmptySlot" onclick="openPendingFill24(\''+pg.id+'\')">＋ '+label+'<br><span class="meta">개인대기/다른 조에서 선택</span></button>':'<div class="pendingEmptySlot">'+label+'<br><span class="meta">빈 자리</span></div>'
 }).join('');
 const start=ids.length===4?'<button class="btn pri" onclick="openCourtPicker(\'pending\',\''+pg.id+'\')">코트 선택 후 경기 시작</button>':'<button class="btn ghost" disabled>4명 완료 후 경기 시작</button>';
 return '<div class="card pendingCard"><div class="pendingHead"><b>편성대기 '+(i+1)+'조</b>'+tools+'</div><div class="pendingPlayers">'+slots+'</div><div class="pairSummary">'+(ids.length>=2?pairSummary(ids):'같이한 경기 비교는 2명 이상부터 표시됩니다.')+'</div>'+(ids.length<4?'<div class="partialNote">현재 '+ids.length+'명 편성 · ×를 누르면 개인 게임대기로 복귀하며 기존 대기시간은 계속 누적됩니다. 빈칸에는 개인 게임대기 또는 다른 편성대기 조 회원을 넣을 수 있습니다.</div>':'')+(op?'<div class="pendingActs">'+start+'<button class="btn ghost" onclick="cancelPending(\''+pg.id+'\')">편성 취소</button></div>':'')+'</div>'
};

function version27(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v27</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">편성대기 회원 × 개인대기 복귀 기능과 iPhone 대기조 이동 팝업 오류를 수정했습니다.</div>'
}
forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch(e){}location.replace('/?v=27&refresh='+Date.now())};
const renderBefore27=render;render=function(){renderBefore27();version27()};render();
})();
