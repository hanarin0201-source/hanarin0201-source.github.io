(()=>{
const css=`
.qact.dragComposer{display:block;margin-bottom:12px;padding:13px;background:#fff;border:1px solid #bdcaf3;border-radius:17px}
.composeHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.composeHead b{font-size:15px}.composeHead .btn{padding:8px 10px;font-size:12px}
.dragGuide{font-size:11px;color:#6d7b98;line-height:1.5;margin-bottom:10px}.draftGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.draftSlot{min-height:78px;border:2px dashed #c8d2ec;border-radius:14px;background:#f8faff;padding:8px;display:flex;align-items:center;gap:8px;position:relative;transition:.14s ease}.draftSlot.empty{justify-content:center;text-align:center;color:#8b97b3;font-size:12px;font-weight:800}.draftSlot.filled{border-style:solid;border-color:#9db2ec;background:#f1f5ff}.draftSlot.dropHot{border-color:#2453d4;background:#eaf0ff;transform:scale(1.015)}.slotNo{position:absolute;right:7px;top:6px;font-size:10px;font-weight:900;color:#8090b3}.draftPerson{min-width:0}.draftPerson b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.slotRemove{position:absolute;right:5px;bottom:4px;border:0;background:transparent;color:#9a6170;font-size:18px;line-height:1;padding:6px}.composeMeta{font-size:11px;color:#667795;margin:9px 1px 0;line-height:1.45}.composeActs{display:flex;gap:8px;margin-top:10px}.composeActs .btn{flex:1}.composeActs .btn:disabled{opacity:.45}.dragQueue{cursor:grab;user-select:none}.dragQueue:active{cursor:grabbing}.dragHandle{font-size:18px;color:#8391b1;font-weight:900}.dragGhost{position:fixed;z-index:9999;pointer-events:none;display:flex;align-items:center;gap:7px;background:#fff;border:2px solid #2453d4;border-radius:14px;padding:8px 11px;box-shadow:0 10px 28px #15234c33;font-weight:900;transform:translate(-50%,-50%);max-width:190px}.dragGhost .miniav{flex:0 0 auto}
@media(max-width:420px){.draftSlot{min-height:72px;padding:7px}.composeActs{flex-direction:column}.dragGuide{font-size:10px}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

sel=[null,null,null,null];
let recommendAvoid=[],draggingId='',touchState=null,suppressClickUntil=0;
const composer=$('qact');
composer.classList.add('dragComposer');
composer.innerHTML=`<div class="composeHead"><b>새 게임 편성</b><button class="btn ghost" onclick="openM('recModal')">✨ 추천으로 채우기</button></div><div class="dragGuide">개인 게임대기 회원을 아래 4칸으로 끌어놓으세요. 휴대폰은 회원을 잠깐 누른 뒤 드래그하면 됩니다. 회원을 탭하면 첫 빈칸에 빠르게 추가됩니다.</div><div id="draftGrid" class="draftGrid"></div><div id="draftMeta" class="composeMeta"></div><div class="composeActs"><button class="btn ghost" onclick="clearDraft()">편성 비우기</button><button id="draftDone" class="btn pri" onclick="queueGame()" disabled>편성 완료 · 대기 등록</button></div>`;
const repeatSheet=$('repeatModal')?.querySelector('.sheet');
if(repeatSheet){const note=repeatSheet.querySelector('.resetNote');if(note)note.innerHTML='선택한 4명 중 <b>서로 3회 이상 같이 경기한 조합</b>이 있습니다. 반복 편성을 줄이기 위해 아래 방법 중 하나를 선택해주세요.';const acts=repeatSheet.querySelector('.acts');if(acts)acts.innerHTML='<button class="btn ghost" onclick="retryRepeat()">다시 직접 편성</button><button class="btn ghost" onclick="repeatRecommend()">추천으로 다시 편성</button><button class="btn pri" onclick="keepRepeat()">그대로 유지</button>'}

function cleanDraft(){if(!Array.isArray(sel))sel=[];sel=sel.slice(0,4);while(sel.length<4)sel.push(null);const seen=new Set();sel=sel.map(id=>{if(!id||!S.queue.includes(id)||seen.has(id))return null;seen.add(id);return id})}
function filled(){cleanDraft();return sel.filter(Boolean)}
function slotLabel(i){return i<2?'A팀 '+(i+1):'B팀 '+(i-1)}
function renderDraft(){cleanDraft();const grid=$('draftGrid');if(!grid)return;grid.innerHTML=sel.map((id,i)=>{const m=id?M(id):null;if(!m)return '<div class="draftSlot empty" data-slot="'+i+'" ondragover="allowDraftDrop(event)" ondragleave="leaveDraftDrop(event)" ondrop="dropDraftMember(event,'+i+')"><span class="slotNo">'+slotLabel(i)+'</span>＋ 여기에 드롭</div>';return '<div class="draftSlot filled" data-slot="'+i+'" ondragover="allowDraftDrop(event)" ondragleave="leaveDraftDrop(event)" ondrop="dropDraftMember(event,'+i+')">'+avatar(m,true)+'<div class="draftPerson"><b>'+m.name+'</b><div class="meta">'+m.age+m.cls+' · '+m.gender+' · 게임 '+dailyCount(id)+'회</div></div><span class="slotNo">'+slotLabel(i)+'</span><button class="slotRemove" onclick="event.stopPropagation();removeDraft('+i+')" aria-label="편성에서 빼기">×</button></div>'}).join('');const ps=filled();$('pick').textContent='편성 '+ps.length+' / 4';$('draftDone').disabled=ps.length!==4;$('draftMeta').textContent=ps.length>=2?pairSummary(ps):'4명을 채운 뒤 편성 완료를 누르면 반복조합을 확인합니다.';$('recInfo').textContent=recLabel?('추천 기준: '+recLabel):''}
function renderQueueDrag(){cleanDraft();const visible=S.queue.filter(id=>!sel.includes(id));$('qc').textContent=visible.length+'명';$('ql').innerHTML=visible.length?visible.map((id,i)=>{const m=M(id);if(!m)return'';const drag=elev()?' draggable="true" data-drag-member="'+id+'" ondragstart="dragDraftMember(event,\''+id+'\')" ondragend="endDraftDrag(event)" onclick="quickAdd(\''+id+'\')"':'';return '<div class="card queue '+(elev()?'dragQueue':'')+'"'+drag+'><div class="ord">'+(i+1)+'</div>'+avatar(m,true)+'<div><div class="name">'+m.name+tag(m)+dailyTag(id)+'</div><div class="meta">'+m.gender+' · '+mins(m)+'분 대기'+(elev()?' · 끌어서 편성':'')+'</div></div><b class="dragHandle">'+(elev()?'⠿':'')+'</b></div>'}).join(''):'<div class="empty">개인 게임대기 회원이 없습니다.</div>';renderDraft()}
const baseRender=render;
render=function(){baseRender();renderQueueDrag()};
const baseApplyRole=applyRole;
applyRole=function(){baseApplyRole();renderQueueDrag()};
useActionData=function(x){S=x.data;normalizeClient();cleanDraft();render();applyRole()};

function assignDraft(id,idx){if(!elev()||!S.queue.includes(id)||idx<0||idx>3)return;cleanDraft();const old=sel.indexOf(id),target=sel[idx];if(old===idx)return;if(old>=0){sel[old]=target||null}else if(target){const empty=sel.findIndex(x=>!x);if(empty>=0)sel[empty]=target}sel[idx]=id;recLabel='';render()}
window.removeDraft=i=>{if(!elev())return;cleanDraft();sel[i]=null;recLabel='';render()};
window.clearDraft=()=>{if(!elev())return;sel=[null,null,null,null];repeatPlayers=[];recLabel='';render()};
window.quickAdd=id=>{if(Date.now()<suppressClickUntil||!elev())return;cleanDraft();if(sel.includes(id))return;const i=sel.findIndex(x=>!x);if(i<0)return alert('편성칸이 모두 찼습니다. 기존 회원을 빼거나 원하는 칸으로 드래그해주세요.');assignDraft(id,i)};
window.dragDraftMember=(e,id)=>{if(!elev())return;draggingId=id;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',id)};
window.endDraftDrag=e=>{draggingId='';document.querySelectorAll('.draftSlot.dropHot').forEach(x=>x.classList.remove('dropHot'))};
window.allowDraftDrop=e=>{if(!elev())return;e.preventDefault();e.dataTransfer.dropEffect='move';e.currentTarget.classList.add('dropHot')};
window.leaveDraftDrop=e=>e.currentTarget.classList.remove('dropHot');
window.dropDraftMember=(e,i)=>{if(!elev())return;e.preventDefault();e.currentTarget.classList.remove('dropHot');const id=e.dataTransfer.getData('text/plain')||draggingId;if(id)assignDraft(id,i);draggingId=''};

pick=function(id){quickAdd(id)};
recommend=function(mode){if(!elev())return;const pool=S.queue.slice(0,24);if(pool.length<4){closeM('recModal');return alert('게임대기 인원이 4명 이상 필요합니다.')}let best=null,bestScore=Infinity;for(let a=0;a<pool.length-3;a++)for(let b=a+1;b<pool.length-2;b++)for(let c=b+1;c<pool.length-1;c++)for(let d=c+1;d<pool.length;d++){const ids=[pool[a],pool[b],pool[c],pool[d]];let score=comboScore(ids,mode);if(recommendAvoid.length===4&&ids.every(id=>recommendAvoid.includes(id)))score+=1000000;if(score<bestScore){bestScore=score;best=ids}}sel=arrangeTeams(best);recLabel=mode==='grade'?'급수 균형':mode==='gender'?'성비 균형':mode==='new'?'새로운 조합':'종합 균형';recommendAvoid=[];closeM('recModal');render()};
queueGame=async function(forceRepeat=false,players=null){const ps=players?[...players]:filled();if(ps.length!==4)return alert('편성칸에 4명을 모두 넣어주세요.');try{const x=await req('action','POST',{action:'queue_game',players:ps,forceRepeat});S=x.data;normalizeClient();sel=[null,null,null,null];repeatPlayers=[];recLabel='';render();applyRole();document.querySelector('[data-v="queue"]').click();return true}catch(e){if(e.payload?.warning==='repeat_pair'){repeatPlayers=[...ps];$('repeatList').innerHTML=(e.payload.repeatPairs||[]).map(r=>'<div class="repeatPair"><span><b>'+r.aName+' · '+r.bName+'</b><div class="meta">같은 4인 경기 반복</div></span><strong>'+r.count+'회</strong></div>').join('');openM('repeatModal');return false}alert(e.message);await load().catch(()=>{});return false}};
retryRepeat=function(){closeM('repeatModal');repeatPlayers=[];sel=[null,null,null,null];recLabel='';render()};
window.repeatRecommend=()=>{recommendAvoid=[...repeatPlayers];repeatPlayers=[];sel=[null,null,null,null];recLabel='';closeM('repeatModal');render();openM('recModal')};
keepRepeat=async function(){const ps=[...repeatPlayers];closeM('repeatModal');await queueGame(true,ps)};

function clearTouch(){if(!touchState)return;if(touchState.timer)clearTimeout(touchState.timer);touchState.ghost?.remove();document.querySelectorAll('.draftSlot.dropHot').forEach(x=>x.classList.remove('dropHot'));touchState=null}
function touchSlotAt(x,y){const el=document.elementFromPoint(x,y);return el?.closest?.('.draftSlot')||null}
function startTouchDrag(state,card){if(touchState!==state)return;state.active=true;const m=M(state.id);const g=document.createElement('div');g.className='dragGhost';g.innerHTML=avatar(m,true)+'<span>'+m.name+'</span>';document.body.appendChild(g);state.ghost=g;g.style.left=state.x+'px';g.style.top=state.y+'px';if(navigator.vibrate)navigator.vibrate(12)}
$('ql').addEventListener('pointerdown',e=>{if(!elev()||e.pointerType==='mouse')return;const card=e.target.closest('[data-drag-member]');if(!card)return;clearTouch();const state={id:card.dataset.dragMember,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false,ghost:null,timer:null};state.timer=setTimeout(()=>startTouchDrag(state,card),220);touchState=state});
document.addEventListener('pointermove',e=>{const s=touchState;if(!s)return;s.x=e.clientX;s.y=e.clientY;if(!s.active){if(Math.hypot(e.clientX-s.startX,e.clientY-s.startY)>9)clearTouch();return}e.preventDefault();s.ghost.style.left=e.clientX+'px';s.ghost.style.top=e.clientY+'px';document.querySelectorAll('.draftSlot.dropHot').forEach(x=>x.classList.remove('dropHot'));touchSlotAt(e.clientX,e.clientY)?.classList.add('dropHot')},{passive:false});
document.addEventListener('pointerup',e=>{const s=touchState;if(!s)return;if(s.active){e.preventDefault();const slot=touchSlotAt(e.clientX,e.clientY);if(slot)assignDraft(s.id,Number(slot.dataset.slot));suppressClickUntil=Date.now()+450}clearTouch()},{passive:false});
document.addEventListener('pointercancel',clearTouch);

render();
})();
