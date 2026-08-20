(()=>{
function queueRole94(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
function genderPerson94(m){const f=m?.gender==='여';return `<span class="genderPerson54 compact54 ${f?'female':'male'}" title="${f?'여':'남'}" aria-label="${f?'여성':'남성'}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`}
function reorderPersonalQueue94(){
 const box=$('queue');if(!box)return;
 [...box.querySelectorAll('.queueCard54 .queueMain47')].forEach(line=>{
  const grade=line.querySelector('.tag'),role=line.querySelector('.roleBadge'),game=line.querySelector('.gamecnt');
  if(grade&&role&&game){grade.insertAdjacentElement('afterend',role);role.insertAdjacentElement('afterend',game)}
 });
}
const renderQueue93=renderQueue;
renderQueue=function(){renderQueue93();reorderPersonalQueue94()};

window.openFillPending=function(pid){
 const pg=S.pendingGames.find(g=>g.id===pid);if(!pg||pg.players.length>=4)return;
 moveCtx={mode:'fill',targetPendingId:pid};
 const q=sortedQueue().slice().sort((a,b)=>dailyCount(a)-dailyCount(b)||waitMins(M(b))-waitMins(M(a))||String(M(a)?.name||'').localeCompare(String(M(b)?.name||''),'ko'));
 const others=S.pendingGames.filter(g=>g.id!==pid&&g.players.length).flatMap(g=>g.players.map(id=>({g,id,m:M(id)}))).filter(x=>x.m);
 openModal(`<h3>빈자리 채우기 · ${pg.players.length}/4명</h3><div class="note">개인 게임대기 또는 다른 편성대기 조에서 한 명을 선택할 수 있습니다.</div><div class="subhead"><b>개인 게임대기</b><span class="tag">${q.length}명</span></div>${q.map((id,i)=>{const m=M(id);if(!m)return'';return `<button class="choiceBtn fillChoice94" onclick="fillFromQueue('${id}')"><span class="fillOrd94">${i+1}</span>${genderPerson94(m)}<span class="fillInfo94"><span class="fillMain94"><b>${esc(m.name)}</b>${ageTag(m)}${queueRole94(m)}<span class="gamecnt">게임 ${dailyCount(id)}회</span></span><span class="meta">${waitMins(m)}분 대기</span></span></button>`}).join('')||'<div class="empty">없음</div>'}<div class="subhead"><b>다른 편성대기 조</b><span class="tag">${others.length}명</span></div>${others.map(x=>`<button class="choiceBtn" onclick="fillFromPending('${x.g.id}','${x.id}')"><b>${esc(x.m.name)} ${ageTag(x.m)} ${queueRole94(x.m)}</b><span class="meta">편성대기 ${S.pendingGames.indexOf(x.g)+1}조 · ${x.g.players.length}/4명</span></button>`).join('')||'<div class="empty">없음</div>'}<button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">취소</button>`)
};

const renderSettings93=renderSettings;
renderSettings=function(){renderSettings93();const box=$('settings');if(box)[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v93'))el.textContent='콕매치 v94 · 개인대기 정보순서/빈자리 선택목록 개선'})};
if(location.pathname.startsWith('/launch/v94'))history.replaceState(null,'','/?loaded=94');
if(me)renderAll();
})();
