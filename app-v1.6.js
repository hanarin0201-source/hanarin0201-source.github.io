(()=>{
const SEMVER16='1.6';

function clearLegacyState16(){
 try{
  ['kokmatch_update_state_v40','kokmatch_update_state_v41','kokmatch_update_state_v43','kokmatch_refresh_state','kokmatch_dev_proof_v99','kokmatch_session_reset_v1_1','kokmatch_session_reset_v1_2','kokmatch_recovery_v1_3_done','kokmatch_recovery_v1_4_done','kokmatch_recovery_v1_5_done'].forEach(k=>sessionStorage.removeItem(k));
 }catch{}
 try{document.getElementById('updateBanner56')?.remove()}catch{}
}
clearLegacyState16();

function showLoginInline16(message=''){
 try{localStorage.removeItem('kokmatch_token')}catch{}
 try{T=''}catch{}
 try{me=null}catch{}
 try{reloginBusy=false}catch{}
 try{
  const login=typeof $==='function'?$('login'):null;
  if(login)login.classList.remove('hide');
  if(typeof renderLoginName==='function')renderLoginName();
  if(message){const e=typeof $==='function'?$('loginErr'):null;if(e)e.textContent=message}
 }catch{}
}

/* Session expiry must never navigate. Keep the current document and show login in place. */
reloginLatest=async function(){showLoginInline16('로그인이 만료되어 다시 로그인이 필요합니다.')};

/* Legacy updater entry points are manual-only and never auto-navigate to another service. */
async function manualRefresh16(){
 const b=typeof $==='function'?$('forceUpdateBtn'):null;
 if(b){b.disabled=true;b.textContent='캐시 정리 중...'}
 try{
  try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch{}
  try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}
  location.reload();
 }catch(e){if(b){b.disabled=false;b.textContent='↻ 수동 새로고침'}}
}
forceUpdateApp=manualRefresh16;
window.kokmatchUpdateSameOrigin43=manualRefresh16;
window.kokmatchRootRecovery=manualRefresh16;

/* If a stale token survives from an older cached page, do not let polling create a navigation loop. */
const loadStatePrev16=loadState;
loadState=async function(...args){
 if(!T)return;
 try{return await loadStatePrev16(...args)}catch(e){
  const msg=String(e?.message||'');
  if(/만료|로그인|401/.test(msg)){showLoginInline16('로그인이 만료되어 다시 로그인이 필요합니다.');return}
  throw e;
 }
};

const settingsPrev16=renderSettings;
renderSettings=function(){
 settingsPrev16();const box=typeof $==='function'?$('settings'):null;if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.6 · 자동이동 완전중지 · 세션 인라인 복구'});
 const btn=typeof $==='function'?$('forceUpdateBtn'):null;if(btn){btn.textContent='↻ 수동 새로고침';btn.onclick=manualRefresh16}
};

/* Normalize recovery URLs without reloading the page. */
try{
 const q=new URLSearchParams(location.search);
 if(q.has('recovery')||q.has('relogin')||q.has('legacy')||q.has('from404'))history.replaceState(null,'','/');
}catch{}

if(!T){try{showLoginInline16()}catch{}}
})();