(()=>{
const attendanceBusy30=new Set();
let memberRefreshRaf30=0;

function renderMembersFresh30(){
 cancelAnimationFrame(memberRefreshRaf30);
 memberRefreshRaf30=requestAnimationFrame(()=>{
  if(currentView!=='members')return;
  try{renderMembers();renderHeader()}catch(e){console.error('members refresh v3.0',e)}
 });
}

/* Re-entering Members must refresh the actual member buttons/status, not reuse stale DOM. */
const goView29=goView;
goView=function(id){
 const r=goView29(id);
 if(String(id)==='members')renderMembersFresh30();
 return r;
};

document.addEventListener('pointerdown',e=>{
 const btn=e.target.closest?.('#nav button[data-v="members"]');
 if(!btn)return;
 requestAnimationFrame(renderMembersFresh30);
},{capture:true,passive:true});

document.addEventListener('click',e=>{
 const btn=e.target.closest?.('#nav button[data-v="members"]');
 if(!btn)return;
 renderMembersFresh30();
},true);

function snapshotAttendance30(m){return {state:m.state,joinedAt:m.joinedAt,queue:[...(S.queue||[])],draft:Array.isArray(draft)?[...draft]:[]}}
function restoreAttendance30(id,snap){
 const m=M(id);if(m){m.state=snap.state;m.joinedAt=snap.joinedAt}
 S.queue=[...snap.queue];draft=[...snap.draft];
 if(currentView==='members')renderMembers();
 try{renderHeader()}catch{}
}
function applyAttendanceLocal30(id,mode){
 const m=M(id);if(!m)return;
 S.queue=(S.queue||[]).filter(x=>String(x)!==String(id));
 if(Array.isArray(draft))draft=draft.map(x=>String(x)===String(id)?null:x);
 if(mode==='waiting'){
  if(!S.queue.some(x=>String(x)===String(id)))S.queue.push(id);
  m.state='waiting';m.joinedAt=Date.now();
 }else if(mode==='spectator'){
  m.state='spectator';m.joinedAt=null;
 }else if(mode==='out'){
  m.state='out';m.joinedAt=null;
 }
}

/* Attendance buttons are optimistic and update only Members/Header instead of triggering renderAll(). */
setOther=async function(id,mode){
 const key=String(id);if(attendanceBusy30.has(key))return;
 const m=M(id);if(!m)return;
 const snap=snapshotAttendance30(m);attendanceBusy30.add(key);
 applyAttendanceLocal30(id,mode);
 if(currentView==='members')renderMembers();
 try{renderHeader()}catch{}
 try{
  const x=await request('action','POST',{action:'set_member_attendance',groupId:currentGroupId,memberId:id,mode});
  if(x?.data){S=x.data;normalizeClient();if(currentView==='members')renderMembers();try{renderHeader()}catch{}}
 }catch(e){restoreAttendance30(id,snap);showError(e)}
 finally{attendanceBusy30.delete(key)}
};

/* Make member attendance buttons feel responsive on mobile without interfering with scrolling. */
let tap30=null,suppressClick30={key:'',at:0};
function memberAction30(t){
 const b=t?.closest?.('#members .memberBtns button');if(!b)return null;
 const s=String(b.getAttribute('onclick')||'');const m=s.match(/setOther\(['\"]([^'\"]+)['\"],['\"](waiting|spectator|out)['\"]\)/);
 if(!m)return null;return{key:m[1]+':'+m[2],id:m[1],mode:m[2]};
}
document.addEventListener('pointerdown',e=>{
 const a=memberAction30(e.target);if(!a)return;
 tap30={pointerId:e.pointerId,key:a.key,id:a.id,mode:a.mode,x:e.clientX,y:e.clientY,moved:false};
},{capture:true,passive:true});
document.addEventListener('pointermove',e=>{
 if(!tap30||tap30.pointerId!==e.pointerId)return;
 if(Math.hypot(e.clientX-tap30.x,e.clientY-tap30.y)>8)tap30.moved=true;
},{capture:true,passive:true});
document.addEventListener('pointercancel',e=>{if(tap30?.pointerId===e.pointerId)tap30=null},{capture:true,passive:true});
document.addEventListener('pointerup',e=>{
 const a=tap30;if(!a||a.pointerId!==e.pointerId)return;tap30=null;
 if(a.moved||Math.hypot(e.clientX-a.x,e.clientY-a.y)>8)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 suppressClick30={key:a.key,at:performance.now()};setOther(a.id,a.mode);
},{capture:true,passive:false});
document.addEventListener('click',e=>{
 const a=memberAction30(e.target);if(!a)return;
 if(a.key===suppressClick30.key&&performance.now()-suppressClick30.at<900){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
},true);

const renderSettings29=renderSettings;
renderSettings=function(){
 renderSettings29();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v3.0 · 회원명부 재진입 즉시갱신 · 입장/관람/퇴장 즉시반응'});
};
})();
