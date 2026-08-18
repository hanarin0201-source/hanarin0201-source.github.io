(()=>{
const ADMIN_V36='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-admin-v36';

const renderQueue35=renderQueue;
renderQueue=function(){
  renderQueue35();
  const box=$('queue');
  if(!box)return;
  [...box.querySelectorAll('.composerActs button')].forEach(b=>{if((b.textContent||'').includes('선택 비우기'))b.remove()});
};

const renderSettings35=renderSettings;
renderSettings=function(){
  renderSettings35();
  const box=$('settings');
  if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v35'))el.textContent='콕매치 v36 · 모임별 회원명부 초기화 및 편성 UI 개선'});
  if(me?.globalAdmin){
    const cards=[...box.querySelectorAll(':scope > .card')];
    const home=cards.find(c=>(c.textContent||'').includes('홈 화면에 추가'));
    const html=`<div id="rosterReset36" class="card"><b>선택 모임 회원명부 전체 초기화</b><div class="warn" style="margin-top:8px"><b>${esc(group?.name||'현재 모임')}</b>에서 총관리자에 해당하는 회원과 모임관리자만 남기고 <b>일반회원·게임편성자·게스트를 모두 삭제</b>합니다. 개인 게임대기·편성대기·진행중 경기·오늘 경기기록·같이한 경기 기록도 초기화되며, 남겨진 관리자들의 누적 게임횟수도 0회로 초기화됩니다.<br><br>다른 모임에는 영향을 주지 않습니다.</div><button class="btn danger" style="width:100%" onclick="resetRosterGroup36()">선택 모임 회원명부 전체 초기화</button><div class="meta" style="margin-top:8px">총관리자 전용 · 총관리자 PIN 재확인 필요</div></div>`;
    if(home)home.insertAdjacentHTML('beforebegin',html);else box.insertAdjacentHTML('beforeend',html);
  }
};

window.resetRosterGroup36=async function(){
  if(!me?.globalAdmin)return alert('총관리자만 사용할 수 있습니다.');
  const pin=prompt('총관리자 PIN을 입력해주세요.');
  if(pin===null)return;
  if(!pin.trim())return alert('총관리자 PIN을 입력해주세요.');
  const gname=group?.name||'현재 모임';
  if(!confirm(`${gname}의 회원명부를 전체 초기화하시겠습니까?\n\n총관리자와 모임관리자만 남고 일반회원·게임편성자·게스트는 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`))return;
  try{
    const r=await fetch(ADMIN_V36,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action:'reset_roster_group',groupId:currentGroupId,pin:pin.trim()}),cache:'no-store'});
    const x=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(x.error||'회원명부 초기화에 실패했습니다.');
    S=x.data;normalizeClient();renderAll();goView('settings');
    alert(`${gname} 회원명부를 초기화했습니다.\n삭제된 인원: ${Number(x.removedCount)||0}명`);
  }catch(e){showError(e)}
};

const forceUpdate35=forceUpdateApp;
forceUpdateApp=async function(){
  if(!me?.globalAdmin)return forceUpdate35();
  saveRefreshState();
  const b=$('forceUpdateBtn');if(b){b.disabled=true;b.textContent='전체 이용자 최신화 중...'}
  try{
    const r=await fetch(ADMIN_V36,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action:'refresh_all'}),cache:'no-store'});
    const x=await r.json().catch(()=>({}));if(!r.ok)throw new Error(x.error||'전체 이용자 최신화에 실패했습니다.');
    location.replace('/refresh.html?from=v36&t='+Date.now());
  }catch(e){if(b){b.disabled=false;b.textContent='↻ 최신 버전으로 새로고침'}showError(e)}
};

const renderAll35=renderAll;
renderAll=function(){renderAll35();};
if(me)renderAll();

// Rescue old v36 app shells that are stuck in iOS/PWA cache.
if((location.pathname==='/'||location.pathname==='/index.html')&&/\bv36\b/i.test(document.title)){
  fetch('/latest-version.json?t='+Date.now(),{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(x=>{if(Number(x?.version||0)>36)location.replace('/refresh.html?stuck=v36&t='+Date.now())})
    .catch(()=>{});
}
})();
