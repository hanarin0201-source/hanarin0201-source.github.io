(()=>{
const ADMIN_V36='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-admin-v36';
const renderSettings37=renderSettings;
renderSettings=function(){
  renderSettings37();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v37'))el.textContent='콕매치 v38 · 최신버전 강제 새로고침 안정화'});
};

forceUpdateApp=async function(){
  saveRefreshState();
  const b=$('forceUpdateBtn');
  if(b){b.disabled=true;b.textContent=me?.globalAdmin?'전체 이용자 최신화 중...':'최신 버전 확인 중...'}
  try{
    if(me?.globalAdmin){
      const r=await fetch(ADMIN_V36,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action:'refresh_all'}),cache:'no-store'});
      const x=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(x.error||'전체 이용자 최신화에 실패했습니다.');
    }
    location.replace('/refresh.html?from=v38&t='+Date.now());
  }catch(e){
    if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 새로고침'}
    showError(e)
  }
};

if(me)renderAll();
})();
