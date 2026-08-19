(()=>{
function decorateQueue55(){
 const box=$('queue');if(!box)return;
 [...box.querySelectorAll('.queueCard54 .queueInfo53')].forEach(info=>{
  const inv=info.querySelector('.inviteSub45');
  if(inv){inv.classList.add('queueInviteReserve55');return}
  info.insertAdjacentHTML('beforeend','<span class="inviteSub45 queueInviteReserve55 queueInviteEmpty55">&nbsp;</span>');
 });
}

const renderQueue54=renderQueue;
renderQueue=function(){
 renderQueue54();
 decorateQueue55();
};

const renderSettings54=renderSettings;
renderSettings=function(){
 renderSettings54();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v54'))el.textContent='콕매치 v55 · 대기카드 균형 · X버튼 중앙 · 게임중 레이아웃 개선';
 });
};

if(location.pathname.startsWith('/launch/v55'))history.replaceState(null,'','/?loaded=55');
if(me)renderAll();
})();
