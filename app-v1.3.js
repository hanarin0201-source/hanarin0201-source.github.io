(()=>{
const SEMVER13='1.3';
const LEGACY_KEYS13=['kokmatch_update_state_v40','kokmatch_refresh_state','kokmatch_dev_proof_v99','kokmatch_update_state_v41','kokmatch_update_state_v43'];
function cleanLegacyUpdateState13(){
  try{LEGACY_KEYS13.forEach(k=>{localStorage.removeItem(k);sessionStorage.removeItem(k)})}catch{}
  try{document.getElementById('updateBanner56')?.remove()}catch{}
}
cleanLegacyUpdateState13();

/* Legacy updater paths must never navigate to the Supabase JSON endpoint again. */
async function semanticUpdate13(){
  const b=typeof $==='function'?$('forceUpdateBtn'):null;
  if(b){b.disabled=true;b.textContent='최신 버전 확인 중...'}
  try{
    const r=await fetch('/latest-version.json?fresh='+Date.now(),{cache:'no-store',headers:{'cache-control':'no-cache','pragma':'no-cache'}});
    const x=await r.json().catch(()=>({}));
    const label=String(x.semanticVersion||x.label||SEMVER13).replace(/^v/i,'');
    if(!/^\d+\.\d+$/.test(label))throw new Error('최신 버전 정보를 확인하지 못했습니다.');
    try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(v=>v.unregister().catch(()=>false)))}}catch{}
    try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}
    location.replace('/refresh/v'+encodeURIComponent(label)+'.html?from='+encodeURIComponent(SEMVER13)+'&fresh='+Date.now());
  }catch(e){
    if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 새로고침'}
    if(typeof showError==='function')showError(e);else alert(e?.message||'최신화에 실패했습니다.');
  }
}
forceUpdateApp=semanticUpdate13;
window.kokmatchUpdateSameOrigin43=semanticUpdate13;

/* If an old page returned from the legacy updater, erase its transition state once. */
if(new URLSearchParams(location.search).has('legacyUpdaterBypass')){
  cleanLegacyUpdateState13();
  try{history.replaceState(null,'','/?recovered=1.3')}catch{}
}

const settingsPrev13=renderSettings;
renderSettings=function(){
  settingsPrev13();const box=typeof $==='function'?$('settings'):null;if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.3 · 구형 업데이터 차단 · 세션 복구';
  });
  const btn=typeof $==='function'?$('forceUpdateBtn'):null;if(btn)btn.textContent='↻ 최신 버전으로 새로고침';
};

if(location.pathname.startsWith('/launch/v1.3'))history.replaceState(null,'','/?loaded=1.3');
if(me){try{renderHeader();renderNav()}catch{}}
})();