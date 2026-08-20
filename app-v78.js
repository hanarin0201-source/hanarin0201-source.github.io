(()=>{
const renderSettings77=renderSettings;
renderSettings=function(){
  renderSettings77();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if((el.textContent||'').includes('콕매치 v77'))el.textContent='콕매치 v78 · 회원명부 카드 공백 균형 조정';
  });
};
if(location.pathname.startsWith('/launch/v78'))history.replaceState(null,'','/?loaded=78');
if(me)renderAll();
})();
