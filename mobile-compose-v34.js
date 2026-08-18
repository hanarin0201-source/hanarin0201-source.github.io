(()=>{
const APP_VERSION='34';
const ADMIN_REFRESH_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-admin-refresh';
const REFRESH_STATE_KEY='kokmatch_refresh_state';

function saveRefreshState34(){
 try{
  const v=document.querySelector('.view.on');
  sessionStorage.setItem(REFRESH_STATE_KEY,JSON.stringify({view:v?.id||'settings',y:Math.max(0,window.scrollY||document.documentElement.scrollTop||0),at:Date.now()}));
  if('scrollRestoration'in history)history.scrollRestoration='manual'
 }catch(e){}
}

window.forceUpdateApp=async()=>{
 const b=$('forceUpdateBtn');
 saveRefreshState34();
 if(b){b.disabled=true;b.textContent=isAdmin()?'전체 이용자 최신화 중...':'최신 버전 확인 중...'}
 const stamp=Date.now();
 try{
  if(isAdmin()){
   const r=await fetch(ADMIN_REFRESH_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:'{}',cache:'no-store'});
   const x=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(x.error||'전체 이용자 최신화에 실패했습니다.');
  }
  if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}
  if('serviceWorker'in navigator){
   const rs=await navigator.serviceWorker.getRegistrations();
   await Promise.all(rs.map(async r=>{try{await r.update()}catch(e){}try{await r.unregister()}catch(e){}}))
  }
  await fetch('/index.html?km_refresh='+stamp,{cache:'no-store',headers:{'cache-control':'no-cache'}}).catch(()=>null);
  location.replace('/?km_refresh='+stamp)
 }catch(e){
  if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 새로고침'}
  alert(e?.message||'최신화 중 오류가 발생했습니다.')
 }
};

function version34(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 const note=isAdmin()?'총관리자가 최신화하면 현재 총관리자 세션만 유지하고 다른 모든 이용자를 로그아웃합니다. 다른 이용자는 다시 로그인할 때 최신 운영본으로 접속합니다. 현재 탭과 스크롤 위치는 유지됩니다.':'최신화할 때 현재 탭과 스크롤 위치를 유지하고 프로그램 파일만 최신 운영본으로 다시 불러옵니다.';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v34</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">'+note+'</div>'
}

const renderBefore34=render;
render=function(){renderBefore34();version34()};
render();
})();
