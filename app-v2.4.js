(()=>{
let fastNavLast24={id:'',at:0};

function navItems24(){
 const items=[['members','👥','회원명부'],['queue','▦','게임대기'],['playing','🏸','게임중'],['stats','▥','오늘통계'],['settings','⚙️','설정']];
 if(typeof canManageGroups==='function'&&canManageGroups())items.push(['groups','🏢','모임관리']);
 return items;
}
function normalizeView24(id){
 let v=String(id||'');
 if(v==='groups'&&typeof canManageGroups==='function'&&!canManageGroups())v='members';
 return ['members','queue','playing','stats','settings','groups'].includes(v)?v:'members';
}
function fastSwitch24(id){
 const v=normalizeView24(id),now=performance.now();
 if(v===currentView&&now-fastNavLast24.at<350){fastNavLast24={id:v,at:now};return}
 fastNavLast24={id:v,at:now};currentView=v;
 for(const el of document.querySelectorAll('.view'))el.classList.toggle('on',el.id===v);
 for(const b of document.querySelectorAll('#nav button[data-v]'))b.classList.toggle('on',b.dataset.v===v);
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo(0,0)}
 if(v==='groups'&&typeof loadGroups==='function')requestAnimationFrame(()=>setTimeout(()=>{if(currentView==='groups')loadGroups().catch(showError)},0));
}

/* Tab switches are local UI work. Do not run the older reflow chain. */
goView=function(id){fastSwitch24(id)};

function bindFastNav24(){
 const nav=$('nav');if(!nav||nav.dataset.fastNav24==='1')return;
 nav.dataset.fastNav24='1';
 nav.addEventListener('pointerdown',e=>{
  const btn=e.target.closest?.('button[data-v]');if(!btn||!nav.contains(btn))return;
  fastNavLast24={id:String(btn.dataset.v||''),at:performance.now()};fastSwitch24(btn.dataset.v);
  btn.classList.add('navPress24');setTimeout(()=>btn.classList.remove('navPress24'),120);
 },{passive:true,capture:true});
 nav.addEventListener('click',e=>{
  const btn=e.target.closest?.('button[data-v]');if(!btn||!nav.contains(btn))return;
  const same=String(btn.dataset.v||'')===fastNavLast24.id&&performance.now()-fastNavLast24.at<700;
  if(same){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
 },true);
}

/* Keep the same nav button nodes during polling/renderAll. Replacing innerHTML while a finger is down can drop the click. */
renderNav=function(){
 const nav=$('nav');if(!nav)return;const items=navItems24(),sig=items.map(x=>x[0]).join('|');
 if(nav.dataset.navSig24!==sig){
  nav.className='n'+items.length;
  nav.innerHTML=items.map(([id,ic,tx])=>`<button data-v="${id}" class="${currentView===id?'on':''}" onclick="goView('${id}')"><i>${ic}</i>${tx}</button>`).join('');
  nav.dataset.navSig24=sig;
 }
 nav.className='n'+items.length;
 for(const b of nav.querySelectorAll('button[data-v]'))b.classList.toggle('on',b.dataset.v===currentView);
 bindFastNav24();
};

const renderSettings23=renderSettings;
renderSettings=function(){
 renderSettings23();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.4 · 메뉴 즉시전환 · 하단메뉴 DOM 고정 · 회원명부 리플로우 경량화'});
};

renderNav();
})();
