(()=>{
const ATOMIC31_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-atomic-api';
const ATOMIC31_ACTIONS=new Set(['set_my_attendance','set_member_attendance','create_pending','remove_from_pending','cancel_pending','begin_game','finish_game','set_game_court','set_courts']);
const attendanceBusy31=new Set();
async function atomic31(action,body={}){
 const r=await fetch(ATOMIC31_API,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+T},body:JSON.stringify({action,groupId:currentGroupId,...body}),cache:'no-store'});
 const x=await r.json().catch(()=>({}));
 if(!r.ok){if(r.status===401){reloginLatest();throw new Error('로그인이 만료되었습니다.')}const e=new Error(x.error||'처리에 실패했습니다.');e.payload=x;throw e}
 return x;
}
const act30=act;
act=async function(action,body={},opts={}){
 if(!ATOMIC31_ACTIONS.has(action))return act30(action,body,opts);
 try{
  const x=await atomic31(action,body);
  if(x?.data){S=x.data;normalizeClient();renderAll()}
  return x;
 }catch(e){if(e?.payload?.warning==='repeat_pair'&&opts?.repeat){showRepeat(e.payload,opts.repeat);return null}throw e}
};
function snap31(m){return{state:m.state,joinedAt:m.joinedAt,queue:[...(S.queue||[])],draft:Array.isArray(draft)?[...draft]:[]}}
function restore31(id,s){const m=M(id);if(m){m.state=s.state;m.joinedAt=s.joinedAt}S.queue=[...s.queue];draft=[...s.draft];if(currentView==='members')renderMembers();try{renderHeader()}catch{}}
function local31(id,mode){const m=M(id);if(!m)return;S.queue=(S.queue||[]).filter(x=>String(x)!==String(id));if(Array.isArray(draft))draft=draft.map(x=>String(x)===String(id)?null:x);if(mode==='waiting'){if(!S.queue.some(x=>String(x)===String(id)))S.queue.push(id);m.state='waiting';m.joinedAt=Date.now()}else if(mode==='spectator'){m.state='spectator';m.joinedAt=null}else{m.state='out';m.joinedAt=null}}
setOther=async function(id,mode){const key=String(id);if(attendanceBusy31.has(key))return;const m=M(id);if(!m)return;const s=snap31(m);attendanceBusy31.add(key);local31(id,mode);if(currentView==='members')renderMembers();try{renderHeader()}catch{}
 try{const x=await atomic31('set_member_attendance',{memberId:id,mode});if(x?.data){S=x.data;normalizeClient();if(currentView==='members')renderMembers();try{renderHeader()}catch{}}}
 catch(e){restore31(id,s);showError(e)}finally{attendanceBusy31.delete(key)}};
const renderSettings30=renderSettings;renderSettings=function(){renderSettings30();const b=$('settings');if(!b)return;[...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v3.1 · 6인 운영진 동시조작 원자처리 · 상태 유실 방지'})};
})();
