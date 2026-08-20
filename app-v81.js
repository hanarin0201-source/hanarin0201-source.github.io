(()=>{
const renderSettings80=renderSettings;
renderSettings=function(){
  renderSettings80();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if((el.textContent||'').includes('콕매치 v80'))el.textContent='콕매치 v81 · 개인대기 이름/대기시간 정리 · 편성대기 가독성 개선';
  });
};
if(location.pathname.startsWith('/launch/v81'))history.replaceState(null,'','/?loaded=81');
if(me)renderAll();
})();
