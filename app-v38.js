(()=>{
const UPDATER='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-updater';
const renderSettings37=renderSettings;
renderSettings=function(){
  renderSettings37();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v37'))el.textContent='콕매치 v38 · 최신버전 강제 새로고침 안정화'});
};

async function leaveForUpdater38(from='v38'){
  try{
    if(T){
      await fetch(UPDATER+'?api=logout_all&t='+Date.now(),{method:'POST',headers:{authorization:'Bearer '+T},cache:'no-store'}).catch(()=>null);
    }
  }catch(e){}
  try{localStorage.removeItem('kokmatch_token')}catch(e){}
  try{T=''}catch(e){}
  location.replace(UPDATER+'?from='+encodeURIComponent(from)+'&t='+Date.now());
}

forceUpdateApp=async function(){
  try{saveRefreshState()}catch(e){}
  const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 운영본으로 이동 중...'}
  await leaveForUpdater38('button-v38');
};

// v38~v40 구버전 앱 셸이 다시 실행되면 버튼을 누르지 않아도 최신 운영본으로 탈출한다.
const shellVersion=Number((document.title.match(/v(\d+)/i)||[])[1]||0);
if(shellVersion>0&&shellVersion<=40){
  fetch(UPDATER+'?api=version&t='+Date.now(),{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(x=>{if(Number(x?.version||0)>shellVersion)setTimeout(()=>leaveForUpdater38('auto-v'+shellVersion),80)})
    .catch(()=>{});
}

if(me)renderAll();
})();
