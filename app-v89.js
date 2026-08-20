(()=>{
function arrangeQueueRelations89(){
 const box=$('queue');if(!box)return;
 [...box.querySelectorAll('.queueCard54')].forEach(card=>{
  const info=card.querySelector('.queueInfo53');if(!info)return;
  const main=info.querySelector('.queueMain47');
  const rel=info.querySelector('.inviteSub45');
  const meta=info.querySelector('.compactMeta53');
  if(rel&&main){
   rel.classList.add('queueRelation89');
   if(rel.previousElementSibling!==main)main.insertAdjacentElement('afterend',rel);
  }
  if(meta)meta.classList.add('queueWaitMeta89');
 });
}
const renderQueue88=renderQueue;
renderQueue=function(){renderQueue88();arrangeQueueRelations89()};

const renderSettings88=renderSettings;
renderSettings=function(){
 renderSettings88();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v88'))el.textContent='콕매치 v89 · 개인 게임대기 파트너/초대자 위치 및 간격 개선';
 });
};

if(location.pathname.startsWith('/launch/v89'))history.replaceState(null,'','/?loaded=89');
if(me)renderAll();
})();
