(()=>{
const BUILD10=101, LABEL10='1.0', DEV_NAME10='박태영';

/* v1.0: developer authority is allowed only for Park Tae-young. */
const rawRoleOf10=roleOf;
function myMember10(){
 const mid=String(me?.memberId||'');
 if(mid){const m=M(mid);if(m)return m}
 const n=String(me?.displayName||'').trim();
 return S?.members?.find?.(m=>String(m?.name||'').trim()===n)||null;
}
function isParkDeveloper10(){
 if(!me||String(me.displayName||'').trim()!==DEV_NAME10)return false;
 const mine=myMember10();
 return me.globalAdmin===true||String(me.role||'')==='admin'||String(mine?.role||'')==='admin';
}
function clampDeveloper10(){
 if(!me)return false;
 const ok=isParkDeveloper10();
 if(ok){me.globalAdmin=true;return true}
 let changed=false;
 if(me.globalAdmin){me.globalAdmin=false;changed=true}
 if(String(me.role||'')==='admin'){me.role='member';changed=true}
 try{sessionStorage.removeItem('kokmatch_dev_proof_v99')}catch{}
 return false;
}
roleOf=function(m){
 const r=String(m?.role||'member');
 if(r==='admin'&&String(m?.name||'').trim()!==DEV_NAME10)return 'member';
 return r==='manager'||r==='organizer'?r:r==='admin'?'admin':'member';
};
canGame=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager'||me.role==='organizer'||me.tempOrganizer)};
canManageMembers=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager'||me.role==='organizer')};
canSetRoles=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager')};
canReset=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager')};
canManageGroups=function(){return !!me&&clampDeveloper10()};

const renderHeaderBefore10=renderHeader;
renderHeader=function(){clampDeveloper10();return renderHeaderBefore10()};
const renderNavBefore10=renderNav;
renderNav=function(){clampDeveloper10();return renderNavBefore10()};
const renderMembersBefore10=renderMembers;
renderMembers=function(){clampDeveloper10();return renderMembersBefore10()};
const renderAllBefore10=renderAll;
renderAll=function(){clampDeveloper10();return renderAllBefore10()};

/* Build a current queue snapshot off-screen, so visible personal cards do not get recreated. */
const fullRenderQueue10=renderQueue;
function queueSnapshot10(){
 const live=document.getElementById('queue');if(!live)return null;
 const oldId=live.id;live.id='queue-live-10';
 const tmp=document.createElement('section');tmp.id='queue';tmp.className=live.className;tmp.style.cssText='display:none!important;position:absolute!important;left:-100000px!important;top:0!important;width:'+Math.max(320,live.clientWidth||320)+'px!important';
 document.body.appendChild(tmp);
 try{fullRenderQueue10()}catch(e){console.warn('queue snapshot v1.0',e)}
 live.id=oldId;tmp.remove();
 return tmp;
}
function queueCardId10(card){
 const s=String(card?.getAttribute?.('onclick')||'');
 const m=s.match(/draftClick\(['\"]([^'\"]+)['\"]\)/);return m?String(m[1]):'';
}
function pendingId10(card){
 const el=card?.querySelector?.('[onclick*="openFillPending"],[onclick*="openMoveMember"],[onclick*="removePending"],[onclick*="openCourtStart"],[onclick*="cancelPending"]');
 const s=String(el?.getAttribute?.('onclick')||'');
 const m=s.match(/(?:openFillPending|openMoveMember|removePending|openCourtStart|cancelPending)\(['\"]([^'\"]+)['\"]/);return m?String(m[1]):'';
}
function sectionHead10(root,text){return [...(root?.children||[])].find(el=>el.classList?.contains('subhead')&&String(el.textContent||'').includes(text))||null}
function setText10(el,v){if(el&&el.textContent!==String(v))el.textContent=String(v)}
function syncQueueCard10(live,desired){
 if(!live||!desired)return;
 live.className=desired.className;
 const oc=desired.getAttribute('onclick');if(oc!==null)live.setAttribute('onclick',oc);else live.removeAttribute('onclick');
 setText10(live.querySelector('.ord'),desired.querySelector('.ord')?.textContent||'');
 const lc=live.querySelector('.queueCheck53')||live.querySelector(':scope > b:last-child');
 const dc=desired.querySelector('.queueCheck53')||desired.querySelector(':scope > b:last-child');
 setText10(lc,dc?.textContent||'');
 const lm=live.querySelector('.queueWaitMeta89,.compactMeta53');
 const dm=desired.querySelector('.queueWaitMeta89,.compactMeta53');
 if(lm&&dm)setText10(lm,dm.textContent||'');
}
function syncPersonalQueue10(live,snap){
 const lh=sectionHead10(live,'개인 게임대기'),sh=sectionHead10(snap,'개인 게임대기');
 const pendingHead=sectionHead10(live,'편성대기 현황');
 if(!lh||!sh||!pendingHead)return;
 setText10(lh.querySelector('.tag'),sh.querySelector('.tag')?.textContent||'0명');
 const desired=[...snap.querySelectorAll('.queueCard54,.queueCard53')].filter(x=>queueCardId10(x));
 const current=[...live.querySelectorAll('.queueCard54,.queueCard53')].filter(x=>queueCardId10(x));
 const map=new Map(current.map(c=>[queueCardId10(c),c]));
 const want=new Set(desired.map(queueCardId10));
 current.forEach(c=>{if(!want.has(queueCardId10(c)))c.remove()});
 let note=lh.nextElementSibling;
 while(note&&note!==pendingHead&&!note.classList?.contains('note'))note=note.nextElementSibling;
 let cursor=(note&&note!==pendingHead)?note.nextSibling:lh.nextSibling;
 for(const d of desired){
  const id=queueCardId10(d);let node=map.get(id);
  if(node&&node.isConnected)syncQueueCard10(node,d);else node=d.cloneNode(true);
  if(node!==cursor)live.insertBefore(node,cursor||pendingHead);
  cursor=node.nextSibling;
 }
 for(let n=(note&&note!==pendingHead)?note.nextSibling:lh.nextSibling;n&&n!==pendingHead;){
  const next=n.nextSibling;if(n.classList?.contains('empty'))n.remove();n=next;
 }
 if(!desired.length){
  const se=[...snap.children].find(el=>el.classList?.contains('empty')&&el.previousElementSibling?.classList?.contains('note'));
  if(se)live.insertBefore(se.cloneNode(true),pendingHead);
 }
}
function syncPending10(live,snap){
 const lh=sectionHead10(live,'편성대기 현황'),sh=sectionHead10(snap,'편성대기 현황');if(!lh||!sh)return;
 setText10(lh.querySelector('.tag'),sh.querySelector('.tag')?.textContent||'0조');
 let n=lh.nextSibling;while(n){const next=n.nextSibling;n.remove();n=next}
 let s=sh.nextSibling;while(s){live.appendChild(s.cloneNode(true));s=s.nextSibling}
}
function syncComposer10(live,snap){
 const lc=live.querySelector('.composer54,.composer'),sc=snap.querySelector('.composer54,.composer');
 if(!lc&&!sc)return;
 if(lc&&sc)lc.replaceWith(sc.cloneNode(true));else if(!lc&&sc){const title=live.querySelector('.title');title?.insertAdjacentElement('afterend',sc.cloneNode(true))}else lc?.remove();
}
function syncQueueTitle10(live,snap){setText10(live.querySelector('.title .tag'),snap.querySelector('.title .tag')?.textContent||'0명')}
function reconcileQueue10(){
 const live=document.getElementById('queue');if(!live)return;
 const scroller=document.scrollingElement||document.documentElement,y=Math.max(0,Number(scroller?.scrollTop||window.scrollY||0));
 const snap=queueSnapshot10();if(!snap)return;
 syncQueueTitle10(live,snap);syncComposer10(live,snap);syncPersonalQueue10(live,snap);syncPending10(live,snap);
 if(scroller)scroller.scrollTop=y;
 requestAnimationFrame(()=>{if(scroller)scroller.scrollTop=y});
}
function patchDraftOnly10(){
 const live=document.getElementById('queue');if(!live)return;
 const scroller=document.scrollingElement||document.documentElement,y=Math.max(0,Number(scroller?.scrollTop||window.scrollY||0));
 const snap=queueSnapshot10();if(!snap)return;
 syncComposer10(live,snap);
 const selected=new Set(draft.filter(Boolean).map(String));
 [...live.querySelectorAll('.queueCard54,.queueCard53')].forEach(card=>{
  const id=queueCardId10(card),on=selected.has(id);card.classList.toggle('selected',on);
  const chk=card.querySelector('.queueCheck53')||card.querySelector(':scope > b:last-child');setText10(chk,on?'✓':'');
 });
 if(scroller)scroller.scrollTop=y;
 requestAnimationFrame(()=>{if(scroller)scroller.scrollTop=y});
}
function withoutQueueRender10(fn){
 const saved=renderQueue;renderQueue=function(){};
 try{return fn()}finally{renderQueue=saved}
}

/* Preserve all partner/repeat logic, but suppress its whole queue repaint. */
const draftClickBefore10=draftClick;
draftClick=function(id){const r=withoutQueueRender10(()=>draftClickBefore10(id));patchDraftOnly10();return r};
const draftRemoveBefore10=draftRemove;
draftRemove=function(i){const r=withoutQueueRender10(()=>draftRemoveBefore10(i));patchDraftOnly10();return r};
const clearDraftBefore10=clearDraft;
clearDraft=function(){const r=withoutQueueRender10(()=>clearDraftBefore10());patchDraftOnly10();return r};
const recommendDraftBefore10=recommendDraft;
recommendDraft=function(){const r=withoutQueueRender10(()=>recommendDraftBefore10());patchDraftOnly10();return r};
['partnerRedo67','partnerKeep67','partnerSwap67','partnerIgnore67','repeatUndo67','repeatKeep67'].forEach(name=>{
 const old=window[name];if(typeof old!=='function')return;
 window[name]=function(...args){const r=withoutQueueRender10(()=>old(...args));patchDraftOnly10();return r};
});

/* Queue server actions update only changed queue sections, never the whole visible list. */
const actBefore10=act;
const SMOOTH_QUEUE_ACTIONS10=new Set(['create_pending','remove_from_pending','move_pending_order','cancel_pending','add_to_pending','move_pending_member','swap_pending_queue','swap_pending_players']);
let queueStateDirty10=false;
act=async function(action,body={},opts={}){
 clampDeveloper10();
 if(currentView==='queue'&&SMOOTH_QUEUE_ACTIONS10.has(String(action))){
  try{
   const x=await request('action','POST',{action,groupId:currentGroupId,...body});
   if(x?.data){S=x.data;normalizeClient();clampDeveloper10();try{renderHeader()}catch{};reconcileQueue10();queueStateDirty10=true}
   return x;
  }catch(e){
   if(e?.payload?.warning==='repeat_pair'&&opts.repeat){showRepeat(e.payload,opts.repeat);return null}
   throw e;
  }
 }
 return actBefore10(action,body,opts);
};

registerDraft=async function(forceRepeat=false){
 const ps=draft.filter(Boolean);if(!ps.length)return alert('1명 이상 선택해주세요.');
 if(ps.length<4&&!confirm(`현재 ${ps.length}명입니다. 4명이 안 됐는데 편성대기로 등록하시겠습니까?`))return;
 try{
  const x=await act('create_pending',{players:ps,forceRepeat},{repeat:{keep:()=>registerDraft(true),manual:()=>{clearDraft();closeModal()},recommend:()=>{closeModal();clearDraft();recommendDraft()}}});
  if(x){draft=[null,null,null,null];patchDraftOnly10()}
 }catch(e){showError(e)}
};

/* After smooth queue updates, pre-render the next destination while it is still hidden. */
const goViewBefore10=goView;
goView=function(id){
 clampDeveloper10();
 if(queueStateDirty10&&id!==currentView){
  try{
   if(id==='members')renderMembers();else if(id==='playing')renderPlaying();else if(id==='stats')renderStats();else if(id==='settings')renderSettings();
  }catch(e){console.warn('pre-render v1.0',e)}
 }
 const r=goViewBefore10(id);clampDeveloper10();
 if(id!=='queue')queueStateDirty10=false;
 return r;
};

const loadStateBefore10=loadState;
loadState=async function(...args){
 const r=await loadStateBefore10(...args);clampDeveloper10();
 try{renderHeader();renderNav()}catch{}
 return r;
};

const renderSettingsBefore10=renderSettings;
renderSettings=function(){
 clampDeveloper10();renderSettingsBefore10();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v(?:\d+|1\.0)/.test(e.textContent||''))e.textContent='콕매치 v1.0 · 게임대기 무깜빡임 · 개발자 권한 박태영 전용'});
};

function enforceNonPark10(){
 if(!me)return;
 const was=!!me.globalAdmin||String(me.role||'')==='admin';const ok=clampDeveloper10();
 if(was&&!ok){try{renderHeader();renderNav();if(currentView==='members')renderMembers()}catch{}}
}
setInterval(enforceNonPark10,700);
addEventListener('focus',enforceNonPark10,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)enforceNonPark10()});

if(location.pathname.startsWith('/launch/v1.0'))history.replaceState(null,'','/?loaded=1.0');
if(me){clampDeveloper10();try{renderHeader();renderNav();if(currentView==='members')renderMembers()}catch{}}
})();
