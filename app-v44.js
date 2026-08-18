(()=>{
const BULK_V44='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-bulk-v44';
let actionBusy44=0,lastStateSig44='';

function currentYearKst44(){return Number(new Intl.DateTimeFormat('en',{timeZone:'Asia/Seoul',year:'numeric'}).format(new Date()))||new Date().getFullYear()}
function koreanAge44(year){return Math.max(1,currentYearKst44()-Number(year)+1)}
function ageBand44(year){const age=koreanAge44(year);return Math.max(10,Math.min(90,Math.floor(age/10)*10))}
function syncAge44(){
 const y=Number($('fmYear')?.value),sel=$('fmAge');if(!sel||!Number.isInteger(y)||y<1900||y>currentYearKst44())return;
 for(const band of [10,20,30,40,50,60,70,80,90])if(![...sel.options].some(o=>Number(o.value)===band)){const o=document.createElement('option');o.value=String(band);o.textContent=`${band}대`;sel.appendChild(o)}
 const age=koreanAge44(y),band=ageBand44(y);sel.value=String(band);sel.title=`${y}년생 · ${currentYearKst44()}년 기준 ${age}살`;
}
const openMemberModal43=openMemberModal;
openMemberModal=function(m){openMemberModal43(m);setTimeout(()=>{const y=$('fmYear');if(y){y.addEventListener('input',syncAge44);y.addEventListener('change',syncAge44)}syncAge44()},0)};
const saveMemberNow43=saveMemberNow;
saveMemberNow=async function(){syncAge44();return saveMemberNow43()};

function parseBulk44(text){
 const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean),rows=[],errors=[];
 lines.forEach((line,idx)=>{const cells=(line.includes('\t')?line.split('\t'):line.split(',')).map(x=>x.trim());if(idx===0&&['이름','name'].includes((cells[0]||'').toLowerCase()))return;const [name,yr,gender,clsRaw,typeRaw='일반회원']=cells,year=Number(yr),cls=String(clsRaw||'').toUpperCase(),t=String(typeRaw||'일반회원').toLowerCase();const type=['게스트','guest'].includes(t)?'guest':'member';if(!name)errors.push(`${idx+1}행: 이름이 없습니다.`);if(!Number.isInteger(year)||year<1900||year>currentYearKst44())errors.push(`${idx+1}행: 출생연도를 확인해주세요.`);if(!['남','여'].includes(gender))errors.push(`${idx+1}행: 성별은 남 또는 여로 입력해주세요.`);if(!['A','B','C','D','E'].includes(cls))errors.push(`${idx+1}행: 급수는 A~E로 입력해주세요.`);if(!['일반회원','회원','member','게스트','guest',''].includes(t))errors.push(`${idx+1}행: 구분은 일반회원 또는 게스트로 입력해주세요.`);rows.push({name,year,gender,cls,type,age:String(ageBand44(year))})});return{rows,errors}
}
window.submitBulk37=async function(){
 const p=parseBulk44($('bulkText37')?.value||'');if(!p.rows.length)return alert('등록할 회원 목록을 붙여넣어주세요.');if(p.errors.length)return alert(p.errors.slice(0,12).join('\n'));if(!confirm(`${group?.name||'현재 모임'}에 ${p.rows.length}명을 한 번에 등록하시겠습니까?`))return;
 try{const r=await fetch(BULK_V44,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({groupId:currentGroupId,members:p.rows}),cache:'no-store'});const x=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(x.error||'일괄등록에 실패했습니다.');e.details=x.details||[];throw e}S=x.data;normalizeClient();closeModal();renderAll();alert(`${Number(x.addedCount)||p.rows.length}명을 등록했습니다.`)}catch(e){alert([e.message,...(e.details||[]).slice(0,12)].join('\n'))}
};

const roleBadge43=roleBadge;
roleBadge=function(m){const r=roleOf(m);if(r==='member'&&m?.type!=='guest'&&!isTemp(m))return '<span class="roleBadge role-member44">일반회원</span>';return roleBadge43(m)};

const renderQueue43=renderQueue;
renderQueue=function(){
 renderQueue43();const box=$('queue');if(!box)return;
 const heads=[...box.querySelectorAll(':scope > .subhead')],pending=heads.find(x=>(x.textContent||'').includes('편성대기')),personal=heads.find(x=>(x.textContent||'').includes('개인 게임대기'));
 if(!pending||!personal)return;const children=[...box.children],pi=children.indexOf(pending),qi=children.indexOf(personal);if(pi<0||qi<0||pi>qi)return;
 const pendingNodes=children.slice(pi,qi),personalNodes=children.slice(qi);personalNodes.forEach(n=>box.appendChild(n));pendingNodes.forEach(n=>box.appendChild(n));
};

function renderCurrent44(id=currentView){
 if(id==='members')renderMembers();else if(id==='queue')renderQueue();else if(id==='playing')renderPlaying();else if(id==='stats')renderStats();else if(id==='settings')renderSettings();else if(id==='groups'&&canManageGroups())renderGroups();
}
renderAll=function(){
 if(!me)return;if(currentView==='groups'&&!canManageGroups())currentView='members';renderHeader();renderNav();renderCurrent44(currentView);document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===currentView));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===currentView));try{lastStateSig44=JSON.stringify([S,me?.role,me?.globalAdmin,group?.groupId])}catch(e){}
};
goView=function(id){
 if(id==='groups'&&!canManageGroups())id='members';currentView=id;renderNav();renderCurrent44(id);document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===id));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===id));if(id==='groups')loadGroups().catch(showError);window.scrollTo(0,0)
};

const act43=act;
act=async function(...args){actionBusy44++;try{return await act43(...args)}finally{actionBusy44=Math.max(0,actionBusy44-1)}};
loadState=async function(){
 if(actionBusy44)return;const x=await request('state','GET',null,{groupId:currentGroupId});const sig=JSON.stringify([x.data,x.user?.role,x.user?.globalAdmin,x.group?.groupId]);const changed=sig!==lastStateSig44;S=x.data;me=x.user;group=x.group;groups=x.groups||groups;currentGroupId=group.groupId;localStorage.setItem(GROUP_KEY,currentGroupId);normalizeClient();if(changed)renderAll();restoreRefreshState()
};

const renderSettings43=renderSettings;
renderSettings=function(){renderSettings43();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v43'))el.textContent='콕매치 v44 · 연령대 자동계산 · 대기화면 정렬 · 배지/반응속도 개선'})};

if(me)renderAll();
})();
