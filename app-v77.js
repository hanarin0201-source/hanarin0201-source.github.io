(()=>{
const renderSettings76=renderSettings;
renderSettings=function(){
  renderSettings76();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if((el.textContent||'').includes('콕매치 v76'))el.textContent='콕매치 v77 · 회원명부 프로필/정보 위치 조정';
  });
};
if(location.pathname.startsWith('/launch/v77'))history.replaceState(null,'','/?loaded=77');
if(me)renderAll();
})();
