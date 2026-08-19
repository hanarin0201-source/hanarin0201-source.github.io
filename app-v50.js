(()=>{
const roleBadge49=roleBadge;
const ageTag49=ageTag;

function shuttleSvg50(kind){
 const commonHead='<ellipse cx="9" cy="3.2" rx="4" ry="2.2" fill="#f7f4ec" stroke="#6d6253" stroke-width=".7"/><rect x="6.2" y="4.8" width="5.6" height="2.1" rx="1" fill="#d9d2c4" stroke="#756b5d" stroke-width=".55"/>';
 if(kind==='global')return `<svg viewBox="0 0 18 22" aria-hidden="true">${commonHead}<path d="M6.4 6.5 1.5 19.5h3.1L8 6.6z" fill="#ff3b5c"/><path d="M7.6 6.4 5 20h3L9 6.4z" fill="#ffb000"/><path d="M9 6.4 8 20h3L10.4 6.4z" fill="#20c85a"/><path d="M10.3 6.4 11 20h3L11.6 6.5z" fill="#218cff"/><path d="M11.5 6.5 14 19.5h2.5L12.6 6.6z" fill="#a03cff"/><path d="M3.1 16.4c3.7-1.2 8.2-1.2 12 0" fill="none" stroke="#fff" stroke-opacity=".78" stroke-width=".9"/><path d="M7 8.2c1.5-.7 3-.7 4.3 0" fill="none" stroke="#fff" stroke-opacity=".82" stroke-width=".75" stroke-linecap="round"/></svg>`;
 if(kind==='manager')return `<svg viewBox="0 0 18 22" aria-hidden="true">${commonHead}<path d="M6.3 6.4 1.8 19.5h3L8 6.5z" fill="#d99700"/><path d="M7.6 6.4 5 20h3L9 6.4z" fill="#f2b400"/><path d="M9 6.4 8 20h3L10.4 6.4z" fill="#ffd84d"/><path d="M10.3 6.4 11 20h3L11.6 6.5z" fill="#f0ad00"/><path d="M11.5 6.5 14 19.5h2.2L12.7 6.5z" fill="#c98900"/><path d="M3 16.2c3.9-1.1 8.2-1.1 12.2 0" fill="none" stroke="#fff9d1" stroke-opacity=".9" stroke-width=".9"/><path d="M7.1 8c1.4-.65 2.8-.65 4.2 0" fill="none" stroke="#fff" stroke-opacity=".86" stroke-width=".75" stroke-linecap="round"/></svg>`;
 if(kind==='organizer')return `<svg viewBox="0 0 18 22" aria-hidden="true">${commonHead}<path d="M6.3 6.4 1.8 19.5h3L8 6.5z" fill="#aeb4bb"/><path d="M7.6 6.4 5 20h3L9 6.4z" fill="#c9ced3"/><path d="M9 6.4 8 20h3L10.4 6.4z" fill="#b8bec4"/><path d="M10.3 6.4 11 20h3L11.6 6.5z" fill="#d0d4d8"/><path d="M11.5 6.5 14 19.5h2.2L12.7 6.5z" fill="#9da4ab"/><path d="M3 16.3c4-1 8.2-1 12.2 0" fill="none" stroke="#858c93" stroke-width=".72"/></svg>`;
 return `<svg viewBox="0 0 18 22" aria-hidden="true">${commonHead}<path d="M6.3 6.4 1.8 19.5h3L8 6.5z" fill="#9b5c32"/><path d="M7.6 6.4 5 20h3L9 6.4z" fill="#b66f3f"/><path d="M9 6.4 8 20h3L10.4 6.4z" fill="#a96339"/><path d="M10.3 6.4 11 20h3L11.6 6.5z" fill="#c17a48"/><path d="M11.5 6.5 14 19.5h2.2L12.7 6.5z" fill="#8f512d"/><path d="M3 16.3c4-1 8.2-1 12.2 0" fill="none" stroke="#744326" stroke-width=".72"/></svg>`;
}
function shuttleBadge50(kind,label){
 const glossy=kind==='global'||kind==='manager';
 return `<span class="roleShuttle50 role-${kind}50${glossy?' glossy50':' matte50'}" title="${esc(label)}" aria-label="${esc(label)}">${shuttleSvg50(kind)}</span>`;
}
roleBadge=function(m){
 const r=roleOf(m),prior=roleBadge49(m);
 const globalLike=r==='admin'||(me?.globalAdmin&&m?.name===me.displayName);
 if(globalLike){if(!prior)return '';return shuttleBadge50('global','총관리자')}
 if(r==='manager')return shuttleBadge50('manager','모임관리자');
 if(r==='organizer')return shuttleBadge50('organizer','게임편성자');
 if(isTemp(m))return shuttleBadge50('temp','임시편성자');
 return prior;
};

ageTag=function(m){
 const c=String(m?.cls||'C').trim().toUpperCase();
 const safe=['A','B','C','D','E'].includes(c)?c:'C';
 return `<span class="tag gradeBadge50 grade-${safe.toLowerCase()}50">${esc(m?.age||'30')}${esc(safe)}</span>`;
};

const renderSettings49=renderSettings;
renderSettings=function(){
 renderSettings49();
 const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v49'))el.textContent='콕매치 v50 · 급수 컬러 · 셔틀콕 역할 아이콘';
 });
};

if(location.pathname.startsWith('/launch/v50'))history.replaceState(null,'','/?loaded=50');
if(me)renderAll();
})();
