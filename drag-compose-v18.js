(()=>{
const APP_VERSION='19';

function addVersionCard(){
  if(document.getElementById('appVersionCard'))return;
  const settings=document.getElementById('settings');
  if(!settings)return;
  const card=document.createElement('div');
  card.id='appVersionCard';
  card.className='card';
  card.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v'+APP_VERSION+'</div></div><span class="tag">업데이트</span></div><button id="forceUpdateBtn" class="btn pri" style="width:100%;margin-top:12px" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button><div class="meta" style="margin-top:8px;line-height:1.55">이전 화면이 남아 있을 때 누르세요. 앱 캐시와 기존 서비스워커를 제거한 뒤 최신 프로그램을 다시 불러옵니다. 로그인 정보와 회원·경기 데이터는 삭제되지 않습니다.</div>';
  const homeCard=[...settings.querySelectorAll('.card')].find(x=>x.textContent.includes('홈 화면에 추가'));
  if(homeCard)settings.insertBefore(card,homeCard);else settings.appendChild(card);
}

window.forceUpdateApp=async function(){
  const btn=document.getElementById('forceUpdateBtn');
  if(btn){btn.disabled=true;btn.textContent='캐시 삭제 및 최신화 중...'}
  try{
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
    }
  }catch(e){console.warn('force update',e)}
  const u=new URL('/',location.origin);
  u.searchParams.set('v',APP_VERSION);
  u.searchParams.set('refresh',Date.now().toString());
  location.replace(u.toString());
};

addVersionCard();

if(!window.__kokmatchDragComposerLoaded){
  window.__kokmatchDragComposerLoaded=true;
  const s=document.createElement('script');
  s.src='/drag-compose-v17.js?v=19';
  s.async=false;
  s.onload=()=>{addVersionCard();document.documentElement.dataset.kokmatchVersion=APP_VERSION};
  s.onerror=()=>{window.__kokmatchDragComposerLoaded=false;console.error('드래그 편성 모듈을 불러오지 못했습니다.')};
  document.body.appendChild(s);
}

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
}
})();
