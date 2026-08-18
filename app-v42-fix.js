(()=>{
const memberControls42=memberControls;
memberControls=function(m){
  if(roleOf(m)==='admin'&&!me?.globalAdmin)return `<div class="status">${stateLabel(m.state)}</div>`;
  return memberControls42(m);
};

const openMemberModal42=openMemberModal;
openMemberModal=function(m){
  openMemberModal42(m);
  if(m&&roleOf(m)==='manager'&&!me?.globalAdmin&&m.id===me?.memberId){
    const type=$('fmType');if(type){type.value='member';type.disabled=true}
  }
};

// v42에서 업데이트 버튼을 눌러도 PWA 화면이 Supabase 도메인으로 직접 이동하지 않는다.
// Supabase는 최신버전/배포준비 확인 API로만 사용하고, 실제 화면 이동은 같은 kkokmatch.github.io 안에서 처리한다.
const UPDATER_FIX42='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-updater';
function sleepFix42(ms){return new Promise(r=>setTimeout(r,ms))}
async function fetchFix42(url,opts={},ms=3000){const c=new AbortController(),tm=setTimeout(()=>c.abort(),ms);try{return await fetch(url,{...opts,signal:c.signal,cache:'no-store'})}finally{clearTimeout(tm)}}
async function cleanFix42(){
 try{localStorage.removeItem('kokmatch_token');sessionStorage.clear();T=''}catch(e){}
 const w=(async()=>{try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(e){}try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch(e){}})();
 await Promise.race([w,sleepFix42(1500)]);
}
forceUpdateApp=async function(){
 const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 운영본 확인 중...'}
 try{
  const vr=await fetchFix42(UPDATER_FIX42+'?api=version&t='+Date.now(),{},3000),v=await vr.json();if(!vr.ok||!v.launchUrl)throw new Error('최신 버전 정보를 확인하지 못했습니다.');
  const target=new URL(v.launchUrl);if(target.origin!==location.origin)throw new Error('최신 운영본 주소를 확인할 수 없습니다.');
  if(b)b.textContent=`v${v.version} 준비 확인 중...`;
  let ready=false;for(let i=0;i<50;i++){try{const rr=await fetchFix42(UPDATER_FIX42+'?api=ready&t='+Date.now(),{},2500),x=await rr.json();if(rr.ok&&x.ready&&Number(x.version)>=Number(v.version)){ready=true;break}}catch(e){}await sleepFix42(500)}
  if(!ready)throw new Error('최신 운영본 준비 확인이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
  if(me?.globalAdmin&&T){try{await fetchFix42(UPDATER_FIX42+'?api=logout_all&t='+Date.now(),{method:'POST',headers:{authorization:'Bearer '+T}},3000)}catch(e){}}
  await cleanFix42();
  location.replace(target.pathname+'?loginFresh=1&t='+Date.now());
 }catch(e){if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 업데이트 후 다시 로그인'}showError(e)}
};

if(me)renderAll();
})();
