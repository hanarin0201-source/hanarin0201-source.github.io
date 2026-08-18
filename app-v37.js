(()=>{
const TOOLS_V37='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-tools-v37';

async function tool37(action,body={}){
  const r=await fetch(TOOLS_V37,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,...body}),cache:'no-store'});
  const x=await r.json().catch(()=>({}));
  if(!r.ok){const e=new Error(x.error||'처리 중 오류가 발생했습니다.');e.details=x.details||[];throw e}
  return x;
}

const renderSettings36=renderSettings;
renderSettings=function(){
  if(currentView==='settings'&&document.activeElement?.id==='courtCountInput')return;
  renderSettings36();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v36'))el.textContent='콕매치 v37 · 모임 총관리자 자동등록 · 코트 입력 개선 · 회원 일괄등록'});
};

const renderMembers36=renderMembers;
renderMembers=function(){
  renderMembers36();
  if(!canManageMembers())return;
  const title=$('members')?.querySelector('.title');if(!title||title.querySelector('.bulkMember37'))return;
  const add=[...title.querySelectorAll('button')].find(b=>(b.textContent||'').includes('회원등록'));
  const wrap=document.createElement('div');wrap.className='memberTitleActs37';
  if(add){title.insertBefore(wrap,add);wrap.appendChild(add)}else title.appendChild(wrap);
  wrap.insertAdjacentHTML('beforeend','<button class="btn ghost bulkMember37" onclick="openBulkMembers37()">일괄등록</button>');
};

const memberControls36=memberControls;
memberControls=function(m){
  if(roleOf(m)==='admin'&&!me?.globalAdmin)return `<div class="status">${stateLabel(m.state)}</div>`;
  return memberControls36(m);
};

const openEditMember36=openEditMember;
openEditMember=function(id){
  const m=M(id);if(!m)return;
  if(roleOf(m)==='admin'&&!me?.globalAdmin)return alert('총관리자 정보는 총관리자만 수정할 수 있습니다.');
  openEditMember36(id);
};

const openMemberModal36=openMemberModal;
openMemberModal=function(m){
  openMemberModal36(m);
  if(m&&roleOf(m)==='admin'){
    const name=$('fmName'),type=$('fmType'),role=$('fmRole'),pinWrap=$('fmPinWrap');
    if(name)name.disabled=true;
    if(type){type.value='member';type.disabled=true}
    role?.closest('.field')?.remove();pinWrap?.remove();
    const sheet=$('modalSheet');
    [...(sheet?.querySelectorAll('button')||[])].forEach(b=>{if((b.textContent||'').trim()==='삭제')b.remove()});
    const note=sheet?.querySelector('.note');if(note)note.textContent='총관리자 계정은 모임 생성 시 자동 등록되며 이름·구분·역할·삭제는 변경할 수 없습니다. 출생연도·성별·급수만 수정할 수 있습니다.';
  }
};

const deleteMemberNow36=deleteMemberNow;
deleteMemberNow=async function(){const m=M(editMemberId);if(m&&roleOf(m)==='admin')return alert('총관리자 계정은 삭제할 수 없습니다.');return deleteMemberNow36()};

const saveGroup36=saveGroup;
saveGroup=async function(id){
  if(id)return saveGroup36(id);
  const name=$('fgName')?.value.trim()||'',pin=$('fgPin')?.value.trim()||'';
  if(!name)return alert('모임 이름을 입력해주세요.');
  try{
    const x=await tool37('create_group',{name,pin,sourceGroupId:currentGroupId});
    closeModal();await loadGroups();
    alert(`${x.groupName||name} 모임을 생성했습니다.\n총관리자가 회원명부에 자동 등록되었습니다.`);
  }catch(e){showError(e)}
};

function parseBulk37(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean),rows=[],errors=[];
  lines.forEach((line,idx)=>{
    const cells=(line.includes('\t')?line.split('\t'):line.split(',')).map(x=>x.trim());
    if(idx===0&&['이름','name'].includes((cells[0]||'').toLowerCase()))return;
    const [name,yearRaw,gender,clsRaw,typeRaw='일반회원']=cells;
    const year=Number(yearRaw),cls=String(clsRaw||'').toUpperCase();
    let type='member';const t=String(typeRaw||'일반회원').trim().toLowerCase();
    if(['게스트','guest'].includes(t))type='guest';else if(!['일반회원','회원','member',''].includes(t))errors.push(`${idx+1}행: 구분은 일반회원 또는 게스트로 입력해주세요.`);
    if(!name)errors.push(`${idx+1}행: 이름이 없습니다.`);
    if(!Number.isInteger(year)||year<1900||year>new Date().getFullYear())errors.push(`${idx+1}행: 출생연도를 확인해주세요.`);
    if(!['남','여'].includes(gender))errors.push(`${idx+1}행: 성별은 남 또는 여로 입력해주세요.`);
    if(!['A','B','C','D','E'].includes(cls))errors.push(`${idx+1}행: 급수는 A~E로 입력해주세요.`);
    rows.push({name,year,gender,cls,type});
  });
  return{rows,errors};
}

window.openBulkMembers37=function(){
  openModal(`<h3>회원 일괄등록</h3><div class="note">엑셀에서 아래 순서의 여러 행을 그대로 복사해 붙여넣을 수 있습니다.<br><b>이름 / 출생연도 / 성별 / 급수 / 구분</b><br>구분을 비우면 일반회원으로 등록됩니다.</div><div class="bulkExample37">홍길동\t1990\t남\tC\t일반회원<br>김민지\t1994\t여\tD\t게스트</div><div class="field"><label>회원 목록 붙여넣기</label><textarea id="bulkText37" rows="10" placeholder="홍길동    1990    남    C    일반회원\n김민지    1994    여    D    게스트"></textarea></div><div id="bulkPreview37" class="meta">탭으로 구분된 엑셀 복사 또는 쉼표(,) 구분 입력을 지원합니다.</div><div class="acts"><button class="btn ghost" onclick="previewBulk37()">내용 확인</button><button class="btn pri" onclick="submitBulk37()">일괄등록</button></div><button class="btn ghost" style="width:100%;margin-top:8px" onclick="closeModal()">취소</button>`);
  setTimeout(()=>$('bulkText37')?.focus(),50);
};

window.previewBulk37=function(){
  const p=parseBulk37($('bulkText37')?.value||''),el=$('bulkPreview37');
  if(!p.rows.length){el.innerHTML='<span class="bulkErr37">등록할 내용을 붙여넣어주세요.</span>';return}
  if(p.errors.length){el.innerHTML=`<span class="bulkErr37">${p.errors.slice(0,8).map(esc).join('<br>')}</span>`;return}
  const guests=p.rows.filter(x=>x.type==='guest').length;
  el.innerHTML=`<b>${p.rows.length}명</b> 등록 준비 · 일반회원 ${p.rows.length-guests}명 · 게스트 ${guests}명`;
};

window.submitBulk37=async function(){
  const p=parseBulk37($('bulkText37')?.value||'');
  if(!p.rows.length)return alert('등록할 회원 목록을 붙여넣어주세요.');
  if(p.errors.length)return alert(p.errors.slice(0,12).join('\n'));
  if(!confirm(`${group?.name||'현재 모임'}에 ${p.rows.length}명을 한 번에 등록하시겠습니까?`))return;
  try{
    const x=await tool37('bulk_add_members',{groupId:currentGroupId,members:p.rows});
    S=x.data;normalizeClient();closeModal();renderAll();
    alert(`${Number(x.addedCount)||p.rows.length}명을 등록했습니다.`);
  }catch(e){alert([e.message,...(e.details||[]).slice(0,12)].join('\n'))}
};

if(me)renderAll();
})();