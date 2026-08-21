(()=>{
const DEV_NAME12='박태영';

function sanitizeAuth12(){
  if(!me)return;
  try{sessionStorage.removeItem('kokmatch_dev_proof_v99')}catch{}
  if(String(me.displayName||'').trim()!==DEV_NAME12){
    me.globalAdmin=false;
    if(String(me.role||'')==='admin')me.role='member';
  }
}
const roleOfPrev12=roleOf;
roleOf=function(m){
  if(String(m?.role||'')==='admin'&&String(m?.name||'').trim()!==DEV_NAME12)return 'member';
  return roleOfPrev12(m);
};
canGame=function(){sanitizeAuth12();return !!me&&(me.globalAdmin===true||me.role==='manager'||me.role==='organizer'||me.tempOrganizer)};
canManageMembers=function(){sanitizeAuth12();return !!me&&(me.globalAdmin===true||me.role==='manager'||me.role==='organizer')};
canSetRoles=function(){sanitizeAuth12();return !!me&&(me.globalAdmin===true||me.role==='manager')};
canReset=function(){sanitizeAuth12();return !!me&&(me.globalAdmin===true||me.role==='manager')};
canManageGroups=function(){sanitizeAuth12();return !!me&&me.globalAdmin===true};

function rgba12(c,a){
  const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);
  if(!m)return'';
  return `rgba(${m[1]},${m[2]},${m[3]},${a})`;
}
function gradeAlpha12(txt){
  const t=String(txt||'').trim().toUpperCase();
  if(/^(?:\d{2})?B(?:급)?$/.test(t))return .30;
  if(/^(?:\d{2})?C(?:급)?$/.test(t))return .20;
  return .24;
}
const GRADE_BOX12='.memberCard73,.memberCard71,.memberCard,.queueCard54,.queueCard,.composer54 .slot54,.composer .slot,.slot54,.pendingSlot54,.pendingSlot,.playingPlayer53,.player54,.playerCard,.courtPlayer,.choiceBtn,.pickRow,.candidateRow,.partnerSearchRow82,.partnerPickedCard82,.voteMemberRow,.attendeeRow,.pollMemberRow,.memberVoteRow';
function tintGrades12(root=document){
  [...root.querySelectorAll('.tag')].forEach(tag=>{
    const txt=(tag.textContent||'').trim();
    if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;
    const cs=getComputedStyle(tag);
    let base=cs.backgroundColor;
    if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
    const tint=rgba12(base,gradeAlpha12(txt));
    if(!tint)return;
    const box=tag.closest(GRADE_BOX12);
    if(box)box.style.backgroundColor=tint;
  });
}
function trimQueueWait12(){
  const box=$('queue');if(!box)return;
  [...box.querySelectorAll('.queueCard54 .queueWaitMeta89,.queueCard54 .compactMeta53,.queueCard .meta')].forEach(el=>{
    const s=(el.textContent||'').trim();
    if(!s)return;
    const n=s.replace(/\s*[·•]\s*오늘\s*총\s*\d+\s*분\s*대기(?:중)?/g,'').replace(/오늘\s*총\s*\d+\s*분\s*대기(?:중)?/g,'').trim();
    if(n!==s)el.textContent=n;
  });
}
function enhance12(root=document){
  sanitizeAuth12();
  tintGrades12(root);
  trimQueueWait12();
}

function queueCardId12(card){
  const s=String(card?.getAttribute?.('onclick')||'');
  const m=s.match(/draftClick\(['\"]([^'\"]+)['\"]\)/);
  return m?String(m[1]):'';
}
function patchDraft12(){
  try{
    const box=$('queue');if(!box)return;
    const sc=document.scrollingElement||document.documentElement;
    const y=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
    const slots=[...box.querySelectorAll('.composer54 .slot54,.composer .slot')].slice(0,4);
    slots.forEach((el,i)=>{
      const id=draft?.[i],m=id?M(id):null;
      el.classList.toggle('filled',!!m);
      if(m){
        el.innerHTML=`<div class="slotLabel">${i<2?'A팀':'B팀'} ${i%2+1}</div><button class="slotX" onclick="draftRemove(${i})">×</button><div class="slotName slotName53"><span class="compactName53">${esc(m.name)}</span>${ageTag(m)}${typeof badge54==='function'?badge54(m):roleBadge(m)}</div><div class="meta compactMeta53">게임 ${dailyCount(id)}회 · ${waitMins(m)}분 대기</div>${typeof inviteReserve54==='function'?inviteReserve54(m):''}`;
      }else{
        el.innerHTML=`<div class="slotLabel">${i<2?'A팀':'B팀'} ${i%2+1}</div><div class="meta slotEmptyText54">개인 게임대기에서 선택</div>${typeof inviteReserve54==='function'?'<span class="inviteReserve54">&nbsp;</span>':''}`;
      }
    });
    const summary=box.querySelector('.composer54 .pairSummary,.composer .pairSummary');
    if(summary)summary.textContent=pairSummary(draft.filter(Boolean));
    const reg=[...box.querySelectorAll('.composerActs .btn')].find(b=>/대기 등록/.test(b.textContent||''));
    if(reg)reg.disabled=!draft.filter(Boolean).length;
    const selected=new Set(draft.filter(Boolean).map(String));
    [...box.querySelectorAll('.queueCard54,.queueCard53,.queueCard')].forEach(card=>{
      const id=queueCardId12(card);if(!id)return;
      const on=selected.has(id);card.classList.toggle('selected',on);
      const chk=card.querySelector('.queueCheck53')||card.querySelector(':scope > b:last-child');
      if(chk)chk.textContent=on?'✓':'';
    });
    tintGrades12(box);
    trimQueueWait12();
    if(sc)sc.scrollTop=y;
    requestAnimationFrame(()=>{if(sc)sc.scrollTop=y});
  }catch(e){console.warn('v1.2 draft patch',e)}
}
function withoutQueueRender12(fn){
  const saved=renderQueue;
  renderQueue=function(){};
  try{return fn()}finally{renderQueue=saved}
}

try{
  const oldDraftClick=draftClick;
  draftClick=function(id){const r=withoutQueueRender12(()=>oldDraftClick(id));patchDraft12();return r};
  const oldDraftRemove=draftRemove;
  draftRemove=function(i){const r=withoutQueueRender12(()=>oldDraftRemove(i));patchDraft12();return r};
  const oldClearDraft=clearDraft;
  clearDraft=function(){const r=withoutQueueRender12(()=>oldClearDraft());patchDraft12();return r};
  const oldRecommendDraft=recommendDraft;
  recommendDraft=function(){const r=withoutQueueRender12(()=>oldRecommendDraft());patchDraft12();return r};
  ['partnerRedo67','partnerKeep67','partnerSwap67','partnerIgnore67','repeatUndo67','repeatKeep67'].forEach(name=>{
    const old=window[name];if(typeof old!=='function')return;
    window[name]=function(...args){const r=withoutQueueRender12(()=>old(...args));patchDraft12();return r};
  });
}catch(e){console.warn('v1.2 queue smooth disabled',e)}

const oldLoadState12=loadState;
loadState=async function(...args){
  const r=await oldLoadState12(...args);
  sanitizeAuth12();
  try{renderHeader();renderNav()}catch{}
  return r;
};
const oldRenderAll12=renderAll;
renderAll=function(){sanitizeAuth12();oldRenderAll12();requestAnimationFrame(()=>enhance12())};
const oldQueue12=renderQueue;
renderQueue=function(){sanitizeAuth12();oldQueue12();requestAnimationFrame(()=>enhance12($('queue')||document))};
const oldMembers12=renderMembers;
renderMembers=function(){sanitizeAuth12();oldMembers12();requestAnimationFrame(()=>tintGrades12($('members')||document))};
const oldSettings12=renderSettings;
renderSettings=function(){
  sanitizeAuth12();oldSettings12();
  const b=$('settings');if(!b)return;
  [...b.querySelectorAll('.meta')].forEach(e=>{
    if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(e.textContent||''))e.textContent='콕매치 v1.2 · 세션복구 · 권한안정화 · 게임대기 무깜빡임';
  });
};

const mo12=new MutationObserver(ms=>{
  if(ms.some(m=>m.type==='childList'&&m.addedNodes.length))requestAnimationFrame(()=>enhance12());
});
mo12.observe(document.documentElement,{subtree:true,childList:true});

addEventListener('focus',()=>{sanitizeAuth12();try{renderHeader();renderNav()}catch{}},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){sanitizeAuth12();try{renderHeader();renderNav()}catch{}}});

if(location.pathname.startsWith('/launch/v1.2'))history.replaceState(null,'','/?loaded=1.2');
if(me){sanitizeAuth12();try{renderHeader();renderNav();enhance12()}catch{}}
})();