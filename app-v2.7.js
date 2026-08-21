(()=>{
const QUEUE27_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v26-queue-api';
const busy27=new Set();
let fastTap27={key:'',at:0};
let statsDecorating27=false,statsRaf27=0;

function toast27(msg,kind='ok'){
 let t=document.getElementById('kokToast27');
 if(!t){t=document.createElement('div');t.id='kokToast27';document.body.appendChild(t)}
 t.className='kokToast27 '+kind;t.textContent=msg;
 requestAnimationFrame(()=>t.classList.add('show'));
 clearTimeout(toast27.tm);toast27.tm=setTimeout(()=>t.classList.remove('show'),2100);
}
async function q27(action,body={}){
 const r=await fetch(QUEUE27_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}const e=new Error(x.error||'편성대기 처리에 실패했습니다.');e.payload=x;throw e}
 return x;
}
function qsig27(){return JSON.stringify([(S.queue||[]).map(String),(S.pendingGames||[]).map(g=>[String(g.id),(g.players||[]).map(String)])])}
function applyServer27(x,beforeSig){
 if(!x?.data)return;
 S=x.data;normalizeClient();
 const after=qsig27();
 try{renderHeader()}catch{}
 if(currentView==='queue'&&after!==beforeSig)renderQueue();
}
function snap27(ids=[]){
 return {queue:[...(S.queue||[])],pendingGames:(S.pendingGames||[]).map(g=>({...g,players:[...(g.players||[])]})),members:ids.map(id=>{const m=M(id);return m?{id,state:m.state,joinedAt:m.joinedAt}:null}).filter(Boolean)};
}
function restore27(snap){
 S.queue=[...snap.queue];S.pendingGames=snap.pendingGames.map(g=>({...g,players:[...g.players]}));
 for(const x of snap.members){const m=M(x.id);if(m){m.state=x.state;m.joinedAt=x.joinedAt}}
 try{renderHeader()}catch{};if(currentView==='queue')renderQueue();
}
function pendingNo27(pid){const i=(S.pendingGames||[]).findIndex(g=>String(g.id)===String(pid));return i>=0?i+1:0}
function firstVacancy27(){return (S.pendingGames||[]).find(g=>Array.isArray(g.players)&&g.players.length<4)||null}
function repeatRisk27(ids){if(ids.length!==4)return false;for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(pairCount(ids[i],ids[j])>=3)return true;return false}
function renderQueueOnly27(){if(currentView==='queue')renderQueue();try{renderHeader()}catch{}}

async function optimisticAdd27(id,targetId,force=false){
 const key='a:'+id+':'+targetId;if(busy27.has(key))return;
 const target=(S.pendingGames||[]).find(g=>String(g.id)===String(targetId)),m=M(id);
 if(!target||!m||target.players.length>=4)return;
 if(!force&&repeatRisk27([...target.players,id])){
   try{await act('add_to_pending',{pendingId:targetId,memberId:id,forceRepeat:false},{repeat:{keep:()=>optimisticAdd27(id,targetId,true),manual:()=>{}}})}catch(e){showError(e)}
   return;
 }
 busy27.add(key);const no=pendingNo27(targetId),snap=snap27([id]);
 target.players.push(id);S.queue=(S.queue||[]).filter(x=>String(x)!==String(id));m.state='matched';
 renderQueueOnly27();toast27(`편성대기 ${no}조에 ${m.name}님을 추가했습니다.`);
 const optimisticSig=qsig27();
 try{const x=await q27('add_to_pending',{pendingId:targetId,memberId:id,forceRepeat:force});applyServer27(x,optimisticSig)}
 catch(e){restore27(snap);toast27('추가에 실패해 원래 상태로 되돌렸습니다.','err');showError(e)}finally{busy27.delete(key)}
}

async function optimisticMove27(sourceId,targetId,id,force=false){
 const key='m:'+sourceId+':'+targetId+':'+id;if(busy27.has(key))return;
 const source=(S.pendingGames||[]).find(g=>String(g.id)===String(sourceId)),target=(S.pendingGames||[]).find(g=>String(g.id)===String(targetId)),m=M(id);
 if(!source||!target||!m||target.players.length>=4)return;
 if(!force&&repeatRisk27([...target.players,id])){
   try{await act('move_pending_member',{sourcePendingId:sourceId,targetPendingId:targetId,memberId:id,forceRepeat:false},{repeat:{keep:()=>optimisticMove27(sourceId,targetId,id,true),manual:()=>closeModal()}})}catch(e){showError(e)}
   return;
 }
 const sourceNo=pendingNo27(sourceId),targetNo=pendingNo27(targetId),sourceWasFull=source.players.length===4,snap=snap27([id]);
 busy27.add(key);
 source.players=source.players.filter(x=>String(x)!==String(id));target.players.push(id);m.state='matched';
 if(!source.players.length)S.pendingGames=S.pendingGames.filter(g=>String(g.id)!==String(sourceId));
 closeModal();renderQueueOnly27();
 toast27(sourceWasFull?`편성대기 ${targetNo}조로 이동 완료 · ${sourceNo}조에 인원을 추가해 주세요.`:`편성대기 ${targetNo}조로 ${m.name}님을 이동했습니다.`);
 const optimisticSig=qsig27();
 try{const x=await q27('move_pending_member',{sourcePendingId:sourceId,targetPendingId:targetId,memberId:id,forceRepeat:force});applyServer27(x,optimisticSig)}
 catch(e){restore27(snap);toast27('이동에 실패해 원래 상태로 되돌렸습니다.','err');showError(e)}finally{busy27.delete(key)}
}

/* Personal queue: vacancy first, update screen before network response. */
const draftClick26=draftClick;
draftClick=function(id){
 if(!canGame())return;
 if(Array.isArray(draft)&&draft.includes(id))return draftClick26(id);
 const target=firstVacancy27();if(target){optimisticAdd27(id,target.id,false);return}
 return draftClick26(id);
};

/* Existing vacancy modal operations use optimistic pending moves. */
fillFromPending=async function(source,id,force=false){const target=moveCtx?.targetPendingId;if(!target)return;return optimisticMove27(source,target,id,force)};
moveToPartial=async function(target,force=false){const c=moveCtx;if(!c)return;return optimisticMove27(c.sourcePendingId,target,c.memberId,force)};

/* React on pointer-down so mobile taps feel immediate. The later synthetic click is suppressed. */
function actionFromTarget27(t){
 const card=t?.closest?.('.queueCard54,.queueCard53,.queueCard');
 if(card){const s=String(card.getAttribute('onclick')||''),m=s.match(/draftClick\(['\"]([^'\"]+)['\"]\)/);if(m)return{key:'q:'+m[1],run:()=>draftClick(m[1])}}
 const empty=t?.closest?.('.pendingSlot.emptySlot,.emptySlot');
 if(empty){const s=String(empty.getAttribute('onclick')||''),m=s.match(/openFillPending\(['\"]([^'\"]+)['\"]\)/);if(m)return{key:'e:'+m[1],run:()=>openFillPending(m[1])}}
 const choice=t?.closest?.('.choiceBtn');
 if(choice){const s=String(choice.getAttribute('onclick')||'');let m=s.match(/fillFromPending\(['\"]([^'\"]+)['\"],['\"]([^'\"]+)['\"]\)/);if(m)return{key:'f:'+m[1]+':'+m[2],run:()=>fillFromPending(m[1],m[2])};m=s.match(/moveToPartial\(['\"]([^'\"]+)['\"]\)/);if(m)return{key:'p:'+m[1],run:()=>moveToPartial(m[1])}}
 return null;
}
document.addEventListener('pointerdown',e=>{
 const a=actionFromTarget27(e.target);if(!a)return;
 fastTap27={key:a.key,at:performance.now()};e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();a.run();
},{capture:true,passive:false});
document.addEventListener('click',e=>{
 const a=actionFromTarget27(e.target);if(!a)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(a.key!==fastTap27.key||performance.now()-fastTap27.at>750){fastTap27={key:a.key,at:performance.now()};a.run()}
},true);

function todayParts27(){const p=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric'}).formatToParts(new Date());return {m:p.find(x=>x.type==='month')?.value||'',d:p.find(x=>x.type==='day')?.value||''}}
function decorateStats27(){
 if(statsDecorating27)return;const box=$('stats');if(!box)return;statsDecorating27=true;
 try{
   const {m,d}=todayParts27(),title=box.querySelector(':scope > .title h2');if(title)title.textContent=`${m}월 ${d}일 게임 통계`;
   [...box.querySelectorAll(':scope > .card')].forEach(c=>{if((c.textContent||'').includes('오늘 최근 경기'))c.remove()});
   const wrap=box.querySelector('.pollWrap90');if(!wrap)return;
   let top=wrap.querySelector(':scope > .pollTopTitle27');if(!top){top=document.createElement('div');top.className='pollTopTitle27';top.innerHTML='<h3>운동참석투표</h3>';wrap.prepend(top)}
   const cal=wrap.querySelector(':scope > .pollCalendar21,:scope > .pollCalendar22');
   const head=[...wrap.querySelectorAll(':scope > .subhead')].find(x=>(x.textContent||'').includes('운동 참석 투표')||(x.textContent||'').includes('투표내용'));
   if(cal&&top.nextElementSibling!==cal)top.insertAdjacentElement('afterend',cal);
   if(head){const b=head.querySelector('b');if(b)b.textContent='투표내용';if(cal&&cal.nextElementSibling!==head)cal.insertAdjacentElement('afterend',head)}
 }finally{statsDecorating27=false}
}
function scheduleStats27(){cancelAnimationFrame(statsRaf27);statsRaf27=requestAnimationFrame(decorateStats27)}
const renderStats26=renderStats;
renderStats=function(){const r=renderStats26();decorateStats27();return r};
const statsBox27=$('stats');if(statsBox27)new MutationObserver(scheduleStats27).observe(statsBox27,{childList:true,subtree:true});
for(const n of ['selectPollDate22','movePollMonth22','togglePollVote22']){const f=window[n];if(typeof f==='function')window[n]=function(...a){const r=f.apply(this,a);scheduleStats27();return r}}

const renderSettings26=renderSettings;
renderSettings=function(){renderSettings26();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.7 · 편성이동 즉시반응 · 터치응답 개선 · 통계화면 재구성'})};
if(me){if(currentView==='stats')decorateStats27()}
})();
