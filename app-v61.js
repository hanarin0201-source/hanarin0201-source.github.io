(()=>{
function actor61(){return me?.globalAdmin?'admin':me?.tempOrganizer?'temp':String(me?.role||'member')}
function canAttendance61(){return ['admin','manager','organizer','temp'].includes(actor61())}
function canEdit61(m){return ['admin','manager','organizer'].includes(actor61())&&(roleOf(m)!=='admin'||!!me?.globalAdmin)}
function slot61(kind,html){return `<span class="memberBtnSlot61 memberBtn-${kind}61">${html||'<span class="memberBtnPlaceholder61" aria-hidden="true"></span>'}</span>`}

/* Four permanent action slots: entry / spectate / leave / edit. Missing buttons leave their own blank slot. */
memberControls=function(m){
 const attendance=canAttendance61()&&m.state!=='playing'&&m.state!=='matched',edit=canEdit61(m);
 const enter=attendance&&m.state!=='waiting'?`<button class="btn enter" onclick="setOther('${m.id}','waiting')">입장</button>`:'';
 const watch=attendance&&m.state!=='spectator'?`<button class="btn watch" onclick="setOther('${m.id}','spectator')">관람</button>`:'';
 const leave=attendance&&m.state!=='out'?`<button class="btn danger" onclick="setOther('${m.id}','out')">퇴장</button>`:'';
 const editBtn=edit?`<button class="btn ghost" onclick="openEditMember('${m.id}')">수정</button>`:'';
 return `<div class="memberActions60"><div class="status">${stateLabel(m.state)}</div><div class="memberBtns memberBtns61">${slot61('enter',enter)}${slot61('watch',watch)}${slot61('leave',leave)}${slot61('edit',editBtn)}</div></div>`;
};

const renderSettings60=renderSettings;
renderSettings=function(){
 renderSettings60();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v60'))el.textContent='콕매치 v61 · 회원버튼 고정배치 · 가독성/코트높이 개선';
 });
};

if(location.pathname.startsWith('/launch/v61'))history.replaceState(null,'','/?loaded=61');
if(me)renderAll();
})();
