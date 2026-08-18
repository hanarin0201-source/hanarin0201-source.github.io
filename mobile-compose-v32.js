(()=>{
const APP_VERSION='32';

const css=document.createElement('style');
css.textContent=`
/* 임시편성자 배지는 연한 핑크 계열로 통일 */
.roleTemp28,.roleTemp31{background:#fde8f0!important;color:#b23a65!important;border:1px solid #f3b8cd!important}
`;
document.head.appendChild(css);

function version32(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v32</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">임시편성자 역할 배지를 연한 핑크색 계열로 변경했습니다. 총관리자 금색, 게임편성자 녹색은 그대로 유지합니다.</div>'
}

const renderBefore32=render;
render=function(){renderBefore32();version32()};
render();
})();
