(()=>{
const renderSettings62=renderSettings;
renderSettings=function(){
 renderSettings62();const box=$('settings');if(!box)return;
 [...box.querySelectorAll(':scope > .card')].forEach(card=>{
  if((card.textContent||'').includes('프로그램 버전'))card.classList.add('versionCard63');
 });
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v62'))el.textContent='콕매치 v63 · 회원명부 제어영역 균형 · 운영본 배지 한줄 고정';
 });
};
if(location.pathname.startsWith('/launch/v63'))history.replaceState(null,'','/?loaded=63');
if(me)renderAll();
})();
