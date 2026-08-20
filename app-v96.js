(()=>{
function rgba96(c,a=.085){
 const m=String(c||'').match(/rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/i);if(!m)return'';
 const [r,g,b]=m.slice(1,4).map(Number);return `rgba(${r},${g},${b},${a})`;
}
function tintWholeMemberCards96(){
 const box=$('members');if(!box)return;
 [...box.querySelectorAll('.memberCard73,.memberCard71,.memberCard')].forEach(card=>{
  const info=card.querySelector('.memberInfo48')||card.children?.[1]||card;
  const tag=info.querySelector('.memberMainLine45 .tag,.name .tag,.tag');if(!tag)return;
  const cs=getComputedStyle(tag);
  let base=cs.backgroundColor;
  if(!base||base==='transparent'||/rgba\([^)]*,\s*0\)/.test(base))base=cs.borderTopColor||cs.color;
  const tint=rgba96(base,.085);if(!tint)return;
  card.style.backgroundColor=tint;
  card.style.transition='background-color .15s ease';
  info.style.backgroundColor='transparent';
  const statusZone=card.querySelector('.memberCtl88,.memberControls,.memberBtns')?.parentElement||card.children?.[2];
  if(statusZone)statusZone.style.backgroundColor='transparent';
  const avatar=card.querySelector('.avatar');if(avatar?.parentElement&&avatar.parentElement!==card)avatar.parentElement.style.backgroundColor='transparent';
 });
}
const renderMembers95=renderMembers;
renderMembers=function(){renderMembers95();requestAnimationFrame(tintWholeMemberCards96)};
const renderSettings95=renderSettings;
renderSettings=function(){renderSettings95();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if((e.textContent||'').includes('콕매치 v95'))e.textContent='콕매치 v96 · 회원명부 카드 전체 급수색 배경'})};
if(location.pathname.startsWith('/launch/v96'))history.replaceState(null,'','/?loaded=96');
if(me){renderAll();setTimeout(tintWholeMemberCards96,30)}
})();
