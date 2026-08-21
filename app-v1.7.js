(()=>{
const SEMVER17='1.7',DEV_NAME17='박태영';
let actionBusy17=0,lastQueueSig17='',searchCompose17=false,searchTimer17=0,searchPending17='';

function mineRaw17(){
 try{
  const id=String(me?.memberId||'');if(id){const m=M(id);if(m)return m}
  const n=String(me?.displayName||'').trim();return S?.members?.find?.(m=>String(m?.name||'').trim()===n)||null;
 }catch{return null}
}
function developerEvidence17(){
 if(!me||String(me.displayName||'').trim()!==DEV_NAME17)return false;
 const mine=mineRaw17();
 return me.globalAdmin===true||String(me.role||'')==='admin'||String(mine?.role||'')==='admin';
}
function enforceAuth17(){
 if(!me)return false;
 if(developerEvidence17()){me.globalAdmin=true;return true}
 me.globalAdmin=false;if(String(me.role||'')==='admin')me.role='member';
 try{sessionStorage.removeItem('kokmatch_dev_proof_v99')}catch{}
 return false;
}
function viewerIsDeveloper17(){return !!me&&String(me.displayName||'').trim()===DEV_NAME17&&developerEvidence17()}
function rawPark17(){return S?.members?.find?.(m=>String(m?.name||'').trim()===DEV_NAME17&&String(m?.role||'')==='admin')||null}
function hiddenAdmin17(){return String(S?.adminBadgeVisibility||'all')==='hidden'}

/* Authority and visible badge are separate. Only the real 박태영 admin identity can retain developer authority. */
canGame=function(){const d=enforceAuth17();return !!me&&(d||me.role==='manager'||me.role==='organizer'||me.tempOrganizer)};
canManageMembers=function(){const d=enforceAuth17();return !!me&&(d||me.role==='manager'||me.role==='organizer')};
canSetRoles=function(){const d=enforceAuth17();return !!me&&(d||me.role==='manager')};
canReset=function(){const d=enforceAuth17();return !!me&&(d||me.role==='manager')};
canManageGroups=function(){return !!me&&enforceAuth17()};

const roleBadgeBefore17=roleBadge;
roleBadge=function(m){
 if(String(m?.role||'')==='admin'&&String(m?.name||'').trim()===DEV_NAME17&&hiddenAdmin17()&&!viewerIsDeveloper17())return '<span class="roleBadge role-member44">일반</span>';
 return roleBadgeBefore17(m);
};

function rgba17(c,a){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);return m?`rgba(${m[1]},${m[2]},${m[3]},${a})`:''}
function gradeAlpha17(t){t=String(t||'').trim().toUpperCase();if(/^(?:\d{2})?B(?:급)?$/.test(t))return .30;if(/^(?:\d{2})?C(?:급)?$/.test(t))return .20;return .24}
const GRADE_BOX17='.memberCard73,.memberCard71,.memberCard,.queueCard54,.queueCard53,.queueCard,.composer54 .slot54,.composer .slot,.pendingSlot54,.pendingSlot,.playingPlayer53,.player54,.playerCard,.courtPlayer,.choiceBtn,.pickRow,.candidateRow,.partnerSearchRow82,.partnerPickedCard82,.voteMemberRow,.attendeeRow,.pollMemberRow,.memberVoteRow';
function tintNow17(root=document){
 if(!root?.querySelectorAll)return;
 root.querySelectorAll('.tag').forEach(tag=>{
  const txt=(tag.textContent||'').trim();if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;
  const cs=getComputedStyle(tag);let base=cs.backgroundColor;if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
  const tint=rgba17(base,gradeAlpha17(txt)),box=tag.closest(GRADE_BOX17);if(!tint||!box)return;
  if(box.style.backgroundColor!==tint)box.style.setProperty('background-color',tint,'important');
  box.style.setProperty('transition','none','important');
  if(box.classList.contains('playingPlayer53'))box.style.setProperty('border-radius','10px','important');
 });
}
function generalBadge17(){const s=document.createElement('span');s.className='roleBadge role-member44';s.textContent='일반';return s}
function maskTarget17(target){
 if(!target)return;
 const global=target.querySelector('.roleBadge.role-global');if(global)global.replaceWith(generalBadge17());
 else if(!target.querySelector('.roleBadge'))target.appendChild(generalBadge17());
}
function maskParkQueue17(root=document){
 if(!hiddenAdmin17()||viewerIsDeveloper17()||!rawPark17()||!root?.querySelectorAll)return;
 root.querySelectorAll('.queueMain47,.composer54 .slotName53,.composer .slotName53,.playingMain53,.memberMainLine45').forEach(line=>{
  const n=line.querySelector('.compactName53,.playingName53,.memberName45');if(n&&String(n.textContent||'').trim()===DEV_NAME17)maskTarget17(line);
 });
 root.querySelectorAll('.pendingSlot54,.pendingSlot53').forEach(slot=>{
  const n=slot.querySelector('.compactName53');if(!n||String(n.textContent||'').trim()!==DEV_NAME17)return;
  maskTarget17(slot.querySelector('.slotBadges54,.slotBadges53')||slot);
 });
}
function stabilize17(root=document){enforceAuth17();maskParkQueue17(root);tintNow17(root)}
function scrollY17(){const sc=document.scrollingElement||document.documentElement;return [sc,Math.max(0,Number(sc?.scrollTop||window.scrollY||0))]}
function restoreY17(sc,y){if(!sc)return;sc.scrollTop=y;requestAnimationFrame(()=>{sc.scrollTop=y})}

/* Every visible render gets its grade color synchronously, before the browser paints the new DOM. */
const renderQueueBefore17=renderQueue;
renderQueue=function(){const [sc,y]=scrollY17(),keep=currentView==='queue';renderQueueBefore17();stabilize17($('queue')||document);lastQueueSig17=queueSig17();if(keep)restoreY17(sc,y)};
const renderPlayingBefore17=renderPlaying;
renderPlaying=function(){const [sc,y]=scrollY17(),keep=currentView==='playing';renderPlayingBefore17();stabilize17($('playing')||document);stampPlaying17();if(keep)restoreY17(sc,y)};
const renderMembersBefore17=renderMembers;
renderMembers=function(){const [sc,y]=scrollY17(),keep=currentView==='members';renderMembersBefore17();stabilize17($('members')||document);bindSearch17();if(keep)restoreY17(sc,y)};

function memberDisplaySig17(id){const m=M(id);return m?[m.id,m.name,m.age,m.cls,m.role,m.type,m.inviter,m.gender,m.state,m.tempOrganizerDay,dailyCount(id)].join('|'):'-'}
function playingSig17(n){
 const g=S.games.find(x=>Number(x.court)===n);return JSON.stringify([courtLabel(n),canGame(),S?.adminBadgeVisibility||'all',viewerIsDeveloper17(),g?g.id:'',g?g.startedAt:'',g?g.players.map(memberDisplaySig17):[]]);
}
function stampPlaying17(){const box=$('playing');if(!box)return;[...box.querySelectorAll('.courtCard')].forEach((c,i)=>c.dataset.v17sig=playingSig17(i+1))}
function syncPlaying17(){
 const box=$('playing');if(!box)return;
 const cards=[...box.querySelectorAll('.courtCard')];if(cards.length!==Number(S.courtCount||0)){renderPlaying();return}
 cards.forEach((card,i)=>{
  const n=i+1,sig=playingSig17(n);if(card.dataset.v17sig===sig)return;
  const g=S.games.find(x=>Number(x.court)===n),body=card.querySelector('.courtBody'),name=card.querySelector('.courtName');
  if(name)name.innerHTML=canGame()?`<button onclick="renameCourt(${n})">${esc(courtLabel(n))}<br><small>✎</small></button>`:esc(courtLabel(n));
  if(body)body.innerHTML=g?gameHtml(g):'<div class="empty">비어 있음</div>';
  card.dataset.v17sig=sig;stabilize17(card);
 });
}

function queueSig17(){
 try{
  const q=sortedQueue().map(id=>[id,memberDisplaySig17(id),waitMins(M(id)),draft.includes(id)]);
  const p=(S.pendingGames||[]).map(g=>[g.id,g.createdAt,(g.players||[]).map(id=>[id,memberDisplaySig17(id),waitMins(M(id))])]);
  return JSON.stringify([q,p,draft,S?.adminBadgeVisibility||'all',canGame(),viewerIsDeveloper17()]);
 }catch{return String(Date.now())}
}
function syncQueue17(){const sig=queueSig17();if(lastQueueSig17!==sig)renderQueue();else stabilize17($('queue')||document)}
['draftClick','draftRemove','clearDraft','recommendDraft','partnerRedo67','partnerKeep67','partnerSwap67','partnerIgnore67','repeatUndo67','repeatKeep67'].forEach(name=>{
 try{const old=window[name]||globalThis[name];if(typeof old!=='function')return;globalThis[name]=function(...args){const r=old.apply(this,args);Promise.resolve(r).finally(()=>{lastQueueSig17=queueSig17();stabilize17($('queue')||document)});return r}}catch{}
});

/* Tablet Korean IME: never replace the search input while a composition is in progress. */
const searchMembersBefore17=window.searchMembers46;
function runSearch17(){if(typeof searchMembersBefore17!=='function'||searchCompose17)return;const v=searchPending17;searchTimer17=0;searchMembersBefore17(v);setTimeout(bindSearch17,0)}
if(typeof searchMembersBefore17==='function')window.searchMembers46=function(v){
 searchPending17=String(v??'');clearTimeout(searchTimer17);
 const ev=window.event;if(searchCompose17||ev?.isComposing)return;
 searchTimer17=setTimeout(runSearch17,180);
};
function bindSearch17(){
 const input=$('memberSearchInput46');if(!input||input.dataset.ime17==='1')return;input.dataset.ime17='1';
 input.addEventListener('compositionstart',()=>{searchCompose17=true;clearTimeout(searchTimer17)});
 input.addEventListener('compositionend',()=>{searchCompose17=false;searchPending17=input.value;clearTimeout(searchTimer17);searchTimer17=setTimeout(runSearch17,20)});
 input.addEventListener('blur',()=>{if(!searchCompose17&&searchTimer17){clearTimeout(searchTimer17);runSearch17()}});
}

/* renderAll now updates only the visible view. Hidden views render when selected, removing periodic full-DOM flashes. */
const renderAllBefore17=renderAll;
renderAll=function(){
 if(!me)return;enforceAuth17();try{renderHeader();renderNav()}catch{}
 if(currentView==='members')renderMembers();else if(currentView==='queue')renderQueue();else if(currentView==='playing'){const box=$('playing');if(box?.children?.length)syncPlaying17();else renderPlaying()}else if(currentView==='stats')renderStats();else if(currentView==='settings')renderSettings();else if(currentView==='groups'&&canManageGroups())renderGroups();
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===currentView));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===currentView));
};

/* Polling still runs in real time, but its legacy renderAll call is suppressed for queue/playing. */
const loadStateBefore17=loadState;
loadState=async function(...args){
 if(actionBusy17)return;
 const smooth=!!T&&(currentView==='queue'||currentView==='playing')&&$(currentView)?.children?.length;
 if(!smooth){const r=await loadStateBefore17(...args);enforceAuth17();return r}
 const saved=renderAll;renderAll=function(){};
 try{
  const r=await loadStateBefore17(...args);enforceAuth17();
  try{renderHeader();renderNav()}catch{}
  if(currentView==='queue')syncQueue17();else if(currentView==='playing')syncPlaying17();
  return r;
 }finally{renderAll=saved}
};

/* Actions keep their original backend route/warnings, but repaint only the current screen after data arrives. */
const actBefore17=act;
act=async function(...args){
 actionBusy17++;const saved=renderAll;renderAll=function(){};
 try{
  const r=await actBefore17(...args);enforceAuth17();
  try{renderHeader();renderNav()}catch{}
  renderAll=saved;
  if(currentView==='queue')renderQueue();else if(currentView==='playing')syncPlaying17();else if(currentView==='members')renderMembers();else if(currentView==='stats')renderStats();else if(currentView==='settings')renderSettings();else if(currentView==='groups'&&canManageGroups())renderGroups();
  return r;
 }finally{renderAll=saved;actionBusy17=Math.max(0,actionBusy17-1)}
};

const renderSettingsBefore17=renderSettings;
renderSettings=function(){renderSettingsBefore17();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.7 · 실시간 무깜빡임 · 아이폰 이름영역 · 태블릿 검색 안정화'});};

if(location.pathname.startsWith('/launch/v1.7'))history.replaceState(null,'','/');
if(me){enforceAuth17();try{stabilize17(document);bindSearch17();lastQueueSig17=queueSig17();stampPlaying17();renderHeader();renderNav()}catch{}}
})();
