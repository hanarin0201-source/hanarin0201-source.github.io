(()=>{
const QUEUE28_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v26-queue-api';
const busy28=new Set();
let gesture28=null,suppress28={key:'',at:0};
let statsDecorating28=false,statsRaf28=0;

function toast28(msg,kind='ok'){
 let t=document.getElementById('kokToast27');
 if(!t){t=document.createElement('div');t.id='kokToast27';document.body.appendChild(t)}
 t.className='kokToast27 '+kind;t.textContent=msg;
 requestAnimationFrame(()=>t.classList.add('show'));
 clearTimeout(toast28.tm);toast28.tm=setTimeout(()=>t.classList.remove('show'),2100);
}
async function q28(action,body={}){
 const r=await fetch(QUEUE28_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}const e=new Error(x.error||'편성대기 처리에 실패했습니다.');e.payload=x;throw e}
 return x;
}
const loadState27=loadState;
loadState=async function(...args){if(busy28.size)return;return loadState27(...args)};
function qsig28(){return JSON.stringify([(S.queue||[]).map(String),(S.pendingGames||[]).map(g=>[String(g.id),(g.players||[]).map(String)])])}
function applyServer28(x,beforeSig){
 if(!x?.data)return;
 S=x.data;normalizeClient();
 const after=qsig28();
 try{renderHeader()}catch{}
 if(currentView==='queue'&&after!==beforeSig)renderQueue();
}
function snap28(ids=[]){
 return {queue:[...(S.queue||[])],pendingGames:(S.pendingGames||[]).map(g=>({...g,players:[...(g.players||[])]})),members:ids.map(id=>{const m=M(id);return m?{id,state:m.state,joinedAt:m.joinedAt}:null}).filter(Boolean)};
}
function restore28(snap){
 S.queue=[...snap.queue];S.pendingGames=snap.pendingGames.map(g=>({...g,players:[...g.players]}));
 for(const x of snap.members){const m=M(x.id);if(m){m.state=x.state;m.joinedAt=x.joinedAt}}
 try{renderHeader()}catch{};if(currentView==='queue')renderQueue();
}
function pendingNo28(pid){const i=(S.pendingGames||[]).findIndex(g=>String(g.id)===String(pid));return i>=0?i+1:0}
function firstVacancy28(){return (S.pendingGames||[]).find(g=>Array.isArray(g.players)&&g.players.length<4)||null}
function repeatRisk28(ids){if(ids.length!==4)return false;for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(pairCount(ids[i],ids[j])>=3)return true;return false}
function renderQueueOnly28(){if(currentView==='queue')renderQueue();try{renderHeader()}catch{}}

async function optimisticAdd28(id,targetId,force=false){
 const key='a:'+id+':'+targetId;if(busy28.has(key))return;
 const target=(S.pendingGames||[]).find(g=>String(g.id)===String(targetId)),m=M(id);
 if(!target||!m||target.players.length>=4)return;
 if(!force&&repeatRisk28([...target.players,id])){
   try{await act('add_to_pending',{pendingId:targetId,memberId:id,forceRepeat:false},{repeat:{keep:()=>optimisticAdd28(id,targetId,true),manual:()=>{}}})}catch(e){showError(e)}
   return;
 }
 busy28.add(key);const no=pendingNo28(targetId),snap=snap28([id]);
 target.players.push(id);S.queue=(S.queue||[]).filter(x=>String(x)!==String(id));m.state='matched';
 renderQueueOnly28();toast28(`편성대기 ${no}조에 ${m.name}님을 추가했습니다.`);
 const optimisticSig=qsig28();
 try{const x=await q28('add_to_pending',{pendingId:targetId,memberId:id,forceRepeat:force});applyServer28(x,optimisticSig)}
 catch(e){restore28(snap);toast28('추가에 실패해 원래 상태로 되돌렸습니다.','err');showError(e)}finally{busy28.delete(key)}
}
async function optimisticMove28(sourceId,targetId,id,force=false){
 const key='m:'+sourceId+':'+targetId+':'+id;if(busy28.has(key))return;
 const source=(S.pendingGames||[]).find(g=>String(g.id)===String(sourceId)),target=(S.pendingGames||[]).find(g=>String(g.id)===String(targetId)),m=M(id);
 if(!source||!target||!m||target.players.length>=4)return;
 if(!force&&repeatRisk28([...target.players,id])){
   try{await act('move_pending_member',{sourcePendingId:sourceId,targetPendingId:targetId,memberId:id,forceRepeat:false},{repeat:{keep:()=>optimisticMove28(sourceId,targetId,id,true),manual:()=>closeModal()}})}catch(e){showError(e)}
   return;
 }
 const sourceNo=pendingNo28(sourceId),targetNo=pendingNo28(targetId),sourceWasFull=source.players.length===4,snap=snap28([id]);
 busy28.add(key);
 source.players=source.players.filter(x=>String(x)!==String(id));target.players.push(id);m.state='matched';
 if(!source.players.length)S.pendingGames=S.pendingGames.filter(g=>String(g.id)!==String(sourceId));
 closeModal();renderQueueOnly28();
 toast28(sourceWasFull?`편성대기 ${targetNo}조로 이동 완료 · ${sourceNo}조에 인원을 추가해 주세요.`:`편성대기 ${targetNo}조로 ${m.name}님을 이동했습니다.`);
 const optimisticSig=qsig28();
 try{const x=await q28('move_pending_member',{sourcePendingId:sourceId,targetPendingId:targetId,memberId:id,forceRepeat:force});applyServer28(x,optimisticSig)}
 catch(e){restore28(snap);toast28('이동에 실패해 원래 상태로 되돌렸습니다.','err');showError(e)}finally{busy28.delete(key)}
}

const draftClick27=draftClick;
draftClick=function(id){
 if(!canGame())return;
 if(Array.isArray(draft)&&draft.includes(id))return draftClick27(id);
 const target=firstVacancy28();if(target){optimisticAdd28(id,target.id,false);return}
 return draftClick27(id);
};
fillFromPending=async function(source,id,force=false){const target=moveCtx?.targetPendingId;if(!target)return;return optimisticMove28(source,target,id,force)};
moveToPartial=async function(target,force=false){const c=moveCtx;if(!c)return;return optimisticMove28(c.sourcePendingId,target,c.memberId,force)};

function actionFromTarget28(t){
 const card=t?.closest?.('.queueCard54,.queueCard53,.queueCard');
 if(card){const s=String(card.getAttribute('onclick')||''),m=s.match(/draftClick\(['\"]([^'\"]+)['\"]\)/);if(m)return{key:'q:'+m[1],run:()=>draftClick(m[1])}}
 const empty=t?.closest?.('.pendingSlot.emptySlot,.emptySlot');
 if(empty){const s=String(empty.getAttribute('onclick')||''),m=s.match(/openFillPending\(['\"]([^'\"]+)['\"]\)/);if(m)return{key:'e:'+m[1],run:()=>openFillPending(m[1])}}
 const choice=t?.closest?.('.choiceBtn');
 if(choice){const s=String(choice.getAttribute('onclick')||'');let m=s.match(/fillFromPending\(['\"]([^'\"]+)['\"],['\"]([^'\"]+)['\"]\)/);if(m)return{key:'f:'+m[1]+':'+m[2],run:()=>fillFromPending(m[1],m[2])};m=s.match(/moveToPartial\(['\"]([^'\"]+)['\"]\)/);if(m)return{key:'p:'+m[1],run:()=>moveToPartial(m[1])}}
 return null;
}
const TAP_MOVE28=10,TAP_MAX_MS28=850;
document.addEventListener('pointerdown',e=>{
 const a=actionFromTarget28(e.target);if(!a)return;
 gesture28={pointerId:e.pointerId,key:a.key,run:a.run,x:e.clientX,y:e.clientY,at:performance.now(),moved:false};
},{capture:true,passive:true});
document.addEventListener('pointermove',e=>{
 const g=gesture28;if(!g||g.pointerId!==e.pointerId)return;
 if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>TAP_MOVE28)g.moved=true;
},{capture:true,passive:true});
document.addEventListener('pointercancel',e=>{if(gesture28?.pointerId===e.pointerId)gesture28=null},{capture:true,passive:true});
document.addEventListener('pointerup',e=>{
 const g=gesture28;if(!g||g.pointerId!==e.pointerId)return;gesture28=null;
 const moved=g.moved||Math.hypot(e.clientX-g.x,e.clientY-g.y)>TAP_MOVE28;
 const held=performance.now()-g.at>TAP_MAX_MS28;
 suppress28={key:g.key,at:performance.now()};
 if(moved||held)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();g.run();
},{capture:true,passive:false});
document.addEventListener('click',e=>{
 const a=actionFromTarget28(e.target);if(!a)return;
 if(a.key===suppress28.key&&performance.now()-suppress28.at<900){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();return}
},{capture:true});

function todayParts28(){const p=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric'}).formatToParts(new Date());return {m:p.find(x=>x.type==='month')?.value||'',d:p.find(x=>x.type==='day')?.value||''}}
function decorateStats28(){
 if(statsDecorating28)return;const box=$('stats');if(!box)return;statsDecorating28=true;
 try{
   const {m,d}=todayParts28(),title=box.querySelector(':scope > .title h2');if(title)title.textContent=`${m}월 ${d}일 게임 통계`;
   [...box.querySelectorAll(':scope > .card')].forEach(c=>{if((c.textContent||'').includes('오늘 최근 경기'))c.remove()});
   const wrap=box.querySelector('.pollWrap90');if(!wrap)return;
   let top=wrap.querySelector(':scope > .pollTopTitle27');if(!top){top=document.createElement('div');top.className='pollTopTitle27';top.innerHTML='<h3>운동참석투표</h3>';wrap.prepend(top)}
   const cal=wrap.querySelector(':scope > .pollCalendar21,:scope > .pollCalendar22');
   const head=[...wrap.querySelectorAll(':scope > .subhead')].find(x=>(x.textContent||'').includes('운동 참석 투표')||(x.textContent||'').includes('투표내용'));
   if(cal&&top.nextElementSibling!==cal)top.insertAdjacentElement('afterend',cal);
   if(head){const b=head.querySelector('b');if(b)b.textContent='투표내용';if(cal&&cal.nextElementSibling!==head)cal.insertAdjacentElement('afterend',head)}
 }finally{statsDecorating28=false}
}
function scheduleStats28(){cancelAnimationFrame(statsRaf28);statsRaf28=requestAnimationFrame(decorateStats28)}
const renderStats27=renderStats;
renderStats=function(){const r=renderStats27();decorateStats28();return r};
const statsBox28=$('stats');if(statsBox28)new MutationObserver(scheduleStats28).observe(statsBox28,{childList:true,subtree:true});
for(const n of ['selectPollDate22','movePollMonth22','togglePollVote22']){const f=window[n];if(typeof f==='function')window[n]=function(...a){const r=f.apply(this,a);scheduleStats28();return r}}

function renameStatsNav28(){const b=$('nav')?.querySelector('button[data-v="stats"]');if(b)b.innerHTML='<i>▥</i>운동통계'}
const renderNav27=renderNav;
renderNav=function(){const r=renderNav27();renameStatsNav28();return r};
renameStatsNav28();

const renderSettings27=renderSettings;
renderSettings=function(){renderSettings27();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.8 · 스크롤 오편성 방지 · 탭/스크롤 구분 · 운동통계 메뉴명 변경'})};
if(me&&currentView==='stats')decorateStats28();
})();
