(()=>{
const APP_VERSION='23';
const PENDING_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-swap';

const style=document.createElement('style');
style.textContent=`
.pendingEmptySlot{width:100%;min-height:58px;border:1px dashed #c5d0eb;background:#f8faff;border-radius:11px;color:#6f7e9b;font-weight:850;text-align:center;padding:9px}.pendingEmptySlot:active{background:#edf3ff}.pendingSlotLabel{display:inline-block;margin-left:5px;font-size:10px;color:#7c89a5;font-weight:850}.pendingWait{color:#2453d4;font-weight:850}.partialNote{font-size:11px;color:#8a5a19;background:#fff8e9;border-radius:10px;padding:8px 10px;margin-top:8px}.addPersonList{max-height:52vh;overflow:auto}.addPersonBtn{width:100%;border:1px solid #dbe3f8;background:#fff;border-radius:13px;padding:9px;display:grid;grid-template-columns:29px 1fr auto;gap:9px;align-items:center;text-align:left;margin-bottom:6px}.addPersonBtn:active{background:#f1f5ff}.repeatWarnList{margin:8px 0}.repeatWarnRow{display:flex;justify-content:space-between;gap:10px;padding:9px 10px;border:1px solid #ffd1d1;background:#fff7f7;border-radius:11px;margin-bottom:6px}.v23hint{font-size:11px;color:#627399;margin-top:7px;line-height:1.5}
`;
document.head.appendChild(style);

async function pendingReq23(body){
 const r=await fetch(PENDING_API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+T},body:JSON.stringify(body)});
 const x=await r.json().catch(()=>({error:'통신 오류'}));
 if(!r.ok){const e=new Error(x.error||'처리 중 오류가 발생했습니다.');e.payload=x;throw e}
 return x;
}

const oldQueueGame23=queueGame;
queueGame=async function(forceRepeat=false,players=null){
 const ps=players?[...players]:[...sel];
 if(ps.length===0)return alert('편성대기에 등록할 회원을 1명 이상 선택해주세요.');
 if(ps.length>=4)return oldQueueGame23(forceRepeat,ps.slice(0,4));
 if(!confirm('현재 '+ps.length+'명입니다.\n4명이 안 됐는데 편성대기로 등록하시겠습니까?'))return false;
 try{
  const x=await pendingReq23({mode:'create_partial',players:ps});
  useActionData(x);sel=[];repeatPlayers=[];recLabel='';document.querySelector('[data-v="queue"]')?.click();return true;
 }catch(e){alert(e.message);await load().catch(()=>{});return false}
};

function patchComposePreview23(){
 const done=$('previewDone');if(done){const n=Math.min(4,Array.isArray(sel)?sel.length:0);done.disabled=n===0;done.textContent=n>0&&n<4?'현재 '+n+'명으로 대기 등록':'편성 완료 · 대기 등록'}
 const guide=document.querySelector('.previewGuide');if(guide)guide.textContent='개인 게임대기에서 회원을 누르면 4칸에 차례대로 들어갑니다. 1~3명만 선택한 상태에서도 편성대기로 먼저 등록할 수 있습니다.';
}

function pendingPairSummary23(ids){
 let total=0,maxN=0,maxPair='';
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const n=pairCount(ids[i],ids[j]);total+=n;if(n>maxN){maxN=n;maxPair=(M(ids[i])?.name||'-')+'·'+(M(ids[j])?.name||'-')}}
 if(ids.length<2)return '같이한 경기 비교는 2명 이상부터 표시됩니다.';
 return total?(ids.length+'명 간 같이한 경기 합계 '+total+'회'+(maxN?' · 최다 '+maxPair+' '+maxN+'회':'')):(ids.length+'명은 서로 같이한 경기 기록이 없습니다.');
}
function slotName23(i){return i<2?'A팀 '+(i+1):'B팀 '+(i-1)}

let addPendingId23='';
function ensurePendingAddModal23(){
 if($('pendingAddModal23'))return;
 const m=document.createElement('div');m.id='pendingAddModal23';m.className='modal';
 m.innerHTML='<div class="sheet"><h3>편성대기 인원 추가</h3><div id="pendingAddDesc23" class="note"></div><div id="pendingAddList23" class="addPersonList"></div><button class="btn ghost" style="width:100%;margin-top:7px" onclick="closePendingAdd23()">취소</button></div>';
 m.addEventListener('click',e=>{if(e.target===m)closePendingAdd23()});document.body.appendChild(m);
}
window.closePendingAdd23=()=>{addPendingId23='';$('pendingAddModal23')?.classList.remove('on')};
window.openPendingAdd23=(pendingId)=>{
 if(!elev())return;const pg=S.pendingGames.find(g=>g.id===pendingId);if(!pg)return alert('편성대기 조를 찾을 수 없습니다.');
 if((pg.players||[]).length>=4)return alert('이미 4명 편성이 완료되었습니다.');
 const ids=[...(S.queue||[])].sort((a,b)=>{const ga=dailyCount(a),gb=dailyCount(b);if(ga!==gb)return ga-gb;const ma=M(a),mb=M(b),ja=Number(ma?.joinedAt||Number.MAX_SAFE_INTEGER),jb=Number(mb?.joinedAt||Number.MAX_SAFE_INTEGER);return ja!==jb?ja-jb:String(ma?.name||'').localeCompare(String(mb?.name||''),'ko')});
 if(!ids.length)return alert('추가할 개인 게임대기 회원이 없습니다.');
 ensurePendingAddModal23();addPendingId23=pendingId;
 $('pendingAddDesc23').innerHTML='현재 <b>'+pg.players.length+'/4명</b>입니다. 개인 게임대기 회원을 선택하면 기존 대기시간을 유지한 채 이 조에 추가됩니다.';
 $('pendingAddList23').innerHTML=ids.map(id=>{const m=M(id);return m?'<button class="addPersonBtn" onclick="addPendingMember23(\''+id+'\')">'+avatar(m,true)+'<div><b>'+m.name+'</b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(id)+'회 · <span class="pendingWait">'+mins(m)+'분 대기</span></div></div><span class="tag">추가</span></button>':''}).join('');
 $('pendingAddModal23').classList.add('on');
};

let repeatAdd23=null;
function ensureRepeatAddModal23(){
 if($('repeatAddModal23'))return;
 const m=document.createElement('div');m.id='repeatAddModal23';m.className='modal';
 m.innerHTML='<div class="sheet"><h3>반복 편성 확인</h3><div class="resetNote">이 회원을 추가하면 <b>서로 3회 이상 같이 경기한 조합</b>이 포함됩니다.</div><div id="repeatAddRows23" class="repeatWarnList"></div><div class="acts"><button class="btn ghost" onclick="retryAdd23()">다른 사람 선택</button><button class="btn ghost" onclick="recommendAdd23()">추천으로 선택</button><button class="btn pri" onclick="forceAdd23()">그대로 추가</button></div></div>';
 document.body.appendChild(m);
}
function showRepeatAdd23(pendingId,memberId,rows){
 ensureRepeatAddModal23();repeatAdd23={pendingId,memberId,rows};closePendingAdd23();
 $('repeatAddRows23').innerHTML=(rows||[]).map(r=>'<div class="repeatWarnRow"><b>'+r.aName+' · '+r.bName+'</b><strong>'+r.count+'회</strong></div>').join('');$('repeatAddModal23').classList.add('on');
}
window.retryAdd23=()=>{const p=repeatAdd23?.pendingId;repeatAdd23=null;$('repeatAddModal23')?.classList.remove('on');if(p)openPendingAdd23(p)};
window.forceAdd23=async()=>{if(!repeatAdd23)return;const c={...repeatAdd23};repeatAdd23=null;$('repeatAddModal23')?.classList.remove('on');await addPendingMember23(c.memberId,true,c.pendingId)};
window.recommendAdd23=async()=>{
 if(!repeatAdd23)return;const pendingId=repeatAdd23.pendingId,pg=S.pendingGames.find(g=>g.id===pendingId);repeatAdd23=null;$('repeatAddModal23')?.classList.remove('on');if(!pg)return;
 const candidates=[...(S.queue||[])];if(!candidates.length)return alert('추천할 개인 게임대기 회원이 없습니다.');
 const gradeV23={A:5,B:4,C:3,D:2,E:1};
 const score=id=>{let repeat=0;for(const p of pg.players||[])repeat+=pairCount(p,id);const m=M(id),games=dailyCount(id),wait=mins(m),grade=Math.abs((gradeV23[m?.cls]||1)-((pg.players||[]).reduce((n,p)=>n+(gradeV23[M(p)?.cls]||1),0)/Math.max(1,(pg.players||[]).length)));return repeat*100+games*12+grade*2-wait*.03};
 candidates.sort((a,b)=>score(a)-score(b));const best=candidates[0],m=M(best);if(!m)return;
 if(!confirm('새로운 조합을 우선해 '+m.name+'님을 추천했습니다.\n이 회원을 추가하시겠습니까?'))return openPendingAdd23(pendingId);
 await addPendingMember23(best,false,pendingId);
};
window.addPendingMember23=async(memberId,forceRepeat=false,pendingIdOverride='')=>{
 const pendingId=pendingIdOverride||addPendingId23;if(!pendingId)return;
 try{const x=await pendingReq23({mode:'add_to_pending',pendingId,queueMemberId:memberId,forceRepeat});useActionData(x);closePendingAdd23()}catch(e){if(e.payload?.warning==='repeat_pair'){showRepeatAdd23(pendingId,memberId,e.payload.repeatPairs||[]);return}alert(e.message);await load().catch(()=>{})}
};

cancelPending=async function(id){
 if(!confirm('이 편성을 취소하고 포함된 회원을 개인 게임대기로 돌릴까요?\n대기시간은 초기화되지 않고 그대로 이어집니다.'))return;
 try{const x=await pendingReq23({mode:'cancel_pending_preserve',pendingId:id});useActionData(x)}catch(e){alert(e.message);await load().catch(()=>{})}
};

pendingCard=function(pg,i){
 const ids=Array.isArray(pg.players)?pg.players:[],waited=Math.max(0,Math.floor((Date.now()-Number(pg.createdAt||Date.now()))/60000));
 const tools=elev()?'<div class="pendingTools"><button class="orderBtn" '+(i===0?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'up\')">↑ 위</button><button class="orderBtn" '+(i===S.pendingGames.length-1?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'down\')">↓ 아래</button><span class="tag">'+ids.length+'/4명</span></div>':'<span class="tag">'+ids.length+'/4명</span>';
 const canChange=elev()&&((S.pendingGames?.length||0)>1||(S.queue?.length||0)>0);
 const slots=Array.from({length:4},(_,j)=>{const id=ids[j],m=id?M(id):null;if(m){const inner=avatar(m,true)+'<div><b>'+m.name+(canChange?'<span class="changeHint">조변경</span>':'')+'<span class="pendingSlotLabel">'+slotName23(j)+'</span></b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(id)+'회 · <span class="pendingWait">'+mins(m)+'분 대기</span></div></div>';return elev()?'<button class="pendingPerson pendingPersonBtn" onclick="openPendingSwap(\''+pg.id+'\',\''+id+'\')">'+inner+'</button>':'<div class="pendingPerson">'+inner+'</div>'}
  return elev()&&S.queue.length?'<button class="pendingEmptySlot" onclick="openPendingAdd23(\''+pg.id+'\')">＋ '+slotName23(j)+'<br><span class="meta">개인 게임대기에서 추가</span></button>':'<div class="pendingEmptySlot">'+slotName23(j)+'<br><span class="meta">빈 자리</span></div>'}).join('');
 const start=ids.length===4?'<button class="btn pri" onclick="openCourtPicker(\'pending\',\''+pg.id+'\')">코트 선택 후 경기 시작</button>':'<button class="btn ghost" disabled>4명 완료 후 경기 시작</button>';
 return '<div class="card pendingCard"><div class="pendingHead"><b>편성대기 '+(i+1)+'조</b>'+tools+'</div><div class="pendingPlayers">'+slots+'</div><div class="pairSummary">'+pendingPairSummary23(ids)+'</div>'+(ids.length<4?'<div class="partialNote">현재 '+ids.length+'명 편성 · 빈 자리를 눌러 개인 게임대기 회원을 추가할 수 있습니다. 개인별 대기시간은 경기 시작 전까지 계속 누적됩니다.</div>':'')+(elev()?'<div class="pendingActs">'+start+'<button class="btn ghost" onclick="cancelPending(\''+pg.id+'\')">편성 취소</button></div>':'')+'</div>';
};

function updateVersion23(){
 const card=$('appVersionCard');if(!card)return;
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v'+APP_VERSION+'</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button><a class="btn ghost versionLink" href="/versions/">구버전 보기</a></div><div class="v23hint">편성대기 중 조 이동·교체·취소는 개인 대기시간을 초기화하지 않습니다. 실제 경기 종료 후 다시 대기할 때만 새로운 대기시간이 시작됩니다.</div>';
}
forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch(e){console.warn(e)}location.replace('/?v='+APP_VERSION+'&refresh='+Date.now())};

const renderBefore23=render;
render=function(){renderBefore23();patchComposePreview23();updateVersion23()};
render();
})();
