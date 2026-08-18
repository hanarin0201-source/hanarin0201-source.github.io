(()=>{
const APP_VERSION='31';

const css=document.createElement('style');
css.textContent=`
/* 기존 기본 UI의 보라색 역할 배지는 더 이상 표시하지 않는다. */
.roleTag{display:none!important}
/* v29 색상 체계 유지 */
.roleMark31{display:inline-block;margin-left:5px;border-radius:999px;padding:3px 7px;font-size:11px;font-weight:900;vertical-align:1px;white-space:nowrap;line-height:1.15}
.roleAdmin31{background:#fff2bd;color:#816000;border:1px solid #e5c85f}
.roleOrganizer31{background:#e7f7ec;color:#167245;border:1px solid #a9ddbc}
.roleTemp31{background:#fff1d8;color:#9a5a00;border:1px solid #efd39a}
`;
document.head.appendChild(css);

function todayKst31(){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const get=t=>parts.find(x=>x.type===t)?.value||'';
 return get('year')+'-'+get('month')+'-'+get('day')
}
function roleType31(m){
 if(!m)return'';
 if(m.role==='admin')return'admin';
 if(m.role==='organizer')return'organizer';
 if(m.type!=='guest'&&(m.role||'member')==='member'&&m.state!=='out'&&String(m.tempOrganizerDay||'')===todayKst31())return'temp';
 return''
}
function roleBadge31(m){
 const r=roleType31(m);
 if(r==='admin')return'<span class="roleMark31 roleAdmin31">총관리자</span>';
 if(r==='organizer')return'<span class="roleMark31 roleOrganizer31">게임편성자</span>';
 if(r==='temp')return'<span class="roleMark31 roleTemp31">임시편성자</span>';
 return''
}

function normalizeExistingBadges31(){
 /* v28에서 추가한 배지는 색상/형식은 유지하되 기존 보라색 배지만 제거한다. */
 document.querySelectorAll('#queue .roleTag,#playing .roleTag,#members .roleTag').forEach(x=>x.remove());
}

function decorateMembers31(){
 const cards=[...document.querySelectorAll('#ml .card.member')];
 cards.forEach((card,i)=>{
  const m=(S.members||[])[i];
  const line=card.querySelector('.name');
  if(!line||!m)return;
  line.querySelectorAll('.roleTag,.roleMark31').forEach(x=>x.remove());
  const old=line.querySelector('.roleMark28');
  if(old)old.remove();
  const badge=roleBadge31(m);
  if(badge)line.insertAdjacentHTML('beforeend',badge)
 })
}

function version31(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v31</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">기존 보라색 역할 배지를 제거하고 역할 배지를 한 번만 표시합니다. 회원명부도 게임대기와 동일하게 항목 맨 끝에 총관리자 금색, 게임편성자 녹색 배지를 표시합니다.</div>'
}

const renderBefore31=render;
render=function(){
 renderBefore31();
 normalizeExistingBadges31();
 decorateMembers31();
 version31()
};
render();
})();
