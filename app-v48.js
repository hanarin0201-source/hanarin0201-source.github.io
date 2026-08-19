(()=>{
function decorateResponsive48(){
 document.documentElement.dataset.kokmatchViewport=innerWidth<360?'fold-cover':innerWidth<600?'phone':innerWidth<900?'tablet-small':innerWidth<1200?'tablet-large':'desktop';
 [...($('members')?.querySelectorAll('.memberCard')||[])].forEach(card=>{
  const kids=[...card.children];if(kids[1])kids[1].classList.add('memberInfo48');if(kids[2])kids[2].classList.add('memberActions48');
 });
 [...($('queue')?.querySelectorAll('.queueCard')||[])].forEach(card=>{const kids=[...card.children];if(kids[1])kids[1].classList.add('queueInfo48')});
}
const renderMembers47=renderMembers;
renderMembers=function(){renderMembers47();decorateResponsive48()};
const renderQueue47=renderQueue;
renderQueue=function(){renderQueue47();decorateResponsive48()};
const renderPlaying47=renderPlaying;
renderPlaying=function(){renderPlaying47();decorateResponsive48()};
const renderSettings47=renderSettings;
renderSettings=function(){renderSettings47();const box=$('settings');if(box){[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v47'))el.textContent='콕매치 v48 · 전기기 반응형 레이아웃'})}decorateResponsive48()};
let resize48=0;addEventListener('resize',()=>{clearTimeout(resize48);resize48=setTimeout(decorateResponsive48,80)},{passive:true});
addEventListener('orientationchange',()=>setTimeout(decorateResponsive48,160),{passive:true});
if(location.pathname.startsWith('/launch/v48'))history.replaceState(null,'','/?loaded=48');
decorateResponsive48();if(me)renderAll();
})();
