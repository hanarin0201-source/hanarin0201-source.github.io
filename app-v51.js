(()=>{
let shuttleSeq51=0;

function canSeeGlobal51(){
 const mode=String(S?.adminBadgeVisibility||'all');
 if(me?.globalAdmin)return true;
 if(mode==='all')return true;
 if(mode==='staff')return me?.role==='manager'||me?.role==='organizer';
 return false;
}

function shuttleSvg51(kind){
 const uid=`k51_${kind}_${++shuttleSeq51}`;
 const isGloss=kind==='global'||kind==='manager';
 const palette={
  manager:['#8F5A00','#D89A00','#FFD34E','#FFF0A6'],
  organizer:['#9298A1','#B9BEC6','#D1D5DA','#777F89'],
  temp:['#87502E','#A96238','#C47A49','#704027']
 };
 const defs=isGloss?`<defs>
  <linearGradient id="${uid}_gold" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8D5900"/><stop offset=".36" stop-color="#D89A00"/><stop offset=".63" stop-color="#FFE070"/><stop offset=".82" stop-color="#F4B719"/><stop offset="1" stop-color="#9A6300"/></linearGradient>
  <radialGradient id="${uid}_cork" cx="35%" cy="28%" r="78%"><stop offset="0" stop-color="#FFFDF8"/><stop offset=".58" stop-color="#F1E7D2"/><stop offset="1" stop-color="#CDBB98"/></radialGradient>
 </defs>`:`<defs><radialGradient id="${uid}_cork" cx="35%" cy="28%" r="78%"><stop offset="0" stop-color="#FFFDF8"/><stop offset=".6" stop-color="#EEE3CE"/><stop offset="1" stop-color="#C7B48F"/></radialGradient></defs>`;
 const cork=`<g>
  <ellipse cx="4.65" cy="18.95" rx="3.15" ry="2.6" transform="rotate(-38 4.65 18.95)" fill="url(#${uid}_cork)" stroke="#756C60" stroke-width=".65"/>
  <path d="M6.35 16.48 9.15 18.18" stroke="#72685C" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M6.55 16.2 9.28 17.9" stroke="#E8DDC9" stroke-width="1.15" stroke-linecap="round"/>
 </g>`;
 const frame=`<path d="M8.05 15.55 15.4 3.35M8.65 16.05 18.5 4.25M9.2 16.55 21.35 7.15" fill="none" stroke="#5F5B56" stroke-opacity=".55" stroke-width=".56" stroke-linecap="round"/>
  <path d="M8.05 15.55 9.25 16.45 10.1 17.05" fill="none" stroke="#6B6258" stroke-width=".65" stroke-linecap="round"/>`;
 if(kind==='global'){
  return `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">${defs}
   <path d="M7.55 15.55 9.15 16.32 16.1 3.1 13.75 3.65Z" fill="#FF3D67" stroke="#7B2342" stroke-width=".35"/>
   <path d="M8.05 15.75 9.62 16.45 18.45 4.05 16.15 3.15Z" fill="#FFB000" stroke="#8A6100" stroke-width=".35"/>
   <path d="M8.55 16.05 10 16.7 20.35 5.65 18.45 4.05Z" fill="#20C85A" stroke="#126B36" stroke-width=".35"/>
   <path d="M8.95 16.35 10.2 17.05 22 8.15 20.35 5.65Z" fill="#2387FF" stroke="#185DA9" stroke-width=".35"/>
   <path d="M9.35 16.6 10.45 17.25 22.45 10.75 22 8.15Z" fill="#9A45F5" stroke="#6730A8" stroke-width=".35"/>
   <path d="M9.1 15.2 17.4 4.55M9.8 16.1 20.9 7.15" stroke="#FFF" stroke-opacity=".76" stroke-width=".7" stroke-linecap="round"/>
   ${frame}${cork}</svg>`;
 }
 const p=palette[kind]||palette.temp;
 const featherFill=kind==='manager'?`url(#${uid}_gold)`:p[1];
 const secondary=kind==='manager'?`url(#${uid}_gold)`:p[2];
 const dark=kind==='manager'?'#8A5A00':p[3];
 const shine=kind==='manager'?`<path d="M9.05 15.2 17.2 4.8M9.72 15.85 20.4 7.15" stroke="#FFF6C6" stroke-opacity=".82" stroke-width=".68" stroke-linecap="round"/>`:'';
 return `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">${defs}
  <path d="M7.55 15.55 9.18 16.35 16.1 3.2 13.7 3.7Z" fill="${featherFill}" stroke="${dark}" stroke-width=".38"/>
  <path d="M8.05 15.82 9.66 16.55 19.1 4.25 16.1 3.2Z" fill="${secondary}" stroke="${dark}" stroke-width=".38"/>
  <path d="M8.55 16.12 10.02 16.82 21.15 6.35 19.1 4.25Z" fill="${featherFill}" stroke="${dark}" stroke-width=".38"/>
  <path d="M8.95 16.42 10.25 17.08 22.15 9.2 21.15 6.35Z" fill="${secondary}" stroke="${dark}" stroke-width=".38"/>
  ${shine}${frame}${cork}</svg>`;
}

function shuttleBadge51(kind,label){
 const glossy=kind==='global'||kind==='manager';
 return `<span class="roleShuttle51 role-${kind}51 ${glossy?'glossy51':'matte51'}" title="${esc(label)}" aria-label="${esc(label)}">${shuttleSvg51(kind)}</span>`;
}

roleBadge=function(m){
 const r=roleOf(m);
 const globalLike=r==='admin'||(me?.globalAdmin&&m?.name===me.displayName);
 if(globalLike){
  if(!canSeeGlobal51())return '';
  return shuttleBadge51('global','총관리자');
 }
 if(r==='manager')return shuttleBadge51('manager','모임관리자');
 if(r==='organizer')return shuttleBadge51('organizer','게임편성자');
 if(isTemp(m))return shuttleBadge51('temp','임시편성자');
 return '';
};

const renderSettings50=renderSettings;
renderSettings=function(){
 renderSettings50();
 const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v50'))el.textContent='콕매치 v51 · 셔틀콕 아이콘 리디자인 · 일반회원 배지 제거';
 });
};

if(location.pathname.startsWith('/launch/v51'))history.replaceState(null,'','/?loaded=51');
if(me)renderAll();
})();
