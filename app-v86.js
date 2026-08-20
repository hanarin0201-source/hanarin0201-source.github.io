(()=>{
function canSeeGlobal86(){
 const mode=String(S?.adminBadgeVisibility||'all');
 if(me?.globalAdmin)return true;
 if(mode==='all')return true;
 if(mode==='staff')return me?.role==='manager'||me?.role==='organizer';
 return false;
}
function mine86(m){
 if(!m)return false;
 if(me?.memberId&&String(m.id)===String(me.memberId))return true;
 return !me?.memberId&&String(m.name||'').trim()===String(me?.displayName||'').trim();
}
function rank86(m){
 if(mine86(m))return -100;
 if(m?.type==='guest')return 5;
 const r=roleOf(m);
 if(r==='admin')return canSeeGlobal86()?0:4;
 if(r==='manager')return 1;
 if(r==='organizer')return 2;
 if(isTemp(m))return 3;
 return 4;
}
function sortedMembers86(){
 return (S.members||[]).map((m,i)=>({m,i})).sort((a,b)=>rank86(a.m)-rank86(b.m)||a.i-b.i).map(x=>x.m);
}

/*
 v84/v85 sorted already-rendered member cards with appendChild().
 On some mobile browsers that produces an intermediate grid paint which remains
 until the next scroll/reflow. Render from the final member order first and
 suppress only those redundant card-moving appendChild calls.
*/
const renderMembers85=renderMembers;
renderMembers=function(){
 const box=$('members');
 if(box){box.classList.add('memberRenderLock86');box.classList.remove('memberRenderStable86')}
 const originalMembers=S.members;
 const finalMembers=sortedMembers86();
 const originalAppend=Node.prototype.appendChild;
 Node.prototype.appendChild=function(child){
  if(child&&child.nodeType===1&&child.classList?.contains('memberCard')&&child.parentNode===this)return child;
  return originalAppend.call(this,child);
 };
 S.members=finalMembers;
 try{
  renderMembers85();
  if(box){
   void box.offsetHeight;
   for(const card of box.querySelectorAll('.memberCard'))void card.offsetHeight;
  }
 }finally{
  S.members=originalMembers;
  Node.prototype.appendChild=originalAppend;
  if(box){box.classList.remove('memberRenderLock86');box.classList.add('memberRenderStable86')}
 }
};

const renderSettings85=renderSettings;
renderSettings=function(){
 renderSettings85();const box=$('settings');if(!box)return;
 [...box.querySelectorAll('.meta')].forEach(el=>{
  if((el.textContent||'').includes('콕매치 v85'))el.textContent='콕매치 v86 · 회원명부 초기렌더/새로고침 안정화';
 });
};

if(location.pathname.startsWith('/launch/v86'))history.replaceState(null,'','/?loaded=86');
if(me)renderAll();
document.documentElement.classList.add('kokmatch-ready86');
})();
