(()=>{
const APP_VERSION='22';
const SWAP_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-swap';

const st=document.createElement('style');
st.textContent=`
.swapSection{margin:14px 0 6px}.swapSectionTitle{display:flex;align-items:center;justify-content:space-between;margin:0 2px 7px;font-size:12px;font-weight:900;color:#5e6f90}.swapSectionTitle .tag{margin-left:0}.ageAutoHint{font-size:10px;color:#2453d4;font-weight:800;margin-left:4px}
`;
document.head.appendChild(st);

function currentKstYear(){return Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric'}).format(new Date()))||new Date().getFullYear()}
function ageBandFromYear(year){
  const y=Number(year),now=currentKstYear();
  if(!Number.isInteger(y)||y<1900||y>now)return '';
  const age=Math.max(0,now-y);
  let band=Math.floor(age/10)*10;
  band=Math.max(20,Math.min(60,band));
  return String(band);
}
function syncAgeFromBirthYear(){
  const input=$('my'),age=$('ma');if(!input||!age)return;
  const band=ageBandFromYear(input.value);if(!band)return;
  if([...age.options].some(o=>o.value===band||o.textContent===band))age.value=band;
}
function setupAgeAuto(){
  const input=$('my');if(!input||input.dataset.ageAuto==='1')return;
  input.dataset.ageAuto='1';
  input.addEventListener('input',syncAgeFromBirthYear);
  input.addEventListener('change',syncAgeFromBirthYear);
  const label=input.closest('.field')?.querySelector('label');if(label&&!label.querySelector('.ageAutoHint'))label.insertAdjacentHTML('beforeend','<span class="ageAutoHint">연령대 자동설정</span>');
}
setupAgeAuto();

let swapFrom22=null;
function ensureSwapModal22(){
  let modal=$('pendingSwapModal');
  if(!modal){modal=document.createElement('div');modal.id='pendingSwapModal';modal.className='modal';modal.innerHTML='<div class="sheet"><h3 id="swapTitle">대기조 변경</h3><div id="swapDesc" class="note"></div><div id="swapList"></div><button class="btn ghost" style="width:100%;margin-top:6px" onclick="closePendingSwap()">취소</button></div>';modal.addEventListener('click',e=>{if(e.target===modal)closePendingSwap()});document.body.appendChild(modal)}
}
window.closePendingSwap=()=>{swapFrom22=null;$('pendingSwapModal')?.classList.remove('on')};
function sortedQueueForSwap(){return [...(S.queue||[])].sort((a,b)=>{const ga=dailyCount(a),gb=dailyCount(b);if(ga!==gb)return ga-gb;const ma=M(a),mb=M(b),ja=Number(ma?.joinedAt||Number.MAX_SAFE_INTEGER),jb=Number(mb?.joinedAt||Number.MAX_SAFE_INTEGER);if(ja!==jb)return ja-jb;return String(ma?.name||'').localeCompare(String(mb?.name||''),'ko')})}
window.openPendingSwap=(pendingId,memberId)=>{
  if(!elev())return;
  const from=S.pendingGames.find(g=>g.id===pendingId),m=M(memberId);if(!from||!m)return;
  const queueIds=sortedQueueForSwap();
  if(S.pendingGames.length<2&&queueIds.length===0)return alert('교체할 다른 편성대기 회원이나 개인 게임대기 회원이 없습니다.');
  ensureSwapModal22();swapFrom22={pendingId,memberId};
  const fromIdx=S.pendingGames.findIndex(g=>g.id===pendingId)+1;
  $('swapTitle').textContent=m.name+' · 대기조 변경';
  $('swapDesc').innerHTML='<b>편성대기 '+fromIdx+'조의 '+m.name+'</b>님을 다른 편성대기 조 회원 또는 개인 게임대기 회원과 교체할 수 있습니다.';
  let html='';
  const others=S.pendingGames.filter(g=>g.id!==pendingId);
  if(others.length){html+='<div class="swapSection"><div class="swapSectionTitle"><span>다른 편성대기 조</span><span class="tag">맞교환</span></div>'+others.map(g=>{const gi=S.pendingGames.findIndex(x=>x.id===g.id)+1;return '<div class="swapGroup"><div class="swapGroupTitle">편성대기 '+gi+'조</div>'+(g.players||[]).map(id=>{const x=M(id);return x?'<button class="swapPerson" onclick="swapPendingTarget22(\''+g.id+'\',\''+id+'\')">'+avatar(x,true)+'<div><b>'+x.name+'</b><div class="meta">'+x.age+x.cls+' · '+x.gender+' · 게임 '+dailyCount(id)+'회</div></div><span class="tag">교체</span></button>':''}).join('')+'</div>'}).join('')+'</div>'}
  if(queueIds.length){html+='<div class="swapSection"><div class="swapSectionTitle"><span>개인 게임대기</span><span class="tag">'+queueIds.length+'명</span></div>'+queueIds.map(id=>{const x=M(id);return x?'<button class="swapPerson" onclick="swapPendingQueue22(\''+id+'\')">'+avatar(x,true)+'<div><b>'+x.name+'</b><div class="meta">'+x.age+x.cls+' · '+x.gender+' · 게임 '+dailyCount(id)+'회 · '+mins(x)+'분 대기</div></div><span class="tag">교체</span></button>':''}).join('')+'</div>'}
  $('swapList').innerHTML=html;
  $('pendingSwapModal').classList.add('on');
};
window.swapPendingTarget22=async(toPendingId,toMemberId)=>{
  if(!swapFrom22)return;
  const a=M(swapFrom22.memberId),b=M(toMemberId),ai=S.pendingGames.findIndex(g=>g.id===swapFrom22.pendingId)+1,bi=S.pendingGames.findIndex(g=>g.id===toPendingId)+1;
  if(!confirm('편성대기 '+ai+'조의 '+(a?.name||'-')+'님과\n편성대기 '+bi+'조의 '+(b?.name||'-')+'님을 교체하시겠습니까?'))return;
  const ok=await action('swap_pending_players',{fromPendingId:swapFrom22.pendingId,toPendingId,fromMemberId:swapFrom22.memberId,toMemberId});if(ok)closePendingSwap();
};
async function queueSwapReq(body){
  const r=await fetch(SWAP_API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+T},body:JSON.stringify(body)});
  const x=await r.json().catch(()=>({error:'통신 오류'}));if(!r.ok)throw new Error(x.error||'교체 중 오류가 발생했습니다.');return x;
}
window.swapPendingQueue22=async(queueMemberId)=>{
  if(!swapFrom22)return;
  const a=M(swapFrom22.memberId),b=M(queueMemberId),ai=S.pendingGames.findIndex(g=>g.id===swapFrom22.pendingId)+1;
  if(!confirm('편성대기 '+ai+'조의 '+(a?.name||'-')+'님과\n개인 게임대기의 '+(b?.name||'-')+'님을 교체하시겠습니까?\n\n'+(a?.name||'-')+'님은 개인 게임대기로 이동합니다.'))return;
  try{const x=await queueSwapReq({pendingId:swapFrom22.pendingId,fromMemberId:swapFrom22.memberId,queueMemberId});useActionData(x);closePendingSwap()}catch(e){alert(e.message);await load().catch(()=>{})}
};

pendingCard=function(pg,i){
  const ps=(pg.players||[]).map(M),waited=Math.max(0,Math.floor((Date.now()-Number(pg.createdAt||Date.now()))/60000));
  const tools=elev()?'<div class="pendingTools"><button class="orderBtn" '+(i===0?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'up\')">↑ 위</button><button class="orderBtn" '+(i===S.pendingGames.length-1?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'down\')">↓ 아래</button><span class="tag">'+waited+'분</span></div>':'<span class="tag">'+waited+'분</span>';
  const canChange=elev()&&((S.pendingGames?.length||0)>1||(S.queue?.length||0)>0);
  const people=ps.map((m,j)=>{if(!m)return'';const inner=avatar(m,true)+'<div><b>'+m.name+(canChange?'<span class="changeHint">조변경</span>':'')+'</b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(pg.players[j])+'회</div></div>';return elev()?'<button class="pendingPerson pendingPersonBtn" onclick="openPendingSwap(\''+pg.id+'\',\''+pg.players[j]+'\')">'+inner+'</button>':'<div class="pendingPerson">'+inner+'</div>'}).join('');
  return '<div class="card pendingCard"><div class="pendingHead"><b>편성대기 '+(i+1)+'조</b>'+tools+'</div><div class="pendingPlayers">'+people+'</div><div class="pairSummary">'+pairSummary(pg.players||[])+'</div>'+(elev()?'<div class="pendingActs"><button class="btn pri" onclick="openCourtPicker(\'pending\',\''+pg.id+'\')">코트 선택 후 경기 시작</button><button class="btn ghost" onclick="cancelPending(\''+pg.id+'\')">편성 취소</button></div>':'')+'</div>';
};

function updateVersion22(){
  const card=$('appVersionCard');if(!card)return;
  card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v'+APP_VERSION+'</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button><a class="btn ghost versionLink" href="/versions/">구버전 보기</a></div><div class="meta" style="margin-top:8px;line-height:1.55">v21 이전 운영본은 별도 보관되어 있으며 언제든지 버전 보관함에서 열 수 있습니다.</div>';
}
window.forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch(e){console.warn(e)}location.replace('/?v='+APP_VERSION+'&refresh='+Date.now())};

const prevRender22=render;
render=function(){prevRender22();setupAgeAuto();updateVersion22()};
render();
})();
