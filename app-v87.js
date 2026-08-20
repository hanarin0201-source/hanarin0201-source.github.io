(()=>{
let firstRoster87=true;
let stabilizing87=false;

function stabilizeRoster87(box){
 if(!box||stabilizing87)return;
 stabilizing87=true;
 box.classList.add('rosterPreparing87');
 const sc=document.scrollingElement||document.documentElement;
 const keepY=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
 requestAnimationFrame(()=>{
  requestAnimationFrame(()=>{
   try{window.dispatchEvent(new Event('resize'))}catch{}
   setTimeout(()=>{
    try{
     const oldDisplay=box.style.display;
     box.style.display='none';
     void document.documentElement.offsetWidth;
     box.style.display=oldDisplay;
     void box.offsetWidth;
     void box.getBoundingClientRect();
     if(sc){
      const max=Math.max(0,sc.scrollHeight-sc.clientHeight);
      if(max>1){
       const bump=Math.min(max,keepY+1);
       sc.scrollTop=bump;
       void document.body.offsetHeight;
       sc.scrollTop=Math.min(max,keepY);
      }
     }
    }catch(e){console.warn('roster paint v87',e)}
    requestAnimationFrame(()=>{
     box.classList.remove('rosterPreparing87');
     stabilizing87=false;
    });
   },110);
  });
 });
}

const renderMembers86=renderMembers;
renderMembers=function(){
 const box=$('members');
 if(firstRoster87&&box)box.classList.add('rosterPreparing87');
 renderMembers86();
 if(firstRoster87){
  firstRoster87=false;
  stabilizeRoster87($('members'));
 }
};

const submitLogin86=submitLogin;
submitLogin=async function(...args){
 try{document.activeElement?.blur()}catch{}
 return await submitLogin86(...args);
};

const renderSettings86=renderSettings;
renderSettings=function(){
 renderSettings86();
 const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v86'))el.textContent='콕매치 v87 · 로그인/새로고침 회원명부 첫 화면 안정화';
 });
};

if(location.pathname.startsWith('/launch/v87'))history.replaceState(null,'','/?loaded=87');
if(me)renderAll();
})();
