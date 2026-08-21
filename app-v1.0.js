(()=>{
const DEV_NAME10='박태영';

function myMember10(){
 try{
  const mid=String(me?.memberId||'');
  if(mid){const m=M(mid);if(m)return m}
  const n=String(me?.displayName||'').trim();
  return S?.members?.find?.(m=>String(m?.name||'').trim()===n)||null;
 }catch{return null}
}
function isParkDeveloper10(){
 if(!me||String(me.displayName||'').trim()!==DEV_NAME10)return false;
 const mine=myMember10();
 return me.globalAdmin===true||String(me.role||'')==='admin'||String(mine?.role||'')==='admin';
}
function clampDeveloper10(){
 if(!me)return false;
 const park=isParkDeveloper10();
 if(park){me.globalAdmin=true;return true}
 me.globalAdmin=false;
 if(String(me.role||'')==='admin')me.role='member';
 try{sessionStorage.removeItem('kokmatch_dev_proof_v99')}catch{}
 return false;
}

const roleOfBefore10=roleOf;
roleOf=function(m){
 try{
  if(String(m?.role||'')==='admin'&&String(m?.name||'').trim()!==DEV_NAME10)return 'member';
  return roleOfBefore10(m);
 }catch{return 'member'}
};
canGame=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager'||me.role==='organizer'||me.tempOrganizer)};
canManageMembers=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager'||me.role==='organizer')};
canSetRoles=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager')};
canReset=function(){const d=clampDeveloper10();return !!me&&(d||me.role==='manager')};
canManageGroups=function(){return !!me&&clampDeveloper10()};

function wrapSafe10(name,before=true,after=false){
 try{
  const old=window[name];if(typeof old!=='function')return;
  window[name]=function(...args){if(before)clampDeveloper10();const r=old.apply(this,args);if(after)clampDeveloper10();return r};
 }catch{}
}

const renderHeaderBefore10=renderHeader;
renderHeader=function(){clampDeveloper10();return renderHeaderBefore10()};
const renderNavBefore10=renderNav;
renderNav=function(){clampDeveloper10();return renderNavBefore10()};
const renderMembersBefore10=renderMembers;
renderMembers=function(){clampDeveloper10();return renderMembersBefore10()};
const renderAllBefore10=renderAll;
renderAll=function(){clampDeveloper10();return renderAllBefore10()};
const goViewBefore10=goView;
goView=function(id){clampDeveloper10();const r=goViewBefore10(id);clampDeveloper10();return r};
const loadStateBefore10=loadState;
loadState=async function(...args){const r=await loadStateBefore10(...args);clampDeveloper10();try{renderHeader();renderNav()}catch{}return r};
const actBefore10=act;
act=async function(...args){clampDeveloper10();const r=await actBefore10(...args);clampDeveloper10();return r};

function queueCardId10(card){
 const s=String(card?.getAttribute?.('onclick')||'');
 const m=s.match(/draftClick\(['\"]([^'\"]+)['\"]\)/);return m?String(m[1]):'';
}
function displayRoleBadge10(m){
 if(!m)return'';
 if(m.type==='guest')return '<span class="roleBadge guest45">게스트</span>';
 const r=roleOf(m);
 if(r==='admin')return '<span class="roleBadge role-global">개발자</span>';
 if(r==='manager')return '<span class="roleBadge role-manager">모임장</span>';
 if(r==='organizer')return '<span class="roleBadge role-organizer">운영진</span>';
 if(isTemp(m))return '<span class="roleBadge role-temp">편성자</span>';
 return '<span class="roleBadge role-member44">일반</span>';
}
function relationReserve10(m){
 const inv=m?.type==='guest'?String(m?.inviter||'').trim():'';
 return `<span class="inviteReserve54${inv?' hasInvite54':''}">${inv?`초대 ${esc(inv)}`:'&nbsp;'}</span>`;
}
function patchDraftUi10(){
 try{
  const box=$('queue');if(!box)return;
  const sc=document.scrollingElement||document.documentElement;
  const y=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
  const slots=[...box.querySelectorAll('.composer54 .slot54,.composer .slot')].slice(0,4);
  slots.forEach((el,i)=>{
   const id=draft?.[i],m=id?M(id):null;
   el.classList.toggle('filled',!!m);
   if(m){
    el.innerHTML=`<div class="slotLabel">${i<2?'A팀':'B팀'} ${i%2+1}</div><button class="slotX" onclick="draftRemove(${i})">×</button><div class="slotName slotName53"><span class="compactName53">${esc(m.name)}</span>${ageTag(m)}${displayRoleBadge10(m)}</div><div class="meta compactMeta53">게임 ${dailyCount(id)}회 · ${waitMins(m)}분 대기</div>${relationReserve10(m)}`;
   }else{
    el.innerHTML=`<div class="slotLabel">${i<2?'A팀':'B팀'} ${i%2+1}</div><div class="meta slotEmptyText54">개인 게임대기에서 선택</div><span class="inviteReserve54">&nbsp;</span>`;
   }
  });
  const summary=box.querySelector('.composer54 .pairSummary,.composer .pairSummary');
  if(summary)summary.textContent=pairSummary(draft.filter(Boolean));
  const reg=[...box.querySelectorAll('.composerActs .btn')].find(b=>/대기 등록/.test(b.textContent||''));
  if(reg)reg.disabled=!draft.filter(Boolean).length;
  const selected=new Set(draft.filter(Boolean).map(String));
  [...box.querySelectorAll('.queueCard54,.queueCard53,.queueCard')].forEach(card=>{
   const id=queueCardId10(card);if(!id)return;
   const on=selected.has(id);card.classList.toggle('selected',on);
   const chk=card.querySelector('.queueCheck53')||card.querySelector(':scope > b:last-child');
   if(chk)chk.textContent=on?'✓':'';
  });
  if(sc)sc.scrollTop=y;
  requestAnimationFrame(()=>{if(sc)sc.scrollTop=y});
 }catch(e){console.warn('v1.0 draft ui',e)}
}
function withoutQueueRender10(fn){
 const saved=renderQueue;renderQueue=function(){};
 try{return fn()}finally{renderQueue=saved}
}

try{
 const oldDraftClick=draftClick;
 draftClick=function(id){const r=withoutQueueRender10(()=>oldDraftClick(id));patchDraftUi10();return r};
 const oldDraftRemove=draftRemove;
 draftRemove=function(i){const r=withoutQueueRender10(()=>oldDraftRemove(i));patchDraftUi10();return r};
 const oldClearDraft=clearDraft;
 clearDraft=function(){const r=withoutQueueRender10(()=>oldClearDraft());patchDraftUi10();return r};
 const oldRecommendDraft=recommendDraft;
 recommendDraft=function(){const r=withoutQueueRender10(()=>oldRecommendDraft());patchDraftUi10();return r};
 ['partnerRedo67','partnerKeep67','partnerSwap67','partnerIgnore67','repeatUndo67','repeatKeep67'].forEach(name=>{
  const old=window[name];if(typeof old!=='function')return;
  window[name]=function(...args){const r=withoutQueueRender10(()=>old(...args));patchDraftUi10();return r};
 });
}catch(e){console.warn('v1.0 queue patch disabled',e)}

const renderSettingsBefore10=renderSettings;
renderSettings=function(){
 clampDeveloper10();renderSettingsBefore10();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v(?:\d+|1\.0)/.test(e.textContent||''))e.textContent='콕매치 v1.0 · 실행 안정화 · 게임대기 선택 무깜빡임 · 개발자 박태영 전용'});
};

function enforce10(){
 try{
  if(!me)return;const before=!!me.globalAdmin;const ok=clampDeveloper10();
  if(before&&!ok){renderHeader();renderNav();if(currentView==='members')renderMembers()}
 }catch{}
}
setInterval(enforce10,1200);
addEventListener('focus',enforce10,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)enforce10()});

if(location.pathname.startsWith('/launch/v1.0'))history.replaceState(null,'','/?loaded=1.0');
if(me){try{clampDeveloper10();renderHeader();renderNav()}catch{}}
})();
