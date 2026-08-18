(()=>{
const APP_VERSION='25';
const MOVE_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v25-move';
let moveCtx25=null;

const css=document.createElement('style');
css.textContent=`.v25Group{margin:12px 0}.v25GroupTitle{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:900;color:#5e6f90;margin:0 2px 6px}.v25Person{width:100%;border:1px solid #dbe3f8;background:#fff;border-radius:13px;padding:9px;display:grid;grid-template-columns:29px 1fr auto;gap:9px;align-items:center;text-align:left;margin-bottom:6px}.v25Person:active{background:#f1f5ff}.v25Warn{font-size:10px;color:#ad6813;font-weight:900;margin-left:5px}.v25RepeatRow{display:flex;justify-content:space-between;gap:8px;padding:9px 10px;border:1px solid #ffd1d1;background:#fff7f7;border-radius:11px;margin-bottom:6px}`;
document.head.appendChild(css);

function otherGroups25(targetId){return (S.pendingGames||[]).filter(g=>g.id!==targetId&&Array.isArray(g.players)&&g.players.length>0)}
function partialDest25(sourceId){return (S.pendingGames||[]).filter(g=>g.id!==sourceId&&Array.isArray(g.players)&&g.players.length<4)}
function no25(id){return S.pendingGames.findIndex(g=>g.id===id)+1}
function score25(targetId,id){const t=S.pendingGames.find(g=>g.id===targetId);if(!t)return 1e9;let repeat=0;for(const p of t.players||[])repeat+=pairCount(p,id);return repeat*100+dailyCount(id)*10-mins(M(id))*.03}
async function moveReq25(body){const r=await fetch(MOVE_API,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+T},body:JSON.stringify(body)});const x=await r.json().catch(()=>({error:'통신 오류'}));if(!r.ok){const e=new Error(x.error||'이동 중 오류가 발생했습니다.');e.payload=x;throw e}return x}

function ensureRepeat25(){if($('moveRepeat25'))return;const m=document.createElement('div');m.id='moveRepeat25';m.className='modal';m.innerHTML='<div class="sheet"><h3>반복 편성 확인</h3><div class="resetNote">이 이동으로 <b>3회 이상 같이 경기한 조합</b>이 포함됩니다.</div><div id="moveRepeatRows25"></div><div class="acts"><button class="btn ghost" onclick="retryMove25()">다른 사람 선택</button><button class="btn ghost" onclick="recommendMove25()">추천 후보 보기</button><button class="btn pri" onclick="forceMove25()">그대로 진행</button></div></div>';document.body.appendChild(m)}
function showRepeat25(ctx,rows){moveCtx25=ctx;ensureRepeat25();$('moveRepeatRows25').innerHTML=(rows||[]).map(r=>'<div class="v25RepeatRow"><b>'+r.aName+' · '+r.bName+'</b><strong>'+r.count+'회</strong></div>').join('');closeM('pendingFillModal24');closeM('pendingMemberModal24');$('moveRepeat25').classList.add('on')}
window.retryMove25=()=>{const c=moveCtx25;moveCtx25=null;closeM('moveRepeat25');if(c)openPendingFill24(c.targetId)};
window.recommendMove25=()=>{const c=moveCtx25;moveCtx25=null;closeM('moveRepeat25');if(c)openPendingFill24(c.targetId,true)};
window.forceMove25=async()=>{const c=moveCtx25;moveCtx25=null;closeM('moveRepeat25');if(c)await movePendingMember25(c.targetId,c.sourceId,c.memberId,true)};

window.movePendingMember25=async(targetId,sourceId,memberId,force=false)=>{
 const source=S.pendingGames.find(g=>g.id===sourceId),target=S.pendingGames.find(g=>g.id===targetId),m=M(memberId);if(!source||!target||!m)return alert('대기조 또는 회원 정보가 변경되었습니다. 화면을 다시 확인해주세요.');
 const sourceNo=no25(sourceId),targetNo=no25(targetId),sourceAfter=Math.max(0,(source.players||[]).length-1);
 if(!force){const note=sourceAfter===0?'이동 후 기존 '+sourceNo+'조는 비어 자동 삭제됩니다.':'이동 후 기존 '+sourceNo+'조는 '+sourceAfter+'명 편성으로 남습니다.';if(!confirm(m.name+'님을 편성대기 '+sourceNo+'조 → '+targetNo+'조 빈자리로 이동하시겠습니까?\n\n'+note))return}
 try{const x=await moveReq25({sourcePendingId:sourceId,targetPendingId:targetId,memberId,forceRepeat:force});useActionData(x);closeM('pendingFillModal24');closeM('pendingMemberModal24')}catch(e){if(e.payload?.warning==='repeat_pair')return showRepeat25({targetId,sourceId,memberId},e.payload.repeatPairs||[]);alert(e.message);await load().catch(()=>{})}
};

openPendingFill24=function(targetId,recommended=false){
 if(!gameOp24())return;const target=S.pendingGames.find(g=>g.id===targetId);if(!target)return alert('편성대기 조를 찾을 수 없습니다.');if((target.players||[]).length>=4)return alert('이미 4명 편성이 완료되었습니다.');ensureFillModal24();
 const q=sortedQueue24(),groups=otherGroups25(targetId);$('fillTitle24').textContent='편성대기 '+no25(targetId)+'조 · 빈자리 채우기';$('fillDesc24').innerHTML='개인 게임대기 또는 <b>다른 모든 편성대기 조(1~4명)</b>에서 회원을 자유롭게 이동할 수 있습니다. 대기시간은 유지됩니다.';
 let html='';if(q.length){const qq=recommended?[...q].sort((a,b)=>score25(targetId,a)-score25(targetId,b)):q;html+='<div class="v25Group"><div class="v25GroupTitle"><span>개인 게임대기</span><span class="tag">'+q.length+'명</span></div>'+qq.map((id,i)=>{const x=M(id);return x?'<button class="v25Person '+(recommended&&i===0?'recommended24':'')+'" onclick="fillFromQueue24(\''+targetId+'\',\''+id+'\')">'+avatar(x,true)+'<div><b>'+x.name+(recommended&&i===0?'<span class="tempBadge24">추천</span>':'')+'</b><div class="meta">게임 '+dailyCount(id)+'회 · '+mins(x)+'분 대기</div></div><span class="tag">넣기</span></button>':''}).join('')+'</div>'}
 if(groups.length){let entries=[];groups.forEach(g=>(g.players||[]).forEach(id=>entries.push({g,id,score:score25(targetId,id)})));if(recommended)entries.sort((a,b)=>a.score-b.score);html+='<div class="v25Group"><div class="v25GroupTitle"><span>다른 편성대기 조에서 이동</span><span class="tag">'+groups.length+'조</span></div>'+entries.map((z,i)=>{const x=M(z.id),n=(z.g.players||[]).length;return x?'<button class="v25Person '+(recommended&&q.length===0&&i===0?'recommended24':'')+'" onclick="movePendingMember25(\''+targetId+'\',\''+z.g.id+'\',\''+z.id+'\')">'+avatar(x,true)+'<div><b>'+x.name+(n===1?'<span class="v25Warn">이동 후 조 삭제</span>':'')+'</b><div class="meta">편성대기 '+no25(z.g.id)+'조 · '+n+'/4명 · '+mins(x)+'분 대기</div></div><span class="tag">이동</span></button>':''}).join('')+'</div>'}
 $('fillList24').innerHTML=html||'<div class="empty">선택 가능한 회원이 없습니다.</div>';$('pendingFillModal24').classList.add('on')
};

openPendingMember24=function(sourceId,id){
 if(!gameOp24())return;const source=S.pendingGames.find(g=>g.id===sourceId),m=M(id);if(!source||!m)return;ensureMemberModal24();$('memberMoveTitle24').textContent=m.name+' · 대기조 변경';$('memberMoveDesc24').innerHTML='현재 조 인원수와 관계없이 <b>다른 1~3명 편성대기 조의 빈자리</b>로 이동할 수 있습니다. 대기시간은 유지됩니다.';
 let html='';const dest=partialDest25(sourceId);if(dest.length){html+='<div class="v25Group"><div class="v25GroupTitle"><span>빈자리 있는 대기조로 이동</span><span class="tag">'+dest.length+'조</span></div>'+dest.map(g=>'<button class="moveDest24" onclick="movePendingMember25(\''+g.id+'\',\''+sourceId+'\',\''+id+'\')"><b>편성대기 '+no25(g.id)+'조 · '+(g.players||[]).length+'/4명</b><div class="meta">'+((g.players||[]).map(x=>M(x)?.name||'-').join(' · ')||'현재 빈 조')+' · 빈자리 '+(4-(g.players||[]).length)+'칸</div></button>').join('')+'</div>'}
 const q=sortedQueue24();if(q.length){html+='<div class="v25Group"><div class="v25GroupTitle"><span>개인 게임대기와 교체</span></div>'+q.map(qid=>{const x=M(qid);return x?'<button class="v25Person" onclick="swapQueue24(\''+sourceId+'\',\''+id+'\',\''+qid+'\')">'+avatar(x,true)+'<div><b>'+x.name+'</b><div class="meta">게임 '+dailyCount(qid)+'회 · '+mins(x)+'분 대기</div></div><span class="tag">교체</span></button>':''}).join('')+'</div>'}
 $('memberMoveList24').innerHTML=html||'<div class="empty">변경 가능한 대상이 없습니다.</div>';$('pendingMemberModal24').classList.add('on')
};

const oldPending25=pendingCard;
pendingCard=function(pg,i){const html=oldPending25(pg,i);return html.replaceAll('대기/4인조에서 선택','개인대기/다른 조에서 선택').replaceAll('개인 게임대기 또는 다른 4인 편성완료 조에서 회원을 넣을 수 있습니다.','개인 게임대기 또는 다른 1~4명 편성대기 조에서 회원을 넣을 수 있습니다.')};

function version25(){const card=$('appVersionCard');if(!card)return;const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v25</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">편성대기 조 인원수와 관계없이 다른 미완성 조 빈자리로 이동할 수 있습니다.</div>'}
forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch(e){}location.replace('/?v=25&refresh='+Date.now())};
const r25=render;render=function(){r25();version25()};render();
})();
