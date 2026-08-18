(()=>{
const APP_VERSION='18';

function addVersionCard(){
  if(document.getElementById('appVersionCard'))return;
  const settings=document.getElementById('settings');
  if(!settings)return;
  const card=document.createElement('div');
  card.id='appVersionCard';
  card.className='card';
  card.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v'+APP_VERSION+'</div></div><span class="tag">최신화</span></div><button id="forceUpdateBtn" class="btn pri" style="width:100%;margin-top:12px" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button><div class="meta" style="margin-top:8px;line-height:1.55">화면이 이전 버전으로 보일 때 누르세요. 프로그램 캐시를 비우고 최신 파일을 다시 불러옵니다. 로그인 정보와 회원·경기 데이터는 삭제되지 않습니다.</div>';
  const homeCard=[...settings.querySelectorAll('.card')].find(x=>x.textContent.includes('홈 화면에 추가'));
  if(homeCard)settings.insertBefore(card,homeCard);else settings.appendChild(card);
}

window.forceUpdateApp=async function(){
  const btn=document.getElementById('forceUpdateBtn');
  if(btn){btn.disabled=true;btn.textContent='최신 버전 확인 중...'}
  try{
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(async r=>{try{await r.update()}catch{}}));
    }
  }catch(e){console.warn('update refresh',e)}
  const u=new URL(location.href);
  u.searchParams.set('refresh',Date.now().toString());
  location.replace(u.toString());
};

addVersionCard();

// 드래그 편성 본체는 기존 검증된 기능 파일을 새 캐시 키로 직접 불러온다.
if(!window.__kokmatchDragComposerLoaded){
  window.__kokmatchDragComposerLoaded=true;
  const s=document.createElement('script');
  s.src='/drag-compose-v17.js?v=18';
  s.async=false;
  s.onload=()=>{addVersionCard();document.documentElement.dataset.kokmatchVersion=APP_VERSION};
  s.onerror=()=>{window.__kokmatchDragComposerLoaded=false;console.error('드래그 편성 모듈을 불러오지 못했습니다.')};
  document.body.appendChild(s);
}

// 현재 페이지에서도 서비스워커 최신본을 적극적으로 확인한다.
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
}
})();
