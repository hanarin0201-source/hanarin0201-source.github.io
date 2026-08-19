(()=>{
function actor64(){return me?.globalAdmin?'admin':me?.tempOrganizer?'temp':String(me?.role||'member')}
function canAttendance64(){return ['admin','manager','organizer','temp'].includes(actor64())}
function canEdit64(m){return ['admin','manager','organizer'].includes(actor64())&&(roleOf(m)!=='admin'||!!me?.globalAdmin)}
function slot64(kind,html){return `<span class="memberBtnSlot61 memberBtn-${kind}61">${html||'<span class="memberBtnPlaceholder61" aria-hidden="true"></span>'}</span>`}

/* Keep four semantic button slots, but move the divider to the first visible action. */
memberControls=function(m){
 const attendance=canAttendance64()&&m.state!=='playing'&&m.state!=='matched',edit=canEdit64(m);
 const actions=[
  attendance&&m.state!=='waiting'?`<button class="btn enter" onclick="setOther('${m.id}','waiting')">입장</button>`:'',
  attendance&&m.state!=='spectator'?`<button class="btn watch" onclick="setOther('${m.id}','spectator')">관람</button>`:'',
  attendance&&m.state!=='out'?`<button class="btn danger" onclick="setOther('${m.id}','out')">퇴장</button>`:'',
  edit?`<button class="btn ghost" onclick="openEditMember('${m.id}')">수정</button>`:''
 ];
 let lead=actions.findIndex(Boolean);if(lead<0)lead=0;
 return `<div class="memberActions60 memberActions64 lead${lead}64"><div class="status">${stateLabel(m.state)}</div><div class="memberBtns memberBtns61 memberBtns64">${slot64('enter',actions[0])}${slot64('watch',actions[1])}${slot64('leave',actions[2])}${slot64('edit',actions[3])}</div></div>`;
};

const renderSettings63=renderSettings;
renderSettings=function(){
 renderSettings63();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v63'))el.textContent='콕매치 v64 · 회원명부 제어선 자동밀착';
 });
};

if(location.pathname.startsWith('/launch/v64'))history.replaceState(null,'','/?loaded=64');
if(me)renderAll();
})();
