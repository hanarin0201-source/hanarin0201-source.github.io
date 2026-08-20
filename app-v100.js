(()=>{
/* v100: keep developer authority independent from the visible badge. */
function isDeveloper100(){if(!me)return false;if(me.globalAdmin===true)return true;if(String(me.role||'')==='admin')return true;const mid=String(me.memberId||'');const mine=mid?M(mid):S?.members?.find?.(m=>String(m?.name||'').trim()===String(me?.displayName||'').trim());return !!mine&&roleOf(mine)==='admin'}
function restoreDeveloper100(){if(!me)return false;if(isDeveloper100()){me.globalAdmin=true;return true}try{if(typeof restoreDeveloper99==='function'&&restoreDeveloper99()){me.globalAdmin=true;return true}}catch{}return false}
const pGame100=canGame,pManage100=canManageMembers,pRoles100=canSetRoles,pReset100=canReset,pGroups100=canManageGroups;
canGame=function(){return restoreDeveloper100()||pGame100()};
canManageMembers=function(){return restoreDeveloper100()||pManage100()};
canSetRoles=function(){return restoreDeveloper100()||pRoles100()};
canReset=function(){return restoreDeveloper100()||pReset100()};
canManageGroups=function(){return restoreDeveloper100()||pGroups100()};

/* v100: action buttons repaint only the necessary screen instead of renderAll(). */
const VIEW_RENDER100={members:renderMembers,queue:renderQueue,playing:renderPlaying,stats:renderStats,settings:renderSettings,groups:typeof renderGroups==='function'?renderGroups:null};
const dirtyViews100=new Set();
function stableRender100(id,fn){
 const el=$(id);if(!el||typeof fn!=='function')return;
 const sc=document.scrollingElement||document.documentElement;
 const y=Math.max(0,Number(sc?.scrollTop||window.scrollY||0));
 const h=Math.ceil(el.getBoundingClientRect().height||0);
 const oldMin=el.style.minHeight;
 if(h>0)el.style.minHeight=h+'px';
 fn();
 if(sc)sc.scrollTop=y;
 requestAnimationFrame(()=>{if(sc)sc.scrollTop=y;el.style.minHeight=oldMin;});
}
function rawRenderView100(id){const fn=VIEW_RENDER100[id];if(typeof fn==='function')fn();dirtyViews100.delete(id)}
function renderVisible100(){const id=currentView,fn=VIEW_RENDER100[id];if(typeof fn==='function')stableRender100(id,fn);dirtyViews100.delete(id)}
function markOtherViews100(){['members','queue','playing','stats','settings','groups'].forEach(id=>{if(id!==currentView)dirtyViews100.add(id)})}
function smallHeaderRefresh100(){try{renderHeader();renderNav()}catch{}}

/* Direct local re-renders (draft select/remove, pending slot changes, court UI, settings UI) keep height and scroll. */
renderQueue=function(){stableRender100('queue',VIEW_RENDER100.queue)};
renderPlaying=function(){stableRender100('playing',VIEW_RENDER100.playing)};
renderStats=function(){stableRender100('stats',VIEW_RENDER100.stats)};
renderSettings=function(){stableRender100('settings',VIEW_RENDER100.settings)};
if(VIEW_RENDER100.groups)renderGroups=function(){stableRender100('groups',VIEW_RENDER100.groups)};

/* Bypass the legacy act()->renderAll() path that caused full-screen flashes. */
act=async function(action,body={},opts={}){
 try{
  const x=await request('action','POST',{action,groupId:currentGroupId,...body});
  if(x?.data){
   S=x.data;normalizeClient();restoreDeveloper100();
   smallHeaderRefresh100();
   renderVisible100();
   markOtherViews100();
  }
  return x;
 }catch(e){
  if(e?.payload?.warning==='repeat_pair'&&opts.repeat){showRepeat(e.payload,opts.repeat);return null}
  throw e;
 }
};

/* Render a changed destination while it is still hidden, then reveal it. */
const oldGoView100=goView;
goView=function(id){
 restoreDeveloper100();
 if(id!==currentView&&dirtyViews100.has(id))rawRenderView100(id);
 oldGoView100(id);
};

/* State reload keeps developer authority and does not add extra visible repaint. */
const oldLoadState100=loadState;
loadState=async function(){await oldLoadState100();restoreDeveloper100();markOtherViews100()};

const settingsStable100=renderSettings;
renderSettings=function(){settingsStable100();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v(?:99|100)/.test(e.textContent||''))e.textContent='콕매치 v100 · 기능버튼 무깜빡임 · 개발자 권한 유지'})};

if(location.pathname.startsWith('/launch/v100'))history.replaceState(null,'','/?loaded=100');
if(me){restoreDeveloper100();smallHeaderRefresh100();markOtherViews100()}
})();
