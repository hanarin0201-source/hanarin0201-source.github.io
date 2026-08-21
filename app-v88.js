(()=>{
let memberPage88=1;
const MEMBER_PAGE_SIZE88=50;
let rosterFrame88=0;

function ensureMemberRelationPlaceholders88(){
 const box=$('members');if(!box)return;
 for(const card of box.querySelectorAll('.memberCard')){
  const info=card.querySelector('.memberInfo48')||card.children?.[1];if(!info)continue;
  const main=info.querySelector('.memberMainLine45')||info.querySelector('.name');if(!main)continue;
  if(!info.querySelector('.memberRelation83')){
   const row=document.createElement('div');row.className='memberRelation83 memberRelationPlaceholder88';row.innerHTML='&nbsp;';main.insertAdjacentElement('afterend',row);
  }
 }
}
function pagerAnchor88(box){
 const notes=[...box.children].filter(el=>el.classList?.contains('note'));if(notes.length)return notes[notes.length-1];
 const search=[...box.querySelectorAll('input')].find(el=>/검색/.test(el.placeholder||''));return search?.parentElement||box.querySelector('.title')||null;
}
function ensurePager88(){
 const box=$('members');if(!box)return;const cards=[...box.querySelectorAll('.memberCard')],pages=Math.max(1,Math.ceil(cards.length/MEMBER_PAGE_SIZE88));
 if(memberPage88>pages)memberPage88=pages;
 cards.forEach((card,i)=>card.classList.toggle('memberPageHidden88',Math.floor(i/MEMBER_PAGE_SIZE88)+1!==memberPage88));
 let pager=box.querySelector('.memberPager88');if(pages<=1){pager?.remove();return}
 if(!pager){pager=document.createElement('div');pager.className='memberPager88';const anchor=pagerAnchor88(box);if(anchor)anchor.insertAdjacentElement('afterend',pager);else box.prepend(pager)}
 pager.innerHTML=Array.from({length:pages},(_,i)=>i+1).map(n=>`<button type="button" class="memberPageBtn88 ${n===memberPage88?'on':''}" onclick="memberPageGo88(${n})">${n}</button>`).join('');
}
function lightRosterLayout88(){
 cancelAnimationFrame(rosterFrame88);rosterFrame88=requestAnimationFrame(()=>{
  const box=$('members');if(!box)return;try{if(typeof decorateResponsive48==='function')decorateResponsive48()}catch{}void box.offsetHeight;
 });
}
window.memberPageGo88=function(n){memberPage88=Math.max(1,Number(n)||1);ensurePager88();lightRosterLayout88();const box=$('members');if(box&&currentView==='members')box.scrollIntoView({block:'start'})};

const renderMembers87=renderMembers;
renderMembers=function(){renderMembers87();ensureMemberRelationPlaceholders88();ensurePager88();lightRosterLayout88()};

/* v88 used to force multiple layouts on every Members tab entry and ResizeObserver event.
   That caused brief main-thread stalls and dropped rapid nav taps on mobile. Keep tab switching local and immediate. */
const goView87=goView;
goView=function(id){return goView87(id)};

const renderSettings87=renderSettings;
renderSettings=function(){
 renderSettings87();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v87'))el.textContent='콕매치 v88 · 회원명부 50명 페이지 · 경량 렌더링'});
};

if(location.pathname.startsWith('/launch/v88'))history.replaceState(null,'','/?loaded=88');
if(me)renderAll();
})();
