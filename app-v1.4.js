(()=>{
const SEMVER14='1.4';
const LEGACY_KEYS14=['kokmatch_update_state_v40','kokmatch_refresh_state','kokmatch_dev_proof_v99','kokmatch_update_state_v41','kokmatch_update_state_v43'];
function clearLegacy14(){
  try{LEGACY_KEYS14.forEach(k=>{localStorage.removeItem(k);sessionStorage.removeItem(k)})}catch{}
  try{document.getElementById('updateBanner56')?.remove()}catch{}
}
clearLegacy14();

async function rootRecovery14(){
  const b=typeof $==='function'?$('forceUpdateBtn'):null;
  if(b){b.disabled=true;b.textContent='앱 복구 및 최신화 중...'}
  try{
    try{localStorage.removeItem('kokmatch_token');localStorage.removeItem('kokmatch_refresh_state');sessionStorage.clear()}catch{}
    try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch{}
    try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}
    location.replace('/?recovery='+encodeURIComponent(SEMVER14)+'&fresh='+Date.now());
  }catch(e){
    if(b){b.disabled=false;b.textContent='↻ 앱 복구/최신화'}
    if(typeof showError==='function')showError(e);else alert(e?.message||'앱 복구에 실패했습니다.');
  }
}
forceUpdateApp=rootRecovery14;
window.kokmatchUpdateSameOrigin43=rootRecovery14;
window.kokmatchRootRecovery=rootRecovery14;

const settingsPrev14=renderSettings;
renderSettings=function(){
  settingsPrev14();const box=typeof $==='function'?$('settings'):null;if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.4 · 루트 복구방식 · 404 재발방지';
  });
  const btn=typeof $==='function'?$('forceUpdateBtn'):null;if(btn)btn.textContent='↻ 앱 복구/최신화';
};

if(new URLSearchParams(location.search).has('recovery')){
  clearLegacy14();
  try{history.replaceState(null,'','/')}catch{}
}
if(me){try{renderHeader();renderNav()}catch{}}
})();