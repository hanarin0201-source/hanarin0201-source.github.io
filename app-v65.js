(()=>{
function actor65(){return me?.globalAdmin?'admin':me?.tempOrganizer?'temp':String(me?.role||'member')}
function canAttendance65(){return ['admin','manager','organizer','temp'].includes(actor65())}
function canEdit65(m){return ['admin','manager','organizer'].includes(actor65())&&(roleOf(m)!=='admin'||!!me?.globalAdmin)}
function slot65(kind,html){return `<span class="memberBtnSlot65 memberBtn-${kind}65">${html||'<span class="memberBtnPlaceholder65" aria-hidden="true"></span>'}</span>`}

/* Exactly three control slots: two rotating attendance actions + fixed edit slot. */
memberControls=function(m){
 const attendance=canAttendance65()&&m.state!=='playing'&&m.state!=='matched';
 const edit=canEdit65(m);
 let first='',second='';
 if(attendance){
  if(m.state==='waiting'){
   first=`<button class="btn danger" onclick="setOther('${m.id}','out')">퇴장</button>`;
   second=`<button class="btn watch" onclick="setOther('${m.id}','spectator')">관람</button>`;
  }else if(m.state==='spectator'){
   first=`<button class="btn enter" onclick="setOther('${m.id}','waiting')">입장</button>`;
   second=`<button class="btn danger" onclick="setOther('${m.id}','out')">퇴장</button>`;
  }else{
   first=`<button class="btn enter" onclick="setOther('${m.id}','waiting')">입장</button>`;
   second=`<button class="btn watch" onclick="setOther('${m.id}','spectator')">관람</button>`;
  }
 }
 const editBtn=edit?`<button class="btn ghost" onclick="openEditMember('${m.id}')">수정</button>`:'';
 return `<div class="memberActions60 memberActions65"><div class="status">${stateLabel(m.state)}</div><div class="memberBtns memberBtns65">${slot65('primary',first)}${slot65('secondary',second)}${slot65('edit',editBtn)}</div></div>`;
};

const renderSettings64=renderSettings;
renderSettings=function(){
 renderSettings64();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v64'))el.textContent='콕매치 v65 · 회원상태 3버튼 전환 · 구분선 제거';
 });
};

if(location.pathname.startsWith('/launch/v65'))history.replaceState(null,'','/?loaded=65');
if(me)renderAll();
})();
