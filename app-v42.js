(()=>{
const MANAGE_V42='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-manage-v42';

async function manage42(action,body={}){
  const r=await fetch(MANAGE_V42,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
  const x=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(x.error||'관리 작업에 실패했습니다.');
  return x;
}
function actor42(){return me?.globalAdmin?'admin':String(me?.role||'member')}
function editable42(m){const a=actor42(),r=roleOf(m);if(a==='admin')return true;if(a==='manager')return r!=='admin'&&(r!=='manager'||m.id===me.memberId);return false}
function deletable42(m){const a=actor42(),r=roleOf(m);if(r==='admin')return false;if(a==='admin')return true;if(a==='manager')return r!=='manager';return false}
function roleOptions42(m,add){const a=actor42();if(a==='admin')return ['member','organizer','manager'];if(a==='manager'){if(!add&&roleOf(m)==='manager')return [];return ['member','organizer']}return []}

const memberControls41=memberControls;
memberControls=function(m){
  if(!canManageMembers())return `<div class="status">${stateLabel(m.state)}</div>`;
  let bs='';
  if(m.state!=='playing'&&m.state!=='matched'){
    if(m.state!=='waiting')bs+=`<button class="btn enter" onclick="setOther('${m.id}','waiting')">운동</button>`;
    if(m.state!=='spectator')bs+=`<button class="btn watch" onclick="setOther('${m.id}','spectator')">관람</button>`;
    if(m.state!=='out')bs+=`<button class="btn danger" onclick="setOther('${m.id}','out')">퇴장</button>`;
  }
  if(editable42(m))bs+=`<button class="btn ghost" onclick="openEditMember('${m.id}')">수정</button>`;
  return `<div><div class="status">${stateLabel(m.state)}</div><div class="memberBtns">${bs}</div></div>`;
};

const renderMembers41=renderMembers;
renderMembers=function(){
  renderMembers41();
  const note=$('members')?.querySelector('.note');if(!note)return;
  note.innerHTML=me?.globalAdmin?'총관리자는 모든 인원정보와 모임관리자·게임편성자 역할을 관리할 수 있습니다.':me?.role==='manager'?'모임관리자는 이 모임의 최고 운영권한으로 회원·게스트 관리, 게임편성자 지정·해제, 게임운영과 리셋을 관리합니다.':me?.role==='organizer'?'게임편성자는 일반회원·게스트 신규등록, 게임편성 및 당일게임 리셋만 사용할 수 있습니다.':'회원정보와 현재 참가상태를 확인할 수 있습니다.';
};

openEditMember=function(id){
  const m=M(id);if(!m)return;
  if(me?.role==='organizer'&&!me?.globalAdmin)return alert('게임편성자는 신규 회원/게스트 등록만 가능합니다.');
  if(!editable42(m))return alert('이 회원정보를 수정할 권한이 없습니다.');
  editMemberId=id;openMemberModal(m);
};

openMemberModal=function(m){
  const add=!m,r=roleOf(m),opts=roleOptions42(m,add),isAdmin=!add&&r==='admin',managerSelf=!add&&r==='manager'&&!me?.globalAdmin&&m.id===me?.memberId;
  const roleSelect=opts.length?`<div class="field"><label>역할</label><select id="fmRole" onchange="syncMember42()">${opts.map(x=>`<option value="${x}" ${(add?(x==='member'):r===x)?'selected':''}>${roleLabel(x)}</option>`).join('')}</select></div><div id="fmPinWrap" class="field hide"><label>${add?'역할 PIN':'새 역할 PIN (변경할 때만 입력)'}</label><input id="fmPin" type="tel" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="숫자 4~8자리"></div>`:'';
  openModal(`<h3>${add?'회원등록':'회원 정보 수정'}</h3><div class="note">${add?(opts.length?'구분은 일반회원/게스트이며, 권한이 있으면 등록과 동시에 역할을 지정할 수 있습니다.':'게임편성자는 일반회원 또는 게스트 신규등록만 가능합니다.'):(isAdmin?'총관리자 계정은 기본정보만 수정할 수 있습니다.':managerSelf?'모임관리자 본인의 기본정보를 수정합니다.':'회원정보와 역할을 관리합니다.')}</div><div class="field"><label>이름</label><input id="fmName" value="${esc(m?.name||'')}" ${isAdmin?'disabled':''}></div><div class="grid2"><div class="field"><label>출생연도</label><input id="fmYear" type="number" inputmode="numeric" value="${esc(m?.year||'')}"></div><div class="field"><label>성별</label><select id="fmGender"><option ${m?.gender!=='여'?'selected':''}>남</option><option ${m?.gender==='여'?'selected':''}>여</option></select></div><div class="field"><label>연령대</label><select id="fmAge">${[20,30,40,50,60,70].map(a=>`<option value="${a}" ${String(m?.age||'30')===String(a)?'selected':''}>${a}대</option>`).join('')}</select></div><div class="field"><label>급수</label><select id="fmCls">${['A','B','C','D','E'].map(c=>`<option ${String(m?.cls||'C')===c?'selected':''}>${c}</option>`).join('')}</select></div></div><div class="field"><label>구분</label><select id="fmType" onchange="syncMember42()" ${isAdmin?'disabled':''}><option value="member" ${m?.type!=='guest'?'selected':''}>일반회원</option><option value="guest" ${m?.type==='guest'?'selected':''}>게스트</option></select></div>${roleSelect}<div class="acts">${!add&&deletable42(m)?'<button class="btn danger" onclick="deleteMemberNow()">삭제</button>':''}<button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="saveMemberNow()">${add?'등록':'저장'}</button></div>`);
  setTimeout(()=>{const y=$('fmYear');if(y)y.addEventListener('input',()=>{const year=Number(y.value);if(year>1900){const age=Math.max(10,Math.floor((new Date().getFullYear()-year)/10)*10);$('fmAge').value=String(Math.min(70,age))}});syncMember42()},0);
};

window.syncMember42=function(){
  const type=$('fmType')?.value||'member',role=$('fmRole');
  if(role&&type==='guest')role.value='member';
  if(role)role.disabled=type==='guest';
  const r=role?.value||'member',wrap=$('fmPinWrap');
  if(wrap)wrap.classList.toggle('hide',r==='member'||type==='guest');
};

const saveMember41=saveMemberNow;
saveMemberNow=async function(){
  const m=editMemberId?M(editMemberId):null,r=m?roleOf(m):'member';
  if(m&&(r==='admin'||(r==='manager'&&!me?.globalAdmin&&m.id===me?.memberId)))return saveMember41();
  const body={memberId:editMemberId||'',name:$('fmName')?.value.trim()||'',year:Number($('fmYear')?.value),gender:$('fmGender')?.value||'남',age:$('fmAge')?.value||'30',cls:$('fmCls')?.value||'C',type:$('fmType')?.value||'member',role:$('fmRole')?.value||'member',pin:$('fmPin')?.value.trim()||''};
  if(!body.name)return alert('이름을 입력해주세요.');
  try{const x=await manage42('save_member',body);S=x.data;normalizeClient();closeModal();renderAll()}catch(e){showError(e)}
};

deleteMemberNow=async function(){
  const m=M(editMemberId);if(!m)return;if(!deletable42(m))return alert('이 회원을 삭제할 권한이 없습니다.');
  if(!confirm(`${m.name} 회원정보를 삭제하시겠습니까?`))return;
  try{const x=await manage42('delete_member',{memberId:m.id});S=x.data;normalizeClient();closeModal();renderAll()}catch(e){showError(e)}
};

const act41=act;
act=async function(action,body={},opts={}){
  if(action==='set_temp'){
    try{const x=await manage42('set_temp',body);if(x.data){S=x.data;normalizeClient();renderAll()}return x}catch(e){throw e}
  }
  return act41(action,body,opts);
};

const renderSettings41=renderSettings;
renderSettings=function(){
  renderSettings41();
  const box=$('settings');if(!box)return;
  if(me?.role==='organizer'&&!me?.globalAdmin){[...box.querySelectorAll(':scope > .card')].forEach(c=>{if((c.textContent||'').includes('당일 임시편성자'))c.remove()})}
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v41'))el.textContent='콕매치 v42 · 모임 권한체계 및 삭제모임 완전삭제'});
};

renderGroups=function(){
  if(!$('groups')||!canManageGroups())return;
  $('groups').innerHTML=`<div class="title"><h2>모임관리</h2><button class="btn pri" onclick="openGroupEditor()">+ 모임 생성</button></div><div class="note">총관리자는 모임을 생성·수정·삭제할 수 있습니다. 삭제된 모임은 복구하거나 완전삭제할 수 있으며, 완전삭제하면 회원·인증·게임데이터가 복구되지 않습니다.</div>${groupSummaries.map(g=>`<div class="card groupCard ${g.isActive?'':'inactive'}"><div class="between"><div><b>${esc(g.name)}</b><div class="meta">${g.isActive?'운영중':'삭제됨'}</div></div><span class="tag">${g.memberCount}명</span></div><div class="groupStats"><span>모임관리자 ${g.managers.length?esc(g.managers.join(', ')):'미지정'}</span><span>게임편성자 ${g.organizers.length?esc(g.organizers.join(', ')):'없음'}</span><span>대기 ${g.waiting}</span><span>게임중 ${g.playing}</span></div><div class="groupActs">${g.isActive?`<button class="btn pri" onclick="switchGroup('${g.groupId}','members')">인원/권한 관리</button><button class="btn ghost" onclick="openGroupEditor('${g.groupId}')">모임 수정</button><button class="btn danger" onclick="deleteGroup('${g.groupId}')">모임 삭제</button>`:`<button class="btn pri" onclick="restoreGroup('${g.groupId}')">모임 복구</button><button class="btn danger" onclick="purgeGroup42('${g.groupId}')">완전삭제</button>`}</div></div>`).join('')||'<div class="empty">등록된 모임이 없습니다.</div>'}`;
};

window.purgeGroup42=async function(id){
  const g=groupSummaries.find(x=>x.groupId===id);if(!g)return;
  const typed=prompt(`완전삭제는 되돌릴 수 없습니다.\n확인을 위해 모임 이름을 그대로 입력해주세요.\n\n${g.name}`);if(typed===null)return;if(typed.trim()!==g.name)return alert('모임 이름이 일치하지 않습니다.');
  const pin=prompt('총관리자 PIN을 입력해주세요.');if(pin===null)return;if(!pin.trim())return alert('총관리자 PIN을 입력해주세요.');
  if(!confirm(`${g.name} 모임의 회원·인증·게임데이터를 완전히 삭제하시겠습니까?\n이 작업은 복구할 수 없습니다.`))return;
  try{await manage42('purge_group',{groupId:id,pin:pin.trim()});await loadGroups();alert(`${g.name} 모임을 완전삭제했습니다.`)}catch(e){showError(e)}
};

if(me)renderAll();
})();