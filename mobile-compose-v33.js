(()=>{
const APP_VERSION='33';
const GUEST_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-guest-api';

const syncMemberAccessBefore33=syncMemberAccess;
const saveMemberBefore33=saveMember;

window.syncMemberAccess=function(){
 const org=me?.role==='organizer';
 if(!org)return syncMemberAccessBefore33();
 const adding=!editId;
 $('mr').disabled=true;
 $('mr').value='member';
 $('mp').value='';
 $('memberPinField').classList.add('hide');
 if(adding){
  $('mt').disabled=false;
  if(!['member','guest'].includes($('mt').value))$('mt').value='member';
  $('memberModalNote').textContent='게임편성자는 신규등록 시 일반회원 또는 게스트를 등록할 수 있습니다. 역할/PIN 설정은 총관리자 전용입니다.'
 }else{
  $('mt').disabled=true;
  $('mt').value='member';
  $('memberModalNote').textContent='게임편성자는 기존 일반회원 정보만 수정·삭제할 수 있습니다.'
 }
};

window.saveMember=async function(){
 const org=me?.role==='organizer';
 const adding=!editId;
 const guest=org&&adding&&$('mt').value==='guest';
 if(!guest)return saveMemberBefore33();
 const name=$('mn').value.trim();
 if(!name)return alert('이름을 입력해주세요.');
 const body={name,year:Number($('my').value),gender:$('mg').value,age:$('ma').value,cls:$('mc').value};
 const btn=$('saveMemberBtn');
 if(btn){btn.disabled=true;btn.textContent='등록 중...'}
 try{
  const r=await fetch(GUEST_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify(body),cache:'no-store'});
  const x=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(x.error||'게스트 등록에 실패했습니다.');
  closeM('memberModal');
  resetMemberForm();
  await load();
  applyRole();
  alert(name+'님을 게스트로 등록했습니다.')
 }catch(e){alert(e?.message||'게스트 등록에 실패했습니다.')}finally{
  if(btn){btn.disabled=false;btn.textContent='등록'}
 }
};

function version33(){
 const card=$('appVersionCard');if(!card)return;
 const archive=isAdmin()?'<a class="btn ghost archiveAdmin24" href="/versions/">구버전 보기</a>':'';
 card.innerHTML='<div class="versionRow"><div><b>프로그램 버전</b><div class="meta" style="font-size:14px;margin-top:5px">콕매치 v33</div></div><span class="tag">운영본</span></div><div class="versionBtns"><button id="forceUpdateBtn" class="btn pri" onclick="forceUpdateApp()">↻ 최신 버전으로 새로고침</button>'+archive+'</div><div class="meta" style="margin-top:8px;line-height:1.55">게임편성자도 신규등록 시 구분을 일반회원 또는 게스트로 선택할 수 있습니다. 기존 게스트 수정·삭제와 역할/PIN 설정 권한은 총관리자 전용입니다.</div>'
}

const renderBefore33=render;
render=function(){renderBefore33();version33()};
render();
})();
