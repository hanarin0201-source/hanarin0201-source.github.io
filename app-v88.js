(()=>{
let memberPage88=1;
const MEMBER_PAGE_SIZE88=50;
let rosterStabilizeTimer88=0;
let rosterObserver88=null;
let rosterResizeObserver88=null;

function ensureMemberRelationPlaceholders88(){
 const box=$('members');if(!box)return;
 for(const card of box.querySelectorAll('.memberCard')){
  const info=card.querySelector('.memberInfo48')||card.children?.[1];if(!info)continue;
  const main=info.querySelector('.memberMainLine45')||info.querySelector('.name');if(!main)continue;
  if(!info.querySelector('.memberRelation83')){
   const row=document.createElement('div');
   row.className='memberRelation83 memberRelationPlaceholder88';
   row.innerHTML='&nbsp;';
   main.insertAdjacentElement('afterend',row);
  }
 }
}

function pagerAnchor88(box){
 const direct=[...box.children];
 const notes=direct.filter(el=>el.classList?.contains('note'));
 if(notes.length)return notes[notes.length-1];
 const search=[...box.querySelectorAll('input')].find(el=>/검색/.test(el.placeholder||''));
 return search?.parentElement||box.querySelector('.title')||null;
}
function ensurePager88(){
 const box=$('members');if(!box)return;
 const cards=[...box.querySelectorAll('.memberCard')];
 const pages=Math.max(1,Math.ceil(cards.length/MEMBER_PAGE_SIZE88));
 if(memberPage88>pages)memberPage88=pages;
 cards.forEach((card,i)=>card.classList.toggle('memberPageHidden88',Math.floor(i/MEMBER_PAGE_SIZE88)+1!==memberPage88));
 let pager=box.querySelector('.memberPager88');
 if(pages<=1){pager?.remove();return}
 if(!pager){
  pager=document.createElement('div');pager.className='memberPager88';
  const anchor=pagerAnchor88(box);
  if(anchor)anchor.insertAdjacentElement('afterend',pager);else box.prepend(pager);
 }
 pager.innerHTML=Array.from({length:pages},(_,i)=>i+1).map(n=>`<button type="button" class="memberPageBtn88 ${n===memberPage88?'on':''}" onclick="memberPageGo88(${n})">${n}</button>`).join('');
}
window.memberPageGo88=function(n){
 memberPage88=Math.max(1,Number(n)||1);
 ensurePager88();
 scheduleRosterStabilize88('page');
 const box=$('members');if(box&&currentView==='members')box.scrollIntoView({block:'start'});
};

function hardReflow88(){
 const box=$('members');if(!box||currentView!=='members')return;
 try{if(typeof decorateResponsive48==='function')decorateResponsive48()}catch{}
 const sc=document.scrollingElement||document.documentElement;
 const y=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
 box.classList.add('rosterReflow88');
 void box.offsetWidth;
 for(const card of box.querySelectorAll('.memberCard:not(.memberPageHidden88)'))void card.getBoundingClientRect();
 box.classList.remove('rosterReflow88');
 requestAnimationFrame(()=>{
  void box.offsetHeight;
  const max=Math.max(0,(sc?.scrollHeight||0)-(sc?.clientHeight||0));
  if(sc&&max>1){sc.scrollTop=Math.min(max,y+1);void document.body.offsetHeight;sc.scrollTop=Math.min(max,y)}
 });
}
function scheduleRosterStabilize88(){
 clearTimeout(rosterStabilizeTimer88);
 rosterStabilizeTimer88=setTimeout(()=>{
  hardReflow88();
  requestAnimationFrame(()=>hardReflow88());
  setTimeout(()=>hardReflow88(),90);
  setTimeout(()=>hardReflow88(),220);
 },0);
}
function armRosterObservers88(){
 const box=$('members');if(!box)return;
 if(rosterObserver88)rosterObserver88.disconnect();
 rosterObserver88=new MutationObserver(ms=>{
  if(ms.some(m=>m.type==='childList'))scheduleRosterStabilize88('mutation');
 });
 rosterObserver88.observe(box,{childList:true,subtree:true});
 if(rosterResizeObserver88)rosterResizeObserver88.disconnect();
 if('ResizeObserver'in window){
  rosterResizeObserver88=new ResizeObserver(()=>{if(currentView==='members')scheduleRosterStabilize88('resize-observer')});
  rosterResizeObserver88.observe(box);
 }
}

const renderMembers87=renderMembers;
renderMembers=function(){
 renderMembers87();
 ensureMemberRelationPlaceholders88();
 ensurePager88();
 armRosterObservers88();
 scheduleRosterStabilize88('render');
};

const goView87=goView;
goView=function(id){
 goView87(id);
 if(id==='members'){
  ensureMemberRelationPlaceholders88();
  ensurePager88();
  scheduleRosterStabilize88('view');
 }
};

addEventListener('resize',()=>{if(currentView==='members')scheduleRosterStabilize88('window-resize')},{passive:true});
addEventListener('orientationchange',()=>setTimeout(()=>{if(currentView==='members')scheduleRosterStabilize88('orientation')},80),{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&currentView==='members')scheduleRosterStabilize88('visible')});

const renderSettings87=renderSettings;
renderSettings=function(){
 renderSettings87();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v87'))el.textContent='콕매치 v88 · 회원명부 화면전환 안정화 · 카드높이 통일 · 50명 페이지';
 });
};

if(location.pathname.startsWith('/launch/v88'))history.replaceState(null,'','/?loaded=88');
if(me)renderAll();
})();
