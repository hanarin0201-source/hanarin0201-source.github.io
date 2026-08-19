(()=>{
let shuttleSeq52=0;

function canSeeGlobal52(){
 const mode=String(S?.adminBadgeVisibility||'all');
 if(me?.globalAdmin)return true;
 if(mode==='all')return true;
 if(mode==='staff')return me?.role==='manager'||me?.role==='organizer';
 return false;
}

function shuttleSvg52(kind){
 const uid=`k52_${kind}_${++shuttleSeq52}`;
 const glossy=kind==='global'||kind==='manager';
 const defs=`<defs>
  <radialGradient id="${uid}_cork" cx="34%" cy="28%" r="78%"><stop offset="0" stop-color="#fffef9"/><stop offset=".55" stop-color="#f1e4ca"/><stop offset="1" stop-color="#c8ae80"/></radialGradient>
  <linearGradient id="${uid}_gold" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8c5700"/><stop offset=".34" stop-color="#d79500"/><stop offset=".58" stop-color="#ffe173"/><stop offset=".78" stop-color="#f2b315"/><stop offset="1" stop-color="#935e00"/></linearGradient>
 </defs>`;
 const cork=`<g>
  <ellipse cx="4.9" cy="18.55" rx="3.65" ry="3.0" transform="rotate(-39 4.9 18.55)" fill="url(#${uid}_cork)" stroke="#746858" stroke-width=".72"/>
  <path d="M7.2 15.9 9.5 17.35" stroke="#766b5c" stroke-width="2.35" stroke-linecap="round"/>
  <path d="M7.3 15.65 9.55 17.08" stroke="#efe2ca" stroke-width="1.18" stroke-linecap="round"/>
 </g>`;
 const ribs=`<path d="M8.6 15.75 15.3 3.55M9.2 16.15 18.3 4.35M9.72 16.52 21.05 6.3" fill="none" stroke="#5d5954" stroke-opacity=".58" stroke-width=".58" stroke-linecap="round"/>
 <path d="M8.15 14.15c3.15 1.15 6.05 1.4 9.35.8" fill="none" stroke="#5d5954" stroke-opacity=".46" stroke-width=".58" stroke-linecap="round"/>`;
 if(kind==='global'){
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${defs}
   <path d="M7.75 15.05C9.25 10.3 11.05 6.15 13.55 2.95L16 3.35C15.3 7.45 13.45 12.05 9.3 16.2Z" fill="#ff3d66" stroke="#7b2341" stroke-width=".34"/>
   <path d="M8.25 15.42C10.7 10.55 13.25 6.3 16 3.35L18.6 4.35C17.25 8.25 14.25 12.8 9.72 16.55Z" fill="#ffb000" stroke="#8a6100" stroke-width=".34"/>
   <path d="M8.75 15.8C12.1 11.4 15.55 7.4 18.6 4.35L20.55 6.2C18.75 9.6 15.2 13.35 10.05 16.82Z" fill="#20c85a" stroke="#126b36" stroke-width=".34"/>
   <path d="M9.2 16.1C13.55 12.5 17.8 9.15 20.55 6.2L22.15 8.7C19.8 11.55 15.75 14.45 10.28 17.05Z" fill="#2387ff" stroke="#185da9" stroke-width=".34"/>
   <path d="M9.55 16.35C14.45 13.6 19.05 11.05 22.15 8.7L22.45 11.55C19.55 13.7 15.7 15.75 10.45 17.18Z" fill="#9a45f5" stroke="#6730a8" stroke-width=".34"/>
   <path d="M8.95 14.5C12.2 11.55 15.4 7.35 17.4 4.35M9.7 15.55C13.9 13 18.05 9.25 20.55 6.8" fill="none" stroke="#fff" stroke-opacity=".78" stroke-width=".78" stroke-linecap="round"/>
   ${ribs}${cork}</svg>`;
 }
 if(kind==='manager'){
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${defs}
   <path d="M7.75 15.05C9.3 10.2 11.3 6.05 13.7 3L16.05 3.35C15.35 7.5 13.6 12.1 9.3 16.2Z" fill="url(#${uid}_gold)" stroke="#835400" stroke-width=".38"/>
   <path d="M8.25 15.45C10.7 10.55 13.3 6.25 16.05 3.35L18.7 4.35C17.25 8.25 14.3 12.85 9.72 16.55Z" fill="url(#${uid}_gold)" stroke="#835400" stroke-width=".38"/>
   <path d="M8.75 15.82C12.15 11.35 15.55 7.45 18.7 4.35L20.65 6.25C18.75 9.65 15.25 13.4 10.05 16.82Z" fill="url(#${uid}_gold)" stroke="#835400" stroke-width=".38"/>
   <path d="M9.2 16.1C13.55 12.55 17.85 9.2 20.65 6.25L22.15 8.75C19.75 11.55 15.8 14.45 10.3 17.05Z" fill="url(#${uid}_gold)" stroke="#835400" stroke-width=".38"/>
   <path d="M9.05 14.55C12.25 11.55 15.45 7.35 17.45 4.45M9.75 15.58C13.9 13 18.05 9.3 20.55 6.9" fill="none" stroke="#fff7cf" stroke-opacity=".88" stroke-width=".78" stroke-linecap="round"/>
   ${ribs}${cork}</svg>`;
 }
 const colors=kind==='organizer'
  ?{a:'#a5abb2',b:'#c4c9ce',c:'#d8dce0',edge:'#747b83'}
  :{a:'#95552f',b:'#b96d3e',c:'#c98251',edge:'#704027'};
 return `<svg viewBox="0 0 24 24" aria-hidden="true">${defs}
  <path d="M7.75 15.05C9.3 10.2 11.25 6.05 13.7 3L16.05 3.35C15.35 7.5 13.55 12.1 9.3 16.2Z" fill="${colors.a}" stroke="${colors.edge}" stroke-width=".4"/>
  <path d="M8.25 15.45C10.7 10.55 13.3 6.25 16.05 3.35L18.7 4.35C17.25 8.25 14.3 12.85 9.72 16.55Z" fill="${colors.b}" stroke="${colors.edge}" stroke-width=".4"/>
  <path d="M8.75 15.82C12.15 11.35 15.55 7.45 18.7 4.35L20.65 6.25C18.75 9.65 15.25 13.4 10.05 16.82Z" fill="${colors.c}" stroke="${colors.edge}" stroke-width=".4"/>
  <path d="M9.2 16.1C13.55 12.55 17.85 9.2 20.65 6.25L22.15 8.75C19.75 11.55 15.8 14.45 10.3 17.05Z" fill="${colors.b}" stroke="${colors.edge}" stroke-width=".4"/>
  ${ribs}${cork}</svg>`;
}

function shuttleBadge52(kind,label){
 const glossy=kind==='global'||kind==='manager';
 return `<span class="roleShuttle52 role-${kind}52 ${glossy?'glossy52':'matte52'}" title="${esc(label)}" aria-label="${esc(label)}">${shuttleSvg52(kind)}</span>`;
}

roleBadge=function(m){
 const r=roleOf(m);
 const globalLike=r==='admin'||(me?.globalAdmin&&m?.name===me.displayName);
 if(globalLike){if(!canSeeGlobal52())return '';return shuttleBadge52('global','총관리자')}
 if(r==='manager')return shuttleBadge52('manager','모임관리자');
 if(r==='organizer')return shuttleBadge52('organizer','게임편성자');
 if(isTemp(m))return shuttleBadge52('temp','임시편성자');
 return '';
};

const renderSettings51=renderSettings;
renderSettings=function(){
 renderSettings51();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v51'))el.textContent='콕매치 v52 · 통통한 셔틀콕 아이콘 리디자인'});
};

if(location.pathname.startsWith('/launch/v52'))history.replaceState(null,'','/?loaded=52');
if(me)renderAll();
})();
