(()=>{
const APP_VERSION='29';

const css=document.createElement('style');
css.textContent=`
/* v27 계열의 단순 역할 배지 형식을 유지하면서 역할별 색만 구분 */
.roleMark28{display:inline-block!important;margin-left:5px!important;border-radius:999px!important;padding:3px 7px!important;font-size:11px!important;font-weight:900!important;vertical-align:1px!important;white-space:nowrap!important;line-height:1.15!important}
.roleAdmin28{background:#fff2bd!important;color:#816000!important;border:1px solid #e5c85f!important}
.roleOrganizer28{background:#e7f7ec!important;color:#167245!important;border:1px solid #a9ddbc!important}
.roleTemp28{background:#fff1d8!important;color:#9a5a00!important;border:1px solid #efd39a!important}
`;
document.head.appendChild(css);

const gameOp29=()=>typeof window.gameOp24==='function'?window.gameOp24():elev();

// 편성대기에서 코트를 지정해 경기를 시작해도 현재 게임대기 화면을 유지한다.
window.chooseCourt=async function(court){
 if(!gameOp29())return;
 if(courtMode==='pending'){
  const pg=S.pendingGames.find(g=>g.id===courtTarget);
  if(!pg)return alert('이미 처리된 편성입니다.');
  const names=(pg.players||[]).map(id=>M(id)?.name||'-').join(' · ');
  if(!confirm(courtLabel(court)+'에 해당 편성대기 게임을 배정하고 경기를 시작하시겠습니까?\n\n'+names))return;
  if(await action('begin_pending_game',{pendingId:courtTarget,court})){
   closeM('courtModal');
   // 탭 전환 없음: 게임대기 화면 그대로 유지
  }
 }else if(courtMode==='game'){
  if(await action('set_game_court',{gameId:courtTarget,court}))closeM('courtModal')
 }
};

// 게임중 화면에서 경기 종료가 성공하면 게임대기 화면으로 자동 이동한다.
window.requestEndGame=async function(id){
 const g=S.games.find(x=>x.id===id);
 if(!g)return alert('이미 종료된 경기입니다.');
 const names=(g.players||[]).map(x=>M(x)?.name||'-').join(' · ');
 if(!confirm('정말 이 경기를 종료하시겠습니까?\n\n'+courtLabel(g.court)+'\n'+names))return;
 if(await action('finish_game',{gameId:id,scoreA:null,scoreB:null})){
  const q=document.querySelector('[data-v="queue"]');
  if(q)q.click()
 }
};

function version29(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v29</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">경기 시작 후 게임대기 화면 유지, 경기 종료 후 게임대기 자동 전환을 적용했습니다. 총관리자는 금색, 게임편성자는 녹색 배지로 표시합니다.</div>'
}
window.forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch(e){}location.replace('/?v=29&refresh='+Date.now())};

const renderBefore29=render;
render=function(){renderBefore29();version29()};
render();
})();
