(()=>{
const PARTNER82='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-v66-api';
let partnerTarget82='',partnerSelected82='';

function businessDay82(){const shifted=new Date(Date.now()-5*60*60*1000);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(shifted)}
function validPartnerDay82(day){const d=String(day||''),b=businessDay82(),c=todayKst();return d===b||(b!==c&&d===c)}
function preparePartnerCompat82(){const b=businessDay82(),c=todayKst();if(b===c||!S?.members)return;for(const m of S.members){if(m?.partnerId&&String(m.partnerDay||'')===b)m.partnerDay=c}}
function partner82(m){if(!m||!m.partnerId||!validPartnerDay82(m.partnerDay))return null;const p=M(String(m.partnerId));return p?{id:String(p.id),name:String(p.name||''),member:p}:null}
function canSetPartner82(m){return !!m&&!!me&&(String(me.memberId||'')===String(m.id)||me.globalAdmin||me.role==='manager'||me.role==='organizer')}
function memberLabel82(m){if(!m)return '-';return `${String(m.name||'-')} ${String(m.age||'')}${String(m.cls||'')}${String(m.gender||'')}`.trim()}
function roleText82(m){if(!m)return'';if(m.type==='guest')return'게스트';const r=roleOf(m);return r==='admin'?'총관리자':r==='manager'?'모임관리자':r==='organizer'?'게임편성자':isTemp(m)?'임시편성자':'일반회원'}

async function partnerRequest82(action,body={}){
 const r=await fetch(PARTNER82,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}throw new Error(x.error||'파트너 처리에 실패했습니다.')}
 return x;
}
function partnerResultHtml82(q){
 const target=M(partnerTarget82),query=String(q||'').trim().toLowerCase();
 if(!query)return '<div class="partnerSearchHint82">이름을 입력하면 조회 결과가 표시됩니다.</div>';
 const rows=(S.members||[]).filter(m=>String(m.id)!==String(target?.id)&&String(m.name||'').toLowerCase().includes(query)).sort((a,b)=>{const an=String(a.name||'').toLowerCase(),bn=String(b.name||'').toLowerCase(),as=an.startsWith(query)?0:1,bs=bn.startsWith(query)?0:1;return as-bs||an.localeCompare(bn,'ko')}).slice(0,12);
 if(!rows.length)return '<div class="partnerSearchHint82">일치하는 회원이 없습니다.</div>';
 return rows.map(m=>`<button type="button" class="choiceBtn partnerSearchRow82" onclick="partnerChoose82('${esc(String(m.id))}')"><b>${esc(m.name)}</b><span class="meta">${esc(String(m.age||''))}${esc(String(m.cls||''))} · ${esc(String(m.gender||''))} · ${esc(roleText82(m))}</span></button>`).join('');
}
function updatePartnerPicked82(){const box=$('partnerPicked82');if(!box)return;const p=partnerSelected82?M(partnerSelected82):null;box.innerHTML=p?`<div class="partnerPickedCard82"><div><b>선택된 파트너</b><div class="meta">${esc(memberLabel82(p))} · ${esc(roleText82(p))}</div></div><button type="button" class="btn ghost" onclick="partnerClear82()">선택 해제</button></div>`:'<div class="partnerPickedNone82">선택된 파트너 없음</div>'}
window.partnerSearch82=function(v){const box=$('partnerResults82');if(box)box.innerHTML=partnerResultHtml82(v)};
window.partnerChoose82=function(id){partnerSelected82=String(id||'');updatePartnerPicked82();const input=$('partnerSearchInput82');if(input)input.value='';const box=$('partnerResults82');if(box)box.innerHTML='<div class="partnerSearchHint82">선택 완료 · 다른 이름을 검색하면 변경할 수 있습니다.</div>'};
window.partnerClear82=function(){partnerSelected82='';updatePartnerPicked82()};
window.openPartner66=function(id){preparePartnerCompat82();const m=M(String(id));if(!m)return;if(!canSetPartner82(m))return alert('본인 또는 관리 가능한 회원의 파트너만 설정할 수 있습니다.');const cur=partner82(m);partnerTarget82=String(m.id);partnerSelected82=cur?.id||'';openModal(`<h3>${esc(m.name)} · 오늘 파트너 설정</h3><div class="note">당일 운영 기준의 1:1 파트너입니다. 상대 회원에게도 서로 파트너로 표시되며, 기존 파트너가 있으면 교체됩니다. 자동 해제 기준은 <b>새벽 5시</b>입니다.</div><div class="field"><label>파트너 이름 검색</label><input id="partnerSearchInput82" autocomplete="off" placeholder="이름 입력 후 조회" oninput="partnerSearch82(this.value)"></div><div id="partnerResults82" class="partnerResults82"><div class="partnerSearchHint82">이름을 입력하면 조회 결과가 표시됩니다.</div></div><div id="partnerPicked82" class="partnerPicked82"></div><div class="meta partnerResetInfo82">새벽 5시가 되면 파트너 설정이 자동 해제됩니다.<br>리셋의 <b>나. 누적기록 포함 초기화</b> 또는 <b>다. 회원정보 전체 정리 초기화</b>에서도 해제됩니다.</div><div class="acts"><button class="btn ghost" onclick="closeModal()">취소</button><button class="btn pri" onclick="savePartner66('${esc(String(m.id))}')">저장</button></div>`);setTimeout(updatePartnerPicked82,0)};
window.savePartner66=async function(id){try{const x=await partnerRequest82('partner_set',{memberId:String(id),partnerId:partnerSelected82});if(x.data){S=x.data;normalizeClient();preparePartnerCompat82()}closeModal();renderAll()}catch(e){showError(e)}};

const renderMembers81=renderMembers;
renderMembers=function(){preparePartnerCompat82();return renderMembers81()};
const renderQueue81=renderQueue;
renderQueue=function(){preparePartnerCompat82();return renderQueue81()};
if(typeof renderPlaying==='function'){const renderPlaying81=renderPlaying;renderPlaying=function(){preparePartnerCompat82();return renderPlaying81()}}
const draftClick81=draftClick;
draftClick=function(id){preparePartnerCompat82();return draftClick81(id)};
const recommendDraft81=recommendDraft;
recommendDraft=function(){preparePartnerCompat82();return recommendDraft81()};

const renderSettings81=renderSettings;
renderSettings=function(){
 preparePartnerCompat82();renderSettings81();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{let t=el.textContent||'';if(t.includes('자정 자동 해제'))el.textContent=t.replace(/자정 자동 해제/g,'새벽 5시 자동 해제');if(t.includes('콕매치 v81'))el.textContent='콕매치 v82 · 새벽5시 파트너/게스트 정리 · 파트너검색 · 가독성 개선'});
};

if(location.pathname.startsWith('/launch/v82'))history.replaceState(null,'','/?loaded=82');
preparePartnerCompat82();if(me)renderAll();
})();
