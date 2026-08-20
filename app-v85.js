(()=>{
function mine85(){
 if(me?.memberId){const m=M(String(me.memberId));if(m)return m}
 const n=String(me?.displayName||'').trim();
 return S.members.find(m=>String(m.name||'').trim()===n)||null;
}

const renderHeader84=renderHeader;
renderHeader=function(){
 renderHeader84();
 const m=mine85(),who=$('who'),line=document.querySelector('.groupLine');
 if(!who||!line)return;
 const role=m?.type==='guest'?'게스트':roleLabel(me?.role);
 const temp=m?.type!=='guest'&&me?.tempOrganizer?' · 편성자':'';
 who.textContent=`${me?.displayName||'-'} · ${role}${temp}${m?' · '+stateLabel(m.state):''}`;
 if(who.parentElement!==line)line.appendChild(who);
 who.classList.add('whoInline85');
};

function rankCard85(card,isSelf){
 if(isSelf)return -100;
 if(card.querySelector('.role-global'))return 0;
 if(card.querySelector('.role-manager'))return 1;
 if(card.querySelector('.role-organizer'))return 2;
 if(card.querySelector('.role-temp'))return 3;
 if(card.querySelector('.guest45,.roleBadge.guest45,.roleBadge.guest'))return 5;
 return 4;
}
function reorderCards85(){
 const box=$('members');if(!box)return;
 const cards=[...box.querySelectorAll('.memberCard')];
 if(!cards.length)return;
 const parent=cards[0].parentElement;if(!parent)return;
 const hasMine=!!mine85();
 cards.map((card,i)=>({card,i,rank:rankCard85(card,hasMine&&i===0)}))
  .sort((a,b)=>a.rank-b.rank||a.i-b.i)
  .forEach(x=>parent.appendChild(x.card));
}

const renderMembers84=renderMembers;
renderMembers=function(){renderMembers84();reorderCards85()};

const renderSettings84=renderSettings;
renderSettings=function(){
 renderSettings84();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v84'))el.textContent='콕매치 v85 · 상단 사용자정보 인라인 · 게스트 역할표시/정렬';
 });
};

if(location.pathname.startsWith('/launch/v85'))history.replaceState(null,'','/?loaded=85');
if(me)renderAll();
})();
