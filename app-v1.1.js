(()=>{
const DEV_NAME11='박태영';

function mine11(){
 try{
  const mid=String(me?.memberId||'');
  if(mid){const m=M(mid);if(m)return m}
  const n=String(me?.displayName||'').trim();
  return S?.members?.find?.(m=>String(m?.name||'').trim()===n)||null;
 }catch{return null}
}
function isDeveloper11(){
 if(!me||String(me.displayName||'').trim()!==DEV_NAME11)return false;
 const mine=mine11();
 return me.globalAdmin===true||String(me.role||'')==='admin'||String(mine?.role||'')==='admin';
}
function clampDeveloper11(){
 if(!me)return false;
 if(isDeveloper11()){me.globalAdmin=true;return true}
 me.globalAdmin=false;
 if(String(me.role||'')==='admin')me.role='member';
 try{sessionStorage.removeItem('kokmatch_dev_proof_v99')}catch{}
 return false;
}

const roleOfPrev11=roleOf;
roleOf=function(m){
 if(String(m?.role||'')==='admin'&&String(m?.name||'').trim()!==DEV_NAME11)return 'member';
 return roleOfPrev11(m);
};
canGame=function(){const d=clampDeveloper11();return !!me&&(d||me.role==='manager'||me.role==='organizer'||me.tempOrganizer)};
canManageMembers=function(){const d=clampDeveloper11();return !!me&&(d||me.role==='manager'||me.role==='organizer')};
canSetRoles=function(){const d=clampDeveloper11();return !!me&&(d||me.role==='manager')};
canReset=function(){const d=clampDeveloper11();return !!me&&(d||me.role==='manager')};
canManageGroups=function(){return !!me&&clampDeveloper11()};

const renderHeaderPrev11=renderHeader;
renderHeader=function(){clampDeveloper11();const r=renderHeaderPrev11();clampDeveloper11();return r};
const renderNavPrev11=renderNav;
renderNav=function(){clampDeveloper11();const r=renderNavPrev11();clampDeveloper11();return r};
const renderMembersPrev11=renderMembers;
renderMembers=function(){clampDeveloper11();const r=renderMembersPrev11();clampDeveloper11();return r};
const loadStatePrev11=loadState;
loadState=async function(...args){const r=await loadStatePrev11(...args);clampDeveloper11();try{renderHeader();renderNav()}catch{}return r};

function queueCardId11(card){
 const s=String(card?.getAttribute?.('onclick')||'');
 const m=s.match(/draftClick\(['\"]([^'\"]+)['\"]\)/);
 return m?String(m[1]):'';
}
function subhead11(root,text){
 return [...(root?.children||[])].find(el=>el.classList?.contains('subhead')&&String(el.textContent||'').includes(text))||null;
}
function text11(el,v){if(el&&el.textContent!==String(v))el.textContent=String(v)}
function snapshotQueue11(){
 const live=$('queue');if(!live)return null;
 const sc=document.scrollingElement||document.documentElement;
 const y=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
 live.id='queue-live-v11';
 const tmp=document.createElement('section');tmp.id='queue';tmp.className=live.className;
 tmp.style.cssText='display:none!important;position:absolute!important;left:-100000px!important;top:0!important;width:'+Math.max(320,live.clientWidth||320)+'px!important';
 document.body.appendChild(tmp);
 let clone=null;
 try{renderQueue();clone=tmp.cloneNode(true)}catch(e){console.warn('queue snapshot v1.1',e)}
 tmp.remove();live.id='queue';
 if(sc)sc.scrollTop=y;
 return clone;
}
function syncQueueCard11(live,desired){
 if(!live||!desired)return;
 live.className=desired.className;
 const oc=desired.getAttribute('onclick');if(oc!==null)live.setAttribute('onclick',oc);else live.removeAttribute('onclick');
 text11(live.querySelector('.ord'),desired.querySelector('.ord')?.textContent||'');
 const lc=live.querySelector('.queueCheck53')||live.querySelector(':scope > b:last-child');
 const dc=desired.querySelector('.queueCheck53')||desired.querySelector(':scope > b:last-child');
 text11(lc,dc?.textContent||'');
 const lm=live.querySelector('.queueWaitMeta89,.compactMeta53');
 const dm=desired.querySelector('.queueWaitMeta89,.compactMeta53');
 if(lm&&dm)text11(lm,dm.textContent||'');
}
function syncComposer11(live,snap){
 const lc=live.querySelector('.composer54,.composer'),sc=snap.querySelector('.composer54,.composer');
 if(lc&&sc)lc.replaceWith(sc.cloneNode(true));
 else if(!lc&&sc)live.querySelector('.title')?.insertAdjacentElement('afterend',sc.cloneNode(true));
 else if(lc&&!sc)lc.remove();
}
function syncPersonal11(live,snap){
 const lh=subhead11(live,'개인 게임대기'),lp=subhead11(live,'편성대기 현황');
 const sh=subhead11(snap,'개인 게임대기'),sp=subhead11(snap,'편성대기 현황');
 if(!lh||!lp||!sh||!sp)return;
 text11(lh.querySelector('.tag'),sh.querySelector('.tag')?.textContent||'0명');
 const collect=(start,end)=>{const out=[];for(let n=start.nextElementSibling;n&&n!==end;n=n.nextElementSibling)if(n.matches?.('.queueCard54,.queueCard53,.queueCard'))out.push(n);return out};
 const cur=collect(lh,lp),des=collect(sh,sp),map=new Map(cur.map(c=>[queueCardId11(c),c])),want=new Set(des.map(queueCardId11));
 cur.forEach(c=>{if(!want.has(queueCardId11(c)))c.remove()});
 let anchor=lh.nextElementSibling;
 while(anchor&&anchor!==lp&&!anchor.classList?.contains('note'))anchor=anchor.nextElementSibling;
 let cursor=(anchor&&anchor!==lp)?anchor.nextSibling:lh.nextSibling;
 for(const d of des){
  const id=queueCardId11(d);let node=map.get(id);
  if(node&&node.isConnected)syncQueueCard11(node,d);else node=d.cloneNode(true);
  if(node!==cursor)live.insertBefore(node,cursor||lp);
  cursor=node.nextSibling;
 }
 for(let n=(anchor&&anchor!==lp)?anchor.nextSibling:lh.nextSibling;n&&n!==lp;){const next=n.nextSibling;if(n.classList?.contains('empty'))n.remove();n=next}
 if(!des.length){
  let empty=null;for(let n=sh.nextElementSibling;n&&n!==sp;n=n.nextElementSibling){if(n.classList?.contains('empty')){empty=n;break}}
  if(empty)live.insertBefore(empty.cloneNode(true),lp);
 }
}
function syncPending11(live,snap){
 const lh=subhead11(live,'편성대기 현황'),sh=subhead11(snap,'편성대기 현황');if(!lh||!sh)return;
 text11(lh.querySelector('.tag'),sh.querySelector('.tag')?.textContent||'0조');
 let n=lh.nextSibling;while(n){const next=n.nextSibling;n.remove();n=next}
 for(let s=sh.nextSibling;s;s=s.nextSibling)live.appendChild(s.cloneNode(true));
}
function reconcileQueue11(parts='all'){
 const live=$('queue');if(!live)return;
 const sc=document.scrollingElement||document.documentElement;
 const y=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
 const snap=snapshotQueue11();if(!snap)return;
 text11(live.querySelector('.title .tag'),snap.querySelector('.title .tag')?.textContent||'0명');
 syncComposer11(live,snap);
 if(parts==='all'){syncPersonal11(live,snap);syncPending11(live,snap)}
 const selected=new Set(draft.filter(Boolean).map(String));
 [...live.querySelectorAll('.queueCard54,.queueCard53,.queueCard')].forEach(card=>{
  const id=queueCardId11(card);if(!id)return;const on=selected.has(id);
  card.classList.toggle('selected',on);
  text11(card.querySelector('.queueCheck53')||card.querySelector(':scope > b:last-child'),on?'✓':'');
 });
 if(sc)sc.scrollTop=y;
 requestAnimationFrame(()=>{if(sc)sc.scrollTop=y});
}
function withoutQueueRender11(fn){const saved=renderQueue;renderQueue=function(){};try{return fn()}finally{renderQueue=saved}}

try{
 const oldDraftClick=draftClick;
 draftClick=function(id){const r=withoutQueueRender11(()=>oldDraftClick(id));reconcileQueue11('draft');return r};
 const oldDraftRemove=draftRemove;
 draftRemove=function(i){const r=withoutQueueRender11(()=>oldDraftRemove(i));reconcileQueue11('draft');return r};
 const oldClearDraft=clearDraft;
 clearDraft=function(){const r=withoutQueueRender11(()=>oldClearDraft());reconcileQueue11('draft');return r};
 const oldRecommendDraft=recommendDraft;
 recommendDraft=function(){const r=withoutQueueRender11(()=>oldRecommendDraft());reconcileQueue11('draft');return r};
 ['partnerRedo67','partnerKeep67','partnerSwap67','partnerIgnore67','repeatUndo67','repeatKeep67'].forEach(name=>{
  const old=window[name];if(typeof old!=='function')return;
  window[name]=function(...args){const r=withoutQueueRender11(()=>old(...args));reconcileQueue11('draft');return r};
 });
}catch(e){console.warn('draft smooth v1.1 disabled',e)}

const actPrev11=act;
const smoothActions11=new Set(['create_pending','remove_from_pending','move_pending_order','cancel_pending','add_to_pending','move_pending_member','swap_pending_queue','swap_pending_players']);
let queueDirty11=false;
act=async function(action,body={},opts={}){
 clampDeveloper11();
 if(currentView==='queue'&&smoothActions11.has(String(action))){
  try{
   const x=await request('action','POST',{action,groupId:currentGroupId,...body});
   if(x?.data){S=x.data;normalizeClient();clampDeveloper11();try{renderHeader()}catch{};reconcileQueue11('all');queueDirty11=true}
   return x;
  }catch(e){
   if(e?.payload?.warning==='repeat_pair'&&opts.repeat){showRepeat(e.payload,opts.repeat);return null}
   throw e;
  }
 }
 const r=await actPrev11(action,body,opts);clampDeveloper11();return r;
};

const goViewPrev11=goView;
goView=function(id){
 clampDeveloper11();
 if(queueDirty11&&id!==currentView){
  try{if(id==='members')renderMembers();else if(id==='playing')renderPlaying();else if(id==='stats')renderStats();else if(id==='settings')renderSettings()}catch{}
 }
 const r=goViewPrev11(id);clampDeveloper11();if(id!=='queue')queueDirty11=false;return r;
};

const settingsPrev11=renderSettings;
renderSettings=function(){
 clampDeveloper11();settingsPrev11();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(e.textContent||''))e.textContent='콕매치 v1.1 · 세션 초기화 · 권한 안정화 · 게임대기 무깜빡임'});
};

function enforce11(){
 try{
  if(!me)return;const before=!!me.globalAdmin;const ok=clampDeveloper11();
  if(before&&!ok){renderHeader();renderNav();if(currentView==='members')renderMembers()}
 }catch{}
}
addEventListener('focus',enforce11,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)enforce11()});
setInterval(enforce11,1500);

if(location.pathname.startsWith('/launch/v1.1'))history.replaceState(null,'','/?loaded=1.1');
if(me){try{clampDeveloper11();renderHeader();renderNav()}catch{}}
})();
