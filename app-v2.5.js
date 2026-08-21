(()=>{
let fastNavLast25={id:'',at:0};
let prewarmKey25='';

function navItems25(){
 const items=[['members','👥','회원명부'],['queue','▦','게임대기'],['playing','🏸','게임중'],['stats','▥','오늘통계'],['settings','⚙️','설정']];
 if(typeof canManageGroups==='function'&&canManageGroups())items.push(['groups','🏢','모임관리']);
 return items;
}
function normalizeView25(id){
 let v=String(id||'');
 if(v==='groups'&&typeof canManageGroups==='function'&&!canManageGroups())v='members';
 return ['members','queue','playing','stats','settings','groups'].includes(v)?v:'members';
}
function renderView25(v){
 try{
  if(v==='members'&&typeof renderMembers==='function')renderMembers();
  else if(v==='queue'&&typeof renderQueue==='function')renderQueue();
  else if(v==='playing'&&typeof renderPlaying==='function')renderPlaying();
  else if(v==='stats'&&typeof renderStats==='function')renderStats();
  else if(v==='settings'&&typeof renderSettings==='function')renderSettings();
  else if(v==='groups'&&typeof renderGroups==='function')renderGroups();
 }catch(e){console.error('view render v2.5',v,e)}
}
function ensureView25(v){
 const box=typeof $==='function'?$(v):document.getElementById(v);
 if(!box||box.children.length||v==='groups')return;
 renderView25(v);
}
function refreshAfterSwitch25(v){
 if(v==='groups'||v==='members')return;
 requestAnimationFrame(()=>{
  if(currentView!==v)return;
  renderView25(v);
  for(const el of document.querySelectorAll('.view'))el.classList.toggle('on',el.id===currentView);
  for(const b of document.querySelectorAll('#nav button[data-v]'))b.classList.toggle('on',b.dataset.v===currentView);
 });
}
function fastSwitch25(id){
 const v=normalizeView25(id),now=performance.now();
 if(v===currentView&&now-fastNavLast25.at<300){fastNavLast25={id:v,at:now};return}
 fastNavLast25={id:v,at:now};
 currentView=v;
 ensureView25(v);
 for(const el of document.querySelectorAll('.view'))el.classList.toggle('on',el.id===v);
 for(const b of document.querySelectorAll('#nav button[data-v]'))b.classList.toggle('on',b.dataset.v===v);
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo(0,0)}
 if(v==='groups'&&typeof loadGroups==='function')requestAnimationFrame(()=>setTimeout(()=>{if(currentView==='groups')loadGroups().catch(showError)},0));
 else refreshAfterSwitch25(v);
}

goView=function(id){fastSwitch25(id)};

function bindFastNav25(){
 const nav=$('nav');if(!nav||nav.dataset.fastNav25==='1')return;
 nav.dataset.fastNav25='1';
 nav.addEventListener('pointerdown',e=>{
  const btn=e.target.closest?.('button[data-v]');if(!btn||!nav.contains(btn))return;
  fastSwitch25(btn.dataset.v);
  btn.classList.add('navPress24');setTimeout(()=>btn.classList.remove('navPress24'),120);
 },{passive:true,capture:true});
 nav.addEventListener('click',e=>{
  const btn=e.target.closest?.('button[data-v]');if(!btn||!nav.contains(btn))return;
  const same=String(btn.dataset.v||'')===fastNavLast25.id&&performance.now()-fastNavLast25.at<700;
  if(same){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
 },true);
}

renderNav=function(){
 const nav=$('nav');if(!nav)return;const items=navItems25(),sig=items.map(x=>x[0]).join('|');
 if(nav.dataset.navSig25!==sig){
  nav.className='n'+items.length;
  nav.innerHTML=items.map(([id,ic,tx])=>`<button data-v="${id}" class="${currentView===id?'on':''}" onclick="goView('${id}')"><i>${ic}</i>${tx}</button>`).join('');
  nav.dataset.navSig25=sig;
 }
 nav.className='n'+items.length;
 for(const b of nav.querySelectorAll('button[data-v]'))b.classList.toggle('on',b.dataset.v===currentView);
 bindFastNav25();
};

function prewarm25(){
 if(!me)return;
 const key=String(currentGroupId||group?.groupId||'default');
 if(prewarmKey25===key)return;
 prewarmKey25=key;
 const jobs=['queue','playing','stats','settings'].filter(v=>{
  const box=$(v);return box&&!box.children.length;
 });
 let i=0;
 const run=()=>{
  if(i>=jobs.length)return;
  const v=jobs[i++];
  if(currentView!==v)renderView25(v);
  if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:180});else setTimeout(run,20);
 };
 if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:120});else setTimeout(run,0);
}

const loadState24=loadState;
loadState=async function(...args){
 const r=await loadState24(...args);
 prewarmKey25='';
 prewarm25();
 return r;
};

const renderSettings24=renderSettings;
renderSettings=function(){
 renderSettings24();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.5 · 게임대기/게임중 즉시렌더 · 메뉴 프리렌더 안정화'});
};

renderNav();
setTimeout(prewarm25,0);
})();
