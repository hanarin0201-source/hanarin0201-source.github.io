(()=>{
const POLL18_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v18-api';
const DEV_NAME18='박태영';
let searchComposing18=false,searchTimer18=0;

function poll18(id){return (Array.isArray(S?.attendancePolls)?S.attendancePolls:[]).find(p=>String(p.id)===String(id))}
function guestEntries18(p){return Array.isArray(p?.guestEntries)?p.guestEntries:[]}
function memberVotes18(p){return p?.memberVotes&&typeof p.memberVotes==='object'?p.memberVotes:{}}
function attendeeMembers18(p){const v=memberVotes18(p);return Object.keys(v).filter(id=>v[id]==='yes').map(id=>M(id)).filter(m=>m&&m.type!=='guest')}
function pollStaff18(){
 const mine=me?.memberId?M(String(me.memberId)):S?.members?.find?.(m=>String(m?.name||'').trim()===String(me?.displayName||'').trim());
 return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer'||me.tempOrganizer||(mine&&typeof isTemp==='function'&&isTemp(mine)));
}
function hiddenAdmin18(){return String(S?.adminBadgeVisibility||'all')==='hidden'}
function viewerDev18(){return !!me&&String(me.displayName||'').trim()===DEV_NAME18&&me.globalAdmin===true}
function attendeeRank18(m){
 const self=(me?.memberId&&String(m?.id)===String(me.memberId))||(!me?.memberId&&String(m?.name||'').trim()===String(me?.displayName||'').trim());
 if(self)return -100;
 const r=roleOf(m);
 if(r==='admin')return hiddenAdmin18()&&!viewerDev18()?4:0;
 if(r==='manager')return 1;
 if(r==='organizer')return 2;
 if(typeof isTemp==='function'&&isTemp(m))return 3;
 return 4;
}
function gender18(m){const f=m?.gender==='여';return `<span class="pollGender72 ${f?'female':'male'}">${f?'여':'남'}</span>`}
function currentYear18(){return Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric'}).format(new Date()))||new Date().getFullYear()}
function ageBand18(year){const y=Number(year),age=currentYear18()-y;if(!Number.isFinite(age)||age<0)return '30';return String(Math.max(10,Math.min(80,Math.floor(age/10)*10)))}
function inviterOptions18(){return (S.members||[]).filter(m=>m.type!=='guest').map(m=>String(m.name||'').trim()).filter(Boolean).sort((a,b)=>a.localeCompare(b,'ko')).map(n=>`<option value="${esc(n)}"></option>`).join('')}
async function request18(action,body={}){
 const r=await fetch(POLL18_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401)throw new Error('로그인이 만료되었습니다.');throw new Error(x.error||'처리에 실패했습니다.')}
 if(x.data){S=x.data;normalizeClient()}
 return x;
}

window.openGuestAdd72=function(id){
 if(!pollStaff18())return alert('편성자 이상 권한이 필요합니다.');
 openModal(`<h3>게스트 참가 추가</h3>
  <div class="field"><label>이름</label><input id="pollGuestName72" maxlength="30" autocomplete="off" placeholder="게스트 이름"></div>
  <div class="pollGuestYearRow18">
   <div class="field"><label>출생연도</label><input id="pollGuestYear18" type="number" inputmode="numeric" min="1900" max="${currentYear18()}" placeholder="예: 1992"></div>
   <div class="field"><label>연령대</label><select id="pollGuestAge18">${[10,20,30,40,50,60,70,80].map(x=>`<option value="${x}" ${x===30?'selected':''}>${x}대</option>`).join('')}</select></div>
  </div>
  <div class="grid2">
   <div class="field"><label>성별</label><select id="pollGuestGender72"><option>남</option><option>여</option></select></div>
   <div class="field"><label>급수</label><select id="pollGuestCls72">${['A','B','C','D','E'].map(x=>`<option ${x==='C'?'selected':''}>${x}</option>`).join('')}</select></div>
  </div>
  <div class="field"><label>초대인</label><input id="pollGuestInviter18" list="pollGuestInviters18" maxlength="30" autocomplete="off" placeholder="초대한 회원 이름"><datalist id="pollGuestInviters18">${inviterOptions18()}</datalist></div>
  <div class="note">출생연도를 입력하면 연령대가 자동 선택됩니다. 등록한 게스트는 회원명부에도 당일 게스트로 자동 추가되며 리셋 또는 새벽 5시에 삭제됩니다.</div>
  <div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="addPollGuest72('${esc(id)}')">참가명단 반영</button></div>`);
 const year=$('pollGuestYear18'),age=$('pollGuestAge18');
 year?.addEventListener('input',()=>{const y=String(year.value||'').trim();if(/^\d{4}$/.test(y)&&age)age.value=ageBand18(y)});
 setTimeout(()=>$('pollGuestName72')?.focus(),30);
};

window.addPollGuest72=async function(id){
 const name=$('pollGuestName72')?.value.trim()||'',year=$('pollGuestYear18')?.value.trim()||'',inviter=$('pollGuestInviter18')?.value.trim()||'';
 if(!name)return alert('게스트 이름을 입력해주세요.');
 if(!/^\d{4}$/.test(year)||Number(year)<1900||Number(year)>currentYear18())return alert('출생연도를 4자리로 입력해주세요.');
 if(!inviter)return alert('초대인을 입력해주세요.');
 try{
  await request18('poll_guest_add',{pollId:id,name,year,age:ageBand18(year),gender:$('pollGuestGender72')?.value||'남',cls:$('pollGuestCls72')?.value||'C',inviter});
  closeModal();renderAll();goView('stats');
 }catch(e){showError(e)}
};
window.removePollGuest72=async function(pid,gid){
 if(!pollStaff18())return;
 try{await request18('poll_guest_remove',{pollId:pid,guestId:gid});renderAll();openPollAttendees18(pid)}catch(e){showError(e)}
};

window.openPollAttendees18=function(id){
 const p=poll18(id);if(!p)return;
 const order=new Map((S.members||[]).map((m,i)=>[String(m.id),i]));
 const members=attendeeMembers18(p).sort((a,b)=>attendeeRank18(a)-attendeeRank18(b)||(order.get(String(a.id))??99999)-(order.get(String(b.id))??99999));
 const guests=guestEntries18(p).slice().sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'ko'));
 const total=members.length+guests.length;
 const memberRows=members.map(m=>`<div class="pollMember72">${gender18(m)}<span class="pollName72">${esc(m.name)}</span><span class="tag">${esc(m.cls||'C')}</span>${roleBadge(m)}</div>`).join('');
 const guestRows=guests.map(g=>`<div class="pollGuestRow72"><div>${gender18(g)} <b>${esc(g.name)}</b> <span class="tag">${esc(g.cls||'C')}</span><div class="pollGuestMeta18">${esc(g.year||'')}년생 · ${esc(g.age||'30')}대${g.inviter?` · 초대 ${esc(g.inviter)}`:''}</div></div>${pollStaff18()?`<button class="miniBtn" onclick="removePollGuest72('${esc(p.id)}','${esc(g.id)}')">삭제</button>`:''}</div>`).join('');
 openModal(`<h3>참석 명단 · 총 ${total}명</h3>
  <div class="pollAttendeeSection18"><div class="pollAttendeeTitle18"><b>회원</b><span class="tag">${members.length}명</span></div>${memberRows||'<div class="empty">참석을 선택한 회원이 없습니다.</div>'}</div>
  <div class="pollAttendeeSection18"><div class="pollAttendeeTitle18"><b>게스트</b><span class="tag">${guests.length}명</span></div>${guestRows||'<div class="empty">등록된 게스트가 없습니다.</div>'}</div>
  ${pollStaff18()?`<button class="btn pri" style="width:100%;margin-top:10px" onclick="closeModal();openGuestAdd72('${esc(p.id)}')">+ 게스트 참가 추가</button>`:''}
  <button class="btn ghost" style="width:100%;margin-top:7px" onclick="closeModal()">닫기</button>`);
};
window.openPollMembers72=window.openPollAttendees18;
window.openPollGuests72=window.openPollAttendees18;

function patchPollCounts18(){
 const stats=$('stats');if(!stats)return;
 stats.querySelectorAll('.pollCard90,.pollCard72').forEach(card=>{
  const add=card.querySelector('[onclick*="openGuestAdd72"]'),membersBtn=card.querySelector('[onclick*="openPollMembers72"]'),guestsBtn=card.querySelector('[onclick*="openPollGuests72"]');
  const src=add?.getAttribute('onclick')||membersBtn?.getAttribute('onclick')||guestsBtn?.getAttribute('onclick')||'';
  const m=src.match(/\('([^']+)'\)/);if(!m)return;const p=poll18(m[1]);if(!p)return;
  const mc=attendeeMembers18(p).length,gc=guestEntries18(p).length,total=mc+gc;
  const counts=card.querySelector('.pollCounts72');if(!counts)return;
  counts.innerHTML=`<button class="pollCountBtn72 pollCountBtn18" onclick="openPollAttendees18('${esc(p.id)}')"><span><b>${total}명</b> 참석 명단</span><span class="pollBreak18">회원 ${mc} · 게스트 ${gc}</span></button>`;
 });
}
const renderStatsBefore18=renderStats;
renderStats=function(){renderStatsBefore18();patchPollCounts18()};

/* iPhone/tablet member search: detach all legacy IME listeners and filter existing cards without re-rendering. */
function memberCardText18(card){return String(card?.textContent||'').toLowerCase()}
function applyMemberSearch18(v){
 const box=$('members');if(!box)return;const q=String(v||'').trim().toLowerCase();let shown=0,total=0;
 box.querySelectorAll('.memberCard').forEach(card=>{total++;const on=!q||memberCardText18(card).includes(q);card.classList.toggle('searchHidden18',!on);if(on)shown++});
 const search=box.querySelector('.memberSearch46 .meta');if(search)search.textContent=q?`현재 화면 검색 ${shown}명 / ${total}명`:`현재 화면 ${total}명`;
}
window.searchMembers46=function(v){clearTimeout(searchTimer18);const input=$('memberSearchInput46'),value=String(v??input?.value??'');if(searchComposing18)return;searchTimer18=setTimeout(()=>applyMemberSearch18(value),60)};
function bindMemberSearch18(){
 let input=$('memberSearchInput46');if(!input||input.dataset.v18==='1')return;
 const clone=input.cloneNode(true);clone.dataset.v18='1';clone.removeAttribute('oninput');clone.removeAttribute('data-ime17');clone.autocomplete='off';clone.spellcheck=false;input.replaceWith(clone);input=clone;
 input.addEventListener('compositionstart',()=>{searchComposing18=true;clearTimeout(searchTimer18)});
 input.addEventListener('compositionend',()=>{searchComposing18=false;applyMemberSearch18(input.value)});
 input.addEventListener('input',e=>{if(e.isComposing||searchComposing18)return;clearTimeout(searchTimer18);searchTimer18=setTimeout(()=>applyMemberSearch18(input.value),60)});
}
const renderMembersBefore18=renderMembers;
renderMembers=function(){
 const old=$('memberSearchInput46'),focused=!!old&&document.activeElement===old,typed=old?.value||'',sel=focused?old.selectionStart:null;
 if(focused&&searchComposing18)return;
 renderMembersBefore18();bindMemberSearch18();const input=$('memberSearchInput46');if(input&&typed){input.value=typed;applyMemberSearch18(typed)}
 if(focused&&input){input.focus({preventScroll:true});try{input.setSelectionRange(sel??typed.length,sel??typed.length)}catch{}}
};

const settingsBefore18=renderSettings;
renderSettings=function(){settingsBefore18();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|1\.[0-9]+)/.test(el.textContent||''))el.textContent='콕매치 v1.8 · 투표 게스트 당일회원 연동 · 참석명단 통합 · 검색 입력 안정화'});};

if(me){try{bindMemberSearch18();patchPollCounts18()}catch{}}
})();
