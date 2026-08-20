(()=>{
const ROLE_REPLACE83=[['임시편성자','편성자'],['게임편성자','운영진'],['모임관리자','모임장'],['일반회원','일반']];

roleLabel=function(r){return r==='admin'?'총관리자':r==='manager'?'모임장':r==='organizer'?'운영진':'일반'};

function translateString83(v){let s=String(v??'');for(const [a,b] of ROLE_REPLACE83)s=s.split(a).join(b);return s}
function translateNode83(root){
 if(!root)return;
 const apply=t=>{if(!t||!t.nodeValue)return;const p=t.parentElement;if(p&&['SCRIPT','STYLE'].includes(p.tagName))return;const n=translateString83(t.nodeValue);if(n!==t.nodeValue)t.nodeValue=n};
 if(root.nodeType===Node.TEXT_NODE){apply(root);return}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;return p&&['SCRIPT','STYLE'].includes(p.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
 let n;while((n=w.nextNode()))apply(n);
}
const roleObserver83=new MutationObserver(ms=>{
 for(const m of ms){
  if(m.type==='characterData')translateNode83(m.target);
  else for(const n of m.addedNodes)translateNode83(n);
 }
});
roleObserver83.observe(document.documentElement,{subtree:true,childList:true,characterData:true});

function businessDay83(){
 const shifted=new Date(Date.now()-5*60*60*1000);
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(shifted);
}
function orderedMembers83(){
 const mine=me?.memberId?M(String(me.memberId)):null;
 if(!mine)return S.members.slice();
 return [mine,...S.members.filter(m=>String(m.id)!==String(mine.id))];
}
function relation83(m){
 if(!m)return'';
 const b=businessDay83(),c=todayKst(),d=String(m.partnerDay||'');
 if(m.partnerId&&(d===b||(b!==c&&d===c))){
  const p=M(String(m.partnerId));
  if(p)return `파트너 ${String(p.name||m.partnerName||'').trim()}`.trim();
 }
 const inv=m.type==='guest'?String(m.inviter||'').trim():'';
 return inv?`초대 ${inv}`:'';
}
function decorateMembers83(){
 const box=$('members');if(!box)return;
 const members=orderedMembers83(),cards=[...box.querySelectorAll('.memberCard')];
 cards.forEach((card,i)=>{
  const m=members[i];if(!m)return;
  const info=card.querySelector('.memberInfo48')||card.children?.[1];if(!info)return;
  const main=info.querySelector('.memberMainLine45')||info.querySelector('.name');
  const meta=info.querySelector('.memberMeta71')||info.querySelector('.meta');
  if(meta)meta.querySelectorAll('.relationInfo66,.inviteInfo45').forEach(x=>x.remove());
  info.querySelectorAll('.memberRelation83').forEach(x=>x.remove());
  const rel=relation83(m);
  if(rel&&main){
   const row=document.createElement('div');row.className='memberRelation83';row.textContent=rel;
   main.insertAdjacentElement('afterend',row);
  }
 });
 translateNode83(box);
}
const renderMembers82=renderMembers;
renderMembers=function(){renderMembers82();decorateMembers83()};

const renderSettings82=renderSettings;
renderSettings=function(){
 renderSettings82();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v82'))el.textContent='콕매치 v83 · 역할명칭 정리 · 회원명부 관계정보 재배치 · 게임중 이름영역 확장';
 });
 translateNode83(box);
};

if(location.pathname.startsWith('/launch/v83'))history.replaceState(null,'','/?loaded=83');
translateNode83(document.documentElement);
if(me)renderAll();
})();
