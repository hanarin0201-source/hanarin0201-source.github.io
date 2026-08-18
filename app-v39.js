(()=>{
// v39: Galaxy login input stability + clearer gender distinction in member/queue views.

function loginInputCommon39(el){
  if(!el)return;
  el.setAttribute('autocapitalize','off');
  el.setAttribute('spellcheck','false');
  el.style.fontSize='16px';
}

renderLoginName=function(){
  const box=$('loginBox');if(!box)return;
  box.innerHTML=`<h1>🏸 콕매치</h1><div class="meta" style="font-size:14px;margin-bottom:18px">모임 회원 로그인</div><div class="field"><label>등록된 이름</label><input id="loginName" type="text" autocomplete="username" enterkeyhint="next" placeholder="이름"></div><button class="btn pri" style="width:100%" onclick="startLogin()">다음</button><div id="loginErr" class="error"></div><div class="note" style="margin-top:12px">일반회원은 <b>소속 모임 PIN</b>, 모임관리자·게임편성자는 <b>본인 역할 PIN</b>으로 로그인합니다.</div>`;
  const name=$('loginName');loginInputCommon39(name);
  name?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();startLogin()}});
};

startLogin=async function(){
  const name=$('loginName')?.value.trim()||'';
  const err=$('loginErr');if(err)err.textContent='';
  if(!name){if(err)err.textContent='이름을 입력해주세요.';return}
  try{
    const x=await request('login_probe','POST',{name});pendingLoginName=name;
    const box=$('loginBox');if(!box)return;
    box.innerHTML=`<h2>${esc(x.roleLabel||'PIN')} 인증</h2><div class="authName">${esc(name)}</div><div class="field"><label>PIN</label><input id="loginPin" class="pinInput39" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="one-time-code" enterkeyhint="done" placeholder="PIN 입력"></div><button class="btn pri" style="width:100%" onclick="submitLogin()">로그인</button><div id="loginErr" class="error"></div><button class="btn ghost" style="width:100%;margin-top:8px" onclick="renderLoginName()">← 이름 다시 입력</button><div class="meta loginTapHint39">키패드가 바로 열리지 않으면 PIN 입력칸을 한 번 눌러주세요.</div>`;
    const pin=$('loginPin');loginInputCommon39(pin);
    pin?.addEventListener('input',()=>{const v=pin.value.replace(/\D/g,'').slice(0,8);if(pin.value!==v)pin.value=v});
    pin?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();submitLogin()}});
    // Do not programmatically focus after DOM replacement. Samsung Keyboard/PWA can show a keyboard
    // whose input connection is not ready when focus is forced asynchronously.
  }catch(e){if(err)err.textContent=e.message}
};

function genderSymbol39(m){return m?.gender==='여'?'여':'남'}
function genderClass39(m){return m?.gender==='여'?'female':'male'}
function genderInline39(m){return `<span class="genderInline39 ${genderClass39(m)}">${genderSymbol39(m)}</span>`}

avatar=function(m){
  return `<div class="avatar genderAvatar39 ${genderClass39(m)}" aria-label="${genderSymbol39(m)}성"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg><span>${genderSymbol39(m)}</span></div>`;
};

function decorateQueueGender39(){
  const box=$('queue');if(!box)return;
  const q=typeof sortedQueue==='function'?sortedQueue():[];
  [...box.querySelectorAll('.queueCard')].forEach((card,i)=>{
    if(card.querySelector('.genderMini39'))return;
    const m=M(q[i]);if(!m)return;
    const ord=card.querySelector('.ord');
    if(ord)ord.insertAdjacentHTML('afterend',`<span class="genderMini39 ${genderClass39(m)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"></circle><path d="M4.5 21c.5-5 3.2-8 7.5-8s7 3 7.5 8z"></path></svg></span>`);
  });
  const selected=Array.isArray(draft)?draft:[];
  [...box.querySelectorAll('.composer .slot.filled')].forEach((slot,i)=>{
    const name=slot.querySelector('.slotName');const m=M(selected[i]);
    if(name&&m&&!name.querySelector('.genderInline39'))name.insertAdjacentHTML('afterbegin',genderInline39(m)+' ');
  });
  [...box.querySelectorAll('.pendingCard')].forEach((card,gi)=>{
    const pg=S.pendingGames?.[gi];if(!pg)return;
    [...card.querySelectorAll('.pendingSlot:not(.emptySlot)')].forEach((slot,pi)=>{
      const name=slot.querySelector('.slotName');const m=M(pg.players?.[pi]);
      if(name&&m&&!name.querySelector('.genderInline39'))name.insertAdjacentHTML('afterbegin',genderInline39(m)+' ');
    });
  });
}

const renderQueue38=renderQueue;
renderQueue=function(){renderQueue38();decorateQueueGender39()};

const renderSettings38=renderSettings;
renderSettings=function(){
  renderSettings38();
  const box=$('settings');if(!box)return;
  [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v38'))el.textContent='콕매치 v39 · 갤럭시 로그인 입력 안정화 · 남녀 표시 강화'});
};

if(me)renderAll();
})();
