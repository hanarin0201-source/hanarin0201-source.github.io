(()=>{
const renderSettings79=renderSettings;
renderSettings=function(){
  renderSettings79();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if((el.textContent||'').includes('콕매치 v79'))el.textContent='콕매치 v80 · 개인 게임대기 프로필/정보 배열 개선';
  });
};
if(location.pathname.startsWith('/launch/v80'))history.replaceState(null,'','/?loaded=80');
if(me)renderAll();
})();
