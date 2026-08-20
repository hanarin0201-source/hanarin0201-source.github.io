(()=>{
function today74(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function formatJoin74(v){const s=String(v||today74());const a=s.split('-').map(Number);return a.length===3&&a[0]?`${a[0]}년 ${a[1]}월 ${a[2]}일`:s}
function history74(m){
 const h=m?.attendanceHistory&&typeof m.attendanceHistory==='object'&&!Array.isArray(m.attendanceHistory)?{...m.attendanceHistory}:{};
 const cm=String(m?.attendanceMonth||''),cc=Math.max(0,Number(m?.attendanceCount)||0);
 if(cm&&cc>0)h[cm]=Math.max(Number(h[cm])||0,cc);
 return h;
}
function groupedAttendance74(m){
 const h=history74(m),years={};
 Object.entries(h).forEach(([k,v])=>{const [y,mo]=String(k).split('-');if(!/^\d{4}$/.test(y)||!/^\d{2}$/.test(mo))return;(years[y]||(years[y]=[])).push({month:Number(mo),count:Math.max(0,Number(v)||0)})});
 Object.values(years).forEach(arr=>arr.sort((a,b)=>a.month-b.month));
 return Object.entries(years).sort((a,b)=>Number(b[0])-Number(a[0]));
}
function totalAttendance74(m){return Object.values(history74(m)).reduce((a,v)=>a+Math.max(0,Number(v)||0),0)}
window.openPairs=function(id){
 const m=M(id);if(!m)return;const groups=groupedAttendance74(m),total=totalAttendance74(m),currentYear=today74().slice(0,4);
 openModal(`<h3>${esc(m.name)} · 가입/출석 기록</h3>
  <div class="recordSummary73 recordSummary74"><div><span>모임 가입</span><b>${esc(formatJoin74(m.memberSince))}</b></div><div><span>누적 출석</span><b>${total}회</b></div></div>
  <div class="subhead"><b>연도별 · 월별 출석 기록</b></div>
  ${groups.length?groups.map(([year,months])=>`<div class="attendanceYear74 ${year===currentYear?'current':''}"><div class="attendanceYearHead74"><b>${esc(year)}년</b><span>${months.reduce((a,x)=>a+x.count,0)}회</span></div><div class="attendanceMonths74">${months.map(x=>`<div class="attendanceMonth74"><span>${x.month}월</span><b>${x.count}회</b></div>`).join('')}</div></div>`).join(''):'<div class="empty">완료된 경기 기준 출석 기록이 아직 없습니다.</div>'}
  <div class="note" style="margin-top:9px">출석은 앱 입장이 아니라 해당 운영일에 경기를 1게임 이상 완료한 경우 하루 1회 인정됩니다.</div>
  <button class="btn ghost" style="width:100%;margin-top:10px" onclick="closeModal()">닫기</button>`);
};

function autoPollTitle74(date,time,location){const a=String(date||'').split('-').map(Number);if(a.length!==3||!a[1]||!a[2])return '참석투표';const place=String(location||'').trim();return `${a[1]}월 ${a[2]}일 ${time||''}${place?' '+place:''} 참석투표`}
function timeOptions74(selected='19:00'){const out=[];for(let h=0;h<24;h++)for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;out.push(`<option value="${v}" ${v===selected?'selected':''}>${v}</option>`)}return out.join('')}
window.syncPollTitle74=function(force=false){const title=$('pollTitle72'),date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';if(!title)return;if(force||title.dataset.manual!=='1')title.value=autoPollTitle74(date,time,location)};
window.openPollCreate72=function(){
 if(!(me?.globalAdmin||me?.role==='manager'||me?.role==='organizer'))return alert('게임편성자 이상 권한이 필요합니다.');
 const d=today74();
 openModal(`<h3>운동 참석 투표 만들기</h3><div class="pollCreateForm74">
  <div class="field"><label>일자</label><input id="pollDate72" type="date" value="${esc(d)}"></div>
  <div class="field"><label>운동 시작 시간</label><select id="pollTime72">${timeOptions74('19:00')}</select><div class="meta">30분 단위로 선택합니다.</div></div>
  <div class="field"><label>운동 장소</label><input id="pollLocation73" maxlength="40" placeholder="신리천 2코트"></div>
  <div class="field"><label>투표 제목</label><input id="pollTitle72" maxlength="60" value="${esc(autoPollTitle74(d,'19:00',''))}"><div class="meta">설정한 일자 · 시간 · 장소를 기준으로 자동 작성되며, 원하는 제목으로 자유롭게 수정할 수 있습니다.</div></div>
  <div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="createPoll72()">투표 시작</button></div></div>`);
 const title=$('pollTitle72');if(title)title.dataset.manual='0';
 $('pollDate72')?.addEventListener('change',()=>syncPollTitle74());$('pollTime72')?.addEventListener('change',()=>syncPollTitle74());$('pollLocation73')?.addEventListener('input',()=>syncPollTitle74());title?.addEventListener('input',()=>{title.dataset.manual='1'});
};
window.createPoll72=async function(){
 const date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';
 if(!date||!time)return alert('운동 일자와 시간을 선택해주세요.');if(!location)return alert('운동 장소를 입력해주세요.');
 let title=$('pollTitle72')?.value.trim()||'';if(!title)title=autoPollTitle74(date,time,location);
 try{await applyV73('poll_create',{date,time,location,title});closeModal();goView('stats')}catch(e){showError(e)}
};

const renderSettings73=renderSettings;
renderSettings=function(){renderSettings73();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v73'))el.textContent='콕매치 v74 · 회원정보 좌측정렬 · 연도별출석 · 투표폼 개선'})};
if(location.pathname.startsWith('/launch/v74'))history.replaceState(null,'','/?loaded=74');
if(me)renderAll();
})();
