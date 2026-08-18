(()=>{
const UPDATER_V43='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-updater';
const SETTINGS_V43='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-settings-v43';

function sleep43(ms){return new Promise(r=>setTimeout(r,ms))}
async function fetchTimeout43(url,opts={},ms=3000){
 const c=new AbortController(),tm=setTimeout(()=>c.abort(),ms);
 try{return await fetch(url,{...opts,signal:c.signal,cache:'no-store'})}finally{clearTimeout(tm)}
}
async function latestInfo43(){
 const r=await fetchTimeout43(UPDATER_V43+'?api=version&t='+Date.now(),{},3000);
 const x=await r.json().catch(()=>({}));
 if(!r.ok||!Number(x.version)||!x.launchUrl)throw new Error('최신 버전 정보를 확인하지 못했습니다.');
 return x;
}
async function waitReady43(version){
 for(let i=0;i<50;i++){
  try{
   const r=await fetchTimeout43(UPDATER_V43+'?api=ready&t='+Date.now(),{},2500);
   const x=await r.json().catch(()=>({}));
   if(r.ok&&x.ready&&Number(x.version)>=Number(version))return x;
  }catch(e){}
  await sleep43(500);
 }
 throw new Error('최신 운영본 준비 확인이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
}
async function cleanupLocal43(){
 try{localStorage.removeItem('kokmatch_token')}catch(e){}
 try{sessionStorage.clear()}catch(e){}
 try{T=''}catch(e){}
 const work=(async()=>{
  try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(e){}
  try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch(e){}
 })();
 await Promise.race([work,sleep43(1500)]);
}

window.kokmatchUpdateSameOrigin43=async function(){
 const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 운영본 확인 중...'}
 try{
  const info=await latestInfo43();
  const target=new URL(info.launchUrl);
  if(target.origin!==location.origin)throw new Error('최신 운영본 주소를 확인할 수 없습니다.');
  if(b)b.textContent=`v${info.version} 준비 확인 중...`;
  await waitReady43(info.version);
  if(b)b.textContent='로그인세션 초기화 중...';
  if(me?.globalAdmin&&T){
   try{await fetchTimeout43(UPDATER_V43+'?api=logout_all&t='+Date.now(),{method:'POST',headers:{authorization:'Bearer '+T}},3000)}catch(e){}
  }
  await cleanupLocal43();
  location.replace(target.pathname+'?loginFresh=1&t='+Date.now());
 }catch(e){
  if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 업데이트 후 다시 로그인'}
  showError(e)
 }
};
forceUpdateApp=window.kokmatchUpdateSameOrigin43;

function adminBadgeMode43(){const v=String(S?.adminBadgeVisibility||'all');return ['hidden','staff','all'].includes(v)?v:'all'}
function viewerCanSeeAdminBadge43(){const mode=adminBadgeMode43();if(me?.globalAdmin)return true;if(mode==='all')return true;if(mode==='staff')return me?.role==='manager'||me?.role==='organizer';return false}
const roleBadge42=roleBadge;
roleBadge=function(m){
 if(roleOf(m)==='admin'&& !viewerCanSeeAdminBadge43())return '';
 return roleBadge42(m);
};

async function saveAdminBadge43(mode){
 const r=await fetch(SETTINGS_V43,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action:'set_admin_badge_visibility',groupId:currentGroupId,mode}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'총관리자 배지 설정에 실패했습니다.');return x;
}
window.setAdminBadgeVisibility43=async function(mode){
 if(!me?.globalAdmin)return alert('총관리자만 변경할 수 있습니다.');
 try{const x=await saveAdminBadge43(mode);S=x.data;normalizeClient();renderAll();goView('settings')}catch(e){showError(e)}
};

const renderSettings42=renderSettings;
renderSettings=function(){
 renderSettings42();
 const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v42'))el.textContent='콕매치 v43 · 앱내 최신화 안정화 · 총관리자 배지 공개범위'});
 const btn=$('forceUpdateBtn');if(btn)btn.textContent='↻ 최신 버전으로 업데이트 후 다시 로그인';
 if(!me?.globalAdmin)return;
 if(box.querySelector('.adminBadgeSetting43'))return;
 const mode=adminBadgeMode43();
 const card=document.createElement('div');card.className='card adminBadgeSetting43';
 card.innerHTML=`<b>총관리자 배지 공개범위</b><div class="meta" style="margin:6px 0 10px;line-height:1.6">현재 선택된 모임의 회원명부·게임대기 등에서 총관리자 배지를 누구에게 보여줄지 설정합니다.</div><div class="groupActs"><button class="btn ${mode==='hidden'?'pri':'ghost'}" onclick="setAdminBadgeVisibility43('hidden')">숨김</button><button class="btn ${mode==='staff'?'pri':'ghost'}" onclick="setAdminBadgeVisibility43('staff')">운영진만</button><button class="btn ${mode==='all'?'pri':'ghost'}" onclick="setAdminBadgeVisibility43('all')">전체공개</button></div><div class="meta" style="margin-top:8px">숨김: 총관리자 본인만 · 운영진만: 총관리자/모임관리자/게임편성자 · 전체공개: 모든 이용자</div>`;
 const versionCard=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('프로그램 버전'));
 if(versionCard)box.insertBefore(card,versionCard);else box.appendChild(card);
};

if(location.pathname.startsWith('/launch/v43'))history.replaceState(null,'','/?loaded=43');
if(me)renderAll();
})();
