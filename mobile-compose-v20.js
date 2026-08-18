(()=>{
const APP_VERSION='20';

const st=document.createElement('style');
st.textContent=`
.pendingPersonBtn{width:100%;border:1px solid transparent;text-align:left;cursor:pointer;color:inherit}.pendingPersonBtn:active{background:#e9efff;border-color:#aebfea}.changeHint{display:inline-block;margin-left:5px;padding:2px 6px;border-radius:999px;background:#eaf0ff;color:#2453d4;font-size:10px;font-weight:900}.swapGroup{margin-bottom:12px}.swapGroupTitle{font-size:12px;font-weight:900;color:#5e6f90;margin:0 0 6px}.swapPerson{width:100%;border:1px solid #dbe3f8;background:#fff;border-radius:13px;padding:9px;display:grid;grid-template-columns:29px 1fr auto;gap:9px;align-items:center;text-align:left;margin-bottom:6px}.swapPerson:active{background:#f1f5ff}.sortNote{font-size:11px;color:#627399;margin:-4px 2px 10px}.versionRow{display:flex;align-items:center;justify-content:space-between;gap:10px}
`;
document.head.appendChild(st);

function addVersionCard(){
  if(document.getElementById('appVersionCard'))return;
  const settings=document.getElementById('settings');
  if(!settings)return;
  const card=document.createElement('div');
  card.id='appVersionCard';card.className='card';
  card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v'+APP_VERSION+'</div></div><span class="tag">최신화</span></div><button id="forceUpdateBtn" class="btn pri" style="width:100%;margin-top:12px" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button><div class="meta" style="margin-top:8px;line-height:1.55">화면이 이전 버전으로 보일 때 프로그램 캐시와 서비스워커를 초기화하고 최신 파일을 다시 불러옵니다. 로그인 정보와 회원·경기 데이터는 삭제되지 않습니다.</div>';
  const home=[...settings.querySelectorAll('.card')].find(x=>x.textContent.includes('홈 화면에 추가'));
  if(home)settings.insertBefore(card,home);else settings.appendChild(card);
}
window.forceUpdateApp=async()=>{
  const b=document.getElementById('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}
  try{
    if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}
    if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}
  }catch(e){console.warn(e)}
  location.replace('/?refresh='+Date.now());
};
addVersionCard();

function sortQueue(){
  if(!Array.isArray(S?.queue))return;
  S.queue=[...S.queue].sort((a,b)=>{
    const ga=dailyCount(a),gb=dailyCount(b);if(ga!==gb)return ga-gb;
    const ma=M(a),mb=M(b),ja=Number(ma?.joinedAt||Number.MAX_SAFE_INTEGER),jb=Number(mb?.joinedAt||Number.MAX_SAFE_INTEGER);
    if(ja!==jb)return ja-jb;
    return String(ma?.name||'').localeCompare(String(mb?.name||''),'ko');
  });
}

let swapFrom=null;
function ensureSwapModal(){
  if(document.getElementById('pendingSwapModal'))return;
  const modal=document.createElement('div');modal.id='pendingSwapModal';modal.className='modal';
  modal.innerHTML='<div class="sheet"><h3 id="swapTitle">대기조 변경</h3><div id="swapDesc" class="note"></div><div id="swapList"></div><button class="btn ghost" style="width:100%;margin-top:6px" onclick="closePendingSwap()">취소</button></div>';
  modal.addEventListener('click',e=>{if(e.target===modal)closePendingSwap()});document.body.appendChild(modal);
}
window.closePendingSwap=()=>{swapFrom=null;document.getElementById('pendingSwapModal')?.classList.remove('on')};
window.openPendingSwap=(pendingId,memberId)=>{
  if(!elev())return;
  const from=S.pendingGames.find(g=>g.id===pendingId),m=M(memberId);if(!from||!m)return;
  if(S.pendingGames.length<2)return alert('교체할 다른 편성대기 조가 없습니다.');
  ensureSwapModal();swapFrom={pendingId,memberId};
  const fromIdx=S.pendingGames.findIndex(g=>g.id===pendingId)+1;
  $('swapTitle').textContent=m.name+' · 대기조 변경';
  $('swapDesc').innerHTML='<b>편성대기 '+fromIdx+'조의 '+m.name+'</b>님과 교체할 다른 대기조 회원을 선택해주세요. 두 조의 인원이 서로 맞교환됩니다.';
  $('swapList').innerHTML=S.pendingGames.filter(g=>g.id!==pendingId).map(g=>{
    const gi=S.pendingGames.findIndex(x=>x.id===g.id)+1;
    return '<div class="swapGroup"><div class="swapGroupTitle">편성대기 '+gi+'조</div>'+(g.players||[]).map(id=>{const x=M(id);return x?'<button class="swapPerson" onclick="swapPendingTarget(\''+g.id+'\',\''+id+'\')">'+avatar(x,true)+'<div><b>'+x.name+'</b><div class="meta">'+x.age+x.cls+' · '+x.gender+' · 게임 '+dailyCount(id)+'회</div></div><span class="tag">교체</span></button>':''}).join('')+'</div>';
  }).join('');
  $('pendingSwapModal').classList.add('on');
};
window.swapPendingTarget=async(toPendingId,toMemberId)=>{
  if(!swapFrom)return;
  const a=M(swapFrom.memberId),b=M(toMemberId),ai=S.pendingGames.findIndex(g=>g.id===swapFrom.pendingId)+1,bi=S.pendingGames.findIndex(g=>g.id===toPendingId)+1;
  if(!confirm('편성대기 '+ai+'조의 '+(a?.name||'-')+'님과\n편성대기 '+bi+'조의 '+(b?.name||'-')+'님을 교체하시겠습니까?'))return;
  const ok=await action('swap_pending_players',{fromPendingId:swapFrom.pendingId,toPendingId,fromMemberId:swapFrom.memberId,toMemberId});
  if(ok)closePendingSwap();
};

pendingCard=function(pg,i){
  const ps=(pg.players||[]).map(M),waited=Math.max(0,Math.floor((Date.now()-Number(pg.createdAt||Date.now()))/60000));
  const tools=elev()?'<div class="pendingTools"><button class="orderBtn" '+(i===0?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'up\')">↑ 위</button><button class="orderBtn" '+(i===S.pendingGames.length-1?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'down\')">↓ 아래</button><span class="tag">'+waited+'분</span></div>':'<span class="tag">'+waited+'분</span>';
  const people=ps.map((m,j)=>{if(!m)return'';const inner=avatar(m,true)+'<div><b>'+m.name+(elev()&&S.pendingGames.length>1?'<span class="changeHint">조변경</span>':'')+'</b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(pg.players[j])+'회</div></div>';return elev()?'<button class="pendingPerson pendingPersonBtn" onclick="openPendingSwap(\''+pg.id+'\',\''+pg.players[j]+'\')">'+inner+'</button>':'<div class="pendingPerson">'+inner+'</div>'}).join('');
  return '<div class="card pendingCard"><div class="pendingHead"><b>편성대기 '+(i+1)+'조</b>'+tools+'</div><div class="pendingPlayers">'+people+'</div><div class="pairSummary">'+pairSummary(pg.players||[])+'</div>'+(elev()?'<div class="pendingActs"><button class="btn pri" onclick="openCourtPicker(\'pending\',\''+pg.id+'\')">코트 선택 후 경기 시작</button><button class="btn ghost" onclick="cancelPending(\''+pg.id+'\')">편성 취소</button></div>':'')+'</div>';
};

const baseRender=render;
render=function(){
  sortQueue();
  baseRender();
  addVersionCard();
  if($('queue')&&!document.getElementById('queueSortNote')){
    const n=document.createElement('div');n.id='queueSortNote';n.className='sortNote';n.textContent='개인 게임대기 순서: 오늘 게임횟수 적은 순 → 같은 횟수면 오래 기다린 순';
    const sub=[...$('queue').querySelectorAll('.subhead')].find(x=>x.textContent.includes('개인 게임대기'));if(sub)sub.insertAdjacentElement('afterend',n);
  }
};

chooseCourt=async function(court){
  if(!elev())return;
  if(courtMode==='pending'){
    const pg=S.pendingGames.find(g=>g.id===courtTarget);if(!pg)return alert('이미 처리된 편성입니다.');
    const names=(pg.players||[]).map(id=>M(id)?.name||'-').join(' · ');
    if(!confirm(courtLabel(court)+'에 해당 편성대기 게임을 배정하고 경기를 시작하시겠습니까?\n\n'+names))return;
    if(await action('begin_pending_game',{pendingId:courtTarget,court})){closeM('courtModal');document.querySelector('[data-v="playing"]').click()}
  }else if(courtMode==='game'){
    if(await action('set_game_court',{gameId:courtTarget,court}))closeM('courtModal');
  }
};

sortQueue();render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
})();
