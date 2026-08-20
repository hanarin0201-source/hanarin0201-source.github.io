(()=>{
const renderSettings78=renderSettings;
renderSettings=function(){
  renderSettings78();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if((el.textContent||'').includes('콕매치 v78'))el.textContent='콕매치 v79 · 회원명부 정보블록 세로 위치 미세조정';
  });
};
if(location.pathname.startsWith('/launch/v79'))history.replaceState(null,'','/?loaded=79');
if(me)renderAll();
})();
