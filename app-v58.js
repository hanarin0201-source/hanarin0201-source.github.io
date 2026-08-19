(()=>{
function badge58(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
function genderName58(m){
 const female=m?.gender==='여',label=female?'여성':'남성';
 return `<span class="nameGender58 ${female?'female':'male'}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`;
}

function decorateQueue58(){
 const box=$('queue');if(!box)return;
 const selected=Array.isArray(draft)?draft:[];
 [...box.querySelectorAll('.composer54 .slot54')].forEach((slot,i)=>{
  const id=selected[i],m=id?M(id):null;if(!m)return;
  const oldHeader=slot.querySelector('.slotHeader57');
  if(oldHeader&&!slot.querySelector('.slotHeader58')){
   const label=oldHeader.querySelector('.slotLabel')?.textContent||'';
   const role=oldHeader.querySelector('.roleBadge')?.outerHTML||'';
   const h=document.createElement('div');h.className='slotHeader58';
   h.innerHTML=`<span class="slotLabel">${esc(label)}</span><span class="slotRoleRight58">${role}</span>`;
   oldHeader.replaceWith(h);
  }
  const name=slot.querySelector('.slotName53');
  if(name&&!name.querySelector('.nameGender58'))name.insertAdjacentHTML('afterbegin',genderName58(m));
 });

 [...box.querySelectorAll('.pendingCard54')].forEach((card,gi)=>{
  const pg=S.pendingGames?.[gi];if(!pg)return;
  [...card.querySelectorAll('.pendingSlot54:not(.emptySlot)')].forEach((slot,pi)=>{
   const id=pg.players?.[pi],m=id?M(id):null;if(!m)return;
   const badges=slot.querySelector('.slotBadges54');
   if(badges){
    badges.querySelector('.genderPerson54,.genderPerson57')?.remove();
    badges.classList.remove('fixedZones57');badges.classList.add('slotBadges58');
   }
   const name=slot.querySelector('.slotName53');
   if(name&&!name.querySelector('.nameGender58'))name.insertAdjacentHTML('afterbegin',genderName58(m));
  });
 });
}

const renderQueue57=renderQueue;
renderQueue=function(){renderQueue57();decorateQueue58()};

playerLine=function(id){
 const m=M(id);if(!m)return'-';
 const inv=m?.type==='guest'&&String(m?.inviter||'').trim()?String(m.inviter).trim():'';
 return `<div class="p playingPlayer53 playingPlayer57"><div class="playingMain53 playingMain58"><span class="playingGender58">${genderName58(m)}</span><span class="playingName53">${esc(m.name)}</span>${ageTag(m)}<span class="playingRole58">${badge58(m)}</span></div><div class="meta playingMeta53">게임 ${dailyCount(id)}회${inv?` · 초대 ${esc(inv)}`:''}</div></div>`;
};

const renderSettings57=renderSettings;
renderSettings=function(){
 renderSettings57();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v57'))el.textContent='콕매치 v58 · 아이폰 회원명부 복원 · 성별아이콘 이름앞 정렬'});
};

if(location.pathname.startsWith('/launch/v58'))history.replaceState(null,'','/?loaded=58');
if(me)renderAll();
})();
