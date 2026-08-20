(()=>{
function rgba97(c,a=.085){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';return `rgba(${m[1]},${m[2]},${m[3]},${a})`}
function tintGradeContainers97(root=document){
 const tags=[...root.querySelectorAll('.tag')];
 tags.forEach(tag=>{
  const txt=(tag.textContent||'').trim();if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;
  const cs=getComputedStyle(tag);let base=cs.backgroundColor;if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
  const tint=rgba97(base);if(!tint)return;
  const container=tag.closest('.memberCard73,.memberCard71,.memberCard,.waitCard,.waitRow,.slot54,.pendingSlot54,.player54,.playerCard,.courtPlayer,.pickRow,.candidateRow,.modalRow,.voteMemberRow,.attendeeRow');
  if(container){container.style.backgroundColor=tint;container.style.transition='background-color .15s ease'}
 });
}
function removeVs97(root=document){
 [...root.querySelectorAll('.vs,.vs54,.versus,[class*="vs"]')].forEach(el=>{if(/^vs$/i.test((el.textContent||'').trim()))el.remove()});
 [...root.querySelectorAll('*')].forEach(el=>{if(el.children.length===0&&/^vs$/i.test((el.textContent||'').trim()))el.remove()});
}
function enhance97(){tintGradeContainers97();removeVs97()}
const mo97=new MutationObserver(()=>requestAnimationFrame(enhance97));mo97.observe(document.documentElement,{subtree:true,childList:true});
const oldAll97=renderAll;renderAll=function(){oldAll97();requestAnimationFrame(enhance97)};
const oldSettings97=renderSettings;renderSettings=function(){oldSettings97();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v9[0-6]/.test(e.textContent||''))e.textContent='콕매치 v97 · 급수색 전체화면/게임중 VS 제거'})};
if(location.pathname.startsWith('/launch/v97'))history.replaceState(null,'','/?loaded=97');
if(me){renderAll();setTimeout(enhance97,40)}
})();
