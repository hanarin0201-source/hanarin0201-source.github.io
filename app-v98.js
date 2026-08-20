(()=>{
function rgba98(c,a){const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';return `rgba(${m[1]},${m[2]},${m[3]},${a})`}
function alphaForGrade98(txt){const t=String(txt||'').trim().toUpperCase();if(/^(?:\d{2})?B(?:급)?$/.test(t))return .14;if(/^(?:\d{2})?C(?:급)?$/.test(t))return .045;return .085}
function tintGradeContainers98(root=document){
 [...root.querySelectorAll('.tag')].forEach(tag=>{
  const txt=(tag.textContent||'').trim();if(!/^(?:\d{2})?[A-E](?:급)?$/i.test(txt))return;
  const cs=getComputedStyle(tag);let base=cs.backgroundColor;if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
  const tint=rgba98(base,alphaForGrade98(txt));if(!tint)return;
  const container=tag.closest('.memberCard73,.memberCard71,.memberCard,.queueCard54,.queueCard,.slot54,.pendingSlot54,.playingPlayer53,.pickRow,.candidateRow,.choiceBtn,.voteMemberRow,.attendeeRow');
  if(container){container.style.backgroundColor=tint;container.style.transition='background-color .15s ease'}
 });
}
function stabilizePlaying98(){
 const p=$('playing');if(!p)return;
 p.querySelectorAll('.teams>b').forEach(b=>{if(/^vs$/i.test((b.textContent||'').trim()))b.style.display='none'});
 p.querySelectorAll('.teams').forEach(t=>{void t.offsetWidth});
}
function enhance98(){tintGradeContainers98();stabilizePlaying98()}
const mo98=new MutationObserver(()=>requestAnimationFrame(enhance98));mo98.observe(document.documentElement,{subtree:true,childList:true});
const oldAll98=renderAll;renderAll=function(){oldAll98();requestAnimationFrame(enhance98)};
const oldSettings98=renderSettings;renderSettings=function(){oldSettings98();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v9[0-7]/.test(e.textContent||''))e.textContent='콕매치 v98 · 게임중 레이아웃 복구 · B/C 급수 배경농도 조정'})};
if(location.pathname.startsWith('/launch/v98'))history.replaceState(null,'','/?loaded=98');
if(me){renderAll();setTimeout(enhance98,40)}
})();
