(()=>{
function actor69(){return me?.globalAdmin?'admin':me?.tempOrganizer?'temp':String(me?.role||'member')}
function staff69(){return ['admin','manager','organizer','temp'].includes(actor69())}
function selfMember69(){
 if(me?.memberId){const m=M(String(me.memberId));if(m)return m}
 const name=String(me?.displayName||'').trim();
 return S.members.find(m=>m.type!=='guest'&&String(m.name||'').trim()===name)||null;
}
function slot69(kind,html){return `<span class="memberBtnSlot65 memberBtn-${kind}65">${html||'<span class="memberBtnPlaceholder65" aria-hidden="true"></span>'}</span>`}
function ownControls69(m){
 let first='',second='';
 if(m.state!=='playing'&&m.state!=='matched'){
  if(m.state==='waiting'){
   first=`<button class="btn danger" onclick="setMyMemberState69('out')">퇴장</button>`;
   second=`<button class="btn watch" onclick="setMyMemberState69('spectator')">관람</button>`;
  }else if(m.state==='spectator'){
   first=`<button class="btn enter" onclick="setMyMemberState69('waiting')">입장</button>`;
   second=`<button class="btn danger" onclick="setMyMemberState69('out')">퇴장</button>`;
  }else{
   first=`<button class="btn enter" onclick="setMyMemberState69('waiting')">입장</button>`;
   second=`<button class="btn watch" onclick="setMyMemberState69('spectator')">관람</button>`;
  }
 }
 return `<div class="memberActions60 memberActions65 memberActions69"><div class="status">${stateLabel(m.state)}</div><div class="memberBtns memberBtns65">${slot69('primary',first)}${slot69('secondary',second)}${slot69('edit','')}</div></div>`;
}
window.setMyMemberState69=async function(mode){
 try{await act('set_my_attendance',{mode})}catch(e){showError(e)}
};

const renderMembers68=renderMembers;
renderMembers=function(){
 renderMembers68();
 const box=$('members');if(!box)return;
 const cards=[...box.querySelectorAll('.memberCard')],listHost=cards[0]?.parentElement||null;
 const rows=cards.map((card,i)=>({card,m:S.members[i]})).filter(x=>x.m);
 const mine=selfMember69(),sid=String(mine?.id||'');
 const note=box.querySelector('.note');
 const title=box.querySelector('.title');
 const addBtn=title?.querySelector('button');
 const isStaff=staff69();

 if(isStaff){
  if(note)note.textContent=actor69()==='temp'?'임시편성자는 현재 모임의 전체 회원을 확인하고 입장·관람·퇴장 상태와 게임운영을 관리할 수 있습니다.':'운영권한 사용자는 현재 모임의 전체 회원을 확인하고 입장·관람·퇴장 상태를 관리할 수 있습니다.';
  const selfRow=rows.find(x=>String(x.m.id)===sid);
  if(selfRow){
   selfRow.card.classList.add('memberSelf69');
   const parent=selfRow.card.parentElement;
   if(parent&&parent.firstElementChild!==selfRow.card)parent.insertBefore(selfRow.card,parent.firstElementChild);
  }
  return;
 }

 if(addBtn)addBtn.remove();
 if(note)note.textContent='일반회원과 게스트는 회원명부에서 본인 정보만 확인할 수 있으며, 본인의 입장·관람·퇴장 상태만 변경할 수 있습니다.';
 const selfRow=rows.find(x=>String(x.m.id)===sid);
 rows.forEach(x=>{if(x!==selfRow)x.card.remove()});
 if(!selfRow){
  if(listHost)listHost.innerHTML='<div class="empty">현재 로그인 계정과 연결된 회원정보를 찾을 수 없습니다.</div>';
  return;
 }
 selfRow.card.classList.add('memberSelf69');
 const parent=selfRow.card.parentElement;
 if(parent&&parent.firstElementChild!==selfRow.card)parent.insertBefore(selfRow.card,parent.firstElementChild);
 const actions=selfRow.card.querySelector('.memberActions65,.memberActions60');
 if(actions)actions.outerHTML=ownControls69(selfRow.m);
 selfRow.card.querySelector('.pairBtn:not(.partnerSetBtn66)')?.remove();
 selfRow.card.querySelector('.partnerSetBtn66')?.setAttribute('aria-label','오늘 파트너 설정');
};

const renderSettings68=renderSettings;
renderSettings=function(){
 renderSettings68();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v68'))el.textContent='콕매치 v69 · 회원명부 권한별 조회 · 본인 우선표시'});
};
if(location.pathname.startsWith('/launch/v69'))history.replaceState(null,'','/?loaded=69');
if(me)renderAll();
})();
