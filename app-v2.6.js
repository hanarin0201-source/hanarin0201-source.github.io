(()=>{
const QUEUE26_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v26-queue-api';
let queueFillBusy26=false;

async function queueRequest26(action,body={}){
  const r=await fetch(QUEUE26_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
  const x=await r.json().catch(()=>({}));
  if(!r.ok){
    if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}
    const e=new Error(x.error||'편성대기 처리에 실패했습니다.');e.payload=x;throw e;
  }
  return x;
}

/* Route vacancy fills and pending-to-pending moves through the current multi-group API. */
const act25=act;
act=async function(action,body={},opts={}){
  if(action!=='add_to_pending'&&action!=='move_pending_member')return act25(action,body,opts);
  try{
    const x=await queueRequest26(action,body);
    if(x.data){S=x.data;normalizeClient();renderAll()}
    return x;
  }catch(e){
    if(e?.payload?.warning==='repeat_pair'&&opts?.repeat){showRepeat(e.payload,opts.repeat);return null}
    throw e;
  }
};

function pendingNo26(pid){const i=(S.pendingGames||[]).findIndex(g=>String(g.id)===String(pid));return i>=0?i+1:0}
function firstVacancy26(){return (S.pendingGames||[]).find(g=>Array.isArray(g.players)&&g.players.length<4)||null}
function clearEmptyDraftTint26(){
  const box=$('queue');if(!box||!Array.isArray(draft))return;
  const slots=[...box.querySelectorAll('.composer54 .slot54,.composer .slots > .slot,.composer .slot')].slice(0,4);
  slots.forEach((slot,i)=>{
    if(draft[i])return;
    slot.style.removeProperty('background-color');
    slot.style.removeProperty('background');
    slot.style.removeProperty('transition');
    slot.classList.remove('filled');
  });
}

async function autoFillQueue26(id,targetId,force=false){
  if(queueFillBusy26)return;
  const target=(S.pendingGames||[]).find(g=>String(g.id)===String(targetId));
  if(!target||!Array.isArray(target.players)||target.players.length>=4){renderQueue();return}
  const m=M(id);if(!m)return;
  queueFillBusy26=true;
  const no=pendingNo26(targetId);
  try{
    const x=await act('add_to_pending',{pendingId:targetId,memberId:id,forceRepeat:force},{repeat:{keep:()=>autoFillQueue26(id,targetId,true),manual:()=>{}}});
    if(x){clearEmptyDraftTint26();alert(`편성대기 ${no}조의 빈자리에 ${m.name}님을 추가했습니다.`)}
  }catch(e){showError(e)}finally{queueFillBusy26=false}
}

/* Personal queue selection fills the earliest pending vacancy before using the new-game composer. */
const draftClick25=draftClick;
draftClick=function(id){
  if(!canGame())return;
  const selected=Array.isArray(draft)&&draft.includes(id);
  if(selected){const r=draftClick25(id);clearEmptyDraftTint26();return r}
  const target=firstVacancy26();
  if(target){autoFillQueue26(id,target.id,false);return}
  const r=draftClick25(id);clearEmptyDraftTint26();return r;
};

const draftRemove25=draftRemove;
draftRemove=function(i){const r=draftRemove25(i);clearEmptyDraftTint26();return r};
const clearDraft25=clearDraft;
clearDraft=function(){const r=clearDraft25();clearEmptyDraftTint26();return r};
const recommendDraft25=recommendDraft;
recommendDraft=function(){const r=recommendDraft25();clearEmptyDraftTint26();return r};

function sourceMoveAlert26(sourceNo,name){
  alert(`편성대기 ${sourceNo}조에서 ${name}님을 이동했습니다.\n인원이 빠진 편성대기 ${sourceNo}조에 다른 인원을 추가해 주세요.`);
}

/* Fill-vacancy modal: moving from a completed 4-person group now uses the fixed API and warns that the source needs a replacement. */
fillFromPending=async function(source,id,force=false){
  const target=moveCtx?.targetPendingId;if(!target)return;
  const src=(S.pendingGames||[]).find(g=>String(g.id)===String(source));
  const sourceWasFull=!!src&&Array.isArray(src.players)&&src.players.length===4;
  const sourceNo=pendingNo26(source),name=M(id)?.name||'회원';
  try{
    const x=await act('move_pending_member',{sourcePendingId:source,targetPendingId:target,memberId:id,forceRepeat:force},{repeat:{keep:()=>{moveCtx={mode:'fill',targetPendingId:target};fillFromPending(source,id,true)},manual:()=>closeModal()}});
    if(!x)return;
    closeModal();
    if(sourceWasFull)sourceMoveAlert26(sourceNo,name);
  }catch(e){showError(e)}
};

/* Member move modal uses the same fixed route. */
moveToPartial=async function(target,force=false){
  const c=moveCtx;if(!c)return;
  const src=(S.pendingGames||[]).find(g=>String(g.id)===String(c.sourcePendingId));
  const sourceWasFull=!!src&&Array.isArray(src.players)&&src.players.length===4;
  const sourceNo=pendingNo26(c.sourcePendingId),name=M(c.memberId)?.name||'회원';
  try{
    const x=await act('move_pending_member',{sourcePendingId:c.sourcePendingId,targetPendingId:target,memberId:c.memberId,forceRepeat:force},{repeat:{keep:()=>{moveCtx=c;moveToPartial(target,true)},manual:()=>closeModal()}});
    if(!x)return;
    closeModal();
    if(sourceWasFull)sourceMoveAlert26(sourceNo,name);
  }catch(e){showError(e)}
};

const renderQueue25=renderQueue;
renderQueue=function(){const r=renderQueue25();clearEmptyDraftTint26();return r};
const renderSettings25=renderSettings;
renderSettings=function(){
  renderSettings25();const b=$('settings');if(!b)return;
  [...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.6 · 편성대기 빈자리 우선충원 · 조간 이동 오류수정 · 급수배경 즉시정리'});
};

if(me&&currentView==='queue')clearEmptyDraftTint26();
})();
