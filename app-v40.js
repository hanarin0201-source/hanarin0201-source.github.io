(()=>{
const RESET_V40='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-reset-v40';
const ADMIN_REFRESH_V40='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-admin-v36';
const UPDATER_V40='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-updater';
const UPDATE_STATE40='kokmatch_update_state_v40';

function canDaily40(){return !!me&&(me.globalAdmin||me.role==='manager'||me.role==='organizer')}
function canCumulative40(){return !!me&&(me.globalAdmin||me.role==='manager')}
function canRoster40(){return !!me?.globalAdmin}
function pinRole40(){return me?.globalAdmin?'총관리자':me?.role==='manager'?'모임관리자':'게임편성자'}

const renderSettings39=renderSettings;
renderSettings=function(){
  renderSettings39();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll(':scope > .card')].forEach(c=>{
    const t=c.textContent||'';
    if(t.includes('모임 당일 운영 리셋')||t.includes('선택 모임 회원명부 전체 초기화'))c.remove();
  });
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v39'))el.textContent='콕매치 v40 · 업데이트 구조 개선 · 3단계 리셋 권한 분리'});
  if(!(canDaily40()||canCumulative40()||canRoster40()))return;
  const versionCard=[...box.querySelectorAll(':scope > .card')].find(c=>(c.textContent||'').includes('프로그램 버전'));
  const parts=[];
  if(canDaily40())parts.push(`<div class="card resetTier40"><b>가. 당일 게임 기록 및 로그인세션 초기화</b><div class="meta" style="margin:7px 0 10px;line-height:1.6">현재 모임의 개인대기·편성대기·진행중 경기·오늘 경기기록·참가상태를 초기화하고, 이 모임 로그인세션을 종료합니다.<br><b>회원명부, 누적 총 게임횟수, 같이한 경기 기록은 유지</b>합니다.</div><button class="btn danger" style="width:100%" onclick="resetTier40('reset_daily')">당일 기록 및 세션 초기화</button><div class="meta" style="margin-top:7px">권한: 게임편성자 · 모임관리자 · 총관리자</div></div>`);
  if(canCumulative40())parts.push(`<div class="card resetTier40"><b>나. 누적기록 포함 초기화</b><div class="meta" style="margin:7px 0 10px;line-height:1.6">가 항목의 초기화에 더해 회원명부에 저장된 <b>누적 총 게임횟수와 같이한 경기 기록까지 0으로 초기화</b>합니다.<br><b>회원명단과 역할은 그대로 유지</b>합니다.</div><button class="btn danger" style="width:100%" onclick="resetTier40('reset_cumulative')">누적기록까지 초기화</button><div class="meta" style="margin-top:7px">권한: 모임관리자 · 총관리자</div></div>`);
  if(canRoster40())parts.push(`<div class="card resetTier40"><b>다. 회원정보 전체 정리 초기화</b><div class="warn" style="margin:7px 0 10px;line-height:1.6">현재 모임에서 <b>총관리자와 모임관리자만 남기고</b> 게임편성자·일반회원·게스트 정보를 모두 삭제합니다. 게임·대기·누적기록도 함께 초기화됩니다.<br>다른 모임에는 영향을 주지 않습니다.</div><button class="btn danger" style="width:100%" onclick="resetTier40('reset_roster')">관리자 제외 인원정보 전체 초기화</button><div class="meta" style="margin-top:7px">권한: 총관리자 전용</div></div>`);
  if(parts.length){const html=`<div class="subhead"><b>모임 리셋</b></div>`+parts.join('');if(versionCard)versionCard.insertAdjacentHTML('beforebegin',html);else box.insertAdjacentHTML('beforeend',html)}
};

window.resetTier40=async function(action){
  const labels={reset_daily:'당일 게임 기록 및 로그인세션',reset_cumulative:'당일 기록과 회원 누적기록',reset_roster:'총관리자·모임관리자를 제외한 인원정보 전체'};
  const allowed=action==='reset_daily'?canDaily40():action==='reset_cumulative'?canCumulative40():canRoster40();
  if(!allowed)return alert('해당 초기화 권한이 없습니다.');
  const pin=prompt(`${pinRole40()} PIN을 입력해주세요.`);if(pin===null)return;if(!pin.trim())return alert('PIN을 입력해주세요.');
  const gname=group?.name||'현재 모임';
  let msg=`${gname}의 ${labels[action]}을(를) 초기화하시겠습니까?`;
  if(action==='reset_cumulative')msg+='\n\n회원명단은 유지되지만 누적 게임기록은 0으로 돌아갑니다.';
  if(action==='reset_roster')msg+='\n\n총관리자와 모임관리자를 제외한 회원정보가 삭제되며 되돌릴 수 없습니다.';
  if(!confirm(msg))return;
  try{
    const r=await fetch(RESET_V40,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,pin:pin.trim()}),cache:'no-store'});
    const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'초기화에 실패했습니다.');
    if(me?.globalAdmin){S=x.data;normalizeClient();renderAll();goView('settings');alert(action==='reset_roster'?`${gname} 초기화 완료\n삭제 인원: ${Number(x.removedCount)||0}명`:`${gname} 초기화를 완료했습니다.`)}
    else{localStorage.removeItem(TOKEN_KEY);T='';location.replace('/launch/v40.html?afterReset='+Date.now())}
  }catch(e){showError(e)}
};

function saveUpdateState40(){
  try{localStorage.setItem(UPDATE_STATE40,JSON.stringify({view:currentView||'settings',y:Math.max(0,scrollY||0),groupId:currentGroupId||'',at:Date.now()}))}catch{}
}
async function restoreUpdateState40(){
  let x=null;try{x=JSON.parse(localStorage.getItem(UPDATE_STATE40)||'null')}catch{}
  if(!x||Date.now()-Number(x.at||0)>180000){localStorage.removeItem(UPDATE_STATE40);return}
  localStorage.removeItem(UPDATE_STATE40);
  try{
    if(x.groupId&&me?.globalAdmin&&x.groupId!==currentGroupId){currentGroupId=x.groupId;localStorage.setItem('kokmatch_group_id',x.groupId);await loadState()}
    goView(x.view||'settings');requestAnimationFrame(()=>requestAnimationFrame(()=>scrollTo(0,Number(x.y)||0)));setTimeout(()=>scrollTo(0,Number(x.y)||0),250)
  }catch{}
}

forceUpdateApp=async function(){
  saveRefreshState();saveUpdateState40();
  const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent=me?.globalAdmin?'전체 이용자 최신화 중...':'최신 운영본 확인 중...'}
  try{
    if(me?.globalAdmin){const r=await fetch(ADMIN_REFRESH_V40,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action:'refresh_all'}),cache:'no-store'});const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'전체 이용자 최신화에 실패했습니다.')}
    location.replace(UPDATER_V40+'?from=v40&t='+Date.now())
  }catch(e){if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 새로고침'}showError(e)}
};

if(location.pathname.startsWith('/launch/v40'))history.replaceState(null,'','/?loaded=40');
let restoreTry40=0;const restoreTimer40=setInterval(()=>{restoreTry40++;if(me){clearInterval(restoreTimer40);restoreUpdateState40()}else if(restoreTry40>40)clearInterval(restoreTimer40)},150);
if(me)renderAll();
})();
