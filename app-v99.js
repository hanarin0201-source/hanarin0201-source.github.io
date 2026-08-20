(()=>{
function rgba99(c,a){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';return `rgba(${m[1]},${m[2]},${m[3]},${a})`}
function alphaForGrade99(txt){const t=String(txt||'').trim().toUpperCase();if(/^(?:\d{2})?A(?:급)?$/.test(t))return .24;if(/^(?:\d{2})?B(?:급)?$/.test(t))return .30;if(/^(?:\d{2})?C(?:급)?$/.test(t))return .20;if(/^(?:\d{2})?D(?:급)?$/.test(t))return .24;if(/^(?:\d{2})?E(?:급)?$/.test(t))return .24;return .24}
const CONTAINERS99='.memberCard73,.memberCard71,.memberCard,.queueCard54,.queueCard,.composer54 .slot54,.composer .slot,.slot54,.pendingSlot54,.pendingSlot,.playingPlayer53,.player54,.playerCard,.courtPlayer,.choiceBtn,.pickRow,.candidateRow,.partnerSearchRow82,.partnerPickedCard82,.voteMemberRow,.attendeeRow,.pollMemberRow,.memberVoteRow';
function tintAllGrades99(root=document){[...root.querySelectorAll('.tag')].forEach(tag=>{const txt=(tag.textContent||'').trim();if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;const cs=getComputedStyle(tag);let base=cs.backgroundColor;if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;const tint=rgba99(base,alphaForGrade99(txt));if(!tint)return;let container=tag.closest(CONTAINERS99);if(!container){const p=tag.parentElement;if(p&&p!==document.body)container=p.closest('button,.card,[class*="slot"],[class*="player"],[class*="member"],[class*="queue"],[class*="row"]')||p}if(container){container.style.backgroundColor=tint;container.style.transition='background-color .15s ease';container.dataset.gradeTint='99'}})}
function trimQueueWait99(){const box=$('queue');if(!box)return;[...box.querySelectorAll('.queueCard54 .queueWaitMeta89,.queueCard54 .compactMeta53,.queueCard .meta')].forEach(el=>{const s=(el.textContent||'').trim();if(!s)return;let n=s.replace(/\s*[·•]\s*오늘\s*총\s*\d+\s*분\s*대기(?:중)?/g,'').replace(/오늘\s*총\s*\d+\s*분\s*대기(?:중)?/g,'').trim();if(n!==s)el.textContent=n})}
const DEV_PROOF_KEY99='kokmatch_dev_proof_v99';
function tokenSig99(){return String(T||'').slice(-16)}
function mine99(){const mid=String(me?.memberId||'');if(mid){const m=M(mid);if(m)return m}const n=String(me?.displayName||'').trim();return S?.members?.find?.(m=>String(m?.name||'').trim()===n)||null}
function saveDeveloperProof99(){if(!me||!T)return;try{sessionStorage.setItem(DEV_PROOF_KEY99,JSON.stringify({sig:tokenSig99(),name:String(me.displayName||''),group:String(currentGroupId||group?.groupId||'')}))}catch{}}
function proofDeveloper99(){if(!me||!T)return false;try{const p=JSON.parse(sessionStorage.getItem(DEV_PROOF_KEY99)||'null');if(!p||p.sig!==tokenSig99())return false;if(String(p.name||'')!==String(me.displayName||''))return false;const g=String(currentGroupId||group?.groupId||'');if(p.group&&g&&String(p.group)!==g)return false;return true}catch{return false}}
function sourceDeveloper99(){if(!me)return false;if(me.globalAdmin===true)return true;if(String(me.role||'')==='admin')return true;const mine=mine99();return !!mine&&roleOf(mine)==='admin'}
function restoreDeveloper99(){if(!me)return false;if(sourceDeveloper99()){me.globalAdmin=true;saveDeveloperProof99();return true}if(proofDeveloper99()){me.globalAdmin=true;return true}return false}
const baseCanGame99=canGame;canGame=function(){return restoreDeveloper99()||baseCanGame99()};
const baseCanManageMembers99=canManageMembers;canManageMembers=function(){return restoreDeveloper99()||baseCanManageMembers99()};
const baseCanSetRoles99=canSetRoles;canSetRoles=function(){return restoreDeveloper99()||baseCanSetRoles99()};
const baseCanReset99=canReset;canReset=function(){return restoreDeveloper99()||baseCanReset99()};
const baseCanManageGroups99=canManageGroups;canManageGroups=function(){return restoreDeveloper99()||baseCanManageGroups99()};
function memberSearchActive99(){const box=$('members');if(!box)return false;const inp=[...box.querySelectorAll('input')].find(i=>/검색/.test(i.placeholder||''));return !!String(inp?.value||'').trim()}
let rosterRepairBusy99=false;
function ensureFullDeveloperRoster99(){if(rosterRepairBusy99||currentView!=='members'||!restoreDeveloper99()||memberSearchActive99())return;const box=$('members');if(!box)return;const cards=box.querySelectorAll('.memberCard').length;const total=Array.isArray(S?.members)?S.members.length:0;if(total&&cards<total){rosterRepairBusy99=true;try{renderMembers()}finally{setTimeout(()=>{rosterRepairBusy99=false},0)}}}
function enhance99(){restoreDeveloper99();tintAllGrades99();trimQueueWait99();ensureFullDeveloperRoster99()}
const mo99=new MutationObserver(()=>requestAnimationFrame(enhance99));mo99.observe(document.documentElement,{subtree:true,childList:true});
const oldAll99=renderAll;renderAll=function(){restoreDeveloper99();oldAll99();requestAnimationFrame(enhance99)};
const oldQueue99=renderQueue;renderQueue=function(){restoreDeveloper99();oldQueue99();requestAnimationFrame(()=>{restoreDeveloper99();trimQueueWait99();tintAllGrades99($('queue')||document)})};
const oldMembers99=renderMembers;renderMembers=function(){restoreDeveloper99();oldMembers99();requestAnimationFrame(()=>{restoreDeveloper99();tintAllGrades99($('members')||document)})};
const oldHeader99=renderHeader;renderHeader=function(){restoreDeveloper99();oldHeader99()};
const oldNav99=renderNav;renderNav=function(){restoreDeveloper99();oldNav99()};
const oldSettings99=renderSettings;renderSettings=function(){restoreDeveloper99();oldSettings99();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v9[0-9]/.test(e.textContent||''))e.textContent='콕매치 v99 · 개발자 숨김배지 권한 지속 유지'})};
const oldGoView99=goView;goView=function(id){restoreDeveloper99();oldGoView99(id);requestAnimationFrame(()=>{restoreDeveloper99();if(id==='members'){renderMembers();ensureFullDeveloperRoster99()}});setTimeout(()=>{restoreDeveloper99();if(id==='members')ensureFullDeveloperRoster99()},80)};
const oldLoadState99=loadState;loadState=async function(){await oldLoadState99();restoreDeveloper99();saveDeveloperProof99();if(currentView==='members')setTimeout(ensureFullDeveloperRoster99,0)};
const oldAct99=act;act=async function(...args){restoreDeveloper99();const x=await oldAct99(...args);restoreDeveloper99();return x};
addEventListener('focus',()=>{restoreDeveloper99();if(currentView==='members')setTimeout(ensureFullDeveloperRoster99,0)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){restoreDeveloper99();if(currentView==='members')setTimeout(ensureFullDeveloperRoster99,0)}});
setInterval(()=>{if(me){restoreDeveloper99();if(currentView==='members')ensureFullDeveloperRoster99()}},1200);
if(location.pathname.startsWith('/launch/v99'))history.replaceState(null,'','/?loaded=99');
if(me){restoreDeveloper99();saveDeveloperProof99();renderAll();setTimeout(enhance99,40)}
})();
