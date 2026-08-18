(()=>{
const APP_VERSION='21';

const st=document.createElement('style');
st.textContent=`
.composePreview{display:block!important;margin-bottom:12px;padding:13px;background:#fff;border:1px solid #bdcaf3;border-radius:17px}.composePreviewHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.composePreviewHead b{font-size:15px}.previewGuide{font-size:11px;color:#667795;line-height:1.5;margin-bottom:10px}.previewGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.previewSlot{min-height:74px;border:1px dashed #c5d0eb;background:#f8faff;border-radius:14px;padding:9px;position:relative;display:flex;align-items:center;gap:8px}.previewSlot.filled{border-style:solid;border-color:#9eb2ea;background:#f1f5ff}.previewSlot.empty{justify-content:center;text-align:center;color:#8a97b4;font-size:12px;font-weight:850}.previewLabel{position:absolute;right:7px;top:6px;font-size:10px;font-weight:900;color:#8090b3}.previewPerson{min-width:0}.previewPerson b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.previewRemove{position:absolute;right:5px;bottom:4px;border:0;background:transparent;color:#9a6170;font-size:18px;line-height:1;padding:6px}.previewActs{display:flex;gap:8px;margin-top:10px}.previewActs .btn{flex:1}.previewActs .btn:disabled{opacity:.45}.versionBtns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.versionBtns .btn{width:100%}.versionLink{text-decoration:none;text-align:center;display:block}.scoreHidden{display:none!important}@media(max-width:420px){.previewSlot{min-height:70px;padding:8px}.previewActs,.versionBtns{grid-template-columns:1fr;display:grid}.previewActs{gap:7px}}
`;
document.head.appendChild(st);

function slotLabel(i){return i<2?'A팀 '+(i+1):'B팀 '+(i-1)}
function setupComposePreview(){
  const q=$('qact');if(!q||q.dataset.v21==='1')return;
  q.dataset.v21='1';q.classList.add('composePreview');
  q.innerHTML='<div class="composePreviewHead"><b>새 게임 편성</b><button class="btn ghost" onclick="openM(\'recModal\')">✨ 추천 구성</button></div><div class="previewGuide">아래 개인 게임대기에서 회원을 누르면 4칸에 차례대로 들어갑니다. 편성대기 등록 전에 4명을 여기서 최종 확인할 수 있습니다.</div><div id="previewGrid" class="previewGrid"></div><div class="previewActs"><button class="btn ghost" onclick="clearComposePreview()">선택 비우기</button><button id="previewDone" class="btn pri" onclick="queueGame()">편성 완료 · 대기 등록</button></div>';
}
window.clearComposePreview=()=>{if(!elev())return;sel=[];recLabel='';render()};
window.removeComposePreview=i=>{if(!elev())return;sel.splice(Number(i),1);recLabel='';render()};
function renderComposePreview(){
  setupComposePreview();const grid=$('previewGrid');if(!grid)return;
  const ids=Array.isArray(sel)?sel.slice(0,4):[];
  grid.innerHTML=Array.from({length:4},(_,i)=>{const id=ids[i],m=id?M(id):null;if(!m)return '<div class="previewSlot empty"><span class="previewLabel">'+slotLabel(i)+'</span>＋ 회원 선택</div>';return '<div class="previewSlot filled">'+avatar(m,true)+'<div class="previewPerson"><b>'+m.name+'</b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(id)+'회</div></div><span class="previewLabel">'+slotLabel(i)+'</span><button class="previewRemove" onclick="removeComposePreview('+i+')" aria-label="선택에서 빼기">×</button></div>'}).join('');
  const done=$('previewDone');if(done)done.disabled=ids.length!==4;
  $('pick').textContent='편성 '+ids.length+' / 4';
}

function updateVersionCard(){
  const card=$('appVersionCard');if(!card)return;
  card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v'+APP_VERSION+'</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button><a class="btn ghost versionLink" href="/versions/">구버전 보기</a></div><div class="meta" style="margin-top:8px;line-height:1.55">기능 변경 전 버전은 별도 보관합니다. 구버전 보기에서 이전 운영 화면을 다시 열 수 있습니다.</div>';
}
window.forceUpdateApp=async()=>{const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='최신 버전 불러오는 중...'}try{if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch(e){console.warn(e)}location.replace('/?v='+APP_VERSION+'&refresh='+Date.now())};

window.requestEndGame=async function(id){
  const g=S.games.find(x=>x.id===id);if(!g)return alert('이미 종료된 경기입니다.');
  const names=(g.players||[]).map(x=>M(x)?.name||'-').join(' · ');
  if(!confirm('정말 이 경기를 종료하시겠습니까?\n\n'+courtLabel(g.court)+'\n'+names))return;
  await action('finish_game',{gameId:id,scoreA:null,scoreB:null});
};
const scoreModal=$('score');if(scoreModal)scoreModal.remove();
const scoreStat=$('stp')?.closest?.('.stat');if(scoreStat)scoreStat.classList.add('scoreHidden');

const prevRender=render;
render=function(){prevRender();renderComposePreview();updateVersionCard();const s=$('stp')?.closest?.('.stat');if(s)s.classList.add('scoreHidden')};

setupComposePreview();renderComposePreview();updateVersionCard();render();
})();
