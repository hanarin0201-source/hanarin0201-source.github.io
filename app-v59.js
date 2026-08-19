(()=>{
const renderSettings58=renderSettings;
renderSettings=function(){
 renderSettings58();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v58'))el.textContent='콕매치 v59 · 아이폰 회원명부 우측 제어영역 정리';
 });
};
if(location.pathname.startsWith('/launch/v59'))history.replaceState(null,'','/?loaded=59');
if(me)renderAll();
})();
