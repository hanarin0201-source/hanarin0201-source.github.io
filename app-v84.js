(()=>{
function canSeeGlobal84(){
 const mode=String(S?.adminBadgeVisibility||'all');
 if(me?.globalAdmin)return true;
 if(mode==='all')return true;
 if(mode==='staff')return me?.role==='manager'||me?.role==='organizer';
 return false;
}

roleBadge=function(m){
 const r=roleOf(m);
 const globalLike=r==='admin'||(me?.globalAdmin&&m?.name===me.displayName);
 if(globalLike){
  return canSeeGlobal84()
   ? '<span class="roleBadge role-global">총관리자</span>'
   : '<span class="roleBadge role-member44">일반</span>';
 }
 if(r==='manager')return '<span class="roleBadge role-manager">모임장</span>';
 if(r==='organizer')return '<span class="roleBadge role-organizer">운영진</span>';
 if(isTemp(m))return '<span class="roleBadge role-temp">편성자</span>';
 return '<span class="roleBadge role-member44">일반</span>';
};

function sourceMembers84(){
 const mid=String(me?.memberId||'');
 if(mid){const mine=M(mid);if(mine)return [mine,...S.members.filter(m=>String(m.id)!==mid)]}
 const name=String(me?.displayName||'').trim();
 const mine=S.members.find(m=>String(m.name||'').trim()===name);
 return mine?[mine,...S.members.filter(m=>String(m.id)!==String(mine.id))]:S.members.slice();
}
function isMine84(m){
 if(!m)return false;
 if(me?.memberId&&String(m.id)===String(me.memberId))return true;
 return !me?.memberId&&String(m.name||'').trim()===String(me?.displayName||'').trim();
}
function rank84(m){
 if(isMine84(m))return -100;
 const r=roleOf(m);
 if(r==='admin')return canSeeGlobal84()?0:4;
 if(r==='manager')return 1;
 if(r==='organizer')return 2;
 if(isTemp(m))return 3;
 return 4;
}
function reorderMemberCards84(){
 const box=$('members');if(!box)return;
 const cards=[...box.querySelectorAll('.memberCard')];
 const src=sourceMembers84();
 if(!cards.length||cards.length!==src.length)return;
 const parent=cards[0].parentElement;if(!parent)return;
 cards.map((card,i)=>({card,m:src[i],i}))
  .sort((a,b)=>rank84(a.m)-rank84(b.m)||a.i-b.i)
  .forEach(x=>parent.appendChild(x.card));
}

const renderMembers83=renderMembers;
renderMembers=function(){
 renderMembers83();
 reorderMemberCards84();
};

const renderSettings83=renderSettings;
renderSettings=function(){
 renderSettings83();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v83'))el.textContent='콕매치 v84 · 회원명부 간격/정렬 · 숨김 총관리자 일반표시';
 });
};

if(location.pathname.startsWith('/launch/v84'))history.replaceState(null,'','/?loaded=84');
if(me)renderAll();
})();
