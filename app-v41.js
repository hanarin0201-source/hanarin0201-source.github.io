(()=>{
const UPDATER_V41='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-updater';

const renderSettings40=renderSettings;
renderSettings=function(){
  renderSettings40();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{
    if((el.textContent||'').includes('콕매치 v40'))el.textContent='콕매치 v41 · 최신화 시 전원 재로그인 방식';
  });
  const btn=$('forceUpdateBtn');
  if(btn)btn.textContent='↻ 최신 버전으로 업데이트 후 다시 로그인';
};

forceUpdateApp=async function(){
  const b=$('forceUpdateBtn');
  if(b){b.disabled=true;b.textContent='로그인세션 초기화 및 최신화 중...'}
  try{
    if(me?.globalAdmin&&T){
      await fetch(UPDATER_V41+'?api=logout_all&t='+Date.now(),{
        method:'POST',headers:{authorization:'Bearer '+T},cache:'no-store'
      }).catch(()=>null);
    }
  }catch(e){}
  try{localStorage.removeItem('kokmatch_token')}catch(e){}
  try{sessionStorage.clear()}catch(e){}
  try{T=''}catch(e){}
  location.replace(UPDATER_V41+'?from=v41&t='+Date.now());
};

if(location.pathname.startsWith('/launch/v41'))history.replaceState(null,'','/?loaded=41');
if(!location.pathname.startsWith('/versions/')&&/\bv41\b/i.test(document.title)){
  fetch(UPDATER_V41+'?api=version&t='+Date.now(),{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(x=>{if(Number(x?.version||0)>41)setTimeout(()=>forceUpdateApp(),120)})
    .catch(()=>{});
}
if(me)renderAll();
})();
