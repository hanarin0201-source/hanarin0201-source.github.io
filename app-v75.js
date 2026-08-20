(()=>{
const VERSION75=75;
let checkBusy75=false,pendingLatest75=0,refreshing75=false,retryTimer75=0;

function currentVersion75(){return Number(document.documentElement?.dataset?.kokmatchVersion||VERSION75)||VERSION75}
function safeToRefresh75(){
 if(document.hidden)return false;
 if(document.querySelector('#modal.on'))return false;
 const a=document.activeElement;if(a&&/^(INPUT|SELECT|TEXTAREA)$/i.test(a.tagName))return false;
 if(Array.isArray(window.draft)&&window.draft.filter(Boolean).length)return false;
 return true;
}
async function latest75(){
 const r=await fetch(`/latest-version.json?fresh=${Date.now()}`,{cache:'no-store',headers:{'cache-control':'no-cache, no-store','pragma':'no-cache'}});
 if(!r.ok)throw new Error('latest version unavailable');
 const x=await r.json().catch(()=>({}));return Math.max(1,Number(x?.version)||currentVersion75());
}
async function targetReady75(v){
 try{const r=await fetch(`/refresh/v${v}.html?probe=${Date.now()}`,{method:'GET',cache:'no-store',headers:{'cache-control':'no-cache, no-store','pragma':'no-cache'}});return r.ok}catch{return false}
}
function saveRefresh75(){try{if(typeof saveRefreshState==='function')saveRefreshState()}catch{} }
async function purge75(){
 try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}
 try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>{})))}}catch{}
}
async function refreshTo75(v){
 if(refreshing75||v<=currentVersion75())return;
 refreshing75=true;
 try{
  if(!(await targetReady75(v))){refreshing75=false;pendingLatest75=v;scheduleRetry75();return}
  saveRefresh75();await purge75();
  location.replace(`/refresh/v${v}.html?fresh=${Date.now()}&auto=1&from=${currentVersion75()}`);
 }catch(e){console.warn('auto refresh v75',e);refreshing75=false;pendingLatest75=v;scheduleRetry75()}
}
function scheduleRetry75(){
 clearTimeout(retryTimer75);
 retryTimer75=setTimeout(()=>{
  if(pendingLatest75>currentVersion75()&&safeToRefresh75())refreshTo75(pendingLatest75);
  else if(pendingLatest75>currentVersion75())scheduleRetry75();
 },1200);
}
async function check75(){
 if(checkBusy75||refreshing75)return;checkBusy75=true;
 try{
  const v=await latest75(),cur=currentVersion75();
  if(v>cur){pendingLatest75=Math.max(pendingLatest75,v);if(safeToRefresh75())await refreshTo75(pendingLatest75);else scheduleRetry75()}
 }catch(e){console.warn('version check v75',e)}finally{checkBusy75=false}
}

document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check75,120)});
window.addEventListener('focus',()=>setTimeout(check75,120));
setTimeout(check75,1200);
setInterval(check75,10000);

const renderSettings74=renderSettings;
renderSettings=function(){
 renderSettings74();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v74'))el.textContent='콕매치 v75 · 자동 최신버전 감지/새로고침 안정화'});
};
if(location.pathname.startsWith('/launch/v75'))history.replaceState(null,'','/?loaded=75');
if(me)renderAll();
})();
