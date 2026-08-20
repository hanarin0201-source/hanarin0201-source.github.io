(()=>{
function rgba99(c,a){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';return `rgba(${m[1]},${m[2]},${m[3]},${a})`}
function alphaForGrade99(txt){
 const t=String(txt||'').trim().toUpperCase();
 if(/^(?:\d{2})?B(?:급)?$/.test(t))return .22;
 if(/^(?:\d{2})?C(?:급)?$/.test(t))return .105;
 return .155;
}
const CONTAINERS99='.memberCard73,.memberCard71,.memberCard,.queueCard54,.queueCard,.composer54 .slot54,.composer .slot,.slot54,.pendingSlot54,.pendingSlot,.playingPlayer53,.player54,.playerCard,.courtPlayer,.choiceBtn,.pickRow,.candidateRow,.partnerSearchRow82,.partnerPickedCard82,.voteMemberRow,.attendeeRow,.pollMemberRow,.memberVoteRow';
function tintAllGrades99(root=document){
 [...root.querySelectorAll('.tag')].forEach(tag=>{
  const txt=(tag.textContent||'').trim();if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;
  const cs=getComputedStyle(tag);let base=cs.backgroundColor;
  if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
  const tint=rgba99(base,alphaForGrade99(txt));if(!tint)return;
  let container=tag.closest(CONTAINERS99);
  if(!container){
    const p=tag.parentElement;
    if(p&&p!==document.body)container=p.closest('button,.card,[class*="slot"],[class*="player"],[class*="member"],[class*="queue"],[class*="row"]')||p;
  }
  if(container){
    container.style.backgroundColor=tint;
    container.style.transition='background-color .15s ease';
    container.dataset.gradeTint='99';
  }
 });
}
function enhance99(){tintAllGrades99()}
const mo99=new MutationObserver(()=>requestAnimationFrame(enhance99));
mo99.observe(document.documentElement,{subtree:true,childList:true});
const oldAll99=renderAll;renderAll=function(){oldAll99();requestAnimationFrame(enhance99)};
const oldSettings99=renderSettings;renderSettings=function(){oldSettings99();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v9[0-8]/.test(e.textContent||''))e.textContent='콕매치 v99 · 급수 배경농도 2단계 강화 · 전 급수배지 영역 적용'})};
if(location.pathname.startsWith('/launch/v99'))history.replaceState(null,'','/?loaded=99');
if(me){renderAll();setTimeout(enhance99,40)}
})();
