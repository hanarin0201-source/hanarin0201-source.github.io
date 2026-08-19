(()=>{
const VERSION56=56;
let updateCheckBusy56=false,lastLatest56=VERSION56,autoUpdateTimer56=0;

function currentVersion56(){
 return Number(document.documentElement?.dataset?.kokmatchVersion||VERSION56)||VERSION56;
}
async function fetchLatest56(){
 const stamp=Date.now();
 const r=await fetch(`/latest-version.json?fresh=${stamp}`,{cache:'no-store',headers:{'cache-control':'no-cache','pragma':'no-cache'}});
 if(!r.ok)throw new Error('최신 버전 확인에 실패했습니다.');
 const x=await r.json().catch(()=>({}));
 const v=Math.max(1,Number(x?.version)||VERSION56);lastLatest56=v;return v;
}
async function purgeBrowserCaches56(){
 try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}
 try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>{})))}}catch{}
}
function freshTarget56(v){return `/refresh/v${v}.html?fresh=${Date.now()}&from=${currentVersion56()}`}
function saveState56(){try{if(typeof saveRefreshState==='function')saveRefreshState()}catch{}}
async function goFresh56(v){
 saveState56();
 await purgeBrowserCaches56();
 location.replace(freshTarget56(v));
}
function removeBanner56(){document.getElementById('updateBanner56')?.remove()}
function showBanner56(v){
 if(v<=currentVersion56()){removeBanner56();return}
 let el=document.getElementById('updateBanner56');
 if(!el){el=document.createElement('div');el.id='updateBanner56';el.className='updateBanner56';document.body.appendChild(el)}
 el.innerHTML=`<div><b>새 버전 v${v} 사용 가능</b><br><span>카카오톡을 종료하지 않고 바로 최신화할 수 있습니다.</span></div><button onclick="forceUpdateApp()">지금 업데이트</button>`;
}
function safeToAuto56(){
 if(document.hidden)return false;
 if(document.querySelector('#modal.on'))return false;
 if(document.activeElement&&/^(INPUT|SELECT|TEXTAREA)$/i.test(document.activeElement.tagName))return false;
 if(Array.isArray(draft)&&draft.filter(Boolean).length)return false;
 return true;
}
async function checkLatest56(auto=false){
 if(updateCheckBusy56)return;updateCheckBusy56=true;
 try{
  const latest=await fetchLatest56(),cur=currentVersion56();
  if(latest>cur){
   showBanner56(latest);
   if(auto&&safeToAuto56()){
    clearTimeout(autoUpdateTimer56);
    autoUpdateTimer56=setTimeout(()=>{if(safeToAuto56())goFresh56(latest).catch(()=>{})},900);
   }
  }else removeBanner56();
 }catch(e){console.warn('latest check v56',e)}finally{updateCheckBusy56=false}
}

forceUpdateApp=async function(){
 const b=$('forceUpdateBtn');
 if(b){b.disabled=true;b.textContent='최신 버전 확인 중...'}
 try{
  const latest=await fetchLatest56();
  if(b)b.textContent=`v${latest}로 전환 중...`;
  await goFresh56(latest);
 }catch(e){
  if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 새로고침'}
  showError(e);
 }
};

const renderSettings55=renderSettings;
renderSettings=function(){
 renderSettings55();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  const t=el.textContent||'';
  if(t.includes('콕매치 v55'))el.textContent='콕매치 v56 · 카카오톡 인앱브라우저 강제 최신화';
  if(t.includes('총관리자 최신화 시 본인을 제외한 모든 로그인 세션을 종료합니다.'))el.textContent='최신화 시 현재 로그인 상태를 유지한 채 최신 버전 전용 주소로 전환합니다. 카카오톡 인앱브라우저 캐시도 우회합니다.';
 });
};

document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>checkLatest56(true),250)});
setTimeout(()=>checkLatest56(false),900);
setInterval(()=>checkLatest56(false),30000);
if(location.pathname.startsWith('/launch/v56'))history.replaceState(null,'','/?loaded=56');
if(me)renderAll();
})();
