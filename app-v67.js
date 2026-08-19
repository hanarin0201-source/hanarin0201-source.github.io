(()=>{
let partnerFlow67=null,repeatFlow67=null;

function partnerOf67(m){
 if(!m||String(m.partnerDay||'')!==todayKst()||!m.partnerId)return null;
 const p=M(String(m.partnerId));
 return p?{id:String(p.id),name:String(p.name||'')} : null;
}
function isPartnerPair67(a,b){
 const ma=M(a),mb=M(b);if(!ma||!mb)return false;
 const d=todayKst();
 return (String(ma.partnerDay||'')===d&&String(ma.partnerId||'')===String(b)) ||
        (String(mb.partnerDay||'')===d&&String(mb.partnerId||'')===String(a));
}
function dailyPairCount67(a,b){
 return S.history.filter(h=>Array.isArray(h.players)&&h.players.includes(a)&&h.players.includes(b)).length;
}
function repeatRows67(newIds,finalIds){
 const out=[],seen=new Set();
 for(const a of newIds){
  for(const b of finalIds){
   if(!a||!b||a===b)continue;
   const key=[String(a),String(b)].sort().join('|');
   if(seen.has(key)||isPartnerPair67(a,b))continue;
   seen.add(key);
   const n=dailyPairCount67(a,b);
   if(n>=3)out.push({a,b,aName:M(a)?.name||'-',bName:M(b)?.name||'-',count:n});
  }
 }
 return out;
}
function allRepeatRows67(ids){
 const out=[];
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const a=ids[i],b=ids[j];if(isPartnerPair67(a,b))continue;
  const n=dailyPairCount67(a,b);if(n>=3)out.push({a,b,aName:M(a)?.name||'-',bName:M(b)?.name||'-',count:n});
 }
 return out;
}
function showRepeat67(rows,snapshot){
 if(!rows.length)return;
 repeatFlow67={snapshot:snapshot.slice()};
 openModal(`<h3>같이한 게임 확인</h3><div class="warn">오늘 이미 <b>3게임 이상 같이 완료한 조합</b>이 있습니다.<br>파트너끼리는 이 경고에서 제외됩니다.</div>${rows.map(r=>`<div class="card between repeatPair67"><div><b>${esc(r.aName)} · ${esc(r.bName)}</b><div class="meta">오늘 같이 완료한 게임</div></div><span class="tag">${r.count}게임</span></div>`).join('')}<div class="acts"><button class="btn ghost" onclick="repeatUndo67()">다른 인원 넣기</button><button class="btn pri" onclick="repeatKeep67()">그대로 넣기</button></div>`);
}
window.repeatUndo67=function(){
 if(repeatFlow67?.snapshot)draft=repeatFlow67.snapshot.slice();
 repeatFlow67=null;closeModal();renderQueue();
};
window.repeatKeep67=function(){repeatFlow67=null;closeModal();renderQueue()};
function runRepeat67(newIds,snapshot){
 const rows=repeatRows67(newIds,draft.filter(Boolean));
 if(rows.length)showRepeat67(rows,snapshot);
}

function showPartnerAdded67(snapshot,memberId,partnerId){
 partnerFlow67={mode:'added',snapshot:snapshot.slice(),memberId,partnerId};
 const m=M(memberId),p=M(partnerId);
 openModal(`<h3>오늘 파트너 자동 편성</h3><div class="partnerNotice67"><b>${esc(m?.name||'-')}</b>님의 오늘 파트너는 <b>${esc(p?.name||'-')}</b>님입니다.<br>빈칸에 파트너를 자동으로 함께 넣었습니다.</div><div class="acts"><button class="btn ghost" onclick="partnerRedo67()">다시 짜기</button><button class="btn pri" onclick="partnerKeep67()">그대로 반영</button></div>`);
}
function showPartnerAlready67(snapshot,memberId,partnerId){
 partnerFlow67={mode:'already',snapshot:snapshot.slice(),memberId,partnerId};
 const m=M(memberId),p=M(partnerId);
 openModal(`<h3>오늘 파트너 확인</h3><div class="partnerNotice67"><b>${esc(m?.name||'-')}</b>님의 파트너 <b>${esc(p?.name||'-')}</b>님이 이미 새 게임 편성에 들어가 있습니다.</div><div class="acts"><button class="btn ghost" onclick="partnerRedo67()">다시 짜기</button><button class="btn pri" onclick="partnerKeep67()">그대로 반영</button></div>`);
}
function showPartnerFull67(snapshot,memberId,partnerId){
 const m=M(memberId),p=M(partnerId),candidates=snapshot.filter(Boolean).filter(x=>String(x)!==String(partnerId));
 partnerFlow67={mode:'full',snapshot:snapshot.slice(),memberId,partnerId};
 openModal(`<h3>파트너 자리가 없습니다</h3><div class="warn"><b>${esc(m?.name||'-')}</b>님의 오늘 파트너는 <b>${esc(p?.name||'-')}</b>님입니다.<br>현재 4칸이 모두 찼습니다. 기존 3명 중 한 명과 파트너를 바꾸거나, 파트너를 무시하고 현재 편성을 유지해주세요.</div><div class="partnerSwapList67">${candidates.map(id=>`<button class="choiceBtn partnerSwapBtn67" onclick="partnerSwap67('${esc(id)}')"><b>${esc(M(id)?.name||'-')}</b><span class="meta">이 회원 대신 ${esc(p?.name||'-')} 넣기</span></button>`).join('')}</div><button class="btn ghost partnerIgnore67" onclick="partnerIgnore67()">파트너 무시하고 현재 4명으로 편성</button>`);
}
window.partnerRedo67=function(){
 const c=partnerFlow67;if(c?.snapshot)draft=c.snapshot.slice();partnerFlow67=null;closeModal();renderQueue();
};
window.partnerKeep67=function(){
 const c=partnerFlow67;if(!c)return closeModal();partnerFlow67=null;closeModal();renderQueue();
 const added=c.mode==='added'?[c.memberId,c.partnerId]:[c.memberId];
 runRepeat67(added,c.snapshot);
};
window.partnerSwap67=function(replaceId){
 const c=partnerFlow67;if(!c)return;
 const idx=draft.findIndex(x=>String(x)===String(replaceId));
 if(idx<0)return;
 draft[idx]=c.partnerId;
 const snapshot=c.snapshot.slice(),newIds=[c.memberId,c.partnerId];
 partnerFlow67=null;closeModal();renderQueue();runRepeat67(newIds,snapshot);
};
window.partnerIgnore67=function(){
 const c=partnerFlow67;if(!c)return;
 const snapshot=c.snapshot.slice(),newId=c.memberId;
 partnerFlow67=null;closeModal();renderQueue();runRepeat67([newId],snapshot);
};

draftClick=function(id){
 if(!canGame())return;
 const exists=draft.indexOf(id);
 if(exists>=0){draft[exists]=null;renderQueue();return}
 const slot=draft.findIndex(x=>!x);
 if(slot<0)return alert('새 게임 편성은 최대 4명까지 선택할 수 있습니다.');
 const snapshot=draft.slice(),prior=snapshot.filter(Boolean),m=M(id),p=partnerOf67(m);
 draft[slot]=id;renderQueue();
 if(!p){runRepeat67([id],snapshot);return}
 if(prior.includes(p.id)){showPartnerAlready67(snapshot,id,p.id);return}
 const partnerWaiting=S.queue.includes(p.id);
 if(!partnerWaiting){
  alert(`${p.name}님은 ${m?.name||'선택 회원'}님의 오늘 파트너지만 현재 개인 게임대기 상태가 아니어서 자동 편성하지 않았습니다.`);
  runRepeat67([id],snapshot);return;
 }
 const pslot=draft.findIndex(x=>!x);
 if(pslot>=0){draft[pslot]=p.id;renderQueue();showPartnerAdded67(snapshot,id,p.id);return}
 showPartnerFull67(snapshot,id,p.id);
};

/* Recommendation keeps the existing fairness score, but partner pairs never trigger 3+ repeat warnings. */
recommendDraft=function(){
 const pool=sortedQueue().filter(id=>!draft.includes(id)).slice(0,24);
 if(pool.length<4)return alert('개인 게임대기 인원이 4명 이상 필요합니다.');
 const gvMap={A:5,B:4,C:3,D:2,E:1};let best=null,score=Infinity;
 for(let a=0;a<pool.length-3;a++)for(let b=a+1;b<pool.length-2;b++)for(let c=b+1;c<pool.length-1;c++)for(let d=c+1;d<pool.length;d++){
  const ids=[pool[a],pool[b],pool[c],pool[d]],ms=ids.map(M),gv=ms.map(m=>gvMap[m?.cls]||1),mean=gv.reduce((x,y)=>x+y,0)/4,variance=gv.reduce((x,y)=>x+(y-mean)**2,0),male=ms.filter(m=>m?.gender==='남').length;
  let repeat=0;for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)repeat+=pairCount(ids[i],ids[j]);
  const s=repeat*18+variance*7+Math.abs(male-2)*10+a*.02;if(s<score){score=s;best=ids}
 }
 const snapshot=draft.slice();draft=best;renderQueue();const rows=allRepeatRows67(draft.filter(Boolean));if(rows.length)showRepeat67(rows,snapshot);
};

const renderSettings66=renderSettings;
renderSettings=function(){
 renderSettings66();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v66'))el.textContent='콕매치 v67 · 파트너 자동편성 · 파트너 반복경고 제외'});
};
if(location.pathname.startsWith('/launch/v67'))history.replaceState(null,'','/?loaded=67');
if(me)renderAll();
})();
