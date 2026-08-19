(()=>{
let partnerFlow68=null,repeatFlow68=null;

function memberLabel68(m){
 if(!m)return '-';
 const age=String(m.age||'').trim(),cls=String(m.cls||'').trim(),gender=String(m.gender||'').trim();
 return `${String(m.name||'-').trim()} ${age}${cls}${gender}`.trim();
}
function partnerOf68(m){
 if(!m||String(m.partnerDay||'')!==todayKst()||!m.partnerId)return null;
 const p=M(String(m.partnerId));
 return p?{id:String(p.id),name:String(p.name||''),member:p}:null;
}
function isPartnerPair68(a,b){
 const ma=M(a),mb=M(b);if(!ma||!mb)return false;const d=todayKst();
 return (String(ma.partnerDay||'')===d&&String(ma.partnerId||'')===String(b)) ||
        (String(mb.partnerDay||'')===d&&String(mb.partnerId||'')===String(a));
}
function dailyPairCount68(a,b){return S.history.filter(h=>Array.isArray(h.players)&&h.players.includes(a)&&h.players.includes(b)).length}
function repeatRows68(newIds,finalIds){
 const out=[],seen=new Set();
 for(const a of newIds)for(const b of finalIds){
  if(!a||!b||a===b)continue;const key=[String(a),String(b)].sort().join('|');
  if(seen.has(key)||isPartnerPair68(a,b))continue;seen.add(key);
  const n=dailyPairCount68(a,b);if(n>=3)out.push({a,b,aName:M(a)?.name||'-',bName:M(b)?.name||'-',count:n});
 }
 return out;
}
function showRepeat68(rows,snapshot){
 if(!rows.length)return;repeatFlow68={snapshot:snapshot.slice()};
 openModal(`<h3>같이한 게임 확인</h3><div class="warn">오늘 이미 <b>3게임 이상 같이 완료한 조합</b>이 있습니다.<br>파트너끼리는 이 경고에서 제외됩니다.</div>${rows.map(r=>`<div class="card between repeatPair67"><div><b>${esc(r.aName)} · ${esc(r.bName)}</b><div class="meta">오늘 같이 완료한 게임</div></div><span class="tag">${r.count}게임</span></div>`).join('')}<div class="acts"><button class="btn ghost" onclick="repeatUndo68()">다른 인원 넣기</button><button class="btn pri" onclick="repeatKeep68()">그대로 넣기</button></div>`);
}
window.repeatUndo68=function(){if(repeatFlow68?.snapshot)draft=repeatFlow68.snapshot.slice();repeatFlow68=null;closeModal();renderQueue()};
window.repeatKeep68=function(){repeatFlow68=null;closeModal();renderQueue()};
function runRepeat68(newIds,snapshot){const rows=repeatRows68(newIds,draft.filter(Boolean));if(rows.length)showRepeat68(rows,snapshot)}

function showPartnerAdded68(snapshot,memberId,partnerId){
 partnerFlow68={mode:'added',snapshot:snapshot.slice(),memberId,partnerId};const m=M(memberId),p=M(partnerId);
 openModal(`<h3>오늘 파트너 자동 편성</h3><div class="partnerNotice67"><b>${esc(memberLabel68(m))}</b> 님의 오늘 파트너는 <b>${esc(memberLabel68(p))}</b> 입니다.<br>빈칸에 파트너를 자동으로 함께 넣었습니다.</div><div class="acts"><button class="btn ghost" onclick="partnerRedo68()">다시 짜기</button><button class="btn pri" onclick="partnerKeep68()">그대로 반영</button></div>`);
}
function showPartnerAlready68(snapshot,memberId,partnerId){
 partnerFlow68={mode:'already',snapshot:snapshot.slice(),memberId,partnerId};const m=M(memberId),p=M(partnerId);
 openModal(`<h3>오늘 파트너 확인</h3><div class="partnerNotice67"><b>${esc(memberLabel68(m))}</b> 님의 파트너 <b>${esc(memberLabel68(p))}</b> 님이 이미 새 게임 편성에 들어가 있습니다.</div><div class="acts"><button class="btn ghost" onclick="partnerRedo68()">다시 짜기</button><button class="btn pri" onclick="partnerKeep68()">그대로 반영</button></div>`);
}
function showPartnerFull68(snapshot,memberId,partnerId){
 const m=M(memberId),p=M(partnerId),candidates=snapshot.filter(Boolean).filter(x=>String(x)!==String(partnerId));
 partnerFlow68={mode:'full',snapshot:snapshot.slice(),memberId,partnerId};
 openModal(`<h3>파트너 자리가 없습니다</h3><div class="warn partnerFullWarn68"><b>${esc(memberLabel68(m))}</b> 님의 파트너는 <b>${esc(memberLabel68(p))}</b> 입니다.<br>현재 4칸이 모두 찼습니다. 아래 3명 중 한 명을 파트너와 바꾸거나, 파트너를 무시하고 현재 편성을 유지해주세요.</div><div class="partnerSwapList67">${candidates.map(id=>{const cm=M(id);return `<button class="choiceBtn partnerSwapBtn67 partnerSwapBtn68" onclick="partnerSwap68('${esc(id)}')"><b>${esc(memberLabel68(cm))}, 게임 ${dailyCount(id)}회, 대기시간 ${waitMins(cm)}분</b><span class="meta">이 회원 대신 ${esc(memberLabel68(p))} 넣기</span></button>`}).join('')}</div><button class="btn ghost partnerIgnore67" onclick="partnerIgnore68()">파트너 무시하고 현재 4명으로 편성</button>`);
}
window.partnerRedo68=function(){const c=partnerFlow68;if(c?.snapshot)draft=c.snapshot.slice();partnerFlow68=null;closeModal();renderQueue()};
window.partnerKeep68=function(){const c=partnerFlow68;if(!c)return closeModal();partnerFlow68=null;closeModal();renderQueue();const added=c.mode==='added'?[c.memberId,c.partnerId]:[c.memberId];runRepeat68(added,c.snapshot)};
window.partnerSwap68=function(replaceId){const c=partnerFlow68;if(!c)return;const idx=draft.findIndex(x=>String(x)===String(replaceId));if(idx<0)return;draft[idx]=c.partnerId;const snapshot=c.snapshot.slice(),newIds=[c.memberId,c.partnerId];partnerFlow68=null;closeModal();renderQueue();runRepeat68(newIds,snapshot)};
window.partnerIgnore68=function(){const c=partnerFlow68;if(!c)return;const snapshot=c.snapshot.slice(),newId=c.memberId;partnerFlow68=null;closeModal();renderQueue();runRepeat68([newId],snapshot)};

draftClick=function(id){
 if(!canGame())return;const exists=draft.indexOf(id);if(exists>=0){draft[exists]=null;renderQueue();return}
 const slot=draft.findIndex(x=>!x);if(slot<0)return alert('새 게임 편성은 최대 4명까지 선택할 수 있습니다.');
 const snapshot=draft.slice(),prior=snapshot.filter(Boolean),m=M(id),p=partnerOf68(m);draft[slot]=id;renderQueue();
 if(!p){runRepeat68([id],snapshot);return}
 if(prior.includes(p.id)){showPartnerAlready68(snapshot,id,p.id);return}
 const partnerWaiting=S.queue.includes(p.id);
 if(!partnerWaiting){alert(`${memberLabel68(m)} 님의 오늘 파트너는 ${memberLabel68(p.member)} 입니다.\n파트너가 현재 개인 게임대기 상태가 아니어서 자동 편성하지 않았습니다.`);runRepeat68([id],snapshot);return}
 const pslot=draft.findIndex(x=>!x);if(pslot>=0){draft[pslot]=p.id;renderQueue();showPartnerAdded68(snapshot,id,p.id);return}
 showPartnerFull68(snapshot,id,p.id);
};

const renderSettings67=renderSettings;
renderSettings=function(){renderSettings67();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v67'))el.textContent='콕매치 v68 · 파트너 상세안내 · 개인대기 이름정렬'})};
if(location.pathname.startsWith('/launch/v68'))history.replaceState(null,'','/?loaded=68');
if(me)renderAll();
})();
