(()=>{
const WAIT71='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-wait-v71';
const SESSION_DAY71='kokmatch_session_business_day_v71';
let resetTimer71=null,registerBusy71=false;
const busy71=new Set();

function businessDay71(){const shifted=new Date(Date.now()-5*60*60*1000);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(shifted)}
function businessMonth71(){return businessDay71().slice(0,7)}
function nextResetAt71(){const [y,m,d]=businessDay71().split('-').map(Number);return Date.UTC(y,m-1,d+1)-4*60*60*1000}
function mine71(){if(me?.memberId){const m=M(String(me.memberId));if(m)return m}const n=String(me?.displayName||'').trim();return S.members.find(m=>String(m.name||'').trim()===n)||null}
function attendance71(m){return String(m?.attendanceMonth||'')===businessMonth71()?Math.max(0,Number(m?.attendanceCount)||0):0}
function monthLabel71(){return `${Number(businessMonth71().slice(5,7))}월`}
function orderedMembers71(){const mine=mine71();if(!mine)return S.members.slice();return [mine,...S.members.filter(m=>String(m.id)!==String(mine.id))]}

function forceDailyLogout71(){
 try{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(SESSION_DAY71)}catch{}
 T='';location.replace('/?daily5='+Date.now());
}
function armDailyReset71(){
 if(!me||!T)return;
 const d=businessDay71(),saved=localStorage.getItem(SESSION_DAY71)||'';
 if(saved&&saved!==d){forceDailyLogout71();return}
 localStorage.setItem(SESSION_DAY71,d);
 if(resetTimer71)clearTimeout(resetTimer71);
 resetTimer71=setTimeout(forceDailyLogout71,Math.max(1000,nextResetAt71()-Date.now()+700));
}
const loadState70=loadState;
loadState=async function(){const x=await loadState70();armDailyReset71();return x};
const logout70=logout;
logout=async function(){try{localStorage.removeItem(SESSION_DAY71)}catch{}return logout70()};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&me&&T)armDailyReset71()});
setInterval(()=>{if(me&&T)armDailyReset71()},60000);

const renderMembers70=renderMembers;
renderMembers=function(){
 renderMembers70();const box=$('members');if(!box)return;
 const members=orderedMembers71(),cards=[...box.querySelectorAll('.memberCard')];
 cards.forEach((card,i)=>{
  const m=members[i];if(!m)return;
  card.classList.add('memberCard71');
  card.querySelectorAll('.gamecnt').forEach(el=>{if((el.textContent||'').includes('총 게임'))el.remove()});
  const meta=card.querySelector('.meta');
  if(meta){
   meta.classList.add('memberMeta71');
   meta.querySelector('.memberAttendance71')?.remove();
   meta.insertAdjacentHTML('beforeend',` <span class="memberAttendance71">· ${monthLabel71()} 출석 ${attendance71(m)}회</span>`);
  }
 });
};

async function waitRequest71(action,body={}){
 const r=await fetch(WAIT71,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'처리에 실패했습니다.')}return x;
}
function renderFast71(){renderHeader();renderMembers();renderQueue();renderStats();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===currentView));}
function applyAttendanceLocal71(mid,mode){
 const m=M(mid);if(!m)return;
 S.queue=S.queue.filter(x=>String(x)!==String(mid));
 if(mode==='waiting'){
  if(m.state!=='waiting')m.joinedAt=Date.now();
  if(!S.queue.includes(mid))S.queue.push(mid);
 }else m.joinedAt=null;
 m.state=mode;
}
async function fastAttendance71(action,body){
 const mid=action==='set_my_attendance'?String(mine71()?.id||''):String(body.memberId||body.id||'');
 const m=M(mid);if(!m)throw new Error('회원을 찾을 수 없습니다.');
 const key='att:'+mid;if(busy71.has(key))return null;busy71.add(key);
 const prevMember={...m},prevQueue=S.queue.slice();
 applyAttendanceLocal71(mid,String(body.mode||''));renderFast71();
 try{
  const x=await waitRequest71(action,body);if(x.data){S=x.data;normalizeClient();renderFast71()}return x;
 }catch(e){Object.assign(m,prevMember);S.queue=prevQueue;renderFast71();throw e}
 finally{busy71.delete(key)}
}
const act70=act;
act=async function(action,body={},opts={}){
 if(action==='set_my_attendance'||action==='set_member_attendance')return fastAttendance71(action,body);
 if(action==='begin_game'||action==='finish_game'){
  const key=action+':'+String(body.gameId||body.pendingId||'');if(busy71.has(key))return null;busy71.add(key);
  try{const x=await waitRequest71(action,body);if(x.data){S=x.data;normalizeClient();renderAll()}return x}finally{busy71.delete(key)}
 }
 return act70(action,body,opts);
};

registerDraft=async function(forceRepeat=false){
 if(registerBusy71)return;
 const ps=draft.filter(Boolean);if(!ps.length)return alert('1명 이상 선택해주세요.');
 if(ps.length<4&&!confirm(`현재 ${ps.length}명입니다. 4명이 안 됐는데 편성대기로 등록하시겠습니까?`))return;
 registerBusy71=true;
 const snapshot={queue:S.queue.slice(),pending:S.pendingGames.map(g=>({...g,players:[...(g.players||[])]})),states:ps.map(id=>[id,{state:M(id)?.state,joinedAt:M(id)?.joinedAt}]),draft:draft.slice()};
 const tmp='v71tmp'+Date.now();
 S.pendingGames.push({id:tmp,players:ps.slice(),createdAt:Date.now()});
 S.queue=S.queue.filter(id=>!ps.includes(id));
 ps.forEach(id=>{const m=M(id);if(m)m.state='matched'});
 draft=[null,null,null,null];renderHeader();renderMembers();renderQueue();
 try{
  const x=await act('create_pending',{players:ps,forceRepeat:true},{repeat:{keep:()=>registerDraft(true),manual:()=>{clearDraft();closeModal()},recommend:()=>{closeModal();clearDraft();recommendDraft()}}});
  if(!x){S.queue=snapshot.queue;S.pendingGames=snapshot.pending;snapshot.states.forEach(([id,v])=>Object.assign(M(id)||{},v));draft=snapshot.draft;renderAll()}
 }catch(e){S.queue=snapshot.queue;S.pendingGames=snapshot.pending;snapshot.states.forEach(([id,v])=>Object.assign(M(id)||{},v));draft=snapshot.draft;renderAll();showError(e)}
 finally{registerBusy71=false}
};

const renderSettings70=renderSettings;
renderSettings=function(){renderSettings70();const box=$('settings');if(!box)return;[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v70'))el.textContent='콕매치 v71 · 새벽5시 자동초기화 · 월출석 · 반응속도 개선'})};
if(location.pathname.startsWith('/launch/v71'))history.replaceState(null,'','/?loaded=71');
if(me){armDailyReset71();renderAll()}
})();
