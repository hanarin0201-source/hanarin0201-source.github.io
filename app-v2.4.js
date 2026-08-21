(()=>{
let fastNavLast24={id:'',at:0};

function normalizeView24(id){
 let v=String(id||'');
 if(v==='groups'&&typeof canManageGroups==='function'&&!canManageGroups())v='members';
 return ['members','queue','playing','stats','settings','groups'].includes(v)?v:'members';
}
function fastSwitch24(id){
 const v=normalizeView24(id),now=performance.now();
 if(v===currentView&&now-fastNavLast24.at<350){fastNavLast24={id:v,at:now};return}
 fastNavLast24={id:v,at:now};
 currentView=v;
 const views=document.querySelectorAll('.view');
 for(const el of views)el.classList.toggle('on',el.id===v);
 const buttons=document.querySelectorAll('#nav button[data-v]');
 for(const b of buttons)b.classList.toggle('on',b.dataset.v===v);
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo(0,0)}
 if(v==='groups'&&typeof loadGroups==='function'){
  requestAnimationFrame(()=>setTimeout(()=>{if(currentView==='groups')loadGroups().catch(showError)},0));
 }
}

/* Replace accumulated goView wrappers with a minimal local-only tab switch. */
goView=function(id){fastSwitch24(id)};

function bindFastNav24(){
 const nav=$('nav');if(!nav||nav.dataset.fastNav24==='1')return;
 nav.dataset.fastNav24='1';
 nav.addEventListener('pointerdown',e=>{
  const btn=e.target.closest?.('button[data-v]');if(!btn||!nav.contains(btn))return;
  fastNavLast24={id:String(btn.dataset.v||''),at:performance.now()};
  fastSwitch24(btn.dataset.v);
  btn.classList.add('navPress24');
  setTimeout(()=>btn.classList.remove('navPress24'),120);
 },{passive:true,capture:true});
 nav.addEventListener('click',e=>{
  const btn=e.target.closest?.('button[data-v]');if(!btn||!nav.contains(btn))return;
  const same=String(btn.dataset.v||'')===fastNavLast24.id&&performance.now()-fastNavLast24.at<700;
  if(same){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
 },true);
}

const renderNav23=renderNav;
renderNav=function(){const r=renderNav23();bindFastNav24();return r};
const renderSettings23=renderSettings;
renderSettings=function(){
 renderSettings23();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.4 · 메뉴 즉시전환 · 회원명부 리플로우 경량화'});
};

bindFastNav24();
})();
