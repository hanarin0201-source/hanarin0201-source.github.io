(()=>{
const SEMVER15='1.5';
try{document.getElementById('updateBanner56')?.remove()}catch{}
try{
 ['kokmatch_update_state_v40','kokmatch_update_state_v41','kokmatch_update_state_v43','kokmatch_refresh_state','kokmatch_dev_proof_v99'].forEach(k=>{localStorage.removeItem(k);sessionStorage.removeItem(k)});
}catch{}

async function stableRefresh15(){
 const b=typeof $==='function'?$('forceUpdateBtn'):null;
 if(b){b.disabled=true;b.textContent='새로고침 중...'}
 try{
  try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch{}
  try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}
  location.replace('/?fresh=1.5&t='+Date.now());
 }catch(e){
  if(b){b.disabled=false;b.textContent='↻ 최신화'}
  if(typeof showError==='function')showError(e);
 }
}
forceUpdateApp=stableRefresh15;
window.kokmatchUpdateSameOrigin43=stableRefresh15;
window.kokmatchRootRecovery=stableRefresh15;

const prevSettings15=renderSettings;
renderSettings=function(){
 prevSettings15();const box=typeof $==='function'?$('settings'):null;if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.5 · 무한새로고침 차단 · 수동 최신화'});
 const btn=typeof $==='function'?$('forceUpdateBtn'):null;if(btn)btn.textContent='↻ 최신화';
};

if(new URLSearchParams(location.search).has('recovery')){try{history.replaceState(null,'','/')}catch{}}
if(me){try{renderHeader();renderNav()}catch{}}
})();