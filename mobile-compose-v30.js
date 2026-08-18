(()=>{
const APP_VERSION='30';
const REFRESH_STATE_KEY='kokmatch_refresh_state';

function currentView30(){
 const v=document.querySelector('.view.on');
 return v?.id||'settings'
}
function saveRefreshState30(){
 try{
  sessionStorage.setItem(REFRESH_STATE_KEY,JSON.stringify({view:currentView30(),y:Math.max(0,window.scrollY||document.documentElement.scrollTop||0),at:Date.now()}));
  if('scrollRestoration'in history)history.scrollRestoration='manual'
 }catch(e){}
}
function restoreRefreshState30(){
 let st=null;
 try{st=JSON.parse(sessionStorage.getItem(REFRESH_STATE_KEY)||'null')}catch(e){}
 if(!st||Date.now()-Number(st.at||0)>120000)return;
 const view=['members','queue','playing','stats','settings'].includes(st.view)?st.view:'settings';
 const y=Math.max(0,Number(st.y)||0);
 if('scrollRestoration'in history)history.scrollRestoration='manual';
 const activate=()=>{
  const btn=document.querySelector('[data-v="'+view+'"]');
  if(btn)btn.click();
  else{
   document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===view));
   document.querySelectorAll('nav button[data-v]').forEach(x=>x.classList.toggle('on',x.dataset.v===view))
  }
 };
 const place=()=>window.scrollTo(0,y);
 activate();
 requestAnimationFrame(()=>requestAnimationFrame(place));
 setTimeout(()=>{activate();place()},120);
 setTimeout(place,350);
 setTimeout(()=>{place();try{sessionStorage.removeItem(REFRESH_STATE_KEY)}catch(e){}},900)
}

function version30(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v30</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">최신화할 때 현재 탭과 스크롤 위치를 그대로 유지하고 프로그램 파일만 최신 버전으로 다시 불러옵니다.</div>'
}

window.forceUpdateApp=async()=>{
 const b=$('forceUpdateBtn');
 saveRefreshState30();
 if(b){b.disabled=true;b.textContent='최신 버전 확인 중...'}
 const stamp=Date.now();
 try{
  if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}
  if('serviceWorker'in navigator){
   const rs=await navigator.serviceWorker.getRegistrations();
   await Promise.all(rs.map(async r=>{try{await r.update()}catch(e){}try{await r.unregister()}catch(e){}}))
  }
  await fetch('/index.html?km_refresh='+stamp,{cache:'no-store',headers:{'cache-control':'no-cache'}}).catch(()=>null)
 }catch(e){}
 // 특정 버전 번호를 고정하지 않는다. 앞으로도 항상 최신 운영본으로 진입한다.
 location.replace('/?km_refresh='+stamp)
};

const renderBefore30=render;
render=function(){renderBefore30();version30()};
render();
setTimeout(restoreRefreshState30,0);
})();
