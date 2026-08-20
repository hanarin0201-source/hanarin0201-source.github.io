(()=>{
const V76_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v73-api';

function pollAdmin76(){return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer')}
function pollList76(){S.attendancePolls=Array.isArray(S.attendancePolls)?S.attendancePolls:[];return S.attendancePolls}
function votes76(p){return p?.memberVotes&&typeof p.memberVotes==='object'?p.memberVotes:{}}
function yesMembers76(p){return Object.keys(votes76(p)).filter(id=>votes76(p)[id]==='yes').map(M).filter(m=>m&&m.type!=='guest')}
function roleRank76(m){const r=roleOf(m);if(r==='admin')return 0;if(r==='manager')return 1;if(r==='organizer')return 2;if(isTemp(m))return 3;return 4}
function genderChip76(m){const f=m?.gender==='여';return `<span class="pollGender72 ${f?'female':'male'}">${f?'여':'남'}</span>`}
function dateWeekday76(v){
 const a=String(v||'').split('-').map(Number);if(a.length!==3||!a[0]||!a[1]||!a[2])return '-';
 const d=new Date(Date.UTC(a[0],a[1]-1,a[2]));return ['일','월','화','수','목','금','토'][d.getUTCDay()]+'요일';
}
function today76(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function autoTitle76(date,time,location){const a=String(date||'').split('-').map(Number);if(a.length!==3||!a[1]||!a[2])return '참석투표';const place=String(location||'').trim();return `${a[1]}월 ${a[2]}일 ${time||''}${place?' '+place:''} 참석투표`}
function timeOptions76(selected='18:30'){const out=[];for(let h=0;h<24;h++)for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;out.push(`<option value="${v}" ${v===selected?'selected':''}>${v}</option>`)}return out.join('')}

async function request76(action,body={}){
 const r=await fetch(V76_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'처리에 실패했습니다.')}
 if(x.data){S=x.data;normalizeClient();renderAll()}
 return x;
}

window.syncPollDate76=function(){const el=$('pollWeekday76');if(el)el.textContent=dateWeekday76($('pollDate72')?.value||'')};
window.syncPollTitle76=function(force=false){
 const title=$('pollTitle72'),date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';if(!title)return;
 if(force||title.dataset.manual!=='1')title.value=autoTitle76(date,time,location);
};
window.openPollCreate72=function(){
 if(!pollAdmin76())return alert('게임편성자 이상 권한이 필요합니다.');
 const d=today76(),time='18:30';
 openModal(`<h3>운동 참석 투표 만들기</h3><div class="pollCreateForm74">
  <div class="field"><label>일자</label><div class="pollDateRow76"><input id="pollDate72" type="date" value="${esc(d)}"><span id="pollWeekday76" class="pollWeekday76">${dateWeekday76(d)}</span></div></div>
  <div class="field"><label>운동 시작 시간</label><select id="pollTime72">${timeOptions76(time)}</select><div class="meta">30분 단위로 선택합니다.</div></div>
  <div class="field"><label>운동 장소</label><input id="pollLocation73" maxlength="40" placeholder="예: 신리천 2코트"></div>
  <div class="field"><label>투표 제목</label><input id="pollTitle72" maxlength="60" value="${esc(autoTitle76(d,time,''))}"><div class="meta">설정한 일자 · 시간 · 장소를 기준으로 자동 작성되며, 원하는 제목으로 자유롭게 수정할 수 있습니다.</div></div>
  <div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="createPoll72()">투표 시작</button></div></div>`);
 const title=$('pollTitle72');if(title)title.dataset.manual='0';
 $('pollDate72')?.addEventListener('change',()=>{syncPollDate76();syncPollTitle76()});
 $('pollTime72')?.addEventListener('change',()=>syncPollTitle76());
 $('pollLocation73')?.addEventListener('input',()=>syncPollTitle76());
 title?.addEventListener('input',()=>{title.dataset.manual='1'});
};
window.createPoll72=async function(){
 const date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';
 if(!date||!time)return alert('운동 일자와 시간을 선택해주세요.');if(!location)return alert('운동 장소를 입력해주세요.');
 let title=$('pollTitle72')?.value.trim()||'';if(!title)title=autoTitle76(date,time,location);
 try{await request76('poll_create',{date,time,location,title});closeModal();goView('stats')}catch(e){showError(e)}
};

window.openPollMembers72=function(id){
 const p=pollList76().find(x=>String(x.id)===String(id));if(!p)return;
 const ms=yesMembers76(p).sort((a,b)=>roleRank76(a)-roleRank76(b)||String(a.name||'').localeCompare(String(b.name||''),'ko'));
 openModal(`<h3>참석 회원 ${ms.length}명</h3>${ms.length?ms.map(m=>`<div class="pollMember72 pollMember76">${genderChip76(m)}<span class="pollName72">${esc(m.name)}</span>${ageTag(m)}${roleBadge(m)}</div>`).join(''):'<div class="empty">참석을 선택한 회원이 없습니다.</div>'}<button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`);
};

function cleanPollCards76(){
 const box=$('stats');if(!box)return;
 [...box.querySelectorAll('.pollCard72')].forEach(card=>{
  const meta=card.querySelector('.pollHead72 .meta');if(meta&&/^개설\s/.test((meta.textContent||'').trim()))meta.remove();
 });
}
const renderStats75=renderStats;
renderStats=function(){renderStats75();cleanPollCards76()};

const renderSettings75=renderSettings;
renderSettings=function(){renderSettings75();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v75'))el.textContent='콕매치 v76 · 회원명부 정보구역 정리 · 투표 요일/회원표시 개선'})};
if(location.pathname.startsWith('/launch/v76'))history.replaceState(null,'','/?loaded=76');
if(me)renderAll();
})();
