(()=>{
const V73_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v73-api';
const busy73=new Set();

function mine73(){
 if(me?.memberId){const m=M(String(me.memberId));if(m)return m}
 const n=String(me?.displayName||'').trim();
 return S.members.find(m=>String(m.name||'').trim()===n)||null;
}
function orderedMembers73(){
 const mine=mine73();if(!mine)return S.members.slice();
 return [mine,...S.members.filter(m=>String(m.id)!==String(mine.id))];
}
function businessMonth73(){
 const shifted=new Date(Date.now()-5*60*60*1000);
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit'}).format(shifted);
}
function attendanceHistory73(m){
 const h=m?.attendanceHistory&&typeof m.attendanceHistory==='object'&&!Array.isArray(m.attendanceHistory)?{...m.attendanceHistory}:{};
 const cm=String(m?.attendanceMonth||''),cc=Math.max(0,Number(m?.attendanceCount)||0);
 if(cm&&cc>0)h[cm]=Math.max(Number(h[cm])||0,cc);
 return h;
}
function totalAttendance73(m){return Object.values(attendanceHistory73(m)).reduce((a,v)=>a+Math.max(0,Number(v)||0),0)}
function joinText73(m){return String(m?.memberSince||'').trim()||'v73 이전 가입'}
function monthName73(k){const [y,m]=String(k).split('-');return y&&m?`${y}년 ${Number(m)}월`:String(k)}

window.openPairs=function(id){
 const m=M(id);if(!m)return;
 const h=attendanceHistory73(m),keys=Object.keys(h).sort().reverse(),total=totalAttendance73(m),current=businessMonth73();
 openModal(`<h3>${esc(m.name)} · 가입/출석 기록</h3>
  <div class="recordSummary73">
   <div><span>모임 가입</span><b>${esc(joinText73(m))}</b></div>
   <div><span>누적 출석</span><b>${total}회</b></div>
  </div>
  ${!m.memberSince?'<div class="note">기존 회원은 v73 적용 전의 정확한 가입일 데이터가 없어 임의 날짜를 만들지 않고 <b>v73 이전 가입</b>으로 표시합니다.</div>':''}
  <div class="subhead"><b>월별 출석 기록</b></div>
  ${keys.length?keys.map(k=>`<div class="attendanceRow73 ${k===current?'current':''}"><span>${esc(monthName73(k))}</span><b>${Math.max(0,Number(h[k])||0)}회</b></div>`).join(''):'<div class="empty">완료된 경기 기준 출석 기록이 아직 없습니다.</div>'}
  <div class="note" style="margin-top:9px">출석은 앱 입장이 아니라 해당 운영일에 경기를 1게임 이상 완료한 경우 하루 1회 인정됩니다.</div>
  <button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`);
};

function decorateMembers73(){
 const box=$('members');if(!box)return;
 const members=orderedMembers73(),cards=[...box.querySelectorAll('.memberCard')];
 cards.forEach((card,i)=>{
  const m=members[i];if(!m)return;
  card.classList.add('memberCard73');
  const info=card.querySelector('.memberInfo48')||card.children?.[1];if(!info)return;
  let rec=info.querySelector('.pairBtn:not(.partnerSetBtn66)');
  if(!rec){rec=document.createElement('button');rec.className='pairBtn recordBtn73';info.appendChild(rec)}
  rec.textContent='가입·출석 기록';rec.classList.add('recordBtn73');rec.setAttribute('onclick',`openPairs('${String(m.id).replace(/'/g,"\\'")}')`);
  const partner=info.querySelector('.partnerSetBtn66');
  let row=info.querySelector('.memberRecordActions73');
  if(!row){row=document.createElement('div');row.className='memberRecordActions73';info.appendChild(row)}
  if(rec.parentElement!==row)row.appendChild(rec);
  if(partner&&partner.parentElement!==row)row.appendChild(partner);
 });
}
const renderMembers72=renderMembers;
renderMembers=function(){renderMembers72();decorateMembers73()};

async function v73Request(action,body={}){
 const r=await fetch(V73_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'처리에 실패했습니다.')}
 return x;
}
async function applyV73(action,body={},render=true){
 const key=action+':'+String(body.pollId||body.gameId||body.pendingId||'');
 if(busy73.has(key))return null;busy73.add(key);
 try{const x=await v73Request(action,body);if(x.data){S=x.data;normalizeClient();if(render)renderAll()}return x}finally{busy73.delete(key)}
}
const act72=act;
act=async function(action,body={},opts={}){
 if(action==='begin_game'||action==='finish_game')return applyV73(action,body,true);
 return act72(action,body,opts);
};

function autoPollTitle73(date,time,location){
 const a=String(date||'').split('-').map(Number);if(a.length!==3||!a[1]||!a[2])return '운동 참석 투표';
 const place=String(location||'').trim();return `${a[1]}월 ${a[2]}일 ${time||''}${place?' · '+place:''} 운동 참석 투표`;
}
function timeOptions73(selected='19:00'){
 const out=[];for(let h=0;h<24;h++)for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;out.push(`<option value="${v}" ${v===selected?'selected':''}>${v}</option>`)}return out.join('');
}
window.syncPollTitle73=function(force=false){
 const title=$('pollTitle72'),date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';if(!title)return;
 if(force||title.dataset.manual!=='1')title.value=autoPollTitle73(date,time,location);
};
window.openPollCreate72=function(){
 if(!(me?.globalAdmin||me?.role==='manager'||me?.role==='organizer'))return alert('게임편성자 이상 권한이 필요합니다.');
 const d=todayKst();
 openModal(`<h3>운동 참석 투표 만들기</h3>
  <div class="field"><label>일자</label><input id="pollDate72" type="date" value="${esc(d)}"></div>
  <div class="field"><label>운동 시작 시간</label><select id="pollTime72">${timeOptions73('19:00')}</select><div class="meta">30분 단위로 선택합니다.</div></div>
  <div class="field"><label>운동 장소</label><input id="pollLocation73" maxlength="40" placeholder="예: 동탄체육센터"></div>
  <div class="field"><label>투표 제목</label><input id="pollTitle72" maxlength="60" value="${esc(autoPollTitle73(d,'19:00',''))}"><div class="meta">일자·시간·장소를 바꾸면 제목이 자동 작성됩니다. 제목은 직접 지우거나 자유롭게 수정할 수 있습니다.</div></div>
  <div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="createPoll72()">투표 시작</button></div>`);
 const title=$('pollTitle72');if(title)title.dataset.manual='0';
 $('pollDate72')?.addEventListener('change',()=>syncPollTitle73());
 $('pollTime72')?.addEventListener('change',()=>syncPollTitle73());
 $('pollLocation73')?.addEventListener('input',()=>syncPollTitle73());
 title?.addEventListener('input',()=>{title.dataset.manual='1'});
};
window.createPoll72=async function(){
 const date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';
 if(!date||!time)return alert('운동 일자와 시간을 선택해주세요.');if(!location)return alert('운동 장소를 입력해주세요.');
 let title=$('pollTitle72')?.value.trim()||'';if(!title)title=autoPollTitle73(date,time,location);
 try{await applyV73('poll_create',{date,time,location,title});closeModal();goView('stats')}catch(e){showError(e)}
};
function decoratePolls73(){
 const box=$('stats');if(!box)return;
 const ps=(Array.isArray(S.attendancePolls)?S.attendancePolls:[]).slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')));
 [...box.querySelectorAll('.pollCard72')].forEach((card,i)=>{
  const p=ps[i];if(!p||!p.location)return;
  const when=card.querySelector('.pollWhen72');if(when&&!card.querySelector('.pollLocation73'))when.insertAdjacentHTML('afterend',`<div class="pollLocation73">📍 ${esc(p.location)}</div>`);
 });
}
const renderStats72=renderStats;
renderStats=function(){renderStats72();decoratePolls73()};

function patchResetText73(box){
 [...box.querySelectorAll('.resetTier40,.rosterReset60')].forEach(card=>{
  const t=card.textContent||'';
  if(t.includes('가. 당일 게임 기록')){
   const d=card.querySelector('.meta,.warn');if(d)d.innerHTML='현재 모임의 개인대기·편성대기·진행중 경기·오늘 경기기록·참가상태를 초기화하고 이 모임 로그인세션을 종료합니다.<br><b>회원명부, 월간 출석 횟수와 월별 누적 출석기록은 유지</b>합니다.';
  }else if(t.includes('나. 누적기록 포함')){
   const d=card.querySelector('.meta,.warn');if(d)d.innerHTML='가 항목의 초기화에 더해 회원별 <b>월간 출석 횟수와 월별 누적 출석기록</b>, 같이한 경기 누적기록을 초기화하고 당일 파트너 설정도 해제합니다.<br><b>회원명단·역할·모임 가입일은 유지</b>합니다.';
  }else if(t.includes('다. 회원정보 전체 정리')){
   const d=card.querySelector('.warn,.meta');if(d)d.innerHTML='현재 모임에서 <b>총관리자와 모임관리자만 남기고</b> 게임편성자·일반회원·게스트 정보를 삭제합니다. 게임·대기·월간/누적 출석기록도 함께 초기화됩니다.<br>다른 모임에는 영향을 주지 않습니다.';
  }
 });
}
const renderSettings72=renderSettings;
renderSettings=function(){
 renderSettings72();const box=$('settings');if(!box)return;patchResetText73(box);
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v72'))el.textContent='콕매치 v73 · 가입/출석 기록 · 30분 투표시간 · 장소/자동제목'});
};

if(location.pathname.startsWith('/launch/v73'))history.replaceState(null,'','/?loaded=73');
if(me)renderAll();
})();
