(()=>{
const PARTNER66='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v66-api';
const RESET66='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-reset-v66';
let repeatAddCtx66=null,autoWarnQueue66=[],partnerDay66=todayKst();

function partner66(m){
 if(!m||String(m.partnerDay||'')!==todayKst()||!m.partnerId)return null;
 const p=M(String(m.partnerId));if(!p)return null;
 return {id:String(p.id),name:String(p.name||m.partnerName||'')};
}
function relationText66(m){
 const p=partner66(m);if(p)return `파트너 ${p.name}`;
 const inv=m?.type==='guest'?String(m?.inviter||'').trim():'';
 return inv?`초대 ${inv}`:'';
}
function canSetPartner66(m){return !!m&&!!me&&(String(me.memberId||'')===String(m.id)||me.globalAdmin||me.role==='manager'||me.role==='organizer')}
async function partnerRequest66(action,body={}){
 const r=await fetch(PARTNER66,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'파트너 처리에 실패했습니다.')}return x;
}
async function syncPartners66(){if(!me||!T)return;try{const x=await partnerRequest66('partner_sync');if(x.data){S=x.data;normalizeClient();renderAll()}}catch(e){console.warn('partner sync v66',e)}}

window.openPartner66=function(id){
 const m=M(id);if(!m)return;if(!canSetPartner66(m))return alert('본인 또는 관리 가능한 회원의 파트너만 설정할 수 있습니다.');
 const cur=partner66(m);const opts=S.members.filter(x=>String(x.id)!==String(m.id)).map(x=>`<option value="${esc(x.id)}" ${cur&&String(cur.id)===String(x.id)?'selected':''}>${esc(x.name)}${x.type==='guest'?' (게스트)':''}</option>`).join('');
 openModal(`<h3>${esc(m.name)} · 오늘 파트너 설정</h3><div class="note">오늘 하루만 적용되는 1:1 파트너입니다. 선택하면 상대 회원에게도 서로 파트너로 표시됩니다. 기존 파트너가 있으면 새 파트너로 교체됩니다.</div><div class="field"><label>파트너</label><select id="partnerSelect66"><option value="">파트너 없음</option>${opts}</select></div><div class="meta" style="line-height:1.6">자정이 지나면 자동 해제됩니다.<br>리셋의 <b>나. 누적기록 포함 초기화</b> 또는 <b>다. 회원정보 전체 정리 초기화</b>에서도 해제됩니다.</div><div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="savePartner66('${esc(m.id)}')">저장</button></div>`);
};
window.savePartner66=async function(id){
 const partnerId=$('partnerSelect66')?.value||'';try{const x=await partnerRequest66('partner_set',{memberId:id,partnerId});S=x.data;normalizeClient();closeModal();renderAll()}catch(e){showError(e)}
};

function decorateMemberPartners66(){
 const box=$('members');if(!box)return;const cards=[...box.querySelectorAll('.memberCard')];
 cards.forEach((card,i)=>{const m=S.members[i];if(!m)return;const info=card.querySelector('.memberInfo48')||card.children?.[1];if(!info)return;const meta=info.querySelector('.meta');if(meta){meta.querySelectorAll('.inviteInfo45,.relationInfo66').forEach(x=>x.remove());const rel=relationText66(m);if(rel)meta.insertAdjacentHTML('beforeend',` <span class="relationInfo66">· ${esc(rel)}</span>`)}const pair=info.querySelector('.pairBtn');info.querySelector('.partnerSetBtn66')?.remove();if(pair&&canSetPartner66(m))pair.insertAdjacentHTML('afterend',`<button class="pairBtn partnerSetBtn66" onclick="openPartner66('${esc(m.id)}')">파트너 설정</button>`)});
}
const renderMembers65=renderMembers;
renderMembers=function(){renderMembers65();decorateMemberPartners66()};

function setRelationLine66(el,m,reserve=false){if(!el)return;const rel=relationText66(m);el.textContent=rel||'\u00a0';el.classList.toggle('relationEmpty66',!rel);if(rel)el.classList.remove('queueInviteEmpty55');else if(reserve)el.classList.add('queueInviteEmpty55')}
function decorateQueuePartners66(){
 const box=$('queue');if(!box)return;const q=sortedQueue();
 [...box.querySelectorAll('.queueCard54')].forEach((card,i)=>{const m=M(q[i]);if(!m)return;const info=card.querySelector('.queueInfo53');if(!info)return;let line=info.querySelector('.inviteSub45');if(!line){line=document.createElement('span');line.className='inviteSub45 queueInviteReserve55';info.appendChild(line)}setRelationLine66(line,m,true)});
 [...box.querySelectorAll('.composer54 .slot54')].forEach((slot,i)=>{const m=draft?.[i]?M(draft[i]):null;setRelationLine66(slot.querySelector('.inviteReserve54'),m,true)});
 [...box.querySelectorAll('.pendingCard54')].forEach((card,gi)=>{const pg=S.pendingGames?.[gi];if(!pg)return;[...card.querySelectorAll('.pendingSlot54:not(.emptySlot)')].forEach((slot,pi)=>setRelationLine66(slot.querySelector('.inviteReserve54'),M(pg.players?.[pi]),true))});
}
const renderQueue65=renderQueue;
renderQueue=function(){renderQueue65();decorateQueuePartners66()};

function genderName66(m){const female=m?.gender==='여',label=female?'여성':'남성';return `<span class="nameGender58 ${female?'female':'male'}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`}
function badge66(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
playerLine=function(id){const m=M(id);if(!m)return'-';const rel=relationText66(m);return `<div class="p playingPlayer53 playingPlayer57"><div class="playingMain53 playingMain58"><span class="playingGender58">${genderName66(m)}</span><span class="playingName53">${esc(m.name)}</span>${ageTag(m)}<span class="playingRole58">${badge66(m)}</span></div><div class="meta playingMeta53">게임 ${dailyCount(id)}회${rel?` · ${esc(rel)}`:''}</div></div>`};

function dailyPairCount66(a,b){return S.history.filter(h=>Array.isArray(h.players)&&h.players.includes(a)&&h.players.includes(b)).length}
function repeatPairsFor66(id,others){const m=M(id);return others.map(oid=>({id:oid,name:M(oid)?.name||'-',count:dailyPairCount66(id,oid),newName:m?.name||'-'})).filter(x=>x.count>=3)}
function showRepeatAdd66(id,slot,repeats,auto=false){repeatAddCtx66={id,slot,repeats,auto};openModal(`<h3>같이한 게임 확인</h3><div class="warn"><b>${esc(M(id)?.name||'-')}</b>님과 이미 오늘 3게임 이상 같이 한 회원이 있습니다.<br>다른 인원을 넣을지, 그대로 편성할지 선택해주세요.</div>${repeats.map(r=>`<div class="card between repeatPair66"><div><b>${esc(r.name)} · ${esc(r.newName)}</b><div class="meta">오늘 같이 완료한 게임</div></div><span class="tag">${r.count}게임</span></div>`).join('')}<div class="acts"><button class="btn ghost" onclick="repeatDifferent66()">다른 인원 넣기</button><button class="btn pri" onclick="repeatKeep66()">그대로 넣기</button></div>`)}
window.repeatDifferent66=function(){const c=repeatAddCtx66;if(c&&draft[c.slot]===c.id)draft[c.slot]=null;repeatAddCtx66=null;autoWarnQueue66=[];closeModal();renderQueue()};
window.repeatKeep66=function(){const auto=!!repeatAddCtx66?.auto;repeatAddCtx66=null;closeModal();renderQueue();if(auto)setTimeout(showNextAutoWarn66,80)};

draftClick=function(id){if(!canGame())return;const idx=draft.indexOf(id);if(idx>=0){draft[idx]=null;renderQueue();return}const slot=draft.findIndex(x=>!x);if(slot<0)return alert('새 게임 편성은 최대 4명까지 선택할 수 있습니다.');const prior=draft.filter(Boolean);draft[slot]=id;renderQueue();const repeats=repeatPairsFor66(id,prior);if(repeats.length)showRepeatAdd66(id,slot,repeats,false)};

const recommendDraft65=recommendDraft;
recommendDraft=function(){recommendDraft65();autoWarnQueue66=[];for(let j=1;j<draft.length;j++){const id=draft[j];if(!id)continue;const prior=draft.slice(0,j).filter(Boolean),repeats=repeatPairsFor66(id,prior);if(repeats.length)autoWarnQueue66.push({id,slot:j,repeats})}setTimeout(showNextAutoWarn66,80)};
function showNextAutoWarn66(){if(repeatAddCtx66)return;while(autoWarnQueue66.length){const c=autoWarnQueue66.shift();if(draft[c.slot]===c.id){showRepeatAdd66(c.id,c.slot,c.repeats,true);return}}}

/* Once a draft is accepted into pending, repeat warnings stay silent until the next new draft selection. */
const act65=act;
act=async function(action,body={},opts={}){const silent=new Set(['create_pending','add_to_pending','move_pending_member','swap_pending_queue','swap_pending_players']);return act65(action,silent.has(action)?{...body,forceRepeat:true}:body,opts)};

async function callReset66(action,pin){const r=await fetch(RESET66,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,pin}),cache:'no-store'});const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'초기화에 실패했습니다.');return x}
function resetRole66(){return me?.globalAdmin?'총관리자':me?.role==='manager'?'모임관리자':'게임편성자'}
window.resetTier40=async function(action){const allowed=action==='reset_daily'?(me?.globalAdmin||me?.role==='manager'||me?.role==='organizer'):action==='reset_cumulative'?(me?.globalAdmin||me?.role==='manager'):(me?.globalAdmin||me?.role==='manager');if(!allowed)return alert('해당 초기화 권한이 없습니다.');const pin=prompt(`${resetRole66()} PIN을 입력해주세요.`);if(pin===null||!pin.trim())return;const labels={reset_daily:'당일 게임 기록 및 로그인세션',reset_cumulative:'당일 기록·누적기록·파트너 설정',reset_roster:'회원정보 전체 정리·파트너 설정'};if(!confirm(`${group?.name||'현재 모임'}의 ${labels[action]}을(를) 초기화하시겠습니까?`))return;try{const x=await callReset66(action,pin.trim());if(me?.globalAdmin){S=x.data;normalizeClient();renderAll();goView('settings');alert('초기화를 완료했습니다.')}else{localStorage.removeItem(TOKEN_KEY);T='';location.replace('/launch/v66.html?afterReset='+Date.now())}}catch(e){showError(e)}};
window.resetRoster60=async function(){if(!(me?.globalAdmin||me?.role==='manager'))return alert('모임관리자 이상 권한이 필요합니다.');const pin=prompt(`${me?.globalAdmin?'총관리자':'모임관리자'} PIN을 입력해주세요.`);if(pin===null||!pin.trim())return;if(!confirm(`${group?.name||'현재 모임'}의 회원정보를 전체 정리하시겠습니까?\n총관리자와 모임관리자는 유지되고 파트너 설정도 초기화됩니다.`))return;try{const x=await callReset66('reset_roster',pin.trim());if(me?.globalAdmin){S=x.data;normalizeClient();renderAll();goView('settings');alert(`회원정보 정리 완료 · 삭제 ${Number(x.removedCount)||0}명`)}else{localStorage.removeItem(TOKEN_KEY);T='';location.replace('/launch/v66.html?afterReset='+Date.now())}}catch(e){showError(e)}};

const renderSettings65=renderSettings;
renderSettings=function(){renderSettings65();const box=$('settings');if(!box)return;box.querySelector('.partnerCard66')?.remove();const mine=me?.memberId?M(me.memberId):null;if(mine){const p=partner66(mine),versionCard=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('프로그램 버전'));const html=`<div class="card partnerCard66"><div class="between"><div><b>오늘 파트너</b><div class="meta">${p?esc(p.name):'설정 없음'} · 자정 자동 해제</div></div><button class="btn ghost" onclick="openPartner66('${esc(mine.id)}')">${p?'변경':'설정'}</button></div></div>`;if(versionCard)versionCard.insertAdjacentHTML('beforebegin',html);else box.insertAdjacentHTML('beforeend',html)}[...box.querySelectorAll(':scope > .card')].forEach(c=>{const t=c.textContent||'';if((t.includes('나. 누적기록 포함 초기화')||t.includes('회원정보 전체 정리 초기화'))&&!c.querySelector('.partnerResetNote66'))c.insertAdjacentHTML('beforeend','<div class="meta partnerResetNote66" style="margin-top:7px">당일 파트너 설정도 함께 해제됩니다.</div>')});[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v65'))el.textContent='콕매치 v66 · 당일 파트너 · 3게임 이상 즉시 경고'})};

function dayWatch66(){const d=todayKst();if(d!==partnerDay66){partnerDay66=d;syncPartners66()}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)dayWatch66()});setInterval(dayWatch66,60000);setTimeout(()=>{if(me)syncPartners66()},700);
if(location.pathname.startsWith('/launch/v66'))history.replaceState(null,'','/?loaded=66');
if(me)renderAll();
})();
