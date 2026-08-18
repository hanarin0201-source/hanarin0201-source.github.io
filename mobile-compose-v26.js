(()=>{
const APP_VERSION='26';
const MOVE_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v25-move';
let moveCtx26=null;

const css=document.createElement('style');
css.textContent=`.v26Group{margin:12px 0}.v26GroupTitle{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:900;color:#5e6f90;margin:0 2px 6px}.v26Person{width:100%;border:1px solid #dbe3f8;background:#fff;border-radius:13px;padding:9px;display:grid;grid-template-columns:29px 1fr auto;gap:9px;align-items:center;text-align:left;margin-bottom:6px}.v26Person:active{background:#f1f5ff}.v26Warn{font-size:10px;color:#ad6813;font-weight:900;margin-left:5px}.v26RepeatRow{display:flex;justify-content:space-between;gap:8px;padding:9px 10px;border:1px solid #ffd1d1;background:#fff7f7;border-radius:11px;margin-bottom:6px}`;
document.head.appendChild(css);

const op26=()=>typeof window.gameOp24==='function'&&window.gameOp24();
function groupNo26(id){return (S.pendingGames||[]).findIndex(g=>g.id===id)+1}
function sortedQueue26(){return [...(S.queue||[])].sort((a,b)=>{const ga=dailyCount(a),gb=dailyCount(b);if(ga!==gb)return ga-gb;const ma=M(a),mb=M(b),ja=Number(ma?.joinedAt||Number.MAX_SAFE_INTEGER),jb=Number(mb?.joinedAt||Number.MAX_SAFE_INTEGER);return ja!==jb?ja-jb:String(ma?.name||'').localeCompare(String(mb?.name||''),'ko')})}
function otherGroups26(targetId){return (S.pendingGames||[]).filter(g=>g.id!==targetId&&Array.isArray(g.players)&&g.players.length>0)}
function partialDest26(sourceId){return (S.pendingGames||[]).filter(g=>g.id!==sourceId&&Array.isArray(g.players)&&g.players.length>0&&g.players.length<4)}
function score26(targetId,id){const t=(S.pendingGames||[]).find(g=>g.id===targetId);if(!t)return 1e9;let repeat=0;for(const p of t.players||[])repeat+=pairCount(p,id);return repeat*100+dailyCount(id)*10-mins(M(id))*.03}
async function moveReq26(body){const r=await fetch(MOVE_API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+T},body:JSON.stringify(body)});const x=await r.json().catch(()=>({error:'통신 오류'}));if(!r.ok){const e=new Error(x.error||'이동 중 오류가 발생했습니다.');e.payload=x;throw e}return x}

function ensureFillModal26(){
 if($('pendingFillModal26'))return;
 const m=document.createElement('div');m.id='pendingFillModal26';m.className='modal';
 m.innerHTML='<div class="sheet"><h3 id="fillTitle26">빈자리 채우기</h3><div id="fillDesc26" class="note"></div><div id="fillList26"></div><button class="btn ghost" style="width:100%;margin-top:7px" onclick="closeM(\'pendingFillModal26\')">취소</button></div>';
 m.addEventListener('click',e=>{if(e.target===m)closeM('pendingFillModal26')});document.body.appendChild(m)
}
function ensureMemberModal26(){
 if($('pendingMemberModal26'))return;
 const m=document.createElement('div');m.id='pendingMemberModal26';m.className='modal';
 m.innerHTML='<div class="sheet"><h3 id="memberMoveTitle26">대기조 변경</h3><div id="memberMoveDesc26" class="note"></div><div id="memberMoveList26"></div><button class="btn ghost" style="width:100%;margin-top:7px" onclick="closeM(\'pendingMemberModal26\')">취소</button></div>';
 m.addEventListener('click',e=>{if(e.target===m)closeM('pendingMemberModal26')});document.body.appendChild(m)
}
function ensureRepeatModal26(){
 if($('moveRepeatModal26'))return;
 const m=document.createElement('div');m.id='moveRepeatModal26';m.className='modal';
 m.innerHTML='<div class="sheet"><h3>반복 편성 확인</h3><div class="resetNote">이 이동으로 <b>3회 이상 같이 경기한 조합</b>이 포함됩니다.</div><div id="moveRepeatRows26"></div><div class="acts"><button class="btn ghost" onclick="retryMove26()">다른 사람 선택</button><button class="btn ghost" onclick="recommendMove26()">추천 후보 보기</button><button class="btn pri" onclick="forceMove26()">그대로 진행</button></div></div>';
 document.body.appendChild(m)
}
function showRepeat26(ctx,rows){moveCtx26=ctx;ensureRepeatModal26();$('moveRepeatRows26').innerHTML=(rows||[]).map(r=>'<div class="v26RepeatRow"><b>'+r.aName+' · '+r.bName+'</b><strong>'+r.count+'회</strong></div>').join('');closeM('pendingFillModal26');closeM('pendingMemberModal26');$('moveRepeatModal26').classList.add('on')}
window.retryMove26=()=>{const c=moveCtx26;moveCtx26=null;closeM('moveRepeatModal26');if(c)window.openPendingFill24(c.targetId)};
window.recommendMove26=()=>{const c=moveCtx26;moveCtx26=null;closeM('moveRepeatModal26');if(c)window.openPendingFill24(c.targetId,true)};
window.forceMove26=async()=>{const c=moveCtx26;moveCtx26=null;closeM('moveRepeatModal26');if(c)await window.movePendingMember26(c.targetId,c.sourceId,c.memberId,true)};

window.movePendingMember26=async(targetId,sourceId,memberId,force=false)=>{
 if(!op26())return;
 const source=(S.pendingGames||[]).find(g=>g.id===sourceId),target=(S.pendingGames||[]).find(g=>g.id===targetId),m=M(memberId);
 if(!source||!target||!m)return alert('대기조 또는 회원 정보가 변경되었습니다. 화면을 다시 확인해주세요.');
 if((target.players||[]).length>=4)return alert('이동할 대기조에 빈자리가 없습니다.');
 const sourceNo=groupNo26(sourceId),targetNo=groupNo26(targetId),sourceAfter=Math.max(0,(source.players||[]).length-1);
 if(!force){const note=sourceAfter===0?'이동 후 기존 '+sourceNo+'조는 비어 자동 삭제됩니다.':'이동 후 기존 '+sourceNo+'조는 '+sourceAfter+'명 편성으로 남습니다.';if(!confirm(m.name+'님을 편성대기 '+sourceNo+'조 → '+targetNo+'조 빈자리로 이동하시겠습니까?\n\n'+note))return}
 try{const x=await moveReq26({sourcePendingId:sourceId,targetPendingId:targetId,memberId,forceRepeat:force});useActionData(x);closeM('pendingFillModal26');closeM('pendingMemberModal26')}
 catch(e){if(e.payload?.warning==='repeat_pair')return showRepeat26({targetId,sourceId,memberId},e.payload.repeatPairs||[]);alert(e.message);await load().catch(()=>{})}
};
window.addQueueToPending26=async(targetId,id)=>{if(!op26())return;closeM('pendingFillModal26');await window.fillFromQueue24(targetId,id)};
window.swapQueue26=async(sourceId,fromId,queueId)=>{if(!op26())return;closeM('pendingMemberModal26');await window.swapQueue24(sourceId,fromId,queueId)};
window.swapPending26=async(sourceId,fromId,targetId,toId)=>{if(!op26())return;closeM('pendingMemberModal26');await window.swapPending24(sourceId,fromId,targetId,toId)};

window.openPendingFill24=function(targetId,recommended=false){
 if(!op26())return;
 const target=(S.pendingGames||[]).find(g=>g.id===targetId);if(!target)return alert('편성대기 조를 찾을 수 없습니다.');if((target.players||[]).length>=4)return alert('이미 4명 편성이 완료되었습니다.');
 ensureFillModal26();const q=sortedQueue26(),groups=otherGroups26(targetId);$('fillTitle26').textContent='편성대기 '+groupNo26(targetId)+'조 · 빈자리 채우기';$('fillDesc26').innerHTML='개인 게임대기 또는 <b>다른 모든 편성대기 조(1~4명)</b>에서 회원을 선택해 빈자리를 채울 수 있습니다. 대기시간은 유지됩니다.';
 let html='';
 if(q.length){const qq=recommended?[...q].sort((a,b)=>score26(targetId,a)-score26(targetId,b)):q;html+='<div class="v26Group"><div class="v26GroupTitle"><span>개인 게임대기</span><span class="tag">'+q.length+'명</span></div>'+qq.map((id,i)=>{const x=M(id);return x?'<button class="v26Person '+(recommended&&i===0?'recommended24':'')+'" onclick="addQueueToPending26(\''+targetId+'\',\''+id+'\')">'+avatar(x,true)+'<div><b>'+x.name+(recommended&&i===0?'<span class="tempBadge24">추천</span>':'')+'</b><div class="meta">게임 '+dailyCount(id)+'회 · '+mins(x)+'분 대기</div></div><span class="tag">넣기</span></button>':''}).join('')+'</div>'}
 if(groups.length){let entries=[];groups.forEach(g=>(g.players||[]).forEach(id=>entries.push({g,id,score:score26(targetId,id)})));if(recommended)entries.sort((a,b)=>a.score-b.score);html+='<div class="v26Group"><div class="v26GroupTitle"><span>다른 편성대기 조에서 이동</span><span class="tag">'+groups.length+'조</span></div>'+entries.map((z,i)=>{const x=M(z.id),n=(z.g.players||[]).length;return x?'<button class="v26Person '+(recommended&&q.length===0&&i===0?'recommended24':'')+'" onclick="movePendingMember26(\''+targetId+'\',\''+z.g.id+'\',\''+z.id+'\')">'+avatar(x,true)+'<div><b>'+x.name+(n===1?'<span class="v26Warn">이동 후 조 삭제</span>':'')+'</b><div class="meta">편성대기 '+groupNo26(z.g.id)+'조 · '+n+'/4명 · '+mins(x)+'분 대기</div></div><span class="tag">이동</span></button>':''}).join('')+'</div>'}
 $('fillList26').innerHTML=html||'<div class="empty">선택 가능한 회원이 없습니다.</div>';$('pendingFillModal26').classList.add('on')
};

window.openPendingMember24=function(sourceId,id){
 if(!op26())return;
 const source=(S.pendingGames||[]).find(g=>g.id===sourceId),m=M(id);if(!source||!m)return alert('대기조 또는 회원 정보를 찾을 수 없습니다.');
 ensureMemberModal26();$('memberMoveTitle26').textContent=m.name+' · 대기조 변경';$('memberMoveDesc26').innerHTML='현재 조 인원수와 관계없이 <b>다른 1~3명 편성대기 조의 빈자리</b>로 이동하거나 개인 게임대기/다른 대기조 회원과 교체할 수 있습니다. 대기시간은 유지됩니다.';
 let html='';const dest=partialDest26(sourceId);
 if(dest.length){html+='<div class="v26Group"><div class="v26GroupTitle"><span>빈자리 있는 대기조로 이동</span><span class="tag">'+dest.length+'조</span></div>'+dest.map(g=>'<button class="moveDest24" onclick="movePendingMember26(\''+g.id+'\',\''+sourceId+'\',\''+id+'\')"><b>편성대기 '+groupNo26(g.id)+'조 · '+(g.players||[]).length+'/4명</b><div class="meta">'+((g.players||[]).map(x=>M(x)?.name||'-').join(' · ')||'빈 조')+' · 빈자리 '+(4-(g.players||[]).length)+'칸</div></button>').join('')+'</div>'}
 const q=sortedQueue26();if(q.length){html+='<div class="v26Group"><div class="v26GroupTitle"><span>개인 게임대기와 교체</span><span class="tag">'+q.length+'명</span></div>'+q.map(qid=>{const x=M(qid);return x?'<button class="v26Person" onclick="swapQueue26(\''+sourceId+'\',\''+id+'\',\''+qid+'\')">'+avatar(x,true)+'<div><b>'+x.name+'</b><div class="meta">게임 '+dailyCount(qid)+'회 · '+mins(x)+'분 대기</div></div><span class="tag">교체</span></button>':''}).join('')+'</div>'}
 const other=(S.pendingGames||[]).filter(g=>g.id!==sourceId&&Array.isArray(g.players)&&g.players.length>0);if(other.length){html+='<div class="v26Group"><div class="v26GroupTitle"><span>다른 편성대기 조와 맞교환</span></div>'+other.map(g=>'<div style="margin-bottom:9px"><div class="meta" style="font-weight:900;margin-bottom:5px">편성대기 '+groupNo26(g.id)+'조 · '+(g.players||[]).length+'/4명</div>'+(g.players||[]).map(oid=>{const x=M(oid);return x?'<button class="v26Person" onclick="swapPending26(\''+sourceId+'\',\''+id+'\',\''+g.id+'\',\''+oid+'\')">'+avatar(x,true)+'<div><b>'+x.name+'</b><div class="meta">'+mins(x)+'분 대기</div></div><span class="tag">맞교환</span></button>':''}).join('')+'</div>').join('')+'</div>'}
 $('memberMoveList26').innerHTML=html||'<div class="empty">변경 가능한 대상이 없습니다.</div>';$('pendingMemberModal26').classList.add('on')
};

window.pendingCard=function(pg,i){
 const ids=Array.isArray(pg.players)?pg.players:[],op=op26();
 const tools=op?'<div class="pendingTools"><button class="orderBtn" '+(i===0?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'up\')">↑ 위</button><button class="orderBtn" '+(i===S.pendingGames.length-1?'disabled':'')+' onclick="movePending(\''+pg.id+'\',\'down\')">↓ 아래</button><span class="tag">'+ids.length+'/4명</span></div>':'<span class="tag">'+ids.length+'/4명</span>';
 const canChange=op&&((S.queue?.length||0)>0||otherGroups26(pg.id).length>0);
 const slots=Array.from({length:4},(_,j)=>{const id=ids[j],m=id?M(id):null,label=j<2?'A팀 '+(j+1):'B팀 '+(j-1);if(m){const inner=avatar(m,true)+'<div><b>'+m.name+(canChange?'<span class="changeHint">이동/변경</span>':'')+'<span class="pendingSlotLabel">'+label+'</span></b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(id)+'회 · <span class="pendingWait">'+mins(m)+'분 대기</span></div></div>';return op?'<button class="pendingPerson pendingPersonBtn" onclick="openPendingMember24(\''+pg.id+'\',\''+id+'\')">'+inner+'</button>':'<div class="pendingPerson">'+inner+'</div>'}const canFill=op&&((S.queue?.length||0)>0||otherGroups26(pg.id).length>0);return canFill?'<button class="pendingEmptySlot" onclick="openPendingFill24(\''+pg.id+'\')">＋ '+label+'<br><span class="meta">개인대기/다른 조에서 선택</span></button>':'<div class="pendingEmptySlot">'+label+'<br><span class="meta">빈 자리</span></div>'}).join('');
 const start=ids.length===4?'<button class="btn pri" onclick="openCourtPicker(\'pending\',\''+pg.id+'\')">코트 선택 후 경기 시작</button>':'<button class="btn ghost" disabled>4명 완료 후 경기 시작</button>';
 return '<div class="card pendingCard"><div class="pendingHead"><b>편성대기 '+(i+1)+'조</b>'+tools+'</div><div class="pendingPlayers">'+slots+'</div><div class="pairSummary">'+(ids.length>=2?pairSummary(ids):'같이한 경기 비교는 2명 이상부터 표시됩니다.')+'</div>'+(ids.length<4?'<div class="partialNote">현재 '+ids.length+'명 편성 · 빈칸을 누르면 개인 게임대기 또는 다른 1~4명 편성대기 조에서 회원을 넣을 수 있습니다.</div>':'')+(op?'<div class="pendingActs">'+start+'<button class="btn ghost" onclick="cancelPending(\''+pg.id+'\')">편성 취소</button></div>':'')+'</div>'
};

function version26(){const card=$('appVersionCard');if(!card)return;const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v26</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">편성대기 회원/빈자리 클릭 오류를 수정하고 모든 대기조 간 자유 이동을 복구했습니다.</div>'}
forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch(e){}location.replace('/?v=26&refresh='+Date.now())};
const renderBefore26=render;render=function(){renderBefore26();version26()};render();
})();
