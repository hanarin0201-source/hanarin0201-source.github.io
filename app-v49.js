(()=>{
function viewportMode49(){
 const w=Math.max(0,window.innerWidth||document.documentElement.clientWidth||0);
 if(w<360)return'fold-cover';
 if(w<480)return'phone';
 if(w<600)return'phone-wide';
 if(w<768)return'fold-open';
 if(w<1024)return'tablet';
 if(w<1200)return'tablet-large';
 return'desktop';
}
function applyViewport49(){
 const root=document.documentElement;
 root.dataset.kokmatchViewport=viewportMode49();
 root.dataset.kokmatchOrientation=(window.innerWidth||0)>=(window.innerHeight||0)?'landscape':'portrait';
}
const renderSettings48=renderSettings;
renderSettings=function(){
 renderSettings48();
 const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v48'))el.textContent='콕매치 v49 · 스마트폰·폴드·태블릿 반응형 최적화';
 });
 applyViewport49();
};
let resizeTimer49=0;
addEventListener('resize',()=>{clearTimeout(resizeTimer49);resizeTimer49=setTimeout(applyViewport49,70)},{passive:true});
addEventListener('orientationchange',()=>setTimeout(applyViewport49,140),{passive:true});
if(window.visualViewport)visualViewport.addEventListener('resize',()=>{clearTimeout(resizeTimer49);resizeTimer49=setTimeout(applyViewport49,70)},{passive:true});
if(location.pathname.startsWith('/launch/v49'))history.replaceState(null,'','/?loaded=49');
applyViewport49();
if(me)renderAll();
})();
