(()=>{
const renderSettings61=renderSettings;
renderSettings=function(){
 renderSettings61();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v61'))el.textContent='콕매치 v62 · 회원정보 가로공간 확대 · 게임중 참가자 영역 확장';
 });
};
if(location.pathname.startsWith('/launch/v62'))history.replaceState(null,'','/?loaded=62');
if(me)renderAll();
})();
