(()=>{
function rgba99(c,a){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';return `rgba(${m[1]},${m[2]},${m[3]},${a})`}
function alphaForGrade99(txt){const t=String(txt||'').trim().toUpperCase();if(/^(?:\d{2})?A(?:급)?$/.test(t))return .24;if(/^(?:\d{2})?B(?:급)?$/.test(t))return .30;if(/^(?:\d{2})?C(?:급)?$/.test(t))return .20;if(/^(?:\d{2})?D(?:급)?$/.test(t))return .24;if(/^(?:\d{2})?E(?:급)?$/.test(t))return .24;return .24}
const CONTAINERS99='.memberCard73,.memberCard71,.memberCard,.queueCard54,.queueCard,.composer54 .slot54,.composer .slot,.slot54,.pendingSlot54,.pendingSlot,.playingPlayer53,.player54,.playerCard,.courtPlayer,.choiceBtn,.pickRow,.candidateRow,.partnerSearchRow82,.partnerPickedCard82,.voteMemberRow,.attendeeRow,.pollMemberRow,.memberVoteRow';
function tintAllGrades99(root=document){[...root.querySelectorAll('.tag')].forEach(tag=>{const txt=(tag.textContent||'').trim();if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;const cs=getComputedStyle(tag);let base=cs.backgroundColor;if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;const tint=rgba99(base,alphaForGrade99(txt));if(!tint)return;let container=tag.closest(CONTAINERS99);if(!container){const p=tag.parentElement;if(p&&p!==document.body)container=p.closest('button,.card,[class*="slot"],[class*="player"],[class*="member"],[class*="queue"],[class*="row"]')||p}if(container){container.style.backgroundColor=tint;container.style.transition='background-color .15s ease';container.dataset.gradeTint='99'}})}
function trimQueueWait99(){const box=$('queue');if(!box)return;[...box.querySelectorAll('.queueCard54 .queueWaitMeta89,.queueCard54 .compactMeta53,.queueCard .meta')].forEach(el=>{const s=(el.textContent||'').trim();if(!s)return;let n=s.replace(/\s*[·•]\s*오늘\s*총\s*\d+\s*분\s*대기(?:중)?/g,'').replace(/오늘\s*총\s*\d+\s*분\s*대기(?:중)?/g,'').trim();if(n!==s)el.textContent=n})}
function isDeveloper99(){if(!me)return false;if(me.globalAdmin===true)return true;const mid=String(me.memberId||'');const mine=mid?M(mid):S?.members?.find?.(m=>String(m?.name||'').trim()===String(me?.displayName||'').trim());return !!mine&&roleOf(mine)==='admin'}
function restoreDeveloper99(){if(isDeveloper99()){me.globalAdmin=true;return true}return false}
const baseCanGame99=canGame;canGame=function(){return restoreDeveloper99()||baseCanGame99()};
const baseCanManageMembers99=canManageMembers;canManageMembers=function(){return restoreDeveloper99()||baseCanManageMembers99()};
const baseCanSetRoles99=canSetRoles;canSetRoles=function(){return restoreDeveloper99()||baseCanSetRoles99()};
const baseCanReset99=canReset;canReset=function(){return restoreDeveloper99()||baseCanReset99()};
const baseCanManageGroups99=canManageGroups;canManageGroups=function(){return restoreDeveloper99()||baseCanManageGroups99()};
function enhance99(){restoreDeveloper99();tintAllGrades99();trimQueueWait99()}
const mo99=new MutationObserver(()=>requestAnimationFrame(enhance99));mo99.observe(document.documentElement,{subtree:true,childList:true});
const oldAll99=renderAll;renderAll=function(){restoreDeveloper99();oldAll99();requestAnimationFrame(enhance99)};
const oldQueue99=renderQueue;renderQueue=function(){restoreDeveloper99();oldQueue99();requestAnimationFrame(()=>{trimQueueWait99();tintAllGrades99($('queue')||document)})};
const oldMembers99=renderMembers;renderMembers=function(){restoreDeveloper99();oldMembers99()};
const oldGoView99=goView;goView=function(id){restoreDeveloper99();oldGoView99(id);if(id==='members')setTimeout(()=>{restoreDeveloper99();renderMembers()},0)};
const oldSettings99=renderSettings;renderSettings=function(){restoreDeveloper99();oldSettings99();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v9[0-9]/.test(e.textContent||''))e.textContent='콕매치 v99 · 개발자 배지 표시와 실제 권한 분리'})};
if(location.pathname.startsWith('/launch/v99'))history.replaceState(null,'','/?loaded=99');
if(me){restoreDeveloper99();renderAll();setTimeout(enhance99,40)}
})();
