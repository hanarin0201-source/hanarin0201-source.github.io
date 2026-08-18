(()=>{
const APP_VERSION='28';

const css=document.createElement('style');
css.textContent=`
.roleMark28{display:inline-block;margin-left:5px;border-radius:999px;padding:2px 6px;font-size:10px;font-weight:900;vertical-align:1px;white-space:nowrap}
.roleAdmin28{background:#efe9ff;color:#6540c8}
.roleOrganizer28{background:#e8f1ff;color:#2453d4}
.roleTemp28{background:#fff1d8;color:#9a5a00}
.gamePersonName28{display:inline-flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:1px}
`;
document.head.appendChild(css);

function todayKst28(){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const get=t=>parts.find(x=>x.type===t)?.value||'';
 return get('year')+'-'+get('month')+'-'+get('day')
}
function roleType28(m){
 if(!m)return'';
 if(m.role==='admin')return'admin';
 if(m.role==='organizer')return'organizer';
 if(m.type!=='guest'&&(m.role||'member')==='member'&&m.state!=='out'&&String(m.tempOrganizerDay||'')===todayKst28())return'temp';
 return''
}
function roleBadge28(m){
 const r=roleType28(m);
 if(r==='admin')return'<span class="roleMark28 roleAdmin28">총관리자</span>';
 if(r==='organizer')return'<span class="roleMark28 roleOrganizer28">게임편성자</span>';
 if(r==='temp')return'<span class="roleMark28 roleTemp28">임시편성자</span>';
 return''
}
function addBadge28(el,m){
 if(!el||!m||!roleType28(m)||el.querySelector('.roleMark28'))return;
 el.insertAdjacentHTML('beforeend',roleBadge28(m))
}

// 게임중 화면: 이름 바로 옆에 운영 역할 표시
window.game=function(g){
 const p=(g.players||[]).map(M);
 const person=(m,id)=>m?'<span class="gamePersonName28">'+m.name+roleBadge28(m)+'</span><small>게임 '+dailyCount(id)+'회</small>':'-';
 const canOp=typeof window.gameOp24==='function'?window.gameOp24():elev();
 const edit=canOp?'<button class="btn ghost" onclick="openCourtPicker(\'game\',\''+g.id+'\')">코트변경</button>':'';
 return '<div class="teams"><div class="team">'+person(p[0],g.players[0])+'<br><br>'+person(p[1],g.players[1])+'</div><b>VS</b><div class="team">'+person(p[2],g.players[2])+'<br><br>'+person(p[3],g.players[3])+'</div></div><div class="foot"><span class="meta">'+new Date(g.startedAt).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})+' 시작</span><div class="gameBtns">'+edit+'<button class="btn danger" onclick="requestEndGame(\''+g.id+'\')">경기종료</button></div></div>'
};

function decorateWaiting28(){
 // 개인 게임대기
 const ql=$('ql');
 if(ql){
  const cards=[...ql.querySelectorAll('.queue')];
  cards.forEach((card,i)=>{const id=(S.queue||[])[i],m=M(id),name=card.querySelector('.name');addBadge28(name,m)})
 }
 // 새 게임 편성 4칸
 const preview=$('previewGrid');
 if(preview){
  const filled=[...preview.querySelectorAll('.previewSlot.filled')];
  const ids=(Array.isArray(sel)?sel:[]).slice(0,4);
  filled.forEach((slot,i)=>addBadge28(slot.querySelector('.previewPerson b'),M(ids[i])))
 }
 // 편성대기 조
 const pl=$('pl');
 if(pl){
  const cards=[...pl.querySelectorAll('.pendingCard')];
  cards.forEach((card,gi)=>{
   const pg=(S.pendingGames||[])[gi];if(!pg)return;
   const people=[...card.querySelectorAll('.pendingPerson')];
   people.forEach((el,pi)=>addBadge28(el.querySelector('b'),M((pg.players||[])[pi])))
  })
 }
}

function version28(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v28</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">게임대기·편성대기·게임중 화면에서 총관리자, 게임편성자, 당일 임시편성자를 이름 옆 배지로 표시합니다.</div>'
}
forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister().catch(()=>false)))}}catch(e){}location.replace('/?v=28&refresh='+Date.now())};

const renderBefore28=render;
render=function(){renderBefore28();decorateWaiting28();version28()};
render();
})();
