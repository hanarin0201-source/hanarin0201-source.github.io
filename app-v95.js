(()=>{
function rgba95(c,a=.08){
 const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';
 const [r,g,b]=m.slice(1,4).map(Number);return `rgba(${r},${g},${b},${a})`;
}
function tintMembers95(){
 const box=$('members');if(!box)return;
 [...box.querySelectorAll('.memberCard73,.memberCard71,.memberCard')].forEach(card=>{
  const info=card.querySelector('.memberInfo48')||card.children?.[1]||card;
  const tag=info.querySelector('.memberMainLine45 .tag,.name .tag,.tag');if(!tag)return;
  const cs=getComputedStyle(tag);
  let base=cs.backgroundColor;
  if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
  const tint=rgba95(base,.085);if(tint){info.style.backgroundColor=tint;info.style.borderRadius='12px';info.style.transition='background-color .15s ease'}
 });
}
const renderMembers94=renderMembers;
renderMembers=function(){renderMembers94();requestAnimationFrame(tintMembers95)};
const renderSettings94=renderSettings;
renderSettings=function(){renderSettings94();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if((e.textContent||'').includes('콕매치 v94'))e.textContent='콕매치 v95 · 회원명부 급수색 연한 배경 적용'})};
if(location.pathname.startsWith('/launch/v95'))history.replaceState(null,'','/?loaded=95');
if(me){renderAll();setTimeout(tintMembers95,30)}
})();
