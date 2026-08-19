(()=>{
function badge57(m){return m?.type==='guest'?'<span class="roleBadge guest45">게스트</span>':roleBadge(m)}
function genderPerson57(m,compact=true){
 const female=m?.gender==='여',label=female?'여성':'남성';
 return `<span class="genderPerson57 ${female?'female':'male'} ${compact?'compact57':''}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`;
}

function decorateMembers57(){
 const box=$('members');if(!box)return;
 [...box.querySelectorAll('.memberCard')].forEach(card=>card.classList.add('memberCard57'));
}

function decorateQueue57(){
 const box=$('queue');if(!box)return;
 [...box.querySelectorAll('.composer54 .slot54')].forEach((slot,i)=>{
  const id=Array.isArray(draft)?draft[i]:null,m=id?M(id):null;
  if(!m||slot.querySelector('.slotHeader57'))return;
  const label=slot.querySelector(':scope > .slotLabel');
  const role=slot.querySelector('.slotName53 .roleBadge');
  const roleHtml=role?role.outerHTML:'';
  role?.remove();
  if(label){
   const header=document.createElement('div');header.className='slotHeader57';
   header.innerHTML=`<span class="slotLabel">${label.textContent||''}</span><span class="slotRight57"><span class="roleZone57">${roleHtml}</span><span class="genderZone57">${genderPerson57(m,true)}</span></span>`;
   label.replaceWith(header);
  }
 });
 [...box.querySelectorAll('.pendingSlot54:not(.emptySlot) .slotBadges54')].forEach(z=>z.classList.add('fixedZones57'));
}

const renderMembers56=renderMembers;
renderMembers=function(){renderMembers56();decorateMembers57()};
const renderQueue56=renderQueue;
renderQueue=function(){renderQueue56();decorateQueue57()};

playerLine=function(id){
 const m=M(id);if(!m)return'-';
 const inv=m?.type==='guest'&&String(m?.inviter||'').trim()?String(m.inviter).trim():'';
 return `<div class="p playingPlayer53 playingPlayer57"><div class="playingMain53"><span class="playingName53">${esc(m.name)}</span>${ageTag(m)}<span class="playingRole57">${badge57(m)}</span><span class="playingGender57">${genderPerson57(m,true)}</span></div><div class="meta playingMeta53">게임 ${dailyCount(id)}회${inv?` · 초대 ${esc(inv)}`:''}</div></div>`;
};

const renderSettings56=renderSettings;
renderSettings=function(){
 renderSettings56();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v56'))el.textContent='콕매치 v57 · 회원명부 공간개선 · 성별/배지 고정정렬'});
};

if(location.pathname.startsWith('/launch/v57'))history.replaceState(null,'','/?loaded=57');
if(me)renderAll();
})();
